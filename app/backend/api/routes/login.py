from datetime import timedelta
from fastapi import APIRouter, HTTPException
from app.backend.core import security
from app.backend.config import settings

from ... import models
from ..deps import DbDep


router = APIRouter(prefix="/login", tags=["login"])


@router.post("/access-token")
async def login_access_token(db: DbDep, credentials: models.LoginCredentials):
    user = await db["users"].find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not security.verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return models.Token(
        access_token=security.create_access_token(
            user["id"], expires_delta=access_token_expires
        )
    )
