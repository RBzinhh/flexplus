const firebaseConfig = {
    databaseURL: "https://playfilmesplusofc-default-rtdb.firebaseio.com"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
let masterList = [];

document.addEventListener("DOMContentLoaded", () => {
    _carregarTodosOsDados();

    const searchInput = document.getElementById('edittext_search');
    searchInput.addEventListener('input', (e) => {
        let termo = e.target.value.toLowerCase();
        _filtrarResultados(termo);
    });
});

function _carregarTodosOsDados() {
    db.ref('Movies').once('value', (movieSnap) => {
        let movies = [];
        movieSnap.forEach(child => {
            let item = child.val();
            item.id = child.key;
            movies.push(item);
        });

        db.ref('Series').once('value', (seriesSnap) => {
            let series = [];
            seriesSnap.forEach(child => {
                let item = child.val();
                item.id = child.key;
                item.Seasons = true;
                series.push(item);
            });

            masterList = movies.concat(series);
            _renderizarGrid(masterList, 'recyclerview1');
            
            // Recomendados (ex: nota > 7)
            let recomendados = masterList.filter(i => i.Vote && parseFloat(i.Vote) > 7);
            _renderizarGrid(recomendados, 'recyclerview2');
        });
    });
}

function _filtrarResultados(termo) {
    if (!termo) {
        _renderizarGrid(masterList, 'recyclerview1');
        document.getElementById('textview_no_movies').style.display = 'none';
        return;
    }

    let filtrados = masterList.filter(item => {
        let titulo = item.Title ? item.Title.toLowerCase() : '';
        return titulo.includes(termo);
    });

    if (filtrados.length === 0) {
        document.getElementById('textview_no_movies').style.display = 'block';
    } else {
        document.getElementById('textview_no_movies').style.display = 'none';
    }

    _renderizarGrid(filtrados, 'recyclerview1');
}

function _renderizarGrid(dados, elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;

    container.innerHTML = '';

    dados.forEach(item => {
        const card = document.createElement('div');
        card.className = 'movie-card';

        let poster = item.Poster || item.Backdrop || '';
        if (poster && !poster.startsWith('http')) {
            poster = `https://image.tmdb.org/t/p/w500${poster}`;
        }
        if (!poster || poster === 'n/a') {
            poster = 'https://via.placeholder.com/160x230?text=Sem+Capa';
        }

        let title = item.Title || 'n/a';
        let vote = item.Vote || 'n/a';
        let overview = item.Overview || item.Genres || 'n/a';

        card.innerHTML = `
            <img src="${poster}" alt="${title}">
            <div class="info">
                <h4>${title}</h4>
                <span class="rating"><i class="fa-solid fa-star" style="color: #F71B24;"></i> ${vote}</span>
            </div>
        `;

        card.onclick = () => {
            window.location.href = `details.html?id=${item.id}&type=${item.Seasons ? 'series' : 'movie'}`;
        };

        container.appendChild(card);
    });
}
