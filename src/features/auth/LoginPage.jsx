import { useState } from 'react';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { useApp } from '../../app/AppContext';
import Logo from '../../components/ui/Logo';
import Modal from '../../components/ui/Modal';
import AuthHero from './AuthHero';
import AuthField from './components/AuthField';

export default function LoginPage({ setMode }) {
  const { login, notify } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recovery, setRecovery] = useState(false);

  function submit(event) {
    event.preventDefault();
    login({ name: email.split('@')[0].replace(/[._]/g, ' '), email });
  }

  return (
    <div className="auth-page">
      <AuthHero />
      <section className="auth-form">
        <form className="auth-box" onSubmit={submit}>
          <Logo tagline />
          <div className="auth-title">
            <h1>Bem-vindo de volta</h1>
            <p>Acesse sua conta para continuar utilizando a plataforma.</p>
          </div>
          <AuthField label="E-mail" icon={Mail} type="email" value={email} onChange={setEmail} placeholder="seu.email@exemplo.com" autoComplete="email" />
          <AuthField label="Senha" icon={LockKeyhole} type="password" value={password} onChange={setPassword} placeholder="Sua senha" autoComplete="current-password" />
          <button type="button" className="forgot" onClick={() => setRecovery(true)}>
            Esqueceu sua senha?
          </button>
          <button className="btn primary auth-submit" type="submit">
            Entrar <ArrowRight />
          </button>
          <div className="or">
            <span>ou</span>
          </div>
          <button className="btn google" type="button" disabled title="A integração com Google será disponibilizada após conectar o backend">
            <b>G</b>Entrar com Google
          </button>
          <p className="auth-switch">
            Não tem uma conta?{' '}
            <button type="button" onClick={() => setMode('signup')}>
              Criar conta
            </button>
          </p>
        </form>
        <div className="auth-waves" aria-hidden="true"><i /><i /><i /></div>
        <button className="demo-login" type="button" onClick={() => login()}>Explorar demonstração</button>
      </section>
      {recovery && (
        <Modal title="Recuperar acesso" onClose={() => setRecovery(false)}>
          <p>A recuperação por e-mail estará disponível quando o serviço de autenticação for conectado.</p>
          <button className="btn primary" onClick={() => { setRecovery(false); notify('Você pode explorar a demonstração sem recuperar sua senha.'); }}>
            Entendi
          </button>
        </Modal>
      )}
    </div>
  );
}
