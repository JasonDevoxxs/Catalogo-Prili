# README Inovador — Visão de Produto & Estratégia de Mercado

> Documento vivo. Atualizado sempre que surgem novas decisões estratégicas, diferenciais ou descobertas de mercado.

---

## O que estamos construindo

Um **ecossistema digital completo para qualquer tipo de estabelecimento** — começando pelo Tonynhos Bar como caso piloto, evoluindo para um kit ultra-personalizável que funciona para alimentação, barbearias, oficinas, lojas, assistência técnica e qualquer negócio com atendimento presencial ou por encomenda.

O kit é composto de produtos integrados que o vendedor contrata conforme precisa:

```
┌──────────────────────────────────────────────────────────┐
│  1. Catálogo / Cardápio Digital    (já em construção)    │
│  2. Site Institucional             (produto separado)    │
│  3. Sistema de Gestão + Fila       (próximo)             │
│  4. Bot WhatsApp com IA            (próximo)             │
│  5. Pix Automatizado               (feature premium)     │
└──────────────────────────────────────────────────────────┘
         ↕ todos falam entre si em tempo real
```

### Para quais nichos funciona
O sistema é genérico por design — muda só o vocabulário:

| Estabelecimento | "Pedido" | Status da fila |
|----------------|----------|----------------|
| Pastelaria / Lanchonete | Itens do cardápio | Recebido → Preparando → Pronto → Entregue |
| Barbearia / Salão | Horário de corte | Aguardando → Em atendimento → Finalizado |
| Oficina mecânica | Serviço no veículo | Recebido → Em revisão → Pronto → Retirado |
| Assistência técnica | Aparelho para conserto | Recebido → Orçado → Em reparo → Pronto |
| Loja com retirada | Pedido online | Recebido → Separando → Pronto para retirada |

**Ultra-personalizável para qualquer nicho** — a lógica é sempre a mesma, o kit se adapta.

---

## 1. Infraestrutura — Por que construir própria?

### O problema com terceiros
Toda solução pronta no mercado depende de plataformas externas:
- **Z-API, Twilio** — cobram por mensagem enviada
- **iFood, Cardápio Web** — cobram comissão por pedido
- **Mercado Pago** — cobra % sobre cada transação
- Quando o volume cresce, o custo escala junto e corrói a margem

### Nossa abordagem
Construir a infra própria sempre que possível, eliminar intermediários:

| Função | Solução de terceiro (custo) | Nossa solução (custo) |
|--------|----------------------------|-----------------------|
| Bot WhatsApp | Z-API ~R$100/mês | Evolution API self-hosted — **grátis** |
| IA no bot | OpenAI API ~R$0,10/msg | Modelo local (LLaMA) — **grátis** |
| Gestão de pedidos | Sistemas SaaS ~R$200/mês | Sistema próprio — **grátis** |
| Catálogo digital | Cardápio Web ~R$150/mês | Kit próprio — **grátis** |
| Site institucional | Agências ~R$3.000+ | Produto próprio — custo de hora |
| Hospedagem | Serviços caros | VPS Hetzner ~**R$25/mês** |
| Pix (automatizado) | Mercado Pago ~1% | Efí Bank ~0,5% (negociável) |

> **Pix manual (cliente paga direto na chave do vendedor): sempre gratuito, sem intermediários.** A taxa só aparece se quiser confirmação automática — feature premium futura.

---

## 2. Produto — Site Institucional

Além do catálogo interativo, muitos vendedores precisam de um **site institucional** — página com história da empresa, serviços, fotos, contato, localização no mapa, horário de funcionamento.

O catálogo e o site são produtos diferentes e complementares:
- **Catálogo:** cliente navega, monta pedido, finaliza pelo WhatsApp
- **Site:** apresentação da marca, aparece no Google, passa credibilidade

O vendedor que já tem o catálogo naturalmente vai querer o site depois — e você já tem o cliente. Venda cruzada natural, receita adicional da mesma base.

**Modelo de entrega:** site estático (mesmo stack do catálogo), hospedado no GitHub Pages ou VPS, entregue como parte do kit ou cobrado separado como serviço avulso.

---

## 3. WhatsApp Bot com IA

### Além de automação — inteligência real
O bot não precisa ser apenas um roteador de mensagens. Com um modelo de linguagem integrado (IA), ele consegue:

- **Entender pedidos em linguagem natural** — cliente digita "quero 2 de frango e 1 especial" e o bot interpreta, confirma e insere na fila
- **Responder dúvidas sobre o cardápio/serviços** — "tem pastel de queijo?" sem precisar o vendedor responder
- **Qualificar o cliente** — coletar nome, endereço, forma de pagamento em conversa natural
- **Tom de voz da marca** — responde como se fosse um atendente da própria loja

### Opções de IA (do mais simples ao mais poderoso)
| Opção | Custo | Quando usar |
|-------|-------|-------------|
| Respostas fixas (regras) | Grátis | Volume baixo, pedidos padronizados |
| API Claude / OpenAI | ~R$0,05–0,15 por conversa | Quando quer qualidade máxima |
| Modelo local (LLaMA, Mistral) | Grátis após setup | Quando volume justifica servidor dedicado |

**Estratégia:** começar com respostas fixas + fluxo guiado (menu numerado), evoluir para IA conforme o kit cresce. O sistema já estará preparado para trocar o motor de resposta sem reescrever tudo.

### Notificações de posição na fila — diferencial de experiência
A cada pedido concluído, o bot avisa automaticamente quem está na fila:

```
Bot → Cliente #3: "Boa notícia! Você subiu na fila e agora é o #2.
                   Tempo estimado: ~8 minutos. 🕐"

Bot → Cliente #1: "Seu pedido está sendo preparado agora! 🔥"

Bot → Cliente #1: "Pronto! Seu pedido está te esperando. 🎉"
```

Isso **elimina a pergunta mais comum no WhatsApp do vendedor:** "cadê meu pedido?" — que hoje toma tempo e irrita os dois lados.

---

## 4. Sistema de Gestão + Fila Unificada

### O problema que resolve
Um vendedor recebe pedidos de múltiplas fontes:
- Catálogo digital (link/QR Code compartilhado)
- WhatsApp direto (cliente com o número salvo)
- Presencialmente / por telefone

Sem sistema, vira bagunça. Com o nosso:

```
   Catálogo       WhatsApp direto      Manual (presencial)
       ↓                 ↓                      ↓
       └─────────────────┴──────────────────────┘
                         ↓
              FILA CENTRAL (banco de dados)
                         ↓
         ┌───────────────────────────────────┐
         │       Painel do Vendedor          │
         │       (tempo real)                │
         │                                   │
         │  🟡 #01 João  — Pastel frango     │ ← move
         │  🔵 #02 Maria — 2x Carne          │ ← move
         │  🟡 #03 Pedro — Pastel doce       │
         │  [ + Adicionar pedido ]           │
         └───────────────────────────────────┘
                         ↓
         Bot avisa cliente automaticamente a cada mudança
```

### Funcionalidades da fila
- **Drag-and-drop** para reordenar com agilidade
- **Status por pedido:** personalizável por nicho (Recebido → Preparando → Pronto → Entregue)
- **Adicionar pedido manual** (cliente chegou pessoalmente ou ligou)
- **Contador de tempo** em cada etapa — saber quanto tempo cada pedido leva em média
- **Notificação automática** ao cliente a cada mudança de status via WhatsApp
- **Aviso de posição na fila** — cliente recebe atualização conforme a fila avança
- **Sincronização em tempo real** entre catálogo, bot e painel

### Como o WhatsApp direto entra na fila
```
Cliente envia pedido pelo WhatsApp
        ↓
Bot (com IA) lê a mensagem e identifica os itens
        ↓
Insere automaticamente no FINAL da fila
        ↓
Responde ao cliente: "Pedido recebido! Você é o #4 na fila. ✅"
        ↓
Painel do vendedor atualiza em tempo real
        ↓
Vendedor pode reposicionar se necessário
```

---

## 5. Pagamento — Estratégia por Fase

### Fase 1 — Hoje (zero custo)
Cliente faz o pedido pelo catálogo → pedido vai pelo WhatsApp → vendedor manda a chave Pix manualmente → cliente paga → vendedor confirma. **Totalmente gratuito, sem intermediários.**

### Fase 2 — Pix automatizado (feature premium futura)
Sistema gera QR Code único por pedido → cliente paga → banco notifica o sistema automaticamente → pedido confirmado sem intervenção humana. Custo: ~0,5–1% por transação via Efí Bank.

> Por lei brasileira (Banco Central), receber Pix programaticamente exige intermediário financeiro autorizado. Quando o volume justificar, é possível tornar-se sub-credenciador de Pix — processo burocrático mas factível para uma empresa em crescimento.

### Fase 3 — Escala
Negociar taxas menores com o volume acumulado. Empresas que processam volumes altos conseguem taxas abaixo de 0,3%.

---

## 6. Hospedagem — Próprio vs Alugado

### Computador/Raspberry Pi em casa
Já foi provado que funciona. Limitações para uso profissional:
- IP dinâmico (ISP muda o endereço — precisa DDNS)
- Cai a luz = serviço cai
- Hardware falha = perdeu tudo sem aviso
- Internet residencial sem SLA

### VPS alugada (recomendado para produto comercial)
Uma VPS na **Hetzner** por ~R$25/mês entrega:
- IP fixo sempre disponível
- Datacenter com gerador (uptime ~99,9%)
- Backup automático
- Escala com um clique quando crescer

**Conclusão:** durante desenvolvimento, próprio PC resolve. Quando lançar para vendedores pagantes, VPS é mais profissional e frequentemente mais barato do que manter hardware dedicado em casa.

---

## 7. Mercado e Diferenciais

### O mapa do que existe hoje — e onde cada um para

```
                    CATÁLOGO   FILA     BOT WPP   NOTIF.     QUALQUER
                    DIGITAL    UNIF.    PRÓPRIO   POSIÇÃO    NICHO
                       ↓         ↓        ↓          ↓          ↓
iFood               ✅          ❌       ❌         ❌          ❌
Cardápio Web        ✅          ❌       ❌         ❌          ❌
Anota AI            ✅          ✅       ✅         ❌          ❌
Trinks              ❌          ✅       ❌         ❌       só salões
iGestor             ❌          ✅       ❌         ❌       só salões
Goomer              ✅          ❌       ❌         ❌          ❌
──────────────────────────────────────────────────────────────────────
NOSSO KIT           ✅          ✅       ✅         ✅          ✅
```

### O que cada concorrente faz e onde trava

**iFood / Marketplaces**
Resolve catálogo e pagamento, mas o vendedor entra no ecossistema deles. Paga 12–30% por pedido, não tem contato direto com o cliente (o cliente é do iFood, não da loja), e não tem fila de produção — só recebe o pedido por uma impressora. Dependência total.

**Cardápio Web / Goomer**
Catálogo bonito, o cliente monta o pedido e... cai no WhatsApp do vendedor como texto. A partir daí o vendedor organiza na cabeça ou no papel. Sem fila, sem notificação, sem bot. O problema de organização continua existindo, só mudou o canal de entrada.

**Anota AI** *(o mais próximo — e foi adquirida por isso)*
Bot de WhatsApp que entende pedidos + catálogo integrado. O mais avançado que existiu no mercado brasileiro. Mas tinha limitações estruturais:
- Dependia 100% de infraestrutura de terceiros → custos altos em escala
- Focada exclusivamente em restaurantes → nicho fechado
- Sem notificação de posição na fila para o cliente
- Sem painel com drag-and-drop para o vendedor
- White-label limitado

**Trinks / iGestor** *(barbearias e salões)*
Resolvem agendamento e fila para salões, mas:
- Sem catálogo de produtos
- WhatsApp só para lembrete de horário, não para fluxo de atendimento completo
- Fechados no nicho de beleza — não adaptam para outros segmentos
- Mensalidade cara para o que entregam

**Oficinas / Assistência técnica**
Mercado completamente sub-atendido. A maioria usa caderno ou WhatsApp manual. Zero concorrência direta. O técnico atualiza o status no painel ("Em reparo", "Pronto") e o bot avisa o cliente automaticamente — sem o técnico parar o que está fazendo para digitar nada.

### O gap real — o que ninguém faz junto

O problema central que nenhum resolve completamente:

> Um vendedor hoje usa 4 ferramentas separadas que não se falam:
> caderno/papel pra fila → WhatsApp pra atender → catálogo pra mostrar produtos → olho pra saber em qual pedido está.

O nosso kit colapsa tudo num único sistema onde **uma ação alimenta os outros automaticamente:**

```
Cliente pede pelo catálogo
        ↓ automático
Entra na fila do painel
        ↓ automático
Bot confirma pro cliente com posição na fila
        ↓ automático (a cada avanço da fila)
Cliente recebe atualização sem precisar perguntar
        ↓ quando vendedor clica "Pronto"
Bot avisa cliente para buscar / aguardar entrega
```

O vendedor faz **uma coisa** (atualizar o status no painel) e **três coisas acontecem** (fila atualiza, próximo cliente é avisado, cliente atual é notificado). Isso é o que não existe pronto hoje.

### Por que é difícil de copiar rapidamente

Não é só questão de código — é questão de ter construído a infra própria:

- Quem depende de Z-API paga por mensagem → não consegue dar notificações frequentes sem custo explodir
- Quem depende de iFood não tem acesso ao WhatsApp do cliente
- Quem faz só catálogo não tem o motor de fila
- Quem faz só fila não tem o catálogo nem o bot

Estamos construindo as camadas de baixo primeiro. Cada produto novo que adicionarmos vai custar quase zero operacional a mais — diferente de um concorrente que teria que renegociar contratos com terceiros para cada feature nova.

### Nossos diferenciais concretos

| Diferencial | O que significa na prática |
|------------|---------------------------|
| Infraestrutura própria | Custo operacional menor = margem maior = preço mais competitivo |
| Sem comissão por pedido | Vendedor não perde % de cada venda |
| WhatsApp do vendedor | Cliente fala com a loja, não com plataforma anônima |
| Bot com IA | Atendimento automático em linguagem natural, 24h |
| Notificação de posição na fila | Cliente sabe onde está sem perguntar — elimina o "cadê meu pedido?" |
| Uma ação, três resultados | Vendedor atualiza status → fila, bot e cliente sincronizam sozinhos |
| Fila unificada | Catálogo + WhatsApp direto + manual na mesma tela |
| Kit white-label | Vendedor vê a marca dele, não a nossa |
| Ultra-personalizável | Funciona para qualquer nicho — não só alimentação |
| Open source base | Não dependemos de nenhuma empresa para o core funcionar |

---

## 8. Ordem de Construção

```
[✅] Catálogo Digital              ← piloto Tonynhos Bar
[ ] Backend + Banco de Dados      ← fila, pedidos, vendedores
[ ] Painel de Gestão              ← interface do vendedor, fila tempo real
[ ] Bot WhatsApp + IA             ← Evolution API + modelo de linguagem
[ ] Notificações de posição       ← aviso automático conforme fila avança
[ ] Pix Automático                ← feature premium, Efí Bank
[ ] Site Institucional            ← produto separado para vendedores
[ ] Kit White-label               ← empacotar para novos vendedores
```

---

*Última atualização: 2026-09-22*
