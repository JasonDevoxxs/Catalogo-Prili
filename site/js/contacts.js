import CONFIG from './config.js';

export function iniciarContatos() {
  const painel = document.getElementById('contatos-flutuantes');
  if (!painel) return;

  if (!CONFIG.contatosFlutuantesAtivos) { painel.hidden = true; return; }

  const numero = window._whatsapp || CONFIG.whatsapp;
  const waLink = document.getElementById('atalho-whatsapp');
  if (waLink) waLink.href = `https://wa.me/${numero}?text=${encodeURIComponent(`Olá! Vim pelo catálogo da ${CONFIG.nomeLoja}.`)}`;

  if (CONFIG.instagram) {
    const igLink = document.getElementById('atalho-instagram');
    if (igLink) {
      igLink.href   = `https://instagram.com/${CONFIG.instagram.replace('@', '')}`;
      igLink.hidden = false;
    }
  }
}
