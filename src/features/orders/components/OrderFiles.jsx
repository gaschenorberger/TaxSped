import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { downloadFile, downloadOutput, hasOutput } from '../../files/services/files';
import { useApp } from '../../../app/AppContext';
import { useState } from 'react';
import Pagination from '../../../components/ui/Pagination';

export default function OrderFiles({ files, generated = false }) {
  const { notify } = useApp();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(files.length / pageSize)));
  const visible = files.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function getFile(file) {
    const downloaded = generated ? downloadOutput(file) : downloadFile(file);
    if (!downloaded) notify('O conteúdo deste arquivo não está disponível nesta sessão.');
  }

  return (
    <>
      <ul className="order-attachments">{visible.map((file, index) => <li key={file.id || file.protocol || index}><span className="attachment-icon">{/\.xlsx?$/i.test(file.name) ? <FileSpreadsheet size={20} /> : <FileText size={20} />}</span><div><strong>{file.name}</strong><span>{file.size || (generated ? 'Resultado da conversão' : 'Arquivo enviado')}</span></div><button className="btn small" disabled={generated && !hasOutput(file)} onClick={() => getFile(file)} aria-label={`Baixar ${file.name}`}><Download size={15} />Baixar</button></li>)}</ul>
      {files.length > 8 && <Pagination total={files.length} page={currentPage} pageSize={pageSize} onPage={setPage} onPageSize={setPageSize} />}
    </>
  );
}
