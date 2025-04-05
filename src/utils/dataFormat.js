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
export function formatarDataParaExibir(date) {
  const dia = getDate(date);
  const mes = getMonth(date) + 1;
  const ano = getYear(date);

  const diaStr = String(dia).padStart(2, '0');
  const mesStr = String(mes).padStart(2, '0');

  return `${diaStr}/${mesStr}/${ano}`;
}
