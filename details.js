<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlexPlus - Detalhes</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

    <!-- Navbar / Cabeçalho Unificado -->
    <header class="navbar">
        <div class="logo">Flex<span>PLUS</span></div>
        <nav class="nav-links">
            <a href="index.html" class="nav-item"><i class="fa-solid fa-house"></i><span>Início</span></a>
            <a href="search.html" class="nav-item"><i class="fa-solid fa-magnifying-glass"></i><span>Pesquisar</span></a>
            <a href="favorites.html" class="nav-item"><i class="fa-solid fa-bookmark"></i><span>Favoritos</span></a>
            <a href="settings.html" class="nav-item"><i class="fa-solid fa-gear"></i><span>Configurações</span></a>
        </nav>
        <div class="user-profile">
            <img id="profile-img" src="https://via.placeholder.com/40" alt="Perfil" class="avatar">
            <span id="textview_name">RBzin</span>
        </div>
    </header>

    <!-- Container Principal dos Detalhes -->
    <div class="main-container details-container">
        
        <!-- Top Banner / Backdrop com Degradê Estilo Netflix -->
        <section class="details-banner" id="imageview_backdrop">
            <div class="details-banner-shadow">
                <div class="details-banner-content">
                    <button class="btn-back" onclick="window.history.back()"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
                    
                    <div class="title-row">
                        <h1 id="textview_title">Carregando...</h1>
                        <div class="action-icons">
                            <i class="fa-regular fa-bookmark" id="imageview_favorites" title="Favoritar"></i>
                            <i class="fa-solid fa-share-nodes" id="imageview_share" title="Partilhar"></i>
                        </div>
                    </div>

                    <!-- Meta Tags (Nota, Ano, Views, Idioma, Tamanho) -->
                    <div class="meta-row">
                        <span class="badge-rating"><i class="fa-solid fa-star" style="color: #F71B24;"></i> <span id="textview_rating">0.0</span></span>
                        <span class="meta-item" id="textview_year">2024</span>
                        <span class="meta-item"><i class="fa-solid fa-eye"></i> <span id="textview_views">0</span></span>
                        <span class="badge-lang" id="textview_language">PT</span>
                        <span class="meta-item" id="textview_size"></span>
                    </div>

                    <!-- Botões de Play e Download -->
                    <div class="details-buttons">
                        <button class="btn-play-large" id="linear_play"><i class="fa-solid fa-play"></i> Assistir</button>
                        <button class="btn-download-large" id="linear_download"><i class="fa-solid fa-download"></i> Download</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Sinopse e Gêneros -->
        <section class="details-info-section">
            <p class="genres-text" id="textview_genres" style="color: #F71B24; font-weight: 600; margin-bottom: 10px;"></p>
            <p class="overview-text" id="textview_overview">Carregando sinopse...</p>
        </section>

        <!-- Abas Organizadas (Trailer, Similares, Comentários) -->
        <section class="tabs-section">
            <div class="tab-headers">
                <button class="tab-btn active" onclick="_mudarAba('trailer', event)">Trailer</button>
                <button class="tab-btn" onclick="_mudarAba('similar', event)">Similares</button>
                <button class="tab-btn" onclick="_mudarAba('comments', event)">Comentários</button>
            </div>

            <div class="tab-contents">
                <!-- Aba Trailer -->
                <div class="tab-page active" id="tab_trailer">
                    <div class="video-container" id="trailer_container">
                        <iframe id="trailer_iframe" src="" frameborder="0" allowfullscreen style="width: 100%; height: 450px; border-radius: 10px; display: none;"></iframe>
                        <p id="no_trailer_msg" style="color: #888; padding: 20px; text-align: center;">Nenhum trailer disponível para este título.</p>
                    </div>
                </div>

                <!-- Aba Similares -->
                <div class="tab-page" id="tab_similar">
                    <div class="movie-row" id="recyclerview_similar" style="padding-top: 10px;"></div>
                </div>

                <!-- Aba Comentários -->
                <div class="tab-page" id="tab_comments">
                    <p id="textview_no_comments" style="color: #888; margin-bottom: 15px;">Sem comentários...</p>
                    <div id="recyclerview_comments" class="comments-list"></div>
                    
                    <div class="comment-input-box">
                        <input type="text" id="edittext_comments" placeholder="Escreva um comentário...">
                        <button id="imageview_send"><i class="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        </section>

    </div>

    <!-- Firebase SDKs -->
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>
    <script src="details.js"></script>
</body>
</html>
