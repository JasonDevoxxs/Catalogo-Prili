import CONFIG from './config.js';

const CHAVE_CARRINHO = 'catalogo-carrinho';
let itens = carregarCarrinho();

function carregarCarrinho() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_CARRINHO));
    return Array.isArray(salvo) ? salvo.filter(item => item?.id && Number(item.qtd) > 0) : [];
  } catch { return []; }
}
function salvarCarrinho() { localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens)); }

/* ---- API PÚBLICA ---- */
export function adicionarAoCarrinho(produto) {
  const existente = itens.find(i => i.id === produto.id);
  if (existente) existente.qtd++;
  else itens.push({ ...produto, qtd: 1 });
  salvarCarrinho();
  renderCarrinho();
  mostrarToast(`${produto.nome} adicionado!`);
}

export function iniciarCarrinho() {
  document.getElementById('btn-carrinho')?.addEventListener('click', abrirCarrinho);
  document.getElementById('btn-fechar-carrinho')?.addEventListener('click', fecharCarrinho);
  document.getElementById('overlay')?.addEventListener('click', fecharCarrinho);

  /* Botão do drawer abre o checkout em vez de ir direto ao WhatsApp */
  document.getElementById('btn-whatsapp')?.addEventListener('click', abrirCheckout);

  /* Checkout */
  document.getElementById('checkout-fechar')?.addEventListener('click', fecharCheckout);
  document.getElementById('checkout-backdrop')?.addEventListener('click', fecharCheckout);
  document.getElementById('co-recebimento')?.addEventListener('change', toggleEndereco);
  /* Sem duplo recebimento no drawer — o checkout modal já coleta tudo */
  document.getElementById('checkout-form')?.addEventListener('submit', confirmarPedido);

  renderCarrinho();
}

/* ---- RENDER CARRINHO ---- */
function renderCarrinho() {
  const lista   = document.getElementById('itens-carrinho');
  const countEl = document.getElementById('cart-count');
  const totalEl = document.getElementById('total-carrinho');
  const btnWpp  = document.getElementById('btn-whatsapp');
  if (!lista) return;

  const totalItens = itens.reduce((s, i) => s + i.qtd, 0);
  const totalValor = itens.reduce((s, i) => s + i.preco * i.qtd, 0);

  if (countEl) countEl.textContent = totalItens;
  if (totalEl) totalEl.textContent = `R$ ${totalValor.toFixed(2).replace('.', ',')}`;
  if (btnWpp)  btnWpp.disabled = itens.length === 0;

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
  itens.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'item-carrinho';
    el.style.animationDelay = `${idx * 60}ms`;
    const semImg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%23f3f4f6" width="60" height="60"/%3E%3C/svg%3E';
    el.innerHTML = `
      <img src="${item.imagem_url || semImg}" alt="${item.nome}" onerror="this.src='${semImg}'">
      <div class="info">
        <div class="nome">${item.nome}</div>
        <div class="preco-unit">R$ ${Number(item.preco).toFixed(2).replace('.', ',')} / un.</div>
        <div class="controles">
          <button class="btn-menos" aria-label="Diminuir">−</button>
          <span class="qtd">${item.qtd}</span>
          <button class="btn-mais" aria-label="Aumentar">+</button>
        </div>
      </div>
      <div class="item-carrinho-direita">
        <span class="subtotal">R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}</span>
        <button class="btn-remover" aria-label="Remover">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>`;
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

/* ---- CHECKOUT ---- */
function gerarNumeroPedido() {
  const agora = new Date();
  const d = String(agora.getDate()).padStart(2,'0');
  const m = String(agora.getMonth()+1).padStart(2,'0');
  const h = String(agora.getHours()).padStart(2,'0');
  const min = String(agora.getMinutes()).padStart(2,'0');
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `${d}${m}-${h}${min}-${seq}`;
}

function abrirCheckout() {
  if (itens.length === 0) return;
  fecharCarrinho();

  /* Preenche resumo do pedido */
  const total = itens.reduce((s, i) => s + i.preco * i.qtd, 0);
  const resumo = document.getElementById('checkout-resumo');
  if (resumo) {
    resumo.innerHTML = `
      <div class="checkout-resumo-titulo">Resumo do pedido</div>
      <ul class="checkout-resumo-lista">
        ${itens.map(i => `
          <li>
            <span class="res-nome">${i.nome} <em>x${i.qtd}</em></span>
            <span class="res-preco">R$ ${(i.preco*i.qtd).toFixed(2).replace('.',',')}</span>
          </li>`).join('')}
      </ul>
      <div class="checkout-resumo-total">
        <span>Total</span>
        <strong>R$ ${total.toFixed(2).replace('.',',')}</strong>
      </div>`;
  }

  /* Copia observação do drawer para o checkout */
  const obsDrawer = document.getElementById('obs-pedido')?.value;
  if (obsDrawer) { const el = document.getElementById('co-obs'); if (el) el.value = obsDrawer; }

  const modal = document.getElementById('modal-checkout');
  if (modal) { modal.classList.add('visivel'); modal.setAttribute('aria-hidden','false'); }
  document.body.classList.add('modal-aberto');
  document.getElementById('co-nome')?.focus();
}

function fecharCheckout() {
  const modal = document.getElementById('modal-checkout');
  if (modal) { modal.classList.remove('visivel'); modal.setAttribute('aria-hidden','true'); }
  document.body.classList.remove('modal-aberto');
}

function toggleEndereco() {
  const rec   = document.getElementById('co-recebimento')?.value;
  const campo = document.getElementById('campo-endereco');
  const input = document.getElementById('co-end');
  if (!campo) return;
  const entrega = rec === 'entrega';
  campo.style.display = entrega ? '' : 'none';
  if (input) input.required = entrega;
}

function confirmarPedido(e) {
  e.preventDefault();
  const nome       = document.getElementById('co-nome')?.value.trim();
  const tel        = document.getElementById('co-tel')?.value.trim();
  const end        = document.getElementById('co-end')?.value.trim();
  const obs        = document.getElementById('co-obs')?.value.trim();
  const recEl      = document.getElementById('co-recebimento');
  const pagEl      = document.getElementById('co-pagamento');
  const recLabel   = recEl?.selectedOptions[0]?.text || '';
  const pagLabel   = pagEl?.selectedOptions[0]?.text || '';
  const entrega    = recEl?.value === 'entrega';

  if (!nome) { document.getElementById('co-nome')?.focus(); mostrarToast('Informe seu nome.'); return; }
  if (!tel)  { document.getElementById('co-tel')?.focus();  mostrarToast('Informe seu telefone.'); return; }
  if (entrega && !end) { document.getElementById('co-end')?.focus(); mostrarToast('Informe o endereço de entrega.'); return; }

  const numeroPedido = gerarNumeroPedido();
  const total = itens.reduce((s, i) => s + i.preco * i.qtd, 0);
  const wpp   = window._whatsapp || CONFIG.whatsapp;

  /* Mensagem estruturada — preparada para futura integração com sistema de gestão */
  let msg = '';
  msg += `🧾 *PEDIDO #${numeroPedido} — ${CONFIG.nomeLoja}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `👤 *Cliente:* ${nome}\n`;
  msg += `📱 *Telefone:* ${tel}\n`;
  msg += `🚗 *Recebimento:* ${recLabel}\n`;
  if (entrega && end) msg += `📍 *Endereço:* ${end}\n`;
  msg += `💳 *Pagamento:* ${pagLabel}\n\n`;
  msg += `📋 *ITENS DO PEDIDO:*\n`;
  itens.forEach(i => {
    msg += `• ${i.nome} x${i.qtd}  —  R$ ${(i.preco*i.qtd).toFixed(2).replace('.',',')}\n`;
  });
  msg += `\n💰 *TOTAL: R$ ${total.toFixed(2).replace('.',',')}*`;
  if (obs) msg += `\n\n📝 *Observações:* ${obs}`;
  msg += `\n\n_Pedido realizado via catálogo digital_`;

  fecharCheckout();
  window.open(`https://wa.me/${wpp}?text=${encodeURIComponent(msg)}`, '_blank');

  /* Limpa carrinho após envio */
  itens = [];
  salvarCarrinho();
  renderCarrinho();
  mostrarToast('Pedido enviado! ✓');
}

/* ---- DRAWER ---- */
function abrirCarrinho() {
  const drawer  = document.getElementById('drawer-carrinho');
  const overlay = document.getElementById('overlay');
  drawer?.classList.add('aberto');
  overlay?.classList.add('visivel');
  document.body.style.overflow = 'hidden';
  /* Re-renderiza para acionar animações escalonadas */
  renderCarrinho();
}
function fecharCarrinho() {
  const drawer  = document.getElementById('drawer-carrinho');
  const overlay = document.getElementById('overlay');
  drawer?.classList.remove('aberto');
  overlay?.classList.remove('visivel');
  document.body.style.overflow = '';
}

/* ---- TOAST ---- */
function mostrarToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'toast'; document.body.appendChild(toast); }
  toast.textContent = msg;
  toast.classList.add('visivel');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('visivel'), 2200);
}
