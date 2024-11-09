import time
import json
import redis

# Connect to Redis
redis_client = redis.Redis(host='localhost', port=6379, db=0)

from app.signal_algos import process_event

# Load the sensor data from the JSON file
with open("sample.json", "r") as f:
    SENSOR_DATA_LIST = json.load(f)

# Simulate reading sensor data asynchronously
def read_sensor_output():    
    index = 0  # Index to keep track of current position in the list
    print("Starting to process...")
    while True:
        # Restart from beginning once the end is reached
        if index >= len(SENSOR_DATA_LIST):
            index = 0

        # Retrieve the current sensor data values
        l, r = SENSOR_DATA_LIST[index]
        index += 1

        data = process_event(l, r, index)
        
        redis_client.publish('items_channel', json.dumps(data))
        # Small delay to simulate reading interval
        time.sleep(0.1)

if __name__ == "__main__":
    redis_client.delete("items_channel")
    read_sensor_output()