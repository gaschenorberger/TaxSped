import { useState } from 'react';
import { Download } from 'lucide-react';
import PageTitle from '../../components/ui/PageTitle';
import FileFilters from '../../components/ui/FileFilters';
import Pagination from '../../components/ui/Pagination';
import FileTable from '../files/components/FileTable';
import OrderDetails from './components/OrderDetails';
import OrderTabs from './components/OrderTabs';
import useFiles from '../files/hooks/useFiles';
import { exportOrders } from '../../utils/download';
import { useSearchParams } from 'react-router-dom';

export default function OrdersPage({ files }) {
  const filters = useFiles(files);
  const [params] = useSearchParams();
  const [details, setDetails] = useState(() => files.find(order => order.protocol === params.get('pedido')) || null);

  function selectStatus(status) {
    filters.setStatus(status);
    filters.setPage(1);
  }

  return (
    <>
      <div className="orders-toolbar">
        <PageTitle className="orders-page-head" title="Pedidos" subtitle="Acompanhe suas conversões e baixe os resultados nos detalhes." actions={<button className="btn" onClick={() => exportOrders(filters.filtered)}><Download />Exportar pedidos</button>} />
        <OrderTabs files={files} status={filters.status} onSelect={selectStatus} />
        <FileFilters filters={filters} orders />
      </div>
      <section className="orders-grid" aria-label="Lista de pedidos">
        <article className="panel data-panel orders-panel">
          <div className="orders-list-heading"><h2>Seus pedidos</h2><span>{filters.filtered.length} {filters.filtered.length === 1 ? 'pedido' : 'pedidos'}</span></div>
          <FileTable files={filters.visible} orders onDetails={setDetails} />
          <Pagination total={filters.filtered.length} page={filters.page} pageSize={filters.pageSize} onPage={filters.setPage} onPageSize={filters.setPageSize} />
        </article>
      </section>
      {details && <OrderDetails order={details} onClose={() => setDetails(null)} />}
    </>
  );
}
