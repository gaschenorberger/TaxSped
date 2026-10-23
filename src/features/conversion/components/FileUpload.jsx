import { useRef, useState } from 'react';
import { Cloud, FileText, Folder, Upload, X } from 'lucide-react';
import IconBox from '../../../components/ui/IconBox';

export default function FileUpload({ files, onAdd, onRemove }) {
  const input = useRef(null);
  const [dragging, setDragging] = useState(false);
  return (
    <article className="panel section-card upload-card">
      <div className="section-title">
        <IconBox>
          <Upload />
        </IconBox>
        <strong>Arquivos para conversão</strong>
      </div>
      <input ref={input} type="file" multiple accept=".txt,.xls,.xlsx,.zip" hidden onChange={(event) => { onAdd(event.target.files); event.target.value = ''; }} />
      <div className={`drop-zone ${dragging ? 'dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); onAdd(event.dataTransfer.files); }}>
        <Cloud size={52} />
        <strong>Arraste e solte seus arquivos aqui</strong>
        <p>ou clique no botão abaixo para selecionar arquivos.</p>
        <button className="btn primary" onClick={() => input.current?.click()}>
          <Folder size={19} />
          Selecionar arquivos
        </button>
        <small>São aceitos arquivos nos formatos TXT, XLS, XLSX e ZIP.</small>
      </div>
      <div className="selected-files">
        {files.map((file, index) => (
          <div key={`${file.name}-${file.size}`}>
            <FileText />
            <span>
              <strong>{file.name}</strong>
              <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
            </span>
            <button onClick={() => onRemove(index)} aria-label={`Remover ${file.name}`}>
              <X />
            </button>
          </div>
        ))}
      </div>
    </article>
  );
}
