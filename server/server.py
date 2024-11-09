import serial
import time
from serial.tools.list_ports import comports
import asyncio
from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, status
import random
import json
from functools import partial

from app.signal_algos import process_event
app = FastAPI()

# UPDATE BASED ON `ls /dev | grep "tty.usb"``
s = serial.Serial("/dev/tty.usbmodem21101")


# Simulate reading sensor data asynchronously
async def read_sensor_data():
    """
    Async might be done way wrong...
    """
    
    index = 0  # Index to keep track of current position in the list

    while True:        
        loop = asyncio.get_running_loop()
        with ThreadPoolExecutor() as pool:
            l, r, hm =list(map(int, s.readline().strip().split(b",")))
            index += 1
                
            moving_average_partial = partial(process_event, l, r, hm, index)
            _data = await loop.run_in_executor(pool, moving_average_partial)
        yield _data

@app.websocket("/ws/sensor")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        async for data in read_sensor_data():
            await websocket.send_json({"sensor_data": data})
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.close(code=status.WS_1011_INTERNAL_ERROR)
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)