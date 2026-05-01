# Regras de Negócio — Pindorama Ficha

Sistema de fichas de personagem para RPG de fantasia brasileira (compatível com Tormenta20), com ambientação Pindorama.

---

## 1. Domínio e Entidades

### 1.1 Personagem

Um personagem é composto por:

- **Identificação**: `participante` (jogador), `personagem` (nome), `personagem_imagem` (avatar opcional).
- **Características de origem**: `ancestralidade`, `origem`, `divindade` (opcional).
- **Classe(s)**: uma ou mais classes (multiclasse), cada uma com seu próprio nível.
- **Atributos primários (6)**: Força (FOR), Destreza (DES), Constituição (CON), Inteligência (INT), Sabedoria (SAB), Carisma (CAR).
- **Recursos**: Pontos de Vida (PV), Pontos de Magia (PM), Pontos de Poder (PP). Cada um possui valor total e atual.
- **Defesa**: composta por `defesa_destreza`, `defesa_armadura`, `defesa_escudo`, `defesa_outros` e `defesa_total` (soma).
- **Perícias**: 29 perícias com estado de treinamento.
- **Poderes**: poderes de classe, poderes gerais, poderes de origem e poderes divinos.
- **Equipamento**: armas, armaduras, escudos, itens, dinheiro, carga.

### 1.2 Modelo de Dados (tabelas principais)

- `fichas` — registro principal (atributos, PV/PM/PP, defesa, classe primária, nível, etc.).
- `ficha_classes` — suporte a multiclasse (`ficha_id`, `classe_id`, `nivel`, `ordem`).
- `ficha_poderes` — poderes do personagem (`ficha_id`, `classe_id`, `poder_id`, `tipo` ∈ {`classe`, `geral`}).
- Coluna `origem_beneficios` (JSON) — registra as 2 escolhas de benefício de origem.

---

## 2. Ancestralidades

Ancestralidade representa a herança racial/cultural do personagem. **É escolhida na criação e não pode ser alterada.**

### 2.1 Regras gerais

- Cada ancestralidade concede **traços ancestrais** automáticos: bônus passivos, ataques especiais, habilidades únicas.
- Os traços não são escolhidos — são concedidos integralmente.
- Algumas ancestralidades possuem condições especiais (tamanho pequeno, voo, visão no escuro, etc.).

### 2.2 Exemplos

- **Arajubá**: Asas (voo a 12m gastando 1 PM/rodada), Garras Afiadas (ataque 1d6 perfurante por 1 PM, 1×/rodada), Espreitador (+2 em Percepção e Vontade).
- **Candango**: Sobrevivente Implacável (+2 em Fortitude e Sobrevivência), Espelunqueiro (visão no escuro, +2 Percepção, deslocamento de escalada), Pequenos Ligeiros (tamanho Pequeno, deslocamento 9 m, poder Aparência Inofensiva).

Ancestralidades disponíveis incluem: Arajubá, Candango, Curinqueã, Florrata, Goiazi, Iakaré, Kai'porah, Muiraquitã, Oiára, Orumerê, Povo Caucazi, Saci, Humano e outras.

---

## 3. Origens

Representa o passado pré-aventureiro do personagem.

### 3.1 Estrutura de uma origem

Cada origem define:

- **Modificadores de atributo**: +2 pontos para distribuir entre os atributos listados (ou +1 em cada). Opcionalmente, é possível aceitar -2 em um atributo não listado para ganhar +1 ou +2 em outros.
- **Itens iniciais**: equipamentos, animais e/ou dinheiro concedidos na criação.
- **Lista de perícias**: perícias elegíveis para treinamento via benefício.
- **Poder de origem exclusivo**: poder único disponível somente para personagens daquela origem.

### 3.2 Regra dos benefícios (obrigatória)

Na criação, o personagem escolhe **exatamente 2 benefícios** dentre as opções da sua origem. Combinações válidas:

- 2 perícias da lista; **ou**
- 1 perícia + 1 poder da lista; **ou**
- 2 poderes da lista.

**Validação** (`validarBeneficiosOrigem`):
- Máximo de 2 benefícios.
- Cada benefício do tipo `pericia` deve estar na lista de perícias da origem.
- Cada benefício do tipo `poder` deve estar na lista de poderes da origem.

### 3.3 Exemplos de origens

- **Amigo dos Animais** — +2 em CAR/SAB; companheiro animal; perícias Adestramento e Cavalgar; poder *Amigo Especial*.
- **Aristocrata** — +2 em CAR/INT; joia da família (M$ 300) + traje de corte; perícias Diplomacia/Enganação/Nobreza.
- **Soldado** — +2 em CON/FOR/SAB; armas e uniforme; perícias Fortitude/Guerra/Luta/Pontaria; poder *Influência Militar*.

---

## 4. Classes

### 4.1 Regras gerais

- Existem 12+ classes: Arcanista, Artífice, Brincante, Caçador, Cangaceiro, Fanfarrão, Feiticeiro, Guerreiro, Inquisidor, Lutador, Malandro, Rústico, Sacerdote, Xamã.
- Cada classe possui uma tabela `habilidadesPorNivel` (1–20) que descreve as habilidades concedidas em cada nível.
- A entrada `poder-de-{classeId}` em um nível indica que a classe concede um **slot de poder de classe** naquele nível.

### 4.2 Multiclasse

- Um personagem pode possuir múltiplas classes simultaneamente. Cada classe progride com seu próprio nível independente.
- **Nível total do personagem = soma dos níveis em todas as classes.**
- A primeira classe (ordem 0) é considerada a classe primária e replicada em `fichas.classe`/`fichas.nivel` por compatibilidade.
- Não há limite explícito de quantidade de classes.

### 4.3 Progressões e habilidades características (exemplos)

**Arcanista**
- Magias arcanas a partir do 1º círculo.
- Conhecimento Místico para aprender magias adicionais.
- Círculos: 1º (N1), 2º (N5), 3º (N9), 4º (N13), 5º (N17).
- Slots de poder de classe em ~13 níveis (2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20).

**Guerreiro**
- Ataque Especial: bônus +4 (N1), +8 (N5), +12 (N9), +16 (N13), +20 (N17).
- Duração (N3), Ataque Extra (N6), Campeão (N20).

**Malandro**
- Ataque Furtivo progressivo: 1d6 (N1), +1d6 a cada 2 níveis ímpares até 10d6 (N19).
- Evasão (N2), Esquiva Sobrenatural (N4), Olhos-nas-Costas (N8), Evasão Aprimorada (N10).

**Lutador**
- Briga (dano desarmado): 1d6 (N1), 1d8 (N5), 1d10 (N9), 2d6 (N13), 2d8 (N17), 2d10 (N20).
- Casca Grossa (redução de dano): CON (N3), CON+1 (N7), CON+2 (N11), CON+3 (N15), CON+4 (N19).
- Golpe Relâmpago (N1), Golpe Cruel (N5), Golpe Violento (N9).

**Sacerdote**
- Magias divinas a partir do 1º círculo.
- Canalizar Energia: 1d6 (N2), 2d6 (N6), 3d6 (N10), 4d6 (N14), 5d6 (N18).
- Círculos: 1º (N1), 2º (N5), 3º (N9), 4º (N13), 5º (N17).

---

## 5. Poderes

Sistema modular de habilidades adquiríveis. Existem **cinco fontes de poder**:

1. **Poderes de classe** — em slots `poder-de-{classeId}` ganhos por nível.
2. **Poderes gerais** — comprados com PP, distribuídos por categorias.
3. **Poderes de origem** — exclusivos da origem do personagem (≈35 catalogados).
4. **Poderes divinos** — concedidos pela divindade, sem custo de PP.
5. **Poderes de magia** — subtipo de poder geral, exigem capacidade de conjurar.

### 5.1 Categorias de poderes gerais

- **Combate** — aprimoramentos de ataque, armadura, técnicas defensivas.
- **Destino** — sorte, rerolagens, manipulação de chance.
- **Magia** — aprimoramentos de magia (exigem o conjurador).
- **Divinos** — poderes ligados a divindades específicas.
- **Origem** — exclusivos por origem.

### 5.2 Slots de poder de classe

```
Para cada classe do personagem:
  Para cada nível alcançado:
    Se habilidades[nível] contém "poder-de-{classeId}":
      slotsGanhos++
  slotsUsados = nº de poderes onde tipo='classe' E classe=classeId
  slotsPendentes = max(0, slotsGanhos - slotsUsados)
```

Implementado em `getSlotsDePoderDeClasseDisponiveis()` em [lib/personagem.php](lib/personagem.php).

### 5.3 Economia de PP

- **PP total = (Nível total do personagem) − 1.**
- N1 → 0 PP, N2–3 → 1–2 PP, N5–6 → 4–5 PP, N20 → 19 PP.
- Cada poder geral custa 1 PP (salvo regras particulares).
- Poderes divinos não consomem PP.

### 5.4 Pré-requisitos de poder

Os pré-requisitos são estruturados (`avaliarPrerequisitos` em [lib/poderes.php](lib/poderes.php)) e podem ser:

- `nivel_classe` — exige nível X em uma classe específica.
- `poder` — exige a posse de outro poder.
- `nivel_personagem` — exige nível total mínimo.
- `atributo` — exige valor mínimo em um atributo (ex.: FOR ≥ 4).
- `pericia` — exige treinamento em uma perícia (parsing de texto natural).
- `manual` — texto livre que demanda confirmação manual.

A normalização (`normalizarTextoPoder`) reconhece padrões como `FOR4`, "Treinado em Luta", "Devoto de Aelohim".

### 5.5 Aquisição de um poder

Algoritmo (`podeAdquirirPoder`):

1. Se o personagem já possui o poder → **negar** (duplicidade).
2. Se algum pré-requisito estruturado não é atendido → **negar**.
3. Se o poder é da categoria `divinos`:
   - Limite = 1 (ou 2 se possuir a habilidade `devoto-fiel`).
   - Se já atingiu o limite → negar.
   - Caso contrário → permitir, **sem custo de PP**.
4. Se PP atual ≤ 0 → negar.
5. Caso contrário → permitir, debitando 1 PP.

### 5.6 Exemplos de poderes

- **Arcano de Batalha** (Arcanista) — soma INT no dano de magias.
- **Deflexão Arcana** (Arcanista) — gastar até INT em PM como reação para +1 Defesa ou +1 em testes de resistência por PM.
- **Mestre em Escola** (Magia) — requer *Especialista em Escola* + N8; reduz custo das magias da escola em 1 PM.
- **Ataque Arterial** (Malandro) — gastar 1 PM ao acertar ataque furtivo deixa o alvo sangrando.
- **Oportunismo** (Malandro) — N6+; reação a dano em aliado adjacente: 2 PM para um ataque corpo a corpo.

---

## 6. Divindades

### 6.1 Estrutura

Cada divindade possui: nome, saudação, descrição, crenças, símbolo, energia (`retrativa`, `expansiva`, `qualquer`), arma preferida, lista de devotos permitidos (raças/classes), lista de poderes divinos permitidos, obrigações.

20 divindades catalogadas (Aelohim, Anhanga, Axumewá, etc.).

### 6.2 Devoção

- A escolha da divindade é **irrevogável** salvo permissão do mestre.
- Apenas raças/classes presentes na lista `devotos` podem reverenciar a divindade.
- **Mameluques e Sacerdotes** podem reverenciar qualquer divindade.
- A devoção pode ser escolhida na criação ou em uma evolução de nível.

### 6.3 Poderes divinos

- A divindade concede **1 poder divino** (limite de 2 com a habilidade *Devoto Fiel*).
- Custo: 0 PP.
- Cada poder de classe disponível pode ser **trocado** por um poder do deus.

### 6.4 Obrigações

- Quebrar uma obrigação faz o personagem **perder todos os PM** até o próximo dia.
- Segunda infração na mesma aventura → recuperação de PM exige penitência.
- Exemplos:
  - **Aelohim**: não aliar-se a outras divindades; seguir hierarquia.
  - **Axumewá**: agradecer a deusa ao ver a própria imagem; tentar encantar antes de combater; não atacar exceto em defesa.
  - **Anhanga**: não causar dano a criaturas indefesas (caça permitida com oferenda de tabaco).

---

## 7. Magias

### 7.1 Regras gerais

- Magias possuem **círculo (1–5)** e **escola** (Abjuração, Adivinhação, Conjuração, Encantamento, Evocação, Ilusão, Necromancia, Transmutação).
- Custo em PM (modificável por talentos/poderes).
- Classes conjuradoras: Arcanista, Feiticeiro, Brincante, Sacerdote, Xamã.

### 7.2 Liberação de círculos por classe

| Classe | 1º | 2º | 3º | 4º | 5º |
|---|---|---|---|---|---|
| Arcanista | N1 | N5 | N9 | N13 | N17 |
| Feiticeiro | N1 | N5 | N9 | N13 | N17 |
| Sacerdote | N1 | N5 | N9 | N13 | N17 |
| Brincante | N1 | N6 | N10 | N14 | N18 |
| Xamã | N1 | N6 | N10 | N14 | N17 |

### 7.3 Poderes que afetam magias

- **Conhecimento Místico** — aprende 2 magias adicionais de qualquer círculo acessível.
- **Especialista em Escola** — +2 na CD para resistir às magias da escola.
- **Mestre em Escola** — −1 PM no custo das magias da escola.
- **Magia Acelerada** — pagar 2 PM para conjurar magia de ação completa como ação padrão.

---

## 8. Perícias

### 8.1 As 29 perícias

| Perícia | Atributo | Só treinada | Penal. armadura |
|---|---|---|---|
| Acrobacia | DES | Não | Sim |
| Adestramento | CAR | Sim | Não |
| Atletismo | FOR | Não | Não |
| Atuação | CAR | Sim | Não |
| Cavalgar | DES | Não | Não |
| Conhecimento | INT | Sim | Não |
| Cura | SAB | Não | Não |
| Diplomacia | CAR | Não | Não |
| Enganação | CAR | Não | Não |
| Fortitude | CON | Não | Não |
| Furtividade | DES | Não | Sim |
| Guerra | INT | Sim | Não |
| Iniciativa | DES | Não | Não |
| Intimidação | CAR | Não | Não |
| Intuição | SAB | Não | Não |
| Investigação | INT | Não | Não |
| Jogatina | CAR | Sim | Não |
| Ladinagem | DES | Sim | Sim |
| Luta | FOR | Não | Não |
| Misticismo | INT | Sim | Não |
| Nobreza | INT | Sim | Não |
| Ofício | INT | Sim | Não |
| Percepção | SAB | Não | Não |
| Pilotagem | DES | Sim | Não |
| Pontaria | DES | Não | Não |
| Reflexos | DES | Não | Não |
| Religião | SAB | Sim | Não |
| Sobrevivência | SAB | Não | Não |
| Vontade | SAB | Não | Não |

### 8.2 Fórmula do bônus de perícia

```
Bônus = (Nível total / 2) + Atributo-Chave + Bônus de Treinamento
```

Bônus de treinamento por faixa de nível:
- N1–6 → +2
- N7–14 → +4
- N15+ → +6
- Não treinado → 0 (e perícias "Só treinada" não podem ser usadas).

### 8.3 Fontes de treinamento

1. Lista da classe.
2. Atributo Inteligência (concede `INT` perícias adicionais).
3. Origem (até 2 perícias via benefícios).
4. Poder *Treinamento em Perícia* (poder geral).

---

## 9. Combate e Equipamento

### 9.1 Defesa

```
defesa_total = defesa_destreza + defesa_armadura + defesa_escudo + defesa_outros
```

Tipicamente: `10 + mod. DES + armadura + escudo + outros`.

### 9.2 Ataques

- **Luta** — testes de ataque corpo a corpo (FOR).
- **Pontaria** — testes de ataque à distância (DES).
- **CD do ataque** = Defesa do alvo.

### 9.3 Equipamentos

- **Armas**: simples, marcial, exótica — cada uma com dano e propriedades próprias.
- **Armaduras**: bônus de defesa, possíveis penalidades em perícias com penalidade de armadura.
- **Escudos**: bônus de defesa adicional.
- **Equipamento geral**: ferramentas, suprimentos, itens com custo monetário (M$).

### 9.4 Carga e dinheiro

- `carga` — peso total carregado.
- `dinheiro` — total monetário (M$).

---

## 10. Criação e Persistência da Ficha

### 10.1 Fluxo de criação

1. Informar `participante` e `personagem`.
2. Selecionar **ancestralidade**.
3. Selecionar **origem**.
4. Distribuir os 6 atributos base.
5. Selecionar **classe inicial** (e níveis adicionais para multiclasse, se aplicável).
6. Escolher os **2 benefícios da origem**.
7. Marcar perícias treinadas adicionais (com base em INT e fontes adicionais).
8. Calcular PV/PM/PP totais.
9. Selecionar **divindade** (se permitido pela raça/classe).
10. Selecionar **poderes** dentro dos slots disponíveis.
11. Salvar a ficha.

### 10.2 Salvamento ([salvar-ficha.php](salvar-ficha.php))

- POST com formulário (campos da `fichas`, multipart se houver imagem).
- Resposta JSON: `{ success, id, message, personagem_imagem }`.
- Operação **transacional** (BEGIN/COMMIT/ROLLBACK).
- Upload de imagem com validação de tipo (JPG, PNG, WEBP, GIF) e tamanho.

Campos persistidos em `fichas`:
```
participante, personagem, ancestralidade, origem, classe, nivel,
divindade, personagem_imagem,
forca, destreza, constituicao, inteligencia, sabedoria, carisma,
pv_total, pv_atuais, pm_total, pm_atuais, pp_total, pp_atuais,
origem_beneficios,
defesa_total, defesa_destreza, defesa_armadura, defesa_escudo, defesa_outros,
armadura_escudo, proficiencias, habilidades_magias, equipamentos,
ataques, pericias, dinheiro, carga
```

Multiclasse e poderes são serializados em JSON e gravados nas tabelas dedicadas:
- `classes_personagem` → `ficha_classes` (com campo `ordem`).
- `poderes` → `ficha_poderes` (com `tipo` ∈ {`classe`, `geral`}).

### 10.3 Carregamento ([buscar-ficha.php](buscar-ficha.php))

- GET com `?id={fichaId}`.
- Retorna a ficha completa, incluindo arrays aninhados de classes e poderes.

### 10.4 Listagem ([listar-fichas.php](listar-fichas.php))

- Lista resumida de fichas para seleção/edição.

---

## 11. Migrações

- **001_multiclasse_poderes.sql** — cria `ficha_classes` e `ficha_poderes`, mantendo retrocompatibilidade com `fichas.classe`/`fichas.nivel`.
- **002_pp.sql** — adiciona `pp_total`/`pp_atuais` e instala a regra **PP = Nível − 1**.
- **003_origem_beneficios.sql** — adiciona coluna `origem_beneficios` (JSON com `[{tipo, nome|id}, ...]`).

---

## 12. Validações Centrais

### 12.1 Benefícios de origem

```
Se nº de benefícios > 2 → erro "máximo 2 benefícios"
Para cada benefício:
  Se tipo = pericia E nome ∉ origem.pericias → erro
  Se tipo = poder    E id   ∉ origem.poderes  → erro
```

### 12.2 Pré-requisitos de poder

Retorna `{ atende: bool, faltando: [{ tipo, texto, atendido }] }`.

- Pré-requisitos estruturados são avaliados automaticamente.
- Pré-requisitos manuais (texto livre) retornam `atendido = null` para confirmação humana.

### 12.3 Seleção de divindade

- A raça ou a classe primária do personagem deve constar na lista de devotos da divindade (ou ser Mameluque/Sacerdote).

### 12.4 Aquisição de poder

(Ver §5.5.) Validações cumulativas: duplicidade, pré-requisitos, limite divino, disponibilidade de PP/slot.

---

## 13. Valores Calculados (Derivados)

| Valor | Fórmula |
|---|---|
| Nível total | Soma dos níveis em todas as classes |
| PP total | Nível total − 1 |
| Slots de poder de classe | Contagem de `poder-de-{classeId}` em `habilidadesPorNivel` até o nível atual |
| Bônus de perícia | (Nível / 2) + Atributo + Bônus de treinamento |
| Defesa total | DES + Armadura + Escudo + Outros |
| Limite de poderes divinos | 1 (ou 2 com *Devoto Fiel*) |
| Círculos de magia | Determinados pelos thresholds de nível por classe |

---

## 14. Restrições e Invariantes

1. **Ancestralidade**: imutável após a criação.
2. **Divindade**: irrevogável salvo permissão de mestre.
3. **Origem**: exatamente 2 benefícios; ambos da lista da origem.
4. **Multiclasse**: sem limite explícito; cada classe progride independentemente.
5. **Perícias só treinadas**: não usáveis sem treinamento.
6. **Penalidade de armadura**: aplica-se apenas às perícias marcadas como tal.
7. **Poderes**: sem duplicidade; pré-requisitos obrigatórios; limite divino respeitado; consome PP exceto poderes divinos.
8. **Recursos atuais (PV/PM/PP)**: nunca excedem seus respectivos totais.
9. **Devoção compatível**: a divindade deve aceitar a raça/classe (ou o personagem deve ser Mameluque/Sacerdote).
