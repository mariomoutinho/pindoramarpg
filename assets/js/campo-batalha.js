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
    const BESTIARIO_STORAGE_KEY = 'pindorama.bestiario.criaturas';
    const BESTIARIO_TOKEN_KEY = 'pindorama.campoBatalha.tokenPendente';
    const CELL_SIZE = 56;          // tamanho base da célula em pixels
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
        viewport: { x: 0, y: 0, scale: 1 },
        tokens: [],                // { id, fichaId|null, name, tokenImage, tokenImageAdjust, fotoImage, col, row, sizeCells, rotation }
        selectedId: null,
        fichas: [],                // cache da lista de fichas
        fichasLoaded: false,
        bestiario: [],             // cache da lista de criaturas do bestiário
        bestiarioFiltros: {},
        bestiarioLoaded: false,
        ancestralidadeSizes: {},
        ancestralidadeSizesLoaded: false,
        modalMode: 'fichas',
        reachPreview: null
    };

    // ----------------------------------------------------------------
    // Refs DOM
    // ----------------------------------------------------------------

    const els = {
        stage: document.getElementById('cbStage'),
        viewport: document.getElementById('cbViewport'),
        board: document.getElementById('cbBoard'),
        tokensLayer: document.getElementById('cbTokensLayer'),
        addToken: document.getElementById('cbAddToken'),
        addBestiaryToken: document.getElementById('cbAddBestiaryToken'),
        removeToken: document.getElementById('cbRemoveToken'),
        rotateToken: document.getElementById('cbRotateToken'),
        clearAll: document.getElementById('cbClearAll'),
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
        resultOk: document.getElementById('cbResultOk')
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

    // ----------------------------------------------------------------
    // Persistência
    // ----------------------------------------------------------------

    function saveState() {
        try {
            const snap = {
                cols: state.cols,
                rows: state.rows,
                showNumbers: state.showNumbers,
                viewport: state.viewport,
                tokens: state.tokens
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
        } catch (e) {
            // localStorage cheio ou bloqueado — ignorar silenciosamente
        }
    }

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const snap = JSON.parse(raw);
            if (snap.cols) state.cols = snap.cols;
            if (snap.rows) state.rows = snap.rows;
            if (typeof snap.showNumbers === 'boolean') state.showNumbers = snap.showNumbers;
            if (snap.viewport) state.viewport = snap.viewport;
            if (Array.isArray(snap.tokens)) {
                const before = JSON.stringify(snap.tokens);
                state.tokens = snap.tokens.map(migrateLegacyTokenFields);
                if (before !== JSON.stringify(state.tokens)) {
                    saveState();
                }
            }
        } catch (e) {
            // estado corrompido — recomeçar
        }
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
        delete token.image;
        delete token.imageAdjust;
        return token;
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
        els.board.style.gridTemplateColumns = `repeat(${state.cols}, ${CELL_SIZE}px)`;
        els.board.style.gridTemplateRows = `repeat(${state.rows}, ${CELL_SIZE}px)`;
        els.board.style.width = (state.cols * CELL_SIZE) + 'px';
        els.board.style.height = (state.rows * CELL_SIZE) + 'px';
        els.tokensLayer.style.width = els.board.style.width;
        els.tokensLayer.style.height = els.board.style.height;

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
        for (const t of state.tokens) {
            frag.appendChild(buildTokenElement(t));
        }
        els.tokensLayer.appendChild(frag);
        updateActionButtons();
    }

    function buildTokenElement(token) {
        const sizePx = token.sizeCells * CELL_SIZE;
        const wrap = document.createElement('div');
        wrap.className = 'cb-token';
        if (token.id === state.selectedId) wrap.classList.add('is-selected');
        wrap.dataset.tokenId = token.id;
        wrap.style.left = (token.col * CELL_SIZE) + 'px';
        wrap.style.top = (token.row * CELL_SIZE) + 'px';
        wrap.style.width = sizePx + 'px';
        wrap.style.height = sizePx + 'px';
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
        const sizePx = token.sizeCells * CELL_SIZE;
        el.style.left = (token.col * CELL_SIZE) + 'px';
        el.style.top = (token.row * CELL_SIZE) + 'px';
        el.style.width = sizePx + 'px';
        el.style.height = sizePx + 'px';
        el.style.transform = `rotate(${token.rotation || 0}deg)`;
    }

    function updateSelectionVisuals() {
        els.tokensLayer.querySelectorAll('.cb-token').forEach(el => {
            el.classList.toggle('is-selected', el.dataset.tokenId === state.selectedId);
        });
        updateActionButtons();
    }

    function updateActionButtons() {
        const has = !!state.selectedId;
        els.removeToken.disabled = !has;
        els.rotateToken.disabled = !has;
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
            openTokenActionPanel(token.id);
        }, LONG_PRESS_MS);
        try { els.stage.setPointerCapture(ev.pointerId); } catch (_) {}
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
            interaction = null;
            return;
        }
        clearTokenLongPress();
        if (interaction.longPressFired) {
            const el = els.tokensLayer.querySelector(`[data-token-id="${token.id}"]`);
            if (el) el.classList.remove('is-dragging');
            interaction = null;
            return;
        }
        // snap-to-grid + clamp dentro do tabuleiro
        const max = token.sizeCells;
        const didClick = Math.abs((interaction.tempCol ?? token.col) - token.col) < 0.18
            && Math.abs((interaction.tempRow ?? token.row) - token.row) < 0.18;
        const snappedCol = clamp(Math.round(interaction.tempCol), 0, state.cols - max);
        const snappedRow = clamp(Math.round(interaction.tempRow), 0, state.rows - max);
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
            startSize: token.sizeCells,
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
        if (finalSize !== token.sizeCells) {
            token.sizeCells = finalSize;
            updateTokenElement(token);
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
        const sizePx = token.sizeCells * CELL_SIZE;
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
    }

    function removeSelectedToken() {
        if (!state.selectedId) return;
        state.tokens = state.tokens.filter(t => t.id !== state.selectedId);
        state.selectedId = null;
        clearReachPreview(false);
        renderBoard();
        renderTokens();
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
        if (!state.tokens.length) return;
        if (!confirm('Remover todos os tokens do campo?')) return;
        state.tokens = [];
        state.selectedId = null;
        clearReachPreview(false);
        renderBoard();
        renderTokens();
        saveState();
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
                if (ficha.defesa_total !== undefined) token.defesa = ficha.defesa_total;
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
        addTokenFromFicha({
            id: token.id,
            source: 'bestiario',
            personagem: token.nome || 'Criatura',
            personagem_imagem: token.imagem || null,
            tamanho: token.tamanho,
            deslocamento: token.deslocamento,
            nd: token.nd,
            tipo: token.tipo,
            pvAtual: token.pvAtual ?? token.pvAtuais ?? token.pvMax,
            pvMax: token.pvMax,
            pmAtual: token.pmAtual ?? token.pmAtuais ?? token.pmMax,
            pmMax: token.pmMax,
            defesa: token.defesa,
            bioma: token.bioma,
            papelTatico: token.papelTatico,
            ataquesPrincipais: token.ataques || token.ataquesPrincipais || [],
            habilidadesPrincipais: token.habilidadesPrincipais || [],
            actions: buildActionsFromBestiaryToken(token)
        });
    }

    function montarTokenCriatura(criatura) {
        const token = criatura.token || {
            id: criatura.id,
            nome: criatura.nome,
            nd: criatura.nd,
            tipo: criatura.tipo,
            tamanho: criatura.tamanho,
            imagem: criatura.imagem,
            pvAtual: criatura.pvAtual ?? criatura.pvAtuais ?? criatura.pvMax,
            pvMax: criatura.pvMax,
            pmAtual: criatura.pmAtual ?? criatura.pmAtuais ?? criatura.pmMax,
            pmMax: criatura.pmMax,
            defesa: criatura.defesa,
            deslocamento: criatura.deslocamento,
            ataquesPrincipais: criatura.ataques || [],
            ataques: criatura.ataques || [],
            habilidadesPrincipais: (criatura.habilidades || []).slice(0, 5).map(h => String(h).split('.')[0]),
            bioma: criatura.bioma,
            papelTatico: criatura.papelTatico
        };
        return Object.assign({}, token, {
            id: token.id || criatura.id,
            nome: token.nome || criatura.nome,
            nd: token.nd ?? criatura.nd,
            tipo: token.tipo || criatura.tipo,
            tamanho: token.tamanho || criatura.tamanho,
            imagem: token.imagem || criatura.imagem,
            pvAtual: token.pvAtual ?? token.pvAtuais ?? criatura.pvAtual ?? criatura.pvAtuais ?? criatura.pvMax,
            pvMax: token.pvMax ?? criatura.pvMax,
            pmAtual: token.pmAtual ?? token.pmAtuais ?? criatura.pmAtual ?? criatura.pmAtuais ?? criatura.pmMax,
            pmMax: token.pmMax ?? criatura.pmMax,
            defesa: token.defesa ?? criatura.defesa,
            deslocamento: token.deslocamento || criatura.deslocamento,
            ataques: token.ataques || token.ataquesPrincipais || criatura.ataques || [],
            ataquesPrincipais: token.ataquesPrincipais || token.ataques || criatura.ataques || [],
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
            const size = Math.max(1, Number(token.sizeCells || 1));
            for (let row = token.row; row < token.row + size; row++) {
                for (let col = token.col; col < token.col + size; col++) {
                    occupied.add(occupiedKey(col, row));
                }
            }
        }
        return occupied;
    }

    function canPlaceTokenAt(token, col, row, occupied) {
        const size = Math.max(1, Number(token.sizeCells || 1));
        if (col < 0 || row < 0 || col + size > state.cols || row + size > state.rows) return false;
        for (let y = row; y < row + size; y++) {
            for (let x = col; x < col + size; x++) {
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
        if (typeof value === 'object') return normalizeImageAdjustment(value);
        try {
            return normalizeImageAdjustment(JSON.parse(value));
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
        const ajuste = parseImageAdjustment(adjustment);
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

        els.actionPanel.hidden = false;
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
            || ['corpo a corpo', 'curto', 'longo', 'cubo', 'cone', 'raio', 'esfera', 'linha'].some(alvo => alc.includes(alvo))
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

    function rollSingleMeleeAttack(attacker, item, target, index) {
        const attackBonus = parseAttackBonus(item);
        const defense = parseDefense(target);
        const damageFormula = item.danoFormula || parseDamageFormula(item.dano || item.detalhe || item.nome || '') || '1d8';
        const tipoBonus = String(item.tipoBonus || '').toLowerCase();
        const acertoAutomatico = tipoBonus === 'automatico' || item.acertoAutomatico === true;

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
                pvAtual: clampResource(target.pvAtual, target.pvMax),
                pvMax: target.pvMax || 0
            };
        }

        const d20 = rollDie(20);
        const total = d20 + attackBonus;

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
            // Cone direcionado pelo mouse (8 direções)
            const dir = aim ? directionFromTo(col, row, size, aim.col, aim.row) : 'n';
            addConeCells(cells, col, row, size, shape.tamanho, dir);
        } else if (shape.tipo === 'linha') {
            const dir = aim ? directionFromTo(col, row, size, aim.col, aim.row) : 'n';
            addLineCells(cells, col, row, size, shape.tamanho, dir);
        } else if (shape.tipo === 'raio') {
            // Centro = posição do mouse (ou centro do token se não houver aim)
            const center = aim ? { col: aim.col, row: aim.row } : { col: col + Math.floor(size / 2), row: row + Math.floor(size / 2) };
            addRadiusCellsCentered(cells, center.col, center.row, shape.tamanho);
        } else if (shape.tipo === 'cubo') {
            const center = aim ? { col: aim.col, row: aim.row } : { col: col + Math.floor(size / 2), row: row + Math.floor(size / 2) };
            addCubeCellsCentered(cells, center.col, center.row, shape.tamanho);
        } else {
            // Alcance simples (corpo a corpo, curto, longo)
            return buildReachCellsAt(col, row, token.sizeCells, shape.tamanho);
        }
        return cells;
    }

    /**
     * Calcula a direção (8 cardeais) do token (col,row,size) até o ponto (tx,ty).
     * Retorna uma das 8 strings: 'n','ne','l','se','s','so','o','no'.
     * Pindorama: cada quadrado = 1,5m em qualquer direção (incl. diagonal).
     */
    function directionFromTo(col, row, size, tx, ty) {
        const cx = col + (size - 1) / 2;
        const cy = row + (size - 1) / 2;
        const dx = tx - cx;
        const dy = ty - cy;
        if (dx === 0 && dy === 0) return 'n';
        const angle = Math.atan2(dy, dx); // -PI..PI; 0 = leste, PI/2 = sul (eixo y para baixo)
        // Divide em 8 setores
        const oct = Math.round(angle / (Math.PI / 4));
        switch (oct) {
            case 0: return 'l';
            case 1: return 'se';
            case 2: return 's';
            case 3: return 'so';
            case 4: case -4: return 'o';
            case -1: return 'ne';
            case -2: return 'n';
            case -3: return 'no';
            default: return 'n';
        }
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

    function addCubeCellsCentered(cells, cx, cy, lado) {
        addRadiusCellsCentered(cells, cx, cy, lado);
    }

    function parseAreaShape(alcance) {
        const raw = String(alcance || '');
        const norm = normalizeText(raw);
        // Match nos novos valores chaveados (cubo-3, cone-9, raio-6, linha-15)
        const m = raw.match(/^(cubo|cone|raio|linha)-([\d.]+)$/i);
        if (m) {
            const tipo = m[1].toLowerCase();
            const valor = Number(m[2]);
            return { tipo, tamanho: areaSquaresFromMeters(tipo, valor) };
        }
        if (norm.includes('cubo')) {
            return { tipo: 'cubo', tamanho: norm.includes('3') ? 2 : 1 };
        }
        if (norm.includes('cone')) {
            const m9 = norm.includes('9');
            const m6 = norm.includes('6');
            return { tipo: 'cone', tamanho: m9 ? 6 : (m6 ? 4 : 3) };
        }
        if (norm.includes('raio') || norm.includes('esfera')) {
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
        // Cone Pindorama: a cada passo, a "fileira" tem `step` células
        // perpendiculares (1, 2, 3, ..., N). Total: 1+2+...+N células.
        const perp = { dx: -v.dy, dy: v.dx };
        for (let step = 1; step <= len; step++) {
            // Centro da fileira do passo atual (a `step` células da borda do token)
            const ax = cx + v.dx * (size / 2 + step - 0.5);
            const ay = cy + v.dy * (size / 2 + step - 0.5);
            // Distribui simetricamente para ímpar; assimétrica (sobra à direita) para par
            const halfL = Math.floor((step - 1) / 2);
            const halfR = Math.ceil((step - 1) / 2);
            for (let s = -halfL; s <= halfR; s++) {
                const c = Math.round(ax + perp.dx * s);
                const r = Math.round(ay + perp.dy * s);
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
    }

    function closeAttackResultModal() {
        if (!els.result) return;
        els.result.hidden = true;
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
        els.clearAll.addEventListener('click', clearAllTokens);

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
                if (state.selectedId && document.activeElement === document.body) {
                    removeSelectedToken();
                }
            } else if (e.key === 'Escape') {
                if (els.confirm && !els.confirm.hidden) closeAttackConfirmation();
                else if (state.reachPreview) clearReachPreview(true);
                else if (!els.actionPanel.hidden) closeTokenActionPanel();
                else if (!els.modal.hidden) closeModal();
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
    }

    // ----------------------------------------------------------------
    // Bootstrap
    // ----------------------------------------------------------------

    function init() {
        loadState();
        window.__cbState = state;
        els.cols.value = state.cols;
        els.rows.value = state.rows;
        els.toggleNumbers.checked = state.showNumbers;
        renderBoard();
        renderTokens();
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
