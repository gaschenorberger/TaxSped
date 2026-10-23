import { HashRouter } from 'react-router-dom';
import { AppProvider } from './AppContext';
import AppRoutes from './routes';
import Toast from '../components/ui/Toast';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
        <Toast />
      </HashRouter>
    </AppProvider>
  );
}
