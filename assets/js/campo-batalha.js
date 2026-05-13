/* ====================================================================
   Pindorama — Campo de Batalha
   Vanilla JS: grid CSS + tokens posicionados absolutamente, com
   drag&drop, snap-to-grid, pinch-zoom, pan, resize e rotação.
   ==================================================================== */

(() => {
    'use strict';

    // ----------------------------------------------------------------
    // Estado
    // ----------------------------------------------------------------

    // Quando a Mesa de Jogo é aberta com ?aventura_id=N, o backend
    // roteia carregar/salvar para data/aventuras/<id>/cenas.json — basta
    // anexar o parâmetro às URLs. Sem contexto, segue o estado global.
    const AVENTURA_ID = (typeof window !== 'undefined' && window.PINDORAMA_AVENTURA_ID) || null;

    // Chave do localStorage isolada por contexto: a Mesa de Jogo padrão
    // tem a sua, e cada aventura tem a sua. Isso evita que uma aventura
    // recém-criada (sem cenas no servidor) "herde" o último estado salvo
    // localmente da mesa padrão ou de outra aventura.
    const STORAGE_KEY = AVENTURA_ID
        ? ('pindorama:campo-batalha:av:' + AVENTURA_ID + ':v1')
        : 'pindorama:campo-batalha:v1';

    function withAventuraParam(url) {
        if (!AVENTURA_ID) return url;
        const sep = url.indexOf('?') >= 0 ? '&' : '?';
        return url + sep + 'aventura_id=' + encodeURIComponent(AVENTURA_ID);
    }
    const SERVER_STATE_URL = withAventuraParam('carregar-campo-batalha.php');
    const SERVER_SAVE_URL  = withAventuraParam('salvar-campo-batalha.php');
    const SERVER_IMAGE_UPLOAD_URL = 'salvar-imagem-campo-batalha.php';
    const CLIENT_UPLOAD_TARGET_BYTES = 4700 * 1024;
    const BESTIARIO_STORAGE_KEY = 'pindorama.bestiario.criaturas';
    const BESTIARIO_TOKEN_KEY = 'pindorama.campoBatalha.tokenPendente';
    let CELL_SIZE = 56;            // tamanho base da célula em pixels, persistido por cena
    const MIN_SCALE = 0.1;
    const MAX_SCALE = 8;
    const LONG_PRESS_MS = 520;
    const LONG_PRESS_MOVE_TOLERANCE = 8;
    const GRID_METERS = 1.5;
    const SIZE_BY_CATEGORY = {
        minusculo: 1,
        minúsculo: 1,
        pequeno: 1,
        medio: 1,
        médio: 1,
        grande: 2,
        enorme: 3,
        colossal: 6
    };

    const state = {
        cols: 20,
        rows: 15,
        showNumbers: false,
        gridOpacity: 0.45,
        mapBackground: '',
        viewport: { x: 0, y: 0, scale: 1 },
        tokens: [],                // { id, fichaId|null, name, tokenImage, tokenImageAdjust, fotoImage, col, row, sizeCells, rotation }
        scenery: [],               // { id, name, src, x, y, width, height, rotation, zIndex, hidden, locked }
        snapToGrid: false,         // ímã: cenário gruda nas células do grid
        activeImageLayer: 'scenery',
        selectedId: null,
        selectedSceneryId: null,
        pages: [],                 // [{ id, name, cols, rows, viewport, tokens, scenery, showNumbers }]
        activePageId: null,
        activeSidebarTab: 'registro',
        rollLog: [],
        turns: [],
        currentTurnIndex: 0,
        currentRound: 1,           // rodada de combate da cena ativa
        tipo: '',                  // tipo da cena ativa: combate/cidade/taverna/...
        notasNarrador: '',         // anotações livres do narrador para a cena ativa
        terrainDifficult: new Set(), // células de terreno difícil ("col,row")
        terrainBarriers:  new Set(), // células de barreira (bloqueiam linha de efeito de ataques à distância)
        terrainSpecial: {},          // {"col,row": "bioma"} — terreno especial com subtipo
        terrainMarkingMode: false,   // toggle UI: clicar no board adiciona/remove marca
        terrainMarkingType: 'difficult', // 'difficult' | 'barrier' | 'special'
        terrainSpecialBiome: 'mangue', // bioma escolhido ao marcar 'special'
        modoCena: 'edit',            // 'edit' | 'play' — modo da Mesa de Jogo
        sceneBiome: '',              // bioma/ambiente dominante da cena
        combateAtivo: false,         // true quando há um combate em curso na cena
        fichas: [],                // cache da lista de fichas
        fichasLoaded: false,
        bestiario: [],             // cache da lista de criaturas do bestiário
        bestiarioFiltros: {},
        bestiarioLoaded: false,
        ancestralidadeSizes: {},
        ancestralidadeSizesLoaded: false,
        modalMode: 'fichas',
        reachPreview: null,
        tokenEditorId: null
    };
    let saveTimer = null;
    let pendingServerSave = null;

    // ----------------------------------------------------------------
    // Refs DOM
    // ----------------------------------------------------------------

    const els = {
        stage: document.getElementById('cbStage'),
        viewport: document.getElementById('cbViewport'),
        board: document.getElementById('cbBoard'),
        mapBackground: document.getElementById('cbMapBackground'),
        tokensLayer: document.getElementById('cbTokensLayer'),
        addToken: document.getElementById('cbAddToken'),
        addBestiaryToken: document.getElementById('cbAddBestiaryToken'),
        removeToken: document.getElementById('cbRemoveToken'),
        rotateToken: document.getElementById('cbRotateToken'),
        adjustToken: document.getElementById('cbAdjustToken'),
        clearAll: document.getElementById('cbClearAll'),
        adjustModal: document.getElementById('cbAdjustModal'),
        adjustClose: document.getElementById('cbAdjustClose'),
        adjustPreview: document.getElementById('cbAdjustPreview'),
        adjustPreviewImg: document.getElementById('cbAdjustPreviewImg'),
        adjustZoom: document.getElementById('cbAdjustZoom'),
        adjustX: document.getElementById('cbAdjustX'),
        adjustY: document.getElementById('cbAdjustY'),
        adjustReset: document.getElementById('cbAdjustReset'),
        adjustUseBestiario: document.getElementById('cbAdjustUseBestiario'),
        adjustSaveSource: document.getElementById('cbAdjustSaveSource'),
        sceneryLayer: document.getElementById('cbSceneryLayer'),
        npcLayer: document.getElementById('cbNpcLayer'),
        guidesLayer: document.getElementById('cbGuidesLayer'),
        addScenery: document.getElementById('cbAddScenery'),
        addNpcImage: document.getElementById('cbAddNpcImage'),
        toggleLayers: document.getElementById('cbToggleLayers'),
        saveBattle: document.getElementById('cbSaveBattle'),
        saveStatus: document.getElementById('cbSaveStatus'),
        pagesTabs: document.getElementById('cbPagesTabs'),
        addPage: document.getElementById('cbAddPage'),
        layersPanel: document.getElementById('cbLayersPanel'),
        layersClose: document.getElementById('cbLayersClose'),
        layersList: document.getElementById('cbLayersList'),
        sceneryModal: document.getElementById('cbSceneryModal'),
        sceneryClose: document.getElementById('cbSceneryClose'),
        sceneryName: document.getElementById('cbSceneryName'),
        sceneryUrl: document.getElementById('cbSceneryUrl'),
        sceneryFile: document.getElementById('cbSceneryFile'),
        sceneryLayerTarget: document.getElementById('cbSceneryLayerTarget'),
        sceneryCancel: document.getElementById('cbSceneryCancel'),
        sceneryConfirm: document.getElementById('cbSceneryConfirm'),
        snapToGrid: document.getElementById('cbSnapToGrid'),
        imageLayer: document.getElementById('cbImageLayer'),
        zoomIn: document.getElementById('cbZoomIn'),
        zoomOut: document.getElementById('cbZoomOut'),
        zoomReset: document.getElementById('cbZoomReset'),
        zoomDisplay: document.getElementById('cbZoomDisplay'),
        toggleNumbers: document.getElementById('cbToggleNumbers'),
        cols: document.getElementById('cbCols'),
        rows: document.getElementById('cbRows'),
        applySize: document.getElementById('cbApplySize'),
        modal: document.getElementById('cbModal'),
        modalClose: document.getElementById('cbModalClose'),
        modalSearch: document.getElementById('cbModalSearch'),
        modalTitle: document.getElementById('cbModalTitle'),
        bestiaryFilters: document.getElementById('cbBestiaryFilters'),
        bestiaryNd: document.getElementById('cbBestiaryNd'),
        bestiaryTipo: document.getElementById('cbBestiaryTipo'),
        bestiaryTamanho: document.getElementById('cbBestiaryTamanho'),
        bestiaryBioma: document.getElementById('cbBestiaryBioma'),
        bestiaryPapel: document.getElementById('cbBestiaryPapel'),
        fichaList: document.getElementById('cbFichaList'),
        addGenericToken: document.getElementById('cbAddGenericToken'),
        tooltip: document.getElementById('cbTooltip'),
        actionPanel: document.getElementById('cbActionPanel'),
        actionTitle: document.getElementById('cbActionTitle'),
        actionList: document.getElementById('cbActionList'),
        actionClose: document.getElementById('cbActionClose'),
        confirm: document.getElementById('cbConfirm'),
        confirmText: document.getElementById('cbConfirmText'),
        confirmTargetThumb: document.getElementById('cbConfirmTargetThumb'),
        confirmTargetName: document.getElementById('cbConfirmTargetName'),
        confirmTargetMeta: document.getElementById('cbConfirmTargetMeta'),
        confirmClose: document.getElementById('cbConfirmClose'),
        confirmCancel: document.getElementById('cbConfirmCancel'),
        confirmOk: document.getElementById('cbConfirmOk'),
        confirmTargetSingle: document.getElementById('cbConfirmTargetSingle'),
        confirmTargetsList: document.getElementById('cbConfirmTargetsList'),
        result: document.getElementById('cbResult'),
        resultBody: document.getElementById('cbResultBody'),
        resultClose: document.getElementById('cbResultClose'),
        resultOk: document.getElementById('cbResultOk'),
        imageCropModal: document.getElementById('cbImageCropModal'),
        imageCropClose: document.getElementById('cbImageCropClose'),
        imageCropPreview: document.getElementById('cbImageCropPreview'),
        imageCropPreviewImg: document.getElementById('cbImageCropPreviewImg'),
        imageCropZoom: document.getElementById('cbImageCropZoom'),
        imageCropX: document.getElementById('cbImageCropX'),
        imageCropY: document.getElementById('cbImageCropY'),
        imageCropReset: document.getElementById('cbImageCropReset'),
        sidebarTabs: document.querySelectorAll('.cb-sidebar-tabs button'),
        sidebarPanels: document.querySelectorAll('.cb-sidebar-panel'),
        clearLog: document.getElementById('cbClearLog'),
        diceForm: document.getElementById('cbDiceForm'),
        diceFormula: document.getElementById('cbDiceFormula'),
        logList: document.getElementById('cbLogList'),
        refreshFichas: document.getElementById('cbRefreshFichas'),
        sidebarFichaSearch: document.getElementById('cbSidebarFichaSearch'),
        sidebarFichas: document.getElementById('cbSidebarFichas'),
        refreshBestiary: document.getElementById('cbRefreshBestiary'),
        sidebarBestiarySearch: document.getElementById('cbSidebarBestiarySearch'),
        sidebarBestiary: document.getElementById('cbSidebarBestiary'),
        editSelectedToken: document.getElementById('cbEditSelectedToken'),
        selectedTokenTools: document.getElementById('cbSelectedTokenTools'),
        sidebarTokens: document.getElementById('cbSidebarTokens'),
        nextTurn: document.getElementById('cbNextTurn'),
        addTurnSelected: document.getElementById('cbAddTurnSelected'),
        rollSceneInitiative: document.getElementById('cbRollSceneInitiative'),
        resetMovimentos: document.getElementById('cbResetMovimentos'),
        sortTurns: document.getElementById('cbSortTurns'),
        roundNumber: document.getElementById('cbRoundNumber'),
        roundIncrement: document.getElementById('cbRoundIncrement'),
        roundReset: document.getElementById('cbRoundReset'),
        turnList: document.getElementById('cbTurnList'),
        mapImage: document.getElementById('cbMapImage'),
        mapFile: document.getElementById('cbMapFile'),
        gridOpacity: document.getElementById('cbGridOpacity'),
        gridSize: document.getElementById('cbGridSize'),
        clearMapImage: document.getElementById('cbClearMapImage'),
        sceneType: document.getElementById('cbSceneType'),
        sceneNotes: document.getElementById('cbSceneNotes'),
        terrainLayer: document.getElementById('cbTerrainLayer'),
        toggleTerrainMode: document.getElementById('cbToggleTerrainMode'),
        clearTerrain: document.getElementById('cbClearTerrain'),
        terrainCount: document.getElementById('cbTerrainCount'),
        terrainCountDifficult: document.getElementById('cbTerrainCountDifficult'),
        terrainCountBarrier:  document.getElementById('cbTerrainCountBarrier'),
        terrainTypeRadios: Array.from(document.querySelectorAll('input[name="cbTerrainType"]')),
        terrainCountSpecial: document.getElementById('cbTerrainCountSpecial'),
        terrainSpecialBiomeLabel: document.getElementById('cbTerrainSpecialBiomeLabel'),
        terrainSpecialBiome: document.getElementById('cbTerrainSpecialBiome'),
        modeEditBtn: document.getElementById('cbModeEdit'),
        modePlayBtn: document.getElementById('cbModePlay'),
        sceneBiome:  document.getElementById('cbSceneBiome'),
        sceneBiomeTag: document.getElementById('cbSceneBiomeTag'),
        startCombatBtn: document.getElementById('cbStartCombat'),
        endCombatBtn:   document.getElementById('cbEndCombat'),
        tokenEditorModal: document.getElementById('cbTokenEditorModal'),
        tokenEditorClose: document.getElementById('cbTokenEditorClose'),
        tokenEditorCancel: document.getElementById('cbTokenEditorCancel'),
        tokenEditorSave: document.getElementById('cbTokenEditorSave'),
        tokenName: document.getElementById('cbTokenName'),
        tokenImage: document.getElementById('cbTokenImage'),
        tokenType: document.getElementById('cbTokenType'),
        tokenSheetLink: document.getElementById('cbTokenSheetLink'),
        tokenLayer: document.getElementById('cbTokenLayer'),
        tokenWidthCells: document.getElementById('cbTokenWidthCells'),
        tokenHeightCells: document.getElementById('cbTokenHeightCells'),
        tokenPvAtual: document.getElementById('cbTokenPvAtual'),
        tokenPvMax: document.getElementById('cbTokenPvMax'),
        tokenPmAtual: document.getElementById('cbTokenPmAtual'),
        tokenPmMax: document.getElementById('cbTokenPmMax'),
        tokenConditions: document.getElementById('cbTokenConditions'),
        sheetWindow: document.getElementById('cbSheetWindow'),
        sheetWindowHeader: document.getElementById('cbSheetWindowHeader'),
        sheetWindowTitle: document.getElementById('cbSheetWindowTitle'),
        sheetWindowClose: document.getElementById('cbSheetWindowClose'),
        sheetFrame: document.getElementById('cbSheetFrame')
    };

    // Estado pendente do modal de confirmação de ação
    let pendingAttack = null;

    const ACTION_LABELS = {
        ataques: 'Ataques',
        magias: 'Magias',
        poderes: 'Poderes',
        equipamentos: 'Equipamentos',
        manobras: 'Manobras'
    };

    const ACTION_SHORT_LABELS = {
        ataques: 'ATQ',
        magias: 'MAG',
        poderes: 'POD',
        equipamentos: 'EQP',
        manobras: 'MAN'
    };

    /* Ações de cena (capítulo "Jogando" do livro Pindorama).
       Botões puramente declarativos: clicar registra no log "Token X
       declarou Y" para o narrador acompanhar a ordem de ações da
       rodada. Não mexem em PV/PM/condições — esses ficam para itens
       posteriores do plano (G, I) com confirmação manual. */
    const SCENE_ACTION_CATEGORIES = [
        {
            key: 'padrao',
            label: 'Ação padrão',
            hint: 'A coisa mais importante do turno.',
            actions: [
                { label: 'Agredir', detail: 'Ataque com arma corpo a corpo ou à distância.' },
                { label: 'Lançar magia', detail: 'Maioria das magias usa ação padrão.' },
                { label: 'Mirar', detail: 'Anula penalidade de –5 contra alvo em combate corpo a corpo.' },
                { label: 'Preparar', detail: 'Prepara ação para usar fora do turno, como reação.' },
                { label: 'Atropelar', detail: 'Avança pelo espaço de uma criatura (teste oposto).' },
                { label: 'Fintar', detail: 'Enganação vs Reflexos para deixar alvo desprevenido.' },
                { label: 'Usar habilidade/item', detail: 'Habilidade especial ou item mágico (ex: poção).' }
            ]
        },
        {
            key: 'movimento',
            label: 'Ação de movimento',
            hint: 'Mover-se ou manipular algo de posição.',
            actions: [
                { label: 'Movimentar-se', detail: 'Percorre até o deslocamento (padrão 9 m / 6 quadrados).' },
                { label: 'Levantar-se', detail: 'Levantar do chão, cama, cadeira.' },
                { label: 'Sacar/guardar item', detail: 'Tirar arma da bainha ou guardar.' },
                { label: 'Manipular item', detail: 'Pegar item da mochila, abrir porta, atirar corda.' }
            ]
        },
        {
            key: 'completa',
            label: 'Ação completa',
            hint: 'Consome o turno todo (padrão + movimento juntos).',
            actions: [
                { label: 'Investida', detail: 'Até o dobro do deslocamento + ataque corpo a corpo: +2 ataque, –2 Defesa.' },
                { label: 'Corrida', detail: 'Corre mais que o deslocamento normal (Atletismo).' },
                { label: 'Golpe de misericórdia', detail: 'Alvo adjacente e indefeso: crítico automático + chance de morte instantânea.' }
            ]
        },
        {
            key: 'livre',
            label: 'Ação livre',
            hint: 'Tempo/esforço quase nulo, só no próprio turno.',
            actions: [
                { label: 'Atrasar', detail: 'Reduz iniciativa voluntariamente para agir depois na rodada.' },
                { label: 'Falar', detail: 'Falar (limite padrão ~20 palavras na rodada).' },
                { label: 'Jogar-se no chão', detail: 'Cai voluntariamente; aplica benefícios/penalidades de caído.' },
                { label: 'Largar item', detail: 'Deixa cair item que estava segurando.' }
            ]
        },
        {
            key: 'reacao',
            label: 'Reação',
            hint: 'Resposta automática; pode ocorrer fora do próprio turno.',
            actions: [
                { label: 'Reagir', detail: 'Resposta a evento (ex.: esquiva, habilidade engatilhada).' }
            ]
        }
    ];

    // ----------------------------------------------------------------
    // Persistência
    // ----------------------------------------------------------------

    function makeStateSnapshot() {
        syncLiveToActivePage();
        return {
            pages: state.pages,
            activePageId: state.activePageId,
            snapToGrid: !!state.snapToGrid,
            activeImageLayer: state.activeImageLayer,
            activeSidebarTab: state.activeSidebarTab
        };
    }

    function saveState() {
        const snap = makeStateSnapshot();
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
        } catch (e) {
            console.warn('Não foi possível salvar o Campo de Batalha no navegador. Tentando salvar no servidor.', e);
        }
        scheduleServerSave(snap);
    }

    function scheduleServerSave(snapshot) {
        pendingServerSave = snapshot;
        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(() => flushServerSave(false), 350);
    }

    async function flushServerSave(useBeacon = false, explicitSnapshot = null) {
        if (!pendingServerSave && !explicitSnapshot) return true;
        const snapshot = pendingServerSave;
        pendingServerSave = null;
        window.clearTimeout(saveTimer);
        saveTimer = null;
        const body = JSON.stringify(explicitSnapshot || snapshot);

        if (useBeacon && navigator.sendBeacon) {
            const blob = new Blob([body], { type: 'application/json' });
            navigator.sendBeacon(SERVER_SAVE_URL, blob);
            return true;
        }

        try {
            const resp = await fetch(SERVER_SAVE_URL, {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body
            });
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const data = await resp.json();
            if (!data.success) throw new Error(data.message || 'Falha ao salvar.');
            return true;
        } catch (error) {
            console.warn('Não foi possível salvar o Campo de Batalha no servidor.', error);
            pendingServerSave = explicitSnapshot || snapshot;
            throw error;
        }
    }

    function setSaveStatus(text, kind = '') {
        if (!els.saveStatus) return;
        els.saveStatus.textContent = text || '';
        els.saveStatus.classList.toggle('is-ok', kind === 'ok');
        els.saveStatus.classList.toggle('is-error', kind === 'error');
    }

    async function confirmSaveBattle() {
        const snapshot = makeStateSnapshot();
        if (els.saveBattle) els.saveBattle.disabled = true;
        setSaveStatus('Salvando...', '');
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
        } catch (e) {
            console.warn('O navegador não guardou uma cópia local do Campo de Batalha.', e);
        }
        try {
            await flushServerSave(false, snapshot);
            pendingServerSave = null;
            setSaveStatus('Salvo.', 'ok');
        } catch (error) {
            setSaveStatus('Falha ao salvar.', 'error');
            alert('Não foi possível salvar a Mesa de Jogo. Se a imagem for muito grande, reduza o arquivo ou aumente o limite de upload do PHP.');
        } finally {
            if (els.saveBattle) els.saveBattle.disabled = false;
        }
    }

    async function uploadBattleImage(file) {
        const uploadFile = await prepareBattleImageForUpload(file);
        const form = new FormData();
        form.append('imagem', uploadFile, uploadFile.name || file.name || 'campo.webp');
        const resp = await fetch(SERVER_IMAGE_UPLOAD_URL, {
            method: 'POST',
            credentials: 'same-origin',
            body: form
        });
        let data = null;
        try {
            data = await resp.json();
        } catch (_) {}
        if (!resp.ok || !data?.success || !data.path) {
            throw new Error(data?.message || 'Não foi possível salvar a imagem.');
        }
        return data.path;
    }

    async function prepareBattleImageForUpload(file) {
        if (!file || file.size <= CLIENT_UPLOAD_TARGET_BYTES || file.type === 'image/gif') {
            return file;
        }

        setSaveStatus('Otimizando imagem...', '');
        const img = await loadImageFromFile(file);
        const sizes = [2600, 2200, 1800, 1400];
        const qualities = [0.86, 0.76, 0.66, 0.56];
        let best = null;

        for (const maxSide of sizes) {
            const scale = Math.min(1, maxSide / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
            const width = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
            const height = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) break;
            ctx.drawImage(img, 0, 0, width, height);

            for (const quality of qualities) {
                const blob = await canvasToBlob(canvas, 'image/webp', quality)
                    || await canvasToBlob(canvas, 'image/jpeg', quality);
                if (!blob) continue;
                if (!best || blob.size < best.size) best = blob;
                if (blob.size <= CLIENT_UPLOAD_TARGET_BYTES) {
                    return new File([blob], replaceImageExtension(file.name, blob.type), { type: blob.type });
                }
            }
        }

        if (best && best.size < file.size) {
            return new File([best], replaceImageExtension(file.name, best.type), { type: best.type });
        }

        return file;
    }

    function loadImageFromFile(file) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Não foi possível ler a imagem enviada.'));
            };
            img.src = url;
        });
    }

    function canvasToBlob(canvas, type, quality) {
        return new Promise(resolve => canvas.toBlob(resolve, type, quality));
    }

    function replaceImageExtension(name, mime) {
        const ext = mime === 'image/jpeg' ? 'jpg' : 'webp';
        const base = String(name || 'campo').replace(/\.[^.]+$/, '');
        return `${base || 'campo'}.${ext}`;
    }

    async function loadState() {
        const tag = '[Mesa de Jogo]';
        let diagnostico = null; // texto a mostrar no banner se algo falhar
        try {
            console.info(tag, 'Carregando estado de', SERVER_STATE_URL);
            const resp = await fetch(SERVER_STATE_URL, {
                credentials: 'same-origin',
                cache: 'no-store'
            });
            console.info(tag, 'HTTP', resp.status, resp.statusText);
            if (resp.ok) {
                let data;
                try {
                    data = await resp.json();
                } catch (eParse) {
                    diagnostico = 'Servidor respondeu, mas o JSON é inválido. Veja o console.';
                    console.warn(tag, 'JSON inválido na resposta:', eParse);
                }
                if (data) {
                    if (data.success && data.state) {
                        const numPages = Array.isArray(data.state.pages) ? data.state.pages.length : 0;
                        console.info(tag, `Estado recebido com ${numPages} cena${numPages === 1 ? '' : 's'}.`);
                        try {
                            if (applyStateSnapshot(data.state)) {
                                console.info(tag, 'Estado aplicado. Cena ativa:', state.activePageId);
                                return;
                            }
                            diagnostico = 'Servidor retornou ' + numPages + ' cena(s), mas applyStateSnapshot falhou.';
                            console.warn(tag, 'applyStateSnapshot retornou false — usando fallback.');
                        } catch (eApply) {
                            diagnostico = 'Erro ao processar as ' + numPages + ' cena(s) recebidas: ' + (eApply && eApply.message ? eApply.message : eApply);
                            console.error(tag, 'applyStateSnapshot lançou:', eApply);
                        }
                    } else if (data.success && !data.state) {
                        console.info(tag, 'Servidor retornou estado vazio — vai criar cena padrão.');
                    } else {
                        diagnostico = 'Servidor sem sucesso: ' + (data.message || 'sem mensagem');
                        console.warn(tag, 'Resposta sem sucesso:', data);
                    }
                }
            } else {
                diagnostico = 'Falha HTTP ' + resp.status + ' ao carregar estado.';
                console.warn(tag, diagnostico);
            }
        } catch (e) {
            diagnostico = 'Erro de rede ao carregar estado: ' + (e && e.message ? e.message : e);
            console.warn(tag, 'Erro na requisição de carregar estado:', e);
        }

        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                console.info(tag, 'Sem fallback no localStorage. Criando cena padrão.');
                ensureInitialPage();
            } else {
                const snap = JSON.parse(raw);
                console.info(tag, 'Recuperando estado do localStorage.');
                applyStateSnapshot(snap);
            }
        } catch (e) {
            console.warn(tag, 'Erro no fallback do localStorage:', e);
            ensureInitialPage();
        }

        if (diagnostico) {
            mostrarBannerDiagnostico(diagnostico);
        }
    }

    /** Banner visível na cena quando há falha no carregamento. */
    function mostrarBannerDiagnostico(msg) {
        try {
            let banner = document.getElementById('cbDiagBanner');
            if (!banner) {
                banner = document.createElement('div');
                banner.id = 'cbDiagBanner';
                banner.className = 'cb-diag-banner';
                banner.innerHTML = '<strong>Atenção:</strong> <span></span> ' +
                    '<button type="button" aria-label="Fechar">×</button>';
                banner.querySelector('button').addEventListener('click', () => banner.remove());
                document.body.appendChild(banner);
            }
            banner.querySelector('span').textContent = msg;
        } catch (_) { /* nunca trava */ }
    }

    function applyStateSnapshot(snap) {
        if (!snap || typeof snap !== 'object') return false;
        if (typeof snap.snapToGrid === 'boolean') state.snapToGrid = snap.snapToGrid;
        if (snap.activeImageLayer === 'npcs' || snap.activeImageLayer === 'scenery') {
            state.activeImageLayer = snap.activeImageLayer;
        }
        if (snap.activeSidebarTab) state.activeSidebarTab = snap.activeSidebarTab;
        if (Array.isArray(snap.pages) && snap.pages.length) {
            state.pages = snap.pages.map(normalizePage);
            state.activePageId = snap.activePageId && state.pages.find(p => p.id === snap.activePageId)
                ? snap.activePageId
                : state.pages[0].id;
            const active = state.pages.find(p => p.id === state.activePageId) || state.pages[0];
            loadPageIntoLive(active);
            return true;
        }

        if (snap.cols || snap.rows || Array.isArray(snap.tokens)) {
            const legacy = normalizePage({
                id: 'page_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36),
                name: 'Cena 1',
                cols: snap.cols || 20,
                rows: snap.rows || 15,
                viewport: snap.viewport || { x: 0, y: 0, scale: 1 },
                tokens: Array.isArray(snap.tokens) ? snap.tokens.map(migrateLegacyTokenFields) : [],
                scenery: [],
                showNumbers: !!snap.showNumbers,
                gridOpacity: snap.gridOpacity,
                gridSize: snap.gridSize,
                mapBackground: snap.mapBackground,
                rollLog: snap.rollLog,
                turns: snap.turns,
                currentTurnIndex: snap.currentTurnIndex
            });
            state.pages = [legacy];
            state.activePageId = legacy.id;
            loadPageIntoLive(legacy);
            saveState();
            return true;
        }

        ensureInitialPage();
        return true;
    }

    function ensureInitialPage() {
        const page = createDefaultPage('Cena 1');
        state.pages = [page];
        state.activePageId = page.id;
        loadPageIntoLive(page);
    }

    function createDefaultPage(name) {
        return normalizePage({
            id: 'page_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36),
            name: name || 'Nova cena',
            cols: 20,
            rows: 15,
            viewport: { x: 0, y: 0, scale: 1 },
            tokens: [],
            scenery: [],
            showNumbers: false,
            gridOpacity: 0.45,
            gridSize: CELL_SIZE,
            mapBackground: '',
            rollLog: [],
            turns: [],
            currentTurnIndex: 0,
            currentRound: 1,
            tipo: '',
            notasNarrador: '',
            terrainDifficult: []
        });
    }

    function normalizePage(page) {
        return {
            id: page.id || ('page_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36)),
            name: page.name || 'Cena',
            cols: Number(page.cols) || 20,
            rows: Number(page.rows) || 15,
            viewport: page.viewport && typeof page.viewport === 'object'
                ? { x: Number(page.viewport.x) || 0, y: Number(page.viewport.y) || 0, scale: Number(page.viewport.scale) || 1 }
                : { x: 0, y: 0, scale: 1 },
            tokens: Array.isArray(page.tokens) ? page.tokens.map(migrateLegacyTokenFields) : [],
            scenery: Array.isArray(page.scenery) ? page.scenery.map(normalizeSceneryItem) : [],
            showNumbers: !!page.showNumbers,
            gridOpacity: clamp(Number(page.gridOpacity) || 0.45, 0.05, 1),
            gridSize: clamp(Math.round(Number(page.gridSize) || CELL_SIZE), 36, 96),
            mapBackground: page.mapBackground || '',
            rollLog: Array.isArray(page.rollLog) ? page.rollLog.slice(0, 80) : [],
            turns: Array.isArray(page.turns) ? page.turns.map(normalizeTurn).filter(Boolean) : [],
            currentTurnIndex: Math.max(0, Number(page.currentTurnIndex) || 0),
            currentRound: Math.max(1, Number(page.currentRound) || 1),
            tipo: typeof page.tipo === 'string' ? page.tipo : '',
            notasNarrador: typeof page.notasNarrador === 'string' ? page.notasNarrador : '',
            terrainDifficult: Array.isArray(page.terrainDifficult)
                ? page.terrainDifficult.filter(s => typeof s === 'string' && /^\d+,\d+$/.test(s))
                : [],
            terrainBarriers: Array.isArray(page.terrainBarriers)
                ? page.terrainBarriers.filter(s => typeof s === 'string' && /^\d+,\d+$/.test(s))
                : [],
            terrainSpecial: (page.terrainSpecial && typeof page.terrainSpecial === 'object')
                ? page.terrainSpecial : {},
            modoCena: page.modoCena === 'play' ? 'play' : 'edit',
            sceneBiome: typeof page.sceneBiome === 'string' ? page.sceneBiome : '',
            combateAtivo: !!page.combateAtivo
        };
    }

    function normalizeTurn(turn) {
        if (!turn || !turn.tokenId) return null;
        return {
            id: turn.id || ('turn_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36)),
            tokenId: turn.tokenId,
            initiative: Number(turn.initiative) || 0,
            surprised: !!turn.surprised
        };
    }

    function normalizeSceneryItem(item) {
        const layer = item.layer === 'npcs' ? 'npcs' : 'scenery';
        return {
            id: item.id || ('scn_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36)),
            name: item.name || 'Cenário',
            src: item.src || '',
            x: Number(item.x) || 0,
            y: Number(item.y) || 0,
            width: Number(item.width) || 200,
            height: Number(item.height) || 200,
            rotation: Number(item.rotation) || 0,
            zIndex: Number.isFinite(item.zIndex) ? item.zIndex : 0,
            hidden: !!item.hidden,
            locked: !!item.locked,
            layer,
            crop: normalizeImageCrop(item.crop)
        };
    }

    function normalizeImageCrop(value) {
        const v = value && typeof value === 'object' ? value : {};
        return {
            scale: Math.min(6, Math.max(0.2, Number(v.scale) || 1)),
            x: Math.min(220, Math.max(-220, Number(v.x) || 0)),
            y: Math.min(220, Math.max(-220, Number(v.y) || 0))
        };
    }

    function syncLiveToActivePage() {
        const page = state.pages.find(p => p.id === state.activePageId);
        if (!page) return;
        page.cols = state.cols;
        page.rows = state.rows;
        page.viewport = { ...state.viewport };
        page.tokens = state.tokens;
        page.scenery = state.scenery;
        page.showNumbers = state.showNumbers;
        page.gridOpacity = state.gridOpacity;
        page.gridSize = CELL_SIZE;
        page.mapBackground = state.mapBackground;
        page.rollLog = state.rollLog;
        page.turns = state.turns;
        page.currentTurnIndex = state.currentTurnIndex;
        page.currentRound = state.currentRound || 1;
        page.tipo = state.tipo || '';
        page.notasNarrador = state.notasNarrador || '';
        page.terrainDifficult = state.terrainDifficult instanceof Set
            ? Array.from(state.terrainDifficult)
            : [];
        page.terrainBarriers = state.terrainBarriers instanceof Set
            ? Array.from(state.terrainBarriers)
            : [];
        page.terrainSpecial = state.terrainSpecial && typeof state.terrainSpecial === 'object'
            ? { ...state.terrainSpecial } : {};
        page.modoCena = state.modoCena === 'play' ? 'play' : 'edit';
        page.sceneBiome = state.sceneBiome || '';
        page.combateAtivo = !!state.combateAtivo;
    }

    function loadPageIntoLive(page) {
        state.cols = page.cols;
        state.rows = page.rows;
        state.viewport = { ...page.viewport };
        state.tokens = page.tokens;
        state.scenery = page.scenery;
        state.showNumbers = page.showNumbers;
        state.gridOpacity = page.gridOpacity;
        state.mapBackground = page.mapBackground || '';
        CELL_SIZE = page.gridSize || 56;
        state.rollLog = page.rollLog || [];
        state.turns = page.turns || [];
        state.currentTurnIndex = Math.min(page.currentTurnIndex || 0, Math.max(0, state.turns.length - 1));
        state.currentRound = Math.max(1, Number(page.currentRound) || 1);
        state.tipo = typeof page.tipo === 'string' ? page.tipo : '';
        state.notasNarrador = typeof page.notasNarrador === 'string' ? page.notasNarrador : '';
        state.terrainDifficult = new Set(Array.isArray(page.terrainDifficult) ? page.terrainDifficult : []);
        state.terrainBarriers  = new Set(Array.isArray(page.terrainBarriers)  ? page.terrainBarriers  : []);
        state.terrainSpecial   = (page.terrainSpecial && typeof page.terrainSpecial === 'object') ? { ...page.terrainSpecial } : {};
        state.modoCena = page.modoCena === 'play' ? 'play' : 'edit';
        state.sceneBiome = typeof page.sceneBiome === 'string' ? page.sceneBiome : '';
        state.combateAtivo = !!page.combateAtivo;
        state.terrainMarkingMode = false;
        if (!state.terrainMarkingType) state.terrainMarkingType = 'difficult';
        state.selectedId = null;
        state.selectedSceneryId = null;
    }

    function migrateLegacyTokenFields(token) {
        if (!token || typeof token !== 'object') return token;
        if (token.tokenImage === undefined && token.image !== undefined) {
            token.tokenImage = token.image;
        }
        if (token.fotoImage === undefined) {
            token.fotoImage = token.image ?? token.tokenImage ?? null;
        }
        if (token.tokenImageAdjust === undefined && token.imageAdjust !== undefined) {
            token.tokenImageAdjust = token.imageAdjust;
        }
        token.widthCells = clamp(Math.round(Number(token.widthCells || token.sizeCells || 1)), 1, 6);
        token.heightCells = clamp(Math.round(Number(token.heightCells || token.sizeCells || 1)), 1, 6);
        token.sizeCells = Math.max(token.widthCells, token.heightCells);
        token.layer = ['mapa', 'tokens', 'mestre'].includes(token.layer) ? token.layer : 'tokens';
        token.type = token.type || token.tipoToken || inferTokenType(token);
        token.conditions = Array.isArray(token.conditions)
            ? token.conditions
            : String(token.conditions || '').split(',').map(s => s.trim()).filter(Boolean);
        // Condições táticas do capítulo "Jogando" (cobertura, camuflagem,
        // flanqueamento). Ficam separadas das `conditions` livres para
        // poder aplicar modificadores automáticos no roll de ataque.
        token.cobertura = ['leve', 'total'].includes(token.cobertura) ? token.cobertura : 'nenhuma';
        token.camuflagem = ['leve', 'total'].includes(token.camuflagem) ? token.camuflagem : 'nenhuma';
        token.flanqueado = !!token.flanqueado;
        // Sub-fase A: rastreio tático por rodada (iniciativa e movimento).
        // - movimentoUsado: quadrados já gastos na rodada (reset em nova rodada).
        // - iniciativaMod: cache numérico do bônus textual (ex.: "+5" → 5).
        if (!Number.isFinite(token.movimentoUsado)) {
            token.movimentoUsado = 0;
        }
        // Estado de ações por turno (reset ao iniciar o turno do token).
        if (typeof token.acaoPadraoUsada !== 'boolean') token.acaoPadraoUsada = false;
        if (typeof token.acaoMovimentoUsada !== 'boolean') token.acaoMovimentoUsada = false;
        if (typeof token.dobroMovimento !== 'boolean') token.dobroMovimento = false;
        if (typeof token.acaoCompletaUsada !== 'boolean') token.acaoCompletaUsada = false;
        const modParsed = parseSignedNumber(token.iniciativa);
        if (Number.isFinite(modParsed)) {
            token.iniciativaMod = modParsed;
        } else if (!Number.isFinite(token.iniciativaMod)) {
            token.iniciativaMod = 0;
        }
        delete token.image;
        delete token.imageAdjust;
        return token;
    }

    function inferTokenType(token) {
        if (token.source === 'bestiario') return 'criatura';
        if (token.fichaId) return 'personagem';
        return 'generico';
    }

    function resolveTokenImageSrc(token) {
        if (!token) return null;
        return token.tokenImage || token.fotoImage || token.image || null;
    }

    function getTokenInitials(name) {
        const text = String(name || '').trim();
        if (!text) return '?';
        const parts = text.split(/\s+/).filter(Boolean);
        if (!parts.length) return '?';
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    // ----------------------------------------------------------------
    // Render: tabuleiro
    // ----------------------------------------------------------------

    function renderBoard() {
        document.documentElement.style.setProperty('--cb-grid-opacity', String(state.gridOpacity));
        els.board.style.gridTemplateColumns = `repeat(${state.cols}, ${CELL_SIZE}px)`;
        els.board.style.gridTemplateRows = `repeat(${state.rows}, ${CELL_SIZE}px)`;
        els.board.style.width = (state.cols * CELL_SIZE) + 'px';
        els.board.style.height = (state.rows * CELL_SIZE) + 'px';
        if (els.mapBackground) {
            els.mapBackground.style.width = els.board.style.width;
            els.mapBackground.style.height = els.board.style.height;
            els.mapBackground.style.backgroundImage = state.mapBackground ? `url("${cssUrl(state.mapBackground)}")` : '';
        }
        els.tokensLayer.style.width = els.board.style.width;
        els.tokensLayer.style.height = els.board.style.height;
        if (els.sceneryLayer) {
            els.sceneryLayer.style.width = els.board.style.width;
            els.sceneryLayer.style.height = els.board.style.height;
        }
        if (els.npcLayer) {
            els.npcLayer.style.width = els.board.style.width;
            els.npcLayer.style.height = els.board.style.height;
        }
        if (els.guidesLayer) {
            els.guidesLayer.style.width = els.board.style.width;
            els.guidesLayer.style.height = els.board.style.height;
        }
        if (els.terrainLayer) {
            els.terrainLayer.style.width = els.board.style.width;
            els.terrainLayer.style.height = els.board.style.height;
        }
        renderTerrainOverlay();

        els.board.classList.toggle('show-numbers', state.showNumbers);
        els.board.innerHTML = '';

        const targetCells = computeReachTargetCellSet();
        // Sub-fase C: cache do preview de movimento por render.
        movementPreviewMap = computeMovementPreviewMap();

        const frag = document.createDocumentFragment();
        for (let r = 0; r < state.rows; r++) {
            for (let c = 0; c < state.cols; c++) {
                const cell = document.createElement('div');
                cell.className = 'cb-cell' + (((r + c) % 2 === 0) ? ' is-even' : '');
                if (isReachPreviewCell(c, r)) {
                    cell.classList.add('cb-cell--alcance');
                    if (isReachPreviewCellBlocked(c, r)) {
                        cell.classList.add('cb-cell--alcance-blocked');
                    }
                    if (targetCells.has(occupiedKey(c, r))) {
                        cell.classList.add('cb-cell--target');
                    }
                } else if (state.movePicker) {
                    // Modo de seleção de destino — pinta área do Dijkstra
                    // com 2 níveis (1 ação vs 2 ações) e o caminho atual.
                    const k = occupiedKey(c, r);
                    const cost = state.movePicker.dist.has(k) ? state.movePicker.dist.get(k) : null;
                    if (cost !== null && k !== state.movePicker.startKey) {
                        if (cost <= state.movePicker.max1) {
                            cell.classList.add('cb-cell--mov-acao1');
                        } else {
                            cell.classList.add('cb-cell--mov-acao2');
                        }
                        if (isTerrainDifficult(c, r)) {
                            cell.classList.add('cb-cell--movimento-dificil');
                        }
                    }
                    if (state.movePicker.path) {
                        const path = state.movePicker.path;
                        const inPath = path.some(p => p.col === c && p.row === r);
                        if (inPath) cell.classList.add('cb-cell--mov-caminho');
                        const last = path[path.length - 1];
                        if (last && last.col === c && last.row === r) {
                            cell.classList.add('cb-cell--mov-target');
                            const cost = state.movePicker.dist.has(k) ? state.movePicker.dist.get(k) : null;
                            if (cost !== null && cost > state.movePicker.max1) {
                                cell.classList.add('cb-cell--mov-target-2x');
                            }
                        }
                    }
                } else if (isMovePreviewCell(c, r)) {
                    cell.classList.add('cb-cell--movimento');
                    if (isTerrainDifficult(c, r)) {
                        cell.classList.add('cb-cell--movimento-dificil');
                    }
                }
                if (state.showNumbers) {
                    const lbl = document.createElement('span');
                    lbl.className = 'cb-cell-label';
                    lbl.textContent = `${c + 1},${r + 1}`;
                    cell.appendChild(lbl);
                }
                frag.appendChild(cell);
            }
        }
        els.board.appendChild(frag);
    }

    // ----------------------------------------------------------------
    // Render: tokens
    // ----------------------------------------------------------------

    function renderTokens() {
        els.tokensLayer.innerHTML = '';
        const frag = document.createDocumentFragment();
        const layerOrder = { mapa: 0, tokens: 1, mestre: 2 };
        for (const t of [...state.tokens].sort((a, b) => (layerOrder[a.layer] ?? 1) - (layerOrder[b.layer] ?? 1))) {
            frag.appendChild(buildTokenElement(t));
        }
        els.tokensLayer.appendChild(frag);
        updateActionButtons();
        renderSidebarTokens();
        renderSelectedTokenTools();
        renderTurnList();
    }

    function buildTokenElement(token) {
        const widthPx = tokenWidthCells(token) * CELL_SIZE;
        const heightPx = tokenHeightCells(token) * CELL_SIZE;
        const wrap = document.createElement('div');
        wrap.className = 'cb-token';
        if (token.id === state.selectedId) wrap.classList.add('is-selected');
        if (isCurrentTurnToken(token.id)) wrap.classList.add('is-current-turn');
        wrap.dataset.layer = token.layer || 'tokens';
        wrap.dataset.tokenId = token.id;
        wrap.style.left = (token.col * CELL_SIZE) + 'px';
        wrap.style.top = (token.row * CELL_SIZE) + 'px';
        wrap.style.width = widthPx + 'px';
        wrap.style.height = heightPx + 'px';
        wrap.style.transform = `rotate(${token.rotation || 0}deg)`;

        const circle = document.createElement('div');
        circle.className = 'cb-token-circle';
        const tokenImageSrc = resolveTokenImageSrc(token);
        if (tokenImageSrc) {
            const img = document.createElement('img');
            img.src = tokenImageSrc;
            img.alt = token.name || 'Token';
            img.draggable = false;
            applyTokenImageAdjustment(img, token.tokenImageAdjust ?? token.imageAdjust);
            img.onerror = () => {
                img.remove();
                circle.textContent = getTokenInitials(token.name);
            };
            circle.appendChild(img);
        } else {
            circle.textContent = getTokenInitials(token.name);
        }
        wrap.appendChild(circle);

        const resources = buildResourceBars(token);
        if (resources) {
            wrap.classList.add('has-resources');
            wrap.appendChild(resources);
        }

        const nameLbl = document.createElement('div');
        nameLbl.className = 'cb-token-name';
        nameLbl.textContent = token.name || 'Sem nome';
        wrap.appendChild(nameLbl);

        const resize = document.createElement('div');
        resize.className = 'cb-token-handle cb-token-handle--resize';
        resize.dataset.handle = 'resize';
        wrap.appendChild(resize);

        const rotate = document.createElement('div');
        rotate.className = 'cb-token-handle cb-token-handle--rotate';
        rotate.dataset.handle = 'rotate';
        wrap.appendChild(rotate);

        return wrap;
    }

    function cssUrl(value) {
        return String(value || '').replace(/["\\]/g, '\\$&');
    }

    function tokenWidthCells(token) {
        return clamp(Math.round(Number(token.widthCells || token.sizeCells || 1)), 1, 6);
    }

    function tokenHeightCells(token) {
        return clamp(Math.round(Number(token.heightCells || token.sizeCells || 1)), 1, 6);
    }

    function buildResourceBars(token) {
        const bars = [];
        const pvMax = numberOrNull(token.pvMax);
        const pmMax = numberOrNull(token.pmMax);

        if (pvMax !== null && pvMax > 0) {
            bars.push(buildResourceBar('pv', token.pvAtual, pvMax, 'PV'));
        }
        if (pmMax !== null && pmMax > 0) {
            bars.push(buildResourceBar('pm', token.pmAtual, pmMax, 'PM'));
        }
        if (!bars.length) return null;

        const wrap = document.createElement('div');
        wrap.className = 'cb-token-resources';
        for (const bar of bars) wrap.appendChild(bar);
        return wrap;
    }

    function buildResourceBar(resource, current, max, label) {
        const value = clampResource(current, max);
        const ratio = max > 0 ? value / max : 0;

        const bar = document.createElement('button');
        bar.type = 'button';
        bar.className = `cb-resource-bar cb-resource-bar--${resource}`;
        bar.dataset.resource = resource;
        bar.title = `Ajustar ${label}`;
        bar.setAttribute('aria-label', `Ajustar ${label} de ${value} para ${max}`);

        const fill = document.createElement('span');
        fill.className = 'cb-resource-fill';
        fill.style.width = `${Math.max(0, Math.min(100, ratio * 100))}%`;
        fill.style.opacity = String(0.28 + ratio * 0.72);
        bar.appendChild(fill);

        const text = document.createElement('span');
        text.className = 'cb-resource-text';
        text.textContent = `${value}/${max}`;
        bar.appendChild(text);

        return bar;
    }

    function updateTokenElement(token) {
        const el = els.tokensLayer.querySelector(`[data-token-id="${token.id}"]`);
        if (!el) return;
        const widthPx = tokenWidthCells(token) * CELL_SIZE;
        const heightPx = tokenHeightCells(token) * CELL_SIZE;
        el.style.left = (token.col * CELL_SIZE) + 'px';
        el.style.top = (token.row * CELL_SIZE) + 'px';
        el.style.width = widthPx + 'px';
        el.style.height = heightPx + 'px';
        el.style.transform = `rotate(${token.rotation || 0}deg)`;
    }

    function updateSelectionVisuals() {
        els.tokensLayer.querySelectorAll('.cb-token').forEach(el => {
            el.classList.toggle('is-selected', el.dataset.tokenId === state.selectedId);
        });
        updateActionButtons();
        renderSelectedTokenTools();
    }

    function updateActionButtons() {
        const has = !!state.selectedId;
        els.removeToken.disabled = !has;
        els.rotateToken.disabled = !has;
        if (els.adjustToken) {
            const token = has ? state.tokens.find(t => t.id === state.selectedId) : null;
            els.adjustToken.disabled = !token || !resolveTokenImageSrc(token);
        }
    }

    // ----------------------------------------------------------------
    // Viewport (zoom + pan)
    // ----------------------------------------------------------------

    function applyViewport() {
        const { x, y, scale } = state.viewport;
        els.viewport.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        els.zoomDisplay.textContent = Math.round(scale * 100) + '%';
    }

    function setScale(newScale, anchorX, anchorY) {
        const clamped = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
        if (anchorX === undefined) {
            const rect = els.stage.getBoundingClientRect();
            anchorX = rect.width / 2;
            anchorY = rect.height / 2;
        }
        // ponto sob o cursor (em coords do viewport)
        const before = screenToViewport(anchorX, anchorY);
        state.viewport.scale = clamped;
        const after = screenToViewport(anchorX, anchorY);
        // ajusta o pan para manter o ponto âncora estável
        state.viewport.x += (after.x - before.x) * clamped;
        state.viewport.y += (after.y - before.y) * clamped;
        applyViewport();
    }

    function screenToViewport(sx, sy) {
        const rect = els.stage.getBoundingClientRect();
        const localX = sx - rect.left - state.viewport.x;
        const localY = sy - rect.top - state.viewport.y;
        return { x: localX / state.viewport.scale, y: localY / state.viewport.scale };
    }

    function screenToCell(sx, sy) {
        const v = screenToViewport(sx, sy);
        const col = Math.floor(v.x / CELL_SIZE);
        const row = Math.floor(v.y / CELL_SIZE);
        return {
            col: clamp(col, 0, state.cols - 1),
            row: clamp(row, 0, state.rows - 1)
        };
    }

    let lastAimKey = '';
    function updateAreaAim(clientX, clientY) {
        if (!state.reachPreview) return;
        const cell = screenToCell(clientX, clientY);
        const key = cell.col + ',' + cell.row;
        if (key === lastAimKey) return;
        lastAimKey = key;
        state.reachPreview.aim = cell;
        renderBoard();
    }

    function centerBoard() {
        const stageRect = els.stage.getBoundingClientRect();
        const boardW = state.cols * CELL_SIZE;
        const boardH = state.rows * CELL_SIZE;
        const fitX = (stageRect.width - 24) / boardW;
        const fitY = (stageRect.height - 24) / boardH;
        const fit = Math.min(1, fitX, fitY);
        state.viewport.scale = fit;
        state.viewport.x = (stageRect.width - boardW * fit) / 2;
        state.viewport.y = (stageRect.height - boardH * fit) / 2;
        applyViewport();
    }

    // ----------------------------------------------------------------
    // Interação: pan, pinch, drag, resize, rotate (Pointer Events)
    // ----------------------------------------------------------------

    const pointers = new Map(); // pointerId -> { x, y, mode }
    let interaction = null;     // descreve a interação ativa

    function onStagePointerDown(ev) {
        // Modo "click-to-move": intercepta antes de tudo.
        if (state.movePicker) {
            if (ev.button != null && ev.button !== 0) return;
            if (!ev.target.closest('#cbStage')) return;
            ev.preventDefault();
            ev.stopPropagation();
            const cell = screenToCell(ev.clientX, ev.clientY);
            // Async — não trava a thread.
            escolherDestinoMover(cell.col, cell.row);
            return;
        }
        // Modo de marcação de terreno difícil: intercepta antes de tudo.
        // Click em uma célula do board (alvo dentro da viewport, não em
        // sidebar etc.) toggla aquela célula como terreno difícil.
        if (state.terrainMarkingMode) {
            // Só processa cliques principais (botão esquerdo/touch primário)
            if (ev.button != null && ev.button !== 0) return;
            // Garante que o clique está sobre o tabuleiro/viewport
            if (!ev.target.closest('#cbStage')) return;
            ev.preventDefault();
            ev.stopPropagation();
            const cell = screenToCell(ev.clientX, ev.clientY);
            toggleTerrainCellAt(cell.col, cell.row);
            return;
        }

        // Cenário (imagens livres) — verifica antes dos tokens, com prioridade nos handles
        const sceneryHandle = ev.target.closest('.cb-scenery-handle');
        const sceneryEl = ev.target.closest('.cb-scenery');
        if (sceneryHandle && sceneryEl) {
            const item = state.scenery.find(s => s.id === sceneryEl.dataset.sceneryId);
            if (item && !item.locked && isActiveImageLayerItem(item)) {
                ev.preventDefault();
                ev.stopPropagation();
                selectScenery(item.id);
                if (sceneryHandle.dataset.handle === 'resize') startSceneryResize(ev, item, sceneryHandle.dataset.dir || 'se');
                else if (sceneryHandle.dataset.handle === 'rotate') startSceneryRotate(ev, item);
                return;
            }
        }
        if (sceneryEl && !ev.target.closest('.cb-token')) {
            const item = state.scenery.find(s => s.id === sceneryEl.dataset.sceneryId);
            if (item && !item.locked && isActiveImageLayerItem(item)) {
                ev.preventDefault();
                ev.stopPropagation();
                selectScenery(item.id);
                startSceneryDrag(ev, item);
                return;
            }
        }

        // Verificamos se o alvo é um token, handle ou stage vazio
        const tokenEl = ev.target.closest('.cb-token');
        const handle = ev.target.closest('.cb-token-handle');
        const resourceBar = ev.target.closest('.cb-resource-bar');
        if (resourceBar && tokenEl) {
            ev.preventDefault();
            ev.stopPropagation();
            selectToken(tokenEl.dataset.tokenId);
            return;
        }

        if (handle && tokenEl) {
            const token = state.tokens.find(t => t.id === tokenEl.dataset.tokenId);
            if (!token) return;
            ev.preventDefault();
            ev.stopPropagation();
            selectToken(token.id);

            if (handle.dataset.handle === 'resize') {
                startResize(ev, token);
            } else if (handle.dataset.handle === 'rotate') {
                startRotate(ev, token);
            }
            return;
        }

        // Preview de área ativo: clique dentro da área confirma; clique fora cancela.
        if (state.reachPreview
            && state.reachPreview.action
            && isAreaAttack(state.reachPreview.action)) {
            const attacker = state.tokens.find(t => t.id === state.reachPreview.tokenId);
            if (attacker) {
                ev.preventDefault();
                ev.stopPropagation();
                // Atualiza o aim com a célula clicada (caso o pointermove não tenha disparado)
                updateAreaAim(ev.clientX, ev.clientY);
                const cell = screenToCell(ev.clientX, ev.clientY);
                const reachCells = buildActionReachCells(attacker, state.reachPreview.action);
                if (reachCells.has(occupiedKey(cell.col, cell.row))) {
                    executeAreaAttack(attacker, state.reachPreview.action);
                } else {
                    clearReachPreview(true);
                }
                return;
            }
        }

        if (tokenEl) {
            const clickedId = tokenEl.dataset.tokenId;

            // Se o alcance de uma ação está ativo em outro token e o token clicado
            // está dentro do alcance, abre a confirmação para direcionar a ação a ele.
            if (state.reachPreview
                && state.reachPreview.tokenId !== clickedId
                && state.reachPreview.action) {
                const attacker = state.tokens.find(t => t.id === state.reachPreview.tokenId);
                const target = state.tokens.find(t => t.id === clickedId);
                if (attacker && target) {
                    if (isTokenInActionReach(target, attacker, state.reachPreview.action)) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        openAttackConfirmation(attacker, target, state.reachPreview.action);
                        return;
                    }
                    // Se está em alcance mas LoE bloqueada → aviso explícito.
                    const action = state.reachPreview.action;
                    const range = parseAlcanceAtaque(action.alcance);
                    const reach = buildActionReachCells(attacker, action);
                    const inRange = getTokenCells(target).some(c => reach.has(occupiedKey(c.col, c.row)));
                    if (inRange && range > 1 && !isAreaAttack(action) && !tokenHasLineOfEffectTo(attacker, target)) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        showCbToast('Linha de ataque bloqueada por barreira.');
                        addLog({ title: 'Ataque bloqueado', detail: `${attacker.name || 'Atacante'} → ${target.name || 'alvo'}: barreira no caminho.` });
                        return;
                    }
                    if (!inRange) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        showCbToast('Alvo fora de alcance.');
                        return;
                    }
                }
            }

            const token = state.tokens.find(t => t.id === clickedId);
            if (!token) return;
            ev.preventDefault();
            selectToken(token.id);
            startTokenDrag(ev, token);
            return;
        }

        // Stage vazio: pan ou pinch
        pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });

        if (pointers.size === 1) {
            // pan single-finger / mouse
            // (segundo pointer pode entrar e virar pinch)
            interaction = {
                type: 'pan',
                lastX: ev.clientX,
                lastY: ev.clientY,
                pointerId: ev.pointerId
            };
            els.stage.classList.add('is-panning');
            try { els.stage.setPointerCapture(ev.pointerId); } catch (_) {}
            // Desselecionar se clique vazio
            selectToken(null);
            if (state.selectedSceneryId) selectScenery(null);
        } else if (pointers.size === 2) {
            const [a, b] = [...pointers.values()];
            interaction = {
                type: 'pinch',
                startDist: distance(a, b),
                startScale: state.viewport.scale,
                startMid: midpoint(a, b)
            };
        }
    }

    function onStagePointerMove(ev) {
        const tt = pointers.get(ev.pointerId);
        if (tt) {
            tt.x = ev.clientX;
            tt.y = ev.clientY;
        }

        // Tracking do aim para preview de área (sem precisar de drag/interaction)
        if (state.reachPreview && state.reachPreview.action && isAreaAttack(state.reachPreview.action)) {
            updateAreaAim(ev.clientX, ev.clientY);
        }

        // Modo "click-to-move": atualiza caminho/destino sob o cursor a cada movimento.
        if (state.movePicker && ev.target.closest('#cbStage')) {
            updateMovePickerHover(ev.clientX, ev.clientY);
        }

        if (!interaction) return;

        if (interaction.type === 'pan' && ev.pointerId === interaction.pointerId) {
            const dx = ev.clientX - interaction.lastX;
            const dy = ev.clientY - interaction.lastY;
            interaction.lastX = ev.clientX;
            interaction.lastY = ev.clientY;
            state.viewport.x += dx;
            state.viewport.y += dy;
            applyViewport();
        } else if (interaction.type === 'pinch' && pointers.size >= 2) {
            const [a, b] = [...pointers.values()];
            const newDist = distance(a, b);
            const ratio = newDist / interaction.startDist;
            const newScale = interaction.startScale * ratio;
            setScale(newScale, interaction.startMid.x, interaction.startMid.y);
        } else if (interaction.type === 'token-drag' && ev.pointerId === interaction.pointerId) {
            handleTokenDragMove(ev);
        } else if (interaction.type === 'resize' && ev.pointerId === interaction.pointerId) {
            handleResizeMove(ev);
        } else if (interaction.type === 'rotate' && ev.pointerId === interaction.pointerId) {
            handleRotateMove(ev);
        }
    }

    function onStagePointerUp(ev) {
        pointers.delete(ev.pointerId);

        if (!interaction) {
            els.stage.classList.remove('is-panning');
            return;
        }

        if (interaction.type === 'token-drag' && ev.pointerId === interaction.pointerId) {
            finishTokenDrag();
        } else if (interaction.type === 'resize' && ev.pointerId === interaction.pointerId) {
            finishResize();
        } else if (interaction.type === 'rotate' && ev.pointerId === interaction.pointerId) {
            finishRotate();
        } else if (interaction.type === 'pan' && ev.pointerId === interaction.pointerId) {
            els.stage.classList.remove('is-panning');
            saveState();
        } else if (interaction.type === 'pinch') {
            if (pointers.size < 2) {
                interaction = null;
                saveState();
                // Se ainda houver 1 pointer, retornar a pan
                if (pointers.size === 1) {
                    const [last] = [...pointers.entries()];
                    interaction = {
                        type: 'pan',
                        lastX: last[1].x,
                        lastY: last[1].y,
                        pointerId: last[0]
                    };
                }
                return;
            }
        }

        if (pointers.size === 0) {
            interaction = null;
        }
    }

    function distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.hypot(dx, dy);
    }

    function midpoint(a, b) {
        return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }

    // ----------- Drag de token

    function startTokenDrag(ev, token) {
        const start = screenToViewport(ev.clientX, ev.clientY);
        interaction = {
            type: 'token-drag',
            pointerId: ev.pointerId,
            tokenId: token.id,
            offsetX: start.x - token.col * CELL_SIZE,
            offsetY: start.y - token.row * CELL_SIZE,
            tempCol: token.col,
            tempRow: token.row,
            originCol: token.col,
            originRow: token.row,
            startClientX: ev.clientX,
            startClientY: ev.clientY,
            longPressFired: false,
            longPressTimer: null
        };
        const el = els.tokensLayer.querySelector(`[data-token-id="${token.id}"]`);
        if (el) el.classList.add('is-dragging');
        interaction.longPressTimer = setTimeout(() => {
            if (!interaction || interaction.type !== 'token-drag' || interaction.pointerId !== ev.pointerId) return;
            interaction.longPressFired = true;
            if (el) el.classList.remove('is-dragging');
            hideMoveBadge();
            openTokenActionPanel(token.id);
        }, LONG_PRESS_MS);
        try { els.stage.setPointerCapture(ev.pointerId); } catch (_) {}
    }

    // ----------- Badge flutuante de custo de movimento --------------
    // Mostra "X quadrados / Y m" próximo ao cursor enquanto o token é
    // arrastado. Cálculo: diagonal = 2 quadrados, ortogonal = 1 quadrado
    // (regra do livro Pindorama). Terreno difícil será integrado no
    // próximo passo; por enquanto a badge mostra custo em terreno normal.
    let moveBadgeEl = null;
    function ensureMoveBadge() {
        if (moveBadgeEl) return moveBadgeEl;
        const el = document.createElement('div');
        el.className = 'cb-move-badge';
        el.setAttribute('aria-hidden', 'true');
        el.innerHTML =
            '<span class="cb-move-badge-cells">0 quadrados</span>' +
            '<span class="cb-move-badge-meters">0 m</span>' +
            '<span class="cb-move-badge-budget"></span>';
        document.body.appendChild(el);
        moveBadgeEl = el;
        return el;
    }
    function updateMoveBadge(clientX, clientY, custo, opts) {
        const el = ensureMoveBadge();
        const q = custo.quadrados;
        const m = custo.metros;
        const cellsTxt = q === 1 ? '1 quadrado' : (q + ' quadrados');
        const metersTxt = (m % 1 === 0 ? String(m) : m.toFixed(1).replace('.', ',')) + ' m';
        el.querySelector('.cb-move-badge-cells').textContent = cellsTxt;
        el.querySelector('.cb-move-badge-meters').textContent = metersTxt;

        // Sub-fase F: linha de orçamento e estado over-budget.
        const budgetSpan = el.querySelector('.cb-move-badge-budget');
        let isOver = false;
        if (opts && Number.isFinite(opts.totalBudget) && Number.isFinite(opts.alreadyUsed)) {
            const total = opts.totalBudget;
            const ja = opts.alreadyUsed;
            const projetado = ja + q;
            const restanteAposEsse = total - projetado;
            const sinal = restanteAposEsse >= 0 ? '' : '−';
            budgetSpan.textContent = `${projetado}/${total} qd (${sinal}${Math.abs(restanteAposEsse)} restante${Math.abs(restanteAposEsse) === 1 ? '' : 's'})`;
            budgetSpan.style.display = '';
            isOver = projetado > total;
        } else {
            budgetSpan.textContent = '';
            budgetSpan.style.display = 'none';
        }
        el.classList.toggle('is-over', isOver);

        // Posiciona a 16px à direita/abaixo do cursor; se aproximar da
        // borda direita da viewport, recua para a esquerda.
        const margin = 16;
        const vw = window.innerWidth;
        let x = clientX + margin;
        const rectW = el.offsetWidth || 100;
        if (x + rectW + margin > vw) {
            x = clientX - margin - rectW;
        }
        el.style.left = x + 'px';
        el.style.top = (clientY + margin) + 'px';
        el.classList.add('is-active');
    }
    function hideMoveBadge() {
        if (moveBadgeEl) {
            moveBadgeEl.classList.remove('is-active');
            moveBadgeEl.classList.remove('is-over');
        }
    }

    /* Gera a sequência de passos do origem (c0,r0) ao destino (c1,r1)
       seguindo a regra "Chebyshev simplificado": diagonal enquanto ambos
       eixos diferem, ortogonal no resto. Cada passo carrega { col, row,
       kind: 'orto' | 'diag' } — usado para somar custo de movimento e
       aplicar dobra em terreno difícil. */
    function chebyshevPath(c0, r0, c1, r1) {
        const passos = [];
        let c = c0, r = r0;
        let safety = 0;
        while ((c !== c1 || r !== r1) && safety++ < 1000) {
            const dc = Math.sign(c1 - c);
            const dr = Math.sign(r1 - r);
            const kind = (dc !== 0 && dr !== 0) ? 'diag' : 'orto';
            c += dc;
            r += dr;
            passos.push({ col: c, row: r, kind });
        }
        return passos;
    }

    function handleTokenDragMove(ev) {
        const token = state.tokens.find(t => t.id === interaction.tokenId);
        if (!token) return;
        const moved = Math.hypot(ev.clientX - interaction.startClientX, ev.clientY - interaction.startClientY);
        if (moved > LONG_PRESS_MOVE_TOLERANCE) {
            clearTokenLongPress();
        }
        if (interaction.longPressFired) return;
        const p = screenToViewport(ev.clientX, ev.clientY);
        const rawCol = (p.x - interaction.offsetX) / CELL_SIZE;
        const rawRow = (p.y - interaction.offsetY) / CELL_SIZE;
        // posição livre durante o drag (sem snap)
        const el = els.tokensLayer.querySelector(`[data-token-id="${token.id}"]`);
        if (el) {
            el.style.left = (rawCol * CELL_SIZE) + 'px';
            el.style.top = (rawRow * CELL_SIZE) + 'px';
        }
        interaction.tempCol = rawCol;
        interaction.tempRow = rawRow;

        // Feedback de custo de movimento (regra ortog=1, diag=2;
        // terreno difícil dobra cada passo correspondente).
        // Traça caminho Chebyshev passo-a-passo da origem ao destino
        // arredondado, classifica cada passo (orto/diag, normal/difícil)
        // e delega o cálculo final ao helper PindoramaRegras.
        if (window.PindoramaRegras && interaction.originCol != null) {
            const intCol = Math.round(rawCol);
            const intRow = Math.round(rawRow);
            const passos = chebyshevPath(
                interaction.originCol, interaction.originRow,
                intCol, intRow
            );
            let ortogonais = 0, diagonais = 0,
                ortogonaisDificeis = 0, diagonaisDificeis = 0;
            for (const p of passos) {
                const dificil = isTerrainDifficult(p.col, p.row);
                if (p.kind === 'diag') {
                    if (dificil) diagonaisDificeis++; else diagonais++;
                } else {
                    if (dificil) ortogonaisDificeis++; else ortogonais++;
                }
            }
            const custo = window.PindoramaRegras.custoMovimento({
                ortogonais, diagonais,
                ortogonaisDificeis, diagonaisDificeis
            });
            if (custo.quadrados > 0) {
                // Sub-fase F: passa o orçamento da rodada para o badge
                // poder mostrar X/Y restantes e alertar em vermelho ao
                // ultrapassar a ação de movimento.
                const totalBudget = tokenDeslocamentoQuadrados(token);
                const alreadyUsed = Number.isFinite(token.movimentoUsado) ? token.movimentoUsado : 0;
                updateMoveBadge(ev.clientX, ev.clientY, custo, { totalBudget, alreadyUsed });
            } else {
                hideMoveBadge();
            }
        }

        // Se o alcance da ação está ativo neste token, atualiza a marcação ao mover
        if (state.reachPreview && state.reachPreview.tokenId === token.id) {
            const max = Math.max(1, Number(token.sizeCells || 1));
            const roundedCol = clamp(Math.round(rawCol), 0, state.cols - max);
            const roundedRow = clamp(Math.round(rawRow), 0, state.rows - max);
            if (interaction.lastReachCol !== roundedCol || interaction.lastReachRow !== roundedRow) {
                interaction.lastReachCol = roundedCol;
                interaction.lastReachRow = roundedRow;
                renderBoard();
            }
        }
    }

    function finishTokenDrag() {
        const token = state.tokens.find(t => t.id === interaction.tokenId);
        if (!token) {
            hideMoveBadge();
            interaction = null;
            return;
        }
        clearTokenLongPress();
        hideMoveBadge();
        if (interaction.longPressFired) {
            const el = els.tokensLayer.querySelector(`[data-token-id="${token.id}"]`);
            if (el) el.classList.remove('is-dragging');
            interaction = null;
            return;
        }
        // snap-to-grid + clamp dentro do tabuleiro
        const maxW = tokenWidthCells(token);
        const maxH = tokenHeightCells(token);
        const didClick = Math.abs((interaction.tempCol ?? token.col) - token.col) < 0.18
            && Math.abs((interaction.tempRow ?? token.row) - token.row) < 0.18;
        const snappedCol = clamp(Math.round(interaction.tempCol), 0, state.cols - maxW);
        const snappedRow = clamp(Math.round(interaction.tempRow), 0, state.rows - maxH);

        // Sub-fase D: deduz o custo do drag do orçamento de movimento da
        // rodada. Usa o mesmo chebyshev + custoMovimento aplicados no
        // badge durante o drag, garantindo coerência visual.
        if (!didClick
            && interaction.originCol != null
            && (snappedCol !== interaction.originCol || snappedRow !== interaction.originRow)
            && window.PindoramaRegras) {
            // Parte 7: snapshot p/ undo do último movimento.
            captureMoveUndo(token);
            const passos = chebyshevPath(
                interaction.originCol, interaction.originRow,
                snappedCol, snappedRow
            );

            // Barreiras são intransponíveis para o movimento — se algum
            // passo cruza uma célula de barreira, cancela o movimento e
            // reverte a posição.
            const passoEmBarreira = passos.find(p => isTerrainBarrier(p.col, p.row));
            if (passoEmBarreira) {
                showCbToast('Movimento bloqueado: barreira no caminho.');
                addLog({
                    title: 'Movimento bloqueado',
                    detail: `${token.name || 'Token'}: barreira em (${passoEmBarreira.col + 1},${passoEmBarreira.row + 1}).`
                });
                // Remove o snapshot adicionado especulativamente acima.
                if (_undoStack.length) _undoStack.pop();
                refreshUndoButton();
                // Volta o token para a posição original.
                token.col = interaction.originCol;
                token.row = interaction.originRow;
                const el = els.tokensLayer.querySelector(`[data-token-id="${token.id}"]`);
                if (el) el.classList.remove('is-dragging');
                updateTokenElement(token);
                renderBoard();
                interaction = null;
                return;
            }

            if (passos.length) {
                let ortogonais = 0, diagonais = 0,
                    ortogonaisDificeis = 0, diagonaisDificeis = 0;
                for (const p of passos) {
                    const dificil = isTerrainDifficult(p.col, p.row);
                    if (p.kind === 'diag') {
                        if (dificil) diagonaisDificeis++; else diagonais++;
                    } else {
                        if (dificil) ortogonaisDificeis++; else ortogonais++;
                    }
                }
                const custo = window.PindoramaRegras.custoMovimento({
                    ortogonais, diagonais,
                    ortogonaisDificeis, diagonaisDificeis
                });
                if (custo.quadrados > 0) {
                    if (token.acaoCompletaUsada) {
                        showCbToast(`${token.name || 'Token'} já usou a ação completa neste turno.`);
                    }
                    const before = Number.isFinite(token.movimentoUsado) ? token.movimentoUsado : 0;
                    token.movimentoUsado = before + custo.quadrados;
                    token.acaoMovimentoUsada = true;
                    const base = tokenDeslocamentoQuadrados(token);
                    // Se ultrapassou o deslocamento base e ainda não estava em "2× mov",
                    // engata automaticamente: consome a ação padrão como segunda ação de movimento.
                    if (token.movimentoUsado > base && !token.dobroMovimento && !token.acaoPadraoUsada) {
                        token.dobroMovimento = true;
                        token.acaoPadraoUsada = true;
                        addLog({
                            title: '2ª ação de movimento',
                            detail: `${token.name || 'Token'} consumiu a ação padrão como segunda ação de movimento (deslocamento até ${base * 2} qd).`
                        });
                    }
                    const total = token.dobroMovimento ? base * 2 : base;
                    const restante = Math.max(0, total - token.movimentoUsado);
                    addLog({
                        title: 'Movimento',
                        detail: `${token.name || 'Token'}: +${custo.quadrados} qd (acumulado ${token.movimentoUsado}/${total}, ${restante} restante${restante === 1 ? '' : 's'}).`
                    });
                }
            }
        }

        token.col = snappedCol;
        token.row = snappedRow;
        const el = els.tokensLayer.querySelector(`[data-token-id="${token.id}"]`);
        if (el) el.classList.remove('is-dragging');
        updateTokenElement(token);
        // Atualiza o painel de status quando o token mexido é o selecionado.
        if (state.selectedId === token.id) renderSelectedTokenTools();
        // Sub-fase C: re-renderiza o tabuleiro também quando o token
        // arrastado é o selecionado, para reposicionar o preview de
        // movimento centrado na nova célula.
        if ((state.reachPreview && state.reachPreview.tokenId === token.id)
            || state.selectedId === token.id) {
            renderBoard();
        }
        saveState();
        if (didClick) {
            openTokenActionPanel(token.id);
        }
        interaction = null;
    }

    function clearTokenLongPress() {
        if (interaction && interaction.longPressTimer) {
            clearTimeout(interaction.longPressTimer);
            interaction.longPressTimer = null;
        }
    }

    // ----------- Resize

    function startResize(ev, token) {
        const start = screenToViewport(ev.clientX, ev.clientY);
        interaction = {
            type: 'resize',
            pointerId: ev.pointerId,
            tokenId: token.id,
            startWidth: tokenWidthCells(token),
            startHeight: tokenHeightCells(token),
            startPx: { x: start.x, y: start.y }
        };
        try { els.stage.setPointerCapture(ev.pointerId); } catch (_) {}
    }

    function handleResizeMove(ev) {
        const token = state.tokens.find(t => t.id === interaction.tokenId);
        if (!token) return;
        const p = screenToViewport(ev.clientX, ev.clientY);
        // distância do canto esquerdo-cima do token até o cursor
        const fromLeft = p.x - token.col * CELL_SIZE;
        const fromTop = p.y - token.row * CELL_SIZE;
        const cellsByX = fromLeft / CELL_SIZE;
        const cellsByY = fromTop / CELL_SIZE;
        const proposal = Math.max(cellsByX, cellsByY);
        const newSize = clamp(Math.round(proposal), 1, 6);
        const maxByCols = state.cols - token.col;
        const maxByRows = state.rows - token.row;
        const finalSize = Math.min(newSize, maxByCols, maxByRows);
        if (finalSize !== token.sizeCells || finalSize !== token.widthCells || finalSize !== token.heightCells) {
            token.sizeCells = finalSize;
            token.widthCells = finalSize;
            token.heightCells = finalSize;
            updateTokenElement(token);
            renderSelectedTokenTools();
        }
    }

    function finishResize() {
        saveState();
        interaction = null;
    }

    // ----------- Rotate

    function startRotate(ev, token) {
        interaction = {
            type: 'rotate',
            pointerId: ev.pointerId,
            tokenId: token.id,
            startAngle: token.rotation || 0
        };
        try { els.stage.setPointerCapture(ev.pointerId); } catch (_) {}
    }

    function handleRotateMove(ev) {
        const token = state.tokens.find(t => t.id === interaction.tokenId);
        if (!token) return;
        const sizePx = Math.max(tokenWidthCells(token), tokenHeightCells(token)) * CELL_SIZE;
        const center = screenToViewport(ev.clientX, ev.clientY);
        const cx = token.col * CELL_SIZE + sizePx / 2;
        const cy = token.row * CELL_SIZE + sizePx / 2;
        const dx = center.x - cx;
        const dy = center.y - cy;
        // O handle "rotate" fica em cima do token, então rotação 0 = handle para cima.
        // angle em graus, com 0 apontando para cima.
        const angle = (Math.atan2(dy, dx) * 180 / Math.PI) + 90;
        token.rotation = Math.round(angle);
        updateTokenElement(token);
    }

    function finishRotate() {
        saveState();
        interaction = null;
    }

    // ----------------------------------------------------------------
    // Seleção & ações
    // ----------------------------------------------------------------

    function selectToken(id) {
        const changed = id !== state.selectedId;
        if (changed && els.actionPanel && !els.actionPanel.hidden) {
            closeTokenActionPanel();
        }
        if (changed) {
            // Sub-fase C: limpa preview de ataque sem renderizar — o
            // renderBoard final cobre o repintar e atualiza o overlay
            // de movimento numa única passada.
            clearReachPreview(false);
        }
        state.selectedId = id;
        updateSelectionVisuals();
        renderSidebarTokens();
        renderSelectedTokenTools();
        if (changed) renderBoard();
    }

    function removeSelectedToken() {
        if (!state.selectedId) return;
        state.tokens = state.tokens.filter(t => t.id !== state.selectedId);
        state.turns = state.turns.filter(turn => turn.tokenId !== state.selectedId);
        state.selectedId = null;
        clearReachPreview(false);
        renderBoard();
        renderTokens();
        renderTurnList();
        saveState();
    }

    function rotateSelectedTokenStep() {
        if (!state.selectedId) return;
        const t = state.tokens.find(x => x.id === state.selectedId);
        if (!t) return;
        t.rotation = ((t.rotation || 0) + 90) % 360;
        updateTokenElement(t);
        saveState();
    }

    function clearAllTokens() {
        if (!state.tokens.length && !state.scenery.length) return;
        if (!confirm('Remover todos os tokens e cenários da página atual?')) return;
        state.tokens = [];
        state.scenery = [];
        state.turns = [];
        state.currentTurnIndex = 0;
        state.selectedId = null;
        state.selectedSceneryId = null;
        clearReachPreview(false);
        renderBoard();
        renderTokens();
        renderScenery();
        renderLayersPanel();
        renderTurnList();
        saveState();
    }

    // ----------------------------------------------------------------
    // Páginas (cenas)
    // ----------------------------------------------------------------

    function renderPagesBar() {
        if (!els.pagesTabs) return;
        els.pagesTabs.innerHTML = '';
        const frag = document.createDocumentFragment();
        for (const page of state.pages) {
            const tab = document.createElement('div');
            tab.className = 'cb-page-tab' + (page.id === state.activePageId ? ' is-active' : '');
            tab.dataset.pageId = page.id;
            tab.title = 'Clique para abrir, duplo clique para renomear';

            const nameEl = document.createElement('span');
            nameEl.className = 'cb-page-tab-name';
            nameEl.textContent = page.name;
            tab.appendChild(nameEl);

            if (state.pages.length > 1) {
                const closeBtn = document.createElement('button');
                closeBtn.type = 'button';
                closeBtn.className = 'cb-page-tab-close';
                closeBtn.textContent = '×';
                closeBtn.title = 'Remover página';
                closeBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    removePage(page.id);
                });
                tab.appendChild(closeBtn);
            }

            tab.addEventListener('click', () => switchPage(page.id));
            tab.addEventListener('dblclick', () => {
                const next = prompt('Nome da página:', page.name);
                if (next === null) return;
                const trimmed = next.trim();
                if (!trimmed) return;
                page.name = trimmed;
                renderPagesBar();
                saveState();
            });

            frag.appendChild(tab);
        }
        els.pagesTabs.appendChild(frag);
    }

    function switchPage(pageId) {
        if (pageId === state.activePageId) return;
        const page = state.pages.find(p => p.id === pageId);
        if (!page) return;
        syncLiveToActivePage();
        state.activePageId = pageId;
        loadPageIntoLive(page);
        clearReachPreview(false);
        renderBoard();
        renderTokens();
        renderScenery();
        applyViewport();
        els.cols.value = state.cols;
        els.rows.value = state.rows;
        els.toggleNumbers.checked = state.showNumbers;
        if (els.mapImage) els.mapImage.value = state.mapBackground || '';
        if (els.gridOpacity) els.gridOpacity.value = String(state.gridOpacity);
        if (els.gridSize) els.gridSize.value = String(CELL_SIZE);
        refreshSceneFieldsUI();
        updateActionButtons();
        renderPagesBar();
        renderLayersPanel();
        renderLog();
        renderTurnList();
        saveState();
    }

    function refreshSceneFieldsUI() {
        if (els.sceneType) els.sceneType.value = state.tipo || '';
        if (els.sceneNotes) els.sceneNotes.value = state.notasNarrador || '';
        if (els.sceneBiome) els.sceneBiome.value = state.sceneBiome || '';
        refreshSceneBiomeTag();
        refreshTerrainUI();
        refreshModeUI();
    }

    function refreshSceneBiomeTag() {
        if (!els.sceneBiomeTag) return;
        const biome = state.sceneBiome || '';
        if (biome) {
            els.sceneBiomeTag.textContent = '🌿 ' + biomeLabel(biome);
            els.sceneBiomeTag.hidden = false;
        } else {
            els.sceneBiomeTag.textContent = '';
        }
    }

    // ---- Modo da cena (Editar/Jogar) ----
    function setModoCena(modo) {
        state.modoCena = (modo === 'play') ? 'play' : 'edit';
        // Sair do modo de marcação ao entrar em "play" (reduz risco de
        // edição acidental).
        if (state.modoCena === 'play' && state.terrainMarkingMode) {
            setTerrainMarkingMode(false);
        }
        refreshModeUI();
        saveState();
    }

    function refreshModeUI() {
        const modo = state.modoCena === 'play' ? 'play' : 'edit';
        document.body.dataset.mode = modo;
        if (els.modeEditBtn) {
            els.modeEditBtn.classList.toggle('is-active', modo === 'edit');
            els.modeEditBtn.setAttribute('aria-selected', modo === 'edit' ? 'true' : 'false');
        }
        if (els.modePlayBtn) {
            els.modePlayBtn.classList.toggle('is-active', modo === 'play');
            els.modePlayBtn.setAttribute('aria-selected', modo === 'play' ? 'true' : 'false');
        }
        refreshCombatUI();
    }

    // ---- Biomas / ambientes da cena (Parte 4) ----
    // Lista canônica usada no select. Mesma usada no bestiário (Pindorama).
    const SCENE_BIOMES = [
        'amazonia', 'cerrado', 'caatinga', 'pantanal',
        'mata-atlantica', 'pampas', 'manguezal', 'restinga',
        'litoral', 'campos-rupestres', 'rios', 'cavernas',
        'ilhas', 'urbano-colonial', 'urbano-tradicional',
        'taverna', 'estrada', 'montanha', 'ruina',
        'aldeia', 'sertao'
    ];
    function biomeLabel(slug) {
        const map = {
            'amazonia': 'Amazônia', 'cerrado': 'Cerrado',
            'caatinga': 'Caatinga', 'pantanal': 'Pantanal',
            'mata-atlantica': 'Mata Atlântica', 'pampas': 'Pampas',
            'manguezal': 'Manguezal', 'restinga': 'Restinga',
            'litoral': 'Litoral', 'campos-rupestres': 'Campos Rupestres',
            'rios': 'Rios e alagados', 'cavernas': 'Cavernas',
            'ilhas': 'Ilhas', 'urbano-colonial': 'Urbano colonial',
            'urbano-tradicional': 'Urbano tradicional',
            'taverna': 'Taverna/interior', 'estrada': 'Estrada/campo aberto',
            'montanha': 'Montanha/rochoso', 'ruina': 'Ruína/cripta',
            'aldeia': 'Aldeia', 'sertao': 'Sertão'
        };
        return map[slug] || slug;
    }
    function getSceneTerrainType() {
        return state.sceneBiome || '';
    }

    // ---- Combate ativo (Iniciar/Encerrar) ----

    function refreshCombatUI() {
        const ativo = !!state.combateAtivo;
        const modoPlay = state.modoCena === 'play';

        if (els.startCombatBtn) {
            els.startCombatBtn.hidden = ativo || !modoPlay;
        }
        if (els.endCombatBtn) {
            els.endCombatBtn.hidden = !ativo;
        }
        document.body.dataset.combate = ativo ? 'ativo' : 'inativo';
    }

    async function iniciarCombate() {
        const elegiveis = state.tokens.filter(t => !t.layer || t.layer !== 'mapa');
        if (elegiveis.length < 1) {
            showCbToast('Adicione pelo menos um token antes de iniciar o combate.');
            return;
        }
        const ok = await showMesaConfirm({
            title: 'Iniciar combate',
            body: elegiveis.length === 1
                ? 'Iniciar combate com 1 token?'
                : `Iniciar combate com ${elegiveis.length} tokens? A iniciativa será rolada automaticamente.`,
            confirmLabel: 'Iniciar',
            cancelLabel: 'Cancelar'
        });
        if (!ok) return;

        // Reusa a rolagem de iniciativa existente (que já reseta movimentos
        // e foca o primeiro). Adiciona apenas a flag de combate ativo.
        rollInitiativeForScene();
        state.combateAtivo = true;
        // A rodada já foi resetada para 1 dentro do rollInitiativeForScene.
        const turn = state.turns[state.currentTurnIndex];
        const tokenAtual = turn ? state.tokens.find(t => t.id === turn.tokenId) : null;
        const nome = tokenAtual ? (tokenAtual.name || 'Token') : '—';
        showCombatBanner('Combate iniciado', `Rodada 1 · Turno de ${nome}`);
        addLog({ title: 'Combate iniciado', detail: `Rodada 1 · Primeiro turno: ${nome}.` });
        refreshCombatUI();
        renderTurnList();
        renderTokens();
        saveState();
    }

    async function encerrarCombate() {
        if (!state.combateAtivo) return;
        const ok = await showMesaConfirm({
            title: 'Encerrar combate',
            body: 'Encerrar combate? Posições, mapa e cena permanecem.',
            confirmLabel: 'Encerrar',
            cancelLabel: 'Cancelar',
            danger: true
        });
        if (!ok) return;
        state.combateAtivo = false;
        clearReachPreview(false);
        addLog({ title: 'Combate encerrado', detail: 'A cena permanece; posições preservadas.' });
        showCombatBanner('Combate encerrado', '');
        refreshCombatUI();
        renderTurnList();
        renderTokens();
        renderBoard();
        saveState();
    }

    /**
     * Modal de confirmação assíncrono — substituto local de confirm().
     * Resolve a Promise com `true` se o usuário clicar no botão de
     * confirmar, `false` em qualquer outro caminho (cancelar, ESC,
     * clicar fora). Sem alert/confirm nativos.
     *
     * Opções: { title, body, confirmLabel, cancelLabel, danger }.
     */
    function showMesaConfirm(opts) {
        return new Promise((resolve) => {
            const o = opts || {};
            let backdrop = document.getElementById('cbMesaConfirm');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.id = 'cbMesaConfirm';
                backdrop.className = 'cb-mesa-confirm-backdrop';
                backdrop.innerHTML =
                    '<div class="cb-mesa-confirm-card" role="alertdialog" aria-modal="true">' +
                    '  <header><h3 class="cb-mesa-confirm-title"></h3>' +
                    '    <button type="button" class="cb-mesa-confirm-x" aria-label="Fechar">×</button>' +
                    '  </header>' +
                    '  <div class="cb-mesa-confirm-body"></div>' +
                    '  <footer>' +
                    '    <button type="button" class="cb-mesa-confirm-cancel"></button>' +
                    '    <button type="button" class="cb-mesa-confirm-ok cb-primary"></button>' +
                    '  </footer>' +
                    '</div>';
                document.body.appendChild(backdrop);
            }
            backdrop.classList.toggle('is-danger', !!o.danger);
            const titleEl = backdrop.querySelector('.cb-mesa-confirm-title');
            const bodyEl  = backdrop.querySelector('.cb-mesa-confirm-body');
            const okBtn   = backdrop.querySelector('.cb-mesa-confirm-ok');
            const cancelBtn = backdrop.querySelector('.cb-mesa-confirm-cancel');
            const xBtn    = backdrop.querySelector('.cb-mesa-confirm-x');

            titleEl.textContent = o.title || 'Confirmar';
            bodyEl.innerHTML = ''; // body pode ser HTML controlado por strings montadas no chamador
            if (typeof o.body === 'string') {
                const p = document.createElement('p');
                p.textContent = o.body;
                bodyEl.appendChild(p);
            } else if (o.body instanceof Node) {
                bodyEl.appendChild(o.body);
            }
            okBtn.textContent = o.confirmLabel || 'Confirmar';
            cancelBtn.textContent = o.cancelLabel || 'Cancelar';
            backdrop.hidden = false;

            const cleanup = (resultado) => {
                backdrop.hidden = true;
                okBtn.removeEventListener('click', onOk);
                cancelBtn.removeEventListener('click', onCancel);
                xBtn.removeEventListener('click', onCancel);
                backdrop.removeEventListener('click', onBackdrop);
                document.removeEventListener('keydown', onKey, true);
                resolve(resultado);
            };
            const onOk = () => cleanup(true);
            const onCancel = () => cleanup(false);
            const onBackdrop = (ev) => { if (ev.target === backdrop) cleanup(false); };
            const onKey = (ev) => {
                if (ev.key === 'Escape') { ev.stopPropagation(); cleanup(false); }
                else if (ev.key === 'Enter') { ev.stopPropagation(); cleanup(true); }
            };

            okBtn.addEventListener('click', onOk);
            cancelBtn.addEventListener('click', onCancel);
            xBtn.addEventListener('click', onCancel);
            backdrop.addEventListener('click', onBackdrop);
            document.addEventListener('keydown', onKey, true);
            // Foco no botão de confirmar para responder rápido por Enter.
            setTimeout(() => okBtn.focus(), 30);
        });
    }
    window.showMesaConfirm = showMesaConfirm;

    // ---- Banner central transiente (Combate iniciado / Nova rodada) ----
    let _combatBannerTimer = null;
    function buildTurnoAtualCard() {
        // Sempre que combate estiver ativo OU houver turno definido,
        // mostra um card no topo do painel de iniciativa com o foco
        // visual no token da vez. Em combate inativo, mostra estado
        // "preparação" + botão Iniciar Combate.
        const wrap = document.createElement('div');
        wrap.className = 'cb-turno-atual';

        if (!state.combateAtivo) {
            wrap.classList.add('cb-turno-atual--inativo');
            const titulo = document.createElement('strong');
            titulo.textContent = state.modoCena === 'play'
                ? 'Sem combate ativo'
                : 'Cena em preparação';
            wrap.appendChild(titulo);

            const sub = document.createElement('p');
            sub.textContent = state.modoCena === 'play'
                ? 'Inicie um combate para rolar iniciativa e controlar turnos.'
                : 'Mude para “Jogar cena” na topbar para iniciar combate.';
            wrap.appendChild(sub);

            if (state.modoCena === 'play') {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'cb-turno-atual-iniciar';
                btn.textContent = '⚔ Iniciar Combate';
                btn.addEventListener('click', iniciarCombate);
                wrap.appendChild(btn);
            }
            return wrap;
        }

        // Combate ativo
        const turn = state.turns[state.currentTurnIndex];
        const token = turn ? state.tokens.find(t => t.id === turn.tokenId) : null;
        if (!token) return null;

        wrap.classList.add('cb-turno-atual--ativo');

        const head = document.createElement('div');
        head.className = 'cb-turno-atual-head';

        const thumb = document.createElement('div');
        thumb.className = 'cb-turno-atual-thumb';
        const src = resolveTokenImageSrc(token);
        if (src) {
            const img = document.createElement('img');
            img.src = src;
            img.alt = '';
            img.loading = 'lazy';
            applyTokenImageAdjustment(img, token.tokenImageAdjust ?? token.imageAdjust);
            thumb.appendChild(img);
        } else {
            thumb.textContent = getTokenInitials(token.name || '?');
        }
        head.appendChild(thumb);

        const info = document.createElement('div');
        info.className = 'cb-turno-atual-info';
        const tag = document.createElement('span');
        tag.className = 'cb-turno-atual-tag';
        tag.textContent = 'AGORA';
        info.appendChild(tag);
        const nome = document.createElement('strong');
        nome.textContent = token.name || 'Token';
        info.appendChild(nome);
        const meta = document.createElement('span');
        const total = tokenDeslocamentoQuadrados(token);
        const restante = tokenMovimentoRestante(token);
        const padrao = (token.acaoPadraoUsada || token.acaoCompletaUsada) ? 0 : 1;
        const movRest = token.acaoCompletaUsada ? 0 : (token.acaoMovimentoUsada ? 0 : 1);
        meta.className = 'cb-turno-atual-meta';
        meta.textContent = `Rodada ${state.currentRound} · P:${padrao} M:${movRest} · ${restante}/${total} qd`;
        info.appendChild(meta);
        head.appendChild(info);

        const focusBtn = document.createElement('button');
        focusBtn.type = 'button';
        focusBtn.className = 'cb-turno-atual-focus';
        focusBtn.title = 'Centralizar mapa no token da vez';
        focusBtn.setAttribute('aria-label', 'Focar token atual');
        focusBtn.textContent = '⌖';
        focusBtn.addEventListener('click', () => {
            selectToken(token.id);
            focusTokenOnMap(token);
        });
        head.appendChild(focusBtn);

        wrap.appendChild(head);

        // Linha de ações primárias: Mover + Atacar lado a lado.
        const acoesPrim = document.createElement('div');
        acoesPrim.className = 'cb-turno-atual-acoes';

        // Botão "Mover" — entra em modo click-to-move.
        const moverBtn = document.createElement('button');
        moverBtn.type = 'button';
        moverBtn.className = 'cb-turno-atual-mover';
        moverBtn.innerHTML = '<span class="cb-turno-atual-icon" aria-hidden="true">↣</span> Mover';
        // Reusa `movRest` já calculado acima (linha do meta). Não redeclarar.
        const podeDobro = !token.acaoPadraoUsada || token.dobroMovimento;
        // Habilitado se ainda há mov OU se padrão livre p/ converter em dobro.
        moverBtn.disabled = (movRest === 0 && !podeDobro) || token.acaoCompletaUsada;
        moverBtn.title = 'Clique e escolha um destino no grid. ESC cancela.';
        moverBtn.addEventListener('click', () => {
            // Garante que o token "selecionado" para o picker é o do turno.
            if (state.selectedId !== token.id) selectToken(token.id);
            entrarModoMover();
        });
        acoesPrim.appendChild(moverBtn);

        // Botão "Atacar" — abre o painel de ataque (variação quente).
        const atacarBtn = document.createElement('button');
        atacarBtn.type = 'button';
        atacarBtn.className = 'cb-turno-atual-atacar';
        atacarBtn.innerHTML = '<span class="cb-turno-atual-icon" aria-hidden="true">⚔</span> Atacar';
        // Habilitado apenas se ainda houver ação padrão disponível.
        const podeAtacar = canTakeStandardAction(token);
        atacarBtn.disabled = !podeAtacar;
        atacarBtn.title = podeAtacar
            ? 'Abrir painel de ataques deste combatente.'
            : (token.acaoCompletaUsada
                ? 'Ação completa já gasta — sem ação padrão.'
                : (token.dobroMovimento
                    ? '2ª ação de movimento em uso — sem ação padrão.'
                    : 'Ação padrão já gasta neste turno.'));
        atacarBtn.addEventListener('click', () => {
            if (state.selectedId !== token.id) selectToken(token.id);
            openTokenActionPanel(token.id, 'ataques', { attackMode: true });
        });
        acoesPrim.appendChild(atacarBtn);

        wrap.appendChild(acoesPrim);

        const endBtn = document.createElement('button');
        endBtn.type = 'button';
        endBtn.className = 'cb-turno-atual-end';
        endBtn.textContent = 'Terminar turno ▶';
        endBtn.addEventListener('click', nextTurn);
        wrap.appendChild(endBtn);

        return wrap;
    }

    function showCombatBanner(titulo, subtitulo) {
        let el = document.getElementById('cbCombatBanner');
        if (!el) {
            el = document.createElement('div');
            el.id = 'cbCombatBanner';
            el.className = 'cb-combat-banner';
            el.setAttribute('role', 'status');
            el.setAttribute('aria-live', 'polite');
            el.innerHTML = '<strong></strong><span></span>';
            document.body.appendChild(el);
        }
        el.querySelector('strong').textContent = titulo || '';
        el.querySelector('span').textContent = subtitulo || '';
        el.classList.add('is-visible');
        if (_combatBannerTimer) clearTimeout(_combatBannerTimer);
        _combatBannerTimer = setTimeout(() => {
            el.classList.remove('is-visible');
        }, 2500);
    }

    /**
     * Reúne traços disponíveis para o token. Hoje retorna apenas dados
     * estruturados conhecidos (bioma da criatura, ancestralidade, etc.).
     * Bônus reais por habilidade exigem normalização de texto livre,
     * fora do escopo desta iteração.
     */
    function getTokenTraits(tokenId) {
        const token = state.tokens.find(t => t.id === tokenId);
        if (!token) return null;
        return {
            id: token.id,
            nome: token.name || '',
            bioma: token.bioma || '',
            papelTatico: token.papelTatico || '',
            ancestralidade: token.ancestralidade || '',
            origem: token.origem || '',
            classe: token.classe || '',
            tipo: token.tipo || '' // criatura, personagem, npc...
        };
    }

    /**
     * Sugestões (não numéricas) de bônus de terreno aplicáveis ao token.
     * Estratégia segura: comparar bioma da cena com `bioma` estruturado
     * do token (vindo do bestiário). Retorna lista de objetos
     * { fonte, descricao, sugestaoBonus? }.
     *
     * Não inventa bônus numéricos. O Facilitador interpreta as habilidades
     * específicas do token para decidir.
     */
    function getTerrainBonusesForToken(tokenId, terrainType) {
        const out = [];
        const t = getTokenTraits(tokenId);
        if (!t || !terrainType) return out;
        const norm = (s) => normalizeText(String(s || '').replace(/[-_]/g, ' '));
        if (t.bioma && norm(t.bioma) === norm(terrainType)) {
            out.push({
                fonte: 'Bioma natural (bestiário)',
                descricao: `Esta criatura habita ${t.bioma}. Habilidades de habitat podem aplicar bônus aqui — ver ficha.`
            });
        }
        return out;
    }

    function buildTerrainBonusSuggestion(token) {
        const terrain = getSceneTerrainType();
        if (!terrain) return null;
        const sugestoes = getTerrainBonusesForToken(token.id, terrain);
        if (!sugestoes.length) return null;
        const wrap = document.createElement('div');
        wrap.className = 'cb-terrain-bonus-suggestion';
        const head = document.createElement('strong');
        head.textContent = '🌿 Bônus de terreno disponível';
        wrap.appendChild(head);
        for (const s of sugestoes) {
            const row = document.createElement('p');
            const f = document.createElement('em');
            f.textContent = s.fonte + ' — ';
            row.appendChild(f);
            row.appendChild(document.createTextNode(s.descricao));
            wrap.appendChild(row);
        }
        return wrap;
    }

    function terrainCellKey(col, row) { return col + ',' + row; }
    function isTerrainDifficult(col, row) {
        return state.terrainDifficult instanceof Set
            && state.terrainDifficult.has(terrainCellKey(col, row));
    }
    function isTerrainBarrier(col, row) {
        return state.terrainBarriers instanceof Set
            && state.terrainBarriers.has(terrainCellKey(col, row));
    }
    function isTerrainSpecial(col, row) {
        return state.terrainSpecial && !!state.terrainSpecial[terrainCellKey(col, row)];
    }
    function getTerrainSpecialBiome(col, row) {
        return (state.terrainSpecial && state.terrainSpecial[terrainCellKey(col, row)]) || '';
    }
    // Alias do nome solicitado no plano da Parte 4.
    function isCellBarrier(col, row) { return isTerrainBarrier(col, row); }

    /**
     * Lista de células atravessadas pela linha entre dois centros de
     * células no grid. Aproximação supercover: amostra a linha em N
     * pontos (N proporcional ao comprimento) e registra cada célula
     * cruzada. Funciona bem para LoE em grid quadrado.
     */
    function getCellsBetween(col1, row1, col2, row2) {
        const cells = [];
        const x0 = col1 + 0.5, y0 = row1 + 0.5;
        const x1 = col2 + 0.5, y1 = row2 + 0.5;
        const dx = x1 - x0, dy = y1 - y0;
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const steps = Math.ceil(dist * 4) + 1; // 4 amostras por célula
        let lastKey = '';
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = x0 + dx * t;
            const y = y0 + dy * t;
            const c = Math.floor(x);
            const r = Math.floor(y);
            const k = c + ',' + r;
            if (k !== lastKey) {
                cells.push({ col: c, row: r });
                lastKey = k;
            }
        }
        return cells;
    }

    /**
     * Verifica se há linha de efeito livre entre duas células.
     * Endpoints (atacante e alvo) NÃO bloqueiam — apenas células
     * intermediárias marcadas como barreira.
     */
    function hasLineOfEffect(c1, r1, c2, r2) {
        const cells = getCellsBetween(c1, r1, c2, r2);
        for (const { col, row } of cells) {
            if (col === c1 && row === r1) continue;
            if (col === c2 && row === r2) continue;
            if (isCellBarrier(col, row)) return false;
        }
        return true;
    }

    /**
     * Linha de efeito de um TOKEN (que ocupa N células) até outro
     * TOKEN. Considera linha livre se EXISTIR ao menos um par de
     * células (atacante, alvo) sem barreira no meio.
     */
    function tokenHasLineOfEffectTo(attacker, target) {
        const fromCells = getTokenCells(attacker);
        const toCells = getTokenCells(target);
        for (const fc of fromCells) {
            for (const tc of toCells) {
                if (hasLineOfEffect(fc.col, fc.row, tc.col, tc.row)) return true;
            }
        }
        return false;
    }

    /**
     * Linha de efeito do TOKEN para uma CÉLULA arbitrária do tabuleiro
     * (usado para destacar células de alcance bloqueadas pelo grid).
     */
    function tokenHasLineOfEffectToCell(attacker, col, row) {
        const fromCells = getTokenCells(attacker);
        for (const fc of fromCells) {
            if (hasLineOfEffect(fc.col, fc.row, col, row)) return true;
        }
        return false;
    }

    function renderTerrainOverlay() {
        if (!els.terrainLayer) return;
        els.terrainLayer.innerHTML = '';
        const frag = document.createDocumentFragment();

        const renderSet = (set, cls) => {
            if (!(set instanceof Set) || !set.size) return;
            for (const key of set) {
                const m = /^(\d+),(\d+)$/.exec(key);
                if (!m) continue;
                const col = Number(m[1]);
                const row = Number(m[2]);
                if (col < 0 || row < 0 || col >= state.cols || row >= state.rows) continue;
                const cell = document.createElement('div');
                cell.className = cls;
                cell.style.left = (col * CELL_SIZE) + 'px';
                cell.style.top = (row * CELL_SIZE) + 'px';
                cell.style.width = CELL_SIZE + 'px';
                cell.style.height = CELL_SIZE + 'px';
                frag.appendChild(cell);
            }
        };
        renderSet(state.terrainDifficult, 'cb-terrain-cell cb-terrain-cell--difficult');
        renderSet(state.terrainBarriers,  'cb-terrain-cell cb-terrain-cell--barrier');

        // Terreno especial: rodar mapa de subtipos.
        if (state.terrainSpecial && typeof state.terrainSpecial === 'object') {
            for (const key of Object.keys(state.terrainSpecial)) {
                const m = /^(\d+),(\d+)$/.exec(key);
                if (!m) continue;
                const col = Number(m[1]);
                const row = Number(m[2]);
                if (col < 0 || row < 0 || col >= state.cols || row >= state.rows) continue;
                const cell = document.createElement('div');
                cell.className = 'cb-terrain-cell cb-terrain-cell--special';
                cell.dataset.biome = state.terrainSpecial[key] || '';
                cell.title = 'Terreno especial: ' + (state.terrainSpecial[key] || '?');
                cell.style.left = (col * CELL_SIZE) + 'px';
                cell.style.top = (row * CELL_SIZE) + 'px';
                cell.style.width = CELL_SIZE + 'px';
                cell.style.height = CELL_SIZE + 'px';
                frag.appendChild(cell);
            }
        }

        els.terrainLayer.appendChild(frag);
    }

    function refreshTerrainUI() {
        const cDif = state.terrainDifficult instanceof Set ? state.terrainDifficult.size : 0;
        const cBar = state.terrainBarriers  instanceof Set ? state.terrainBarriers.size  : 0;
        const cSpe = state.terrainSpecial && typeof state.terrainSpecial === 'object'
            ? Object.keys(state.terrainSpecial).length : 0;
        if (els.terrainCountDifficult) {
            els.terrainCountDifficult.textContent = cDif === 1 ? '1 célula' : (cDif + ' células');
        }
        if (els.terrainCountBarrier) {
            els.terrainCountBarrier.textContent = cBar === 1 ? '1 célula' : (cBar + ' células');
        }
        if (els.terrainCountSpecial) {
            els.terrainCountSpecial.textContent = cSpe === 1 ? '1 célula' : (cSpe + ' células');
        }
        if (els.terrainCount) {
            els.terrainCount.textContent = (cDif + cBar + cSpe) + ' células marcadas';
        }
        if (els.toggleTerrainMode) {
            els.toggleTerrainMode.setAttribute('aria-pressed', state.terrainMarkingMode ? 'true' : 'false');
            els.toggleTerrainMode.textContent = state.terrainMarkingMode
                ? 'Sair do modo de marcação'
                : 'Marcar terreno';
        }
        if (els.terrainTypeRadios) {
            els.terrainTypeRadios.forEach(radio => {
                radio.checked = (radio.value === state.terrainMarkingType);
            });
        }
        if (els.terrainSpecialBiomeLabel) {
            els.terrainSpecialBiomeLabel.hidden = state.terrainMarkingType !== 'special';
        }
        if (els.terrainSpecialBiome) {
            els.terrainSpecialBiome.value = state.terrainSpecialBiome || 'mangue';
        }
        if (els.stage) {
            els.stage.classList.toggle('is-marking-terrain', !!state.terrainMarkingMode);
            els.stage.classList.toggle('is-marking-barrier',
                !!state.terrainMarkingMode && state.terrainMarkingType === 'barrier');
            els.stage.classList.toggle('is-marking-special',
                !!state.terrainMarkingMode && state.terrainMarkingType === 'special');
        }
    }

    function setTerrainMarkingMode(active) {
        state.terrainMarkingMode = !!active;
        if (state.terrainMarkingMode) {
            selectToken(null);
            if (state.selectedSceneryId) selectScenery(null);
        }
        refreshTerrainUI();
    }

    function setTerrainMarkingType(type) {
        if (type === 'barrier' || type === 'special') state.terrainMarkingType = type;
        else state.terrainMarkingType = 'difficult';
        refreshTerrainUI();
    }

    function toggleTerrainCellAt(col, row) {
        const key = terrainCellKey(col, row);
        const tipoMarc = state.terrainMarkingType;
        const tipoNome = tipoMarc === 'barrier' ? 'barreira'
                       : tipoMarc === 'special' ? 'terreno especial'
                       : 'terreno difícil';

        if (tipoMarc === 'special') {
            if (!state.terrainSpecial || typeof state.terrainSpecial !== 'object') {
                state.terrainSpecial = {};
            }
            const tem = !!state.terrainSpecial[key];
            const acao = tem ? 'remove' : 'marca';
            pushUndo(`${acao} ${tipoNome} (${col+1},${row+1})`, null);
            if (tem) {
                delete state.terrainSpecial[key];
            } else {
                state.terrainSpecial[key] = state.terrainSpecialBiome || 'mangue';
            }
        } else {
            const set = (tipoMarc === 'barrier')
                ? (state.terrainBarriers instanceof Set ? state.terrainBarriers : (state.terrainBarriers = new Set()))
                : (state.terrainDifficult instanceof Set ? state.terrainDifficult : (state.terrainDifficult = new Set()));
            const acao = set.has(key) ? 'remove' : 'marca';
            pushUndo(`${acao} ${tipoNome} (${col+1},${row+1})`, null);
            if (set.has(key)) set.delete(key);
            else set.add(key);
        }
        renderTerrainOverlay();
        refreshTerrainUI();
        if (state.reachPreview) renderBoard();
        saveState();
    }

    async function clearAllTerrain() {
        const cDif = state.terrainDifficult instanceof Set ? state.terrainDifficult.size : 0;
        const cBar = state.terrainBarriers  instanceof Set ? state.terrainBarriers.size  : 0;
        const cSpe = state.terrainSpecial && typeof state.terrainSpecial === 'object'
            ? Object.keys(state.terrainSpecial).length : 0;
        const total = cDif + cBar + cSpe;
        if (!total) return;
        const ok = await showMesaConfirm({
            title: 'Limpar marcações',
            body: `Remover todas as ${total} marcações de terreno desta cena?`,
            confirmLabel: 'Limpar tudo',
            cancelLabel: 'Cancelar',
            danger: true
        });
        if (!ok) return;
        state.terrainDifficult = new Set();
        state.terrainBarriers  = new Set();
        state.terrainSpecial   = {};
        renderTerrainOverlay();
        refreshTerrainUI();
        if (state.reachPreview) renderBoard();
        saveState();
    }

    function addPage() {
        const name = prompt('Nome da nova página:', `Cena ${state.pages.length + 1}`);
        if (name === null) return;
        const trimmed = name.trim() || `Cena ${state.pages.length + 1}`;
        const page = createDefaultPage(trimmed);
        syncLiveToActivePage();
        state.pages.push(page);
        state.activePageId = page.id;
        loadPageIntoLive(page);
        renderBoard();
        renderTokens();
        renderScenery();
        centerBoard();
        els.cols.value = state.cols;
        els.rows.value = state.rows;
        els.toggleNumbers.checked = state.showNumbers;
        refreshSceneFieldsUI();
        updateActionButtons();
        renderPagesBar();
        renderLayersPanel();
        saveState();
    }

    function removePage(pageId) {
        if (state.pages.length <= 1) {
            alert('Não é possível remover a última página.');
            return;
        }
        const idx = state.pages.findIndex(p => p.id === pageId);
        if (idx < 0) return;
        const page = state.pages[idx];
        if (!confirm(`Remover a página "${page.name}" e tudo que está nela?`)) return;
        state.pages.splice(idx, 1);
        if (state.activePageId === pageId) {
            const newActive = state.pages[Math.max(0, idx - 1)];
            state.activePageId = newActive.id;
            loadPageIntoLive(newActive);
            renderBoard();
            renderTokens();
            renderScenery();
            applyViewport();
            els.cols.value = state.cols;
            els.rows.value = state.rows;
            els.toggleNumbers.checked = state.showNumbers;
        }
        renderPagesBar();
        renderLayersPanel();
        saveState();
    }

    // ----------------------------------------------------------------
    // Cenário (imagens livres)
    // ----------------------------------------------------------------

    function renderScenery() {
        if (!els.sceneryLayer) return;
        els.sceneryLayer.innerHTML = '';
        if (els.npcLayer) els.npcLayer.innerHTML = '';
        const sorted = [...state.scenery].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        const sceneryFrag = document.createDocumentFragment();
        const npcFrag = document.createDocumentFragment();
        for (const item of sorted) {
            if (item.hidden) continue;
            const el = buildSceneryElement(item);
            if (item.layer === 'npcs') npcFrag.appendChild(el);
            else sceneryFrag.appendChild(el);
        }
        els.sceneryLayer.appendChild(sceneryFrag);
        if (els.npcLayer) els.npcLayer.appendChild(npcFrag);
    }

    function buildSceneryElement(item) {
        const el = document.createElement('div');
        el.className = 'cb-scenery';
        el.dataset.sceneryId = item.id;
        el.dataset.layer = item.layer || 'scenery';
        if ((item.layer || 'scenery') !== state.activeImageLayer) el.classList.add('is-inactive-layer');
        if (item.locked) el.classList.add('is-locked');
        if (item.id === state.selectedSceneryId && (item.layer || 'scenery') === state.activeImageLayer) el.classList.add('is-selected');
        el.style.left = item.x + 'px';
        el.style.top = item.y + 'px';
        el.style.width = item.width + 'px';
        el.style.height = item.height + 'px';
        el.style.transform = `rotate(${item.rotation || 0}deg)`;
        el.style.zIndex = String(item.zIndex || 0);
        if ((item.layer || 'scenery') === 'npcs') {
            const crop = normalizeImageCrop(item.crop);
            el.style.setProperty('--scenery-crop-scale', String(crop.scale));
            el.style.setProperty('--scenery-crop-x', `${crop.x}%`);
            el.style.setProperty('--scenery-crop-y', `${crop.y}%`);
        }

        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.name || ((item.layer || 'scenery') === 'npcs' ? 'NPC' : 'Cenário');
        img.draggable = false;
        el.appendChild(img);

        if (item.id === state.selectedSceneryId && !item.locked && (item.layer || 'scenery') === state.activeImageLayer) {
            for (const dir of ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']) {
                const resize = document.createElement('div');
                resize.className = `cb-scenery-handle cb-scenery-handle--resize cb-scenery-handle--${dir}`;
                resize.dataset.handle = 'resize';
                resize.dataset.dir = dir;
                el.appendChild(resize);
            }

            const rotate = document.createElement('div');
            rotate.className = 'cb-scenery-handle cb-scenery-handle--rotate';
            rotate.dataset.handle = 'rotate';
            el.appendChild(rotate);
        }

        return el;
    }

    function getSceneryElement(id) {
        return els.sceneryLayer?.querySelector(`[data-scenery-id="${id}"]`)
            || els.npcLayer?.querySelector(`[data-scenery-id="${id}"]`)
            || null;
    }

    function isActiveImageLayerItem(item) {
        return !!item && (item.layer || 'scenery') === state.activeImageLayer;
    }

    function selectScenery(id) {
        if (state.selectedSceneryId === id) return;
        if (id) {
            const item = state.scenery.find(s => s.id === id);
            if (item && !isActiveImageLayerItem(item)) return;
        }
        state.selectedSceneryId = id;
        if (id) {
            state.selectedId = null;
            updateSelectionVisuals();
        }
        renderScenery();
        renderLayersPanel();
    }

    function openSceneryModal(layer = 'scenery') {
        if (!els.sceneryModal) return;
        const targetLayer = layer === 'npcs' ? 'npcs' : 'scenery';
        els.sceneryName.value = '';
        els.sceneryUrl.value = '';
        if (els.sceneryLayerTarget) els.sceneryLayerTarget.value = targetLayer;
        const title = document.getElementById('cbSceneryTitle');
        if (title) title.textContent = targetLayer === 'npcs' ? 'Adicionar imagem de NPC' : 'Adicionar cenário';
        if (els.sceneryName) {
            els.sceneryName.placeholder = targetLayer === 'npcs' ? 'ex.: Guarda, Vendedor, Criatura decorativa' : 'ex.: Tapete, Pedra, Mesa';
        }
        if (els.sceneryFile) els.sceneryFile.value = '';
        els.sceneryModal.hidden = false;
        setTimeout(() => els.sceneryName?.focus(), 50);
    }

    function closeSceneryModal() {
        if (els.sceneryModal) els.sceneryModal.hidden = true;
    }

    async function confirmAddScenery() {
        const name = (els.sceneryName.value || 'Cenário').trim() || 'Cenário';
        const url = (els.sceneryUrl.value || '').trim();
        const file = els.sceneryFile?.files?.[0] || null;
        const layer = els.sceneryLayerTarget?.value === 'npcs' ? 'npcs' : 'scenery';
        if (file) {
            const originalText = els.sceneryConfirm?.textContent || 'Adicionar';
            if (els.sceneryConfirm) {
                els.sceneryConfirm.disabled = true;
                els.sceneryConfirm.textContent = 'Salvando...';
            }
            try {
                const path = await uploadBattleImage(file);
                addSceneryItem(name, path, layer);
                closeSceneryModal();
            } catch (error) {
                alert(error.message || 'Não foi possível salvar a imagem do cenário.');
            } finally {
                if (els.sceneryConfirm) {
                    els.sceneryConfirm.disabled = false;
                    els.sceneryConfirm.textContent = originalText;
                }
            }
            return;
        }
        if (!url) {
            alert('Informe uma URL/caminho ou carregue uma imagem.');
            return;
        }
        addSceneryItem(name, url, layer);
        closeSceneryModal();
    }

    function addSceneryItem(name, src, layer = 'scenery') {
        const targetLayer = layer === 'npcs' ? 'npcs' : 'scenery';
        const baseW = Math.min(state.cols * CELL_SIZE, 6 * CELL_SIZE);
        const item = normalizeSceneryItem({
            id: 'scn_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36),
            name,
            src,
            x: Math.max(0, (state.cols * CELL_SIZE - baseW) / 2),
            y: Math.max(0, (state.rows * CELL_SIZE - baseW) / 2),
            width: baseW,
            height: baseW,
            rotation: 0,
            zIndex: nextSceneryZIndex(),
            hidden: false,
            locked: false,
            layer: targetLayer
        });
        state.scenery.push(item);
        state.activeImageLayer = targetLayer;
        if (els.imageLayer) els.imageLayer.value = targetLayer;
        state.selectedSceneryId = item.id;
        renderScenery();
        renderLayersPanel();
        saveState();

        // Ajusta para a proporção real da imagem após carregar
        const probe = new Image();
        probe.onload = () => {
            if (!probe.naturalWidth || !probe.naturalHeight) return;
            const ratio = probe.naturalHeight / probe.naturalWidth;
            const found = state.scenery.find(s => s.id === item.id);
            if (!found) return;
            found.height = Math.round(found.width * ratio);
            renderScenery();
            renderLayersPanel();
            saveState();
        };
        probe.src = src;
    }

    function nextSceneryZIndex() {
        const items = state.scenery.filter(s => (s.layer || 'scenery') === state.activeImageLayer);
        if (!items.length) return 1;
        return Math.max(...items.map(s => s.zIndex || 0)) + 1;
    }

    function removeSelectedScenery() {
        if (!state.selectedSceneryId) return;
        const idx = state.scenery.findIndex(s => s.id === state.selectedSceneryId);
        if (idx < 0) return;
        state.scenery.splice(idx, 1);
        state.selectedSceneryId = null;
        renderScenery();
        renderLayersPanel();
        saveState();
    }

    function moveSceneryLayer(id, delta) {
        // delta: +1 = para frente (topo), -1 = para trás (fundo)
        const sorted = [...state.scenery]
            .filter(item => (item.layer || 'scenery') === state.activeImageLayer)
            .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        const idx = sorted.findIndex(s => s.id === id);
        if (idx < 0) return;
        const target = idx + delta;
        if (target < 0 || target >= sorted.length) return;
        const a = sorted[idx];
        const b = sorted[target];
        const tmp = a.zIndex || 0;
        a.zIndex = b.zIndex || 0;
        b.zIndex = tmp;
        renderScenery();
        renderLayersPanel();
        saveState();
    }

    function toggleSceneryHidden(id) {
        const item = state.scenery.find(s => s.id === id);
        if (!item) return;
        item.hidden = !item.hidden;
        if (item.hidden && state.selectedSceneryId === id) state.selectedSceneryId = null;
        renderScenery();
        renderLayersPanel();
        saveState();
    }

    function toggleSceneryLocked(id) {
        const item = state.scenery.find(s => s.id === id);
        if (!item) return;
        item.locked = !item.locked;
        renderScenery();
        renderLayersPanel();
        saveState();
    }

    function setActiveImageLayer(layer) {
        const next = layer === 'npcs' ? 'npcs' : 'scenery';
        state.activeImageLayer = next;
        if (els.imageLayer) els.imageLayer.value = next;
        if (state.selectedSceneryId) {
            const selected = state.scenery.find(s => s.id === state.selectedSceneryId);
            if (selected && (selected.layer || 'scenery') !== next) {
                state.selectedSceneryId = null;
            }
        }
        renderScenery();
        renderLayersPanel();
        saveState();
    }

    function renameScenery(id) {
        const item = state.scenery.find(s => s.id === id);
        if (!item) return;
        const name = prompt('Nome do cenário:', item.name);
        if (name === null) return;
        item.name = name.trim() || 'Cenário';
        renderLayersPanel();
        saveState();
    }

    function snapValue(value, step) {
        const s = step || CELL_SIZE;
        return Math.round(value / s) * s;
    }

    function snapAllSceneryToGrid() {
        if (!state.scenery.length) return;
        for (const item of state.scenery) {
            item.x = snapValue(item.x);
            item.y = snapValue(item.y);
            item.width = Math.max(CELL_SIZE, snapValue(item.width));
            item.height = Math.max(CELL_SIZE, snapValue(item.height));
        }
        renderScenery();
        renderLayersPanel();
        saveState();
    }

    // ----------------------------------------------------------------
    // Guias de alinhamento (estilo Canva) para cenário
    // ----------------------------------------------------------------

    const GUIDE_TOLERANCE = 8; // px no espaço do board

    function showGuides(guides) {
        if (!els.guidesLayer) return;
        els.guidesLayer.innerHTML = '';
        const frag = document.createDocumentFragment();
        for (const g of guides) {
            const el = document.createElement('div');
            el.className = 'cb-guide-line cb-guide-line--' + g.orient + (g.center ? ' cb-guide-line--center' : '');
            if (g.orient === 'vertical') el.style.left = g.pos + 'px';
            else el.style.top = g.pos + 'px';
            frag.appendChild(el);
        }
        els.guidesLayer.appendChild(frag);
    }

    function clearGuides() {
        if (els.guidesLayer) els.guidesLayer.innerHTML = '';
    }

    // Devolve {x,y,guides} já com snap para guias inteligentes (centro do board,
    // bordas/centros de outros cenários, linhas do grid quando ímã estiver ativo).
    function applyDragSnaps(item, x, y, snapOn, scaleViewport) {
        const tolerance = GUIDE_TOLERANCE / (scaleViewport || 1);
        const guides = [];
        const w = item.width;
        const h = item.height;
        const candidatesX = []; // {pos, source: 'center'|'edge'|'grid'}
        const candidatesY = [];

        // Centro do board
        const boardCx = state.cols * CELL_SIZE / 2;
        const boardCy = state.rows * CELL_SIZE / 2;
        candidatesX.push({ pos: boardCx, type: 'center' });
        candidatesY.push({ pos: boardCy, type: 'center' });

        // Bordas e centros de outros cenários
        for (const other of state.scenery) {
            if (other.id === item.id || other.hidden) continue;
            if ((other.layer || 'scenery') !== (item.layer || 'scenery')) continue;
            candidatesX.push({ pos: other.x, type: 'edge' });
            candidatesX.push({ pos: other.x + other.width, type: 'edge' });
            candidatesX.push({ pos: other.x + other.width / 2, type: 'edge' });
            candidatesY.push({ pos: other.y, type: 'edge' });
            candidatesY.push({ pos: other.y + other.height, type: 'edge' });
            candidatesY.push({ pos: other.y + other.height / 2, type: 'edge' });
        }

        // Pontos do cenário em movimento que tentam alinhar
        const ownX = [
            { value: x, kind: 'left' },
            { value: x + w, kind: 'right' },
            { value: x + w / 2, kind: 'centerX' }
        ];
        const ownY = [
            { value: y, kind: 'top' },
            { value: y + h, kind: 'bottom' },
            { value: y + h / 2, kind: 'centerY' }
        ];

        let bestX = null;
        for (const c of candidatesX) {
            for (const o of ownX) {
                const d = Math.abs(o.value - c.pos);
                if (d < tolerance && (!bestX || d < bestX.dist)) {
                    bestX = { dist: d, candidate: c, own: o, delta: c.pos - o.value };
                }
            }
        }
        let bestY = null;
        for (const c of candidatesY) {
            for (const o of ownY) {
                const d = Math.abs(o.value - c.pos);
                if (d < tolerance && (!bestY || d < bestY.dist)) {
                    bestY = { dist: d, candidate: c, own: o, delta: c.pos - o.value };
                }
            }
        }

        let nx = x;
        let ny = y;

        if (bestX) {
            nx += bestX.delta;
            guides.push({ orient: 'vertical', pos: bestX.candidate.pos, center: bestX.candidate.type === 'center' });
        } else if (snapOn) {
            nx = snapValue(x);
        }
        if (bestY) {
            ny += bestY.delta;
            guides.push({ orient: 'horizontal', pos: bestY.candidate.pos, center: bestY.candidate.type === 'center' });
        } else if (snapOn) {
            ny = snapValue(y);
        }

        return { x: nx, y: ny, guides };
    }

    // Inverte temporariamente o snap se a tecla Alt (option) estiver pressionada,
    // permitindo posicionamento livre quando o ímã está ativo (ou vice-versa).
    function isSnapActive(e) {
        const base = !!state.snapToGrid;
        return e && e.altKey ? !base : base;
    }

    function startSceneryDrag(ev, item) {
        if (item.locked) return;
        const startX = ev.clientX;
        const startY = ev.clientY;
        const origX = item.x;
        const origY = item.y;
        const scale = state.viewport.scale || 1;
        const el = getSceneryElement(item.id);
        if (el) el.classList.add('is-dragging');

        function onMove(e) {
            const dx = (e.clientX - startX) / scale;
            const dy = (e.clientY - startY) / scale;
            const rawX = origX + dx;
            const rawY = origY + dy;
            const snapOn = isSnapActive(e);
            const result = applyDragSnaps(item, rawX, rawY, snapOn, scale);
            item.x = result.x;
            item.y = result.y;
            if (el) {
                el.style.left = item.x + 'px';
                el.style.top = item.y + 'px';
            }
            showGuides(result.guides);
        }
        function onUp() {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
            if (el) el.classList.remove('is-dragging');
            clearGuides();
            saveState();
        }
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
    }

    function startSceneryResize(ev, item, dir = 'se') {
        if (item.locked) return;
        const startX = ev.clientX;
        const startY = ev.clientY;
        const origX = item.x;
        const origY = item.y;
        const origW = item.width;
        const origH = item.height;
        const ratio = origW > 0 ? origH / origW : 1;
        const scale = state.viewport.scale || 1;
        const el = getSceneryElement(item.id);

        function onMove(e) {
            const dx = (e.clientX - startX) / scale;
            const dy = (e.clientY - startY) / scale;
            const snapOn = isSnapActive(e);
            const tolerance = GUIDE_TOLERANCE / (scale || 1);
            const box = resizeSceneryBox({
                item,
                dir,
                origX,
                origY,
                origW,
                origH,
                ratio,
                dx,
                dy,
                snapOn,
                tolerance,
                preserveRatio: !e.shiftKey
            });

            item.x = box.x;
            item.y = box.y;
            item.width = box.width;
            item.height = box.height;
            if (el) {
                el.style.left = item.x + 'px';
                el.style.top = item.y + 'px';
                el.style.width = item.width + 'px';
                el.style.height = item.height + 'px';
            }
            showGuides(box.guides);
        }
        function onUp() {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
            clearGuides();
            saveState();
            renderLayersPanel();
        }
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
    }

    function resizeSceneryBox(opts) {
        const {
            item,
            dir,
            origX,
            origY,
            origW,
            origH,
            ratio,
            dx,
            dy,
            snapOn,
            tolerance,
            preserveRatio
        } = opts;
        const min = CELL_SIZE / 2;
        const movesW = dir.includes('w');
        const movesE = dir.includes('e');
        const movesN = dir.includes('n');
        const movesS = dir.includes('s');
        const diagonal = (movesW || movesE) && (movesN || movesS);
        const guides = [];

        let left = origX;
        let right = origX + origW;
        let top = origY;
        let bottom = origY + origH;

        if (movesW) left = snapSceneryEdge(item, 'x', origX + dx, snapOn, tolerance, guides);
        if (movesE) right = snapSceneryEdge(item, 'x', origX + origW + dx, snapOn, tolerance, guides);
        if (movesN) top = snapSceneryEdge(item, 'y', origY + dy, snapOn, tolerance, guides);
        if (movesS) bottom = snapSceneryEdge(item, 'y', origY + origH + dy, snapOn, tolerance, guides);

        if (right - left < min) {
            if (movesW) left = right - min;
            else right = left + min;
        }
        if (bottom - top < min) {
            if (movesN) top = bottom - min;
            else bottom = top + min;
        }

        if (preserveRatio && diagonal) {
            const widthFromPointer = right - left;
            const heightFromPointer = bottom - top;
            const useWidth = Math.abs(widthFromPointer - origW) >= Math.abs((heightFromPointer / ratio) - origW);
            if (useWidth) {
                const h = Math.max(min, widthFromPointer * ratio);
                if (movesN) top = bottom - h;
                else bottom = top + h;
            } else {
                const w = Math.max(min, heightFromPointer / ratio);
                if (movesW) left = right - w;
                else right = left + w;
            }
        }

        return {
            x: left,
            y: top,
            width: Math.max(min, right - left),
            height: Math.max(min, bottom - top),
            guides
        };
    }

    function snapSceneryEdge(item, axis, desired, snapOn, tolerance, guides) {
        let value = desired;
        const candidates = collectSceneryEdgeCandidates(item, axis);
        const best = nearestCandidate(desired, candidates, tolerance);
        if (best) {
            value = best.pos;
            guides.push({ orient: axis === 'x' ? 'vertical' : 'horizontal', pos: best.pos, center: best.type === 'center' });
        } else if (snapOn) {
            value = snapValue(desired);
            guides.push({ orient: axis === 'x' ? 'vertical' : 'horizontal', pos: value, center: false });
        }
        return value;
    }

    function collectSceneryEdgeCandidates(self, axis) {
        const list = [];
        if (axis === 'x') {
            list.push({ pos: state.cols * CELL_SIZE / 2, type: 'center' });
            list.push({ pos: 0, type: 'edge' });
            list.push({ pos: state.cols * CELL_SIZE, type: 'edge' });
            for (const other of state.scenery) {
                if (other.id === self.id || other.hidden) continue;
                if ((other.layer || 'scenery') !== (self.layer || 'scenery')) continue;
                list.push({ pos: other.x, type: 'edge' });
                list.push({ pos: other.x + other.width, type: 'edge' });
                list.push({ pos: other.x + other.width / 2, type: 'edge' });
            }
        } else {
            list.push({ pos: state.rows * CELL_SIZE / 2, type: 'center' });
            list.push({ pos: 0, type: 'edge' });
            list.push({ pos: state.rows * CELL_SIZE, type: 'edge' });
            for (const other of state.scenery) {
                if (other.id === self.id || other.hidden) continue;
                if ((other.layer || 'scenery') !== (self.layer || 'scenery')) continue;
                list.push({ pos: other.y, type: 'edge' });
                list.push({ pos: other.y + other.height, type: 'edge' });
                list.push({ pos: other.y + other.height / 2, type: 'edge' });
            }
        }
        return list;
    }

    function nearestCandidate(value, candidates, tolerance) {
        let best = null;
        for (const c of candidates) {
            const d = Math.abs(value - c.pos);
            if (d < tolerance && (!best || d < best.dist)) {
                best = { dist: d, pos: c.pos, type: c.type };
            }
        }
        return best;
    }

    function startSceneryRotate(ev, item) {
        if (item.locked) return;
        const el = getSceneryElement(item.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const startAngle = Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI;
        const origRot = item.rotation || 0;

        function onMove(e) {
            const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
            item.rotation = origRot + (angle - startAngle);
            if (el) el.style.transform = `rotate(${item.rotation}deg)`;
        }
        function onUp() {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
            saveState();
        }
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
    }

    // ----------------------------------------------------------------
    // Painel de camadas
    // ----------------------------------------------------------------

    function toggleLayersPanel() {
        if (!els.layersPanel) return;
        if (els.layersPanel.hidden) {
            els.layersPanel.hidden = false;
            renderLayersPanel();
        } else {
            els.layersPanel.hidden = true;
        }
    }

    function renderLayersPanel() {
        if (!els.layersList || els.layersPanel.hidden) return;
        els.layersList.innerHTML = '';
        const sorted = [...state.scenery]
            .filter(item => (item.layer || 'scenery') === state.activeImageLayer)
            .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
        if (!sorted.length) {
            const empty = document.createElement('li');
            empty.className = 'cb-layer-empty';
            empty.textContent = state.activeImageLayer === 'npcs'
                ? 'Nenhuma imagem de NPC nesta página. Use "+ Imagem NPC" para adicionar.'
                : 'Nenhum cenário nesta página. Use "+ Cenário" para adicionar.';
            els.layersList.appendChild(empty);
            return;
        }
        const frag = document.createDocumentFragment();
        sorted.forEach((item, idx) => {
            const li = document.createElement('li');
            li.className = 'cb-layer-item' + (item.id === state.selectedSceneryId ? ' is-selected' : '');
            li.dataset.sceneryId = item.id;

            const thumb = document.createElement('div');
            thumb.className = 'cb-layer-thumb';
            if (item.src) {
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = '';
                img.onerror = () => {
                    img.remove();
                    thumb.textContent = (item.name || '?').charAt(0).toUpperCase();
                };
                thumb.appendChild(img);
            } else {
                thumb.textContent = (item.name || '?').charAt(0).toUpperCase();
            }
            li.appendChild(thumb);

            const info = document.createElement('div');
            const nm = document.createElement('div');
            nm.className = 'cb-layer-name';
            nm.textContent = item.name || 'Cenário';
            info.appendChild(nm);
            const meta = document.createElement('div');
            meta.className = 'cb-layer-meta';
            meta.textContent = `${item.layer === 'npcs' ? 'NPCs' : 'Cenário'} • ${Math.round(item.width)}×${Math.round(item.height)} • z=${item.zIndex || 0}`;
            info.appendChild(meta);
            li.appendChild(info);

            const actions = document.createElement('div');
            actions.className = 'cb-layer-actions';

            const upBtn = document.createElement('button');
            upBtn.type = 'button';
            upBtn.title = 'Trazer para frente';
            upBtn.textContent = '↑';
            upBtn.disabled = idx === 0;
            upBtn.addEventListener('click', (e) => { e.stopPropagation(); moveSceneryLayer(item.id, +1); });
            actions.appendChild(upBtn);

            const downBtn = document.createElement('button');
            downBtn.type = 'button';
            downBtn.title = 'Enviar para trás';
            downBtn.textContent = '↓';
            downBtn.disabled = idx === sorted.length - 1;
            downBtn.addEventListener('click', (e) => { e.stopPropagation(); moveSceneryLayer(item.id, -1); });
            actions.appendChild(downBtn);

            const visBtn = document.createElement('button');
            visBtn.type = 'button';
            visBtn.title = item.hidden ? 'Mostrar' : 'Ocultar';
            visBtn.textContent = item.hidden ? '◌' : '●';
            visBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSceneryHidden(item.id); });
            actions.appendChild(visBtn);

            const lockBtn = document.createElement('button');
            lockBtn.type = 'button';
            lockBtn.title = item.locked ? 'Destravar' : 'Travar';
            lockBtn.textContent = item.locked ? '🔒' : '🔓';
            lockBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSceneryLocked(item.id); });
            actions.appendChild(lockBtn);

            if ((item.layer || 'scenery') === 'npcs') {
                const cropBtn = document.createElement('button');
                cropBtn.type = 'button';
                cropBtn.title = 'Cortar imagem';
                cropBtn.textContent = 'Cortar';
                cropBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    setActiveImageLayer('npcs');
                    selectScenery(item.id);
                    openImageCropModal(item.id);
                });
                actions.appendChild(cropBtn);
            }

            const renBtn = document.createElement('button');
            renBtn.type = 'button';
            renBtn.title = 'Renomear';
            renBtn.textContent = '✎';
            renBtn.addEventListener('click', (e) => { e.stopPropagation(); renameScenery(item.id); });
            actions.appendChild(renBtn);

            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.title = 'Remover';
            delBtn.textContent = '×';
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!confirm(`Remover "${item.name}"?`)) return;
                state.selectedSceneryId = item.id;
                removeSelectedScenery();
            });
            actions.appendChild(delBtn);

            li.appendChild(actions);

            li.addEventListener('click', () => selectScenery(item.id));
            frag.appendChild(li);
        });
        els.layersList.appendChild(frag);
    }

    // ----------------------------------------------------------------
    // Corte de imagens da camada de NPCs
    // ----------------------------------------------------------------

    const imageCropState = { itemId: null };

    function openImageCropModal(itemId) {
        if (!els.imageCropModal) return;
        const item = state.scenery.find(s => s.id === itemId);
        if (!item || (item.layer || 'scenery') !== 'npcs') return;
        imageCropState.itemId = item.id;
        const crop = normalizeImageCrop(item.crop);
        els.imageCropZoom.value = String(crop.scale);
        els.imageCropX.value = String(crop.x);
        els.imageCropY.value = String(crop.y);
        els.imageCropPreviewImg.src = item.src;
        els.imageCropPreviewImg.alt = item.name || 'NPC';
        els.imageCropPreview.classList.add('has-image');
        applyImageCropPreview(crop);
        els.imageCropModal.hidden = false;
    }

    function closeImageCropModal() {
        imageCropState.itemId = null;
        if (els.imageCropModal) els.imageCropModal.hidden = true;
        if (els.imageCropPreviewImg) els.imageCropPreviewImg.removeAttribute('src');
        if (els.imageCropPreview) els.imageCropPreview.classList.remove('has-image');
    }

    function applyImageCropPreview(crop) {
        if (!els.imageCropPreview) return;
        const next = normalizeImageCrop(crop);
        els.imageCropPreview.style.setProperty('--adjust-scale', String(next.scale));
        els.imageCropPreview.style.setProperty('--adjust-x', `${next.x}%`);
        els.imageCropPreview.style.setProperty('--adjust-y', `${next.y}%`);
    }

    function readImageCropForm() {
        return normalizeImageCrop({
            scale: els.imageCropZoom?.value,
            x: els.imageCropX?.value,
            y: els.imageCropY?.value
        });
    }

    function commitImageCropToItem() {
        const item = state.scenery.find(s => s.id === imageCropState.itemId);
        if (!item) return;
        const crop = readImageCropForm();
        item.crop = crop;
        const el = getSceneryElement(item.id);
        if (el) {
            el.style.setProperty('--scenery-crop-scale', String(crop.scale));
            el.style.setProperty('--scenery-crop-x', `${crop.x}%`);
            el.style.setProperty('--scenery-crop-y', `${crop.y}%`);
        }
        saveState();
    }

    function resetImageCropToCenter() {
        if (!els.imageCropZoom || !els.imageCropX || !els.imageCropY) return;
        els.imageCropZoom.value = '1';
        els.imageCropX.value = '0';
        els.imageCropY.value = '0';
        applyImageCropPreview({ scale: 1, x: 0, y: 0 });
        commitImageCropToItem();
    }

    function bindImageCropPreviewDrag() {
        if (!els.imageCropPreview) return;
        const pointers = new Map();
        let start = null;

        els.imageCropPreview.addEventListener('pointerdown', (event) => {
            if (!els.imageCropPreview.classList.contains('has-image')) return;
            if (event.target.closest('button, input, label')) return;
            event.preventDefault();
            els.imageCropPreview.setPointerCapture?.(event.pointerId);
            pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
            start = {
                crop: readImageCropForm(),
                center: pointerCenter(pointers),
                distance: pointerDistance(pointers)
            };
            els.imageCropPreview.classList.add('is-adjusting');
        });

        els.imageCropPreview.addEventListener('pointermove', (event) => {
            if (!start || !pointers.has(event.pointerId)) return;
            event.preventDefault();
            pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
            const center = pointerCenter(pointers);
            const rect = els.imageCropPreview.getBoundingClientRect();
            const dx = ((center.x - start.center.x) / Math.max(1, rect.width)) * 100;
            const dy = ((center.y - start.center.y) / Math.max(1, rect.height)) * 100;
            const distance = pointerDistance(pointers);
            const pinchScale = start.distance && distance ? distance / start.distance : 1;
            const next = normalizeImageCrop({
                scale: start.crop.scale * pinchScale,
                x: start.crop.x + dx,
                y: start.crop.y + dy
            });
            els.imageCropZoom.value = String(next.scale);
            els.imageCropX.value = String(next.x);
            els.imageCropY.value = String(next.y);
            applyImageCropPreview(next);
            commitImageCropToItem();
        });

        function finish(event) {
            pointers.delete(event.pointerId);
            if (!pointers.size) {
                start = null;
                els.imageCropPreview.classList.remove('is-adjusting');
            } else {
                start = {
                    crop: readImageCropForm(),
                    center: pointerCenter(pointers),
                    distance: pointerDistance(pointers)
                };
            }
        }

        els.imageCropPreview.addEventListener('pointerup', finish);
        els.imageCropPreview.addEventListener('pointercancel', finish);
        els.imageCropPreview.addEventListener('wheel', (event) => {
            if (!els.imageCropPreview.classList.contains('has-image')) return;
            event.preventDefault();
            const current = readImageCropForm();
            const factor = event.deltaY < 0 ? 1.08 : 1 / 1.08;
            const next = normalizeImageCrop({ ...current, scale: current.scale * factor });
            els.imageCropZoom.value = String(next.scale);
            applyImageCropPreview(next);
            commitImageCropToItem();
        }, { passive: false });
    }

    // ----------------------------------------------------------------
    // Modal de ajuste de token (zoom/foco) por token
    // ----------------------------------------------------------------

    const adjustModalState = { tokenId: null };

    function normalizeAdjust(value) {
        const v = value || {};
        return {
            scale: Math.min(6, Math.max(0.2, Number(v.scale) || 1)),
            x: Math.min(220, Math.max(-220, Number(v.x) || 0)),
            y: Math.min(220, Math.max(-220, Number(v.y) || 0))
        };
    }

    function openAdjustModalForSelected() {
        if (!state.selectedId) return;
        const token = state.tokens.find(t => t.id === state.selectedId);
        if (!token) return;
        const src = resolveTokenImageSrc(token);
        if (!src) {
            alert('Este token não tem uma imagem para ajustar.');
            return;
        }
        adjustModalState.tokenId = token.id;
        const ajuste = normalizeAdjust(token.tokenImageAdjust ?? token.imageAdjust);
        els.adjustZoom.value = String(ajuste.scale);
        els.adjustX.value = String(ajuste.x);
        els.adjustY.value = String(ajuste.y);
        els.adjustPreviewImg.src = src;
        els.adjustPreviewImg.alt = token.name || 'Token';
        els.adjustPreview.classList.add('has-image');
        applyAdjustPreview(ajuste);
        els.adjustModal.hidden = false;
    }

    function closeAdjustModal() {
        adjustModalState.tokenId = null;
        els.adjustModal.hidden = true;
        els.adjustPreviewImg.removeAttribute('src');
        els.adjustPreview.classList.remove('has-image');
    }

    function applyAdjustPreview(ajuste) {
        const a = normalizeAdjust(ajuste);
        els.adjustPreview.style.setProperty('--adjust-scale', String(a.scale));
        els.adjustPreview.style.setProperty('--adjust-x', `${a.x}%`);
        els.adjustPreview.style.setProperty('--adjust-y', `${a.y}%`);
    }

    function readAdjustForm() {
        return normalizeAdjust({
            scale: els.adjustZoom.value,
            x: els.adjustX.value,
            y: els.adjustY.value
        });
    }

    function commitAdjustToToken() {
        const id = adjustModalState.tokenId;
        if (!id) return;
        const token = state.tokens.find(t => t.id === id);
        if (!token) return;
        const ajuste = readAdjustForm();
        token.tokenImageAdjust = ajuste;
        token.tokenImageAdjustCustom = true;
        // Atualiza só a imagem deste token, sem re-render geral
        const tokenEl = els.tokensLayer.querySelector(`[data-token-id="${token.id}"]`);
        const img = tokenEl ? tokenEl.querySelector('.cb-token-circle img') : null;
        if (img) applyTokenImageAdjustment(img, ajuste);
        saveState();
    }

    function resetAdjustToCenter() {
        els.adjustZoom.value = '1';
        els.adjustX.value = '0';
        els.adjustY.value = '0';
        applyAdjustPreview({ scale: 1, x: 0, y: 0 });
        commitAdjustToToken();
    }

    function loadBestiaryAdjustIntoModal() {
        const id = adjustModalState.tokenId;
        if (!id) return;
        const token = state.tokens.find(t => t.id === id);
        if (!token || token.source !== 'bestiario' || !token.fichaId) {
            alert('Este token não veio do bestiário.');
            return;
        }
        const criatura = state.bestiario.find(c => c.id === token.fichaId);
        if (!criatura) {
            alert('Criatura não encontrada no bestiário carregado.');
            return;
        }
        const ajuste = normalizeAdjust(criatura.tokenImagemAjuste || criatura.token?.tokenImagemAjuste || criatura.token?.imagemAjuste);
        els.adjustZoom.value = String(ajuste.scale);
        els.adjustX.value = String(ajuste.x);
        els.adjustY.value = String(ajuste.y);
        applyAdjustPreview(ajuste);
        // Aplica o ajuste do bestiário e remove a flag de customização local,
        // de modo que futuras edições no bestiário voltem a se propagar.
        token.tokenImageAdjust = ajuste;
        token.tokenImageAdjustCustom = false;
        const tokenEl = els.tokensLayer.querySelector(`[data-token-id="${token.id}"]`);
        const img = tokenEl ? tokenEl.querySelector('.cb-token-circle img') : null;
        if (img) applyTokenImageAdjustment(img, ajuste);
        saveState();
    }

    async function saveAdjustToSource() {
        const id = adjustModalState.tokenId;
        if (!id) return;
        const token = state.tokens.find(t => t.id === id);
        if (!token) return;
        const ajuste = readAdjustForm();
        commitAdjustToToken();

        if (token.source === 'bestiario' && token.fichaId) {
            await saveBestiaryTokenAdjust(token, ajuste);
            return;
        }

        if (token.fichaId) {
            await saveFichaTokenAdjust(token, ajuste);
            return;
        }

        alert('Este token não está ligado a uma ficha salva ou criatura do bestiário.');
    }

    async function saveBestiaryTokenAdjust(token, ajuste) {
        if (!state.bestiarioLoaded) {
            try {
                const resp = await fetch('data/bestiario.json', { credentials: 'same-origin', cache: 'no-store' });
                if (resp.ok) {
                    const data = await resp.json();
                    loadBestiaryData(data);
                    state.bestiarioLoaded = true;
                }
            } catch (_) {
                // Continua com o que estiver em memória/localStorage.
            }
        }

        const criatura = state.bestiario.find(c => c.id === token.fichaId);
        if (!criatura) {
            alert('Não encontrei a criatura correspondente no bestiário.');
            return;
        }

        const src = token.tokenImage || token.tokenImagem || token.imagem || criatura.tokenImagem || criatura.imagem || '';
        criatura.tokenImagem = src;
        criatura.tokenImagemAjuste = normalizeAdjust(ajuste);
        criatura.token = {
            ...(criatura.token || {}),
            imagem: src,
            tokenImagem: src,
            imagemAjuste: criatura.tokenImagemAjuste,
            tokenImagemAjuste: criatura.tokenImagemAjuste
        };
        token.tokenImageAdjust = criatura.tokenImagemAjuste;
        token.tokenImageAdjustCustom = false;
        try {
            localStorage.setItem(BESTIARIO_STORAGE_KEY, JSON.stringify(state.bestiario));
            saveState();
            alert(`Token salvo no bestiário para ${criatura.nome || token.name}.`);
        } catch (_) {
            alert('Não foi possível salvar no armazenamento local do navegador.');
        }
    }

    async function saveFichaTokenAdjust(token, ajuste) {
        try {
            const resp = await fetch('salvar-token-ajuste.php', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: token.fichaId,
                    ajuste: normalizeAdjust(ajuste)
                })
            });
            const data = await resp.json();
            if (!resp.ok || !data.success) {
                throw new Error(data.message || 'Falha ao salvar ajuste.');
            }
            token.tokenImageAdjust = normalizeAdjust(ajuste);
            token.tokenImageAdjustCustom = false;
            saveState();
            alert(`Token salvo na ficha de ${token.name || 'personagem'}.`);
        } catch (error) {
            alert(error.message || 'Não foi possível salvar o token na ficha.');
        }
    }

    function bindAdjustPreviewDrag() {
        if (!els.adjustPreview) return;
        const pointers = new Map();
        let start = null;

        els.adjustPreview.addEventListener('pointerdown', (event) => {
            if (!els.adjustPreview.classList.contains('has-image')) return;
            if (event.target.closest('button, input, label')) return;
            event.preventDefault();
            els.adjustPreview.setPointerCapture?.(event.pointerId);
            pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
            start = {
                ajuste: readAdjustForm(),
                center: pointerCenter(pointers),
                distance: pointerDistance(pointers)
            };
            els.adjustPreview.classList.add('is-adjusting');
        });

        els.adjustPreview.addEventListener('pointermove', (event) => {
            if (!start || !pointers.has(event.pointerId)) return;
            event.preventDefault();
            pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
            const center = pointerCenter(pointers);
            const rect = els.adjustPreview.getBoundingClientRect();
            const dx = ((center.x - start.center.x) / Math.max(1, rect.width)) * 100;
            const dy = ((center.y - start.center.y) / Math.max(1, rect.height)) * 100;
            const distance = pointerDistance(pointers);
            const pinchScale = start.distance && distance ? distance / start.distance : 1;
            const next = normalizeAdjust({
                scale: start.ajuste.scale * pinchScale,
                x: start.ajuste.x + dx,
                y: start.ajuste.y + dy
            });
            els.adjustZoom.value = String(next.scale);
            els.adjustX.value = String(next.x);
            els.adjustY.value = String(next.y);
            applyAdjustPreview(next);
            commitAdjustToToken();
        });

        function finish(event) {
            pointers.delete(event.pointerId);
            if (!pointers.size) {
                start = null;
                els.adjustPreview.classList.remove('is-adjusting');
            } else {
                start = {
                    ajuste: readAdjustForm(),
                    center: pointerCenter(pointers),
                    distance: pointerDistance(pointers)
                };
            }
        }

        els.adjustPreview.addEventListener('pointerup', finish);
        els.adjustPreview.addEventListener('pointercancel', finish);
        els.adjustPreview.addEventListener('wheel', (event) => {
            if (!els.adjustPreview.classList.contains('has-image')) return;
            event.preventDefault();
            const current = readAdjustForm();
            const factor = event.deltaY < 0 ? 1.08 : 1 / 1.08;
            const next = normalizeAdjust({ ...current, scale: current.scale * factor });
            els.adjustZoom.value = String(next.scale);
            applyAdjustPreview(next);
            commitAdjustToToken();
        }, { passive: false });
    }

    function pointerCenter(pointers) {
        const values = Array.from(pointers.values());
        return {
            x: values.reduce((sum, p) => sum + p.x, 0) / values.length,
            y: values.reduce((sum, p) => sum + p.y, 0) / values.length
        };
    }

    function pointerDistance(pointers) {
        const values = Array.from(pointers.values());
        if (values.length < 2) return 0;
        return Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y);
    }

    function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }

    function genId() {
        return 'tok_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
    }

    // ----------------------------------------------------------------
    // Adicionar token a partir de uma ficha ou criatura
    // ----------------------------------------------------------------

    function addTokenFromFicha(ficha) {
        const fotoSrc = ficha.personagem_imagem ? resolveImage(ficha.personagem_imagem) : null;
        const tokenSrcRaw = ficha.personagem_token_imagem || null;
        const tokenSrc = tokenSrcRaw ? resolveImage(tokenSrcRaw) : null;
        const tokenAjuste = tokenSrcRaw
            ? parseTokenAdjustment(ficha.personagem_token_imagem_ajuste)
            : parseImageAdjustment(ficha.personagem_imagem_ajuste);
        const t = {
            id: genId(),
            fichaId: ficha.id,
            source: ficha.source || 'ficha',
            name: ficha.personagem || 'Sem nome',
            tokenImage: tokenSrc || fotoSrc,
            tokenImageAdjust: tokenAjuste,
            fotoImage: fotoSrc,
            tamanho: ficha.tamanho || null,
            deslocamento: ficha.deslocamento || null,
            nd: ficha.nd || null,
            tipo: ficha.tipo || null,
            pvAtual: parseResource(ficha.pv_atuais ?? ficha.pvAtual ?? ficha.pvMax ?? ficha.pv_total),
            pvMax: parseResource(ficha.pv_total ?? ficha.pvMax),
            pmAtual: parseResource(ficha.pm_atuais ?? ficha.pmAtual ?? ficha.pmMax ?? ficha.pm_total),
            pmMax: parseResource(ficha.pm_total ?? ficha.pmMax),
            iniciativa: ficha.iniciativa_total ?? ficha.iniciativa ?? ficha.iniciativaBonus ?? null,
            bar1Attribute: 'pv',
            bar2Attribute: 'pm',
            bar3Attribute: '',
            defesa: ficha.defesa || null,
            // Atributos para fallback de saves (Reflexos = Des, Fortitude = Con, Vontade = Sab)
            forca: ficha.forca,
            destreza: ficha.destreza,
            constituicao: ficha.constituicao,
            inteligencia: ficha.inteligencia,
            sabedoria: ficha.sabedoria,
            carisma: ficha.carisma,
            // Saves explícitos (vêm do bestiário ou de uma ficha que tenha bônus customizado)
            fortitude: ficha.fortitude ?? ficha.fortitudeBonus ?? null,
            reflexos: ficha.reflexos ?? ficha.reflexo ?? ficha.reflexBonus ?? null,
            vontade: ficha.vontade ?? ficha.will ?? ficha.vontadeBonus ?? null,
            nivel: parseResource(ficha.nivel),
            bioma: ficha.bioma || null,
            papelTatico: ficha.papelTatico || null,
            ataquesPrincipais: ficha.ataquesPrincipais || [],
            habilidadesPrincipais: ficha.habilidadesPrincipais || [],
            actions: ficha.actions || buildActionsFromFicha(ficha),
            col: 0,
            row: 0,
            sizeCells: sizeCellsFromCategory(ficha.tamanho),
            widthCells: sizeCellsFromCategory(ficha.tamanho),
            heightCells: sizeCellsFromCategory(ficha.tamanho),
            layer: 'tokens',
            type: ficha.source === 'bestiario' ? 'criatura' : (ficha.id ? 'personagem' : 'generico'),
            conditions: [],
            rotation: 0
        };
        // tenta achar uma célula vazia
        const occupied = buildOccupiedCells();
        outer: for (let r = 0; r < state.rows; r++) {
            for (let c = 0; c < state.cols; c++) {
                if (canPlaceTokenAt(t, c, r, occupied)) {
                    t.col = c; t.row = r;
                    break outer;
                }
            }
        }
        state.tokens.push(migrateLegacyTokenFields(t));
        state.selectedId = t.id;
        renderTokens();
        // Sub-fase C: o token recém-adicionado é selecionado; renderBoard
        // pinta o preview de movimento dele.
        renderBoard();
        saveState();
    }

    async function syncBestiaryTokensFromLocal() {
        const bestiaryTokens = state.tokens.filter(t => t.source === 'bestiario' && t.fichaId);
        if (!bestiaryTokens.length) return;

        // Garante que state.bestiario está populado (carrega se ainda não foi feito)
        if (!state.bestiarioLoaded) {
            try {
                const resp = await fetch('data/bestiario.json', { credentials: 'same-origin', cache: 'no-store' });
                if (resp.ok) {
                    const data = await resp.json();
                    loadBestiaryData(data);
                    state.bestiarioLoaded = true;
                }
            } catch (_) {
                return;
            }
        }

        const byId = new Map(state.bestiario.map(c => [c.id, c]));
        let synced = 0;
        for (const token of bestiaryTokens) {
            const criatura = byId.get(token.fichaId);
            if (!criatura) continue;
            // Recompõe o token com base nos dados atuais da criatura,
            // preservando posição/rotação/PV-PM atuais (estado de combate).
            const fresh = montarTokenCriatura(criatura);
            token.name = fresh.nome || token.name;
            token.tipo = fresh.tipo;
            token.tamanho = fresh.tamanho;
            token.deslocamento = fresh.deslocamento;
            token.nd = fresh.nd;
            token.iniciativa = fresh.iniciativa ?? criatura.iniciativa ?? token.iniciativa;
            token.bioma = fresh.bioma;
            token.papelTatico = fresh.papelTatico;
            token.defesa = fresh.defesa;
            token.pvMax = fresh.pvMax ?? token.pvMax;
            token.pmMax = fresh.pmMax ?? token.pmMax;
            // Re-cap PV/PM atuais ao novo máximo, sem zerá-los à toa
            if (typeof token.pvMax === 'number' && typeof token.pvAtual === 'number') {
                token.pvAtual = Math.min(token.pvAtual, token.pvMax);
            }
            if (typeof token.pmMax === 'number' && typeof token.pmAtual === 'number') {
                token.pmAtual = Math.min(token.pmAtual, token.pmMax);
            }
            token.ataquesPrincipais = fresh.ataquesPrincipais || fresh.ataques || [];
            token.habilidadesPrincipais = fresh.habilidadesPrincipais || [];
            token.actions = buildActionsFromBestiaryToken(fresh);
            // Saves explícitos do bestiário (Pindorama)
            token.fortitude = criatura.fortitude ?? null;
            token.reflexos = criatura.reflexos ?? null;
            token.vontade = criatura.vontade ?? null;
            // Atributos como fallback (para criaturas que não têm save explícito)
            const atributosCriatura = parseAtributosCriatura(criatura.atributos);
            token.forca = atributosCriatura.forca ?? token.forca;
            token.destreza = atributosCriatura.destreza ?? token.destreza;
            token.constituicao = atributosCriatura.constituicao ?? token.constituicao;
            token.inteligencia = atributosCriatura.inteligencia ?? token.inteligencia;
            token.sabedoria = atributosCriatura.sabedoria ?? token.sabedoria;
            token.carisma = atributosCriatura.carisma ?? token.carisma;
            const novaImg = fresh.imagem ? resolveImage(fresh.imagem) : null;
            if (novaImg) {
                token.tokenImage = novaImg;
                token.fotoImage = novaImg;
            }
            // Preserva ajuste customizado pelo usuário no campo de batalha;
            // só atualiza a partir do bestiário se ele ainda não tiver sido tocado aqui.
            if (!token.tokenImageAdjustCustom) {
                token.tokenImageAdjust = parseTokenAdjustment(fresh.tokenImagemAjuste || fresh.imagemAjuste);
            }
            synced++;
        }

        if (synced > 0) {
            renderTokens();
            saveState();
        }
    }

    async function syncFichaTokensFromServer() {
        const fichaTokens = state.tokens.filter(token => token.fichaId && token.source !== 'bestiario');
        if (!fichaTokens.length) return;

        let synced = 0;
        for (const token of fichaTokens) {
            try {
                const resp = await fetch('buscar-ficha.php?id=' + encodeURIComponent(token.fichaId), {
                    credentials: 'same-origin',
                    cache: 'no-store'
                });
                if (!resp.ok) continue;
                const data = await resp.json();
                const ficha = data && data.success ? data.ficha : null;
                if (!ficha) continue;

                const nextFoto = ficha.personagem_imagem ? resolveImage(ficha.personagem_imagem) : null;
                const nextTokenRaw = ficha.personagem_token_imagem || null;
                const nextToken = nextTokenRaw ? resolveImage(nextTokenRaw) : null;
                token.fotoImage = nextFoto;
                token.tokenImage = nextToken || nextFoto;
                token.tokenImageAdjust = nextTokenRaw
                    ? parseTokenAdjustment(ficha.personagem_token_imagem_ajuste)
                    : parseImageAdjustment(ficha.personagem_imagem_ajuste);
                token.name = ficha.personagem || token.name;
                // Atributos (para fallback de save)
                token.forca = ficha.forca;
                token.destreza = ficha.destreza;
                token.constituicao = ficha.constituicao;
                token.inteligencia = ficha.inteligencia;
                token.sabedoria = ficha.sabedoria;
                token.carisma = ficha.carisma;
                token.nivel = parseResource(ficha.nivel);
                token.iniciativa = ficha.iniciativa_total ?? ficha.iniciativa ?? token.iniciativa;
                if (ficha.defesa_total !== undefined) token.defesa = ficha.defesa_total;
                const pvMax = parseResource(ficha.pv_total ?? ficha.pvMax);
                const pmMax = parseResource(ficha.pm_total ?? ficha.pmMax);
                if (pvMax !== null) token.pvMax = pvMax;
                if (pmMax !== null) token.pmMax = pmMax;
                if (token.bar1Attribute === 'pv' || token.pvAtual === null || token.pvAtual === undefined) {
                    const pvAtual = parseResource(ficha.pv_atuais ?? ficha.pvAtual);
                    if (pvAtual !== null) token.pvAtual = clamp(pvAtual, 0, token.pvMax || pvAtual);
                }
                if (token.bar2Attribute === 'pm' || token.pmAtual === null || token.pmAtual === undefined) {
                    const pmAtual = parseResource(ficha.pm_atuais ?? ficha.pmAtual);
                    if (pmAtual !== null) token.pmAtual = clamp(pmAtual, 0, token.pmMax || pmAtual);
                }
                synced++;
            } catch (_) {
                // Mantém o token como está se a ficha não puder ser sincronizada.
            }
        }

        if (synced > 0) {
            renderTokens();
            saveState();
        }
    }

    function addTokenFromBestiaryToken(token) {
        const tokenSrc = token.tokenImagem || token.imagem || null;
        const tokenAjuste = parseTokenAdjustment(token.tokenImagemAjuste || token.imagemAjuste);
        addTokenFromFicha({
            id: token.id,
            source: 'bestiario',
            personagem: token.nome || 'Criatura',
            personagem_imagem: tokenSrc,
            personagem_imagem_ajuste: tokenAjuste,
            personagem_token_imagem: tokenSrc,
            personagem_token_imagem_ajuste: tokenAjuste,
            tamanho: token.tamanho,
            deslocamento: token.deslocamento,
            nd: token.nd,
            tipo: token.tipo,
            pvAtual: token.pvAtual ?? token.pvAtuais ?? token.pvMax,
            pvMax: token.pvMax,
            pmAtual: token.pmAtual ?? token.pmAtuais ?? token.pmMax,
            pmMax: token.pmMax,
            defesa: token.defesa,
            iniciativa: token.iniciativa,
            bioma: token.bioma,
            papelTatico: token.papelTatico,
            ataquesPrincipais: token.ataques || token.ataquesPrincipais || [],
            habilidadesPrincipais: token.habilidadesPrincipais || [],
            actions: buildActionsFromBestiaryToken(token)
        });
    }

    function montarTokenCriatura(criatura) {
        const token = criatura.token || {};
        const imagemEfetiva = criatura.tokenImagem
            || token.tokenImagem
            || token.imagem
            || criatura.imagem
            || '';
        const ajusteEfetivo = criatura.tokenImagemAjuste
            ?? token.tokenImagemAjuste
            ?? token.imagemAjuste
            ?? null;
        return Object.assign({}, token, {
            id: token.id || criatura.id,
            nome: token.nome || criatura.nome,
            nd: token.nd ?? criatura.nd,
            tipo: token.tipo || criatura.tipo,
            tamanho: token.tamanho || criatura.tamanho,
            imagem: imagemEfetiva,
            tokenImagem: imagemEfetiva,
            imagemAjuste: ajusteEfetivo,
            tokenImagemAjuste: ajusteEfetivo,
            pvAtual: token.pvAtual ?? token.pvAtuais ?? criatura.pvAtual ?? criatura.pvAtuais ?? criatura.pvMax,
            pvMax: token.pvMax ?? criatura.pvMax,
            pmAtual: token.pmAtual ?? token.pmAtuais ?? criatura.pmAtual ?? criatura.pmAtuais ?? criatura.pmMax,
            pmMax: token.pmMax ?? criatura.pmMax,
            defesa: token.defesa ?? criatura.defesa,
            iniciativa: token.iniciativa ?? criatura.iniciativa,
            deslocamento: token.deslocamento || criatura.deslocamento,
            ataques: token.ataques || token.ataquesPrincipais || criatura.ataques || [],
            ataquesPrincipais: token.ataquesPrincipais || token.ataques || criatura.ataques || [],
            habilidadesPrincipais: token.habilidadesPrincipais
                || (criatura.habilidades || []).slice(0, 5).map(h => String(h).split('.')[0]),
            bioma: token.bioma || criatura.bioma,
            papelTatico: token.papelTatico || criatura.papelTatico
        });
    }

    function addGenericToken() {
        const name = prompt('Nome do token:', 'Token');
        if (name === null) return;
        addTokenFromFicha({
            id: null,
            personagem: name.trim() || 'Token',
            personagem_imagem: null
        });
    }

    function sizeCellsFromCategory(category) {
        const key = normalizeText(category || 'Médio');
        return SIZE_BY_CATEGORY[key] || 1;
    }

    function occupiedKey(col, row) {
        return col + ',' + row;
    }

    function buildOccupiedCells(exceptId = null) {
        const occupied = new Set();
        for (const token of state.tokens) {
            if (token.id === exceptId) continue;
            const width = tokenWidthCells(token);
            const height = tokenHeightCells(token);
            for (let row = token.row; row < token.row + height; row++) {
                for (let col = token.col; col < token.col + width; col++) {
                    occupied.add(occupiedKey(col, row));
                }
            }
        }
        return occupied;
    }

    function canPlaceTokenAt(token, col, row, occupied) {
        const width = tokenWidthCells(token);
        const height = tokenHeightCells(token);
        if (col < 0 || row < 0 || col + width > state.cols || row + height > state.rows) return false;
        for (let y = row; y < row + height; y++) {
            for (let x = col; x < col + width; x++) {
                if (occupied.has(occupiedKey(x, y))) return false;
            }
        }
        return true;
    }

    function buildActionsFromFicha(ficha) {
        const ataques = normalizeActionItems(parseJsonSafe(ficha.ataques, ficha.ataquesPrincipais || []), 'ataque');
        const magias = normalizeMagicItems(parseJsonSafe(ficha.habilidades_magias, ficha.magias || []));
        const poderes = normalizePowerItems(ficha.poderes || []);
        const equipamentos = normalizeActionItems(parseJsonSafe(ficha.equipamentos, []), 'equipamento');
        const baseManobras = [
            ...ataques,
            ...normalizeActionItems(ficha.habilidadesPrincipais || [], 'habilidade'),
            ...poderes
        ];

        return pruneActionGroups({
            ataques,
            magias,
            poderes,
            equipamentos,
            manobras: extractManeuvers(baseManobras)
        });
    }

    function buildActionsFromBestiaryToken(token) {
        const ataques = normalizeActionItems(token.ataques || token.ataquesPrincipais || [], 'ataque');
        const poderes = normalizeActionItems(token.habilidadesPrincipais || [], 'habilidade');
        return pruneActionGroups({
            ataques,
            magias: [],
            poderes,
            equipamentos: [],
            manobras: extractManeuvers([...ataques, ...poderes])
        });
    }

    function getTokenActionGroups(token) {
        return pruneActionGroups(token.actions || {});
    }

    function pruneActionGroups(groups) {
        return Object.keys(ACTION_LABELS).reduce((acc, key) => {
            acc[key] = Array.isArray(groups[key]) ? groups[key].filter(Boolean) : [];
            return acc;
        }, {});
    }

    function parseJsonSafe(value, fallback = []) {
        if (Array.isArray(value)) return value;
        if (value && typeof value === 'object') return [value];
        if (typeof value !== 'string' || !value.trim()) return fallback;
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function normalizeActionItems(items, fallbackType) {
        if (!Array.isArray(items)) return [];
        return items.map(item => normalizeActionItem(item, fallbackType)).filter(Boolean);
    }

    function normalizeMagicItems(items) {
        if (!Array.isArray(items)) return [];
        return items.map(item => {
            if (typeof item === 'string') {
                return { nome: item, tipo: 'magia' };
            }
            if (!item || typeof item !== 'object') return null;
            return {
                nome: item.nome || item.id || 'Magia',
                tipo: 'magia',
                origem: item.origem || '',
                detalhe: item.circulo ? `${item.circulo}º círculo` : ''
            };
        }).filter(Boolean);
    }

    function normalizePowerItems(items) {
        if (!Array.isArray(items)) return [];
        return items.map(item => {
            if (typeof item === 'string') {
                return { nome: item, tipo: 'poder' };
            }
            if (!item || typeof item !== 'object') return null;
            return {
                nome: item.nome || item.id || item.poder_id || 'Poder',
                tipo: item.tipo || 'poder',
                origem: item.classe || item.classe_id || item.categoria || '',
                detalhe: item.tipo ? `Tipo: ${item.tipo}` : ''
            };
        }).filter(Boolean);
    }

    function normalizeActionItem(item, fallbackType) {
        if (typeof item === 'string') {
            const trimmed = item.trim();
            if (!trimmed) return null;
            const alcance = inferActionReach(trimmed);
            const quantidadeAtaques = parseAttackCount({}, trimmed);
            const bonusAtaque = parseAttackBonus({ nome: trimmed });
            const danoFormula = parseDamageFormula(trimmed);
            const lower = trimmed.toLowerCase();
            const tipoBonus = (lower.includes('automaticamente') || lower.includes('acerto automatico') || lower.includes('sem rolagem')) ? 'automatico' : 'rolagem';
            const saveTipo = inferSaveTipoFromText(trimmed);
            const saveCD = inferSaveCDFromText(trimmed);
            return {
                nome: trimmed,
                tipo: fallbackType,
                alcance,
                quantidadeAtaques,
                bonusAtaque,
                danoFormula,
                tipoBonus,
                saveTipo,
                saveCD,
                detalhe: alcance ? `Alcance: ${alcance}` : ''
            };
        }
        if (!item || typeof item !== 'object') return null;

        const nome = item.nome || item.name || item.arma || item.item || item.id || fallbackType;
        const alcance = item.alcance || inferActionReach(`${nome || ''} ${item.descricao || ''}`);
        const quantidadeAtaques = parseAttackCount(item, nome);
        const bonusAtaque = parseAttackBonus(item);
        const danoFormula = item.danoFormula || parseDamageFormula(item.dano || item.descricao || '');
        const tipoBonus = (String(item.tipoBonus || '').toLowerCase() === 'automatico' || item.acertoAutomatico === true)
            ? 'automatico'
            : 'rolagem';
        const saveTipo = String(item.saveTipo || '').toLowerCase() || inferSaveTipoFromText(item.descricao || '');
        const saveCD = String(item.saveCD || item.cd || '') || inferSaveCDFromText(item.descricao || '');
        const partes = [];
        [
            ['Teste', tipoBonus === 'automatico' ? 'Acerto automático' : (item.teste || item.ataque || item.bonus)],
            ['Dano', item.dano],
            ['Tipo de dano', item.tipoDano || item.tipo_dano],
            ['Crítico', item.critico],
            ['Alcance', alcance],
            ['Qtd.', item.quantidade],
            ['Espaços', item.espacos],
            ['Tipo', item.tipo],
            ['Salvação', saveTipo ? `${saveTipo} CD ${saveCD || '?'}` : ''],
            ['Descrição', item.descricao]
        ].forEach(([label, value]) => {
            if (value !== undefined && value !== null && String(value).trim() !== '') {
                partes.push(`${label}: ${value}`);
            }
        });

        return {
            nome: String(nome || fallbackType),
            tipo: fallbackType,
            alcance,
            quantidadeAtaques,
            bonusAtaque,
            danoFormula,
            tipoBonus,
            saveTipo,
            saveCD,
            dano: item.dano || danoFormula,
            tipoDano: item.tipoDano || item.tipo_dano || '',
            detalhe: partes.join(' | ')
        };
    }

    function inferSaveTipoFromText(texto) {
        const lower = String(texto || '').toLowerCase();
        if (lower.includes('fortitude')) return 'fortitude';
        if (lower.includes('reflexo')) return 'reflexos';
        if (lower.includes('vontade')) return 'vontade';
        return '';
    }

    function inferSaveCDFromText(texto) {
        const m = String(texto || '').match(/cd\s*(\d+)/i);
        return m ? m[1] : '';
    }

    function inferActionReach(text) {
        const normalized = normalizeText(text);
        if (normalized.includes('corpo a corpo')) return 'corpo a corpo';
        if (normalized.includes('curto') || normalized.includes('9m') || normalized.includes('6 quadr')) return 'curto';
        if (normalized.includes('longo') || normalized.includes('90m') || normalized.includes('60 quadr')) return 'longo';
        if (normalized.includes('gavioes espinhosos')) return 'corpo a corpo';
        return '';
    }

    function extractManeuvers(items) {
        const catalog = [
            'agarrar',
            'derrubar',
            'desarmar',
            'empurrar',
            'quebrar',
            'atropelar',
            'fintar'
        ];
        const found = new Map();
        for (const item of items) {
            const text = normalizeText(`${item.nome || ''} ${item.detalhe || ''} ${item.descricao || ''}`);
            for (const manobra of catalog) {
                if (text.includes(normalizeText(manobra))) {
                    found.set(manobra, {
                        nome: capitalizePt(manobra),
                        tipo: 'manobra',
                        detalhe: item.nome ? `Presente em: ${item.nome}` : ''
                    });
                }
            }
        }
        return Array.from(found.values());
    }

    function capitalizePt(value) {
        const text = String(value || '');
        return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
    }

    function resolveImage(path) {
        if (!path) return null;
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
            return path;
        }
        return path; // caminho relativo já serve (mesma origem)
    }

    function parseImageAdjustment(value) {
        if (!value) return { scale: 1, x: 0, y: 0 };
        if (typeof value === 'object') return normalizeImageAdjustment(value.token || value);
        try {
            const parsed = JSON.parse(value);
            return normalizeImageAdjustment(parsed.token || parsed);
        } catch (_) {
            return { scale: 1, x: 0, y: 0 };
        }
    }

    // Para a imagem de token DEDICADA (campo personagem_token_imagem_ajuste),
    // o valor é um objeto plano {scale, x, y} sem nesting foto/token.
    function parseTokenAdjustment(value) {
        if (!value) return { scale: 1, x: 0, y: 0 };
        if (typeof value === 'object') return normalizeImageAdjustment(value.token || value);
        try {
            const parsed = JSON.parse(value);
            return normalizeImageAdjustment(parsed.token || parsed);
        } catch (_) {
            return { scale: 1, x: 0, y: 0 };
        }
    }

    function normalizeImageAdjustment(value) {
        return {
            scale: Math.min(6, Math.max(0.2, Number(value.scale) || 1)),
            x: Math.min(220, Math.max(-220, Number(value.x) || 0)),
            y: Math.min(220, Math.max(-220, Number(value.y) || 0))
        };
    }

    function applyTokenImageAdjustment(img, adjustment) {
        const ajuste = parseTokenAdjustment(adjustment);
        img.style.setProperty('--token-img-scale', String(ajuste.scale));
        img.style.setProperty('--token-img-x', `${ajuste.x}%`);
        img.style.setProperty('--token-img-y', `${ajuste.y}%`);
        img.style.setProperty('--saved-token-scale', String(ajuste.scale));
        img.style.setProperty('--saved-token-x', `${ajuste.x}%`);
        img.style.setProperty('--saved-token-y', `${ajuste.y}%`);
        // Aplica o transform inline também, para não depender das variáveis CSS
        // (alguns estados antigos no localStorage não tinham essas variáveis populadas).
        img.style.transform = `translate(${ajuste.x}%, ${ajuste.y}%) scale(${ajuste.scale})`;
        img.style.transformOrigin = 'center';
        if (window.__cbDebugTokenImg) {
            console.log('[cb] applyTokenImageAdjustment', { src: img.getAttribute('src'), input: adjustment, applied: ajuste });
        }
    }

    function applyFichaSalvaTokenAdjustment(img, adjustment) {
        const ajuste = parseImageAdjustment(adjustment);
        img.style.setProperty('--saved-token-scale', String(ajuste.scale));
        img.style.setProperty('--saved-token-x', `${ajuste.x}%`);
        img.style.setProperty('--saved-token-y', `${ajuste.y}%`);
        img.style.transform = `translate(${ajuste.x}%, ${ajuste.y}%) scale(${ajuste.scale})`;
        img.style.transformOrigin = 'center';
    }

    function parseResource(value) {
        if (value === undefined || value === null || value === '') return null;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : null;
    }

    function numberOrNull(value) {
        const parsed = parseResource(value);
        return parsed === null ? null : parsed;
    }

    function clampResource(value, max) {
        const parsedMax = Math.max(0, Math.round(Number(max) || 0));
        const parsedValue = parseResource(value);
        if (parsedValue === null) return parsedMax;
        return clamp(parsedValue, 0, parsedMax);
    }

    // ----------------------------------------------------------------
    // Modal de fichas e criaturas
    // ----------------------------------------------------------------

    async function openModal() {
        state.modalMode = 'fichas';
        els.modalTitle.textContent = 'Adicionar personagem';
        els.modalSearch.placeholder = 'Buscar por nome ou jogador...';
        els.bestiaryFilters.hidden = true;
        els.modal.hidden = false;
        els.modalSearch.value = '';
        els.modalSearch.focus();
        els.fichaList.innerHTML = '<li class="cb-ficha-empty">Carregando fichas...</li>';
        try {
            const resp = await fetch('listar-fichas.php', {
                credentials: 'same-origin',
                cache: 'no-store'
            });
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const data = await resp.json();
            state.fichas = Array.isArray(data) ? data : [];
            state.fichasLoaded = true;
        } catch (e) {
            els.fichaList.innerHTML = '<li class="cb-ficha-empty">Não foi possível carregar fichas.</li>';
            return;
        }
        renderFichaList(state.fichas);
    }

    async function openBestiaryModal() {
        state.modalMode = 'bestiario';
        els.modalTitle.textContent = 'Adicionar criatura';
        els.modalSearch.placeholder = 'Buscar criatura por nome, tipo ou bioma...';
        els.bestiaryFilters.hidden = false;
        els.modal.hidden = false;
        els.modalSearch.value = '';
        els.modalSearch.focus();
        if (!state.bestiarioLoaded) {
            els.fichaList.innerHTML = '<li class="cb-ficha-empty">Carregando criaturas...</li>';
            try {
                const resp = await fetch('data/bestiario.json', { credentials: 'same-origin' });
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                const data = await resp.json();
                loadBestiaryData(data);
                state.bestiarioLoaded = true;
            } catch (e) {
                els.fichaList.innerHTML = '<li class="cb-ficha-empty">Não foi possível carregar o bestiário.</li>';
                return;
            }
        }
        resetBestiaryFilterFields();
        renderBestiaryList(state.bestiario);
    }

    function closeModal() {
        els.modal.hidden = true;
    }

    function loadBestiaryData(data) {
        const byId = new Map();
        const baseCreatures = Array.isArray(data.criaturas) ? data.criaturas : [];
        for (const criatura of baseCreatures) {
            if (criatura && criatura.id) byId.set(criatura.id, criatura);
        }

        try {
            const local = JSON.parse(localStorage.getItem(BESTIARIO_STORAGE_KEY) || '[]');
            if (Array.isArray(local)) {
                for (const criatura of local) {
                    if (criatura && criatura.id) byId.set(criatura.id, criatura);
                }
            }
        } catch (e) {
            // Bestiário local inválido: mantém apenas a base do projeto.
        }

        state.bestiario = Array.from(byId.values());
        state.bestiarioFiltros = data.filtros || {};
        fillBestiaryFilters();
    }

    function fillBestiaryFilters() {
        fillSelect(els.bestiaryNd, buildNdOptions(), 'ND');
        fillSelect(els.bestiaryTipo, state.bestiarioFiltros.tipos || [], 'Tipo');
        fillSelect(els.bestiaryTamanho, state.bestiarioFiltros.tamanhos || [], 'Tamanho');
        fillSelect(els.bestiaryBioma, state.bestiarioFiltros.biomas || [], 'Bioma');
        fillSelect(els.bestiaryPapel, state.bestiarioFiltros.papeisTaticos || [], 'Papel');
    }

    function buildNdOptions() {
        return Array.from(new Set(state.bestiario.map(c => c.nd).filter(v => v !== undefined && v !== null)))
            .sort((a, b) => Number(a) - Number(b))
            .map(String);
    }

    function fillSelect(select, values, placeholder) {
        select.innerHTML = '';
        const first = document.createElement('option');
        first.value = '';
        first.textContent = placeholder;
        select.appendChild(first);
        for (const value of values) {
            const opt = document.createElement('option');
            opt.value = String(value);
            opt.textContent = String(value);
            select.appendChild(opt);
        }
    }

    function resetBestiaryFilterFields() {
        els.bestiaryNd.value = '';
        els.bestiaryTipo.value = '';
        els.bestiaryTamanho.value = '';
        els.bestiaryBioma.value = '';
        els.bestiaryPapel.value = '';
    }

    function renderFichaList(items) {
        els.fichaList.innerHTML = '';
        if (!items.length) {
            els.fichaList.innerHTML = '<li class="cb-ficha-empty">Nenhuma ficha salva.</li>';
            return;
        }
        const frag = document.createDocumentFragment();
        for (const f of items) {
            const li = document.createElement('li');
            li.dataset.fichaId = f.id;

            const thumb = document.createElement('div');
            thumb.className = 'cb-ficha-thumb';
            const thumbSrcRaw = f.personagem_token_imagem || f.personagem_imagem;
            if (thumbSrcRaw) {
                const img = document.createElement('img');
                img.src = resolveImage(thumbSrcRaw);
                img.alt = f.personagem || 'Personagem';
                img.loading = 'lazy';
                img.onerror = () => {
                    img.remove();
                    thumb.textContent = getTokenInitials(f.personagem);
                };
                if (f.personagem_token_imagem) {
                    applyFichaSalvaTokenAdjustment(img, parseTokenAdjustment(f.personagem_token_imagem_ajuste));
                } else {
                    applyFichaSalvaTokenAdjustment(img, f.personagem_imagem_ajuste);
                }
                thumb.appendChild(img);
            } else {
                thumb.textContent = getTokenInitials(f.personagem);
            }
            atualizarThumbFichaCompleta(f, thumb);
            li.appendChild(thumb);

            const info = document.createElement('div');
            info.className = 'cb-ficha-info';
            const nm = document.createElement('div');
            nm.className = 'cb-ficha-name';
            nm.textContent = f.personagem || 'Sem nome';
            info.appendChild(nm);
            const meta = document.createElement('div');
            meta.className = 'cb-ficha-meta';
            const partes = [];
            if (f.classe) partes.push(f.classe);
            if (f.nivel) partes.push('Nv ' + f.nivel);
            if (f.participante) partes.push(f.participante);
            meta.textContent = partes.join(' • ') || '—';
            info.appendChild(meta);
            li.appendChild(info);

            li.addEventListener('click', () => onFichaPicked(f));
            frag.appendChild(li);
        }
        els.fichaList.appendChild(frag);
    }

    function renderBestiaryList(items) {
        els.fichaList.innerHTML = '';
        if (!items.length) {
            els.fichaList.innerHTML = '<li class="cb-ficha-empty">Nenhuma criatura encontrada.</li>';
            return;
        }

        const frag = document.createDocumentFragment();
        for (const criatura of items) {
            const token = montarTokenCriatura(criatura);
            const li = document.createElement('li');
            li.dataset.criaturaId = criatura.id;

            const thumb = document.createElement('div');
            thumb.className = 'cb-ficha-thumb';
            if (token.imagem) {
                const img = document.createElement('img');
                img.src = resolveImage(token.imagem);
                img.alt = criatura.nome || 'Criatura';
                img.loading = 'lazy';
                img.onerror = () => {
                    img.remove();
                    thumb.textContent = getTokenInitials(criatura.nome);
                };
                applyFichaSalvaTokenAdjustment(img, token.imagemAjuste || token.tokenImagemAjuste);
                thumb.appendChild(img);
            } else {
                thumb.textContent = getTokenInitials(criatura.nome);
            }
            li.appendChild(thumb);

            const info = document.createElement('div');
            info.className = 'cb-ficha-info';

            const nm = document.createElement('div');
            nm.className = 'cb-ficha-name';
            nm.textContent = criatura.nome || 'Criatura sem nome';
            info.appendChild(nm);

            const meta = document.createElement('div');
            meta.className = 'cb-ficha-meta';
            meta.innerHTML = [
                token.nd !== undefined && token.nd !== null ? `<strong>ND ${escapeHtml(token.nd)}</strong>` : '',
                token.tipo,
                token.tamanho,
                token.bioma,
                token.papelTatico
            ].filter(Boolean).map(escapeHtmlExceptStrong).join(' • ') || '—';
            info.appendChild(meta);

            li.appendChild(info);
            li.addEventListener('click', () => onBestiaryPicked(criatura));
            frag.appendChild(li);
        }
        els.fichaList.appendChild(frag);
    }

    async function onFichaPicked(fichaListItem) {
        // Buscar ficha completa para obter a imagem (vem em data.ficha)
        try {
            const resp = await fetch('buscar-ficha.php?id=' + encodeURIComponent(fichaListItem.id), {
                credentials: 'same-origin',
                cache: 'no-store'
            });
            const data = await resp.json();
            const ficha = (data && data.success !== false) ? (data.ficha || data) : null;
            if (ficha) {
                const tamanhoInferido = await inferFichaSize(ficha);
                addTokenFromFicha({
                    ...ficha,
                    id: ficha.id || fichaListItem.id,
                    personagem: ficha.personagem || fichaListItem.personagem,
                    personagem_imagem: ficha.personagem_imagem || fichaListItem.personagem_imagem || null,
                    personagem_imagem_ajuste: ficha.personagem_imagem_ajuste || fichaListItem.personagem_imagem_ajuste || null,
                    personagem_token_imagem: ficha.personagem_token_imagem || fichaListItem.personagem_token_imagem || null,
                    personagem_token_imagem_ajuste: ficha.personagem_token_imagem_ajuste || fichaListItem.personagem_token_imagem_ajuste || null,
                    tamanho: ficha.tamanho || ficha.categoria_tamanho || tamanhoInferido || 'Médio',
                    pv_total: ficha.pv_total,
                    pv_atuais: ficha.pv_atuais,
                    pm_total: ficha.pm_total,
                    pm_atuais: ficha.pm_atuais,
                    defesa: ficha.defesa_total,
                    poderes: ficha.poderes || []
                });
            } else {
                addTokenFromFicha(fichaListItem);
            }
        } catch (e) {
            addTokenFromFicha(fichaListItem);
        }
        closeModal();
    }

    async function buscarFichaCompleta(id) {
        if (!id) return null;
        const resp = await fetch('buscar-ficha.php?id=' + encodeURIComponent(id), {
            credentials: 'same-origin',
            cache: 'no-store'
        });
        if (!resp.ok) return null;
        const data = await resp.json();
        return data && data.success !== false ? (data.ficha || data) : null;
    }

    async function atualizarThumbFichaCompleta(fichaResumo, thumb) {
        try {
            const ficha = await buscarFichaCompleta(fichaResumo.id);
            if (!ficha || !thumb.isConnected) return;
            const srcRaw = ficha.personagem_token_imagem || ficha.personagem_imagem;
            if (!srcRaw) return;
            thumb.innerHTML = '';
            const img = document.createElement('img');
            img.src = resolveImage(srcRaw);
            img.alt = ficha.personagem || fichaResumo.personagem || 'Personagem';
            img.loading = 'lazy';
            img.onerror = () => {
                img.remove();
                thumb.textContent = getTokenInitials(ficha.personagem || fichaResumo.personagem);
            };
            if (ficha.personagem_token_imagem) {
                applyFichaSalvaTokenAdjustment(img, parseTokenAdjustment(ficha.personagem_token_imagem_ajuste));
            } else {
                applyFichaSalvaTokenAdjustment(img, ficha.personagem_imagem_ajuste);
            }
            thumb.appendChild(img);
        } catch (_) {
            // Mantém a miniatura do resumo se a ficha completa falhar.
        }
    }

    async function inferFichaSize(ficha) {
        if (ficha.tamanho || ficha.categoria_tamanho) {
            return ficha.tamanho || ficha.categoria_tamanho;
        }
        const byAncestralidade = await getAncestralidadeSizes();
        const key = normalizeText(ficha.ancestralidade || '');
        return byAncestralidade[key] || null;
    }

    async function getAncestralidadeSizes() {
        if (state.ancestralidadeSizesLoaded) return state.ancestralidadeSizes;
        state.ancestralidadeSizesLoaded = true;

        try {
            const resp = await fetch('data/ancestralidades.json', { credentials: 'same-origin' });
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const data = await resp.json();
            const lista = Array.isArray(data) ? data : (data.ancestralidades || []);

            for (const ancestralidade of lista) {
                const tamanho = inferSizeFromAncestralidade(ancestralidade);
                if (!tamanho) continue;
                [ancestralidade.id, ancestralidade.nome].filter(Boolean).forEach(value => {
                    state.ancestralidadeSizes[normalizeText(value)] = tamanho;
                });
            }
        } catch (e) {
            state.ancestralidadeSizes = {};
        }

        return state.ancestralidadeSizes;
    }

    function inferSizeFromAncestralidade(ancestralidade) {
        const tamanhos = [];
        for (const traco of (ancestralidade.tracos || [])) {
            const tamanho = inferSizeFromText(traco.descricao || '');
            if (tamanho) tamanhos.push(tamanho);
        }
        return tamanhos.sort((a, b) => sizeCellsFromCategory(b) - sizeCellsFromCategory(a))[0] || null;
    }

    function inferSizeFromText(text) {
        const match = String(text || '').match(/tamanho\s+(?:é|e)\s+(Minúsculo|Minusculo|Pequeno|Médio|Medio|Grande|Enorme|Colossal)/i);
        return match ? normalizeSizeLabel(match[1]) : null;
    }

    function normalizeSizeLabel(value) {
        const key = normalizeText(value);
        const labels = {
            minusculo: 'Minúsculo',
            pequeno: 'Pequeno',
            medio: 'Médio',
            grande: 'Grande',
            enorme: 'Enorme',
            colossal: 'Colossal'
        };
        return labels[key] || value;
    }

    function filterFichas(term) {
        const q = term.trim().toLowerCase();
        if (!q) return renderFichaList(state.fichas);
        const filtered = state.fichas.filter(f => {
            const hay = [
                f.personagem, f.participante, f.classe, String(f.nivel || '')
            ].filter(Boolean).join(' ').toLowerCase();
            return hay.includes(q);
        });
        renderFichaList(filtered);
    }

    function filterBestiary() {
        const q = normalizeText(els.modalSearch.value);
        const nd = els.bestiaryNd.value;
        const tipo = normalizeText(els.bestiaryTipo.value);
        const tamanho = normalizeText(els.bestiaryTamanho.value);
        const bioma = normalizeText(els.bestiaryBioma.value);
        const papel = normalizeText(els.bestiaryPapel.value);

        const filtered = state.bestiario.filter(criatura => {
            const token = montarTokenCriatura(criatura);
            const hay = normalizeText([
                criatura.nome,
                criatura.nomeAlternativo,
                criatura.fraseImpacto,
                token.tipo,
                token.tamanho,
                token.bioma,
                token.papelTatico
            ].filter(Boolean).join(' '));

            if (q && !hay.includes(q)) return false;
            if (nd && String(token.nd) !== nd) return false;
            if (tipo && normalizeText(token.tipo) !== tipo) return false;
            if (tamanho && normalizeText(token.tamanho) !== tamanho) return false;
            if (bioma && normalizeText(token.bioma) !== bioma) return false;
            if (papel && !normalizeText(token.papelTatico).includes(papel)) return false;
            return true;
        });

        renderBestiaryList(filtered);
    }

    function onBestiaryPicked(criatura) {
        const token = montarTokenCriatura(criatura);
        addTokenFromBestiaryToken(token);
        closeModal();
    }

    function consumePendingBestiaryToken() {
        try {
            const raw = localStorage.getItem(BESTIARIO_TOKEN_KEY);
            if (!raw) return;
            const token = JSON.parse(raw);
            if (token && token.id && token.nome) {
                addTokenFromBestiaryToken(token);
            }
            localStorage.removeItem(BESTIARIO_TOKEN_KEY);
        } catch (e) {
            localStorage.removeItem(BESTIARIO_TOKEN_KEY);
        }
    }

    function adjustTokenResource(tokenId, resource) {
        const token = state.tokens.find(t => t.id === tokenId);
        if (!token) return;
        const isPv = resource === 'pv';
        const maxKey = isPv ? 'pvMax' : 'pmMax';
        const currentKey = isPv ? 'pvAtual' : 'pmAtual';
        const max = numberOrNull(token[maxKey]);
        if (max === null || max <= 0) return;

        const current = clampResource(token[currentKey], max);
        const label = isPv ? 'PV atuais' : 'PM atuais';
        const raw = prompt(`${label} de ${token.name || 'token'}:`, String(current));
        if (raw === null) return;

        const next = parseResource(raw);
        if (next === null) return;
        token[currentKey] = clamp(next, 0, max);
        renderTokens();
        selectToken(token.id);
        addLog({ title: `${isPv ? 'PV' : 'PM'} ajustado`, detail: `${token.name || 'Token'}: ${token[currentKey]}/${max}` });
        saveState();
    }

    function openTokenActionPanel(tokenId, actionType = null, opts = null) {
        const token = state.tokens.find(t => t.id === tokenId);
        if (!token) return;
        const attackMode = !!(opts && opts.attackMode);
        const groups = getTokenActionGroups(token);
        const types = actionType
            ? [actionType]
            : Object.keys(ACTION_LABELS).filter(type => groups[type] && groups[type].length);
        const isOnlyAttacks = attackMode || (types.length === 1 && types[0] === 'ataques');
        const tituloBase = isOnlyAttacks ? 'Ataques' : 'Ações';
        els.actionTitle.textContent = token.name ? `${tituloBase} — ${token.name}` : tituloBase;
        els.actionList.innerHTML = '';

        // Variação visual "ataque" — paleta quente (vinho/âmbar) sobre a roxa/dourada.
        els.actionPanel.classList.toggle('is-attack-mode', isOnlyAttacks);

        if (!types.length || (isOnlyAttacks && !(groups.ataques || []).length)) {
            const empty = document.createElement('p');
            empty.className = 'cb-action-empty';
            empty.textContent = isOnlyAttacks
                ? 'Nenhum ataque disponível para este combatente.'
                : 'Nada cadastrado nesta categoria.';
            els.actionList.appendChild(empty);
        } else {
            const frag = document.createDocumentFragment();
            for (const type of types) {
                const section = document.createElement('section');
                section.className = 'cb-action-section';
                if (type === 'ataques') section.classList.add('cb-action-section--ataques');

                const sectionTitle = document.createElement('h3');
                sectionTitle.className = 'cb-action-section-title';
                sectionTitle.textContent = ACTION_LABELS[type] || 'Ações';
                section.appendChild(sectionTitle);

                for (const item of (groups[type] || [])) {
                    section.appendChild(buildActionCard(item, token));
                }
                frag.appendChild(section);
            }
            els.actionList.appendChild(frag);
        }

        // Quando o painel é aberto sem filtro, anexa as 5 categorias
        // canônicas do capítulo "Jogando" (declarativas, registram no log).
        if (!actionType) {
            els.actionList.appendChild(buildSceneActionsSection(token));
        }

        els.actionPanel.hidden = false;
    }

    function buildSceneActionsSection(token) {
        const wrap = document.createElement('section');
        wrap.className = 'cb-action-section cb-scene-actions-section';

        const title = document.createElement('h3');
        title.className = 'cb-action-section-title';
        title.textContent = 'Ações de cena';
        title.title = 'Categorias do capítulo "Jogando". Clicar registra a declaração no log.';
        wrap.appendChild(title);

        for (const cat of SCENE_ACTION_CATEGORIES) {
            const block = document.createElement('div');
            block.className = 'cb-scene-action-block';
            block.dataset.category = cat.key;

            const head = document.createElement('h4');
            head.className = 'cb-scene-action-head';
            head.textContent = cat.label;
            block.appendChild(head);

            if (cat.hint) {
                const hint = document.createElement('p');
                hint.className = 'cb-scene-action-hint';
                hint.textContent = cat.hint;
                block.appendChild(hint);
            }

            const grid = document.createElement('div');
            grid.className = 'cb-scene-action-grid';
            for (const act of cat.actions) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'cb-scene-action-btn';
                btn.textContent = act.label;
                btn.title = act.detail;
                btn.addEventListener('click', () => {
                    addLog({
                        title: cat.label + ' declarada',
                        detail: (token.name || 'Token') + ' — ' + act.label +
                                (act.detail ? ' · ' + act.detail : '')
                    });
                    btn.classList.add('is-just-clicked');
                    setTimeout(() => btn.classList.remove('is-just-clicked'), 600);
                });
                grid.appendChild(btn);
            }
            block.appendChild(grid);
            wrap.appendChild(block);
        }

        return wrap;
    }

    function buildActionCard(item, token) {
        const card = document.createElement('article');
        card.className = 'cb-action-card';
        const attackWithReach = isAttackWithReach(item);

        const header = document.createElement('button');
        header.type = 'button';
        header.className = 'cb-action-card-header';
        header.setAttribute('aria-expanded', 'false');

        const headerMain = document.createElement('div');
        headerMain.className = 'cb-action-card-headmain';

        const title = document.createElement('h4');
        title.textContent = getActionDisplayName(item);
        headerMain.appendChild(title);

        const metaParts = [item.tipo, item.origem].filter(Boolean);
        if (metaParts.length) {
            const meta = document.createElement('span');
            meta.className = 'cb-action-meta';
            meta.textContent = metaParts.join(' • ');
            headerMain.appendChild(meta);
        }

        if (attackWithReach) {
            const summary = document.createElement('div');
            summary.className = 'cb-action-card-summary';
            const alc = item.alcance || 'corpo a corpo';
            const dano = item.dano || item.danoFormula || '—';
            summary.textContent = `${alc} · ${dano}`;
            headerMain.appendChild(summary);
        }

        header.appendChild(headerMain);

        const chevron = document.createElement('span');
        chevron.className = 'cb-action-card-chevron';
        chevron.setAttribute('aria-hidden', 'true');
        chevron.textContent = '▾';
        header.appendChild(chevron);

        card.appendChild(header);

        const body = document.createElement('div');
        body.className = 'cb-action-card-body';
        body.hidden = true;

        if (attackWithReach) {
            body.appendChild(buildAttackFields(item));
        } else if (item.detalhe) {
            const detail = document.createElement('p');
            detail.textContent = item.detalhe;
            body.appendChild(detail);
        }

        card.appendChild(body);

        const collapseSiblings = () => {
            if (!els.actionList) return;
            els.actionList.querySelectorAll('.cb-action-card.is-expanded').forEach(other => {
                if (other === card) return;
                other.classList.remove('is-expanded');
                const otherBody = other.querySelector('.cb-action-card-body');
                const otherHeader = other.querySelector('.cb-action-card-header');
                if (otherBody) otherBody.hidden = true;
                if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
            });
        };

        header.addEventListener('click', () => {
            hideActionPreview();
            collapseSiblings();
            if (attackWithReach) {
                // Expande visualmente, ativa alcance no mapa e fecha o painel.
                body.hidden = false;
                card.classList.add('is-expanded');
                header.setAttribute('aria-expanded', 'true');
                toggleReachPreview(token, item);
                if (isReachPreviewActive(token.id, item)) {
                    closeTokenActionPanel();
                }
                return;
            }
            // Itens sem alcance (descritivos): apenas alterna expand/collapse.
            const willExpand = body.hidden;
            body.hidden = !willExpand;
            card.classList.toggle('is-expanded', willExpand);
            header.setAttribute('aria-expanded', willExpand ? 'true' : 'false');
        });

        if (attackWithReach) {
            attachActionPreviewHandlers(header, card, item);
        }

        return card;
    }

    let _actionPreviewEl = null;
    let _actionPreviewLongPressTimer = null;
    let _actionPreviewSuppressClick = false;

    function ensureActionPreviewEl() {
        if (_actionPreviewEl) return _actionPreviewEl;
        const el = document.createElement('div');
        el.className = 'cb-action-preview';
        el.hidden = true;
        document.body.appendChild(el);
        _actionPreviewEl = el;
        return el;
    }

    function showActionPreview(item, anchorEl) {
        const el = ensureActionPreviewEl();
        el.innerHTML = '';
        const title = document.createElement('div');
        title.className = 'cb-action-preview-title';
        title.textContent = getActionDisplayName(item);
        el.appendChild(title);
        el.appendChild(buildAttackFields(item));

        el.hidden = false;
        const rect = anchorEl.getBoundingClientRect();
        const margin = 10;
        // Render to measure
        el.style.left = '0px';
        el.style.top = '0px';
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        // Prefer left of card; fall back to above
        let left = rect.left - w - margin;
        if (left < 8) left = rect.right + margin;
        if (left + w > window.innerWidth - 8) {
            left = Math.max(8, window.innerWidth - w - 8);
        }
        let top = rect.top;
        if (top + h > window.innerHeight - 8) {
            top = Math.max(8, window.innerHeight - h - 8);
        }
        el.style.left = left + 'px';
        el.style.top = top + 'px';
    }

    function hideActionPreview() {
        if (_actionPreviewEl) _actionPreviewEl.hidden = true;
        if (_actionPreviewLongPressTimer) {
            clearTimeout(_actionPreviewLongPressTimer);
            _actionPreviewLongPressTimer = null;
        }
    }

    function attachActionPreviewHandlers(header, card, item) {
        const shouldShow = () => !card.classList.contains('is-expanded');

        header.addEventListener('mouseenter', () => {
            if (shouldShow()) showActionPreview(item, card);
        });
        header.addEventListener('mouseleave', () => hideActionPreview());
        header.addEventListener('blur', () => hideActionPreview());

        header.addEventListener('touchstart', (ev) => {
            if (!shouldShow()) return;
            if (_actionPreviewLongPressTimer) clearTimeout(_actionPreviewLongPressTimer);
            _actionPreviewLongPressTimer = setTimeout(() => {
                _actionPreviewSuppressClick = true;
                showActionPreview(item, card);
            }, 450);
        }, { passive: true });

        const cancelLongPress = () => {
            if (_actionPreviewLongPressTimer) {
                clearTimeout(_actionPreviewLongPressTimer);
                _actionPreviewLongPressTimer = null;
            }
            hideActionPreview();
        };
        header.addEventListener('touchend', cancelLongPress);
        header.addEventListener('touchcancel', cancelLongPress);
        header.addEventListener('touchmove', cancelLongPress, { passive: true });

        // Suprime o clique que vem na sequência de um long-press
        header.addEventListener('click', (ev) => {
            if (_actionPreviewSuppressClick) {
                _actionPreviewSuppressClick = false;
                ev.stopImmediatePropagation();
                ev.preventDefault();
            }
        }, true);
    }

    function buildAttackFields(item) {
        const wrap = document.createElement('dl');
        wrap.className = 'cb-attack-fields';

        const quantidade = item.quantidadeAtaques || parseAttackCount(item, item.nome) || 1;
        const tipoBonus = String(item.tipoBonus || '').toLowerCase();
        const acertoAutomatico = tipoBonus === 'automatico' || item.acertoAutomatico === true;
        const bonus = item.bonusAtaque ?? parseAttackBonus(item);
        const dano = item.dano || item.danoFormula || parseDamageFormula(`${item.detalhe || ''} ${item.nome || ''}`) || '1d8+4';

        const fields = [
            ['Alcance', item.alcance || 'corpo a corpo'],
            ['Quantidade', quantidade === 1 ? '1 ataque' : `${quantidade} ataques`],
            ['Teste', acertoAutomatico ? 'Acerto automático' : formatSignedBonus(bonus)],
            ['Dano', formatDamageLabel(dano, item.tipoDano)]
        ];

        if (item.saveTipo) {
            const saveLabel = ({ fortitude: 'Fortitude', reflexos: 'Reflexos', vontade: 'Vontade' })[String(item.saveTipo).toLowerCase()] || item.saveTipo;
            fields.push(['Salvação', `${saveLabel} CD ${item.saveCD || '?'} (sucesso → metade do dano)`]);
        }

        for (const [label, value] of fields) {
            const row = document.createElement('div');
            const dt = document.createElement('dt');
            const dd = document.createElement('dd');
            dt.textContent = label;
            dd.textContent = value;
            row.appendChild(dt);
            row.appendChild(dd);
            wrap.appendChild(row);
        }

        return wrap;
    }

    function getActionDisplayName(item) {
        const name = String(item && item.nome || 'Ação');
        if (normalizeText(name).includes('gavioes espinhosos') || normalizeText(name).includes('gavinhos espinhosos')) {
            return 'Gravetos espinhosos';
        }
        return name.replace(/^\s*\d+\s+/, '');
    }

    function formatSignedBonus(value) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) return String(value || '+0');
        return parsed >= 0 ? `+${parsed}` : String(parsed);
    }

    function formatDamageLabel(value, tipoDano = '') {
        const text = String(value || '').trim();
        if (!text) return tipoDano ? `0 ${tipoDano}` : '0';
        if (!tipoDano || normalizeText(text).includes(normalizeText(tipoDano))) return text;
        return `${text} ${tipoDano}`;
    }

    function isAttackWithReach(item) {
        const alc = normalizeText(item && item.alcance);
        return normalizeText(item && item.tipo).includes('ataque')
            || ['corpo a corpo', 'curto', 'longo',
                'cubo', 'quadrado',
                'cone',
                'raio', 'esfera', 'cilindro',
                'linha'].some(alvo => alc.includes(alvo))
            || isAreaAttack(item)
            || normalizeText(item && item.nome).includes('gavioes espinhosos')
            || normalizeText(item && item.nome).includes('gavinhos espinhosos')
            || normalizeText(item && item.nome).includes('gravetos espinhosos');
    }

    function isAreaAttack(item) {
        const shape = parseAreaShape(item && item.alcance);
        return shape.tipo === 'cone' || shape.tipo === 'linha' || shape.tipo === 'raio' || shape.tipo === 'cubo';
    }

    function actionKey(item) {
        return normalizeText(`${item && item.tipo || ''}:${item && item.nome || ''}:${item && item.alcance || ''}`);
    }

    function isReachPreviewActive(tokenId, item) {
        return !!state.reachPreview
            && state.reachPreview.tokenId === tokenId
            && state.reachPreview.actionKey === actionKey(item);
    }

    function toggleReachPreview(token, item) {
        if (isReachPreviewActive(token.id, item)) {
            clearReachPreview(true);
            return;
        }
        // Para áreas, inicia o aim na frente do token (logo acima dele)
        const aimInicial = isAreaAttack(item)
            ? { col: token.col + Math.floor((token.sizeCells || 1) / 2), row: Math.max(0, token.row - 1) }
            : null;
        state.reachPreview = {
            tokenId: token.id,
            actionKey: actionKey(item),
            alcance: item.alcance || 'corpo a corpo',
            action: item,
            aim: aimInicial,
            results: [],
            totalDamage: 0
        };
        renderBoard();
    }

    function clearReachPreview(shouldRender = true) {
        if (!state.reachPreview) return;
        state.reachPreview = null;
        lastAimKey = '';
        if (shouldRender) renderBoard();
    }

    function getReachAttackerPosition(token) {
        if (interaction
            && interaction.type === 'token-drag'
            && interaction.tokenId === token.id
            && typeof interaction.tempCol === 'number') {
            const max = Math.max(1, Number(token.sizeCells || 1));
            return {
                col: clamp(Math.round(interaction.tempCol), 0, state.cols - max),
                row: clamp(Math.round(interaction.tempRow), 0, state.rows - max)
            };
        }
        return { col: token.col, row: token.row };
    }

    function isReachPreviewCell(col, row) {
        if (!state.reachPreview) return false;
        const token = state.tokens.find(t => t.id === state.reachPreview.tokenId);
        if (!token) return false;
        return buildActionReachCells(token, state.reachPreview.action).has(occupiedKey(col, row));
    }

    /**
     * Para o preview ativo, devolve true se a célula está dentro do
     * alcance MAS não tem linha de efeito livre (bloqueada por barreira).
     * Ataques corpo a corpo e em área não são marcados como bloqueados.
     */
    function isReachPreviewCellBlocked(col, row) {
        if (!state.reachPreview) return false;
        const action = state.reachPreview.action;
        if (!action) return false;
        if (isAreaAttack(action)) return false;
        const range = parseAlcanceAtaque(action.alcance);
        if (range <= 1) return false;
        const token = state.tokens.find(t => t.id === state.reachPreview.tokenId);
        if (!token) return false;
        if (!buildActionReachCells(token, action).has(occupiedKey(col, row))) return false;
        return !tokenHasLineOfEffectToCell(token, col, row);
    }

    function computeReachTargetCellSet() {
        const set = new Set();
        if (!state.reachPreview) return set;
        const attacker = state.tokens.find(t => t.id === state.reachPreview.tokenId);
        if (!attacker) return set;
        const reach = buildActionReachCells(attacker, state.reachPreview.action);
        for (const target of state.tokens) {
            if (target.id === attacker.id) continue;
            for (const cell of getTokenCells(target)) {
                if (reach.has(occupiedKey(cell.col, cell.row))) {
                    set.add(occupiedKey(cell.col, cell.row));
                }
            }
        }
        return set;
    }

    function executeAreaAttack(attacker, item) {
        if (state.turns.length && !isCurrentTurnToken(attacker.id)) {
            showCbToast(`${attacker.name || 'Token'} não está no turno atual.`);
            clearReachPreview();
            return;
        }
        if (!canTakeStandardAction(attacker)) {
            const motivo = attacker.acaoCompletaUsada
                ? 'ação completa já gasta neste turno'
                : (attacker.dobroMovimento
                    ? 'segunda ação de movimento em uso — ação padrão indisponível'
                    : 'ação padrão da rodada já foi usada');
            showCbToast(`Não pode atacar: ${motivo}.`);
            clearReachPreview();
            return;
        }
        const targets = getTokensInActionReach(attacker, item);
        if (!isReachPreviewActive(attacker.id, item)) {
            toggleReachPreview(attacker, item);
        }
        if (!targets.length) {
            openAttackResultModal({
                attacker,
                target: null,
                actionName: getActionDisplayName(item),
                totalDamage: 0,
                message: 'Nenhum alvo dentro da área de efeito.'
            });
            return;
        }
        openAreaAttackConfirmation(attacker, item, targets);
    }

    function openAreaAttackConfirmation(attacker, item, targets) {
        if (!els.confirm) return;
        pendingAttack = { attacker, action: item, areaTargets: targets, isArea: true };

        const actionName = getActionDisplayName(item);
        const attackerName = attacker.name || 'Atacante';
        const saveTipo = String(item.saveTipo || '').toLowerCase();
        const saveCD = Number(item.saveCD || 0) || null;
        const saveLabel = saveTipo
            ? `Cada alvo faz teste de ${rotuloSaveTipo(saveTipo)} CD ${saveCD || '?'} (sucesso → metade do dano).`
            : '';

        els.confirmText.innerHTML =
            `<strong>${escapeHtml(attackerName)}</strong> vai usar <strong>${escapeHtml(actionName)}</strong> em área, ` +
            `atingindo <strong>${escapeHtml(targets.length)}</strong> alvo(s). ` +
            (saveLabel ? `<br><em>${escapeHtml(saveLabel)}</em>` : '');

        // Esconde o slot de alvo único, mostra a lista de alvos
        if (els.confirmTargetSingle) els.confirmTargetSingle.hidden = true;
        if (els.confirmTargetsList) {
            els.confirmTargetsList.hidden = false;
            els.confirmTargetsList.innerHTML = '';
            for (const target of targets) {
                const row = document.createElement('div');
                row.className = 'cb-confirm-target cb-confirm-target--row';

                const thumb = document.createElement('div');
                thumb.className = 'cb-confirm-target-thumb';
                const targetSrc = resolveTokenImageSrc(target);
                if (targetSrc) {
                    const img = document.createElement('img');
                    img.src = targetSrc;
                    img.alt = target.name || 'Alvo';
                    img.draggable = false;
                    applyTokenImageAdjustment(img, target.tokenImageAdjust ?? target.imageAdjust);
                    thumb.appendChild(img);
                } else {
                    thumb.textContent = getTokenInitials(target.name);
                }
                row.appendChild(thumb);

                const info = document.createElement('div');
                info.className = 'cb-confirm-target-info';
                const nameEl = document.createElement('div');
                nameEl.className = 'cb-confirm-target-name';
                nameEl.textContent = target.name || 'Alvo';
                info.appendChild(nameEl);

                const metaEl = document.createElement('div');
                metaEl.className = 'cb-confirm-target-meta';
                const metaParts = [];
                const pvMax = numberOrNull(target.pvMax);
                if (pvMax !== null && pvMax > 0) {
                    metaParts.push(`PV ${clampResource(target.pvAtual, target.pvMax)}/${pvMax}`);
                }
                const defesa = target.defesa ?? null;
                if (defesa !== null && defesa !== '') metaParts.push(`Defesa ${defesa}`);
                if (saveTipo) {
                    const saveBonus = parseSaveBonus(target, saveTipo);
                    metaParts.push(`${rotuloSaveTipo(saveTipo)} ${formatSignedBonus(saveBonus)}`);
                }
                metaEl.textContent = metaParts.join(' • ');
                info.appendChild(metaEl);

                row.appendChild(info);
                els.confirmTargetsList.appendChild(row);
            }
        }

        els.confirm.hidden = false;
    }

    function rotuloSaveTipo(tipo) {
        return ({ fortitude: 'Fortitude', reflexos: 'Reflexos', vontade: 'Vontade' })[String(tipo || '').toLowerCase()] || '';
    }

    function confirmPendingAreaAttack() {
        if (!pendingAttack || !pendingAttack.isArea) return false;
        const { attacker, action: item, areaTargets } = pendingAttack;
        closeAttackConfirmation();
        // Ataque em área conta como UMA ação padrão.
        consumeStandardAction(attacker, `ataque em área com ${getActionDisplayName(item)}`);

        const damageFormula = item.danoFormula || parseDamageFormula(item.dano || item.detalhe || item.nome || '') || '1d6';
        const damage = rollDamage(damageFormula);
        const saveTipo = String(item.saveTipo || '').toLowerCase();
        const saveCD = Number(item.saveCD || 0) || null;

        const results = [];
        let totalDamage = 0;
        let index = 1;
        for (const target of areaTargets) {
            let saveResult = null;
            if (saveTipo && saveCD) {
                saveResult = rollTargetSave(target, saveTipo, saveCD);
            }
            const finalDamage = saveResult && saveResult.success
                ? Math.floor(damage.total / 2)
                : damage.total;
            applyDamageToToken(target, finalDamage);
            results.push({
                index: index++,
                targetName: target.name || 'Alvo',
                d20: null,
                total: null,
                attackBonus: 0,
                defense: parseDefense(target),
                hit: true,
                acertoAutomatico: true,
                damage,
                damageTotal: finalDamage,
                damageFull: damage.total,
                save: saveResult,
                pvAtual: clampResource(target.pvAtual, target.pvMax),
                pvMax: target.pvMax || 0
            });
            totalDamage += finalDamage;
        }

        clearReachPreview(false);
        renderTokens();
        renderBoard();
        selectToken(attacker.id);
        saveState();

        openAttackResultModal({
            attacker,
            target: null,
            actionName: getActionDisplayName(item),
            results,
            totalDamage,
            message: `${results.length} alvo(s) na área de efeito`
        });
        return true;
    }

    function executeMeleeAttack(attacker, item) {
        const targets = getTokensInActionReach(attacker, item);
        if (!targets.length) {
            if (!isReachPreviewActive(attacker.id, item)) {
                toggleReachPreview(attacker, item);
            }
            openAttackResultModal({
                attacker,
                target: null,
                actionName: getActionDisplayName(item),
                totalDamage: 0,
                message: 'Nenhum alvo dentro do alcance.'
            });
            return;
        }

        const target = chooseAttackTarget(targets);
        if (!target) return;
        performMeleeAttack(attacker, item, target);
    }

    function performMeleeAttack(attacker, item, target) {
        if (!attacker || !target) return;
        const attackCount = item.quantidadeAtaques || parseAttackCount(item, item.nome) || 1;
        const results = [];
        let totalDamage = 0;

        for (let i = 0; i < attackCount; i++) {
            const result = rollSingleMeleeAttack(attacker, item, target, i + 1);
            results.push(result);
            totalDamage += result.damageTotal || 0;
        }

        renderTokens();
        selectToken(attacker.id);
        saveState();
        openAttackResultModal({
            attacker,
            target,
            actionName: getActionDisplayName(item),
            results,
            totalDamage,
            pvAtual: clampResource(target.pvAtual, target.pvMax),
            pvMax: target.pvMax || 0
        });
    }

    /* Verifica condições táticas do alvo (cobertura, camuflagem) e
       calcula modificadores antes do roll de ataque. Devolve um objeto
       com as informações ou um sinal de bloqueio/miss prévio. */
    function applyTacticalConditions(attacker, item, target) {
        const out = {
            blocked: false,
            blockReason: '',
            preMiss: false,
            preMissReason: '',
            attackBonusExtra: 0,
            defenseBonus: 0,
            notes: []
        };

        // Cobertura total: ataque bloqueado, sem rolagem.
        if (target.cobertura === 'total') {
            out.blocked = true;
            out.blockReason = 'Alvo sob cobertura total — não pode ser atacado.';
            return out;
        }

        // Camuflagem: rola d10 secundário antes do d20. Se cair na faixa
        // de falha, o ataque erra automaticamente, independente do roll.
        // 20% (1-2) para leve; 50% (1-5) para total.
        if (target.camuflagem === 'leve' || target.camuflagem === 'total') {
            const limite = target.camuflagem === 'total' ? 5 : 2;
            const rolagem = rollDie(10);
            const falha = rolagem <= limite;
            out.notes.push('Camuflagem ' + target.camuflagem + ' (1d10=' + rolagem + ' vs ≤' + limite + ': ' + (falha ? 'FALHA' : 'OK') + ')');
            if (falha) {
                out.preMiss = true;
                out.preMissReason = 'Camuflagem ' + target.camuflagem + ': 1d10=' + rolagem + ' (≤' + limite + ' = falha).';
                return out;
            }
        }

        // Cobertura leve: +5 na Defesa do alvo.
        if (target.cobertura === 'leve') {
            out.defenseBonus += 5;
            out.notes.push('Cobertura leve: +5 Defesa');
        }

        // Flanqueamento: +2 no ataque corpo a corpo se o alvo está flanqueado.
        // Não se aplica a ataques à distância nem desarmados (regra do livro).
        if (target.flanqueado && isAttackCorpoACorpo(item)) {
            out.attackBonusExtra += 2;
            out.notes.push('Flanqueamento: +2 ataque (corpo a corpo)');
        }

        return out;
    }

    function isAttackCorpoACorpo(item) {
        const alc = normalizeText(item && item.alcance);
        // Heurística: vazio, "corpo a corpo" ou alcance "1" são corpo a corpo.
        if (!alc || alc === 'corpo' || alc.includes('corpo a corpo')) return true;
        // Áreas e alcances curtos/longos/médios = à distância.
        if (alc.includes('curto') || alc.includes('medio') || alc.includes('longo')
            || alc.includes('cone') || alc.includes('linha')
            || alc.includes('raio') || alc.includes('esfera')
            || alc.includes('cubo') || alc.includes('quadrado') || alc.includes('cilindro')) return false;
        return true;
    }

    function rollSingleMeleeAttack(attacker, item, target, index) {
        const tactical = applyTacticalConditions(attacker, item, target);
        const baseAttackBonus = parseAttackBonus(item);
        const baseDefense = parseDefense(target);
        const attackBonus = baseAttackBonus + tactical.attackBonusExtra;
        const defense = baseDefense + tactical.defenseBonus;
        const damageFormula = item.danoFormula || parseDamageFormula(item.dano || item.detalhe || item.nome || '') || '1d8';
        const tipoBonus = String(item.tipoBonus || '').toLowerCase();
        const acertoAutomatico = tipoBonus === 'automatico' || item.acertoAutomatico === true;

        // Bloqueio total: cobertura total impede o ataque inteiro.
        if (tactical.blocked) {
            addLog({
                title: 'Ataque bloqueado',
                detail: (attacker.name || 'Atacante') + ' → ' + (target.name || 'Alvo') + ': ' + tactical.blockReason
            });
            return {
                index, targetName: target.name || 'Alvo',
                d20: null, total: null,
                attackBonus: baseAttackBonus, defense: baseDefense,
                hit: false, blocked: true, tacticalNotes: tactical.notes,
                tacticalReason: tactical.blockReason,
                damage: null, damageTotal: 0,
                pvAtual: clampResource(target.pvAtual, target.pvMax),
                pvMax: target.pvMax || 0
            };
        }

        // Falha por camuflagem (antes do d20).
        if (tactical.preMiss) {
            addLog({
                title: 'Ataque desviado',
                detail: (attacker.name || 'Atacante') + ' → ' + (target.name || 'Alvo') + ': ' + tactical.preMissReason
            });
            return {
                index, targetName: target.name || 'Alvo',
                d20: null, total: null,
                attackBonus: baseAttackBonus, defense: baseDefense,
                hit: false, preMiss: true, tacticalNotes: tactical.notes,
                tacticalReason: tactical.preMissReason,
                damage: null, damageTotal: 0,
                pvAtual: clampResource(target.pvAtual, target.pvMax),
                pvMax: target.pvMax || 0
            };
        }

        // Caminho 1: acerto automático (não rola d20). Pode haver teste de save do alvo.
        if (acertoAutomatico) {
            const damage = rollDamage(damageFormula);
            const saveTipo = String(item.saveTipo || '').toLowerCase();
            const saveCD = Number(item.saveCD || 0) || null;
            let saveResult = null;
            if (saveTipo && saveCD) {
                saveResult = rollTargetSave(target, saveTipo, saveCD);
            }
            const finalDamage = saveResult && saveResult.success
                ? Math.floor(damage.total / 2)
                : damage.total;
            applyDamageToToken(target, finalDamage);
            if (tactical.notes.length) {
                addLog({ title: 'Modificadores táticos', detail: tactical.notes.join(' · ') });
            }
            return {
                index,
                targetName: target.name || 'Alvo',
                d20: null,
                total: null,
                attackBonus: 0,
                defense,
                hit: true,
                acertoAutomatico: true,
                damage,
                damageTotal: finalDamage,
                damageFull: damage.total,
                save: saveResult,
                tacticalNotes: tactical.notes,
                pvAtual: clampResource(target.pvAtual, target.pvMax),
                pvMax: target.pvMax || 0
            };
        }

        const d20 = rollDie(20);
        const total = d20 + attackBonus;

        if (tactical.notes.length) {
            addLog({ title: 'Modificadores táticos', detail: tactical.notes.join(' · ') });
        }

        if (total > defense) {
            const damage = rollDamage(damageFormula);
            applyDamageToToken(target, damage.total);
            return {
                index,
                targetName: target.name || 'Alvo',
                d20,
                total,
                attackBonus,
                defense,
                hit: true,
                damage,
                damageTotal: damage.total,
                tacticalNotes: tactical.notes,
                pvAtual: clampResource(target.pvAtual, target.pvMax),
                pvMax: target.pvMax || 0
            };
        }

        return {
            index,
            targetName: target.name || 'Alvo',
            d20,
            total,
            attackBonus,
            defense,
            hit: false,
            damage: null,
            damageTotal: 0,
            tacticalNotes: tactical.notes,
            pvAtual: clampResource(target.pvAtual, target.pvMax),
            pvMax: target.pvMax || 0
        };
    }

    function parseAtributosCriatura(valor) {
        // Formato típico do bestiário: "forca: +2\ndestreza: +0\n..." ou objeto.
        const out = {};
        if (!valor) return out;
        if (typeof valor === 'object' && !Array.isArray(valor)) {
            for (const [k, v] of Object.entries(valor)) {
                const num = Number(String(v).match(/-?\d+/)?.[0]);
                if (Number.isFinite(num)) out[normalizeAtributo(k)] = num;
            }
            return out;
        }
        const linhas = Array.isArray(valor) ? valor : String(valor).split(/\n|;/);
        for (const linha of linhas) {
            const m = String(linha).match(/(forca|força|destreza|constituicao|constituição|inteligencia|inteligência|sabedoria|carisma)\s*[:\-=]?\s*([+-]?\d+)/i);
            if (m) {
                const num = Number(m[2]);
                if (Number.isFinite(num)) out[normalizeAtributo(m[1])] = num;
            }
        }
        return out;
    }

    function normalizeAtributo(nome) {
        const map = {
            'forca': 'forca', 'força': 'forca',
            'destreza': 'destreza',
            'constituicao': 'constituicao', 'constituição': 'constituicao',
            'inteligencia': 'inteligencia', 'inteligência': 'inteligencia',
            'sabedoria': 'sabedoria',
            'carisma': 'carisma'
        };
        return map[String(nome).toLowerCase()] || String(nome).toLowerCase();
    }

    function parseSaveBonus(target, tipo) {
        if (!target) return 0;
        // Save explícito tem prioridade. Fallback: atributo correspondente.
        // Pindorama RPG: Fortitude usa Con, Reflexos usa Des, Vontade usa Sab.
        const explicitos = {
            fortitude: ['fortitude', 'fortitudeBonus', 'fort', 'savesFortitude'],
            reflexos: ['reflexos', 'reflexo', 'reflexBonus', 'savesReflexos'],
            vontade: ['vontade', 'will', 'vontadeBonus', 'savesVontade']
        }[tipo] || [];
        for (const chave of explicitos) {
            const val = target[chave];
            if (val !== undefined && val !== null && val !== '') {
                const num = Number(String(val).match(/-?\d+/)?.[0]);
                if (Number.isFinite(num)) return num;
            }
        }
        // Fallback: atributo
        const fallbackAtributo = ({
            fortitude: 'constituicao',
            reflexos: 'destreza',
            vontade: 'sabedoria'
        })[tipo];
        if (fallbackAtributo) {
            const val = target[fallbackAtributo];
            if (val !== undefined && val !== null && val !== '') {
                const num = Number(String(val).match(/-?\d+/)?.[0]);
                if (Number.isFinite(num)) return num;
            }
        }
        return 0;
    }

    function rollTargetSave(target, tipo, cd) {
        const bonus = parseSaveBonus(target, tipo);
        const d20 = rollDie(20);
        const total = d20 + bonus;
        return {
            tipo,
            cd,
            d20,
            bonus,
            total,
            success: total >= cd
        };
    }

    /* Função pura — calcula a CD de um teste de resistência conforme o
       capítulo "Jogando":
           CD = 10 + (metade do nível, arredondado para baixo) + atributo
       O atributo aparece entre parênteses na descrição da fonte do efeito
       (ex.: "CD Sabedoria"). Usada como infraestrutura para a parte 2 do
       item I do plano (onde o atacante quer descobrir a CD esperada de
       uma habilidade que vai lançar). Não mexe em PV/PM. */
    function calcularCDResistencia(nivel, atributoValor) {
        const n = Math.max(1, Number(nivel) || 1);
        const a = Number(atributoValor) || 0;
        return 10 + Math.floor(n / 2) + a;
    }

    /* Roll oposto puro: dois d20 + bônus, vencedor pela soma. Empate
       se resolve pelo maior bônus; se ambos iguais, devolve
       'empate-real' (narrador rola novamente). Conforme regra do
       livro Pindorama em "Manobras de Combate". */
    function rollOpposedTest(atkBonus, defBonus) {
        const atkD20 = rollDie(20);
        const defD20 = rollDie(20);
        const atkTotal = atkD20 + atkBonus;
        const defTotal = defD20 + defBonus;
        let winner;
        if (atkTotal > defTotal) winner = 'atacante';
        else if (defTotal > atkTotal) winner = 'alvo';
        else if (atkBonus > defBonus) winner = 'atacante';
        else if (defBonus > atkBonus) winner = 'alvo';
        else winner = 'empate-real';
        return {
            atkD20, atkBonus, atkTotal,
            defD20, defBonus, defTotal,
            winner,
            diferenca: atkTotal - defTotal
        };
    }

    /* Lê bônus de uma perícia específica do token, com fallback para
       o atributo-chave da perícia. Usado em manobras de combate
       (Luta, Reflexos, Enganação). */
    function parsePericiaBonus(token, tipo) {
        if (!token) return 0;
        const explicitos = ({
            luta: ['luta', 'lutaBonus'],
            reflexos: ['reflexos', 'reflexo', 'reflexBonus'],
            enganacao: ['enganacao', 'enganação', 'enganacaoBonus']
        })[tipo] || [];
        for (const k of explicitos) {
            const v = token[k];
            if (v != null && v !== '') {
                const n = Number(String(v).match(/-?\d+/)?.[0]);
                if (Number.isFinite(n)) return n;
            }
        }
        const fallback = ({
            luta: 'forca',
            reflexos: 'destreza',
            enganacao: 'carisma'
        })[tipo];
        if (fallback) {
            const v = token[fallback];
            if (v != null && v !== '') {
                const n = Number(String(v).match(/-?\d+/)?.[0]);
                if (Number.isFinite(n)) return n;
            }
        }
        return 0;
    }

    /* Catálogo de manobras com a perícia padrão do atacante e do alvo
       conforme "Manobras de Combate" do livro Pindorama. Quebrar fica
       de fora porque usa a Defesa do objeto, não teste oposto. */
    const COMBAT_MANEUVERS = [
        { key: 'agarrar',   label: 'Agarrar',   atkSkill: 'luta',       defSkill: 'luta' },
        { key: 'derrubar',  label: 'Derrubar',  atkSkill: 'luta',       defSkill: 'luta' },
        { key: 'desarmar',  label: 'Desarmar',  atkSkill: 'luta',       defSkill: 'luta' },
        { key: 'empurrar',  label: 'Empurrar',  atkSkill: 'luta',       defSkill: 'luta' },
        { key: 'atropelar', label: 'Atropelar', atkSkill: 'luta',       defSkill: 'luta' },
        { key: 'fintar',    label: 'Fintar',    atkSkill: 'enganacao',  defSkill: 'reflexos' }
    ];

    function rotuloPericia(tipo) {
        return ({ luta: 'Luta', reflexos: 'Reflexos', enganacao: 'Enganação' })[tipo] || tipo;
    }

    function getTokensInActionReach(attacker, action) {
        const reachable = buildActionReachCells(attacker, action);
        return state.tokens.filter(token => {
            if (token.id === attacker.id) return false;
            return getTokenCells(token).some(cell => reachable.has(occupiedKey(cell.col, cell.row)));
        });
    }

    // ----------------------------------------------------------------
    // Sub-fase C: preview visual de alcance de movimento
    // ----------------------------------------------------------------

    // Dijkstra a partir da posição do token, considerando regra Chebyshev
    // 5/10 (orto=1, diag=2) com terreno difícil dobrando o custo de entrar
    // numa célula difícil. Devolve Map<"col,row", custoTotal> com todas as
    // células alcançáveis dentro do `budget` (em quadrados).
    //
    // Limitações conhecidas (intencionais nesta fase):
    // - Para tokens grandes (size > 1) o BFS parte da célula-âncora; o
    //   preview pode mostrar células que o footprint não cabe ao parar.
    //   A validação de pouso continua nas funções de drag existentes.
    function buildMovementReachCells(token, budget) {
        const out = buildMovementReachWithPath(token, budget);
        return out.dist;
    }

    /**
     * Dijkstra completo com rastreio de pai para reconstruir o caminho.
     * Considera: terreno difícil (custo 2x), barreiras (intransponíveis),
     * outros tokens (bloqueiam), limites do grid.
     *
     * Retorna { dist: Map<key,cost>, parent: Map<key,prevKey>, startKey }.
     */
    function buildMovementReachWithPath(token, budget) {
        const dist = new Map();
        const parent = new Map();
        const startKey = token ? occupiedKey(token.col, token.row) : '';
        if (!token || !Number.isFinite(budget) || budget <= 0) {
            return { dist, parent, startKey };
        }
        const cols = state.cols, rows = state.rows;

        // Células ocupadas por OUTROS tokens viram bloqueio.
        const blocked = new Set();
        for (const other of state.tokens) {
            if (other.id === token.id) continue;
            for (const cell of getTokenCells(other)) {
                blocked.add(occupiedKey(cell.col, cell.row));
            }
        }

        dist.set(startKey, 0);
        const pq = [{ key: startKey, col: token.col, row: token.row, cost: 0 }];

        while (pq.length) {
            let minIdx = 0;
            for (let i = 1; i < pq.length; i++) {
                if (pq[i].cost < pq[minIdx].cost) minIdx = i;
            }
            const cur = pq.splice(minIdx, 1)[0];
            if (dist.get(cur.key) !== cur.cost) continue;
            for (let dc = -1; dc <= 1; dc++) {
                for (let dr = -1; dr <= 1; dr++) {
                    if (dc === 0 && dr === 0) continue;
                    const nc = cur.col + dc;
                    const nr = cur.row + dr;
                    if (nc < 0 || nr < 0 || nc >= cols || nr >= rows) continue;
                    const nkey = occupiedKey(nc, nr);
                    if (blocked.has(nkey)) continue;
                    if (isTerrainBarrier(nc, nr)) continue; // barreiras intransponíveis
                    const isDiagonal = (dc !== 0 && dr !== 0);
                    const dificil = isTerrainDifficult(nc, nr);
                    let stepCost = isDiagonal ? 2 : 1;
                    if (dificil) stepCost *= 2;
                    const newCost = cur.cost + stepCost;
                    if (newCost > budget) continue;
                    const prev = dist.get(nkey);
                    if (prev === undefined || newCost < prev) {
                        dist.set(nkey, newCost);
                        parent.set(nkey, cur.key);
                        pq.push({ key: nkey, col: nc, row: nr, cost: newCost });
                    }
                }
            }
        }

        return { dist, parent, startKey };
    }

    /** Reconstrói o caminho [{col,row}, ...] de origem ao destino,
     * incluindo o destino (mas excluindo a origem). Vazio se inexiste. */
    function reconstruirCaminho(parentMap, startKey, targetKey) {
        if (!parentMap.has(targetKey) && targetKey !== startKey) return [];
        const reversa = [];
        let cur = targetKey;
        while (cur && cur !== startKey) {
            const m = /^(\d+),(\d+)$/.exec(cur);
            if (!m) break;
            reversa.push({ col: Number(m[1]), row: Number(m[2]) });
            cur = parentMap.get(cur);
        }
        return reversa.reverse();
    }

    // ---- Click-to-move: estado do "modo seleção de destino" ----
    // state.movePicker = { tokenId, baseQd, max1, max2, dist, parent, startKey } | null
    // Quando ativo, o renderBoard pinta a área alcançável dividida em
    // "1 ação" (até max1) e "2 ações" (acima de max1 até max2).

    function entrarModoMover() {
        const sel = state.tokens.find(t => t.id === state.selectedId);
        if (!sel) {
            showCbToast('Selecione um token para movê-lo.');
            return;
        }
        if (state.combateAtivo && !isCurrentTurnToken(sel.id)) {
            showCbToast(`${sel.name || 'Token'} não está no turno atual.`);
            return;
        }
        if (state.combateAtivo && sel.acaoCompletaUsada) {
            showCbToast('Ação completa já gasta neste turno.');
            return;
        }

        // Orçamento: ação 1 = base; ação 2 = +base (se padrão livre).
        const baseQd = tokenDeslocamentoQuadrados(sel);
        const movimentoUsado = Number(sel.movimentoUsado) || 0;
        const restante1 = Math.max(0, baseQd - movimentoUsado);

        // Se padrão ainda livre OU dobro já engajado, pode chegar a 2x base.
        const podeDobro = !sel.acaoPadraoUsada || sel.dobroMovimento;
        const restante2 = podeDobro ? Math.max(0, (baseQd * 2) - movimentoUsado) : restante1;

        if (restante1 <= 0 && restante2 <= 0) {
            showCbToast('Sem deslocamento disponível neste turno.');
            return;
        }

        // Limpa overlays competidores.
        clearReachPreview(false);

        // Dijkstra com orçamento total (restante2 cobre os dois casos).
        const r = buildMovementReachWithPath(sel, restante2);
        state.movePicker = {
            tokenId: sel.id,
            baseQd,
            movimentoUsado,
            max1: restante1,
            max2: restante2,
            dist: r.dist,
            parent: r.parent,
            startKey: r.startKey,
            path: null
        };
        _moveHoverKey = '';
        showCbToast('Escolha um destino no grid. ESC cancela.');
        renderBoard();
    }

    function sairModoMover() {
        if (!state.movePicker) return;
        state.movePicker = null;
        _moveHoverKey = '';
        renderBoard();
    }

    function previewCaminhoMover(destCol, destRow) {
        const mp = state.movePicker;
        if (!mp) return null;
        const targetKey = occupiedKey(destCol, destRow);
        if (!mp.dist.has(targetKey)) return null;
        const path = reconstruirCaminho(mp.parent, mp.startKey, targetKey);
        const cost = mp.dist.get(targetKey);
        return { path, cost, targetKey };
    }

    // Hover dinâmico do modo de seleção de destino: a cada movimento do
    // cursor, repinta o caminho mais curto até a célula sob o mouse e
    // marca essa célula como destino.
    let _moveHoverKey = '';
    function updateMovePickerHover(clientX, clientY) {
        const mp = state.movePicker;
        if (!mp) return;
        const cell = screenToCell(clientX, clientY);
        const key = occupiedKey(cell.col, cell.row);
        if (key === _moveHoverKey) return;
        _moveHoverKey = key;

        if (key === mp.startKey || !mp.dist.has(key)) {
            // Origem ou inalcançável: limpa o caminho preview.
            if (mp.path) {
                mp.path = null;
                renderBoard();
            }
            return;
        }
        mp.path = reconstruirCaminho(mp.parent, mp.startKey, key);
        renderBoard();
    }

    async function escolherDestinoMover(destCol, destRow) {
        const mp = state.movePicker;
        if (!mp) return;
        const token = state.tokens.find(t => t.id === mp.tokenId);
        if (!token) { sairModoMover(); return; }

        const targetKey = occupiedKey(destCol, destRow);

        // Destino é a própria origem? Cancela.
        if (targetKey === mp.startKey) {
            sairModoMover();
            return;
        }

        // Destino é barreira ou inalcançável dentro do orçamento total?
        if (isTerrainBarrier(destCol, destRow)) {
            showCbToast('Destino é uma barreira intransponível.');
            return;
        }
        if (!mp.dist.has(targetKey)) {
            showCbToast('Destino além do deslocamento máximo deste turno.');
            return;
        }

        const cost = mp.dist.get(targetKey);
        const path = reconstruirCaminho(mp.parent, mp.startKey, targetKey);
        const metros = (cost * 1.5).toFixed(1).replace(/\.0$/, '');
        const dentroDe1 = cost <= mp.max1;
        const precisaDoDobro = !dentroDe1;

        if (precisaDoDobro && (token.acaoPadraoUsada || cost > mp.max2)) {
            showCbToast('Sem ação padrão disponível para 2ª ação de movimento.');
            return;
        }

        // Mostra o caminho durante a confirmação.
        mp.path = path;
        renderBoard();

        let confirmado;
        if (dentroDe1) {
            confirmado = await showMesaConfirm({
                title: 'Mover token',
                body: `${token.name || 'Token'} se moverá ${cost} qd / ${metros}m.\nIsso usará 1 ação de movimento.`,
                confirmLabel: 'Mover',
                cancelLabel: 'Cancelar'
            });
        } else {
            confirmado = await showMesaConfirm({
                title: 'Usar 2 ações de movimento?',
                body: `${token.name || 'Token'} precisa percorrer ${cost} qd / ${metros}m, ` +
                      `o que excede a ação de movimento padrão. ` +
                      `Deseja usar a SEGUNDA ação de movimento e ficar SEM ação padrão neste turno?`,
                confirmLabel: 'Usar 2 movimentos',
                cancelLabel: 'Cancelar'
            });
        }

        if (!confirmado) {
            // Mantém o picker ativo para o usuário escolher outro destino.
            mp.path = null;
            renderBoard();
            return;
        }

        aplicarMovimentoTatico(token, path, cost, precisaDoDobro);
    }

    function aplicarMovimentoTatico(token, path, cost, usaDobro) {
        if (!path || !path.length) return;
        // Snapshot para Ctrl+Z.
        pushUndo(usaDobro ? 'Movimento (2 ações)' : 'Movimento', token.id);

        // Aplica.
        const dest = path[path.length - 1];
        token.col = dest.col;
        token.row = dest.row;
        token.movimentoUsado = (Number(token.movimentoUsado) || 0) + cost;
        token.acaoMovimentoUsada = true;
        if (usaDobro) {
            token.dobroMovimento = true;
            token.acaoPadraoUsada = true;
        }

        const total = token.dobroMovimento ? tokenDeslocamentoQuadrados(token) * 2 : tokenDeslocamentoQuadrados(token);
        const restante = Math.max(0, total - token.movimentoUsado);
        const metros = (cost * 1.5).toFixed(1).replace(/\.0$/, '');
        addLog({
            title: usaDobro ? 'Movimento (2 ações)' : 'Movimento',
            detail: `${token.name || 'Token'}: +${cost} qd / ${metros}m (acumulado ${token.movimentoUsado}/${total}, ${restante} restante${restante === 1 ? '' : 's'}).`
        });

        sairModoMover();
        renderTokens();
        renderTurnList();
        renderBoard();
        if (state.selectedId === token.id) renderSelectedTokenTools();
        saveState();
    }

    // Cache do preview de movimento por render — evita recomputar dentro
    // do loop de células. Atualizado no início de cada renderBoard().
    let movementPreviewMap = null;

    // Determina se o token selecionado deve mostrar preview de movimento.
    // Ataque ativo (`state.reachPreview`) tem prioridade visual.
    function computeMovementPreviewMap() {
        if (state.reachPreview) return null;
        const sel = state.tokens.find(t => t.id === state.selectedId);
        if (!sel) return null;
        const restante = tokenMovimentoRestante(sel);
        if (restante <= 0) return null;
        return buildMovementReachCells(sel, restante);
    }

    function isMovePreviewCell(col, row) {
        return movementPreviewMap ? movementPreviewMap.has(occupiedKey(col, row)) : false;
    }

    function isTokenInActionReach(target, attacker, action) {
        const reach = buildActionReachCells(attacker, action);
        const targetCells = getTokenCells(target);
        const inRange = targetCells.some(cell => reach.has(occupiedKey(cell.col, cell.row)));
        if (!inRange) return false;
        // Para ataques à distância, exige linha de efeito livre.
        // Corpo a corpo (alcance ≤ 1) e ataques em área não usam LoE aqui.
        const range = parseAlcanceAtaque(action && action.alcance);
        if (range <= 1) return true;
        if (isAreaAttack(action)) return true;
        return tokenHasLineOfEffectTo(attacker, target);
    }

    /**
     * Filtra um Set de células ("col,row") mantendo apenas as que têm
     * linha de efeito livre a partir do (origCol, origRow). Usado para
     * que áreas (cone/linha/raio/cubo) respeitem barreiras: o efeito
     * não vaza para o lado oposto da parede.
     */
    function filterCellsByLineOfEffect(cellSet, origCol, origRow) {
        const out = new Set();
        for (const key of cellSet) {
            const m = /^(\d+),(\d+)$/.exec(key);
            if (!m) { out.add(key); continue; }
            const c = Number(m[1]), r = Number(m[2]);
            if (c === origCol && r === origRow) { out.add(key); continue; }
            if (hasLineOfEffect(origCol, origRow, c, r)) out.add(key);
        }
        return out;
    }

    function buildActionReachCells(token, action) {
        const shape = parseAreaShape(action?.alcance);
        const { col, row } = getReachAttackerPosition(token);
        const size = Math.max(1, Number(token.sizeCells || 1));
        const cells = new Set();

        // Posição "alvo" — vem do mouse (aim) quando preview está ativo
        const aim = (state.reachPreview && state.reachPreview.tokenId === token.id && state.reachPreview.aim) || null;

        if (shape.tipo === 'cone') {
            // Cone direcionado pelo mouse, partindo de um quadrado adjacente ao token.
            const origin = getAreaOriginCell(col, row, size, aim);
            const dir = directionFromOrigin(origin, aim, col, row, size);
            addConeCellsFromOrigin(cells, origin.col, origin.row, shape.tamanho, dir);
            // Barreiras param a propagação do cone.
            return filterCellsByLineOfEffect(cells, origin.col, origin.row);
        } else if (shape.tipo === 'linha') {
            const origin = getAreaOriginCell(col, row, size, aim);
            const dir = directionFromOrigin(origin, aim, col, row, size);
            addLineCellsFromOrigin(cells, origin.col, origin.row, shape.tamanho, dir);
            return filterCellsByLineOfEffect(cells, origin.col, origin.row);
        } else if (shape.tipo === 'raio') {
            // Centro = posição do mouse (ou centro do token se não houver aim).
            // Áreas de raio usam o padrão do grid do livro, não um quadrado cheio.
            const center = aim ? { col: aim.col, row: aim.row } : { col: col + Math.floor(size / 2), row: row + Math.floor(size / 2) };
            // Se houver aim, verifica LoE do atacante até o ponto de
            // explosão. Sem LoE, a explosão não pode ser direcionada lá.
            if (aim && !tokenHasLineOfEffectToCell(token, center.col, center.row)) {
                return new Set();
            }
            addRadiusCellsBookPattern(cells, center.col, center.row, shape.tamanho);
            // Filtra a partir do CENTRO da explosão — efeito não passa
            // por barreiras, mesmo que a esfera as contenha.
            return filterCellsByLineOfEffect(cells, center.col, center.row);
        } else if (shape.tipo === 'cubo') {
            const anchor = aim
                ? { col: aim.col, row: aim.row }
                : { col: col + size, row };
            // Mesma regra do raio: cubo distante exige LoE até o anchor.
            if (aim && !tokenHasLineOfEffectToCell(token, anchor.col, anchor.row)) {
                return new Set();
            }
            addCubeCellsFromAnchor(cells, anchor.col, anchor.row, shape.tamanho);
            const half = Math.floor(Number(shape.tamanho) / 2);
            const cCol = anchor.col + half;
            const cRow = anchor.row + half;
            return filterCellsByLineOfEffect(cells, cCol, cRow);
        } else {
            // Alcance simples (corpo a corpo, curto, longo) — LoE checada
            // por isReachPreviewCellBlocked / isTokenInActionReach.
            return buildReachCellsAt(col, row, token.sizeCells, shape.tamanho);
        }
    }

    /**
     * Calcula a direção (8 cardeais) do token (col,row,size) até o ponto (tx,ty).
     * Cardinal (n/s/l/o) somente quando o ponto está alinhado com uma linha
     * ou coluna do bounding-box do token. Caso contrário, diagonal (ne/no/se/so).
     * Isso dá ao usuário mira "snap" intuitiva sobre os 8 quadrados adjacentes.
     */
    function directionFromTo(col, row, size, tx, ty) {
        const left = col;
        const right = col + size - 1;
        const top = row;
        const bottom = row + size - 1;

        const xSide = tx < left ? -1 : (tx > right ? 1 : 0);
        const ySide = ty < top ? -1 : (ty > bottom ? 1 : 0);

        if (xSide === 0 && ySide === 0) return 'n';
        if (xSide === 0) return ySide > 0 ? 's' : 'n';
        if (ySide === 0) return xSide > 0 ? 'l' : 'o';
        if (xSide > 0) return ySide > 0 ? 'se' : 'ne';
        return ySide > 0 ? 'so' : 'no';
    }

    function getAdjacentOriginCells(baseCol, baseRow, size) {
        const cells = [];
        const minCol = baseCol - 1;
        const maxCol = baseCol + size;
        const minRow = baseRow - 1;
        const maxRow = baseRow + size;

        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                const insideToken = col >= baseCol && col < baseCol + size && row >= baseRow && row < baseRow + size;
                const insideBoard = col >= 0 && col < state.cols && row >= 0 && row < state.rows;
                if (!insideToken && insideBoard) {
                    cells.push({ col, row });
                }
            }
        }

        return cells;
    }

    function getAreaOriginCell(baseCol, baseRow, size, aim) {
        const origins = getAdjacentOriginCells(baseCol, baseRow, size);
        if (!origins.length) {
            return {
                col: clamp(baseCol + Math.floor(size / 2), 0, state.cols - 1),
                row: clamp(baseRow - 1, 0, state.rows - 1)
            };
        }
        if (!aim) {
            return origins.find(cell => cell.col >= baseCol && cell.col < baseCol + size && cell.row < baseRow) || origins[0];
        }

        let best = origins[0];
        let bestScore = Infinity;
        const outwardTarget = {
            x: baseCol + (size - 1) / 2,
            y: baseRow + (size - 1) / 2
        };

        for (const origin of origins) {
            const dx = aim.col - origin.col;
            const dy = aim.row - origin.row;
            const distance = dx * dx + dy * dy;
            const awayX = origin.col - outwardTarget.x;
            const awayY = origin.row - outwardTarget.y;
            const alignmentPenalty = (dx * awayX + dy * awayY) < 0 ? 10000 : 0;
            const score = distance + alignmentPenalty;
            if (score < bestScore) {
                best = origin;
                bestScore = score;
            }
        }

        return best;
    }

    function directionFromOrigin(origin, aim, baseCol, baseRow, size) {
        const fallback = directionFromTo(baseCol, baseRow, size, origin.col, origin.row);
        if (!aim) return fallback;
        const dx = Math.sign(aim.col - origin.col);
        const dy = Math.sign(aim.row - origin.row);
        const dir = vectorToDir(dx, dy) || fallback;
        return directionPointsAwayFromToken(origin, dir, baseCol, baseRow, size) ? dir : fallback;
    }

    function vectorToDir(dx, dy) {
        if (dx === 0 && dy < 0) return 'n';
        if (dx === 0 && dy > 0) return 's';
        if (dx > 0 && dy === 0) return 'l';
        if (dx < 0 && dy === 0) return 'o';
        if (dx > 0 && dy < 0) return 'ne';
        if (dx < 0 && dy < 0) return 'no';
        if (dx > 0 && dy > 0) return 'se';
        if (dx < 0 && dy > 0) return 'so';
        return '';
    }

    function directionPointsAwayFromToken(origin, dir, baseCol, baseRow, size) {
        const v = DIR_VECTORS[dir] || DIR_VECTORS.n;
        const nextCol = origin.col + v.dx;
        const nextRow = origin.row + v.dy;
        return !(nextCol >= baseCol && nextCol < baseCol + size && nextRow >= baseRow && nextRow < baseRow + size);
    }

    function addRadiusCellsCentered(cells, cx, cy, radius) {
        for (let r = cy - radius; r <= cy + radius; r++) {
            for (let c = cx - radius; c <= cx + radius; c++) {
                if (c < 0 || c >= state.cols || r < 0 || r >= state.rows) continue;
                const dx = Math.abs(c - cx);
                const dy = Math.abs(r - cy);
                if (Math.max(dx, dy) <= radius) cells.add(occupiedKey(c, r));
            }
        }
    }

    function addRadiusCellsBookPattern(cells, centerCol, centerRow, radius) {
        const r = Math.max(1, Number(radius || 1));
        const diameter = r * 2;
        const top = centerRow - r + 1;

        for (let y = 0; y < diameter; y++) {
            const width = 2 * Math.min(y + 1, diameter - y, r);
            const row = top + y;
            const left = centerCol - Math.floor(width / 2) + 1;
            for (let x = 0; x < width; x++) {
                const col = left + x;
                if (col < 0 || col >= state.cols || row < 0 || row >= state.rows) continue;
                cells.add(occupiedKey(col, row));
            }
        }
    }

    function addCubeCellsFromAnchor(cells, anchorCol, anchorRow, side) {
        const size = Math.max(1, Number(side || 1));
        const startCol = clamp(anchorCol, 0, Math.max(0, state.cols - size));
        const startRow = clamp(anchorRow, 0, Math.max(0, state.rows - size));
        for (let row = startRow; row < startRow + size; row++) {
            for (let col = startCol; col < startCol + size; col++) {
                if (col < 0 || col >= state.cols || row < 0 || row >= state.rows) continue;
                cells.add(occupiedKey(col, row));
            }
        }
    }

    /**
     * Mapeamento do livro Pindorama (capítulo "Jogando" → "Alvos & Áreas")
     * para os tipos internos da engine 2D:
     *
     *   livro      → engine (mesma forma renderizada no grid)
     *   ─────────────────────────────────────────────────────
     *   cone       → 'cone'
     *   linha      → 'linha'
     *   esfera     → 'raio'      (centro + Chebyshev N)
     *   cilindro   → 'raio'      (a altura é meta-info do narrador, em 2D
     *                              o footprint é o mesmo da esfera)
     *   quadrado   → 'cubo'      (em 2D o cubo "vira" um quadrado N×N
     *                              afetando o piso; o livro descreve cubo
     *                              como "quadrado que afeta também a altura")
     *
     * TODO (item separado do plano): Linha de efeito com barreiras —
     * o livro define que uma barreira sólida anula a linha de efeito
     * para alvos/áreas. Hoje as áreas atravessam paredes; implementar
     * checagem de bloqueadores é um item dedicado, não cabe nesta PR.
     */
    /**
     * Converte uma string de alcance em quadrados.
     *
     * Aceita:
     *   - número puro de metros: "30", "9.5"
     *   - número com unidade: "30m", "30 m", "30 metros"
     *   - alcances nomeados: "toque", "curto", "medio"/"médio", "longo", "ilimitado"
     *   - termos sinônimos de adjacente: "corpo a corpo", "adjacente", "1"
     *   - vazio: retorna fallback (1 quadrado, corpo a corpo) com aviso no log.
     *
     * Retorno: número de quadrados (Infinity para "ilimitado").
     */
    function parseAlcanceAtaque(valor) {
        const raw = String(valor || '').trim();
        if (!raw) {
            console.warn('[Mesa de Jogo] Alcance vazio — usando 1 quadrado (corpo a corpo) como fallback.');
            return 1;
        }
        const norm = normalizeText(raw);

        // Adjacente / corpo a corpo / toque
        if (norm === '' || norm === '1' || norm === 'toque' || norm === 'adjacente'
            || norm.includes('corpo a corpo') || norm.includes('adjacent')) {
            return 1;
        }
        if (norm === 'ilimitado' || norm === 'infinito' || norm === 'sem limite') {
            return Infinity;
        }

        // Categorias nomeadas — usam a tabela canônica de regras-distancia.js.
        if (window.PindoramaRegras && window.PindoramaRegras.alcance) {
            const cat = window.PindoramaRegras.alcance(
                norm.replace('é', 'e').replace('í', 'i')
            );
            if (cat && Number.isFinite(cat.quadrados)) return Math.max(1, cat.quadrados);
            if (cat && cat.quadrados === Infinity) return Infinity;
        }

        // Metros explícitos: "30m", "30 m", "30 metros", "30,5 m"
        const mMetros = norm.match(/(\d+(?:[.,]\d+)?)\s*(m|metros?|mt)\b/);
        if (mMetros) {
            const metros = Number(mMetros[1].replace(',', '.'));
            if (window.PindoramaRegras && window.PindoramaRegras.metrosParaQuadrados) {
                return Math.max(1, window.PindoramaRegras.metrosParaQuadrados(metros));
            }
            return Math.max(1, Math.ceil(metros / 1.5));
        }

        // Quadrados explícitos: "20 quadrados", "20 qd"
        const mQd = norm.match(/(\d+)\s*(quadrados?|qd)\b/);
        if (mQd) return Math.max(1, parseInt(mQd[1], 10));

        // Apenas um número: assume metros (convenção do livro).
        const mNum = norm.match(/^(\d+(?:[.,]\d+)?)$/);
        if (mNum) {
            const metros = Number(mNum[1].replace(',', '.'));
            return Math.max(1, Math.ceil(metros / 1.5));
        }

        console.warn('[Mesa de Jogo] Alcance não reconhecido:', valor, '— usando 1 quadrado como fallback.');
        return 1;
    }

    /** Helper público — devolve o alcance em quadrados de um ataque/equipamento. */
    function getAttackRangeSquares(action) {
        return parseAlcanceAtaque(action && action.alcance);
    }

    function parseAreaShape(alcance) {
        const raw = String(alcance || '');
        const norm = normalizeText(raw);
        // Match nos novos valores chaveados (cubo-3, cone-9, raio-6, linha-15,
        // quadrado-3, cilindro-6, esfera-6).
        const m = raw.match(/^(cubo|quadrado|cone|raio|esfera|cilindro|linha)-([\d.]+)$/i);
        if (m) {
            const rawTipo = m[1].toLowerCase();
            const tipo = aliasFormaArea(rawTipo);
            const valor = Number(m[2]);
            return { tipo, tamanho: areaSquaresFromMeters(tipo, valor) };
        }
        if (norm.includes('cubo') || norm.includes('quadrado')) {
            return { tipo: 'cubo', tamanho: norm.includes('3') ? 2 : 1 };
        }
        if (norm.includes('cone')) {
            const m9 = norm.includes('9');
            const m6 = norm.includes('6');
            return { tipo: 'cone', tamanho: m9 ? 6 : (m6 ? 4 : 3) };
        }
        if (norm.includes('raio') || norm.includes('esfera') || norm.includes('cilindro')) {
            const m6 = norm.includes('6');
            const m3 = norm.includes('3');
            return { tipo: 'raio', tamanho: m6 ? 4 : (m3 ? 2 : 1) };
        }
        if (norm.includes('linha')) {
            return { tipo: 'linha', tamanho: 10 };
        }
        // Alcance simples (sem forma) — delega para o parser unificado.
        return { tipo: 'simples', tamanho: parseAlcanceAtaque(raw) };
    }

    /* Resolve aliases de forma do livro para o tipo interno (ver doc do
       parseAreaShape acima). */
    function aliasFormaArea(tipo) {
        switch (tipo) {
            case 'esfera':
            case 'cilindro':
                return 'raio';
            case 'quadrado':
                return 'cubo';
            default:
                return tipo;
        }
    }

    function areaSquaresFromMeters(tipo, metros) {
        // 1 quadrado = 1,5m. Converter metros em quadrados.
        const quadrados = Math.max(1, Math.round(Number(metros) / 1.5));
        return quadrados;
    }

    function getActionReachSquares(action) {
        const shape = parseAreaShape(action?.alcance);
        return shape.tamanho;
    }

    /**
     * Direções cardeais e diagonais como vetores unitários.
     * Pindorama: cada passo (cardeal ou diagonal) = 1 quadrado = 1,5m.
     */
    const DIR_VECTORS = {
        n: { dx: 0, dy: -1 },
        s: { dx: 0, dy: 1 },
        l: { dx: 1, dy: 0 },
        o: { dx: -1, dy: 0 },
        ne: { dx: 1, dy: -1 },
        no: { dx: -1, dy: -1 },
        se: { dx: 1, dy: 1 },
        so: { dx: -1, dy: 1 }
    };

    function addConeCells(cells, baseCol, baseRow, size, len, dir) {
        const v = DIR_VECTORS[dir] || DIR_VECTORS.n;
        const cx = baseCol + (size - 1) / 2;
        const cy = baseRow + (size - 1) / 2;
        const isDiagonal = v.dx !== 0 && v.dy !== 0;

        if (isDiagonal) {
            // Cone diagonal: triângulo retângulo preenchido no quadrante de v.
            // Apice na borda do token; pernas ao longo dos eixos cardeais.
            // Para um cone de N quadrados de profundidade, célula (dxStep, dyStep)
            // entra se dxStep + dyStep <= N + 1.
            // Total: 1+2+...+N = N(N+1)/2 células (10 para N=4).
            for (let dxStep = 1; dxStep <= len; dxStep++) {
                for (let dyStep = 1; dyStep <= len; dyStep++) {
                    if (dxStep + dyStep > len + 1) continue;
                    const c = Math.round(cx + v.dx * (size / 2 + dxStep - 0.5));
                    const r = Math.round(cy + v.dy * (size / 2 + dyStep - 0.5));
                    if (c < 0 || c >= state.cols || r < 0 || r >= state.rows) continue;
                    cells.add(occupiedKey(c, r));
                }
            }
            return;
        }

        // Cone cardeal: padrão Pindorama 1, 3, 3, 5, 5, 7, 7, 9, ...
        // Largura (ímpar) por passo k: width = 2 * floor(k/2) + 1
        // Para 6m (N=4): 1+3+3+5 = 12 células.
        // Distribuição simétrica em torno do eixo (offset -h..+h, h=(width-1)/2).
        const perp = { dx: -v.dy, dy: v.dx };
        for (let step = 1; step <= len; step++) {
            const ax = cx + v.dx * (size / 2 + step - 0.5);
            const ay = cy + v.dy * (size / 2 + step - 0.5);
            const width = 2 * Math.floor(step / 2) + 1;
            const half = (width - 1) / 2;
            for (let s = -half; s <= half; s++) {
                const c = Math.round(ax + perp.dx * s);
                const r = Math.round(ay + perp.dy * s);
                if (c < 0 || c >= state.cols || r < 0 || r >= state.rows) continue;
                cells.add(occupiedKey(c, r));
            }
        }
    }

    function addConeCellsFromOrigin(cells, originCol, originRow, len, dir) {
        const v = DIR_VECTORS[dir] || DIR_VECTORS.n;
        const isDiagonal = v.dx !== 0 && v.dy !== 0;

        if (isDiagonal) {
            for (let dxStep = 0; dxStep < len; dxStep++) {
                for (let dyStep = 0; dyStep < len; dyStep++) {
                    if (dxStep + dyStep > len - 1) continue;
                    const c = originCol + v.dx * dxStep;
                    const r = originRow + v.dy * dyStep;
                    if (c < 0 || c >= state.cols || r < 0 || r >= state.rows) continue;
                    cells.add(occupiedKey(c, r));
                }
            }
            return;
        }

        const perp = { dx: -v.dy, dy: v.dx };
        for (let step = 0; step < len; step++) {
            const ax = originCol + v.dx * step;
            const ay = originRow + v.dy * step;
            const width = 2 * Math.floor((step + 1) / 2) + 1;
            const half = (width - 1) / 2;
            for (let s = -half; s <= half; s++) {
                const c = ax + perp.dx * s;
                const r = ay + perp.dy * s;
                if (c < 0 || c >= state.cols || r < 0 || r >= state.rows) continue;
                cells.add(occupiedKey(c, r));
            }
        }
    }

    function addLineCells(cells, baseCol, baseRow, size, len, dir) {
        const v = DIR_VECTORS[dir] || DIR_VECTORS.n;
        const cx = baseCol + (size - 1) / 2;
        const cy = baseRow + (size - 1) / 2;
        for (let step = 1; step <= len; step++) {
            const c = Math.round(cx + v.dx * (size / 2 + step));
            const r = Math.round(cy + v.dy * (size / 2 + step));
            if (c < 0 || c >= state.cols || r < 0 || r >= state.rows) continue;
            cells.add(occupiedKey(c, r));
        }
    }

    function addLineCellsFromOrigin(cells, originCol, originRow, len, dir) {
        const v = DIR_VECTORS[dir] || DIR_VECTORS.n;
        for (let step = 0; step < len; step++) {
            const c = originCol + v.dx * step;
            const r = originRow + v.dy * step;
            if (c < 0 || c >= state.cols || r < 0 || r >= state.rows) continue;
            cells.add(occupiedKey(c, r));
        }
    }

    function addRadiusCells(cells, baseCol, baseRow, size, radius) {
        // Raio circular (Chebyshev distance) ao redor do token; exclui o próprio token
        const right = baseCol + size - 1;
        const bottom = baseRow + size - 1;
        for (let row = baseRow - radius; row <= bottom + radius; row++) {
            for (let col = baseCol - radius; col <= right + radius; col++) {
                if (col < 0 || col >= state.cols || row < 0 || row >= state.rows) continue;
                const insideToken = col >= baseCol && col <= right && row >= baseRow && row <= bottom;
                if (insideToken) continue;
                const dx = col < baseCol ? baseCol - col : (col > right ? col - right : 0);
                const dy = row < baseRow ? baseRow - row : (row > bottom ? row - bottom : 0);
                if (Math.max(dx, dy) <= radius) {
                    cells.add(occupiedKey(col, row));
                }
            }
        }
    }

    function addCubeCells(cells, baseCol, baseRow, size, lado) {
        // Cubo de lado N centrado adjacente ao token (na frente em todas as direções)
        addRadiusCells(cells, baseCol, baseRow, size, lado);
    }

    function buildReachCellsAt(baseCol, baseRow, sizeCells, radius) {
        const cells = new Set();
        const size = Math.max(1, Number(sizeCells || 1));
        const reach = Math.max(1, Number(radius || 1));
        const minCol = Math.max(0, baseCol - reach);
        const maxCol = Math.min(state.cols - 1, baseCol + size - 1 + reach);
        const minRow = Math.max(0, baseRow - reach);
        const maxRow = Math.min(state.rows - 1, baseRow + size - 1 + reach);
        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                const insideToken = col >= baseCol && col < baseCol + size && row >= baseRow && row < baseRow + size;
                const dx = col < baseCol ? baseCol - col : (col >= baseCol + size ? col - (baseCol + size - 1) : 0);
                const dy = row < baseRow ? baseRow - row : (row >= baseRow + size ? row - (baseRow + size - 1) : 0);
                if (!insideToken && Math.max(dx, dy) <= reach) {
                    cells.add(occupiedKey(col, row));
                }
            }
        }
        return cells;
    }

    function getTokenCells(token) {
        const cells = [];
        const size = Math.max(1, Number(token.sizeCells || 1));
        for (let row = token.row; row < token.row + size; row++) {
            for (let col = token.col; col < token.col + size; col++) {
                cells.push({ col, row });
            }
        }
        return cells;
    }

    function chooseAttackTarget(targets) {
        if (targets.length === 1) return targets[0];
        const options = targets.map((target, index) => `${index + 1}. ${target.name || 'Token'} (Defesa ${parseDefense(target)}, PV ${clampResource(target.pvAtual, target.pvMax)}/${target.pvMax || 0})`).join('\n');
        const raw = prompt(`Escolha o alvo:\n${options}`, '1');
        if (raw === null) return null;
        const index = Number(raw) - 1;
        return targets[index] || null;
    }

    function parseDefense(token) {
        const parsed = Number(String(token.defesa ?? '').match(/-?\d+/)?.[0]);
        return Number.isFinite(parsed) ? parsed : 10;
    }

    function applyDamageToToken(token, damage) {
        const max = numberOrNull(token.pvMax);
        if (max === null || max <= 0) return;
        const current = clampResource(token.pvAtual, max);
        token.pvAtual = clamp(current - damage, 0, max);
    }

    function parseAttackCount(item, text = '') {
        const explicit = Number(item.quantidadeAtaques ?? item.quantidade);
        if (Number.isFinite(explicit) && explicit > 0) return Math.round(explicit);
        const match = String(text || '').match(/^\s*(\d+)\s+/);
        return match ? Number(match[1]) : 1;
    }

    function parseAttackBonus(item) {
        const explicit = Number(item.bonusAtaque);
        if (Number.isFinite(explicit)) return explicit;
        const text = `${item.teste || ''} ${item.ataque || ''} ${item.bonus || ''} ${item.detalhe || ''} ${item.nome || ''}`;
        const match = String(text).match(/([+-]\s*\d+)/);
        return match ? Number(match[1].replace(/\s+/g, '')) : 0;
    }

    function parseDamageFormula(text) {
        const match = String(text || '').match(/(\d+)d(\d+)\s*([+-]\s*\d+)?/i);
        if (!match) return '';
        return `${match[1]}d${match[2]}${match[3] ? match[3].replace(/\s+/g, '') : ''}`;
    }

    function rollDamage(formula) {
        const match = String(formula || '').match(/(\d+)d(\d+)\s*([+-]\s*\d+)?/i);
        if (!match) return { total: 0, rollsText: '0', modifier: 0 };
        const count = Number(match[1]);
        const sides = Number(match[2]);
        const modifier = match[3] ? Number(match[3].replace(/\s+/g, '')) : 0;
        const rolls = [];
        for (let i = 0; i < count; i++) {
            rolls.push(rollDie(sides));
        }
        return {
            total: rolls.reduce((sum, value) => sum + value, 0) + modifier,
            rollsText: rolls.join('+'),
            modifier
        };
    }

    function rollDie(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }

    function closeTokenActionPanel() {
        els.actionPanel.hidden = true;
        els.actionPanel.classList.remove('is-attack-mode');
        hideActionPreview();
    }

    /**
     * Fecha incondicionalmente qualquer overlay/modal/painel da Mesa de
     * Jogo. Defensivo contra estado preso (bfcache, JS travou no meio
     * de uma abertura, etc.). Chamado no init e disponível para uso
     * manual via console (window.closeAllMesaOverlays).
     */
    function closeAllMesaOverlays() {
        const overlays = [
            'sceneryModal', 'tokenEditorModal', 'sheetWindow',
            'imageCropModal', 'adjustModal', 'confirm', 'result',
            'modal', 'actionPanel'
        ];
        for (const key of overlays) {
            if (els[key] && !els[key].hidden) els[key].hidden = true;
        }
        hideActionPreview();
        if (state.reachPreview) clearReachPreview(false);
    }
    window.closeAllMesaOverlays = closeAllMesaOverlays;

    // ----------------------------------------------------------------
    // Modal de confirmação de ação direcionada
    // ----------------------------------------------------------------

    function openAttackConfirmation(attacker, target, action) {
        if (!els.confirm) return;
        // Apenas o token da vez pode atacar (quando há iniciativa definida).
        if (state.turns.length && !isCurrentTurnToken(attacker.id)) {
            showCbToast(`${attacker.name || 'Token'} não está no turno atual.`);
            clearReachPreview();
            return;
        }
        const totalAttacks = action.quantidadeAtaques || parseAttackCount(action, action.nome) || 1;
        const attackIndex = getCurrentAttackIndex(action);
        // Bloqueio: ação padrão já gasta. Multi-ataque (índice > 1) reusa a mesma ação padrão já consumida.
        if (attackIndex === 1 && !canTakeStandardAction(attacker)) {
            const motivo = attacker.acaoCompletaUsada
                ? 'ação completa já gasta neste turno'
                : (attacker.dobroMovimento
                    ? 'segunda ação de movimento em uso — ação padrão indisponível'
                    : 'ação padrão da rodada já foi usada');
            showCbToast(`Não pode atacar: ${motivo}.`);
            clearReachPreview();
            return;
        }
        pendingAttack = { attacker, target, action, attackIndex, totalAttacks };

        const actionName = action ? getActionDisplayName(action) : 'este ataque';
        const attackerName = attacker.name || 'Atacante';
        const targetName = target.name || 'Alvo';
        els.confirmText.innerHTML =
            `Deseja usar o <strong>ataque ${escapeHtml(attackIndex)}/${escapeHtml(totalAttacks)}</strong> contra ` +
            `<strong>${escapeHtml(targetName)}</strong> com ` +
            `<strong>${escapeHtml(actionName)}</strong> de ` +
            `<strong>${escapeHtml(attackerName)}</strong>?`;

        // Thumbnail do alvo
        els.confirmTargetThumb.innerHTML = '';
        const targetImageSrc = resolveTokenImageSrc(target);
        if (targetImageSrc) {
            const img = document.createElement('img');
            img.src = targetImageSrc;
            img.alt = target.name || 'Alvo';
            img.draggable = false;
            applyTokenImageAdjustment(img, target.tokenImageAdjust ?? target.imageAdjust);
            els.confirmTargetThumb.appendChild(img);
        } else {
            els.confirmTargetThumb.textContent = getTokenInitials(target.name);
        }

        els.confirmTargetName.textContent = target.name || 'Alvo';

        const metaParts = [];
        const pvMax = numberOrNull(target.pvMax);
        if (pvMax !== null && pvMax > 0) {
            metaParts.push(`PV ${clampResource(target.pvAtual, pvMax)}/${pvMax}`);
        }
        const defesa = target.defesa ?? null;
        if (defesa !== null && defesa !== '') metaParts.push(`Defesa ${defesa}`);
        if (target.tipo) metaParts.push(target.tipo);
        els.confirmTargetMeta.textContent = metaParts.join(' • ');

        els.confirm.hidden = false;
    }

    function closeAttackConfirmation() {
        if (!els.confirm) return;
        els.confirm.hidden = true;
        pendingAttack = null;
        // Restaura UI single-target para o próximo uso
        if (els.confirmTargetSingle) els.confirmTargetSingle.hidden = false;
        if (els.confirmTargetsList) {
            els.confirmTargetsList.hidden = true;
            els.confirmTargetsList.innerHTML = '';
        }
    }

    function confirmPendingAttack() {
        if (!pendingAttack) return;
        if (pendingAttack.isArea) {
            confirmPendingAreaAttack();
            return;
        }
        const { attacker, target, action, attackIndex, totalAttacks } = pendingAttack;
        closeAttackConfirmation();

        // Consome a ação padrão na PRIMEIRA execução do ataque (mesmo que tenha
        // múltiplas iterações — todas pertencem à mesma ação padrão).
        if (attackIndex === 1) {
            consumeStandardAction(attacker, `ataque com ${getActionDisplayName(action)}`);
        }

        const result = rollSingleMeleeAttack(attacker, action, target, attackIndex);
        if (state.reachPreview && state.reachPreview.tokenId === attacker.id) {
            state.reachPreview.results.push(result);
            state.reachPreview.totalDamage += result.damageTotal || 0;
        }

        renderTokens();
        selectToken(attacker.id);
        saveState();

        if (attackIndex >= totalAttacks) {
            const results = state.reachPreview ? state.reachPreview.results.slice() : [result];
            const totalDamage = state.reachPreview ? state.reachPreview.totalDamage : (result.damageTotal || 0);
            clearReachPreview(true);
            closeTokenActionPanel();
            openAttackResultModal({
                attacker,
                target,
                actionName: getActionDisplayName(action),
                results,
                totalDamage
            });
        } else {
            renderBoard();
        }
    }

    function getCurrentAttackIndex(action) {
        if (!state.reachPreview || !state.reachPreview.action) return 1;
        if (state.reachPreview.actionKey !== actionKey(action)) return 1;
        return (state.reachPreview.results ? state.reachPreview.results.length : 0) + 1;
    }

    function openAttackResultModal(data) {
        if (!els.result || !els.resultBody) return;
        els.resultBody.innerHTML = '';

        const intro = document.createElement('section');
        intro.className = 'cb-result-summary';

        const title = document.createElement('h3');
        if (data.target) {
            title.textContent = `${data.attacker.name || 'Atacante'} atacou ${data.target.name || 'alvo'}`;
        } else {
            title.textContent = data.attacker ? `${data.attacker.name || 'Atacante'} preparou ${data.actionName}` : 'Resultado';
        }
        intro.appendChild(title);

        const subtitle = document.createElement('p');
        subtitle.textContent = data.message || `Ação: ${data.actionName}`;
        intro.appendChild(subtitle);
        els.resultBody.appendChild(intro);

        if (Array.isArray(data.results) && data.results.length) {
            const list = document.createElement('div');
            list.className = 'cb-result-rolls';

            for (const result of data.results) {
                const row = document.createElement('article');
                row.className = `cb-result-roll ${result.hit ? 'is-hit' : 'is-miss'}`;

                const die = document.createElement('div');
                die.className = 'cb-result-die';
                if (result.acertoAutomatico) {
                    die.innerHTML = `<span>auto</span><strong>★</strong>`;
                } else {
                    die.innerHTML = `<span>d20</span><strong>${result.d20}</strong>`;
                }
                row.appendChild(die);

                const info = document.createElement('div');
                info.className = 'cb-result-roll-info';

                const heading = document.createElement('h4');
                heading.textContent = `Ataque ${result.index} contra ${result.targetName || 'alvo'}`;
                info.appendChild(heading);

                const test = document.createElement('p');
                if (result.acertoAutomatico) {
                    test.textContent = `Acerto automático contra ${result.targetName || 'alvo'}`;
                } else {
                    test.textContent = `${result.d20} ${formatSignedBonus(result.attackBonus)} = ${result.total} contra Defesa ${result.defense}`;
                }
                info.appendChild(test);

                if (result.save) {
                    const saveLabel = ({ fortitude: 'Fortitude', reflexos: 'Reflexos', vontade: 'Vontade' })[result.save.tipo] || result.save.tipo;
                    const saveLine = document.createElement('p');
                    saveLine.className = 'cb-result-save';
                    saveLine.textContent = `Teste de ${saveLabel} do alvo: ${result.save.d20} ${formatSignedBonus(result.save.bonus)} = ${result.save.total} vs CD ${result.save.cd} → ${result.save.success ? 'sucesso (dano à metade)' : 'falha (dano completo)'}`;
                    info.appendChild(saveLine);
                }

                const outcome = document.createElement('strong');
                outcome.className = 'cb-result-outcome';
                if (result.hit) {
                    const tipoDanoLabel = result.damage?.tipoDano || 'dano';
                    if (result.acertoAutomatico && result.save && result.save.success) {
                        outcome.textContent = `Acertou: ${result.damage.rollsText}${formatSignedBonus(result.damage.modifier)} = ${result.damageFull} → reduzido a ${result.damageTotal} ${tipoDanoLabel}`;
                    } else {
                        outcome.textContent = `Acertou: ${result.damage.rollsText}${formatSignedBonus(result.damage.modifier)} = ${result.damageTotal} ${tipoDanoLabel}`;
                    }
                } else {
                    outcome.textContent = 'Errou';
                }
                info.appendChild(outcome);

                row.appendChild(info);
                list.appendChild(row);
            }

            els.resultBody.appendChild(list);
        }

        if (data.target) {
            const footer = document.createElement('section');
            footer.className = 'cb-result-total';
            footer.innerHTML = `
                <span>Dano total</span>
                <strong>${escapeHtml(data.totalDamage)}</strong>
                <em>PV de ${escapeHtml(data.target.name || 'alvo')}: ${escapeHtml(data.pvAtual)}/${escapeHtml(data.pvMax)}</em>
            `;
            els.resultBody.appendChild(footer);
        } else if (Array.isArray(data.results) && data.results.length) {
            const footer = document.createElement('section');
            footer.className = 'cb-result-total';
            const affected = data.results
                .map(result => `${result.targetName}: ${result.pvAtual}/${result.pvMax}`)
                .filter(Boolean)
                .join(' • ');
            footer.innerHTML = `
                <span>Dano total</span>
                <strong>${escapeHtml(data.totalDamage)}</strong>
                <em>${escapeHtml(affected || 'Sem dano aplicado')}</em>
            `;
            els.resultBody.appendChild(footer);
        }

        els.result.hidden = false;
        if (data.actionName || data.message) {
            addLog({
                title: data.actionName || 'Resultado',
                detail: data.target
                    ? `${data.attacker?.name || 'Atacante'} contra ${data.target.name || 'alvo'}: ${data.totalDamage || 0} de dano`
                    : (data.message || `Total ${data.totalDamage || 0}`)
            });
        }
    }

    function closeAttackResultModal() {
        if (!els.result) return;
        els.result.hidden = true;
    }

    // ----------------------------------------------------------------
    // Barra lateral, ficha flutuante, editor de token, rolagens e turno
    // ----------------------------------------------------------------

    function setSidebarTab(tab) {
        state.activeSidebarTab = tab || 'registro';
        els.sidebarTabs.forEach(btn => btn.classList.toggle('is-active', btn.dataset.tab === state.activeSidebarTab));
        els.sidebarPanels.forEach(panel => panel.classList.toggle('is-active', panel.dataset.panel === state.activeSidebarTab));
        if (state.activeSidebarTab === 'personagens') ensureSidebarFichas();
        if (state.activeSidebarTab === 'bestiario') ensureSidebarBestiary();
        if (state.activeSidebarTab === 'tokens') renderSidebarTokens();
        if (state.activeSidebarTab === 'iniciativa') renderTurnList();
        saveState();
    }

    async function ensureSidebarFichas(force = false) {
        if (!els.sidebarFichas) return;
        if (state.fichasLoaded && !force) {
            renderSidebarFichas();
            return;
        }
        els.sidebarFichas.innerHTML = '<p class="cb-sidebar-empty">Carregando fichas...</p>';
        try {
            const resp = await fetch('listar-fichas.php', { credentials: 'same-origin', cache: 'no-store' });
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const data = await resp.json();
            state.fichas = Array.isArray(data) ? data : [];
            state.fichasLoaded = true;
            renderSidebarFichas();
        } catch (_) {
            els.sidebarFichas.innerHTML = '<p class="cb-sidebar-empty">Não foi possível carregar fichas.</p>';
        }
    }

    async function ensureSidebarBestiary(force = false) {
        if (!els.sidebarBestiary) return;
        if (state.bestiarioLoaded && !force) {
            renderSidebarBestiary();
            return;
        }
        els.sidebarBestiary.innerHTML = '<p class="cb-sidebar-empty">Carregando bestiário...</p>';
        try {
            const resp = await fetch('data/bestiario.json', { credentials: 'same-origin', cache: 'no-store' });
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const data = await resp.json();
            loadBestiaryData(data);
            state.bestiarioLoaded = true;
            renderSidebarBestiary();
        } catch (_) {
            els.sidebarBestiary.innerHTML = '<p class="cb-sidebar-empty">Não foi possível carregar o bestiário.</p>';
        }
    }

    function renderSidebarFichas() {
        if (!els.sidebarFichas) return;
        const q = normalizeText(els.sidebarFichaSearch?.value || '');
        const items = state.fichas.filter(f => !q || normalizeText([f.personagem, f.participante, f.classe, f.nivel].filter(Boolean).join(' ')).includes(q));
        els.sidebarFichas.innerHTML = '';
        if (!items.length) {
            els.sidebarFichas.innerHTML = '<p class="cb-sidebar-empty">Nenhuma ficha encontrada.</p>';
            return;
        }
        const frag = document.createDocumentFragment();
        for (const ficha of items.slice(0, 80)) {
            frag.appendChild(buildSidebarEntityRow({
                name: ficha.personagem || 'Sem nome',
                meta: [ficha.classe, ficha.nivel ? `Nv ${ficha.nivel}` : '', ficha.participante].filter(Boolean).join(' • '),
                image: ficha.personagem_token_imagem || ficha.personagem_imagem,
                onOpen: () => openSheetWindow(ficha.id, ficha.personagem || 'Ficha'),
                onAdd: () => onFichaPicked(ficha)
            }));
        }
        els.sidebarFichas.appendChild(frag);
    }

    function renderSidebarBestiary() {
        if (!els.sidebarBestiary) return;
        const q = normalizeText(els.sidebarBestiarySearch?.value || '');
        const items = state.bestiario.filter(criatura => {
            const token = montarTokenCriatura(criatura);
            const hay = normalizeText([criatura.nome, criatura.nomeAlternativo, token.tipo, token.tamanho, token.bioma, token.papelTatico].filter(Boolean).join(' '));
            return !q || hay.includes(q);
        });
        els.sidebarBestiary.innerHTML = '';
        if (!items.length) {
            els.sidebarBestiary.innerHTML = '<p class="cb-sidebar-empty">Nenhuma criatura encontrada.</p>';
            return;
        }
        const frag = document.createDocumentFragment();
        for (const criatura of items.slice(0, 80)) {
            const token = montarTokenCriatura(criatura);
            frag.appendChild(buildSidebarEntityRow({
                name: criatura.nome || 'Criatura',
                meta: [`ND ${token.nd ?? '—'}`, token.tipo, token.tamanho].filter(Boolean).join(' • '),
                image: token.imagem,
                onOpen: () => openBestiarySheetWindow(criatura),
                onAdd: () => onBestiaryPicked(criatura)
            }));
        }
        els.sidebarBestiary.appendChild(frag);
    }

    function buildSidebarEntityRow({ name, meta, image, onOpen, onAdd }) {
        const row = document.createElement('article');
        row.className = 'cb-sidebar-row';
        const thumb = document.createElement('div');
        thumb.className = 'cb-sidebar-thumb';
        if (image) {
            const img = document.createElement('img');
            img.src = resolveImage(image);
            img.alt = name;
            img.loading = 'lazy';
            img.onerror = () => { img.remove(); thumb.textContent = getTokenInitials(name); };
            thumb.appendChild(img);
        } else {
            thumb.textContent = getTokenInitials(name);
        }
        row.appendChild(thumb);
        const info = document.createElement('button');
        info.type = 'button';
        info.className = 'cb-sidebar-row-info';
        info.innerHTML = `<strong>${escapeHtml(name)}</strong><span>${escapeHtml(meta || '')}</span>`;
        info.addEventListener('click', onOpen);
        row.appendChild(info);
        const add = document.createElement('button');
        add.type = 'button';
        add.className = 'cb-sidebar-add';
        add.textContent = 'Adicionar';
        add.addEventListener('click', onAdd);
        row.appendChild(add);
        return row;
    }

    function renderSidebarTokens() {
        if (!els.sidebarTokens) return;
        els.sidebarTokens.innerHTML = '';
        if (!state.tokens.length) {
            els.sidebarTokens.innerHTML = '<p class="cb-sidebar-empty">Nenhum token no mapa.</p>';
            return;
        }
        const frag = document.createDocumentFragment();
        for (const token of state.tokens) {
            const row = buildSidebarEntityRow({
                name: token.name || 'Token',
                meta: [`${tokenWidthCells(token)}x${tokenHeightCells(token)}`, layerLabel(token.layer), resourceSummary(token)].filter(Boolean).join(' • '),
                image: resolveTokenImageSrc(token),
                onOpen: () => {
                    selectToken(token.id);
                    openLinkedSheetOrEditor(token);
                },
                onAdd: () => duplicateToken(token.id)
            });
            row.classList.toggle('is-selected', token.id === state.selectedId);
            frag.appendChild(row);
        }
        els.sidebarTokens.appendChild(frag);
    }

    function renderSelectedTokenTools() {
        if (!els.selectedTokenTools) return;
        const token = state.tokens.find(t => t.id === state.selectedId);
        if (!token) {
            els.selectedTokenTools.innerHTML = '<p class="cb-sidebar-empty">Selecione um token para ver ações rápidas.</p>';
            if (els.editSelectedToken) els.editSelectedToken.disabled = true;
            return;
        }
        if (els.editSelectedToken) els.editSelectedToken.disabled = false;
        els.selectedTokenTools.innerHTML = '';
        // Sub-fase D: status de deslocamento (vai antes das ações).
        els.selectedTokenTools.appendChild(buildMovementStatusSection(token));
        const actions = [
            ['Abrir ficha', () => openLinkedSheetOrEditor(token)],
            ['Editar token', () => openTokenEditor(token.id)],
            ['Duplicar', () => duplicateToken(token.id)],
            ['Iniciativa', () => addSelectedTokenToTurns()],
            ['Camada mestre', () => moveTokenToLayer(token.id, 'mestre')],
            ['Camada tokens', () => moveTokenToLayer(token.id, 'tokens')],
            ['Remover', () => removeSelectedToken()]
        ];
        for (const [label, handler] of actions) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = label;
            btn.addEventListener('click', handler);
            els.selectedTokenTools.appendChild(btn);
        }
        els.selectedTokenTools.appendChild(buildTacticalConditionsSection(token));
        els.selectedTokenTools.appendChild(buildSaveTestsSection(token));
        const terrainBlock = buildTerrainBonusSuggestion(token);
        if (terrainBlock) els.selectedTokenTools.appendChild(terrainBlock);
        els.selectedTokenTools.appendChild(buildDamageApplicationSection(token));
        els.selectedTokenTools.appendChild(buildManeuverSection(token));
    }

    // Sub-fase D: status de deslocamento da rodada para o token selecionado.
    // Mostra usado/total, permite ao facilitador editar manualmente e
    // zerar com um clique. Não bloqueia movimento — é só orientativo.
    function buildMovementStatusSection(token) {
        const wrap = document.createElement('div');
        wrap.className = 'cb-movement-section';

        const total = tokenDeslocamentoQuadrados(token);
        const usado = Number.isFinite(token.movimentoUsado) ? token.movimentoUsado : 0;
        const restante = Math.max(0, total - usado);
        const totalMetros = window.PindoramaRegras
            ? window.PindoramaRegras.quadradosParaMetros(total)
            : total * 1.5;

        const title = document.createElement('h3');
        title.className = 'cb-movement-title';
        title.textContent = 'Deslocamento';
        wrap.appendChild(title);

        const status = document.createElement('p');
        status.className = 'cb-movement-status' + (usado > total ? ' is-over' : '');
        const restanteFmt = `<strong>${restante}</strong>`;
        const totalFmt = `<strong>${total}</strong>`;
        const palavraQd = total === 1 ? 'quadrado' : 'quadrados';
        const palavraRest = restante === 1 ? 'restante' : 'restantes';
        status.innerHTML = `${restanteFmt} de ${totalFmt} ${palavraQd} ${palavraRest}`
            + ` <span class="cb-movement-meta">(${total} qd ≈ ${totalMetros} m por rodada)</span>`;
        wrap.appendChild(status);

        const controls = document.createElement('div');
        controls.className = 'cb-movement-controls';

        const usedLabel = document.createElement('label');
        usedLabel.className = 'cb-movement-input';
        usedLabel.appendChild(document.createTextNode('Usado'));
        const usedInput = document.createElement('input');
        usedInput.type = 'number';
        usedInput.min = '0';
        usedInput.step = '1';
        usedInput.value = String(usado);
        usedInput.title = 'Edite manualmente o deslocamento já gasto na rodada (uso do facilitador).';
        usedInput.addEventListener('change', () => {
            const v = Math.max(0, Math.round(Number(usedInput.value) || 0));
            if (v === (Number.isFinite(token.movimentoUsado) ? token.movimentoUsado : 0)) return;
            token.movimentoUsado = v;
            addLog({
                title: 'Deslocamento ajustado',
                detail: `${token.name || 'Token'}: gasto definido para ${v}/${total}.`
            });
            renderBoard();
            renderSelectedTokenTools();
            saveState();
        });
        usedLabel.appendChild(usedInput);
        controls.appendChild(usedLabel);

        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'cb-movement-reset';
        resetBtn.textContent = 'Zerar';
        resetBtn.title = 'Zera o deslocamento gasto deste token (sem afetar os outros).';
        resetBtn.addEventListener('click', () => {
            if ((Number.isFinite(token.movimentoUsado) ? token.movimentoUsado : 0) === 0) return;
            token.movimentoUsado = 0;
            addLog({
                title: 'Deslocamento zerado',
                detail: `${token.name || 'Token'}: gasto zerado pelo facilitador.`
            });
            renderBoard();
            renderSelectedTokenTools();
            saveState();
        });
        controls.appendChild(resetBtn);

        wrap.appendChild(controls);
        return wrap;
    }

    /* Bloco "Manobra de combate" no painel do token selecionado.
       Implementa a estrutura formal de teste oposto descrita em
       "Manobras de Combate" do livro Pindorama: atacante e alvo
       rolam d20 + bônus, vencedor pela maior soma (empate desempata
       pelo maior bônus; se ainda empatado, narrador rola de novo).
       NÃO aplica efeito automático — apenas registra o resultado
       estruturado no log para o narrador decidir consequências. */
    function buildManeuverSection(attacker) {
        const wrap = document.createElement('div');
        wrap.className = 'cb-maneuver-section';

        const title = document.createElement('h3');
        title.className = 'cb-maneuver-title';
        title.textContent = 'Manobra de combate (teste oposto)';
        wrap.appendChild(title);

        const hint = document.createElement('p');
        hint.className = 'cb-maneuver-hint';
        hint.textContent = 'Rola d20 + bônus dos dois lados. Maior soma vence; empate desempata pelo bônus. Sem efeito automático — narrador decide a consequência.';
        wrap.appendChild(hint);

        // Outros tokens da cena (possíveis alvos)
        const outros = state.tokens.filter(t => t.id !== attacker.id);
        if (!outros.length) {
            const empty = document.createElement('p');
            empty.className = 'cb-maneuver-empty';
            empty.textContent = 'Adicione outro token na cena para realizar uma manobra.';
            wrap.appendChild(empty);
            return wrap;
        }

        // Linha 1: manobra + alvo
        const topRow = document.createElement('div');
        topRow.className = 'cb-maneuver-top';

        const manobraLabel = document.createElement('label');
        manobraLabel.className = 'cb-maneuver-field';
        manobraLabel.appendChild(document.createTextNode('Manobra'));
        const manobraSelect = document.createElement('select');
        for (const m of COMBAT_MANEUVERS) {
            const opt = document.createElement('option');
            opt.value = m.key;
            opt.textContent = m.label;
            manobraSelect.appendChild(opt);
        }
        manobraLabel.appendChild(manobraSelect);
        topRow.appendChild(manobraLabel);

        const alvoLabel = document.createElement('label');
        alvoLabel.className = 'cb-maneuver-field';
        alvoLabel.appendChild(document.createTextNode('Alvo'));
        const alvoSelect = document.createElement('select');
        for (const t of outros) {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = t.name || ('Token #' + t.id.slice(-4));
            alvoSelect.appendChild(opt);
        }
        alvoLabel.appendChild(alvoSelect);
        topRow.appendChild(alvoLabel);
        wrap.appendChild(topRow);

        // Linha 2: bônus atacante / alvo (auto-preenchidos, editáveis)
        const bonusRow = document.createElement('div');
        bonusRow.className = 'cb-maneuver-bonus-row';

        const atkBonusLabel = document.createElement('label');
        atkBonusLabel.className = 'cb-maneuver-field';
        const atkBonusText = document.createElement('span');
        atkBonusText.className = 'cb-maneuver-bonus-text';
        atkBonusLabel.appendChild(atkBonusText);
        const atkBonusInput = document.createElement('input');
        atkBonusInput.type = 'number';
        atkBonusLabel.appendChild(atkBonusInput);
        bonusRow.appendChild(atkBonusLabel);

        const defBonusLabel = document.createElement('label');
        defBonusLabel.className = 'cb-maneuver-field';
        const defBonusText = document.createElement('span');
        defBonusText.className = 'cb-maneuver-bonus-text';
        defBonusLabel.appendChild(defBonusText);
        const defBonusInput = document.createElement('input');
        defBonusInput.type = 'number';
        defBonusLabel.appendChild(defBonusInput);
        bonusRow.appendChild(defBonusLabel);
        wrap.appendChild(bonusRow);

        // Resumo + botão rolar
        const result = document.createElement('p');
        result.className = 'cb-maneuver-result';
        result.setAttribute('aria-live', 'polite');

        const rollBtn = document.createElement('button');
        rollBtn.type = 'button';
        rollBtn.className = 'cb-maneuver-roll-btn';
        rollBtn.textContent = 'Rolar teste oposto';
        wrap.appendChild(rollBtn);
        wrap.appendChild(result);

        // Atualiza bônus default quando manobra ou alvo mudam
        function refreshDefaults() {
            const manobra = COMBAT_MANEUVERS.find(m => m.key === manobraSelect.value);
            if (!manobra) return;
            const alvo = state.tokens.find(t => t.id === alvoSelect.value);
            const atkBonus = parsePericiaBonus(attacker, manobra.atkSkill);
            const defBonus = alvo ? parsePericiaBonus(alvo, manobra.defSkill) : 0;
            atkBonusText.textContent = (attacker.name || 'Atacante') + ' (' + rotuloPericia(manobra.atkSkill) + ')';
            defBonusText.textContent = (alvo?.name || 'Alvo') + ' (' + rotuloPericia(manobra.defSkill) + ')';
            atkBonusInput.value = String(atkBonus);
            defBonusInput.value = String(defBonus);
        }

        manobraSelect.addEventListener('change', refreshDefaults);
        alvoSelect.addEventListener('change', refreshDefaults);
        refreshDefaults();

        rollBtn.addEventListener('click', () => {
            const manobra = COMBAT_MANEUVERS.find(m => m.key === manobraSelect.value);
            const alvo = state.tokens.find(t => t.id === alvoSelect.value);
            if (!manobra || !alvo) return;
            const atkBonus = Number(atkBonusInput.value) || 0;
            const defBonus = Number(defBonusInput.value) || 0;
            const r = rollOpposedTest(atkBonus, defBonus);

            const sinalAtk = r.atkBonus >= 0 ? '+' + r.atkBonus : String(r.atkBonus);
            const sinalDef = r.defBonus >= 0 ? '+' + r.defBonus : String(r.defBonus);
            const linhaAtk = (attacker.name || 'Atacante') + ': d20 ' + r.atkD20 + ' ' + sinalAtk + ' = ' + r.atkTotal;
            const linhaDef = (alvo.name || 'Alvo') + ': d20 ' + r.defD20 + ' ' + sinalDef + ' = ' + r.defTotal;

            let veredito;
            if (r.winner === 'atacante') {
                veredito = (attacker.name || 'Atacante') + ' VENCE por ' + Math.abs(r.diferenca);
            } else if (r.winner === 'alvo') {
                veredito = (alvo.name || 'Alvo') + ' VENCE por ' + Math.abs(r.diferenca);
            } else {
                veredito = 'EMPATE — narrador rola novamente entre eles.';
            }

            const detalheLog = manobra.label + ' · ' + linhaAtk + ' · ' + linhaDef + ' → ' + veredito;
            addLog({ title: 'Manobra: ' + manobra.label, detail: detalheLog });

            result.classList.toggle('is-pass', r.winner === 'atacante');
            result.classList.toggle('is-fail', r.winner === 'alvo');
            result.classList.toggle('is-tie', r.winner === 'empate-real');
            result.textContent = '↳ ' + veredito;
        });

        return wrap;
    }

    /* Heurística para ler a RD (Redução de Dano) do token a partir de
       chaves possíveis na ficha. Usado como default no painel de
       aplicação faseada de dano — o narrador sempre pode sobrescrever. */
    function parseRD(token) {
        if (!token) return 0;
        const candidates = ['rd', 'reducaoDano', 'reducao_dano', 'reducao', 'damageReduction'];
        for (const k of candidates) {
            const v = token[k];
            if (v !== undefined && v !== null && v !== '') {
                const n = Number(String(v).match(/\d+/)?.[0]);
                if (Number.isFinite(n) && n >= 0) return n;
            }
        }
        return 0;
    }

    /* Bloco "Aplicação faseada de dano" no painel do token selecionado.
       Fluxo do livro Pindorama (ordem das clarificações de regras):
           1. Teste de resistência (anula / metade / parcial / nada)
           2. Metade adicional (habilidades como Durão)
           3. Redução de Dano (RD)
       Sempre exige confirmação manual antes de aplicar — só `Aplicar`
       chama `applyDamageToToken`. Tudo entra no log. */
    function buildDamageApplicationSection(token) {
        const wrap = document.createElement('div');
        wrap.className = 'cb-damage-section';

        const title = document.createElement('h3');
        title.className = 'cb-damage-title';
        title.textContent = 'Aplicação faseada de dano';
        wrap.appendChild(title);

        const hint = document.createElement('p');
        hint.className = 'cb-damage-hint';
        hint.textContent = 'Bruto → resistência → metade adicional → RD. PV só muda depois de "Aplicar".';
        wrap.appendChild(hint);

        // Linha de input do dano + botão Rolar
        const formulaRow = document.createElement('div');
        formulaRow.className = 'cb-damage-formula-row';
        const formulaLabel = document.createElement('label');
        formulaLabel.className = 'cb-damage-formula-label';
        formulaLabel.appendChild(document.createTextNode('Dano (fórmula ou nº)'));
        const formulaInput = document.createElement('input');
        formulaInput.type = 'text';
        formulaInput.value = '1d8';
        formulaInput.placeholder = 'ex: 2d6+3';
        formulaLabel.appendChild(formulaInput);
        formulaRow.appendChild(formulaLabel);
        const rollBtn = document.createElement('button');
        rollBtn.type = 'button';
        rollBtn.className = 'cb-damage-roll-btn';
        rollBtn.textContent = 'Rolar';
        formulaRow.appendChild(rollBtn);
        wrap.appendChild(formulaRow);

        // Painel de preview (oculto até o primeiro roll)
        const preview = document.createElement('div');
        preview.className = 'cb-damage-preview';
        preview.hidden = true;
        wrap.appendChild(preview);

        // Resultado do save
        const saveLabel = document.createElement('label');
        saveLabel.className = 'cb-damage-field';
        saveLabel.appendChild(document.createTextNode('Resultado da resistência'));
        const saveSelect = document.createElement('select');
        const saveOpts = [
            ['nenhuma', 'Sem teste de resistência'],
            ['nada', 'Falhou — sofre dano cheio'],
            ['metade', 'Passou — reduz à metade'],
            ['parcial', 'Passou — efeito parcial (≈ metade)'],
            ['anula', 'Passou — anula o dano'],
            ['desacredita', 'Desacredita (ilusão) — sem dano']
        ];
        for (const [v, t] of saveOpts) {
            const opt = document.createElement('option');
            opt.value = v;
            opt.textContent = t;
            saveSelect.appendChild(opt);
        }
        saveLabel.appendChild(saveSelect);
        preview.appendChild(saveLabel);

        // Metade adicional (Durão etc.)
        const halfRow = document.createElement('label');
        halfRow.className = 'cb-damage-checkbox';
        const halfBox = document.createElement('input');
        halfBox.type = 'checkbox';
        halfRow.appendChild(halfBox);
        halfRow.appendChild(document.createTextNode(' Metade adicional (ex.: Durão)'));
        preview.appendChild(halfRow);

        // RD
        const rdLabel = document.createElement('label');
        rdLabel.className = 'cb-damage-field';
        rdLabel.appendChild(document.createTextNode('Redução de Dano (RD)'));
        const rdInput = document.createElement('input');
        rdInput.type = 'number';
        rdInput.min = '0';
        rdInput.value = String(parseRD(token));
        rdLabel.appendChild(rdInput);
        preview.appendChild(rdLabel);

        // Resumo das fases
        const summary = document.createElement('ul');
        summary.className = 'cb-damage-summary';
        preview.appendChild(summary);

        // Botões finais
        const buttons = document.createElement('div');
        buttons.className = 'cb-damage-buttons';
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'cb-damage-cancel-btn';
        cancelBtn.textContent = 'Cancelar';
        buttons.appendChild(cancelBtn);
        const applyBtn = document.createElement('button');
        applyBtn.type = 'button';
        applyBtn.className = 'cb-damage-apply-btn';
        applyBtn.textContent = 'Aplicar';
        buttons.appendChild(applyBtn);
        preview.appendChild(buttons);

        // Estado interno do painel
        let lastRoll = null;        // { total, rollsText }
        let resumoFases = [];       // entradas humanas para o log
        let danoFinal = 0;

        function recalcular() {
            if (!lastRoll) return;
            const bruto = Math.max(0, Number(lastRoll.total) || 0);
            const saveTipo = saveSelect.value;
            const halfExtra = !!halfBox.checked;
            const rd = Math.max(0, Number(rdInput.value) || 0);

            let dano = bruto;
            const fases = [];
            fases.push('Bruto: ' + bruto + ' (' + lastRoll.rollsText + ')');

            if (saveTipo === 'anula' || saveTipo === 'desacredita') {
                fases.push('Resistência (' + saveTipo + '): dano anulado → 0');
                dano = 0;
            } else if (saveTipo === 'metade' || saveTipo === 'parcial') {
                const before = dano;
                dano = Math.floor(dano / 2);
                fases.push('Resistência (' + saveTipo + '): ' + before + ' / 2 = ' + dano);
            } else if (saveTipo === 'nada') {
                fases.push('Resistência: falhou — sofre cheio (' + dano + ')');
            } else {
                fases.push('Sem teste de resistência');
            }

            if (halfExtra && dano > 0) {
                const before = dano;
                dano = Math.floor(dano / 2);
                fases.push('Metade adicional (Durão etc.): ' + before + ' / 2 = ' + dano);
            }

            if (rd > 0 && dano > 0) {
                const before = dano;
                dano = Math.max(0, dano - rd);
                fases.push('RD ' + rd + ': ' + before + ' − ' + rd + ' = ' + dano);
            }

            const pvMax = Number(token.pvMax) || 0;
            const pvAtual = clampResource(token.pvAtual, pvMax);
            const pvDepois = pvMax > 0
                ? clamp(pvAtual - dano, 0, pvMax)
                : pvAtual - dano;
            fases.push('PV: ' + pvAtual + (pvMax ? ('/' + pvMax) : '') + ' → ' + pvDepois + (pvMax ? ('/' + pvMax) : ''));

            summary.innerHTML = '';
            for (const linha of fases) {
                const li = document.createElement('li');
                li.textContent = linha;
                summary.appendChild(li);
            }
            resumoFases = fases;
            danoFinal = dano;
            applyBtn.textContent = 'Aplicar (−' + dano + ' PV)';
            applyBtn.disabled = (pvMax > 0 && pvAtual === 0 && dano === 0);
        }

        rollBtn.addEventListener('click', () => {
            const formula = String(formulaInput.value || '').trim();
            if (!formula) {
                alert('Informe um número (ex.: 12) ou uma fórmula (ex.: 2d6+3).');
                return;
            }
            // Número fixo
            if (/^\d+$/.test(formula)) {
                lastRoll = { total: Number(formula), rollsText: formula };
            } else {
                const r = rollDamage(formula);
                if (!r.total && r.rollsText === '0') {
                    alert('Fórmula inválida. Use algo como "2d6+3" ou um número.');
                    return;
                }
                lastRoll = r;
            }
            preview.hidden = false;
            recalcular();
        });

        saveSelect.addEventListener('change', recalcular);
        halfBox.addEventListener('change', recalcular);
        rdInput.addEventListener('input', recalcular);

        cancelBtn.addEventListener('click', () => {
            lastRoll = null;
            preview.hidden = true;
        });

        applyBtn.addEventListener('click', () => {
            if (!lastRoll) return;
            const dano = Math.max(0, Number(danoFinal) || 0);
            applyDamageToToken(token, dano);
            addLog({
                title: 'Dano aplicado',
                detail: (token.name || 'Token') + ' — ' + resumoFases.join(' · ')
            });
            renderTokens();
            saveState();
            // Re-renderiza o painel para refletir o novo PV no preview futuro
            renderSelectedTokenTools();
        });

        return wrap;
    }

    /* Bloco "Testes de resistência" no painel do token selecionado.
       O narrador digita uma CD, escolhe Fortitude / Reflexos / Vontade
       e o token rola d20 + bônus do próprio save (vindo da ficha ou
       atributo correspondente). Resultado é registrado no log e
       mostrado num resumo discreto. Não toca em PV, PM, condições. */
    function buildSaveTestsSection(token) {
        const wrap = document.createElement('div');
        wrap.className = 'cb-save-section';

        const title = document.createElement('h3');
        title.className = 'cb-save-title';
        title.textContent = 'Testes de resistência';
        wrap.appendChild(title);

        const hint = document.createElement('p');
        hint.className = 'cb-save-hint';
        hint.textContent = 'Digite a CD e role o save do alvo. Não altera PV (aplicação de dano fica para passo seguinte).';
        wrap.appendChild(hint);

        const cdRow = document.createElement('label');
        cdRow.className = 'cb-save-cd-row';
        const cdLabel = document.createElement('span');
        cdLabel.textContent = 'CD';
        cdRow.appendChild(cdLabel);
        const cdInput = document.createElement('input');
        cdInput.type = 'number';
        cdInput.min = '1';
        cdInput.max = '60';
        cdInput.value = '15';
        cdRow.appendChild(cdInput);
        wrap.appendChild(cdRow);

        const buttonsRow = document.createElement('div');
        buttonsRow.className = 'cb-save-buttons';

        const result = document.createElement('p');
        result.className = 'cb-save-result';
        result.setAttribute('aria-live', 'polite');

        const rolarSave = (tipo) => {
            const cd = Math.max(1, Number(cdInput.value) || 0);
            if (!cd) {
                alert('Informe uma CD válida (1 ou maior).');
                return;
            }
            const r = rollTargetSave(token, tipo, cd);
            const rotulo = rotuloSaveTipo(tipo);
            const sinalBonus = r.bonus >= 0 ? '+' + r.bonus : String(r.bonus);
            const veredito = r.success ? 'PASSOU' : 'FALHOU';
            const textoLog = (token.name || 'Token')
                + ' — ' + rotulo + ' CD ' + cd + ': '
                + 'd20 ' + r.d20 + ' ' + sinalBonus + ' = ' + r.total
                + ' (' + veredito + ')';
            addLog({ title: 'Resistência: ' + rotulo, detail: textoLog });
            result.textContent = '↳ ' + textoLog;
            result.classList.toggle('is-pass', r.success);
            result.classList.toggle('is-fail', !r.success);
        };

        const tipos = [
            ['fortitude', 'Fortitude'],
            ['reflexos', 'Reflexos'],
            ['vontade', 'Vontade']
        ];
        for (const [key, label] of tipos) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'cb-save-btn';
            btn.dataset.saveTipo = key;
            btn.textContent = label;
            btn.title = 'Rolar ' + label + ' do alvo contra a CD informada';
            btn.addEventListener('click', () => rolarSave(key));
            buttonsRow.appendChild(btn);
        }

        wrap.appendChild(buttonsRow);
        wrap.appendChild(result);

        return wrap;
    }

    function buildTacticalConditionsSection(token) {
        const wrap = document.createElement('div');
        wrap.className = 'cb-tactical-section';

        const title = document.createElement('h3');
        title.className = 'cb-tactical-title';
        title.textContent = 'Condições táticas';
        wrap.appendChild(title);

        const hint = document.createElement('p');
        hint.className = 'cb-tactical-hint';
        hint.textContent = 'Aplicadas automaticamente quando o token for atacado. Veja o log para o detalhamento.';
        wrap.appendChild(hint);

        // Cobertura
        wrap.appendChild(buildTacticalSelect({
            label: 'Cobertura',
            value: token.cobertura,
            options: [
                ['nenhuma', 'Nenhuma'],
                ['leve', 'Leve (+5 Defesa)'],
                ['total', 'Total (não pode ser atacado)']
            ],
            onChange: (val) => {
                token.cobertura = val;
                addLog({
                    title: 'Cobertura',
                    detail: (token.name || 'Token') + ': ' + ({ nenhuma: 'sem cobertura', leve: 'leve (+5 Defesa)', total: 'total (não pode ser atacado)' })[val]
                });
                saveState();
            }
        }));

        // Camuflagem
        wrap.appendChild(buildTacticalSelect({
            label: 'Camuflagem',
            value: token.camuflagem,
            options: [
                ['nenhuma', 'Nenhuma'],
                ['leve', 'Leve (20% falha)'],
                ['total', 'Total (50% falha)']
            ],
            onChange: (val) => {
                token.camuflagem = val;
                addLog({
                    title: 'Camuflagem',
                    detail: (token.name || 'Token') + ': ' + ({ nenhuma: 'sem camuflagem', leve: 'leve (20% falha)', total: 'total (50% falha)' })[val]
                });
                saveState();
            }
        }));

        // Flanqueado
        const flankRow = document.createElement('label');
        flankRow.className = 'cb-tactical-checkbox';
        const flankBox = document.createElement('input');
        flankBox.type = 'checkbox';
        flankBox.checked = !!token.flanqueado;
        flankBox.addEventListener('change', () => {
            token.flanqueado = flankBox.checked;
            addLog({
                title: 'Flanqueamento',
                detail: (token.name || 'Token') + (flankBox.checked ? ' está flanqueado (+2 ataque corpo a corpo contra ele).' : ' não está mais flanqueado.')
            });
            saveState();
        });
        flankRow.appendChild(flankBox);
        flankRow.appendChild(document.createTextNode(' Flanqueado (+2 atq corpo a corpo)'));
        wrap.appendChild(flankRow);

        return wrap;
    }

    function buildTacticalSelect({ label, value, options, onChange }) {
        const row = document.createElement('label');
        row.className = 'cb-tactical-select';
        const text = document.createElement('span');
        text.textContent = label;
        row.appendChild(text);
        const sel = document.createElement('select');
        for (const [val, text2] of options) {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = text2;
            if (val === value) opt.selected = true;
            sel.appendChild(opt);
        }
        sel.addEventListener('change', () => onChange(sel.value));
        row.appendChild(sel);
        return row;
    }

    function resourceSummary(token) {
        const parts = [];
        if (numberOrNull(token.pvMax)) parts.push(`PV ${clampResource(token.pvAtual, token.pvMax)}/${token.pvMax}`);
        if (numberOrNull(token.pmMax)) parts.push(`PM ${clampResource(token.pmAtual, token.pmMax)}/${token.pmMax}`);
        return parts.join(' ');
    }

    function layerLabel(layer) {
        return ({ mapa: 'Mapa', tokens: 'Tokens', mestre: 'Mestre' })[layer || 'tokens'] || 'Tokens';
    }

    function duplicateToken(id) {
        const token = state.tokens.find(t => t.id === id);
        if (!token) return;
        const copy = migrateLegacyTokenFields(JSON.parse(JSON.stringify(token)));
        copy.id = genId();
        copy.name = `${token.name || 'Token'} cópia`;
        copy.col = clamp((token.col || 0) + 1, 0, state.cols - tokenWidthCells(copy));
        copy.row = clamp((token.row || 0) + 1, 0, state.rows - tokenHeightCells(copy));
        state.tokens.push(copy);
        state.selectedId = copy.id;
        renderTokens();
        saveState();
    }

    function moveTokenToLayer(id, layer) {
        const token = state.tokens.find(t => t.id === id);
        if (!token) return;
        token.layer = ['mapa', 'tokens', 'mestre'].includes(layer) ? layer : 'tokens';
        renderTokens();
        saveState();
    }

    async function openLinkedSheetOrEditor(token) {
        if (token.source === 'bestiario') {
            await ensureSidebarBestiary();
            const criatura = state.bestiario.find(c => c.id === token.fichaId);
            if (criatura) {
                openBestiarySheetWindow(criatura);
                return;
            }
        }
        if (token.fichaId) {
            openSheetWindow(token.fichaId, token.name || 'Ficha');
            return;
        }
        openTokenEditor(token.id);
    }

    function openSheetWindow(id, title) {
        if (!els.sheetWindow || !id) return;
        els.sheetWindowTitle.textContent = title || 'Ficha';
        els.sheetFrame.src = 'ficha.php?id=' + encodeURIComponent(id);
        els.sheetWindow.hidden = false;
    }

    function openBestiarySheetWindow(criatura) {
        if (!els.sheetWindow || !criatura) return;
        els.sheetWindowTitle.textContent = criatura.nome || 'Criatura';
        const doc = `
            <!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
            <link rel="stylesheet" href="assets/css/ficha.css">
            <link rel="stylesheet" href="assets/css/bestiario.css">
            <style>body{padding:18px;background:#fff;color:var(--purple-dark);} .mini{display:grid;gap:12px} img{max-width:180px;border-radius:12px;border:3px solid var(--line)} pre{white-space:pre-wrap;font:inherit;line-height:1.45}</style>
            </head><body><main class="mini">
            ${criatura.imagem ? `<img src="${escapeHtml(criatura.imagem)}" alt="">` : ''}
            <h1>${escapeHtml(criatura.nome || 'Criatura')}</h1>
            <p>${escapeHtml([`ND ${criatura.nd ?? '—'}`, criatura.tipo, criatura.tamanho, criatura.bioma].filter(Boolean).join(' • '))}</p>
            <pre>${escapeHtml(criatura.fichaCompleta || criatura.descricao || 'Sem ficha completa cadastrada.')}</pre>
            </main></body></html>`;
        els.sheetFrame.srcdoc = doc;
        els.sheetWindow.hidden = false;
    }

    function closeSheetWindow() {
        if (!els.sheetWindow) return;
        els.sheetWindow.hidden = true;
        els.sheetFrame.removeAttribute('src');
        els.sheetFrame.removeAttribute('srcdoc');
    }

    function bindSheetWindowDrag() {
        if (!els.sheetWindow || !els.sheetWindowHeader) return;
        let drag = null;
        els.sheetWindowHeader.addEventListener('pointerdown', (event) => {
            if (event.target.closest('button')) return;
            const rect = els.sheetWindow.getBoundingClientRect();
            drag = {
                dx: event.clientX - rect.left,
                dy: event.clientY - rect.top
            };
            els.sheetWindowHeader.setPointerCapture?.(event.pointerId);
        });
        els.sheetWindowHeader.addEventListener('pointermove', (event) => {
            if (!drag) return;
            const width = els.sheetWindow.offsetWidth;
            const height = els.sheetWindow.offsetHeight;
            const left = clamp(event.clientX - drag.dx, 8, window.innerWidth - width - 8);
            const top = clamp(event.clientY - drag.dy, 8, window.innerHeight - height - 8);
            els.sheetWindow.style.left = `${left}px`;
            els.sheetWindow.style.top = `${top}px`;
            els.sheetWindow.style.right = 'auto';
            els.sheetWindow.style.bottom = 'auto';
        });
        const finish = () => { drag = null; };
        els.sheetWindowHeader.addEventListener('pointerup', finish);
        els.sheetWindowHeader.addEventListener('pointercancel', finish);
    }

    function bindFloatingModalDrag(backdrop) {
        if (!backdrop) return;
        const modal = backdrop.querySelector('.cb-modal');
        const header = modal?.querySelector('.cb-modal-header');
        if (!modal || !header || header.dataset.dragBound === '1') return;
        header.dataset.dragBound = '1';

        let drag = null;
        header.addEventListener('pointerdown', (event) => {
            if (event.target.closest('button, input, select, textarea, a')) return;
            const rect = modal.getBoundingClientRect();
            modal.classList.add('is-floating');
            modal.style.left = `${rect.left}px`;
            modal.style.top = `${rect.top}px`;
            modal.style.right = 'auto';
            modal.style.bottom = 'auto';
            drag = {
                dx: event.clientX - rect.left,
                dy: event.clientY - rect.top,
                pointerId: event.pointerId
            };
            event.preventDefault();
            header.setPointerCapture?.(event.pointerId);
        });

        header.addEventListener('pointermove', (event) => {
            if (!drag || event.pointerId !== drag.pointerId) return;
            const width = modal.offsetWidth;
            const height = modal.offsetHeight;
            const maxLeft = Math.max(8, window.innerWidth - width - 8);
            const maxTop = Math.max(8, window.innerHeight - height - 8);
            const left = clamp(event.clientX - drag.dx, 8, maxLeft);
            const top = clamp(event.clientY - drag.dy, 8, maxTop);
            modal.style.left = `${left}px`;
            modal.style.top = `${top}px`;
        });

        const finish = (event) => {
            if (drag && event?.pointerId && event.pointerId !== drag.pointerId) return;
            drag = null;
        };
        header.addEventListener('pointerup', finish);
        header.addEventListener('pointercancel', finish);
    }

    function bindBattleModalsDrag() {
        [
            els.sceneryModal,
            els.modal,
            els.tokenEditorModal,
            els.imageCropModal,
            els.adjustModal,
            els.confirm,
            els.result
        ].forEach(bindFloatingModalDrag);
    }

    function bindSheetWindowOutsideClose() {
        if (!els.sheetWindow || els.sheetWindow.dataset.outsideCloseBound === '1') return;
        els.sheetWindow.dataset.outsideCloseBound = '1';
        document.addEventListener('pointerdown', (event) => {
            if (els.sheetWindow.hidden) return;
            if (els.sheetWindow.contains(event.target)) return;
            if (event.target.closest('.cb-token, .cb-action-panel, .cb-modal-backdrop, .cb-layers-panel')) return;
            closeSheetWindow();
        });
    }

    async function openTokenEditor(id) {
        const token = state.tokens.find(t => t.id === id);
        if (!token || !els.tokenEditorModal) return;
        state.tokenEditorId = id;
        await ensureTokenSheetOptions();
        els.tokenName.value = token.name || '';
        els.tokenImage.value = resolveTokenImageSrc(token) || '';
        els.tokenType.value = token.type || inferTokenType(token);
        els.tokenLayer.value = token.layer || 'tokens';
        els.tokenSheetLink.value = token.source === 'bestiario' ? `bestiario:${token.fichaId || ''}` : (token.fichaId ? `ficha:${token.fichaId}` : '');
        els.tokenWidthCells.value = String(tokenWidthCells(token));
        els.tokenHeightCells.value = String(tokenHeightCells(token));
        els.tokenPvAtual.value = numberOrNull(token.pvAtual) ?? '';
        els.tokenPvMax.value = numberOrNull(token.pvMax) ?? '';
        els.tokenPmAtual.value = numberOrNull(token.pmAtual) ?? '';
        els.tokenPmMax.value = numberOrNull(token.pmMax) ?? '';
        els.tokenConditions.value = (token.conditions || []).join(', ');
        els.tokenEditorModal.hidden = false;
    }

    async function ensureTokenSheetOptions() {
        if (!els.tokenSheetLink) return;
        if (!state.fichasLoaded) await ensureSidebarFichas(true);
        if (!state.bestiarioLoaded) await ensureSidebarBestiary(true);
        els.tokenSheetLink.innerHTML = '<option value="">Sem vínculo</option>';
        for (const ficha of state.fichas) {
            const opt = document.createElement('option');
            opt.value = `ficha:${ficha.id}`;
            opt.textContent = `Ficha: ${ficha.personagem || 'Sem nome'}`;
            els.tokenSheetLink.appendChild(opt);
        }
        for (const criatura of state.bestiario) {
            const opt = document.createElement('option');
            opt.value = `bestiario:${criatura.id}`;
            opt.textContent = `Bestiário: ${criatura.nome || 'Criatura'}`;
            els.tokenSheetLink.appendChild(opt);
        }
    }

    async function saveTokenEditor() {
        const token = state.tokens.find(t => t.id === state.tokenEditorId);
        if (!token) return;
        const link = els.tokenSheetLink.value || '';
        if (link.startsWith('ficha:') && String(token.fichaId || '') !== link.slice(6)) {
            const ficha = await buscarFichaCompleta(link.slice(6));
            if (ficha) {
                const keep = { id: token.id, col: token.col, row: token.row, rotation: token.rotation };
                const beforeLen = state.tokens.length;
                addTokenFromFicha({ ...ficha, id: ficha.id, personagem: ficha.personagem });
                const fresh = state.tokens.pop();
                state.tokens.length = beforeLen;
                Object.assign(token, fresh, keep, { fichaId: ficha.id, source: 'ficha' });
            }
        } else if (link.startsWith('bestiario:') && (token.source !== 'bestiario' || String(token.fichaId || '') !== link.slice(10))) {
            await ensureSidebarBestiary();
            const criatura = state.bestiario.find(c => c.id === link.slice(10));
            if (criatura) {
                const fresh = montarTokenCriatura(criatura);
                token.fichaId = criatura.id;
                token.source = 'bestiario';
                token.name = fresh.nome || token.name;
                token.tokenImage = resolveImage(fresh.tokenImagem || fresh.imagem);
                token.fotoImage = token.tokenImage;
                token.pvAtual = fresh.pvAtual;
                token.pvMax = fresh.pvMax;
                token.pmAtual = fresh.pmAtual;
                token.pmMax = fresh.pmMax;
                token.defesa = fresh.defesa;
                token.actions = buildActionsFromBestiaryToken(fresh);
            }
        } else if (!link) {
            token.fichaId = null;
            token.source = 'manual';
        }
        token.name = els.tokenName.value.trim() || token.name || 'Token';
        token.tokenImage = els.tokenImage.value.trim() || token.tokenImage || null;
        token.type = els.tokenType.value || token.type || 'generico';
        token.layer = els.tokenLayer.value || 'tokens';
        token.widthCells = clamp(Math.round(Number(els.tokenWidthCells.value) || 1), 1, 6);
        token.heightCells = clamp(Math.round(Number(els.tokenHeightCells.value) || token.widthCells), 1, 6);
        token.sizeCells = Math.max(token.widthCells, token.heightCells);
        token.pvAtual = parseResource(els.tokenPvAtual.value);
        token.pvMax = parseResource(els.tokenPvMax.value);
        token.pmAtual = parseResource(els.tokenPmAtual.value);
        token.pmMax = parseResource(els.tokenPmMax.value);
        token.conditions = els.tokenConditions.value.split(',').map(s => s.trim()).filter(Boolean);
        state.selectedId = token.id;
        closeTokenEditor();
        renderTokens();
        saveState();
    }

    function closeTokenEditor() {
        state.tokenEditorId = null;
        if (els.tokenEditorModal) els.tokenEditorModal.hidden = true;
    }

    function rollFormula(formula) {
        const raw = String(formula || '').trim();
        const match = raw.match(/^(\d*)d(\d+)(?:\s*([+-])\s*(\d+))?$/i);
        if (!match) return null;
        const count = clamp(Number(match[1] || 1), 1, 100);
        const sides = clamp(Number(match[2]), 2, 1000);
        const mod = match[3] ? Number(match[4]) * (match[3] === '-' ? -1 : 1) : 0;
        const rolls = Array.from({ length: count }, () => rollDie(sides));
        const total = rolls.reduce((sum, value) => sum + value, 0) + mod;
        return { formula: raw, rolls, mod, total };
    }

    function addLog(entry) {
        state.rollLog.unshift({
            id: 'log_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36),
            at: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            ...entry
        });
        state.rollLog = state.rollLog.slice(0, 80);
        renderLog();
        saveState();
    }

    function renderLog() {
        if (!els.logList) return;
        els.logList.innerHTML = '';
        if (!state.rollLog.length) {
            els.logList.innerHTML = '<p class="cb-sidebar-empty">As rolagens aparecerão aqui.</p>';
            return;
        }
        const frag = document.createDocumentFragment();
        for (const item of state.rollLog) {
            const row = document.createElement('article');
            row.className = 'cb-log-row';
            row.innerHTML = `<span>${escapeHtml(item.at || '')}</span><strong>${escapeHtml(item.title || 'Rolagem')}</strong><p>${escapeHtml(item.detail || '')}</p>`;
            frag.appendChild(row);
        }
        els.logList.appendChild(frag);
    }

    function addSelectedTokenToTurns() {
        const token = state.tokens.find(t => t.id === state.selectedId);
        if (!token) return;
        const bonus = tokenIniciativaMod(token);
        const d20 = rollDie(20);
        const total = d20 + bonus;
        const existing = state.turns.find(turn => turn.tokenId === token.id);
        if (existing) {
            existing.initiative = total;
        } else {
            state.turns.push(normalizeTurn({ tokenId: token.id, initiative: total }));
        }
        addLog({
            title: 'Iniciativa',
            detail: `${token.name || 'Token'}: d20 ${d20}${formatSignedBonus(bonus)} = ${total}`
        });
        sortTurns();
    }

    // Rola iniciativa para TODOS os tokens da cena de uma vez (Sub-fase B).
    // Substitui rolls anteriores e zera a lista — uso típico no início do
    // combate. Usa `tokenIniciativaMod` (cache numérico) para o bônus.
    function rollInitiativeForScene() {
        if (!state.tokens.length) {
            alert('Não há tokens na cena para rolar iniciativa.');
            return;
        }
        if (state.turns.length && !confirm('Rolar iniciativa de todos os tokens substitui a ordem atual. Continuar?')) {
            return;
        }
        const novos = [];
        const detalhes = [];
        for (const token of state.tokens) {
            const bonus = tokenIniciativaMod(token);
            const d20 = rollDie(20);
            const total = d20 + bonus;
            novos.push(normalizeTurn({ tokenId: token.id, initiative: total }));
            detalhes.push(`${token.name || 'Token'}: ${total} (d20=${d20}${formatSignedBonus(bonus)})`);
        }
        state.turns = novos;
        addLog({
            title: 'Iniciativa da cena',
            detail: `${novos.length} ${novos.length === 1 ? 'token rolou' : 'tokens rolaram'} — ${detalhes.join(' • ')}`
        });
        // Reset de movimento ao começar combate é o comportamento esperado.
        resetMovimentosTodos({ silent: true });
        sortTurns();
    }

    // Zera o `movimentoUsado` de todos os tokens. Usada manualmente pelo
    // botão "Resetar movs." e automaticamente em mudanças de rodada.
    function resetMovimentosTodos(opts) {
        const silent = opts && opts.silent;
        let alterados = 0;
        for (const token of state.tokens) {
            if ((Number.isFinite(token.movimentoUsado) && token.movimentoUsado !== 0)
                || token.acaoPadraoUsada || token.acaoMovimentoUsada
                || token.dobroMovimento || token.acaoCompletaUsada) {
                alterados += 1;
            }
            resetTurnActions(token);
        }
        _undoStack.length = 0;
        refreshUndoButton();
        if (!silent) {
            addLog({
                title: 'Deslocamentos resetados',
                detail: alterados
                    ? `${alterados} ${alterados === 1 ? 'token teve' : 'tokens tiveram'} o deslocamento zerado.`
                    : 'Nenhum token tinha deslocamento gasto.'
            });
        }
        renderTokens();
        renderTurnList();
        saveState();
    }

    function renderTurnList() {
        if (!els.turnList) return;
        state.currentTurnIndex = Math.min(state.currentTurnIndex, Math.max(0, state.turns.length - 1));
        refreshRoundDisplay();
        els.turnList.innerHTML = '';

        // Card "Turno Atual" no topo: ativo apenas em combate.
        const cardTurnoAtual = buildTurnoAtualCard();
        if (cardTurnoAtual) els.turnList.appendChild(cardTurnoAtual);

        if (!state.turns.length) {
            const vazio = document.createElement('p');
            vazio.className = 'cb-sidebar-empty';
            vazio.textContent = state.combateAtivo
                ? 'Adicione tokens à iniciativa.'
                : 'Adicione tokens e clique em "Iniciar Combate" para começar.';
            els.turnList.appendChild(vazio);
            return;
        }
        const round = Math.max(1, Number(state.currentRound) || 1);
        const frag = document.createDocumentFragment();
        state.turns.forEach((turn, idx) => {
            const token = state.tokens.find(t => t.id === turn.tokenId);
            const isSurprisedNow = !!turn.surprised && round === 1;
            const isCurrent = idx === state.currentTurnIndex;
            const hasActed = idx < state.currentTurnIndex;

            const row = document.createElement('article');
            row.className = 'cb-turn-row'
                + (isCurrent ? ' is-current' : '')
                + (hasActed ? ' has-acted' : '')
                + (isSurprisedNow ? ' is-surprised-now' : '');

            // Sub-fase F: linha 1 (thumb + body + iniciativa).
            const main = document.createElement('div');
            main.className = 'cb-turn-row-main';

            const thumb = document.createElement('div');
            thumb.className = 'cb-turn-thumb';
            const tokenSrc = token ? resolveTokenImageSrc(token) : null;
            if (tokenSrc) {
                const img = document.createElement('img');
                img.src = tokenSrc;
                img.alt = '';
                img.loading = 'lazy';
                img.onerror = () => {
                    img.remove();
                    thumb.textContent = getTokenInitials(token?.name || '?');
                };
                thumb.appendChild(img);
            } else {
                thumb.textContent = getTokenInitials(token?.name || '?');
            }
            main.appendChild(thumb);

            const body = document.createElement('div');
            body.className = 'cb-turn-body';

            const nameBtn = document.createElement('button');
            nameBtn.type = 'button';
            nameBtn.className = 'cb-turn-name';
            nameBtn.textContent = token?.name || 'Token removido';
            nameBtn.title = token?.name || 'Token removido';
            nameBtn.addEventListener('click', () => {
                if (token) selectToken(token.id);
            });
            body.appendChild(nameBtn);

            const meta = document.createElement('div');
            meta.className = 'cb-turn-meta';

            if (token) {
                const total = tokenDeslocamentoQuadrados(token);
                const restante = tokenMovimentoRestante(token);
                const mov = document.createElement('span');
                mov.className = 'cb-turn-mov' + (restante === 0 ? ' is-empty' : '');
                mov.textContent = `${restante}/${total} qd`;
                mov.title = `Deslocamento restante na rodada (${restante} de ${total} quadrados).`;
                meta.appendChild(mov);
            }

            if (isCurrent) {
                const tag = document.createElement('span');
                tag.className = 'cb-turn-status cb-turn-status--current';
                tag.textContent = 'Agora';
                meta.appendChild(tag);
            } else if (hasActed) {
                const tag = document.createElement('span');
                tag.className = 'cb-turn-status cb-turn-status--acted';
                tag.textContent = 'Já agiu';
                meta.appendChild(tag);
            }

            if (isSurprisedNow) {
                const tag = document.createElement('span');
                tag.className = 'cb-turn-status cb-turn-status--surprised';
                tag.textContent = 'Surpreso';
                meta.appendChild(tag);
            }
            body.appendChild(meta);

            if (token) {
                body.appendChild(buildTurnActionState(token, isCurrent));
            }
            main.appendChild(body);

            const initInput = document.createElement('input');
            initInput.type = 'number';
            initInput.className = 'cb-turn-init';
            initInput.value = String(turn.initiative);
            initInput.title = 'Editar manualmente o resultado de iniciativa.';
            initInput.addEventListener('change', () => {
                turn.initiative = Number(initInput.value) || 0;
                saveState();
            });
            main.appendChild(initInput);

            row.appendChild(main);

            // Sub-fase F: linha 2 (ações compactas alinhadas à direita).
            const actions = document.createElement('div');
            actions.className = 'cb-turn-row-actions';

            if (token) {
                const focusBtn = document.createElement('button');
                focusBtn.type = 'button';
                focusBtn.className = 'cb-turn-focus';
                focusBtn.title = 'Selecionar e centralizar este token no mapa.';
                focusBtn.setAttribute('aria-label', 'Focar token');
                focusBtn.textContent = '⌖';
                focusBtn.addEventListener('click', () => {
                    selectToken(token.id);
                    focusTokenOnMap(token);
                });
                actions.appendChild(focusBtn);
            }

            const surpriseBtn = document.createElement('button');
            surpriseBtn.type = 'button';
            surpriseBtn.className = 'cb-turn-surprise-mini' + (turn.surprised ? ' is-on' : '');
            surpriseBtn.title = turn.surprised
                ? 'Marcado como surpreso (não age na rodada 1). Clique para desmarcar.'
                : 'Marcar como surpreso (não age na rodada 1).';
            surpriseBtn.setAttribute('aria-pressed', turn.surprised ? 'true' : 'false');
            surpriseBtn.textContent = 'S';
            surpriseBtn.addEventListener('click', () => {
                turn.surprised = !turn.surprised;
                addLog({
                    title: turn.surprised ? 'Marcado surpreso' : 'Removida surpresa',
                    detail: (token?.name || 'Token') + (turn.surprised ? ' começa surpreso (não age na rodada 1).' : ' não está mais surpreso.')
                });
                renderTurnList();
                saveState();
            });
            actions.appendChild(surpriseBtn);

            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'cb-turn-remove';
            remove.title = 'Remover este participante da iniciativa.';
            remove.textContent = '×';
            remove.setAttribute('aria-label', 'Remover');
            remove.addEventListener('click', () => {
                state.turns.splice(idx, 1);
                state.currentTurnIndex = Math.min(state.currentTurnIndex, Math.max(0, state.turns.length - 1));
                renderTurnList();
                renderTokens();
                saveState();
            });
            actions.appendChild(remove);

            row.appendChild(actions);
            frag.appendChild(row);
        });
        els.turnList.appendChild(frag);
    }

    // Sub-fase E: centraliza o palco no token sem alterar o zoom atual.
    function focusTokenOnMap(token) {
        if (!token || !els.stage) return;
        const stageRect = els.stage.getBoundingClientRect();
        const size = Math.max(1, Number(token.sizeCells || 1));
        const tokenCenterX = (Number(token.col) + size / 2) * CELL_SIZE;
        const tokenCenterY = (Number(token.row) + size / 2) * CELL_SIZE;
        const scale = state.viewport.scale || 1;
        state.viewport.x = (stageRect.width / 2) - tokenCenterX * scale;
        state.viewport.y = (stageRect.height / 2) - tokenCenterY * scale;
        applyViewport();
    }

    function sortTurns() {
        // Sub-fase B: desempate por modificador de iniciativa do token,
        // depois ordem estável (Array.prototype.sort é estável no V8/SpiderMonkey).
        state.turns.sort((a, b) => {
            const diff = (Number(b.initiative) || 0) - (Number(a.initiative) || 0);
            if (diff !== 0) return diff;
            const tokenA = state.tokens.find(t => t.id === a.tokenId);
            const tokenB = state.tokens.find(t => t.id === b.tokenId);
            return tokenIniciativaMod(tokenB) - tokenIniciativaMod(tokenA);
        });
        state.currentTurnIndex = 0;
        state.currentRound = 1;
        addLog({ title: 'Iniciativa ordenada', detail: 'Início do combate — Rodada 1.' });
        // Sub-fase E: ao iniciar o combate, foca o token que age primeiro.
        focusCurrentTurnToken();
        renderTurnList();
        renderTokens();
        saveState();
    }

    function nextTurn() {
        if (!state.turns.length) return;
        const last = state.turns.length - 1;
        let virouRodada = false;
        if (state.currentTurnIndex >= last) {
            // ciclo completo: avança rodada e zera deslocamentos.
            state.currentTurnIndex = 0;
            state.currentRound = (Number(state.currentRound) || 1) + 1;
            virouRodada = true;
            addLog({ title: 'Nova rodada', detail: 'Rodada ' + state.currentRound + '.' });
            resetMovimentosTodos({ silent: true });
        } else {
            state.currentTurnIndex += 1;
        }
        // Reset de ações do token entrante: começa o turno com 1 padrão + 1 movimento.
        const turn = state.turns[state.currentTurnIndex];
        if (turn) {
            const incoming = state.tokens.find(t => t.id === turn.tokenId);
            if (incoming) resetTurnActions(incoming);
        }
        // Banner: nova rodada ou apenas troca de turno (mais discreto).
        const tokenAtual = turn ? state.tokens.find(t => t.id === turn.tokenId) : null;
        const nomeAtual = tokenAtual ? (tokenAtual.name || 'Token') : '—';
        if (state.combateAtivo) {
            if (virouRodada) {
                showCombatBanner(`Rodada ${state.currentRound}`, `Turno de ${nomeAtual}`);
            } else {
                showCombatBanner(`Turno de ${nomeAtual}`, '');
            }
        }
        // Avanço de turno limpa o histórico — desfazer turno é fora de
        // escopo (restauraria múltiplos tokens; ver Parte 2 do plano).
        _undoStack.length = 0;
        refreshUndoButton();
        // Sub-fase E: auto-seleciona e foca o token cujo turno começou.
        focusCurrentTurnToken();
        renderTurnList();
        renderTokens();
        saveState();
    }

    // Aplica seleção + log + foco no token do turno atual. Reusado por
    // nextTurn, sortTurns e rollInitiativeForScene.
    function focusCurrentTurnToken() {
        const turn = state.turns[state.currentTurnIndex];
        if (!turn) return;
        const token = state.tokens.find(t => t.id === turn.tokenId);
        if (!token) return;
        if (state.selectedId !== token.id) selectToken(token.id);
        focusTokenOnMap(token);
        const restante = tokenMovimentoRestante(token);
        const total = tokenDeslocamentoQuadrados(token);
        addLog({
            title: 'Turno',
            detail: `${token.name || 'Token'} (${restante}/${total} qd disponíveis).`
        });
    }

    function incrementRound() {
        state.currentRound = (Number(state.currentRound) || 1) + 1;
        addLog({ title: 'Rodada incrementada', detail: 'Rodada ' + state.currentRound + ' (manual).' });
        // Manual +1 também restaura deslocamentos (consistente com avanço natural).
        resetMovimentosTodos({ silent: true });
        renderTurnList();
        saveState();
    }

    function resetRound() {
        if (!confirm('Reiniciar para Rodada 1? Isso não remove ninguém da iniciativa.')) return;
        state.currentRound = 1;
        state.currentTurnIndex = 0;
        addLog({ title: 'Rodada reiniciada', detail: 'Combate volta para a Rodada 1.' });
        renderTurnList();
        renderTokens();
        saveState();
    }

    function refreshRoundDisplay() {
        if (els.roundNumber) {
            els.roundNumber.textContent = String(Math.max(1, Number(state.currentRound) || 1));
        }
    }

    function isCurrentTurnToken(tokenId) {
        const turn = state.turns[state.currentTurnIndex];
        return !!turn && turn.tokenId === tokenId;
    }

    function parseSignedNumber(value) {
        const match = String(value ?? '').match(/[+-]?\d+/);
        return match ? Number(match[0]) : null;
    }

    // ----------------------------------------------------------------
    // Helpers táticos (Sub-fase A): iniciativa e deslocamento por token
    // ----------------------------------------------------------------

    // Modificador de iniciativa (numérico). Usa o cache `iniciativaMod`
    // se já houver, senão extrai do campo textual `iniciativa` ("+5").
    function tokenIniciativaMod(token) {
        if (!token) return 0;
        if (Number.isFinite(token.iniciativaMod)) return token.iniciativaMod;
        return parseSignedNumber(token.iniciativa) ?? 0;
    }

    // Deslocamento total do token em quadrados.
    // Aceita "9m", "6 m", "6 quadrados", "6", number, vazio. Default 6
    // quadrados (9 m — Médio padrão) quando o token/ficha não trouxer
    // o dado. Ficha hoje não tem coluna `deslocamento`; quando vier,
    // o campo já é lido daqui sem nova mudança (Sub-fase A).
    function tokenDeslocamentoQuadrados(token) {
        const DEFAULT_QUADRADOS = 6;
        if (!token) return DEFAULT_QUADRADOS;
        const raw = token.deslocamento;
        if (raw == null || raw === '') return DEFAULT_QUADRADOS;
        if (typeof raw === 'number' && Number.isFinite(raw)) {
            return Math.max(0, Math.round(raw));
        }
        const txt = String(raw).toLowerCase();
        const numMatch = txt.match(/-?\d+(?:[.,]\d+)?/);
        if (!numMatch) return DEFAULT_QUADRADOS;
        const num = Number(numMatch[0].replace(',', '.'));
        if (!Number.isFinite(num)) return DEFAULT_QUADRADOS;
        if (/quadrad|qd|\bsq\b/.test(txt)) return Math.max(0, Math.round(num));
        // Sem unidade explícita ou com "m" → considera metros e converte.
        const regras = window.PindoramaRegras;
        if (regras && typeof regras.metrosParaQuadrados === 'function') {
            return Math.max(0, regras.metrosParaQuadrados(num));
        }
        return Math.max(0, Math.ceil(num / 1.5));
    }

    // Quadrados de movimento ainda disponíveis na rodada atual.
    // Quando `dobroMovimento` está ligado, o teto vai ao dobro do deslocamento padrão.
    function tokenMovimentoRestante(token) {
        if (!token) return 0;
        const base = tokenDeslocamentoQuadrados(token);
        const total = token.dobroMovimento ? base * 2 : base;
        const usado = Number.isFinite(token.movimentoUsado) ? token.movimentoUsado : 0;
        return Math.max(0, total - usado);
    }

    // ---- Estado de ações por turno (Parte 5/6) ----

    function canTakeStandardAction(token) {
        if (!token) return false;
        if (token.acaoCompletaUsada) return false;
        if (token.acaoPadraoUsada) return false;
        if (token.dobroMovimento) return false;
        return true;
    }

    function consumeStandardAction(token, motivo) {
        if (!token) return;
        if (token.acaoPadraoUsada) return;
        // Snapshot ANTES da mutação para que undo restaure o estado.
        pushUndo('Ação padrão' + (motivo ? ' — ' + motivo : ''), token.id);
        token.acaoPadraoUsada = true;
        addLog({
            title: 'Ação padrão consumida',
            detail: `${token.name || 'Token'}${motivo ? ' — ' + motivo : ''}.`
        });
    }

    function resetTurnActions(token) {
        if (!token) return;
        token.acaoPadraoUsada = false;
        token.acaoMovimentoUsada = false;
        token.dobroMovimento = false;
        token.acaoCompletaUsada = false;
        token.movimentoUsado = 0;
    }

    // ---- Undo: pilha real (Parte 2 v2) ----
    // Cada snapshot guarda o estado mínimo afetado pela ação para que
    // possamos restaurá-lo exatamente. Limite de 30 entradas.
    const UNDO_LIMIT = 30;
    const _undoStack = [];

    function snapshotToken(token) {
        if (!token) return null;
        return {
            id: token.id,
            col: token.col,
            row: token.row,
            movimentoUsado: token.movimentoUsado,
            acaoPadraoUsada: !!token.acaoPadraoUsada,
            acaoMovimentoUsada: !!token.acaoMovimentoUsada,
            dobroMovimento: !!token.dobroMovimento,
            acaoCompletaUsada: !!token.acaoCompletaUsada,
            pvAtual: token.pvAtual
        };
    }

    function pushUndo(descricao, tokenId) {
        const token = tokenId ? state.tokens.find(t => t.id === tokenId) : null;
        _undoStack.push({
            descricao,
            ts: Date.now(),
            tokenSnap: snapshotToken(token),
            currentTurnIndex: state.currentTurnIndex,
            currentRound: state.currentRound,
            reachPreview: state.reachPreview ? {
                tokenId: state.reachPreview.tokenId,
                actionKey: state.reachPreview.actionKey,
                action: state.reachPreview.action
            } : null,
            terrainDifficult: state.terrainDifficult instanceof Set ? new Set(state.terrainDifficult) : null,
            terrainBarriers:  state.terrainBarriers  instanceof Set ? new Set(state.terrainBarriers)  : null,
            terrainSpecial:   state.terrainSpecial && typeof state.terrainSpecial === 'object'
                              ? { ...state.terrainSpecial } : null
        });
        if (_undoStack.length > UNDO_LIMIT) _undoStack.shift();
        refreshUndoButton();
    }

    // Compat: nome legado usado em finishTokenDrag.
    function captureMoveUndo(token) {
        if (!token) return;
        pushUndo('Movimento', token.id);
    }

    function refreshUndoButton() {
        const btn = document.getElementById('cbUndoMove');
        if (!btn) return;
        btn.disabled = _undoStack.length === 0;
        btn.title = _undoStack.length
            ? `Desfazer (Ctrl+Z) — ${_undoStack.length} ${_undoStack.length === 1 ? 'ação' : 'ações'} no histórico`
            : 'Desfazer (Ctrl+Z)';
    }

    function undoLastMove() {
        if (!_undoStack.length) {
            showCbToast('Nada para desfazer.');
            return;
        }
        const snap = _undoStack.pop();
        if (snap.tokenSnap) {
            const token = state.tokens.find(t => t.id === snap.tokenSnap.id);
            if (token) {
                token.col = snap.tokenSnap.col;
                token.row = snap.tokenSnap.row;
                token.movimentoUsado = snap.tokenSnap.movimentoUsado;
                token.acaoPadraoUsada = snap.tokenSnap.acaoPadraoUsada;
                token.acaoMovimentoUsada = snap.tokenSnap.acaoMovimentoUsada;
                token.dobroMovimento = snap.tokenSnap.dobroMovimento;
                token.acaoCompletaUsada = snap.tokenSnap.acaoCompletaUsada;
                if (snap.tokenSnap.pvAtual !== undefined) {
                    token.pvAtual = snap.tokenSnap.pvAtual;
                }
            }
        }
        state.currentTurnIndex = snap.currentTurnIndex;
        state.currentRound = snap.currentRound;
        state.reachPreview = snap.reachPreview || null;
        if (snap.terrainDifficult) state.terrainDifficult = snap.terrainDifficult;
        if (snap.terrainBarriers)  state.terrainBarriers  = snap.terrainBarriers;
        if (snap.terrainSpecial)   state.terrainSpecial   = snap.terrainSpecial;
        addLog({ title: 'Desfeito', detail: snap.descricao });
        renderTokens();
        renderTurnList();
        renderTerrainOverlay();
        refreshTerrainUI();
        renderBoard();
        saveState();
        refreshUndoButton();
    }

    // Marcador "P:X M:Y" + toggles "2× mov" e "Ação completa" no turno atual.
    function buildTurnActionState(token, isCurrent) {
        const wrap = document.createElement('div');
        wrap.className = 'cb-turn-actstate';

        const padrao = (token.acaoPadraoUsada || token.acaoCompletaUsada) ? 0 : 1;
        const movRest = token.acaoCompletaUsada ? 0 : (token.acaoMovimentoUsada ? 0 : 1);

        const badge = document.createElement('span');
        badge.className = 'cb-turn-actstate-badge'
            + (padrao === 0 ? ' is-no-padrao' : '')
            + (movRest === 0 ? ' is-no-mov' : '');
        badge.textContent = `P:${padrao} M:${movRest}`;
        badge.title = 'Ações restantes neste turno: P = ação padrão, M = ação de movimento.';
        wrap.appendChild(badge);

        if (!isCurrent) return wrap;

        const dobroBtn = document.createElement('button');
        dobroBtn.type = 'button';
        dobroBtn.className = 'cb-turn-actstate-btn'
            + (token.dobroMovimento ? ' is-on' : '');
        dobroBtn.textContent = '2× mov';
        dobroBtn.title = 'Usar a ação padrão como segunda ação de movimento (deslocamento dobrado).';
        dobroBtn.disabled = !!token.acaoCompletaUsada;
        dobroBtn.addEventListener('click', () => {
            if (token.acaoCompletaUsada) return;
            if (token.dobroMovimento) {
                // Desligar: só permitido se o usado ainda couber no deslocamento base.
                const base = tokenDeslocamentoQuadrados(token);
                if (token.movimentoUsado > base) {
                    showCbToast('Já se moveu além do deslocamento padrão; desfaça o movimento antes.');
                    return;
                }
                pushUndo('2× movimento desligado', token.id);
                token.dobroMovimento = false;
                token.acaoPadraoUsada = false;
                addLog({ title: '2× movimento desligado', detail: `${token.name || 'Token'} recupera a ação padrão.` });
            } else {
                if (token.acaoPadraoUsada) {
                    showCbToast('Ação padrão já gasta; não pode virar 2× movimento.');
                    return;
                }
                pushUndo('2× movimento', token.id);
                token.dobroMovimento = true;
                token.acaoPadraoUsada = true;
                const base = tokenDeslocamentoQuadrados(token);
                addLog({ title: '2× movimento', detail: `${token.name || 'Token'}: deslocamento até ${base * 2} qd nesta rodada.` });
            }
            renderTurnList();
            renderTokens();
            saveState();
        });
        wrap.appendChild(dobroBtn);

        const completaBtn = document.createElement('button');
        completaBtn.type = 'button';
        completaBtn.className = 'cb-turn-actstate-btn'
            + (token.acaoCompletaUsada ? ' is-on' : '');
        completaBtn.textContent = 'Ação completa';
        completaBtn.title = 'Usar uma única ação completa (consome ação padrão e ação de movimento).';
        completaBtn.addEventListener('click', () => {
            pushUndo(token.acaoCompletaUsada ? 'Desfaz ação completa' : 'Ação completa', token.id);
            if (token.acaoCompletaUsada) {
                token.acaoCompletaUsada = false;
                token.acaoPadraoUsada = false;
                token.acaoMovimentoUsada = false;
                addLog({ title: 'Ação completa desfeita', detail: `${token.name || 'Token'} recupera ação padrão e movimento.` });
            } else {
                token.acaoCompletaUsada = true;
                token.acaoPadraoUsada = true;
                token.acaoMovimentoUsada = true;
                token.dobroMovimento = false;
                addLog({ title: 'Ação completa', detail: `${token.name || 'Token'} declarou uma ação completa.` });
            }
            renderTurnList();
            renderTokens();
            saveState();
        });
        wrap.appendChild(completaBtn);

        return wrap;
    }

    // ---- Toast discreto (avisos rápidos, não bloqueantes) ----

    let _cbToastEl = null;
    let _cbToastTimer = null;
    function showCbToast(message, opts) {
        const variant = (opts && opts.variant) || 'warn';
        if (!_cbToastEl) {
            _cbToastEl = document.createElement('div');
            _cbToastEl.className = 'cb-toast';
            _cbToastEl.setAttribute('role', 'status');
            _cbToastEl.setAttribute('aria-live', 'polite');
            document.body.appendChild(_cbToastEl);
        }
        _cbToastEl.classList.remove('cb-toast--warn', 'cb-toast--info');
        _cbToastEl.classList.add('cb-toast--' + variant);
        _cbToastEl.textContent = message;
        _cbToastEl.classList.add('is-visible');
        if (_cbToastTimer) clearTimeout(_cbToastTimer);
        _cbToastTimer = setTimeout(() => {
            _cbToastEl.classList.remove('is-visible');
        }, 2400);
    }

    function normalizeText(value) {
        return String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    function escapeHtmlExceptStrong(value) {
        if (String(value).startsWith('<strong>')) return value;
        return escapeHtml(value);
    }

    // ----------------------------------------------------------------
    // Tooltip ao passar sobre o token
    // ----------------------------------------------------------------

    function bindTooltip() {
        let lastToken = null;
        els.tokensLayer.addEventListener('pointermove', (ev) => {
            const tEl = ev.target.closest('.cb-token');
            if (!tEl) {
                hideTooltip(); lastToken = null; return;
            }
            const token = state.tokens.find(t => t.id === tEl.dataset.tokenId);
            if (!token) return;
            if (lastToken !== token.id) {
                lastToken = token.id;
                showTooltip(token, ev.clientX, ev.clientY);
            } else {
                positionTooltip(ev.clientX, ev.clientY);
            }
        });
        els.tokensLayer.addEventListener('pointerleave', hideTooltip);
    }

    function showTooltip(token, x, y) {
        const bestiaryInfo = token.source === 'bestiario'
            ? `<span>ND ${escapeHtml(token.nd ?? '—')} • PV ${escapeHtml(token.pvMax ?? '—')} • Defesa ${escapeHtml(token.defesa ?? '—')}</span>`
            : '';
        const resourceInfo = buildTooltipResourceInfo(token);
        els.tooltip.hidden = false;
        els.tooltip.innerHTML = `
            <strong>${escapeHtml(token.name || 'Sem nome')}</strong>
            ${bestiaryInfo}
            ${resourceInfo}
            <span>Ocupa: ${token.sizeCells}x${token.sizeCells} (${formatMeters(token.sizeCells)}m) • Posição: ${token.col + 1},${token.row + 1}</span>
        `;
        positionTooltip(x, y);
    }

    function formatMeters(cells) {
        return String(Number(cells || 1) * GRID_METERS).replace('.', ',');
    }

    function buildTooltipResourceInfo(token) {
        const parts = [];
        const pvMax = numberOrNull(token.pvMax);
        const pmMax = numberOrNull(token.pmMax);
        if (pvMax !== null && pvMax > 0) parts.push(`PV ${clampResource(token.pvAtual, pvMax)}/${pvMax}`);
        if (pmMax !== null && pmMax > 0) parts.push(`PM ${clampResource(token.pmAtual, pmMax)}/${pmMax}`);
        return parts.length ? `<span>${escapeHtml(parts.join(' • '))}</span>` : '';
    }

    function positionTooltip(x, y) {
        els.tooltip.style.left = (x + 14) + 'px';
        els.tooltip.style.top = (y + 14) + 'px';
    }

    function hideTooltip() {
        els.tooltip.hidden = true;
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, ch => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[ch]));
    }

    // ----------------------------------------------------------------
    // Wheel zoom (desktop)
    // ----------------------------------------------------------------

    function onWheel(ev) {
        ev.preventDefault();
        const factor = ev.deltaY < 0 ? 1.1 : 1 / 1.1;
        setScale(state.viewport.scale * factor, ev.clientX, ev.clientY);
        saveState();
    }

    // ----------------------------------------------------------------
    // Event wiring
    // ----------------------------------------------------------------

    function bindEvents() {
        els.stage.addEventListener('pointerdown', onStagePointerDown);
        els.stage.addEventListener('pointermove', onStagePointerMove);
        els.stage.addEventListener('pointerup', onStagePointerUp);
        els.stage.addEventListener('pointercancel', onStagePointerUp);
        els.stage.addEventListener('wheel', onWheel, { passive: false });
        // Bloquear menu contextual no stage para permitir botão direito como pan no desktop
        els.stage.addEventListener('contextmenu', (e) => e.preventDefault());
        els.tokensLayer.addEventListener('click', (e) => {
            const resourceBar = e.target.closest('.cb-resource-bar');
            const tokenEl = e.target.closest('.cb-token');
            if (!resourceBar || !tokenEl) return;
            e.preventDefault();
            e.stopPropagation();
            adjustTokenResource(tokenEl.dataset.tokenId, resourceBar.dataset.resource);
        });
        els.tokensLayer.addEventListener('dblclick', (e) => {
            const tokenEl = e.target.closest('.cb-token');
            if (!tokenEl) return;
            const token = state.tokens.find(t => t.id === tokenEl.dataset.tokenId);
            if (!token) return;
            e.preventDefault();
            e.stopPropagation();
            selectToken(token.id);
            openLinkedSheetOrEditor(token);
        });

        els.addToken.addEventListener('click', openModal);
        els.addBestiaryToken.addEventListener('click', openBestiaryModal);
        els.actionClose.addEventListener('click', () => {
            clearReachPreview();
            closeTokenActionPanel();
        });

        if (els.confirm) {
            els.confirmClose.addEventListener('click', closeAttackConfirmation);
            els.confirmCancel.addEventListener('click', closeAttackConfirmation);
            els.confirmOk.addEventListener('click', confirmPendingAttack);
            els.confirm.addEventListener('click', (e) => {
                if (e.target === els.confirm) closeAttackConfirmation();
            });
        }
        if (els.result) {
            els.resultClose.addEventListener('click', closeAttackResultModal);
            els.resultOk.addEventListener('click', closeAttackResultModal);
            els.result.addEventListener('click', (e) => {
                if (e.target === els.result) closeAttackResultModal();
            });
        }
        els.modalClose.addEventListener('click', closeModal);
        els.modal.addEventListener('click', (e) => {
            if (e.target === els.modal) closeModal();
        });
        els.modalSearch.addEventListener('input', (e) => {
            if (state.modalMode === 'bestiario') filterBestiary();
            else filterFichas(e.target.value);
        });
        [
            els.bestiaryNd,
            els.bestiaryTipo,
            els.bestiaryTamanho,
            els.bestiaryBioma,
            els.bestiaryPapel
        ].forEach(select => select.addEventListener('change', filterBestiary));
        els.addGenericToken.addEventListener('click', () => {
            closeModal();
            addGenericToken();
        });

        els.removeToken.addEventListener('click', removeSelectedToken);
        els.rotateToken.addEventListener('click', rotateSelectedTokenStep);
        if (els.adjustToken) els.adjustToken.addEventListener('click', openAdjustModalForSelected);
        els.clearAll.addEventListener('click', clearAllTokens);

        if (els.addScenery) els.addScenery.addEventListener('click', () => openSceneryModal('scenery'));
        if (els.addNpcImage) els.addNpcImage.addEventListener('click', () => openSceneryModal('npcs'));
        if (els.saveBattle) els.saveBattle.addEventListener('click', confirmSaveBattle);
        if (els.imageLayer) {
            els.imageLayer.value = state.activeImageLayer;
            els.imageLayer.addEventListener('change', (event) => setActiveImageLayer(event.target.value));
        }
        if (els.toggleLayers) els.toggleLayers.addEventListener('click', toggleLayersPanel);
        if (els.layersClose) els.layersClose.addEventListener('click', toggleLayersPanel);
        if (els.addPage) els.addPage.addEventListener('click', addPage);
        if (els.snapToGrid) {
            els.snapToGrid.addEventListener('change', (e) => {
                state.snapToGrid = !!e.target.checked;
                saveState();
                if (state.snapToGrid) snapAllSceneryToGrid();
            });
        }

        if (els.sceneryClose) els.sceneryClose.addEventListener('click', closeSceneryModal);
        if (els.sceneryCancel) els.sceneryCancel.addEventListener('click', closeSceneryModal);
        if (els.sceneryConfirm) els.sceneryConfirm.addEventListener('click', confirmAddScenery);
        if (els.sceneryModal) {
            els.sceneryModal.addEventListener('click', (event) => {
                if (event.target === els.sceneryModal) closeSceneryModal();
            });
        }

        if (els.adjustClose) els.adjustClose.addEventListener('click', closeAdjustModal);
        if (els.adjustModal) {
            els.adjustModal.addEventListener('click', (event) => {
                if (event.target === els.adjustModal) closeAdjustModal();
            });
        }
        [els.adjustZoom, els.adjustX, els.adjustY].filter(Boolean).forEach((input) => {
            input.addEventListener('input', () => {
                const ajuste = readAdjustForm();
                applyAdjustPreview(ajuste);
                commitAdjustToToken();
            });
        });
        if (els.adjustReset) els.adjustReset.addEventListener('click', resetAdjustToCenter);
        if (els.adjustUseBestiario) els.adjustUseBestiario.addEventListener('click', loadBestiaryAdjustIntoModal);
        if (els.adjustSaveSource) els.adjustSaveSource.addEventListener('click', saveAdjustToSource);
        bindAdjustPreviewDrag();

        if (els.imageCropClose) els.imageCropClose.addEventListener('click', closeImageCropModal);
        if (els.imageCropModal) {
            els.imageCropModal.addEventListener('click', (event) => {
                if (event.target === els.imageCropModal) closeImageCropModal();
            });
        }
        [els.imageCropZoom, els.imageCropX, els.imageCropY].filter(Boolean).forEach((input) => {
            input.addEventListener('input', () => {
                const crop = readImageCropForm();
                applyImageCropPreview(crop);
                commitImageCropToItem();
            });
        });
        if (els.imageCropReset) els.imageCropReset.addEventListener('click', resetImageCropToCenter);
        bindImageCropPreviewDrag();

        els.sidebarTabs.forEach(btn => {
            btn.addEventListener('click', () => setSidebarTab(btn.dataset.tab));
        });
        if (els.refreshFichas) els.refreshFichas.addEventListener('click', () => ensureSidebarFichas(true));
        if (els.sidebarFichaSearch) els.sidebarFichaSearch.addEventListener('input', renderSidebarFichas);
        if (els.refreshBestiary) els.refreshBestiary.addEventListener('click', () => ensureSidebarBestiary(true));
        if (els.sidebarBestiarySearch) els.sidebarBestiarySearch.addEventListener('input', renderSidebarBestiary);
        if (els.editSelectedToken) els.editSelectedToken.addEventListener('click', () => {
            if (state.selectedId) openTokenEditor(state.selectedId);
        });
        if (els.clearLog) els.clearLog.addEventListener('click', () => {
            state.rollLog = [];
            renderLog();
            saveState();
        });
        if (els.diceForm) {
            els.diceForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const result = rollFormula(els.diceFormula.value);
                if (!result) {
                    addLog({ title: 'Rolagem inválida', detail: 'Use uma fórmula como 1d20+4 ou 2d6-1.' });
                    return;
                }
                addLog({
                    title: result.formula,
                    detail: `Rolagens ${result.rolls.join(', ')}${formatSignedBonus(result.mod)} = ${result.total}`
                });
            });
        }
        if (els.addTurnSelected) els.addTurnSelected.addEventListener('click', addSelectedTokenToTurns);
        if (els.rollSceneInitiative) els.rollSceneInitiative.addEventListener('click', rollInitiativeForScene);
        if (els.resetMovimentos) els.resetMovimentos.addEventListener('click', () => {
            if (confirm('Zerar o deslocamento gasto de todos os tokens?')) {
                resetMovimentosTodos({ silent: false });
            }
        });
        const undoBtn = document.getElementById('cbUndoMove');
        if (undoBtn) undoBtn.addEventListener('click', undoLastMove);
        if (els.sortTurns) els.sortTurns.addEventListener('click', sortTurns);
        if (els.nextTurn) els.nextTurn.addEventListener('click', nextTurn);
        if (els.roundIncrement) els.roundIncrement.addEventListener('click', incrementRound);
        if (els.roundReset) els.roundReset.addEventListener('click', resetRound);
        if (els.tokenEditorClose) els.tokenEditorClose.addEventListener('click', closeTokenEditor);
        if (els.tokenEditorCancel) els.tokenEditorCancel.addEventListener('click', closeTokenEditor);
        if (els.tokenEditorSave) els.tokenEditorSave.addEventListener('click', saveTokenEditor);
        if (els.tokenEditorModal) {
            els.tokenEditorModal.addEventListener('click', (event) => {
                if (event.target === els.tokenEditorModal) closeTokenEditor();
            });
        }
        if (els.sheetWindowClose) els.sheetWindowClose.addEventListener('click', closeSheetWindow);
        bindSheetWindowDrag();
        bindSheetWindowOutsideClose();
        bindBattleModalsDrag();
        if (els.mapImage) {
            els.mapImage.addEventListener('change', () => {
                state.mapBackground = els.mapImage.value.trim();
                renderBoard();
                saveState();
            });
        }
        if (els.mapFile) {
            els.mapFile.addEventListener('change', async () => {
                const file = els.mapFile.files?.[0];
                if (!file) return;
                setSaveStatus('Enviando imagem...', '');
                try {
                    state.mapBackground = await uploadBattleImage(file);
                    if (els.mapImage) els.mapImage.value = state.mapBackground;
                    renderBoard();
                    saveState();
                    setSaveStatus('Imagem salva.', 'ok');
                } catch (error) {
                    setSaveStatus('Falha no upload.', 'error');
                    alert(error.message || 'Não foi possível salvar a imagem de fundo.');
                }
            });
        }
        if (els.gridOpacity) {
            els.gridOpacity.addEventListener('input', () => {
                state.gridOpacity = clamp(Number(els.gridOpacity.value) || 0.45, 0.05, 1);
                renderBoard();
                saveState();
            });
        }
        if (els.gridSize) {
            els.gridSize.addEventListener('change', () => {
                CELL_SIZE = clamp(Math.round(Number(els.gridSize.value) || CELL_SIZE), 36, 96);
                renderBoard();
                renderTokens();
                renderScenery();
                centerBoard();
                saveState();
            });
        }
        if (els.clearMapImage) {
            els.clearMapImage.addEventListener('click', () => {
                state.mapBackground = '';
                if (els.mapImage) els.mapImage.value = '';
                if (els.mapFile) els.mapFile.value = '';
                renderBoard();
                saveState();
            });
        }
        if (els.sceneType) {
            els.sceneType.addEventListener('change', () => {
                state.tipo = els.sceneType.value || '';
                saveState();
            });
        }
        if (els.sceneNotes) {
            els.sceneNotes.addEventListener('input', () => {
                state.notasNarrador = els.sceneNotes.value || '';
                saveState();
            });
        }
        if (els.toggleTerrainMode) {
            els.toggleTerrainMode.addEventListener('click', () => {
                setTerrainMarkingMode(!state.terrainMarkingMode);
            });
        }
        if (els.clearTerrain) {
            els.clearTerrain.addEventListener('click', clearAllTerrain);
        }
        if (els.terrainTypeRadios && els.terrainTypeRadios.length) {
            els.terrainTypeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio.checked) setTerrainMarkingType(radio.value);
                });
            });
        }
        if (els.modeEditBtn) els.modeEditBtn.addEventListener('click', () => setModoCena('edit'));
        if (els.modePlayBtn) els.modePlayBtn.addEventListener('click', () => setModoCena('play'));
        if (els.startCombatBtn) els.startCombatBtn.addEventListener('click', iniciarCombate);
        if (els.endCombatBtn)   els.endCombatBtn.addEventListener('click', encerrarCombate);
        if (els.terrainSpecialBiome) {
            els.terrainSpecialBiome.addEventListener('change', () => {
                state.terrainSpecialBiome = els.terrainSpecialBiome.value || 'mangue';
            });
        }
        if (els.sceneBiome) {
            els.sceneBiome.addEventListener('change', () => {
                state.sceneBiome = els.sceneBiome.value || '';
                refreshSceneBiomeTag();
                renderTokens(); // p/ atualizar sugestões de bônus visíveis
                saveState();
            });
        }
        // Tecla Esc sai do modo de marcação ou do click-to-move.
        document.addEventListener('keydown', (ev) => {
            if (ev.key !== 'Escape') return;
            if (state.movePicker) {
                ev.preventDefault();
                sairModoMover();
                return;
            }
            if (state.terrainMarkingMode) {
                setTerrainMarkingMode(false);
            }
        });

        // Ctrl+Z / Cmd+Z: desfaz a última ação registrada na pilha de undo.
        // Não dispara em campos de entrada (input/textarea/select/editable)
        // pra não atrapalhar a digitação ou o histórico nativo do form.
        document.addEventListener('keydown', (ev) => {
            if (!(ev.ctrlKey || ev.metaKey)) return;
            if (ev.key !== 'z' && ev.key !== 'Z') return;
            if (ev.shiftKey || ev.altKey) return;
            const tag = (document.activeElement && document.activeElement.tagName) || '';
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
                || (document.activeElement && document.activeElement.isContentEditable)) {
                return;
            }
            ev.preventDefault();
            undoLastMove();
        });

        els.zoomIn.addEventListener('click', () => { setScale(state.viewport.scale * 1.2); saveState(); });
        els.zoomOut.addEventListener('click', () => { setScale(state.viewport.scale / 1.2); saveState(); });
        els.zoomReset.addEventListener('click', () => { centerBoard(); saveState(); });

        els.toggleNumbers.addEventListener('change', (e) => {
            state.showNumbers = e.target.checked;
            els.board.classList.toggle('show-numbers', state.showNumbers);
            // Re-render para criar/remover labels
            renderBoard();
            saveState();
        });

        els.applySize.addEventListener('click', () => {
            const c = parseInt(els.cols.value, 10);
            const r = parseInt(els.rows.value, 10);
            if (!isFinite(c) || !isFinite(r) || c < 5 || r < 5) {
                openAttackResultModal({
                    actionName: 'Ajuste do campo',
                    totalDamage: 0,
                    message: 'Defina ao menos 5 colunas e 5 linhas.'
                });
                return;
            }
            state.cols = clamp(c, 5, 60);
            state.rows = clamp(r, 5, 60);
            // remover tokens fora dos novos limites
            state.tokens = state.tokens.filter(t => t.col < state.cols && t.row < state.rows);
            renderBoard();
            renderTokens();
            centerBoard();
            saveState();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (document.activeElement !== document.body) return;
                if (state.selectedSceneryId) {
                    removeSelectedScenery();
                } else if (state.selectedId) {
                    removeSelectedToken();
                }
            } else if (e.key === 'Escape') {
                if (els.sceneryModal && !els.sceneryModal.hidden) closeSceneryModal();
                else if (els.tokenEditorModal && !els.tokenEditorModal.hidden) closeTokenEditor();
                else if (els.sheetWindow && !els.sheetWindow.hidden) closeSheetWindow();
                else if (els.imageCropModal && !els.imageCropModal.hidden) closeImageCropModal();
                else if (els.adjustModal && !els.adjustModal.hidden) closeAdjustModal();
                else if (els.confirm && !els.confirm.hidden) closeAttackConfirmation();
                else if (state.reachPreview) clearReachPreview(true);
                else if (!els.actionPanel.hidden) closeTokenActionPanel();
                else if (!els.modal.hidden) closeModal();
                else if (state.selectedSceneryId) selectScenery(null);
                else selectToken(null);
            }
        });

        window.addEventListener('resize', () => {
            // mantém o tabuleiro visível em redimensionamentos extremos
            applyViewport();
        });
        window.addEventListener('focus', () => {
            syncFichaTokensFromServer();
            syncBestiaryTokensFromLocal();
        });
        window.addEventListener('beforeunload', () => {
            try {
                pendingServerSave = makeStateSnapshot();
                flushServerSave(true);
            } catch (_) {
                flushServerSave(true);
            }
        });
    }

    // ----------------------------------------------------------------
    // Bootstrap
    // ----------------------------------------------------------------

    async function init() {
        const tag = '[Mesa de Jogo init]';
        console.info(tag, 'Iniciando Mesa de Jogo...');

        // Remove banner "JS NÃO INICIADO" — comprova ao usuário que o
        // arquivo JS foi carregado e parseado sem erros.
        const aliveBanner = document.getElementById('cbJsAlive');
        if (aliveBanner) aliveBanner.remove();

        // Defensivo: garante que nenhum overlay sobreviveu de uma sessão
        // anterior (bfcache, JS travado, navegação interrompida).
        try { closeAllMesaOverlays(); } catch (e) { console.error(tag, 'closeAllMesaOverlays falhou:', e); }

        // Carregamento de estado: se algo falhar aqui, ainda assim
        // criamos uma cena vazia para que o usuário consiga editar.
        try {
            await loadState();
        } catch (e) {
            console.error(tag, 'loadState lançou; criando cena vazia segura:', e);
            try { ensureInitialPage(); } catch (e2) { console.error(tag, 'ensureInitialPage falhou:', e2); }
        }
        // Pós-condição: pelo menos 1 cena ATIVA. Se nem isso, força.
        if (!Array.isArray(state.pages) || state.pages.length === 0) {
            console.warn(tag, 'state.pages vazio após loadState — criando Cena 1.');
            try { ensureInitialPage(); } catch (e) { console.error(tag, e); }
        }
        if (!state.activePageId && state.pages.length) {
            state.activePageId = state.pages[0].id;
            try { loadPageIntoLive(state.pages[0]); } catch (e) { console.error(tag, e); }
        }
        console.info(tag, `Cenas: ${state.pages.length}. Ativa: ${state.activePageId}`);

        window.__cbState = state;

        // Cada bloco de inicialização é envolvido em try/catch para que
        // um erro em uma fase NÃO impeça o resto da página de funcionar.
        // Em particular, queremos que bindEvents rode sempre (botões).
        const fase = (nome, fn) => {
            try { fn(); } catch (e) { console.error(tag, nome, 'falhou:', e); }
        };

        fase('els.cols', () => { if (els.cols) els.cols.value = state.cols; });
        fase('els.rows', () => { if (els.rows) els.rows.value = state.rows; });
        fase('toggleNumbers', () => { if (els.toggleNumbers) els.toggleNumbers.checked = state.showNumbers; });
        fase('mapImage',     () => { if (els.mapImage) els.mapImage.value = state.mapBackground || ''; });
        fase('gridOpacity',  () => { if (els.gridOpacity) els.gridOpacity.value = String(state.gridOpacity); });
        fase('gridSize',     () => { if (els.gridSize) els.gridSize.value = String(CELL_SIZE); });
        fase('snapToGrid',   () => { if (els.snapToGrid) els.snapToGrid.checked = !!state.snapToGrid; });
        fase('imageLayer',   () => { if (els.imageLayer) els.imageLayer.value = state.activeImageLayer; });
        fase('refreshSceneFieldsUI', refreshSceneFieldsUI);
        fase('renderPagesBar', renderPagesBar);
        fase('renderBoard',    renderBoard);
        fase('renderScenery',  renderScenery);
        fase('renderTokens',   renderTokens);
        fase('renderLog',      renderLog);
        fase('renderTurnList', renderTurnList);
        fase('setSidebarTab',  () => setSidebarTab(state.activeSidebarTab || 'registro'));
        fase('consumePendingBestiaryToken', consumePendingBestiaryToken);
        fase('syncFichaTokensFromServer',   syncFichaTokensFromServer);
        fase('syncBestiaryTokensFromLocal', syncBestiaryTokensFromLocal);
        fase('viewport', () => {
            if (state.viewport.scale === 1 && state.viewport.x === 0 && state.viewport.y === 0) {
                centerBoard();
            } else {
                applyViewport();
            }
        });
        // bindEvents é CRÍTICO — sem ele, nenhum botão funciona.
        fase('bindEvents', bindEvents);
        fase('bindTooltip', bindTooltip);

        console.info(tag, 'Mesa de Jogo pronta.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
