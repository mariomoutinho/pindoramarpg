<?php

$host = '127.0.0.1';
$dbname = 'pindorama_rpg';
$user = 'pindorama';
$password = 'pindorama_dev_2026';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    header('Content-Type: application/json');

    echo json_encode([
        'success' => false,
        'message' => 'Erro ao conectar ao banco de dados.',
        'error' => $e->getMessage()
    ]);

    exit;
}