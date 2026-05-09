<?php
/**
 * Partial: Hero de ilustração de classe.
 *
 * Renderiza um card de ilustração no topo da página de uma classe.
 * Se a imagem não existir ainda em disco, mostra um placeholder
 * elegante em vez de quebrar o layout.
 *
 * Variáveis esperadas no escopo do include:
 *   $cb_class_slug    (string) ex.: 'arcanista'
 *   $cb_class_name    (string) ex.: 'Arcanista'
 *   $cb_class_tagline (string opcional) — frase curta abaixo do nome
 *
 * Exemplo:
 *   <?php $cb_class_slug = 'arcanista';
 *         $cb_class_name = 'Arcanista';
 *         $cb_class_tagline = 'Classe dedicada ao domínio do conhecimento oculto.';
 *         include __DIR__ . '/includes/class-hero.php'; ?>
 */

require_once __DIR__ . '/class-illustration.php';

$__cb_slug    = isset($cb_class_slug)    ? (string) $cb_class_slug    : '';
$__cb_name    = isset($cb_class_name)    ? (string) $cb_class_name    : '';
$__cb_tagline = isset($cb_class_tagline) ? (string) $cb_class_tagline : '';
$__cb_img     = $__cb_slug !== '' ? class_illustration_url($__cb_slug) : '';
?>
<section class="class-hero" data-class-slug="<?= htmlspecialchars($__cb_slug) ?>">
    <div class="class-illustration-card<?= $__cb_img === '' ? ' is-empty' : '' ?>">
        <?php if ($__cb_img !== ''): ?>
            <img class="class-illustration-image"
                 src="<?= htmlspecialchars($__cb_img) ?>"
                 alt="Ilustração da classe <?= htmlspecialchars($__cb_name ?: $__cb_slug) ?>"
                 loading="lazy" />
        <?php else: ?>
            <div class="class-illustration-placeholder" aria-hidden="true">
                <span class="class-illustration-glyph">⚜</span>
                <span class="class-illustration-empty-text">Ilustração da classe</span>
            </div>
        <?php endif; ?>
        <span class="class-illustration-caption"><?= htmlspecialchars($__cb_name ?: $__cb_slug) ?></span>
    </div>
    <?php if ($__cb_tagline !== ''): ?>
        <p class="class-hero-tagline"><?= htmlspecialchars($__cb_tagline) ?></p>
    <?php endif; ?>
</section>
<?php
unset($__cb_slug, $__cb_name, $__cb_tagline, $__cb_img);
