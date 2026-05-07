(function () {
    'use strict';

    const STORAGE_KEY = 'pindorama.bestiario.criaturas';
    const TOKEN_KEY = 'pindorama.campoBatalha.tokenPendente';

    const base = window.BESTIARIO_BASE || { criaturas: [] };
    let criaturas = carregarCriaturas();

    const els = {
        lista: document.getElementById('bestiarioLista'),
        contador: document.getElementById('bestiarioContador'),
        busca: document.getElementById('bestiarioBusca'),
        nd: document.getElementById('bestiarioFiltroNd'),
        tipo: document.getElementById('bestiarioFiltroTipo'),
        tamanho: document.getElementById('bestiarioFiltroTamanho'),
        bioma: document.getElementById('bestiarioFiltroBioma'),
        papel: document.getElementById('bestiarioFiltroPapel'),
        limpar: document.getElementById('bestiarioLimparFiltros'),
        modal: document.getElementById('bestiarioModal'),
        modalConteudo: document.getElementById('bestiarioModalConteudo'),
        fecharModal: document.getElementById('bestiarioFecharModal'),
        formPanel: document.getElementById('bestiarioFormPanel'),
        formTitulo: document.getElementById('bestiarioFormTitulo'),
        form: document.getElementById('bestiarioForm'),
        cancelar: document.getElementById('bestiarioCancelarEdicao'),
        ataquesContainer: document.getElementById('criaturaAtaquesContainer'),
        adicionarAtaque: document.getElementById('criaturaAdicionarAtaque'),
        tokenImagem: document.getElementById('criaturaTokenImagem'),
        tokenAjuste: document.getElementById('criaturaTokenAjuste'),
        tokenArquivo: document.getElementById('criaturaTokenArquivo'),
        tokenPreview: document.getElementById('criaturaTokenPreview'),
        tokenPreviewImg: document.getElementById('criaturaTokenPreviewImg'),
        tokenCarregar: document.getElementById('criaturaTokenCarregar'),
        tokenUsarFicha: document.getElementById('criaturaTokenUsarFicha'),
        tokenResetar: document.getElementById('criaturaTokenResetar'),
        tokenSalvar: document.getElementById('criaturaTokenSalvar'),
        tokenRemover: document.getElementById('criaturaTokenRemover'),
        tokenZoom: document.getElementById('criaturaTokenZoom'),
        tokenFocoX: document.getElementById('criaturaTokenFocoX'),
        tokenFocoY: document.getElementById('criaturaTokenFocoY')
    };

    const ALCANCES_ATAQUE = [
        { value: 'corpo a corpo', label: 'Corpo a corpo — 1,5m (1 quadrado)', grupo: 'Distância' },
        { value: 'curto', label: 'Curto — 9m (6 quadrados)', grupo: 'Distância' },
        { value: 'longo', label: 'Longo — 90m (60 quadrados)', grupo: 'Distância' },
        { value: 'cubo-1.5', label: 'Cubo de 1,5m (1×1)', grupo: 'Cubo' },
        { value: 'cubo-3', label: 'Cubo de 3m (2×2)', grupo: 'Cubo' },
        { value: 'cone-4.5', label: 'Cone de 4,5m', grupo: 'Cone' },
        { value: 'cone-6', label: 'Cone de 6m', grupo: 'Cone' },
        { value: 'cone-9', label: 'Cone de 9m', grupo: 'Cone' },
        { value: 'raio-1.5', label: 'Raio de 1,5m', grupo: 'Raio' },
        { value: 'raio-3', label: 'Raio de 3m', grupo: 'Raio' },
        { value: 'raio-6', label: 'Raio de 6m', grupo: 'Raio' },
        { value: 'linha-15', label: 'Linha de 15m', grupo: 'Linha' }
    ];

    function carregarCriaturas() {
        try {
            const salvas = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const porId = new Map((base.criaturas || []).map((criatura) => [criatura.id, criatura]));
            salvas.forEach((criatura) => porId.set(criatura.id, criatura));
            return Array.from(porId.values());
        } catch (_) {
            return base.criaturas || [];
        }
    }

    function salvarCriaturas() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(criaturas));
    }

    function normalizar(texto) {
        return String(texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function escapeHtml(valor) {
        return String(valor ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function defaultTokenAdjustment() {
        return { scale: 1, x: 0, y: 0 };
    }

    function normalizarTokenAdjustment(valor = {}) {
        return {
            scale: Math.min(6, Math.max(0.2, Number(valor.scale) || 1)),
            x: Math.min(220, Math.max(-220, Number(valor.x) || 0)),
            y: Math.min(220, Math.max(-220, Number(valor.y) || 0))
        };
    }

    function parseTokenAdjustment(valor) {
        if (!valor) return defaultTokenAdjustment();
        if (typeof valor === 'object') return normalizarTokenAdjustment(valor);
        try {
            return normalizarTokenAdjustment(JSON.parse(valor));
        } catch (_) {
            return defaultTokenAdjustment();
        }
    }

    function tokenImagemSrc(criatura) {
        return criatura?.tokenImagem || criatura?.token?.tokenImagem || criatura?.token?.imagem || criatura?.imagem || '';
    }

    function tokenAjuste(criatura) {
        const candidato = criatura?.tokenImagemAjuste
            ?? criatura?.token?.tokenImagemAjuste
            ?? criatura?.token?.imagemAjuste;
        return parseTokenAdjustment(candidato);
    }

    function tokenStyle(ajuste) {
        const atual = normalizarTokenAdjustment(ajuste);
        return `--criatura-token-scale:${atual.scale};--criatura-token-x:${atual.x}%;--criatura-token-y:${atual.y}%;`;
    }

    function tokenPreviewHtml(criatura, classeExtra = '') {
        const src = tokenImagemSrc(criatura);
        const classes = ['bestiario-ficha-token', 'bestiario-ficha-token--mini'];
        if (classeExtra) classes.push(classeExtra);
        if (!src) {
            return `<div class="${classes.join(' ')}">${escapeHtml((criatura.nome || '?').charAt(0).toUpperCase())}</div>`;
        }
        return `<div class="${classes.join(' ')}" style="${escapeHtml(tokenStyle(tokenAjuste(criatura)))}"><img src="${escapeHtml(src)}" alt="${escapeHtml(criatura.nome || 'Criatura')}" onerror="this.remove(); this.parentElement.textContent='${escapeHtml((criatura.nome || '?').charAt(0).toUpperCase())}';"></div>`;
    }

    function linhas(valor) {
        return String(valor || '').split('\n').map((linha) => linha.trim()).filter(Boolean);
    }

    function arrayParaTexto(valor) {
        return Array.isArray(valor) ? valor.join('\n') : String(valor || '');
    }

    function textoBloco(valor) {
        const texto = String(valor || '').trim();
        if (!texto) return '<p>Sem registro.</p>';
        return texto.split(/\n{2,}/).map((paragrafo) => `<p>${escapeHtml(paragrafo).replace(/\n/g, '<br>')}</p>`).join('');
    }

    function listaBloco(valor) {
        const itens = Array.isArray(valor) ? valor : linhas(valor);
        if (!itens.length) return '<p>Sem registro.</p>';
        return `<ul>${itens.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
    }

    function normalizarAtaques(valor) {
        if (!valor) return [];
        const lista = Array.isArray(valor) ? valor : linhas(valor);
        return lista.map((item) => {
            if (typeof item === 'string') {
                const texto = item.trim();
                if (!texto) return null;
                const tipoBonus = inferirTipoBonus(texto);
                return {
                    nome: texto.split(/[,(|-]/)[0].trim() || 'Ataque',
                    alcance: inferirAlcanceAtaque(texto),
                    dano: extrairDano(texto),
                    tipoDano: extrairTipoDano(texto),
                    tipoBonus,
                    bonusAtaque: tipoBonus === 'rolagem' ? extrairBonusAtaque(texto) : '',
                    saveTipo: extrairSaveTipo(texto),
                    saveCD: extrairSaveCD(texto),
                    descricao: texto
                };
            }
            if (!item || typeof item !== 'object') return null;
            const tipoBonus = normalizarTipoBonus(item.tipoBonus ?? item.tipo_bonus ?? (item.acertoAutomatico ? 'automatico' : 'rolagem'));
            return {
                nome: String(item.nome || item.name || 'Ataque'),
                alcance: normalizarAlcanceAtaque(item.alcance || ''),
                dano: String(item.dano || item.danoFormula || ''),
                tipoDano: String(item.tipoDano || item.tipo_dano || item.tipo || ''),
                tipoBonus,
                bonusAtaque: tipoBonus === 'rolagem' ? String(item.bonusAtaque ?? item.bonus_ataque ?? item.bonus ?? '') : '',
                saveTipo: normalizarSaveTipo(item.saveTipo ?? item.save_tipo ?? ''),
                saveCD: String(item.saveCD ?? item.save_cd ?? item.cd ?? ''),
                descricao: String(item.descricao || item.detalhe || '')
            };
        }).filter(Boolean);
    }

    function normalizarTipoBonus(valor) {
        const chave = normalizar(valor);
        if (chave.includes('automa') || chave === 'auto') return 'automatico';
        return 'rolagem';
    }

    function inferirTipoBonus(texto) {
        const chave = normalizar(texto);
        if (chave.includes('acerto automatico') || chave.includes('automaticamente') || chave.includes('sem rolagem')) return 'automatico';
        return 'rolagem';
    }

    function normalizarSaveTipo(valor) {
        const chave = normalizar(valor);
        if (chave.startsWith('fort')) return 'fortitude';
        if (chave.startsWith('ref')) return 'reflexos';
        if (chave.startsWith('von') || chave.startsWith('wil')) return 'vontade';
        return '';
    }

    function extrairSaveTipo(texto) {
        const chave = normalizar(texto);
        if (chave.includes('fortitude') || /\bfort\s*cd/.test(chave)) return 'fortitude';
        if (chave.includes('reflexo') || /\bref\s*cd/.test(chave)) return 'reflexos';
        if (chave.includes('vontade') || /\bvon\s*cd/.test(chave)) return 'vontade';
        return '';
    }

    function extrairSaveCD(texto) {
        const match = String(texto || '').match(/cd\s*(\d+)/i);
        return match ? match[1] : '';
    }

    function normalizarAlcanceAtaque(valor) {
        const chave = normalizar(valor);
        // Match exato dos valores conhecidos primeiro
        const direto = ALCANCES_ATAQUE.find((it) => it.value === valor || normalizar(it.value) === chave);
        if (direto) return direto.value;
        // Padrões de área
        if (chave.includes('cubo')) {
            if (chave.includes('3')) return 'cubo-3';
            return 'cubo-1.5';
        }
        if (chave.includes('cone')) {
            if (chave.includes('9')) return 'cone-9';
            if (chave.includes('6')) return 'cone-6';
            return 'cone-4.5';
        }
        if (chave.includes('raio') || chave.includes('esfera')) {
            if (chave.includes('6')) return 'raio-6';
            if (chave.includes('3')) return 'raio-3';
            return 'raio-1.5';
        }
        if (chave.includes('linha')) return 'linha-15';
        if (chave.includes('longo') || chave.includes('90m') || /\b60\b/.test(chave)) return 'longo';
        if (chave.includes('curto') || chave.includes('9m') || /\b6\s*quadr/.test(chave)) return 'curto';
        return 'corpo a corpo';
    }

    function inferirAlcanceAtaque(texto) {
        return normalizarAlcanceAtaque(texto || 'corpo a corpo');
    }

    function extrairDano(texto) {
        return String(texto || '').match(/\d+d\d+\s*(?:[+-]\s*\d+)?/i)?.[0]?.replace(/\s+/g, '') || '';
    }

    function extrairBonusAtaque(texto) {
        const match = String(texto || '').match(/(?:ataque|teste|b[oô]nus)?\s*([+-]\s*\d+)/i);
        return match ? match[1].replace(/\s+/g, '') : '';
    }

    function extrairTipoDano(texto) {
        const tipos = ['cortante', 'perfurante', 'contundente', 'fogo', 'frio', 'eletricidade', 'ácido', 'acido', 'veneno', 'mental', 'energia', 'trevas', 'luz'];
        const chave = normalizar(texto);
        return tipos.find((tipo) => chave.includes(normalizar(tipo))) || '';
    }

    function rotuloAlcance(valor) {
        const alcance = normalizarAlcanceAtaque(valor);
        return ALCANCES_ATAQUE.find((item) => item.value === alcance)?.label || 'Corpo a corpo — 1,5m (1 quadrado)';
    }

    function renderAlcancesOptions() {
        const grupos = new Map();
        for (const item of ALCANCES_ATAQUE) {
            const chave = item.grupo || 'Outros';
            if (!grupos.has(chave)) grupos.set(chave, []);
            grupos.get(chave).push(item);
        }
        return Array.from(grupos.entries()).map(([grupo, items]) =>
            `<optgroup label="${escapeHtml(grupo)}">${items.map((it) => `<option value="${escapeHtml(it.value)}">${escapeHtml(it.label)}</option>`).join('')}</optgroup>`
        ).join('');
    }

    function rotuloSaveTipo(valor) {
        const chave = normalizarSaveTipo(valor);
        if (chave === 'fortitude') return 'Fortitude';
        if (chave === 'reflexos') return 'Reflexos';
        if (chave === 'vontade') return 'Vontade';
        return '';
    }

    function renderAtaquesForm(ataques = []) {
        if (!els.ataquesContainer) return;
        els.ataquesContainer.innerHTML = '';
        const lista = normalizarAtaques(ataques);
        if (!lista.length) lista.push({ nome: 'Ataque', alcance: 'corpo a corpo', dano: '', tipoDano: '', bonusAtaque: '', descricao: '' });
        lista.forEach((ataque) => adicionarAtaqueForm(ataque));
    }

    function adicionarAtaqueForm(ataque = {}) {
        if (!els.ataquesContainer) return;
        const tipoBonusAtual = normalizarTipoBonus(ataque.tipoBonus || (ataque.acertoAutomatico ? 'automatico' : 'rolagem'));
        const saveTipoAtual = normalizarSaveTipo(ataque.saveTipo);
        const row = document.createElement('article');
        row.className = 'criatura-ataque-row';
        row.dataset.tipoBonus = tipoBonusAtual;
        row.innerHTML = `
            <label>Nome <input data-criatura-ataque="nome" placeholder="Ataque" value="${escapeHtml(ataque.nome || 'Ataque')}" /></label>
            <label>Alcance
                <select data-criatura-ataque="alcance" class="criatura-ataque-alcance">
                    ${renderAlcancesOptions()}
                </select>
            </label>
            <label>Dano <input data-criatura-ataque="dano" placeholder="2d6+3" value="${escapeHtml(ataque.dano || '')}" /></label>
            <label>Tipo de dano <input data-criatura-ataque="tipoDano" placeholder="cortante" value="${escapeHtml(ataque.tipoDano || '')}" /></label>
            <label>Bônus
                <select data-criatura-ataque="tipoBonus">
                    <option value="rolagem"${tipoBonusAtual === 'rolagem' ? ' selected' : ''}>Rolagem (1d20 + bônus)</option>
                    <option value="automatico"${tipoBonusAtual === 'automatico' ? ' selected' : ''}>Acerto automático</option>
                </select>
            </label>
            <label data-criatura-ataque-bonus-rolagem ${tipoBonusAtual === 'automatico' ? 'hidden' : ''}>
                Bônus de ataque <input data-criatura-ataque="bonusAtaque" type="number" step="1" placeholder="0" value="${escapeHtml(ataque.bonusAtaque ?? '')}" />
            </label>
            <label data-criatura-ataque-save-tipo>
                Teste do alvo
                <select data-criatura-ataque="saveTipo">
                    <option value=""${saveTipoAtual === '' ? ' selected' : ''}>Sem teste</option>
                    <option value="fortitude"${saveTipoAtual === 'fortitude' ? ' selected' : ''}>Fortitude</option>
                    <option value="reflexos"${saveTipoAtual === 'reflexos' ? ' selected' : ''}>Reflexos</option>
                    <option value="vontade"${saveTipoAtual === 'vontade' ? ' selected' : ''}>Vontade</option>
                </select>
            </label>
            <label data-criatura-ataque-save-cd ${saveTipoAtual === '' ? 'hidden' : ''}>
                CD do teste <input data-criatura-ataque="saveCD" type="number" step="1" min="0" placeholder="15" value="${escapeHtml(ataque.saveCD ?? '')}" />
            </label>
            <label class="criatura-ataque-desc">Descrição <textarea data-criatura-ataque="descricao" placeholder="Efeitos especiais do ataque">${escapeHtml(ataque.descricao || '')}</textarea></label>
            <button type="button" class="criatura-remover-ataque" data-attack-remove>Remover</button>
        `;
        row.querySelector('[data-criatura-ataque="alcance"]').value = normalizarAlcanceAtaque(ataque.alcance);

        const tipoBonusSelect = row.querySelector('[data-criatura-ataque="tipoBonus"]');
        const bonusWrap = row.querySelector('[data-criatura-ataque-bonus-rolagem]');
        tipoBonusSelect.addEventListener('change', () => {
            const novo = tipoBonusSelect.value;
            row.dataset.tipoBonus = novo;
            if (novo === 'automatico') {
                bonusWrap.setAttribute('hidden', '');
                row.querySelector('[data-criatura-ataque="bonusAtaque"]').value = '';
            } else {
                bonusWrap.removeAttribute('hidden');
            }
        });

        const saveTipoSelect = row.querySelector('[data-criatura-ataque="saveTipo"]');
        const saveCDWrap = row.querySelector('[data-criatura-ataque-save-cd]');
        saveTipoSelect.addEventListener('change', () => {
            if (saveTipoSelect.value === '') {
                saveCDWrap.setAttribute('hidden', '');
                row.querySelector('[data-criatura-ataque="saveCD"]').value = '';
            } else {
                saveCDWrap.removeAttribute('hidden');
            }
        });

        row.querySelector('[data-attack-remove]').addEventListener('click', () => {
            row.remove();
            if (!els.ataquesContainer.querySelector('.criatura-ataque-row')) {
                adicionarAtaqueForm();
            }
        });
        els.ataquesContainer.appendChild(row);
    }

    function lerAtaquesForm() {
        if (!els.ataquesContainer) return [];
        return Array.from(els.ataquesContainer.querySelectorAll('.criatura-ataque-row')).map((row) => {
            const ataque = {};
            row.querySelectorAll('[data-criatura-ataque]').forEach((campo) => {
                ataque[campo.dataset.criaturaAtaque] = campo.value.trim();
            });
            ataque.alcance = normalizarAlcanceAtaque(ataque.alcance);
            ataque.tipoBonus = normalizarTipoBonus(ataque.tipoBonus);
            ataque.saveTipo = normalizarSaveTipo(ataque.saveTipo);
            if (ataque.tipoBonus === 'automatico') ataque.bonusAtaque = '';
            if (!ataque.saveTipo) ataque.saveCD = '';
            return ataque;
        }).filter((ataque) => Object.values(ataque).some((valor) => String(valor || '').trim() !== ''));
    }

    function ataqueResumoHtml(ataque) {
        const tipoBonus = normalizarTipoBonus(ataque.tipoBonus);
        const saveLabel = ataque.saveTipo
            ? `${rotuloSaveTipo(ataque.saveTipo)} CD ${ataque.saveCD || '?'} (sucesso reduz dano à metade)`
            : '';
        const partes = [
            ataque.dano && `Dano ${ataque.dano}`,
            ataque.tipoDano,
            tipoBonus === 'automatico'
                ? 'Acerto automático'
                : (ataque.bonusAtaque !== '' && ataque.bonusAtaque !== undefined && `Ataque ${Number(ataque.bonusAtaque) >= 0 ? '+' : ''}${ataque.bonusAtaque}`),
            saveLabel,
            rotuloAlcance(ataque.alcance)
        ].filter(Boolean);
        return `
            <article class="bestiario-ataque-card">
                <div>
                    <strong>${escapeHtml(ataque.nome || 'Ataque')}</strong>
                    <span>${escapeHtml(partes.join(' • ') || rotuloAlcance(ataque.alcance))}</span>
                </div>
                ${ataque.descricao ? `<p>${escapeHtml(ataque.descricao)}</p>` : ''}
            </article>
        `;
    }

    function criaturaFiltrada(criatura) {
        const termo = normalizar(els.busca.value);
        const nomeOk = !termo || normalizar(`${criatura.nome} ${criatura.nomeAlternativo} ${criatura.fraseImpacto}`).includes(termo);
        const ndOk = !els.nd.value || String(criatura.nd) === els.nd.value;
        const tipoOk = !els.tipo.value || criatura.tipo === els.tipo.value;
        const tamanhoOk = !els.tamanho.value || criatura.tamanho === els.tamanho.value;
        const biomaOk = !els.bioma.value || criatura.bioma === els.bioma.value;
        const papelOk = !els.papel.value || normalizar(criatura.papelTatico).includes(normalizar(els.papel.value));
        return nomeOk && ndOk && tipoOk && tamanhoOk && biomaOk && papelOk;
    }

    function renderizar() {
        const visiveis = criaturas.filter(criaturaFiltrada);
        els.contador.textContent = `${visiveis.length} ${visiveis.length === 1 ? 'criatura' : 'criaturas'}`;
        els.lista.innerHTML = visiveis.length ? visiveis.map(cardCriatura).join('') : '<div class="bestiario-vazio">Nenhuma criatura encontrada.</div>';
    }

    function cardCriatura(criatura) {
        const imagem = criatura.imagem
            ? `<img src="${escapeHtml(criatura.imagem)}" alt="${escapeHtml(criatura.nome)}" onerror="this.remove(); this.parentElement.textContent='Imagem pendente';">`
            : 'Imagem pendente';
        const tokenSrc = tokenImagemSrc(criatura);
        const tokenCustomizado = tokenSrc
            && (criatura.tokenImagem && criatura.tokenImagem !== criatura.imagem
                || (criatura.tokenImagemAjuste && (criatura.tokenImagemAjuste.scale !== 1 || criatura.tokenImagemAjuste.x !== 0 || criatura.tokenImagemAjuste.y !== 0)));
        const tokenResumo = tokenCustomizado ? 'Token customizado' : 'Token usa imagem da ficha';

        return `
            <article class="bestiario-card" data-criatura-id="${escapeHtml(criatura.id)}">
                <div class="bestiario-card-media">${imagem}</div>
                <div>
                    <h3>${escapeHtml(criatura.nome)}</h3>
                    ${criatura.nomeAlternativo ? `<small>${escapeHtml(criatura.nomeAlternativo)}</small>` : ''}
                </div>
                <p class="bestiario-impacto">${escapeHtml(criatura.fraseImpacto || '')}</p>
                <div class="bestiario-meta">
                    <span>ND ${escapeHtml(criatura.nd)}</span>
                    <span>${escapeHtml(criatura.tipo)}</span>
                    <span>${escapeHtml(criatura.tamanho)}</span>
                    <span>${escapeHtml(criatura.bioma)}</span>
                    <span>${escapeHtml(criatura.papelTatico)}</span>
                </div>
                <div class="bestiario-combate">
                    <span>PV ${escapeHtml(criatura.pvMax)}</span>
                    <span>Defesa ${escapeHtml(criatura.defesa)}</span>
                </div>
                <div class="bestiario-card-token">
                    ${tokenPreviewHtml(criatura)}
                    <span>${escapeHtml(tokenResumo)}</span>
                </div>
                <div class="bestiario-card-actions">
                    <button type="button" data-action="ver">Ver ficha</button>
                    <button type="button" data-action="editar">Editar</button>
                    <button type="button" data-action="token">Preparar token</button>
                </div>
            </article>
        `;
    }

    function abrirFicha(id) {
        const criatura = criaturas.find((item) => item.id === id);
        if (!criatura) return;
        els.modalConteudo.innerHTML = fichaHtml(criatura);
        els.modal.hidden = false;
    }

    function fichaHtml(criatura) {
        return `
            <header class="bestiario-ficha-header bestiario-ficha-header--compacta">
                ${imagemCriaturaHtml(criatura)}
                <div>
                    <h2 id="bestiarioModalTitulo">${escapeHtml(criatura.nome)}</h2>
                    ${criatura.nomeAlternativo ? `<p><strong>${escapeHtml(criatura.nomeAlternativo)}</strong></p>` : ''}
                    <p>${escapeHtml(criatura.tipo || 'Criatura')} ${criatura.tamanho ? `• ${escapeHtml(criatura.tamanho)}` : ''} ${criatura.nd !== undefined ? `• ND ${escapeHtml(criatura.nd)}` : ''}</p>
                    ${criatura.fraseImpacto ? `<p><em>${escapeHtml(criatura.fraseImpacto)}</em></p>` : ''}
                </div>
            </header>
            <div class="bestiario-ficha-grid bestiario-ficha-grid--compacta">
                ${fichaAmeaca(criatura)}
                ${bloco('Traços / Habilidades especiais', listaBloco(criatura.habilidades))}
                ${bloco('Resistências', `<p>${escapeHtml([
                    (criatura.resistencias || []).join(', '),
                    (criatura.vulnerabilidades || []).length ? `Vulnerabilidades: ${(criatura.vulnerabilidades || []).join(', ')}` : '',
                    (criatura.imunidades || []).length ? `Imunidades: ${(criatura.imunidades || []).join(', ')}` : ''
                ].filter(Boolean).join(' • ') || 'Nenhuma.')}</p>`)}
                ${bloco('Notas do Mestre', textoBloco(criatura.notasMestre || criatura.notasDesign))}
            </div>
            <div class="bestiario-modal-actions">
                <button type="button" data-modal-action="token" data-id="${escapeHtml(criatura.id)}">Preparar token</button>
                <button type="button" data-modal-action="editar" data-id="${escapeHtml(criatura.id)}">Editar</button>
            </div>
        `;
    }

    function imagemCriaturaHtml(criatura) {
        const src = tokenImagemSrc(criatura);
        if (!src) {
            return `<div class="bestiario-ficha-token">${escapeHtml((criatura.nome || '?').charAt(0).toUpperCase())}</div>`;
        }
        return `<div class="bestiario-ficha-token" style="${escapeHtml(tokenStyle(tokenAjuste(criatura)))}"><img src="${escapeHtml(src)}" alt="${escapeHtml(criatura.nome || 'Criatura')}"></div>`;
    }

    function bloco(titulo, conteudo) {
        return `<section class="bestiario-ficha-bloco"><h3>${escapeHtml(titulo)}</h3>${conteudo}</section>`;
    }

    function fichaAmeaca(criatura) {
        const atributos = criatura.atributos || {};
        const ataques = normalizarAtaques(criatura.ataques);
        return `
            <section class="bestiario-ficha-bloco bestiario-ameaca">
                <h3>Ficha de criatura</h3>
                <div class="bestiario-atributos">
                    ${atributoCard('For', atributos.forca)}
                    ${atributoCard('Des', atributos.destreza)}
                    ${atributoCard('Con', atributos.constituicao)}
                    ${atributoCard('Int', atributos.inteligencia)}
                    ${atributoCard('Sab', atributos.sabedoria)}
                    ${atributoCard('Car', atributos.carisma)}
                </div>
                <div class="bestiario-recursos">
                    ${recursoCard('Pontos de Vida', criatura.pvMax)}
                    ${recursoCard('Pontos de Mana', criatura.pmMax)}
                    ${recursoCard('Defesa', criatura.defesa)}
                    ${recursoCard('Deslocamento', criatura.deslocamento)}
                </div>
                <div class="bestiario-defesas">
                    <span>Fort ${escapeHtml(criatura.fortitude || '0')}</span>
                    <span>Ref ${escapeHtml(criatura.reflexos || '0')}</span>
                    <span>Von ${escapeHtml(criatura.vontade || '0')}</span>
                    <span>Percep. ${escapeHtml(criatura.percepcao || '0')}</span>
                </div>
                ${criatura.sentidos ? `<p><strong>Sentidos:</strong> ${escapeHtml(criatura.sentidos)}</p>` : ''}
                <h4>Ataques</h4>
                <div class="bestiario-ataques-grid">
                    ${ataques.length ? ataques.map(ataqueResumoHtml).join('') : '<p>Sem ataques cadastrados.</p>'}
                </div>
            </section>
        `;
    }

    function atributoCard(rotulo, valor) {
        return `<div class="bestiario-atributo-card"><span>${escapeHtml(rotulo)}</span><strong>${escapeHtml(valor || '0')}</strong></div>`;
    }

    function recursoCard(rotulo, valor) {
        return `<label class="bestiario-recurso-card"><span>${escapeHtml(rotulo)}</span><input value="${escapeHtml(valor ?? '')}" readonly></label>`;
    }

    function fecharModal() {
        els.modal.hidden = true;
        els.modalConteudo.innerHTML = '';
    }

    function gerarId(nome) {
        return normalizar(nome).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `criatura-${Date.now()}`;
    }

    function lerAtributos(texto) {
        const atributos = { forca: '', destreza: '', constituicao: '', inteligencia: '', sabedoria: '', carisma: '' };
        linhas(texto).forEach((linha) => {
            const [chave, ...resto] = linha.split(':');
            if (!chave || !resto.length) return;
            const nome = normalizar(chave).replace(/[^a-z]/g, '');
            const valor = resto.join(':').trim();
            if (nome in atributos) atributos[nome] = valor;
        });
        return atributos;
    }

    function escreverAtributos(atributos) {
        const atual = atributos || {};
        return ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma']
            .map((chave) => `${chave}: ${atual[chave] || ''}`)
            .join('\n');
    }

    function lerForm() {
        const nome = campo('criaturaNome').value.trim();
        const id = campo('criaturaId').value || gerarId(nome);
        const imagemFicha = campo('criaturaImagem').value.trim();
        const imagemToken = els.tokenImagem?.value.trim() || imagemFicha;
        const criatura = {
            id,
            nome,
            nomeAlternativo: campo('criaturaNomeAlternativo').value.trim(),
            fraseImpacto: campo('criaturaFraseImpacto').value.trim(),
            nd: Number(campo('criaturaNd').value || 0),
            tipo: campo('criaturaTipo').value,
            tamanho: campo('criaturaTamanho').value,
            bioma: campo('criaturaBioma').value,
            habitat: campo('criaturaHabitat').value.trim(),
            papelTatico: campo('criaturaPapelTatico').value,
            imagem: imagemFicha,
            tokenImagem: imagemToken,
            tokenImagemAjuste: parseTokenAdjustment(els.tokenAjuste?.value),
            pvMax: Number(campo('criaturaPvMax').value || 0),
            pmMax: Number(campo('criaturaPmMax').value || 0),
            defesa: Number(campo('criaturaDefesa').value || 0),
            deslocamento: campo('criaturaDeslocamento').value.trim(),
            iniciativa: campo('criaturaIniciativa').value.trim(),
            percepcao: campo('criaturaPercepcao').value.trim(),
            sentidos: campo('criaturaSentidos').value.trim(),
            fortitude: campo('criaturaFortitude').value.trim(),
            reflexos: campo('criaturaReflexos').value.trim(),
            vontade: campo('criaturaVontade').value.trim(),
            ataques: lerAtaquesForm(),
            habilidades: linhas(campo('criaturaHabilidades').value),
            atributos: lerAtributos(campo('criaturaAtributos').value),
            pericias: linhas(campo('criaturaPericias').value),
            vulnerabilidades: linhas(campo('criaturaVulnerabilidades').value),
            resistencias: linhas(campo('criaturaResistencias').value),
            imunidades: linhas(campo('criaturaImunidades').value),
            conceito: campo('criaturaConceito').value.trim(),
            descricao: campo('criaturaDescricao').value.trim(),
            origemInspiracao: campo('criaturaOrigemInspiracao').value.trim(),
            comportamento: campo('criaturaComportamento').value.trim(),
            sinaisPresenca: linhas(campo('criaturaSinaisPresenca').value),
            fichaCompleta: campo('criaturaFichaCompleta').value.trim(),
            taticasCombate: campo('criaturaTaticasCombate').value.trim(),
            usoCampanha: campo('criaturaUsoCampanha').value.trim(),
            ganchosAventura: linhas(campo('criaturaGanchosAventura').value),
            tesouroRecompensas: campo('criaturaTesouroRecompensas').value.trim() || campo('criaturaTesouroMecanico').value.trim(),
            variacoesND: campo('criaturaVariacoesNd').value.trim(),
            comparacaoEquilibrio: campo('criaturaComparacaoEquilibrio').value.trim(),
            registroConsistencia: campo('criaturaRegistroConsistencia').value.trim(),
            notasDesign: campo('criaturaNotasDesign').value.trim(),
            notasMestre: campo('criaturaNotasMestre').value.trim()
        };
        criatura.token = montarToken(criatura);
        return criatura;
    }

    function campo(id) {
        return document.getElementById(id);
    }

    function preencherForm(criatura) {
        campo('criaturaId').value = criatura.id || '';
        campo('criaturaNome').value = criatura.nome || '';
        campo('criaturaNomeAlternativo').value = criatura.nomeAlternativo || '';
        campo('criaturaFraseImpacto').value = criatura.fraseImpacto || '';
        campo('criaturaNd').value = criatura.nd ?? '';
        campo('criaturaTipo').value = criatura.tipo || '';
        campo('criaturaTamanho').value = criatura.tamanho || '';
        campo('criaturaBioma').value = criatura.bioma || '';
        campo('criaturaHabitat').value = criatura.habitat || '';
        campo('criaturaPapelTatico').value = criatura.papelTatico || '';
        campo('criaturaImagem').value = criatura.imagem || '';
        if (els.tokenImagem) els.tokenImagem.value = criatura.tokenImagem || criatura.token?.tokenImagem || '';
        setTokenAdjustment(tokenAjuste(criatura));
        atualizarTokenPreview();
        campo('criaturaConceito').value = criatura.conceito || '';
        campo('criaturaDescricao').value = criatura.descricao || '';
        campo('criaturaOrigemInspiracao').value = criatura.origemInspiracao || '';
        campo('criaturaComportamento').value = criatura.comportamento || '';
        campo('criaturaSinaisPresenca').value = arrayParaTexto(criatura.sinaisPresenca);
        campo('criaturaTaticasCombate').value = criatura.taticasCombate || '';
        campo('criaturaUsoCampanha').value = criatura.usoCampanha || '';
        campo('criaturaGanchosAventura').value = arrayParaTexto(criatura.ganchosAventura);
        campo('criaturaTesouroRecompensas').value = criatura.tesouroRecompensas || '';
        campo('criaturaVariacoesNd').value = criatura.variacoesND || '';
        campo('criaturaComparacaoEquilibrio').value = criatura.comparacaoEquilibrio || '';
        campo('criaturaRegistroConsistencia').value = criatura.registroConsistencia || '';
        campo('criaturaNotasDesign').value = criatura.notasDesign || '';
        campo('criaturaIniciativa').value = criatura.iniciativa || '';
        campo('criaturaSentidos').value = criatura.sentidos || '';
        campo('criaturaPercepcao').value = criatura.percepcao || '';
        campo('criaturaDefesa').value = criatura.defesa ?? '';
        campo('criaturaFortitude').value = criatura.fortitude || '';
        campo('criaturaReflexos').value = criatura.reflexos || '';
        campo('criaturaVontade').value = criatura.vontade || '';
        campo('criaturaPvMax').value = criatura.pvMax ?? '';
        campo('criaturaPmMax').value = criatura.pmMax ?? '';
        campo('criaturaDeslocamento').value = criatura.deslocamento || '';
        renderAtaquesForm(criatura.ataques);
        campo('criaturaAtributos').value = escreverAtributos(criatura.atributos);
        campo('criaturaPericias').value = arrayParaTexto(criatura.pericias);
        campo('criaturaHabilidades').value = arrayParaTexto(criatura.habilidades);
        campo('criaturaVulnerabilidades').value = arrayParaTexto(criatura.vulnerabilidades);
        campo('criaturaResistencias').value = arrayParaTexto(criatura.resistencias);
        campo('criaturaImunidades').value = arrayParaTexto(criatura.imunidades);
        campo('criaturaTesouroMecanico').value = '';
        campo('criaturaFichaCompleta').value = criatura.fichaCompleta || '';
        campo('criaturaNotasMestre').value = criatura.notasMestre || '';
        els.formTitulo.textContent = criatura.id ? 'Editar criatura' : 'Adicionar criatura';
        els.formPanel.open = true;
        els.formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function limparForm() {
        els.form.reset();
        campo('criaturaId').value = '';
        renderAtaquesForm();
        if (els.tokenImagem) els.tokenImagem.value = '';
        if (els.tokenArquivo) els.tokenArquivo.value = '';
        setTokenAdjustment(defaultTokenAdjustment());
        atualizarTokenPreview();
        els.formTitulo.textContent = 'Adicionar criatura';
    }

    function montarToken(criatura) {
        const imagemEfetiva = criatura.tokenImagem || criatura.imagem || '';
        const ajusteEfetivo = tokenAjuste(criatura);
        return {
            id: criatura.id,
            nome: criatura.nome,
            nd: criatura.nd,
            tipo: criatura.tipo,
            tamanho: criatura.tamanho,
            imagem: imagemEfetiva,
            tokenImagem: imagemEfetiva,
            imagemAjuste: ajusteEfetivo,
            tokenImagemAjuste: ajusteEfetivo,
            pvMax: criatura.pvMax,
            pmMax: criatura.pmMax,
            defesa: criatura.defesa,
            deslocamento: criatura.deslocamento,
            ataquesPrincipais: normalizarAtaques(criatura.ataques),
            habilidadesPrincipais: (criatura.habilidades || []).slice(0, 5).map((habilidade) => habilidade.split('.')[0]),
            bioma: criatura.bioma,
            papelTatico: criatura.papelTatico
        };
    }

    function lerTokenAdjustmentForm() {
        return normalizarTokenAdjustment({
            scale: els.tokenZoom?.value,
            x: els.tokenFocoX?.value,
            y: els.tokenFocoY?.value
        });
    }

    function setTokenAdjustment(ajuste) {
        const atual = normalizarTokenAdjustment(ajuste);
        if (els.tokenAjuste) els.tokenAjuste.value = JSON.stringify(atual);
        if (els.tokenZoom) els.tokenZoom.value = String(atual.scale);
        if (els.tokenFocoX) els.tokenFocoX.value = String(atual.x);
        if (els.tokenFocoY) els.tokenFocoY.value = String(atual.y);
        aplicarTokenPreviewAdjustment(atual);
    }

    function aplicarTokenPreviewAdjustment(ajuste) {
        if (!els.tokenPreview) return;
        const atual = normalizarTokenAdjustment(ajuste);
        els.tokenPreview.style.setProperty('--criatura-token-scale', String(atual.scale));
        els.tokenPreview.style.setProperty('--criatura-token-x', `${atual.x}%`);
        els.tokenPreview.style.setProperty('--criatura-token-y', `${atual.y}%`);
    }

    function atualizarTokenPreview() {
        if (!els.tokenPreview || !els.tokenPreviewImg) return;
        const src = (els.tokenImagem?.value.trim() || campo('criaturaImagem')?.value.trim() || '');
        const ajuste = parseTokenAdjustment(els.tokenAjuste?.value);
        aplicarTokenPreviewAdjustment(ajuste);
        if (src) {
            els.tokenPreviewImg.src = src;
            els.tokenPreviewImg.alt = campo('criaturaNome')?.value || 'Token da criatura';
            els.tokenPreview.classList.add('has-image');
        } else {
            els.tokenPreviewImg.removeAttribute('src');
            els.tokenPreviewImg.alt = '';
            els.tokenPreview.classList.remove('has-image');
        }
    }

    function resetarTokenAdjustment() {
        setTokenAdjustment(defaultTokenAdjustment());
    }

    function salvarTokenAtualNoBestiario() {
        const criatura = lerForm();
        if (!criatura.nome) {
            alert('Informe o nome da criatura antes de salvar o token.');
            return;
        }
        const indice = criaturas.findIndex((item) => item.id === criatura.id);
        if (indice >= 0) {
            const anterior = criaturas[indice];
            criaturas[indice] = {
                ...anterior,
                tokenImagem: criatura.tokenImagem,
                tokenImagemAjuste: criatura.tokenImagemAjuste,
                token: {
                    ...(anterior.token || {}),
                    imagem: criatura.tokenImagem,
                    tokenImagem: criatura.tokenImagem,
                    imagemAjuste: criatura.tokenImagemAjuste,
                    tokenImagemAjuste: criatura.tokenImagemAjuste
                }
            };
        } else {
            criaturas.push(criatura);
        }
        salvarCriaturas();
        renderizar();
        alert(`Token salvo para ${criatura.nome}.`);
    }

    function bindTokenPreviewDrag() {
        if (!els.tokenPreview) return;
        const pointers = new Map();
        let start = null;

        els.tokenPreview.addEventListener('pointerdown', (event) => {
            if (!els.tokenPreview.classList.contains('has-image')) return;
            if (event.target.closest('button, input, a, select, textarea')) return;
            event.preventDefault();
            els.tokenPreview.setPointerCapture?.(event.pointerId);
            pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
            start = {
                ajuste: parseTokenAdjustment(els.tokenAjuste?.value),
                center: pointerCenter(pointers),
                distance: pointerDistance(pointers)
            };
            els.tokenPreview.classList.add('is-adjusting');
        });

        els.tokenPreview.addEventListener('pointermove', (event) => {
            if (!start || !pointers.has(event.pointerId)) return;
            event.preventDefault();
            pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
            const center = pointerCenter(pointers);
            const rect = els.tokenPreview.getBoundingClientRect();
            const dx = ((center.x - start.center.x) / Math.max(1, rect.width)) * 100;
            const dy = ((center.y - start.center.y) / Math.max(1, rect.height)) * 100;
            const distance = pointerDistance(pointers);
            const pinchScale = start.distance && distance ? distance / start.distance : 1;
            setTokenAdjustment({
                scale: start.ajuste.scale * pinchScale,
                x: start.ajuste.x + dx,
                y: start.ajuste.y + dy
            });
        });

        function finish(event) {
            pointers.delete(event.pointerId);
            if (!pointers.size) {
                start = null;
                els.tokenPreview.classList.remove('is-adjusting');
            } else {
                start = {
                    ajuste: parseTokenAdjustment(els.tokenAjuste?.value),
                    center: pointerCenter(pointers),
                    distance: pointerDistance(pointers)
                };
            }
        }

        els.tokenPreview.addEventListener('pointerup', finish);
        els.tokenPreview.addEventListener('pointercancel', finish);
        els.tokenPreview.addEventListener('wheel', (event) => {
            if (!els.tokenPreview.classList.contains('has-image')) return;
            event.preventDefault();
            const ajuste = parseTokenAdjustment(els.tokenAjuste?.value);
            const factor = event.deltaY < 0 ? 1.08 : 1 / 1.08;
            setTokenAdjustment({ ...ajuste, scale: ajuste.scale * factor });
        }, { passive: false });
    }

    function pointerCenter(pointers) {
        const values = Array.from(pointers.values());
        return {
            x: values.reduce((sum, pointer) => sum + pointer.x, 0) / values.length,
            y: values.reduce((sum, pointer) => sum + pointer.y, 0) / values.length
        };
    }

    function pointerDistance(pointers) {
        const values = Array.from(pointers.values());
        if (values.length < 2) return 0;
        return Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y);
    }

    window.prepararTokenCriatura = function prepararTokenCriatura(criaturaId) {
        const criatura = criaturaDoFormSeAtual(criaturaId) || criaturas.find((item) => item.id === criaturaId);
        if (!criatura) return null;
        const token = montarToken(criatura);
        localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
        alert(`Token preparado: ${token.nome}. Abra o Campo de Batalha para posicioná-lo.`);
        return token;
    };

    function criaturaDoFormSeAtual(criaturaId) {
        if (!els.formPanel?.open) return null;
        if (!campo('criaturaId')?.value || campo('criaturaId').value !== criaturaId) return null;
        if (!campo('criaturaNome')?.value.trim()) return null;
        return lerForm();
    }

    function editarCriatura(id) {
        const criatura = criaturas.find((item) => item.id === id);
        if (!criatura) return;
        fecharModal();
        preencherForm(criatura);
    }

    els.lista.addEventListener('click', (event) => {
        const botao = event.target.closest('button[data-action]');
        if (!botao) return;
        const card = botao.closest('[data-criatura-id]');
        const id = card?.dataset.criaturaId;
        if (botao.dataset.action === 'ver') abrirFicha(id);
        if (botao.dataset.action === 'editar') editarCriatura(id);
        if (botao.dataset.action === 'token') window.prepararTokenCriatura(id);
    });

    els.modalConteudo.addEventListener('click', (event) => {
        const botao = event.target.closest('button[data-modal-action]');
        if (!botao) return;
        if (botao.dataset.modalAction === 'token') window.prepararTokenCriatura(botao.dataset.id);
        if (botao.dataset.modalAction === 'editar') editarCriatura(botao.dataset.id);
    });

    els.fecharModal.addEventListener('click', fecharModal);
    els.modal.addEventListener('click', (event) => {
        if (event.target === els.modal) fecharModal();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !els.modal.hidden) fecharModal();
    });

    [els.busca, els.nd, els.tipo, els.tamanho, els.bioma, els.papel].forEach((el) => {
        el.addEventListener('input', renderizar);
        el.addEventListener('change', renderizar);
    });

    els.limpar.addEventListener('click', () => {
        [els.busca, els.nd, els.tipo, els.tamanho, els.bioma, els.papel].forEach((el) => { el.value = ''; });
        renderizar();
    });

    els.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const criatura = lerForm();
        if (!criatura.nome) return;
        const indice = criaturas.findIndex((item) => item.id === criatura.id);
        if (indice >= 0) criaturas[indice] = criatura;
        else criaturas.push(criatura);
        salvarCriaturas();
        limparForm();
        renderizar();
    });

    els.cancelar.addEventListener('click', limparForm);

    if (els.adicionarAtaque) {
        els.adicionarAtaque.addEventListener('click', () => adicionarAtaqueForm());
    }

    if (els.tokenImagem) {
        els.tokenImagem.addEventListener('input', atualizarTokenPreview);
    }

    const imagemFichaCampo = campo('criaturaImagem');
    if (imagemFichaCampo) {
        imagemFichaCampo.addEventListener('input', atualizarTokenPreview);
    }

    [els.tokenZoom, els.tokenFocoX, els.tokenFocoY].filter(Boolean).forEach((input) => {
        input.addEventListener('input', () => setTokenAdjustment(lerTokenAdjustmentForm()));
    });

    if (els.tokenCarregar && els.tokenArquivo) {
        els.tokenCarregar.addEventListener('click', () => els.tokenArquivo.click());
        els.tokenArquivo.addEventListener('change', () => {
            const arquivo = els.tokenArquivo.files?.[0];
            if (!arquivo) return;
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                if (els.tokenImagem) els.tokenImagem.value = String(reader.result || '');
                resetarTokenAdjustment();
                atualizarTokenPreview();
            });
            reader.readAsDataURL(arquivo);
        });
    }

    if (els.tokenUsarFicha) {
        els.tokenUsarFicha.addEventListener('click', () => {
            if (els.tokenImagem) els.tokenImagem.value = campo('criaturaImagem')?.value.trim() || '';
            resetarTokenAdjustment();
            atualizarTokenPreview();
        });
    }

    if (els.tokenResetar) {
        els.tokenResetar.addEventListener('click', resetarTokenAdjustment);
    }

    if (els.tokenSalvar) {
        els.tokenSalvar.addEventListener('click', salvarTokenAtualNoBestiario);
    }

    if (els.tokenRemover) {
        els.tokenRemover.addEventListener('click', () => {
            if (els.tokenImagem) els.tokenImagem.value = '';
            if (els.tokenArquivo) els.tokenArquivo.value = '';
            resetarTokenAdjustment();
            atualizarTokenPreview();
        });
    }

    bindTokenPreviewDrag();
    renderAtaquesForm();
    atualizarTokenPreview();
    renderizar();
})();
