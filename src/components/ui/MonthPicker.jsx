import { useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDays } from 'lucide-react';
import usePopover from './usePopover';
import MonthCalendar, { months } from './MonthCalendar';

export default function MonthPicker({ label, value, onChange }) {
  const id = useId();
  const { anchor, panel, open, setOpen, position } = usePopover(288, 295);
  const [year, setYear] = useState(value ? Number(value.slice(0, 4)) : new Date().getFullYear());
  const display = value ? `${months[Number(value.slice(5, 7)) - 1]} / ${value.slice(0, 4)}` : 'Selecione o período';

  function show() {
    setYear(value ? Number(value.slice(0, 4)) : new Date().getFullYear());
    setOpen(!open);
  }

  function choose(month) {
    update(`${year}-${String(month + 1).padStart(2, '0')}`);
  }

  function update(period) {
    onChange(period);
    setOpen(false);
    anchor.current?.focus();
  }

  function current() {
    const now = new Date();
    update(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  }

  return (
    <div className="field month-field">
      <span id={`${id}-label`}>{label}</span>
      <button ref={anchor} type="button" className={`month-trigger ${open ? 'is-open' : ''} ${value ? 'has-value' : ''}`} aria-labelledby={`${id}-label`} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? `${id}-calendar` : undefined} onClick={show}>
        <CalendarDays size={18} /><span>{display}</span>
      </button>
      {open && createPortal(
        <section ref={panel} className="month-menu popover-surface" role="dialog" id={`${id}-calendar`} aria-label={`Selecionar ${label.toLowerCase()}`} style={position}>
          <MonthCalendar year={year} value={value} onYear={setYear} onSelect={choose} onCurrent={current} onClear={() => update('')} />
        </section>, document.body
      )}
    </div>
  );
}
