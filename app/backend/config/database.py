from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb://127.0.0.1:27017"
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.mytable
