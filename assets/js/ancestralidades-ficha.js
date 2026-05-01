(function () {
    'use strict';

    let ancestralidades = [];
    let catalogoMagias = [];

    function normalizar(valor) {
        return String(valor || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    // Aliases para fichas antigas: id/nome legados → id atual
    const ALIASES = {
        'tapuias': 'humano',
    };

    function ancestralidadeSelecionada() {
        const campo = document.querySelector('[name="ancestralidade"]');
        const valor = campo ? campo.value : '';

        if (!valor) return null;

        const valorN = normalizar(valor);
        const idAlvo = ALIASES[valorN] || valorN;

        return ancestralidades.find(item =>
            item.id === valor ||
            normalizar(item.nome) === valorN ||
            normalizar(item.id) === valorN ||
            item.id === idAlvo
        ) || null;
    }

    function lerMagiasSelecionadas() {
        const campo = document.getElementById('magiasSelecionadasJson');
        if (!campo) return [];
        try {
            const arr = JSON.parse(campo.value || '[]');
            return Array.isArray(arr) ? arr : [];
        } catch {
            return [];
        }
    }

    function escreverMagiasSelecionadas(arr) {
        const campo = document.getElementById('magiasSelecionadasJson');
        if (campo) campo.value = JSON.stringify(arr);
    }

    function magiaTemSelecaoAncestralidade(idMagia) {
        return lerMagiasSelecionadas().some(m =>
            (typeof m === 'object' ? m.id === idMagia && m.origem === 'ancestralidade' : false)
        );
    }

    function alternarMagiaAncestralidade(idMagia, limite) {
        let magias = lerMagiasSelecionadas();
        const indice = magias.findIndex(m =>
            typeof m === 'object' && m.id === idMagia && m.origem === 'ancestralidade'
        );
        if (indice >= 0) {
            magias.splice(indice, 1);
        } else {
            const totalAncestralidade = magias.filter(m =>
                typeof m === 'object' && m.origem === 'ancestralidade'
            ).length;
            if (totalAncestralidade >= limite) return false;
            magias.push({ id: idMagia, origem: 'ancestralidade' });
        }
        escreverMagiasSelecionadas(magias);
        if (window.PindoramaAtualizarMagias) window.PindoramaAtualizarMagias();
        return true;
    }

    function obterOpcoesDoTraco(cfg) {
        // Ou usa lista fixa "opcoes", ou aplica "filtro" sobre o cat\u00e1logo de magias.
        if (Array.isArray(cfg.opcoes) && cfg.opcoes.length) {
            return cfg.opcoes
                .map(id => catalogoMagias.find(m => m.id === id) || { id, nome: id })
                .sort((a, b) => (a.nome || '').localeCompare(b.nome || '', 'pt-BR'));
        }
        if (cfg.filtro && catalogoMagias.length) {
            const f = cfg.filtro;
            return catalogoMagias.filter(m => {
                if (f.tipo && m.tipo !== f.tipo) return false;
                if (f.circulo != null && Number(m.circulo) !== Number(f.circulo)) return false;
                if (f.escola && (m.escola || '') !== f.escola) return false;
                return true;
            }).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        }
        return [];
    }

    function renderizarSeletorMagiasAncestralidade(traco) {
        const cfg = traco.concede_magias;
        if (!cfg) return '';

        const opcoes = obterOpcoesDoTraco(cfg);
        if (!opcoes.length) return '';

        const limite = cfg.limite || opcoes.length;
        const idsValidos = new Set(opcoes.map(o => o.id));
        const totalEscolhidas = lerMagiasSelecionadas().filter(m =>
            typeof m === 'object' && m.origem === 'ancestralidade' && idsValidos.has(m.id)
        ).length;

        const opcoesHtml = opcoes.map(magia => {
            const escolhida = magiaTemSelecaoAncestralidade(magia.id);
            const sufixo = magia.circulo ? ` <small>(${magia.circulo}\u00ba)</small>` : '';
            return `
                <button type="button"
                    class="ancestralidade-magia-opcao${escolhida ? ' escolhida' : ''}"
                    data-magia-ancestralidade="${escaparHtml(magia.id)}">
                    ${escaparHtml(magia.nome || magia.id)}${sufixo}
                </button>
            `;
        }).join('');

        const titulo = cfg.filtro
            ? `Escolha ${limite} magia${limite > 1 ? 's' : ''}`
            : (limite === opcoes.length ? 'Confirme suas magias' : 'Escolha suas magias');

        return `
            <div class="ancestralidade-magias-bloco">
                <div class="ancestralidade-magias-titulo">
                    ${titulo} <span class="ancestralidade-magias-contador">${totalEscolhidas}/${limite}</span>
                </div>
                <div class="ancestralidade-magias-opcoes">${opcoesHtml}</div>
                <p class="ancestralidade-magias-dica">Toque para alternar. As magias escolhidas aparecem como tags verdes na se\u00e7\u00e3o de Magias.</p>
            </div>
        `;
    }

    function periciaTreinadaPorEsteTraco(nomePericia, idTraco) {
        const cb = document.querySelector(
            `[data-skill="${nomePericia}"][data-field="treinada"]`
        );
        return !!(cb && cb.checked && cb.dataset.treinadaPorTraco === idTraco);
    }

    function totalPericiasTreinadasPorEsteTraco(idTraco) {
        return Array.from(
            document.querySelectorAll('[data-field="treinada"][data-treinada-por-traco]')
        ).filter(cb => cb.checked && cb.dataset.treinadaPorTraco === idTraco).length;
    }

    function alternarPericiaTreinadaPorTraco(nomePericia, idTraco, limite) {
        const cb = document.querySelector(
            `[data-skill="${nomePericia}"][data-field="treinada"]`
        );
        if (!cb) return false;

        // Se já está marcada por este traço → desmarca
        if (cb.checked && cb.dataset.treinadaPorTraco === idTraco) {
            cb.checked = false;
            delete cb.dataset.treinadaPorTraco;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }

        // Se está marcada por outro motivo (manual ou outro traço) → não toca
        if (cb.checked) return false;

        // Limite atingido?
        if (totalPericiasTreinadasPorEsteTraco(idTraco) >= limite) return false;

        cb.checked = true;
        cb.dataset.treinadaPorTraco = idTraco;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    }

    function listaPericiasBase() {
        // Lê os data-skill únicos das perícias renderizadas na ficha
        const nomes = new Set();
        document.querySelectorAll('[data-skill][data-field="treinada"]').forEach(cb => {
            if (cb.dataset.skill) nomes.add(cb.dataset.skill);
        });
        return Array.from(nomes).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    }

    function renderizarSeletorPericiasTreinadas(traco) {
        const cfg = traco.concede_pericias_treinadas;
        if (!cfg) return '';

        const limite = cfg.limite || 1;
        const tracoId = traco.id;
        const pericias = listaPericiasBase();
        const total = totalPericiasTreinadasPorEsteTraco(tracoId);

        const opcoesHtml = pericias.map(nome => {
            const cb = document.querySelector(`[data-skill="${nome}"][data-field="treinada"]`);
            const treinadaPorTraco = !!(cb && cb.dataset.treinadaPorTraco === tracoId);
            const treinadaPorOutro = !!(cb && cb.checked && !treinadaPorTraco);
            const disabled = treinadaPorOutro;
            const cls = treinadaPorTraco ? ' escolhida' : (disabled ? ' bloqueada' : '');
            const titulo = disabled
                ? 'Já treinada (manualmente ou por outro traço)'
                : (treinadaPorTraco ? 'Clique para desmarcar' : 'Clique para escolher');
            return `
                <button type="button"
                    class="ancestralidade-magia-opcao${cls}"
                    data-pericia-treinada="${escaparHtml(nome)}"
                    ${disabled ? 'disabled' : ''}
                    title="${escaparHtml(titulo)}">
                    ${escaparHtml(nome)}
                </button>
            `;
        }).join('');

        return `
            <div class="ancestralidade-magias-bloco">
                <div class="ancestralidade-magias-titulo">
                    Escolha ${limite} perícia${limite > 1 ? 's' : ''} para treinar
                    <span class="ancestralidade-magias-contador">${total}/${limite}</span>
                </div>
                <div class="ancestralidade-magias-opcoes">${opcoesHtml}</div>
                <p class="ancestralidade-magias-dica">As perícias escolhidas viram treinadas automaticamente. Perícias já treinadas por outro motivo aparecem desabilitadas.</p>
            </div>
        `;
    }

    /**
     * Limpa todas as perícias treinadas que foram marcadas pelo traço da
     * ancestralidade ANTERIOR — chamado quando o jogador troca de ancestralidade.
     */
    function limparPericiasTreinadasPorTracoAntigo(ancestralidadeAtual) {
        const idsAtivos = new Set(
            (ancestralidadeAtual?.tracos || []).map(t => t.id)
        );
        document.querySelectorAll('[data-field="treinada"][data-treinada-por-traco]').forEach(cb => {
            const id = cb.dataset.treinadaPorTraco;
            if (!idsAtivos.has(id)) {
                cb.checked = false;
                delete cb.dataset.treinadaPorTraco;
                cb.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    function abrirModalTraco(traco) {
        const modal = document.getElementById('ancestralidadeTracoModal');
        const titulo = document.getElementById('ancestralidadeTracoTitulo');
        const body = document.getElementById('ancestralidadeTracoBody');

        if (!modal || !titulo || !body) return;

        titulo.textContent = traco.nome;
        body.innerHTML = `
            <p class="poder-modal-descricao">${escaparHtml(traco.descricao)}</p>
            ${renderizarSeletorMagiasAncestralidade(traco)}
            ${renderizarSeletorPericiasTreinadas(traco)}
        `;

        body.querySelectorAll('[data-magia-ancestralidade]').forEach(btn => {
            btn.addEventListener('click', () => {
                const idMagia = btn.dataset.magiaAncestralidade;
                if (alternarMagiaAncestralidade(idMagia, traco.concede_magias?.limite || 0)) {
                    abrirModalTraco(traco);
                }
            });
        });

        body.querySelectorAll('[data-pericia-treinada]').forEach(btn => {
            btn.addEventListener('click', () => {
                const nome = btn.dataset.periciaTreinada;
                const limite = traco.concede_pericias_treinadas?.limite || 1;
                if (alternarPericiaTreinadaPorTraco(nome, traco.id, limite)) {
                    abrirModalTraco(traco);
                }
            });
        });

        modal.hidden = false;
    }

    function fecharModalTraco() {
        const modal = document.getElementById('ancestralidadeTracoModal');
        if (modal) modal.hidden = true;
    }

    /**
     * Define se o personagem é imune a sobrecarga (ex: Muiraquitã >
     * Minérios das Profundezas). Atualiza a flag global e re-dispara o
     * cálculo de carga.
     */
    function sincronizarImunidadeSobrecarga(ancestralidadeAtual) {
        let imune = false;
        if (ancestralidadeAtual) {
            imune = (ancestralidadeAtual.tracos || []).some(t => t.imune_sobrecarga === true);
        }
        window.__personagemImuneSobrecarga = imune;
        if (typeof window.atualizarCarga === 'function') {
            window.atualizarCarga();
        }
    }

    /**
     * Coleta substituições de atributo-chave de perícia vindas de traços
     * (ex: Pequeno Enganador permite Atletismo usar Destreza).
     * Guarda em window.__substituicoesAtributoPericia para o sistema de
     * perícias do ficha.js consultar.
     */
    function sincronizarSubstituicoesAtributo(ancestralidadeAtual) {
        const subs = [];
        if (ancestralidadeAtual) {
            (ancestralidadeAtual.tracos || []).forEach(traco => {
                (traco.substituicao_atributos || []).forEach(s => subs.push(s));
            });
        }
        window.__substituicoesAtributoPericia = subs;
        if (typeof window.atualizarPericiasPorAtributos === 'function') {
            window.atualizarPericiasPorAtributos();
        }
    }

    /**
     * Calcula o bônus de Defesa que vem de um traço com `bonus_defesa`.
     * Suporta:
     *  - atributo: nome do atributo cujo valor é a base (ex: "constituicao")
     *  - limitar_a_nivel: se true, o bônus é limitado pelo nível do personagem
     *  - max_armadura_pesada: cap quando o personagem usa armadura pesada
     *  - minimo: valor mínimo (geralmente 0 — bônus não vira penalidade)
     */
    function calcularBonusDefesaDoTraco(cfg) {
        if (!cfg) return 0;
        let valor = 0;
        if (cfg.atributo) {
            valor = Number(document.querySelector(`[name="${cfg.atributo}"]`)?.value || 0);
        }
        if (cfg.limitar_a_nivel) {
            const nivel = Number(document.querySelector('[name="nivel"]')?.value || 1);
            valor = Math.min(valor, nivel);
        }
        if (cfg.max_armadura_pesada != null) {
            const pesada = !!(window.PindoramaIsArmaduraPesada && window.PindoramaIsArmaduraPesada());
            if (pesada) valor = Math.min(valor, Number(cfg.max_armadura_pesada));
        }
        if (cfg.minimo != null) valor = Math.max(valor, Number(cfg.minimo));
        return valor;
    }

    function sincronizarBonusDefesa(ancestralidadeAtual) {
        if (ancestralidadeAtual === undefined) {
            ancestralidadeAtual = ancestralidadeSelecionada();
        }
        let total = 0;
        if (ancestralidadeAtual) {
            (ancestralidadeAtual.tracos || []).forEach(traco => {
                total += calcularBonusDefesaDoTraco(traco.bonus_defesa);
            });
        }

        const inp = document.querySelector('[name="defesa_outros"]');
        if (!inp) return;

        const aplicadoAntigo = Number(inp.dataset.bonusAncestralidade || 0);
        if (aplicadoAntigo === total) return;

        const valorAtual = Number(inp.value || 0);
        const valorBase = valorAtual - aplicadoAntigo;
        inp.value = valorBase + total;
        if (total !== 0) {
            inp.dataset.bonusAncestralidade = String(total);
        } else {
            delete inp.dataset.bonusAncestralidade;
        }
        inp.dispatchEvent(new Event('input', { bubbles: true }));
    }

    /**
     * Aplica/atualiza/remove bônus de atributos (For, Des, Con, Int, Sab, Car)
     * vindos de traços ancestrais. Mesma lógica do bônus de perícias —
     * data-bonus-ancestralidade rastreia o pedaço aplicado pra evitar
     * duplicar e pra preservar o valor que o jogador editou manualmente.
     */
    function sincronizarBonusAtributos(ancestralidadeAtual) {
        const bonusPorAtributo = {};
        if (ancestralidadeAtual) {
            (ancestralidadeAtual.tracos || []).forEach(traco => {
                (traco.bonus_atributos || []).forEach(ba => {
                    const nome = ba.atributo;
                    if (!nome) return;
                    bonusPorAtributo[nome] = (bonusPorAtributo[nome] || 0) + Number(ba.valor || 0);
                });
            });
        }

        ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'].forEach(nome => {
            const inp = document.querySelector(`[name="${nome}"]`);
            if (!inp) return;
            const aplicadoAntigo = Number(inp.dataset.bonusAncestralidade || 0);
            const novoBonus = bonusPorAtributo[nome] || 0;
            if (aplicadoAntigo === novoBonus) return;

            const valorAtual = Number(inp.value || 0);
            const valorBase = valorAtual - aplicadoAntigo;
            const novoValor = valorBase + novoBonus;
            inp.value = novoValor;
            if (novoBonus !== 0) {
                inp.dataset.bonusAncestralidade = String(novoBonus);
            } else {
                delete inp.dataset.bonusAncestralidade;
            }
            inp.dispatchEvent(new Event('input', { bubbles: true }));
            inp.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }

    /**
     * Aplica/atualiza/remove bônus de perícias vindos de traços ancestrais
     * no campo "Outros" da tabela de perícias. Usa data-bonus-ancestralidade
     * pra rastrear quanto desse "Outros" veio da ancestralidade — assim, ao
     * trocar/remover a ancestralidade, só removemos o pedaço correto e
     * preservamos o que o jogador editou manualmente.
     */
    function sincronizarBonusPericias(ancestralidadeAtual) {
        // Soma dos bônus desejados por nome de perícia
        const bonusPorPericia = {};
        if (ancestralidadeAtual) {
            (ancestralidadeAtual.tracos || []).forEach(traco => {
                (traco.bonus_pericias || []).forEach(bp => {
                    const nome = bp.pericia;
                    if (!nome) return;
                    bonusPorPericia[nome] = (bonusPorPericia[nome] || 0) + Number(bp.valor || 0);
                });
            });
        }

        // Aplica em todos os campos "Outros" das perícias
        document.querySelectorAll('[data-skill][data-field="outros"]').forEach(inp => {
            const nome = inp.dataset.skill;
            const aplicadoAntigo = Number(inp.dataset.bonusAncestralidade || 0);
            const novoBonus = bonusPorPericia[nome] || 0;

            if (aplicadoAntigo === novoBonus) return;

            const valorAtual = Number(inp.value || 0);
            const valorBaseDoUsuario = valorAtual - aplicadoAntigo; // remove o bônus antigo
            const novoValor = valorBaseDoUsuario + novoBonus;

            inp.value = novoValor;
            if (novoBonus !== 0) {
                inp.dataset.bonusAncestralidade = String(novoBonus);
            } else {
                delete inp.dataset.bonusAncestralidade;
            }

            // Dispara input para o total da perícia recalcular
            inp.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }

    /**
     * Sincroniza os ataques que vêm como benefício de traço de ancestralidade
     * (ex: Garras Afiadas do Arajubá). Remove ataques de ancestralidades
     * anteriores e adiciona os da atual.
     */
    function sincronizarAtaquesConcedidos(ancestralidadeAtual) {
        const idAtual = ancestralidadeAtual ? ancestralidadeAtual.id : '';

        // Remove ataques de outras ancestralidades (ou todos, se não há ancestralidade)
        document.querySelectorAll('.attack-row[data-fonte-ancestralidade]').forEach(row => {
            if (row.dataset.fonteAncestralidade !== idAtual) {
                row.remove();
            }
        });

        if (!ancestralidadeAtual) return;

        (ancestralidadeAtual.tracos || []).forEach(traco => {
            const dados = traco.concede_ataque;
            if (!dados) return;

            // 1) Já existe com a tag exata? Pula.
            const jaPorTag = !!document.querySelector(
                `.attack-row[data-fonte-ancestralidade="${idAtual}"][data-fonte-traco="${traco.id}"]`
            );
            if (jaPorTag) return;

            // 2) Existe um ataque com esse nome (ex: vindo de uma ficha salva sem tag)?
            //    Adota: aplica as tags de fonte e não duplica.
            const inputs = Array.from(document.querySelectorAll('.attack-row [data-attack="nome"]'));
            const inpExistente = inputs.find(inp =>
                String(inp.value || '').trim().toLowerCase() === String(dados.nome).toLowerCase()
            );
            if (inpExistente) {
                const row = inpExistente.closest('.attack-row');
                if (row) {
                    row.dataset.fonteAncestralidade = idAtual;
                    row.dataset.fonteTraco = traco.id;
                }
                return;
            }

            // 3) Adiciona novo
            if (typeof window.adicionarAtaque === 'function') {
                window.adicionarAtaque(dados, {
                    ancestralidade: idAtual,
                    traco: traco.id,
                });
            }
        });
    }

    function atualizarPainel() {
        const container = document.getElementById('ancestralidadeTracos');
        const empty = document.getElementById('ancestralidadeTracosEmpty');
        if (!container) {
            const a = ancestralidadeSelecionada();
            sincronizarAtaquesConcedidos(a);
            sincronizarBonusPericias(a);
            sincronizarBonusAtributos(a);
            sincronizarBonusDefesa(a);
            sincronizarSubstituicoesAtributo(a);
            sincronizarImunidadeSobrecarga(a);
            limparPericiasTreinadasPorTracoAntigo(a);
            return;
        }

        const ancestralidade = ancestralidadeSelecionada();
        const campo = document.querySelector('[name="ancestralidade"]');

        if (!ancestralidade) {
            container.innerHTML = '';
            if (empty) empty.style.display = '';
            sincronizarAtaquesConcedidos(null);
            sincronizarBonusPericias(null);
            sincronizarBonusAtributos(null);
            sincronizarBonusDefesa(null);
            sincronizarSubstituicoesAtributo(null);
            sincronizarImunidadeSobrecarga(null);
            limparPericiasTreinadasPorTracoAntigo(null);
            return;
        }

        if (campo && campo.value !== ancestralidade.nome) {
            campo.value = ancestralidade.nome;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = ancestralidade.tracos.map(traco => `
            <button
                type="button"
                class="ancestralidade-tag"
                data-traco-id="${escaparHtml(traco.id)}"
            >${escaparHtml(traco.nome)}</button>
        `).join('');

        container.querySelectorAll('[data-traco-id]').forEach(botao => {
            botao.addEventListener('click', () => {
                const traco = ancestralidade.tracos.find(item => item.id === botao.dataset.tracoId);
                if (traco) abrirModalTraco(traco);
            });
        });

        sincronizarAtaquesConcedidos(ancestralidade);
        sincronizarBonusPericias(ancestralidade);
        sincronizarBonusAtributos(ancestralidade);
        sincronizarBonusDefesa(ancestralidade);
        sincronizarSubstituicoesAtributo(ancestralidade);
        sincronizarImunidadeSobrecarga(ancestralidade);
        limparPericiasTreinadasPorTracoAntigo(ancestralidade);
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

    async function init() {
        try {
            const response = await fetch('data/ancestralidades.json?v=20260501s');
            const data = await response.json();
            ancestralidades = data.ancestralidades || [];
        } catch (error) {
            console.error('Falha ao carregar ancestralidades:', error);
            ancestralidades = [];
        }

        try {
            const respMagias = await fetch('data/magias.json');
            const dadosMagias = await respMagias.json();
            catalogoMagias = Array.isArray(dadosMagias.magias) ? dadosMagias.magias : [];
        } catch (error) {
            console.warn('Falha ao carregar magias para ancestralidades:', error);
            catalogoMagias = [];
        }

        const campo = document.querySelector('[name="ancestralidade"]');
        if (campo) {
            campo.addEventListener('change', atualizarPainel);
            campo.addEventListener('input', atualizarPainel);
        }

        // Re-sincroniza bônus de Defesa quando Constituição, Nível ou
        // armadura equipada mudam (afetam o cálculo do Reptiliano, etc.)
        ['constituicao', 'forca', 'destreza', 'inteligencia', 'sabedoria', 'carisma', 'nivel'].forEach(n => {
            const i = document.querySelector(`[name="${n}"]`);
            if (i) {
                i.addEventListener('input', () => sincronizarBonusDefesa());
                i.addEventListener('change', () => sincronizarBonusDefesa());
            }
        });
        const armorInput = document.querySelector('[data-armor-slot="armadura"] [data-armor-search]');
        if (armorInput) {
            armorInput.addEventListener('input', () => sincronizarBonusDefesa());
            armorInput.addEventListener('change', () => sincronizarBonusDefesa());
        }

        const fechar = document.getElementById('ancestralidadeTracoFechar');
        if (fechar) fechar.addEventListener('click', fecharModalTraco);

        const modal = document.getElementById('ancestralidadeTracoModal');
        if (modal) {
            modal.addEventListener('click', event => {
                if (event.target === modal) fecharModalTraco();
            });
        }

        atualizarPainel();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.AncestralidadesPindorama = {
        atualizarPainel,
        getAncestralidadeAtual: ancestralidadeSelecionada,
        sincronizarBonusDefesa,
    };
})();
