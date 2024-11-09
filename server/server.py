import asyncio
import json
from fastapi import FastAPI, WebSocket


app = FastAPI()

import redis
redis_client = redis.Redis(host='localhost', port=6379, db=0)


async def get_redis_messages(pubsub):
    """Async generator that yields messages from Redis pubsub."""
    while True:
        message = await asyncio.to_thread(pubsub.get_message, ignore_subscribe_messages=True)
        if message:
            yield json.loads(message["data"].decode())
        await asyncio.sleep(0.1) 

@app.websocket("/ws/sensor")
async def websocket_endpoint(websocket: WebSocket):
    print("WTF?")
    await websocket.accept()  # Accept the WebSocket connection
    
    pubsub = redis_client.pubsub()
    pubsub.subscribe("items_channel")
    
    while True:
        try:
            async for data in get_redis_messages(pubsub):
                await websocket.send_json({"sensor_data": data})
        finally:
            # pubsub.close()
            pass

    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)