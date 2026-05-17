# Deploy — Hostinger

Este documento explica como publicar o **Pindorama RPG** na hospedagem
Hostinger a partir do GitHub, **sem apagar nada** que já exista no
servidor fora da pasta deste projeto.

---

## Como funciona

Há um workflow em [.github/workflows/deploy-hostinger.yml](.github/workflows/deploy-hostinger.yml)
que roda automaticamente em **push para `main`** e também pode ser
disparado manualmente em **Actions → Deploy Pindorama RPG → Hostinger
→ Run workflow**.

O envio é feito por **FTP** (porta 21) com o utilitário `lftp` em
modo `mirror --reverse --only-newer`. As contas FTP adicionais da
Hostinger não suportam FTPS/TLS — a senha trafega no protocolo, mas
o escopo da conta (limitada à pasta `public_html/pindorama-rpg/`)
contém qualquer impacto.

- Apenas arquivos novos/alterados são enviados.
- Arquivos remotos **nunca são apagados** — não há `--delete`,
  `--delete-first` ou `--remove-source-files` no comando.
- O processo só toca a **subpasta configurada em `HOSTINGER_FTP_REMOTE_DIR`**
  (ex.: `public_html/pindorama-rpg`). O resto do `public_html` fica
  intocado.
- O workflow recusa rodar se o destino for `public_html` direto, `/`
  ou vazio — proteção contra acidente.

---

## Secrets necessários

Em **GitHub → Settings → Secrets and variables → Actions → New
repository secret**, cadastre:

| Secret | Descrição | Exemplo |
|---|---|---|
| `HOSTINGER_FTP_HOST` | Host FTP da Hostinger | `ftp.seudominio.com.br` |
| `HOSTINGER_FTP_USER` | Usuário FTP | `u123456789.pindorama` |
| `HOSTINGER_FTP_PASSWORD` | Senha do usuário FTP | (senha) |
| `HOSTINGER_FTP_PORT` | Porta (opcional, default `21`) | `21` |
| `HOSTINGER_FTP_REMOTE_DIR` | Pasta destino **dentro do servidor** | `public_html/pindorama-rpg` |

> Para criar usuário/senha FTP na Hostinger: **hPanel → Arquivos →
> Contas FTP**. Recomendado criar uma conta FTP **dedicada** com
> escopo limitado à pasta `public_html/pindorama-rpg/`. Assim, mesmo
> que algo dê errado no workflow, o restante do site fica fora do
> alcance da credencial.

---

## Conferência **obrigatória** antes do primeiro deploy

1. **Pasta destino existe?** Acesse o gerenciador de arquivos da
   Hostinger e crie `public_html/pindorama-rpg/` (vazia). Se preferir
   outro nome, ajuste `HOSTINGER_FTP_REMOTE_DIR`.
2. **Conta FTP escopada?** Idealmente a conta FTP só enxerga
   `public_html/pindorama-rpg/`. Se for a conta principal, dobre a
   atenção com o valor de `HOSTINGER_FTP_REMOTE_DIR`.
3. **Sem rotina de delete?** Confirme: o workflow **não tem**
   `--delete`. Pesquisar por essa string no arquivo deve dar zero
   ocorrências.
4. **Excludes corretos?** O workflow já ignora `uploads/`, estados
   locais, `.git`, ferramentas (`.claude/`, `.codex/`, `.agents/`),
   logs, backups SQL, credenciais e o próprio `DEPLOY_HOSTINGER.md`.

### Banco de dados

O deploy **não** toca no MySQL da Hostinger. Para o sistema funcionar
no servidor:

1. Crie um banco no hPanel → Bancos → MySQL.
2. Importe as migrations da pasta `migrations/` (na ordem
   `001…012`). O dump bruto `database.sql` e `_pindorama_rpg.sql`
   **não são enviados** pelo deploy.
3. Crie no servidor um `config.php` apontando para o banco da
   Hostinger. Esse arquivo **não** é versionado e **não** é enviado
   pelo deploy — você cria uma vez direto no servidor.

```php
<?php
$host     = '127.0.0.1';      // hPanel → MySQL → Host
$dbname   = 'u123456789_pind';
$user     = 'u123456789_pind';
$password = '••••';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user, $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
         PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Erro DB']);
    exit;
}
```

### Pastas de upload no servidor

`uploads/`, `uploads/aventuras/capas/`, `uploads/aventuras/npcs/`,
`uploads/usuarios/`, `uploads/campo-batalha/`, `uploads/personagens/`,
`uploads/tokens/` precisam **existir** no servidor com permissão de
escrita (`755`/`775` conforme a Hostinger). O deploy **não cria nem
sobrescreve** essas pastas — uploads dos usuários ficam intactos.

---

## Primeiro deploy passo a passo

1. Confirme/edite a pasta destino na Hostinger (`public_html/pindorama-rpg`).
2. Cadastre os 5 secrets acima.
3. No GitHub, vá em **Actions → Deploy Pindorama RPG → Hostinger →
   Run workflow → Run workflow** (deploy manual de teste).
4. Aguarde a action terminar (verde). Veja o log: deve listar arquivos
   sendo enviados, **nenhum sendo apagado**.
5. Acesse `https://seudominio.com.br/pindorama-rpg/` no navegador.
6. Se a tela aparecer mas o sistema reclamar de DB, é hora de
   importar `migrations/` e criar o `config.php` no servidor (seção
   "Banco de dados" acima).

Depois disso, **todo `git push` para `main` publica automaticamente**.

---

## O que o workflow envia (e não envia)

**Envia** (incremental, só o que mudou):
- Todos os `*.php`, `*.html`, pasta `assets/`, pasta `includes/`,
  pasta `data/` (exceto estado), pasta `migrations/`.

**Não envia** (lista de excludes no workflow):
- `.git/`, `.github/`, `.claude/`, `.codex/`, `.agents/`, `.vscode/`
- `uploads/**` — uploads dos usuários ficam no servidor; novos
  uploads continuam funcionando lá normalmente.
- `data/campo-batalha-state*.json`, `data/aventuras/*/cenas.json` —
  estados locais.
- `node_modules/`, `vendor/`
- `*.log`, `*.sql.bak`, `database.sql`, `_pindorama_rpg.sql`
- `DEPLOY_HOSTINGER.md`, `PORTE-GODOT.md`, `REGRAS-DE-*.md`
- `.DS_Store`, `Thumbs.db`

---

## Página inicial / landing externa

O repositório **não** contém uma landing externa para colocar um
botão "Acessar Pindorama RPG" — o `index.php` daqui já **é** a
homepage do próprio sistema.

Se você tiver uma landing geral do domínio **em outro lugar do
servidor** (ex.: `public_html/index.html` editado direto pelo
hPanel), insira manualmente o botão. Snippet pronto:

```html
<a href="/pindorama-rpg/" class="btn-pindorama">
    Acessar Pindorama RPG
</a>

<style>
.btn-pindorama {
    display: inline-block;
    padding: 14px 28px;
    background: linear-gradient(135deg, #69436f 0%, #3b1d43 100%);
    color: #fff7e6;
    border-radius: 999px;
    font-family: Georgia, serif;
    font-weight: 700;
    text-decoration: none;
    letter-spacing: 0.5px;
    box-shadow: 0 6px 18px rgba(59, 29, 67, 0.30);
    transition: 0.2s ease;
}
.btn-pindorama:hover {
    transform: translateY(-2px);
    filter: brightness(1.08);
}
</style>
```

Ajuste o `href="/pindorama-rpg/"` para o caminho que você escolheu em
`HOSTINGER_FTP_REMOTE_DIR` (sem o prefixo `public_html/`).

---

## Funcionamento em subdiretório

O Pindorama RPG já usa **links relativos** (`href="ficha.php"`,
`src="assets/..."`, etc.) em todo o código. Foi feita uma varredura
e **nenhum link absoluto** (`href="/algo"`) foi encontrado. Logo,
hospedar em `https://seudominio.com.br/pindorama-rpg/` funciona sem
ajuste de rotas.

O único `Location:` absoluto que existe nos handlers PHP são
redirects para nomes relativos do próprio sistema (`Location: index.php`,
`Location: mesas.php`), que resolvem corretamente dentro do
subdiretório.

---

## Como evitar problemas

- **Não rode `git push` se tiver migration pendente no servidor.** O
  código novo pode quebrar até que a migration rode no MySQL da
  Hostinger.
- **Não exclua a pasta destino direto pelo hPanel sem antes
  pausar/desabilitar o workflow** — uma execução posterior do
  workflow apenas reenviaria o pacote, sem reconstruir o que você
  excluiu intencionalmente.
- **Não inclua segredos no código.** O `.gitignore` já ignora
  `.env`, `config.local.php` e `secrets.*`. Para o `config.php` do
  servidor, edite direto no servidor; mantenha o do dev local fora do
  Git.
- **Se mudar o `HOSTINGER_FTP_REMOTE_DIR`**, lembre-se de atualizar
  também a landing externa (se existir).
