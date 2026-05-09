<?php
/**
 * Helper de ilustração de classe.
 *
 * Resolve o caminho da imagem ilustrativa de uma classe a partir do
 * seu slug (chave usada em data/classes.json: "arcanista", "malandro",
 * "cacador" etc.). Tenta PNG primeiro, depois WebP. Não inventa
 * arquivos — só retorna URL se o arquivo existir em disco.
 *
 * Uso (PHP):
 *   require_once __DIR__ . '/includes/class-illustration.php';
 *   $url = class_illustration_url('arcanista');     // 'assets/img/classes/arcanista.png' ou ''
 *   $abs = class_illustration_url('arcanista', true); // path absoluto p/ filesystem
 *
 * Convenção de pasta: assets/img/classes/<slug>.{png,webp}
 */

if (!function_exists('class_illustration_slug_normalize')) {
    function class_illustration_slug_normalize($slug) {
        $s = (string) $slug;
        $s = strtolower(trim($s));
        // Remove acento (compatível com nomes vindos do <select>).
        if (function_exists('iconv')) {
            $tmp = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s);
            if ($tmp !== false && $tmp !== '') $s = $tmp;
        }
        $s = preg_replace('/[^a-z0-9-]+/i', '-', $s);
        $s = trim($s, '-');
        return $s;
    }
}

if (!function_exists('class_illustration_url')) {
    function class_illustration_url($slug, $absolute = false) {
        $slug = class_illustration_slug_normalize($slug);
        if ($slug === '') return '';

        $base = __DIR__ . '/../assets/img/classes/';
        $rel  = 'assets/img/classes/';

        foreach (['png', 'webp'] as $ext) {
            $abs = $base . $slug . '.' . $ext;
            if (is_file($abs)) {
                return $absolute ? $abs : ($rel . $slug . '.' . $ext);
            }
        }
        return '';
    }
}

if (!function_exists('class_illustration_has')) {
    function class_illustration_has($slug) {
        return class_illustration_url($slug) !== '';
    }
}
