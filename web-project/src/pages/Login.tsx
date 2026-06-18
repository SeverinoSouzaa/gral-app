import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '../api';
import './Login.css';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !senha) {
      setErrorMsg('Preencha e-mail e senha.');
      return;
    }

    try {
      setLoading(true);
      // Chama a rota de login da API
      const data = await api.auth.loginAdmin(email, senha);
      
      // Salva o token da equipe no LocalStorage (ou cookies)
      localStorage.setItem('adminToken', data.access_token);
      
      // Redireciona para o Painel
      navigate('/dashboard');
    } catch (error: any) {
      setErrorMsg(error.message || 'Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center">
      {/* Background Effect idêntico ao do App */}
      <div className="bg-glow"></div>
      
      <div className="glass-panel login-card">
        <div className="login-header">
          <div className="logo-container">
            <img src="/GRAL_logo.png" alt="GRAL Logo" className="logo-image" />
          </div>
          <h2>Painel da Equipe</h2>
          <p>Acesse o centro de controle financeiro e gerencial.</p>
        </div>

        {errorMsg && (
          <div className="error-alert">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>E-mail Corporativo</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="admin@gral.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field" 
                placeholder="******"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={loading}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} color="#CBCBCB" /> : <Eye size={20} color="#CBCBCB" />}
              </button>
            </div>
          </div>

          <button type="submit" className="primary-button login-btn" disabled={loading}>
            {loading ? <Loader2 className="spinner" size={20} /> : (
              <>
                Entrar no Sistema
                <LogIn size={18} style={{ marginLeft: 8 }} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
