-- Migração: armazenar as escolhas de benefícios da origem.
-- origem (varchar) já existe na tabela fichas e passa a guardar o slug da origem.
-- origem_beneficios (TEXT JSON) guarda os 2 benefícios escolhidos:
--   [{"tipo":"pericia","nome":"Adestramento"},{"tipo":"poder","id":"origem-amigo-especial"}]

ALTER TABLE fichas
    ADD COLUMN IF NOT EXISTS origem_beneficios TEXT NULL;
