<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/permissions.php';
require_once __DIR__ . '/includes/mesa-helpers.php';
require_once __DIR__ . '/includes/aventuras-helpers.php';

$usuario = exigirLogin();
exigirFacilitador('o módulo Aventuras é exclusivo do Facilitador');

$editId = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$aventura = null;
if ($editId > 0) {
    $cand = carregarAventura($editId);
    if (!$cand || (int) $cand['usuario_id'] !== (int) $usuario['id']) {
        header('Location: acesso-negado.php?m=' . urlencode('Aventura não encontrada ou não pertence a você.'));
        exit;
    }
    $aventura = $cand;
}
$csrf = tokenCsrf();
$flash = $_GET['msg']  ?? null;
$flashType = $_GET['type'] ?? 'info';

$titulo    = htmlspecialchars($aventura['titulo'] ?? '');
$subtitulo = htmlspecialchars($aventura['subtitulo'] ?? '');
$sinopse   = htmlspecialchars($aventura['sinopse'] ?? '');
$sistema   = htmlspecialchars($aventura['sistema'] ?? '');
$nivel     = htmlspecialchars($aventura['nivel_sugerido'] ?? '');
$duracao   = htmlspecialchars($aventura['duracao_estimada'] ?? '');
$qtd       = htmlspecialchars($aventura['qtd_jogadores'] ?? '');
$texto     = htmlspecialchars($aventura['texto_integral'] ?? '');
$obs       = htmlspecialchars($aventura['observacoes_facilitador'] ?? '');
$status    = $aventura['status'] ?? 'rascunho';
$capaUrl   = $aventura && !empty($aventura['capa_path']) ? $aventura['capa_path'] : '';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= $aventura ? 'Editar aventura' : 'Nova aventura' ?> — Pindorama RPG</title>
    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/home.css?v=20260507d" />
    <link rel="stylesheet" href="assets/css/auth.css?v=20260507a" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260508u" />
    <link rel="stylesheet" href="assets/css/painel-facilitador.css?v=20260508a" />
    <link rel="stylesheet" href="assets/css/aventuras.css?v=20260513d" />
</head>
<body class="home-body aventuras-page">
    <script src="assets/js/transitions.js?v=20260508u"></script>

    <main class="home-shell painel-shell">
        <header class="home-hero home-hero-compact">
            <a href="aventuras.php" class="home-back" aria-label="Voltar para a lista">&larr;</a>
            <h1 class="home-title"><?= $aventura ? 'Editar aventura' : 'Nova aventura' ?></h1>
            <p class="home-subtitle">Capa, sinopse e texto integral para narrar quando a mesa se reunir.</p>
        </header>

        <?php if ($flash): ?>
            <div class="painel-flash painel-flash--<?= htmlspecialchars($flashType) ?>"><?= htmlspecialchars($flash) ?></div>
        <?php endif; ?>

        <form method="post" action="salvar-aventura.php" enctype="multipart/form-data" class="aventura-form" autocomplete="off">
            <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>" />
            <?php if ($aventura): ?>
                <input type="hidden" name="id" value="<?= (int) $aventura['id'] ?>" />
            <?php endif; ?>

            <section class="aventura-form-grid">
                <div class="aventura-form-cover">
                    <label class="aventura-form-cover-label">Capa</label>
                    <div class="aventura-cover-preview" id="aventuraCoverPreview">
                        <?php if ($capaUrl !== ''): ?>
                            <img src="<?= htmlspecialchars($capaUrl) ?>" alt="Capa atual" />
                        <?php else: ?>
                            <span class="aventura-cover-placeholder" aria-hidden="true">&#10070;<br><small>Sem capa</small></span>
                        <?php endif; ?>
                    </div>
                    <div class="aventura-cover-actions">
                        <label class="aventuras-btn aventuras-btn--ghost">
                            <input type="file" name="capa" id="aventuraCapaFile" accept="image/jpeg,image/png,image/webp" hidden />
                            <span>Escolher imagem</span>
                        </label>
                        <small class="aventura-cover-hint">JPG, PNG ou WebP — até 8&nbsp;MB.</small>
                    </div>
                </div>

                <div class="aventura-form-fields">
                    <label class="field wide">
                        <span>Título *</span>
                        <input type="text" name="titulo" value="<?= $titulo ?>" maxlength="180" required />
                    </label>
                    <label class="field wide">
                        <span>Subtítulo</span>
                        <input type="text" name="subtitulo" value="<?= $subtitulo ?>" maxlength="220" />
                    </label>
                    <label class="field wide">
                        <span>Sinopse</span>
                        <textarea name="sinopse" rows="3" maxlength="2000" placeholder="Resumo curto que aparece nos cards e na visualização."><?= $sinopse ?></textarea>
                    </label>
                    <div class="aventura-form-row">
                        <label class="field">
                            <span>Sistema/Cenário</span>
                            <input type="text" name="sistema" value="<?= $sistema ?>" maxlength="120" placeholder="ex.: Pindorama RPG" />
                        </label>
                        <label class="field">
                            <span>Nível sugerido</span>
                            <input type="text" name="nivel_sugerido" value="<?= $nivel ?>" maxlength="60" placeholder="ex.: 1–3" />
                        </label>
                        <label class="field">
                            <span>Duração estimada</span>
                            <input type="text" name="duracao_estimada" value="<?= $duracao ?>" maxlength="60" placeholder="ex.: 1 sessão" />
                        </label>
                        <label class="field">
                            <span>Qtd. de jogadores</span>
                            <input type="text" name="qtd_jogadores" value="<?= $qtd ?>" maxlength="40" placeholder="ex.: 3 a 5" />
                        </label>
                        <label class="field">
                            <span>Status</span>
                            <select name="status">
                                <?php foreach (AVENTURAS_STATUS_LIST as $s): ?>
                                    <option value="<?= $s ?>" <?= $status === $s ? 'selected' : '' ?>><?= htmlspecialchars(rotuloStatusAventura($s)) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </label>
                    </div>
                </div>
            </section>

            <section class="aventura-form-block">
                <label class="field wide">
                    <span>Texto integral</span>
                    <textarea name="texto_integral" id="aventuraTextoIntegral" rows="18"
                              placeholder="Cole ou escreva a aventura inteira aqui. Capítulos, introdução, prelúdio, cenas, encontros, leitura para os jogadores e conclusão — as quebras de linha são preservadas."><?= $texto ?></textarea>
                </label>
            </section>

            <section class="aventura-form-block">
                <label class="field wide">
                    <span>Observações do facilitador <small>(privadas)</small></span>
                    <textarea name="observacoes_facilitador" rows="5" maxlength="4000"
                              placeholder="Anotações, dicas de bastidor, ajustes por mesa — não aparecem aos jogadores."><?= $obs ?></textarea>
                </label>
            </section>

            <footer class="aventura-form-footer">
                <a class="aventuras-btn" href="aventuras.php">Cancelar</a>
                <button type="submit" class="aventuras-btn aventuras-btn--primary">
                    <?= $aventura ? 'Salvar alterações' : 'Criar aventura' ?>
                </button>
            </footer>
        </form>
    </main>

    <script src="assets/js/aventuras.js?v=20260512a"></script>
</body>
</html>
