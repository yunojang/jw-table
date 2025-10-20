import pytest_asyncio
import httpx
from motor.motor_asyncio import AsyncIOMotorClient

from app.backend.main import app
from app.backend.config.database import MONGO_DETAILS
from app.backend.api.deps import get_db


@pytest_asyncio.fixture
async def test_db():
    client = AsyncIOMotorClient(MONGO_DETAILS)
    db = client["mytable_test"]

    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    await db.drop_collection("items")
    await db.drop_collection("posts")
    try:
        yield db
    finally:
        await db.drop_collection("items")
        await db.drop_collection("posts")
        app.dependency_overrides.pop(get_db, None)
        client.close()


@pytest_asyncio.fixture
async def mongo_db(monkeypatch):
    """Provide a per-test Motor client tied to the active event loop."""
    client = AsyncIOMotorClient(MONGO_DETAILS)
    db = client.mytable

    from app.backend.api.routes import items as items_module

    monkeypatch.setattr(items_module, "database", db)
    await db["items"].delete_many({})
    yield db
    await db["items"].delete_many({})
    client.close()


@pytest_asyncio.fixture
async def async_client():
    """Return an HTTPX async client bound to the FastAPI app."""
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(
        transport=transport, base_url="http://testserver"
    ) as client:
        yield client


@pytest_asyncio.fixture
async def seeded_item(mongo_db):
    item = {
        "id": "test-item",
        "title": "Test Item",
        "description": "for API test",
        "avaliable": True,
    }
    await mongo_db["items"].delete_many({"id": item["id"]})
    await mongo_db["items"].insert_one(item)
    yield item
    await mongo_db["items"].delete_many({"id": item["id"]})
