/**
 * Menu lateral mobile + busca + back-to-top — usado pelas páginas de
 * catálogo (classes/ancestralidades/origens/divindades/equipamentos/poderes).
 *
 * Padrão simples e direto, idêntico ao do pericias.php:
 *   - Toggle abre/fecha
 *   - Botão × dentro da sidebar (injetado se não existir) fecha
 *   - Backdrop real fecha ao tocar
 *   - Tecla Esc fecha
 *   - Clicar num item da TOC fecha (em mobile)
 *   - Resize para desktop fecha
 */

(function () {
    'use strict';

    function init() {
        const body         = document.body;
        const sidebar      = document.getElementById('classesSidebar');
        const menuButton   = document.getElementById('mobileMenuToggle');
        const searchInput  = document.getElementById('classesSearch');
        const toc          = document.getElementById('classesToc');
        const sections     = Array.from(document.querySelectorAll('.classes-content .content-section'));
        const backToTop    = document.getElementById('backToTopBtn');

        if (!sidebar || !menuButton) {
            // Página sem menu lateral — só configura back-to-top
            setupBackToTop(backToTop);
            return;
        }

        // Garante que existe um botão × dentro do header da sidebar.
        // Se a página já tem (caso pericias.php), usa o existente.
        let closeButton = sidebar.querySelector('.sidebar-close-btn, #sidebarCloseBtn');
        if (!closeButton) {
            const head = sidebar.querySelector('.sidebar-mobile-head');
            if (head) {
                closeButton = document.createElement('button');
                closeButton.type = 'button';
                closeButton.className = 'sidebar-close-btn';
                closeButton.id = 'sidebarCloseBtn';
                closeButton.setAttribute('aria-label', 'Fechar menu de navegação');
                closeButton.textContent = '×';
                head.appendChild(closeButton);
            }
        }

        // Backdrop real (mais confiável que body::before pra clicks)
        let backdrop = document.querySelector('.mobile-menu-backdrop-real');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'mobile-menu-backdrop-real';
            backdrop.setAttribute('aria-hidden', 'true');
            backdrop.hidden = true;
            document.body.appendChild(backdrop);
        }

        function openSidebar() {
            sidebar.classList.add('is-open');
            backdrop.hidden = false;
            requestAnimationFrame(() => backdrop.classList.add('is-visible'));
            menuButton.classList.add('is-open');
            menuButton.setAttribute('aria-expanded', 'true');
            body.classList.add('mobile-menu-open');
        }

        function closeSidebar() {
            sidebar.classList.remove('is-open');
            backdrop.classList.remove('is-visible');
            menuButton.classList.remove('is-open');
            menuButton.setAttribute('aria-expanded', 'false');
            body.classList.remove('mobile-menu-open');

            // Esconde o backdrop só depois da transição de fade-out, pra
            // ele não bloquear cliques no fim
            window.setTimeout(() => {
                if (!sidebar.classList.contains('is-open')) {
                    backdrop.hidden = true;
                }
            }, 220);
        }

        function toggleSidebar() {
            if (sidebar.classList.contains('is-open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        }

        menuButton.addEventListener('click', toggleSidebar);
        backdrop.addEventListener('click', closeSidebar);
        if (closeButton) closeButton.addEventListener('click', closeSidebar);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && sidebar.classList.contains('is-open')) {
                closeSidebar();
            }
        });

        // Em mobile, clicar num item da TOC fecha o menu
        if (toc) {
            toc.querySelectorAll('.toc-link').forEach((link) => {
                link.addEventListener('click', () => {
                    if (window.matchMedia('(max-width: 980px)').matches) {
                        closeSidebar();
                    }
                });
            });
        }

        // Em resize para desktop, fecha
        window.addEventListener('resize', () => {
            if (!window.matchMedia('(max-width: 980px)').matches) {
                closeSidebar();
            }
        });

        setupSearch(searchInput, sections);
        setupTocActiveHighlight(toc, sections);
        setupBackToTop(backToTop);
    }

    function setupSearch(searchInput, sections) {
        if (!searchInput || !sections.length) return;
        searchInput.addEventListener('input', () => {
            const term = searchInput.value.toLowerCase().trim();
            sections.forEach((section) => {
                const text = section.innerText.toLowerCase();
                section.style.display = (term === '' || text.includes(term)) ? '' : 'none';
            });
        });
    }

    function setupTocActiveHighlight(toc, sections) {
        if (!toc || !sections.length || !('IntersectionObserver' in window)) return;
        const links = Array.from(toc.querySelectorAll('.toc-link'));
        const linkById = new Map();
        links.forEach((l) => {
            const id = (l.getAttribute('href') || '').replace('#', '');
            if (id) linkById.set(id, l);
        });
        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((e) => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!visible) return;
            links.forEach((l) => l.classList.remove('is-active'));
            linkById.get(visible.target.id)?.classList.add('is-active');
        }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.15, 0.4] });
        sections.forEach((s) => observer.observe(s));
    }

    function setupBackToTop(backToTop) {
        if (!backToTop) return;
        function update() {
            backToTop.classList.toggle('is-visible', window.scrollY > 400);
            backToTop.classList.toggle('show',       window.scrollY > 400);
        }
        window.addEventListener('scroll', update, { passive: true });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        update();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
