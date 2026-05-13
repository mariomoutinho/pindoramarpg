-- Migration 009 — módulo "Aventuras".
--
-- Cria uma tabela dedicada para aventuras prontas para narrar. Em vez
-- de reusar mesa_conteudos (genérico), aventuras têm capa, texto
-- integral, sinopse, sistema, nível sugerido, duração e observações
-- privadas do Facilitador — campos específicos o bastante para uma
-- tabela própria. A aventura pertence ao usuário/facilitador que a
-- criou; vínculo a uma mesa específica fica fora deste MVP.
--
-- IF NOT EXISTS é seguro em MariaDB 10.4+.

CREATE TABLE IF NOT EXISTS `aventuras` (
    `id`                       INT(11) NOT NULL AUTO_INCREMENT,
    `usuario_id`               INT(11) NOT NULL,
    `titulo`                   VARCHAR(180) NOT NULL,
    `subtitulo`                VARCHAR(220) NULL,
    `sinopse`                  TEXT NULL,
    `sistema`                  VARCHAR(120) NULL,
    `nivel_sugerido`           VARCHAR(60)  NULL,
    `duracao_estimada`         VARCHAR(60)  NULL,
    `qtd_jogadores`            VARCHAR(40)  NULL,
    `capa_path`                VARCHAR(255) NULL,
    `texto_integral`           LONGTEXT NULL,
    `observacoes_facilitador`  TEXT NULL,
    `status`                   ENUM('rascunho','publicada','arquivada')
                               NOT NULL DEFAULT 'rascunho',
    `created_at`               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                               ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `aventuras_usuario_idx` (`usuario_id`),
    KEY `aventuras_status_idx`  (`status`),
    CONSTRAINT `aventuras_usuario_fk`
        FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
