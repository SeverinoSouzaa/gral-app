import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { AdminLayout } from './components/Layout/AdminLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';

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
        
        {/* Rotas Protegidas que usam o Layout da Equipe */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          {/* Outlet renderizará as subpáginas aqui */}
          <Route index element={<Dashboard />} />
          
          {/* Futuras Rotas (Fase 3 e 4) */}
          <Route path="turmas" element={<div className="p-4 text-white">Módulo de Turmas (Em breve)</div>} />
          <Route path="documentos" element={<div className="p-4 text-white">Módulo de Documentos (Em breve)</div>} />
          <Route path="midias" element={<div className="p-4 text-white">Módulo de Mídias (Em breve)</div>} />
          <Route path="financeiro" element={<div className="p-4 text-white">Módulo Financeiro (Em breve)</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
