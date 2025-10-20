from fastapi import APIRouter

from app.backend.api.routes import items, posts, login, users

api_router = APIRouter()
api_router.include_router(items.router)
api_router.include_router(posts.router)
api_router.include_router(login.router)
api_router.include_router(users.router)
