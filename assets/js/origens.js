(function () {
    'use strict';

    const NOMES_ATRIBUTO = {
        for: 'Força', des: 'Destreza', con: 'Constituição',
        int: 'Inteligência', sab: 'Sabedoria', car: 'Carisma',
    };

    let origemAtual = null;        // objeto da origem carregada do endpoint
    let escolhasAtuais = [];       // [{tipo:'pericia',nome:'X'} | {tipo:'poder',id:'..'}]
    let poderEmFoco = null;        // {id, nome, descricao} mostrado no modal

    function escaparHtml(t) {
        if (t == null) return '';
        return String(t)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    function lerOrigemSelecionada() {
        const sel = document.getElementById('origemSelect');
        return sel ? sel.value : '';
    }

    function persistirHidden() {
        const hidden = document.getElementById('origemBeneficiosJson');
        if (hidden) hidden.value = JSON.stringify(escolhasAtuais);
    }

    function temEscolha(tipo, idOuNome) {
        return escolhasAtuais.some(b =>
            (tipo === 'pericia' && b.tipo === 'pericia' && b.nome === idOuNome) ||
            (tipo === 'poder'   && b.tipo === 'poder'   && b.id   === idOuNome)
        );
    }

    function normalizarNomePericia(nome) {
        return String(nome || '').replace(/\s*\([^)]*\)/g, '').trim();
    }

    function acharCheckboxPericia(nome, preferirDesmarcado) {
        const exato = document.querySelector(`[data-skill="${nome}"][data-field="treinada"]`);
        if (exato) return exato;

        const base = normalizarNomePericia(nome);
        if (!base) return null;

        const baseExato = document.querySelector(`[data-skill="${base}"][data-field="treinada"]`);
        if (baseExato) return baseExato;

        // Fuzzy pra perícias com sufixos (ex: "Ofício 1" / "Ofício 2" quando o nome é "Ofício" ou "Ofício (cozinheiro)")
        const candidatos = Array.from(document.querySelectorAll('[data-field="treinada"]'))
            .filter(c => {
                const s = c.dataset.skill || '';
                return s === base || s.startsWith(base + ' ');
            });
        if (!candidatos.length) return null;
        if (preferirDesmarcado) return candidatos.find(c => !c.checked) || candidatos[0];
        return candidatos.find(c => c.checked) || candidatos[0];
    }

    function marcarPericiaTreinada(nome) {
        const cb = acharCheckboxPericia(nome, true);
        if (cb && !cb.checked) {
            cb.checked = true;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function desmarcarPericiaTreinada(nome) {
        const cb = acharCheckboxPericia(nome, false);
        if (cb && cb.checked) {
            cb.checked = false;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function adicionarEscolha(escolha) {
        if (escolhasAtuais.length >= 2) return false;
        if (temEscolha(escolha.tipo, escolha.tipo === 'pericia' ? escolha.nome : escolha.id)) return false;
        escolhasAtuais.push(escolha);
        return true;
    }

    function removerEscolha(tipo, idOuNome) {
        escolhasAtuais = escolhasAtuais.filter(b =>
            !(tipo === 'pericia' && b.tipo === 'pericia' && b.nome === idOuNome) &&
            !(tipo === 'poder'   && b.tipo === 'poder'   && b.id   === idOuNome)
        );
    }

    async function carregarOrigem(idOrigem) {
        if (!idOrigem) {
            origemAtual = null;
            escolhasAtuais = [];
            renderizar();
            persistirHidden();
            return;
        }
        try {
            const resp = await fetch(`origens-ui.php?id=${encodeURIComponent(idOrigem)}`);
            const json = await resp.json();
            if (!json.success) {
                console.error('Erro carregando origem:', json);
                origemAtual = null;
            } else {
                origemAtual = json.origem;
            }
        } catch (e) {
            console.error('Falha origens-ui:', e);
            origemAtual = null;
        }
        renderizar();
    }

    function renderizar() {
        const empty = document.getElementById('origemEmpty');
        const conteudo = document.getElementById('origemConteudo');
        const contador = document.getElementById('origemContador');

        if (!origemAtual) {
            if (empty) empty.style.display = '';
            if (conteudo) conteudo.hidden = true;
            if (contador) contador.textContent = '0 / 2';
            renderEscolhidos();
            return;
        }

        if (empty) empty.style.display = 'none';
        if (conteudo) conteudo.hidden = false;

        const nome = document.getElementById('origemNome');
        if (nome) nome.textContent = origemAtual.nome;

        const atrs = document.getElementById('origemAtributos');
        if (atrs) {
            const sigs = (origemAtual.atributos || [])
                .map(a => NOMES_ATRIBUTO[a] || a.toUpperCase());
            const textoAtrs = sigs.length === 6 ? 'Qualquer atributo' : sigs.join(' / ');
            atrs.innerHTML = `<strong>Atributos:</strong> ${escaparHtml(textoAtrs)}`;
        }

        const desc = document.getElementById('origemDescricao');
        if (desc) desc.textContent = origemAtual.descricao || '';

        const itens = document.getElementById('origemItens');
        if (itens) {
            itens.innerHTML = (origemAtual.itens || [])
                .map(i => `<li>${escaparHtml(i)}</li>`)
                .join('');
        }

        const obs = document.getElementById('origemObservacao');
        if (obs) {
            if (origemAtual.observacao) {
                obs.hidden = false;
                obs.innerHTML = `<em>${escaparHtml(origemAtual.observacao)}</em>`;
            } else {
                obs.hidden = true;
                obs.innerHTML = '';
            }
        }

        renderPericias();
        renderPoderes();
        renderEscolhidos();

        if (contador) contador.textContent = `${escolhasAtuais.length} / 2`;
        persistirHidden();
    }

    function renderEscolhidos() {
        const cont = document.getElementById('origemEscolhidosLista');
        if (!cont) return;

        if (!escolhasAtuais.length) {
            cont.innerHTML = '<div class="origem-vazio">Nenhum benefício escolhido ainda.</div>';
            return;
        }

        cont.innerHTML = escolhasAtuais.map(escolha => {
            if (escolha.tipo === 'pericia') {
                return `<button type="button" class="pindorama-tag origem-tag-escolhida origem-tag-selecionada" data-tipo="pericia" data-valor="${escaparHtml(escolha.nome)}">${escaparHtml(escolha.nome)}</button>`;
            }

            const poder = ((origemAtual && origemAtual.poderes) || []).find(p => p.id === escolha.id);
            const nome = poder?.nome || escolha.id;
            return `<button type="button" class="pindorama-tag origem-tag-escolhida origem-tag-selecionada" data-tipo="poder" data-valor="${escaparHtml(escolha.id)}">${escaparHtml(nome)}</button>`;
        }).join('');

        cont.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.tipo === 'pericia') {
                    alternarEscolhaPericia(btn.dataset.valor);
                } else {
                    abrirModalPoder(btn.dataset.valor);
                }
            });
        });
    }

    function renderPericias() {
        const cont = document.getElementById('origemPericiasLista');
        if (!cont) return;

        const pericias = origemAtual.pericias || [];
        if (!pericias.length) {
            cont.innerHTML = '<div class="origem-vazio">Nenhuma perícia listada para esta origem.</div>';
            return;
        }

        cont.innerHTML = pericias.map(p => {
            const escolhida = temEscolha('pericia', p);
            const cls = 'origem-tag origem-tag-pericia' + (escolhida ? ' origem-tag-escolhida' : '');
            return `<button type="button" class="${cls}" data-tipo="pericia" data-valor="${escaparHtml(p)}">
                ${escolhida ? '✓ ' : ''}${escaparHtml(p)}
            </button>`;
        }).join('');

        cont.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => alternarEscolhaPericia(btn.dataset.valor));
        });
    }

    function renderPoderes() {
        const cont = document.getElementById('origemPoderesLista');
        if (!cont) return;

        const poderes = origemAtual.poderes || [];
        if (!poderes.length) {
            cont.innerHTML = '<div class="origem-vazio">Nenhum poder listado para esta origem.</div>';
            return;
        }

        cont.innerHTML = poderes.map(p => {
            const escolhido = temEscolha('poder', p.id);
            const ehUnico = (p.categoria === 'origem');
            const cls = 'origem-card-poder'
                + (escolhido ? ' origem-card-escolhido' : '')
                + (ehUnico ? ' origem-card-unico' : '');
            const tag = ehUnico ? '<span class="origem-tag-unico">único</span>' : '';
            return `
                <div class="${cls}" data-poder-id="${escaparHtml(p.id)}">
                    <div class="origem-card-poder-header">
                        <span class="origem-card-poder-nome">${escaparHtml(p.nome)}</span>
                        ${tag}
                        ${escolhido ? '<span class="origem-card-poder-marca">✓</span>' : ''}
                    </div>
                    <div class="origem-card-poder-resumo">${escaparHtml(p.descricao)}</div>
                </div>
            `;
        }).join('');

        cont.querySelectorAll('.origem-card-poder').forEach(card => {
            card.addEventListener('click', () => abrirModalPoder(card.dataset.poderId));
        });
    }

    function alternarEscolhaPericia(nome) {
        if (temEscolha('pericia', nome)) {
            removerEscolha('pericia', nome);
            desmarcarPericiaTreinada(nome);
        } else {
            if (escolhasAtuais.length >= 2) {
                alert('Você já escolheu 2 benefícios. Remova um primeiro.');
                return;
            }
            adicionarEscolha({ tipo: 'pericia', nome });
            marcarPericiaTreinada(nome);
        }
        renderizar();
    }

    function abrirModalPoder(idPoder) {
        const poder = (origemAtual.poderes || []).find(p => p.id === idPoder);
        if (!poder) return;
        poderEmFoco = poder;

        const titulo = document.getElementById('origemModalTitulo');
        const body   = document.getElementById('origemModalBody');
        const btnAdq = document.getElementById('origemModalAdquirir');
        const btnRem = document.getElementById('origemModalRemover');

        if (titulo) titulo.textContent = poder.nome;

        const prereqHtml = poder.prerequisito_texto
            ? `<div class="origem-modal-prereq"><strong>Pré-requisito:</strong> ${escaparHtml(poder.prerequisito_texto)}</div>`
            : '';
        const tagUnico = poder.categoria === 'origem'
            ? '<div class="origem-modal-unico">Habilidade exclusiva desta origem</div>'
            : '';

        if (body) {
            body.innerHTML = `
                ${tagUnico}
                <p class="origem-modal-descricao">${escaparHtml(poder.descricao)}</p>
                ${prereqHtml}
            `;
        }

        const escolhido = temEscolha('poder', poder.id);
        if (btnAdq) {
            btnAdq.style.display = escolhido ? 'none' : '';
            btnAdq.disabled = (escolhasAtuais.length >= 2 && !escolhido);
        }
        if (btnRem) {
            btnRem.style.display = escolhido ? '' : 'none';
        }

        const modal = document.getElementById('origemModal');
        if (modal) modal.hidden = false;
    }

    function fecharModal() {
        const modal = document.getElementById('origemModal');
        if (modal) modal.hidden = true;
        poderEmFoco = null;
    }

    function adquirirPoderEmFoco() {
        if (!poderEmFoco) return;
        if (escolhasAtuais.length >= 2) {
            alert('Você já escolheu 2 benefícios. Remova um primeiro.');
            return;
        }
        adicionarEscolha({ tipo: 'poder', id: poderEmFoco.id, nome: poderEmFoco.nome });
        fecharModal();
        renderizar();
    }

    function removerPoderEmFoco() {
        if (!poderEmFoco) return;
        removerEscolha('poder', poderEmFoco.id);
        fecharModal();
        renderizar();
    }

    function aplicarOrigemDeFicha(ficha) {
        const sel = document.getElementById('origemSelect');
        const idOrigem = ficha.origem || '';
        if (sel) sel.value = idOrigem;

        try {
            const beneficios = ficha.origem_beneficios
                ? (typeof ficha.origem_beneficios === 'string'
                    ? JSON.parse(ficha.origem_beneficios)
                    : ficha.origem_beneficios)
                : [];
            escolhasAtuais = Array.isArray(beneficios) ? beneficios : [];
        } catch (e) {
            console.warn('origem_beneficios inválido:', e);
            escolhasAtuais = [];
        }

        carregarOrigem(idOrigem);
    }

    function init() {
        const sel = document.getElementById('origemSelect');
        if (sel) sel.addEventListener('change', () => {
            // Desmarca perícias que foram marcadas pela origem anterior
            escolhasAtuais
                .filter(b => b.tipo === 'pericia')
                .forEach(b => desmarcarPericiaTreinada(b.nome));
            escolhasAtuais = [];
            carregarOrigem(sel.value);
        });

        const fechar  = document.getElementById('origemModalFechar');
        const adquirir = document.getElementById('origemModalAdquirir');
        const remover = document.getElementById('origemModalRemover');
        if (fechar)  fechar.addEventListener('click', fecharModal);
        if (adquirir) adquirir.addEventListener('click', adquirirPoderEmFoco);
        if (remover) remover.addEventListener('click', removerPoderEmFoco);

        const recolherBtn = document.getElementById('origemRecolherBtn');
        const painel = document.getElementById('origemPanel');
        if (recolherBtn && painel) {
            recolherBtn.addEventListener('click', () => {
                const recolhido = painel.classList.toggle('origem-panel-recolhido');
                recolherBtn.setAttribute('aria-expanded', String(!recolhido));
                recolherBtn.setAttribute('aria-label', recolhido ? 'Expandir seção' : 'Recolher seção');
            });
        }

        const modal = document.getElementById('origemModal');
        if (modal) modal.addEventListener('click', e => { if (e.target === modal) modal.hidden = true; });

        const form = document.getElementById('fichaForm');
        if (form) form.addEventListener('submit', persistirHidden, true);

        // Carrega ao iniciar (se já houver valor selecionado)
        if (sel && sel.value) carregarOrigem(sel.value);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.OrigensPindorama = { aplicarOrigemDeFicha };
})();
