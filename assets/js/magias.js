(function () {
    'use strict';

    const busca = document.getElementById('magiaBusca');
    const filtros = Array.from(document.querySelectorAll('[data-magia-filter]'));
    const cards = Array.from(document.querySelectorAll('[data-magia-card]'));
    const contador = document.getElementById('magiasContador');
    const limpar = document.getElementById('magiasLimparFiltros');

    function normalizar(valor) {
        return String(valor || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    function aplicarFiltros() {
        const termo = normalizar(busca ? busca.value : '');
        const ativos = Object.fromEntries(
            filtros.map(filtro => [filtro.dataset.magiaFilter, filtro.value])
        );

        let visiveis = 0;

        cards.forEach(card => {
            let mostrar = true;

            if (termo && !normalizar(card.dataset.busca).includes(termo)) {
                mostrar = false;
            }

            Object.entries(ativos).forEach(([chave, valor]) => {
                if (!valor || !mostrar) return;
                if (String(card.dataset[chave] || '') !== String(valor)) {
                    mostrar = false;
                }
            });

            card.hidden = !mostrar;
            if (mostrar) visiveis++;
        });

        if (contador) {
            contador.textContent = `${visiveis} magia${visiveis === 1 ? '' : 's'}`;
        }
    }

    if (busca) busca.addEventListener('input', aplicarFiltros);
    filtros.forEach(filtro => filtro.addEventListener('change', aplicarFiltros));

    if (limpar) {
        limpar.addEventListener('click', () => {
            if (busca) busca.value = '';
            filtros.forEach(filtro => { filtro.value = ''; });
            aplicarFiltros();
        });
    }

    aplicarFiltros();
})();
