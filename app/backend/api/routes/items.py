from fastapi import HTTPException, Header, APIRouter
from app.backend.config.database import database

from ...models import ItemCreate, ItemsPublic, ItemPublic, ItemUpdate

router = APIRouter(prefix="/items", tags=["items"])


@router.get("", response_model=ItemsPublic)
async def read_items(limit: int = 10):
    items = await database["items"].find().to_list(limit)
    for item in items:
        item["_id"] = str(item["_id"])
    return ItemsPublic(data=items, count=len(items))


@router.get("/{item_id}", response_model=ItemPublic)
async def read_item(item_id: str):
    item = await database["items"].find_one({"id": item_id})
    if item:
        item["_id"] = str(item["_id"])
        return item
    raise HTTPException(status_code=404, detail="Not found Item")


@router.post("")
async def creaet_item(item: ItemCreate):
    dump = item.model_dump()
    result = await database["items"].insert_one(dump)
    dump["_id"] = str(result.inserted_id)
    return dump


@router.put("/{item_id}")
async def update_item(item_id: str, item: ItemUpdate):
    result = await database["items"].update_one(
        {"id": item_id}, {"$set": item.model_dump()}
    )

    if result.modified_count == 1:
        updated = await database["items"].find_one({"id": item_id})
        updated["_id"] = str(updated["_id"])
        return updated
    raise HTTPException(status_code=404, detail="Not fount Item")


@router.delete("/{item_id}")
async def delete_item(item_id: str):
    result = await database["items"].delete_one({"id": item_id})
    if result.deleted_count == 1:
        return {"message": "delete successfuly"}
    raise HTTPException(status_code=404, detail="Not fount Item")


# fake_secret_token = "coneofsilence"

# fake_db = {
#     "foo": {"id": "foo", "title": "Foo", "description": "There goes my hero"},
#     "bar": {"id": "bar", "title": "Bar", "description": "The bartenders"},
# }


# @router.get("/{item_id}", response_model=Item)
# async def read_main(item_id: str, x_token: Annotated[str, Header()]):
#     if x_token != fake_secret_token:
#         raise HTTPException(status_code=400, detail="Invalid X-Token header")
#     if item_id not in fake_db:
#         raise HTTPException(status_code=404, detail="Item not found")
#     return fake_db[item_id]


# @router.post("/", response_model=Item)
# async def create_item(item: Item, x_token: Annotated[str, Header()]):
#     if x_token != fake_secret_token:
#         raise HTTPException(status_code=400, detail="Invalid X-Token header")
#     if item.id in fake_db:
#         raise HTTPException(status_code=409, detail="Item already exists")
#     fake_db[item.id] = item
#     return item
