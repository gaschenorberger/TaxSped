import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from './Select';
import MonthPicker from './MonthPicker';

function ThemeField() {
  const [value, setValue] = useState('light');
  return <Select label="Tema" value={value} onChange={event => setValue(event.target.value)} options={[{ value: 'light', label: 'Claro' }, { value: 'dark', label: 'Escuro' }]} />;
}

function DateField() {
  const [value, setValue] = useState('2024-05');
  return <MonthPicker label="Período" value={value} onChange={setValue} />;
}

describe('Controles de seleção', () => {
  it('rola somente a lista de opções e restaura o foco sem rolar a página', async () => {
    const user = userEvent.setup();
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView');
    const scroll = vi.fn();
    Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: scroll });
    try {
      render(<ThemeField />);
      const trigger = screen.getByRole('combobox', { name: 'Tema' });
      await user.click(trigger);
      const menu = screen.getByRole('listbox');
      const option = screen.getByRole('option', { name: 'Escuro' });
      Object.defineProperty(menu, 'clientHeight', { configurable: true, value: 60 });
      Object.defineProperty(option, 'offsetTop', { configurable: true, value: 160 });
      Object.defineProperty(option, 'offsetHeight', { configurable: true, value: 40 });
      const focus = vi.spyOn(trigger, 'focus');
      await user.keyboard('{ArrowDown}');
      expect(menu.scrollTop).toBe(140);
      expect(scroll).not.toHaveBeenCalled();
      await user.keyboard('{Enter}');
      expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
      focus.mockRestore();
    } finally {
      if (descriptor) Object.defineProperty(Element.prototype, 'scrollIntoView', descriptor);
      else delete Element.prototype.scrollIntoView;
    }
  });

  it('seleciona pelo teclado e mantém o foco no dropdown', async () => {
    const user = userEvent.setup();
    render(<ThemeField />);
    const trigger = screen.getByRole('combobox', { name: 'Tema' });
    trigger.focus();
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(trigger.textContent).toContain('Escuro');
    expect(document.activeElement).toBe(trigger);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('fecha o dropdown com Escape e ao clicar fora', async () => {
    const user = userEvent.setup();
    render(<ThemeField />);
    await user.click(screen.getByRole('combobox', { name: 'Tema' }));
    expect(screen.getByRole('option', { name: 'Claro' }).getAttribute('aria-selected')).toBe('true');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    await user.click(screen.getByRole('combobox', { name: 'Tema' }));
    await user.click(document.body);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('altera o ano, seleciona o mês e permite limpar o período', async () => {
    const user = userEvent.setup();
    render(<DateField />);
    const trigger = screen.getByRole('button', { name: 'Período' });
    expect(trigger.textContent).toContain('Mai / 2024');
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Ano anterior' }));
    await user.click(screen.getByRole('button', { name: 'Jul', exact: true }));
    expect(trigger.textContent).toContain('Jul / 2023');
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(trigger);
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Limpar' }));
    expect(trigger.textContent).toContain('Selecione o período');
  });
});
