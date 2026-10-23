import { Crown, FileSpreadsheet, Folder, Layers3, Upload, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IconBox from '../../../components/ui/IconBox';
import { plans } from '../../plans/data/plans';

export default function QuickActions({ setPage, plan, count }) {
  const navigate = useNavigate();
  const current = plans.find((item) => item.name === plan);
  return (
    <aside className="dashboard-side">
      <article className="panel quick">
        <div className="panel-title">
          <div>
            <IconBox>
              <Zap />
            </IconBox>
            <strong>Ações rápidas</strong>
          </div>
        </div>
        <div className="quick-grid">
          <button onClick={() => setPage('conversao')}>
            <Upload />
            <div className="quick-copy"><strong>Enviar arquivo</strong><small>Iniciar nova conversão</small></div>
          </button>
          <button onClick={() => navigate('/conversao?mode=excel')}>
            <FileSpreadsheet />
            <div className="quick-copy"><strong>Importar planilha</strong><small>Dados do Excel</small></div>
          </button>
          <button onClick={() => setPage('conversao')}>
            <Layers3 />
            <div className="quick-copy"><strong>Converter em lote</strong><small>Vários arquivos</small></div>
          </button>
          <button onClick={() => setPage('arquivos')}>
            <Folder />
            <div className="quick-copy"><strong>Meus arquivos</strong><small>Visualizar e organizar</small></div>
          </button>
        </div>
      </article>
      <article className="panel usage">
        <div className="panel-title">
          <div>
            <IconBox>
              <Crown />
            </IconBox>
            <strong>Uso do plano</strong>
          </div>
          <button className="link-button" onClick={() => setPage('planos')}>
            Gerenciar plano
          </button>
        </div>
        <div className="usage-row">
          <span>
            Conversões registradas{' '}
            <b>
              {count} de {current.limit || 'ilimitadas'}
            </b>
          </span>
          <div>
            <i style={{ width: `${current.limit ? Math.min(100, (count / current.limit) * 100) : 0}%` }} />
          </div>
        </div>
        <div className="usage-row">
          <span>
            Armazenamento previsto <b>{current.storage}</b>
          </span>
        </div>
      </article>
    </aside>
  );
}
