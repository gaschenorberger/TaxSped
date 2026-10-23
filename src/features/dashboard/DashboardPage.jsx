import { Clock3, FileText, Plus } from 'lucide-react';
import { useApp } from '../../app/AppContext';
import PageTitle from '../../components/ui/PageTitle';
import IconBox from '../../components/ui/IconBox';
import Status from '../../components/ui/Status';
import Metrics from './components/Metrics';
import Charts from './components/Charts';
import QuickActions from './components/QuickActions';

export default function DashboardPage({ setPage, files }) {
  const { plan } = useApp();
  const active = files.filter((file) => !file.deleted);
  const recent = active.slice(0, 5);
  return (
    <>
      <PageTitle title="Dashboard" subtitle="Acompanhe suas conversões e o desempenho da plataforma." actions={ <> {' '} <button className="btn primary" onClick={() => setPage('conversao')}> {' '} <Plus size={20} /> Nova conversão{' '} </button>{' '} <button className="btn" onClick={() => setPage('pedidos')}> {' '} <Clock3 size={19} /> Ver pedidos{' '} </button>{' '} </> } />
      <Metrics files={active} />
      <section className="dashboard-grid">
        <Charts files={active} />
        <article className="panel recent-panel">
          <div className="panel-title">
            <div>
              <IconBox>
                <FileText />
              </IconBox>
            <strong>Pedidos recentes</strong>
            </div>
            <button className="link-button" onClick={() => setPage('pedidos')}>
              Ver tudo
            </button>
          </div>
          <div className="simple-table">
            {recent.map((file) => (
              <div className="simple-row" key={file.protocol}>
                <span className="file-name">
                  <FileText size={19} />
                  {file.name}
                </span>
                <span>{file.sped}</span>
                <b className="type-tag">{file.type}</b>
                <span>{file.date}</span>
                <Status value={file.status} />
                <button className="link-button" onClick={() => setPage('pedidos')} aria-label={`Ver ${file.name}`}>
                  →
                </button>
              </div>
            ))}
          </div>
        </article>
        <QuickActions setPage={setPage} plan={plan} count={active.length} />
      </section>
    </>
  );
}
