import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';

// Mock de uma página de Dashboard por enquanto
function Dashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Dashboard Administrativo</h1>
      <p style={{ color: '#CBCBCB', marginBottom: '24px' }}>Bem-vindo ao painel da Equipe Interna.</p>
      
      <button 
        className="primary-button" 
        style={{ maxWidth: '200px' }}
        onClick={() => {
          localStorage.removeItem('adminToken');
          window.location.href = '/';
        }}
      >
        Sair
      </button>
    </div>
  );
}

// Protected Route Simples
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('adminToken');
  return token ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/dashboard/*" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
