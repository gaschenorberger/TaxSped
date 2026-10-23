import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '../../../app/AppContext';
import FileDetails from './FileDetails';

const file = { name: 'arquivo_fiscal_com_nome_extenso_2024.txt', type: 'TXT', sped: 'ECD', conversion: 'TXT → Excel', date: '25/05/2024 14:32', size: '2 MB', status: 'Concluído', protocol: 'SPED-20240525-00156' };

function DetailsDemo() {
  const [open, setOpen] = useState(false);
  return <AppProvider><button onClick={() => setOpen(true)}>Abrir detalhes</button>{open && <FileDetails file={file} onClose={() => setOpen(false)} />}</AppProvider>;
}

describe('Detalhes de arquivo', () => {
  it('mostra os metadados, copia o protocolo e devolve o foco ao fechar', async () => {
    const user = userEvent.setup();
    const copy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    render(<DetailsDemo />);
    const trigger = screen.getByRole('button', { name: 'Abrir detalhes' });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Detalhes do arquivo' });
    expect(within(dialog).getByText(file.name)).toBeTruthy();
    expect(within(dialog).getByText('ECD')).toBeTruthy();
    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(document.activeElement).toBe(within(dialog).getByRole('button', { name: 'Baixar original' }));
    await user.click(within(dialog).getByRole('button', { name: 'Copiar protocolo' }));
    expect(copy).toHaveBeenCalledWith(file.protocol);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe('');
    copy.mockRestore();
  });
});
