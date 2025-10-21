from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from typing import Annotated
from pydantic import BaseModel

from app.backend.api.main import api_router
from fastapi.middleware.cors import CORSMiddleware
import os

# CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")
# CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS if origin.strip()]

app = FastAPI()

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
