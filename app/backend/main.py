from pathlib import Path

from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.backend.api.main import api_router
from fastapi.middleware.cors import CORSMiddleware
from app.backend.config.database import database
from app.backend.config.redis import redis_client

# CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")
# CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS if origin.strip()]


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await redis_client.ping()
    except ConnectionError:
        # Redis가 없어도 서비스는 돌아가길 원한다면 pass,
        # 아니면 예외를 올려서 개발 초기에 문제를 인지하도록 처리
        pass

    await database["posts"].drop_index("posts_text_idx")
    await database["posts"].create_index(
        [("title", "text"), ("content", "text")],
        name="posts_text_idx",
    )
    yield

    await redis_client.close()


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
