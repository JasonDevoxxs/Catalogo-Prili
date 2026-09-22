/* ============================================================
   config.js — CONFIGURAÇÃO POR CLIENTE
   Preencha com os dados do projeto Supabase do cliente.
   ============================================================ */

const CONFIG = {
  /* --- Supabase --- */
  supabaseUrl: 'https://SEU-PROJETO.supabase.co',
  supabaseAnonKey: 'SUA-ANON-KEY-AQUI',

  /* --- Loja --- */
  nomeLoja: 'Tonynhos bar',
  whatsapp: '5519982992356',
  instagram: 'tonynhosbar_',
  endereco: 'Rua José Ernesto dos Santos Filho, 40',
  horario: '17:00 – 22:00',
  email: 'pastelariadomp@gmail.com',

  /* --- Features --- */
  carrinhoAtivo: true,         /* false = oculta botão de carrinho e pedido */
  mostrarPrecos: true,         /* false = oculta preços (catálogo visual puro) */
  modoManutencao: false,       /* true = exibe banner de manutenção */
  favoritosAtivos: true,       /* false = oculta favoritos */
  detalhesProdutoAtivos: true, /* false = desativa o modal de detalhes */
  temaPadrao: 'dark',          /* 'dark' ou 'light' */
  contatosFlutuantesAtivos: true,
};

export default CONFIG;
