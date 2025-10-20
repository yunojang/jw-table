import uuid
import pytest


@pytest.mark.asyncio
async def test_read_items(async_client, seeded_item):
    response = await async_client.get("/items")
    assert response.status_code == 200
    assert response.json()["count"] >= 1


@pytest.mark.asyncio
async def test_read_item(async_client, seeded_item):
    response = await async_client.get(f"/items/{seeded_item['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == seeded_item["id"]
    assert data["title"] == seeded_item["title"]


@pytest.mark.asyncio
async def test_read_item_bad_id(async_client):
    response = await async_client.get(f"/items/{uuid.uuid4()}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Not found Item"}


# def test_read():
#     response = client.get("/items/foo", headers={"X-Token": "coneofsilence"})
#     assert response.status_code == 200
#     assert response.json()["id"] == "foo"


# def test_read_item_bad_token():
#     response = client.get("/items/foo", headers={"X-Token": "fail"})
#     assert response.status_code == 400
#     assert response.json() == {"detail": "Invalid X-Token header"}


# def test_read_nonexistent_item():
#     response = client.get("/items/bizzz", headers={"X-Token": "coneofsilence"})
#     assert response.status_code == 404
#     assert response.json() == {"detail": "Item not found"}


# def test_create_item():
#     response = client.post(
#         "/items",
#         headers={"X-Token": "coneofsilence"},
#         json={"id": "foobar", "title": "Foo Bar", "description": "hihi"},
#     )
#     assert response.status_code == 200
#     assert response.json() == {
#         "id": "foobar",
#         "title": "Foo Bar",
#         "description": "hihi",
#     }


# def test_create_existing_item():
#     response = client.post(
#         "/items",
#         headers={"X-Token": "coneofsilence"},
#         json={"id": "foo", "title": "dup!", "description": "dup"},
#     )
#     assert response.status_code == 409
#     assert response.json() == {"detail": "Item already exists"}
