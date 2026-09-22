import supabase from './supabaseClient.js';
import CONFIG from './config.js';
import { adicionarAoCarrinho } from './cart.js';
import { apply3DTilt, initScrollReveal, animateCounter } from './animations.js';

const CHAVE_FAVORITOS = 'catalogo-favoritos';
let todosProdutos = [];
let categoriaAtiva = 'todos';
let termoBusca = '';
let favoritos = carregarFavoritos();

const DEMO_PRODUTOS = [
  /* ── Pastéis de Frango ── */
  { id:'f1', nome:'Especial de Frango', descricao:'Frango desfiado + Catupiry ou cheddar + Queijo + Bacon', preco:22.00, destaque:true,  ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/especial-frango.png',  ordem:0,  categorias:{nome:'Pastéis de Frango'} },
  { id:'f2', nome:'Cremosão de Frango', descricao:'Frango desfiado + Catupiry ou cheddar + Bacon',          preco:20.00, destaque:true,  ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/cremosao-frango.png',  ordem:1,  categorias:{nome:'Pastéis de Frango'} },
  { id:'f3', nome:'Mexicano Frango',    descricao:'Frango desfiado + Calabresa + Queijo + Pimenta',          preco:20.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/mexicano-frango.png',  ordem:2,  categorias:{nome:'Pastéis de Frango'} },
  { id:'f4', nome:'Du Chef',            descricao:'Brócolis + Catupiry + Bacon + Cheddar',                   preco:18.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/du-chef.png',           ordem:3,  categorias:{nome:'Pastéis de Frango'} },
  { id:'f5', nome:'Mineiro',            descricao:'Frango desfiado + Queijo + Milho + Azeitona',             preco:18.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/mineiro.png',           ordem:4,  categorias:{nome:'Pastéis de Frango'} },
  { id:'f6', nome:'Sertanejo',          descricao:'Frango desfiado + Queijo + Bacon',                        preco:18.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/sertanejo.png',         ordem:5,  categorias:{nome:'Pastéis de Frango'} },
  { id:'f7', nome:'Da Roça',            descricao:'Frango desfiado + Catupiry + Milho',                      preco:16.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/da-roca.png',           ordem:6,  categorias:{nome:'Pastéis de Frango'} },
  { id:'f8', nome:'Tentação',           descricao:'Frango desfiado + Catupiry ou cheddar',                   preco:16.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/tentacao.png',          ordem:7,  categorias:{nome:'Pastéis de Frango'} },
  { id:'f9', nome:'Raiz',               descricao:'Frango desfiado + Queijo',                                preco:14.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/raiz.png',              ordem:8,  categorias:{nome:'Pastéis de Frango'} },

  /* ── Pastéis de Carne ── */
  { id:'c1p', nome:'Mexicano',     descricao:'Carne moída + Calabresa + Queijo + Pimenta',       preco:20.00, destaque:true,  ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/mexicano-carne.png',  ordem:0, categorias:{nome:'Pastéis de Carne'} },
  { id:'c2p', nome:'Do Sertão',    descricao:'Carne seca + Catupiry ou cheddar',                  preco:20.00, destaque:true,  ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/do-sertao.png',       ordem:1, categorias:{nome:'Pastéis de Carne'} },
  { id:'c3p', nome:'Cremosão',     descricao:'Carne moída + Cheddar ou Catupiry + Bacon',         preco:18.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/cremosao-carne.png',  ordem:2, categorias:{nome:'Pastéis de Carne'} },
  { id:'c4p', nome:'Goiano',       descricao:'Carne moída + Queijo + Milho + Azeitona',           preco:18.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/goiano.png',           ordem:3, categorias:{nome:'Pastéis de Carne'} },
  { id:'c5p', nome:'Português',    descricao:'Carne moída + Queijo + Ovo + Azeitona',             preco:18.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/portugues.png',        ordem:4, categorias:{nome:'Pastéis de Carne'} },
  { id:'c6p', nome:'3 em 1',       descricao:'Carne moída + Queijo + Calabresa',                  preco:18.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/3em1.png',             ordem:5, categorias:{nome:'Pastéis de Carne'} },
  { id:'c7p', nome:'Supremo',      descricao:'Carne moída + Queijo + Bacon',                      preco:18.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/supremo.png',          ordem:6, categorias:{nome:'Pastéis de Carne'} },
  { id:'c8p', nome:'Cremoso',      descricao:'Carne moída + Cheddar ou Catupiry',                 preco:16.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/cremoso.png',          ordem:7, categorias:{nome:'Pastéis de Carne'} },
  { id:'c9p', nome:'Casadinho',    descricao:'Carne moída + Queijo',                              preco:14.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/casadinho.png',        ordem:8, categorias:{nome:'Pastéis de Carne'} },
  { id:'c10p', nome:'Clássico',    descricao:'Carne moída temperada',                             preco:12.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/classico.png',         ordem:9, categorias:{nome:'Pastéis de Carne'} },

  /* ── Pastéis Especiais ── */
  { id:'e1', nome:'Da Casa',    descricao:'Brócolis com queijo',                preco:14.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c3', imagem_url:'assets/produtos/da-casa.png',    ordem:0, categorias:{nome:'Pastéis Especiais'} },
  { id:'e2', nome:'Napolitano', descricao:'Presunto + Queijo + Orégano',        preco:14.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c3', imagem_url:'assets/produtos/napolitano.png', ordem:1, categorias:{nome:'Pastéis Especiais'} },
  { id:'e3', nome:'Queijudo',   descricao:'Queijo mussarela derretido',         preco:12.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c3', imagem_url:'assets/produtos/queijudo.png',   ordem:2, categorias:{nome:'Pastéis Especiais'} },

  /* ── Pastéis Doces ── */
  { id:'d1', nome:'Nutella', descricao:'O clássico que todo mundo ama!', preco:20.00, destaque:true, ativo:true, disponivel:true, categoria_id:'c4', imagem_url:'assets/produtos/nutella.png', ordem:0, categorias:{nome:'Pastéis Doces'} },
];
const DEMO_CATEGORIAS = [
  { id:'c1', nome:'Pastéis de Frango' },
  { id:'c2', nome:'Pastéis de Carne' },
  { id:'c3', nome:'Pastéis Especiais' },
  { id:'c4', nome:'Pastéis Doces' },
];
const isDemo = CONFIG.supabaseUrl.includes('SEU-PROJETO');

export async function iniciarCatalogo() {
  await carregarConfiguracoes();
  aplicarConfig();
  await Promise.all([carregarCategorias(), carregarProdutos()]);
  configurarBusca();
  configurarModalProduto();
}

function carregarFavoritos() {
  try { return new Set(JSON.parse(localStorage.getItem(CHAVE_FAVORITOS)) || []); }
  catch { return new Set(); }
}
function salvarFavoritos() { localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify([...favoritos])); }
function preco(valor) { return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`; }
function escapar(valor = '') {
  return String(valor).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[char]);
}
function imagemPadrao() {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%231a1612' width='800' height='600'/%3E%3Cpath d='M270 340c70-125 190-125 260 0' fill='none' stroke='%23e8a020' stroke-opacity='.35' stroke-width='8' stroke-linecap='round'/%3E%3Ccircle cx='350' cy='300' r='8' fill='%23e8a020' fill-opacity='.45'/%3E%3Ccircle cx='450' cy='300' r='8' fill='%23e8a020' fill-opacity='.45'/%3E%3C/svg%3E`;
}

function aplicarConfig() {
  document.getElementById('btn-carrinho')?.classList.toggle('hidden', !CONFIG.carrinhoAtivo);
  document.getElementById('btn-favoritos')?.classList.toggle('hidden', !CONFIG.favoritosAtivos);
  document.getElementById('banner-manutencao')?.classList.toggle('hidden', !CONFIG.modoManutencao);
}

async function carregarConfiguracoes() {
  if (isDemo) {
    document.getElementById('store-name').textContent = CONFIG.nomeLoja || 'Catálogo Digital';
    document.title = CONFIG.nomeLoja || 'Catálogo Digital';
    document.getElementById('footer-nome').innerHTML = `${escapar(CONFIG.nomeLoja || 'Catálogo Digital')} &nbsp;·&nbsp; Feito com <span>♥</span>`;
    return;
  }
  const { data, error } = await supabase.from('configuracoes').select('chave, valor');
  if (error || !data) return;
  const cfg = Object.fromEntries(data.map(row => [row.chave, row.valor]));
  if (cfg.nome_loja) {
    document.getElementById('store-name').textContent = cfg.nome_loja;
    document.title = cfg.nome_loja;
    document.getElementById('footer-nome').innerHTML = `${escapar(cfg.nome_loja)} &nbsp;·&nbsp; Feito com <span>♥</span>`;
  }
  if (cfg.logo_url) document.getElementById('store-logo').src = cfg.logo_url;
  if (cfg.whatsapp) window._whatsapp = cfg.whatsapp;
  for (const [configKey, databaseKey] of Object.entries({ carrinhoAtivo:'carrinho_ativo', mostrarPrecos:'mostrar_precos', modoManutencao:'modo_manutencao', favoritosAtivos:'favoritos_ativos', detalhesProdutoAtivos:'detalhes_produto_ativos' })) {
    if (cfg[databaseKey] !== undefined) CONFIG[configKey] = cfg[databaseKey] === 'true';
  }
  if (cfg.horario_aberto !== undefined) {
    const aberto = cfg.horario_aberto === 'true';
    const status = document.getElementById('store-status');
    status.textContent = aberto ? 'Aberto' : 'Fechado';
    status.className = aberto ? 'aberto' : 'fechado';
  }
}

async function carregarCategorias() {
  let data, error;
  if (isDemo) data = DEMO_CATEGORIAS;
  else ({ data, error } = await supabase.from('categorias').select('id, nome').eq('ativo', true).order('ordem', { ascending: true }));
  if (error || !data) return;
  const lista = document.querySelector('.categorias-lista');
  if (!lista) return;
  const contador = document.getElementById('stat-num-cat');
  if (contador) animateCounter(contador, data.length);
  data.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn'; btn.dataset.id = cat.id;
    btn.innerHTML = `<span>${escapar(cat.nome)}</span>`;
    btn.addEventListener('click', () => filtrarCategoria(cat.id, btn));
    lista.appendChild(btn);
  });
}

async function carregarProdutos() {
  const grid = document.getElementById('grid-produtos');
  renderSkeletons(grid, 8);
  let data, error;
  if (isDemo) data = DEMO_PRODUTOS;
  else ({ data, error } = await supabase.from('produtos').select('*, categorias(nome)').eq('ativo', true).order('ordem', { ascending: true }));
  if (error || !data) { grid.innerHTML = '<p class="erro-catalogo">Não foi possível carregar os produtos agora.</p>'; return; }
  todosProdutos = data;
  const contador = document.getElementById('stat-num-prod');
  if (contador) animateCounter(contador, data.length);
  const destaques = data.filter(produto => produto.destaque);
  const gridDestaques = document.getElementById('grid-destaques');
  if (destaques.length && gridDestaques) {
    document.getElementById('secao-destaques')?.classList.remove('hidden');
    gridDestaques.innerHTML = '';
    destaques.forEach(produto => gridDestaques.appendChild(criarCard(produto)));
  }
  renderProdutos();
}

function renderProdutos() {
  const grid = document.getElementById('grid-produtos');
  const semResultados = document.getElementById('sem-resultados');
  const titulo = document.getElementById('titulo-cardapio');
  if (!grid) return;
  const filtrados = todosProdutos.filter(produto => {
    const matchCategoria = categoriaAtiva === 'todos' || (categoriaAtiva === 'favoritos' ? favoritos.has(produto.id) : produto.categoria_id === categoriaAtiva);
    const texto = `${produto.nome} ${produto.descricao || ''} ${produto.categorias?.nome || ''}`.toLowerCase();
    return matchCategoria && (!termoBusca || texto.includes(termoBusca));
  });
  if (titulo) titulo.firstChild.textContent = categoriaAtiva === 'favoritos' ? 'Favoritos' : 'Cardápio';
  grid.innerHTML = '';
  if (!filtrados.length) { semResultados?.classList.remove('hidden'); return; }
  semResultados?.classList.add('hidden');
  filtrados.forEach(produto => grid.appendChild(criarCard(produto)));
  initScrollReveal();
}

function criarCard(produto) {
  const card = document.createElement('article');
  const disponivel = produto.disponivel !== false;
  const favorito = favoritos.has(produto.id);
  const img = produto.imagem_url || imagemPadrao();
  card.className = 'produto-card';
  if (CONFIG.detalhesProdutoAtivos) { card.classList.add('produto-card-clicavel'); card.tabIndex = 0; card.setAttribute('role', 'button'); }
  card.innerHTML = `
    <div class="card-shine"></div><div class="card-border-glow"></div>
    <div class="img-wrap"><img src="${escapar(img)}" alt="${escapar(produto.nome)}" loading="lazy" onerror="this.src='${imagemPadrao()}'">
      ${produto.destaque ? '<span class="badge-destaque">✦ Destaque</span>' : ''}
      ${!disponivel ? '<span class="badge-indisponivel">Indisponível</span>' : ''}
      ${CONFIG.favoritosAtivos ? `<button class="btn-favorito ${favorito ? 'ativo' : ''}" type="button" aria-label="${favorito ? 'Remover dos favoritos' : 'Salvar nos favoritos'}">${favorito ? '♥' : '♡'}</button>` : ''}
    </div>
    <div class="corpo">${produto.categorias?.nome ? `<div class="categoria-tag">${escapar(produto.categorias.nome)}</div>` : ''}
      <div class="nome">${escapar(produto.nome)}</div>${produto.descricao ? `<div class="descricao">${escapar(produto.descricao)}</div>` : ''}
      ${CONFIG.mostrarPrecos ? `<div class="preco-row"><span class="preco-cifrao">R$</span><span class="preco">${Number(produto.preco).toFixed(2).replace('.', ',')}</span></div>` : ''}
    </div>
    ${CONFIG.carrinhoAtivo ? `<button class="btn-add" type="button" ${!disponivel ? 'disabled' : ''}><span>${disponivel ? '+ Adicionar ao pedido' : 'Indisponível'}</span></button>` : ''}`;
  if (CONFIG.detalhesProdutoAtivos) {
    card.addEventListener('click', event => { if (!event.target.closest('button')) abrirDetalhes(produto); });
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); abrirDetalhes(produto); } });
  }
  card.querySelector('.btn-favorito')?.addEventListener('click', () => alternarFavorito(produto.id));
  if (CONFIG.carrinhoAtivo && disponivel) card.querySelector('.btn-add')?.addEventListener('click', () => adicionarAoCarrinho(produto));
  apply3DTilt(card);
  return card;
}

function alternarFavorito(id) {
  favoritos.has(id) ? favoritos.delete(id) : favoritos.add(id);
  salvarFavoritos(); renderProdutos();
  if (categoriaAtiva !== 'favoritos') atualizarDestaques();
}
function atualizarDestaques() {
  const grid = document.getElementById('grid-destaques');
  if (!grid) return;
  grid.innerHTML = '';
  todosProdutos.filter(produto => produto.destaque).forEach(produto => grid.appendChild(criarCard(produto)));
}

function abrirDetalhes(produto) {
  if (!CONFIG.detalhesProdutoAtivos) return;
  const modal = document.getElementById('modal-produto');
  const disponivel = produto.disponivel !== false;
  document.getElementById('modal-produto-img').src = produto.imagem_url || imagemPadrao();
  document.getElementById('modal-produto-img').alt = produto.nome;
  document.getElementById('modal-produto-categoria').textContent = produto.categorias?.nome || '';
  document.getElementById('modal-produto-nome').textContent = produto.nome;
  document.getElementById('modal-produto-descricao').textContent = produto.descricao || 'Confira os detalhes deste item.';
  document.getElementById('modal-produto-preco').textContent = CONFIG.mostrarPrecos ? preco(produto.preco) : '';
  const favorito = document.getElementById('modal-produto-favorito');
  favorito.classList.toggle('ativo', favoritos.has(produto.id));
  favorito.textContent = favoritos.has(produto.id) ? '♥ Salvo nos favoritos' : '♡ Salvar favorito';
  favorito.onclick = () => { alternarFavorito(produto.id); abrirDetalhes(produto); };
  const adicionar = document.getElementById('modal-produto-adicionar');
  adicionar.hidden = !CONFIG.carrinhoAtivo;
  adicionar.disabled = !disponivel;
  adicionar.textContent = disponivel ? 'Adicionar ao pedido' : 'Indisponível';
  adicionar.onclick = () => { adicionarAoCarrinho(produto); fecharDetalhes(); };
  modal.classList.add('visivel'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-aberto');
}
function fecharDetalhes() {
  const modal = document.getElementById('modal-produto');
  modal?.classList.remove('visivel'); modal?.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-aberto');
}
function configurarModalProduto() {
  document.querySelectorAll('[data-fechar-produto]').forEach(el => el.addEventListener('click', fecharDetalhes));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') fecharDetalhes(); });
}

function filtrarCategoria(id, botao) { categoriaAtiva = id; ativarBotao(botao); renderProdutos(); }
function ativarBotao(botao) { document.querySelectorAll('.cat-btn').forEach(item => item.classList.remove('ativo')); botao?.classList.add('ativo'); }
export function filtrarTodos(botao) { categoriaAtiva = 'todos'; ativarBotao(botao); renderProdutos(); }
export function filtrarFavoritos(botao) { categoriaAtiva = 'favoritos'; ativarBotao(botao); renderProdutos(); }
function configurarBusca() {
  const header = document.getElementById('input-busca');
  const hero = document.getElementById('hero-busca');
  [header, hero].filter(Boolean).forEach(input => input.addEventListener('input', event => {
    termoBusca = event.target.value.toLowerCase().trim();
    if (event.target === header && hero) hero.value = event.target.value;
    if (event.target === hero && header) header.value = event.target.value;
    renderProdutos();
  }));
}
function renderSkeletons(container, quantidade) { if (container) container.innerHTML = Array(quantidade).fill('<div class="skeleton" style="height:260px"></div>').join(''); }
