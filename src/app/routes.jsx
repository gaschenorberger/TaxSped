import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from './AppContext';
import { paths } from './navigation';
import Layout from '../components/layout/Layout';
import LoginPage from '../features/auth/LoginPage';
import SignupPage from '../features/auth/SignupPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import ConversionPage from '../features/conversion/ConversionPage';
import OrdersPage from '../features/orders/OrdersPage';
import FilesPage from '../features/files/FilesPage';
import PlansPage from '../features/plans/PlansPage';
import SettingsPage from '../features/settings/SettingsPage';

export default function AppRoutes() {
  const { auth, files, setFiles } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const page = Object.keys(paths).find((key) => paths[key] === location.pathname) || 'dashboard';
  const setPage = (id) => navigate(paths[id] || '/dashboard');
  const setMode = (mode) => navigate(mode === 'signup' ? '/cadastro' : '/login');

  if (!auth)
    return (
      <Routes>
        <Route path="/login" element={<LoginPage setMode={setMode} />} />
        <Route path="/cadastro" element={<SignupPage setMode={setMode} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );

  return (
    <Layout page={page} setPage={setPage}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage setPage={setPage} files={files} />} />
        <Route path="/conversao" element={<ConversionPage files={files} setFiles={setFiles} setPage={setPage} />} />
        <Route path="/pedidos" element={<OrdersPage files={files} />} />
        <Route path="/historico" element={<Navigate to="/pedidos" replace />} />
        <Route path="/arquivos" element={<FilesPage files={files} setPage={setPage} />} />
        <Route path="/planos" element={<PlansPage />} />
        <Route path="/configuracoes" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}
