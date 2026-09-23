# Guia de Personalização — Catálogo Digital

Passo a passo para adaptar o template a um novo cliente. Tempo estimado: 30–60 min.

---

## 1. Duplicar o projeto

1. Faça um fork ou copie este repositório para um novo repositório do cliente.
2. Crie um novo projeto no [Supabase](https://supabase.com) — **um projeto por cliente**.

---

## 2. Rodar o schema no Supabase

1. Abra o **SQL Editor** do projeto Supabase do cliente.
2. Cole o conteúdo de `supabase/schema.sql` e execute.
3. Confirme que as tabelas `categorias`, `produtos` e `configuracoes` foram criadas.

---

## 3. Configurar as credenciais (`site/js/config.js`)

Edite apenas estes campos:

```js
supabaseUrl:  'https://SEU-PROJETO.supabase.co',   // Supabase → Settings → API
supabaseAnonKey: 'SUA-ANON-KEY',
nomeLoja: 'Pastelaria da Maria',
whatsapp: '5511988887777',   // DDI + DDD + número, só dígitos
```

Feature flags opcionais:

| Flag | Padrão | Efeito |
|------|--------|--------|
| `carrinhoAtivo` | `true` | `false` oculta o carrinho inteiro |
| `mostrarPrecos` | `true` | `false` esconde preços (catálogo visual) |
| `modoManutencao` | `false` | `true` exibe banner "em manutenção" |

---

## 4. Personalizar as cores e fontes (`site/css/theme.css`)

Altere as variáveis CSS no topo do arquivo:

```css
--cor-primaria: #e63946;        /* cor dos botões e destaques */
--cor-fundo: #fff8f0;           /* fundo da página */
--cor-fundo-header: #1d1d1d;    /* barra superior */
--fonte-titulo: 'Poppins', sans-serif;
```

Para trocar a fonte, edite o `@import` do Google Fonts no final do arquivo.

---

## 5. Adicionar o logo

- Salve o arquivo como `site/assets/logo.png` (ou `.jpg`, `.svg`).
- O header e o painel admin o carregam automaticamente.
- Também pode definir a URL via painel admin → Configurações → URL do logo.

---

## 6. Criar o primeiro usuário admin

No Supabase do cliente:

1. Acesse **Authentication → Users → Invite user** (ou Add user).
2. Informe o e-mail do responsável pela loja.
3. O usuário recebe um link para definir a senha.
4. Acesse `site/admin/index.html` e faça login.

---

## 7. Cadastrar categorias e produtos

No painel admin (`site/admin/`):

1. **Categorias** → crie as categorias do nicho (ex: "Pastéis salgados", "Bebidas").
2. **Produtos** → cadastre produtos, defina preço, categoria, imagem e marque destaques.
3. **Configurações** → ajuste nome da loja, WhatsApp, horário e visibilidade.

---

## 7.1 Horário automático (Aberto/Fechado em tempo real)

O selo "Aberto"/"Fechado" do site **não é manual** — ele é recalculado sozinho
comparando a hora atual com o horário configurado, e se atualiza a cada 1
minuto sem precisar recarregar a página.

Em **Configurações → Horário automático**:

- **Abre às / Fecha às** — horário padrão de funcionamento.
- **Dias abertos** — marque os dias da semana em que a loja funciona nesse
  horário padrão (o template já vem com terça a domingo, 17h–22h).
- **Fechar loja manualmente agora** — use só em imprevistos/feriados: força o
  selo para "Fechado" independente do horário configurado.

Em **Configurações → Dias especiais**, os próprios donos podem cadastrar, a
qualquer momento, datas com horário diferente do padrão:

- Clique em **"+ Adicionar dia especial"**, escolha a data e o novo horário
  de abertura/fechamento (ex: virada de ano funcionando até 01:00).
- Ou marque **"Fechado o dia todo"** para uma data específica (feriado, recesso).
- Dá pra adicionar quantos dias especiais quiser, e removê-los (✕) quando não
  forem mais necessários.
- Um dia especial cadastrado sempre tem prioridade sobre o horário padrão
  daquele dia da semana.
- Um expediente que atravessa a meia-noite (ex: abre 17h, fecha 01:00) é
  calculado corretamente — a loja continua marcada como "Aberta" até o
  horário de fechamento, mesmo já sendo o dia seguinte.

---

## 8. Deploy

O site é 100% estático — a pasta `site/` é o que vai ao ar.

| Plataforma | Como fazer |
|------------|-----------|
| **GitHub Pages** | Habilite Pages apontando para a pasta `site/` (ou branch `gh-pages`) |
| **Netlify** | Arraste a pasta `site/` ou conecte o repositório com base dir `site` |
| **Vercel** | Connect repo, root directory = `site`, sem build command |
| **Qualquer hospedagem** | Upload da pasta `site/` via FTP/SFTP |

> **Atenção:** o site usa ES Modules (`type="module"`). Ele **não funciona via
> `file://`** (duplo clique no HTML). Use sempre um servidor local ou hospedagem.
> Para testar localmente: `npx serve site` ou extensão Live Server do VS Code.

---

## Resumo dos arquivos que mudam por cliente

| Arquivo | O que alterar |
|---------|--------------|
| `site/js/config.js` | URL + chave Supabase, WhatsApp, nome, feature flags |
| `site/css/theme.css` | Cores, fontes |
| `site/assets/logo.png` | Logo do cliente |
| `supabase/schema.sql` | Rodar uma vez no projeto Supabase do cliente |
