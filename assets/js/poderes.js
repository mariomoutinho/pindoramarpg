(function () {
    'use strict';

    let estadoAtual = {
        adquiridos: [],
        grupos: [],
        gruposGerais: [],
    };

    let poderEmFoco = null;
    let nivelAnterior = null;
    let atualizando = false;
    let initFeito = false;

    function normalizarClasseId(valor) {
        if (!valor) return '';
        return valor
            .toString()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .toLowerCase()
            .trim();
    }

    function normalizarClasseId(valor) {
        if (!valor) return '';
        return valor
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '')
            .trim();
    }

    function lerNivel() {
        const niv = document.getElementById('nivelInput');
        return Math.max(1, parseInt(niv ? niv.value : '1', 10) || 1);
    }

    function lerClassesDoForm() {
        const sel = document.getElementById('classeSelect');
        const classeId = normalizarClasseId(sel ? sel.value : '');
        if (!classeId) return [];
        return [{ id: classeId, nivel: lerNivel() }];
    }

    function lerPpAtuais() {
        const inp = document.getElementById('ppAtuais');
        return Math.max(0, parseInt(inp ? inp.value : '0', 10) || 0);
    }

    function lerAtributosDoForm() {
        return {
            for: lerAtributoPorSigla('for'),
            des: lerAtributoPorSigla('des'),
            con: lerAtributoPorSigla('con'),
            int: lerAtributoPorSigla('int'),
            sab: lerAtributoPorSigla('sab'),
            car: lerAtributoPorSigla('car'),
        };
    }

    function lerPericiasTreinadasDoForm() {
        return Array.from(document.querySelectorAll('[data-skill][data-field="treinada"]'))
            .filter(campo => campo.checked)
            .map(campo => campo.dataset.skill);
    }

    function lerDivindadeDoForm() {
        const campo = document.querySelector('[name="divindade"]');
        return campo ? campo.value : '';
    }

    function normalizarTexto(valor) {
        return String(valor || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    function lerAtributoPorSigla(sigla) {
        const campos = {
            for: 'forca',
            des: 'destreza',
            con: 'constituicao',
            int: 'inteligencia',
            sab: 'sabedoria',
            car: 'carisma',
        };
        const campo = document.querySelector(`[name="${campos[normalizarTexto(sigla)] || ''}"]`);
        return parseInt(campo ? campo.value : '0', 10) || 0;
    }

    function periciaEstaTreinada(nomeRequisito) {
        const nomeNormalizado = normalizarTexto(nomeRequisito)
            .replace(/\([^)]*\)/g, '')
            .replace(/\s+e\s+\d+\s*(o|º)?\s+nivel.*$/i, '')
            .replace(/\s+/g, ' ')
            .trim();

        return Array.from(document.querySelectorAll('[data-skill][data-field="treinada"]')).some(campo => {
            const nomeCampo = normalizarTexto(campo.dataset.skill);
            const mesmoNome = nomeCampo === nomeNormalizado ||
                nomeCampo.replace(/\s+\d+$/, '') === nomeNormalizado;

            return mesmoNome && campo.checked;
        });
    }

    function avaliarPrerequisitoLocal(pr) {
        if (pr.atendido === true || pr.atendido === false) {
            return pr;
        }

        const texto = String(pr.texto || '');
        const textoNormalizado = normalizarTexto(texto);

        if (pr.tipo === 'nivel_personagem' || pr.tipo === 'nivel') {
            const nivelExigido = parseInt(pr.nivel || textoNormalizado.match(/\d+/)?.[0] || '0', 10) || 0;
            return {
                ...pr,
                atendido: lerNivel() >= nivelExigido,
            };
        }

        if (pr.tipo === 'pericia' || /^treinad[oa]\s+em\s+/.test(textoNormalizado)) {
            const periciaMatch = textoNormalizado.match(/^treinad[oa]\s+em\s+(.+)$/);
            const textoPericias = (periciaMatch ? periciaMatch[1] : textoNormalizado)
                .replace(/\s+e\s+\d+\s*(o|º)?\s+nivel.*$/i, '')
                .trim();
            const alternativas = textoPericias
                .split(/\s+ou\s+/)
                .map(alternativa => alternativa
                    .split(/\s+e\s+|,\s*/)
                    .map(p => p.trim())
                    .filter(Boolean)
                )
                .filter(grupo => grupo.length);

            return {
                ...pr,
                tipo: 'pericia',
                atendido: alternativas.some(grupo => grupo.every(periciaEstaTreinada)),
            };
        }

        const atributoMatch = textoNormalizado.match(/\b(for|des|con|int|sab|car)\s*(-?\d+)\b/);

        if (atributoMatch) {
            const valorAtual = lerAtributoPorSigla(atributoMatch[1]);
            const valorExigido = parseInt(atributoMatch[2], 10);
            return {
                ...pr,
                tipo: 'atributo',
                atendido: valorAtual >= valorExigido,
            };
        }

        return pr;
    }

    function avaliarPrerequisitosLocais(prereqs) {
        return (prereqs || []).map(avaliarPrerequisitoLocal);
    }

    function todosPrerequisitosLocaisAtendidos(prereqs) {
        return prereqs.every(pr => pr.atendido !== false);
    }

    function persistirHiddens() {
        const classesHidden = document.getElementById('classesPersonagemJson');
        const poderesHidden = document.getElementById('poderesJson');
        if (classesHidden) {
            const classes = lerClassesDoForm().map(c => ({
                classe_id: c.id,
                nivel: c.nivel,
            }));
            classesHidden.value = JSON.stringify(classes);
        }
        if (poderesHidden) {
            poderesHidden.value = JSON.stringify(estadoAtual.adquiridos);
        }
    }

    function aplicarDeltaPp(delta) {
        if (delta === 0) return;
        const ppAtuaisInput = document.getElementById('ppAtuais');
        const ppTotalInput = document.getElementById('ppTotal');
        if (ppAtuaisInput) {
            ppAtuaisInput.value = Math.max(0, (parseInt(ppAtuaisInput.value, 10) || 0) + delta);
        }
        if (ppTotalInput) {
            ppTotalInput.value = ppAtuaisInput ? ppAtuaisInput.value : Math.max(0, (parseInt(ppTotalInput.value, 10) || 0) + delta);
        }
    }

    function quandoNivelMuda() {
        const novoNivel = lerNivel();
        if (nivelAnterior !== null && novoNivel > nivelAnterior) {
            aplicarDeltaPp(novoNivel - nivelAnterior);
        }
        nivelAnterior = novoNivel;
        atualizarPainel();
    }

    async function atualizarPainel() {
        if (atualizando) return;
        atualizando = true;
        try {
            const classes = lerClassesDoForm();
            const ppAtuais = lerPpAtuais();

            const resp = await fetch('poderes-ui.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    classes,
                    poderes: estadoAtual.adquiridos,
                    nivel: lerNivel(),
                    atributos: lerAtributosDoForm(),
                    pericias_treinadas: lerPericiasTreinadasDoForm(),
                    divindade: lerDivindadeDoForm(),
                    pp_atuais: ppAtuais,
                }),
            });
            const json = await resp.json();
            if (!json.success) {
                console.error('Erro poderes-ui:', json);
                return;
            }

            estadoAtual.grupos = json.grupos;
            estadoAtual.gruposGerais = json.grupos_gerais || [];
            renderizarPainel();
            renderizarPainelGeral();
            atualizarModalPoderAberto();
            persistirHiddens();
        } catch (err) {
            console.error('Falha ao atualizar painel de poderes:', err);
        } finally {
            atualizando = false;
        }
    }

    function renderizarPainel() {
        const cont = document.getElementById('poderesGrupos');
        const empty = document.getElementById('poderesEmpty');
        if (!cont) return;

        const grupos = estadoAtual.grupos.filter(g =>
            g.disponiveis.length > 0 || g.bloqueados.length > 0 || g.adquiridos.length > 0
        );

        if (!grupos.length) {
            cont.innerHTML = '';
            if (empty) empty.style.display = '';
            renderizarAdquiridosTopo('classe', []);
            return;
        }

        if (empty) empty.style.display = 'none';

        const ppAtuais = lerPpAtuais();
        renderizarAdquiridosTopo('classe', grupos);

        cont.innerHTML = grupos.map(grupo => {
            const adquiridosHTML = grupo.adquiridos.length
                ? `<div class="poderes-adquiridos-lista">
                     ${grupo.adquiridos.map(p =>
                         `<span class="poderes-tag-adquirido" data-escopo="classe" data-poder-id="${p.id}" data-grupo-id="${grupo.classeId}">${escaparHtml(p.nome)}</span>`
                     ).join('')}
                   </div>`
                : '';

            const cardsHTML = grupo.disponiveis.length
                ? grupo.disponiveis.map(item => cardHTML(item, grupo.classeId)).join('')
                : '<div class="poderes-vazio">Nenhum poder disponível para comprar agora.</div>';

            return `
                <div class="poderes-grupo" data-classe="${grupo.classeId}">
                    <header class="poderes-grupo-header">
                        <h4>${escaparHtml(grupo.nomeClasse)}</h4>
                        <div class="poderes-slots-info">
                            <span><strong>${ppAtuais}</strong> PP disponíveis</span>
                        </div>
                    </header>
                    <details class="poderes-opcoes-details" open>
                        <summary>Poderes disponiveis para compra</summary>
                        <div class="poderes-cards">
                            ${cardsHTML}
                        </div>
                    </details>
                </div>
            `;
        }).join('');

        cont.querySelectorAll('.poder-card').forEach(card => {
            card.addEventListener('click', () => {
                abrirModalPoder(card.dataset.escopo || 'classe', card.dataset.grupoId || card.dataset.classe, card.dataset.poderId, false);
            });
        });

        cont.querySelectorAll('.poderes-tag-adquirido').forEach(tag => {
            tag.addEventListener('click', () => {
                abrirModalPoder(tag.dataset.escopo || 'classe', tag.dataset.grupoId || tag.dataset.classe, tag.dataset.poderId, true);
            });
        });
    }

    function cardHTML(item, classeId) {
        const prereqsAvaliados = avaliarPrerequisitosLocais(item.prereqs);
        const bloqueadoLocal = !todosPrerequisitosLocaisAtendidos(prereqsAvaliados);
        const classe = item.pode_adquirir && !bloqueadoLocal
            ? 'poder-card poder-card-disponivel'
            : 'poder-card poder-card-bloqueado';
        const razaoBloqueio = bloqueadoLocal
            ? 'Pré-requisito não atendido.'
            : item.razao_bloqueio;
        const motivo = razaoBloqueio
            ? `<div class="poder-card-bloqueio">${escaparHtml(razaoBloqueio)}</div>`
            : '';
        return `
            <div class="${classe}" data-escopo="classe" data-poder-id="${item.poder.id}" data-grupo-id="${classeId}" data-classe="${classeId}">
                <div class="poder-card-nome">${escaparHtml(item.poder.nome)}</div>
                ${motivo}
            </div>
        `;
    }

    function renderizarPainelGeral() {
        const cont = document.getElementById('poderesGeraisGrupos');
        const empty = document.getElementById('poderesGeraisEmpty');
        if (!cont) return;

        const grupos = (estadoAtual.gruposGerais || []).filter(g =>
            g.disponiveis.length > 0 || g.bloqueados.length > 0 || g.adquiridos.length > 0
        );

        renderizarDivindadeAdquiridos();

        if (!grupos.length) {
            cont.innerHTML = '';
            if (empty) empty.style.display = '';
            renderizarAdquiridosTopo('geral', []);
            return;
        }

        if (empty) empty.style.display = 'none';

        const ppAtuais = lerPpAtuais();
        renderizarAdquiridosTopo('geral', grupos);
        cont.innerHTML = grupos.map((grupo, index) => {
            const adquiridosHTML = grupo.adquiridos.length
                ? `<div class="poderes-adquiridos-bloco"><span class="poderes-bloco-label">Adquiridos:</span>
                    <div class="poderes-adquiridos-lista">
                        ${grupo.adquiridos.map(p =>
                            `<span class="poderes-tag-adquirido" data-escopo="geral" data-poder-id="${p.id}" data-grupo-id="${grupo.categoriaId}">${escaparHtml(p.nome)}</span>`
                        ).join('')}
                    </div>
                   </div>`
                : '';

            const cardsHTML = grupo.disponiveis.length
                ? grupo.disponiveis.map(item => cardGeralHTML(item, grupo.categoriaId)).join('')
                : '<div class="poderes-vazio">Nenhum poder disponivel para comprar agora.</div>';

            const bloqueadosHTML = grupo.bloqueados.length
                ? `<details class="poderes-bloqueados-details">
                    <summary>Bloqueados (${grupo.bloqueados.length})</summary>
                    <div class="poderes-cards poderes-cards-bloqueados">
                        ${grupo.bloqueados.map(item => cardGeralHTML(item, grupo.categoriaId)).join('')}
                    </div>
                   </details>`
                : '';

            return `
                <details class="poderes-gerais-grupo">
                    <summary class="poderes-grupo-header">
                        <span>
                            <strong>${escaparHtml(grupo.nome)}</strong>
                            <small>${escaparHtml(grupo.descricao || '')}</small>
                        </span>
                        <em>${ppAtuais} PP</em>
                    </summary>
                    <div class="poderes-cards">
                        ${cardsHTML}
                    </div>
                    ${bloqueadosHTML}
                </details>
            `;
        }).join('');

        cont.querySelectorAll('.poder-card').forEach(card => {
            card.addEventListener('click', () => {
                abrirModalPoder(card.dataset.escopo, card.dataset.grupoId, card.dataset.poderId, false);
            });
        });

        cont.querySelectorAll('.poderes-tag-adquirido').forEach(tag => {
            tag.addEventListener('click', () => {
                abrirModalPoder(tag.dataset.escopo, tag.dataset.grupoId, tag.dataset.poderId, true);
            });
        });

        const toggleTipos = document.getElementById('poderesToggleTiposBtn');
        if (toggleTipos) toggleTipos.textContent = 'Expandir tipos';
    }

    function renderizarDivindadeAdquiridos() {
        const cont = document.getElementById('divindadeAdquiridos');
        if (!cont) return;

        const grupoDivinos = (estadoAtual.gruposGerais || []).find(g => g.categoriaId === 'divinos');
        const adquiridos = grupoDivinos ? (grupoDivinos.adquiridos || []) : [];

        if (!adquiridos.length) {
            cont.innerHTML = '<span class="poderes-adquiridos-vazio">Nenhum ainda.</span>';
            return;
        }

        cont.innerHTML = adquiridos.map(p =>
            `<span class="poderes-tag-adquirido" data-escopo="geral" data-poder-id="${p.id}" data-grupo-id="divinos">${escaparHtml(p.nome)}</span>`
        ).join('');

        cont.querySelectorAll('.poderes-tag-adquirido').forEach(tag => {
            tag.addEventListener('click', () => {
                abrirModalPoder('geral', 'divinos', tag.dataset.poderId, true);
            });
        });
    }

    function renderizarAdquiridosTopo(escopo, grupos) {
        const cont = document.getElementById(escopo === 'geral' ? 'poderesGeraisSelecionados' : 'poderesClasseSelecionados');
        if (!cont) return;

        const adquiridos = [];
        grupos.forEach(grupo => {
            (grupo.adquiridos || []).forEach(poder => {
                adquiridos.push({
                    id: poder.id,
                    nome: poder.nome,
                    grupoId: escopo === 'geral' ? grupo.categoriaId : grupo.classeId,
                });
            });
        });

        if (!adquiridos.length) {
            cont.innerHTML = '<span class="poderes-adquiridos-vazio">Nenhum ainda.</span>';
            return;
        }

        cont.innerHTML = adquiridos.map(p =>
            `<span class="poderes-tag-adquirido" data-escopo="${escopo}" data-poder-id="${p.id}" data-grupo-id="${p.grupoId}">${escaparHtml(p.nome)}</span>`
        ).join('');

        cont.querySelectorAll('.poderes-tag-adquirido').forEach(tag => {
            tag.addEventListener('click', () => {
                abrirModalPoder(tag.dataset.escopo, tag.dataset.grupoId, tag.dataset.poderId, true);
            });
        });
    }

    function alternarTiposPoderesGerais() {
        const detalhes = Array.from(document.querySelectorAll('.poderes-gerais-grupo'));
        if (!detalhes.length) return;

        const deveAbrir = detalhes.every(details => !details.open);
        detalhes.forEach(details => {
            details.open = deveAbrir;
        });

        const btn = document.getElementById('poderesToggleTiposBtn');
        if (btn) {
            btn.textContent = deveAbrir ? 'Recolher tipos' : 'Expandir tipos';
        }
    }

    function encolherTodosPoderes() {
        const detalhes = Array.from(document.querySelectorAll('.poderes-opcoes-details'));
        detalhes.forEach(details => {
            details.open = false;
        });
    }

    function cardGeralHTML(item, categoriaId) {
        const prereqsAvaliados = avaliarPrerequisitosLocais(item.prereqs);
        const bloqueadoLocal = !todosPrerequisitosLocaisAtendidos(prereqsAvaliados);
        const classe = item.pode_adquirir && !bloqueadoLocal
            ? 'poder-card poder-card-disponivel'
            : 'poder-card poder-card-bloqueado';
        const razaoBloqueio = bloqueadoLocal
            ? 'Pre-requisito nao atendido.'
            : item.razao_bloqueio;
        const motivo = razaoBloqueio
            ? `<div class="poder-card-bloqueio">${escaparHtml(razaoBloqueio)}</div>`
            : '';

        return `
            <div class="${classe}" data-escopo="geral" data-poder-id="${item.poder.id}" data-grupo-id="${categoriaId}">
                <div class="poder-card-nome">${escaparHtml(item.poder.nome)}</div>
                ${motivo}
            </div>
        `;
    }

    function encontrarPoder(escopo, grupoId, poderId) {
        const grupos = escopo === 'geral' ? estadoAtual.gruposGerais : estadoAtual.grupos;
        const grupo = grupos.find(g => (escopo === 'geral' ? g.categoriaId : g.classeId) === grupoId);
        if (!grupo) return null;
        const adq = grupo.adquiridos.find(p => p.id === poderId);
        if (adq) return { item: { poder: adq, prereqs: [], pode_adquirir: false, razao_bloqueio: null }, jaAdquirido: true };
        const disp = grupo.disponiveis.find(i => i.poder.id === poderId);
        if (disp) return { item: disp, jaAdquirido: false };
        const blq = grupo.bloqueados.find(i => i.poder.id === poderId);
        if (blq) return { item: blq, jaAdquirido: false };
        return null;
    }

    function abrirModalPoder(escopo, grupoId, poderId, ehAdquirido) {
        const found = encontrarPoder(escopo, grupoId, poderId);
        if (!found) return;

        poderEmFoco = { escopo, grupoId, poderId, jaAdquirido: ehAdquirido || found.jaAdquirido };

        const item = found.item;
        const poder = item.poder;
        const titulo = document.getElementById('poderModalTitulo');
        const body = document.getElementById('poderModalBody');
        const btnAdq = document.getElementById('poderModalAdquirir');
        const btnRem = document.getElementById('poderModalRemover');

        if (titulo) titulo.textContent = poder.nome;

        const prereqsAvaliados = avaliarPrerequisitosLocais(item.prereqs);
        const prereqsHTML = prereqsAvaliados.length
            ? `<div class="poder-modal-prereqs">
                 <strong>Pré-requisitos:</strong>
                 <ul>
                    ${prereqsAvaliados.map(pr => {
                        let cls = 'prereq-manual';
                        if (pr.atendido === true) cls = 'prereq-ok';
                        if (pr.atendido === false) cls = 'prereq-faltando';
                        const marcador = pr.atendido === true ? '✓' : pr.atendido === false ? '✗' : '!';
                        return `<li class="${cls}"><span class="prereq-marcador">${marcador}</span>${escaparHtml(pr.texto)}</li>`;
                    }).join('')}
                 </ul>
               </div>`
            : '';

        if (body) {
            body.innerHTML = `
                <p class="poder-modal-descricao">${escaparHtml(poder.descricao)}</p>
                ${prereqsHTML}
                ${item.razao_bloqueio ? `<div class="poder-modal-bloqueio">${escaparHtml(item.razao_bloqueio)}</div>` : ''}
            `;
        }

        const podeAdquirir = !poderEmFoco.jaAdquirido &&
            item.pode_adquirir &&
            todosPrerequisitosLocaisAtendidos(prereqsAvaliados);
        if (btnAdq) {
            btnAdq.style.display = podeAdquirir ? '' : 'none';
            btnAdq.disabled = !podeAdquirir;
        }
        if (btnRem) {
            btnRem.style.display = poderEmFoco.jaAdquirido ? '' : 'none';
        }

        const modal = document.getElementById('poderModal');
        if (modal) modal.hidden = false;
    }

    function atualizarModalPoderAberto() {
        const modal = document.getElementById('poderModal');
        if (!poderEmFoco || !modal || modal.hidden) return;

        abrirModalPoder(poderEmFoco.escopo, poderEmFoco.grupoId, poderEmFoco.poderId, poderEmFoco.jaAdquirido);
    }

    function fecharModalPoder() {
        const modal = document.getElementById('poderModal');
        if (modal) modal.hidden = true;
        poderEmFoco = null;
    }

    function adquirirPoderEmFoco() {
        if (!poderEmFoco) return;
        const found = encontrarPoder(poderEmFoco.escopo, poderEmFoco.grupoId, poderEmFoco.poderId);
        if (!found || !found.item.pode_adquirir) return;

        const prereqsAvaliados = avaliarPrerequisitosLocais(found.item.prereqs);
        if (!todosPrerequisitosLocaisAtendidos(prereqsAvaliados)) {
            return;
        }

        const ehDivino = (found.item.poder.categoria || poderEmFoco.grupoId) === 'divinos';

        estadoAtual.adquiridos.push({
            id: found.item.poder.id,
            classe: poderEmFoco.escopo === 'classe' ? poderEmFoco.grupoId : null,
            categoria: poderEmFoco.escopo === 'geral' ? poderEmFoco.grupoId : null,
            tipo: poderEmFoco.escopo === 'geral' ? 'geral' : 'classe',
            nome: found.item.poder.nome,
        });

        // Poderes divinos são concedidos pela divindade — não custam PP.
        if (!ehDivino) aplicarDeltaPp(-1);
        fecharModalPoder();
        atualizarPainel();
    }

    function removerPoderEmFoco() {
        if (!poderEmFoco) return;
        const idx = estadoAtual.adquiridos.findIndex(p => {
            if (p.id !== poderEmFoco.poderId) return false;
            if (poderEmFoco.escopo === 'geral') return (p.tipo || 'classe') === 'geral';
            return p.classe === poderEmFoco.grupoId && (p.tipo || 'classe') === 'classe';
        });
        if (idx === -1) return;

        const removido = estadoAtual.adquiridos[idx];
        const ehDivino = (removido.categoria || poderEmFoco.grupoId) === 'divinos';

        estadoAtual.adquiridos.splice(idx, 1);
        if (!ehDivino) aplicarDeltaPp(1);
        fecharModalPoder();
        atualizarPainel();
    }

    function abrirModalTodos() {
        const modal = document.getElementById('poderesTodosModal');
        const body = document.getElementById('poderesTodosBody');
        if (!modal || !body) return;

        if (!estadoAtual.grupos.length) {
            body.innerHTML = '<p>Selecione uma classe primeiro.</p>';
            modal.hidden = false;
            return;
        }

        body.innerHTML = estadoAtual.grupos.map(grupo => {
            const renderItem = (item, status) => {
                const cls = status === 'disp' ? 'poder-todos-item poder-todos-disp'
                          : status === 'adq'  ? 'poder-todos-item poder-todos-adq'
                          : 'poder-todos-item poder-todos-blq';
                const id = item.id || item.poder.id;
                const nome = item.nome || item.poder.nome;
                return `<li class="${cls}" data-escopo="classe" data-grupo-id="${grupo.classeId}" data-classe="${grupo.classeId}" data-poder-id="${id}">${escaparHtml(nome)}</li>`;
            };

            return `
                <div class="poder-todos-grupo">
                    <h4>${escaparHtml(grupo.nomeClasse)}</h4>
                    ${grupo.adquiridos.length ? `
                        <div class="poder-todos-secao">
                            <h5>Adquiridos</h5>
                            <ul>${grupo.adquiridos.map(p => renderItem(p, 'adq')).join('')}</ul>
                        </div>` : ''}
                    ${grupo.disponiveis.length ? `
                        <div class="poder-todos-secao">
                            <h5>Pode adquirir</h5>
                            <ul>${grupo.disponiveis.map(i => renderItem(i, 'disp')).join('')}</ul>
                        </div>` : ''}
                    ${grupo.bloqueados.length ? `
                        <div class="poder-todos-secao">
                            <h5>Bloqueados</h5>
                            <ul>${grupo.bloqueados.map(i => renderItem(i, 'blq')).join('')}</ul>
                        </div>` : ''}
                </div>
            `;
        }).join('');

        body.querySelectorAll('.poder-todos-item').forEach(li => {
            li.addEventListener('click', () => {
                fecharModalTodos();
                abrirModalPoder(li.dataset.escopo || 'classe', li.dataset.grupoId || li.dataset.classe, li.dataset.poderId, li.classList.contains('poder-todos-adq'));
            });
        });

        modal.hidden = false;
    }

    function fecharModalTodos() {
        const modal = document.getElementById('poderesTodosModal');
        if (modal) modal.hidden = true;
    }

    function escaparHtml(txt) {
        if (txt == null) return '';
        return String(txt)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function aplicarPoderesDeFicha(ficha) {
        const poderes = Array.isArray(ficha.poderes) ? ficha.poderes : [];
        estadoAtual.adquiridos = poderes.map(p => ({
            id: p.id || p.poder_id,
            classe: p.classe || p.classe_id,
            categoria: p.categoria || null,
            tipo: p.tipo || 'classe',
            nome: p.nome || p.id || p.poder_id,
        }));
        const ppAtuaisInput = document.getElementById('ppAtuais');
        const ppTotalInput = document.getElementById('ppTotal');
        if (ppAtuaisInput) {
            ppAtuaisInput.value = ficha.pp_atuais ?? ficha.pp_total ?? 0;
        }
        if (ppTotalInput) {
            ppTotalInput.value = ppAtuaisInput ? ppAtuaisInput.value : (ficha.pp_total ?? ficha.pp_atuais ?? 0);
        }
        nivelAnterior = lerNivel();
        atualizarPainel();
    }

    function init() {
        if (initFeito) return;
        initFeito = true;
        nivelAnterior = lerNivel();

        const nivelEl = document.getElementById('nivelInput');
        if (nivelEl) {
            nivelEl.addEventListener('change', quandoNivelMuda);
            nivelEl.addEventListener('input', quandoNivelMuda);
        }
        const classeEl = document.getElementById('classeSelect');
        if (classeEl) classeEl.addEventListener('change', atualizarPainel);
        const divindadeEl = document.querySelector('[name="divindade"]');
        if (divindadeEl) {
            divindadeEl.addEventListener('input', atualizarPainel);
            divindadeEl.addEventListener('change', atualizarPainel);
        }
        const ppEl = document.getElementById('ppAtuais');
        if (ppEl) {
            ppEl.addEventListener('change', () => {
                const ppTotalInput = document.getElementById('ppTotal');
                if (ppTotalInput) ppTotalInput.value = ppEl.value;
                atualizarPainel();
            });
            ppEl.addEventListener('input', () => {
                const ppTotalInput = document.getElementById('ppTotal');
                if (ppTotalInput) ppTotalInput.value = ppEl.value;
                atualizarPainel();
            });
        }

        ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'].forEach(name => {
            const campo = document.querySelector(`[name="${name}"]`);
            if (!campo) return;

            campo.addEventListener('input', () => {
                atualizarPainel();
            });
            campo.addEventListener('change', () => {
                atualizarPainel();
            });
        });

        document.addEventListener('change', event => {
            if (!event.target.matches('[data-skill][data-field="treinada"]')) return;

            atualizarPainel();
        });

        const fechar1  = document.getElementById('poderModalFechar');
        const fechar2  = document.getElementById('poderesTodosFechar');
        const adquirir = document.getElementById('poderModalAdquirir');
        const remover  = document.getElementById('poderModalRemover');
        const encolherTodos = document.getElementById('poderesEncolherTodosBtn');
        const toggleTipos = document.getElementById('poderesToggleTiposBtn');
        if (fechar1)  fechar1.addEventListener('click', fecharModalPoder);
        if (fechar2)  fechar2.addEventListener('click', fecharModalTodos);
        if (adquirir) adquirir.addEventListener('click', adquirirPoderEmFoco);
        if (remover)  remover.addEventListener('click', removerPoderEmFoco);
        if (encolherTodos) encolherTodos.addEventListener('click', encolherTodosPoderes);
        if (toggleTipos) toggleTipos.addEventListener('click', alternarTiposPoderesGerais);

        const recolherGeraisBtn = document.getElementById('poderesGeraisRecolherBtn');
        const painelGerais = document.getElementById('poderesGeraisPanel');
        if (recolherGeraisBtn && painelGerais) {
            recolherGeraisBtn.addEventListener('click', () => {
                const recolhido = painelGerais.classList.toggle('poderes-panel-recolhido');
                recolherGeraisBtn.setAttribute('aria-expanded', String(!recolhido));
                recolherGeraisBtn.setAttribute('aria-label', recolhido ? 'Expandir seção' : 'Recolher seção');
            });
        }

        const recolherClasseBtn = document.getElementById('poderesClasseRecolherBtn');
        const painelClasse = document.getElementById('poderesPanel');
        if (recolherClasseBtn && painelClasse) {
            recolherClasseBtn.addEventListener('click', () => {
                const recolhido = painelClasse.classList.toggle('poderes-panel-recolhido');
                recolherClasseBtn.setAttribute('aria-expanded', String(!recolhido));
                recolherClasseBtn.setAttribute('aria-label', recolhido ? 'Expandir seção' : 'Recolher seção');
            });
        }

        ['poderModal', 'poderesTodosModal'].forEach(id => {
            const m = document.getElementById(id);
            if (m) m.addEventListener('click', e => { if (e.target === m) m.hidden = true; });
        });

        const form = document.getElementById('fichaForm');
        if (form) form.addEventListener('submit', persistirHiddens, true);

        atualizarPainel();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.PoderesPindorama = {
        aplicarPoderesDeFicha,
        atualizarPainel,
        abrirModalPoder,
    };
})();
