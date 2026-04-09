import pytest
from app import create_app

@pytest.fixture(autouse=True)
def clear_movies():
    from app import data_store
    data_store.movies.clear()
    yield
    data_store.movies.clear()

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_get_movies_vazio(client):
    res = client.get("/movies")
    assert res.status_code == 200
    assert res.get_json() == []

def test_add_movie(client):
    res = client.post("/movies", data={
        "name": "Kill Bill",
        "genre": "Ação",
        "platform": "Netflix",
        "release_date": "2003",
        "watched_date": "2024-01-01",
        "rating": "8",
        "review": "Ótimo filme"
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data["movie"]["name"] == "Kill Bill"

def test_delete_movie(client):
    client.post("/movies", data={
        "name": "Kill Bill",
        "genre": "Ação",
        "platform": "Netflix",
        "release_date": "2003",
        "watched_date": "2024-01-01",
        "rating": "8",
        "review": "Ótimo filme"
    })
    res = client.delete("/movies/0")
    assert res.status_code == 200

def test_delete_inexistente(client):
    res = client.delete("/movies/99")
    assert res.status_code == 404

def test_add_movie_com_imagem(client):
    import io
    import os
    os.makedirs("static/uploads", exist_ok=True)
    imagem_fake = (io.BytesIO(b"fake image content"), "poster.jpg")

    res = client.post("/movies", data={
        "name": "Matrix",
        "genre": "Ficção Científica",
        "platform": "HBO Max",
        "release_date": "1999",
        "watched_date": "2024-02-01",
        "rating": "10",
        "review": "Clássico",
        "image": imagem_fake
    }, content_type="multipart/form-data")

    assert res.status_code == 201
    data = res.get_json()
    assert "poster.jpg" in data["movie"]["image_url"]

def test_exportar(client):
    client.post("/movies", data={
        "name": "Inception",
        "genre": "Ação",
        "platform": "Netflix",
        "release_date": "2010",
        "watched_date": "2024-03-01",
        "rating": "9",
        "review": "Incrível"
    })
    res = client.get("/movies/export")
    assert res.status_code == 200
    assert res.content_type == "application/json"

def test_importar(client):
    import io
    import json

    filmes = [{"name": "Pulp Fiction", "genre": "Drama", "platform": "Prime Video",
               "release_date": "1994", "watched_date": "2024-04-01",
               "rating": 9, "review": "Obra prima", "image_url": "/static/uploads/default.jpg"}]

    arquivo = (io.BytesIO(json.dumps(filmes).encode()), "filmes.json")

    res = client.post("/movies/import", data={"file": arquivo},
                      content_type="multipart/form-data")

    assert res.status_code == 200
    assert res.get_json()["count"] == 1

def test_add_movie_sem_nome(client):
    res = client.post("/movies", data={
        "name": "",
        "genre": "Ação",
        "platform": "Netflix",
        "release_date": "2003",
        "watched_date": "2024-01-01",
        "rating": "8",
        "review": "Ótimo filme"
    })
    assert res.status_code == 400

def test_add_movie_rating_zero(client):
    res = client.post("/movies", data={
        "name": "Filme Sem Nota",
        "genre": "Drama",
        "platform": "Netflix",
        "release_date": "2020",
        "watched_date": "2024-01-01",
        "rating": "0",
        "review": ""
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data["movie"]["rating"] == 0

def test_add_movie_rating_maximo(client):
    res = client.post("/movies", data={
        "name": "Filme Perfeito",
        "genre": "Ação",
        "platform": "Cinema",
        "release_date": "2024",
        "watched_date": "2024-12-31",
        "rating": "10",
        "review": "Incrível"
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data["movie"]["rating"] == 10

def test_add_movie_sem_review(client):
    res = client.post("/movies", data={
        "name": "Filme Sem Review",
        "genre": "Comédia",
        "platform": "Prime Video",
        "release_date": "2022",
        "watched_date": "2024-06-01",
        "rating": "5",
        "review": ""
    })
    assert res.status_code == 201

def test_delete_primeiro_de_varios(client):
    client.post("/movies", data={"name": "Filme A", "genre": "Ação",
        "platform": "Netflix", "release_date": "2020",
        "watched_date": "2024-01-01", "rating": "5", "review": ""})
    client.post("/movies", data={"name": "Filme B", "genre": "Drama",
        "platform": "Netflix", "release_date": "2021",
        "watched_date": "2024-02-01", "rating": "7", "review": ""})

    res = client.delete("/movies/0")
    assert res.status_code == 200

    res = client.get("/movies")
    filmes = res.get_json()
    assert filmes[0]["name"] == "Filme B"