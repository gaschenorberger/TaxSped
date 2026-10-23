import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function AuthField({ label, icon: Icon, type = 'text', value, onChange, placeholder, minLength, autoComplete }) {
  const [visible, setVisible] = useState(false);
  const secret = type === 'password';
  return (
    <label className="auth-field">
      <span>{label}</span>
      <div>
        <Icon />
        <input required type={secret && visible ? 'text' : type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} minLength={minLength} autoComplete={autoComplete} />
        {secret && (
          <button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}>
            {visible ? <EyeOff /> : <Eye />}
          </button>
        )}
      </div>
    </label>
  );
}
