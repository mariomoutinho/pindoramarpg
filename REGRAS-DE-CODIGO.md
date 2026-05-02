# Regras de Código — Pindorama Ficha

Documentação técnica do projeto: stack, tipos, convenções de código, contratos de API, esquema de banco e padrões de validação. Para regras de jogo/negócio veja [REGRAS-DE-NEGOCIO.md](REGRAS-DE-NEGOCIO.md).

---

## 1. Stack Tecnológico

| Camada | Tecnologia | Observação |
|---|---|---|
| Linguagem servidor | **PHP 8.0+** (rodando em 8.3 no ambiente atual) | Sem Composer; sem namespaces |
| Servidor web | **Apache 2.4** | `mod_rewrite` habilitado, `AllowOverride All` |
| Banco | **MySQL 8.0** (dump original era MariaDB 10.4 — compatível) | charset `utf8mb4` / collation `utf8mb4_unicode_ci` |
| Driver DB | **PDO** | `ATTR_ERRMODE = ERRMODE_EXCEPTION`, `FETCH_ASSOC` |
| Frontend | **Vanilla JS + CSS** | Sem framework, sem bundler, sem módulos |
| Ferramentas auxiliares | phpMyAdmin (em `/phpmyadmin`) | gerenciamento do banco |

**Sem dependências externas:** o projeto não usa `composer.json`, `package.json`, build steps ou autoload.

---

## 2. Esquema do Banco — Tipos e Constraints

### 2.1 Tabela `fichas`

| Coluna | Tipo | Default | Null | Chave |
|---|---|---|---|---|
| `id` | `INT` | AUTO_INCREMENT | Não | **PK** |
| `participante` | `VARCHAR(150)` | NULL | Sim | |
| `personagem` | `VARCHAR(150)` | NULL | Sim | |
| `ancestralidade` | `VARCHAR(100)` | NULL | Sim | slug → `data/ancestralidades.json` |
| `origem` | `VARCHAR(100)` | NULL | Sim | slug → `data/origens.json` |
| `classe` | `VARCHAR(100)` | NULL | Sim | (legado — uso primário em `ficha_classes`) |
| `nivel` | `INT` | 1 | Sim | (legado — soma de `ficha_classes.nivel`) |
| `divindade` | `VARCHAR(100)` | NULL | Sim | slug → `data/divindades.json` |
| `personagem_imagem` | `VARCHAR(255)` | NULL | Sim | path relativo (ex.: `uploads/personagens/personagem_xxx.jpg`) |
| `forca` `destreza` `constituicao` `inteligencia` `sabedoria` `carisma` | `INT` | 0 | Não | atributos primários |
| `pv_total` `pv_atuais` | `INT` | 0 | Não | Pontos de Vida |
| `pm_total` `pm_atuais` | `INT` | 0 | Não | Pontos de Magia |
| `pp_total` `pp_atuais` | `INT` | 0 | Não | Pontos de Poder *(migration 002)* |
| `defesa_total` | `INT` | 10 | Sim | |
| `defesa_destreza` `defesa_armadura` `defesa_escudo` `defesa_outros` | `INT` | 0 | Sim | componentes da defesa |
| `armadura_escudo` | `TEXT` | NULL | Sim | descritivo livre |
| `proficiencias` | `TEXT` | NULL | Sim | descritivo livre |
| `habilidades_magias` | `TEXT` | NULL | Sim | descritivo livre |
| `equipamentos` | `TEXT` | NULL | Sim | JSON serializado |
| `ataques` | `LONGTEXT` | NULL | Sim | JSON serializado |
| `pericias` | `LONGTEXT` | NULL | Sim | JSON serializado |
| `dinheiro` | `VARCHAR(50)` | NULL | Sim | ex.: `"M$ 500"` |
| `carga` | `VARCHAR(50)` | NULL | Sim | ex.: `"7.5 kg"` |
| `origem_beneficios` | `TEXT` | NULL | Sim | JSON dos 2 benefícios *(migration 003)* |
| `created_at` | `TIMESTAMP` | `CURRENT_TIMESTAMP` | Não | |
| `updated_at` | `TIMESTAMP` | `CURRENT_TIMESTAMP ON UPDATE` | Não | |

### 2.2 Tabela `ficha_classes` *(migration 001)*

| Coluna | Tipo | Default | FK |
|---|---|---|---|
| `id` | `INT` AUTO_INCREMENT | — | **PK** |
| `ficha_id` | `INT` | — | → `fichas.id` ON DELETE CASCADE |
| `classe_id` | `VARCHAR(50)` | — | slug da classe |
| `nivel` | `INT` | 1 | nível nesta classe (1–20) |
| `ordem` | `INT` | 0 | ordem (0 = primária) |

### 2.3 Tabela `ficha_poderes` *(migration 001)*

| Coluna | Tipo | Default | FK |
|---|---|---|---|
| `id` | `INT` AUTO_INCREMENT | — | **PK** |
| `ficha_id` | `INT` | — | → `fichas.id` ON DELETE CASCADE |
| `classe_id` | `VARCHAR(50)` | NULL | slug da classe que concedeu o poder (NULL para gerais) |
| `poder_id` | `VARCHAR(100)` | — | id do poder no JSON |
| `tipo` | `VARCHAR(20)` | — | `classe` \| `geral` \| `divinos` \| `magia` \| `combate` \| ... |

### 2.4 Migrations e compatibilidade SQL

| Arquivo | Conteúdo | Observação |
|---|---|---|
| `001_multiclasse_poderes.sql` | cria `ficha_classes` e `ficha_poderes` | compatível MySQL 8 / MariaDB |
| `002_pp.sql` | adiciona `pp_total`, `pp_atuais` em `fichas` | usa `ADD COLUMN IF NOT EXISTS` (**MariaDB-only**) |
| `003_origem_beneficios.sql` | adiciona `origem_beneficios` em `fichas` | usa `ADD COLUMN IF NOT EXISTS` (**MariaDB-only**) |

> ⚠️ **Para rodar em MySQL 8 puro** as migrations 002 e 003 precisam ser executadas sem `IF NOT EXISTS` (ou via lógica condicional em `INFORMATION_SCHEMA.COLUMNS`).

---

## 3. Convenções PHP

### 3.1 Estilo geral

- **Procedural, sem OOP.** Não há `class`, `interface`, `namespace` ou autoloader.
- **Inclusão por `require_once`** com `__DIR__` para caminhos absolutos.
- **Funções nomeadas em `camelCase`** (ex.: `buscarOrigem`, `avaliarPrerequisitos`, `getSlotsDePoderDeClasseDisponiveis`).
- **Variáveis globais auxiliares em `snake_case`** (ex.: `$dados_poderes`, `$dados_classes`).
- **Indentação:** 4 espaços, sem tabs.
- **Strings:** aspas simples preferidas; aspas duplas só quando há interpolação.

### 3.2 Type hints e returns

Funções da pasta `lib/` usam tipagem explícita em parâmetros e retorno:

```php
function getSlotsDePoderDeClasseDisponiveis(array $personagem, ?array $classesData = null): array
function fichaParaPersonagem(array $ficha): array
function avaliarPrerequisitos(array $poder, array $personagem, array $poderesPorClasse): array
function buscarOrigem(string $idOrigem, ?array $origensData = null): ?array
function podeAdquirirPoder(array $personagem, array $poder, int $ppAtuais, array $poderesPorClasse): array
```

Tipos usados: `array`, `?array`, `string`, `?string`, `int`, `bool`, `void`.

> Endpoints (`*.php` no root) **não** usam tipagem em variáveis locais — apenas validam/converte com `(int)`, `(string)` casts.

### 3.3 Tratamento de erros

| Camada | Estratégia |
|---|---|
| Conexão DB (`config.php`) | `try/catch (PDOException)` → JSON `{success:false, error:...}` e `exit` |
| Endpoints (`salvar-ficha.php`) | Transação `BEGIN/COMMIT/ROLLBACK` ao redor de múltiplos statements; falha → JSON de erro |
| Validações (`lib/*`) | Retornam shape estruturado, **não lançam exceção** |
| Front-end | Tratamento via `fetch().then().catch()` |

### 3.4 Padrão de retorno das validações

**Validação de benefícios de origem** (`validarBeneficiosOrigem`):
```php
['ok' => bool, 'erros' => string[]]
```

**Avaliação de pré-requisitos** (`avaliarPrerequisitos`):
```php
[
  'atende' => bool,
  'faltando' => [
    ['tipo' => string, 'texto' => string, 'atendido' => bool|null],
    // atendido === null → pré-requisito manual (texto livre)
  ]
]
```

**Aquisição de poder** (`podeAdquirirPoder`):
```php
['pode' => bool, 'razao' => string]
```

### 3.5 Padrões de helpers reutilizados

- **Cache opcional**: helpers aceitam o JSON pré-carregado para evitar `file_get_contents` duplicado:
  ```php
  function buscarOrigem(string $id, ?array $data = null): ?array {
      if ($data === null) $data = carregarOrigens();
      // ...
  }
  ```
- **Indexação flat**: `indexarPoderesGerais()` retorna `[id => poder]` para lookup O(1).
- **Normalização de texto**: `normalizarTextoPoder()` usa `iconv('UTF-8','ASCII//TRANSLIT', ...)` + `strtolower` + regex para casamento fuzzy de pré-requisitos textuais ("Treinado em X", "FOR4", "Devoto de X").

---

## 4. Contratos de API

Todas as respostas seguem o padrão JSON:

```php
header('Content-Type: application/json');
echo json_encode([...]);
```

### 4.1 `POST /salvar-ficha.php`

**Request** (`multipart/form-data`):

| Campo | Tipo | Obrigatório | Notas |
|---|---|---|---|
| `id` | int (string) | não | se ausente → cria; se presente → atualiza |
| `participante` `personagem` | string | sim | |
| `ancestralidade` `origem` `divindade` | string (slug) | não | |
| `classe` | string | (legado) | redundante se `classes_personagem` enviado |
| `nivel` | int | (legado) | idem |
| 6× atributos | int | sim | `forca` `destreza` `constituicao` `inteligencia` `sabedoria` `carisma` |
| `pv_total` `pv_atuais` `pm_total` `pm_atuais` `pp_total` `pp_atuais` | int | sim | |
| `defesa_total` `defesa_destreza` `defesa_armadura` `defesa_escudo` `defesa_outros` | int | sim | |
| `armadura_escudo` `proficiencias` `habilidades_magias` | string | não | descritivo livre |
| `equipamentos` `ataques` `pericias` `origem_beneficios` | string (JSON serializado) | não | validado por `json_decode` no servidor |
| `dinheiro` `carga` | string | não | |
| `classes_personagem` | string (JSON) | não | `[{"classe_id":"arcanista","nivel":5},...]` |
| `poderes` | string (JSON) | não | `[{"classe":"arcanista","id":"arc-xxx","tipo":"classe"},...]` |
| `personagem_imagem_file` | file | não | upload binário |
| `personagem_imagem` | string | não | path atual (preservar) |
| `remover_personagem_imagem` | `"0"` \| `"1"` | não | flag de exclusão |

**Response** (`application/json`):

```json
{
  "success": true,
  "id": 7,
  "personagem_imagem": "uploads/personagens/personagem_64a3fe.jpg",
  "message": "Ficha criada com sucesso."
}
```

Em erro:
```json
{ "success": false, "message": "...", "error": "..." }
```

### 4.2 `GET /buscar-ficha.php?id=<id>`

Resposta serializa `fichas` + arrays aninhados de `classes` e `poderes`:

```json
{
  "success": true,
  "ficha": {
    "id": 1,
    "participante": "Lucas",
    "personagem": "Aruá",
    "ancestralidade": "arajuba",
    "origem": "batedor",
    "classe": "cacador",
    "nivel": 5,
    "divindade": "anhanga",
    "personagem_imagem": "assets/img/ancestralidades/arajuba.webp",
    "forca": 12, "destreza": 18, "constituicao": 14,
    "inteligencia": 10, "sabedoria": 16, "carisma": 11,
    "pv_total": 88, "pv_atuais": 88,
    "pm_total": 13, "pm_atuais": 13,
    "pp_total": 4, "pp_atuais": 4,
    "defesa_total": 31,
    "ataques": "[{...}]",
    "pericias": "[{...}]",
    "origem_beneficios": "[{...}]",
    "dinheiro": "M$ 120",
    "carga": "11.0 kg",
    "created_at": "2026-05-01 20:30:00",
    "updated_at": "2026-05-01 20:45:00",
    "classes": [{"id":"cacador","nivel":5}],
    "poderes": [
      {"classe":"cacador","id":"cac-alvo-marcado","tipo":"classe"},
      {"classe":null,"id":"general-tiro-certeiro","tipo":"geral"}
    ]
  }
}
```

> ⚠️ Campos `ataques`, `pericias`, `equipamentos`, `origem_beneficios` chegam **como string JSON**, não como array. Cliente precisa `JSON.parse` no front.

### 4.3 `GET /listar-fichas.php`

Retorna **array** (não envelope) com lista resumida:

```json
[
  {
    "id": 1,
    "participante": "Lucas",
    "personagem": "Aruá",
    "classe": "cacador",
    "nivel": 5,
    "updated_at": "2026-05-01 20:45:00"
  }
]
```

---

## 5. Estrutura dos Arquivos JSON em `data/`

### 5.1 `origens.json`

```json
{
  "introducao": ["..."],
  "regras": { "modificadores":"...", "itens":"...", "beneficios":"...", "poder_unico":"..." },
  "origens": [
    {
      "id": "amigo-dos-animais",
      "nome": "Amigo dos Animais",
      "descricao": "...",
      "atributos": ["car","sab"],
      "itens": ["..."],
      "pericias": ["Adestramento","Cavalgar"],
      "poderes": ["origem-amigo-especial"],
      "observacao": "(opcional)"
    }
  ]
}
```

### 5.2 `classes.json`

```json
{
  "arcanista": {
    "nome": "Arcanista",
    "habilidadesPorNivel": {
      "1": ["conhecimento-mistico","magias","kit-esoterico"],
      "2": ["poder-de-arcanista"],
      "20": ["poder-de-arcanista","sincronicidade"]
    }
  }
}
```

> Slot de poder de classe: chave `poder-de-{classeId}` em `habilidadesPorNivel[level]`.

### 5.3 `divindades.json`

```json
{
  "introducao": ["..."],
  "divindades": [
    {
      "id": "aelohim",
      "nome": "Aelohim",
      "saudacao": "...",
      "descricao": "...",
      "crencas": "...",
      "simbolo": "...",
      "energia": "retrativa",
      "energia_opcoes": null,
      "arma_preferida": "...",
      "devotos": { "racas": ["..."], "classes": ["..."] },
      "poderes": ["divinos-armas-da-ambicao"],
      "obrigacoes": "..."
    }
  ]
}
```

### 5.4 `poderes.json` (poderes de classe)

```json
{
  "arcanista": [
    {
      "id": "arc-blindagem-defletora",
      "nome": "Blindagem Defletora",
      "descricao": "...",
      "prerequisitos": [
        {"tipo":"nivel_classe","classe":"arcanista","nivel":14},
        {"tipo":"poder","id":"arc-deflexao-arcana"}
      ]
    }
  ]
}
```

### 5.5 `poderes-gerais.json` (poderes universais)

```json
{
  "categorias": [
    {
      "id": "combate",
      "nome": "Poderes de Combate",
      "poderes": [
        {
          "id": "combate-acuidade-com-arma",
          "nome": "Acuidade com Arma",
          "categoria": "combate",
          "descricao": "...",
          "prerequisito_texto": "Des 1",
          "prerequisitos": [
            {"tipo":"atributo","atributo":"des","valor":1,"texto":"Des 1"}
          ]
        }
      ]
    }
  ]
}
```

Categorias fixas: `combate`, `destino`, `magia`, `divinos`, `origem`.

### 5.6 Tipos de pré-requisito (estruturados)

| `tipo` | Campos | Exemplo |
|---|---|---|
| `nivel_classe` | `classe`, `nivel` | exige nível X em classe Y |
| `poder` | `id` | exige outro poder |
| `nivel_personagem` (ou `nivel`) | `nivel` | nível total mínimo |
| `atributo` | `atributo`, `valor`, `texto` | atributo ≥ valor |
| `pericia` | `texto` | parsed via regex (manual) |
| `manual` | `texto` | precisa confirmação humana |

---

## 6. Frontend (Vanilla JS)

Sem build, sem módulos, sem framework. Cada `.js` é carregado via `<script>` e exporta funções/estado para o **escopo global**.

| Arquivo | Tamanho | Responsabilidade |
|---|---|---|
| `assets/js/ficha.js` | ~119 KB | estado principal, persistência via inputs hidden, submit do form |
| `assets/js/poderes.js` | ~33 KB | UI de seleção de poderes, validação visual de pré-requisitos |
| `assets/js/origens.js` | ~15 KB | UI de origens + escolha dos 2 benefícios |
| `assets/js/ancestralidades-ficha.js` | ~26 KB | UI de ancestralidades + bônus de atributo |
| `assets/js/divindades.js` | ~5.5 KB | filtro de devoção + poderes divinos |
| `assets/js/classes.js` | ~3.7 KB | metadata/links de classes |
| `assets/js/atributos.js` | ~12 KB | cálculo de atributos derivados |
| `assets/js/magias.js` | ~1.9 KB | stub do UI de magias |

**Padrões adotados:**
- Carregamento de dados via `fetch('data/*.json')` no `DOMContentLoaded`.
- Estado mantido em objetos globais + campos `<input type="hidden">` (JSON serializado em string).
- Eventos via `addEventListener` direto no DOM.
- Sem virtual DOM, sem reactividade — re-render manual.
- CSS puro em `assets/css/*.css`, sem pré-processador.

---

## 7. Upload de Imagem

Localizado em `salvar-ficha.php` (≈ linhas 83–123):

| Item | Regra |
|---|---|
| Diretório | `uploads/personagens/` (criado com `mkdir(..., 0777, true)` se ausente) |
| Whitelist de extensões | `jpg`, `jpeg`, `png`, `webp`, `gif` (verificação **só por extensão** — sem MIME) |
| Nome do arquivo | `uniqid('personagem_', true) . '.' . $ext` |
| Validação de erro | `$_FILES[...]['error'] === UPLOAD_ERR_OK` |
| Persistência | path relativo gravado em `fichas.personagem_imagem` |
| Substituição | imagem antiga apagada com `unlink(__DIR__ . '/' . $antigo)` |
| Remoção explícita | flag `remover_personagem_imagem = "1"` apaga e seta NULL |
| Transacionalidade | **operações de arquivo NÃO estão dentro da transação SQL** — pode haver órfão |

> 💡 Recomendação: validar MIME real com `finfo_file()` para evitar upload mascarado por extensão.

---

## 8. Validações Centrais (referência rápida)

### `validarBeneficiosOrigem(string $idOrigem, array $beneficios): array`
- Máximo 2 benefícios.
- `tipo: 'pericia'` → `nome` deve estar em `origem.pericias`.
- `tipo: 'poder'` → `id` deve estar em `origem.poderes`.

### `avaliarPrerequisitos(array $poder, array $personagem, array $poderesPorClasse): array`
- Avalia cada item de `poder.prerequisitos` segundo seu `tipo`.
- Estruturados → automático. `pericia` / `manual` → texto via `normalizarTextoPoder`.
- Retorna `atende` (booleano agregado) + `faltando[]` (com `atendido` `bool|null`).

### `podeAdquirirPoder(array $personagem, array $poder, int $ppAtuais, array $poderesPorClasse): array`
1. Já possui o poder? → bloquear.
2. Pré-requisitos atendidos? → bloquear se não.
3. `categoria === 'divinos'` → checar limite (1, ou 2 com `Devoto Fiel`); custo 0 PP.
4. Demais → exigir `ppAtuais > 0`.

### Cálculos derivados (em `lib/personagem.php`)
- `nivelTotalPersonagem($p)` → soma de `personagem.classes[*].nivel`.
- `getSlotsDePoderDeClasseDisponiveis($p)` → conta entradas `poder-de-{classeId}` em `classes.json` até o nível atual, subtrai poderes já adquiridos do tipo `classe`.
- `valorAtributoPersonagem($p, $atrib)` → leitura direta do dict de atributos.
- PP total = `max(0, nivelTotal - 1)`.

---

## 9. Organização de Arquivos

### Raiz do projeto

| Arquivo | Tipo | Propósito |
|---|---|---|
| `index.php` | página | menu inicial |
| `ficha.php` | página | criação/edição da ficha (UI principal) |
| `config.php` | helper | conexão PDO (singleton por request) |
| `salvar-ficha.php` | endpoint | POST de criação/atualização |
| `buscar-ficha.php` | endpoint | GET por id |
| `listar-fichas.php` | endpoint | GET de listagem |
| `classe-*.php` (14×) | página | referência de cada classe (HTML estático) |
| `classes.php` | página | índice de classes |
| `origens.php`, `divindades.php`, `ancestralidades.php`, `poderes.php`, `magias.php`, `equipamentos.php`, `pericias.php` | página | telas de referência |
| `*-ui.php` | partial | componentes/templates de UI usados em `ficha.php` |
| `armaduras-catalogo.php`, `ataques-catalogo.php`, `equipamentos-catalogo.php` | página | catálogos |
| `teste-banco.php` | utilitário | smoke test da conexão PDO |

### Pasta `lib/`

| Arquivo | Conteúdo |
|---|---|
| `personagem.php` | helpers de estado do personagem, slots, conversão `ficha → personagem` |
| `origens.php` | `carregarOrigens`, `buscarOrigem`, `validarBeneficiosOrigem` |
| `poderes.php` | `avaliarPrerequisitos`, `podeAdquirirPoder`, normalização de texto, indexação |
| `divindades.php` | `carregarDivindades`, `buscarDivindade`, filtragem por raça/classe |

### Pasta `data/` (catálogos versionados em JSON)

```
ancestralidades.json   classes.json   divindades.json
magias.json            origens.json   poderes.json
poderes-gerais.json
```

### Pasta `assets/`

```
assets/
├── css/    (ficha.css, poderes.css, classes.css, ...)
├── js/     (ficha.js, poderes.js, ...)
└── img/
    └── ancestralidades/  (arajuba.webp, candango.webp, ...)
```

### Pasta `uploads/`

Gerada em runtime pelo `salvar-ficha.php`:

```
uploads/
└── personagens/
    └── personagem_xxxxxxxxxxx.{jpg,png,webp,gif}
```

### Pasta `migrations/`

```
migrations/
├── 001_multiclasse_poderes.sql
├── 002_pp.sql
└── 003_origem_beneficios.sql
```

---

## 10. Convenções de IDs (slugs)

Todos os identificadores cross-reference seguem **kebab-case** sem acentos:

| Domínio | Padrão | Exemplo |
|---|---|---|
| Classe | `lower` único | `arcanista`, `malandro`, `cacador` |
| Ancestralidade | `lower-com-tracos` | `kai-porah`, `curinqueas`, `muiraquita` |
| Origem | `lower-com-tracos` | `amigo-dos-animais`, `heroi-camponese` |
| Divindade | `lower` | `aelohim`, `anhanga`, `axumewa` |
| Poder de classe | `{prefixo3}-{nome-em-kebab}` | `arc-arcano-de-batalha`, `mal-ataque-arterial`, `gue-aparar` |
| Poder geral | `{categoria}-{nome-em-kebab}` | `combate-acuidade-com-arma`, `magia-magia-acelerada` |
| Poder divino | `divinos-{nome-em-kebab}` | `divinos-armas-da-ambicao` |
| Poder de origem | `origem-{nome-em-kebab}` | `origem-amigo-especial` |

> Sem acentos — nem em `id`, nem em `slug`. Os campos `nome` mantêm acentuação.

---

## 11. Itens de Atenção / Débitos Técnicos

| # | Item | Risco / Recomendação |
|---|---|---|
| 1 | `config.php` versionado com credenciais | mover para `.env` ou ignorar do git |
| 2 | Migrations 002 e 003 usam sintaxe MariaDB-only | ajustar para MySQL puro ou criar wrapper |
| 3 | Validação de upload **só por extensão** | adicionar `finfo_file` (MIME real) |
| 4 | Operações de arquivo fora da transação SQL | risco de órfão em caso de rollback |
| 5 | Campos `classe` / `nivel` legados em `fichas` | desnormalização — manter sincronia com `ficha_classes` |
| 6 | Campos `ataques`/`pericias`/`origem_beneficios` armazenados como TEXT (JSON-string) | considerar `JSON` nativo do MySQL 8 |
| 7 | Sem CSRF token em endpoints POST | adicionar token de sessão |
| 8 | Senhas em texto puro (sudo, banco) no histórico desta sessão | rotacionar |
| 9 | Sem testes automatizados além de `tests/personagem-test.php`, `tests/poderes-test.php` | aumentar cobertura |
| 10 | JS global pollui `window` | considerar IIFE / `<script type="module">` |

---

## 12. Pontos de Entrada / Como Rodar

```bash
# Apache + MySQL ativos
sudo systemctl start apache2 mysql

# Acessos
http://localhost/                       # ficha (UI)
http://localhost/listar-fichas.php      # API list
http://localhost/buscar-ficha.php?id=1  # API get
http://localhost/phpmyadmin             # admin DB

# DB do projeto
mysql -u pindorama -p pindorama_rpg
```

Configuração da conexão em [`config.php`](config.php):

```php
$host = '127.0.0.1';
$dbname = 'pindorama_rpg';
$user = 'pindorama';
$password = 'pindorama_dev_2026';
```
