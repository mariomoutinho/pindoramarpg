<?php

require_once 'config.php';

echo "<h2>Teste de conexão</h2>";

$stmt = $pdo->query("SELECT DATABASE() AS banco_atual");
$banco = $stmt->fetch();

echo "<strong>Banco conectado:</strong> " . $banco['banco_atual'];

echo "<h3>Colunas da tabela fichas:</h3>";

$stmt = $pdo->query("SHOW COLUMNS FROM fichas");

echo "<ul>";
foreach ($stmt->fetchAll() as $coluna) {
    echo "<li>" . $coluna['Field'] . "</li>";
}
echo "</ul>";