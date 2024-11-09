from collections import deque
from itertools import islice

import numpy as np

MIN_VALUE = 3
MAX_VALUE = 100
PRESS_MAX = 70
PRESS_MIN = 10
BUTTON_PRESS_DISTANCE_DIFF = 25
SWIPE_MIN = 40
ACTION_MIN_DURATION = 20

# mutation variables
ACTION_IDX = 0
ACTIVE_ACTION = None

max_size = 5
# NOTE: deque is somewhat thread safe
BUFFER_LEFT = deque(maxlen=3)    
BUFFER_RIGHT = deque(maxlen=3)

CLEAN_BUFFER_LEFT = deque(maxlen=max_size)
CLEAN_BUFFER_RIGHT = deque(maxlen=max_size)

for i in range(max_size):
    BUFFER_LEFT.append(3)
    BUFFER_RIGHT.append(3)

    CLEAN_BUFFER_LEFT.append(3)
    CLEAN_BUFFER_RIGHT.append(3)

def detect_single_high_value(dq, threshold=2):
    if dq[1] > threshold * dq[0] and dq[1] > threshold * dq[2]:
        return True

    return False

def append_clean_buffer(clean_buffer, buffer):
    is_high = detect_single_high_value(buffer)
    if is_high:
        value = clean_buffer[-1]
    else:
        value = buffer[1]
    clean_buffer.append(value)

def is_fully_pressed(value):
    return value < PRESS_MAX and value > PRESS_MIN

def is_double_press(left_buffer, right_buffer):
    left_avg = np.mean(left_buffer)
    right_avg = np.mean(right_buffer)

    if is_fully_pressed(left_avg) and is_fully_pressed(right_avg) and abs(left_avg - right_avg) < BUTTON_PRESS_DISTANCE_DIFF:
        return True
    else:
        return False
    
def is_double_press_active(left_buffer, right_buffer):
    left_avg = np.mean(left_buffer)
    right_avg = np.mean(right_buffer)

    if left_avg < PRESS_MIN or right_avg < PRESS_MIN:
        # one of the buttons is not pressed
        return False

    # both buttons are being pressed
    if left_avg < MAX_VALUE and right_avg < MAX_VALUE and abs(left_avg - right_avg) < BUTTON_PRESS_DISTANCE_DIFF:
        return True
    return False


def is_swipe_active(first_buffer, last_buffer):
    first_avg = np.mean(list(islice(first_buffer, 0, 3)))
    last_avg = np.mean(list(islice(last_buffer, len(last_buffer) - 3, len(last_buffer))))

    if first_avg > SWIPE_MIN and last_avg < SWIPE_MIN:
        return True
    return False

def get_active_action(left_buffer, right_buffer):
    action = None
    if is_swipe_active(left_buffer, right_buffer):
        action = "left_swipe"
    if is_swipe_active(right_buffer, left_buffer):
        action = "right_swipe"
    if is_double_press_active(left_buffer, right_buffer):
        action = "double_press_active"
    if is_double_press(left_buffer, right_buffer):
        action = "double_press_confirmed"
    return action


def process_event(raw_left, raw_right, index):
    """
    - read current event
    - append it to short buffer
    - check if prev value from short buffer was not noise
    - append prev value to long buffer if not noise

    """
    global ACTION_IDX, ACTIVE_ACTION

    # append monitoring buffers
    BUFFER_LEFT.append(raw_left)
    BUFFER_RIGHT.append(raw_right)

    append_clean_buffer(CLEAN_BUFFER_LEFT, BUFFER_LEFT)
    append_clean_buffer(CLEAN_BUFFER_RIGHT, BUFFER_RIGHT)

    action = get_active_action(CLEAN_BUFFER_LEFT, CLEAN_BUFFER_RIGHT)

    last_action_idx_diff = index - ACTION_IDX
    if not ACTIVE_ACTION and action:
        ACTIVE_ACTION = action
        ACTION_IDX = index
    elif ACTIVE_ACTION and action != ACTIVE_ACTION and last_action_idx_diff > ACTION_MIN_DURATION:
        ACTIVE_ACTION = action
        if action:
            ACTION_IDX = index

    return {"left": CLEAN_BUFFER_LEFT[-1], "right": CLEAN_BUFFER_RIGHT[-1], "index": index, "action": ACTIVE_ACTION}
    

