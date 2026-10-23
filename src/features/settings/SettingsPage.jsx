import { useState } from 'react';
import { Bell, ChevronRight, Palette, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react';
import PageTitle from '../../components/ui/PageTitle';
import ProfileSettings from './components/ProfileSettings';
import PreferencesSettings from './components/PreferencesSettings';

const sections = [
  { id: 'perfil', label: 'Perfil', sub: 'Seus dados pessoais', icon: UserRound },
  { id: 'seguranca', label: 'Segurança', sub: 'Acesso e sessões', icon: ShieldCheck },
  { id: 'notificacoes', label: 'Notificações', sub: 'Seus avisos e e-mails', icon: Bell },
  { id: 'aparencia', label: 'Aparência', sub: 'Tema e visual', icon: Palette },
  { id: 'preferencias', label: 'Preferências', sub: 'Configurações do sistema', icon: SlidersHorizontal }
];

export default function SettingsPage() {
  const [section, setSection] = useState('perfil');
  return (
    <>
      <PageTitle title="Configurações" subtitle="Gerencie suas preferências e personalize sua experiência na plataforma." />
      <div className="settings-grid">
        <aside className="panel settings-nav">
          {sections.map((item) => (
            <button className={section === item.id ? 'active' : ''} onClick={() => setSection(item.id)} key={item.id}>
              <item.icon />
              <span>
                <strong>{item.label}</strong>
                <small>{item.sub}</small>
              </span>
              <ChevronRight />
            </button>
          ))}
        </aside>
        <section className="settings-content">
          {section === 'perfil' || section === 'seguranca' ? (
            <ProfileSettings securityOnly={section === 'seguranca'} />
          ) : (
            <PreferencesSettings section={section} />
          )}
        </section>
      </div>
    </>
  );
}
