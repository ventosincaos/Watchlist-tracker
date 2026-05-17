import json
import os

MOVIES_FILE = "movies_export.json"

def load_movies():
    if os.path.exists(MOVIES_FILE):
        with open(MOVIES_FILE, "r") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

def save_movies(movies):
    with open(MOVIES_FILE, "w") as f:
        json.dump(movies, f, ensure_ascii=False, indent=2)

movies = load_movies()