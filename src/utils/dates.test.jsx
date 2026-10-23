import { describe, expect, it } from 'vitest';
import { inPeriod, parseDate } from './dates';

describe('Período dos arquivos', () => {
  it('interpreta datas brasileiras com horário', () => {
    const date = parseDate('13/10/2026, 14:30:00');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(9);
    expect(date.getDate()).toBe(13);
  });

  it('inclui todo o mês final e exclui arquivos fora do intervalo', () => {
    expect(inPeriod({ date: '31/05/2024 23:59' }, '2024-05', '2024-05', 0)).toBe(true);
    expect(inPeriod({ date: '01/06/2024 00:00' }, '2024-05', '2024-05', 0)).toBe(false);
    expect(inPeriod({ date: '30/04/2024 23:59' }, '2024-05', '2024-05', 0)).toBe(false);
  });
});
