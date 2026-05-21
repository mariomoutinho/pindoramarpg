# Deploy do Pindorama RPG em subdomínio Hostinger

Guia para publicar o sistema em
**`https://pindoramarpg.coletivopindorama.com.br`** usando o workflow do
GitHub Actions `deploy-hostinger.yml`.

> **Status atual (2026-05-21).** O subdomínio já está criado no hPanel e
> o document root confirmado é:
> ```
> /home/u234997903/domains/coletivopindorama.com.br/public_html/pindoramarpg
> ```
> O valor a ser cadastrado no secret `HOSTINGER_TARGET_DIR` é o **caminho
> relativo** ao home do usuário FTP:
> ```
> domains/coletivopindorama.com.br/public_html/pindoramarpg
> ```
> (Se a conta FTP da Hostinger já estiver escopada diretamente nessa
> pasta — recomendação no passo 2 — use `.` em vez do caminho acima.)

---

## 1. Criar o subdomínio no hPanel (já feito)

> ✅ Pulável se já tiver `https://pindoramarpg.coletivopindorama.com.br`
> respondendo (mesmo que com a página padrão da Hostinger).

1. Entre no hPanel da Hostinger e abra **Domínios → Subdomínios**.
2. Em "Criar um novo subdomínio", preencha:
   - **Subdomínio**: `pindoramarpg`
   - **Domínio**: `coletivopindorama.com.br`
   - **Pasta personalizada (Document Root)**: deixe o sugerido
     (`public_html/pindoramarpg`) — esse é o caminho que o secret
     `HOSTINGER_TARGET_DIR` vai usar.
3. Clique em **Criar**. Aguarde a propagação do DNS (geralmente alguns
   minutos).
4. Acesse `https://pindoramarpg.coletivopindorama.com.br/` — deve cair
   na **página padrão da Hostinger** enquanto não houver código
   publicado. É normal.

> Não apague nem renomeie `public_html/` (raiz do
> `coletivopindorama.com.br`) nem pastas de outros sites/subdomínios.
> O subdomínio vive em uma pasta separada.

---

## 2. Conferir o document root e a conta FTP

No hPanel, abra **Arquivos → Gerenciador de Arquivos** e confirme o
caminho do subdomínio no topo da página. Para este projeto, o caminho
absoluto já confirmado é:

```
/home/u234997903/domains/coletivopindorama.com.br/public_html/pindoramarpg
```

O **caminho relativo** ao home do usuário FTP (que é o que o
`HOSTINGER_TARGET_DIR` aceita) é:

```
domains/coletivopindorama.com.br/public_html/pindoramarpg
```

> **Atalho recomendado:** crie no hPanel uma **conta FTP adicional
> escopada diretamente nessa pasta** (Arquivos → Contas FTP → Criar
> conta FTP → "Diretório" = a pasta do subdomínio acima). Aí o
> `HOSTINGER_TARGET_DIR` pode ser apenas `.` e qualquer credencial
> vazada não toca o site principal nem outros projetos.

---

## 3. Cadastrar os secrets no GitHub

**GitHub → Settings → Secrets and variables → Actions → New repository
secret**:

| Secret | Obrigatório | Descrição | Exemplo |
|---|---|---|---|
| `HOSTINGER_HOST` | ✅ | Host FTP da Hostinger | `ftp.coletivopindorama.com.br` |
| `HOSTINGER_USERNAME` | ✅ | Usuário FTP escopado no subdomínio | `u234997903.pindoramarpg` |
| `HOSTINGER_PASSWORD` | ✅ | Senha do usuário FTP | (segredo) |
| `HOSTINGER_PORT` | opcional (default `21`) | Porta FTP | `21` |
| `HOSTINGER_TARGET_DIR` | ✅ | Pasta remota do subdomínio (relativa ao home FTP) ou `.` se a conta já estiver escopada | `domains/coletivopindorama.com.br/public_html/pindoramarpg` (ou `.`) |

Os nomes antigos (`HOSTINGER_FTP_HOST`, `HOSTINGER_FTP_USER`,
`HOSTINGER_FTP_PASSWORD`, `HOSTINGER_FTP_PORT`,
`HOSTINGER_FTP_REMOTE_DIR`) continuam aceitos como fallback — o
workflow lê os novos primeiro e cai nos antigos se vazio. Não precisa
recadastrar tudo de uma vez.

> **Nunca** configure `HOSTINGER_TARGET_DIR` como `/`, `public_html`,
> `public_html/` nem caminhos vazios — o workflow recusa esses valores
> para não sobrescrever o site principal.

---

## 4. Rodar o deploy manualmente

1. Vá em **GitHub → Actions → "Deploy Pindorama RPG → Hostinger"**.
2. Clique em **Run workflow**, escolha a branch `main`.
3. (Opcional) Em `target_dir_override`, você pode digitar um destino só
   pra essa execução — útil pra testar antes de mexer no secret. Deixe
   em branco pra usar o `HOSTINGER_TARGET_DIR`.
4. Acompanhe o log: o lftp lista cada arquivo enviado. Não deve
   aparecer nenhum `--delete` nem remoção de arquivos.

Depois do primeiro deploy manual bem-sucedido, todo `git push` em
`main` publica automaticamente.

---

## 5. Criar o `config.php` no servidor

O `config.php` real **não é versionado** nem enviado pelo deploy (está
na lista de exclusão do workflow). Crie-o uma única vez, direto pelo
Gerenciador de Arquivos do hPanel, dentro de
`domains/coletivopindorama.com.br/public_html/pindoramarpg/`.

Use o template em [config.example.php](../config.example.php) como
ponto de partida — basta copiar o conteúdo, substituir host/usuário/
senha/banco pelos valores do hPanel (**MySQL → Detalhes**) e salvar
como `config.php`.

Se aparecer erro de banco depois do deploy, também é hora de importar
as migrations da pasta `migrations/` (ordem `001…013`) pelo
phpMyAdmin/MySQL da Hostinger.

---

## 6. Testar o subdomínio

Acesse no navegador:

- `https://pindoramarpg.coletivopindorama.com.br/` → deve cair em
  `index.php` (homepage do sistema).
- `https://pindoramarpg.coletivopindorama.com.br/index.php` → idem.
- `https://pindoramarpg.coletivopindorama.com.br/register.php` → form
  de cadastro.
- `https://pindoramarpg.coletivopindorama.com.br/login.php` → form de
  login.
- Após cadastrar/logar: `painel.php`, `mesas.php`, `fichas.php`,
  `aventuras.php`, `ficha.php` etc. devem abrir normalmente.
- Verifique no DevTools (Network) que `assets/css/*` e `assets/js/*`
  retornam **200** (todos os caminhos do projeto são relativos, então
  funcionam em qualquer raiz — domínio, subdomínio ou subdiretório).

---

## 7. Coexistência com o site principal

- O workflow **não apaga arquivos remotos** (sem `--delete`/`--mirror`
  destrutivo). Só envia/atualiza os arquivos do projeto.
- O destino é a pasta exclusiva do subdomínio. Nada do
  `coletivopindorama.com.br/` (site principal) nem de outros
  subdomínios é tocado.
- Os caminhos sensíveis (`config.php`, `uploads/**`, estados de
  runtime) estão na lista de exclusão do `mirror`, então não sobem
  nem competem com o que já existe no servidor.

---

## 8. Troubleshooting rápido

- **`HOSTINGER_TARGET_DIR ... precisa estar definido`** → cadastre o
  secret antes de rodar.
- **`Destino remoto '...' é inseguro`** → o valor cairia no site
  principal. Aponte pra pasta do subdomínio (ou `.` se a conta FTP já
  estiver escopada nela).
- **404 mesmo depois do deploy** → confirme no gerenciador de arquivos
  do hPanel que `index.php`/`register.php`/`login.php` estão dentro
  da pasta do subdomínio. Se estiverem em `public_html/pindoramarpg/`
  mas o subdomínio aponta pra outra pasta, ajuste o document root no
  hPanel ou corrija o `HOSTINGER_TARGET_DIR`.
- **`gnutls_handshake` / erro TLS** → contas FTP adicionais da
  Hostinger só aceitam FTP simples na porta 21. O workflow já força
  isso (`set ftp:ssl-allow no`); não tente mudar pra `ftps://`.
