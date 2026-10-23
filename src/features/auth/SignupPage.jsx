import { useState } from 'react';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useApp } from '../../app/AppContext';
import Logo from '../../components/ui/Logo';
import AuthHero from './AuthHero';
import AuthField from './components/AuthField';

export default function SignupPage({ setMode }) {
  const { login } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    if (password !== confirmation) return setError('As senhas não coincidem.');
    if (!accepted) return setError('Confirme que aceita os termos para continuar.');
    login({ name, email });
  }

  return (
    <div className="auth-page signup-page">
      <AuthHero />
      <section className="auth-form signup">
        <form className="auth-box" onSubmit={submit}>
          <Logo tagline />
          <div className="auth-title">
            <h1>Criar conta</h1>
            <p>Cadastre-se para começar a usar a plataforma.</p>
          </div>
          <AuthField label="Nome completo" icon={UserRound} value={name} onChange={setName} placeholder="Seu nome completo" autoComplete="name" />
          <AuthField label="E-mail" icon={Mail} type="email" value={email} onChange={setEmail} placeholder="seu@email.com" autoComplete="email" />
          <AuthField label="Senha" icon={LockKeyhole} type="password" value={password} onChange={setPassword} placeholder="Crie uma senha" minLength={8} autoComplete="new-password" />
          <AuthField label="Confirmar senha" icon={LockKeyhole} type="password" value={confirmation} onChange={setConfirmation} placeholder="Confirme sua senha" minLength={8} autoComplete="new-password" />
          <label className="check-line">
            <input type="checkbox" required checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
            <span>Li e aceito os termos de uso e a política de privacidade.</span>
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn primary auth-submit" type="submit">
            Criar conta <ArrowRight />
          </button>
          <div className="or">
            <span>ou</span>
          </div>
          <button className="btn google" type="button" disabled title="A integração com Google será disponibilizada após conectar o backend">
            <b>G</b>Cadastrar com Google
          </button>
          <p className="auth-switch">
            Já tem uma conta?{' '}
            <button type="button" onClick={() => setMode('login')}>
              Entrar
            </button>
          </p>
        </form>
      </section>
    </div>
  );
}
