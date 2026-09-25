# Visão do Ecossistema — Kit Digital para PME

> Documento vivo: ideias, motivações e roadmap do produto completo.
> Atualizar sempre que surgir nova ideia, validação de mercado ou decisão estratégica.

---

## A Ideia Central

O objetivo é construir um **ecossistema integrado de vendas digitais** para pequenas e médias empresas — vendido como **kit white-label**, personalizável para cada cliente.

O diferencial real não é nenhum software isolado. É a **conectividade e simultaneidade** entre todos os módulos:

> O cliente faz um pedido em qualquer canal → tudo se atualiza ao mesmo tempo em todos os sistemas.

Nenhum concorrente pequeno oferece isso de forma integrada. Os grandes (iFood, Stone, Anota AI) oferecem soluções genéricas e caras demais para PME. **Esse é o nosso espaço.**

---

## Os 4 Softwares do Kit

### 1. Catálogo Digital
*Em construção — piloto: Prili Pastelaria*

Cardápio digital completo com pedido direto via WhatsApp.

- Template ultra personalizável — design, cores, logo, produtos e funções adaptáveis por cliente
- Cada cliente recebe uma versão com a cara da sua empresa
- Funciona direto no navegador, sem instalar nada
- **Status:** quase finalizado ✅

---

### 2. Bot WhatsApp com IA

Atendimento automatizado 24h que organiza o caos do WhatsApp.

- Recebe e processa pedidos automaticamente
- Coleta dados do cliente (nome, endereço, forma de pagamento)
- Envia tudo para o Dashboard em tempo real
- Organiza fila de atendimento por ordem de chegada — sem confusão, sem perda de pedido
- Dispara cobranças automáticas para clientes com fiado em aberto
- Calcula juros progressivos conforme o tempo da dívida
- Estilo, frequência e tom de cobrança 100% configurável pelo dono

---

### 3. Dashboard — Estação de Controle
*O mais crucial. O coração do ecossistema.*

Central de informações que alimenta e recebe dados de todos os outros softwares. Tudo em tempo real, tudo em um lugar.

**Financeiro**
- Registro completo de entradas e saídas
- Faturamento, lucro e percentuais
- Comparativos por período (dia, semana, mês)
- Ranking dos produtos mais e menos vendidos

**Operacional**
- Fila de pedidos em tempo real — intuitiva, modificável, agilizadora
- Controle de saída de pedidos
- Anotações e observações por pedido
- Inserção manual para pedidos feitos no balcão

**Clientes**
- Histórico de compras e frequência
- Gestão de devedores (fiado) com cobrança automática via Bot
- Probabilidade de retorno do cliente
- Dias de maior e menor movimento

**Inteligência**
- Análise de probabilidades e previsões de venda
- Possível integração com IA para sugestões e coordenação dos módulos

---

### 4. Site Institucional
*Opcional*

Para clientes que precisam de presença web além do catálogo. Na maioria dos casos, o catálogo já é suficiente para PME.

---

## Como Tudo se Conecta

```
                    ┌─────────────────────────┐
                    │       DASHBOARD          │
                    │  (central de controle)   │
                    └────────────┬────────────┘
                                 │  alimenta e recebe
              ┌──────────────────┴──────────────────┐
              ▼                                      ▼
   ┌──────────────────┐                  ┌──────────────────┐
   │  CATÁLOGO DIGITAL │                  │  BOT WHATSAPP    │
   │  pedidos online   │                  │  pedidos + IA    │
   └──────────────────┘                  └──────────────────┘
```

**Fluxo — Pedido pelo Catálogo**
```
Cliente faz pedido no Catálogo
  → Notificação chega no WhatsApp do vendedor
  → Pedido registrado automaticamente no Dashboard
  → Entra na fila organizada por ordem de chegada
```

**Fluxo — Pedido pelo Bot**
```
Cliente manda mensagem no WhatsApp
  → Bot coleta as informações do pedido
  → Envia para o Dashboard em tempo real
  → Fila organizada — vendedor sabe exatamente quem é o próximo
```

**Fluxo — Cobrança de Fiado**
```
Dashboard detecta cliente devedor
  → Dispara cobrança automática via Bot
  → Calcula juros progressivos por tempo decorrido
  → Registra o pagamento quando confirmado
```

---

## Caso Real que Motiva o Produto

A dona da Prili Pastelaria (nosso piloto) relatou um problema muito comum:

> *"Muitas pessoas pedem fiado, o marido esquece de anotar e a gente perde dinheiro."*

Isso não é um problema dela — é um problema de **toda PME que trabalha com fiado**. O sistema de gestão de devedores com cobrança automática resolve isso diretamente, de forma simples e sem depender da memória de ninguém.

**Essa história é ouro para vendas** — é um problema real, mensurável e que o cliente sente no bolso todo mês.

---

## Público-Alvo

**Foco inicial:** PME — alimentação, varejo pequeno, serviços locais.

**Perfil do cliente ideal:**
- Vende pelo WhatsApp hoje, mas de forma desorganizada
- Perde pedidos, esquece cobranças, não sabe o que mais vende
- Não tem budget para soluções grandes como iFood ou Stone
- Precisa de algo simples, bonito e que funcione bem no celular

---

## Por que Construir Próprio

| Concorrente | Por que evitar |
|---|---|
| iFood / Cardápio Web | Cobra percentual por pedido, não integra com o ecossistema |
| Z-API / Twilio | Custo mensal por número, dependência de terceiro |
| Anota AI / Goomer | Genérico, sem personalização real, sem conectividade total |

**Nossa vantagem:** infraestrutura própria → custo operacional baixo → margem maior → preço competitivo para o cliente final → difícil de copiar.

---

## Ideias Adicionais

| Ideia | O que faz |
|---|---|
| Estoque integrado | Produto esgotado some automaticamente do catálogo; bot avisa o cliente |
| Relatório semanal automático | Toda segunda o dono recebe no WhatsApp: vendas, devedores, produto campeão |
| Link Pix automático | Gerado ao confirmar pedido, registrado automaticamente no dashboard |
| Cardápio por horário | Café da manhã, almoço e jantar com menus diferentes e automáticos |
| Programa de fidelidade | X pedidos = desconto, controlado e disparado pelo dashboard |

---

## Roadmap

| Etapa | Status |
|---|---|
| Catálogo Digital | 🟡 Quase finalizado |
| Template white-label do catálogo | ⬜ Próximo |
| Dashboard — coração do ecossistema | ⬜ A desenvolver |
| Bot WhatsApp com IA | ⬜ A desenvolver |
| Cobrança automática (junto com o bot) | ⬜ A desenvolver |
| Integrações avançadas entre módulos | ⬜ A desenvolver |
