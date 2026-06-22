import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import { AdminLayout } from './components/Layout/AdminLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { TurmasList } from './pages/Turmas/TurmasList';
import { TurmaDetalhes } from './pages/Turmas/TurmaDetalhes';
import { EventosList } from './pages/Eventos/EventosList';
import { EventoDetalhes } from './pages/Eventos/EventoDetalhes';
import { DocumentosList } from './pages/Documentos/DocumentosList';
import { Financeiro } from './pages/Financeiro/Financeiro';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rotas Protegidas do Painel */}
        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          {/* As próximas telas entrarão aqui */}
          <Route path="turmas" element={<TurmasList />} />
          <Route path="turmas/:id" element={<TurmaDetalhes />} />
          <Route path="eventos" element={<EventosList />} />
          <Route path="eventos/:id" element={<EventoDetalhes />} />
          <Route path="documentos" element={<DocumentosList />} />
          <Route path="financeiro" element={<Financeiro />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
