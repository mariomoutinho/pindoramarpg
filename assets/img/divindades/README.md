# Imagens das Divindades

As imagens aqui dentro são carregadas automaticamente pelo picker de
divindades em `ficha.php` (modal "Selecionar Divindade"). O nome do
arquivo precisa ser **exatamente o `id` da divindade** em
`data/divindades.json`.

## Convenção

- **Formato principal:** `<id>.webp` (preferível, menor)
- **Fallback:** `<id>.png` (usado se o `.webp` não existir)
- **Sem fallback:** mostra o placeholder `?` no espaço da imagem
- **Proporção sugerida:** 3:4 retrato (ex.: 600×800)
- **Recorte:** o picker usa `object-fit: cover; object-position: center top`,
  então o rosto/símbolo principal deve ficar no terço superior

A cadeia de fallback é definida em
`assets/js/entity-picker.js` → `initDivindades()`.

## IDs esperados (20)

| ID                 | Nome             |
| ------------------ | ---------------- |
| `aelohim`          | Aelohim          |
| `anhanga`          | Anhangá          |
| `anhum`            | Anhum            |
| `axumewa`          | Axumewá          |
| `caaporia`         | Caaporia         |
| `exus`             | Exus             |
| `guianala`         | Guianala         |
| `gumede`           | Gumedé           |
| `iacyr`            | Iacyr            |
| `kiantomere`       | Kiantomerê       |
| `kuaracyr`         | Kuaracyr         |
| `mice`             | Micê             |
| `mondja`           | Mondjá           |
| `namburuk`         | Namburuk         |
| `odessi`           | Odessi           |
| `ruach-hakodechi`  | Ruach Hakodechi  |
| `sain`             | Sain             |
| `tessa`            | Tessa            |
| `tumpa`            | Tumpá            |
| `yexua`            | Yexuá            |

## Como subir uma imagem nova

1. Salve o arquivo como `<id>.webp` (ou `.png`) nesta pasta.
2. Commit + push no repositório `pindoramarpg`.
3. O workflow de deploy publica no subdomínio
   `pindoramarpg.coletivopindorama.com.br` em poucos minutos.

Não é necessário editar nenhum código — o picker descobre a imagem
pelo nome do arquivo.
