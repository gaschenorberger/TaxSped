import { Clock3, FileText, Play, Settings, Sparkles, Trash2 } from 'lucide-react';
import PageTitle from '../../components/ui/PageTitle';
import IconBox from '../../components/ui/IconBox';
import Select from '../../components/ui/Select';
import ConversionMode from './components/ConversionMode';
import FileUpload from './components/FileUpload';
import ConversionSummary from './components/ConversionSummary';
import useConversion from './hooks/useConversion';
import { useNavigate } from 'react-router-dom';
import OrderConfirmation from './components/OrderConfirmation';

export default function ConversionPage({ setPage }) {
  const navigate = useNavigate();
  const {
    mode,
    setMode,
    selected,
    setSelected,
    sped,
    setSped,
    validate,
    setValidate,
    addFiles,
    start,
    submitted
  } = useConversion();

  return (
    <>
      <PageTitle title="Nova conversão" subtitle="Converta arquivos SPED com rapidez e segurança." actions={ <button className="btn" onClick={() => setPage('pedidos')}> {' '} <Clock3 size={19} /> Ver pedidos{' '} </button> } />
      <div className="conversion-grid">
        <div>
          <article className="panel section-card">
            <div className="section-title">
              <IconBox>
                <FileText />
              </IconBox>
              <strong>Tipo de conversão</strong>
            </div>
            <ConversionMode mode={mode} onChange={setMode} />
          </article>
          <FileUpload files={selected} onAdd={addFiles} onRemove={(index) => setSelected((current) => current.filter((_, item) => item !== index))} />
          <div className="info-tip">
            <IconBox>
              <Sparkles />
            </IconBox>
            <span>O tipo de SPED será identificado automaticamente durante o processamento.</span>
          </div>
        </div>
        <aside>
          <article className="panel section-card options-card">
            <div className="section-title">
              <IconBox>
                <Settings />
              </IconBox>
              <strong>Configurações da conversão</strong>
            </div>
            <Select label="Tipo de SPED" value={sped} onChange={(event) => setSped(event.target.value)}>
              <option value="auto">Identificar automaticamente (recomendado)</option>
              <option>EFD ICMS/IPI</option>
              <option>EFD Contribuições</option>
              <option>ECD</option>
              <option>ECF</option>
            </Select>
            <div className="toggle-line">
              <button className={`toggle ${validate ? 'on' : ''}`} role="switch" aria-checked={validate} aria-label="Validar estrutura" onClick={() => setValidate(!validate)}>
                <i />
              </button>
              <span>Validar estrutura antes de converter</span>
            </div>
          </article>
          <ConversionSummary count={selected.length} mode={mode} sped={sped} />
          <div className="conversion-actions">
            <button className="btn" onClick={() => setSelected([])}>
              <Trash2 />
              Limpar
            </button>
            <button className="btn primary" disabled={!selected.length} onClick={start}>
              <Play />
              Iniciar conversão
            </button>
          </div>
        </aside>
      </div>
      {submitted && <OrderConfirmation order={submitted} onClose={() => setPage('pedidos')} onDetails={() => navigate(`/pedidos?pedido=${encodeURIComponent(submitted.protocol)}`)} />}
    </>
  );
}
