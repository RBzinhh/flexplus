document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('playerView');
    const playPauseBtn = document.getElementById('imageview_Play_Pause');
    const playPauseIcon = document.getElementById('play_pause_icon');
    const seekbar = document.getElementById('seekbar_progress');
    const currentTimeText = document.getElementById('textview_Current_Time');
    const totalDurationText = document.getElementById('textview_Total_Duration');
    const titleText = document.getElementById('textview_Title');

    // Recupera dados passados por URL (ex: player.html?url=LINK_DO_VIDEO&title=NOME)
    const urlParams = new URLSearchParams(window.location.search);
    const videoUrl = urlParams.get('url');
    const movieTitle = urlParams.get('title');

    if (videoUrl) {
        document.getElementById('video_source').src = decodeURIComponent(videoUrl);
        video.load();
    }
    if (movieTitle) {
        titleText.innerText = decodeURIComponent(movieTitle);
    }

    // Play / Pause
    function togglePlay() {
        if (video.paused) {
            video.play();
            playPauseIcon.className = "fa-solid fa-pause";
        } else {
            video.pause();
            playPauseIcon.className = "fa-solid fa-play";
        }
    }

    playPauseBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    // Atualizar tempo e barra de progresso
    video.addEventListener('timeupdate', () => {
        if (!isNaN(video.duration)) {
            let percent = (video.currentTime / video.duration) * 100;
            seekbar.value = percent;
            currentTimeText.innerText = _formatTime(video.currentTime);
            totalDurationText.innerText = _formatTime(video.duration);
        }
    });

    // Controlar Seekbar manualmente
    seekbar.addEventListener('input', () => {
        let time = (seekbar.value / 100) * video.duration;
        video.currentTime = time;
    });

    // Botões -10s e +10s
    document.getElementById('imageview_Backwards').addEventListener('click', () => {
        video.currentTime = Math.max(0, video.currentTime - 10);
    });

    document.getElementById('imageview_Forward').addEventListener('click', () => {
        video.currentTime = Math.min(video.duration, video.currentTime + 10);
    });

    // Botão Tela Cheia / Resize
    document.getElementById('imageview_Resize').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    // Botão PIP (Picture in Picture)
    document.getElementById('imageview_Pip').addEventListener('click', async () => {
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else if (document.pictureInPictureEnabled) {
                await video.requestPictureInPicture();
            }
        } catch (error) {
            console.log("PIP não suportado.");
        }
    });

    // Abrir/Fechar Gaveta de Episódios
    document.getElementById('imageview_Episodes').addEventListener('click', _toggleEpisodios);
});

function _toggleEpisodios() {
    const drawer = document.getElementById('linear_episodes');
    drawer.style.display = drawer.style.display === 'none' ? 'flex' : 'none';
}

function _formatTime(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor(seconds % 60);
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
}
