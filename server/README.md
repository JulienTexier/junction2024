# Server README

## INSTALL
Run inside server folder

```
python -m venv .venv

pip install -r requirements.txt

# inside server
export PYTHONPATH="$PYTHONPATH:/Users/villetoiviainen/dev/junction2024/server"
```

## RUN

```
uvicorn server:app --reload 
```

