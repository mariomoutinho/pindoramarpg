(function () {
    'use strict';

    let divindadeAtual = null;

    function escaparHtml(t) {
        if (t == null) return '';
        return String(t)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    function lerDivindadeSelecionada() {
        const sel = document.getElementById('divindadeSelect');
        return sel ? sel.value : '';
    }

    async function carregarDivindade(idDiv) {
        if (!idDiv) {
            divindadeAtual = null;
            renderizar();
            return;
        }
        try {
            const resp = await fetch(`divindades-ui.php?id=${encodeURIComponent(idDiv)}`);
            const json = await resp.json();
            if (!json.success) {
                console.error('Erro divindade:', json);
                divindadeAtual = null;
            } else {
                divindadeAtual = json.divindade;
            }
        } catch (e) {
            console.error('Falha divindades-ui:', e);
            divindadeAtual = null;
        }
        renderizar();
    }

    function renderizar() {
        const empty = document.getElementById('divindadeEmpty');
        const conteudo = document.getElementById('divindadeConteudo');

        if (!divindadeAtual) {
            if (empty) empty.style.display = '';
            if (conteudo) conteudo.hidden = true;
            return;
        }
        if (empty) empty.style.display = 'none';
        if (conteudo) conteudo.hidden = false;

        setText('divindadeNome', divindadeAtual.nome);
        setText('divindadeSaudacao', divindadeAtual.saudacao || '');
        setText('divindadeDescricao', divindadeAtual.descricao || '');
        setText('divindadeSimbolo', divindadeAtual.simbolo || '—');
        setText('divindadeArma', divindadeAtual.arma_preferida || '—');

        const devotos = divindadeAtual.devotos || {};
        const racas = (devotos.racas || []).join(', ') || '—';
        const classes = (devotos.classes || []).join(', ') || '—';
        setText('divindadeDevotos', `Raças — ${racas}. Classes — ${classes}.`);

        const tagEnergia = document.getElementById('divindadeEnergiaTag');
        if (tagEnergia) {
            const energia = divindadeAtual.energia || '';
            const opcoes = (divindadeAtual.energia_opcoes || []).join(' / ');
            tagEnergia.textContent = energia === 'qualquer'
                ? `Energia: qualquer (${opcoes})`
                : `Energia: ${energia}`;
            tagEnergia.className = 'divindade-energia divindade-energia-' + (energia || 'unknown');
        }

        const obrig = document.getElementById('divindadeObrigacoes');
        if (obrig) {
            obrig.innerHTML = `<strong>Obrigações & Restrições.</strong> ${escaparHtml(divindadeAtual.obrigacoes || '')}`;
        }

        const lista = document.getElementById('divindadePoderesLista');
        if (lista) {
            const poderes = divindadeAtual.poderes || [];
            // Lista de Poderes Divinos como botões — só o nome aparece
            // na tela principal. Descrição/regras completas só no modal
            // que abre ao clicar (PoderesPindorama.abrirModalPoder).
            lista.innerHTML = poderes.map(p => `
                <button type="button" class="divindade-card-poder"
                        data-poder-id="${escaparHtml(p.id)}"
                        title="Ver detalhes do poder">
                    <span class="divindade-card-poder-nome">${escaparHtml(p.nome)}</span>
                </button>
            `).join('');

            lista.querySelectorAll('.divindade-card-poder').forEach(card => {
                card.addEventListener('click', () => abrirModalDivindade(card.dataset.poderId));
            });
        }

        renderResumoDevocoes();
    }

    function setText(id, txt) {
        const el = document.getElementById(id);
        if (el) el.textContent = txt;
    }

    function abrirModalDivindade(idPoder) {
        if (!divindadeAtual) return;
        const poder = (divindadeAtual.poderes || []).find(p => p.id === idPoder);
        if (!poder) return;

        // Já está adquirido? Procura por tag visível na ficha
        const jaAdquirido = !!document.querySelector(`.poderes-tag-adquirido[data-poder-id="${idPoder}"]`);

        // Delega ao fluxo padrão de poderes (que já trata adquirir/remover, prereqs e limite)
        if (window.PoderesPindorama && typeof window.PoderesPindorama.abrirModalPoder === 'function') {
            window.PoderesPindorama.abrirModalPoder('geral', 'divinos', idPoder, jaAdquirido);
        }
    }

    /**
     * Resumo das Devoções escolhidas, exibido no topo da ficha como
     * chips read-only. Fonte de verdade: as tags `.poderes-tag-adquirido`
     * que o módulo de Poderes mantém em #divindadeAdquiridos. Reagimos
     * a mudanças com MutationObserver — sem precisar duplicar estado.
     */
    function renderResumoDevocoes() {
        const tags  = document.getElementById('divindadeDevocoesResumo');
        const empty = document.getElementById('divindadeDevocoesResumoEmpty');
        if (!tags || !empty) return;

        const adquiridos = document.querySelectorAll('#divindadeAdquiridos .poderes-tag-adquirido');
        if (!adquiridos.length) {
            tags.innerHTML = '';
            empty.style.display = '';
            return;
        }
        empty.style.display = 'none';

        const nomesPorId = {};
        ((divindadeAtual && divindadeAtual.poderes) || []).forEach(p => { nomesPorId[p.id] = p.nome; });

        const itens = Array.from(adquiridos).map(el => {
            const id = el.dataset.poderId || '';
            const nome = nomesPorId[id] || el.textContent.trim() || id;
            return `<button type="button"
                            class="ancestralidade-tag origem-resumo-tag divindade-resumo-tag"
                            data-poder-id="${escaparHtml(id)}"
                            title="Ver detalhes do poder">${escaparHtml(nome)}</button>`;
        });
        tags.innerHTML = itens.join('');

        // Clique no chip de resumo abre o modal de detalhes do poder
        // (mesmo modal usado pelo painel de Poderes). Delegamos ao
        // PoderesPindorama, que cuida de buscar descrição/regras/etc.
        tags.querySelectorAll('.divindade-resumo-tag').forEach(btn => {
            btn.addEventListener('click', () => {
                const pid = btn.dataset.poderId;
                if (!pid) return;
                if (window.PoderesPindorama &&
                    typeof window.PoderesPindorama.abrirModalPoder === 'function') {
                    window.PoderesPindorama.abrirModalPoder('geral', 'divinos', pid, true);
                }
            });
        });
    }

    function init() {
        const sel = document.getElementById('divindadeSelect');
        if (sel) {
            sel.addEventListener('change', () => {
                carregarDivindade(sel.value);
                if (window.PoderesPindorama) window.PoderesPindorama.atualizarPainel();
                renderResumoDevocoes();
            });
            if (sel.value) carregarDivindade(sel.value);
        }

        // (O accordion "Devoção" foi removido — o painel agora exibe
        // todo o conteúdo direto na tela principal do picker.)

        // Botão "editar" do resumo no topo da ficha — dispara o trigger
        // do entity-picker da divindade, que abre o modal já com o painel
        // de Devoção embarcado.
        const editarBtn = document.getElementById('divindadeEditarBtn');
        if (editarBtn) {
            editarBtn.addEventListener('click', () => {
                const field = document.getElementById('divindadeSelect')?.parentElement;
                const trigger = field?.querySelector('.anc-picker-trigger');
                if (trigger) trigger.click();
            });
        }

        // Botão "Remover devoção": limpa a divindade selecionada E todos
        // os poderes divinos concedidos por ela. Estado consistente em
        // vez de divindade vazia com poderes órfãos.
        const removerBtn = document.getElementById('divindadeRemoverBtn');
        if (removerBtn) {
            removerBtn.addEventListener('click', () => {
                if (window.PoderesPindorama &&
                    typeof window.PoderesPindorama.removerTodosDivinos === 'function') {
                    window.PoderesPindorama.removerTodosDivinos();
                }
                const sel = document.getElementById('divindadeSelect');
                if (sel && sel.value !== '') {
                    sel.value = '';
                    sel.dispatchEvent(new Event('input',  { bubbles: true }));
                    sel.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }

        // Observa mudanças no painel de poderes adquiridos da divindade
        // para manter o resumo do topo em sincronia (perfeito quando
        // PoderesPindorama adiciona/remove tags lá).
        const adqHost = document.getElementById('divindadeAdquiridos');
        if (adqHost && 'MutationObserver' in window) {
            const obs = new MutationObserver(() => renderResumoDevocoes());
            obs.observe(adqHost, { childList: true, subtree: true });
        }

        renderResumoDevocoes();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.DivindadesPindorama = { carregarDivindade };
})();
