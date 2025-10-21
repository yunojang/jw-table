import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


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
    excerpt: str | None = None
    tags: list[str] = Field(default_factory=list)


class PostCreate(PostBase):
    pass


class PostPublic(PostBase):
    id: uuid.UUID
    likes: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    author: "PublicUser"
    excerpt: str


class PostsPublic(BaseModel):
    data: list[PostPublic]
    count: int


# Auth...
class LoginCredentials(BaseModel):
    email: EmailStr
    password: str
