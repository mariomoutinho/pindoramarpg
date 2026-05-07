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

    const STORAGE_KEY = 'pindorama:campo-batalha:v1';
    const SERVER_STATE_URL = 'carregar-campo-batalha.php';
    const SERVER_SAVE_URL = 'salvar-campo-batalha.php';
    const SERVER_IMAGE_UPLOAD_URL = 'salvar-imagem-campo-batalha.php';
    const CLIENT_UPLOAD_TARGET_BYTES = 4700 * 1024;
    const BESTIARIO_STORAGE_KEY = 'pindorama.bestiario.criaturas';
    const BESTIARIO_TOKEN_KEY = 'pindorama.campoBatalha.tokenPendente';
    let CELL_SIZE = 56;            // tamanho base da célula em pixels, persistido por cena
    const MIN_SCALE = 0.4;
    const MAX_SCALE = 3;
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
        terrainMarkingMode: false,   // toggle UI: clicar no board adiciona/remove marca
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
        try {
            const resp = await fetch(SERVER_STATE_URL, {
                credentials: 'same-origin',
                cache: 'no-store'
            });
            if (resp.ok) {
                const data = await resp.json();
                if (data.success && data.state && applyStateSnapshot(data.state)) {
                    return;
                }
            }
        } catch (e) {
            console.warn('Não foi possível carregar o Campo de Batalha do servidor.', e);
        }

        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                ensureInitialPage();
                return;
            }
            const snap = JSON.parse(raw);
            applyStateSnapshot(snap);
        } catch (e) {
            ensureInitialPage();
        }
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
                : []
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
        // Sai do modo de marcação ao trocar de cena (segurança UX)
        state.terrainMarkingMode = false;
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

        const frag = document.createDocumentFragment();
        for (let r = 0; r < state.rows; r++) {
            for (let c = 0; c < state.cols; c++) {
                const cell = document.createElement('div');
                cell.className = 'cb-cell' + (((r + c) % 2 === 0) ? ' is-even' : '');
                if (isReachPreviewCell(c, r)) {
                    cell.classList.add('cb-cell--alcance');
                    if (targetCells.has(occupiedKey(c, r))) {
                        cell.classList.add('cb-cell--target');
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
                if (attacker && target && isTokenInActionReach(target, attacker, state.reachPreview.action)) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    openAttackConfirmation(attacker, target, state.reachPreview.action);
                    return;
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
            '<span class="cb-move-badge-meters">0 m</span>';
        document.body.appendChild(el);
        moveBadgeEl = el;
        return el;
    }
    function updateMoveBadge(clientX, clientY, custo) {
        const el = ensureMoveBadge();
        const q = custo.quadrados;
        const m = custo.metros;
        const cellsTxt = q === 1 ? '1 quadrado' : (q + ' quadrados');
        const metersTxt = (m % 1 === 0 ? String(m) : m.toFixed(1).replace('.', ',')) + ' m';
        el.querySelector('.cb-move-badge-cells').textContent = cellsTxt;
        el.querySelector('.cb-move-badge-meters').textContent = metersTxt;
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
        if (moveBadgeEl) moveBadgeEl.classList.remove('is-active');
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
                updateMoveBadge(ev.clientX, ev.clientY, custo);
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
        token.col = snappedCol;
        token.row = snappedRow;
        const el = els.tokensLayer.querySelector(`[data-token-id="${token.id}"]`);
        if (el) el.classList.remove('is-dragging');
        updateTokenElement(token);
        if (state.reachPreview && state.reachPreview.tokenId === token.id) {
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
        if (id !== state.selectedId && els.actionPanel && !els.actionPanel.hidden) {
            closeTokenActionPanel();
        }
        if (id !== state.selectedId) {
            clearReachPreview(true);
        }
        state.selectedId = id;
        updateSelectionVisuals();
        renderSidebarTokens();
        renderSelectedTokenTools();
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
        refreshTerrainUI();
    }

    function terrainCellKey(col, row) { return col + ',' + row; }
    function isTerrainDifficult(col, row) {
        return state.terrainDifficult instanceof Set
            && state.terrainDifficult.has(terrainCellKey(col, row));
    }

    function renderTerrainOverlay() {
        if (!els.terrainLayer) return;
        // Remove tudo e re-popula. Volume típico (poucas dezenas de células)
        // torna isso barato; para mapas grandes podemos otimizar depois.
        els.terrainLayer.innerHTML = '';
        if (!(state.terrainDifficult instanceof Set) || !state.terrainDifficult.size) return;
        const frag = document.createDocumentFragment();
        for (const key of state.terrainDifficult) {
            const m = /^(\d+),(\d+)$/.exec(key);
            if (!m) continue;
            const col = Number(m[1]);
            const row = Number(m[2]);
            if (col < 0 || row < 0 || col >= state.cols || row >= state.rows) continue;
            const cell = document.createElement('div');
            cell.className = 'cb-terrain-cell';
            cell.style.left = (col * CELL_SIZE) + 'px';
            cell.style.top = (row * CELL_SIZE) + 'px';
            cell.style.width = CELL_SIZE + 'px';
            cell.style.height = CELL_SIZE + 'px';
            frag.appendChild(cell);
        }
        els.terrainLayer.appendChild(frag);
    }

    function refreshTerrainUI() {
        const count = state.terrainDifficult instanceof Set ? state.terrainDifficult.size : 0;
        if (els.terrainCount) {
            els.terrainCount.textContent = count === 1
                ? '1 célula marcada'
                : (count + ' células marcadas');
        }
        if (els.toggleTerrainMode) {
            els.toggleTerrainMode.setAttribute('aria-pressed', state.terrainMarkingMode ? 'true' : 'false');
            els.toggleTerrainMode.textContent = state.terrainMarkingMode
                ? 'Sair do modo de marcação'
                : 'Marcar terreno difícil';
        }
        if (els.stage) {
            els.stage.classList.toggle('is-marking-terrain', !!state.terrainMarkingMode);
        }
    }

    function setTerrainMarkingMode(active) {
        state.terrainMarkingMode = !!active;
        // Limpa seleções para evitar UI confusa
        if (state.terrainMarkingMode) {
            selectToken(null);
            if (state.selectedSceneryId) selectScenery(null);
        }
        refreshTerrainUI();
    }

    function toggleTerrainCellAt(col, row) {
        const key = terrainCellKey(col, row);
        if (!(state.terrainDifficult instanceof Set)) state.terrainDifficult = new Set();
        if (state.terrainDifficult.has(key)) state.terrainDifficult.delete(key);
        else state.terrainDifficult.add(key);
        renderTerrainOverlay();
        refreshTerrainUI();
        saveState();
    }

    function clearAllTerrain() {
        const count = state.terrainDifficult instanceof Set ? state.terrainDifficult.size : 0;
        if (!count) return;
        if (!confirm('Remover todas as ' + count + ' marcações de terreno difícil desta cena?')) return;
        state.terrainDifficult = new Set();
        renderTerrainOverlay();
        refreshTerrainUI();
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
        state.tokens.push(t);
        state.selectedId = t.id;
        renderTokens();
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

    function openTokenActionPanel(tokenId, actionType = null) {
        const token = state.tokens.find(t => t.id === tokenId);
        if (!token) return;
        const groups = getTokenActionGroups(token);
        const types = actionType
            ? [actionType]
            : Object.keys(ACTION_LABELS).filter(type => groups[type] && groups[type].length);
        els.actionTitle.textContent = 'Ações';
        els.actionList.innerHTML = '';

        if (!types.length) {
            els.actionList.innerHTML = '<p class="cb-action-empty">Nada cadastrado nesta categoria.</p>';
        } else {
            const frag = document.createDocumentFragment();
            for (const type of types) {
                const section = document.createElement('section');
                section.className = 'cb-action-section';

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

        const title = document.createElement('h4');
        title.textContent = getActionDisplayName(item);
        card.appendChild(title);

        const metaParts = [item.tipo, item.origem].filter(Boolean);
        if (metaParts.length) {
            const meta = document.createElement('span');
            meta.className = 'cb-action-meta';
            meta.textContent = metaParts.join(' • ');
            card.appendChild(meta);
        }

        if (attackWithReach) {
            card.appendChild(buildAttackFields(item));
        } else if (item.detalhe) {
            const detail = document.createElement('p');
            detail.textContent = item.detalhe;
            card.appendChild(detail);
        }

        if (attackWithReach) {
            const buttons = document.createElement('div');
            buttons.className = 'cb-action-buttons';

            const isArea = isAreaAttack(item);

            const selectAttack = document.createElement('button');
            selectAttack.type = 'button';
            selectAttack.className = 'cb-action-attack-btn';
            if (isArea) selectAttack.classList.add('cb-action-area-btn');

            const setAttackLabel = () => {
                const active = isReachPreviewActive(token.id, item);
                if (isArea) {
                    selectAttack.textContent = active
                        ? 'Mire com o mouse — clique para atacar'
                        : 'Mostrar área e mirar';
                } else {
                    selectAttack.textContent = active ? 'Alcance selecionado' : 'Mostrar alcance';
                }
                selectAttack.classList.toggle('is-active', active);
            };
            setAttackLabel();
            selectAttack.addEventListener('click', () => {
                toggleReachPreview(token, item);
                setAttackLabel();
                if (isReachPreviewActive(token.id, item)) {
                    closeTokenActionPanel();
                }
            });
            buttons.appendChild(selectAttack);

            card.appendChild(buttons);
        }

        return card;
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

    function getTokensInActionReach(attacker, action) {
        const reachable = buildActionReachCells(attacker, action);
        return state.tokens.filter(token => {
            if (token.id === attacker.id) return false;
            return getTokenCells(token).some(cell => reachable.has(occupiedKey(cell.col, cell.row)));
        });
    }

    function isTokenInActionReach(target, attacker, action) {
        const reach = buildActionReachCells(attacker, action);
        return getTokenCells(target).some(cell => reach.has(occupiedKey(cell.col, cell.row)));
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
        } else if (shape.tipo === 'linha') {
            const origin = getAreaOriginCell(col, row, size, aim);
            const dir = directionFromOrigin(origin, aim, col, row, size);
            addLineCellsFromOrigin(cells, origin.col, origin.row, shape.tamanho, dir);
        } else if (shape.tipo === 'raio') {
            // Centro = posição do mouse (ou centro do token se não houver aim).
            // Áreas de raio usam o padrão do grid do livro, não um quadrado cheio.
            const center = aim ? { col: aim.col, row: aim.row } : { col: col + Math.floor(size / 2), row: row + Math.floor(size / 2) };
            addRadiusCellsBookPattern(cells, center.col, center.row, shape.tamanho);
        } else if (shape.tipo === 'cubo') {
            const anchor = aim
                ? { col: aim.col, row: aim.row }
                : { col: col + size, row };
            addCubeCellsFromAnchor(cells, anchor.col, anchor.row, shape.tamanho);
        } else {
            // Alcance simples (corpo a corpo, curto, longo)
            return buildReachCellsAt(col, row, token.sizeCells, shape.tamanho);
        }
        return cells;
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
        if (norm.includes('longo') || norm.includes('90') || /\b60\b/.test(norm)) return { tipo: 'simples', tamanho: 60 };
        if (norm.includes('curto') || norm.includes('9m') || /\b6\s*quadr/.test(norm)) return { tipo: 'simples', tamanho: 6 };
        return { tipo: 'simples', tamanho: 1 };
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
    }

    // ----------------------------------------------------------------
    // Modal de confirmação de ação direcionada
    // ----------------------------------------------------------------

    function openAttackConfirmation(attacker, target, action) {
        if (!els.confirm) return;
        const totalAttacks = action.quantidadeAtaques || parseAttackCount(action, action.nome) || 1;
        const attackIndex = getCurrentAttackIndex(action);
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
        const bonus = parseSignedNumber(token.iniciativa) ?? 0;
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

    function renderTurnList() {
        if (!els.turnList) return;
        state.currentTurnIndex = Math.min(state.currentTurnIndex, Math.max(0, state.turns.length - 1));
        refreshRoundDisplay();
        els.turnList.innerHTML = '';
        if (!state.turns.length) {
            els.turnList.innerHTML = '<p class="cb-sidebar-empty">Adicione tokens para criar a ordem de turno.</p>';
            return;
        }
        const round = Math.max(1, Number(state.currentRound) || 1);
        const frag = document.createDocumentFragment();
        state.turns.forEach((turn, idx) => {
            const token = state.tokens.find(t => t.id === turn.tokenId);
            const row = document.createElement('article');
            const isSurprisedNow = !!turn.surprised && round === 1;
            row.className = 'cb-turn-row'
                + (idx === state.currentTurnIndex ? ' is-current' : '')
                + (isSurprisedNow ? ' is-surprised-now' : '');
            row.innerHTML = `<button type="button" class="cb-turn-name">${escapeHtml(token?.name || 'Token removido')}</button>`;
            const input = document.createElement('input');
            input.type = 'number';
            input.value = String(turn.initiative);
            input.addEventListener('change', () => {
                turn.initiative = Number(input.value) || 0;
                saveState();
            });
            row.appendChild(input);

            const surpriseLabel = document.createElement('label');
            surpriseLabel.className = 'cb-turn-surprise' + (turn.surprised ? ' is-on' : '');
            surpriseLabel.title = 'Marca este participante como surpreso. Personagens surpresos não devem agir na rodada 1 (regra do livro).';
            const surpriseBox = document.createElement('input');
            surpriseBox.type = 'checkbox';
            surpriseBox.checked = !!turn.surprised;
            surpriseBox.addEventListener('change', () => {
                turn.surprised = surpriseBox.checked;
                addLog({
                    title: turn.surprised ? 'Marcado surpreso' : 'Removida surpresa',
                    detail: (token?.name || 'Token') + (turn.surprised ? ' começa surpreso (não age na rodada 1).' : ' não está mais surpreso.')
                });
                renderTurnList();
                saveState();
            });
            surpriseLabel.appendChild(surpriseBox);
            surpriseLabel.appendChild(document.createTextNode('Surpreso'));
            row.appendChild(surpriseLabel);

            if (isSurprisedNow) {
                const tag = document.createElement('span');
                tag.className = 'cb-turn-tag-surprised';
                tag.textContent = 'Surpreso — não age nesta rodada';
                row.appendChild(tag);
            }

            const remove = document.createElement('button');
            remove.type = 'button';
            remove.textContent = 'Remover';
            remove.addEventListener('click', () => {
                state.turns.splice(idx, 1);
                state.currentTurnIndex = Math.min(state.currentTurnIndex, Math.max(0, state.turns.length - 1));
                renderTurnList();
                renderTokens();
                saveState();
            });
            row.appendChild(remove);
            row.querySelector('.cb-turn-name').addEventListener('click', () => {
                if (token) selectToken(token.id);
            });
            frag.appendChild(row);
        });
        els.turnList.appendChild(frag);
    }

    function sortTurns() {
        state.turns.sort((a, b) => (Number(b.initiative) || 0) - (Number(a.initiative) || 0));
        state.currentTurnIndex = 0;
        state.currentRound = 1;
        addLog({ title: 'Iniciativa ordenada', detail: 'Início do combate — Rodada 1.' });
        renderTurnList();
        renderTokens();
        saveState();
    }

    function nextTurn() {
        if (!state.turns.length) return;
        const last = state.turns.length - 1;
        if (state.currentTurnIndex >= last) {
            // ciclo completo: avança rodada
            state.currentTurnIndex = 0;
            state.currentRound = (Number(state.currentRound) || 1) + 1;
            addLog({ title: 'Nova rodada', detail: 'Rodada ' + state.currentRound + '.' });
        } else {
            state.currentTurnIndex += 1;
        }
        renderTurnList();
        renderTokens();
        saveState();
    }

    function incrementRound() {
        state.currentRound = (Number(state.currentRound) || 1) + 1;
        addLog({ title: 'Rodada incrementada', detail: 'Rodada ' + state.currentRound + ' (manual).' });
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
        els.actionClose.addEventListener('click', closeTokenActionPanel);

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
        // Tecla Esc sai do modo de marcação rapidamente
        document.addEventListener('keydown', (ev) => {
            if (ev.key === 'Escape' && state.terrainMarkingMode) {
                setTerrainMarkingMode(false);
            }
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
        await loadState();
        window.__cbState = state;
        els.cols.value = state.cols;
        els.rows.value = state.rows;
        els.toggleNumbers.checked = state.showNumbers;
        if (els.mapImage) els.mapImage.value = state.mapBackground || '';
        if (els.gridOpacity) els.gridOpacity.value = String(state.gridOpacity);
        if (els.gridSize) els.gridSize.value = String(CELL_SIZE);
        if (els.snapToGrid) els.snapToGrid.checked = !!state.snapToGrid;
        if (els.imageLayer) els.imageLayer.value = state.activeImageLayer;
        refreshSceneFieldsUI();
        renderPagesBar();
        renderBoard();
        renderScenery();
        renderTokens();
        renderLog();
        renderTurnList();
        setSidebarTab(state.activeSidebarTab || 'registro');
        consumePendingBestiaryToken();
        syncFichaTokensFromServer();
        syncBestiaryTokensFromLocal();
        if (state.viewport.scale === 1 && state.viewport.x === 0 && state.viewport.y === 0) {
            centerBoard();
        } else {
            applyViewport();
        }
        bindEvents();
        bindTooltip();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
