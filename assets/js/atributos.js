(function () {
    'use strict';

    const ATRIBUTOS = [
        { sigla: 'For', nome: 'forca', label: 'Força' },
        { sigla: 'Des', nome: 'destreza', label: 'Destreza' },
        { sigla: 'Con', nome: 'constituicao', label: 'Constituição' },
        { sigla: 'Int', nome: 'inteligencia', label: 'Inteligência' },
        { sigla: 'Sab', nome: 'sabedoria', label: 'Sabedoria' },
        { sigla: 'Car', nome: 'carisma', label: 'Carisma' },
    ];

    // Tabela de custo do sistema de pontos (T20)
    // -1 dá 1 ponto extra (custa -1); 0 = 0; 1 = 1; 2 = 2; 3 = 4; 4 = 7
    const CUSTOS = { '-1': -1, '0': 0, '1': 1, '2': 2, '3': 4, '4': 7 };
    const VALORES_PERMITIDOS = [-1, 0, 1, 2, 3, 4];
    const PONTOS_INICIAIS = 10;

    // Conversão d20 (sum top 3 of 4d6) para modificador
    function valorParaModificador(soma) {
        if (soma <= 6) return -1;
        if (soma <= 9) return 0;
        if (soma <= 13) return 1;
        if (soma <= 15) return 2;
        if (soma <= 17) return 3;
        return 4;
    }

    function rolar4d6DescartaMenor() {
        const dados = [];
        for (let i = 0; i < 4; i++) dados.push(Math.floor(Math.random() * 6) + 1);
        dados.sort((a, b) => a - b);
        const menor = dados[0];
        const tres = dados.slice(1);
        const soma = tres.reduce((a, b) => a + b, 0);
        return { dados, menor, tres, soma, modificador: valorParaModificador(soma) };
    }

    function rolar6Atributos() {
        let rolagens = [];
        for (let i = 0; i < 6; i++) rolagens.push(rolar4d6DescartaMenor());

        // Garante que a soma dos modificadores seja >= 6, re-rolando o menor.
        let tentativas = 0;
        while (rolagens.reduce((acc, r) => acc + r.modificador, 0) < 6 && tentativas < 30) {
            // Acha o menor pela soma e re-rola
            let menorIdx = 0;
            for (let i = 1; i < 6; i++) {
                if (rolagens[i].soma < rolagens[menorIdx].soma) menorIdx = i;
            }
            rolagens[menorIdx] = rolar4d6DescartaMenor();
            tentativas++;
        }

        return rolagens;
    }

    // ===== Estado interno =====
    let valoresPontos = {}; // {forca: 0, ...}
    let rolagensAtuais = []; // array de rolagens
    let atribuicoesRolagem = {}; // {forca: indiceRolagem, ...}

    function inicializarValoresPontos() {
        valoresPontos = {};
        ATRIBUTOS.forEach(a => { valoresPontos[a.nome] = 0; });
    }

    function calcularPontosUsados() {
        return ATRIBUTOS.reduce((acc, a) => acc + (CUSTOS[String(valoresPontos[a.nome])] || 0), 0);
    }

    function calcularSaldo() {
        return PONTOS_INICIAIS - calcularPontosUsados();
    }

    // ===== Render =====
    function renderControlesPontos() {
        const cont = document.getElementById('atributosControles');
        if (!cont) return;
        cont.innerHTML = ATRIBUTOS.map(a => `
            <div class="atributo-controle" data-atributo="${a.nome}">
                <div class="atributo-nome">${a.label}</div>
                <div class="atributo-valor-row">
                    <button type="button" class="atributo-btn" data-acao="-" data-alvo="${a.nome}">−</button>
                    <span class="atributo-valor" data-valor-de="${a.nome}">0</span>
                    <button type="button" class="atributo-btn" data-acao="+" data-alvo="${a.nome}">+</button>
                </div>
                <div class="atributo-custo" data-custo-de="${a.nome}">0pt</div>
            </div>
        `).join('');

        cont.querySelectorAll('[data-acao]').forEach(btn => {
            btn.addEventListener('click', () => {
                const nome = btn.dataset.alvo;
                const acao = btn.dataset.acao;
                const valor = valoresPontos[nome];
                const idx = VALORES_PERMITIDOS.indexOf(valor);
                if (acao === '+' && idx < VALORES_PERMITIDOS.length - 1) {
                    const novoValor = VALORES_PERMITIDOS[idx + 1];
                    const custoExtra = CUSTOS[String(novoValor)] - CUSTOS[String(valor)];
                    if (calcularPontosUsados() + custoExtra <= PONTOS_INICIAIS) {
                        valoresPontos[nome] = novoValor;
                    }
                } else if (acao === '-' && idx > 0) {
                    valoresPontos[nome] = VALORES_PERMITIDOS[idx - 1];
                }
                atualizarValores();
            });
        });

        atualizarValores();
    }

    function atualizarValores() {
        ATRIBUTOS.forEach(a => {
            const v = valoresPontos[a.nome];
            const custo = CUSTOS[String(v)] || 0;
            const elValor = document.querySelector(`[data-valor-de="${a.nome}"]`);
            const elCusto = document.querySelector(`[data-custo-de="${a.nome}"]`);
            if (elValor) elValor.textContent = (v >= 0 ? '+' : '') + v;
            if (elCusto) elCusto.textContent = (custo >= 0 ? '+' : '') + custo + 'pt';
        });
        const saldo = document.getElementById('atributosSaldo');
        if (saldo) saldo.textContent = calcularSaldo();
    }

    function renderRolagens() {
        const lista = document.getElementById('atributosRolagens');
        if (!lista) return;
        if (!rolagensAtuais.length) {
            lista.innerHTML = '';
            return;
        }
        lista.innerHTML = rolagensAtuais.map((r, i) => `
            <div class="rolagem-item" data-rolagem-idx="${i}">
                <span class="rolagem-dados">${r.dados.join(', ')}</span>
                <span class="rolagem-soma">soma ${r.soma}</span>
                <span class="rolagem-mod">${r.modificador >= 0 ? '+' : ''}${r.modificador}</span>
            </div>
        `).join('');

        renderControlesRolagem();
    }

    function renderControlesRolagem() {
        const cont = document.getElementById('atributosControlesRolagem');
        const distribuir = document.getElementById('atributosDistribuir');
        if (!cont || !distribuir) return;
        if (!rolagensAtuais.length) {
            distribuir.hidden = true;
            return;
        }
        distribuir.hidden = false;

        cont.innerHTML = ATRIBUTOS.map(a => {
            const idx = atribuicoesRolagem[a.nome];
            const valor = idx != null ? rolagensAtuais[idx].modificador : null;
            const valorTexto = valor != null ? (valor >= 0 ? '+' : '') + valor : '—';
            return `
                <div class="atributo-controle" data-atributo="${a.nome}">
                    <div class="atributo-nome">${a.label}</div>
                    <button type="button" class="atributo-rolagem-pick" data-pick-atributo="${a.nome}">${valorTexto}</button>
                </div>
            `;
        }).join('');

        cont.querySelectorAll('[data-pick-atributo]').forEach(btn => {
            btn.addEventListener('click', () => {
                const nome = btn.dataset.pickAtributo;
                ciclarAtribuicaoRolagem(nome);
            });
        });
    }

    function ciclarAtribuicaoRolagem(nome) {
        // Cicla entre rolagens não usadas + a atual
        const atual = atribuicoesRolagem[nome];
        const usadas = new Set(Object.values(atribuicoesRolagem).filter(i => i != null && i !== atual));
        const disponiveis = [];
        for (let i = 0; i < rolagensAtuais.length; i++) {
            if (!usadas.has(i)) disponiveis.push(i);
        }
        // adiciona "vazio"
        disponiveis.push(null);

        let idxAtual = disponiveis.indexOf(atual === undefined ? null : atual);
        if (idxAtual === -1) idxAtual = disponiveis.length - 1;
        const proximo = disponiveis[(idxAtual + 1) % disponiveis.length];
        if (proximo == null) {
            delete atribuicoesRolagem[nome];
        } else {
            atribuicoesRolagem[nome] = proximo;
        }
        renderControlesRolagem();
    }

    // ===== Aplicação =====
    function aplicarValoresNaFicha(valoresPorAtributo) {
        ATRIBUTOS.forEach(a => {
            const inp = document.querySelector(`[name="${a.nome}"]`);
            if (!inp) return;
            const novo = Number(valoresPorAtributo[a.nome] || 0);
            // Preserva o bônus de ancestralidade (data-bonus-ancestralidade)
            const bonus = Number(inp.dataset.bonusAncestralidade || 0);
            inp.value = novo + bonus;
            inp.dispatchEvent(new Event('input', { bubbles: true }));
            inp.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }

    function aplicarPontos() {
        aplicarValoresNaFicha(valoresPontos);
        fecharModal();
    }

    function aplicarRolagem() {
        const valores = {};
        ATRIBUTOS.forEach(a => {
            const idx = atribuicoesRolagem[a.nome];
            valores[a.nome] = idx != null ? rolagensAtuais[idx].modificador : 0;
        });
        aplicarValoresNaFicha(valores);
        fecharModal();
    }

    // ===== Modal =====
    function abrirModal() {
        const modal = document.getElementById('atributosModal');
        if (!modal) return;
        // Carrega valores atuais da ficha (sem bônus de ancestralidade)
        ATRIBUTOS.forEach(a => {
            const inp = document.querySelector(`[name="${a.nome}"]`);
            if (!inp) return;
            const total = Number(inp.value || 0);
            const bonus = Number(inp.dataset.bonusAncestralidade || 0);
            const base = total - bonus;
            valoresPontos[a.nome] = VALORES_PERMITIDOS.includes(base) ? base : 0;
        });
        renderControlesPontos();
        modal.hidden = false;
    }

    function fecharModal() {
        const modal = document.getElementById('atributosModal');
        if (modal) modal.hidden = true;
    }

    function alternarTab(qual) {
        document.querySelectorAll('.atributos-tab').forEach(t => {
            t.classList.toggle('ativa', t.dataset.tab === qual);
        });
        document.querySelectorAll('[data-tab-conteudo]').forEach(c => {
            c.hidden = c.dataset.tabConteudo !== qual;
        });
    }

    // ===== Init =====
    function init() {
        inicializarValoresPontos();

        const btnAbrir = document.getElementById('atributosDistribuirBtn');
        if (btnAbrir) btnAbrir.addEventListener('click', () => {
            // Toca a animação de giro do d20, depois abre o modal
            btnAbrir.classList.remove('girando');
            // Force reflow para reiniciar a animação caso já tenha tocado
            void btnAbrir.offsetWidth;
            btnAbrir.classList.add('girando');
            setTimeout(() => {
                abrirModal();
            }, 350); // abre no meio do giro pra encadear suavemente
            setTimeout(() => {
                btnAbrir.classList.remove('girando');
            }, 700);
        });

        const fechar = document.getElementById('atributosModalFechar');
        if (fechar) fechar.addEventListener('click', fecharModal);

        const modal = document.getElementById('atributosModal');
        if (modal) {
            modal.addEventListener('click', e => {
                if (e.target === modal) fecharModal();
            });
        }

        document.querySelectorAll('.atributos-tab').forEach(tab => {
            tab.addEventListener('click', () => alternarTab(tab.dataset.tab));
        });

        const resetar = document.getElementById('atributosResetarPontos');
        if (resetar) resetar.addEventListener('click', () => {
            inicializarValoresPontos();
            renderControlesPontos();
        });

        const aplicarP = document.getElementById('atributosAplicarPontos');
        if (aplicarP) aplicarP.addEventListener('click', aplicarPontos);

        const rolarBtn = document.getElementById('atributosRolarBtn');
        if (rolarBtn) rolarBtn.addEventListener('click', () => {
            rolagensAtuais = rolar6Atributos();
            atribuicoesRolagem = {};
            renderRolagens();
        });

        const aplicarR = document.getElementById('atributosAplicarRolagem');
        if (aplicarR) aplicarR.addEventListener('click', aplicarRolagem);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
