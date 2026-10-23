import { Check, CircleAlert, Clock3, RefreshCw } from 'lucide-react';

export default function Status({ value }) {
  const key = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const Icon =
    key === 'concluido' || key === 'processado' ? Check : key === 'processando' ? RefreshCw : key === 'erro' ? CircleAlert : Clock3;
  return (
    <span className={`status ${key}`}>
      <Icon size={14} />
      {value}
    </span>
  );
}
