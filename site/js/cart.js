import CONFIG from './config.js';

const CHAVE_CARRINHO = 'catalogo-carrinho';
let itens = carregarCarrinho();

function gerarUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function carregarCarrinho() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_CARRINHO));
    if (!Array.isArray(salvo)) return [];
    return salvo
      .filter(i => i?.id && Number(i.qtd) > 0)
      .map(i => ({
        _uuid:         i._uuid         || gerarUUID(),
        id:            i.id,
        nome:          i.nome           || '',
        imagem_url:    i.imagem_url     || '',
        preco_base:    Number(i.preco_base  || i.preco || 0),
        preco_total:   Number(i.preco_total || i.preco || 0),
        adicionais:    i.adicionais     || [],
        obs:           i.obs            || '',
        identificacao: i.identificacao  || '',
        qtd:           Number(i.qtd)    || 1,
      }));
  } catch { return []; }
}
function salvarCarrinho() { localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens)); }

function temCustomizacao(item) {
  return !!(item.adicionais?.length || item.obs || item.identificacao);
}

/* ---- API PÚBLICA ---- */
export function adicionarAoCarrinho(input) {
  if (input._uuid) {
    /* item já construído pelo modal de customização */
    itens.push(input);
  } else {
    /* produto simples — agrupa se já existir sem customização */
    const existente = itens.find(i => i.id === input.id && !temCustomizacao(i));
    if (existente) {
      existente.qtd++;
    } else {
      itens.push({
        _uuid:         gerarUUID(),
        id:            input.id,
        nome:          input.nome,
        imagem_url:    input.imagem_url || '',
        preco_base:    Number(input.preco),
        preco_total:   Number(input.preco),
        adicionais:    [],
        obs:           '',
        identificacao: '',
        qtd:           1,
      });
    }
  }
  salvarCarrinho();
  renderCarrinho();
  mostrarToast(`${input.nome} adicionado!`);
}

export function iniciarCarrinho() {
  document.getElementById('btn-carrinho')?.addEventListener('click', abrirCarrinho);
  document.getElementById('btn-fechar-carrinho')?.addEventListener('click', fecharCarrinho);
  document.getElementById('overlay')?.addEventListener('click', fecharCarrinho);
  document.getElementById('btn-whatsapp')?.addEventListener('click', abrirCheckout);
  document.getElementById('checkout-fechar')?.addEventListener('click', fecharCheckout);
  document.getElementById('checkout-backdrop')?.addEventListener('click', fecharCheckout);
  document.getElementById('co-recebimento')?.addEventListener('change', toggleEndereco);
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
  const totalValor = itens.reduce((s, i) => s + i.preco_total * i.qtd, 0);

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
  const semImg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%23f3f4f6" width="60" height="60"/%3E%3C/svg%3E';

  itens.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'item-carrinho';
    el.style.animationDelay = `${idx * 60}ms`;

    const temCustom = temCustomizacao(item);
    const precoUnit = CONFIG.mostrarPrecos
      ? `<div class="preco-unit">R$ ${item.preco_total.toFixed(2).replace('.', ',')} / un.</div>`
      : '';
    const adicionaisHtml = temCustom && item.adicionais?.length
      ? `<div class="item-adicionais">↳ ${item.adicionais.map(a => a.nome).join(', ')}</div>`
      : '';
    const identificacaoHtml = temCustom && item.identificacao
      ? `<div class="item-identificacao">📌 ${item.identificacao}</div>`
      : '';
    const obsHtml = temCustom && item.obs
      ? `<div class="item-obs">💬 ${item.obs}</div>`
      : '';

    el.innerHTML = `
      <img src="${item.imagem_url || semImg}" alt="${item.nome}" onerror="this.src='${semImg}'">
      <div class="info">
        <div class="nome">${item.nome}</div>
        ${temCustom ? adicionaisHtml + identificacaoHtml + obsHtml : precoUnit}
        <div class="controles">
          <button class="btn-menos" aria-label="Diminuir">−</button>
          <span class="qtd">${item.qtd}</span>
          <button class="btn-mais" aria-label="Aumentar">+</button>
        </div>
      </div>
      <div class="item-carrinho-direita">
        <span class="subtotal">R$ ${(item.preco_total * item.qtd).toFixed(2).replace('.', ',')}</span>
        <button class="btn-remover" aria-label="Remover">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>`;

    el.querySelector('.btn-menos').addEventListener('click', () => alterarQtd(item._uuid, -1));
    el.querySelector('.btn-mais').addEventListener('click',  () => alterarQtd(item._uuid, +1));
    el.querySelector('.btn-remover').addEventListener('click', () => removerItem(item._uuid));
    lista.appendChild(el);
  });
}

function alterarQtd(uuid, delta) {
  const item = itens.find(i => i._uuid === uuid);
  if (!item) return;
  item.qtd += delta;
  if (item.qtd <= 0) removerItem(uuid);
  else { salvarCarrinho(); renderCarrinho(); }
}
function removerItem(uuid) {
  itens = itens.filter(i => i._uuid !== uuid);
  salvarCarrinho();
  renderCarrinho();
}

/* ---- CHECKOUT ---- */
function gerarNumeroPedido() {
  const agora = new Date();
  const d   = String(agora.getDate()).padStart(2,'0');
  const m   = String(agora.getMonth()+1).padStart(2,'0');
  const h   = String(agora.getHours()).padStart(2,'0');
  const min = String(agora.getMinutes()).padStart(2,'0');
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `${d}${m}-${h}${min}-${seq}`;
}

function abrirCheckout() {
  if (itens.length === 0) return;
  fecharCarrinho();

  const total = itens.reduce((s, i) => s + i.preco_total * i.qtd, 0);
  const resumo = document.getElementById('checkout-resumo');
  if (resumo) {
    resumo.innerHTML = `
      <div class="checkout-resumo-titulo">Resumo do pedido</div>
      <ul class="checkout-resumo-lista">
        ${itens.map(i => {
          const temCustom = temCustomizacao(i);
          const extras = temCustom && i.adicionais?.length
            ? `<br><small style="opacity:.75;font-size:.7rem">${i.adicionais.map(a => a.nome).join(', ')}</small>`
            : '';
          const ident = temCustom && i.identificacao
            ? `<br><small style="opacity:.6;font-size:.68rem">📌 ${i.identificacao}</small>`
            : '';
          return `<li>
            <span class="res-nome">${i.nome}${i.qtd > 1 ? ` <em>x${i.qtd}</em>` : ''}${extras}${ident}</span>
            <span class="res-preco">R$ ${(i.preco_total*i.qtd).toFixed(2).replace('.',',')}</span>
          </li>`;
        }).join('')}
      </ul>
      <div class="checkout-resumo-total">
        <span>Total</span>
        <strong>R$ ${total.toFixed(2).replace('.',',')}</strong>
      </div>`;
  }

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
  const nome     = document.getElementById('co-nome')?.value.trim();
  const tel      = document.getElementById('co-tel')?.value.trim();
  const end      = document.getElementById('co-end')?.value.trim();
  const obs      = document.getElementById('co-obs')?.value.trim();
  const recEl    = document.getElementById('co-recebimento');
  const pagEl    = document.getElementById('co-pagamento');
  const recLabel = recEl?.selectedOptions[0]?.text || '';
  const pagLabel = pagEl?.selectedOptions[0]?.text || '';
  const entrega  = recEl?.value === 'entrega';

  if (!nome)            { document.getElementById('co-nome')?.focus(); mostrarToast('Informe seu nome.'); return; }
  if (!tel)             { document.getElementById('co-tel')?.focus();  mostrarToast('Informe seu telefone.'); return; }
  if (entrega && !end)  { document.getElementById('co-end')?.focus();  mostrarToast('Informe o endereço de entrega.'); return; }

  const numeroPedido = gerarNumeroPedido();
  const total = itens.reduce((s, i) => s + i.preco_total * i.qtd, 0);
  const wpp   = window._whatsapp || CONFIG.whatsapp;

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
    msg += `• ${i.nome}`;
    if (i.qtd > 1) msg += ` x${i.qtd}`;
    msg += `  —  R$ ${(i.preco_total * i.qtd).toFixed(2).replace('.', ',')}\n`;
    if (i.adicionais?.length) msg += `   ↳ ${i.adicionais.map(a => a.nome).join(', ')}\n`;
    if (i.identificacao)      msg += `   📌 ${i.identificacao}\n`;
    if (i.obs)                msg += `   💬 ${i.obs}\n`;
  });
  msg += `\n💰 *TOTAL: R$ ${total.toFixed(2).replace('.',',')}*`;
  if (obs) msg += `\n\n📝 *Observações gerais:* ${obs}`;
  msg += `\n\n_Pedido realizado via catálogo digital_`;

  fecharCheckout();
  window.open(`https://wa.me/${wpp}?text=${encodeURIComponent(msg)}`, '_blank');

  itens = [];
  salvarCarrinho();
  renderCarrinho();
  mostrarToast('Pedido enviado! ✓');
}

/* ---- DRAWER ---- */
function abrirCarrinho() {
  document.getElementById('drawer-carrinho')?.classList.add('aberto');
  document.getElementById('overlay')?.classList.add('visivel');
  document.body.style.overflow = 'hidden';
  renderCarrinho();
}
function fecharCarrinho() {
  document.getElementById('drawer-carrinho')?.classList.remove('aberto');
  document.getElementById('overlay')?.classList.remove('visivel');
  document.body.style.overflow = '';
}

/* ---- TOAST ---- */
export function mostrarToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'toast'; document.body.appendChild(toast); }
  toast.textContent = msg;
  toast.classList.add('visivel');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('visivel'), 2200);
}
