<?php
require_once 'config.php';

$stmt = $pdo->query("
    SELECT id, participante, personagem, ancestralidade, classe, nivel,
           personagem_imagem, updated_at
    FROM fichas
    ORDER BY updated_at DESC
");
$fichas = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Listar Fichas — Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/home.css?v=20260502" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260503d" />
</head>
<body class="home-body">
    <script src="assets/js/transitions.js?v=20260503d"></script>

    <main class="home-shell home-shell-list">

        <header class="home-hero home-hero-compact">
            <a href="index.php" class="home-back" aria-label="Voltar ao menu">&larr;</a>
            <h1 class="home-title">Fichas Salvas</h1>
            <p class="home-subtitle"><?= count($fichas) ?> registro<?= count($fichas) === 1 ? '' : 's' ?></p>
        </header>

        <?php if (empty($fichas)): ?>
            <section class="home-empty-state">
                <p>Nenhuma ficha encontrada.</p>
                <a class="home-btn" href="ficha.php">Criar primeira ficha</a>
            </section>
        <?php else: ?>
            <section class="home-list">
                <?php foreach ($fichas as $f):
                    $img = $f['personagem_imagem'] ?: '';
                    $nivel = (int) ($f['nivel'] ?? 1);
                ?>
                    <a class="home-card-ficha" href="ficha.php?id=<?= (int) $f['id'] ?>">
                        <div class="home-card-thumb">
                            <?php if ($img): ?>
                                <img src="<?= htmlspecialchars($img) ?>" alt="" />
                            <?php else: ?>
                                <span aria-hidden="true">?</span>
                            <?php endif; ?>
                        </div>
                        <div class="home-card-info">
                            <strong class="home-card-name"><?= htmlspecialchars($f['personagem'] ?: 'Sem nome') ?></strong>
                            <span class="home-card-meta">
                                <?php
                                    $meta = [];
                                    if (!empty($f['ancestralidade'])) $meta[] = htmlspecialchars($f['ancestralidade']);
                                    if (!empty($f['classe']))         $meta[] = htmlspecialchars(ucfirst($f['classe']));
                                    $meta[] = "Nv $nivel";
                                    echo implode(' • ', $meta);
                                ?>
                            </span>
                            <?php if (!empty($f['participante'])): ?>
                                <span class="home-card-player">Jogador: <?= htmlspecialchars($f['participante']) ?></span>
                            <?php endif; ?>
                        </div>
                        <div class="home-card-arrow" aria-hidden="true">&rsaquo;</div>
                    </a>
                <?php endforeach; ?>
            </section>
        <?php endif; ?>

        <div class="home-list-footer">
            <a class="home-btn home-btn-ghost" href="index.php">Voltar</a>
            <a class="home-btn" href="ficha.php">Nova Ficha</a>
        </div>

    </main>

</body>
</html>
