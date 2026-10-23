import { Database, File, FileSpreadsheet, FileText, Layers3 } from 'lucide-react';
import IconBox from '../../../components/ui/IconBox';

export default function ConversionSummary({ count, mode, sped }) {
  return (
    <article className="panel section-card summary-card">
      <div className="section-title">
        <IconBox>
          <FileText />
        </IconBox>
        <strong>Resumo da conversão</strong>
      </div>
      <p>
        <Layers3 />
        Arquivos selecionados <b>{count} arquivo(s)</b>
      </p>
      <p>
        <Database />
        Tipo de SPED <b>{sped === 'auto' ? 'Automático' : sped}</b>
      </p>
    </article>
  );
}
