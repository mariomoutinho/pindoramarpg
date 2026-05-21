<?php
// Template do config.php para produção (Hostinger / hPanel).
//
// Copie este arquivo como `config.php` DIRETAMENTE no servidor — pelo
// Gerenciador de Arquivos do hPanel, dentro da pasta do subdomínio:
//   /home/u234997903/domains/coletivopindorama.com.br/public_html/pindoramarpg
//
// NUNCA versione `config.php` com credenciais reais. O workflow de
// deploy já exclui `config.php` do envio, então o arquivo no servidor
// fica intacto a cada novo deploy.
//
// Os valores corretos de host/usuário/senha/banco estão em
// hPanel → Bancos de Dados → Detalhes do MySQL.

$host     = '127.0.0.1';            // hPanel → MySQL → Host
$dbname   = 'u234997903_pindorama'; // hPanel → MySQL → Nome do banco
$user     = 'u234997903_pindorama'; // hPanel → MySQL → Usuário
$password = 'TROQUE_AQUI';          // hPanel → MySQL → Senha

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    header('Content-Type: application/json');

    echo json_encode([
        'success' => false,
        'message' => 'Erro ao conectar ao banco de dados.',
    ]);

    exit;
}
