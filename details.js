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
        document.getElementById('textview_title').innerText = currentMedia.Title || 'Sem Título';
        document.getElementById('textview_rating').innerText = currentMedia.Vote || '0.0';
        document.getElementById('textview_year').innerText = currentMedia.Year || '2024';
        document.getElementById('textview_views').innerText = currentMedia.Views || '100';
        document.getElementById('textview_language').innerText = currentMedia.Language || 'PT';
        document.getElementById('textview_size').innerText = currentMedia.Size || '';
        document.getElementById('textview_genres').innerText = currentMedia.Genres || '';
        document.getElementById('textview_overview').innerText = currentMedia.Overview || 'Sem sinopse disponível.';

        // Imagem Backdrop
        let backdrop = currentMedia.Backdrop || currentMedia.Poster || '';
        if (backdrop && !backdrop.startsWith('http')) {
            backdrop = `https://image.tmdb.org/t/p/original${backdrop}`;
        }
        document.getElementById('imageview_backdrop').style.backgroundImage = `url('${backdrop}')`;

        // Botão Play
        document.getElementById('linear_play').onclick = () => {
            if (currentMedia.Link || currentMedia.StreamUrl) {
                window.location.href = currentMedia.Link || currentMedia.StreamUrl;
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

        // Trailer (Se houver link de embed/Youtube)
        if (currentMedia.Trailer) {
            document.getElementById('trailer_iframe').src = currentMedia.Trailer;
        }

        _carregarSimilares(currentMedia.Genres, node);
    });
}

// Alternar entre abas
function _mudarAba(aba) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-page').forEach(page => page.classList.remove('active'));

    event.target.classList.add('active');
    document.getElementById(`tab_${aba}`).classList.add('active');
}

function _carregarSimilares(generos, node) {
    db.ref(node).limitToFirst(10).once('value', (snapshot) => {
        const container = document.getElementById('recyclerview_similar');
        container.innerHTML = '';
        snapshot.forEach(child => {
            const item = child.val();
            const card = document.createElement('div');
            card.className = 'movie-card';

            let poster = item.Poster || '';
            if (poster && !poster.startsWith('http')) {
                poster = `https://image.tmdb.org/t/p/w500${poster}`;
            }

            card.innerHTML = `
                <img src="${poster || 'https://via.placeholder.com/160x230'}" alt="${item.Title}">
                <div class="info"><h4>${item.Title}</h4></div>
            `;
            card.onclick = () => {
                window.location.href = `details.html?id=${child.key}&type=${node === 'Series' ? 'series' : 'movie'}`;
            };
            container.appendChild(card);
        });
    });
}
