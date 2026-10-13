const firebaseConfig = {
    databaseURL: "https://playfilmesplusofc-default-rtdb.firebaseio.com"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
let currentMedia = null;

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mediaId = urlParams.get('id');
    const type = urlParams.get('type'); // 'movie' ou 'series'

    if (mediaId) {
        _carregarDetalhes(mediaId, type);
    }
});

function _carregarDetalhes(id, type) {
    const node = type === 'series' ? 'Series' : 'Movies';

    db.ref(`${node}/${id}`).once('value', (snapshot) => {
        currentMedia = snapshot.val();
        if (!currentMedia) return;

        // Preencher Dados
        document.getElementById('textview_title').innerText = currentMedia.Title || currentMedia.title || 'Sem Título';
        document.getElementById('textview_rating').innerText = currentMedia.Vote || currentMedia.vote_average || '0.0';
        document.getElementById('textview_year').innerText = currentMedia.Year || '2024';
        document.getElementById('textview_views').innerText = currentMedia.Views || '100';
        document.getElementById('textview_language').innerText = currentMedia.Language || 'PT';
        document.getElementById('textview_size').innerText = currentMedia.Size || '';
        document.getElementById('textview_genres').innerText = currentMedia.Genres || '';
        document.getElementById('textview_overview').innerText = currentMedia.Overview || currentMedia.overview || 'Sem sinopse disponível.';

        // Imagem Backdrop (Procura em Backdrop ou Poster)
        let backdrop = currentMedia.Backdrop || currentMedia.backdrop_path || currentMedia.Poster || currentMedia.poster_path || '';
        if (backdrop && !backdrop.startsWith('http')) {
            backdrop = `https://image.tmdb.org/t/p/original${backdrop}`;
        }
        
        const backdropElement = document.getElementById('imageview_backdrop');
        if (backdropElement && backdrop) {
            backdropElement.style.backgroundImage = `url('${backdrop}')`;
            backdropElement.style.backgroundSize = 'cover';
            backdropElement.style.backgroundPosition = 'center';
        }

        // UNICA MUDANÇA NO BOTAO PLAY: Redireciona para o player.html passando os dados
        document.getElementById('linear_play').onclick = () => {
            let videoLink = currentMedia.Link || currentMedia.StreamUrl || currentMedia.url || '';
            let mediaTitle = currentMedia.Title || currentMedia.title || 'FlexPlus';

            if (videoLink) {
                window.location.href = `player.html?url=${encodeURIComponent(videoLink)}&title=${encodeURIComponent(mediaTitle)}`;
            } else {
                alert('Link de exibição indisponível no momento.');
            }
        };

        // Botão Download Seguro de 5h
        document.getElementById('linear_download').onclick = async () => {
            if (currentMedia.FilePath) {
                try {
                    const res = await fetch(`/.netlify/functions/download?file=${encodeURIComponent(currentMedia.FilePath)}`);
                    const data = await res.json();
                    if (data.downloadUrl) {
                        window.open(data.downloadUrl, '_blank');
                    } else {
                        alert('Erro ao gerar link de download.');
                    }
                } catch (e) {
                    alert('Erro na requisição do download.');
                }
            } else {
                alert('Arquivo de download não configurado para este título.');
            }
        };

        // Trailer (Apenas carrega se for um link HTTP válido)
        const trailerIframe = document.getElementById('trailer_iframe');
        if (trailerIframe) {
            if (currentMedia.Trailer && currentMedia.Trailer.startsWith('http')) {
                trailerIframe.src = currentMedia.Trailer;
            } else {
                trailerIframe.style.display = 'none';
            }
        }

        _carregarSimilares(currentMedia.Genres, node);
    });
}

// Alternar entre abas
function _mudarAba(aba) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-page').forEach(page => page.classList.remove('active'));

    if (event && event.target) {
        event.target.classList.add('active');
    }
    const targetTab = document.getElementById(`tab_${aba}`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

function _carregarSimilares(generos, node) {
    db.ref(node).limitToFirst(10).once('value', (snapshot) => {
        const container = document.getElementById('recyclerview_similar');
        if (!container) return;
        container.innerHTML = '';
        snapshot.forEach(child => {
            const item = child.val();
            const card = document.createElement('div');
            card.className = 'movie-card';

            let poster = item.Poster || item.poster_path || '';
            if (poster && !poster.startsWith('http')) {
                poster = `https://image.tmdb.org/t/p/w500${poster}`;
            }

            card.innerHTML = `
                <img src="${poster || 'https://via.placeholder.com/160x230'}" alt="${item.Title || item.title}">
                <div class="info"><h4>${item.Title || item.title || 'Sem Título'}</h4></div>
            `;
            card.onclick = () => {
                window.location.href = `details.html?id=${child.key}&type=${node === 'Series' ? 'series' : 'movie'}`;
            };
            container.appendChild(card);
        });
    });
}
