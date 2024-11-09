"""
No thread safety here...
"""

from collections import deque

import numpy as np

# TODO: calibrate
MIN_VALUE = 0
MAX_VALUE = 70

# TODO: might need scaling based on calibration
BUTTON_PRESS_MAX = 30
BUTTON_PRESSED_MIN = 5
BUTTON_PRESS_DISTANCE_DIFF = 15
STD_DIFF_THRESHOLD = 10
MEAN_THRESHOLD = 10
RAPID_CHANGE_THRESHOLD = 25
MAX_MIN_DIFF = 30

ACTION_MIN_DURATION = 30 * 3
# mutation variables
ACTION_DURATION_IDX = 0
ACTIVE_ACTION = None

SEND_SWIPE_IDX = -1
SEND_SWIPE_ACTION = None

max_size = 3
# NOTE: deque is somewhat thread safe
BUFFER_LEFT = deque(maxlen=max_size)    
BUFFER_RIGHT = deque(maxlen=max_size)

CLEAN_BUFFER_LEFT = deque(maxlen=max_size)
CLEAN_BUFFER_RIGHT = deque(maxlen=max_size)

BUFFER_DIFF = deque(maxlen=max_size)
CLEAN_DIFF_BUFFER = deque(maxlen=max_size)

# prefill buffers
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

    if dq[1] *  threshold < dq[0] and dq[1] * threshold <  dq[2]:
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

def too_high_min_max_diff(buffer):
    return np.max(buffer) - np.min(buffer) > MAX_MIN_DIFF

def is_double_press(left_buffer, right_buffer, diff_buffer):
    left_avg = np.mean(left_buffer)
    right_avg = np.mean(right_buffer)

    is_low_std_diff = np.std(diff_buffer) < STD_DIFF_THRESHOLD
    if not is_low_std_diff:
        return False

    if too_high_min_max_diff(left_buffer):
        return False

    if too_high_min_max_diff(right_buffer):
        return False

    if is_fully_pressed(left_avg) and is_fully_pressed(right_avg) and abs(left_avg - right_avg) < BUTTON_PRESS_DISTANCE_DIFF:
        return True
    else:
        return False
    
def is_double_press_active(left_buffer, right_buffer, diff_buffer):
    left_avg = np.mean(left_buffer)
    right_avg = np.mean(right_buffer)

    is_low_std_diff = np.std(diff_buffer) < STD_DIFF_THRESHOLD
    if not is_low_std_diff:
        return False

    if left_avg < BUTTON_PRESSED_MIN or right_avg < BUTTON_PRESSED_MIN:
        # one of the buttons is not pressed
        return False
    if too_high_min_max_diff(left_buffer):
        return False

    if too_high_min_max_diff(right_buffer):
        return False

    # both buttons are being pressed
    if left_avg > BUTTON_PRESSED_MIN and right_avg > BUTTON_PRESSED_MIN and abs(left_avg - right_avg) < BUTTON_PRESS_DISTANCE_DIFF:
        return True
    return False

def all_same_sign(arr):
    arr = np.array(arr)
    non_zero_arr = arr[arr != 0]
    if len(non_zero_arr) < 2:
        return False
    return np.all(non_zero_arr > 0) or np.all(non_zero_arr < 0)

def is_swipe_active(first_buffer, last_buffer, diff_buffer):
    first_avg = np.mean(first_buffer)
    last_avg = np.min(last_buffer)

    has_rapid_change = np.max(first_buffer) - np.min(first_buffer) > RAPID_CHANGE_THRESHOLD

    # all values in array have same sign, skip 0
    has_same_sign = all_same_sign(list(diff_buffer))
    high_std_or_mean = np.std(diff_buffer) > STD_DIFF_THRESHOLD or np.mean(diff_buffer) > MEAN_THRESHOLD
    only_one_pressed = first_avg >= BUTTON_PRESSED_MIN and last_avg <= 0

    if only_one_pressed and has_same_sign and high_std_or_mean and has_rapid_change:
        return True
    return False

def get_active_action(left_buffer, right_buffer, diff_buffer):
    action = None
    if is_swipe_active(left_buffer, right_buffer, diff_buffer): 
        # print("left_swipe")
        action = "left_swipe"
    if is_swipe_active(right_buffer, left_buffer, diff_buffer):
        # print("right_swipe")
        action = "right_swipe"
    if is_double_press_active(left_buffer, right_buffer, diff_buffer):
        # print("double_press_active")
        action = "double_press_active"
    if is_double_press(left_buffer, right_buffer, diff_buffer):
        # print("double_press_confirmed")
        action = "double_press_confirmed"

    return action

def clear_state(left_buffer, right_buffer):
    return np.max(left_buffer) == 0 and np.max(right_buffer) == 0


def process_event(raw_left, raw_right, raw_diff, index):
    """
    - read current event
    - append it to short buffer
    - check if prev value from short buffer was not noise
    - append prev value to long buffer if not noise

    """
    global ACTION_DURATION_IDX, ACTIVE_ACTION, SEND_SWIPE_IDX, SEND_SWIPE_ACTION

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

    # print(CLEAN_BUFFER_LEFT, CLEAN_BUFFER_RIGHT,CLEAN_DIFF_BUFFER)

    action = get_active_action(CLEAN_BUFFER_LEFT, CLEAN_BUFFER_RIGHT, CLEAN_DIFF_BUFFER)

    can_replace_press = (action and ACTIVE_ACTION and "press" in action and "press" in ACTIVE_ACTION)
    matching_action = action == ACTIVE_ACTION
    can_replace_action = (action == ACTIVE_ACTION or can_replace_press)
    
    if (action and
        (not ACTIVE_ACTION 
         or can_replace_action or matching_action) 
         or action and index > ACTION_DURATION_IDX):
        try:
            if "swipe" in action and SEND_SWIPE_IDX < index:
                SEND_SWIPE_IDX = index + 7
                SEND_SWIPE_ACTION = action
            elif "swipe" not in action:
                ACTION_DURATION_IDX = index + ACTION_MIN_DURATION
                ACTIVE_ACTION = action
                SEND_SWIPE_IDX = -1
                SEND_SWIPE_ACTION = None
        except Exception as e:
            print("action failure", e)
    if clear_state(CLEAN_BUFFER_LEFT, CLEAN_BUFFER_RIGHT):
        ACTIVE_ACTION = None
        ACTION_DURATION_IDX = 0
    
    if SEND_SWIPE_IDX == index:
        ACTION_DURATION_IDX = index + ACTION_MIN_DURATION
        ACTIVE_ACTION = SEND_SWIPE_ACTION
        SEND_SWIPE_IDX = -1
        SEND_SWIPE_ACTION = None

    return {"left": CLEAN_BUFFER_LEFT[-1], "right": CLEAN_BUFFER_RIGHT[-1], "index": index, "action": ACTIVE_ACTION}
    

