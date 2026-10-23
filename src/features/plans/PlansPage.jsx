import { useState } from 'react';
import { Gauge } from 'lucide-react';
import { useApp } from '../../app/AppContext';
import PageTitle from '../../components/ui/PageTitle';
import Modal from '../../components/ui/Modal';
import PlanCard from './components/PlanCard';
import PlanSummary from './components/PlanSummary';
import { plans } from './data/plans';

export default function PlansPage() {
  const { plan, setPlan, files, notify } = useApp();
  const [compare, setCompare] = useState(false);
  const current = plans.find((item) => item.name === plan);

  function select(name) {
    setPlan(name);
    notify(`Plano ${name} selecionado na demonstração. Nenhuma cobrança foi realizada.`);
  }

  return (
    <>
      <PageTitle title="Planos" subtitle="Escolha o plano ideal para sua operação." />
      <PlanSummary plan={current} files={files} />
      <div className="subhead">
        <div>
          <h2>Nossos planos</h2>
          <p>Escolha o plano que melhor se adapta às necessidades da sua operação.</p>
        </div>
        <button className="link-button" onClick={() => setCompare(true)}>
          <Gauge />
          Comparar planos
        </button>
      </div>
      <section className="plans-grid">
        {plans.map((item) => (
          <PlanCard key={item.name} plan={item} selected={item.name === plan} onSelect={select} />
        ))}
      </section>
      {compare && (
        <Modal title="Comparar planos" onClose={() => setCompare(false)}>
          <div className="table-wrap">
            <table className="comparison">
              <thead>
                <tr>
                  <th>Recurso</th>
                  {plans.map((item) => (
                    <th key={item.name}>{item.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Conversões/mês</td>
                  {plans.map((item) => (
                    <td key={item.name}>{item.limit || 'Ilimitadas'}</td>
                  ))}
                </tr>
                <tr>
                  <td>Armazenamento</td>
                  {plans.map((item) => (
                    <td key={item.name}>{item.storage}</td>
                  ))}
                </tr>
                <tr>
                  <td>Preço mensal</td>
                  {plans.map((item) => (
                    <td key={item.name}>R$ {item.price}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </>
  );
}
