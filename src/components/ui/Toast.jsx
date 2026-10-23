import { CheckCircle2, X } from 'lucide-react';
import { useApp } from '../../app/AppContext';

export default function Toast() {
  const { notice, notify } = useApp();
  if (!notice) return null;
  return (
    <div className="toast" role="status">
      <CheckCircle2 />
      <span>{notice}</span>
      <button onClick={() => notify('')} aria-label="Fechar aviso">
        <X size={18} />
      </button>
    </div>
  );
}
