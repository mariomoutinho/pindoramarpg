/**
 * Módulo Aventuras — interações leves de UI:
 *  - Confirmação visual de exclusão (sem confirm() nativo).
 *  - Preview da capa ao escolher novo arquivo no editor.
 */

(function () {
    'use strict';

    /* ---------- Confirmação visual de exclusão ---------- */

    const backdrop = document.getElementById('aventurasConfirm');
    const bodyEl   = document.getElementById('aventurasConfirmBody');
    let pendingForm = null;

    function abrirConfirm(msgHtml, formEl) {
        if (!backdrop || !bodyEl) {
            // Sem o componente na página, deixa o submit ocorrer.
            return true;
        }
        bodyEl.innerHTML = msgHtml;
        pendingForm = formEl;
        backdrop.hidden = false;
        requestAnimationFrame(() => backdrop.classList.add('is-visible'));
        const cancelBtn = backdrop.querySelector('.aventuras-confirm-cancel');
        if (cancelBtn) cancelBtn.focus();
        return false; // bloqueia o submit nativo; ele é refeito após confirmar
    }

    function fecharConfirm() {
        if (!backdrop) return;
        backdrop.classList.remove('is-visible');
        setTimeout(() => { backdrop.hidden = true; }, 180);
        pendingForm = null;
    }

    if (backdrop) {
        backdrop.addEventListener('click', (ev) => {
            if (ev.target === backdrop) fecharConfirm();
        });
        backdrop.querySelector('.aventuras-confirm-x')?.addEventListener('click', fecharConfirm);
        backdrop.querySelector('.aventuras-confirm-cancel')?.addEventListener('click', fecharConfirm);
        backdrop.querySelector('.aventuras-confirm-ok')?.addEventListener('click', () => {
            const f = pendingForm;
            fecharConfirm();
            if (f) {
                // Marca como já confirmado p/ o handler do form não reabrir o modal.
                f.dataset.confirmed = '1';
                f.submit();
            }
        });
        document.addEventListener('keydown', (ev) => {
            if (ev.key === 'Escape' && !backdrop.hidden) fecharConfirm();
        });
    }

    // Exposta no inline handler `onsubmit` do <form> da listagem.
    window.confirmarExclusaoAventura = function (ev) {
        const form = ev.target;
        if (form && form.dataset.confirmed === '1') return true;
        ev.preventDefault();
        const msg = form?.dataset?.confirm || 'Excluir esta aventura?';
        abrirConfirm(msg, form);
        return false;
    };

    /* ---------- Preview de capa no editor ---------- */

    const fileInput = document.getElementById('aventuraCapaFile');
    const preview   = document.getElementById('aventuraCoverPreview');

    if (fileInput && preview) {
        fileInput.addEventListener('change', () => {
            const file = fileInput.files && fileInput.files[0];
            if (!file) return;
            const okMime = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
            if (!okMime) {
                showFlash('Formato não suportado. Use JPG, PNG ou WebP.', 'error');
                fileInput.value = '';
                return;
            }
            const maxBytes = 8 * 1024 * 1024;
            if (file.size > maxBytes) {
                showFlash('A capa excede 8 MB.', 'error');
                fileInput.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = '';
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Prévia da nova capa';
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    }

    /* ---------- Preview da imagem do NPC ---------- */
    // Mesma validação client-side (espelha o backend). Se houver URL
    // preenchida e o usuário escolher arquivo, o backend prioriza o
    // arquivo — o input file é o "campo vencedor".
    const npcFile    = document.getElementById('aventuraNpcImagemArquivo');
    const npcPreview = document.getElementById('aventuraNpcImagemPreview');
    if (npcFile && npcPreview) {
        const npcImgEl = npcPreview.querySelector('img');
        npcFile.addEventListener('change', () => {
            const file = npcFile.files && npcFile.files[0];
            if (!file) { npcPreview.hidden = true; return; }
            const okMime = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
            if (!okMime) {
                showFlash('Formato não suportado para a imagem do NPC. Use JPG, PNG ou WebP.', 'error');
                npcFile.value = '';
                npcPreview.hidden = true;
                return;
            }
            const maxBytes = 8 * 1024 * 1024;
            if (file.size > maxBytes) {
                showFlash('A imagem do NPC excede 8 MB.', 'error');
                npcFile.value = '';
                npcPreview.hidden = true;
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                if (npcImgEl) npcImgEl.src = e.target.result;
                npcPreview.hidden = false;
            };
            reader.readAsDataURL(file);
        });
    }

    function showFlash(msg, type) {
        let host = document.querySelector('.painel-flash.painel-flash--js');
        if (!host) {
            host = document.createElement('div');
            host.className = 'painel-flash painel-flash--js painel-flash--' + (type || 'info');
            const main = document.querySelector('main.home-shell') || document.body;
            main.insertBefore(host, main.firstChild);
        } else {
            host.className = 'painel-flash painel-flash--js painel-flash--' + (type || 'info');
        }
        host.textContent = msg;
    }
})();
