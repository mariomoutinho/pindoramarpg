<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/permissions.php';
require_once __DIR__ . '/includes/mesa-helpers.php';
require_once __DIR__ . '/config.php';

$usuario = exigirLogin();
exigirFacilitador('a área de conteúdos da mesa é exclusiva do Facilitador');

$tiposValidos = ['npc','aventura','narrativa','magia','poder'];
$tipo = $_GET['tipo'] ?? 'npc';
if (!in_array($tipo, $tiposValidos, true)) $tipo = 'npc';

$visFiltro = $_GET['visibilidade'] ?? null;
if ($visFiltro !== null && !in_array($visFiltro, ['privado','participantes','publico'], true)) {
    $visFiltro = null;
}

$mesaIdFiltro = isset($_GET['mesa_id']) ? (int) $_GET['mesa_id'] : null;
$editId = isset($_GET['edit']) ? (int) $_GET['edit'] : 0;

$flash = $_GET['msg'] ?? null;
$flashType = $_GET['type'] ?? 'info';

$mesas = listarMesasDoFacilitador((int) $usuario['id']);
$conteudos = listarConteudosDaMesa(
    $mesaIdFiltro,
    $visFiltro ? null : $tipo, // no filtro "Liberados" cruzamos todos os tipos
    $visFiltro,
    (int) $usuario['id']
);

$emEdicao = null;
if ($editId > 0) {
    $candidato = carregarConteudo($editId);
    if ($candidato) {
        $mesaDoConteudo = carregarMesa((int) $candidato['mesa_id']);
        if ($mesaDoConteudo && (int) $mesaDoConteudo['facilitador_id'] === (int) $usuario['id']) {
            $emEdicao = $candidato;
            $tipo = $candidato['tipo'];
        }
    }
}

$csrf = tokenCsrf();
$rotuloTipo = rotuloTipoConteudo($tipo);
$tituloPagina = $visFiltro ? 'Conteúdos liberados' : ($rotuloTipo . ($tipo === 'npc' ? 's' : 's'));
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= htmlspecialchars($tituloPagina) ?> — Pindorama RPG</title>
    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/home.css?v=20260507d" />
    <link rel="stylesheet" href="assets/css/auth.css?v=20260507a" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260503d" />
    <link rel="stylesheet" href="assets/css/painel-facilitador.css?v=20260508a" />
</head>
<body class="home-body">
    <script src="assets/js/transitions.js?v=20260503d"></script>

    <main class="home-shell painel-shell">
        <header class="home-hero home-hero-compact">
            <a href="painel.php" class="home-back" aria-label="Voltar ao painel">&larr;</a>
            <h1 class="home-title"><?= htmlspecialchars($tituloPagina) ?></h1>
            <p class="home-subtitle">
                <?php if ($visFiltro): ?>
                    Itens com visibilidade <strong><?= htmlspecialchars(rotuloVisibilidade($visFiltro)) ?></strong>.
                <?php else: ?>
                    Tipo: <strong><?= htmlspecialchars($rotuloTipo) ?></strong>.
                <?php endif; ?>
            </p>
        </header>

        <?php if ($flash): ?>
            <div class="painel-flash painel-flash--<?= htmlspecialchars($flashType) ?>">
                <?= htmlspecialchars($flash) ?>
            </div>
        <?php endif; ?>

        <?php if (!$visFiltro): ?>
        <nav class="painel-tipo-tabs">
            <?php foreach ($tiposValidos as $t): ?>
                <a href="mesa-conteudos.php?tipo=<?= $t ?>" class="<?= $t === $tipo ? 'is-active' : '' ?>">
                    <?= htmlspecialchars(rotuloTipoConteudo($t)) ?>
                </a>
            <?php endforeach; ?>
        </nav>
        <?php endif; ?>

        <section class="painel-grid">
            <?php if (!$visFiltro): ?>
            <article class="painel-card">
                <h2><?= $emEdicao ? 'Editar' : 'Novo' ?> <?= htmlspecialchars($rotuloTipo) ?></h2>
                <?php if (empty($mesas)): ?>
                    <p class="painel-empty">Crie uma <a href="mesas.php">mesa</a> antes.</p>
                <?php else: ?>
                <form method="post" action="salvar-mesa-conteudo.php" class="painel-form">
                    <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>" />
                    <?php if ($emEdicao): ?>
                        <input type="hidden" name="id" value="<?= (int) $emEdicao['id'] ?>" />
                    <?php endif; ?>
                    <input type="hidden" name="tipo" value="<?= htmlspecialchars($tipo) ?>" />

                    <label>Mesa
                        <select name="mesa_id" required>
                            <?php foreach ($mesas as $m):
                                $sel = $emEdicao ? ((int) $emEdicao['mesa_id'] === (int) $m['id']) : false;
                            ?>
                                <option value="<?= (int) $m['id'] ?>"<?= $sel ? ' selected' : '' ?>>
                                    <?= htmlspecialchars($m['nome']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </label>
                    <label>Título
                        <input type="text" name="titulo" required maxlength="180"
                               value="<?= htmlspecialchars($emEdicao['titulo'] ?? '') ?>" />
                    </label>
                    <label>Descrição
                        <textarea name="descricao" rows="6"><?= htmlspecialchars($emEdicao['descricao'] ?? '') ?></textarea>
                    </label>
                    <label>Visibilidade
                        <select name="visibilidade">
                            <?php $vis = $emEdicao['visibilidade'] ?? 'privado'; ?>
                            <option value="privado"<?= $vis === 'privado' ? ' selected' : '' ?>>Privado (só o Facilitador)</option>
                            <option value="participantes"<?= $vis === 'participantes' ? ' selected' : '' ?>>Liberar para Participantes</option>
                            <option value="publico"<?= $vis === 'publico' ? ' selected' : '' ?>>Público da mesa</option>
                        </select>
                    </label>
                    <div class="painel-form-actions">
                        <button type="submit" class="home-btn"><?= $emEdicao ? 'Salvar' : 'Criar' ?></button>
                        <?php if ($emEdicao): ?>
                            <a href="mesa-conteudos.php?tipo=<?= htmlspecialchars($tipo) ?>" class="home-btn home-btn-ghost">Cancelar</a>
                        <?php endif; ?>
                    </div>
                </form>
                <?php endif; ?>
            </article>
            <?php endif; ?>

            <article class="painel-card painel-card--wide">
                <h2>Lista (<?= count($conteudos) ?>)</h2>
                <?php if (empty($conteudos)): ?>
                    <p class="painel-empty">Nada por aqui ainda.</p>
                <?php else: ?>
                    <ul class="painel-list">
                        <?php foreach ($conteudos as $c): ?>
                            <li class="painel-item painel-item--row">
                                <div>
                                    <strong><?= htmlspecialchars($c['titulo']) ?></strong>
                                    <span class="painel-item-meta">
                                        <?= htmlspecialchars(rotuloTipoConteudo($c['tipo'])) ?>
                                        · <?= htmlspecialchars($c['mesa_nome']) ?>
                                        · <span class="painel-vis painel-vis--<?= htmlspecialchars($c['visibilidade']) ?>">
                                            <?= htmlspecialchars(rotuloVisibilidade($c['visibilidade'])) ?>
                                        </span>
                                    </span>
                                    <?php if (!empty($c['descricao'])): ?>
                                        <p class="painel-item-desc"><?= nl2br(htmlspecialchars(mb_strimwidth((string)$c['descricao'], 0, 240, '…'))) ?></p>
                                    <?php endif; ?>
                                </div>
                                <div class="painel-item-actions">
                                    <a class="painel-mini-btn" href="mesa-conteudos.php?tipo=<?= htmlspecialchars($c['tipo']) ?>&edit=<?= (int) $c['id'] ?>">Editar</a>
                                    <form method="post" action="alternar-visibilidade-conteudo.php" class="painel-inline-form">
                                        <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>" />
                                        <input type="hidden" name="id" value="<?= (int) $c['id'] ?>" />
                                        <?php if ($c['visibilidade'] === 'privado'): ?>
                                            <input type="hidden" name="para" value="participantes" />
                                            <button type="submit" class="painel-mini-btn">Liberar</button>
                                        <?php else: ?>
                                            <input type="hidden" name="para" value="privado" />
                                            <button type="submit" class="painel-mini-btn">Ocultar</button>
                                        <?php endif; ?>
                                    </form>
                                    <form method="post" action="excluir-mesa-conteudo.php" class="painel-inline-form"
                                          onsubmit="return confirm('Excluir &quot;<?= htmlspecialchars($c['titulo']) ?>&quot;?');">
                                        <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>" />
                                        <input type="hidden" name="id" value="<?= (int) $c['id'] ?>" />
                                        <button type="submit" class="painel-mini-btn painel-mini-btn--danger">Excluir</button>
                                    </form>
                                </div>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </article>
        </section>

        <div class="home-list-footer auth-footer">
            <a class="home-btn home-btn-ghost" href="painel.php">Voltar ao painel</a>
        </div>
    </main>
</body>
</html>
