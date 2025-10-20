from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Annotated, AsyncGenerator
from fastapi import Depends

from app.backend.config.database import database


async def get_db() -> AsyncGenerator[AsyncIOMotorDatabase]:
    yield database


DbDep = Annotated[AsyncIOMotorDatabase, Depends(get_db)]
