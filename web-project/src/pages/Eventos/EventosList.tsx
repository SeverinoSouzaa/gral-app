import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar, ChevronRight, MapPin } from 'lucide-react';
import { api } from '../../api/client';
import { AppButton } from '../../components/AppButton/AppButton';
import { AppInput } from '../../components/AppInput/AppInput';
import { AppSelect } from '../../components/AppSelect/AppSelect';
import { AppModal } from '../../components/AppModal/AppModal';
import './Eventos.css';

export function EventosList() {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroTurma, setFiltroTurma] = useState('');

  const [modalNovoEvento, setModalNovoEvento] = useState(false);
  const [formEvento, setFormEvento] = useState({
    nomeEvento: '', dataEvento: '', local: '', descricao: '', eventType: 'EVENT', turmaId: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [listaTurmas, listaEventos] = await Promise.all([
        api.turmas.listar(),
        api.eventosAdmin.listarTodos()
      ]);
      setTurmas(Array.isArray(listaTurmas) ? listaTurmas : []);
      setEventos(Array.isArray(listaEventos) ? listaEventos : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCriarEvento = async () => {
    try {
      if (!formEvento.turmaId) {
        alert('Selecione uma turma para o evento.');
        return;
      }
      
      const dataIso = new Date(formEvento.dataEvento).toISOString();

      await api.eventosAdmin.criar({
        nomeEvento: formEvento.nomeEvento,
        dataEvento: dataIso,
        local: formEvento.local,
        descricao: formEvento.descricao,
        eventType: formEvento.eventType,
        turmaId: Number(formEvento.turmaId)
      });
      setModalNovoEvento(false);
      setFormEvento({ nomeEvento: '', dataEvento: '', local: '', descricao: '', eventType: 'FESTA', turmaId: '' });
      carregarDados();
    } catch (err) {
      console.error(err);
      alert('Erro ao criar evento. Verifique os dados.');
    }
  };

  const eventosFiltrados = eventos.filter(ev => {
    const matchBusca = (ev.nomeEvento || ev.titulo || '').toLowerCase().includes(busca.toLowerCase());
    const matchTurma = filtroTurma ? ev.turmaId === Number(filtroTurma) : true;
    return matchBusca && matchTurma;
  });

  return (
    <div className="eventos-container animate-fade-in">
      <div className="page-header flex-between">
        <div>
          <h1>Eventos e Mídias</h1>
          <p>Gerencie os eventos das turmas e suba fotos/vídeos de cada ocasião.</p>
        </div>
        <AppButton icon={<Plus size={18} />} onClick={() => setModalNovoEvento(true)}>Novo Evento</AppButton>
      </div>

      <div className="eventos-filters glass-panel">
        <div className="filters-grid">
          <AppInput
            placeholder="Pesquisar por título do evento..."
            icon={<Search size={18} />}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
            <AppSelect
              options={[{ value: '', label: 'Todas as Turmas' }, ...turmas.map(t => ({ value: t.id, label: t.nomeTurma || t.nome || `Turma #${t.id}` }))]}
              value={filtroTurma}
              onChange={(val) => setFiltroTurma(String(val))}
              placeholder="Todas as Turmas"
            />
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: '200px' }}>Carregando eventos...</div>
      ) : eventosFiltrados.length === 0 ? (
        <div className="glass-panel empty-state">
          <p>Nenhum evento encontrado.</p>
        </div>
      ) : (
        <div className="eventos-list">
          {eventosFiltrados.map((ev) => (
            <div 
              key={ev.id} 
              className="glass-panel evento-card-horizontal"
              onClick={() => navigate(`/eventos/${ev.id}`)}
            >
              <div className="evento-date-box">
                <span className="month">
                  {ev.dataEvento ? new Date(ev.dataEvento).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase() : '-'}
                </span>
                <span className="day">
                  {ev.dataEvento ? new Date(ev.dataEvento).getDate() : '-'}
                </span>
              </div>
              
              <div className="evento-info-main">
                <h3>{ev.nomeEvento || ev.titulo}</h3>
                <div className="evento-meta">
                  <span className="meta-item">
                    <Calendar size={14} /> 
                    Turma ID: {ev.turmaId}
                  </span>
                  {ev.local && (
                    <span className="meta-item">
                      <MapPin size={14} /> 
                      {ev.local}
                    </span>
                  )}
                </div>
                <p style={{fontSize: '12px', color: '#666', marginTop: '4px'}}>{ev.descricao}</p>
              </div>

              <div className="evento-action">
                <span>Ver Mídias</span>
                <ChevronRight size={18} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Novo Evento */}
      <AppModal
        isOpen={modalNovoEvento}
        onClose={() => setModalNovoEvento(false)}
        title="Agendar Novo Evento"
        footer={
          <>
            <AppButton variant="secondary" onClick={() => setModalNovoEvento(false)}>Cancelar</AppButton>
            <AppButton variant="primary" onClick={handleCriarEvento}>Salvar Evento</AppButton>
          </>
        }
      >
        <div className="modal-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AppSelect
              label="Turma"
              options={turmas.map(t => ({ value: t.id, label: t.nomeTurma || t.nome || `Turma #${t.id}` }))}
              value={formEvento.turmaId}
              onChange={(val) => setFormEvento({...formEvento, turmaId: String(val)})}
              placeholder="Selecione uma turma..."
            />
          <AppInput 
            label="Nome do Evento" 
            placeholder="Ex: Baile de Gala" 
            value={formEvento.nomeEvento} 
            onChange={e => setFormEvento({...formEvento, nomeEvento: e.target.value})} 
          />
          <AppInput 
            label="Data do Evento" 
            type="datetime-local"
            value={formEvento.dataEvento} 
            onChange={e => setFormEvento({...formEvento, dataEvento: e.target.value})} 
          />
          <AppInput 
            label="Local" 
            placeholder="Ex: Salão de Festas XYZ" 
            value={formEvento.local} 
            onChange={e => setFormEvento({...formEvento, local: e.target.value})} 
          />
          <AppInput 
            label="Descrição" 
            value={formEvento.descricao} 
            onChange={e => setFormEvento({...formEvento, descricao: e.target.value})} 
          />
        </div>
      </AppModal>
    </div>
  );
}
