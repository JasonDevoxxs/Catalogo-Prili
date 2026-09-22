# README Inovador — Visão de Produto & Estratégia de Mercado

> Documento vivo. Atualizado sempre que surgem novas decisões estratégicas, diferenciais ou descobertas de mercado.

---

## O que estamos construindo

Um **ecossistema de vendas digital para pequenos e médios vendedores** — começando pelo Tonynhos Bar como caso piloto, evoluindo para um kit completo que pode ser vendido/licenciado para qualquer negócio similar.

O kit é composto de três produtos integrados:

```
┌─────────────────────────────────────────────────────┐
│  1. Catálogo Digital          (já em construção)    │
│  2. Sistema de Gestão de Pedidos     (próximo)      │
│  3. Bot de WhatsApp Próprio          (próximo)      │
└─────────────────────────────────────────────────────┘
         ↕ todos falam entre si em tempo real
```

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
|--------|----------------------------|----------------------|
| Bot WhatsApp | Z-API ~R$100/mês | Evolution API self-hosted — **grátis** |
| Gestão de pedidos | Sistemas SaaS ~R$200/mês | Sistema próprio — **grátis** |
| Catálogo digital | Cardápio Web ~R$150/mês | Kit próprio — **grátis** |
| Hospedagem | Serviços caros | VPS Hetzner ~**R$25/mês** |
| Pix (automatizado) | Mercado Pago ~1% | Efí Bank ~0,5% (negociável) |

> **Pix manual (cliente paga direto na chave do vendedor): sempre gratuito, sem intermediários.** A taxa só aparece se quiser confirmação automática sem intervenção humana — feature premium futura.

---

## 2. WhatsApp Bot — Tecnologia e Estratégia

### Como funciona sem pagar nada
O **Evolution API** é open source e se conecta ao WhatsApp via protocolo do WhatsApp Web (mesma tecnologia que o WhatsApp no computador). Roda no nosso servidor, sem custo por mensagem.

### Modelo de números
Cada vendedor **usa o próprio número WhatsApp Business** — sem estoque de números nosso. O vendedor escaneia um QR Code no painel e conecta. Vantagem:
- Se o número for banido, afeta só aquele vendedor, não os outros
- O vendedor já tem o número que os clientes conhecem
- Zero custo e zero responsabilidade nossa sobre os números

### Aquecimento de números novos
Números novos precisam de um período de aquecimento para o WhatsApp não suspeitar de automação. Como controlamos o código, programamos isso com precisão:

```
Semana 1:  até 15 mensagens/dia    delay 4–10s entre cada
Semana 2:  até 40 mensagens/dia    delay 3–7s entre cada
Semana 3+: limite elástico baseado no histórico do número
```

Para PME (pequeno e médio varejo), o volume de pedidos natural já respeita esses limites — o aquecimento acontece organicamente com o uso. Mensagens de confirmação de pedido são classificadas como **transacionais** pelo WhatsApp (não spam), o que reduz muito o risco de ban.

### Anti-ban embutido no kit
O que será programado direto na nossa solução:
- Delay aleatório entre mensagens (não robótico)
- Nunca enviar em rajada
- Monitoramento de saúde do número
- Número de backup ativado automaticamente se detectar problema
- Evitar broadcasts — só mensagens 1:1 em resposta a ações do cliente

---

## 3. Hospedagem — Próprio vs Alugado

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

**Conclusão:** durante desenvolvimento, próprio PC resolve. Quando lançar para vendedores pagantes, VPS é mais barato e profissional do que comprar hardware dedicado (Raspberry Pi ~R$500 + risco de downtime em casa).

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
         ┌───────────────────────────────┐
         │     Painel do Vendedor        │
         │     (tempo real)              │
         │                               │
         │  🟡 #01 João — Pastel frango  │ ← move
         │  🔵 #02 Maria — 2x Carne      │ ← move
         │  🟡 #03 Pedro — Pastel doce   │
         │  [ + Adicionar pedido ]       │
         └───────────────────────────────┘
                         ↓
         WhatsApp confirma status ao cliente
```

### Funcionalidades da fila
- **Drag-and-drop** para reordenar com agilidade
- **Status por pedido:** Recebido → Preparando → Pronto → Entregue
- **Adicionar pedido manual** (cliente chegou pessoalmente ou ligou)
- **Contador de tempo** em cada etapa (saber quanto tempo cada pedido leva)
- **Notificação automática** ao cliente quando status muda (ex: "Seu pedido está pronto!")
- **Sincronização em tempo real** entre catálogo, bot e painel — os três sabem da fila ao mesmo tempo

### Como o WhatsApp direto entra na fila
```
Cliente envia pedido pelo WhatsApp
        ↓
Bot lê a mensagem e identifica os itens
        ↓
Insere automaticamente no FINAL da fila
        ↓
Responde ao cliente: "Pedido recebido! Você é o #4 na fila."
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

## 6. Mercado e Diferenciais

### Quem já faz algo parecido
- **Anota AI** — bot WhatsApp + cardápio para restaurantes. Foi **adquirida por valor de 8 dígitos em reais**.
- **Cardápio Web** — catálogo digital para restaurantes. Cobra ~R$150/mês por vendedor.
- **Goomer** — menu digital. Cobra comissão + mensalidade.
- **iFood** — marketplace. Cobra 12–30% por pedido (os vendedores odeiam).

### Nossos diferenciais concretos
| Diferencial | O que significa na prática |
|------------|---------------------------|
| Infraestrutura própria | Custo operacional menor = margem maior = preço mais competitivo |
| Sem comissão por pedido | Vendedor não perde % de cada venda |
| WhatsApp do vendedor | Cliente fala com a loja, não com plataforma |
| Fila unificada | Pedidos do catálogo + WhatsApp direto + manual na mesma tela |
| Kit white-label | Vendedor vê a marca dele, não a nossa |
| Open source base | Não dependemos de nenhuma empresa para o core funcionar |

### O nicho
PME de alimentação e varejo presencial no Brasil que precisa de presença digital mas não quer (ou não consegue) pagar as taxas dos grandes marketplaces. Mercado gigante, sub-atendido, e com forte cultura de WhatsApp — nosso produto resolve exatamente o problema deles.

---

## 7. Ordem de Construção

```
[✅] Catálogo Digital           ← piloto Tonynhos Bar
[ ] Backend + Banco de Dados   ← fila, pedidos, vendedores
[ ] Painel de Gestão           ← interface do vendedor, fila tempo real
[ ] Bot WhatsApp               ← Evolution API conectado à fila
[ ] Pix Automático             ← feature premium, Efí Bank
[ ] Kit White-label            ← empacotar para novos vendedores
```

---

*Última atualização: 2026-09-22*
