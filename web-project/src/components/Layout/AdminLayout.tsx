import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Image as ImageIcon, 
  DollarSign, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import './AdminLayout.css';

export function AdminLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Visão Geral' },
    { to: '/dashboard/turmas', icon: Users, label: 'Turmas' },
    { to: '/dashboard/documentos', icon: FileText, label: 'Documentos' },
    { to: '/dashboard/midias', icon: ImageIcon, label: 'Mídias' },
    { to: '/dashboard/financeiro', icon: DollarSign, label: 'Financeiro' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="admin-container">
      {/* Mobile Topbar */}
      <div className="mobile-topbar">
        <div className="logo-small">
          <img src="/GRAL_logo.png" alt="GRAL" />
        </div>
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X color="#FFF" /> : <Menu color="#FFF" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar glass-panel ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container-sidebar">
            <img src="/GRAL_logo.png" alt="GRAL Logo" />
          </div>
          <h2 className="brand-name">Equipe GRAL</h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.to}>
                  <NavLink 
                    to={link.to} 
                    className={({ isActive }) => `nav-link ${isActive && link.to === window.location.pathname ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                    end={link.to === '/dashboard'}
                  >
                    <Icon size={20} className="nav-icon" />
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-link logout-btn" onClick={handleLogout}>
            <LogOut size={20} className="nav-icon" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Overlay para mobile */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
