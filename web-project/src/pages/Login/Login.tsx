import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { AppInput } from '../../components/AppInput/AppInput';
import { AppButton } from '../../components/AppButton/AppButton';
import { api } from '../../api/client';
import './Login.css';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Usando API real
      const response = await api.post('/auth/login/equipe', { email, senha });
      
      if (response && response.accessToken) {
        localStorage.setItem('@GRAL:token_admin', response.accessToken);
        // Após login, vai pro dashboard
        navigate('/dashboard');
      } else {
        throw new Error('Token não retornado pelo servidor.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'E-mail ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-box glass-panel">
        <div className="login-header">
          <div className="login-logo-wrapper">
          <img src="/logo.png" alt="GRAL" className="login-logo-img" />
        </div>
          <h1>Bem-vindo à GRAL</h1>
          <p>Painel Administrativo para a Equipe Interna</p>
        </div>

        {errorMsg && (
          <div className="login-error-alert animate-fade-in">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <AppInput
            type="email"
            placeholder="Seu e-mail corporativo"
            label="E-mail"
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <AppInput
            type="password"
            placeholder="Sua senha"
            label="Senha"
            icon={<Lock size={18} />}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <div className="login-actions">
            <AppButton type="submit" fullWidth isLoading={loading} size="lg">
              Entrar no Sistema
            </AppButton>
          </div>
        </form>
      </div>
      
      <div className="login-background-effects">
        <div className="glow-circle glow-1"></div>
        <div className="glow-circle glow-2"></div>
      </div>
    </div>
  );
}
