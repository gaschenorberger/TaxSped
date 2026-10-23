import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../app/App';

describe('Arquivos gerados', () => {
  it('mostra resultados ligados ao pedido e restaura sem excluir o pedido', async () => {
    const user = userEvent.setup();
    const order = { protocol: 'SPED-PEDIDO-123', name: 'Pedido 123', status: 'Concluído', sped: 'ECD', conversion: 'TXT → Excel', date: new Date().toLocaleString('pt-BR'), inputs: [{ protocol: 'entrada-1', name: 'original.txt', size: '1 MB' }], outputs: [{ id: 'resultado-1', name: 'resultado.xlsx', size: '2 MB' }, { id: 'resultado-2', name: 'outro.xlsx', size: '3 MB' }] };
    localStorage.setItem('taxsped.files', JSON.stringify([order]));
    sessionStorage.setItem('taxsped.session', 'active');
    window.location.hash = '#/arquivos';
    render(<App />);
    expect(screen.queryByText('original.txt')).toBeNull();
    const row = screen.getByText('resultado.xlsx').closest('tr');
    await user.click(within(row).getByRole('button', { name: 'Pedido 123' }));
    const dialog = screen.getByRole('dialog', { name: 'Detalhes do pedido' });
    expect(within(dialog).getByText(order.protocol)).toBeTruthy();
    expect(within(dialog).getByText('original.txt')).toBeTruthy();
    await user.click(within(dialog).getByRole('button', { name: 'Fechar pedido' }));
    await user.click(within(row).getByRole('button', { name: 'Mover para lixeira' }));
    expect(screen.queryByText('resultado.xlsx')).toBeNull();
    expect(screen.getByText('outro.xlsx')).toBeTruthy();
    const saved = JSON.parse(localStorage.getItem('taxsped.files'))[0];
    expect(saved.deleted).toBeUndefined();
    expect(saved.outputs[0].deleted).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Lixeira', exact: true }));
    await user.click(screen.getByRole('button', { name: 'Restaurar arquivo' }));
    await user.click(screen.getByRole('button', { name: 'Arquivos gerados', exact: true }));
    expect(screen.getByText('resultado.xlsx')).toBeTruthy();
  });
});
