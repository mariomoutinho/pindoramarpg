ALTER TABLE fichas
  ADD COLUMN personagem_token_imagem VARCHAR(500) NULL AFTER personagem_imagem_ajuste,
  ADD COLUMN personagem_token_imagem_ajuste TEXT NULL AFTER personagem_token_imagem;
