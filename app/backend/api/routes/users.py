import uuid
from fastapi import APIRouter, HTTPException, Cookie
from app.backend.core import security

from ..deps import DbDep, UserDep
from ... import models

router = APIRouter(prefix="/users", tags=["users"])


@router.post("")
async def create_user(db: DbDep, user: models.UserCreate):
    existing = await db["users"].find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    data = user.model_dump()
    data["hashed_password"] = security.get_password_hash(data["password"])
    data["id"] = str(uuid.uuid4())
    data.pop("password")
    result = await db["users"].insert_one(data)
    data["_id"] = str(result.inserted_id)
    return data


@router.get("/me", response_model=models.PublicUser)
async def get_me_profile(user: UserDep):
    return user
