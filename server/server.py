import asyncio
from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI, WebSocket
import random
import json
from functools import partial

from app.signal_algos import process_event
app = FastAPI()

# Load the sensor data from the JSON file
# with open("sample-right-to-left.json", "r") as f:
with open("sample-long-press.json", "r") as f:
# with open("sample-left-to-right.json", "r") as f:
    sensor_data_list = json.load(f)

# Simulate reading sensor data asynchronously
async def read_sensor_data():
    """
    Async might be done way wrong...
    """
    
    index = 0  # Index to keep track of current position in the list

    while True:
        # Restart from beginning once the end is reached
        if index >= len(sensor_data_list):
            index = 0

        # Retrieve the current sensor data values
        l, r, hm = sensor_data_list[index]
        index += 1

        loop = asyncio.get_running_loop()
        with ThreadPoolExecutor() as pool:
            moving_average_partial = partial(process_event, l, r, hm, index)
            _data = await loop.run_in_executor(pool, moving_average_partial)
        
        yield _data

        # Small delay to simulate reading interval
        await asyncio.sleep(0.2)

@app.websocket("/ws/sensor")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    with open("results.log", "w") as f:
        async for data in read_sensor_data():
            f.write(f"{data}\n")
            f.flush()
            await websocket.send_json({"sensor_data": data})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)