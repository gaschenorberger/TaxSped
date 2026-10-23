import Modal from '../../../components/ui/Modal';
import Status from '../../../components/ui/Status';
import { Copy, Download, FileText } from 'lucide-react';
import { useApp } from '../../../app/AppContext';
import { downloadFile, downloadOutput } from '../services/files';

export default function FileDetails({ file, onClose }) {
  const { notify } = useApp();

  async function copy() {
    try { await navigator.clipboard.writeText(file.orderProtocol || file.protocol); notify('Protocolo copiado.'); } catch { notify('Não foi possível copiar. Selecione o protocolo para copiar manualmente.'); }
  }

  function download() {
    if (!(file.generated ? downloadOutput(file) : downloadFile(file))) notify('O conteúdo deste arquivo não está disponível nesta sessão.');
  }

  return (
    <Modal title="Detalhes do arquivo" onClose={onClose} className="file-details-modal">
      <div className="file-detail-heading">
        <div className="file-detail-icon"><FileText size={25} /></div>
        <div className="file-detail-name"><span>{file.type} · Arquivo fiscal</span><h3>{file.name}</h3><Status value={file.status} /></div>
      </div>
      <dl className="file-metadata">
        <div><dt>Tipo de SPED</dt><dd>{file.sped}</dd></div>
        <div><dt>Conversão</dt><dd>{file.conversion}</dd></div>
        <div><dt>{file.generated ? 'Gerado em' : 'Enviado em'}</dt><dd>{file.date}</dd></div>
        <div><dt>Tamanho</dt><dd>{file.size}</dd></div>
      </dl>
      <div className="file-protocol"><div><span>{file.generated ? 'Pedido de origem' : 'Protocolo de identificação'}</span><code>{file.orderProtocol || file.protocol}</code></div><button type="button" onClick={copy} aria-label="Copiar protocolo" title="Copiar protocolo"><Copy size={17} /></button></div>
      <footer className="file-detail-actions"><button className="btn" onClick={onClose}>Fechar detalhes</button><button className="btn primary" onClick={download}><Download size={17} />{file.generated ? 'Baixar arquivo' : 'Baixar original'}</button></footer>
    </Modal>
  );
}
