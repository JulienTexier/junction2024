import time
import math

from machine import Pin, PWM

pwr = Pin(25)
left = Pin(22)
right = Pin(9)
refresh_hz = 40

leds = [PWM(Pin(0)), PWM(Pin(2)), PWM(Pin(4))]
lvar = [1, 1, 1]
lmu = [-2, 0, 2]
lval = [0, 0, 0]

def gaussian(x, sigma=1, bias=0):
    return math.exp(- ((x - bias) ** 2 / 2 * sigma ** 2))

def normalize(x, old_min=-100, old_max=100, new_min=-4, new_max=4):
    return new_min + (x - old_min) * (new_max - new_min) / (old_max - old_min)

def leds_init(f=1000):
    for l in leds:
        l.freq(f)
        l.duty_u16(0)
    return True

def leds_set(x, min_val=-100, max_val=100):
    x = max(min_val, min(max_val, x))
    X = normalize(x)
    for i, l in enumerate(leds):
        y = gaussian(X, sigma=lvar[i], bias=lmu[i])
        lval[i] = int(y * 65536)
        l.duty_u16(lval[i])
        
def leds_off():
    for i, l in enumerate(leds):
        lval[i] = max(0, lval[i] - 2000) 
        l.duty_u16(lval[i])

def sonar_start(pin):
    pin.init(pin.OUT)
    pin.value(0)
    time.sleep_us(2)
    pin.value(1)
    time.sleep_us(10)
    pin.value(0)

def sonar_sample(pin, n_samples=500):
    pin.init(pin.IN)
    samples = [pin.value() for i in range(n_samples)]
    result = int((1 - sum(samples)/n_samples) * 100)
    return result

def sonar_measure(pin, *args, **kwargs):
    sonar_start(pin)
    result = sonar_sample(pin, *args, **kwargs)
    return min(50, max(0, result - 50)) * 2

pwr.init(pwr.OUT)
pwr.value(1)
leds_init()

print("OK")
try:
    while True:
        l = sonar_measure(left)
        r = sonar_measure(right)
        d = min(1, max(-1, r/100. - l/100.))
        x = min(100, max(-100, int((d * math.exp(d)) * 100)))
        
        if (l != 0 or r != 0):
            leds_set(x)
        else:
            leds_off()
        
        print("{},{},{}".format(l, r, x))
        time.sleep_ms(25)
except:
    print("KO")
    pwr.value(0)

