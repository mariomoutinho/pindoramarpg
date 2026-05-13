<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/permissions.php';

$usuario = exigirLogin();
$ehFacilitador = ehFacilitadorGlobal();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Painel — Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/home.css?v=20260507d" />
    <link rel="stylesheet" href="assets/css/auth.css?v=20260507a" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260508u" />
</head>
<body class="home-body painel-page">
    <script src="assets/js/transitions.js?v=20260508u"></script>

    <main class="home-shell auth-shell">
        <header class="home-hero home-hero-compact">
            <a href="index.php" class="home-back" aria-label="Voltar ao menu">&larr;</a>
            <h1 class="home-title"><?= $ehFacilitador ? 'Painel do Facilitador' : 'Painel do Participante' ?></h1>
            <p class="home-subtitle">
                Olá, <?= htmlspecialchars($usuario['nome']) ?>
                <span class="auth-role-tag"><?= htmlspecialchars(ucfirst($usuario['role'])) ?></span>
            </p>
        </header>

        <?php if ($ehFacilitador): ?>
            <nav class="home-grid-ref" aria-label="Ações do Facilitador">
                <a class="home-card-ref" href="mesas.php">
                    <strong>Minhas Mesas</strong>
                    <span>Crie e administre suas campanhas.</span>
                </a>
                <a class="home-card-ref" href="mesas.php?focus=participantes">
                    <strong>Participantes</strong>
                    <span>Adicione e vincule jogadores às mesas.</span>
                </a>
                <a class="home-card-ref" href="fichas.php">
                    <strong>Fichas dos Participantes</strong>
                    <span>Personagens criados pelos jogadores.</span>
                </a>
                <a class="home-card-ref" href="mesa-conteudos.php?tipo=npc">
                    <strong>NPCs</strong>
                    <span>Personagens controlados pela mesa.</span>
                </a>
                <a class="home-card-ref" href="bestiario.php">
                    <strong>Bestiário</strong>
                    <span>Criaturas e ameaças.</span>
                </a>
                <a class="home-card-ref" href="mesa-conteudos.php?tipo=magia">
                    <strong>Magias e Poderes</strong>
                    <span>Conteúdos customizados da mesa.</span>
                </a>
                <a class="home-card-ref" href="aventuras.php">
                    <strong>Aventuras</strong>
                    <span>Crie e narre aventuras prontas.</span>
                </a>
                <a class="home-card-ref" href="mesa-conteudos.php?tipo=narrativa">
                    <strong>Narrativas</strong>
                    <span>Cenas e descrições preparadas.</span>
                </a>
                <a class="home-card-ref" href="mesa-jogo.php">
                    <strong>Mapas e Cenas</strong>
                    <span>Mesa de Jogo: tabuleiro, tokens e iniciativa.</span>
                </a>
                <a class="home-card-ref" href="mesa-conteudos.php?visibilidade=participantes">
                    <strong>Conteúdos Liberados</strong>
                    <span>O que os Participantes já podem ver.</span>
                </a>
                <a class="home-card-ref" href="referencia.php">
                    <strong>Acervo</strong>
                    <span>Catálogos e regras do sistema.</span>
                </a>
            </nav>
        <?php else: ?>
            <nav class="home-grid-ref" aria-label="Ações do Participante">
                <a class="home-card-ref" href="ficha.php">
                    <strong>Minha Ficha</strong>
                    <span>Crie ou edite seu personagem.</span>
                </a>
                <a class="home-card-ref" href="fichas.php">
                    <strong>Minhas Fichas</strong>
                    <span>Personagens salvos.</span>
                </a>
                <a class="home-card-ref" href="referencia.php">
                    <strong>Acervo</strong>
                    <span>Consulte regras e catálogos.</span>
                </a>
            </nav>
        <?php endif; ?>

        <div class="home-list-footer auth-footer">
            <a class="home-btn home-btn-ghost" href="index.php">Voltar ao menu</a>
            <a class="home-btn" href="logout.php">Sair</a>
        </div>
    </main>
</body>
</html>
