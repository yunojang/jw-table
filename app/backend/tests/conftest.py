import pytest_asyncio
import httpx
from motor.motor_asyncio import AsyncIOMotorClient

from app.backend.main import app
from app.backend.config.database import MONGO_DETAILS


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
