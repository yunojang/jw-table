import uuid
from fastapi import APIRouter
from app.backend.core import security

from ..deps import DbDep
from ... import models

router = APIRouter(prefix="/users", tags=["users"])


@router.post("")
async def create_user(db: DbDep, user: models.UserCreate):
    data = user.model_dump()
    data["hashed_password"] = security.get_password_hash(data["password"])
    data["id"] = str(uuid.uuid4())
    data.pop("password")
    result = await db["users"].insert_one(data)
    data["_id"] = str(result.inserted_id)
    return data
