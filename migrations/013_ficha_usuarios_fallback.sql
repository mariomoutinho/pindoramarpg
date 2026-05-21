-- Migration 013 — fallback de vínculo ficha ↔ usuário.
--
-- Preferencialmente o sistema usa `fichas.usuario_id` (migration 007).
-- Em hospedagens onde ALTER TABLE fichas falha ou está pendente, esta
-- tabela preserva o isolamento por usuário sem alterar dados existentes.

CREATE TABLE IF NOT EXISTS `ficha_usuarios` (
    `ficha_id`   INT(11) NOT NULL,
    `usuario_id` INT(11) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`ficha_id`),
    KEY `ficha_usuarios_usuario_idx` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
