-- Migração: pontos de poder (PP) na ficha.
-- Regra: a cada nível do 2º em diante, +1 PP. Adquirir um poder de classe gasta 1 PP.
-- Adicionada como colunas na tabela fichas (escalar; não precisa de tabela própria).

ALTER TABLE fichas
    ADD COLUMN IF NOT EXISTS pp_total  INT(11) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS pp_atuais INT(11) NOT NULL DEFAULT 0;
