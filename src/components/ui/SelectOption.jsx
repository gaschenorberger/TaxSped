import { Check } from 'lucide-react';

export default function SelectOption({ item, id, selected, active, onHover, onSelect }) {
  const Icon = item.icon;
  return (
    <button type="button" role="option" id={id} aria-selected={selected} aria-disabled={item.disabled || undefined} tabIndex={-1} className={`select-option ${selected ? 'selected' : ''} ${active ? 'highlighted' : ''}`} onPointerMove={onHover} onMouseDown={event => event.preventDefault()} onClick={onSelect}>
      {Icon && <span className="option-icon"><Icon size={18} /></span>}
      <span className="option-copy">
        <strong>{item.label}</strong>
        {item.description && <small>{item.description}</small>}
      </span>
      {selected && <Check size={16} className="option-check" />}
    </button>
  );
}
