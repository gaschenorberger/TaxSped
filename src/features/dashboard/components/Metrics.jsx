import { CheckCircle2, Clock3, FileCheck2, FileText } from 'lucide-react';
import IconBox from '../../../components/ui/IconBox';

function Metric({ icon: Icon, title, value, note, tone = 'green' }) {
  return (
    <article className="metric">
      <IconBox tone={tone}>
        <Icon size={23} />
      </IconBox>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </article>
  );
}

export default function Metrics({ files }) {
  const done = files.filter((file) => file.status === 'Concluído').length;
  const processing = files.filter((file) => file.status === 'Processando').length;
  const rate = files.length ? ((done / files.length) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) : '0';
  return (
    <section className="metrics">
      <Metric icon={FileText} title="Conversões registradas" value={files.length} note="Todos os arquivos da plataforma" />
      <Metric icon={FileCheck2} title="Arquivos processados" value={done} note="Conversões concluídas" />
      <Metric icon={CheckCircle2} title="Taxa de sucesso" value={`${rate}%`} note="Sobre as conversões registradas" />
      <Metric icon={Clock3} title="Em andamento" value={processing} note="em processamento" tone="orange" />
    </section>
  );
}
