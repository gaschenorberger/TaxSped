import { useState } from 'react';
import { LockKeyhole, LogOut, Mail, Monitor, Pencil, ShieldCheck, UserRound } from 'lucide-react';
import { useApp } from '../../../app/AppContext';
import Modal from '../../../components/ui/Modal';

export default function ProfileSettings({ securityOnly }) {
  const { user, setUser, plan, logout, notify } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  function submit(event) {
    event.preventDefault();
    setUser({ ...user, name, email });
    setEditing(false);
    notify('Perfil atualizado.');
  }

  return (
    <>
      {!securityOnly && (
        <article className="panel setting-card">
          <div className="setting-head">
            <div>
              <h3>Informações pessoais</h3>
              <p>Seus dados de acesso e identificação na plataforma.</p>
            </div>
            <button className="btn" onClick={() => setEditing(true)}>
              <Pencil />
              Editar
            </button>
          </div>
          <div className="profile-card">
            <div className="avatar large">{initials}</div>
            <div>
              <strong>
                {user.name} <span>Plano {plan}</span>
              </strong>
              <p>
                <Mail />
                {user.email}
                <UserRound />
                Sua conta TaxSped
              </p>
            </div>
          </div>
        </article>
      )}
      <article className="panel setting-card">
        <div className="setting-head">
          <div>
            <h3>Alterar senha</h3>
            <p>Mantenha sua conta segura com uma senha forte.</p>
          </div>
          <button className="btn" disabled title="Disponível após integrar o serviço de autenticação">
            <LockKeyhole />
            Alterar senha
          </button>
        </div>
        <div className="security-tip">
          <ShieldCheck />
          <span>
            <strong>Dica de segurança</strong>Use uma senha com pelo menos 8 caracteres, incluindo letras, números e símbolos.
          </span>
        </div>
      </article>
      <article className="panel setting-card">
        <div className="setting-head">
          <div>
            <h3>Autenticação em duas etapas</h3>
            <p>Disponível após conectar o serviço de autenticação.</p>
          </div>
          <button className="toggle" disabled aria-label="Autenticação em duas etapas indisponível">
            <i />
          </button>
        </div>
        <div className="device-tip">
          <ShieldCheck />
          <span>
            <strong>Proteja sua conta</strong>Esta opção adicionará uma etapa de verificação ao seu acesso.
          </span>
        </div>
      </article>
      <article className="panel setting-card">
        <div className="setting-head">
          <div>
            <h3>Sessão atual</h3>
            <p>Gerencie seu acesso à plataforma.</p>
          </div>
          <button className="btn" onClick={logout}>
            <LogOut />
            Sair da conta
          </button>
        </div>
        <div className="session">
          <Monitor />
          <span>
            <strong>Este navegador</strong>
            <small>Sessão local ativa</small>
          </span>
          <span>Agora</span>
        </div>
      </article>
      {editing && (
        <Modal title="Editar perfil" onClose={() => setEditing(false)}>
          <form className="mock-form" onSubmit={submit}>
            <label>
              Nome completo
              <input required value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label>
              E-mail
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <button className="btn primary" type="submit">
              Salvar alterações
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
