<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <title>Campo de Batalha — Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css?v=20260503g" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260503d" />
    <link rel="stylesheet" href="assets/css/campo-batalha.css?v=20260505r" />
</head>
<body class="cb-body">
    <script src="assets/js/transitions.js?v=20260503d"></script>

    <main class="cb-page">

        <header class="cb-topbar">
            <div class="cb-title">
                <a href="index.php" class="cb-brand-link" title="Voltar ao menu" aria-label="Voltar ao menu">
                    <img src="assets/img/logo-pindorama-rpg.png" alt="Pindorama RPG" />
                </a>
                <div>
                    <h1>Campo de Batalha</h1>
                    <p>Posicione tokens no grid, arraste, redimensione e gire.</p>
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
                <button type="button" id="cbToggleLayers">Camadas</button>
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
                    <span>Magnetizar cenário</span>
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

        <section class="cb-stage" id="cbStage">
            <div class="cb-viewport" id="cbViewport">
                <div class="cb-scenery-layer" id="cbSceneryLayer"></div>
                <div class="cb-board" id="cbBoard"></div>
                <div class="cb-guides-layer" id="cbGuidesLayer"></div>
                <div class="cb-tokens-layer" id="cbTokensLayer"></div>
            </div>
            <div class="cb-help" id="cbHelp">
                <strong>Controles:</strong>
                <span>Cada quadrado representa 1,5m × 1,5m</span>
                <span>Arraste o tabuleiro com 1 dedo / botão direito do mouse</span>
                <span>Pinch ou roda do mouse para zoom</span>
                <span>Toque/clique no token para selecionar</span>
            </div>
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

    <script src="assets/js/campo-batalha.js?v=20260505v"></script>
</body>
</html>
