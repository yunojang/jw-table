from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from typing import Annotated
from pydantic import BaseModel

from api.main import api_router

app = FastAPI()

app.include_router(api_router)

# DIST_DIR = Path(__file__).parent.parent / "frontend" / "dist"
# app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="spa")

# @app.get("/{full_path:path}")
# def spa_fallback(full_path: str):
#     return FileResponse(DIST_DIR / "index.html")
