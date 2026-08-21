import asyncio
from app.database import verify_connection

async def main():
    try:
        await verify_connection()
        print("MongoDB connection successful")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
