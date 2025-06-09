export function fomateDayWeek(dias_permitidos?: number[]): string[] | string {
  const diasSemana = [
    'Seg',    // 1
    'Ter',      // 2
    'Qua',     // 3
    'Qui',     // 4
    'Sex',      // 5
    'Sáb',    // 6
    'Dom',    // 0
  ];

  if (!dias_permitidos || dias_permitidos?.length === 0) {
    return "Todos os dias"
  } else {
    return dias_permitidos.map(dia => diasSemana[dia]);
  }
}
