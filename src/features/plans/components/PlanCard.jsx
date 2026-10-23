import { Check, CheckCircle2 } from 'lucide-react';
import IconBox from '../../../components/ui/IconBox';

export default function PlanCard({ plan, selected, onSelect }) {
  return (
    <article className={`panel plan-card ${plan.popular ? 'popular' : ''} ${selected ? 'current' : ''}`}>
      {plan.popular && <span className="popular-tag">{plan.limit} conversões/mês</span>}
      <IconBox>
        <plan.icon />
      </IconBox>
      <h3>{plan.name}</h3>
      <p>{plan.desc}</p>
      <div className="price">
        <small>R$</small>
        <strong>{plan.price}</strong>
        <span>/mês</span>
      </div>
      <ul>
        {plan.features.map((feature) => (
          <li key={feature}>
            <Check />
            {feature}
          </li>
        ))}
      </ul>
      <button className={`btn ${selected ? 'primary' : ''}`} disabled={selected} onClick={() => onSelect(plan.name)}>
        {selected ? (
          <>
            <CheckCircle2 />
            Plano atual
          </>
        ) : (
          'Escolher plano'
        )}
      </button>
    </article>
  );
}
