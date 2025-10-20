import uuid
from pydantic import BaseModel


class ItemBase(BaseModel):
    title: str
    description: str | None = None
    avaliable: bool = True


class ItemPublic(ItemBase):
    # id: uuid.UUID
    id: str
    # owner_id: uuid.UUID


class ItemUpdate(ItemBase):
    pass


class ItemCreate(ItemPublic):
    pass


class ItemsPublic(BaseModel):
    data: list[ItemPublic]
    count: int
