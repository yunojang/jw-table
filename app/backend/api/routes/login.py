from datetime import timedelta
from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import JSONResponse
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
    token = security.create_access_token(user["id"], expires_delta=access_token_expires)

    response = JSONResponse(
        content={
            "access_token": token,
            "token_type": "bearer",
        }
    )
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite=None,
        max_age=int(access_token_expires.total_seconds()),
    )

    return response


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"ok": True}
