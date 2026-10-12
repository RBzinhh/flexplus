// Configuração do Firebase com a sua URL real
const firebaseConfig = {
    databaseURL: "https://playfilmesplusofc-default-rtdb.firebaseio.com"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

let allMoviesAndSeries = [];

document.addEventListener("DOMContentLoaded", () => {
    console.log("FlexPlus Web Carregando Dados do Firebase...");
    _carregarDadosDoBanco();
});

function _carregarDadosDoBanco() {
    // Lê os nós "Movies" e "Series" da mesma forma que o seu app faz no OnCreate
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
                item.Seasons = true; // Identifica que é série igual no seu app
                seriesList.push(item);
            });

            // Junta filmes e séries, igualzinho ao app
            allMoviesAndSeries = moviesList.concat(seriesList);

            // Popula as seções do site com os dados reais
            _popularSecoes(allMoviesAndSeries);
            _popularTvShows(seriesList);
        });
    });
}

function _popularSecoes(lista) {
    // 1. Banner Principal (Pega o primeiro filme ou aleatório)
    if (lista.length > 0) {
        let destaque = lista[Math.floor(Math.random() * lista.length)];
        document.getElementById('textview_title_banner').innerText = destaque.Title || "FlexPlus";
        document.getElementById('textview_bio_').innerText = destaque.Genres || "Aproveite seu filme favorito";
        if (destaque.Poster) {
            let posterUrl = destaque.Poster.startsWith('http') ? destaque.Poster : `https://image.tmdb.org/t/p/original${destaque.Poster}`;
            document.getElementById('imageview_topmovie').style.backgroundImage = `url('${posterUrl}')`;
        }
    }

    // 2. Categoria: Ação (Filtra onde Genres contém "Ação")
    let acaoList = lista.filter(item => item.Genres && item.Genres.includes("Ação"));
    _renderizarCarrossel(acaoList, 'recyclerview_genre_selection');
    document.getElementById('textview_genres_selection').innerText = "Ação";

    // 3. Mais bem avaliados (Vote > 7)
    let topRatedList = lista.filter(item => item.Vote && !isNaN(item.Vote) && parseFloat(item.Vote) > 7);
    _renderizarCarrossel(topRatedList, 'recyclerview_toprated');

    // 4. Novos Lançamentos (Year > 2023)
    let newReleasesList = lista.filter(item => item.Year && !isNaN(item.Year) && parseInt(item.Year) > 2023);
    _renderizarCarrossel(newReleasesList, 'recyclerview_newreleases');

    // 5. Adicionados recentemente (Inverte a ordem)
    let newlyAddedList = [...lista].reverse().slice(0, 30);
    _renderizarCarrossel(newlyAddedList, 'recyclerview_newlyadded');

    // 6. Continue Assistindo (Pode puxar do localStorage ou deixar vazio se não houver histórico)
    _renderizarCarrossel([], 'recyclerview_resume');
}

function _popularTvShows(seriesList) {
    _renderizarCarrossel(seriesList, 'recyclerview_tvshows');
}

// Função para montar os cards dentro de cada carrossel na tela
function _renderizarCarrossel(dados, elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;

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

        card.innerHTML = `
            <img src="${poster}" alt="${title}">
            <div class="info">
                <h4>${title}</h4>
            </div>
        `;

        // Ao clicar no card, redireciona para a página de detalhes passando os dados
        card.onclick = () => {
            window.location.href = `details.html?id=${item.id}&type=${item.Seasons ? 'series' : 'movie'}`;
        };

        container.appendChild(card);
    });
}
