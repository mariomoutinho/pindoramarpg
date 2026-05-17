# Deploy — Hostinger

Como publicar o **Pindorama RPG** na Hostinger a partir do GitHub.
Fluxo final esperado:

1. alterar código localmente;
2. commit;
3. push em `main`;
4. **GitHub Actions** publica automaticamente em `public_html/pindorama-rpg/`.

---

## Como funciona

Há um único workflow em
[.github/workflows/deploy-hostinger.yml](.github/workflows/deploy-hostinger.yml)
que roda:

- automaticamente em **push para `main`**;
- manualmente em **GitHub → Actions → "Deploy Pindorama RPG →
  Hostinger" → Run workflow**.

A publicação usa **`lftp`** em modo `mirror --reverse --only-newer`
sobre FTP simples (porta 21). As contas FTP adicionais da Hostinger
**não suportam FTPS/TLS** — qualquer tentativa de `ftps://` ou
negociação AUTH TLS falha em `gnutls_handshake: An unexpected TLS
packet was received`. Por isso o workflow força FTP simples
(`set ftp:ssl-allow no`).

> **Por que `lftp` em vez de `SamKirkland/FTP-Deploy-Action`?**
> A primeira tentativa com aquela ação falhou na criação da pasta
> `lib/` no FTP plain da Hostinger (`550 No such file or directory` —
> race condition de `MKD`). O `lftp` serializa criação e upload de
> forma robusta e é o padrão para esse cenário.

O envio é **não destrutivo**:

- arquivos versionados são reenviados/sobrescritos para evitar que mtimes
  remotos da Hostinger façam o FTP pular mudanças reais;
- **sem** `--delete`, `--delete-first` ou `--remove-source-files` →
  arquivos remotos **jamais** são apagados;
- todos os caminhos sensíveis (uploads, estado de runtime,
  `config.php`) estão na lista `--exclude-glob`, então nem sobem nem
  interferem com nada que já exista no servidor.

---

## Conta FTP e destino

A publicação mira explicitamente a pasta final do projeto:

```
/home/u234997903/domains/coletivopindorama.com.br/public_html/pindorama-rpg
```

Por padrão, se `HOSTINGER_FTP_REMOTE_DIR` ficar vazio, o workflow usa
`domains/coletivopindorama.com.br/public_html/pindorama-rpg`. Se uma conta FTP adicional for escopada
diretamente para essa pasta final, configure `HOSTINGER_FTP_REMOTE_DIR=.`
para publicar na raiz da conta.

---

## Secrets necessários

**GitHub → Settings → Secrets and variables → Actions → New
repository secret**:

| Secret | Obrigatório | Descrição | Exemplo |
|---|---|---|---|
| `HOSTINGER_FTP_HOST` | ✅ | Host FTP da Hostinger | `ftp.coletivopindorama.com.br` |
| `HOSTINGER_FTP_USER` | ✅ | Usuário FTP da conta escopada | `u234997903.pindorama` |
| `HOSTINGER_FTP_PASSWORD` | ✅ | Senha do usuário FTP | (senha) |
| `HOSTINGER_FTP_PORT` | opcional (default `21`) | Porta FTP | `21` |
| `HOSTINGER_FTP_REMOTE_DIR` | opcional (vazio = caminho público do domínio) | Pasta remota de destino; use `.` se a conta já cair na pasta final | `domains/coletivopindorama.com.br/public_html/pindorama-rpg` |

Nada de credenciais no código — o workflow só lê dos secrets.

---

## O que NÃO é enviado

Lista `exclude` no workflow (e refletida em `.gitignore`):

- `.git*`, `.github/`, `.claude/`, `.codex/`, `.agents/`, `.vscode/`
- `node_modules/`, `vendor/`, `tests/`
- `README.md`, `DEPLOY-HOSTINGER.md`, `PORTE-GODOT.md`, `REGRAS-DE-*.md`
- **`config.php`** — criado manualmente no servidor;
  `.env`, `.env.*`, `config.local.php`, `secrets.*`
- **`uploads/**`** — capas, tokens, fotos de perfil, NPCs, mapas
- **`data/campo-batalha-state*.json`** e **`data/aventuras/*/cenas.json`**
  — estados gerados em runtime
- `database.sql`, `_pindorama_rpg.sql`, `*.sql.bak`, `*.bak`, `*.log`
- `.DS_Store`, `Thumbs.db`

Como esses caminhos estão excluídos, a ação não os envia **e** não
os considera para "alinhamento" remoto — as cópias no servidor
permanecem intactas.

---

## Primeiro deploy passo a passo

1. **hPanel → Arquivos**: garanta que `public_html/pindorama-rpg/`
   existe (pode estar vazia).
2. **hPanel → Arquivos → Contas FTP**: a conta já está escopada para
   esta pasta. Tenha em mãos host, usuário, senha e porta (21).
3. **GitHub → Settings → Secrets**: cadastre os 4 secrets acima.
4. **GitHub → Actions → "Deploy Pindorama RPG → Hostinger" → Run
   workflow** (manual primeiro). Acompanhe o log: vai listar arquivos
   sendo enviados.
5. Acesse `https://coletivopindorama.com.br/pindorama-rpg/` no
   navegador.
6. Se o sistema reclamar de DB, é hora de:
   - importar as migrations da pasta `migrations/` no MySQL da
     Hostinger (ordem `001…012`);
   - criar `config.php` direto no servidor (template abaixo).

Depois disso, **todo `git push` em `main` publica automaticamente**.

### Template do `config.php` para o servidor

Não versionar. Criar direto pelo gerenciador de arquivos da Hostinger
dentro de `public_html/pindorama-rpg/`:

```php
<?php
$host     = '127.0.0.1';        // hPanel → MySQL → Host
$dbname   = 'u234997903_pind';
$user     = 'u234997903_pind';
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
`uploads/tokens/` precisam existir no servidor com permissão de
escrita. O workflow **não cria nem sobrescreve** essas pastas —
uploads dos usuários ficam intactos a cada deploy.

---

## Funcionamento em subdiretório

O Pindorama RPG usa **apenas caminhos relativos** (`href="ficha.php"`,
`src="assets/..."`, `Location: index.php`, etc.). Foi feita uma
varredura — nenhum link absoluto (`href="/algo"`) foi encontrado.
Logo, hospedar em
`https://coletivopindorama.com.br/pindorama-rpg/` funciona sem
qualquer ajuste de rotas.

---

## Como evitar problemas

- **Não rode `git push` se houver migration pendente no servidor.**
  O código novo pode quebrar até que a migration rode no MySQL da
  Hostinger.
- **Não deletar manualmente pelo hPanel arquivos que ainda existem
  no repo** — o próximo deploy reenvia tudo.
- **Não comitar segredos.** `.gitignore` já bloqueia `.env*`,
  `config.local.php` e `secrets.*`.
- **Se mudar o escopo da conta FTP**, ajuste `server-dir` no
  workflow.

---

## Página inicial / landing externa

O repositório **não** contém uma landing externa para colocar um
botão "Acessar Pindorama RPG" — o `index.php` daqui já **é** a
homepage do próprio sistema.

Se você mantém uma landing geral em `public_html/` (fora do escopo
deste repositório), use este snippet para linkar:

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
