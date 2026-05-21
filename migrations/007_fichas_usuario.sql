-- Migration 007 — vínculo entre fichas e usuários.
--
-- Adiciona `usuario_id` na tabela `fichas` para permitir que cada ficha
-- pertença a um usuário (em geral o Participante dono do personagem, ou
-- o Facilitador no caso de NPCs/criaturas da mesa).
--
-- O campo é NULL-able para preservar fichas legadas que ainda não estão
-- vinculadas a nenhum usuário; depois que houver uma rotina de vínculo
-- (UI de "atribuir ficha a participante"), o time pode decidir se torna
-- NOT NULL via nova migration.
--
-- Usa information_schema para rodar tanto em MariaDB quanto em MySQL.
--
-- Pré-requisito: a tabela `fichas` precisa existir. Em hospedagens
-- novas (ex.: subdomínio na Hostinger) ela é criada pela migration
-- 014_criar_tabela_fichas.sql. Para tornar 007 segura mesmo quando
-- 014 ainda não rodou, todos os passos abaixo são pulados se a tabela
-- `fichas` não estiver presente no schema atual.

SET @fichas_exists := (
    SELECT COUNT(*) FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fichas'
);

SET @col_exists := IF(@fichas_exists = 0, 1, (
    SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fichas' AND COLUMN_NAME = 'usuario_id'
));
SET @stmt := IF(@fichas_exists = 1 AND @col_exists = 0,
    'ALTER TABLE fichas ADD COLUMN usuario_id INT(11) NULL AFTER id',
    'SELECT 1');
PREPARE s1 FROM @stmt; EXECUTE s1; DEALLOCATE PREPARE s1;

SET @idx_exists := IF(@fichas_exists = 0, 1, (
    SELECT COUNT(*) FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fichas' AND INDEX_NAME = 'fichas_usuario_id_idx'
));
SET @stmt := IF(@fichas_exists = 1 AND @idx_exists = 0,
    'ALTER TABLE fichas ADD INDEX fichas_usuario_id_idx (usuario_id)',
    'SELECT 1');
PREPARE s2 FROM @stmt; EXECUTE s2; DEALLOCATE PREPARE s2;

SET @fk_exists := IF(@fichas_exists = 0, 1, (
    SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'fichas'
      AND COLUMN_NAME = 'usuario_id'
      AND REFERENCED_TABLE_NAME = 'usuarios'
));
SET @stmt := IF(@fichas_exists = 1 AND @fk_exists = 0,
    'ALTER TABLE fichas ADD CONSTRAINT fichas_usuario_id_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE SET NULL',
    'SELECT 1');
PREPARE s3 FROM @stmt; EXECUTE s3; DEALLOCATE PREPARE s3;
