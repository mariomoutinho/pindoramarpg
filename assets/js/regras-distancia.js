/* =====================================================================
   Pindorama RPG — Helpers de distância e movimentação
   ---------------------------------------------------------------------
   Utilitários puros (sem efeitos colaterais, sem DOM) para uso em
   ataques, áreas, alcances e cálculo de movimento na Mesa de Jogo.

   Escala canônica do sistema:
       1 quadrado = 1,5 m
       diagonal  = 2 quadrados (3 m)        ortogonal = 1 quadrado
       terreno difícil = custo dobrado
       diagonal em terreno difícil = 2 × 2 = 4 quadrados (6 m)

   Alcances (capítulo "Jogando"):
       Toque   — alvo adjacente / em contato (0 quadrado)
       Curto   — até 9 m  (6 quadrados)
       Médio   — até 30 m (20 quadrados)
       Longo   — até 90 m (60 quadrados)
       Ilimitado — sem limite prático (ver narrador)

   API exposta em `window.PindoramaRegras` para compatibilidade com o
   estilo procedural/JS-vanilla do projeto.
   ===================================================================== */
(function (global) {
    'use strict';

    var QUADRADO_METROS = 1.5;

    var ALCANCES_QUADRADOS = Object.freeze({
        toque: 0,
        curto: 6,
        medio: 20,
        longo: 60
    });

    var ALCANCES_METROS = Object.freeze({
        toque: 0,
        curto: 9,
        medio: 30,
        longo: 90
    });

    function metrosParaQuadrados(metros) {
        var n = Number(metros);
        if (!isFinite(n) || n <= 0) return 0;
        return Math.ceil(n / QUADRADO_METROS);
    }

    function quadradosParaMetros(quadrados) {
        var n = Number(quadrados);
        if (!isFinite(n) || n <= 0) return 0;
        return n * QUADRADO_METROS;
    }

    /* Recebe um nome de alcance ("toque" | "curto" | "medio" | "longo" |
       "ilimitado") e devolve um objeto { quadrados, metros, rotulo }.
       Para "ilimitado" devolve Infinity nas medidas. */
    function alcance(nome) {
        var key = String(nome || '').toLowerCase().trim();
        if (key === 'ilimitado' || key === 'infinito') {
            return { quadrados: Infinity, metros: Infinity, rotulo: 'Ilimitado' };
        }
        if (Object.prototype.hasOwnProperty.call(ALCANCES_QUADRADOS, key)) {
            var q = ALCANCES_QUADRADOS[key];
            var m = ALCANCES_METROS[key];
            return {
                quadrados: q,
                metros: m,
                rotulo: key.charAt(0).toUpperCase() + key.slice(1)
            };
        }
        return null;
    }

    /* "9 m (6 quadrados)" — útil para tooltips/legendas. */
    function formatarAlcance(quadrados) {
        var q = Math.max(0, Math.round(Number(quadrados) || 0));
        if (!isFinite(q)) return 'Ilimitado';
        var metros = quadradosParaMetros(q);
        var metrosTxt = (metros % 1 === 0) ? String(metros) : metros.toFixed(1).replace('.', ',');
        var unidadeQ = q === 1 ? 'quadrado' : 'quadrados';
        return metrosTxt + ' m (' + q + ' ' + unidadeQ + ')';
    }

    /* Calcula custo de movimento em quadrados a partir de um caminho.
       Aceita um objeto descritivo:
           {
               ortogonais: 4,           // passos ortogonais em terreno normal
               diagonais: 2,            // passos diagonais em terreno normal
               ortogonaisDificeis: 1,   // ortogonais em terreno difícil
               diagonaisDificeis: 0     // diagonais em terreno difícil
           }
       Retorna { quadrados, metros }. */
    function custoMovimento(passos) {
        var p = passos || {};
        var orto  = Math.max(0, Number(p.ortogonais) || 0);
        var diag  = Math.max(0, Number(p.diagonais)  || 0);
        var ortoD = Math.max(0, Number(p.ortogonaisDificeis) || 0);
        var diagD = Math.max(0, Number(p.diagonaisDificeis)  || 0);

        // Ortogonal normal: 1 quadrado. Diagonal normal: 2.
        // Terreno difícil dobra o custo: ortog 2, diag 4.
        var quadrados = orto + (diag * 2) + (ortoD * 2) + (diagD * 4);
        return {
            quadrados: quadrados,
            metros: quadradosParaMetros(quadrados)
        };
    }

    var api = Object.freeze({
        QUADRADO_METROS: QUADRADO_METROS,
        ALCANCES_QUADRADOS: ALCANCES_QUADRADOS,
        ALCANCES_METROS: ALCANCES_METROS,
        metrosParaQuadrados: metrosParaQuadrados,
        quadradosParaMetros: quadradosParaMetros,
        alcance: alcance,
        formatarAlcance: formatarAlcance,
        custoMovimento: custoMovimento
    });

    global.PindoramaRegras = api;
})(typeof window !== 'undefined' ? window : this);
