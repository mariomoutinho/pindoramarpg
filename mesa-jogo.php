<?php
require_once __DIR__ . '/includes/auth.php';
exigirLogin();
require_once __DIR__ . '/includes/permissions.php';
require_once __DIR__ . '/includes/aventuras-helpers.php';

$papelUsuarioCB = papelGlobal() ?: 'participante';

// Contexto opcional de Aventura. Se a Mesa de Jogo for aberta com
// ?aventura_id=N, as cenas (pages) são carregadas/salvas no arquivo
// data/aventuras/<id>/cenas.json em vez do estado global. Só funciona
// para o facilitador dono daquela aventura.
$aventuraCtxId = isset($_GET['aventura_id']) ? (int) $_GET['aventura_id'] : 0;
$aventuraCtx   = null;
if ($aventuraCtxId > 0) {
    $usuarioMJ = usuarioLogado();
    $cand = carregarAventura($aventuraCtxId);
    if ($cand && $usuarioMJ && (int) $cand['usuario_id'] === (int) $usuarioMJ['id']) {
        $aventuraCtx = $cand;
    } else {
        $aventuraCtxId = 0;
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <title>Mesa de Jogo — Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css?v=20260503g" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260508u" />
    <link rel="stylesheet" href="assets/css/campo-batalha.css?v=20260509a" />
</head>
<body class="cb-body mesa-jogo-page" data-papel="<?= htmlspecialchars($papelUsuarioCB) ?>">
    <!-- Banner de diagnóstico: aparece se o JS NUNCA rodar.
         É removido pelo init() do campo-batalha.js. -->
    <div id="cbJsAlive" style="position:fixed;top:8px;left:8px;z-index:9999;background:#9b254d;color:#fff;padding:6px 12px;border-radius:8px;font-family:sans-serif;font-size:13px;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,.3)">
        ⚠ JS NÃO INICIADO — abra DevTools (F12) e veja Console
    </div>
    <script>
        window.PINDORAMA_PAPEL = <?= json_encode($papelUsuarioCB) ?>;
        window.PINDORAMA_AVENTURA_ID = <?= $aventuraCtxId ?: 'null' ?>;
        window.PINDORAMA_AVENTURA_TITULO = <?= $aventuraCtx ? json_encode($aventuraCtx['titulo']) : 'null' ?>;
    </script>
    <script src="assets/js/transitions.js?v=20260508u"></script>

    <main class="cb-page">

        <header class="cb-topbar cb-topbar--mini">
            <?php if ($aventuraCtx): ?>
                <a href="aventura-editor.php?id=<?= (int) $aventuraCtx['id'] ?>"
                   class="cb-back" title="Voltar para a edição da aventura"
                   aria-label="Voltar para a aventura">←</a>
                <h1 class="cb-topbar-title">Cenas — <?= htmlspecialchars($aventuraCtx['titulo']) ?></h1>
            <?php else: ?>
                <a href="index.php" class="cb-back" title="Voltar ao menu" aria-label="Voltar ao menu">←</a>
                <h1 class="cb-topbar-title">Mesa de Jogo</h1>
            <?php endif; ?>
            <div class="cb-mode-switch" role="tablist" aria-label="Modo da mesa">
                <button type="button" id="cbModeEdit" class="cb-mode-btn is-active"
                        data-mode="edit" role="tab" aria-selected="true"
                        title="Editar cena: configurar mapa, terreno, tokens e barreiras">Editar cena</button>
                <button type="button" id="cbModePlay" class="cb-mode-btn"
                        data-mode="play" role="tab" aria-selected="false"
                        title="Jogar cena: focar em iniciativa, ações, ataque e movimento">Jogar cena</button>
            </div>
            <span id="cbSceneBiomeTag" class="cb-scene-biome-tag" hidden></span>
            <button type="button" id="cbStartCombat" class="cb-combat-btn cb-combat-btn--start" hidden>⚔ Iniciar Combate</button>
            <button type="button" id="cbEndCombat"   class="cb-combat-btn cb-combat-btn--end"   hidden>⚐ Encerrar Combate</button>
            <span id="cbSaveStatus" class="cb-save-status" aria-live="polite"></span>
            <nav class="cb-nav">
                <a class="cb-link-btn cb-link-btn--mini" href="fichas.php">Fichas</a>
                <a class="cb-link-btn cb-link-btn--mini" href="bestiario.php">Bestiário</a>
            </nav>
        </header>

        <section class="cb-pages-bar" aria-label="Páginas do campo">
            <div class="cb-pages-tabs" id="cbPagesTabs"></div>
            <button type="button" id="cbAddPage" class="cb-pages-add cb-edit-only" title="Nova página">+</button>
        </section>

        <section class="cb-battle-shell">
            <aside class="cb-toolbar-left" aria-label="Ferramentas da Mesa de Jogo">
                <div class="cb-tl-group cb-edit-only">
                    <button type="button" id="cbAddToken" class="cb-tl-btn cb-tl-btn--accent" title="Adicionar personagem">Pj</button>
                    <button type="button" id="cbAddBestiaryToken" class="cb-tl-btn cb-tl-btn--accent" title="Adicionar criatura">Cr</button>
                    <button type="button" id="cbAddScenery" class="cb-tl-btn" title="Adicionar cenário">Ce</button>
                    <button type="button" id="cbAddNpcImage" class="cb-tl-btn" title="Adicionar imagem de NPC">NPC</button>
                </div>

                <div class="cb-tl-group cb-edit-only">
                    <button type="button" id="cbRotateToken" class="cb-tl-btn" title="Girar token 90°" disabled>↻</button>
                    <button type="button" id="cbAdjustToken" class="cb-tl-btn" title="Ajustar token (recorte/zoom)" disabled>⌖</button>
                    <button type="button" id="cbRemoveToken" class="cb-tl-btn cb-tl-btn--danger" title="Remover seleção" disabled>✕</button>
                </div>

                <div class="cb-tl-group">
                    <button type="button" id="cbToggleLayers" class="cb-tl-btn" title="Camadas">≡</button>
                    <label class="cb-tl-toggle" title="Numerar células">
                        <input type="checkbox" id="cbToggleNumbers" />
                        <span aria-hidden="true">#</span>
                    </label>
                    <label class="cb-tl-toggle" title="Magnetizar imagens ao grid">
                        <input type="checkbox" id="cbSnapToGrid" />
                        <span aria-hidden="true">⊞</span>
                    </label>
                    <select id="cbImageLayer" class="cb-tl-select" title="Camada-alvo das próximas imagens">
                        <option value="scenery">Ce</option>
                        <option value="npcs">NPC</option>
                    </select>
                </div>

                <div class="cb-tl-group">
                    <button type="button" id="cbZoomIn" class="cb-tl-btn" title="Aproximar">+</button>
                    <span id="cbZoomDisplay" class="cb-tl-zoom">100%</span>
                    <button type="button" id="cbZoomOut" class="cb-tl-btn" title="Afastar">−</button>
                    <button type="button" id="cbZoomReset" class="cb-tl-btn" title="Resetar zoom e posição">⌂</button>
                </div>

                <div class="cb-tl-group cb-edit-only">
                    <button type="button" id="cbSaveBattle" class="cb-tl-btn cb-tl-btn--save" title="Salvar campo">Sv</button>
                    <button type="button" id="cbClearAll" class="cb-tl-btn cb-tl-btn--danger" title="Limpar campo">Lp</button>
                </div>

                <div class="cb-tl-group cb-tl-group--config cb-edit-only">
                    <label class="cb-tl-mini" title="Colunas">
                        <span>C</span>
                        <input type="number" id="cbCols" min="5" max="60" value="20" />
                    </label>
                    <label class="cb-tl-mini" title="Linhas">
                        <span>L</span>
                        <input type="number" id="cbRows" min="5" max="60" value="15" />
                    </label>
                    <button type="button" id="cbApplySize" class="cb-tl-btn cb-tl-btn--mini" title="Aplicar dimensões do tabuleiro">OK</button>
                </div>
            </aside>

            <section class="cb-stage" id="cbStage">
                <div class="cb-viewport" id="cbViewport">
                    <div class="cb-map-background" id="cbMapBackground"></div>
                    <div class="cb-scenery-layer" id="cbSceneryLayer"></div>
                    <div class="cb-board" id="cbBoard"></div>
                    <div class="cb-terrain-layer" id="cbTerrainLayer" aria-hidden="true"></div>
                    <div class="cb-npc-layer" id="cbNpcLayer"></div>
                    <div class="cb-guides-layer" id="cbGuidesLayer"></div>
                    <div class="cb-tokens-layer" id="cbTokensLayer"></div>
                </div>
            </section>

            <aside class="cb-sidebar" aria-label="Painel da mesa de jogo">
                <div class="cb-sidebar-tabs" role="tablist" aria-label="Seções">
                    <button type="button" class="is-active" data-tab="registro">Registro</button>
                    <button type="button" data-tab="personagens">Personagens</button>
                    <button type="button" data-tab="bestiario">Bestiário</button>
                    <button type="button" data-tab="tokens">Tokens</button>
                    <button type="button" data-tab="iniciativa">Iniciativa</button>
                    <button type="button" data-tab="cena">Cena</button>
                </div>

                <div class="cb-sidebar-panel is-active" data-panel="registro">
                    <header class="cb-sidebar-header">
                        <h2>Registro</h2>
                        <button type="button" id="cbClearLog">Limpar</button>
                    </header>
                    <form class="cb-dice-roller" id="cbDiceForm">
                        <input id="cbDiceFormula" type="text" value="1d20" aria-label="Fórmula de rolagem" />
                        <button type="submit">Rolar</button>
                    </form>
                    <div class="cb-log-list" id="cbLogList"></div>
                </div>

                <div class="cb-sidebar-panel" data-panel="personagens">
                    <header class="cb-sidebar-header">
                        <h2>Personagens</h2>
                        <button type="button" id="cbRefreshFichas">Atualizar</button>
                    </header>
                    <input class="cb-sidebar-search" id="cbSidebarFichaSearch" type="search" placeholder="Buscar ficha" />
                    <div class="cb-sidebar-list" id="cbSidebarFichas"></div>
                </div>

                <div class="cb-sidebar-panel" data-panel="bestiario">
                    <header class="cb-sidebar-header">
                        <h2>Bestiário</h2>
                        <button type="button" id="cbRefreshBestiary">Atualizar</button>
                    </header>
                    <input class="cb-sidebar-search" id="cbSidebarBestiarySearch" type="search" placeholder="Buscar criatura" />
                    <div class="cb-sidebar-list" id="cbSidebarBestiary"></div>
                </div>

                <div class="cb-sidebar-panel" data-panel="tokens">
                    <header class="cb-sidebar-header">
                        <h2>Tokens</h2>
                        <button type="button" id="cbEditSelectedToken">Editar seleção</button>
                    </header>
                    <div class="cb-token-tools" id="cbSelectedTokenTools"></div>
                    <div class="cb-sidebar-list" id="cbSidebarTokens"></div>
                </div>

                <div class="cb-sidebar-panel cb-panel-initiative" data-panel="iniciativa">
                    <div class="cb-initiative-head">
                        <header class="cb-sidebar-header">
                            <h2>Iniciativa</h2>
                            <button type="button" id="cbNextTurn">Próximo</button>
                        </header>
                        <div class="cb-round-bar">
                            <strong class="cb-round-label">Rodada <span id="cbRoundNumber">1</span></strong>
                            <div class="cb-round-controls">
                                <button type="button" id="cbRoundIncrement" title="+1 rodada (sem trocar de turno)">+1</button>
                                <button type="button" id="cbRoundReset" title="Reiniciar para rodada 1">Reset</button>
                            </div>
                        </div>
                        <div class="cb-initiative-actions">
                            <button type="button" id="cbRollSceneInitiative" class="cb-primary" title="Rola d20+modificador para todos os tokens da cena e ordena automaticamente">Rolar cena</button>
                            <button type="button" id="cbAddTurnSelected" title="Rola apenas para o token selecionado">Rolar seleção</button>
                            <button type="button" id="cbSortTurns" title="Reordena por iniciativa (desempata por modificador)">Ordenar</button>
                            <button type="button" id="cbResetMovimentos" title="Zera o deslocamento gasto de todos os tokens">Resetar movs.</button>
                            <button type="button" id="cbUndoMove" title="Desfazer último movimento (Ctrl+Z)" disabled>↶ Desfazer</button>
                        </div>
                    </div>
                    <div class="cb-turn-list" id="cbTurnList"></div>
                    <p class="cb-initiative-hint">Surpresos não agem na rodada 1 — use o botão S para marcar.</p>
                </div>

                <div class="cb-sidebar-panel" data-panel="cena">
                    <header class="cb-sidebar-header">
                        <h2>Cena</h2>
                    </header>
                    <div class="cb-scene-settings">
                        <label>Tipo de cena
                            <select id="cbSceneType">
                                <option value="">— não especificado —</option>
                                <option value="combate">Combate</option>
                                <option value="cidade">Cidade</option>
                                <option value="taverna">Taverna</option>
                                <option value="estalagem">Estalagem</option>
                                <option value="castelo">Castelo</option>
                                <option value="cripta">Cripta</option>
                                <option value="aldeia">Aldeia</option>
                                <option value="floresta">Floresta</option>
                                <option value="masmorra">Masmorra</option>
                                <option value="mapa-narrativo">Mapa narrativo</option>
                                <option value="outro">Outro</option>
                            </select>
                        </label>
                        <label>Bioma / ambiente
                            <select id="cbSceneBiome">
                                <option value="">— não especificado —</option>
                                <option value="amazonia">Amazônia</option>
                                <option value="cerrado">Cerrado</option>
                                <option value="caatinga">Caatinga</option>
                                <option value="pantanal">Pantanal</option>
                                <option value="mata-atlantica">Mata Atlântica</option>
                                <option value="pampas">Pampas</option>
                                <option value="manguezal">Manguezal</option>
                                <option value="restinga">Restinga</option>
                                <option value="litoral">Litoral / praia</option>
                                <option value="campos-rupestres">Campos rupestres</option>
                                <option value="rios">Rios e alagados</option>
                                <option value="cavernas">Cavernas / subterrâneo</option>
                                <option value="ilhas">Ilhas</option>
                                <option value="urbano-colonial">Urbano colonial</option>
                                <option value="urbano-tradicional">Urbano tradicional</option>
                                <option value="taverna">Taverna / interior</option>
                                <option value="estrada">Estrada / campo aberto</option>
                                <option value="montanha">Montanha / rochoso</option>
                                <option value="ruina">Ruína / cripta</option>
                                <option value="aldeia">Aldeia</option>
                                <option value="sertao">Sertão</option>
                            </select>
                        </label>
                        <label>Notas do Facilitador
                            <textarea id="cbSceneNotes" rows="4" placeholder="Escala, regras especiais, observações de terreno..."></textarea>
                        </label>
                        <label>Imagem de fundo
                            <input id="cbMapImage" type="text" placeholder="URL, caminho ou data:image" />
                        </label>
                        <label>Carregar mapa
                            <input id="cbMapFile" type="file" accept="image/*" />
                        </label>
                        <label>Opacidade do grid
                            <input id="cbGridOpacity" type="range" min="0.05" max="1" step="0.05" value="0.45" />
                        </label>
                        <label>Tamanho visual do grid
                            <input id="cbGridSize" type="number" min="36" max="96" value="56" />
                        </label>
                        <button type="button" id="cbClearMapImage">Remover fundo</button>

                        <div class="cb-terrain-controls">
                            <header class="cb-terrain-controls-head">
                                <strong>Marcar terreno</strong>
                            </header>

                            <fieldset class="cb-terrain-types">
                                <legend class="visually-hidden">Tipo de marcação</legend>
                                <label class="cb-terrain-type cb-terrain-type--difficult">
                                    <input type="radio" name="cbTerrainType" value="difficult" checked />
                                    <span>Difícil</span>
                                    <small id="cbTerrainCountDifficult">0 células</small>
                                </label>
                                <label class="cb-terrain-type cb-terrain-type--barrier">
                                    <input type="radio" name="cbTerrainType" value="barrier" />
                                    <span>Barreira</span>
                                    <small id="cbTerrainCountBarrier">0 células</small>
                                </label>
                                <label class="cb-terrain-type cb-terrain-type--special">
                                    <input type="radio" name="cbTerrainType" value="special" />
                                    <span>Especial</span>
                                    <small id="cbTerrainCountSpecial">0 células</small>
                                </label>
                            </fieldset>
                            <label class="cb-terrain-special-biome" id="cbTerrainSpecialBiomeLabel" hidden>
                                Bioma da célula
                                <select id="cbTerrainSpecialBiome">
                                    <option value="mangue">Mangue</option>
                                    <option value="agua">Água</option>
                                    <option value="lama">Lama</option>
                                    <option value="floresta-densa">Floresta densa</option>
                                    <option value="rocha">Rocha</option>
                                    <option value="ruina">Ruína</option>
                                    <option value="areia">Areia</option>
                                    <option value="vegetacao-seca">Vegetação seca</option>
                                </select>
                            </label>

                            <button type="button" id="cbToggleTerrainMode" class="cb-terrain-toggle" aria-pressed="false">
                                Marcar terreno
                            </button>
                            <button type="button" id="cbClearTerrain" class="cb-terrain-clear">Limpar marcações</button>
                            <p class="cb-terrain-hint">Difícil aumenta custo de movimento. Barreiras bloqueiam linha de ataque à distância.</p>
                        </div>
                    </div>
                </div>
            </aside>
        </section>

        <aside class="cb-layers-panel" id="cbLayersPanel" hidden>
            <header class="cb-layers-header">
                <h2>Camadas</h2>
                <button type="button" id="cbLayersClose" aria-label="Fechar camadas">×</button>
            </header>
            <div class="cb-layers-tip">Topo = na frente. Arraste itens com ↑ ↓ para reorganizar.</div>
            <ul class="cb-layers-list" id="cbLayersList"></ul>
        </aside>

        <div class="cb-modal-backdrop" id="cbSceneryModal" hidden>
            <div class="cb-modal" role="dialog" aria-modal="true" aria-labelledby="cbSceneryTitle">
                <header class="cb-modal-header">
                    <h2 id="cbSceneryTitle">Adicionar cenário</h2>
                    <button type="button" id="cbSceneryClose" aria-label="Fechar">×</button>
                </header>
                <div class="cb-scenery-body">
                    <input id="cbSceneryLayerTarget" type="hidden" value="scenery" />
                    <label class="cb-scenery-field">
                        Nome
                        <input id="cbSceneryName" type="text" placeholder="ex.: Tapete, Pedra, Mesa" />
                    </label>
                    <label class="cb-scenery-field">
                        URL ou caminho da imagem
                        <input id="cbSceneryUrl" type="text" placeholder="https://... ou assets/img/..." />
                    </label>
                    <div class="cb-scenery-or">ou</div>
                    <label class="cb-scenery-field">
                        Carregar do dispositivo
                        <input id="cbSceneryFile" type="file" accept="image/*" />
                    </label>
                </div>
                <footer class="cb-modal-footer">
                    <button type="button" id="cbSceneryCancel">Cancelar</button>
                    <button type="button" id="cbSceneryConfirm" class="cb-primary">Adicionar</button>
                </footer>
            </div>
        </div>

        <div class="cb-modal-backdrop" id="cbModal" hidden>
            <div class="cb-modal" role="dialog" aria-modal="true" aria-labelledby="cbModalTitle">
                <header class="cb-modal-header">
                    <h2 id="cbModalTitle">Adicionar personagem</h2>
                    <button type="button" id="cbModalClose" aria-label="Fechar">×</button>
                </header>
                <div class="cb-modal-search">
                    <input type="search" id="cbModalSearch" placeholder="Buscar por nome ou jogador..." />
                </div>
                <div class="cb-bestiary-filters" id="cbBestiaryFilters" hidden>
                    <select id="cbBestiaryNd" aria-label="Filtrar por ND">
                        <option value="">ND</option>
                    </select>
                    <select id="cbBestiaryTipo" aria-label="Filtrar por tipo">
                        <option value="">Tipo</option>
                    </select>
                    <select id="cbBestiaryTamanho" aria-label="Filtrar por tamanho">
                        <option value="">Tamanho</option>
                    </select>
                    <select id="cbBestiaryBioma" aria-label="Filtrar por bioma">
                        <option value="">Bioma</option>
                    </select>
                    <select id="cbBestiaryPapel" aria-label="Filtrar por papel tático">
                        <option value="">Papel</option>
                    </select>
                </div>
                <ul class="cb-ficha-list" id="cbFichaList">
                    <li class="cb-ficha-empty">Carregando fichas...</li>
                </ul>
                <footer class="cb-modal-footer">
                    <button type="button" id="cbAddGenericToken">+ Token genérico</button>
                </footer>
            </div>
        </div>

        <div class="cb-tooltip" id="cbTooltip" hidden></div>

        <div class="cb-modal-backdrop" id="cbTokenEditorModal" hidden>
            <div class="cb-modal cb-token-editor-modal" role="dialog" aria-modal="true" aria-labelledby="cbTokenEditorTitle">
                <header class="cb-modal-header">
                    <h2 id="cbTokenEditorTitle">Editar token</h2>
                    <button type="button" id="cbTokenEditorClose" aria-label="Fechar">×</button>
                </header>
                <div class="cb-token-editor-body">
                    <label>Nome
                        <input id="cbTokenName" type="text" />
                    </label>
                    <label>Imagem
                        <input id="cbTokenImage" type="text" placeholder="URL ou caminho da imagem" />
                    </label>
                    <label>Tipo
                        <select id="cbTokenType">
                            <option value="personagem">Personagem</option>
                            <option value="npc">NPC</option>
                            <option value="criatura">Criatura</option>
                            <option value="objeto">Objeto</option>
                            <option value="generico">Genérico</option>
                        </select>
                    </label>
                    <label>Representa ficha
                        <select id="cbTokenSheetLink"></select>
                    </label>
                    <label>Camada
                        <select id="cbTokenLayer">
                            <option value="tokens">Objetos/tokens</option>
                            <option value="mapa">Mapa/fundo</option>
                            <option value="mestre">Facilitador</option>
                        </select>
                    </label>
                    <div class="cb-editor-grid">
                        <label>Largura
                            <input id="cbTokenWidthCells" type="number" min="1" max="6" />
                        </label>
                        <label>Altura
                            <input id="cbTokenHeightCells" type="number" min="1" max="6" />
                        </label>
                    </div>
                    <div class="cb-editor-grid">
                        <label>PV atual
                            <input id="cbTokenPvAtual" type="number" min="0" />
                        </label>
                        <label>PV máximo
                            <input id="cbTokenPvMax" type="number" min="0" />
                        </label>
                    </div>
                    <div class="cb-editor-grid">
                        <label>PM atual
                            <input id="cbTokenPmAtual" type="number" min="0" />
                        </label>
                        <label>PM máximo
                            <input id="cbTokenPmMax" type="number" min="0" />
                        </label>
                    </div>
                    <label>Condições
                        <input id="cbTokenConditions" type="text" placeholder="caído, envenenado, sangrando" />
                    </label>
                </div>
                <footer class="cb-modal-footer">
                    <button type="button" id="cbTokenEditorCancel">Cancelar</button>
                    <button type="button" id="cbTokenEditorSave" class="cb-primary">Salvar token</button>
                </footer>
            </div>
        </div>

        <div class="cb-sheet-window" id="cbSheetWindow" hidden>
            <header class="cb-sheet-window-header" id="cbSheetWindowHeader">
                <h2 id="cbSheetWindowTitle">Ficha</h2>
                <button type="button" id="cbSheetWindowClose" aria-label="Fechar ficha">×</button>
            </header>
            <iframe id="cbSheetFrame" title="Ficha vinculada"></iframe>
        </div>

        <div class="cb-modal-backdrop" id="cbImageCropModal" hidden>
            <div class="cb-modal cb-adjust-modal" role="dialog" aria-modal="true" aria-labelledby="cbImageCropTitle">
                <header class="cb-modal-header">
                    <h2 id="cbImageCropTitle">Cortar imagem</h2>
                    <button type="button" id="cbImageCropClose" aria-label="Fechar">×</button>
                </header>
                <div class="cb-adjust-body">
                    <div class="cb-adjust-preview" id="cbImageCropPreview" aria-label="Prévia do corte">
                        <div class="cb-adjust-frame">
                            <img id="cbImageCropPreviewImg" src="" alt="" />
                            <span>Sem imagem</span>
                        </div>
                    </div>
                    <div class="cb-adjust-fields">
                        <label>Zoom <input id="cbImageCropZoom" type="range" min="0.2" max="6" step="0.05" value="1" /></label>
                        <label>Foco horizontal <input id="cbImageCropX" type="range" min="-220" max="220" step="1" value="0" /></label>
                        <label>Foco vertical <input id="cbImageCropY" type="range" min="-220" max="220" step="1" value="0" /></label>
                        <div class="cb-adjust-actions">
                            <button type="button" id="cbImageCropReset">Centralizar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="cb-modal-backdrop" id="cbAdjustModal" hidden>
            <div class="cb-modal cb-adjust-modal" role="dialog" aria-modal="true" aria-labelledby="cbAdjustTitle">
                <header class="cb-modal-header">
                    <h2 id="cbAdjustTitle">Ajustar token</h2>
                    <button type="button" id="cbAdjustClose" aria-label="Fechar">×</button>
                </header>
                <div class="cb-adjust-body">
                    <div class="cb-adjust-preview" id="cbAdjustPreview" aria-label="Prévia do token">
                        <div class="cb-adjust-frame">
                            <img id="cbAdjustPreviewImg" src="" alt="" />
                            <span id="cbAdjustPreviewEmpty">Sem imagem</span>
                        </div>
                    </div>
                    <div class="cb-adjust-fields">
                        <label>Zoom <input id="cbAdjustZoom" type="range" min="0.2" max="6" step="0.05" value="1" /></label>
                        <label>Foco horizontal <input id="cbAdjustX" type="range" min="-220" max="220" step="1" value="0" /></label>
                        <label>Foco vertical <input id="cbAdjustY" type="range" min="-220" max="220" step="1" value="0" /></label>
                        <div class="cb-adjust-actions">
                            <button type="button" id="cbAdjustReset">Centralizar</button>
                            <button type="button" id="cbAdjustUseBestiario">Usar ajuste do bestiário</button>
                            <button type="button" id="cbAdjustSaveSource" class="cb-primary">Salvar na origem</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <aside class="cb-action-panel" id="cbActionPanel" hidden aria-live="polite">
            <header>
                <h2 id="cbActionTitle">Ações</h2>
                <button type="button" id="cbActionClose" aria-label="Fechar ações">×</button>
            </header>
            <div class="cb-action-list" id="cbActionList"></div>
        </aside>

        <div class="cb-modal-backdrop" id="cbConfirm" hidden>
            <div class="cb-modal cb-confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="cbConfirmTitle">
                <header class="cb-modal-header">
                    <h2 id="cbConfirmTitle">Confirmar ação</h2>
                    <button type="button" id="cbConfirmClose" aria-label="Cancelar">×</button>
                </header>
                <div class="cb-confirm-body">
                    <p id="cbConfirmText">Direcionar esta ação ao alvo?</p>
                    <div class="cb-confirm-target" id="cbConfirmTargetSingle">
                        <div class="cb-confirm-target-thumb" id="cbConfirmTargetThumb"></div>
                        <div class="cb-confirm-target-info">
                            <div class="cb-confirm-target-name" id="cbConfirmTargetName">Alvo</div>
                            <div class="cb-confirm-target-meta" id="cbConfirmTargetMeta"></div>
                        </div>
                    </div>
                    <div class="cb-confirm-targets" id="cbConfirmTargetsList" hidden></div>
                </div>
                <footer class="cb-modal-footer">
                    <button type="button" id="cbConfirmCancel">Cancelar</button>
                    <button type="button" id="cbConfirmOk" class="cb-primary">Atacar</button>
                </footer>
            </div>
        </div>

        <div class="cb-modal-backdrop" id="cbResult" hidden>
            <div class="cb-modal cb-result-modal" role="dialog" aria-modal="true" aria-labelledby="cbResultTitle">
                <header class="cb-modal-header">
                    <h2 id="cbResultTitle">Resultado do ataque</h2>
                    <button type="button" id="cbResultClose" aria-label="Fechar">×</button>
                </header>
                <div class="cb-result-body" id="cbResultBody"></div>
                <footer class="cb-modal-footer">
                    <button type="button" id="cbResultOk" class="cb-primary">Fechar</button>
                </footer>
            </div>
        </div>

    </main>

    <script src="assets/js/regras-distancia.js?v=20260507a"></script>
    <script src="assets/js/campo-batalha.js?v=20260513b"></script>
</body>
</html>
