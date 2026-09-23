import supabase from './supabaseClient.js';
import CONFIG from './config.js';
import { adicionarAoCarrinho, mostrarToast } from './cart.js';
import { apply3DTilt, initScrollReveal, animateCounter } from './animations.js';
import { calcularStatusLoja } from './horario.js';

const CHAVE_FAVORITOS = 'catalogo-favoritos';
let todosProdutos = [];
let categoriaAtiva = 'todos';
let termoBusca = '';
let favoritos = carregarFavoritos();
let adicionaisPorProduto = new Map();

/* ---- Demo data ---- */
const DEMO_PRODUTOS = [
  /* ── Pastéis de Frango ── */
  { id:'f1', nome:'Especial de Frango', descricao:'Frango desfiado + queijo + bacon — escolha o queijo', preco:22.00, destaque:true,  ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/especial-frango.png',  ordem:0, categorias:{nome:'Pastéis de Frango'} },
  { id:'f2', nome:'Cremosão de Frango', descricao:'Frango desfiado + queijo cremoso + bacon',             preco:20.00, destaque:true,  ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/cremosao-frango.png',  ordem:1, categorias:{nome:'Pastéis de Frango'} },
  { id:'f3', nome:'Mexicano Frango',    descricao:'Frango desfiado + calabresa + queijo + pimenta',       preco:20.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/mexicano-frango.png',  ordem:2, categorias:{nome:'Pastéis de Frango'} },
  { id:'f4', nome:'Du Chef',            descricao:'Brócolis + catupiry + bacon + cheddar',                preco:18.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/du-chef.png',           ordem:3, categorias:{nome:'Pastéis de Frango'} },
  { id:'f5', nome:'Mineiro',            descricao:'Frango desfiado + queijo + milho + azeitona',          preco:18.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/mineiro.png',           ordem:4, categorias:{nome:'Pastéis de Frango'} },
  { id:'f6', nome:'Sertanejo',          descricao:'Frango desfiado + queijo + bacon',                     preco:18.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/sertanejo.png',         ordem:5, categorias:{nome:'Pastéis de Frango'} },
  { id:'f7', nome:'Da Roça',            descricao:'Frango desfiado + catupiry + milho',                   preco:16.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/da-roca.png',           ordem:6, categorias:{nome:'Pastéis de Frango'} },
  { id:'f8', nome:'Tentação',           descricao:'Frango desfiado + queijo cremoso — escolha o queijo',  preco:16.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/tentacao.png',          ordem:7, categorias:{nome:'Pastéis de Frango'} },
  { id:'f9', nome:'Raiz',               descricao:'Frango desfiado + queijo',                             preco:14.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c1', imagem_url:'assets/produtos/raiz.png',              ordem:8, categorias:{nome:'Pastéis de Frango'} },

  /* ── Pastéis de Carne ── */
  { id:'c1p', nome:'Mexicano',   descricao:'Carne moída + calabresa + queijo + pimenta',         preco:20.00, destaque:true,  ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/mexicano-carne.png',  ordem:0, categorias:{nome:'Pastéis de Carne'} },
  { id:'c2p', nome:'Do Sertão',  descricao:'Carne seca + queijo cremoso — escolha o queijo',     preco:20.00, destaque:true,  ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/do-sertao.png',       ordem:1, categorias:{nome:'Pastéis de Carne'} },
  { id:'c3p', nome:'Cremosão',   descricao:'Carne moída + queijo cremoso + bacon',               preco:18.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/cremosao-carne.png',  ordem:2, categorias:{nome:'Pastéis de Carne'} },
  { id:'c4p', nome:'Goiano',     descricao:'Carne moída + queijo + milho + azeitona',            preco:18.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/goiano.png',           ordem:3, categorias:{nome:'Pastéis de Carne'} },
  { id:'c5p', nome:'Português',  descricao:'Carne moída + queijo + ovo + azeitona',              preco:18.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/portugues.png',        ordem:4, categorias:{nome:'Pastéis de Carne'} },
  { id:'c6p', nome:'3 em 1',     descricao:'Carne moída + queijo + calabresa',                   preco:18.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/3em1.png',             ordem:5, categorias:{nome:'Pastéis de Carne'} },
  { id:'c7p', nome:'Supremo',    descricao:'Carne moída + queijo + bacon',                       preco:18.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/supremo.png',          ordem:6, categorias:{nome:'Pastéis de Carne'} },
  { id:'c8p', nome:'Cremoso',    descricao:'Carne moída + queijo cremoso — escolha o queijo',    preco:16.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/cremoso.png',          ordem:7, categorias:{nome:'Pastéis de Carne'} },
  { id:'c9p', nome:'Casadinho',  descricao:'Carne moída + queijo',                               preco:14.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/casadinho.png',        ordem:8, categorias:{nome:'Pastéis de Carne'} },
  { id:'c10p', nome:'Clássico',  descricao:'Carne moída temperada',                              preco:12.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c2', imagem_url:'assets/produtos/classico.png',         ordem:9, categorias:{nome:'Pastéis de Carne'} },

  /* ── Pastéis Especiais ── */
  { id:'e1', nome:'Da Casa',    descricao:'Brócolis com queijo',           preco:14.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c3', imagem_url:'assets/produtos/da-casa.png',    ordem:0, categorias:{nome:'Pastéis Especiais'} },
  { id:'e2', nome:'Napolitano', descricao:'Presunto + queijo + orégano',   preco:14.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c3', imagem_url:'assets/produtos/napolitano.png', ordem:1, categorias:{nome:'Pastéis Especiais'} },
  { id:'e3', nome:'Queijudo',   descricao:'Queijo mussarela derretido',    preco:12.00, destaque:false, ativo:true, disponivel:true, categoria_id:'c3', imagem_url:'assets/produtos/queijudo.png',   ordem:2, categorias:{nome:'Pastéis Especiais'} },

  /* ── Pastéis Doces ── */
  { id:'d1', nome:'Nutella', descricao:'O clássico que todo mundo ama!', preco:20.00, destaque:true, ativo:true, disponivel:true, categoria_id:'c4', imagem_url:'assets/produtos/nutella.png', ordem:0, categorias:{nome:'Pastéis Doces'} },
];

const DEMO_CATEGORIAS = [
  { id:'c1', nome:'Pastéis de Frango' },
  { id:'c2', nome:'Pastéis de Carne' },
  { id:'c3', nome:'Pastéis Especiais' },
  { id:'c4', nome:'Pastéis Doces' },
];

/* Adicionais de demonstração — produtos que têm opção de queijo e/ou extras */
const _QUEIJO = [
  { nome: 'Catupiry',  preco_adicional: 0 },
  { nome: 'Cheddar',   preco_adicional: 0 },
];
const _EXTRAS = [
  { nome: 'Bacon extra',     preco_adicional: 2.50 },
  { nome: 'Molho especial',  preco_adicional: 1.00 },
  { nome: 'Azeitona',        preco_adicional: 0.50 },
];

function _grupoQueijo(pid) {
  return {
    id: `g-q-${pid}`, produto_id: pid, nome: 'Escolha o queijo',
    obrigatorio: true, min_sel: 1, max_sel: 1, ordem: 0,
    adicionais: _QUEIJO.map((a, i) => ({ id: `a-q${i}-${pid}`, ...a, disponivel: true })),
  };
}
function _grupoExtras(pid) {
  return {
    id: `g-e-${pid}`, produto_id: pid, nome: 'Extras opcionais',
    obrigatorio: false, min_sel: 0, max_sel: 3, ordem: 1,
    adicionais: _EXTRAS.map((a, i) => ({ id: `a-e${i}-${pid}`, ...a, disponivel: true })),
  };
}

const DEMO_ADICIONAIS = {
  f1:  [_grupoQueijo('f1'),  _grupoExtras('f1')],
  f2:  [_grupoQueijo('f2'),  _grupoExtras('f2')],
  f8:  [_grupoQueijo('f8')],
  c2p: [_grupoQueijo('c2p')],
  c3p: [_grupoQueijo('c3p'), _grupoExtras('c3p')],
  c8p: [_grupoQueijo('c8p')],
};

const isDemo = CONFIG.supabaseUrl.includes('SEU-PROJETO');

/* ---- UUID helper ---- */
function gerarUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

/* ---- Inicialização ---- */
export async function iniciarCatalogo() {
  await carregarConfiguracoes();
  aplicarConfig();
  await Promise.all([carregarCategorias(), carregarProdutos(), carregarAdicionais()]);
  configurarBusca();
  configurarModais();
  iniciarStatusLoja();
}

/* ---- Helpers ---- */
function carregarFavoritos() {
  try { return new Set(JSON.parse(localStorage.getItem(CHAVE_FAVORITOS)) || []); }
  catch { return new Set(); }
}
function salvarFavoritos() { localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify([...favoritos])); }
function preco(valor) { return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`; }
function escapar(valor = '') {
  return String(valor).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[c]);
}
function imagemPadrao() {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%231a1612' width='800' height='600'/%3E%3Cpath d='M270 340c70-125 190-125 260 0' fill='none' stroke='%23e8a020' stroke-opacity='.35' stroke-width='8' stroke-linecap='round'/%3E%3Ccircle cx='350' cy='300' r='8' fill='%23e8a020' fill-opacity='.45'/%3E%3Ccircle cx='450' cy='300' r='8' fill='%23e8a020' fill-opacity='.45'/%3E%3C/svg%3E`;
}

function aplicarConfig() {
  document.getElementById('btn-carrinho')?.classList.toggle('hidden', !CONFIG.carrinhoAtivo);
  document.getElementById('btn-favoritos')?.classList.toggle('hidden', !CONFIG.favoritosAtivos);
  document.getElementById('banner-manutencao')?.classList.toggle('hidden', !CONFIG.modoManutencao);
}

/* ---- Configurações do Supabase ---- */
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
  for (const [configKey, dbKey] of Object.entries({ carrinhoAtivo:'carrinho_ativo', mostrarPrecos:'mostrar_precos', modoManutencao:'modo_manutencao', favoritosAtivos:'favoritos_ativos', detalhesProdutoAtivos:'detalhes_produto_ativos' })) {
    if (cfg[dbKey] !== undefined) CONFIG[configKey] = cfg[dbKey] === 'true';
  }
  if (cfg.horario_abertura)  CONFIG.horarioAbertura = cfg.horario_abertura;
  if (cfg.horario_fechamento) CONFIG.horarioFechamento = cfg.horario_fechamento;
  if (cfg.horario_dias_semana) CONFIG.horarioDiasSemana = cfg.horario_dias_semana.split(',').filter(Boolean).map(Number);
  if (cfg.horario_fechado_manual !== undefined) CONFIG.horarioFechadoManual = cfg.horario_fechado_manual === 'true';
  if (cfg.dias_especiais) { try { CONFIG.diasEspeciais = JSON.parse(cfg.dias_especiais); } catch { /* mantém padrão */ } }
}

function iniciarStatusLoja() {
  const status = document.getElementById('store-status');
  if (!status) return;
  const atualizar = () => {
    const { aberto } = calcularStatusLoja({
      abertura: CONFIG.horarioAbertura, fechamento: CONFIG.horarioFechamento,
      diasSemana: CONFIG.horarioDiasSemana, diasEspeciais: CONFIG.diasEspeciais,
      fechadoManual: CONFIG.horarioFechadoManual,
    });
    status.textContent = aberto ? 'Aberto' : 'Fechado';
    status.className   = aberto ? 'aberto' : 'fechado';
  };
  atualizar();
  setInterval(atualizar, 60_000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) atualizar(); });
}

/* ---- Categorias ---- */
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

/* ---- Produtos ---- */
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
  const destaques = data.filter(p => p.destaque);
  const gridDestaques = document.getElementById('grid-destaques');
  if (destaques.length && gridDestaques) {
    document.getElementById('secao-destaques')?.classList.remove('hidden');
    gridDestaques.innerHTML = '';
    destaques.forEach(p => gridDestaques.appendChild(criarCard(p)));
  }
  renderProdutos();
}

/* ---- Adicionais ---- */
async function carregarAdicionais() {
  if (isDemo) {
    Object.entries(DEMO_ADICIONAIS).forEach(([pid, grupos]) => adicionaisPorProduto.set(pid, grupos));
    return;
  }
  const { data, error } = await supabase
    .from('grupos_adicionais')
    .select('*, adicionais(*)')
    .eq('ativo', true)
    .order('ordem', { ascending: true });
  if (error || !data) return;
  data.forEach(grupo => {
    grupo.adicionais = (grupo.adicionais || [])
      .filter(a => a.disponivel)
      .sort((a, b) => a.ordem - b.ordem);
    const arr = adicionaisPorProduto.get(grupo.produto_id) || [];
    arr.push(grupo);
    adicionaisPorProduto.set(grupo.produto_id, arr);
  });
}

/* ---- Render produtos ---- */
function renderProdutos() {
  const grid = document.getElementById('grid-produtos');
  const semResultados = document.getElementById('sem-resultados');
  const titulo = document.getElementById('titulo-cardapio');
  if (!grid) return;
  const filtrados = todosProdutos.filter(p => {
    const matchCat = categoriaAtiva === 'todos' || (categoriaAtiva === 'favoritos' ? favoritos.has(p.id) : p.categoria_id === categoriaAtiva);
    const texto = `${p.nome} ${p.descricao || ''} ${p.categorias?.nome || ''}`.toLowerCase();
    return matchCat && (!termoBusca || texto.includes(termoBusca));
  });
  if (titulo) titulo.firstChild.textContent = categoriaAtiva === 'favoritos' ? 'Favoritos' : 'Cardápio';
  grid.innerHTML = '';
  if (!filtrados.length) { semResultados?.classList.remove('hidden'); return; }
  semResultados?.classList.add('hidden');
  filtrados.forEach(p => grid.appendChild(criarCard(p)));
  initScrollReveal();
}

/* ---- Card de produto ---- */
function criarCard(produto) {
  const card = document.createElement('article');
  const disponivel = produto.disponivel !== false;
  const favorito   = favoritos.has(produto.id);
  const img        = produto.imagem_url || imagemPadrao();
  const temAdic    = (adicionaisPorProduto.get(produto.id) || []).length > 0;

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
      <div class="nome">${escapar(produto.nome)}</div>
      ${produto.descricao ? `<div class="descricao">${escapar(produto.descricao)}</div>` : ''}
      ${CONFIG.mostrarPrecos ? `<div class="preco-row"><span class="preco-cifrao">R$</span><span class="preco">${Number(produto.preco).toFixed(2).replace('.', ',')}</span></div>` : ''}
    </div>
    ${CONFIG.carrinhoAtivo ? `<button class="btn-add" type="button" ${!disponivel ? 'disabled' : ''}><span>${disponivel ? (temAdic ? '✦ Personalizar pedido' : '+ Adicionar ao pedido') : 'Indisponível'}</span></button>` : ''}`;

  if (CONFIG.detalhesProdutoAtivos) {
    card.addEventListener('click', ev => { if (!ev.target.closest('button')) abrirDetalhes(produto); });
    card.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); abrirDetalhes(produto); } });
  }
  card.querySelector('.btn-favorito')?.addEventListener('click', () => alternarFavorito(produto.id));
  if (CONFIG.carrinhoAtivo && disponivel) {
    card.querySelector('.btn-add')?.addEventListener('click', () => {
      if ((adicionaisPorProduto.get(produto.id) || []).length) {
        abrirCustomizacao(produto);
      } else {
        adicionarAoCarrinho(produto);
      }
    });
  }
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
  todosProdutos.filter(p => p.destaque).forEach(p => grid.appendChild(criarCard(p)));
}

/* ---- Modal de detalhes do produto ---- */
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
  adicionar.hidden   = !CONFIG.carrinhoAtivo;
  adicionar.disabled = !disponivel;
  const temAdic = (adicionaisPorProduto.get(produto.id) || []).length > 0;
  adicionar.textContent = disponivel ? (temAdic ? '✦ Personalizar pedido' : 'Adicionar ao pedido') : 'Indisponível';
  adicionar.onclick = () => {
    fecharDetalhes();
    if ((adicionaisPorProduto.get(produto.id) || []).length) {
      setTimeout(() => abrirCustomizacao(produto), 300);
    } else {
      adicionarAoCarrinho(produto);
    }
  };
  modal.classList.add('visivel'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-aberto');
}
function fecharDetalhes() {
  const modal = document.getElementById('modal-produto');
  modal?.classList.remove('visivel'); modal?.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-aberto');
}

/* ---- Modal de customização ---- */
let _customProduto = null;

function abrirCustomizacao(produto) {
  const grupos = adicionaisPorProduto.get(produto.id) || [];
  if (!grupos.length) { adicionarAoCarrinho(produto); return; }

  _customProduto = produto;
  const modal = document.getElementById('modal-customizacao');
  if (!modal) return;

  /* Preenche cabeçalho */
  const imgEl  = document.getElementById('modal-custom-img');
  const catEl  = document.getElementById('modal-custom-cat');
  const nomeEl = document.getElementById('modal-custom-nome');
  const precoEl = document.getElementById('modal-custom-preco-base');
  if (imgEl)  { imgEl.src = produto.imagem_url || imagemPadrao(); imgEl.alt = produto.nome; }
  if (catEl)  catEl.textContent   = produto.categorias?.nome || '';
  if (nomeEl) nomeEl.textContent  = produto.nome;
  const precoBase = Number(produto.preco);
  if (precoEl) precoEl.textContent = CONFIG.mostrarPrecos ? `A partir de R$ ${precoBase.toFixed(2).replace('.', ',')}` : '';

  /* Limpa campos */
  const identifEl = document.getElementById('modal-custom-identif');
  const obsEl     = document.getElementById('modal-custom-obs');
  if (identifEl) identifEl.value = '';
  if (obsEl)     obsEl.value     = '';

  /* Renderiza grupos */
  const gruposEl = document.getElementById('modal-custom-grupos');
  if (!gruposEl) return;
  gruposEl.innerHTML = '';

  grupos.forEach(grupo => {
    const tipoInput = grupo.max_sel === 1 ? 'radio' : 'checkbox';
    const section = document.createElement('div');
    section.className = 'grupo-adicional';
    section.dataset.grupoId    = grupo.id;
    section.dataset.obrigatorio = grupo.obrigatorio ? 'true' : 'false';
    section.dataset.min        = grupo.min_sel;
    section.dataset.max        = grupo.max_sel;

    const limiteHtml = grupo.max_sel > 1
      ? `<span class="grupo-limite">Até ${grupo.max_sel}</span>`
      : '';

    section.innerHTML = `
      <div class="grupo-header">
        <span class="grupo-nome">${escapar(grupo.nome)}</span>
        <span class="grupo-badge ${grupo.obrigatorio ? 'obrigatorio' : 'opcional'}">
          ${grupo.obrigatorio ? 'Obrigatório' : 'Opcional'}
        </span>
        ${limiteHtml}
      </div>
      <div class="grupo-opcoes">
        ${grupo.adicionais.map(a => `
          <label class="adicional-opcao">
            <input type="${tipoInput}" name="grupo-${escapar(grupo.id)}" value="${escapar(a.id)}"
                   data-nome="${escapar(a.nome)}" data-preco="${a.preco_adicional}"
                   class="adicional-input" ${!a.disponivel ? 'disabled' : ''}>
            <span class="adicional-check"></span>
            <span class="adicional-nome">${escapar(a.nome)}</span>
            <span class="adicional-preco ${a.preco_adicional === 0 ? 'incluso' : ''}">
              ${a.preco_adicional > 0 ? `+R$ ${a.preco_adicional.toFixed(2).replace('.', ',')}` : 'incluso'}
            </span>
          </label>`).join('')}
      </div>`;

    section.addEventListener('change', e => {
      if (!e.target.classList.contains('adicional-input')) return;
      const opcao = e.target.closest('.adicional-opcao');
      if (tipoInput === 'radio') {
        section.querySelectorAll('.adicional-opcao').forEach(o => o.classList.remove('selecionado'));
      }
      if (opcao) opcao.classList.toggle('selecionado', e.target.checked);
      /* limite de checkboxes */
      if (tipoInput === 'checkbox') {
        const checked = section.querySelectorAll('.adicional-input:checked');
        if (checked.length > grupo.max_sel) {
          e.target.checked = false;
          opcao?.classList.remove('selecionado');
          return;
        }
      }
      section.classList.remove('grupo-erro');
      atualizarTotalCustom(precoBase);
    });

    gruposEl.appendChild(section);
  });

  atualizarTotalCustom(precoBase);
  modal.classList.add('visivel');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-aberto');
}

function fecharCustomizacao() {
  const modal = document.getElementById('modal-customizacao');
  modal?.classList.remove('visivel');
  modal?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-aberto');
  _customProduto = null;
}

function atualizarTotalCustom(precoBase) {
  const gruposEl = document.getElementById('modal-custom-grupos');
  const totalEl  = document.getElementById('modal-custom-total');
  if (!gruposEl || !totalEl) return;
  let total = precoBase;
  gruposEl.querySelectorAll('.adicional-input:checked').forEach(input => {
    total += parseFloat(input.dataset.preco) || 0;
  });
  if (CONFIG.mostrarPrecos) totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  return total;
}

function confirmarCustomizacao() {
  if (!_customProduto) return;
  const gruposEl = document.getElementById('modal-custom-grupos');
  if (!gruposEl) return;

  /* Valida grupos obrigatórios */
  for (const gEl of gruposEl.querySelectorAll('.grupo-adicional[data-obrigatorio="true"]')) {
    const min     = parseInt(gEl.dataset.min) || 1;
    const checked = gEl.querySelectorAll('.adicional-input:checked');
    if (checked.length < min) {
      gEl.classList.remove('grupo-erro');
      void gEl.offsetWidth; /* força reflow para reiniciar animação */
      gEl.classList.add('grupo-erro');
      gEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      mostrarToast('Escolha uma opção obrigatória.');
      return;
    }
  }

  /* Coleta seleções */
  const adicionaisSelecionados = [];
  gruposEl.querySelectorAll('.adicional-input:checked').forEach(input => {
    adicionaisSelecionados.push({
      id:              input.value,
      nome:            input.dataset.nome,
      preco_adicional: parseFloat(input.dataset.preco) || 0,
    });
  });

  const precoBase  = Number(_customProduto.preco);
  const precoTotal = precoBase + adicionaisSelecionados.reduce((s, a) => s + a.preco_adicional, 0);
  const identificacao = document.getElementById('modal-custom-identif')?.value.trim() || '';
  const obs           = document.getElementById('modal-custom-obs')?.value.trim() || '';

  const itemCustomizado = {
    _uuid:         gerarUUID(),
    id:            _customProduto.id,
    nome:          _customProduto.nome,
    imagem_url:    _customProduto.imagem_url || '',
    preco_base:    precoBase,
    preco_total:   precoTotal,
    adicionais:    adicionaisSelecionados,
    obs,
    identificacao,
    qtd: 1,
  };

  adicionarAoCarrinho(itemCustomizado);
  fecharCustomizacao();
}

/* ---- Configuração dos modais ---- */
function configurarModais() {
  /* Modal de produto */
  document.querySelectorAll('[data-fechar-produto]').forEach(el => el.addEventListener('click', fecharDetalhes));
  /* Modal de customização */
  document.getElementById('modal-custom-fechar')?.addEventListener('click', fecharCustomizacao);
  document.getElementById('modal-custom-backdrop')?.addEventListener('click', fecharCustomizacao);
  document.getElementById('modal-custom-add')?.addEventListener('click', confirmarCustomizacao);
  /* Escape fecha ambos */
  document.addEventListener('keydown', ev => {
    if (ev.key !== 'Escape') return;
    fecharDetalhes();
    fecharCustomizacao();
  });
}

/* ---- Busca ---- */
function filtrarCategoria(id, botao) { categoriaAtiva = id; ativarBotao(botao); renderProdutos(); }
function ativarBotao(botao) { document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('ativo')); botao?.classList.add('ativo'); }
export function filtrarTodos(botao) { categoriaAtiva = 'todos'; ativarBotao(botao); renderProdutos(); }
export function filtrarFavoritos(botao) { categoriaAtiva = 'favoritos'; ativarBotao(botao); renderProdutos(); }

function configurarBusca() {
  const header = document.getElementById('input-busca');
  const hero   = document.getElementById('hero-busca');
  [header, hero].filter(Boolean).forEach(input => input.addEventListener('input', ev => {
    termoBusca = ev.target.value.toLowerCase().trim();
    if (ev.target === header && hero) hero.value = ev.target.value;
    if (ev.target === hero && header) header.value = ev.target.value;
    renderProdutos();
  }));
}

function renderSkeletons(container, n) {
  if (container) container.innerHTML = Array(n).fill('<div class="skeleton" style="height:260px"></div>').join('');
}
