let currentIndex = 0;
let movies = [];
let omdbPoster = "";

// ————— SLIDER —————

function getCards() {
    return document.querySelectorAll(".card");
}

function showSlide(index) {
    const cards = getCards();
    cards.forEach(c => c.classList.remove("active"));
    cards[index].classList.add("active");
    updateDots();
}

function nextSlide() {
    const cards = getCards();
    currentIndex = (currentIndex + 1) % cards.length;
    showSlide(currentIndex);
}

function prevSlide() {
    const cards = getCards();
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    showSlide(currentIndex);
}

function updateDots() {
    const dots = document.getElementById("dots");
    const cards = getCards();
    const total = cards.length;
    dots.innerHTML = "";

    const visible = 5;
    const half = Math.floor(visible / 2);

    let start = currentIndex - half;
    let end = currentIndex + half;

    if (start < 0) { start = 0; end = Math.min(visible - 1, total - 1); }
    if (end >= total) { end = total - 1; start = Math.max(0, end - visible + 1); }

    for (let i = start; i <= end; i++) {
        const dot = document.createElement("div");
        const distance = Math.abs(i - currentIndex);

        dot.className = "dot" + (i === currentIndex ? " active" : "");
        dot.style.opacity = distance === 0 ? "1" : distance === 1 ? "0.8" : "0.7";
        dot.style.transform = `scale(${distance === 0 ? 1 : distance === 1 ? 0.9 : 0.75})`;
        dot.onclick = () => { currentIndex = i; showSlide(i); };
        dots.appendChild(dot);
    }
}

// ————— FORMULÁRIO —————

function toggleForm(e) {
    if (e) e.stopPropagation();
    const addFace = document.getElementById("add-face");
    const formFace = document.getElementById("form-face");
    addFace.classList.toggle("hidden");
    formFace.classList.toggle("hidden");
}

document.getElementById("add-card").addEventListener("click", function(e) {
    const formFace = document.getElementById("form-face");
    if (!formFace.classList.contains("hidden")) return;
    toggleForm();
});

function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const img = document.getElementById("img-preview");
        img.src = e.target.result;
        img.classList.add("visible");
        document.querySelector("#img-label i").style.display = "none";
        document.querySelector("#img-label span").style.display = "none";
    };
    reader.readAsDataURL(file);
}

function setRating(value) {
    document.getElementById("f-rating").value = value;
    const stars = document.querySelectorAll("#stars-input span");
    stars.forEach((s, i) => {
        s.classList.toggle("active", i < value);
    });
}

// ————— BUSCA OMDB —————

const genreMap = {
    "action": "Ação",
    "comedy": "Comédia",
    "drama": "Drama",
    "horror": "Terror",
    "science fiction": "Ficção Científica",
    "animation": "Animação",
    "documentary": "Documentário",
    "romance": "Romance"
};

async function searchOMDb() {
    const name = document.getElementById("f-name").value.trim();
    if (!name) return alert("Digite o nome do filme em inglês!");

    const res = await fetch(`/movies/search?q=${encodeURIComponent(name)}`);
    if (!res.ok) return alert("Filme não encontrado na OMDb.");

    const data = await res.json();

    if (data.year) document.getElementById("f-release").value = data.year.slice(0, 4);

    if (data.genre) {
        const genrePT = genreMap[data.genre.toLowerCase()];
        if (genrePT) document.getElementById("f-genre").value = genrePT;
    }

    if (data.poster && data.poster !== "N/A") {
        const img = document.getElementById("img-preview");
        img.src = data.poster;
        img.classList.add("visible");
        document.querySelector("#img-label i").style.display = "none";
        document.querySelector("#img-label span").style.display = "none";
        omdbPoster = data.poster;
    }
}

// ————— SUBMIT —————

async function submitMovie() {
    const name = document.getElementById("f-name").value.trim();
    const genre = document.getElementById("f-genre").value;
    const platform = document.getElementById("f-platform").value;
    const release = document.getElementById("f-release").value;
    const watched = document.getElementById("f-watched").value;
    const rating = document.getElementById("f-rating").value;
    const review = document.getElementById("f-review").value;
    const imageFile = document.getElementById("img-input").files[0];

    if (!name) return alert("Informe o nome do filme!");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("genre", genre);
    formData.append("platform", platform);
    formData.append("release_date", release);
    formData.append("watched_date", watched);
    formData.append("rating", rating);
    formData.append("review", review);
    if (imageFile) formData.append("image", imageFile);
    if (omdbPoster && !imageFile) formData.append("poster_url", omdbPoster);

    await fetch("/movies", { method: "POST", body: formData });

    document.getElementById("f-name").value = "";
    document.getElementById("f-genre").value = "";
    document.getElementById("f-platform").value = "";
    document.getElementById("f-release").value = "";
    document.getElementById("f-watched").value = "";
    document.getElementById("f-rating").value = "0";
    document.getElementById("f-review").value = "";
    document.getElementById("img-input").value = "";
    const imgPreview = document.getElementById("img-preview");
    imgPreview.src = "";
    imgPreview.classList.remove("visible");
    document.querySelector("#img-label i").style.display = "";
    document.querySelector("#img-label span").style.display = "";
    document.querySelectorAll("#stars-input span").forEach(s => s.classList.remove("active"));
    omdbPoster = "";
    toggleForm();

    await loadMovies();
    currentIndex = movies.length;
    showSlide(currentIndex);
}

// ————— FILMES —————

async function loadMovies() {
    const res = await fetch("/movies");
    movies = await res.json();
    renderMovies();
}

function renderMovies() {
    document.querySelectorAll(".movie-card").forEach(c => c.remove());

    const addCard = document.getElementById("add-card");

    movies.forEach((movie, index) => {
        const card = document.createElement("div");
        card.className = "card movie-card";
        card.innerHTML = `
            <div class="card-left">
                <img src="${movie.image_url}" alt="${movie.name}">
            </div>
            <div class="card-right">
                <h2>${movie.name.toUpperCase()}</h2>
                <div class="movie-details">
                    <span class="release">${movie.release_date || "—"}</span>
                    <span class="genre">${movie.genre || "—"}</span>
                    <span class="plataform">${movie.platform || "—"}</span>
                </div>
                <div class="movie-stars">
                    ${"★".repeat(movie.rating).replace(/★/g, '<span class="active">★</span>') +
                    "★".repeat(10 - movie.rating).replace(/★/g, '<span>★</span>')}
                </div>
                <p class="movie-review">${movie.review || ""}</p>
                <div class="movie-footer">
                    <span class="watched-date">Assistido em ${movie.watched_date ? movie.watched_date.split('-').reverse().join('/') : "—"}</span>
                    <button class="delete-btn" onclick="deleteMovie(${index})">Remover</button>
                </div>
            </div>
        `;
        addCard.insertAdjacentElement("afterend", card);
    });

    showSlide(currentIndex);
}

async function deleteMovie(index) {
    await fetch(`/movies/${index}`, { method: "DELETE" });
    currentIndex = 0;
    await loadMovies();
}

// ————— EXPORT / IMPORT —————

async function exportMovies() {
    window.location.href = "/movies/export";
}

async function importMovies(event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/movies/import", { method: "POST", body: formData });
    const data = await res.json();
    console.log("Importado:", data);

    event.target.value = "";
    currentIndex = 0;
    await loadMovies();
}

loadMovies();