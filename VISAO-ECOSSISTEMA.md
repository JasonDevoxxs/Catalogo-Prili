# Visão do Ecossistema — Kit Digital para PME

> Documento estratégico: ideias, motivações e roadmap do produto completo.

---

## A ideia central

Construir um **ecossistema integrado de vendas digitais** para pequenas e médias empresas,
vendido como kit white-label personalizável. O diferencial principal é a
**conectividade e simultaneidade** entre todos os módulos — o cliente faz um pedido
em qualquer canal e tudo se atualiza ao mesmo tempo em todos os sistemas.

Nenhum concorrente pequeno oferece isso integrado. Os grandes (iFood, Stone, etc.)
oferecem de forma genérica e cara demais para PME.

---

## Os 4 softwares do kit

### 1. Catálogo Digital *(em construção — piloto: Prili Pastelaria)*
- Cardápio digital com pedido via WhatsApp
- Template ultra personalizável: design, cores, logo, produtos, funções
- Cada cliente recebe uma versão personalizada
- Quase finalizado

### 2. Bot WhatsApp com IA
- Recebe e processa pedidos automaticamente
- Coleta informações do cliente (nome, endereço, pagamento)
- Envia tudo para o dashboard em tempo real
- Organiza fila de atendimento por ordem de chegada
- Dispara cobranças automáticas para clientes devedores
- Calcula juros progressivos por tempo decorrido
- Estilo e frequência de cobrança 100% configurável pelo dono

### 3. Dashboard / Estação de Controle *(o mais crucial)*
O coração do ecossistema. Central de informações que alimenta e recebe dados de todos os outros softwares.

**Financeiro:**
- Registro de entradas e saídas
- Faturamento, lucro e percentuais
- Comparativos por período
- Rankings de produtos mais vendidos

**Operacional:**
- Fila de pedidos em tempo real (intuitiva, modificável)
- Saída de pedidos organizada
- Anotações e observações
- Inserção manual (pedidos feitos no balcão)

**Clientes:**
- Histórico de compras e fidelidade
- Gestão de devedores (fiado)
- Probabilidade de retorno
- Dias de maior e menor movimento

**Inteligência:**
- Probabilidades e previsões
- Possível integração com IA para coordenação e sugestões

### 4. Site Institucional *(opcional)*
Para clientes que precisam de presença web além do catálogo.
Na maioria dos casos o catálogo já é suficiente para PME.

---

## Como tudo se conecta

```
┌─────────────────────────────────────────────────────────┐
│                    DASHBOARD                            │
│              (central de informações)                   │
└──────┬──────────────────────────────────┬───────────────┘
       │                                  │
       ▼                                  ▼
┌─────────────┐                  ┌────────────────┐
│  CATÁLOGO   │                  │  BOT WHATSAPP  │
│   DIGITAL   │                  │    COM IA      │
└─────────────┘                  └────────────────┘
```

**Fluxo do catálogo:**
```
Cliente faz pedido no Catálogo
→ Chega no WhatsApp do vendedor
→ Registra automaticamente no Dashboard
→ Entra na fila de forma intuitiva e ordenada
```

**Fluxo do bot:**
```
Bot coleta pedido via WhatsApp
→ Envia pro Dashboard
→ Organiza fila (quem pediu primeiro)
→ Vendedor não perde tempo nem se confunde
```

**Fluxo de cobrança:**
```
Dashboard detecta devedor com fiado
→ Dispara cobrança automática via Bot
→ Calcula juros por tempo decorrido
→ Registra pagamento quando efetuado
```

---

## Caso real que motiva o produto

A dona da Prili Pastelaria (piloto) relatou que **muitas pessoas pedem fiado**,
o marido esquece de anotar e perdem dinheiro. Esse é um problema real, mensurável,
e extremamente comum em PME. O sistema de gestão de devedores com cobrança
automática resolve isso diretamente.

Essa história é **ouro para vendas** — mostra o problema concreto que o kit resolve.

---

## Ideias adicionais para o kit

| Ideia | Descrição |
|---|---|
| Estoque integrado | Produto esgotado some automaticamente do catálogo e o bot avisa o cliente |
| Relatório semanal automático | Toda segunda o dono recebe no WhatsApp: vendas, devedores, produto mais pedido |
| Link Pix automático | Gerado ao confirmar pedido, já integrado ao dashboard |
| Cardápio por horário | Café da manhã, almoço e jantar com menus diferentes automáticos |
| Programa de fidelidade | X pedidos = desconto, controlado pelo dashboard |

---

## Público-alvo

**Foco inicial:** PME — alimentação, varejo pequeno, serviços locais.

Perfil do cliente ideal:
- Vende pelo WhatsApp hoje de forma desorganizada
- Perde pedidos, esquece cobranças, não sabe o que mais vende
- Não tem budget para soluções grandes (iFood, Stone, etc.)
- Precisa de algo simples, bonito e que funcione no celular

---

## Por que construir próprio (não depender de terceiros)

| Terceiro | Problema |
|---|---|
| iFood / Cardápio Web | Caro, cobra percentual, não integra com nosso ecossistema |
| Z-API / Twilio | Custo mensal por número, dependência externa |
| Anota AI / Goomer | Genérico, sem personalização, sem conectividade total |

**Nossa vantagem:** infraestrutura própria = custo zero operacional = margem maior = preço competitivo para o cliente final.

---

## Ordem de desenvolvimento

- [x] Catálogo Digital (quase finalizado)
- [ ] Extrair template white-label do catálogo
- [ ] Dashboard — coração do ecossistema
- [ ] Bot WhatsApp com IA
- [ ] Cobrança automática (junto com o bot)
- [ ] Integrações avançadas entre módulos

---

*Atualizar este documento sempre que surgir nova ideia, validação de mercado ou decisão estratégica.*
