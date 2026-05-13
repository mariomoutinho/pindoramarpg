<?php
require_once __DIR__ . '/lib/origens.php';

$dadosOrigens = carregarOrigens();
$idxPoderes   = indexarPoderesGerais();

$introducao = $dadosOrigens['introducao'] ?? [];
$regras     = $dadosOrigens['regras']     ?? [];
$origens    = $dadosOrigens['origens']    ?? [];

$nomeAtributo = [
    'for' => 'Força',
    'des' => 'Destreza',
    'con' => 'Constituição',
    'int' => 'Inteligência',
    'sab' => 'Sabedoria',
    'car' => 'Carisma',
];
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Origens — Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css?v=20260430" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
    <link rel="stylesheet" href="assets/css/origens.css?v=20260430" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260508u" />
</head>
<body>
    <script src="assets/js/transitions.js?v=20260508u"></script>
    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1 class="titulo-cordel">Origens</h1>
                <p>O que você fazia antes de se aventurar — escolha seus benefícios e poder único.</p>
            </div>
            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="referencia.php">Acervo</a>
            </div>
        </header>

        <section class="classes-layout">
            <aside class="classes-sidebar panel" id="classesSidebar">
                <div class="sidebar-mobile-head">
                    <div class="panel-title">Navegação</div>
                </div>
                <div class="sidebar-content" id="mobileSidebarContent">
                    <input type="search" id="classesSearch" placeholder="Buscar nesta página..." class="classes-search" />
                    <nav class="classes-toc" id="classesToc">
                        <a class="toc-link toc-level-2" href="#introducao">Introdução</a>
                        <a class="toc-link toc-level-2" href="#regras">Regras</a>
                        <a class="toc-link toc-level-2" href="#tabela-origens">Tabela 1-18: Origens</a>
                        <a class="toc-link toc-level-2" href="#detalhes">Origens em detalhe</a>
                        <?php foreach ($origens as $o): ?>
                            <a class="toc-link toc-level-3" href="#origem-<?= htmlspecialchars($o['id']) ?>">
                                <?= htmlspecialchars($o['nome']) ?>
                            </a>
                        <?php endforeach; ?>
                        <a class="toc-link toc-level-2" href="#sua-origem">Sua Própria Origem</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="introducao" class="content-section">
                    <h2>Introdução</h2>
                    <?php foreach ($introducao as $par): ?>
                        <p><?= htmlspecialchars($par) ?></p>
                    <?php endforeach; ?>
                </section>

                <section id="regras" class="content-section">
                    <h2>Regras</h2>
                    <?php if (!empty($regras['modificadores'])): ?>
                        <p><strong>Modificadores de Atributo.</strong> <?= htmlspecialchars($regras['modificadores']) ?></p>
                    <?php endif; ?>
                    <?php if (!empty($regras['itens'])): ?>
                        <p><strong>Itens de Origem.</strong> <?= htmlspecialchars($regras['itens']) ?></p>
                    <?php endif; ?>
                    <?php if (!empty($regras['beneficios'])): ?>
                        <p><strong>Benefícios.</strong> <?= htmlspecialchars($regras['beneficios']) ?></p>
                    <?php endif; ?>
                    <?php if (!empty($regras['poder_unico'])): ?>
                        <p><strong>Poder Único.</strong> <?= htmlspecialchars($regras['poder_unico']) ?></p>
                    <?php endif; ?>
                </section>

                <section id="tabela-origens" class="content-section">
                    <h2>Tabela 1-18: Origens</h2>
                    <div class="classes-table-wrap">
                        <table class="classes-table">
                            <thead>
                                <tr>
                                    <th>Origem</th>
                                    <th>Benefícios</th>
                                    <th>Atributos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($origens as $o): ?>
                                <tr>
                                    <td>
                                        <a href="#origem-<?= htmlspecialchars($o['id']) ?>">
                                            <?= htmlspecialchars($o['nome']) ?>
                                        </a>
                                    </td>
                                    <td>
                                        <?php
                                        $linha = [];
                                        if (!empty($o['pericias'])) {
                                            $linha[] = implode(', ', $o['pericias']);
                                        }
                                        $nomesPoderes = [];
                                        foreach ($o['poderes'] ?? [] as $pid) {
                                            $nomesPoderes[] = $idxPoderes[$pid]['nome'] ?? $pid;
                                        }
                                        if ($nomesPoderes) $linha[] = implode(', ', $nomesPoderes);
                                        echo htmlspecialchars(implode('; ', $linha));
                                        ?>
                                    </td>
                                    <td>
                                        <?php
                                        $sigs = array_map(fn($a) => $nomeAtributo[$a] ?? strtoupper($a), $o['atributos'] ?? []);
                                        echo htmlspecialchars(count($sigs) === 6 ? 'Todos' : implode(' / ', $sigs));
                                        ?>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="detalhes" class="content-section">
                    <h2>Origens em detalhe</h2>
                    <p>Cada origem traz uma descrição, modificadores de atributo, itens iniciais, benefícios escolhíveis e um poder único exclusivo.</p>
                </section>

                <?php foreach ($origens as $o): ?>
                <section id="origem-<?= htmlspecialchars($o['id']) ?>" class="content-section origem-detalhe">
                    <h2><?= htmlspecialchars($o['nome']) ?></h2>
                    <p><?= htmlspecialchars($o['descricao']) ?></p>

                    <p>
                        <strong>Modificadores de Atributos.</strong>
                        <?php
                        $sigs = array_map(fn($a) => $nomeAtributo[$a] ?? strtoupper($a), $o['atributos'] ?? []);
                        echo htmlspecialchars(count($sigs) === 6 ? 'Qualquer um.' : implode(' ou ', $sigs) . '.');
                        ?>
                    </p>

                    <p>
                        <strong>Itens.</strong>
                        <?= htmlspecialchars(implode('; ', $o['itens'] ?? [])) ?>.
                    </p>

                    <p>
                        <strong>Benefícios.</strong>
                        <?php
                        $partes = [];
                        if (!empty($o['pericias'])) {
                            $partes[] = implode(', ', $o['pericias']) . ' (perícias)';
                        }
                        $nomesPoderes = [];
                        foreach ($o['poderes'] ?? [] as $pid) {
                            $nomesPoderes[] = $idxPoderes[$pid]['nome'] ?? $pid;
                        }
                        if ($nomesPoderes) {
                            $partes[] = implode(', ', $nomesPoderes) . ' (poderes)';
                        }
                        echo htmlspecialchars(implode('; ', $partes));
                        ?>.
                    </p>

                    <?php if (!empty($o['observacao'])): ?>
                        <p><em><?= htmlspecialchars($o['observacao']) ?></em></p>
                    <?php endif; ?>

                    <?php
                    // Poderes únicos da origem (categoria origem) com descrição
                    $unicos = [];
                    foreach ($o['poderes'] ?? [] as $pid) {
                        $p = $idxPoderes[$pid] ?? null;
                        if ($p && ($p['categoria'] ?? '') === 'origem') $unicos[] = $p;
                    }
                    ?>
                    <?php foreach ($unicos as $u): ?>
                        <div class="origem-poder-unico">
                            <h3><?= htmlspecialchars($u['nome']) ?></h3>
                            <p><?= htmlspecialchars($u['descricao']) ?></p>
                        </div>
                    <?php endforeach; ?>
                </section>
                <?php endforeach; ?>

                <section id="sua-origem" class="content-section">
                    <h2>Sua Própria Origem</h2>
                    <p>Uma origem é algo que você pode ajustar em negociação com o mestre, a fim de alinhá-la melhor com a história que você concebeu para o seu personagem. Você pode trocar perícias, itens ou até inventar uma habilidade nova usando outras como referência. Em Pindorama, nenhum herói é considerado estranho demais — a origem é o espaço para a criatividade do jogador.</p>
                </section>

            </article>
        </section>
    </main>

    <button type="button" class="mobile-menu-toggle" id="mobileMenuToggle" aria-expanded="false" aria-controls="mobileSidebarContent" aria-label="Abrir menu de navegação">
        <span></span><span></span><span></span>
    </button>
    <button type="button" class="back-to-top-btn" id="backToTopBtn" aria-label="Voltar ao topo" title="Voltar ao topo">↑</button>
    <script src="assets/js/classes.js?v=20260503j"></script>
</body>
</html>
