from fastapi.testclient import TestClient
from app.backend.main import app

client = TestClient(app)


def test_read():
    response = client.get("/items/foo", headers={"X-Token": "coneofsilence"})
    assert response.status_code == 200
    assert response.json()["id"] == "foo"


def test_read_item_bad_token():
    response = client.get("/items/foo", headers={"X-Token": "fail"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid X-Token header"}


def test_read_nonexistent_item():
    response = client.get("/items/bizzz", headers={"X-Token": "coneofsilence"})
    assert response.status_code == 404
    assert response.json() == {"detail": "Item not found"}


def test_create_item():
    response = client.post(
        "/items",
        headers={"X-Token": "coneofsilence"},
        json={"id": "foobar", "title": "Foo Bar", "description": "hihi"},
    )
    assert response.status_code == 200
    assert response.json() == {
        "id": "foobar",
        "title": "Foo Bar",
        "description": "hihi",
    }


def test_create_existing_item():
    response = client.post(
        "/items",
        headers={"X-Token": "coneofsilence"},
        json={"id": "foo", "title": "dup!", "description": "dup"},
    )
    assert response.status_code == 409
    assert response.json() == {"detail": "Item already exists"}
