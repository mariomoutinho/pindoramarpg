<?php
function garantirHelperDivindadesPrimario(string $primario, string $fallback): void
{
    if (is_file($primario) || !is_file($fallback)) {
        return;
    }

    $dir = dirname($primario);
    if (!is_dir($dir)) {
        @mkdir($dir, 0755);
    }
    if (is_dir($dir) && is_writable($dir)) {
        @copy($fallback, $primario);
    }
}

try {
    garantirHelperDivindadesPrimario(__DIR__ . '/lib/divindades.php', __DIR__ . '/includes/divindades.php');
    garantirHelperDivindadesPrimario(__DIR__ . '/lib/origens.php', __DIR__ . '/includes/origens.php');

    $divindadesLib = is_file(__DIR__ . '/lib/divindades.php')
        ? __DIR__ . '/lib/divindades.php'
        : __DIR__ . '/includes/divindades.php';
    $origensLib = is_file(__DIR__ . '/lib/origens.php')
        ? __DIR__ . '/lib/origens.php'
        : __DIR__ . '/includes/origens.php';

    require_once $divindadesLib;
    require_once $origensLib;

    if (!function_exists('carregarDivindades')) {
        throw new RuntimeException('Função carregarDivindades() indisponível após carregar lib/divindades.php.');
    }
    if (!function_exists('indexarPoderesGerais')) {
        throw new RuntimeException('Função indexarPoderesGerais() indisponível após carregar lib/origens.php.');
    }

    $dados = carregarDivindades();
    $divindades = $dados['divindades'] ?? [];
    $introducao = $dados['introducao'] ?? [];
    $regras = $dados['regras'] ?? [];

    $idx = indexarPoderesGerais();
} catch (\Throwable $e) {
    error_log('[divindades.php] erro interno (' . get_class($e) . '): ' . $e->getMessage()
        . ' em ' . $e->getFile() . ':' . $e->getLine());
    http_response_code(500);
    echo '<!doctype html><meta charset="utf-8"><title>Erro</title>';
    echo '<h1>Erro ao carregar Divindades</h1>';
    echo '<p>Ocorreu um erro interno. Consulte o Error Log do servidor para detalhes.</p>';
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Divindades — Pindorama RPG</title>
    <link rel="stylesheet" href="assets/css/ficha.css?v=20260430" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
    <link rel="stylesheet" href="assets/css/divindades.css?v=20260430" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260508u" />
</head>
<body>
    <script src="assets/js/transitions.js?v=20260508u"></script>
    <main class="page-wrapper classes-page">
        <header class="top-actions classes-topbar">
            <div>
                <h1 class="titulo-cordel">Divindades</h1>
                <p>Os deuses de Pindorama, seus devotos, poderes concedidos e obrigações.</p>
            </div>
            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="referencia.php">Acervo</a>
            </div>
        </header>

        <section class="classes-layout">
            <aside class="classes-sidebar panel" id="classesSidebar">
                <div class="sidebar-mobile-head"><div class="panel-title">Navegação</div></div>
                <div class="sidebar-content" id="mobileSidebarContent">
                    <input type="search" id="classesSearch" placeholder="Buscar..." class="classes-search" />
                    <nav class="classes-toc" id="classesToc">
                        <a class="toc-link toc-level-2" href="#introducao">Introdução</a>
                        <a class="toc-link toc-level-2" href="#regras">Regras de Devoção</a>
                        <a class="toc-link toc-level-2" href="#tabela-divindades">Tabela 1-19: Divindades</a>
                        <a class="toc-link toc-level-2" href="#detalhes">Divindades em detalhe</a>
                        <?php foreach ($divindades as $d): ?>
                            <a class="toc-link toc-level-3" href="#div-<?= htmlspecialchars($d['id']) ?>">
                                <?= htmlspecialchars($d['nome']) ?>
                            </a>
                        <?php endforeach; ?>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content">

                <section id="introducao" class="content-section">
                    <h2>Introdução</h2>
                    <?php foreach ($introducao as $par): ?>
                        <p><?= htmlspecialchars($par) ?></p>
                    <?php endforeach; ?>
                </section>

                <section id="regras" class="content-section">
                    <h2>Regras de Devoção</h2>
                    <?php foreach ($regras as $chave => $texto): ?>
                        <p><strong><?= htmlspecialchars(ucfirst($chave)) ?>.</strong> <?= htmlspecialchars($texto) ?></p>
                    <?php endforeach; ?>
                </section>

                <section id="tabela-divindades" class="content-section">
                    <h2>Tabela 1-19: Divindades</h2>
                    <div class="classes-table-wrap">
                        <table class="classes-table">
                            <thead>
                                <tr>
                                    <th>Divindade</th>
                                    <th>Energia</th>
                                    <th>Poderes Concedidos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($divindades as $d): ?>
                                <tr>
                                    <td>
                                        <a href="#div-<?= htmlspecialchars($d['id']) ?>"><?= htmlspecialchars($d['nome']) ?></a>
                                    </td>
                                    <td><?= htmlspecialchars(ucfirst($d['energia'] ?? '')) ?></td>
                                    <td>
                                        <?php
                                        $nomes = [];
                                        foreach ($d['poderes'] ?? [] as $pid) {
                                            $nomes[] = $idx[$pid]['nome'] ?? $pid;
                                        }
                                        echo htmlspecialchars(implode(', ', $nomes));
                                        ?>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="detalhes" class="content-section">
                    <h2>Divindades em detalhe</h2>
                </section>

                <?php foreach ($divindades as $d): ?>
                <section id="div-<?= htmlspecialchars($d['id']) ?>" class="content-section divindade-detalhe">
                    <h2><?= htmlspecialchars($d['nome']) ?></h2>
                    <span class="divindade-saudacao-grande"><?= htmlspecialchars($d['saudacao'] ?? '') ?></span>
                    <p><?= htmlspecialchars($d['descricao'] ?? '') ?></p>

                    <p><strong>Crenças e Objetivos.</strong> <?= htmlspecialchars($d['crencas'] ?? '') ?></p>
                    <p><strong>Símbolo Sagrado.</strong> <?= htmlspecialchars($d['simbolo'] ?? '') ?></p>
                    <p><strong>Canalizar Energia.</strong>
                        <?= htmlspecialchars(ucfirst($d['energia'] ?? '')) ?>
                        <?php if (!empty($d['energia_opcoes'])): ?>
                            (escolha entre: <?= htmlspecialchars(implode(', ', $d['energia_opcoes'])) ?>)
                        <?php endif; ?>
                    </p>
                    <p><strong>Arma Preferida.</strong> <?= htmlspecialchars($d['arma_preferida'] ?? '') ?></p>
                    <p>
                        <strong>Devotos.</strong>
                        <?php
                        $racas = $d['devotos']['racas'] ?? [];
                        $classes = $d['devotos']['classes'] ?? [];
                        echo htmlspecialchars(
                            (empty($racas) ? '' : implode(', ', $racas)) .
                            (!empty($racas) && !empty($classes) ? '. ' : '') .
                            (empty($classes) ? '' : implode(', ', $classes))
                        );
                        ?>.
                    </p>

                    <p><strong>Obrigações & Restrições.</strong> <?= htmlspecialchars($d['obrigacoes'] ?? '') ?></p>

                    <h3>Poderes Concedidos</h3>
                    <?php foreach ($d['poderes'] ?? [] as $pid):
                        $p = $idx[$pid] ?? null;
                        if (!$p) continue;
                    ?>
                        <div class="divindade-poder-bloco">
                            <h4><?= htmlspecialchars($p['nome']) ?></h4>
                            <p><?= htmlspecialchars($p['descricao']) ?></p>
                        </div>
                    <?php endforeach; ?>
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
