import CONFIG from './config.js';

const CHAVE_CARRINHO = 'catalogo-carrinho';
let itens = carregarCarrinho();

function carregarCarrinho() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_CARRINHO));
    return Array.isArray(salvo) ? salvo.filter(item => item?.id && Number(item.qtd) > 0) : [];
  } catch {
    return [];
  }
}

function salvarCarrinho() {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
}

/* ---- API PÚBLICA ---- */
export function adicionarAoCarrinho(produto) {
  const existente = itens.find(i => i.id === produto.id);
  if (existente) {
    existente.qtd++;
  } else {
    itens.push({ ...produto, qtd: 1 });
  }
  salvarCarrinho();
  renderCarrinho();
  mostrarToast(`${produto.nome} adicionado!`);
}

export function iniciarCarrinho() {
  document.getElementById('btn-carrinho')?.addEventListener('click', abrirCarrinho);
  document.getElementById('btn-fechar-carrinho')?.addEventListener('click', fecharCarrinho);
  document.getElementById('overlay')?.addEventListener('click', fecharCarrinho);
  document.getElementById('btn-whatsapp')?.addEventListener('click', enviarWhatsApp);
  renderCarrinho();
}

/* ---- RENDER ---- */
function renderCarrinho() {
  const lista = document.getElementById('itens-carrinho');
  const countEl = document.getElementById('cart-count');
  const totalEl = document.getElementById('total-carrinho');
  const btnWpp = document.getElementById('btn-whatsapp');
  if (!lista) return;

  const totalItens = itens.reduce((s, i) => s + i.qtd, 0);
  const totalValor = itens.reduce((s, i) => s + i.preco * i.qtd, 0);

  if (countEl) countEl.textContent = totalItens;
  if (totalEl) totalEl.textContent = `R$ ${totalValor.toFixed(2).replace('.', ',')}`;
  if (btnWpp) btnWpp.disabled = itens.length === 0;

  if (itens.length === 0) {
    lista.innerHTML = `<div class="carrinho-vazio">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      <p>Seu carrinho está vazio</p>
    </div>`;
    return;
  }

  lista.innerHTML = '';
  itens.forEach(item => {
    const el = document.createElement('div');
    el.className = 'item-carrinho';
    const semImg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%23f3f4f6" width="60" height="60"/%3E%3C/svg%3E';
    el.innerHTML = `
      <img src="${item.imagem_url || semImg}" alt="${item.nome}" onerror="this.src='${semImg}'">
      <div class="info">
        <div class="nome">${item.nome}</div>
        <div class="preco-unit">R$ ${Number(item.preco).toFixed(2).replace('.', ',')}</div>
        <div class="controles">
          <button class="btn-menos" aria-label="Diminuir">−</button>
          <span class="qtd">${item.qtd}</span>
          <button class="btn-mais" aria-label="Aumentar">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.3rem">
        <span class="subtotal">R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}</span>
        <button class="btn-remover" aria-label="Remover">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    `;
    el.querySelector('.btn-menos').addEventListener('click', () => alterarQtd(item.id, -1));
    el.querySelector('.btn-mais').addEventListener('click',  () => alterarQtd(item.id, +1));
    el.querySelector('.btn-remover').addEventListener('click', () => removerItem(item.id));
    lista.appendChild(el);
  });
}

function alterarQtd(id, delta) {
  const item = itens.find(i => i.id === id);
  if (!item) return;
  item.qtd += delta;
  if (item.qtd <= 0) removerItem(id);
  else { salvarCarrinho(); renderCarrinho(); }
}

function removerItem(id) {
  itens = itens.filter(i => i.id !== id);
  salvarCarrinho();
  renderCarrinho();
}

/* ---- WHATSAPP ---- */
function enviarWhatsApp() {
  const wpp = window._whatsapp || CONFIG.whatsapp;
  const obs = document.getElementById('obs-pedido')?.value?.trim();
  const recebimento = document.getElementById('tipo-recebimento')?.selectedOptions[0]?.text;
  const pagamento = document.getElementById('forma-pagamento')?.selectedOptions[0]?.text;

  let msg = `*Olá! Gostaria de fazer um pedido:*\n\n`;
  itens.forEach(i => {
    msg += `• ${i.nome} x${i.qtd} — R$ ${(i.preco * i.qtd).toFixed(2).replace('.', ',')}\n`;
  });
  const total = itens.reduce((s, i) => s + i.preco * i.qtd, 0);
  msg += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;
  if (recebimento) msg += `\n*Recebimento:* ${recebimento}`;
  if (pagamento) msg += `\n*Pagamento:* ${pagamento}`;
  if (obs) msg += `\n\n*Observação:* ${obs}`;

  const url = `https://wa.me/${wpp}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/* ---- DRAWER ---- */
function abrirCarrinho() {
  document.getElementById('drawer-carrinho')?.classList.add('aberto');
  document.getElementById('overlay')?.classList.add('visivel');
  document.body.style.overflow = 'hidden';
}

function fecharCarrinho() {
  document.getElementById('drawer-carrinho')?.classList.remove('aberto');
  document.getElementById('overlay')?.classList.remove('visivel');
  document.body.style.overflow = '';
}

/* ---- TOAST ---- */
function mostrarToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('visivel');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('visivel'), 2200);
}
