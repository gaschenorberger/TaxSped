import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function MonthCalendar({ year, value, onYear, onSelect, onCurrent, onClear }) {
  const grid = useRef(null);

  useEffect(() => {
    const month = value ? Number(value.slice(5, 7)) - 1 : new Date().getMonth();
    grid.current?.children[month]?.focus();
  }, [year, value]);

  function keyboard(event) {
    const index = Number(event.target.dataset.month);
    const shifts = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 };
    if (shifts[event.key] === undefined && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 11 : (index + shifts[event.key] + 12) % 12;
    grid.current?.children[next]?.focus();
  }

  return (
    <>
      <header>
        <button type="button" onClick={() => onYear(year - 1)} aria-label="Ano anterior"><ChevronLeft size={18} /></button>
        <strong>{year}</strong>
        <button type="button" onClick={() => onYear(year + 1)} aria-label="Próximo ano"><ChevronRight size={18} /></button>
      </header>
      <div ref={grid} className="month-grid" onKeyDown={keyboard}>
        {months.map((month, index) => <button key={month} data-month={index} type="button" className={value === `${year}-${String(index + 1).padStart(2, '0')}` ? 'selected' : ''} aria-pressed={value === `${year}-${String(index + 1).padStart(2, '0')}`} onClick={() => onSelect(index)}>{month}</button>)}
      </div>
      <footer>
        <button type="button" onClick={onCurrent}>Mês atual</button>
        <button type="button" onClick={onClear}><X size={13} />Limpar</button>
      </footer>
    </>
  );
}
