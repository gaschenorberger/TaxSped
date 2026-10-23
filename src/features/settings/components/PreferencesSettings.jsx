import { useApp } from '../../../app/AppContext';
import { Moon, Sun } from 'lucide-react';
import Select from '../../../components/ui/Select';

export default function PreferencesSettings({ section }) {
  const { preferences, setPreferences, notify } = useApp();
  const titles = { notificacoes: 'Notificações', aparencia: 'Aparência', preferencias: 'Preferências' };
  function update(key, value) {
    setPreferences((current) => ({ ...current, [key]: value }));
    notify('Preferência salva.');
  }

  function toggle(key, label) {
    return (
      <div className="preference-row">
        <span>{label}</span>
        <button className={`toggle ${preferences[key] ? 'on' : ''}`} role="switch" aria-checked={preferences[key]} aria-label={label} onClick={() => update(key, !preferences[key])}>
          <i />
        </button>
      </div>
    );
  }

  return (
    <article className="panel setting-card">
      <div className="setting-head">
        <div>
          <h3>{titles[section]}</h3>
          <p>Suas preferências são salvas neste navegador.</p>
        </div>
      </div>
      {section === 'notificacoes' && (
        <>
          {toggle('notifications', 'Exibir notificações da plataforma')}
          {toggle('email', 'Receber avisos por e-mail quando disponível')}
        </>
      )}
      {section === 'preferencias' && toggle('validate', 'Validar estrutura por padrão nas conversões')}
      {section === 'aparencia' && (
        <div className="theme-select"><Select label="Tema" value={preferences.theme} onChange={(event) => update('theme', event.target.value)} options={[{ value: 'light', label: 'Claro', description: 'Superfícies leves e luminosas', icon: Sun }, { value: 'dark', label: 'Escuro', description: 'Contraste suave para trabalhar à noite', icon: Moon }]} /></div>
      )}
    </article>
  );
}
