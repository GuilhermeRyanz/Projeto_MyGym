export function fomateDayWeek(dias_permitidos?: number[]): string[] | string {
  const diasSemana = [
    'Dom',    // 0
    'Seg',    // 1
    'Ter',      // 2
    'Qua',     // 3
    'Qui',     // 4
    'Sex',      // 5
    'Sáb'      // 6
  ];

  if (!dias_permitidos || dias_permitidos?.length === 0) {
    return "Todos os dias"
  } else {
    return dias_permitidos.map(dia => diasSemana[dia-1]);
  }
}
