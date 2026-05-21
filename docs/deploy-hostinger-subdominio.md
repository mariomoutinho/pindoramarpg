# Deploy do Pindorama RPG em subdomínio Hostinger

Guia para publicar o sistema em
`https://pindoramarpg.coletivopindorama.com.br` (ou em qualquer outro
subdomínio próprio na Hostinger) usando o workflow do GitHub Actions
`deploy-hostinger.yml`.

> **Pré-condição importante.** O destino remoto (`HOSTINGER_TARGET_DIR`)
> **precisa ser confirmado no hPanel/File Browser antes do primeiro
> deploy**. O workflow não publica sem ele, justamente para não escrever
> em cima do site principal ou de outros projetos da hospedagem.

---

## 1. Criar o subdomínio no hPanel

1. Entre no hPanel da Hostinger e abra **Domínios → Subdomínios**.
2. Em "Criar um novo subdomínio", preencha:
   - **Subdomínio**: `pindoramarpg`
   - **Domínio**: `coletivopindorama.com.br`
   - **Pasta personalizada (Document Root)**: deixe o sugerido
     (`public_html/pindoramarpg`) ou anote o caminho que o painel
     mostrar — vai ser usado no passo 2.
3. Clique em **Criar**. Aguarde a propagação do DNS (geralmente alguns
   minutos; pode levar até algumas horas).
4. Teste no navegador acessar
   `https://pindoramarpg.coletivopindorama.com.br/` — deve cair em uma
   página vazia/diretório do servidor enquanto não houver código
   publicado. Se cair em 404 do Hostinger é normal nessa fase.

> Não apague nem renomeie `public_html/` (raiz do
> `coletivopindorama.com.br`) nem pastas de outros sites. O subdomínio
> vive em uma pasta separada.

---

## 2. Identificar o document root do subdomínio

No hPanel, abra **Arquivos → Gerenciador de Arquivos** e navegue até a
pasta que o painel apontou ao criar o subdomínio. O caminho absoluto
aparece no topo do gerenciador — geralmente algo como:

```
/home/u234997903/domains/coletivopindorama.com.br/public_html/pindoramarpg
```

ou, em algumas contas:

```
/home/u234997903/public_html/pindoramarpg
```

Anote o **caminho relativo** ao home do usuário FTP (sem o `/home/u…/`
no começo). Para o exemplo acima, fica:

```
domains/coletivopindorama.com.br/public_html/pindoramarpg
```

Esse é o valor que vai no secret `HOSTINGER_TARGET_DIR`.

> **Atalho recomendado:** crie no hPanel uma **conta FTP adicional
> escopada diretamente nessa pasta** (Arquivos → Contas FTP → Criar
> conta FTP → "Diretório" = a pasta do subdomínio). Aí o
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
| `HOSTINGER_TARGET_DIR` | ✅ | Pasta remota do subdomínio (relativa ao home FTP) ou `.` se a conta já estiver escopada | `domains/coletivopindorama.com.br/public_html/pindoramarpg` |

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

## 5. Testar o subdomínio

Acesse no navegador (substitua o subdomínio se for outro):

- `https://pindoramarpg.coletivopindorama.com.br/` → deve cair em
  `index.php` (homepage do sistema).
- `https://pindoramarpg.coletivopindorama.com.br/register.php` → form
  de cadastro.
- `https://pindoramarpg.coletivopindorama.com.br/login.php` → form de
  login.
- Verifique no DevTools que `assets/css/*` e `assets/js/*` carregam
  com **200** (todos os caminhos do projeto são relativos, então
  funcionam em qualquer raiz — domínio, subdomínio ou subdiretório).

Se aparecer erro de banco, é hora de:

- importar as migrations (`migrations/001…`) no MySQL da Hostinger;
- criar `config.php` direto pelo gerenciador de arquivos (template no
  `DEPLOY-HOSTINGER.md`). Esse arquivo **não** é versionado nem
  enviado pelo workflow.

---

## 6. Coexistência com o site principal

- O workflow **não apaga arquivos remotos** (sem `--delete`/`--mirror`
  destrutivo). Só envia/atualiza os arquivos do projeto.
- O destino é a pasta exclusiva do subdomínio. Nada do
  `coletivopindorama.com.br/` (site principal) nem de outros
  subdomínios é tocado.
- Os caminhos sensíveis (`config.php`, `uploads/**`, estados de
  runtime) estão na lista de exclusão do `mirror`, então não sobem
  nem competem com o que já existe no servidor.

---

## 7. Troubleshooting rápido

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
