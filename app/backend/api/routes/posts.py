import uuid
import asyncio
from datetime import datetime
from typing import Any

from fastapi import APIRouter, HTTPException

from ... import models
from ..deps import DbDep, CurrentUserDep, PostDep, OptionalUserDep

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


async def build_post_detail(
    db: DbDep, post_doc: dict[str, Any], user: CurrentUserDep | None
) -> models.PostDetail:
    base = serialize_post(post_doc)
    cursor = db["comments"].find({"post_id": str(base.id)}).sort("created_at", 1)
    comments_docs = await cursor.to_list()

    liked = False
    if user:
        record = await db["post_likes"].find_one(
            {"post_id": post_doc["id"], "user_id": str(user.id)}
        )
        liked = record is not None

    parsed = [to_comment_public(c) for c in comments_docs]
    return models.PostDetail(**base.model_dump(), comments=parsed, liked=liked)


@router.get("", response_model=models.PostsPublic)
async def read_posts(db: DbDep, offset: int = 0, limit: int = 20, q: str = ""):
    total = await db["posts"].count_documents({})
    filter_query: dict[str, Any] = {}
    sort_stage = [("created_at", -1)]

    if q:
        filter_query = {
            # "$or": [
            #     {"title": {"$regex": q, "$options": "i"}},
            #     {"content": {"$regex": q, "$options": "i"}},
            # ]
            "$text": {"$search": q}
        }
        sort_stage = [("score", {"$meta": "textScore"}), ("created_at", -1)]

    cursor = db["posts"].find(filter_query).sort(sort_stage).skip(offset)
    if limit:
        cursor = cursor.limit(limit)
    posts = await cursor.to_list(length=limit or 0)
    data = [serialize_post(post) for post in posts]
    return models.PostsPublic(data=data, count=total)


@router.get("/{post_id}", response_model=models.PostDetail)
async def read_post(db: DbDep, post: PostDep, user: OptionalUserDep):
    return await build_post_detail(db, post, user)


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


# Likes
@router.post("/{post_id}/like", response_model=models.LikeToggleResult)
async def like_post(db: DbDep, user: CurrentUserDep, post: PostDep):
    client = db.client

    await asyncio.sleep(0.5)
    # raise HTTPException(status_code=500, detail="error test")

    async with await client.start_session() as session:
        async with session.start_transaction():
            like_filter = {"post_id": post["id"], "user_id": str(user.id)}

            existing = await db["post_likes"].find_one(like_filter, session=session)
            if existing:
                await db["post_likes"].delete_one(like_filter, session=session)
                await db["posts"].update_one(
                    {"id": post["id"]},
                    {"$inc": {"likes": -1}},
                    session=session,
                )
                liked = False
            else:
                doc = {
                    **like_filter,
                    "created_at": datetime.now(),
                }
                await db["post_likes"].insert_one(doc, session=session)
                await db["posts"].update_one(
                    {"id": post["id"]},
                    {"$inc": {"likes": 1}},
                    session=session,
                )
                liked = True

    updated_post = await db["posts"].find_one({"id": post["id"]})
    if not updated_post:
        raise HTTPException(status_code=500, detail="Failed to fetch updated post")

    return models.LikeToggleResult(
        liked=liked, likes=updated_post["likes"], updated=updated_post
    )


# Comments api
@router.get("/{post_id}/comments", response_model=models.CommentsPublic)
async def read_comments(db: DbDep, post: PostDep):
    cursor = db["comments"].find({"post_id": post["id"]}).sort("created_at", 1)
    documents = await cursor.to_list(length=0)
    comments = [to_comment_public(doc) for doc in documents]

    return models.CommentsPublic(count=len(comments), data=comments)


@router.post("/{post_id}/comments", response_model=models.CommentPublic)
async def create_comment(
    db: DbDep, user: CurrentUserDep, post: PostDep, payload: models.CommentCreate
):
    data = payload.model_dump()
    now = datetime.now()
    comment_id = str(uuid.uuid4())
    document = {
        **data,
        "id": comment_id,
        "post_id": post["id"],
        "author": user.model_dump(mode="json"),
        "created_at": now,
    }
    await db["comments"].insert_one(document)
    return to_comment_public(document)
