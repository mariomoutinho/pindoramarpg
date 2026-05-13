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

// Cenas e NPCs só aparecem quando a aventura já tem id (após primeira gravação).
$cenasAventura = $aventura ? aventuraListarCenas((int) $aventura['id']) : [];
$npcsAventura  = $aventura ? aventuraListarNpcs((int) $aventura['id'])  : [];
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= $aventura ? 'Editar aventura' : 'Nova aventura' ?> — Pindorama RPG</title>
    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/home.css?v=20260513f" />
    <link rel="stylesheet" href="assets/css/auth.css?v=20260507a" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260508u" />
    <link rel="stylesheet" href="assets/css/painel-facilitador.css?v=20260508a" />
    <link rel="stylesheet" href="assets/css/aventuras.css?v=20260513o" />
</head>
<body class="home-body aventuras-page">
    <script src="assets/js/transitions.js?v=20260508u"></script>

    <main class="home-shell painel-shell aventura-editor-shell">
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

        <?php if ($aventura): ?>
            <!-- =====================================================
                 Cenas da aventura (reaproveita Mesa de Jogo).
                 Quando há capa da aventura, vira um painel imersivo com
                 a capa no fundo + overlay para contraste. Fallback:
                 gradient roxo/vinho/dourado da paleta do projeto.
                 ===================================================== -->
            <?php $cenasBgStyle = $capaUrl !== '' ? ' style="--aventura-cenas-bg:url(\'' . htmlspecialchars($capaUrl) . '\')"' : ''; ?>
            <section class="aventura-secao aventura-cenas-painel<?= $capaUrl !== '' ? '' : ' is-no-bg' ?>"
                     aria-labelledby="aventuraCenasTitulo"<?= $cenasBgStyle ?>>
                <header class="aventura-secao-head">
                    <h2 id="aventuraCenasTitulo">Cenas da aventura</h2>
                    <p>Monte cenas próprias usando a mesma mecânica da Mesa de Jogo — tokens, grid, terreno, iniciativa, ataque e movimento.</p>
                </header>
                <div class="aventura-secao-body">
                    <a class="aventuras-btn aventuras-btn--primary"
                       href="mesa-jogo.php?aventura_id=<?= (int) $aventura['id'] ?>">
                        Abrir Mesa de Jogo desta aventura
                    </a>
                    <?php if (!empty($cenasAventura)): ?>
                        <ul class="aventura-cenas-grid">
                            <?php
                                $cenaMesaJogoUrl = 'mesa-jogo.php?aventura_id=' . (int) $aventura['id'];
                                foreach ($cenasAventura as $c):
                                    $cImg = (string) ($c['coverImage'] ?? '');
                            ?>
                                <li class="aventura-cena-card<?= $cImg === '' ? ' is-no-cover' : ' has-cover' ?>">
                                    <?php if ($cImg !== ''): ?>
                                        <!-- Imagem real do cenário renderizada como <img> (mais previsível
                                             que background-image: var(--x) em pseudo-elementos; permite
                                             onerror p/ cair em fallback gracioso). Texto fica em camada
                                             superior (.aventura-cena-card-link, z-index 2) e nítido. -->
                                        <img class="aventura-cena-card-bg"
                                             src="<?= htmlspecialchars($cImg) ?>"
                                             alt=""
                                             loading="lazy"
                                             onerror="this.remove();this.closest('.aventura-cena-card').classList.add('is-no-cover');" />
                                    <?php endif; ?>
                                    <a class="aventura-cena-card-link"
                                       href="<?= htmlspecialchars($cenaMesaJogoUrl) ?>"
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
                            para começar — todas as cenas que você salvar lá ficam vinculadas
                            apenas a esta aventura.
                        </p>
                    <?php endif; ?>
                </div>
            </section>

            <!-- =====================================================
                 NPCs da aventura (server-side, integra Bestiário)
                 ===================================================== -->
            <section class="aventura-secao" aria-labelledby="aventuraNpcsTitulo">
                <header class="aventura-secao-head">
                    <h2 id="aventuraNpcsTitulo">NPCs da aventura</h2>
                    <p>Cadastre NPCs próprios da aventura. Eles também aparecem no Bestiário do facilitador.</p>
                </header>
                <div class="aventura-secao-body">
                    <form method="post" action="salvar-aventura-npc.php"
                          enctype="multipart/form-data"
                          class="aventura-npc-form" id="aventuraNpcForm">
                        <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>" />
                        <input type="hidden" name="aventura_id" value="<?= (int) $aventura['id'] ?>" />
                        <div class="aventura-npc-grid">
                            <label class="field">
                                <span>Nome *</span>
                                <input type="text" name="nome" required maxlength="180" placeholder="Ex.: Capitão das Brumas" />
                            </label>
                            <label class="field">
                                <span>Tipo</span>
                                <select name="tipo">
                                    <option value="">—</option>
                                    <?php foreach (['humanoide','animal','monstro','planta','espírito','morto-vivo','construto','outro'] as $t): ?>
                                        <option value="<?= $t ?>"><?= $t ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </label>
                            <label class="field">
                                <span>ND</span>
                                <input type="text" name="nd" maxlength="20" placeholder="ex.: 3" />
                            </label>
                            <label class="field">
                                <span>Tamanho</span>
                                <select name="tamanho">
                                    <option value="">—</option>
                                    <?php foreach (['Minúsculo','Pequeno','Médio','Grande','Enorme','Colossal'] as $t): ?>
                                        <option value="<?= $t ?>"><?= $t ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </label>
                            <label class="field">
                                <span>Bioma</span>
                                <input type="text" name="bioma" maxlength="80" placeholder="ex.: Caatinga" />
                            </label>
                            <label class="field">
                                <span>Papel tático</span>
                                <input type="text" name="papel_tatico" maxlength="80" placeholder="ex.: emboscador" />
                            </label>
                            <label class="field">
                                <span>PV máx.</span>
                                <input type="number" name="pv_max" min="0" />
                            </label>
                            <label class="field">
                                <span>Defesa</span>
                                <input type="number" name="defesa" min="0" />
                            </label>
                            <label class="field">
                                <span>Deslocamento</span>
                                <input type="text" name="deslocamento" maxlength="40" placeholder="ex.: 6m" />
                            </label>
                            <div class="field aventura-npc-imagem-field">
                                <span class="field-label-line">Imagem do NPC</span>
                                <div class="aventura-npc-imagem-inputs">
                                    <input type="text" name="imagem" maxlength="255"
                                           class="aventura-npc-imagem-url"
                                           placeholder="URL ou caminho — opcional" />
                                    <label class="aventuras-btn aventuras-btn--ghost aventura-npc-imagem-upload">
                                        <input type="file"
                                               name="imagem_arquivo"
                                               id="aventuraNpcImagemArquivo"
                                               accept="image/jpeg,image/png,image/webp"
                                               hidden />
                                        <span>Enviar arquivo</span>
                                    </label>
                                </div>
                                <div class="aventura-npc-imagem-preview" id="aventuraNpcImagemPreview" hidden>
                                    <img alt="Prévia da imagem do NPC" />
                                </div>
                                <small class="aventura-npc-imagem-hint">
                                    JPG, PNG ou WebP — até 8&nbsp;MB. Se enviar arquivo e URL ao mesmo tempo,
                                    o arquivo tem prioridade.
                                </small>
                            </div>
                            <label class="field wide">
                                <span>Descrição</span>
                                <textarea name="descricao" rows="2" maxlength="4000"></textarea>
                            </label>
                            <label class="field wide">
                                <span>Habilidades</span>
                                <textarea name="habilidades" rows="2" maxlength="4000"></textarea>
                            </label>
                        </div>
                        <div class="aventura-npc-form-actions">
                            <button type="submit" class="aventuras-btn aventuras-btn--primary">Adicionar NPC</button>
                        </div>
                    </form>

                    <?php if (!empty($npcsAventura)): ?>
                        <ul class="aventura-npcs-lista">
                            <?php foreach ($npcsAventura as $n): ?>
                                <li class="aventura-npc-card">
                                    <div class="aventura-npc-info">
                                        <strong><?= htmlspecialchars($n['nome']) ?></strong>
                                        <span class="aventura-npc-meta">
                                            <?= $n['tipo']    ? htmlspecialchars($n['tipo']) . ' · ' : '' ?>
                                            <?= $n['nd']      ? 'ND ' . htmlspecialchars($n['nd']) . ' · ' : '' ?>
                                            <?= $n['tamanho'] ? htmlspecialchars($n['tamanho']) : '' ?>
                                            <?= $n['bioma']   ? ' · ' . htmlspecialchars($n['bioma']) : '' ?>
                                        </span>
                                        <?php if (!empty($n['descricao'])): ?>
                                            <p class="aventura-npc-desc"><?= htmlspecialchars(mb_substr((string) $n['descricao'], 0, 240)) ?><?= mb_strlen((string) $n['descricao']) > 240 ? '…' : '' ?></p>
                                        <?php endif; ?>
                                    </div>
                                    <form method="post" action="excluir-aventura-npc.php"
                                          class="aventura-npc-delete"
                                          data-confirm="Remover o NPC «<?= htmlspecialchars($n['nome']) ?>» desta aventura? Ele sairá do Bestiário também."
                                          onsubmit="return confirmarExclusaoAventura(event);">
                                        <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>" />
                                        <input type="hidden" name="id" value="<?= (int) $n['id'] ?>" />
                                        <button type="submit" class="aventuras-btn aventuras-btn--danger">Remover</button>
                                    </form>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    <?php else: ?>
                        <p class="aventura-secao-vazio">Nenhum NPC cadastrado ainda nesta aventura.</p>
                    <?php endif; ?>
                </div>
            </section>

            <!-- Modal de confirmação visual (reaproveita o de aventuras.php) -->
            <div class="aventuras-confirm-backdrop" id="aventurasConfirm" hidden>
                <div class="aventuras-confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="aventurasConfirmTitle">
                    <header>
                        <h3 id="aventurasConfirmTitle">Confirmar</h3>
                        <button type="button" class="aventuras-confirm-x" aria-label="Cancelar">&times;</button>
                    </header>
                    <div class="aventuras-confirm-body" id="aventurasConfirmBody"></div>
                    <footer>
                        <button type="button" class="aventuras-btn aventuras-confirm-cancel">Cancelar</button>
                        <button type="button" class="aventuras-btn aventuras-btn--danger aventuras-confirm-ok">Confirmar</button>
                    </footer>
                </div>
            </div>
        <?php endif; ?>
    </main>

    <script src="assets/js/aventuras.js?v=20260513b"></script>
</body>
</html>
