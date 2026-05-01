document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('classesSearch');
    const content = document.getElementById('classesContent');
    const sections = content ? content.querySelectorAll('.content-section') : [];

    const sidebar = document.getElementById('classesSidebar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const tocLinks = document.querySelectorAll('#classesToc .toc-link');

    function isMobileMenuMode() {
        return window.innerWidth <= 980;
    }

    function openMobileMenu() {
        if (!sidebar || !mobileMenuToggle) return;

        sidebar.classList.add('is-open');
        mobileMenuToggle.classList.add('is-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('mobile-menu-open');
    }

    function closeMobileMenu() {
        if (!sidebar || !mobileMenuToggle) return;

        sidebar.classList.remove('is-open');
        mobileMenuToggle.classList.remove('is-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mobile-menu-open');
    }

    function toggleMobileMenu() {
        if (!sidebar || !mobileMenuToggle) return;

        if (sidebar.classList.contains('is-open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    if (searchInput && content && sections.length > 0) {
        searchInput.addEventListener('input', function () {
            const term = this.value.toLowerCase().trim();

            sections.forEach(function (section) {
                const text = section.innerText.toLowerCase();
                section.style.display = text.includes(term) || term === '' ? '' : 'none';
            });
        });
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function (event) {
            event.stopPropagation();

            if (isMobileMenuMode()) {
                toggleMobileMenu();
            }
        });
    }

    tocLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (isMobileMenuMode()) {
                closeMobileMenu();
            }
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && isMobileMenuMode()) {
            closeMobileMenu();
        }
    });

    document.addEventListener('click', function (event) {
        if (!isMobileMenuMode()) return;
        if (!sidebar || !sidebar.classList.contains('is-open')) return;

        const clickedInsideSidebar = sidebar.contains(event.target);
        const clickedToggle = mobileMenuToggle && mobileMenuToggle.contains(event.target);

        if (!clickedInsideSidebar && !clickedToggle) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', function () {
        if (!isMobileMenuMode()) {
            closeMobileMenu();
        }
    });
});
function configurarBotaoVoltarTopo() {
    const backToTopBtn = document.getElementById("backToTopBtn");

    if (!backToTopBtn) {
        return;
    }

    function alternarBotaoVoltarTopo() {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    }

    backToTopBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", alternarBotaoVoltarTopo);
    alternarBotaoVoltarTopo();
}

document.addEventListener("DOMContentLoaded", configurarBotaoVoltarTopo);