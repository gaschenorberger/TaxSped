import { Crown, FileText, Layers3 } from 'lucide-react';

export const plans = [
  {
    name: 'Essencial',
    price: 39,
    icon: FileText,
    limit: 50,
    storage: '1 GB',
    desc: 'Ideal para profissionais e pequenas operações que estão começando.',
    features: ['50 conversões por mês', 'Importação TXT e Excel', 'Pedidos por 3 meses', 'Suporte por e-mail']
  },
  {
    name: 'Profissional',
    price: 89,
    icon: Crown,
    limit: 200,
    storage: '10 GB',
    desc: 'A opção ideal para profissionais que buscam mais produtividade.',
    features: ['200 conversões por mês', 'Importação TXT e Excel', 'Pedidos de pedidos', 'Suporte prioritário', '10 GB de armazenamento'],
    popular: true
  },
  {
    name: 'Avançado',
    price: 189,
    icon: Layers3,
    limit: null,
    storage: '50 GB',
    desc: 'Para quem precisa de alto volume de conversões.',
    features: ['Conversões ilimitadas', 'Importação TXT e Excel', 'Pedidos de pedidos', 'Suporte prioritário', '50 GB de armazenamento']
  }
];
