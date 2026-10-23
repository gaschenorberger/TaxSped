const statuses = [{ value: 'Todos', label: 'Todos' }, { value: 'Pendente', label: 'Pendentes' }, { value: 'Processando', label: 'Em processamento' }, { value: 'Concluído', label: 'Concluídos' }, { value: 'Erro', label: 'Erros' }];

export default function OrderTabs({ files, status, onSelect }) {
  const orders = files.filter(file => !file.deleted);

  return (
    <div className="order-status-tabs" role="group" aria-label="Filtrar pedidos por status">
      {statuses.map(item => <button key={item.value} className={status === item.value ? 'active' : ''} aria-pressed={status === item.value} onClick={() => onSelect(item.value)}><span>{item.label}</span>{' '}<span className="order-status-count">{orders.filter(order => item.value === 'Todos' || order.status === item.value).length}</span></button>)}
    </div>
  );
}
