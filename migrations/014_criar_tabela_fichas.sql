-- Migration 014 — criar a tabela `fichas` (e as auxiliares
-- `ficha_classes` e `ficha_poderes`) caso ainda não existam no banco.
--
-- Idempotente: usa CREATE TABLE IF NOT EXISTS em todas as criações e
-- só adiciona a FK fichas.usuario_id → usuarios.id quando ela ainda
-- não existir. Não altera nem apaga dados de tabelas existentes.
--
-- Por que essa migration existe:
--   O dump original (`_pindorama_rpg.sql`) trazia a tabela `fichas`,
--   mas hospedagens novas (ex.: subdomínio na Hostinger) começam o
--   banco vazio e só rodam as migrations da pasta `migrations/`. Sem
--   esta migration, `fichas` simplesmente não nasce em produção e
--   salvar-ficha.php quebra com:
--     SQLSTATE[42S02]: Base table or view not found:
--     1146 Table '..._pindorama_rpg.fichas' doesn't exist
--
-- Estrutura: combina dump original + migrations 001 (multiclasse e
-- poderes), 002 (PP), 003 (origem_beneficios), 004 (imagem_ajuste),
-- 005 (token de personagem) e 007 (usuario_id + índice + FK). Quando
-- a tabela já existir (ambiente legado), o IF NOT EXISTS faz nada;
-- as migrations 001-007 continuam responsáveis pelas colunas extras
-- e este arquivo só vira no-op.

CREATE TABLE IF NOT EXISTS `fichas` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `usuario_id` INT(11) NULL,
    `participante` VARCHAR(150) DEFAULT NULL,
    `personagem` VARCHAR(150) DEFAULT NULL,
    `ancestralidade` VARCHAR(100) DEFAULT NULL,
    `origem` VARCHAR(100) DEFAULT NULL,
    `classe` VARCHAR(100) DEFAULT NULL,
    `nivel` INT(11) DEFAULT 1,
    `divindade` VARCHAR(100) DEFAULT NULL,
    `personagem_imagem` VARCHAR(255) DEFAULT NULL,
    `personagem_imagem_ajuste` TEXT NULL,
    `personagem_token_imagem` VARCHAR(500) NULL,
    `personagem_token_imagem_ajuste` TEXT NULL,
    `forca` INT(11) DEFAULT 0,
    `destreza` INT(11) DEFAULT 0,
    `constituicao` INT(11) DEFAULT 0,
    `inteligencia` INT(11) DEFAULT 0,
    `sabedoria` INT(11) DEFAULT 0,
    `carisma` INT(11) DEFAULT 0,
    `pv_total` INT(11) DEFAULT 0,
    `pv_atuais` INT(11) DEFAULT 0,
    `pm_total` INT(11) DEFAULT 0,
    `pm_atuais` INT(11) DEFAULT 0,
    `pp_total` INT(11) NOT NULL DEFAULT 0,
    `pp_atuais` INT(11) NOT NULL DEFAULT 0,
    `origem_beneficios` TEXT NULL,
    `defesa_total` INT(11) DEFAULT 10,
    `defesa_destreza` INT(11) DEFAULT 0,
    `defesa_armadura` INT(11) DEFAULT 0,
    `defesa_escudo` INT(11) DEFAULT 0,
    `defesa_outros` INT(11) DEFAULT 0,
    `armadura_escudo` TEXT DEFAULT NULL,
    `proficiencias` TEXT DEFAULT NULL,
    `habilidades_magias` TEXT DEFAULT NULL,
    `equipamentos` TEXT DEFAULT NULL,
    `ataques` LONGTEXT DEFAULT NULL,
    `pericias` LONGTEXT DEFAULT NULL,
    `dinheiro` VARCHAR(50) DEFAULT NULL,
    `carga` VARCHAR(50) DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fichas_usuario_id_idx` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FK fichas.usuario_id → usuarios.id (só adiciona se ainda não houver).
SET @fk_exists := (
    SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'fichas'
       AND COLUMN_NAME = 'usuario_id'
       AND REFERENCED_TABLE_NAME = 'usuarios'
);
SET @stmt := IF(@fk_exists = 0,
    'ALTER TABLE fichas ADD CONSTRAINT fichas_usuario_id_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE SET NULL',
    'SELECT 1');
PREPARE s1 FROM @stmt; EXECUTE s1; DEALLOCATE PREPARE s1;

-- Auxiliares (mesmas definições da migration 001, repetidas aqui só
-- para garantir que existam quando 001 ainda não rodou na hospedagem).
CREATE TABLE IF NOT EXISTS `ficha_classes` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `ficha_id` INT(11) NOT NULL,
    `classe_id` VARCHAR(50) NOT NULL,
    `nivel` INT(11) NOT NULL DEFAULT 1,
    `ordem` INT(11) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_ficha_classes_ficha` (`ficha_id`),
    CONSTRAINT `fk_ficha_classes_ficha`
        FOREIGN KEY (`ficha_id`) REFERENCES `fichas`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `ficha_poderes` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `ficha_id` INT(11) NOT NULL,
    `classe_id` VARCHAR(50) NULL,
    `poder_id` VARCHAR(100) NOT NULL,
    `tipo` VARCHAR(20) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_ficha_poderes_ficha` (`ficha_id`),
    CONSTRAINT `fk_ficha_poderes_ficha`
        FOREIGN KEY (`ficha_id`) REFERENCES `fichas`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
