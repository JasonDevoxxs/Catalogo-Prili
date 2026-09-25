# Catálogo Digital — Template

Template base para catálogos digitais de produtos, vendido como produto comercial
(venda inicial + mensalidade de manutenção). Serve como ponto de partida para
qualquer nicho (restaurantes, pastelarias, adegas, lojas de roupa, papelarias, etc.) —
personalização por cliente é feita em cima deste template, nunca do zero.

## Stack

- **Site público**: HTML/CSS/JS puro (sem build step, hospeda em qualquer lugar estático).
- **Backend/dados**: [Supabase](https://supabase.com) (Postgres + Auth + Storage) — 1 projeto Supabase por cliente.
- **Painel admin**: também HTML/CSS/JS puro, embutido em `/site/admin`, protegido por login.
- **Modelo multi-cliente**: cada cliente = uma cópia deste template + um projeto Supabase próprio. Sem mistura de dados entre clientes.

## Estrutura

```
site/                    ← tudo que é publicado (deploy = esta pasta)
├── index.html            catálogo público
├── css/
│   ├── theme.css          ⚙️ CORES/FONTES — muda por cliente
│   └── style.css          estrutura visual (raramente muda)
├── js/
│   ├── config.js          ⚙️ credenciais Supabase + features — muda por cliente
│   ├── supabaseClient.js  conexão com Supabase (não mexer)
│   ├── catalog.js          lógica do catálogo (não mexer)
│   └── cart.js              carrinho + pedido via WhatsApp (não mexer)
├── assets/                logo, imagens estáticas
└── admin/                 painel administrativo (login + CRUD)
    ├── index.html          tela de login
    ├── dashboard.html       visão geral
    ├── produtos.html        CRUD de produtos
    ├── categorias.html      CRUD de categorias
    └── configuracoes.html   dados da loja, cores, WhatsApp

supabase/
└── schema.sql            script único para rodar no Supabase de cada cliente

docs/
└── GUIA-PERSONALIZACAO.md  passo a passo para adaptar a um cliente novo
```

## Como funciona a personalização

Regra de ouro: **personalizar um cliente = editar `theme.css` + `config.js` + rodar `schema.sql`**,
sem tocar no restante do código. Veja o passo a passo completo em
[`docs/GUIA-PERSONALIZACAO.md`](docs/GUIA-PERSONALIZACAO.md).

## Funcionalidades já prontas no template

- Vitrine de produtos por categoria, com busca e seção de destaques.
- Carrinho de pedido que monta a mensagem e abre o WhatsApp da loja (liga/desliga por config).
- Painel admin com login, CRUD de produtos (com upload de imagem) e categorias.
- Configurações da loja editáveis pelo próprio cliente (nome, logo, cores, WhatsApp, horário).
- Selo "Aberto/Fechado" calculado automaticamente em tempo real pelo horário configurado, com suporte a dias especiais (datas com horário diferente ou fechadas) cadastráveis pelo próprio cliente — veja [`docs/GUIA-PERSONALIZACAO.md`](docs/GUIA-PERSONALIZACAO.md#71-horário-automático-abertofechado-em-tempo-real).
- Tema 100% via variáveis CSS — trocar a cara do site é trocar `theme.css`.
- Modo manutenção (liga uma página "em breve" sem apagar dados).

## Próximo passo real: pastelaria + adega

Este template ainda não é o site do cliente. O próximo passo é: duplicar este projeto,
seguir o guia de personalização, e adaptar nomenclatura/categorias/tom visual para o
nicho de alimentação + bebidas (ex: categorias "Pastéis salgados", "Pastéis doces",
"Vinhos", "Bebidas", indicação de bebida alcoólica quando aplicável, etc.).
