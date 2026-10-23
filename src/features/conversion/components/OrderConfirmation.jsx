import { Check, Copy } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import { useApp } from '../../../app/AppContext';

export default function OrderConfirmation({ order, onClose, onDetails }) {
  const { notify } = useApp();

  async function copy() {
    try { await navigator.clipboard.writeText(order.protocol); notify('Número do pedido copiado.'); } catch { notify('Selecione o número do pedido para copiar manualmente.'); }
  }

  return (
    <Modal title="Pedido registrado" onClose={onClose} className="order-confirmation">
      <div className="confirmation-icon"><Check size={26} /></div>
      <h3>{order.name}</h3>
      <p>{order.inputs.length} {order.inputs.length === 1 ? 'arquivo vinculado' : 'arquivos vinculados'} a este pedido de {order.conversion}.</p>
      <div className="confirmation-number"><span>Número do pedido</span><code>{order.protocol}</code><button className="btn small" onClick={copy}><Copy size={15} />Copiar número</button></div>
      <p className="confirmation-note">Pedido salvo neste navegador. O envio e o processamento no servidor ficarão disponíveis após a integração com o backend.</p>
      <footer><button className="btn" onClick={onClose}>Ver pedidos</button><button className="btn primary" onClick={onDetails}>Abrir pedido</button></footer>
    </Modal>
  );
}
