import { createContext, useContext, useEffect, useState } from 'react';
import { baseFiles } from '../data/files';
import { read, save } from '../utils/storage';
import { changeResults } from '../features/files/services/results';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => read('taxsped.user', { name: 'João Pereira', email: 'joao.pereira@email.com' }));
  const [auth, setAuth] = useState(() => sessionStorage.getItem('taxsped.session') === 'active');
  const [files, setFiles] = useState(() => read('taxsped.files', baseFiles));
  const [plan, setPlan] = useState(() => read('taxsped.plan', 'Profissional'));
  const [preferences, setPreferences] = useState(() =>
    read('taxsped.preferences', { notifications: true, email: true, twoFactor: false, validate: true, theme: 'light' })
  );
  const [notice, setNotice] = useState('');

  useEffect(() => {
    save('taxsped.files', files);
  }, [files]);
  useEffect(() => {
    save('taxsped.user', user);
  }, [user]);
  useEffect(() => {
    save('taxsped.plan', plan);
  }, [plan]);
  useEffect(() => {
    save('taxsped.preferences', preferences);
    document.documentElement.dataset.theme = preferences.theme;
  }, [preferences]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  function login(profile) {
    if (profile) setUser(profile);
    sessionStorage.setItem('taxsped.session', 'active');
    setAuth(true);
  }

  function logout() {
    sessionStorage.removeItem('taxsped.session');
    setAuth(false);
  }

  function updateFile(protocol, changes) {
    setFiles((current) => current.map((file) => (file.protocol === protocol ? { ...file, ...changes } : file)));
  }

  function updateResult(protocol, changes) {
    setFiles(current => changeResults(current, [protocol], changes));
  }

  const value = {
    auth,
    user,
    setUser,
    files,
    setFiles,
    plan,
    setPlan,
    preferences,
    setPreferences,
    notice,
    notify: setNotice,
    login,
    logout,
    updateFile,
    updateResult
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp precisa estar dentro de AppProvider');
  return context;
}
