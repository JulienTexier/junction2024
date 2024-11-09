import pytest

from collections import deque
from app.signal_algos import detect_single_high_value, is_double_press, is_double_press_active

def test_detect_single_high_value():
    queue = deque(maxlen=3)
    for i in range(3):
        queue.append(3)

    assert detect_single_high_value(queue) is False

    queue.append(50)
    assert detect_single_high_value(queue) is False

    queue.append(3)
    assert detect_single_high_value(queue) is True
    
    queue.append(50)
    queue.append(50)
    assert detect_single_high_value(queue) is False


def test_is_double_press():
    left_queue = deque(maxlen=3)
    right_queue = deque(maxlen=3)
    for _ in range(3):
        left_queue.append(3)
        right_queue.append(3)

    
    assert is_double_press(left_queue, right_queue) is False

    for _ in range(3):
        left_queue.append(30)
        right_queue.append(30)
    
    assert is_double_press(left_queue, right_queue) is True

    for _ in range(3):
        left_queue.append(30)
        right_queue.append(70)
    
    assert is_double_press(left_queue, right_queue) is False

def test_double_press_active():
    left_queue = deque(maxlen=3)
    right_queue = deque(maxlen=3)
    for _ in range(3):
        left_queue.append(3)
        right_queue.append(3)
    assert is_double_press_active(left_queue, right_queue) is False

    for _ in range(3):
        left_queue.append(80)
        right_queue.append(80)
    assert is_double_press_active(left_queue, right_queue) is True

    for _ in range(3):
        left_queue.append(30)
        right_queue.append(30)
    assert is_double_press_active(left_queue, right_queue) is True

    for _ in range(3):
        left_queue.append(80)
        right_queue.append(30)
    assert is_double_press_active(left_queue, right_queue) is False

