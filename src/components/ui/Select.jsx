import { Children, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import usePopover from './usePopover';
import SelectOption from './SelectOption';

export default function Select({ children, value, onChange, label, options, ariaLabel }) {
  const items = options || Children.toArray(children).map(child => ({ value: String(child.props.value ?? child.props.children), label: child.props.children, disabled: child.props.disabled }));
  const id = useId();
  const { anchor, panel, open, setOpen, position } = usePopover();
  const [active, setActive] = useState(0);
  const [local, setLocal] = useState(items[0]?.value);
  const current = String(value ?? local);
  const selected = items.find(item => String(item.value) === current) || items[0];
  const Icon = selected?.icon;

  useEffect(() => {
    if (!open) return;
    const menu = panel.current;
    const option = menu?.children[active];
    if (!menu || !option) return;
    const top = option.offsetTop;
    const bottom = top + option.offsetHeight;
    if (top < menu.scrollTop) menu.scrollTop = top;
    else if (bottom > menu.scrollTop + menu.clientHeight) menu.scrollTop = bottom - menu.clientHeight;
  }, [active, open, panel]);

  function choose(item) {
    if (!item || item.disabled) return;
    setLocal(item.value);
    onChange?.({ target: { value: item.value } });
    setOpen(false);
    anchor.current?.focus({ preventScroll: true });
  }

  function toggle() {
    setActive(Math.max(0, items.findIndex(item => String(item.value) === current)));
    setOpen(!open);
  }

  function keyboard(event) {
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) event.preventDefault();
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!open) { toggle(); return; }
      setActive(index => (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length);
    }
    if (event.key === 'Home') setActive(0);
    if (event.key === 'End') setActive(items.length - 1);
    if (event.key === 'Enter' || event.key === ' ') open ? choose(items[active]) : toggle();
    if (event.key === 'Tab') setOpen(false);
  }

  return (
    <div className="field custom-select">
      {label && <span id={`${id}-label`}>{label}</span>}
      <button ref={anchor} type="button" className={`select-trigger ${open ? 'is-open' : ''}`} role="combobox" aria-labelledby={label ? `${id}-label` : undefined} aria-label={!label ? ariaLabel : undefined} aria-expanded={open} aria-haspopup="listbox" aria-controls={open ? `${id}-list` : undefined} aria-activedescendant={open ? `${id}-option-${active}` : undefined} onClick={toggle} onKeyDown={keyboard}>
        {Icon && <Icon size={18} />}
        <span>{selected?.label}</span>
        <ChevronDown size={16} className="select-chevron" />
      </button>
      {open && createPortal(
        <div ref={panel} className="select-menu popover-surface" role="listbox" id={`${id}-list`} aria-label={label || ariaLabel} style={position}>
          {items.map((item, index) => <SelectOption key={item.value} item={item} id={`${id}-option-${index}`} selected={String(item.value) === current} active={active === index} onHover={() => setActive(index)} onSelect={() => choose(item)} />)}
        </div>, document.body
      )}
    </div>
  );
}
