import { Copy, Download, FileCheck2, Hourglass } from 'lucide-react';
import { useApp } from '../../../app/AppContext';
import Modal from '../../../components/ui/Modal';
import Status from '../../../components/ui/Status';
import { downloadOutput, hasOutput } from '../../files/services/files';
import OrderFiles from './OrderFiles';

export default function OrderDetails({ order: initialOrder, onClose }) {
  const { notify, files } = useApp();
  const order = files.find(file => file.protocol === initialOrder.protocol) || initialOrder;
  const inputs = order.inputs?.length ? order.inputs : [order];
  const outputs = (order.outputs || []).filter(file => !file.deleted);
  const available = outputs.filter(hasOutput);

  async function copy() {
    try { await navigator.clipboard.writeText(order.protocol); notify('Número do pedido copiado.'); } catch { notify('Selecione o número do pedido para copiar manualmente.'); }
  }

  function downloadAll() {
    available.forEach(downloadOutput);
  }

  return (
    <Modal title="Detalhes do pedido" onClose={onClose} className="file-details-modal order-details-modal">
      <div className="order-details-heading"><div><span>{order.name?.startsWith('Pedido ') ? order.name : 'Pedido de conversão'}</span><h3>{order.conversion}</h3></div><Status value={order.status} /></div>
      <section className="order-file-section results-section" aria-label="Arquivos gerados">
        <div className="order-section-title"><h4>Arquivos gerados</h4>{available.length > 1 && <button className="link-button" onClick={downloadAll}><Download size={15} />Baixar todos</button>}</div>
        {outputs.length > 0 ? <OrderFiles files={outputs} generated /> : <div className="order-result-empty">{order.status === 'Concluído' ? <FileCheck2 size={23} /> : <Hourglass size={23} />}<div><strong>{order.status === 'Concluído' ? 'Nenhum resultado disponível' : 'Aguardando os arquivos gerados'}</strong><p>{order.status === 'Concluído' ? 'Este pedido ainda não possui arquivos de resultado anexados.' : 'Os resultados aparecerão aqui quando a conversão for concluída.'}</p></div></div>}
      </section>
      <section className="order-file-section" aria-label="Arquivos enviados"><div className="order-section-title"><h4>Arquivos enviados</h4><span>{inputs.length} {inputs.length === 1 ? 'arquivo' : 'arquivos'}</span></div><OrderFiles files={inputs} /></section>
      <dl className="file-metadata"><div><dt>Tipo de SPED</dt><dd>{order.sped}</dd></div><div><dt>Criado em</dt><dd>{order.date}</dd></div></dl>
      <div className="file-protocol"><div><span>Número do pedido</span><code>{order.protocol}</code></div><button onClick={copy} aria-label="Copiar número do pedido"><Copy size={17} /></button></div>
      <footer className="file-detail-actions"><button className="btn" onClick={onClose}>Fechar pedido</button></footer>
    </Modal>
  );
}
