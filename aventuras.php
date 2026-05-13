<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/permissions.php';
require_once __DIR__ . '/includes/mesa-helpers.php';
require_once __DIR__ . '/includes/aventuras-helpers.php';

$usuario = exigirLogin();
exigirFacilitador('o módulo Aventuras é exclusivo do Facilitador');

$flash = $_GET['msg']  ?? null;
$flashType = $_GET['type'] ?? 'info';
$lista = listarAventurasDoUsuario((int) $usuario['id']);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Aventuras — Pindorama RPG</title>
    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/home.css?v=20260507d" />
    <link rel="stylesheet" href="assets/css/auth.css?v=20260507a" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260508u" />
    <link rel="stylesheet" href="assets/css/painel-facilitador.css?v=20260508a" />
    <link rel="stylesheet" href="assets/css/aventuras.css?v=20260512a" />
</head>
<body class="home-body aventuras-page">
    <script src="assets/js/transitions.js?v=20260508u"></script>

    <main class="home-shell painel-shell">
        <header class="home-hero home-hero-compact">
            <a href="painel.php" class="home-back" aria-label="Voltar ao painel">&larr;</a>
            <h1 class="home-title">Aventuras</h1>
            <p class="home-subtitle">Crie e narre aventuras prontas. Visíveis apenas para você.</p>
            <div class="aventuras-topbar-actions">
                <a class="aventuras-btn aventuras-btn--primary" href="aventura-editor.php">+ Nova aventura</a>
            </div>
        </header>

        <?php if ($flash): ?>
            <div class="painel-flash painel-flash--<?= htmlspecialchars($flashType) ?>">
                <?= htmlspecialchars($flash) ?>
            </div>
        <?php endif; ?>

        <?php if (empty($lista)): ?>
            <section class="aventuras-empty">
                <div class="aventuras-empty-card">
                    <span class="aventuras-empty-glyph" aria-hidden="true">&#9876;</span>
                    <h2>Nenhuma aventura por aqui ainda</h2>
                    <p>Reúna seus papiros, escolha uma capa e comece a escrever a primeira saga deste Facilitador.</p>
                    <a class="aventuras-btn aventuras-btn--primary aventuras-btn--lg" href="aventura-editor.php">Criar primeira aventura</a>
                </div>
            </section>
        <?php else: ?>
            <section class="aventuras-grid" aria-label="Lista de aventuras">
                <?php foreach ($lista as $a): ?>
                    <?php
                        $capa = urlCapaAventuraOuPlaceholder($a['capa_path'] ?? null);
                        $temCapa = !empty($a['capa_path']);
                        $titulo = htmlspecialchars($a['titulo'] ?? 'Aventura sem título');
                        $subtitulo = htmlspecialchars($a['subtitulo'] ?? '');
                        $sinopse = htmlspecialchars(mb_substr((string) ($a['sinopse'] ?? ''), 0, 220));
                        $sistema = htmlspecialchars($a['sistema'] ?? '');
                        $nivel = htmlspecialchars($a['nivel_sugerido'] ?? '');
                        $status = htmlspecialchars(rotuloStatusAventura($a['status']));
                        $dt = $a['updated_at'] ?: $a['created_at'];
                        $dtFmt = $dt ? date('d/m/Y', strtotime($dt)) : '';
                    ?>
                    <article class="aventura-card<?= $temCapa ? '' : ' is-no-cover' ?>">
                        <a class="aventura-card-cover" href="aventura-ver.php?id=<?= (int) $a['id'] ?>" aria-label="Abrir aventura <?= $titulo ?>">
                            <img src="<?= htmlspecialchars($capa) ?>" alt="" loading="lazy" />
                        </a>
                        <div class="aventura-card-body">
                            <header class="aventura-card-head">
                                <h3 class="aventura-card-title"><?= $titulo ?></h3>
                                <?php if ($subtitulo !== ''): ?>
                                    <p class="aventura-card-subtitle"><?= $subtitulo ?></p>
                                <?php endif; ?>
                            </header>
                            <?php if ($sinopse !== ''): ?>
                                <p class="aventura-card-sinopse"><?= $sinopse ?><?= mb_strlen((string) ($a['sinopse'] ?? '')) > 220 ? '…' : '' ?></p>
                            <?php endif; ?>
                            <div class="aventura-card-meta">
                                <?php if ($sistema !== ''): ?><span class="aventura-meta-tag">Sistema: <?= $sistema ?></span><?php endif; ?>
                                <?php if ($nivel   !== ''): ?><span class="aventura-meta-tag">Nível: <?= $nivel ?></span><?php endif; ?>
                                <span class="aventura-meta-tag aventura-meta-status aventura-meta-status--<?= htmlspecialchars($a['status']) ?>"><?= $status ?></span>
                                <?php if ($dtFmt   !== ''): ?><span class="aventura-meta-tag aventura-meta-date">Atualizado em <?= $dtFmt ?></span><?php endif; ?>
                            </div>
                            <footer class="aventura-card-actions">
                                <a class="aventuras-btn" href="aventura-ver.php?id=<?= (int) $a['id'] ?>">Abrir</a>
                                <a class="aventuras-btn" href="aventura-editor.php?id=<?= (int) $a['id'] ?>">Editar</a>
                                <form method="post" action="excluir-aventura.php"
                                      class="aventura-card-delete-form"
                                      data-confirm="Excluir definitivamente a aventura &laquo;<?= $titulo ?>&raquo;? Esta ação não pode ser desfeita."
                                      onsubmit="return confirmarExclusaoAventura(event);">
                                    <input type="hidden" name="csrf" value="<?= htmlspecialchars(tokenCsrf()) ?>" />
                                    <input type="hidden" name="id"   value="<?= (int) $a['id'] ?>" />
                                    <button type="submit" class="aventuras-btn aventuras-btn--danger">Excluir</button>
                                </form>
                            </footer>
                        </div>
                    </article>
                <?php endforeach; ?>
            </section>
        <?php endif; ?>
    </main>

    <!-- Modal de confirmação (sem confirm() nativo) -->
    <div class="aventuras-confirm-backdrop" id="aventurasConfirm" hidden>
        <div class="aventuras-confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="aventurasConfirmTitle">
            <header>
                <h3 id="aventurasConfirmTitle">Confirmar exclusão</h3>
                <button type="button" class="aventuras-confirm-x" aria-label="Cancelar">&times;</button>
            </header>
            <div class="aventuras-confirm-body" id="aventurasConfirmBody"></div>
            <footer>
                <button type="button" class="aventuras-btn aventuras-confirm-cancel">Cancelar</button>
                <button type="button" class="aventuras-btn aventuras-btn--danger aventuras-confirm-ok">Excluir</button>
            </footer>
        </div>
    </div>
    <script src="assets/js/aventuras.js?v=20260512a"></script>
</body>
</html>
