import { ArrowRight, FileSpreadsheet, FileText } from 'lucide-react';
import IconBox from '../../../components/ui/IconBox';

export default function ConversionMode({ mode, onChange }) {
  return (
    <div className="mode-grid">
      <button className={mode === 'txt' ? 'selected' : ''} onClick={() => onChange('txt')}>
        <span className="mode-icons">
          <IconBox>
            <FileText />
          </IconBox>
          <ArrowRight />
          <IconBox>
            <FileSpreadsheet />
          </IconBox>
        </span>
        <strong>TXT → Excel</strong>
        <small>Converta arquivos SPED no formato TXT para planilhas do Excel, facilitando a visualização e análise dos dados.</small>
      </button>
      <button className={mode === 'excel' ? 'selected' : ''} onClick={() => onChange('excel')}>
        <span className="mode-icons">
          <IconBox>
            <FileSpreadsheet />
          </IconBox>
          <ArrowRight />
          <IconBox>
            <FileText />
          </IconBox>
        </span>
        <strong>Excel → TXT</strong>
        <small>Reconstrua o arquivo SPED a partir de uma planilha no layout correspondente.</small>
      </button>
    </div>
  );
}
