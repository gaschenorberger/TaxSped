import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DayChart from './DayChart';

describe('Conversões por dia', () => {
  it('agrupa os arquivos e mostra data e quantidade ao passar o mouse', async () => {
    const user = userEvent.setup();
    render(<DayChart files={[{ date: '25/05/2024 14:32' }, { date: '25/05/2024 11:20' }, { date: '24/05/2024 16:18' }]} />);
    const bar = screen.getByRole('button', { name: '25/05/2024: 2 conversões' });
    await user.hover(bar);
    expect(screen.getByRole('tooltip').textContent).toContain('25/05/2024');
    expect(screen.getByRole('tooltip').textContent).toContain('2 conversões');
    await user.unhover(bar);
    expect(screen.queryByRole('tooltip')).toBeNull();
    await user.tab();
    expect(screen.getByRole('tooltip').textContent).toContain('1 conversão');
  });
});
