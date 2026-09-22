import CONFIG from './config.js';

const CHAVE_TEMA = 'catalogo-tema';

export function iniciarTema() {
  const botao = document.getElementById('btn-tema');
  const temaSalvo = localStorage.getItem(CHAVE_TEMA);
  aplicarTema(temaSalvo || CONFIG.temaPadrao || 'dark');

  botao?.addEventListener('click', () => {
    const proximo = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem(CHAVE_TEMA, proximo);
    aplicarTema(proximo);
  });
}

function aplicarTema(tema) {
  const claro = tema === 'light';
  document.documentElement.dataset.theme = claro ? 'light' : 'dark';
  const botao = document.getElementById('btn-tema');
  if (botao) {
    botao.setAttribute('aria-label', claro ? 'Ativar tema escuro' : 'Ativar tema claro');
    botao.setAttribute('title', claro ? 'Ativar tema escuro' : 'Ativar tema claro');
  }
}
