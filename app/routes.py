import os
import json
from flask import Blueprint, jsonify, request, render_template, send_file
from werkzeug.utils import secure_filename
from app.data_store import movies

bp = Blueprint("main", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route("/")
def index():
    return render_template("index.html")

@bp.route("/movies", methods=["GET"])
def get_movies():
    return jsonify(movies)

@bp.route("/movies", methods=["POST"])
def add_movie():
    name = request.form.get("name")
    genre = request.form.get("genre")
    release_date = request.form.get("release_date")
    watched_date = request.form.get("watched_date")
    platform = request.form.get("platform")
    rating = request.form.get("rating")
    review = request.form.get("review")

    if not name:
        return jsonify({"error": "Nome é obrigatório"}), 400

    image_url = "/static/uploads/default.jpg"
    file = request.files.get("image")
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join("static/uploads", filename))
        image_url = f"/static/uploads/{filename}"

    movie = {
        "name": name,
        "genre": genre,
        "release_date": release_date,
        "watched_date": watched_date,
        "platform": platform,
        "rating": int(rating) if rating else 0,
        "review": review,
        "image_url": image_url
    }

    movies.append(movie)
    return jsonify({"success": True, "movie": movie}), 201


@bp.route("/movies/<int:index>", methods=["DELETE"])
def delete_movie(index):
    try:
        removed = movies.pop(index)
        return jsonify({"success": True, "removed": removed})
    except IndexError:
        return jsonify({"error": "Filme não encontrado"}), 404

@bp.route("/movies/export", methods=["GET"])
def export_movies():
    import os
    path = os.path.join(os.getcwd(), "movies_export.json")
    with open(path, "w") as f:
        json.dump(movies, f, ensure_ascii=False, indent=2)
    return send_file(path, as_attachment=True)

@bp.route("/movies/import", methods=["POST"])
def import_movies():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400
    data = json.load(file)
    movies.clear()
    movies.extend(data)
    return jsonify({"success": True, "count": len(movies)})
