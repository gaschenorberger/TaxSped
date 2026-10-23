import { Check, Database, FileText } from 'lucide-react';
import { getUsage } from '../services/usage';

export default function PlanSummary({ plan, files }) {
  const { count, used, total } = getUsage(files);
  const capacity = Number.parseFloat(plan.storage) * 1024;
  const percent = plan.limit ? Math.min(100, count / plan.limit * 100) : 0;
  const usedLabel = used >= 1024 ? `${(used / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} GB` : `${used.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`;

  return (
    <section className="plan-overview" aria-label="Resumo da assinatura">
      <article className="panel plan-overview-card current-plan">
        <div className="overview-label"><span>Plano atual</span><span className="plan-active"><Check size={12} />Em uso</span></div>
        <div className="overview-value">{plan.name}</div>
        <div className="overview-footer"><span>R$ {plan.price}<small> / mês</small></span><span>{plan.limit ? `${plan.limit} conversões/mês` : 'Conversões ilimitadas'}</span></div>
      </article>
      <article className="panel plan-overview-card">
        <div className="overview-label"><span>Uso neste mês</span><FileText size={17} /></div>
        <div className="overview-value">{count}<span> / {plan.limit || 'ilimitadas'}</span></div>
        <div className="overview-progress" role="progressbar" aria-label="Uso de conversões" aria-valuenow={count} aria-valuemin={0} aria-valuemax={plan.limit || Math.max(count, 1)}><i style={{ width: `${percent}%` }} /></div>
        <div className="overview-note">{plan.limit ? `${Math.max(0, plan.limit - count)} conversões disponíveis` : 'Sem limite mensal de conversões'}</div>
      </article>
      <article className="panel plan-overview-card">
        <div className="overview-label"><span>Armazenamento</span><Database size={17} /></div>
        <div className="overview-value">{usedLabel}<span> / {plan.storage}</span></div>
        <div className="overview-progress storage" role="progressbar" aria-label="Uso de armazenamento" aria-valuenow={Math.round(used)} aria-valuemin={0} aria-valuemax={capacity}><i style={{ width: `${Math.min(100, used / capacity * 100)}%` }} /></div>
        <div className="overview-note">{total} {total === 1 ? 'arquivo registrado' : 'arquivos registrados'}</div>
      </article>
    </section>
  );
}
