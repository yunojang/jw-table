import uuid
from pydantic import BaseModel, EmailStr


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


class PostBase(BaseModel):
    title: str
    content: str | None = None
    like: int
    avaliable: bool = True


class PostPublic(ItemBase):
    id: uuid.UUID
    # own_id: uuid.UUID


class PostsPublic(BaseModel):
    data: list[PostPublic]
    count: int


class PostCreate(PostBase):
    pass


# Auth...
class LoginCredentials(BaseModel):
    email: EmailStr
    password: str


# JSON payload containing access toklen
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserBase(BaseModel):
    email: EmailStr
    nickname: str


class PublicUser(UserBase):
    id: uuid.UUID


class UserCreate(UserBase):
    password: str
