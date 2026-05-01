const periciasBase = [
    ["Acrobacia", "Des"],
    ["Adestramento", "Car"],
    ["Atletismo", "For"],
    ["Atuação", "Car"],
    ["Cavalgar", "Des"],
    ["Conhecimento", "Int"],
    ["Cura", "Sab"],
    ["Diplomacia", "Car"],
    ["Enganação", "Car"],
    ["Fortitude", "Con"],
    ["Furtividade", "Des"],
    ["Guerra", "Int"],
    ["Iniciativa", "Des"],
    ["Intimidação", "Car"],
    ["Intuição", "Sab"],
    ["Investigação", "Int"],
    ["Jogatina", "Car"],
    ["Ladinagem", "Des"],
    ["Luta", "For"],
    ["Misticismo", "Int"],
    ["Nobreza", "Int"],
    ["Ofício 1", "Int"],
    ["Ofício 2", "Int"],
    ["Percepção", "Sab"],
    ["Pilotagem", "Des"],
    ["Pontaria", "Des"],
    ["Reflexos", "Des"],
    ["Religião", "Sab"],
    ["Sobrevivência", "Sab"],
    ["Vontade", "Sab"]
];

const mapaAtributos = {
    For: "forca",
    Des: "destreza",
    Con: "constituicao",
    Int: "inteligencia",
    Sab: "sabedoria",
    Car: "carisma"
};
const classesRPG = {
    "Arcanista": {
        slug: "classe-arcanista.php",
        descricao: "Usuário de magia capaz de manipular as estruturas da realidade a partir de conhecimentos ocultos.",
        atributo: "Inteligência",
        pvInicial: 8,
        pvPorNivel: 2,
        pmPorNivel: 8,
        pericias: "Misticismo e Vontade, mais 2 à escolha.",
        proficiencias: "Nenhuma."
    },

    "Artífice": {
        slug: "classe-artifice.php",
        descricao: "Ferreiro, alquimista ou engenhoqueiro, especializado em fabricar e usar itens.",
        atributo: "Inteligência",
        pvInicial: 12,
        pvPorNivel: 3,
        pmPorNivel: 4,
        pericias: "Ofício e Vontade, mais 4.",
        proficiencias: "Nenhuma."
    },

    "Brincante": {
        slug: "classe-brincante.php",
        descricao: "Místico inspirador que possui poderes manifestados em sua arte.",
        atributo: "Carisma",
        pvInicial: 12,
        pvPorNivel: 4,
        pmPorNivel: 4,
        pericias: "Atuação e Reflexos, mais 7.",
        proficiencias: "Armas marciais."
    },

    "Caçador": {
        slug: "classe-cacador.php",
        descricao: "Exterminador de monstros e mestre da sobrevivência e exploração em áreas selvagens.",
        atributo: "Força ou Destreza",
        pvInicial: 20,
        pvPorNivel: 5,
        pmPorNivel: 4,
        pericias: "Luta ou Pontaria, Sobrevivência, mais 4.",
        proficiencias: "Armas marciais e escudo."
    },

    "Cangaceiro": {
        slug: "classe-cangaceiro.php",
        descricao: "Mestre das emboscadas e das táticas de combate em grupo.",
        atributo: "Força ou Destreza",
        pvInicial: 16,
        pvPorNivel: 4,
        pmPorNivel: 4,
        pericias: "Luta ou Pontaria, Reflexos, mais 6.",
        proficiencias: "Armas de fogo. O cangaceiro ganha uma pistola como item inicial."
    },

    "Fanfarrão": {
        slug: "classe-fanfarrao.php",
        descricao: "Navegador inconsequente e galante, sempre em busca de ouro ou emoção.",
        atributo: "Destreza",
        pvInicial: 16,
        pvPorNivel: 4,
        pmPorNivel: 3,
        pericias: "Luta ou Pontaria, Reflexos, mais 4.",
        proficiencias: "Armas marciais e escudo."
    },

    "Feiticeiro": {
        slug: "classe-feiticeiro.php",
        descricao: "Portador de magia derivada de pactos com espíritos ancestrais.",
        atributo: "Carisma",
        pvInicial: 12,
        pvPorNivel: 3,
        pmPorNivel: 5,
        pericias: "Misticismo e Vontade, mais 3.",
        proficiencias: "Nenhuma."
    },

    "Guerreiro": {
        slug: "classe-guerreiro.php",
        descricao: "Especialista supremo em técnicas de combate com armas.",
        atributo: "Força ou Destreza",
        pvInicial: 20,
        pvPorNivel: 5,
        pmPorNivel: 3,
        pericias: "Luta ou Pontaria, Fortitude, mais 2.",
        proficiencias: "Armas marciais, armaduras pesadas e escudos."
    },

    "Lutador": {
        slug: "classe-lutador.php",
        descricao: "Especialista em combate desarmado, rústico e durão.",
        atributo: "Força",
        pvInicial: 20,
        pvPorNivel: 5,
        pmPorNivel: 3,
        pericias: "Fortitude e Luta, mais 4.",
        proficiencias: "Nenhuma."
    },

    "Malandro": {
        slug: "classe-malandro.php",
        descricao: "Aventureiro cheio de truques, confiando mais em agilidade e esperteza que em força bruta.",
        atributo: "Destreza ou Inteligência",
        pvInicial: 16,
        pvPorNivel: 4,
        pmPorNivel: 4,
        pericias: "Ladinagem e Reflexos, mais 8.",
        proficiencias: "Nenhuma."
    },

    "Rústico": {
        slug: "classe-rustico.php",
        descricao: "Combatente destemido, que usa fúria e instintos para destruir seus inimigos.",
        atributo: "Força",
        pvInicial: 24,
        pvPorNivel: 6,
        pmPorNivel: 3,
        pericias: "Fortitude e Luta, mais 4.",
        proficiencias: "Armas marciais e escudo."
    },

    "Sacerdote": {
        slug: "classe-sacerdote.php",
        descricao: "Servo de um deus, usa sua fé para defender seus ideais.",
        atributo: "Sabedoria",
        pvInicial: 16,
        pvPorNivel: 4,
        pmPorNivel: 5,
        pericias: "Religião e Vontade, mais 2.",
        proficiencias: "Armas simples, armaduras leves, armaduras médias e escudos."
    },

    "Inquisidor": {
        slug: "classe-inquisidor.php",
        descricao: "Combatente honrado, campeão de uma ordem ou soldado divino.",
        atributo: "Força ou Carisma",
        pvInicial: 20,
        pvPorNivel: 5,
        pmPorNivel: 3,
        pericias: "Luta e Vontade, mais 2.",
        proficiencias: "Armas marciais, armaduras pesadas e escudos."
    },

    "Xamã": {
        slug: "classe-xama.php",
        descricao: "Conectado aos espíritos selvagens, domina magias espirituais para cura, visões e controle da força da natureza.",
        atributo: "Sabedoria",
        pvInicial: 16,
        pvPorNivel: 4,
        pmPorNivel: 5,
        pericias: "Sobrevivência e Vontade, mais 4.",
        proficiencias: "Escudos."
    }
};

const magiasClasseConfig = {
    arcanista: {
        nome: "Arcanista",
        tipos: ["Arcana", "Arcana e Divina"],
        tiposLabel: "arcanas",
        atributo: "Inteligencia",
        circulos: { 1: 1, 5: 2, 9: 3, 13: 4, 17: 5 },
        magiasIniciais: 4,
        ganho: "todo_nivel",
        extraAoLiberarCirculo: true
    },
    feiticeiro: {
        nome: "Feiticeiro",
        tipos: ["Arcana", "Arcana e Divina"],
        tiposLabel: "arcanas",
        atributo: "Carisma",
        circulos: { 1: 1, 5: 2, 9: 3, 13: 4, 17: 5 },
        magiasIniciais: 3,
        ganho: "nivel_impar"
    },
    brincante: {
        nome: "Brincante",
        tipos: ["Arcana", "Divina", "Arcana e Divina"],
        tiposLabel: "arcanas ou divinas",
        atributo: "Carisma",
        circulos: { 1: 1, 6: 2, 10: 3, 14: 4 },
        magiasIniciais: 2,
        ganho: "nivel_par"
    },
    sacerdote: {
        nome: "Sacerdote",
        tipos: ["Divina", "Arcana e Divina"],
        tiposLabel: "divinas",
        atributo: "Sabedoria",
        circulos: { 1: 1, 5: 2, 9: 3, 13: 4, 17: 5 },
        magiasIniciais: 3,
        ganho: "todo_nivel"
    },
    xama: {
        nome: "Xamã",
        tipos: ["Divina", "Arcana e Divina"],
        tiposLabel: "divinas",
        atributo: "Sabedoria",
        circulos: { 1: 1, 6: 2, 10: 3, 14: 4, 17: 5 },
        magiasIniciais: 2,
        ganho: "nivel_par"
    }
};

let catalogoMagiasFicha = [];
let magiasSelecionadasFicha = [];
let magiaModalAtual = null;

function normalizarChaveSelecao(valor) {
    return String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "")
        .trim();
}

function selecionarOpcaoPorChave(campo, valor) {
    if (!campo) return;

    const alvo = normalizarChaveSelecao(valor);
    const opcao = Array.from(campo.options || []).find(opt =>
        normalizarChaveSelecao(opt.dataset.classeId) === alvo ||
        normalizarChaveSelecao(opt.value) === alvo ||
        normalizarChaveSelecao(opt.textContent) === alvo
    );

    campo.value = opcao ? opcao.value : (valor ?? "");
}

function chaveClasseSelecionada(campo) {
    const opcao = campo?.selectedOptions?.[0];
    return normalizarChaveSelecao(opcao?.dataset?.classeId || campo?.value || opcao?.textContent || "");
}

function getDadosClassePorCampo(campo) {
    const chave = chaveClasseSelecionada(campo);
    return Object.entries(classesRPG).find(([nome]) => normalizarChaveSelecao(nome) === chave)?.[1] || null;
}

function getNomeClassePorCampo(campo) {
    const chave = chaveClasseSelecionada(campo);
    return Object.keys(classesRPG).find(nome => normalizarChaveSelecao(nome) === chave) || "";
}
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("fichaForm");

    if (form) {
        form.addEventListener("keydown", function(event) {
            if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
                event.preventDefault();
            }
        });

        form.addEventListener("submit", salvarFicha);
    }

    montarPericias();
    adicionarAtaque();
    adicionarEquipamento();
    listarFichas();
    setupCharacterImage();
    initResourceBars();
    configurarAutomacoes();
    configurarClasseDinamica();
    configurarMagiasFicha();
    configurarAutocompleteArmaduras();
    const addAtaqueBtn = document.getElementById("addAtaqueBtn");
    if (addAtaqueBtn) {
        addAtaqueBtn.addEventListener("click", () => adicionarAtaque());
    }

    const addEquipamentoBtn = document.getElementById("addEquipamentoBtn");
    if (addEquipamentoBtn) {
        addEquipamentoBtn.addEventListener("click", () => adicionarEquipamento());
    }

    // Botão de recolher/expandir do painel Perícias
    const skillsRecolherBtn = document.getElementById("skillsRecolherBtn");
    const skillsPanel = document.getElementById("skillsPanel");
    if (skillsRecolherBtn && skillsPanel) {
        skillsRecolherBtn.addEventListener("click", () => {
            const recolhido = skillsPanel.classList.toggle("skills-panel-recolhido");
            skillsRecolherBtn.setAttribute("aria-expanded", String(!recolhido));
            skillsRecolherBtn.setAttribute("aria-label", recolhido ? "Expandir seção" : "Recolher seção");
        });
    }

    const carregarFichaBtn = document.getElementById("carregarFichaBtn");
    if (carregarFichaBtn) {
        carregarFichaBtn.addEventListener("click", carregarFichaSelecionada);
    }

    const novaFichaBtn = document.getElementById("novaFichaBtn");
    if (novaFichaBtn) {
        novaFichaBtn.addEventListener("click", novaFicha);
    }
    const exportarPdfBtn = document.getElementById("exportarPdfBtn");
    if (exportarPdfBtn) {
    exportarPdfBtn.addEventListener("click", exportarFichaPDF);
    }
    document.querySelectorAll(".adjust-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const resource = btn.dataset.resource;
            const action = btn.dataset.action;
            adjustResource(resource, action === "plus" ? 1 : -1);
        });
    });

    const pvTotal = document.getElementById("pvTotal");
    if (pvTotal) {
        pvTotal.addEventListener("input", () => syncResource("pv"));
    }

    const pmTotal = document.getElementById("pmTotal");
    if (pmTotal) {
        pmTotal.addEventListener("input", () => syncResource("pm"));
    }

    atualizarTudoAutomatico();
});

function configurarAutomacoes() {
    const camposAtributos = [
        "forca",
        "destreza",
        "constituicao",
        "inteligencia",
        "sabedoria",
        "carisma",
        "nivel",
        "classe",
    ];

    camposAtributos.forEach(name => {
        const campo = document.querySelector(`[name="${name}"]`);

        if (campo) {
            campo.addEventListener("input", atualizarTudoAutomatico);
        }
    });

    document.addEventListener("input", event => {
        if (event.target.matches("[data-skill]")) {
            atualizarPericiasPorAtributos();
        }

        if (event.target.matches("[data-equipment-field]")) {
            atualizarCarga();
        }

        if (
            event.target.name === "defesa_armadura" ||
            event.target.name === "defesa_escudo" ||
            event.target.name === "defesa_outros"
        ) {
            calcularDefesa();
        }
    });

    document.addEventListener("change", event => {
        if (event.target.matches('[data-field="treinada"]')) {
            atualizarPericiasPorAtributos();
            atualizarBotoesPericia();
        }
    });

    document.addEventListener("click", event => {
        const botaoPericia = event.target.closest("[data-roll-skill]");

        if (botaoPericia) {
            const nomePericia = botaoPericia.dataset.rollSkill;
            rolarPericia(nomePericia);
        }
    });
}

function atualizarTudoAutomatico() {
    atualizarRecursosPorClasse();
    atualizarDefesaPorAtributo();
    atualizarPericiasPorAtributos();
    calcularDefesa();
    atualizarCarga();
    atualizarMagiasFicha();
}

function getValorAtributo(sigla) {
    const campo = document.querySelector(`[name="${mapaAtributos[sigla]}"]`);
    return Number(campo?.value || 0);
}

function getMeioNivel() {
    const nivel = Number(document.querySelector(`[name="nivel"]`)?.value || 0);
    return Math.floor(nivel / 2);
}

function getBonusTreino() {
    const nivel = Number(document.querySelector(`[name="nivel"]`)?.value || 0);

    if (nivel >= 15) {
        return 6;
    }

    if (nivel >= 7) {
        return 4;
    }

    return 2;
}

function atualizarDefesaPorAtributo() {
    const campoDefesaDestreza = document.querySelector(`[name="defesa_destreza"]`);

    if (campoDefesaDestreza) {
        campoDefesaDestreza.value = getValorAtributo("Des");
    }
}

function calcularDefesa() {
    const destreza = Number(document.querySelector("[name='defesa_destreza']")?.value || 0);
    const armadura = Number(document.querySelector("[name='defesa_armadura']")?.value || 0);
    const escudo = Number(document.querySelector("[name='defesa_escudo']")?.value || 0);
    const outros = Number(document.querySelector("[name='defesa_outros']")?.value || 0);

    const total = 10 + destreza + armadura + escudo + outros;

    const campoTotal = document.querySelector("[name='defesa_total']");

    if (campoTotal) {
        campoTotal.value = total;
    }
}

function montarPericias(periciasSalvas = null) {
    const container = document.getElementById("periciasContainer");

    if (!container) return;

    container.innerHTML = "";

    periciasBase.forEach(([nome, atributoSigla]) => {
        const salva = periciasSalvas?.[nome] || {};

        const treinada =
            salva.treinada === true ||
            salva.treinada === "true" ||
            salva.treinada === "1" ||
            salva.treinada === 1;

        const row = document.createElement("div");
        row.className = "skill-row";

        row.innerHTML = `
            <div class="skill-trained-box">
                <input
                    type="checkbox"
                    data-skill="${nome}"
                    data-field="treinada"
                    ${treinada ? "checked" : ""}
                >
            </div>

            <button
                type="button"
                class="skill-roll-button"
                data-roll-skill="${nome}"
                title="Rolar ${nome} — atributo-chave: ${atributoSigla}"
            >
                ${nome}
            </button>

            <input 
                type="number" 
                data-skill="${nome}" 
                data-field="total" 
                value="${salva.total ?? 0}" 
                readonly
            >

            <input 
                type="number" 
                data-skill="${nome}" 
                data-field="meio_nivel" 
                value="${salva.meio_nivel ?? 0}" 
                readonly
            >

            <div class="skill-attr-cell">
                <span class="skill-attr-badge" data-attr="${atributoSigla}" title="${atributoSigla}">${atributoSigla}</span>
                <input
                    type="number"
                    data-skill="${nome}"
                    data-field="atributo"
                    value="${salva.atributo ?? 0}"
                    readonly
                >
            </div>

            <input 
                type="number" 
                data-skill="${nome}" 
                data-field="treino" 
                value="${salva.treino ?? 0}" 
                readonly
            >

            <input 
                type="number" 
                data-skill="${nome}" 
                data-field="outros" 
                value="${salva.outros ?? 0}"
            >
        `;

        container.appendChild(row);
    });

    atualizarPericiasPorAtributos();
    atualizarBotoesPericia();
}

function atualizarPericiasPorAtributos() {
    const meioNivel = getMeioNivel();
    const subs = Array.isArray(window.__substituicoesAtributoPericia)
        ? window.__substituicoesAtributoPericia : [];

    periciasBase.forEach(([nome, atributoSiglaOriginal]) => {
        const valorOriginal = getValorAtributo(atributoSiglaOriginal);

        // Verifica se há substituição de atributo aplicável (ex: Kai'porah Atletismo Des/For)
        let atributoSigla = atributoSiglaOriginal;
        const sub = subs.find(s => s.pericia === nome);
        if (sub && sub.atributo_alternativo) {
            const valorAlt = getValorAtributo(sub.atributo_alternativo);
            if (sub.modo === 'sempre' || (sub.modo === 'maior' && valorAlt > valorOriginal)) {
                atributoSigla = sub.atributo_alternativo;
            }
        }
        const atributoValor = getValorAtributo(atributoSigla);

        const campoMeioNivel = document.querySelector(`[data-skill="${nome}"][data-field="meio_nivel"]`);
        const campoAtributo = document.querySelector(`[data-skill="${nome}"][data-field="atributo"]`);
        const campoTreino = document.querySelector(`[data-skill="${nome}"][data-field="treino"]`);
        const campoTreinada = document.querySelector(`[data-skill="${nome}"][data-field="treinada"]`);

        if (campoMeioNivel) {
            campoMeioNivel.value = meioNivel;
        }

        if (campoAtributo) {
            campoAtributo.value = atributoValor;
            // Atualiza o badge da sigla na coluna Atributo se a substituição mudar
            const badgeCell = campoAtributo.closest('.skill-attr-cell')?.querySelector('.skill-attr-badge');
            if (badgeCell) {
                badgeCell.textContent = atributoSigla;
                badgeCell.dataset.attr = atributoSigla;
            }
        }

        if (campoTreino && campoTreinada) {
            campoTreino.value = campoTreinada.checked ? getBonusTreino() : 0;
        }

        atualizarTotalDaPericia(nome);
    });
}

function atualizarTotalDaPericia(nome) {
    const campoTotal = document.querySelector(`[data-skill="${nome}"][data-field="total"]`);
    const campoMeioNivel = document.querySelector(`[data-skill="${nome}"][data-field="meio_nivel"]`);
    const campoAtributo = document.querySelector(`[data-skill="${nome}"][data-field="atributo"]`);
    const campoTreino = document.querySelector(`[data-skill="${nome}"][data-field="treino"]`);
    const campoOutros = document.querySelector(`[data-skill="${nome}"][data-field="outros"]`);

    if (!campoTotal) return;

    const meioNivel = Number(campoMeioNivel?.value || 0);
    const atributo = Number(campoAtributo?.value || 0);
    const treino = Number(campoTreino?.value || 0);
    const outros = Number(campoOutros?.value || 0);

    campoTotal.value = meioNivel + atributo + treino + outros;
}

const PERICIAS_APENAS_TREINADAS = new Set([
    'Adestramento', 'Atuação', 'Conhecimento', 'Guerra', 'Jogatina',
    'Ladinagem', 'Misticismo', 'Nobreza', 'Ofício', 'Ofício 1', 'Ofício 2',
    'Pilotagem', 'Religião'
]);

function periciaPodeSerRolada(nomePericia) {
    if (!PERICIAS_APENAS_TREINADAS.has(nomePericia)) return true;
    const cb = document.querySelector(`[data-skill="${nomePericia}"][data-field="treinada"]`);
    return !!(cb && cb.checked);
}

function atualizarBotoesPericia() {
    document.querySelectorAll('[data-roll-skill]').forEach(btn => {
        const nome = btn.dataset.rollSkill;
        if (periciaPodeSerRolada(nome)) {
            btn.classList.remove('skill-roll-disabled');
            btn.title = `Rolar ${nome}`;
        } else {
            btn.classList.add('skill-roll-disabled');
            btn.title = `${nome} é "somente treinada" — você precisa ter treinamento.`;
        }
    });
}

function rolarPericia(nomePericia) {
    atualizarTudoAutomatico();

    // Perícia somente-treinada sem treino: clique é silenciado.
    // O visual disabled (opacity + cursor not-allowed + tooltip) já comunica.
    if (!periciaPodeSerRolada(nomePericia)) return;

    const campoTotal = document.querySelector(`[data-skill="${nomePericia}"][data-field="total"]`);
    const bonusPericia = Number(campoTotal?.value || 0);

    const resultadoD20 = Math.floor(Math.random() * 20) + 1;
    const resultadoFinal = resultadoD20 + bonusPericia;

    mostrarAnimacaoD20({
        nomePericia,
        resultadoD20,
        bonusPericia,
        resultadoFinal
    });
}

function mostrarAnimacaoD20({ nomePericia, resultadoD20, bonusPericia, resultadoFinal }) {
    let overlay = document.getElementById("diceOverlay");

    if (!overlay) {
        overlay = criarOverlayDado();
        document.body.appendChild(overlay);
    }

    const diceNumber = overlay.querySelector("#diceNumber");
    const skillName = overlay.querySelector("#diceSkillName");
    const diceFormula = overlay.querySelector("#diceFormula");
    const finalResult = overlay.querySelector("#diceFinalResult");
    const diceShape = overlay.querySelector(".dice-d20-shape");

    skillName.textContent = nomePericia;
    diceFormula.textContent = "Rolando d20...";
    finalResult.textContent = "";
    diceNumber.textContent = "?";

    overlay.classList.add("active");

    diceShape.classList.remove("dice-finished", "dice-critical", "dice-fail");
    diceShape.classList.add("dice-rolling");

    let tempo = 0;

    const intervalo = setInterval(() => {
        const numeroTemporario = Math.floor(Math.random() * 20) + 1;
        diceNumber.textContent = numeroTemporario;

        tempo += 80;

        if (tempo >= 1100) {
            clearInterval(intervalo);

            diceNumber.textContent = resultadoD20;
            diceShape.classList.remove("dice-rolling");
            diceShape.classList.add("dice-finished");

            diceFormula.textContent = `d20 (${resultadoD20}) + perícia (${bonusPericia})`;

            if (resultadoD20 === 20) {
                finalResult.textContent = `Crítico! Resultado final: ${resultadoFinal}`;
                diceShape.classList.add("dice-critical");
            } else if (resultadoD20 === 1) {
                finalResult.textContent = `Falha crítica! Resultado final: ${resultadoFinal}`;
                diceShape.classList.add("dice-fail");
            } else {
                finalResult.textContent = `Resultado final: ${resultadoFinal}`;
            }
        }
    }, 80);
}

function criarOverlayDado() {
    const overlay = document.createElement("div");
    overlay.id = "diceOverlay";
    overlay.className = "dice-overlay";

    overlay.innerHTML = `
        <div class="dice-modal">
            <button type="button" class="dice-close" id="diceCloseBtn">×</button>

            <div class="dice-title">Teste de Perícia</div>
            <div class="dice-skill-name" id="diceSkillName">Perícia</div>

            <div class="dice-d20-area">
                <div class="dice-d20-shape">
                    <span id="diceNumber">?</span>
                </div>
            </div>

            <div class="dice-formula" id="diceFormula">Rolando d20...</div>
            <div class="dice-final-result" id="diceFinalResult"></div>
        </div>
    `;

    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            fecharOverlayDado();
        }
    });

    const closeBtn = overlay.querySelector("#diceCloseBtn");
    if (closeBtn) {
        closeBtn.addEventListener("click", fecharOverlayDado);
    }

    return overlay;
}

function fecharOverlayDado() {
    const overlay = document.getElementById("diceOverlay");

    if (overlay) {
        overlay.classList.remove("active");
    }
}

function adicionarAtaque(ataque = {}, fonte = null) {
    const container = document.getElementById("ataquesContainer");

    if (!container) return null;

    const row = document.createElement("div");
    row.className = "attack-row";

    row.innerHTML = `
        <input type="text" data-attack="nome" placeholder="Ataque" autocomplete="off" value="${ataque.nome ?? ""}">
        <input type="text" data-attack="teste" placeholder="Teste" value="${ataque.teste ?? ""}">
        <input type="text" data-attack="dano" placeholder="Dano" value="${ataque.dano ?? ""}">
        <input type="text" data-attack="critico" placeholder="Crítico" value="${ataque.critico ?? ""}">
        <input type="text" data-attack="alcance" placeholder="Alcance" value="${ataque.alcance ?? ""}">
        <input type="text" data-attack="tipo" placeholder="Tipo" value="${ataque.tipo ?? ""}">
        <div class="attack-actions">
            <button type="button" class="attack-dice-btn" data-attack-action="teste" title="Rolar teste de ataque" aria-label="Rolar teste">🎯</button>
            <button type="button" class="attack-dice-btn" data-attack-action="dano" title="Rolar dano" aria-label="Rolar dano">🎲</button>
        </div>
        <button type="button" class="remove-btn">×</button>
    `;

    const removeBtn = row.querySelector(".remove-btn");
    if (removeBtn) {
        removeBtn.addEventListener("click", () => row.remove());
    }

    const inputNome = row.querySelector('[data-attack="nome"]');
    if (inputNome) {
        configurarAutocompleteAtaque(row, inputNome);
    }

    const btnTeste = row.querySelector('[data-attack-action="teste"]');
    const btnDano  = row.querySelector('[data-attack-action="dano"]');
    if (btnTeste) btnTeste.addEventListener("click", () => rolarTesteAtaque(row));
    if (btnDano)  btnDano.addEventListener("click",  () => rolarDanoAtaque(row));

    if (fonte && typeof fonte === "object") {
        if (fonte.ancestralidade) row.dataset.fonteAncestralidade = fonte.ancestralidade;
        if (fonte.traco) row.dataset.fonteTraco = fonte.traco;
    }

    container.appendChild(row);
    return row;
}

let __catalogoAtaques = null;
let __catalogoAtaquesPromise = null;

async function carregarCatalogoAtaques() {
    if (__catalogoAtaques) return __catalogoAtaques;
    if (__catalogoAtaquesPromise) return __catalogoAtaquesPromise;
    __catalogoAtaquesPromise = fetch('ataques-catalogo.php')
        .then(r => r.json())
        .then(j => {
            __catalogoAtaques = (j && j.success) ? j.itens : [];
            return __catalogoAtaques;
        })
        .catch(err => {
            console.warn('Falha ao carregar catálogo de ataques:', err);
            __catalogoAtaques = [];
            return __catalogoAtaques;
        });
    return __catalogoAtaquesPromise;
}

function preencherCamposAtaque(row, item) {
    // Para o campo "nome", apenas atualiza o value SEM disparar input (evita reabrir autocomplete).
    const setSilencioso = (campo, valor) => {
        const el = row.querySelector(`[data-attack="${campo}"]`);
        if (el) el.value = valor;
    };
    setSilencioso("nome", item.nome);
    setSilencioso("teste", item.teste || "");
    setSilencioso("dano", item.dano || "");
    setSilencioso("critico", item.critico || "");
    setSilencioso("alcance", item.alcance || "");
    setSilencioso("tipo", item.tipo || "");

    if (item.municao) {
        row.dataset.municaoTipo = item.municao.tipo;
        row.dataset.municaoQtd  = String(item.municao.qtd);
    } else {
        delete row.dataset.municaoTipo;
        delete row.dataset.municaoQtd;
    }
}

/**
 * Reduz o nome a uma "base" comparável: sem acento, sem parênteses, sem
 * caracteres especiais e sem 's' final. Assim "Virote (20)", "Virotes" e
 * "virote" todos viram "virote".
 */
function baseNomeMunicao(s) {
    return normalizarBusca(s)
        .replace(/\([^)]*\)/g, ' ')     // remove "(20)" etc
        .replace(/[^a-z0-9 ]/g, ' ')    // remove pontuação
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/s$/, '');             // tira plural simples
}

/**
 * Localiza a linha de equipamento cuja descrição corresponde ao tipo de munição
 * (Flechas, Virotes, Balas, Pedras), tolerante a singular/plural e parênteses.
 */
function encontrarMunicaoNoEquipamento(tipo) {
    const alvo = baseNomeMunicao(tipo);
    if (!alvo) return null;
    const linhas = document.querySelectorAll(".equipment-row");
    for (const linha of linhas) {
        const nomeInput = linha.querySelector('[data-equipment-field="nome"]');
        if (!nomeInput) continue;
        const inv = baseNomeMunicao(nomeInput.value);
        if (!inv) continue;
        if (inv === alvo || inv.includes(alvo) || alvo.includes(inv)) {
            return linha;
        }
    }
    return null;
}

function notificar(mensagem, tipo = 'info') {
    let cont = document.getElementById('appNotificacoes');
    if (!cont) {
        cont = document.createElement('div');
        cont.id = 'appNotificacoes';
        cont.className = 'app-notificacoes';
        document.body.appendChild(cont);
    }
    const toast = document.createElement('div');
    toast.className = 'app-toast app-toast-' + tipo;
    toast.innerHTML = '<span class="app-toast-msg"></span><span class="app-toast-counter">5</span>';
    toast.querySelector('.app-toast-msg').textContent = mensagem;
    cont.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visivel'));

    let segundos = 5;
    const counter = toast.querySelector('.app-toast-counter');
    const intervalo = setInterval(() => {
        segundos--;
        if (counter) counter.textContent = segundos;
        if (segundos <= 0) {
            clearInterval(intervalo);
            toast.classList.remove('visivel');
            setTimeout(() => toast.remove(), 300);
        }
    }, 1000);
}

/**
 * Verifica se há munição suficiente e a consome.
 * Retorna { ok: true } em sucesso, { ok: false, motivo } em falha.
 */
function consumirMunicaoSeNecessario(row) {
    const tipo = row.dataset.municaoTipo;
    const qtd = Number(row.dataset.municaoQtd || 0);
    if (!tipo || !qtd) return { ok: true };

    const linhaEquip = encontrarMunicaoNoEquipamento(tipo);
    if (!linhaEquip) {
        notificar(`Sem ${tipo} no inventário. Adicione em Equipamentos para usar este ataque.`, 'erro');
        return { ok: false, motivo: 'sem-municao' };
    }

    const inputQtd = linhaEquip.querySelector('[data-equipment-field="quantidade"]');
    const atual = Number(inputQtd?.value || 0);
    if (atual < qtd) {
        notificar(`${tipo} insuficiente (precisa de ${qtd}, disponível: ${atual}).`, 'erro');
        return { ok: false, motivo: 'sem-quantidade' };
    }

    const restantes = atual - qtd;
    inputQtd.value = restantes;
    inputQtd.dispatchEvent(new Event('input', { bubbles: true }));

    const tipoLower = String(tipo).toLowerCase();
    let msg;
    if (restantes === 0) {
        msg = `Sem ${tipoLower} restantes.`;
    } else if (restantes === 1) {
        // Singulariza: Virotes → Virote, Flechas → Flecha, Balas → Bala, Pedras → Pedra
        const singular = tipoLower.replace(/s$/, '');
        msg = `Resta 1 ${singular}.`;
    } else {
        msg = `Restam ${restantes} ${tipoLower}.`;
    }
    notificar(msg, restantes === 0 ? 'erro' : 'info');
    return { ok: true };
}

function configurarAutocompleteAtaque(row, inputNome) {
    let dropdown = null;
    let tooltip = null;
    let tooltipTimer = null;
    let indiceAtivo = -1;
    let sugestoes = [];
    let bloqueado = false;
    let itemSelecionado = null;

    function fecharTooltip() {
        clearTimeout(tooltipTimer);
        tooltipTimer = null;
        if (tooltip) { tooltip.remove(); tooltip = null; }
    }

    function fechar() {
        fecharTooltip();
        if (dropdown) { dropdown.remove(); dropdown = null; }
        indiceAtivo = -1;
        sugestoes = [];
    }

    function escolher(idx) {
        const item = sugestoes[idx];
        if (!item) return;
        bloqueado = true;
        preencherCamposAtaque(row, item);
        itemSelecionado = item;
        inputNome.dataset.itemEscolhido = '1';
        fechar();
        setTimeout(() => { bloqueado = false; }, 0);
    }

    function destacar(idx) {
        if (!dropdown) return;
        dropdown.querySelectorAll(".equipamento-sugestao").forEach((el, i) =>
            el.classList.toggle("ativa", i === idx));
        indiceAtivo = idx;
    }

    function posicionar() {
        if (!dropdown) return;
        const rect = inputNome.getBoundingClientRect();
        dropdown.style.left = (rect.left + window.scrollX) + "px";
        dropdown.style.top = (rect.bottom + window.scrollY + 2) + "px";
        dropdown.style.minWidth = Math.max(rect.width, 240) + "px";
    }

    function abrirTooltip(item, ancora) {
        fecharTooltip();
        if (!item) return;

        tooltip = document.createElement("div");
        tooltip.className = "equipamento-tooltip";

        const linhas = [
            ['Teste', item.teste],
            ['Dano', item.dano],
            ['Crítico', item.critico],
            ['Alcance', item.alcance],
            ['Tipo', item.tipo],
        ].filter(([, v]) => v && v !== '—');

        const camposHtml = linhas.map(() =>
            `<div class="tooltip-campo"><strong></strong><span></span></div>`
        ).join("");

        tooltip.innerHTML = `
            <div class="tooltip-header">
                <span class="tooltip-nome"></span>
                <span class="tooltip-espacos">${item.origem === 'arma' ? (item.secao || 'Arma') : 'Natural'}</span>
            </div>
            ${camposHtml ? `<div class="tooltip-campos">${camposHtml}</div>` : ''}
            ${item.descricao ? `<p class="tooltip-descricao"></p>` : ''}
        `;
        tooltip.querySelector(".tooltip-nome").textContent = item.nome;
        const camposEls = tooltip.querySelectorAll(".tooltip-campo");
        linhas.forEach(([k, v], i) => {
            camposEls[i].querySelector("strong").textContent = k + ":";
            camposEls[i].querySelector("span").textContent = v;
        });
        if (item.descricao) {
            tooltip.querySelector(".tooltip-descricao").textContent = item.descricao;
        }

        document.body.appendChild(tooltip);

        const rect = ancora.getBoundingClientRect();
        const ttRect = tooltip.getBoundingClientRect();
        const margem = 8;
        let left = rect.right + margem + window.scrollX;
        let top = rect.top + window.scrollY;
        if (left + ttRect.width > window.scrollX + document.documentElement.clientWidth - margem) {
            left = rect.left - ttRect.width - margem + window.scrollX;
            if (left < window.scrollX + margem) {
                left = Math.max(margem, Math.min(rect.left, window.scrollX + document.documentElement.clientWidth - ttRect.width - margem)) + window.scrollX;
                top = rect.bottom + margem + window.scrollY;
            }
        }
        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";
    }

    function abrirTooltipComDelay(item, ancora, ms = 400) {
        clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(() => abrirTooltip(item, ancora), ms);
    }

    inputNome.addEventListener("input", async () => {
        if (bloqueado) return;
        if (inputNome.dataset.itemEscolhido === '1') {
            delete inputNome.dataset.itemEscolhido;
            itemSelecionado = null;
        }
        const valor = normalizarBusca(inputNome.value);
        if (valor.length < 2) { fechar(); return; }

        const itens = await carregarCatalogoAtaques();
        sugestoes = itens
            .filter(it => normalizarBusca(it.nome).includes(valor))
            .slice(0, 12);

        if (!sugestoes.length) { fechar(); return; }

        if (!dropdown) {
            dropdown = document.createElement("div");
            dropdown.className = "equipamento-sugestoes";
            document.body.appendChild(dropdown);
        }

        dropdown.innerHTML = sugestoes.map((it, i) => `
            <div class="equipamento-sugestao" data-idx="${i}">
                <span class="sugestao-nome"></span>
                <span class="sugestao-espacos">${it.dano}</span>
            </div>
        `).join("");

        dropdown.querySelectorAll(".equipamento-sugestao").forEach((el, i) => {
            el.querySelector(".sugestao-nome").textContent = sugestoes[i].nome;

            el.addEventListener("mousedown", e => { e.preventDefault(); escolher(i); });
            el.addEventListener("mouseenter", () => {
                destacar(i);
                abrirTooltipComDelay(sugestoes[i], el);
            });
            el.addEventListener("mouseleave", fecharTooltip);

            let pressTimer = null;
            let longPress = false;
            el.addEventListener("touchstart", () => {
                longPress = false;
                clearTimeout(pressTimer);
                pressTimer = setTimeout(() => {
                    longPress = true;
                    abrirTooltip(sugestoes[i], el);
                }, 500);
            }, { passive: true });
            el.addEventListener("touchmove", () => clearTimeout(pressTimer), { passive: true });
            el.addEventListener("touchend", e => {
                clearTimeout(pressTimer);
                if (longPress) e.preventDefault();
            });
            el.addEventListener("touchcancel", () => clearTimeout(pressTimer));
        });

        indiceAtivo = -1;
        posicionar();
    });

    inputNome.addEventListener("blur", () => setTimeout(fechar, 150));

    inputNome.addEventListener("keydown", e => {
        if (!dropdown || !sugestoes.length) return;
        if (e.key === "ArrowDown") { e.preventDefault(); destacar((indiceAtivo + 1) % sugestoes.length); }
        else if (e.key === "ArrowUp") { e.preventDefault(); destacar((indiceAtivo - 1 + sugestoes.length) % sugestoes.length); }
        else if (e.key === "Enter" && indiceAtivo >= 0) { e.preventDefault(); escolher(indiceAtivo); }
        else if (e.key === "Escape") fechar();
    });

    window.addEventListener("scroll", posicionar, true);
    window.addEventListener("resize", posicionar);

    // Tooltip do item já preenchido: hover desktop / long-press mobile
    inputNome.addEventListener("mouseenter", () => {
        if (itemSelecionado && !dropdown) abrirTooltipComDelay(itemSelecionado, inputNome);
    });
    inputNome.addEventListener("mouseleave", fecharTooltip);
    let pressTimerInput = null;
    inputNome.addEventListener("touchstart", () => {
        clearTimeout(pressTimerInput);
        if (!itemSelecionado) return;
        pressTimerInput = setTimeout(() => abrirTooltip(itemSelecionado, inputNome), 500);
    }, { passive: true });
    inputNome.addEventListener("touchend", () => clearTimeout(pressTimerInput));
    inputNome.addEventListener("touchmove", () => clearTimeout(pressTimerInput), { passive: true });
}

/* ===== Catálogo e autocomplete de armaduras / escudos ===== */

let __catalogoArmaduras = null;
let __catalogoArmadurasPromise = null;

async function carregarCatalogoArmaduras() {
    if (__catalogoArmaduras) return __catalogoArmaduras;
    if (__catalogoArmadurasPromise) return __catalogoArmadurasPromise;
    __catalogoArmadurasPromise = fetch('armaduras-catalogo.php')
        .then(r => r.json())
        .then(j => {
            __catalogoArmaduras = (j && j.success) ? j.itens : [];
            return __catalogoArmaduras;
        })
        .catch(err => {
            console.warn('Falha ao carregar catálogo de armaduras:', err);
            __catalogoArmaduras = [];
            return __catalogoArmaduras;
        });
    return __catalogoArmadurasPromise;
}

function aplicarArmaduraOuEscudoNoSlot(slotEl, item) {
    if (!slotEl || !item) return;
    const tipoSlot = slotEl.dataset.armorSlot; // "armadura" | "escudo"

    const inp = slotEl.querySelector('[data-armor-search]');
    if (inp) {
        inp.value = item.nome;
        // NÃO dispara 'input' aqui — isso reabriria o dropdown.
    }
    const bonusEl = slotEl.querySelector('[data-armor-stat="bonus"]');
    const penEl   = slotEl.querySelector('[data-armor-stat="penalidade"]');
    const espEl   = slotEl.querySelector('[data-armor-stat="espacos"]');
    if (bonusEl) bonusEl.textContent = (item.bonus >= 0 ? '+' : '') + item.bonus;
    if (penEl) penEl.textContent = item.penalidade;
    if (espEl) espEl.textContent = item.espacos;

    // Guarda a seção (Armaduras Leves / Pesadas / Escudos) pra detectar
    // se é armadura pesada quando outros sistemas (ex: Reptiliano) precisarem.
    if (item.secao) slotEl.dataset.armorSecao = item.secao;
    else delete slotEl.dataset.armorSecao;

    // Auto-preenche o campo correspondente no painel Defesa
    const alvo = tipoSlot === 'escudo' ? 'defesa_escudo' : 'defesa_armadura';
    const inputDefesa = document.querySelector(`[name="${alvo}"]`);
    if (inputDefesa) {
        inputDefesa.value = item.bonus;
        inputDefesa.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Re-sincroniza bônus de Defesa de ancestralidade (ex: Reptiliano)
    // pois o cap de +2 com armadura pesada pode mudar.
    if (window.AncestralidadesPindorama?.sincronizarBonusDefesa) {
        window.AncestralidadesPindorama.sincronizarBonusDefesa();
    }
}

/**
 * Detecta se a armadura equipada (slot "armadura") é pesada.
 * Usa o dataset.armorSecao (set quando escolhida via autocomplete) e,
 * como fallback para fichas carregadas, busca pelo nome no catálogo.
 */
window.PindoramaIsArmaduraPesada = function () {
    const slot = document.querySelector('[data-armor-slot="armadura"]');
    if (!slot) return false;

    const secao = slot.dataset.armorSecao;
    if (secao) return /pesada/i.test(secao);

    // Fallback: lookup no catálogo
    const inp = slot.querySelector('[data-armor-search]');
    const nome = inp?.value?.trim();
    if (!nome || !__catalogoArmaduras) return false;
    const item = __catalogoArmaduras.find(it =>
        String(it.nome || '').toLowerCase() === nome.toLowerCase()
    );
    if (!item) return false;
    if (item.secao) slot.dataset.armorSecao = item.secao; // cacheia
    return /pesada/i.test(item.secao || '');
};

function configurarAutocompleteArmadura(slotEl) {
    const inputNome = slotEl.querySelector('[data-armor-search]');
    if (!inputNome) return;
    const tipoSlot = slotEl.dataset.armorSlot; // "armadura" | "escudo"

    let dropdown = null;
    let tooltip = null;
    let tooltipTimer = null;
    let indiceAtivo = -1;
    let sugestoes = [];
    let bloqueado = false;
    let itemSelecionado = null;

    function fecharTooltip() {
        clearTimeout(tooltipTimer);
        tooltipTimer = null;
        if (tooltip) { tooltip.remove(); tooltip = null; }
    }
    function fechar() {
        fecharTooltip();
        if (dropdown) { dropdown.remove(); dropdown = null; }
        indiceAtivo = -1;
        sugestoes = [];
    }
    function escolher(idx) {
        const item = sugestoes[idx];
        if (!item) return;
        bloqueado = true;
        aplicarArmaduraOuEscudoNoSlot(slotEl, item);
        itemSelecionado = item;
        inputNome.dataset.itemEscolhido = '1';
        fechar();
        setTimeout(() => { bloqueado = false; }, 0);
    }
    function destacar(idx) {
        if (!dropdown) return;
        dropdown.querySelectorAll(".equipamento-sugestao").forEach((el, i) =>
            el.classList.toggle("ativa", i === idx));
        indiceAtivo = idx;
    }
    function posicionar() {
        if (!dropdown) return;
        const rect = inputNome.getBoundingClientRect();
        dropdown.style.left = (rect.left + window.scrollX) + "px";
        dropdown.style.top = (rect.bottom + window.scrollY + 2) + "px";
        dropdown.style.minWidth = Math.max(rect.width, 240) + "px";
    }
    function abrirTooltip(item, ancora) {
        fecharTooltip();
        if (!item) return;
        tooltip = document.createElement("div");
        tooltip.className = "equipamento-tooltip";
        const linhas = [
            ['Defesa', (item.bonus >= 0 ? '+' : '') + item.bonus],
            ['Penalidade', item.penalidade],
            ['Espaços', item.espacos],
            ['Preço', item.preco],
            ['Categoria', item.secao],
        ].filter(([, v]) => v !== '' && v !== null && v !== undefined);
        const camposHtml = linhas.map(() =>
            `<div class="tooltip-campo"><strong></strong><span></span></div>`).join('');
        tooltip.innerHTML = `
            <div class="tooltip-header">
                <span class="tooltip-nome"></span>
                <span class="tooltip-espacos">${item.tipo}</span>
            </div>
            ${camposHtml ? `<div class="tooltip-campos">${camposHtml}</div>` : ''}
            ${item.descricao ? `<p class="tooltip-descricao"></p>` : ''}
        `;
        tooltip.querySelector(".tooltip-nome").textContent = item.nome;
        const camposEls = tooltip.querySelectorAll(".tooltip-campo");
        linhas.forEach(([k, v], i) => {
            camposEls[i].querySelector("strong").textContent = k + ":";
            camposEls[i].querySelector("span").textContent = String(v);
        });
        if (item.descricao) {
            tooltip.querySelector(".tooltip-descricao").textContent = item.descricao;
        }
        document.body.appendChild(tooltip);

        const rect = ancora.getBoundingClientRect();
        const ttRect = tooltip.getBoundingClientRect();
        const margem = 8;
        let left = rect.right + margem + window.scrollX;
        let top = rect.top + window.scrollY;
        if (left + ttRect.width > window.scrollX + document.documentElement.clientWidth - margem) {
            left = rect.left - ttRect.width - margem + window.scrollX;
            if (left < window.scrollX + margem) {
                left = Math.max(margem, Math.min(rect.left, window.scrollX + document.documentElement.clientWidth - ttRect.width - margem)) + window.scrollX;
                top = rect.bottom + margem + window.scrollY;
            }
        }
        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";
    }
    function abrirTooltipComDelay(item, ancora, ms = 400) {
        clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(() => abrirTooltip(item, ancora), ms);
    }

    inputNome.addEventListener("input", async () => {
        if (bloqueado) return;
        if (inputNome.dataset.itemEscolhido === '1') {
            delete inputNome.dataset.itemEscolhido;
            itemSelecionado = null;
        }
        const valor = normalizarBusca(inputNome.value);
        if (valor.length < 2) { fechar(); return; }
        const itens = await carregarCatalogoArmaduras();
        sugestoes = itens
            .filter(it => it.tipo === tipoSlot && normalizarBusca(it.nome).includes(valor))
            .slice(0, 12);
        if (!sugestoes.length) { fechar(); return; }

        if (!dropdown) {
            dropdown = document.createElement("div");
            dropdown.className = "equipamento-sugestoes";
            document.body.appendChild(dropdown);
        }
        dropdown.innerHTML = sugestoes.map((it, i) => `
            <div class="equipamento-sugestao" data-idx="${i}">
                <span class="sugestao-nome"></span>
                <span class="sugestao-espacos">+${it.bonus}</span>
            </div>
        `).join("");

        dropdown.querySelectorAll(".equipamento-sugestao").forEach((el, i) => {
            el.querySelector(".sugestao-nome").textContent = sugestoes[i].nome;
            el.addEventListener("mousedown", e => { e.preventDefault(); escolher(i); });
            el.addEventListener("mouseenter", () => {
                destacar(i);
                abrirTooltipComDelay(sugestoes[i], el);
            });
            el.addEventListener("mouseleave", fecharTooltip);

            let pressTimer = null;
            let longPress = false;
            el.addEventListener("touchstart", () => {
                longPress = false;
                clearTimeout(pressTimer);
                pressTimer = setTimeout(() => {
                    longPress = true;
                    abrirTooltip(sugestoes[i], el);
                }, 500);
            }, { passive: true });
            el.addEventListener("touchmove", () => clearTimeout(pressTimer), { passive: true });
            el.addEventListener("touchend", e => {
                clearTimeout(pressTimer);
                if (longPress) e.preventDefault();
            });
            el.addEventListener("touchcancel", () => clearTimeout(pressTimer));
        });
        indiceAtivo = -1;
        posicionar();
    });

    inputNome.addEventListener("blur", () => setTimeout(fechar, 150));
    inputNome.addEventListener("keydown", e => {
        if (!dropdown || !sugestoes.length) return;
        if (e.key === "ArrowDown") { e.preventDefault(); destacar((indiceAtivo + 1) % sugestoes.length); }
        else if (e.key === "ArrowUp") { e.preventDefault(); destacar((indiceAtivo - 1 + sugestoes.length) % sugestoes.length); }
        else if (e.key === "Enter" && indiceAtivo >= 0) { e.preventDefault(); escolher(indiceAtivo); }
        else if (e.key === "Escape") fechar();
    });
    window.addEventListener("scroll", posicionar, true);
    window.addEventListener("resize", posicionar);

    // Tooltip do item já preenchido: hover desktop / long-press mobile
    inputNome.addEventListener("mouseenter", () => {
        if (itemSelecionado && !dropdown) abrirTooltipComDelay(itemSelecionado, inputNome);
    });
    inputNome.addEventListener("mouseleave", fecharTooltip);
    let pressTimerInput = null;
    inputNome.addEventListener("touchstart", () => {
        clearTimeout(pressTimerInput);
        if (!itemSelecionado) return;
        pressTimerInput = setTimeout(() => abrirTooltip(itemSelecionado, inputNome), 500);
    }, { passive: true });
    inputNome.addEventListener("touchend", () => clearTimeout(pressTimerInput));
    inputNome.addEventListener("touchmove", () => clearTimeout(pressTimerInput), { passive: true });
}

function configurarAutocompleteArmaduras() {
    document.querySelectorAll('.armor-slot').forEach(slot => {
        configurarAutocompleteArmadura(slot);
    });
}

/* ===== Rolagem de ataques ===== */

function parseCritico(critico) {
    // "19" => threshold 19, x2; "19/x3" => 19, x3; "x3" => 20, x3; vazio => 20, x2
    const t = String(critico || '').trim().toLowerCase();
    if (!t) return { threshold: 20, multiplier: 2 };
    let m = t.match(/^(\d+)\s*[\/]\s*x?\s*(\d+)$/);
    if (m) return { threshold: parseInt(m[1], 10), multiplier: parseInt(m[2], 10) };
    m = t.match(/^x\s*(\d+)$/);
    if (m) return { threshold: 20, multiplier: parseInt(m[1], 10) };
    m = t.match(/^(\d+)$/);
    if (m) return { threshold: parseInt(m[1], 10), multiplier: 2 };
    return { threshold: 20, multiplier: 2 };
}

function parseFormulaDano(formula) {
    // "1d6+2", "2d8", "1d4-1", "1d6 + 1d4" → array de termos
    const limpa = String(formula || '').replace(/\s+/g, '');
    if (!limpa) return [];
    const termos = [];
    const regex = /([+-]?)(\d*)d(\d+)|([+-]?)(\d+)(?!d)/gi;
    let match;
    while ((match = regex.exec(limpa)) !== null) {
        if (match[3] !== undefined) {
            const sinal = match[1] === '-' ? -1 : 1;
            const qtd = parseInt(match[2] || '1', 10);
            const faces = parseInt(match[3], 10);
            termos.push({ tipo: 'dado', sinal, qtd, faces });
        } else if (match[5] !== undefined) {
            const sinal = match[4] === '-' ? -1 : 1;
            termos.push({ tipo: 'mod', sinal, valor: parseInt(match[5], 10) });
        }
    }
    return termos;
}

function rolarFormulaDano(formula, multiplicarDados = 1) {
    const termos = parseFormulaDano(formula);
    if (!termos.length) return null;

    let total = 0;
    const detalhes = [];
    termos.forEach(t => {
        if (t.tipo === 'dado') {
            const qtd = t.qtd * multiplicarDados;
            const rolagens = [];
            for (let i = 0; i < qtd; i++) {
                rolagens.push(Math.floor(Math.random() * t.faces) + 1);
            }
            const soma = rolagens.reduce((a, b) => a + b, 0) * t.sinal;
            total += soma;
            const sinal = t.sinal === -1 ? '-' : (detalhes.length ? '+' : '');
            detalhes.push(`${sinal}${qtd}d${t.faces}[${rolagens.join(',')}]`);
        } else {
            total += t.valor * t.sinal;
            const sinal = t.sinal === -1 ? '-' : (detalhes.length ? '+' : '');
            detalhes.push(`${sinal}${t.valor}`);
        }
    });
    return { total, detalhes: detalhes.join(' ') };
}

function bonusPericiaPorNome(nome) {
    if (!nome) return 0;
    const campo = document.querySelector(`[data-skill="${nome}"][data-field="total"]`);
    return Number(campo?.value || 0);
}

function rolarTesteAtaque(row) {
    if (typeof atualizarTudoAutomatico === 'function') atualizarTudoAutomatico();

    // Checa e consome munição antes de qualquer outra coisa.
    const checkMun = consumirMunicaoSeNecessario(row);
    if (!checkMun.ok) return;

    const nome = row.querySelector('[data-attack="nome"]')?.value || 'Ataque';
    const teste = row.querySelector('[data-attack="teste"]')?.value || '';
    const critico = row.querySelector('[data-attack="critico"]')?.value || '';
    const dano = row.querySelector('[data-attack="dano"]')?.value || '';
    const tipo = row.querySelector('[data-attack="tipo"]')?.value || '';
    const alcance = row.querySelector('[data-attack="alcance"]')?.value || '';

    const bonus = bonusPericiaPorNome(teste);
    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + bonus;

    const { threshold, multiplier } = parseCritico(critico);
    const ehCritico = d20 >= threshold;

    if (ehCritico) {
        row.dataset.critPendente = String(multiplier);
    } else {
        delete row.dataset.critPendente;
    }

    mostrarOverlayAtaque({
        titulo: 'Teste de Ataque',
        nome: nome,
        d20,
        bonus,
        bonusLabel: teste || 'bônus',
        total,
        ehCritico,
        ehFalha: d20 === 1,
        infoExtra: ehCritico
            ? `Acerto crítico! Próximo dano será multiplicado por ${multiplier}.`
            : (d20 === 1 ? 'Falha crítica.' : null),
        meta: [dano && `Dano: ${dano}`, alcance && alcance !== '—' && `Alcance: ${alcance}`, tipo && `Tipo: ${tipo}`]
            .filter(Boolean).join(' · '),
    });
}

function rolarDanoAtaque(row) {
    const nome = row.querySelector('[data-attack="nome"]')?.value || 'Ataque';
    const dano = row.querySelector('[data-attack="dano"]')?.value || '';
    const tipo = row.querySelector('[data-attack="tipo"]')?.value || '';

    if (!dano.trim()) {
        alert('Preencha o campo de Dano antes de rolar.');
        return;
    }

    const multCrit = Number(row.dataset.critPendente || 0);
    const aplicarCrit = multCrit >= 2;
    const resultado = rolarFormulaDano(dano, aplicarCrit ? multCrit : 1);

    if (!resultado) {
        alert('Fórmula de dano inválida: ' + dano);
        return;
    }

    if (aplicarCrit) delete row.dataset.critPendente;

    mostrarOverlayAtaque({
        titulo: aplicarCrit ? `Dano CRÍTICO (×${multCrit})` : 'Dano',
        nome,
        formula: dano,
        detalhes: resultado.detalhes,
        total: resultado.total,
        ehCritico: aplicarCrit,
        meta: tipo ? `Tipo: ${tipo}` : '',
    });
}

function mostrarOverlayAtaque(info) {
    let overlay = document.getElementById("diceOverlay");
    if (!overlay) {
        overlay = criarOverlayDado();
        document.body.appendChild(overlay);
    }

    const tituloEl = overlay.querySelector(".dice-title");
    const skillName = overlay.querySelector("#diceSkillName");
    const diceFormula = overlay.querySelector("#diceFormula");
    const finalResult = overlay.querySelector("#diceFinalResult");
    const diceShape = overlay.querySelector(".dice-d20-shape");
    const diceNumber = overlay.querySelector("#diceNumber");

    tituloEl.textContent = info.titulo;
    skillName.textContent = info.nome;
    overlay.classList.add("active");
    diceShape.classList.remove("dice-finished", "dice-critical", "dice-fail", "dice-rolling");

    if (info.d20 !== undefined) {
        // Teste de ataque (1d20 + bônus)
        diceShape.classList.add("dice-rolling");
        diceNumber.textContent = '?';
        diceFormula.textContent = 'Rolando d20...';
        finalResult.textContent = '';

        let tempo = 0;
        const intervalo = setInterval(() => {
            diceNumber.textContent = Math.floor(Math.random() * 20) + 1;
            tempo += 80;
            if (tempo >= 1000) {
                clearInterval(intervalo);
                diceNumber.textContent = info.d20;
                diceShape.classList.remove("dice-rolling");
                diceShape.classList.add("dice-finished");
                if (info.ehCritico) diceShape.classList.add("dice-critical");
                else if (info.ehFalha) diceShape.classList.add("dice-fail");

                diceFormula.textContent = `d20 (${info.d20}) + ${info.bonusLabel} (${info.bonus})`;
                finalResult.innerHTML = `Total: <strong>${info.total}</strong>`
                    + (info.infoExtra ? `<div class="dice-info-extra">${escapeHtml(info.infoExtra)}</div>` : '')
                    + (info.meta ? `<div class="dice-meta">${escapeHtml(info.meta)}</div>` : '');
            }
        }, 80);
    } else {
        // Dano: sem animação de d20
        diceShape.classList.add("dice-finished");
        if (info.ehCritico) diceShape.classList.add("dice-critical");
        diceNumber.textContent = info.total;
        diceFormula.textContent = `Fórmula: ${info.formula} → ${info.detalhes}`;
        finalResult.innerHTML = `Total: <strong>${info.total}</strong>`
            + (info.meta ? `<div class="dice-meta">${escapeHtml(info.meta)}</div>` : '');
    }
}

function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c =>
        ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

function coletarAtaques() {
    const ataques = [];

    document.querySelectorAll(".attack-row").forEach(row => {
        const ataque = {};

        row.querySelectorAll("[data-attack]").forEach(input => {
            ataque[input.dataset.attack] = input.value;
        });

        const temConteudo = Object.values(ataque).some(valor => String(valor).trim() !== "");

        if (temConteudo) {
            ataques.push(ataque);
        }
    });

    return ataques;
}

function adicionarEquipamento(equipamento = {}) {
    const container = document.getElementById("equipamentosContainer");

    if (!container) return;

    const row = document.createElement("div");
    row.className = "equipment-row";

    row.innerHTML = `
        <input
            type="text"
            data-equipment-field="nome"
            placeholder="Nome do item"
            autocomplete="off"
            value="${equipamento.nome ?? ""}"
        >

        <input
            type="number"
            data-equipment-field="quantidade"
            min="0"
            value="${equipamento.quantidade ?? 1}"
        >

        <input
            type="number"
            data-equipment-field="espacos"
            min="0"
            step="0.5"
            value="${equipamento.espacos ?? 0}"
        >

        <div class="equipment-total">0</div>

        <button type="button" class="remove-btn">×</button>
    `;

    const removeBtn = row.querySelector(".remove-btn");

    if (removeBtn) {
        removeBtn.addEventListener("click", () => {
            row.remove();
            atualizarCarga();
        });
    }

    row.querySelectorAll("[data-equipment-field]").forEach(input => {
        input.addEventListener("input", atualizarCarga);
    });

    const inputNome = row.querySelector('[data-equipment-field="nome"]');
    const inputEspacos = row.querySelector('[data-equipment-field="espacos"]');
    if (inputNome && inputEspacos) {
        configurarAutocompleteEquipamento(inputNome, inputEspacos);
    }

    container.appendChild(row);

    atualizarCarga();
}

let __catalogoEquipamentos = null;
let __catalogoEquipamentosPromise = null;

async function carregarCatalogoEquipamentos() {
    if (__catalogoEquipamentos) return __catalogoEquipamentos;
    if (__catalogoEquipamentosPromise) return __catalogoEquipamentosPromise;
    __catalogoEquipamentosPromise = fetch('equipamentos-catalogo.php')
        .then(r => r.json())
        .then(j => {
            __catalogoEquipamentos = (j && j.success) ? j.itens : [];
            return __catalogoEquipamentos;
        })
        .catch(err => {
            console.warn('Falha ao carregar catálogo de equipamentos:', err);
            __catalogoEquipamentos = [];
            return __catalogoEquipamentos;
        });
    return __catalogoEquipamentosPromise;
}

function normalizarBusca(s) {
    return String(s || "")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .trim();
}

function configurarAutocompleteEquipamento(inputNome, inputEspacos) {
    let dropdown = null;
    let tooltip = null;
    let tooltipTimer = null;
    let indiceAtivo = -1;
    let sugestoesAtuais = [];
    let bloqueado = false; // suprime o handler de input após escolher
    let itemSelecionado = null; // último item escolhido (pra tooltip no hover)

    function fecharTooltip() {
        clearTimeout(tooltipTimer);
        tooltipTimer = null;
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }

    function fechar() {
        fecharTooltip();
        if (dropdown) {
            dropdown.remove();
            dropdown = null;
        }
        indiceAtivo = -1;
        sugestoesAtuais = [];
    }

    function escolher(idx) {
        const item = sugestoesAtuais[idx];
        if (!item) return;
        bloqueado = true;
        inputNome.value = item.nome;
        inputEspacos.value = item.espacos;
        inputEspacos.dispatchEvent(new Event("input", { bubbles: true }));
        itemSelecionado = item;
        inputNome.dataset.itemEscolhido = '1';
        fechar();
        // libera o bloqueio em micro-tarefa pra próxima edição manual reabrir o dropdown
        setTimeout(() => { bloqueado = false; }, 0);
    }

    function destacar(idx) {
        if (!dropdown) return;
        const itens = dropdown.querySelectorAll(".equipamento-sugestao");
        itens.forEach((el, i) => el.classList.toggle("ativa", i === idx));
        indiceAtivo = idx;
    }

    function posicionar() {
        if (!dropdown) return;
        const rect = inputNome.getBoundingClientRect();
        dropdown.style.left = (rect.left + window.scrollX) + "px";
        dropdown.style.top = (rect.bottom + window.scrollY + 2) + "px";
        dropdown.style.minWidth = Math.max(rect.width, 240) + "px";
    }

    function abrirTooltip(item, ancora) {
        fecharTooltip();
        if (!item) return;

        tooltip = document.createElement("div");
        tooltip.className = "equipamento-tooltip";

        const camposHtml = Object.entries(item.campos || {})
            .map(([k, v]) => `<div class="tooltip-campo"><strong></strong><span></span></div>`)
            .join("");

        tooltip.innerHTML = `
            <div class="tooltip-header">
                <span class="tooltip-nome"></span>
                <span class="tooltip-espacos">${item.espacos} esp.</span>
            </div>
            ${camposHtml ? `<div class="tooltip-campos">${camposHtml}</div>` : ""}
            ${item.descricao ? `<p class="tooltip-descricao"></p>` : ""}
        `;

        // Preenche via textContent para escapar HTML
        tooltip.querySelector(".tooltip-nome").textContent = item.nome;
        const camposEls = tooltip.querySelectorAll(".tooltip-campo");
        Object.entries(item.campos || {}).forEach(([k, v], i) => {
            camposEls[i].querySelector("strong").textContent = k + ":";
            camposEls[i].querySelector("span").textContent = v;
        });
        if (item.descricao) {
            tooltip.querySelector(".tooltip-descricao").textContent = item.descricao;
        }

        document.body.appendChild(tooltip);

        // Posiciona ao lado direito da âncora; se não couber, abaixo.
        const rect = ancora.getBoundingClientRect();
        const ttRect = tooltip.getBoundingClientRect();
        const margem = 8;
        let left = rect.right + margem + window.scrollX;
        let top = rect.top + window.scrollY;
        if (left + ttRect.width > window.scrollX + document.documentElement.clientWidth - margem) {
            // Tenta à esquerda
            left = rect.left - ttRect.width - margem + window.scrollX;
            if (left < window.scrollX + margem) {
                // Sem espaço lateral: posiciona abaixo da âncora
                left = Math.max(margem, Math.min(rect.left, window.scrollX + document.documentElement.clientWidth - ttRect.width - margem)) + window.scrollX;
                top = rect.bottom + margem + window.scrollY;
            }
        }
        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";
    }

    function abrirTooltipComDelay(item, ancora, ms = 400) {
        clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(() => abrirTooltip(item, ancora), ms);
    }

    inputNome.addEventListener("input", async () => {
        if (bloqueado) return;
        // Edição manual após escolha invalida o item escolhido (tooltip vai sumir).
        if (inputNome.dataset.itemEscolhido === '1') {
            delete inputNome.dataset.itemEscolhido;
            itemSelecionado = null;
        }
        const valor = normalizarBusca(inputNome.value);
        if (valor.length < 2) { fechar(); return; }

        const itens = await carregarCatalogoEquipamentos();
        sugestoesAtuais = itens
            .filter(it => normalizarBusca(it.nome).includes(valor))
            .slice(0, 12);

        if (!sugestoesAtuais.length) { fechar(); return; }

        if (!dropdown) {
            dropdown = document.createElement("div");
            dropdown.className = "equipamento-sugestoes";
            document.body.appendChild(dropdown);
        }

        dropdown.innerHTML = sugestoesAtuais.map((it, i) => `
            <div class="equipamento-sugestao" data-idx="${i}">
                <span class="sugestao-nome"></span>
                <span class="sugestao-espacos">${it.espacos} esp.</span>
            </div>
        `).join("");

        dropdown.querySelectorAll(".equipamento-sugestao").forEach((el, i) => {
            el.querySelector(".sugestao-nome").textContent = sugestoesAtuais[i].nome;

            // Seleção via mouse (mousedown previne blur do input antes de processar).
            el.addEventListener("mousedown", e => {
                e.preventDefault();
                escolher(i);
            });

            // Hover desktop: destaca + tooltip com delay.
            el.addEventListener("mouseenter", () => {
                destacar(i);
                abrirTooltipComDelay(sugestoesAtuais[i], el);
            });
            el.addEventListener("mouseleave", () => {
                fecharTooltip();
            });

            // Touch: long-press abre tooltip; tap rápido seleciona via mousedown sintético.
            let pressTimer = null;
            let longPress = false;
            el.addEventListener("touchstart", () => {
                longPress = false;
                clearTimeout(pressTimer);
                pressTimer = setTimeout(() => {
                    longPress = true;
                    abrirTooltip(sugestoesAtuais[i], el);
                }, 500);
            }, { passive: true });
            el.addEventListener("touchmove", () => {
                clearTimeout(pressTimer);
            }, { passive: true });
            el.addEventListener("touchend", e => {
                clearTimeout(pressTimer);
                if (longPress) {
                    // Long press já abriu tooltip; impede o mousedown sintético de selecionar.
                    e.preventDefault();
                }
            });
            el.addEventListener("touchcancel", () => {
                clearTimeout(pressTimer);
            });
        });

        indiceAtivo = -1;
        posicionar();
    });

    inputNome.addEventListener("blur", () => {
        setTimeout(fechar, 150);
    });

    inputNome.addEventListener("keydown", e => {
        if (!dropdown || !sugestoesAtuais.length) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            destacar((indiceAtivo + 1) % sugestoesAtuais.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            destacar((indiceAtivo - 1 + sugestoesAtuais.length) % sugestoesAtuais.length);
        } else if (e.key === "Enter" && indiceAtivo >= 0) {
            e.preventDefault();
            escolher(indiceAtivo);
        } else if (e.key === "Escape") {
            fechar();
        }
    });

    window.addEventListener("scroll", posicionar, true);
    window.addEventListener("resize", posicionar);

    // Tooltip do item já preenchido: hover desktop / long-press mobile
    inputNome.addEventListener("mouseenter", () => {
        if (itemSelecionado && !dropdown) abrirTooltipComDelay(itemSelecionado, inputNome);
    });
    inputNome.addEventListener("mouseleave", fecharTooltip);
    let pressTimerInput = null;
    inputNome.addEventListener("touchstart", () => {
        clearTimeout(pressTimerInput);
        if (!itemSelecionado) return;
        pressTimerInput = setTimeout(() => abrirTooltip(itemSelecionado, inputNome), 500);
    }, { passive: true });
    inputNome.addEventListener("touchend", () => clearTimeout(pressTimerInput));
    inputNome.addEventListener("touchmove", () => clearTimeout(pressTimerInput), { passive: true });
}

function coletarEquipamentos() {
    const equipamentos = [];

    document.querySelectorAll(".equipment-row").forEach(row => {
        const nome = row.querySelector('[data-equipment-field="nome"]')?.value || "";
        const quantidade = Number(row.querySelector('[data-equipment-field="quantidade"]')?.value || 0);
        const espacos = Number(row.querySelector('[data-equipment-field="espacos"]')?.value || 0);

        const temConteudo = nome.trim() !== "" || quantidade > 0 || espacos > 0;

        if (temConteudo) {
            equipamentos.push({
                nome,
                quantidade,
                espacos
            });
        }
    });

    return equipamentos;
}

function calcularLimiteCarga() {
    const forca = Number(document.querySelector('[name="forca"]')?.value || 0);

    if (forca >= 0) {
        return 10 + (forca * 2);
    }

    return 10 + forca;
}

function atualizarCarga() {
    const linhas = document.querySelectorAll(".equipment-row");

    let totalEspacos = 0;

    linhas.forEach(row => {
        const quantidade = Number(row.querySelector('[data-equipment-field="quantidade"]')?.value || 0);
        const espacos = Number(row.querySelector('[data-equipment-field="espacos"]')?.value || 0);
        const totalLinha = quantidade * espacos;

        totalEspacos += totalLinha;

        const totalEl = row.querySelector(".equipment-total");

        if (totalEl) {
            totalEl.textContent = formatarNumeroCarga(totalLinha);
        }
    });

    const limite = Math.max(0, calcularLimiteCarga());
    const limiteMaximo = limite * 2;

    const espacosUsadosEl = document.getElementById("espacosUsados");
    const limiteCargaEl = document.getElementById("limiteCarga");
    const limiteMaximoEl = document.getElementById("limiteMaximoCarga");
    const estadoCargaEl = document.getElementById("estadoCarga");
    const cargaResumo = document.getElementById("cargaResumo");

    if (espacosUsadosEl) espacosUsadosEl.textContent = formatarNumeroCarga(totalEspacos);
    if (limiteCargaEl) limiteCargaEl.textContent = formatarNumeroCarga(limite);
    if (limiteMaximoEl) limiteMaximoEl.textContent = formatarNumeroCarga(limiteMaximo);

    if (cargaResumo) {
        cargaResumo.value = `${formatarNumeroCarga(totalEspacos)} / ${formatarNumeroCarga(limite)} espaços`;
    }

    // Traços de ancestralidade podem dar imunidade a sobrecarga
    // (ex: Muiraquitã > Minérios das Profundezas).
    const imuneSobrecarga = window.__personagemImuneSobrecarga === true;

    if (estadoCargaEl) {
        estadoCargaEl.classList.remove("normal", "overloaded", "impossible");

        if (totalEspacos <= limite) {
            estadoCargaEl.classList.add("normal");
            estadoCargaEl.textContent = "Carga normal.";
        } else if (totalEspacos <= limiteMaximo) {
            if (imuneSobrecarga) {
                estadoCargaEl.classList.add("normal");
                estadoCargaEl.textContent = "Carga normal (imune a sobrecarga por traço ancestral).";
            } else {
                estadoCargaEl.classList.add("overloaded");
                estadoCargaEl.textContent = "Sobrecarga: penalidade de armadura -5 e deslocamento -3m.";
            }
        } else {
            estadoCargaEl.classList.add("impossible");
            estadoCargaEl.textContent = "Carga impossível: ultrapassa o dobro do limite.";
        }
    }

    const sobrecarregadoEfetivo =
        !imuneSobrecarga && totalEspacos > limite && totalEspacos <= limiteMaximo;
    atualizarPenalidadeCargaNasPericias(sobrecarregadoEfetivo);
}

function atualizarPenalidadeCargaNasPericias(estaSobrecarregado) {
    const periciasAfetadas = ["Acrobacia", "Furtividade", "Ladinagem", "Atletismo"];
    const penalidade = estaSobrecarregado ? -5 : 0;

    periciasAfetadas.forEach(nome => {
        const campoOutros = document.querySelector(`[data-skill="${nome}"][data-field="outros"]`);

        if (!campoOutros) return;

        const valorManualOriginal = campoOutros.dataset.valorManualOriginal;

        if (estaSobrecarregado) {
            if (valorManualOriginal === undefined) {
                campoOutros.dataset.valorManualOriginal = campoOutros.value || "0";
            }

            const baseManual = Number(campoOutros.dataset.valorManualOriginal || 0);
            campoOutros.value = baseManual + penalidade;
        } else {
            if (valorManualOriginal !== undefined) {
                campoOutros.value = valorManualOriginal;
                delete campoOutros.dataset.valorManualOriginal;
            }
        }

        atualizarTotalDaPericia(nome);
    });
}

function formatarNumeroCarga(valor) {
    if (Number.isInteger(valor)) {
        return String(valor);
    }

    return valor.toFixed(1).replace(".", ",");
}

function coletarPericias() {
    const pericias = {};

    document.querySelectorAll("[data-skill]").forEach(input => {
        const nome = input.dataset.skill;
        const campo = input.dataset.field;

        if (!pericias[nome]) {
            pericias[nome] = {};
        }

        if (campo === "treinada") {
            pericias[nome][campo] = input.checked ? "1" : "0";
        } else if (campo === "outros") {
            // O input "outros" mostra ao usuário o total (base + bônus de
            // ancestralidade). Salvamos só a parte BASE do usuário pra que,
            // ao recarregar, o bônus seja somado de volta sem duplicar.
            const total = Number(input.value || 0);
            const bonusAnc = Number(input.dataset.bonusAncestralidade || 0);
            pericias[nome][campo] = String(total - bonusAnc);
        } else {
            pericias[nome][campo] = input.value;
        }
    });

    return pericias;
}

function initResourceBars() {
    syncResource("pv");
    syncResource("pm");
}

function adjustResource(resource, delta) {
    const totalInput = document.getElementById(`${resource}Total`);
    const currentInput = document.getElementById(`${resource}Atuais`);

    if (!totalInput || !currentInput) return;

    const total = Math.max(0, Number(totalInput.value || 0));
    let current = Math.max(0, Number(currentInput.value || 0));

    current += delta;

    if (current < 0) current = 0;
    if (current > total) current = total;

    currentInput.value = current;
    syncResource(resource);
}

function syncResource(resource) {
    const totalInput = document.getElementById(`${resource}Total`);
    const currentInput = document.getElementById(`${resource}Atuais`);
    const fill = document.getElementById(`${resource}Fill`);
    const label = document.getElementById(`${resource}Label`);

    if (!totalInput || !currentInput || !fill || !label) return;

    const total = Math.max(0, Number(totalInput.value || 0));
    let current = Math.max(0, Number(currentInput.value || 0));

    if (current > total) {
        current = total;
        currentInput.value = current;
    }

    const percent = total > 0 ? (current / total) * 100 : 0;

    fill.style.width = `${percent}%`;
    label.textContent = `${current} / ${total}`;
}

function setupCharacterImage() {
    const fileInput =
        document.getElementById("personagemImagemFile") ||
        document.getElementById("personagemImagemInput");

    const carregarBtn =
        document.getElementById("carregarImagemBtn") ||
        document.getElementById("btnCarregarImagem");

    const editarBtn =
        document.getElementById("editarImagemBtn") ||
        document.getElementById("btnEditarImagem");

    const removerBtn =
        document.getElementById("removerImagemBtn") ||
        document.getElementById("btnRemoverImagem");

    const characterCard =
        document.getElementById("characterCard") ||
        document.querySelector(".character-card");

    const previewBox =
        document.getElementById("characterPreviewBox") ||
        document.querySelector(".character-preview-box");

    const imageActions =
        document.getElementById("imageActions") ||
        document.querySelector(".image-actions");

    if (!fileInput || !previewBox || !characterCard) {
        return;
    }

    if (carregarBtn) {
        carregarBtn.addEventListener("click", event => {
            event.stopPropagation();
            fileInput.click();
        });
    }

    if (editarBtn) {
        editarBtn.addEventListener("click", event => {
            event.stopPropagation();
            fileInput.click();
        });
    }

    if (removerBtn) {
        removerBtn.addEventListener("click", event => {
            event.stopPropagation();
            removerImagemPersonagem();
        });
    }

    previewBox.addEventListener("click", event => {
        event.stopPropagation();
        characterCard.classList.toggle("active");
    });

    if (imageActions) {
        imageActions.addEventListener("click", event => {
            event.stopPropagation();
        });
    }

    document.addEventListener("click", event => {
        if (!characterCard.contains(event.target)) {
            characterCard.classList.remove("active");
        }
    });

    fileInput.addEventListener("change", event => {
        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = e => {
            setCharacterPreview(e.target.result);

            const removerInput = document.getElementById("removerPersonagemImagem");
            if (removerInput) {
                removerInput.value = "0";
            }

            characterCard.classList.add("active");
        };

        reader.readAsDataURL(file);
    });

    setCharacterPreview("");
}

function getCharacterPreviewElements() {
    const box =
        document.getElementById("characterPreviewBox") ||
        document.querySelector(".character-preview-box");

    const img =
        document.getElementById("personagemPreview") ||
        document.getElementById("characterPreview");

    return { box, img };
}

function setCharacterPreview(src) {
    const { box, img } = getCharacterPreviewElements();

    if (!box || !img) return;

    if (src) {
        img.src = src;
        box.classList.add("has-image");
    } else {
        img.removeAttribute("src");
        box.classList.remove("has-image");
    }
}

function removerImagemPersonagem() {
    const fileInput =
        document.getElementById("personagemImagemFile") ||
        document.getElementById("personagemImagemInput");

    if (fileInput) {
        fileInput.value = "";
    }

    const imagemAtual = document.getElementById("imagemAtual");
    const removerInput = document.getElementById("removerPersonagemImagem");

    if (imagemAtual) {
        imagemAtual.value = "";
    }

    if (removerInput) {
        removerInput.value = "1";
    }

    setCharacterPreview("");
}

async function configurarMagiasFicha() {
    const painel = document.getElementById("magiasFichaPanel");

    if (!painel) return;

    const recolherBtn = document.getElementById("magiasRecolherBtn");
    if (recolherBtn) {
        recolherBtn.addEventListener("click", () => {
            const recolhido = painel.classList.toggle("magias-panel-recolhido");
            recolherBtn.setAttribute("aria-expanded", String(!recolhido));
            recolherBtn.setAttribute("aria-label", recolhido ? "Expandir seção" : "Recolher seção");
        });
    }

    document.getElementById("magiasBuscaFicha")?.addEventListener("input", atualizarMagiasFicha);
    document.getElementById("magiasCirculoFicha")?.addEventListener("change", atualizarMagiasFicha);
    document.getElementById("magiaFichaModalFechar")?.addEventListener("click", fecharModalMagiaFicha);
    document.getElementById("magiaFichaModalEscolher")?.addEventListener("click", escolherMagiaModal);
    document.getElementById("magiaFichaModalRemover")?.addEventListener("click", removerMagiaModal);
    document.getElementById("magiaFichaModal")?.addEventListener("click", event => {
        if (event.target.id === "magiaFichaModal") {
            fecharModalMagiaFicha();
        }
    });

    const campo = document.getElementById("magiasSelecionadasJson");
    magiasSelecionadasFicha = normalizarMagiasSalvas(parseJsonSeguro(campo?.value, []));

    try {
        const response = await fetch("data/magias.json");
        const dados = await response.json();
        catalogoMagiasFicha = Array.isArray(dados.magias) ? dados.magias : [];
        preencherFiltroCirculosMagias();
    } catch (error) {
        console.error("Erro ao carregar magias.", error);
        catalogoMagiasFicha = [];
    }

    atualizarMagiasFicha();
}

function normalizarMagiasSalvas(valor) {
    if (!Array.isArray(valor)) return [];

    const vistas = new Set();
    const resultado = [];
    valor.forEach(item => {
        let id, origem;
        if (typeof item === "string") {
            id = item;
            origem = "classe";
        } else if (item && typeof item === "object") {
            id = item.id || item.nome || "";
            origem = item.origem === "ancestralidade" ? "ancestralidade" : "classe";
        } else {
            return;
        }
        if (!id) return;
        const chave = id + "|" + origem;
        if (vistas.has(chave)) return;
        vistas.add(chave);
        resultado.push({ id, origem });
    });
    return resultado;
}

function magiasIdsClasse() {
    return magiasSelecionadasFicha.filter(m => m.origem === "classe").map(m => m.id);
}

function magiasIdsAncestralidade() {
    return magiasSelecionadasFicha.filter(m => m.origem === "ancestralidade").map(m => m.id);
}

function temMagiaSelecionada(id, origem) {
    return magiasSelecionadasFicha.some(m => m.id === id && m.origem === origem);
}

function preencherFiltroCirculosMagias() {
    const select = document.getElementById("magiasCirculoFicha");

    if (!select) return;

    const valorAtual = select.value;
    const circulos = [...new Set(catalogoMagiasFicha.map(magia => Number(magia.circulo)).filter(Boolean))]
        .sort((a, b) => a - b);

    select.innerHTML = '<option value="">Todos os circulos</option>';
    circulos.forEach(circulo => {
        const option = document.createElement("option");
        option.value = String(circulo);
        option.textContent = `${circulo} circulo`;
        select.appendChild(option);
    });

    select.value = valorAtual;
}

function getConfigMagiasAtual() {
    const classeCampo = document.getElementById("classeSelect") || document.querySelector('[name="classe"]');
    const chave = chaveClasseSelecionada(classeCampo);

    return magiasClasseConfig[chave] || null;
}

function getCirculoMaximoMagias(config, nivel) {
    if (!config) return 0;

    return Object.entries(config.circulos)
        .reduce((maximo, [nivelMinimo, circulo]) => {
            return nivel >= Number(nivelMinimo) ? Math.max(maximo, Number(circulo)) : maximo;
        }, 0);
}

function contarMagiasConhecidas(config, nivel) {
    if (!config || nivel < 1) return 0;

    let total = config.magiasIniciais || 0;

    if (config.ganho === "todo_nivel") {
        total += Math.max(0, nivel - 1);
    }

    if (config.ganho === "nivel_par") {
        total += Math.floor(nivel / 2);
    }

    if (config.ganho === "nivel_impar") {
        total += Math.max(0, Math.floor((nivel - 1) / 2));
    }

    if (config.extraAoLiberarCirculo) {
        total += Object.keys(config.circulos)
            .map(Number)
            .filter(nivelMinimo => nivelMinimo > 1 && nivel >= nivelMinimo)
            .length;
    }

    return total;
}

function getMagiasPermitidas() {
    const config = getConfigMagiasAtual();
    const nivel = Math.max(1, Number(document.querySelector('[name="nivel"]')?.value || 1));
    const circuloMaximo = getCirculoMaximoMagias(config, nivel);

    if (!config || !circuloMaximo) {
        return { config, nivel, circuloMaximo, limite: 0, magias: [] };
    }

    const magias = catalogoMagiasFicha.filter(magia => {
        const tipoOk = config.tipos.includes(magia.tipo);
        const circuloOk = Number(magia.circulo || 0) <= circuloMaximo;
        return tipoOk && circuloOk;
    });

    return {
        config,
        nivel,
        circuloMaximo,
        limite: contarMagiasConhecidas(config, nivel),
        magias
    };
}

function atualizarMagiasFicha() {
    const painel = document.getElementById("magiasFichaPanel");
    if (!painel) return;

    const resumo = document.getElementById("magiasResumoFicha");
    const contador = document.getElementById("magiasContador");
    const listaSelecionadas = document.getElementById("magiasSelecionadasLista");
    const listaDisponiveis = document.getElementById("magiasDisponiveisLista");
    const busca = normalizarBuscaMagia(document.getElementById("magiasBuscaFicha")?.value || "");
    const circuloFiltro = document.getElementById("magiasCirculoFicha")?.value || "";
    const estado = getMagiasPermitidas();
    if (catalogoMagiasFicha.length) {
        const idsPermitidos = new Set(estado.magias.map(magia => magia.id));
        // Filtra apenas magias de classe (mantém as de ancestralidade intactas).
        magiasSelecionadasFicha = magiasSelecionadasFicha.filter(m =>
            m.origem !== "classe" || idsPermitidos.has(m.id)
        );
        sincronizarMagiasSelecionadas();
    }

    const totalClasse = magiasIdsClasse().length;
    if (contador) {
        contador.textContent = `${totalClasse} / ${estado.limite}`;
    }

    if (resumo) {
        if (!estado.config) {
            resumo.textContent = "Selecione uma classe conjuradora para ver as magias disponiveis.";
        } else {
            const tiposLabel = estado.config.tiposLabel || estado.config.tipos.join(" ou ").toLowerCase() + "s";
            resumo.textContent = `${estado.config.nome}: magias ${tiposLabel} até ${estado.circuloMaximo}º círculo. Limite atual: ${estado.limite} magia(s) conhecida(s).`;
        }
    }

    renderizarMagiasSelecionadas(listaSelecionadas, estado);
    renderizarMagiasDisponiveis(listaDisponiveis, estado, busca, circuloFiltro);
}

function normalizarBuscaMagia(valor) {
    return String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function renderizarMagiasSelecionadas(container, estado) {
    if (!container) return;

    container.innerHTML = "";

    if (!magiasSelecionadasFicha.length) {
        const vazio = document.createElement("p");
        vazio.className = "magias-vazio";
        vazio.textContent = estado.config ? "Nenhuma magia escolhida ainda." : "Sem lista de magias para esta classe.";
        container.appendChild(vazio);
        return;
    }

    magiasSelecionadasFicha.forEach(entrada => {
        const magia = catalogoMagiasFicha.find(item => item.id === entrada.id);
        if (!magia) return;

        const button = document.createElement("button");
        button.type = "button";
        const classeOrigem = entrada.origem === "ancestralidade"
            ? "magia-tag-ancestralidade"
            : "magia-tag-selecionada";
        button.className = `pindorama-tag ${classeOrigem}`;
        button.textContent = `${magia.nome} (${magia.circulo}º)`;
        button.addEventListener("click", () => abrirModalMagiaFicha(magia, entrada.origem));
        container.appendChild(button);
    });
}

function renderizarMagiasDisponiveis(container, estado, busca, circuloFiltro) {
    if (!container) return;

    container.innerHTML = "";

    if (!estado.config) {
        const vazio = document.createElement("p");
        vazio.className = "magias-vazio";
        vazio.textContent = "Escolha uma classe conjuradora primeiro.";
        container.appendChild(vazio);
        return;
    }

    const filtradas = estado.magias.filter(magia => {
        const texto = normalizarBuscaMagia(`${magia.nome} ${magia.escola} ${magia.descricao}`);
        const buscaOk = !busca || texto.includes(busca);
        const circuloOk = !circuloFiltro || String(magia.circulo) === circuloFiltro;
        return buscaOk && circuloOk;
    });

    if (!filtradas.length) {
        const vazio = document.createElement("p");
        vazio.className = "magias-vazio";
        vazio.textContent = "Nenhuma magia encontrada com estes filtros.";
        container.appendChild(vazio);
        return;
    }

    const porCirculo = filtradas.reduce((grupos, magia) => {
        const chave = String(magia.circulo || 0);
        grupos[chave] = grupos[chave] || [];
        grupos[chave].push(magia);
        return grupos;
    }, {});

    Object.keys(porCirculo).sort((a, b) => Number(a) - Number(b)).forEach(circulo => {
        const grupo = document.createElement("div");
        grupo.className = "magias-circulo-grupo";

        const titulo = document.createElement("h4");
        titulo.textContent = `${circulo} circulo`;
        grupo.appendChild(titulo);

        const cards = document.createElement("div");
        cards.className = "magias-cards";

        porCirculo[circulo]
            .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
            .forEach(magia => {
                const escolhida = temMagiaSelecionada(magia.id, "classe");
                const card = document.createElement("button");
                card.type = "button";
                card.className = `magia-card${escolhida ? " magia-card-escolhida" : ""}`;
                card.innerHTML = `
                    <strong>${escaparHtml(magia.nome)}</strong>
                    <span>${escaparHtml(magia.tipo)} - ${escaparHtml(magia.escola || "")}</span>
                `;
                card.addEventListener("click", () => abrirModalMagiaFicha(magia, "classe"));
                cards.appendChild(card);
            });

        grupo.appendChild(cards);
        container.appendChild(grupo);
    });
}

function escaparHtml(valor) {
    const div = document.createElement("div");
    div.textContent = String(valor ?? "");
    return div.innerHTML;
}

function acharTracoQueConcede(idMagia) {
    if (!window.AncestralidadesPindorama || typeof window.AncestralidadesPindorama.getAncestralidadeAtual !== "function") {
        return null;
    }
    const ancestralidade = window.AncestralidadesPindorama.getAncestralidadeAtual();
    if (!ancestralidade) return null;

    const magia = catalogoMagiasFicha.find(m => m.id === idMagia);

    for (const traco of (ancestralidade.tracos || [])) {
        const cm = traco.concede_magias;
        if (!cm) continue;

        // Lista fixa de opções
        if (Array.isArray(cm.opcoes) && cm.opcoes.includes(idMagia)) {
            return { traco, ancestralidade };
        }

        // Filtro dinâmico (e.g., qualquer divina de 1º círculo)
        if (cm.filtro && magia) {
            const f = cm.filtro;
            const matchTipo = !f.tipo || magia.tipo === f.tipo;
            const matchCirc = f.circulo == null || Number(magia.circulo) === Number(f.circulo);
            const matchEscola = !f.escola || (magia.escola || '') === f.escola;
            if (matchTipo && matchCirc && matchEscola) {
                return { traco, ancestralidade };
            }
        }
    }
    return null;
}

function renderizarBlocoTracoAncestralOrigem(idMagia) {
    const dados = acharTracoQueConcede(idMagia);
    if (!dados) return "";
    const { traco, ancestralidade } = dados;
    const cm = traco.concede_magias || {};

    const linhas = [];
    if (cm.atributo_chave) {
        linhas.push(`<p><strong>Atributo-chave:</strong> ${escaparHtml(cm.atributo_chave)}</p>`);
    }
    if (cm.regra_extra) {
        linhas.push(`<p class="magia-modal-regra-extra">${escaparHtml(cm.regra_extra)}</p>`);
    }

    return `
        <div class="magia-modal-origem-ancestral">
            <div class="magia-modal-origem-titulo">
                Adquirida por traço ancestral
                <span class="magia-modal-origem-tag">${escaparHtml(traco.nome)}</span>
            </div>
            <div class="magia-modal-origem-sub">${escaparHtml(ancestralidade.nome)}</div>
            ${linhas.join("")}
        </div>
    `;
}

function abrirModalMagiaFicha(magia, origem = "classe") {
    magiaModalAtual = { magia, origem };

    const modal = document.getElementById("magiaFichaModal");
    const titulo = document.getElementById("magiaFichaModalTitulo");
    const body = document.getElementById("magiaFichaModalBody");
    const escolher = document.getElementById("magiaFichaModalEscolher");
    const remover = document.getElementById("magiaFichaModalRemover");
    const estado = getMagiasPermitidas();
    const escolhida = temMagiaSelecionada(magia.id, origem);
    const totalNaOrigem = origem === "classe" ? magiasIdsClasse().length : magiasIdsAncestralidade().length;
    const limiteOrigem = origem === "classe" ? estado.limite : Infinity;
    const limiteAtingido = totalNaOrigem >= limiteOrigem;

    if (titulo) titulo.textContent = magia.nome;
    if (body) {
        const blocoAncestral = origem === "ancestralidade"
            ? renderizarBlocoTracoAncestralOrigem(magia.id)
            : "";
        body.innerHTML = `
            ${blocoAncestral}
            <div class="magia-modal-meta">
                <span>${escaparHtml(magia.tipo)}</span>
                <span>${Number(magia.circulo || 0)} circulo</span>
                <span>${escaparHtml(magia.escola || "")}</span>
            </div>
            <div class="magia-modal-caracteristicas">
                ${linhaMagiaModal("Execucao", magia.execucao)}
                ${linhaMagiaModal("Alcance", magia.alcance)}
                ${linhaMagiaModal(magia.efeito_tipo || "Efeito", magia.efeito)}
                ${linhaMagiaModal("Duracao", magia.duracao)}
                ${linhaMagiaModal("Resistencia", magia.resistencia)}
            </div>
            <p class="poder-modal-descricao">${escaparHtml(magia.descricao || "").replace(/\n/g, "<br>")}</p>
            ${renderizarAprimoramentosMagia(magia)}
        `;
    }

    if (escolher) {
        escolher.hidden = escolhida;
        escolher.disabled = !escolhida && limiteAtingido;
        escolher.textContent = limiteAtingido ? "Limite atingido" : "Escolher magia";
    }

    if (remover) {
        remover.hidden = !escolhida;
    }

    if (modal) {
        modal.hidden = false;
    }
}

function linhaMagiaModal(rotulo, valor) {
    if (!valor) return "";
    return `<p><strong>${escaparHtml(rotulo)}:</strong> ${escaparHtml(valor)}</p>`;
}

function renderizarAprimoramentosMagia(magia) {
    if (!Array.isArray(magia.aprimoramentos) || !magia.aprimoramentos.length) return "";

    return `
        <div class="magia-modal-aprimoramentos">
            <strong>Aprimoramentos</strong>
            <ul>
                ${magia.aprimoramentos.map(item => `<li>${escaparHtml(item)}</li>`).join("")}
            </ul>
        </div>
    `;
}

function escolherMagiaModal() {
    if (!magiaModalAtual) return;
    const { magia, origem } = magiaModalAtual;

    if (!temMagiaSelecionada(magia.id, origem)) {
        if (origem === "classe") {
            const estado = getMagiasPermitidas();
            if (magiasIdsClasse().length >= estado.limite) return;
        }
        magiasSelecionadasFicha.push({ id: magia.id, origem });
    }

    fecharModalMagiaFicha();
    atualizarMagiasFicha();
    if (window.AncestralidadesPindorama) window.AncestralidadesPindorama.atualizarPainel();
}

function removerMagiaModal() {
    if (!magiaModalAtual) return;
    const { magia, origem } = magiaModalAtual;

    magiasSelecionadasFicha = magiasSelecionadasFicha.filter(m =>
        !(m.id === magia.id && m.origem === origem)
    );
    fecharModalMagiaFicha();
    atualizarMagiasFicha();
    if (window.AncestralidadesPindorama) window.AncestralidadesPindorama.atualizarPainel();
}

function fecharModalMagiaFicha() {
    const modal = document.getElementById("magiaFichaModal");
    if (modal) modal.hidden = true;
    magiaModalAtual = null;
}

function sincronizarMagiasSelecionadas() {
    const campo = document.getElementById("magiasSelecionadasJson");
    if (campo) {
        campo.value = JSON.stringify(magiasSelecionadasFicha);
    }
}

// Permite que outros módulos (ancestralidades-ficha.js) atualizem o painel
// de magias após adicionarem/removerem entradas direto no hidden input.
window.PindoramaAtualizarMagias = function () {
    const campo = document.getElementById("magiasSelecionadasJson");
    if (campo) {
        magiasSelecionadasFicha = normalizarMagiasSalvas(parseJsonSeguro(campo.value, []));
    }
    if (typeof atualizarMagiasFicha === "function") atualizarMagiasFicha();
};

async function salvarFicha(event) {
    event.preventDefault();

    const form = document.getElementById("fichaForm");

    if (!form) return;

    try {
        atualizarTudoAutomatico();
        sincronizarMagiasSelecionadas();

        const formData = new FormData(form);

        // Subtrai bônus de ancestralidade dos atributos antes de salvar.
        // Ao recarregar, o bônus é re-aplicado por sincronizarBonusAtributos.
        ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'].forEach(nome => {
            const inp = form.querySelector(`[name="${nome}"]`);
            if (!inp) return;
            const bonusAnc = Number(inp.dataset.bonusAncestralidade || 0);
            if (bonusAnc) {
                const total = Number(inp.value || 0);
                formData.set(nome, String(total - bonusAnc));
            }
        });

        // Mesma lógica para defesa_outros (ex: Reptiliano soma Con).
        const defOutrosInp = form.querySelector('[name="defesa_outros"]');
        if (defOutrosInp) {
            const bonusAnc = Number(defOutrosInp.dataset.bonusAncestralidade || 0);
            if (bonusAnc) {
                const total = Number(defOutrosInp.value || 0);
                formData.set('defesa_outros', String(total - bonusAnc));
            }
        }

        formData.set("ataques", JSON.stringify(coletarAtaques()));
        formData.set("pericias", JSON.stringify(coletarPericias()));
        formData.set("equipamentos", JSON.stringify(coletarEquipamentos()));

        const response = await fetch(form.action || "salvar-ficha.php", {
            method: form.method || "POST",
            body: formData
        });

        const responseText = await response.text();
        let result;

        try {
            result = JSON.parse(responseText);
        } catch (error) {
            throw new Error(responseText.trim() || "Resposta invalida do servidor.");
        }

        if (!response.ok || !result.success) {
            throw new Error(result.error || result.message || "Erro ao salvar ficha.");
        }

        const fichaId = document.getElementById("fichaId");
        if (fichaId) {
            fichaId.value = result.id;
        }

        if (result.personagem_imagem) {
            const imagemAtual = document.getElementById("imagemAtual");
            const removerInput = document.getElementById("removerPersonagemImagem");

            if (imagemAtual) {
                imagemAtual.value = result.personagem_imagem;
            }

            if (removerInput) {
                removerInput.value = "0";
            }

            const fileInput =
                document.getElementById("personagemImagemFile") ||
                document.getElementById("personagemImagemInput");

            if (fileInput) {
                fileInput.value = "";
            }

            setCharacterPreview(result.personagem_imagem);
        } else {
            const imagemAtual = document.getElementById("imagemAtual");

            if (imagemAtual) {
                imagemAtual.value = "";
            }

            setCharacterPreview("");
        }

        alert("Ficha salva com sucesso!");
        listarFichas();
    } catch (error) {
        alert("Erro ao salvar ficha.\n\nDetalhe: " + error.message);
        console.error(error);
    }
}

async function listarFichas() {
    const select = document.getElementById("fichasSalvas");

    if (!select) return;

    try {
        const response = await fetch("listar-fichas.php");
        const fichas = await response.json();

        if (!Array.isArray(fichas)) {
            throw new Error(fichas.error || fichas.message || "Resposta invalida ao listar fichas.");
        }

        select.innerHTML = `<option value="">Selecione uma ficha</option>`;

        fichas.forEach(ficha => {
            const option = document.createElement("option");
            option.value = ficha.id;
        option.textContent = `${ficha.personagem || "Sem personagem"} — ${ficha.participante || "Sem participante"}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

async function carregarFichaSelecionada() {
    const select = document.getElementById("fichasSalvas");
    const id = select?.value;

    if (!id) {
        alert("Selecione uma ficha para carregar.");
        return;
    }

    const response = await fetch(`buscar-ficha.php?id=${id}`);
    const result = await response.json();

    if (!result.success) {
        alert(result.message || "Erro ao carregar ficha.");
        return;
    }

    preencherFicha(result.ficha);
}

function preencherFicha(ficha) {
    const form = document.getElementById("fichaForm");

    Object.keys(ficha).forEach(key => {
        const field = form.querySelector(`[name="${key}"]`);

        if (field && !["ataques", "pericias", "personagem_imagem", "equipamentos"].includes(key)) {
            if (key === "classe" || key === "origem" || key === "ancestralidade" || key === "divindade") {
                selecionarOpcaoPorChave(field, ficha[key] ?? "");
            } else {
                field.value = ficha[key] ?? "";
            }
        }
    });

    if (Array.isArray(ficha.classes) && ficha.classes.length) {
        const classeCampo = document.getElementById("classeSelect") || form.querySelector('[name="classe"]');
        selecionarOpcaoPorChave(classeCampo, ficha.classes[0].id || ficha.classes[0].classe_id || ficha.classe || "");
    }

    const ataques = parseJsonSeguro(ficha.ataques, []);
    const pericias = parseJsonSeguro(ficha.pericias, null);
    const equipamentos = parseJsonSeguro(ficha.equipamentos, []);
    magiasSelecionadasFicha = normalizarMagiasSalvas(parseJsonSeguro(ficha.habilidades_magias, []));
    sincronizarMagiasSelecionadas();

    const ataquesContainer = document.getElementById("ataquesContainer");

    if (ataquesContainer) {
        ataquesContainer.innerHTML = "";
    }

    if (ataques.length) {
        ataques.forEach(ataque => adicionarAtaque(ataque));
    } else {
        adicionarAtaque();
    }

    const equipamentosContainer = document.getElementById("equipamentosContainer");

    if (equipamentosContainer) {
        equipamentosContainer.innerHTML = "";
    }

    if (equipamentos.length) {
        equipamentos.forEach(equipamento => adicionarEquipamento(equipamento));
    } else {
        adicionarEquipamento();
    }

    montarPericias(pericias);

    const imagemAtual = document.getElementById("imagemAtual");
    const removerInput = document.getElementById("removerPersonagemImagem");

    if (imagemAtual) {
        imagemAtual.value = ficha.personagem_imagem ?? "";
    }

    if (removerInput) {
        removerInput.value = "0";
    }

    const fileInput =
        document.getElementById("personagemImagemFile") ||
        document.getElementById("personagemImagemInput");

    if (fileInput) {
        fileInput.value = "";
    }

    if (ficha.personagem_imagem) {
        setCharacterPreview(ficha.personagem_imagem);
    } else {
        setCharacterPreview("");
    }

    syncResource("pv");
    syncResource("pm");
    atualizarMagiasFicha();
    atualizarTudoAutomatico();

    if (window.PoderesPindorama) {
        window.PoderesPindorama.aplicarPoderesDeFicha(ficha);
    }

    if (window.OrigensPindorama) {
        window.OrigensPindorama.aplicarOrigemDeFicha(ficha);
    }

    if (window.AncestralidadesPindorama) {
        window.AncestralidadesPindorama.atualizarPainel();
    }

    if (window.DivindadesPindorama && ficha.divindade) {
        window.DivindadesPindorama.carregarDivindade(ficha.divindade);
    }

    if (Array.isArray(ficha.classes) && ficha.classes.length) {
        const classeCampo = document.getElementById("classeSelect") || form.querySelector('[name="classe"]');
        selecionarOpcaoPorChave(classeCampo, ficha.classes[0].id || ficha.classes[0].classe_id || ficha.classe || "");
        atualizarResumoClasse();
        atualizarRecursosPorClasse();
        aplicarProficienciasDaClasse();
    }
}

function parseJsonSeguro(valor, fallback) {
    try {
        if (!valor) return fallback;
        return typeof valor === "string" ? JSON.parse(valor) : valor;
    } catch {
        return fallback;
    }
}

function novaFicha() {
    const form = document.getElementById("fichaForm");

    if (form) {
        form.reset();
    }

    const fichaId = document.getElementById("fichaId");
    const imagemAtual = document.getElementById("imagemAtual");
    const removerInput = document.getElementById("removerPersonagemImagem");

    if (fichaId) {
        fichaId.value = "";
    }

    if (imagemAtual) {
        imagemAtual.value = "";
    }

    if (removerInput) {
        removerInput.value = "0";
    }

    const fileInput =
        document.getElementById("personagemImagemFile") ||
        document.getElementById("personagemImagemInput");

    if (fileInput) {
        fileInput.value = "";
    }

    const ataquesContainer = document.getElementById("ataquesContainer");

    if (ataquesContainer) {
        ataquesContainer.innerHTML = "";
    }

    const equipamentosContainer = document.getElementById("equipamentosContainer");

    if (equipamentosContainer) {
        equipamentosContainer.innerHTML = "";
    }

    adicionarAtaque();
    adicionarEquipamento();
    montarPericias();
    magiasSelecionadasFicha = [];
    sincronizarMagiasSelecionadas();
    setCharacterPreview("");
    syncResource("pv");
    syncResource("pm");
    atualizarMagiasFicha();
    atualizarTudoAutomatico();

    if (window.PoderesPindorama) {
        window.PoderesPindorama.aplicarPoderesDeFicha({ poderes: [], pp_atuais: 0 });
    }

    if (window.OrigensPindorama) {
        window.OrigensPindorama.aplicarOrigemDeFicha({ origem: '', origem_beneficios: '[]' });
    }

    if (window.AncestralidadesPindorama) {
        window.AncestralidadesPindorama.atualizarPainel();
    }

    const characterCard =
        document.getElementById("characterCard") ||
        document.querySelector(".character-card");

    if (characterCard) {
        characterCard.classList.remove("active");
    }
}
function exportarFichaPDF() {
    atualizarTudoAutomatico();

    const characterCard =
        document.getElementById("characterCard") ||
        document.querySelector(".character-card");

    if (characterCard) {
        characterCard.classList.remove("active");
    }

    const personagem = document.querySelector('[name="personagem"]')?.value || "Ficha Pindorama";
    const participante = document.querySelector('[name="participante"]')?.value || "";

    const tituloOriginal = document.title;

    document.title = participante
        ? `${personagem} - ${participante} - Pindorama RPG`
        : `${personagem} - Pindorama RPG`;

    document.body.classList.add("print-ficha-mode");

    setTimeout(() => {
        window.print();

        setTimeout(() => {
            document.body.classList.remove("print-ficha-mode");
            document.title = tituloOriginal;
        }, 500);
    }, 150);
}
function aplicarProficienciasDaClasse() {
    const textarea = document.getElementById("proficiencias");
    if (!textarea) return;

    const classe = getClasseSelecionada();
    if (!classe) return;

    textarea.value = classe.proficiencias;
}

function configurarClasseDinamica() {
    const classeSelect = document.getElementById("classeSelect");

    if (!classeSelect) return;

    classeSelect.addEventListener("change", function () {
        atualizarResumoClasse();
        atualizarRecursosPorClasse();
        aplicarPericiasBaseDaClasse();
        aplicarProficienciasDaClasse();
        atualizarMagiasFicha();
    });

    atualizarResumoClasse();
    atualizarRecursosPorClasse();
    aplicarProficienciasDaClasse();
}

function getClasseSelecionada() {
    const classeCampo =
        document.getElementById("classeSelect") ||
        document.querySelector('[name="classe"]');

    return getDadosClassePorCampo(classeCampo);
}

function atualizarResumoClasse() {
    const classeCampo =
        document.getElementById("classeSelect") ||
        document.querySelector('[name="classe"]');

    const summaryBox = document.getElementById("classSummaryBox");
    const classPageLink = document.getElementById("classPageLink");

    if (!classeCampo || !summaryBox) return;

    const nomeClasse = getNomeClassePorCampo(classeCampo);
    const classe = getDadosClassePorCampo(classeCampo);

    if (!classe) {
        summaryBox.innerHTML = `<span>Selecione uma classe para ver PV, PM, atributo-chave e perícias.</span>`;

        if (classPageLink) {
            classPageLink.hidden = true;
            classPageLink.removeAttribute("href");
        }

        return;
    }

    summaryBox.innerHTML = `
        <strong>${nomeClasse}</strong><br>
        ${classe.descricao}<br>
        <strong>Atributo-chave:</strong> ${classe.atributo}<br>
        <strong>PV:</strong> ${classe.pvInicial} + Constituição no 1º nível; depois ${classe.pvPorNivel} + Constituição por nível.<br>
        <strong>PM:</strong> ${classe.pmPorNivel} por nível.<br>
        <strong>Perícias:</strong> ${classe.pericias}
    `;

    if (classPageLink) {
        classPageLink.hidden = false;
        classPageLink.href = classe.slug;
    }
}

function atualizarRecursosPorClasse() {
    const classe = getClasseSelecionada();

    if (!classe) {
        syncResource("pv");
        syncResource("pm");
        return;
    }

    const nivel = Math.max(1, Number(document.querySelector('[name="nivel"]')?.value || 1));
    const constituicao = Number(document.querySelector('[name="constituicao"]')?.value || 0);

    const pvPrimeiroNivel = Math.max(1, classe.pvInicial + constituicao);
    const pvNiveisExtras = Math.max(0, nivel - 1) * Math.max(1, classe.pvPorNivel + constituicao);
    const pvTotalCalculado = pvPrimeiroNivel + pvNiveisExtras;

    const pmTotalCalculado = Math.max(0, classe.pmPorNivel * nivel);

    aplicarTotalRecursoAutomatico("pv", pvTotalCalculado);
    aplicarTotalRecursoAutomatico("pm", pmTotalCalculado);

    syncResource("pv");
    syncResource("pm");
}

function aplicarTotalRecursoAutomatico(resource, novoTotal) {
    const totalInput = document.getElementById(`${resource}Total`);
    const currentInput = document.getElementById(`${resource}Atuais`);

    if (!totalInput || !currentInput) return;

    const totalAnteriorAutomatico = Number(totalInput.dataset.autoTotal || 0);
    const valorAtual = Number(currentInput.value || 0);

    totalInput.value = novoTotal;

    const deveAtualizarAtual =
        currentInput.value === "" ||
        totalAnteriorAutomatico === 0 ||
        valorAtual === totalAnteriorAutomatico ||
        valorAtual > novoTotal;

    if (deveAtualizarAtual) {
        currentInput.value = novoTotal;
    }

    totalInput.dataset.autoTotal = String(novoTotal);
}

function aplicarPericiasBaseDaClasse() {
    const classeCampo = document.getElementById("classeSelect");
    const nomeClasse = getNomeClassePorCampo(classeCampo);

    const periciasObrigatoriasPorClasse = {
        "Arcanista": ["Misticismo", "Vontade"],
        "Artífice": ["Ofício 1", "Vontade"],
        "Brincante": ["Atuação", "Reflexos"],
        "Caçador": ["Sobrevivência"],
        "Cangaceiro": ["Reflexos"],
        "Fanfarrão": ["Reflexos"],
        "Feiticeiro": ["Misticismo", "Vontade"],
        "Guerreiro": ["Fortitude"],
        "Lutador": ["Fortitude", "Luta"],
        "Malandro": ["Ladinagem", "Reflexos"],
        "Rústico": ["Fortitude", "Luta"],
        "Sacerdote": ["Religião", "Vontade"],
        "Inquisidor": ["Luta", "Vontade"],
        "Xamã": ["Sobrevivência", "Vontade"]
    };

    const pericias = periciasObrigatoriasPorClasse[nomeClasse] || [];

    pericias.forEach(nomePericia => {
        const checkbox = document.querySelector(`[data-skill="${nomePericia}"][data-field="treinada"]`);

        if (checkbox) {
            checkbox.checked = true;
        }
    });

    atualizarPericiasPorAtributos();
}
