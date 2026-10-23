import { useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useApp } from '../../app/AppContext';
import PageTitle from '../../components/ui/PageTitle';
import FileFilters from '../../components/ui/FileFilters';
import Pagination from '../../components/ui/Pagination';
import FileTable from './components/FileTable';
import FileDetails from './components/FileDetails';
import useFiles from './hooks/useFiles';
import { changeResults, getResults } from './services/results';
import OrderDetails from '../orders/components/OrderDetails';

export default function FilesPage({ files, setPage }) {
  const { setFiles, notify } = useApp();
  const [tab, setTab] = useState('Arquivos gerados');
  const [selected, setSelected] = useState([]);
  const [details, setDetails] = useState(null);
  const [order, setOrder] = useState(null);
  const source = getResults(files);
  const filters = useFiles(source, tab === 'Lixeira');

  function select(ids, checked) {
    setSelected((current) => (checked ? [...new Set([...current, ...ids])] : current.filter((id) => !ids.includes(id))));
  }

  function moveSelected() {
    setFiles(current => changeResults(current, selected, { deleted: tab !== 'Lixeira' }));
    setSelected([]);
    notify(tab === 'Lixeira' ? 'Arquivos restaurados.' : 'Arquivos movidos para a lixeira.');
  }

  return (
    <>
      <PageTitle title="Arquivos" subtitle="Acesse os arquivos gerados e o pedido de origem de cada resultado." actions={<button className="btn primary" onClick={() => setPage('conversao')}><Plus />Nova conversão</button>} />
      <div className="files-toolbar">
        <div className="tabs">
          {['Arquivos gerados', 'Lixeira'].map((item) => (
            <button key={item} className={tab === item ? 'active' : ''} onClick={() => { setTab(item); filters.setPage(1); setSelected([]); }}>
              {item}
            </button>
          ))}
        </div>
        <div className="search-input">
          <Search />
          <input value={filters.search} onChange={(event) => filters.setSearch(event.target.value)} placeholder="Buscar arquivo ou pedido..." aria-label="Buscar arquivo ou pedido" />
        </div>
      </div>
      <FileFilters filters={filters} />
      {selected.length > 0 && (
        <div className="selection-bar">
          <span>{selected.length} arquivo(s) selecionado(s)</span>
          <button className="btn" onClick={moveSelected}>
            <Trash2 />
            {tab === 'Lixeira' ? 'Restaurar selecionados' : 'Mover para lixeira'}
          </button>
        </div>
      )}
      <article className="panel data-panel files-table">
        <FileTable files={filters.visible} selected={selected} onSelect={select} onDetails={setDetails} results onOrder={file => setOrder(files.find(item => item.protocol === file.orderProtocol))} />
        <Pagination total={filters.filtered.length} page={filters.page} pageSize={filters.pageSize} onPage={filters.setPage} onPageSize={filters.setPageSize} />
      </article>
      {details && <FileDetails file={details} onClose={() => setDetails(null)} />}
      {order && <OrderDetails order={order} onClose={() => setOrder(null)} />}
    </>
  );
}
