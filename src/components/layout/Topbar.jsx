import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, LogOut, Menu, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../app/AppContext';

export default function Topbar({ onMenu }) {
  const { user, plan, logout, files, preferences } = useApp();
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);
  const navigate = useNavigate();
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const processing = files.filter((file) => file.status === 'Processando').length;

  useEffect(() => {
    const close = (event) => {
      if (!ref.current?.contains(event.target) || event.key === 'Escape') setMenu(null);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, []);

  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenu} aria-label="Abrir menu">
        <Menu />
      </button>
      <div className="top-actions" ref={ref}>
        {preferences.notifications && (
          <button className="icon-button" onClick={() => setMenu(menu === 'notifications' ? null : 'notifications')} aria-label="Notificações" aria-expanded={menu === 'notifications'}>
            <Bell size={22} />
          </button>
        )}
        <span className="top-divider" />
        <button className="user-button" onClick={() => setMenu(menu === 'user' ? null : 'user')} aria-expanded={menu === 'user'} aria-haspopup="menu">
          <div className="avatar">{initials}</div>
          <div className="profile">
            <strong>{user.name}</strong>
            <span>Plano {plan}</span>
          </div>
          <ChevronDown size={18} className={menu === 'user' ? 'rotated' : ''} />
        </button>
        {menu === 'user' && (
          <div className="header-dropdown" role="menu">
            <div className="dropdown-profile">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <button role="menuitem" onClick={() => { navigate('/configuracoes'); setMenu(null); }}>
              <UserRound size={18} />
              Minha conta
            </button>
            <button className="logout-button" role="menuitem" onClick={logout}>
              <LogOut size={18} />
              Sair da conta
            </button>
          </div>
        )}
        {menu === 'notifications' && (
          <div className="header-dropdown">
            <div className="dropdown-profile">
              <strong>Notificações</strong>
              <span>{processing ? `${processing} arquivo(s) em processamento` : 'Tudo em dia por aqui'}</span>
            </div>
            <button onClick={() => { navigate('/pedidos'); setMenu(null); }}>
              Acompanhar conversões
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
