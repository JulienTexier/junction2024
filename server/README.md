# Server README

## INSTALL

Run inside server folder

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# inside server
export PYTHONPATH="$PYTHONPATH:/Users/villetoiviainen/dev/junction2024/server"
```

## RUN

```sh
uvicorn server:app --reload
```
