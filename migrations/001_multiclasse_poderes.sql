-- Migração: suporte a multiclasse e a poderes estruturados.
-- Idempotente: pode rodar mais de uma vez sem erro.
-- Compat: a coluna fichas.classe e fichas.nivel continuam existindo
--        e refletem a "classe principal" (1ª linha de ficha_classes) durante a transição.

CREATE TABLE IF NOT EXISTS ficha_classes (
    id        INT(11)     NOT NULL AUTO_INCREMENT,
    ficha_id  INT(11)     NOT NULL,
    classe_id VARCHAR(50) NOT NULL,
    nivel     INT(11)     NOT NULL DEFAULT 1,
    ordem     INT(11)     NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_ficha_classes_ficha (ficha_id),
    CONSTRAINT fk_ficha_classes_ficha
        FOREIGN KEY (ficha_id) REFERENCES fichas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ficha_poderes (
    id        INT(11)      NOT NULL AUTO_INCREMENT,
    ficha_id  INT(11)      NOT NULL,
    classe_id VARCHAR(50)  NULL,
    poder_id  VARCHAR(100) NOT NULL,
    tipo      VARCHAR(20)  NOT NULL,
    PRIMARY KEY (id),
    KEY idx_ficha_poderes_ficha (ficha_id),
    CONSTRAINT fk_ficha_poderes_ficha
        FOREIGN KEY (ficha_id) REFERENCES fichas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
