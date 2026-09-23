-- ============================================================
-- schema.sql — Rodar no SQL Editor do Supabase de cada cliente
-- ============================================================

-- Extensões
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABELA: categorias
-- ============================================================
create table if not exists categorias (
  id     uuid primary key default uuid_generate_v4(),
  nome   text not null,
  ordem  int  not null default 0,
  ativo  boolean not null default true,
  criado_em timestamptz default now()
);

-- ============================================================
-- TABELA: produtos
-- ============================================================
create table if not exists produtos (
  id           uuid primary key default uuid_generate_v4(),
  nome         text    not null,
  descricao    text,
  preco        numeric(10,2) not null default 0,
  imagem_url   text,
  categoria_id uuid references categorias(id) on delete set null,
  destaque     boolean not null default false,
  ativo        boolean not null default true,
  disponivel   boolean not null default true,
  ordem        int     not null default 0,
  criado_em    timestamptz default now(),
  atualizado_em timestamptz default now()
);

-- Índices de busca frequente
create index if not exists idx_produtos_categoria on produtos(categoria_id);
create index if not exists idx_produtos_ativo     on produtos(ativo);
create index if not exists idx_produtos_destaque  on produtos(destaque);

-- ============================================================
-- TABELA: configuracoes (chave-valor para settings da loja)
-- ============================================================
create table if not exists configuracoes (
  chave  text primary key,
  valor  text
);

-- Valores padrão
insert into configuracoes (chave, valor) values
  ('nome_loja',       'Meu Catálogo'),
  ('whatsapp',        '5511999999999'),
  ('horario_texto',   'Ter a Dom 17h–22h'),
  ('logo_url',        ''),
  ('horario_abertura',       '17:00'),
  ('horario_fechamento',     '22:00'),
  ('horario_dias_semana',    '0,2,3,4,5,6'),
  ('horario_fechado_manual', 'false'),
  ('dias_especiais',  '[]'),
  ('modo_manutencao', 'false'),
  ('carrinho_ativo',  'true'),
  ('mostrar_precos',  'true'),
  ('favoritos_ativos', 'true'),
  ('detalhes_produto_ativos', 'true')
on conflict (chave) do nothing;

-- ============================================================
-- STORAGE: bucket para imagens de produtos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('imagens', 'imagens', true)
on conflict (id) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Catálogo público: leitura sem autenticação
alter table categorias   enable row level security;
alter table produtos      enable row level security;
alter table configuracoes enable row level security;

-- Leitura pública
create policy "leitura publica categorias"
  on categorias for select using (true);

create policy "leitura publica produtos"
  on produtos for select using (true);

create policy "leitura publica configuracoes"
  on configuracoes for select using (true);

-- Escrita apenas para usuários autenticados (admins)
create policy "escrita autenticada categorias"
  on categorias for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "escrita autenticada produtos"
  on produtos for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "escrita autenticada configuracoes"
  on configuracoes for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Storage: leitura pública, upload apenas autenticado
create policy "upload autenticado"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'imagens');

create policy "leitura publica imagens"
  on storage.objects for select
  using (bucket_id = 'imagens');

create policy "delete autenticado"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'imagens');

-- ============================================================
-- TABELA: grupos_adicionais
-- Agrupa opções de personalização por produto
-- Ex: "Escolha o queijo", "Extras opcionais"
-- ============================================================
create table if not exists grupos_adicionais (
  id          uuid primary key default uuid_generate_v4(),
  produto_id  uuid not null references produtos(id) on delete cascade,
  nome        text not null,
  obrigatorio boolean not null default false,
  min_sel     int  not null default 0,
  max_sel     int  not null default 1,
  ordem       int  not null default 0,
  ativo       boolean not null default true
);
create index if not exists idx_grupos_produto on grupos_adicionais(produto_id);

-- ============================================================
-- TABELA: adicionais
-- Opções individuais dentro de cada grupo
-- Ex: "Catupiry", "Cheddar", "Bacon extra"
-- ============================================================
create table if not exists adicionais (
  id               uuid primary key default uuid_generate_v4(),
  grupo_id         uuid not null references grupos_adicionais(id) on delete cascade,
  nome             text not null,
  preco_adicional  numeric(10,2) not null default 0,
  disponivel       boolean not null default true,
  ordem            int  not null default 0
);
create index if not exists idx_adicionais_grupo on adicionais(grupo_id);

-- RLS — leitura pública, escrita só para admins
alter table grupos_adicionais enable row level security;
alter table adicionais        enable row level security;

create policy "leitura publica grupos_adicionais"
  on grupos_adicionais for select using (true);
create policy "leitura publica adicionais"
  on adicionais for select using (true);
create policy "escrita autenticada grupos_adicionais"
  on grupos_adicionais for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "escrita autenticada adicionais"
  on adicionais for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- DADOS DE EXEMPLO (remover em produção se preferir)
-- ============================================================
insert into categorias (nome, ordem) values
  ('Destaques',        0),
  ('Pastéis salgados', 1),
  ('Pastéis doces',    2),
  ('Bebidas',          3)
on conflict do nothing;
