import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => {
  window.location.hash = '#/login';
});

async function openDemo() {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name: 'Explorar demonstração' }));
  return user;
}

describe('Fluxos principais', () => {
  it('valida senhas no cadastro e abre a conta com o perfil informado', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Criar conta', exact: true }));
    await user.type(screen.getByLabelText('Nome completo'), 'Gabriel Alvise');
    await user.type(screen.getByLabelText('E-mail'), 'gabriel@exemplo.com');
    await user.type(screen.getByLabelText('Senha', { exact: true }), 'senha1234');
    await user.type(screen.getByLabelText('Confirmar senha'), 'senha5678');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Criar conta', exact: true }));
    expect(screen.getByRole('alert').textContent).toBe('As senhas não coincidem.');
    await user.clear(screen.getByLabelText('Confirmar senha'));
    await user.type(screen.getByLabelText('Confirmar senha'), 'senha1234');
    await user.click(screen.getByRole('button', { name: 'Criar conta', exact: true }));
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('taxsped.user'))).toEqual({ name: 'Gabriel Alvise', email: 'gabriel@exemplo.com' });
  });

  it('compartilha a seleção de plano com o header e abre a comparação', async () => {
    const user = await openDemo();
    await user.click(screen.getByRole('button', { name: 'Plano', exact: true }));
    await user.click(screen.getAllByRole('button', { name: 'Escolher plano' })[0]);
    expect(screen.getByRole('button', { name: /João Pereira.*Plano Essencial/ })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Comparar planos' }));
    expect(screen.getByRole('dialog', { name: 'Comparar planos' })).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('abre a sessão e permite sair pelo menu de usuário', async () => {
    const user = await openDemo();
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /João Pereira.*Plano/ }));
    await user.click(screen.getByRole('menuitem', { name: 'Sair da conta' }));
    expect(await screen.findByRole('heading', { name: 'Bem-vindo de volta' })).toBeTruthy();
    expect(sessionStorage.getItem('taxsped.session')).toBeNull();
  });

  it('filtra o pedidos sem exibir controles de empresa', async () => {
    const user = await openDemo();
    await user.click(screen.getByRole('button', { name: 'Pedidos', exact: true }));
    await user.click(screen.getByRole('combobox', { name: 'Status' }));
    await user.click(screen.getByRole('option', { name: 'Erro' }));
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(2);
    expect(within(rows[1]).getByText('Erro')).toBeTruthy();
    expect(screen.queryByRole('columnheader', { name: 'Empresa' })).toBeNull();
    expect(screen.queryByText('Mês/Ano inicial')).toBeNull();
    expect(screen.queryByText('Mês/Ano final')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }));
    expect(screen.getAllByRole('row')).toHaveLength(9);
    const statuses = screen.getByRole('group', { name: 'Filtrar pedidos por status' });
    await user.click(within(statuses).getByRole('button', { name: /^Erros/ }));
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByRole('combobox', { name: 'Status' }).textContent).toContain('Erro');
    await user.click(within(statuses).getByRole('button', { name: /^Todos/ }));
    expect(screen.getAllByRole('row')).toHaveLength(9);
  });

  it('agrupa os envios em um pedido, confirma o número e não inventa resultados', async () => {
    const user = await openDemo();
    await user.click(within(screen.getByRole('navigation')).getByRole('button', { name: 'Nova conversão', exact: true }));
    expect(screen.queryByRole('combobox', { name: 'Empresa' })).toBeNull();
    expect(screen.queryByText('Mês/Ano inicial')).toBeNull();
    expect(screen.queryByText('Mês/Ano final')).toBeNull();
    const file = new File(['|0000|TESTE|'], 'teste.txt', { type: 'text/plain' });
    const other = new File(['|0000|OUTRO|'], 'outro.txt', { type: 'text/plain' });
    fireEvent.change(document.querySelector('input[type="file"]'), { target: { files: [file, other] } });
    await user.click(screen.getByRole('button', { name: 'Iniciar conversão' }));
    const confirmation = screen.getByRole('dialog', { name: 'Pedido registrado' });
    const saved = JSON.parse(localStorage.getItem('taxsped.files'))[0];
    expect(within(confirmation).getByText(saved.protocol)).toBeTruthy();
    expect(saved.inputs.map(input => input.name)).toEqual(['teste.txt', 'outro.txt']);
    expect(saved.outputs).toEqual([]);
    expect(JSON.parse(localStorage.getItem('taxsped.files'))).toHaveLength(9);
    await user.click(within(confirmation).getByRole('button', { name: 'Abrir pedido' }));
    expect(await screen.findByRole('heading', { name: 'Pedidos' })).toBeTruthy();
    const details = screen.getByRole('dialog', { name: 'Detalhes do pedido' });
    expect(within(details).getByText('teste.txt')).toBeTruthy();
    expect(within(details).getByText('outro.txt')).toBeTruthy();
    await user.click(within(details).getByRole('button', { name: 'Fechar pedido' }));
    const row = screen.getByTitle(saved.protocol).closest('tr');
    expect(within(row).getByText('Pendente')).toBeTruthy();
    expect(saved).not.toHaveProperty('startDate');
    expect(saved).not.toHaveProperty('endDate');
    await user.click(screen.getByRole('button', { name: 'Arquivos', exact: true }));
    expect(screen.queryByText('teste.txt')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Arquivos enviados' })).toBeNull();
    expect(screen.getByText('Nenhum arquivo gerado encontrado')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Plano', exact: true }));
    expect(screen.getByRole('heading', { name: 'Planos', exact: true })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Resumo da assinatura' })).toBeTruthy();
    expect(screen.getByRole('progressbar', { name: 'Uso de conversões' }).getAttribute('aria-valuenow')).toBe('1');
  });

  it('salva o perfil e reflete o nome no header', async () => {
    const user = await openDemo();
    await user.click(screen.getByRole('button', { name: 'Configurações', exact: true }));
    await user.click(screen.getByRole('button', { name: 'Editar', exact: true }));
    const dialog = screen.getByRole('dialog');
    const name = within(dialog).getByRole('textbox', { name: 'Nome completo' });
    await user.clear(name);
    await user.type(name, 'Gabriel Alvise');
    await user.click(within(dialog).getByRole('button', { name: 'Salvar alterações' }));
    expect(screen.getByRole('button', { name: /Gabriel Alvise.*Plano/ })).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('taxsped.user')).name).toBe('Gabriel Alvise');
  });
});
