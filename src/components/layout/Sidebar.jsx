import { X, Zap } from 'lucide-react';
import IconBox from '../ui/IconBox';
import Logo from '../ui/Logo';
import { menu } from '../../app/navigation';

export default function Sidebar({ page, setPage, open, close }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-top">
        <Logo />
        <button className="mobile-close" onClick={close} aria-label="Fechar menu">
          <X />
        </button>
      </div>
      <nav>
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => { setPage(item.id); close(); }}>
              <Icon size={23} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="side-card"><IconBox><Zap size={22} /></IconBox><strong>Converta seus arquivos SPED de forma simples, rápida e segura.</strong><div className="waves" aria-hidden="true"><i /><i /><i /></div></div>
    </aside>
  );
}
