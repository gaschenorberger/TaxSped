import { describe, expect, it } from 'vitest';
import { getUsage } from './usage';

describe('Uso do plano', () => {
  const now = new Date(2026, 9, 13);

  it('soma entradas e resultados sem contar o tamanho do pedido novamente', () => {
    const files = [{ date: '13/10/2026', size: '99 GB', inputs: [{ size: '1 GB' }, { size: '512 KB' }], outputs: [{ size: '2,5 MB' }, { size: '9 GB', deleted: true }] }];
    expect(getUsage(files, now)).toEqual({ count: 1, used: 1027, total: 3 });
  });

  it('mantém os registros antigos e ignora pedidos excluídos no resumo', () => {
    const files = [{ date: '13/10/2026', size: '2 MB' }, { date: '13/09/2026', size: '3 MB' }, { date: '13/10/2026', inputs: [{ size: '1 GB' }], deleted: true }];
    expect(getUsage(files, now)).toEqual({ count: 1, used: 5, total: 2 });
  });

  it('aceita tamanhos ausentes ou inválidos sem interromper a página', () => {
    const files = [{ date: '13/10/2026', inputs: [{ name: 'sem-tamanho.txt' }, { size: null }, { size: 'inválido' }, { size: '-2 MB' }, { size: '1048576 B' }], outputs: [] }, { inputs: [], outputs: [] }];
    expect(getUsage(files, now)).toEqual({ count: 1, used: 1, total: 5 });
  });
});
