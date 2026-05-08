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
-- IF NOT EXISTS é seguro em MariaDB 10.4+; em MySQL 8 puro use a forma
-- usada nas migrations 001-006.

ALTER TABLE `fichas`
    ADD COLUMN IF NOT EXISTS `usuario_id` INT(11) NULL AFTER `id`,
    ADD KEY IF NOT EXISTS `fichas_usuario_id_idx` (`usuario_id`),
    ADD CONSTRAINT `fichas_usuario_id_fk`
        FOREIGN KEY IF NOT EXISTS (`usuario_id`)
        REFERENCES `usuarios` (`id`)
        ON UPDATE CASCADE
        ON DELETE SET NULL;
