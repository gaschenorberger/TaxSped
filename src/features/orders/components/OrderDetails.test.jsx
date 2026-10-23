import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '../../../app/AppContext';
import { registerOutput } from '../../files/services/files';
import FileTable from '../../files/components/FileTable';
import OrderDetails from './OrderDetails';
import OrderTabs from './OrderTabs';
import OrderFiles from './OrderFiles';

const order = { protocol: 'PEDIDO-TESTE-01', name: 'original.txt', type: 'TXT', sped: 'ECD', conversion: 'TXT → Excel', date: '13/10/2026 15:00', size: '2 MB', status: 'Pendente', outputs: [] };

describe('Pedidos e resultados', () => {
  it('pagina mil anexos sem renderizar toda a lista de uma vez', async () => {
    const user = userEvent.setup();
    const files = Array.from({ length: 1000 }, (_, index) => ({ protocol: `entrada-${index}`, name: `entrada-${index}.txt`, size: '1 MB' }));
    render(<AppProvider><OrderFiles files={files} /></AppProvider>);
    expect(screen.getAllByRole('listitem')).toHaveLength(8);
    expect(screen.getByText('entrada-0.txt')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Próxima página' }));
    expect(screen.queryByText('entrada-0.txt')).toBeNull();
    expect(screen.getByText('entrada-8.txt')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(8);
  });

  it('conta os pedidos ativos e permite selecionar um status', async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    const files = [order, { ...order, protocol: 'CONCLUIDO', status: 'Concluído' }, { ...order, protocol: 'EXCLUIDO', deleted: true }];
    render(<OrderTabs files={files} status="Pendente" onSelect={select} />);
    expect(screen.getByRole('button', { name: 'Todos 2' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Pendentes 1' }).getAttribute('aria-pressed')).toBe('true');
    await user.click(screen.getByRole('button', { name: 'Concluídos 1' }));
    expect(select).toHaveBeenCalledWith('Concluído');
  });

  it('abrevia o número na tabela e mantém o valor completo nos detalhes', () => {
    const protocol = 'SPED-0e7c5147-7477-4499-91ad-09b1cef35130';
    const item = { ...order, protocol };
    const table = render(<AppProvider><FileTable files={[item]} orders onDetails={() => {}} /></AppProvider>);
    expect(screen.getByTitle(protocol).textContent).toBe(`${protocol.slice(0, 13)}…${protocol.slice(-4)}`);
    table.unmount();
    render(<AppProvider><OrderDetails order={item} onClose={() => {}} /></AppProvider>);
    expect(screen.getByText(protocol)).toBeTruthy();
  });

  it('mostra as ações na primeira coluna e abre os detalhes do pedido', async () => {
    const user = userEvent.setup();
    const details = vi.fn();
    render(<AppProvider><FileTable files={[order]} orders onDetails={details} /></AppProvider>);
    expect(screen.getAllByRole('columnheader').map(header => header.textContent)).toEqual(['Ações', 'Número do pedido', 'Tipo de SPED', 'Conversão', 'Status', 'Data']);
    expect(screen.getAllByRole('columnheader')).toHaveLength(6);
    expect(screen.queryByRole('columnheader', { name: 'Arquivo enviado' })).toBeNull();
    expect(screen.queryByText(order.name)).toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: `Detalhes do pedido ${order.protocol}` }));
    expect(details).toHaveBeenCalledWith(order);
  });

  it('separa o original dos resultados sem criar um download fictício', () => {
    render(<AppProvider><OrderDetails order={order} onClose={() => {}} /></AppProvider>);
    expect(within(screen.getByRole('region', { name: 'Arquivos gerados' })).getByText('Aguardando os arquivos gerados')).toBeTruthy();
    expect(within(screen.getByRole('region', { name: 'Arquivos enviados' })).getByText('original.txt')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Baixar todos' })).toBeNull();
  });

  it('baixa resultados individuais e todos os arquivos reais anexados', async () => {
    const user = userEvent.setup();
    const generated = [{ id: 'resultado-a', name: 'resultado-a.xlsx', size: '1 MB' }, { id: 'resultado-b', name: 'resultado-b.xlsx', size: '1 MB' }];
    registerOutput('resultado-a', new File(['resultado a'], 'resultado-a.xlsx'));
    registerOutput('resultado-b', new File(['resultado b'], 'resultado-b.xlsx'));
    const createDescriptor = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');
    const revokeDescriptor = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL');
    const create = vi.fn(() => 'blob:resultado-teste');
    const revoke = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: create });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revoke });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    try {
      render(<AppProvider><OrderDetails order={{ ...order, status: 'Concluído', outputs: generated }} onClose={() => {}} /></AppProvider>);
      await user.click(screen.getByRole('button', { name: 'Baixar resultado-a.xlsx' }));
      expect(click.mock.instances[0].download).toBe('resultado-a.xlsx');
      await user.click(screen.getByRole('button', { name: 'Baixar todos' }));
      expect(click.mock.instances.slice(1).map(link => link.download)).toEqual(['resultado-a.xlsx', 'resultado-b.xlsx']);
      expect(create).toHaveBeenCalledTimes(3);
      await vi.waitFor(() => expect(revoke).toHaveBeenCalledTimes(3), { timeout: 2000 });
    } finally {
      click.mockRestore();
      if (createDescriptor) Object.defineProperty(URL, 'createObjectURL', createDescriptor); else delete URL.createObjectURL;
      if (revokeDescriptor) Object.defineProperty(URL, 'revokeObjectURL', revokeDescriptor); else delete URL.revokeObjectURL;
    }
  });
});
