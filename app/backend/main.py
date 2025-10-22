from pathlib import Path

from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.backend.api.main import api_router
from fastapi.middleware.cors import CORSMiddleware
import os
from app.backend.config.database import database

# CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")
# CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS if origin.strip()]


@asynccontextmanager
async def lifespan(app: FastAPI):
    await database["posts"].drop_index("posts_text_idx")
    await database["posts"].create_index(
        [("title", "text"), ("content", "text")],
        name="posts_text_idx",
    )
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 기본값
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router)

# DIST_DIR = Path(__file__).parent.parent / "frontend" / "dist"
# app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="spa")

# @app.get("/{full_path:path}")
# def spa_fallback(full_path: str):
#     return FileResponse(DIST_DIR / "index.html")
