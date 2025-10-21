from datetime import datetime
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException

from ... import models
from ..deps import DbDep, CurrentUserDep

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
    avatarHue = author.get("avatarHue")

    if not author_id or not nickname:
        raise HTTPException(status_code=500, detail="Post author is malformed")

    data["author"] = {
        "id": str(author_id),
        "email": email,
        "nickname": nickname,
        "avatarHue": avatarHue,
    }

    return models.PostPublic(**data)


def to_comment_public(doc: dict) -> models.CommentPublic:
    author = models.PublicUser(**doc["author"])
    return models.CommentPublic(**{**doc, "author": author})


async def build_post_detail(db: DbDep, post_doc: dict[str, Any]) -> models.PostDetail:
    base = serialize_post(post_doc)
    cursor = db["comments"].find({"post_id": str(base.id)}).sort("created_at", 1)
    comments_docs = await cursor.to_list()
    parsed = [to_comment_public(c) for c in comments_docs]
    return models.PostDetail(**base.model_dump(), comments=parsed)


@router.get("", response_model=models.PostsPublic)
async def read_posts(db: DbDep, skip: int = 0, limit: int = 20):
    cursor = db["posts"].find().sort("created_at", -1).skip(skip)
    if limit:
        cursor = cursor.limit(limit)
    posts = await cursor.to_list(length=limit or 0)
    data = [serialize_post(post) for post in posts]
    return models.PostsPublic(data=data, count=len(data))


@router.get("/{post_id}", response_model=models.PostDetail)
async def read_post(db: DbDep, post_id: str):
    post = await db["posts"].find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return await build_post_detail(db, post)


@router.post("", response_model=models.PostPublic)
async def create_post(
    db: DbDep,
    item: models.PostCreate,
    user: CurrentUserDep,
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
            "avatarHue": user.avatarHue,
        },
    }
    await db["posts"].insert_one(document)
    return serialize_post(document)


@router.get("/{post_id}/comments", response_model=models.CommentsPublic)
async def get_comments(db: DbDep, post_id: str):
    post = await db["posts"].find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    cursor = db["comments"].find({"post_id": post_id}).sort("created_at", 1)
    documents = await cursor.to_list(length=0)
    comments = [to_comment_public(doc) for doc in documents]

    return models.CommentsPublic(count=len(comments), data=comments)


@router.post("/{post_id}/comments", response_model=models.CommentPublic)
async def create_comment(
    db: DbDep, user: CurrentUserDep, post_id: str, payload: models.CommentCreate
):
    post = await db["posts"].find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    data = payload.model_dump()
    now = datetime.utcnow()
    comment_id = str(uuid.uuid4())
    document = {
        **data,
        "id": comment_id,
        "post_id": post_id,
        "author": user.model_dump(mode="json"),
        "created_at": now,
    }
    await db["comments"].insert_one(document)
    return to_comment_public(document)
