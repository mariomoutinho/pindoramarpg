<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <title>Mesa de Jogo — Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css?v=20260503g" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260503d" />
    <link rel="stylesheet" href="assets/css/campo-batalha.css?v=20260505w" />
</head>
<body class="cb-body">
    <script src="assets/js/transitions.js?v=20260503d"></script>

    <main class="cb-page">

        <header class="cb-topbar">
            <div class="cb-title">
                <a href="index.php" class="cb-brand-link" title="Voltar ao menu" aria-label="Voltar ao menu">
                    <img src="assets/img/branding/pindorama-logo-nova.png" alt="Logo do Pindorama RPG" />
                </a>
                <div>
                    <h1>Mesa de Jogo</h1>
                    <p>Cenas em grid (1 quadrado = 1,5 m): tavernas, masmorras, florestas, batalhas — posicione tokens, arraste, redimensione e gire.</p>
                </div>
            </div>

            <nav class="cb-nav">
                <a class="cb-link-btn" href="index.php">Menu</a>
                <a class="cb-link-btn" href="fichas.php">Fichas</a>
                <a class="cb-link-btn" href="bestiario.php">Bestiário</a>
            </nav>
        </header>

        <section class="cb-toolbar">
            <div class="cb-tool-group">
                <button type="button" id="cbAddToken" class="cb-primary">+ Personagem</button>
                <button type="button" id="cbAddBestiaryToken" class="cb-primary">+ Criatura</button>
                <button type="button" id="cbRemoveToken" disabled>Remover seleção</button>
                <button type="button" id="cbRotateToken" disabled>Girar 90°</button>
                <button type="button" id="cbAdjustToken" disabled>Ajustar token</button>
                <button type="button" id="cbAddScenery">+ Cenário</button>
                <button type="button" id="cbAddNpcImage">+ Imagem NPC</button>
                <button type="button" id="cbToggleLayers">Camadas</button>
                <button type="button" id="cbSaveBattle" class="cb-save-button">Salvar campo</button>
                <span id="cbSaveStatus" class="cb-save-status" aria-live="polite"></span>
                <button type="button" id="cbClearAll">Limpar campo</button>
            </div>

            <div class="cb-tool-group">
                <button type="button" id="cbZoomOut" title="Reduzir">−</button>
                <span id="cbZoomDisplay" class="cb-zoom-display">100%</span>
                <button type="button" id="cbZoomIn" title="Ampliar">+</button>
                <button type="button" id="cbZoomReset" title="Resetar zoom e posição">Reset</button>
            </div>

<div class="cb-tool-group">
                <label class="cb-toggle">
                    <input type="checkbox" id="cbToggleNumbers" />
                    <span>Numerar células</span>
                </label>
                <label class="cb-toggle" title="Quando ativado, o cenário se alinha aos quadrados do grid ao mover/redimensionar.">
                    <input type="checkbox" id="cbSnapToGrid" />
                    <span>Magnetizar imagens</span>
                </label>
                <label class="cb-layer-select">
                    Camada
                    <select id="cbImageLayer">
                        <option value="scenery">Cenário</option>
                        <option value="npcs">NPCs</option>
                    </select>
                </label>
            </div>

            <div class="cb-tool-group cb-grid-config">
                <label>
                    Colunas
                    <input type="number" id="cbCols" min="5" max="60" value="20" />
                </label>
                <label>
                    Linhas
                    <input type="number" id="cbRows" min="5" max="60" value="15" />
                </label>
                <button type="button" id="cbApplySize">Aplicar</button>
            </div>
        </section>

        <section class="cb-pages-bar" aria-label="Páginas do campo">
            <div class="cb-pages-tabs" id="cbPagesTabs"></div>
            <button type="button" id="cbAddPage" class="cb-pages-add" title="Nova página">+</button>
        </section>

        <section class="cb-battle-shell">
            <section class="cb-stage" id="cbStage">
                <div class="cb-viewport" id="cbViewport">
                    <div class="cb-map-background" id="cbMapBackground"></div>
                    <div class="cb-scenery-layer" id="cbSceneryLayer"></div>
                    <div class="cb-board" id="cbBoard"></div>
                    <div class="cb-npc-layer" id="cbNpcLayer"></div>
                    <div class="cb-guides-layer" id="cbGuidesLayer"></div>
                    <div class="cb-tokens-layer" id="cbTokensLayer"></div>
                </div>
                <div class="cb-help" id="cbHelp">
                    <strong>Controles:</strong>
                    <span>Cada quadrado representa 1,5m × 1,5m</span>
                    <span>Arraste o tabuleiro pelo vazio; tokens e imagens têm seleção própria</span>
                    <span>Pinch ou roda do mouse para zoom</span>
                    <span>Duplo clique no token abre a ficha vinculada</span>
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

                <div class="cb-sidebar-panel" data-panel="iniciativa">
                    <header class="cb-sidebar-header">
                        <h2>Iniciativa</h2>
                        <button type="button" id="cbNextTurn">Próximo</button>
                    </header>
                    <div class="cb-initiative-actions">
                        <button type="button" id="cbAddTurnSelected">Rolar seleção</button>
                        <button type="button" id="cbSortTurns">Ordenar</button>
                    </div>
                    <div class="cb-turn-list" id="cbTurnList"></div>
                </div>

                <div class="cb-sidebar-panel" data-panel="cena">
                    <header class="cb-sidebar-header">
                        <h2>Cena</h2>
                    </header>
                    <div class="cb-scene-settings">
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
                            <option value="mestre">Mestre</option>
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
    <script src="assets/js/campo-batalha.js?v=20260505ab"></script>
</body>
</html>
