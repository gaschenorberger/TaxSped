import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '../../../app/AppContext';
import useConversion from './useConversion';

function Wrapper({ children }) {
  return <AppProvider><MemoryRouter>{children}</MemoryRouter></AppProvider>;
}

describe('Pedido de conversão', () => {
  it('cria um único pedido para mil entradas e bloqueia reenvio duplicado', () => {
    localStorage.setItem('taxsped.files', '[]');
    const { result } = renderHook(() => useConversion(), { wrapper: Wrapper });
    const files = Array.from({ length: 1000 }, (_, index) => new File(['|0000|TESTE|'], `arquivo-${index}.txt`));
    act(() => result.current.addFiles(files));
    act(() => result.current.start());
    const orders = JSON.parse(localStorage.getItem('taxsped.files'));
    expect(orders).toHaveLength(1);
    expect(orders[0].inputs).toHaveLength(1000);
    expect(new Set(orders[0].inputs.map(file => file.protocol)).size).toBe(1000);
    expect(result.current.submitted.protocol).toBe(orders[0].protocol);
    act(() => result.current.start());
    expect(JSON.parse(localStorage.getItem('taxsped.files'))).toHaveLength(1);
  });
});
