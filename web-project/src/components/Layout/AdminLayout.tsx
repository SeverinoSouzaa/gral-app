import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  DollarSign, 
  Calendar, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import './AdminLayout.css';

export function AdminLayout() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('@GRAL:token_admin');
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/turmas', icon: <Users size={20} />, label: 'Turmas & Formandos' },
    { to: '/eventos', icon: <Calendar size={20} />, label: 'Eventos & Mídias' },
    { to: '/documentos', icon: <FileText size={20} />, label: 'Documentos' },
    { to: '/financeiro', icon: <DollarSign size={20} />, label: 'Financeiro' },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Menu Overlay */}
      {menuAberto && (
        <div className="mobile-overlay" onClick={() => setMenuAberto(false)} />
      )}

      {/* Sidebar */}
      <aside className={`app-sidebar glass-panel ${menuAberto ? 'open' : ''}`}>
        <div className="sidebar-header flex-between">
          <div className="sidebar-logo flex-center">
            <img src="/logo.png" alt="GRAL" className="sidebar-logo-img" />
            <span className="sidebar-brand">GRAL Admin</span>
          </div>
          <button className="mobile-close-btn" onClick={() => setMenuAberto(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navLinks.map((link) => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMenuAberto(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <header className="app-header glass-panel">
          <button className="mobile-menu-btn" onClick={() => setMenuAberto(true)}>
            <Menu size={24} />
          </button>
          
          <div className="header-user-info">
            <div className="avatar-placeholder">A</div>
            <div className="user-text">
              <span className="user-name">Equipe GRAL</span>
              <span className="user-role">Administrador</span>
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
