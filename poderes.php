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
    <link rel="stylesheet" href="assets/css/poderes.css?v=20260430b" />
</head>
<body>

    <main class="page-wrapper">

        <header class="top-actions">
            <div>
                <h1>Poderes Gerais</h1>
                <p>Consulta de poderes universais por categoria</p>
            </div>

            <div class="actions">
                <a href="index.php" class="system-link-btn">Menu</a>
                <a href="ficha.php" class="system-link-btn">Ficha</a>
            </div>
        </header>

        <section class="sheet poderes-page">
            <section class="panel">
                <div class="panel-title">Regras de uso</div>

                <div class="poderes-page-intro">
                    <?php foreach ($introducaoPoderes as $paragrafo): ?>
                        <p><?= htmlspecialchars($paragrafo) ?></p>
                    <?php endforeach; ?>
                </div>
            </section>

            <?php foreach ($categoriasPoderes as $indice => $categoria): ?>
                <section class="panel poderes-page-categoria">
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
        </section>

    </main>

</body>
</html>
