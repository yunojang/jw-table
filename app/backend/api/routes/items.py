from fastapi import HTTPException, Header, APIRouter

from typing import Annotated
from pydantic import BaseModel

fake_secret_token = "coneofsilence"

fake_db = {
    "foo": {"id": "foo", "title": "Foo", "description": "There goes my hero"},
    "bar": {"id": "bar", "title": "Bar", "description": "The bartenders"},
}

router = APIRouter(prefix="/items", tags=["items"])


# def api_guard(request: Request):
#     pass
# token = request.headers.get("X-API-Key")
# if token != "secret":
#     raise HTTPException(status_code=401, detail="Unauthorized")


# api = APIRouter(prefix="/api", dependencies=[Depends(api_guard)])


class Item(BaseModel):
    id: str
    title: str
    description: str | None = None


@router.get("/{item_id}", response_model=Item)
async def read_main(item_id: str, x_token: Annotated[str, Header()]):
    if x_token != fake_secret_token:
        raise HTTPException(status_code=400, detail="Invalid X-Token header")
    if item_id not in fake_db:
        raise HTTPException(status_code=404, detail="Item not found")
    return fake_db[item_id]


@router.post("/", response_model=Item)
async def create_item(item: Item, x_token: Annotated[str, Header()]):
    if x_token != fake_secret_token:
        raise HTTPException(status_code=400, detail="Invalid X-Token header")
    if item.id in fake_db:
        raise HTTPException(status_code=409, detail="Item already exists")
    fake_db[item.id] = item
    return item
