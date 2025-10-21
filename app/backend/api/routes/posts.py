from datetime import datetime
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException

from ... import models
from ..deps import DbDep, UserDep

router = APIRouter(prefix="/posts", tags=["posts"])


def serialize_post(doc: dict[str, Any]) -> models.PostPublic:
    data = doc.copy()
    data.pop("_id", None)
    content = data.get("content") or ""
    data.setdefault("excerpt", content[:140])
    data.setdefault("likes", 0)

    author = data.get("author")
    if not isinstance(author, dict):
        raise HTTPException(status_code=500, detail="Post author is missing")

    author_id = author.get("id")
    nickname = author.get("nickname")
    email = author.get("email")

    if not author_id or not nickname:
        raise HTTPException(status_code=500, detail="Post author is malformed")

    data["author"] = {
        "id": str(author_id),
        "email": email,
        "nickname": nickname,
    }

    return models.PostPublic(**data)


@router.get("", response_model=models.PostsPublic)
async def read_posts(db: DbDep, skip: int = 0, limit: int = 20):
    cursor = db["posts"].find().sort("created_at", -1).skip(skip)
    if limit:
        cursor = cursor.limit(limit)
    posts = await cursor.to_list(length=limit or 0)
    data = [serialize_post(post) for post in posts]
    return models.PostsPublic(data=data, count=len(data))


@router.get("/{post_id}", response_model=models.PostPublic)
async def read_post(db: DbDep, post_id: str):
    post = await db["posts"].find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return serialize_post(post)


@router.post("", response_model=models.PostPublic)
async def create_post(
    db: DbDep,
    item: models.PostCreate,
    user: UserDep,
):
    now = datetime.now()
    post_id = str(uuid.uuid4())
    payload = item.model_dump()
    content = payload.get("content") or ""
    if not payload.get("excerpt"):
        payload["excerpt"] = content[:140]
    document = {
        **payload,
        "id": post_id,
        "likes": 0,
        "created_at": now,
        "author": {
            "id": str(user.id),
            "email": user.email,
            "nickname": user.nickname,
        },
    }
    await db["posts"].insert_one(document)
    return serialize_post(document)
