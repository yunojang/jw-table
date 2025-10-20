import uuid
from fastapi import APIRouter, HTTPException

from ... import models
from ..deps import DbDep

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.get("", response_model=models.PostsPublic)
async def read_posts(db: DbDep, c: int = 0, limit: int = 20):
    posts = await db["posts"].find().to_list(limit)
    for post in posts:
        post["_id"] = str(post["_id"])
    return models.PostsPublic(data=posts, count=len(posts))


@router.get("/{post_id}", response_model=models.PostPublic)
async def read_post(db: DbDep, post_id: str):
    post = await db["posts"].find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Not found post")

    post["_id"] = str(post["_id"])
    return post


@router.post("", response_model=models.PostPublic)
async def create_post(db: DbDep, item: models.PostCreate):
    data = item.model_dump()
    data["id"] = str(uuid.uuid4())
    result = await db["posts"].insert_one(data)
    data["_id"] = str(result.inserted_id)
    return data


@router.put("/{item_id}")
async def update_item(db: DbDep, item_id: str, item: models.PostPublic):
    result = await db["posts"].update_one({"id": item_id}, {"$set": item.model_dump()})

    if result.modified_count != 1:
        raise HTTPException(status_code=404, detail="Not fount Item")

    updated = await db["posts"].find_one({"id": item_id})
    updated["_id"] = str(updated["_id"])
    return updated
