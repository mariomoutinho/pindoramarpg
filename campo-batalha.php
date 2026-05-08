<?php
/**
 * Compatibilidade — o módulo "Mesa de Jogo" antes vivia em
 * campo-batalha.php. O arquivo principal agora é mesa-jogo.php.
 * Este wrapper mantém favoritos, links antigos e e-mails funcionando
 * por meio de um redirect 301 (permanente, com preservação da query).
 *
 * Endpoints relacionados (salvar-campo-batalha.php, carregar-campo-batalha.php,
 * salvar-imagem-campo-batalha.php) e os assets (campo-batalha.css/js,
 * data/campo-batalha-state.json) permanecem com o nome antigo nesta
 * iteração para evitar quebrar persistência de cenas já salvas e cache
 * de navegadores. Renome incremental fica para uma migração futura.
 */
require_once __DIR__ . '/includes/auth.php';
iniciarSessao();

$qs = $_SERVER['QUERY_STRING'] ?? '';
$dest = 'mesa-jogo.php' . ($qs !== '' ? '?' . $qs : '');

header('Location: ' . $dest, true, 301);
exit;
