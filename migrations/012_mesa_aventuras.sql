-- Migration 012 — vínculo N:N entre mesas e aventuras.
--
-- Cada mesa pode ter várias aventuras associadas; cada aventura pode
-- aparecer em mais de uma mesa (reuso de campanha). O vínculo é puro
-- relacional, sem duplicar nenhum dado de `aventuras`.
--
-- UNIQUE (mesa_id, aventura_id) impede duplicidade. ON DELETE CASCADE
-- nas duas FKs garante limpeza automática quando a mesa ou a aventura
-- for excluída.

CREATE TABLE IF NOT EXISTS `mesa_aventuras` (
    `id`           INT(11) NOT NULL AUTO_INCREMENT,
    `mesa_id`      INT(11) NOT NULL,
    `aventura_id`  INT(11) NOT NULL,
    `created_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `mesa_aventuras_unica` (`mesa_id`, `aventura_id`),
    KEY `mesa_aventuras_aventura_idx` (`aventura_id`),
    CONSTRAINT `mesa_aventuras_mesa_fk`
        FOREIGN KEY (`mesa_id`)     REFERENCES `mesas`     (`id`) ON DELETE CASCADE,
    CONSTRAINT `mesa_aventuras_aventura_fk`
        FOREIGN KEY (`aventura_id`) REFERENCES `aventuras` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
