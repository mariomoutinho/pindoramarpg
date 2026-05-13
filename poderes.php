<?php
$dadosPoderes = json_decode(file_get_contents(__DIR__ . '/data/poderes-gerais.json'), true);
$categoriasPoderes = $dadosPoderes['categorias'] ?? [];
$introducaoPoderes = $dadosPoderes['introducao'] ?? [];
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Poderes Gerais - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css?v=20260430" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
    <link rel="stylesheet" href="assets/css/poderes.css?v=20260503a" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260508u" />
</head>
<body>
    <script src="assets/js/transitions.js?v=20260508u"></script>

    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1 class="titulo-cordel">Poderes Gerais</h1>
                <p>Consulta de poderes universais por categoria</p>
            </div>

            <div class="actions">
                <a href="index.php" class="system-link-btn">Menu</a>
                <a class="system-link-btn" href="referencia.php">Acervo</a>
            </div>
        </header>

        <section class="classes-layout">

            <aside class="classes-sidebar panel" id="classesSidebar">
                <div class="sidebar-mobile-head"><div class="panel-title">Navegação</div></div>

                <div class="sidebar-content" id="mobileSidebarContent">
                    <input type="search" id="classesSearch" placeholder="Buscar nesta página..." class="classes-search" />
                    <nav class="classes-toc" id="classesToc">
                        <a class="toc-link toc-level-2" href="#regras-uso">Regras de Uso</a>
                        <?php foreach ($categoriasPoderes as $categoria): ?>
                            <a class="toc-link toc-level-2" href="#cat-<?= htmlspecialchars($categoria['id'] ?? '') ?>">
                                <?= htmlspecialchars($categoria['nome'] ?? '') ?>
                            </a>
                        <?php endforeach; ?>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content poderes-page" id="classesContent">

                <section class="panel content-section poderes-page-regras" id="regras-uso">
                    <div class="panel-title">Regras de uso</div>
                    <div class="poderes-page-intro">
                        <?php foreach ($introducaoPoderes as $paragrafo): ?>
                            <p><?= htmlspecialchars($paragrafo) ?></p>
                        <?php endforeach; ?>
                    </div>
                </section>

                <?php foreach ($categoriasPoderes as $indice => $categoria): ?>
                    <section class="panel poderes-page-categoria content-section" id="cat-<?= htmlspecialchars($categoria['id'] ?? '') ?>">
                        <details <?= $indice === 0 ? 'open' : '' ?>>
                            <summary class="poderes-page-summary">
                                <span>
                                    <strong><?= htmlspecialchars($categoria['nome'] ?? '') ?></strong>
                                    <small><?= htmlspecialchars($categoria['descricao'] ?? '') ?></small>
                                </span>
                                <em><?= count($categoria['poderes'] ?? []) ?> poderes</em>
                            </summary>

                            <div class="poderes-page-lista">
                                <?php foreach (($categoria['poderes'] ?? []) as $poder): ?>
                                    <article class="poderes-page-card">
                                        <h3><?= htmlspecialchars($poder['nome'] ?? '') ?></h3>
                                        <p><?= htmlspecialchars($poder['descricao'] ?? '') ?></p>

                                        <?php if (!empty($poder['prerequisito_texto'])): ?>
                                            <div class="poderes-page-prereq">
                                                <strong>Pré-requisitos:</strong>
                                                <span><?= htmlspecialchars($poder['prerequisito_texto']) ?></span>
                                            </div>
                                        <?php endif; ?>
                                    </article>
                                <?php endforeach; ?>
                            </div>
                        </details>
                    </section>
                <?php endforeach; ?>

            </article>

        </section>

    </main>

    <button type="button" class="mobile-menu-toggle" id="mobileMenuToggle"
            aria-expanded="false" aria-controls="mobileSidebarContent" aria-label="Abrir menu de navegação">
        <span></span><span></span><span></span>
    </button>

    <button type="button" class="back-to-top-btn" id="backToTopBtn" aria-label="Voltar ao topo" title="Voltar ao topo">↑</button>

    <script src="assets/js/classes.js?v=20260503j"></script>
</body>
</html>
