const firebaseConfig = {
    databaseURL: "https://playfilmesplusofc-default-rtdb.firebaseio.com"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
let allMoviesAndSeries = [];

document.addEventListener("DOMContentLoaded", () => {
    _carregarDadosDoBanco();
});

function _carregarDadosDoBanco() {
    db.ref('Movies').once('value', (movieSnapshot) => {
        let moviesList = [];
        movieSnapshot.forEach((child) => {
            let item = child.val();
            item.id = child.key;
            moviesList.push(item);
        });

        db.ref('Series').once('value', (seriesSnapshot) => {
            let seriesList = [];
            seriesSnapshot.forEach((child) => {
                let item = child.val();
                item.id = child.key;
                item.Seasons = true;
                seriesList.push(item);
            });

            allMoviesAndSeries = moviesList.concat(seriesList);

            _popularSecoes(allMoviesAndSeries);
            _popularTvShows(seriesList);
        });
    });
}

function _popularSecoes(lista) {
    if (lista.length === 0) return;

    // Sorteia um destaque para o Banner
    let destaque = lista[Math.floor(Math.random() * lista.length)];
    document.getElementById('textview_title_banner').innerText = destaque.Title || "FlexPlus";
    document.getElementById('textview_bio_').innerText = destaque.Overview || destaque.Genres || "Aproveite seu conteúdo favorito";
    
    let imagemBanner = destaque.Backdrop || destaque.Poster || '';
    if (imagemBanner && imagemBanner !== 'n/a') {
        let urlFinal = imagemBanner.startsWith('http') ? imagemBanner : `https://image.tmdb.org/t/p/original${imagemBanner}`;
        document.getElementById('imageview_topmovie').style.backgroundImage = `url('${urlFinal}')`;
    }

    // Botão do Banner agora leva para as Informações (details.html) exatamente como clicar na capa
    document.getElementById('linear_play_').onclick = () => {
        window.location.href = `details.html?id=${destaque.id}&type=${destaque.Seasons ? 'series' : 'movie'}`;
    };

    let acaoList = lista.filter(item => item.Genres && item.Genres.includes("Ação"));
    _renderizarCarrossel(acaoList, 'recyclerview_genre_selection');

    let topRatedList = lista.filter(item => item.Vote && !isNaN(item.Vote) && parseFloat(item.Vote) > 7);
    _renderizarCarrossel(topRatedList, 'recyclerview_toprated');

    let newReleasesList = lista.filter(item => item.Year && !isNaN(item.Year) && parseInt(item.Year) > 2023);
    _renderizarCarrossel(newReleasesList, 'recyclerview_newreleases');

    let newlyAddedList = [...lista].reverse().slice(0, 30);
    _renderizarCarrossel(newlyAddedList, 'recyclerview_newlyadded');

    _renderizarCarrossel([], 'recyclerview_resume');
}

function _popularTvShows(seriesList) {
    _renderizarCarrossel(seriesList, 'recyclerview_tvshows');
}

function _renderizarCarrossel(dados, elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;

    let wrapper = container.parentElement;
    if (!wrapper.classList.contains('movie-row-wrapper')) {
        wrapper = document.createElement('div');
        wrapper.className = 'movie-row-wrapper';
        container.parentNode.insertBefore(wrapper, container);
        wrapper.appendChild(container);

        const btnLeft = document.createElement('button');
        btnLeft.className = 'scroll-btn scroll-left';
        btnLeft.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        btnLeft.onclick = () => container.scrollBy({ left: -600, behavior: 'smooth' });
        wrapper.insertBefore(btnLeft, container);

        const btnRight = document.createElement('button');
        btnRight.className = 'scroll-btn scroll-right';
        btnRight.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        btnRight.onclick = () => container.scrollBy({ left: 600, behavior: 'smooth' });
        wrapper.appendChild(btnRight);
    }

    container.innerHTML = '';

    if (dados.length === 0) {
        container.innerHTML = '<p style="color: #666; font-size: 13px; padding: 10px;">Nenhum conteúdo encontrado.</p>';
        return;
    }

    dados.forEach(item => {
        const card = document.createElement('div');
        card.className = 'movie-card';

        let poster = item.Poster || '';
        if (poster && !poster.startsWith('http')) {
            poster = `https://image.tmdb.org/t/p/w500${poster}`;
        }
        if (!poster || poster === 'n/a') {
            poster = 'https://via.placeholder.com/160x230?text=Sem+Capa';
        }

        const title = item.Title || 'Sem Título';
        const vote = item.Vote || '0.0';

        card.innerHTML = `
            <img src="${poster}" alt="${title}">
            <div class="info">
                <h4>${title}</h4>
                <div class="rating"><i class="fa-solid fa-star" style="color: #F71B24;"></i> <span>${vote}</span></div>
            </div>
        `;

        card.onclick = () => {
            window.location.href = `details.html?id=${item.id}&type=${item.Seasons ? 'series' : 'movie'}`;
        };

        container.appendChild(card);
    });
}
