import { Home, Plus, ClipboardList, Folder, Crown, Settings } from 'lucide-react';

export const menu = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'conversao', label: 'Nova conversão', icon: Plus },
  { id: 'pedidos', label: 'Pedidos', icon: ClipboardList },
  { id: 'arquivos', label: 'Arquivos', icon: Folder },
  { id: 'planos', label: 'Plano', icon: Crown },
  { id: 'configuracoes', label: 'Configurações', icon: Settings }
];

export const paths = {
  dashboard: '/dashboard',
  conversao: '/conversao',
  pedidos: '/pedidos',
  arquivos: '/arquivos',
  planos: '/planos',
  configuracoes: '/configuracoes'
};
