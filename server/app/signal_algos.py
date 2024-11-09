"""
No thread safety here...
"""

from collections import deque
from itertools import islice

import numpy as np

MIN_VALUE = 0
MAX_VALUE = 70

BUTTON_PRESS_MAX = 30
BUTTON_PRESSED_MIN = 10

BUTTON_PRESS_DISTANCE_DIFF = 15
SWIPE_MIN = 40
ACTION_MIN_DURATION = 20

# mutation variables
ACTION_IDX = 0
ACTIVE_ACTION = None

max_size = 3
# NOTE: deque is somewhat thread safe
BUFFER_LEFT = deque(maxlen=3)    
BUFFER_RIGHT = deque(maxlen=3)

CLEAN_BUFFER_LEFT = deque(maxlen=max_size)
CLEAN_BUFFER_RIGHT = deque(maxlen=max_size)

BUFFER_DIFF = deque(maxlen=max_size)
CLEAN_DIFF_BUFFER = deque(maxlen=max_size)

# go over
for i in range(10):
    BUFFER_LEFT.append(0)
    BUFFER_RIGHT.append(0)

    CLEAN_BUFFER_LEFT.append(0)
    CLEAN_BUFFER_RIGHT.append(0)

    BUFFER_DIFF.append(0)
    CLEAN_DIFF_BUFFER.append(0)

def detect_anomaly_event(dq, threshold=2):
    if dq[1] > threshold * dq[0] and dq[1] > threshold * dq[2]:
        return True

    if dq[1] < threshold * dq[0] and dq[1] < threshold * dq[2]:
        return True

    return False

def append_clean_buffer(is_high, clean_buffer, buffer):
    if is_high:
        value = clean_buffer[-1]
    else:
        value = buffer[1]
    clean_buffer.append(value)

def is_fully_pressed(value):
    return value > BUTTON_PRESS_MAX

def is_double_press(left_buffer, right_buffer):
    left_avg = np.mean(left_buffer)
    right_avg = np.mean(right_buffer)

    if np.max(left_buffer) - np.min(left_buffer) > 30:
        return False

    if np.max(right_buffer) - np.min(right_buffer) > 30:
        return False

    if is_fully_pressed(left_avg) and is_fully_pressed(right_avg) and abs(left_avg - right_avg) < BUTTON_PRESS_DISTANCE_DIFF:
        return True
    else:
        return False
    
def is_double_press_active(left_buffer, right_buffer):
    left_avg = np.mean(left_buffer)
    right_avg = np.mean(right_buffer)

    if left_avg < BUTTON_PRESSED_MIN or right_avg < BUTTON_PRESSED_MIN:
        # one of the buttons is not pressed
        return False

    if np.max(left_buffer) - np.min(left_buffer) > 30:
        return False

    if np.max(right_buffer) - np.min(right_buffer) > 30:
        return False

    # both buttons are being pressed
    if left_avg < MAX_VALUE - 20 and right_avg < MAX_VALUE - 20 and abs(left_avg - right_avg) < BUTTON_PRESS_DISTANCE_DIFF:
        return True
    return False

def all_same_sign(arr):
    non_zero_arr = arr[arr != 0]
    return np.all(non_zero_arr > 0) or np.all(non_zero_arr < 0)

def is_swipe_active(first_buffer, last_buffer, diff_buffer):
    first_avg = np.mean(first_buffer)
    last_avg = np.max(last_buffer)

    # all values in array have same sign, skip 0
    has_same_sign = all_same_sign(diff_buffer)
    high_std_or_mean = np.std(diff_buffer) > 10 or np.mean(diff_buffer) > 20

    if first_avg >= BUTTON_PRESSED_MIN and last_avg < BUTTON_PRESSED_MIN and has_same_sign and high_std_or_mean:
        return True
    return False

def get_active_action(left_buffer, right_buffer, diff_buffer):
    action = None
    if is_swipe_active(left_buffer, right_buffer, diff_buffer): 
        action = "left_swipe"
    if is_swipe_active(right_buffer, left_buffer, diff_buffer):
        action = "right_swipe"
    if is_double_press_active(left_buffer, right_buffer):
        action = "double_press_active"
    if is_double_press(left_buffer, right_buffer):
        action = "double_press_confirmed"
    return action


def process_event(raw_left, raw_right, raw_diff, index):
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
    BUFFER_DIFF.append(raw_diff)

    left_high = detect_anomaly_event(BUFFER_LEFT)
    append_clean_buffer(left_high, CLEAN_BUFFER_LEFT, BUFFER_LEFT)
    right_high = detect_anomaly_event(BUFFER_RIGHT)
    append_clean_buffer(right_high,CLEAN_BUFFER_RIGHT, BUFFER_RIGHT)
    if left_high or right_high:
        CLEAN_DIFF_BUFFER.append(CLEAN_DIFF_BUFFER[-1])
    else:
        CLEAN_DIFF_BUFFER.append(BUFFER_DIFF[1])

    print(CLEAN_BUFFER_RIGHT, CLEAN_BUFFER_LEFT, CLEAN_DIFF_BUFFER)

    action = get_active_action(CLEAN_BUFFER_LEFT, CLEAN_BUFFER_RIGHT, CLEAN_DIFF_BUFFER)

    last_action_idx_diff = index - ACTION_IDX
    can_replace_action = action and ACTIVE_ACTION and "press" in action and "press" in ACTIVE_ACTION
    if not ACTIVE_ACTION and action or can_replace_action:
        ACTIVE_ACTION = action
        ACTION_IDX = index
    elif ACTIVE_ACTION and action != ACTIVE_ACTION and last_action_idx_diff > ACTION_MIN_DURATION:
        ACTIVE_ACTION = action
        if action:
            ACTION_IDX = index

    return {"left": CLEAN_BUFFER_LEFT[-1], "right": CLEAN_BUFFER_RIGHT[-1], "index": index, "action": ACTIVE_ACTION}
    
