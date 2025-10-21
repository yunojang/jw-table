from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Annotated, AsyncGenerator
from fastapi import Depends
from fastapi import Request, HTTPException
from .. import models
from app.backend.core import security

from app.backend.config.database import database


async def get_db() -> AsyncGenerator[AsyncIOMotorDatabase]:
    yield database


DbDep = Annotated[AsyncIOMotorDatabase, Depends(get_db)]


async def get_token_from_cookie(request: Request) -> str:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return token


TokenDep = Annotated[str, Depends(get_token_from_cookie)]


async def get_current_user(
    db: DbDep,
    token: TokenDep,
) -> models.PublicUser:
    payload = security.decode_access_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = await db["users"].find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return models.PublicUser(
        id=user["id"],
        email=user["email"],
        nickname=user["nickname"],
        avatarHue=user["avatarHue"],
    )


UserDep = Annotated[models.PublicUser, Depends(get_current_user)]
