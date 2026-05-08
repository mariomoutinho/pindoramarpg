-- Migration 008 — status da mesa e tabela genérica de conteúdo da mesa.
--
-- 1) Adiciona `status` em `mesas` para permitir distinguir rascunhos,
--    mesas ativas e mesas arquivadas (sem deletar).
--
-- 2) Cria `mesa_conteudos`, uma tabela genérica que guarda diferentes
--    tipos de conteúdo da mesa (NPCs, aventuras, narrativas, magias e
--    poderes customizados). Em vez de uma tabela por tipo — que seria
--    refatoração grande — usamos uma tabela polimórfica com `tipo` e
--    um campo `dados` em JSON para os atributos específicos do tipo.
--
--    A visibilidade (`privado` | `participantes` | `publico`) define o
--    que aparece ao Participante. Granularidade fina por participante
--    (ex.: liberar só para fulano) fica para uma migration futura, em
--    forma de tabela de acessos N:N — não é necessário para o MVP.
--
-- IF NOT EXISTS é seguro em MariaDB 10.4+.

ALTER TABLE `mesas`
    ADD COLUMN IF NOT EXISTS `status` ENUM('rascunho','ativa','arquivada')
        NOT NULL DEFAULT 'ativa' AFTER `descricao`;

CREATE TABLE IF NOT EXISTS `mesa_conteudos` (
    `id`            INT(11) NOT NULL AUTO_INCREMENT,
    `mesa_id`       INT(11) NOT NULL,
    `tipo`          ENUM('npc','aventura','narrativa','magia','poder') NOT NULL,
    `titulo`        VARCHAR(180) NOT NULL,
    `descricao`     TEXT NULL,
    `dados`         LONGTEXT NULL,
    `visibilidade`  ENUM('privado','participantes','publico')
                    NOT NULL DEFAULT 'privado',
    `criado_por`    INT(11) NOT NULL,
    `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `mesa_conteudos_mesa_idx` (`mesa_id`),
    KEY `mesa_conteudos_tipo_idx` (`tipo`),
    KEY `mesa_conteudos_visibilidade_idx` (`visibilidade`),
    KEY `mesa_conteudos_criador_idx` (`criado_por`),
    CONSTRAINT `mesa_conteudos_mesa_fk`
        FOREIGN KEY (`mesa_id`) REFERENCES `mesas` (`id`) ON DELETE CASCADE,
    CONSTRAINT `mesa_conteudos_criador_fk`
        FOREIGN KEY (`criado_por`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
