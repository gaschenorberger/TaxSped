import { Download, Eye, RotateCcw, Trash2 } from 'lucide-react';
import { useApp } from '../../../app/AppContext';
import { downloadFile, downloadOutput } from '../services/files';

export default function FileActions({ file, onDetails, order = false }) {
  const { updateFile, updateResult, notify } = useApp();
  function getFile() {
    if (!(file.generated ? downloadOutput(file) : downloadFile(file))) notify('O conteúdo deste arquivo não está disponível para download.');
  }
  if (order) return <span className="row-actions order-row-actions"><button className="order-details-button" onClick={() => onDetails(file)} aria-label={`Detalhes do pedido ${file.protocol}`}><Eye />Detalhes</button></span>;

  return (
    <span className="row-actions">
      <button onClick={getFile} aria-label={`Baixar ${file.name}`} title={file.generated ? 'Baixar arquivo gerado' : 'Baixar arquivo original'}>
        <Download />
      </button>
      <button onClick={() => onDetails(file)} aria-label={`Detalhes de ${file.name}`} title="Ver detalhes">
        <Eye />
      </button>
      <button onClick={() => { (file.generated ? updateResult : updateFile)(file.protocol, { deleted: !file.deleted }); notify(file.deleted ? 'Arquivo restaurado.' : 'Arquivo movido para a lixeira.'); }} aria-label={file.deleted ? 'Restaurar arquivo' : 'Mover para lixeira'} title={file.deleted ? 'Restaurar' : 'Mover para lixeira'}>
        {file.deleted ? <RotateCcw /> : <Trash2 />}
      </button>
    </span>
  );
}
