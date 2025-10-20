import uuid

# app/backend/tests/api/routes/test_posts.py
import pytest
from bson import ObjectId


@pytest.mark.asyncio
async def test_read_posts(async_client, test_db):
    await test_db["posts"].insert_many(
        [
            {
                "_id": ObjectId(),
                "id": str(uuid.uuid4()),
                "title": "A",
                "content": "foo",
                "like": 1,
                "avaliable": True,
            },
            {
                "_id": ObjectId(),
                "id": str(uuid.uuid4()),
                "title": "B",
                "content": "bar",
                "like": 0,
                "avaliable": True,
            },
        ]
    )

    response = await async_client.get("/posts")
    assert response.status_code == 200
    body = response.json()
    assert body["count"] == 2
    assert {item["title"] for item in body["data"]} == {"A", "B"}


@pytest.mark.asyncio
async def test_read_post(async_client, test_db):
    uid = str(uuid.uuid4())
    post = {
        "_id": ObjectId(),
        "id": uid,
        "title": "A",
        "content": "foo",
        "like": 1,
        "avaliable": True,
    }
    await test_db["posts"].insert_one(post)

    response = await async_client.get(f"/posts/{uid}")
    assert response.status_code == 200
    assert response.json()["title"] == "A"


@pytest.mark.asyncio
async def test_create_post(async_client, test_db):
    payload = {
        "title": "new",
        "content": "body",
        "like": 0,
        "avaliable": True,
    }
    resp = await async_client.post("/posts", json=payload)
    assert resp.status_code == 200  # 라우터에서 201 반환하도록 조정 필요
