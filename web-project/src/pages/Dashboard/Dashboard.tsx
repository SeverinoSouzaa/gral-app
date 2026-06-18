import React from 'react';
import { Users, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import './Dashboard.css';

export function Dashboard() {
  // Mock data por enquanto (Fase 2). 
  // Na próxima fase (3 e 4) conectaremos ao api.ts
  const stats = [
    { label: 'Turmas Ativas', value: '4', icon: Users, color: '#4CAF50' },
    { label: 'Formandos', value: '142', icon: CheckCircle, color: '#d35817' },
    { label: 'Docs Pendentes', value: '18', icon: FileText, color: '#f39c12' },
    { label: 'Inadimplentes', value: '7', icon: AlertTriangle, color: '#B73020' },
  ];

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="page-header">
        <h1>Visão Geral</h1>
        <p>Acompanhe os principais indicadores do sistema.</p>
      </header>

      {/* CARDS DE RESUMO (Glassmorphism) */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-panel stat-card">
              <div className="stat-header">
                <span className="stat-label">{stat.label}</span>
                <div className="icon-wrapper" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="stat-value">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-content">
        {/* Placeholder para gráficos ou listas recentes */}
        <div className="glass-panel widget large-widget">
          <h3>Arrecadação Recente</h3>
          <div className="empty-state">
            <p>O gráfico de fluxo de caixa será conectado ao módulo financeiro.</p>
          </div>
        </div>

        <div className="glass-panel widget small-widget">
          <h3>Avisos Importantes</h3>
          <div className="empty-state">
            <p>Tudo tranquilo por aqui.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
