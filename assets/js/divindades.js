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
            lista.innerHTML = poderes.map(p => `
                <div class="divindade-card-poder" data-poder-id="${escaparHtml(p.id)}">
                    <div class="divindade-card-poder-nome">${escaparHtml(p.nome)}</div>
                    <div class="divindade-card-poder-resumo">${escaparHtml(p.descricao)}</div>
                </div>
            `).join('');

            lista.querySelectorAll('.divindade-card-poder').forEach(card => {
                card.addEventListener('click', () => abrirModalDivindade(card.dataset.poderId));
            });
        }
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

    function init() {
        const sel = document.getElementById('divindadeSelect');
        if (sel) {
            sel.addEventListener('change', () => {
                carregarDivindade(sel.value);
                if (window.PoderesPindorama) window.PoderesPindorama.atualizarPainel();
            });
            if (sel.value) carregarDivindade(sel.value);
        }

        const recolherBtn = document.getElementById('divindadeRecolherBtn');
        const painel = document.getElementById('divindadePanel');
        if (recolherBtn && painel) {
            recolherBtn.addEventListener('click', () => {
                const recolhido = painel.classList.toggle('divindade-panel-recolhido');
                recolherBtn.setAttribute('aria-expanded', String(!recolhido));
                recolherBtn.setAttribute('aria-label', recolhido ? 'Expandir seção' : 'Recolher seção');
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.DivindadesPindorama = { carregarDivindade };
})();
