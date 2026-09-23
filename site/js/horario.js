/* ============================================================
   horario.js — calcula em tempo real se a loja está Aberta ou
   Fechada, com base no horário padrão, nos dias da semana
   configurados e em dias especiais (datas específicas com
   horário diferente, definidos pelos donos no admin).
   ============================================================ */

function paraMinutos(horaTexto) {
  const [h, m] = String(horaTexto || '0:0').split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function dataLocalISO(data) {
  const pad = n => String(n).padStart(2, '0');
  return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}`;
}

/**
 * Retorna o horário (abertura/fechamento) válido para uma data,
 * considerando dias especiais antes da regra padrão da semana.
 * Retorna null se a loja não abre nesse dia.
 */
function horarioDoDia(data, cfg) {
  const especial = (cfg.diasEspeciais || []).find(d => d.data === dataLocalISO(data));
  if (especial) {
    if (especial.fechado) return null;
    return {
      abertura: especial.abertura || cfg.abertura,
      fechamento: especial.fechamento || cfg.fechamento,
    };
  }
  if (!cfg.diasSemana.includes(data.getDay())) return null;
  return { abertura: cfg.abertura, fechamento: cfg.fechamento };
}

/**
 * cfg = {
 *   abertura: '17:00', fechamento: '22:00',
 *   diasSemana: [0,2,3,4,5,6],           // 0=domingo … 6=sábado
 *   diasEspeciais: [{ data:'2026-12-24', abertura, fechamento, fechado }],
 *   fechadoManual: false,
 * }
 */
export function calcularStatusLoja(cfg, agora = new Date()) {
  if (cfg.fechadoManual) return { aberto: false };

  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

  // Expediente de ontem pode ter virado a meia-noite e ainda estar em curso.
  const ontem = new Date(agora);
  ontem.setDate(ontem.getDate() - 1);
  const horarioOntem = horarioDoDia(ontem, cfg);
  if (horarioOntem) {
    const abreOntem = paraMinutos(horarioOntem.abertura);
    const fechaOntem = paraMinutos(horarioOntem.fechamento);
    if (fechaOntem <= abreOntem && minutosAgora < fechaOntem) {
      return { aberto: true };
    }
  }

  const horarioHoje = horarioDoDia(agora, cfg);
  if (!horarioHoje) return { aberto: false };

  const abre = paraMinutos(horarioHoje.abertura);
  const fecha = paraMinutos(horarioHoje.fechamento);

  if (fecha <= abre) {
    // Fecha depois da meia-noite: hoje fica aberto a partir da abertura.
    return { aberto: minutosAgora >= abre };
  }
  return { aberto: minutosAgora >= abre && minutosAgora < fecha };
}
