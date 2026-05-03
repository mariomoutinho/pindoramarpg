/**
 * Transições de página — fade-out ao clicar em link interno
 * antes de navegar.
 *
 * Inclua nas páginas que tem links de navegação. Combina com
 * transitions.css.
 */

(function () {
    'use strict';

    // Respeita preferência de redução de movimento
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const FADE_OUT_MS = 220;

    /* Limpeza paranoica: ao montar o DOM e ao voltar via histórico,
       remove qualquer page-leaving residual (de bf-cache ou bug). */
    function limparPageLeaving() {
        document.body.classList.remove('page-leaving');
        document.querySelectorAll('a.is-leaving').forEach(a => a.classList.remove('is-leaving'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', limparPageLeaving);
    } else {
        limparPageLeaving();
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;

        // Modificadores → deixa o navegador abrir em nova aba/janela normalmente
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (e.button !== 0) return;
        if (link.target && link.target !== '_self') return;
        if (link.hasAttribute('download')) return;

        const href = link.getAttribute('href');
        if (!href) return;
        // Pula âncoras / esquemas especiais
        if (href.startsWith('#') ||
            href.startsWith('javascript:') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:')) return;

        let url;
        try { url = new URL(href, window.location.href); } catch (_) { return; }

        // Apenas mesma origem
        if (url.origin !== window.location.origin) return;

        // Mesma URL exata? Deixa passar (recarrega normal)
        if (url.href === window.location.href) return;

        // Mesma pathname/search e só mudou o hash → navegação interna
        if (url.pathname === window.location.pathname &&
            url.search === window.location.search &&
            url.hash) return;

        e.preventDefault();
        link.classList.add('is-leaving');
        document.body.classList.add('page-leaving');

        // Failsafe: se a navegação não acontecer (popup blocker, erro,
        // gesture-required iOS, etc.), limpa a classe após 1.5s pra não
        // deixar a página presa.
        const limpeza = setTimeout(limparPageLeaving, 1500);

        setTimeout(() => {
            clearTimeout(limpeza);
            window.location.href = url.href;
        }, FADE_OUT_MS);
    });

    // Voltar/avançar via histórico → SEMPRE restaura visibilidade
    // (alguns browsers não setam e.persisted=true mas reusam a página).
    window.addEventListener('pageshow', limparPageLeaving);
    window.addEventListener('popstate', limparPageLeaving);
})();
