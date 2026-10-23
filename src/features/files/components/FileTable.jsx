import { FileText } from 'lucide-react';
import Status from '../../../components/ui/Status';
import FileActions from './FileActions';

export default function FileTable({ files, orders = false, results = false, selected = [], onSelect, onDetails, onOrder }) {
  return (
    <div className="table-wrap">
      <table className={`file-table ${orders ? 'orders-table' : ''}`}>
        <thead>
          <tr>
            <th className="actions-cell">Ações</th>
            {orders && <th>Número do pedido</th>}
            {onSelect && (
              <th className="selection-cell">
                <input type="checkbox" aria-label="Selecionar todos" checked={files.length > 0 && files.every((file) => selected.includes(file.protocol))} onChange={(event) => onSelect( files.map((file) => file.protocol), event.target.checked ) } />
              </th>
            )}
            {!orders && <th className="filename-cell">Arquivo</th>}
            {results && <th className="order-cell">Pedido</th>}
            {!orders && <th>Status</th>}
            <th>Tipo de SPED</th>
            <th>{orders ? 'Conversão' : 'Tipo'}</th>
            {orders && <th>Status</th>}
            <th>{orders ? 'Data' : 'Tamanho'}</th>
            {!orders && <th>{results ? 'Gerado em' : 'Data de envio'}</th>}
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.protocol}>
              <td className="actions-cell"><FileActions file={file} onDetails={onDetails} order={orders} /></td>
              {orders && <td className="protocol-cell"><span title={file.protocol}>{file.protocol.length > 22 ? `${file.protocol.slice(0, 13)}…${file.protocol.slice(-4)}` : file.protocol}</span></td>}
              {onSelect && (
                <td className="selection-cell">
                  <input type="checkbox" aria-label={`Selecionar ${file.name}`} checked={selected.includes(file.protocol)} onChange={(event) => onSelect([file.protocol], event.target.checked)} />
                </td>
              )}
              {!orders && (
                <td className="filename-cell">
                  <span className="table-file">
                    <FileText />
                    <span className="filename-text">{file.name}</span>
                  </span>
                </td>
              )}
              {results && <td className="order-cell"><button className="order-file-link" title={file.orderProtocol} onClick={() => onOrder(file)}>{file.orderName.length > 22 ? `${file.orderName.slice(0, 13)}…${file.orderName.slice(-4)}` : file.orderName}</button></td>}
              {!orders && <td><Status value={file.status} /></td>}
              <td>{file.sped}</td>
              <td>{orders ? file.conversion : <b className="type-tag">{file.type}</b>}</td>
              {orders && <td><Status value={file.status} /></td>}
              <td>{orders ? file.date : file.size}</td>
              {!orders && <td>{file.date}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {!files.length && (
        <div className="empty-state">
          <FileText />
          <strong>{orders ? 'Nenhum pedido encontrado' : results ? 'Nenhum arquivo gerado encontrado' : 'Nenhum arquivo encontrado'}</strong>
          <p>{orders ? 'Altere os filtros ou inicie uma nova conversão.' : results ? 'Os resultados aparecerão aqui quando estiverem disponíveis. Confira também os filtros aplicados.' : 'Altere os filtros ou envie um novo arquivo.'}</p>
        </div>
      )}
    </div>
  );
}
