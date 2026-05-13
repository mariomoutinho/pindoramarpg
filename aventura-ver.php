<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/permissions.php';
require_once __DIR__ . '/includes/mesa-helpers.php';
require_once __DIR__ . '/includes/aventuras-helpers.php';

$usuario = exigirLogin();
exigirFacilitador('o módulo Aventuras é exclusivo do Facilitador');

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$aventura = $id > 0 ? carregarAventura($id) : null;
if (!$aventura || (int) $aventura['usuario_id'] !== (int) $usuario['id']) {
    header('Location: acesso-negado.php?m=' . urlencode('Aventura não encontrada ou não pertence a você.'));
    exit;
}

$titulo    = htmlspecialchars($aventura['titulo'] ?: 'Aventura sem título');
$subtitulo = htmlspecialchars($aventura['subtitulo'] ?: '');
$sinopse   = htmlspecialchars($aventura['sinopse'] ?: '');
$sistema   = htmlspecialchars($aventura['sistema'] ?: '');
$nivel     = htmlspecialchars($aventura['nivel_sugerido'] ?: '');
$duracao   = htmlspecialchars($aventura['duracao_estimada'] ?: '');
$qtd       = htmlspecialchars($aventura['qtd_jogadores'] ?: '');
$statusRot = htmlspecialchars(rotuloStatusAventura($aventura['status']));
$capaUrl   = urlCapaAventuraOuPlaceholder($aventura['capa_path'] ?? null);
$temCapa   = !empty($aventura['capa_path']);
$dtAtual   = $aventura['updated_at'] ?: $aventura['created_at'];
$dtFmt     = $dtAtual ? date('d/m/Y H:i', strtotime($dtAtual)) : '';
$textoHtml = formatarTextoIntegralAventura($aventura['texto_integral']);
$obsHtml   = formatarTextoIntegralAventura($aventura['observacoes_facilitador']);

// Lista de cenas — reaproveita o mesmo helper usado na edição.
$cenasAventuraVer = aventuraListarCenas((int) $aventura['id']);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= $titulo ?> — Aventuras — Pindorama RPG</title>
    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/home.css?v=20260513f" />
    <link rel="stylesheet" href="assets/css/auth.css?v=20260507a" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260508u" />
    <link rel="stylesheet" href="assets/css/painel-facilitador.css?v=20260508a" />
    <link rel="stylesheet" href="assets/css/aventuras.css?v=20260513m" />
</head>
<body class="home-body aventuras-page aventura-leitura-page">
    <script src="assets/js/transitions.js?v=20260508u"></script>

    <main class="home-shell painel-shell aventura-leitura-shell">

        <header class="aventura-leitura-hero aventura-leitura-bloco<?= $temCapa ? '' : ' is-no-cover' ?>">
            <?php if ($temCapa): ?>
                <img class="aventura-leitura-hero-bg"
                     src="<?= htmlspecialchars($capaUrl) ?>"
                     alt="Capa da aventura"
                     loading="eager" />
            <?php endif; ?>
            <div class="aventura-leitura-hero-overlay">
                <a href="aventuras.php" class="aventura-leitura-back" aria-label="Voltar para a lista">&larr;</a>
                <span class="aventura-leitura-status aventura-meta-status--<?= htmlspecialchars($aventura['status']) ?>"><?= $statusRot ?></span>
                <h1 class="aventura-leitura-title"><?= $titulo ?></h1>
                <?php if ($subtitulo !== ''): ?>
                    <p class="aventura-leitura-subtitle"><?= $subtitulo ?></p>
                <?php endif; ?>
                <div class="aventura-leitura-meta">
                    <?php if ($sistema !== ''): ?><span>Sistema: <strong><?= $sistema ?></strong></span><?php endif; ?>
                    <?php if ($nivel   !== ''): ?><span>Nível: <strong><?= $nivel ?></strong></span><?php endif; ?>
                    <?php if ($duracao !== ''): ?><span>Duração: <strong><?= $duracao ?></strong></span><?php endif; ?>
                    <?php if ($qtd     !== ''): ?><span>Jogadores: <strong><?= $qtd ?></strong></span><?php endif; ?>
                    <?php if ($dtFmt   !== ''): ?><span>Atualizado em <strong><?= $dtFmt ?></strong></span><?php endif; ?>
                </div>
                <div class="aventura-leitura-actions">
                    <a class="aventuras-btn" href="aventuras.php">Voltar</a>
                    <a class="aventuras-btn aventuras-btn--primary" href="aventura-editor.php?id=<?= (int) $aventura['id'] ?>">Editar</a>
                </div>
            </div>
        </header>

        <?php if ($sinopse !== ''): ?>
            <section class="aventura-leitura-sinopse aventura-leitura-bloco" aria-label="Sinopse">
                <h2>Sinopse</h2>
                <p><?= $sinopse ?></p>
            </section>
        <?php endif; ?>

        <!-- =====================================================
             Cenas da aventura — mesmo padrão visual da edição.
             Reaproveita .aventura-cenas-painel + .aventura-cenas-grid
             + .aventura-cena-card / .aventura-cena-card-bg.
             ===================================================== -->
        <?php
            $cenasBgStyleVer = $capaUrl !== '' && $temCapa
                ? ' style="--aventura-cenas-bg:url(\'' . htmlspecialchars($capaUrl) . '\')"'
                : '';
            $cenaMesaJogoUrlVer = 'mesa-jogo.php?aventura_id=' . (int) $aventura['id'];
        ?>
        <section class="aventura-secao aventura-cenas-painel aventura-leitura-bloco<?= $temCapa ? '' : ' is-no-bg' ?>"
                 aria-labelledby="aventuraVerCenasTitulo"<?= $cenasBgStyleVer ?>>
            <header class="aventura-secao-head">
                <h2 id="aventuraVerCenasTitulo">Cenas da aventura</h2>
                <p>Monte cenas próprias usando a mesma mecânica da Mesa de Jogo — tokens, grid, terreno, iniciativa, ataque e movimento.</p>
            </header>
            <div class="aventura-secao-body">
                <a class="aventuras-btn aventuras-btn--primary"
                   href="<?= htmlspecialchars($cenaMesaJogoUrlVer) ?>">
                    Abrir Mesa de Jogo desta aventura
                </a>
                <?php if (!empty($cenasAventuraVer)): ?>
                    <ul class="aventura-cenas-grid">
                        <?php foreach ($cenasAventuraVer as $c):
                            $cImg = (string) ($c['coverImage'] ?? '');
                        ?>
                            <li class="aventura-cena-card<?= $cImg === '' ? ' is-no-cover' : ' has-cover' ?>">
                                <?php if ($cImg !== ''): ?>
                                    <img class="aventura-cena-card-bg"
                                         src="<?= htmlspecialchars($cImg) ?>"
                                         alt=""
                                         loading="lazy"
                                         onerror="this.remove();this.closest('.aventura-cena-card').classList.add('is-no-cover');" />
                                <?php endif; ?>
                                <a class="aventura-cena-card-link"
                                   href="<?= htmlspecialchars($cenaMesaJogoUrlVer) ?>"
                                   title="Abrir esta aventura na Mesa de Jogo">
                                    <span class="aventura-cena-card-body">
                                        <strong class="aventura-cena-card-nome"><?= htmlspecialchars($c['name']) ?></strong>
                                        <span class="aventura-cena-card-meta">
                                            <span><?= (int) $c['tokens']  ?> tokens</span>
                                            <span><?= (int) $c['scenery'] ?> cenários</span>
                                            <?php if ($c['tipo'] !== ''): ?>
                                                <span class="aventura-cena-card-tag"><?= htmlspecialchars($c['tipo']) ?></span>
                                            <?php endif; ?>
                                        </span>
                                    </span>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php else: ?>
                    <p class="aventura-secao-vazio">
                        Nenhuma cena salva ainda. Clique em <em>Abrir Mesa de Jogo</em>
                        para começar — tudo o que for salvo lá fica vinculado apenas a esta aventura.
                    </p>
                <?php endif; ?>
            </div>
        </section>

        <?php
            // Cabeçalho artístico do corpo: junta título + subtítulo
            // quando há subtítulo, separados por ": ". Mantém os campos
            // separados no banco/hero; aqui é só composição visual.
            $tituloCompleto = $titulo;
            if ($subtitulo !== '') {
                $tituloCompleto .= ': ' . $subtitulo;
            }
        ?>
        <article class="aventura-leitura-corpo aventura-leitura-bloco" aria-label="Conteúdo da aventura">
            <h2 class="aventura-leitura-corpo-title"><?= $tituloCompleto ?></h2>
            <?php if ($textoHtml !== ''): ?>
                <div class="aventura-leitura-texto"><?= $textoHtml ?></div>
            <?php else: ?>
                <p class="aventura-leitura-vazio">Esta aventura ainda não tem conteúdo. <a href="aventura-editor.php?id=<?= (int) $aventura['id'] ?>">Adicionar agora</a>.</p>
            <?php endif; ?>
        </article>

        <?php if ($obsHtml !== ''): ?>
            <aside class="aventura-leitura-obs aventura-leitura-bloco" aria-label="Observações do facilitador">
                <h2>Observações do facilitador <small>(privadas)</small></h2>
                <div class="aventura-leitura-texto"><?= $obsHtml ?></div>
            </aside>
        <?php endif; ?>
    </main>
</body>
</html>
