<?php
require_once __DIR__ . '/includes/auth.php';

iniciarSessao();
$usuario = usuarioLogado();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/home.css?v=20260507d" />
    <link rel="stylesheet" href="assets/css/auth.css?v=20260507a" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260508k" />
</head>
<body class="home-body">
    <script src="assets/js/transitions.js?v=20260508k"></script>

    <main class="home-shell home-shell-home">

        <section class="home-hero">
            <div class="home-logo-frame">
                <img src="assets/img/branding/pindorama-logo-nova.png" alt="Logo do Pindorama RPG" />
            </div>
        </section>

        <div class="home-auth-status">
            <?php if ($usuario): ?>
                <span>
                    Olá, <strong><?= htmlspecialchars($usuario['nome']) ?></strong>
                    <span class="auth-role-tag"><?= htmlspecialchars(ucfirst($usuario['role'])) ?></span>
                </span>
                <a class="home-auth-link" href="painel.php">Meu painel</a>
                <a class="home-auth-link" href="logout.php">Sair</a>
            <?php else: ?>
                <a class="home-auth-link" href="login.php">Entrar</a>
                <a class="home-auth-link" href="register.php">Criar conta</a>
            <?php endif; ?>
        </div>

        <nav class="home-grid-ref home-grid-home" aria-label="Menu principal">
            <a class="home-card-ref home-card-home home-card-nova-ficha" href="ficha.php">
                <strong>Nova Ficha</strong>
                <span>Crie um novo personagem.</span>
            </a>
            <a class="home-card-ref home-card-home home-card-listar-fichas" href="fichas.php">
                <strong>Listar Fichas</strong>
                <span>Veja personagens salvos.</span>
            </a>
            <a class="home-card-ref home-card-home home-card-campo-batalha" href="mesa-jogo.php">
                <strong>Mesa de Jogo</strong>
                <span>Cenas em grid, mapas e tokens.</span>
            </a>
            <a class="home-card-ref home-card-home home-card-acervo" href="referencia.php">
                <strong>Acervo</strong>
                <span>Catálogos e regras do sistema.</span>
            </a>
        </nav>

    </main>

</body>
</html>
