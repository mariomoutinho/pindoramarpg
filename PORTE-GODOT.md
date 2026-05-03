# Porte para Godot — Especificação de Comportamento

Spec de UX e lógica reativa do Pindorama Ficha pensada para **porte em Godot 4**. Foco no que o usuário pediu: **autopreenchimentos, seções colapsáveis, hovers/tooltips, contadores e consumo, traços que alteram outros campos, e cascatas de regras**. Complementa [REGRAS-DE-NEGOCIO.md](REGRAS-DE-NEGOCIO.md) (regras do RPG) e [REGRAS-DE-CODIGO.md](REGRAS-DE-CODIGO.md) (arquitetura técnica).

---

## 0. Modelo de Estado e Princípio Reativo

### 0.1 Estado central (single source of truth)

Em Godot, modele o personagem como um único `Resource` ou `Dictionary` aninhado:

```gdscript
# CharacterData.gd
class_name CharacterData extends Resource

@export var identidade : Dictionary       # { participante, personagem, ancestralidade, origem, divindade, imagem }
@export var classes    : Array            # [ { classe_id, nivel } ]  ← multiclasse-ready
@export var atributos  : Dictionary       # { for, des, con, int, sab, car }
@export var recursos   : Dictionary       # { pv_total, pv_atuais, pm_total, pm_atuais, pp_total, pp_atuais }
@export var defesa     : Dictionary       # { destreza, armadura, escudo, outros }
@export var pericias   : Dictionary       # { "Acrobacia": { treinada, outros, fonte_treino }, ... }
@export var poderes    : Array            # [ { id, origem: "classe"|"geral"|"divinos"|"origem"|"ancestralidade", classe_id? } ]
@export var magias     : Array            # [ { id, circulo, origem } ]
@export var equipamentos : Array          # [ { nome, quantidade, espacos, tipo, municao? } ]
@export var ataques      : Array          # [ { nome, bonus, dano, critico, alcance, fonte? } ]
@export var origem_beneficios : Array     # [ { tipo, id|nome } ] (max 2)
@export var imune_sobrecarga : bool = false
@export var substituicoes_atributo : Array = []  # [ { pericia, atributo, modo } ]
```

### 0.2 Padrão reativo

Não usar cadeia de eventos `change → change → change` (gera loops). Em vez disso:

```gdscript
signal character_updated(field: String)

# após qualquer alteração:
emit_signal("character_updated", "atributos")

# cada panel escuta o sinal e recomputa o que lhe interessa.
# uma função coordenadora roda recálculos em ordem fixa:
func recalcular_tudo() -> void:
    _recalcular_recursos()       # PV, PM
    _recalcular_pericias()       # totais por atributo
    _recalcular_defesa()         # 10 + DES + ...
    _recalcular_carga()          # peso, sobrecarga
    _recalcular_magias_disponiveis()
    _reavaliar_prerequisitos_poderes()
```

> Esse é o padrão `atualizarTudoAutomatico()` do JS original ([assets/js/ficha.js](assets/js/ficha.js)) — atualização em lote, em vez de cascata reativa.

---

## 1. Autopreenchimentos

### 1.1 Total de perícia

```
TOTAL = floor(nivel/2) + valor_atributo + bonus_treino + outros

bonus_treino =
  0 se NÃO treinada
  2 se nivel ∈ [1..6]
  4 se nivel ∈ [7..14]
  6 se nivel ≥ 15
```

**Disparado quando muda:** `nivel`, qualquer atributo, checkbox treinada, ou campo `outros`.

**Substituição de atributo** (ex: traço Pequeno Enganador): se a perícia tem entrada em `substituicoes_atributo`, usar o **maior** entre o atributo original e o substituto:

```gdscript
func _atributo_efetivo(pericia: String) -> int:
    var base_attr = PERICIA_ATRIBUTO[pericia]   # tabela fixa
    var base_val = atributos[base_attr]
    for sub in substituicoes_atributo:
        if sub.pericia == pericia:
            var sub_val = atributos[sub.atributo]
            return max(base_val, sub_val) if sub.modo == "maior" else sub_val
    return base_val
```

### 1.2 PV / PM

```
PV_TOTAL = pv_inicial(classe) + (nivel - 1) * pv_por_nivel(classe) + (constituicao * nivel)
PM_TOTAL = pm_por_nivel(classe) * nivel
```

`pv_inicial`/`pv_por_nivel`/`pm_por_nivel` vêm do catálogo da classe. Para multiclasse, somar contribuições por classe.

**Sincronização inteligente do "atual"** (preserva edição manual):

```
se PV_ATUAL == PV_TOTAL_anterior  ou  PV_ATUAL == 0  ou  PV_ATUAL > PV_TOTAL_novo:
    PV_ATUAL = PV_TOTAL_novo
senão:
    preserve PV_ATUAL (usuário tomou dano e não quer reset)
```

Guarde `_ultimo_pv_total_auto` para detectar a diferença.

### 1.3 PP (Pontos de Poder)

```
PP_TOTAL = max(0, nivel_total - 1)
```

Decrementa ao adquirir poder geral; incrementa ao remover. Poder divino custa **0 PP**.

### 1.4 Defesa

```
DEFESA_TOTAL = 10 + DEX + bonus_armadura + bonus_escudo + outros
```

`bonus_armadura` é auto-preenchido ao selecionar armadura no autocomplete (lê `item.bonus` do catálogo).

### 1.5 Perícias treinadas obrigatórias da classe

Ao selecionar uma classe, marcar (não desmarcar) as perícias obrigatórias:

| Classe | Perícias auto-treinadas |
|---|---|
| Arcanista | Misticismo, Vontade |
| Artífice | Ofício, Vontade |
| Brincante | Atuação, Reflexos |
| Caçador | Sobrevivência |
| Cangaceiro | Reflexos |
| Fanfarrão | Reflexos |
| Feiticeiro | Misticismo, Vontade |
| Guerreiro | Fortitude |
| Inquisidor | Luta, Vontade |
| Lutador | Fortitude, Luta |
| Malandro | Ladinagem, Reflexos |
| Rústico | Fortitude, Luta |
| Sacerdote | Religião, Vontade |
| Xamã | Sobrevivência, Vontade |

Marque `pericias[X].fonte_treino = "classe"` para distinguir de treino manual.

### 1.6 ½ Nível e bônus de treino — recálculo por mudança de nível

Sempre que `nivel` muda → recompute todas as perícias.

---

## 2. Seções Colapsáveis

### 2.1 Padrão geral

Cada painel tem um botão de "recolher" (chevron `▾`) e um container de conteúdo:

```gdscript
# CollapsiblePanel.gd
extends VBoxContainer

@export var titulo: String = ""
@export var iniciar_recolhido: bool = true
@onready var seta = $Header/Toggle
@onready var conteudo = $Content

var recolhido: bool

func _ready():
    recolhido = iniciar_recolhido
    _aplicar()
    seta.pressed.connect(_alternar)

func _alternar():
    recolhido = not recolhido
    _aplicar()

func _aplicar():
    conteudo.visible = not recolhido
    seta.text = "▸" if recolhido else "▾"
```

### 2.2 Estado inicial dos painéis (default no carregamento)

| Painel | Início |
|---|---|
| **Perícias** | recolhido |
| **Magias** | recolhido |
| **Origem** | recolhido |
| **Divindade** | recolhido |
| **Poderes de Classe** | recolhido |
| **Poderes Gerais** | recolhido |
| **Atributos** | expandido |
| **Recursos (PV/PM/PP)** | expandido |
| **Defesa** | expandido |
| **Equipamentos** | expandido |
| **Ataques** | expandido |
| **Traços Ancestrais** | expandido |

### 2.3 Subseções tipo `<details>`

Listas dentro de painéis (ex.: "Magias disponíveis para escolha", "Perícias disponíveis da origem") iniciam **abertas** e usam o mesmo padrão de toggle. Em Godot, use um `Foldable` ou `AccordionItem`.

---

## 3. Hovers / Tooltips

### 3.1 Tooltip de autocomplete (item de catálogo)

**Disparo:** mouse entra em sugestão da lista (delay 200–400ms).
**Posicionamento:** preferencialmente à direita do dropdown; se sem espaço → esquerda → abaixo.
**Fechamento:** mouse sai da sugestão (150ms delay) ou outra é hovered.

**Conteúdo (estrutura):**

```
┌─────────────────────────────┐
│ Nome do item        +3 Def  │  (header)
├─────────────────────────────┤
│ Defesa:        +3           │
│ Penalidade:    -2           │
│ Espaços:       3            │
│ Tipo:          Pesada       │
├─────────────────────────────┤
│ Descrição em texto livre... │
└─────────────────────────────┘
```

Em Godot:

```gdscript
# Tooltip.gd: PopupPanel
@onready var timer = Timer.new()  # 350ms

func _on_item_hover(item: Dictionary):
    timer.start(0.35)
    timer.timeout.connect(func(): _mostrar(item), CONNECT_ONE_SHOT)

func _on_item_unhover():
    timer.stop()
    await get_tree().create_timer(0.15).timeout
    hide()
```

### 3.2 Long-press (toque) → tooltip

Em desktop com toque (ou WSL com touchscreen): toque longo (500ms) abre tooltip; arrastar/soltar cancela.

### 3.3 Modal de detalhe (poder / traço / magia)

**Disparo:** clique em uma "tag" ou card.
**Conteúdo:** título, descrição completa, lista de pré-requisitos com indicador (✓ verde / ✗ vermelho / ? amarelo para manuais), botões "Adquirir"/"Remover".
**Fechamento:** botão `×`, clique fora, Escape.

```
┌─────────────────────────────────────┐
│ Arcano de Batalha             ×     │
├─────────────────────────────────────┤
│ Quando lança uma magia, soma INT    │
│ na rolagem de dano.                 │
│                                     │
│ Pré-requisitos:                     │
│   ✓ Arcanista nível 1               │
│   ✗ Treinado em Misticismo          │
│   ? "Aprovação do mestre"           │
├─────────────────────────────────────┤
│      [ Remover ]   [ Adquirir ]     │
└─────────────────────────────────────┘
```

---

## 4. Contadores e Consumo

### 4.1 Barras de PV / PM

```
[████████░░░░░░░░░] 8 / 12      [-] [+]
```

- Botões `-`/`+` ajustam `valor_atual` em ±1 (clamp `[0, total]`).
- Largura preenchida = `atual / total * 100%`.
- Texto sobreposto: `"atual / total"`.

```gdscript
func adjust_resource(resource: String, delta: int):
    var atual = recursos[resource + "_atuais"]
    var total = recursos[resource + "_total"]
    recursos[resource + "_atuais"] = clamp(atual + delta, 0, total)
    emit_signal("character_updated", "recursos")
```

### 4.2 Munição

Itens do catálogo de armas podem ter um campo `municao`:

```json
{
  "nome": "Arco Longo",
  "dano": "1d8",
  "municao": { "tipo": "Flecha", "qtd": 1 }
}
```

**Comportamento:**
- Ao rolar ataque, antes do d20:
  1. Buscar item no inventário cujo `nome` casa com `municao.tipo` (matching fuzzy: "Flecha" ↔ "Flechas").
  2. Se quantidade < 1 → notificação **"Sem munição"** e cancela rolagem.
  3. Se ≥ 1 → decrementa `quantidade` e prossegue.
- Avisar quando restam ≤ 5.

```gdscript
func consumir_municao(ataque: Dictionary) -> bool:
    var tipo = ataque.get("municao", {}).get("tipo", "")
    if tipo.is_empty(): return true
    for item in equipamentos:
        if _matches(item.nome, tipo) and item.quantidade > 0:
            item.quantidade -= 1
            emit_signal("character_updated", "equipamentos")
            return true
    return false  # bloqueia rolagem
```

### 4.3 PP — gasto de poder geral

Adquirir poder geral → `pp_atuais -= custo` (geralmente 1).
Remover → `pp_atuais += custo`.
Bloquear botão "Adquirir" se `pp_atuais < custo` (exceto poderes divinos, que custam 0).

### 4.4 Equipamento — espaços e sobrecarga

```
ESPACOS_USADOS = Σ (item.quantidade * item.espacos)

LIMITE_NORMAL = 10 + (FOR ≥ 0 ? FOR * 2 : FOR)
LIMITE_MAXIMO = LIMITE_NORMAL * 2
```

**Estados:**

| Condição | Estado | Cor | Efeito |
|---|---|---|---|
| `usados ≤ limite_normal` | Carga normal | verde | nenhum |
| `limite_normal < usados ≤ limite_maximo` AND não imune | Sobrecarregado | amarelo | -5 em Acrobacia, Furtividade, Ladinagem, Atletismo; -3m deslocamento |
| `usados > limite_maximo` | Carga impossível | vermelho | bloquear ações; aviso ao usuário |
| imune por traço | Carga normal | verde | exibir "imune a sobrecarga por traço ancestral" |

**Aplicação da penalidade nas perícias:** quando entra em sobrecarga, somar `-5` no campo `outros` das 4 perícias afetadas, **preservando o valor manual original** num atributo separado `outros_pre_sobrecarga`. Ao sair de sobrecarga, restaurar.

### 4.5 Dinheiro

Campo livre (`"M$ 250"`). Não há subtração automática ao comprar (o jogador edita manualmente).

---

## 5. Traços que Alteram Outros Campos

Esta é a parte mais delicada do porte. Cada **traço** de uma ancestralidade pode aplicar **vários efeitos** simultâneos, e ao trocar de ancestralidade todos eles devem ser **revertidos** corretamente.

### 5.1 Schema do traço

```json
{
  "id": "asas",
  "nome": "Asas",
  "descricao": "Você pode pairar...",
  "bonus_atributos": [{ "atributo": "for", "valor": 2 }],
  "bonus_pericias":  [{ "pericia": "Percepção", "valor": 2 }],
  "bonus_defesa":    { "valor": 2, "max_armadura_pesada": 2, "atributo": null, "limitar_a_nivel": false },
  "concede_ataque":  { "nome": "Garras Afiadas", "dano": "1d6", "teste": "Luta", "critico": "x2" },
  "concede_pericias_treinadas": { "limite": 1, "lista": ["Percepção","Furtividade"] },
  "concede_magias":  { "limite": 2, "filtro": { "tipo": "Divina", "circulo": 1 } },
  "substituicao_atributos": [{ "pericia": "Atletismo", "atributo": "des", "modo": "maior" }],
  "imune_sobrecarga": false
}
```

### 5.2 Aplicação ao selecionar ancestralidade

Funções de sincronização (todas chamadas em sequência por `aplicar_ancestralidade(nova)`):

```gdscript
func aplicar_ancestralidade(nova: String):
    _limpar_efeitos_de_ancestralidade()      # remove tudo da anterior
    var anc = AncestralidadesDB.get(nova)
    for traco in anc.tracos:
        _aplicar_bonus_atributos(traco)
        _aplicar_bonus_pericias(traco)
        _aplicar_bonus_defesa(traco)
        _aplicar_substituicoes(traco)
        _aplicar_ataques_concedidos(traco)
        _aplicar_imunidade_sobrecarga(traco)
        # perícias/magias concedidas: abrem modal pro usuário escolher
    identidade.ancestralidade = nova
    recalcular_tudo()
```

### 5.3 Preservação de edição manual (importante!)

O JS original guarda `data-bonus-ancestralidade` em cada input. Em Godot, mantenha um dicionário paralelo:

```gdscript
var _bonus_aplicados = {
    "atributos": { "for": { "ancestralidade:asas": 2 } },
    "pericias":  { "Percepção": { "ancestralidade:asas": 2 } },
    "defesa":    { "ancestralidade:reptiliano": 2 },
}
```

Aplicar:
```gdscript
func _aplicar_bonus_atributo(atributo: String, valor: int, fonte: String):
    var antigo = _bonus_aplicados.atributos.get(atributo, {}).get(fonte, 0)
    atributos[atributo] = atributos[atributo] - antigo + valor
    _bonus_aplicados.atributos[atributo][fonte] = valor
```

Remover:
```gdscript
func _remover_bonus_atributo(atributo: String, fonte: String):
    var valor = _bonus_aplicados.atributos.get(atributo, {}).get(fonte, 0)
    atributos[atributo] -= valor
    _bonus_aplicados.atributos[atributo].erase(fonte)
```

Com isso, **trocar a ancestralidade** remove só os bônus daquela ancestralidade, sem mexer no que veio de outras fontes (origem, equipamento, etc.).

### 5.4 Bônus de defesa condicionais

Alguns traços têm regras complexas:

- `atributo: "constituicao"` → bônus = valor de CON.
- `limitar_a_nivel: true` → bônus = min(valor, nivel).
- `max_armadura_pesada: N` → se está usando armadura pesada, bônus = min(valor, N).

**Re-avaliar quando muda:** CON, nivel, ou armadura selecionada.

### 5.5 Ataques concedidos

Adicionar uma linha ao painel de Ataques com `fonte = "ancestralidade:asas"`. Marcar visualmente (ícone, cor) que veio de traço — não permite remoção manual; só some quando trocar de ancestralidade.

### 5.6 Perícias e magias concedidas (escolha do usuário)

Traços como "Conhecimento do Povo" concedem `concede_pericias_treinadas: { limite: 1 }`. Abrir modal para o usuário escolher; salvar a escolha em `pericias[X].fonte_treino = "ancestralidade:traco_id"`. Ao trocar de ancestralidade, desmarcar treinos cuja fonte é a ancestralidade antiga.

---

## 6. Cascatas de Regras

### 6.1 Cascata de mudança de nível

```
nivel mudou
  ↓
  recalcular meio_nivel = floor(nivel/2)         → afeta TODAS perícias
  recalcular bonus_treino                          → afeta perícias treinadas
  recalcular PV_total                              → smart-sync PV_atual
  recalcular PM_total                              → smart-sync PM_atual
  recalcular PP_total = nivel - 1
  liberar círculos de magia                        → habilita seleção de magias de círculo X
  liberar slots de poder de classe                 → habilita aquisição de novos poderes
  reavaliar TODOS pré-requisitos de poder          → atualiza ✓/✗ visual nos modais
  reavaliar bônus de defesa com `limitar_a_nivel`  → atualiza defesa
```

### 6.2 Cascata de mudança de classe

```
classe mudou
  ↓
  atualizar resumo da classe (descrição, atributo-chave)
  recalcular PV_total/PM_total com nova fórmula da classe
  marcar perícias treinadas obrigatórias da classe
  popular proficiências (texto descritivo)
  re-renderizar lista de poderes da classe
  configurar UI de magia se a classe for conjuradora
  reavaliar pré-requisitos de poder (alguns dependem de "Arcanista nível X")
```

### 6.3 Cascata de mudança de atributo

```
atributo X mudou
  ↓
  TODAS as perícias cujo atributo-chave é X (ou que tem substituição) recomputam total
  se X = DES → recompute defesa
  se X = CON → recompute PV_total (CON entra por nível) → smart-sync PV_atual
  se X = FOR → recompute LIMITE_NORMAL e LIMITE_MAXIMO → reavaliar status de carga
```

### 6.4 Cascata de mudança de equipamento

```
equipamento adicionado/removido/quantidade alterada
  ↓
  recompute ESPACOS_USADOS
  reavaliar status de carga
    se entrou em sobrecarga: aplicar -5 em Acrobacia/Furtividade/Ladinagem/Atletismo
    se saiu: restaurar
```

### 6.5 Cascata de seleção de armadura

```
armadura selecionada
  ↓
  atualizar display de stats da armadura (bonus, penalidade, espaços)
  defesa.armadura = item.bonus
  recompute defesa total
  reavaliar bônus de defesa por traço (alguns têm cap em armadura pesada)
  adicionar uma linha de equipamento "Armadura X" com os espaços do item
  reavaliar carga
```

---

## 7. Multiclasse

**Status atual no projeto web:** schema do banco suporta (tabelas `ficha_classes`/`ficha_poderes`), mas a UI é single-class. O backend salva multi se vier o JSON.

**Para Godot — implementação completa recomendada:**

```
Painel "Classes do Personagem":
  ┌─────────────────────────────────┐
  │ Classe Primária                 │
  │ [Arcanista ▾]   Nível: [5]      │
  │                                 │
  │ + Adicionar classe                │
  │                                 │
  │ Classe Secundária               │
  │ [Malandro ▾]    Nível: [3]      │
  │                                 │
  │ Nível total: 8                  │
  └─────────────────────────────────┘
```

**Regras agregadas:**
- `nivel_total = Σ classes[*].nivel`
- PV total = soma das contribuições (cada classe contribui com sua fórmula no nível dela)
- PM total = soma análoga
- Slots de poder de classe = soma das ocorrências de `poder-de-{classe_id}` em cada classe até seu nível
- Pré-requisitos `nivel_classe: X` continuam consultando a classe específica
- Pré-requisitos `nivel_personagem: X` consultam o nível total
- Seleção de magia: classe que concede a magia tem que ser conjuradora E ter o círculo desbloqueado **naquela classe**

---

## 8. Sistema de Poderes

### 8.1 Cinco fontes de poder

| Fonte | Custo PP | Limite | Fonte da lista |
|---|---|---|---|
| Classe | 0 | slots `poder-de-{classe}` por nível | `poderes.json[classe]` |
| Geral | 1 | PP disponível | `poderes-gerais.json` (5 categorias) |
| Divino | 0 | 1 (ou 2 com *Devoto Fiel*) | `divindades.json[deity].poderes` |
| Origem | 0 | até 2 (via benefícios) | `data/origens.json[origem].poderes` |
| Ancestral | 0 | concedido pelo traço | `ancestralidades.json[anc].tracos[].concede_*` |

### 8.2 Avaliação de pré-requisito

Tipos suportados (estruturados):

| `tipo` | Como avaliar |
|---|---|
| `nivel_classe` | nivel da classe específica ≥ pr.nivel |
| `nivel_personagem` ou `nivel` | nivel_total ≥ pr.nivel |
| `poder` | possui poder com pr.id |
| `atributo` | atributos[pr.atributo] ≥ pr.valor |
| `pericia` | pericias[pr.nome].treinada === true |
| `manual` | retornar `null` (precisa confirmação humana) |

Fallback de **texto livre** (regex):
- `\b(for|des|con|int|sab|car)\s*(-?\d+)\b` → atributo
- `^Treinado em (\w+)( e (\w+))?( ou (\w+))?` → perícias com AND/OR
- `^Devoto de (\w+)` → divindade do personagem

Retornar:
```gdscript
{
  "atende": bool,    # todos os estruturados foram OK
  "faltando": [
    { "tipo": String, "texto": String, "atendido": bool|null }
  ]
}
```

### 8.3 Slots de poder de classe

```gdscript
func slots_de_poder_disponiveis(classe_id: String) -> int:
    var classe = ClassesDB.get(classe_id)
    var meu_nivel = _nivel_da_classe(classe_id)
    var slots = 0
    for nv in range(1, meu_nivel + 1):
        var habs = classe.habilidadesPorNivel.get(str(nv), [])
        if "poder-de-" + classe_id in habs:
            slots += 1
    var ja_adquiridos = poderes.filter(func(p): return p.origem == "classe" and p.classe_id == classe_id).size()
    return max(0, slots - ja_adquiridos)
```

### 8.4 Aquisição

```gdscript
func pode_adquirir(poder: Dictionary) -> Dictionary:
    if _ja_possui(poder.id):
        return { "pode": false, "razao": "Já possui esse poder." }
    var pr = avaliar_prerequisitos(poder)
    if not pr.atende:
        return { "pode": false, "razao": "Pré-requisitos não atendidos." }
    if poder.categoria == "divinos":
        var limite = 2 if _possui_habilidade("devoto-fiel") else 1
        var divinos_atuais = poderes.filter(func(p): return p.origem == "divinos").size()
        if divinos_atuais >= limite:
            return { "pode": false, "razao": "Limite de poderes divinos atingido." }
        return { "pode": true, "razao": "" }   # custa 0 PP
    if recursos.pp_atuais < 1:
        return { "pode": false, "razao": "PP insuficiente." }
    return { "pode": true, "razao": "" }
```

---

## 9. Magias

### 9.1 Liberação de círculos

| Classe | Atributo | Círculos (desbloqueio por nível) | Iniciais | Ganho |
|---|---|---|---|---|
| Arcanista | INT | 1@1, 2@5, 3@9, 4@13, 5@17 | 4 | todo nível |
| Sacerdote | SAB | 1@1, 2@5, 3@9, 4@13, 5@17 | 3 | todo nível |
| Feiticeiro | CAR | 1@1, 2@5, 3@9, 4@13, 5@17 | 3 | nível ímpar |
| Brincante | CAR | 1@1, 2@6, 3@10, 4@14 | 2 | nível par |
| Xamã | SAB | 1@1, 2@6, 3@10, 4@14, 5@17 | 2 | nível par |

### 9.2 UI

```
┌── Magias ──────────────────── 3 / 5 ▾ ──┐
│  [✕ Bola de Fogo]  [✕ Sono]  [✕ Curar]   │  ← selecionadas (chips)
│                                          │
│  Escolha uma classe conjuradora...       │  ← se não tem
│                                          │
│  🔍 [Buscar magia...]   [Círculo: ▾]    │
│  ▾ Magias disponíveis para escolha       │  ← <details>
│      ☐ Mãos Flamejantes (1º) — 1 PM     │
│      ☐ Sono (1º) — 2 PM                 │
│      ...                                 │
└──────────────────────────────────────────┘
```

- Contador `selecionadas / limite` no header.
- Chips clicáveis abrem modal de detalhe; "✕" remove.
- Filtro por círculo restrito aos desbloqueados (outros aparecem cinza com tooltip "Desbloqueia no nível X").
- Custo em PM é informativo (não há subtração automática — usuário aciona o botão de gastar PM via barra).

### 9.3 Modal de magia

```
Nome • Tipo (Arcana/Divina) • Círculo X
Custo: 2 PM • Execução: 1 ação • Alcance: 9m
Alvo: 1 criatura • Resistência: Vontade reduz

[descrição completa]

[ Conjurar (gasta 2 PM) ]   [ Remover ]
```

Botão "Conjurar" verifica `pm_atuais ≥ custo` e debita.

---

## 10. Equipamento

### 10.1 Linha de equipamento

```
[Nome (autocomplete)]  [Qtd: 1]  [Esp: 1.0]  Total: 1.0  [✕]
```

- Autocomplete consulta `equipamentos-catalogo.php` (JSON com `nome`, `espacos`, `descricao`, `campos`).
- Total = `quantidade × espacos`.
- Tooltip ao passar mouse na sugestão (delay 350ms).

### 10.2 Slots de armadura e escudo

```
┌── Armadura ─────────────────┐  ┌── Escudo ──────────────────┐
│ [Nome (autocomplete)]        │  │ [Nome (autocomplete)]      │
│ Defesa: +6 │ Penal: -2 │ Esp: 4 │  │ Defesa: +2 │ Penal: 0 │ Esp: 1 │
└──────────────────────────────┘  └────────────────────────────┘
```

Ao selecionar:
1. Preenche stats no painel.
2. `defesa.armadura = item.bonus` (ou `defesa.escudo`).
3. Recalcula defesa.
4. Reavalia bônus de defesa por traço (cap em pesada).
5. Adiciona/atualiza linha de equipamento associada.

### 10.3 Detecção de armadura pesada

Ler `item.tipo == "pesada"` ou flag `secao` do catálogo. Cachear no Resource para evitar lookup repetido.

---

## 11. Perícias — UI

### 11.1 Linha de perícia

```
☐  [Acrobacia ▷]   Total: 5   ½N: 2   Atr: Des(+1)   Tre: 0   Out: [+2]
```

- Checkbox: treinada (alguns sem permissão de roll se não treinada).
- Botão `Acrobacia ▷`: clique rola d20 com animação (§11.3).
- `Total`, `½ Nível`, `Atr`, `Treino` → readonly.
- `Outros` → editável (somatório do bônus situacional + bônus de traço + penalidade de carga).

### 11.2 Perícias "só treinadas"

Não roláveis sem treino:

```
Adestramento, Atuação, Conhecimento, Guerra, Jogatina,
Ladinagem, Misticismo, Nobreza, Ofício, Pilotagem, Religião
```

Botão de roll fica desabilitado, com tooltip explicativo.

### 11.3 Animação de rolagem

```
┌─────────────────────┐
│  Teste de Perícia   │
│      Acrobacia      │
│                     │
│       ┌───┐         │
│       │ 17│         │  ← d20 roda mostrando números aleatórios
│       └───┘         │     (intervalo 80ms, duração ~1100ms)
│                     │
│  d20 (17) + per (5) │
│  Resultado: 22      │  ← borda verde se 20 (crítico), vermelha se 1
└─────────────────────┘
```

Em Godot: `AnimationPlayer` + `Tween` + `Timer`. Auto-fecha após 1s exibindo resultado.

---

## 12. Validações Inline (sem bloquear save)

Padrão visual: tudo é "advertência colorida", não popup bloqueante.

| Situação | Indicador |
|---|---|
| Sobrecarga | painel de carga em amarelo + nota explicativa |
| Carga impossível | painel em vermelho + bloqueio de algumas ações |
| Pré-req de poder não atendido | botão "Adquirir" desabilitado + ✗ vermelho na lista de prereqs |
| Círculo de magia bloqueado | item cinza + tooltip "Desbloqueia no nível X" |
| Perícia só treinada sem treino | botão de roll cinza + tooltip |
| 2 benefícios de origem ainda não escolhidos | header da seção com bordina vermelha + contador "0/2" |
| Multiclasse: classe primária vazia | aviso "Selecione uma classe" |
| PP < custo de poder geral | botão desabilitado |
| Limite divino atingido | botão "Adquirir" desabilitado nos demais poderes divinos |

---

## 13. Tabela-Resumo de Valores Derivados

Tudo isso é **calculado**, nunca persistido como source-of-truth (mas pode cachear):

| Valor | Fórmula | Re-disparado por |
|---|---|---|
| Nível total | Σ `classes[*].nivel` | mudança em qualquer `classes[*].nivel` |
| ½ Nível | `floor(nivel_total / 2)` | nível total |
| Bônus de treino | tabela `2/4/6` por faixa | nível total |
| PV total | classe + (nivel-1)*por_nivel + CON*nivel | classe, nivel, CON |
| PM total | por_nivel * nivel | classe, nivel |
| PP total | `max(0, nivel - 1)` | nivel |
| Defesa | 10 + DES + arm + esc + outros | DES, armadura, escudo, traços |
| Skill total | ½N + atr + treino + outros | nivel, atr, treino, outros |
| Limite carga | 10 + (FOR≥0 ? FOR*2 : FOR) | FOR |
| Status carga | comparação 3-vias | espaços usados, FOR, imune |
| Slots poder classe | conta `poder-de-{c}` em hab[1..nv] – adquiridos | classe.nivel, poderes |
| Círculos magia | tabela por classe + nível | classe, nivel |
| Limite poderes divinos | 1 ou 2 (Devoto Fiel) | habilidades |
| Pré-req `atende` | função de avaliação | nivel, treinos, atributos, poderes |

---

## 14. Estrutura Sugerida em Godot

```
res://
├── data/                              # JSONs do projeto web (cópia direta)
│   ├── ancestralidades.json
│   ├── classes.json
│   ├── divindades.json
│   ├── magias.json
│   ├── origens.json
│   ├── poderes.json
│   └── poderes-gerais.json
│
├── scripts/
│   ├── core/
│   │   ├── CharacterData.gd              # Resource com todo o estado
│   │   ├── CharacterDataLoader.gd        # save/load JSON
│   │   └── Catalogos.gd                  # Singleton — carrega data/*.json
│   │
│   ├── systems/                          # lógica pura, sem UI
│   │   ├── AtributosSystem.gd
│   │   ├── PericiasSystem.gd
│   │   ├── RecursosSystem.gd
│   │   ├── DefesaSystem.gd
│   │   ├── CargaSystem.gd
│   │   ├── PoderesSystem.gd
│   │   ├── MagiasSystem.gd
│   │   ├── AncestralidadeSystem.gd
│   │   ├── OrigemSystem.gd
│   │   └── DivindadeSystem.gd
│   │
│   └── ui/
│       └── (controllers dos painéis)
│
└── scenes/
    ├── CharacterSheet.tscn               # cena raiz
    ├── panels/
    │   ├── IdentidadePanel.tscn
    │   ├── AtributosPanel.tscn
    │   ├── RecursosPanel.tscn            # PV/PM/PP bars
    │   ├── DefesaPanel.tscn
    │   ├── PericiasPanel.tscn            # collapsible
    │   ├── TracosPanel.tscn
    │   ├── EquipamentoPanel.tscn
    │   ├── AtaquesPanel.tscn
    │   ├── PoderesPanel.tscn             # collapsible
    │   ├── MagiasPanel.tscn              # collapsible
    │   ├── OrigemPanel.tscn              # collapsible
    │   └── DivindadePanel.tscn           # collapsible
    ├── widgets/
    │   ├── CollapsiblePanel.tscn
    │   ├── ResourceBar.tscn
    │   ├── AutocompleteInput.tscn
    │   ├── Tooltip.tscn
    │   └── PericiaRow.tscn
    └── modals/
        ├── PoderDetalheModal.tscn
        ├── TracoDetalheModal.tscn
        ├── MagiaDetalheModal.tscn
        ├── BeneficioOrigemModal.tscn
        └── D20RollOverlay.tscn
```

---

## 15. Roadmap de Implementação

Sugestão de ordem (cada etapa é testável):

1. **Catálogos + estado base** — carregar JSONs, definir CharacterData, save/load.
2. **Painel de Atributos** — distribuir pontos, exibir modificadores.
3. **Painel de Recursos** — PV/PM/PP com barras, +/–, smart-sync.
4. **Painel de Defesa** — soma + DEX automático.
5. **Painel de Perícias** — 30 linhas, recompute em cascata, restrição de "só treinadas".
6. **Painel de Identidade** + Ancestralidade básica (sem traços ainda).
7. **Sistema de traços ancestrais** — bônus em atributo/perícia/defesa, preservação de manual.
8. **Painel de Equipamento** — autocomplete, carga, sobrecarga, slot de armadura/escudo.
9. **Painel de Origem** — escolha de 2 benefícios.
10. **Sistema de Classes** — single-class, perícias auto-treinadas, recursos por classe.
11. **Painel de Poderes de Classe** — slots, modal de detalhe, prereqs.
12. **Painel de Poderes Gerais** — categorias, custo PP.
13. **Painel de Divindade** + poderes divinos.
14. **Painel de Magias** — círculos, seleção, custo PM.
15. **Painel de Ataques** + animação de d20.
16. **Munição e consumo** integrados aos ataques.
17. **Multiclasse** — adicionar segunda classe, recálculo agregado.

---

## 16. Pontos de Atenção / Pendentes do Projeto Web

Itens que o projeto web **não resolve completamente** e que merecem decisão consciente no Godot:

1. **Multiclasse na UI** — backend pronto, frontend não.
2. **PP por classe** — fórmula atual `nivel-1` não diferencia classes; verifique se o sistema do RPG tem variação.
3. **Custo de poder em PP** — código assume 1, mas alguns poderes podem ter custos especiais.
4. **Validação de MIME real em uploads** — só extensão é checada (irrelevante em Godot, mas considere).
5. **Operações de arquivo fora de transação** — em Godot use save atômico (escrever em `.tmp` e renomear).
6. **CSRF / autorização** — irrelevante em desktop, mas pense em multi-perfil/save-slot.
7. **Origem com `+1/+1` vs `+2`** — a UI não força a escolha correta.
8. **Pré-requisitos manuais** — exibir como `?` amarelo + botão "Confirmar manualmente" e armazenar a confirmação.
9. **Conflito de bônus em mesmo campo por múltiplas fontes** — a regra do sistema é: "use o maior" ou "soma"? Verificar caso a caso.
10. **Imagem do personagem** — em Godot, file picker local + cache em `user://avatars/`.

---

> **Próximo passo recomendado:** decidir o stack visual (Control nodes nativos × Theme custom × addon como `godot-tween`) e fazer o painel de **Atributos + Perícias** como prova de conceito — é onde a maioria das cascatas reativas se exercitam.
