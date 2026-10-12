// Configuração do Firebase para o site do FlexPlus
const firebaseConfig = {
    databaseURL: "https://playfilmesplusofc-default-rtdb.firebaseio.com"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

document.addEventListener("DOMContentLoaded", () => {
    console.log("FlexPlus Web Conectado ao Firebase!");
    _carregarDadosIniciais();
});

function _carregarDadosIniciais() {
    // 1. Carregar Banner do Topo
    db.ref('TopMovie').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            document.getElementById('textview_title_banner').innerText = data.Title || "FlexPlus";
            document.getElementById('textview_bio_').innerText = data.Overview || "Aproveite seu filme favorito";
            if (data.BackdropPath) {
                document.getElementById('imageview_topmovie').style.backgroundImage = `url('https://image.tmdb.org/t/p/original${data.BackdropPath}')`;
            }
        }
    });

    // 2. Carregar Gêneros
    db.ref('Genres').on('value', (snapshot) => {
        const genreContainer = document.getElementById('recyclerview_genre');
        if (!genreContainer) return;
        genreContainer.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const genre = childSnapshot.val();
            const genreElement = document.createElement('div');
            genreElement.className = 'genre-chip';
            genreElement.innerText = genre.Name || 'Gênero';
            genreElement.onclick = () => _filtrarPorGenero(genre.Name);
            genreContainer.appendChild(genreElement);
        });
    });

    // 3. Carregar Categorias Principais
    _carregarSecao('Movies/Action', 'recyclerview_genre_selection');
    _carregarSecao('Resume', 'recyclerview_resume');
    _carregarSecao('Movies/TopRated', 'recyclerview_toprated');
    _carregarSecao('TvShows', 'recyclerview_tvshows');
    _carregarSecao('Movies/NewReleases', 'recyclerview_newreleases');
    _carregarSecao('Movies/NewlyAdded', 'recyclerview_newlyadded');
    _carregarSecao('Movies/BecauseYouWatched', 'recyclerview_becauseyouwatched');
}

function _carregarSecao(firebasePath, elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;

    db.ref(firebasePath).on('value', (snapshot) => {
        container.innerHTML = '';
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const item = childSnapshot.val();
                const card = document.createElement('div');
                card.className = 'movie-card';
                
                const posterUrl = item.poster_path || item.PosterPath || '';
                const title = item.title || item.Title || 'Título';

                card.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w500${posterUrl}" alt="${title}">
                    <div class="info">
                        <h4>${title}</h4>
                    </div>
                `;

                card.onclick = () => {
                    window.location.href = `details.html?id=${childSnapshot.key}`;
                };

                container.appendChild(card);
            });
        }
    });
}

function _filtrarPorGenero(nomeGenero) {
    document.getElementById('textview_genres_selection').innerText = nomeGenero;
    _carregarSecao(`GenresContent/${nomeGenero}`, 'recyclerview_genre_selection');
}
