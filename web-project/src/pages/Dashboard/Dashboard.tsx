import { useState, useEffect } from 'react';
import { Users, GraduationCap, Calendar, FileText, ArrowUpRight, Loader2 } from 'lucide-react';
import { api } from '../../api/client';
import './Dashboard.css';

export function Dashboard() {
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    turmas: 0,
    formandos: 0,
    eventos: 0,
    documentos: 0
  });

  useEffect(() => {
    carregarResumo();
  }, []);

  const carregarResumo = async () => {
    try {
      setLoading(true);
      const [turmasData, usuariosData, eventosData, documentosData] = await Promise.all([
        api.turmas.listar(),
        api.usuariosAdmin.listar(),
        api.eventosAdmin.listarTodos(),
        api.documentosAdmin.listarTodos()
      ]);

      const totalFormandos = (usuariosData || []).filter((u: any) => 
        u.tipoUsuario === 'STUDENT' || u.tipoUsuario === 'FORMANDO' || !u.tipoUsuario
      ).length;

      setStats({
        turmas: (turmasData || []).length,
        formandos: totalFormandos,
        eventos: (eventosData || []).length,
        documentos: (documentosData || []).filter((d: any) => d.status === 'PENDENTE').length
      });
    } catch (err) {
      console.error('Erro ao carregar resumo do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Turmas Ativas', value: stats.turmas.toString(), icon: <Users size={24} />, color: '#d35817' },
    { label: 'Total de Formandos', value: stats.formandos.toString(), icon: <GraduationCap size={24} />, color: '#4CAF50' },
    { label: 'Eventos Agendados', value: stats.eventos.toString(), icon: <Calendar size={24} />, color: '#FF9500' },
    { label: 'Doc. Pendentes', value: stats.documentos.toString(), icon: <FileText size={24} />, color: '#34C759' },
  ];

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Bem-vindo ao Painel Administrativo da GRAL. Aqui está o resumo atual.</p>
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: '300px' }}>
          <Loader2 size={40} className="spinner" color="var(--color-primary)" />
        </div>
      ) : (
        <>
          <div className="stats-grid">
            {statCards.map((stat, idx) => (
              <div key={idx} className="glass-panel stat-card">
                <div className="stat-header">
                  <span className="stat-label">{stat.label}</span>
                  <div className="stat-icon-wrapper" style={{ color: stat.color, backgroundColor: `${stat.color}15` }}>
                    {stat.icon}
                  </div>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-footer">
                  <span className="trend positive">
                    <ArrowUpRight size={14} /> Atualizado agora
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-sections">
            <div className="glass-panel section-card">
              <h3>Avisos Recentes</h3>
              <div className="empty-state">
                <p>Nenhum aviso importante no momento.</p>
              </div>
            </div>
            <div className="glass-panel section-card">
              <h3>Próximos Eventos</h3>
              <div className="empty-state">
                <p>Nenhum evento agendado para os próximos 7 dias.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
