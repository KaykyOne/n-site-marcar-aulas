import { getDate, getMonth, getYear } from 'date-fns';

// yyyy-MM-dd → para salvar no banco como texto
export function formatarDataParaSalvar(date) {
  const dia = getDate(date); // Dia do mês (1-31)
  const mes = getMonth(date) + 1;
  const ano = getYear(date);

  // Garantir formato yyyy-MM-dd (com padding)
  const diaStr = String(dia).padStart(2, '0');
  const mesStr = String(mes).padStart(2, '0');

  return `${ano}-${mesStr}-${diaStr}`;
}

// dd/MM/yyyy → para exibir pro usuário
export function formatarDataParaExibir(dateStr) {
  const [ano, mes, diaComHora] = dateStr.split(/[-/]/); // aceita "-" ou "/"
  const dia = diaComHora.slice(0, 2);
  return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
}

