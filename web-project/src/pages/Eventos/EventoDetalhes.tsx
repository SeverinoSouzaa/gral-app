import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ImagePlus, MapPin, Calendar, Clock } from 'lucide-react';
import { api } from '../../api/client';
import { AppButton } from '../../components/AppButton/AppButton';
import './Eventos.css';

export function EventoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<any>(null);
  const [midias, setMidias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDetalhes();
  }, [id]);

  const carregarDetalhes = async () => {
    try {
      setLoading(true);
      const [dadosEvento, listaMidias] = await Promise.all([
        api.eventosAdmin.buscarPorId(Number(id)),
        api.midiasAdmin.listarPorEvento(Number(id)).catch(() => [])
      ]);
      setEvento(dadosEvento);
      setMidias(Array.isArray(listaMidias) ? listaMidias : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex-center" style={{minHeight: '50vh'}}>Carregando...</div>;
  if (!evento) return <div className="flex-center" style={{minHeight: '50vh'}}>Evento não encontrado.</div>;

  return (
    <div className="eventos-container animate-fade-in">
      <button className="back-button" onClick={() => navigate('/eventos')}>
        <ArrowLeft size={18} /> Voltar para Eventos
      </button>

      {/* Topo: Detalhes do Evento */}
      <div className="glass-panel evento-detalhes-header">
        <div className="evento-header-content">
          <div className="evento-badge-turma">Turma ID: {evento.turmaId}</div>
          <h1>{evento.titulo}</h1>
          <p className="evento-desc">{evento.descricao || 'Sem descrição'}</p>
          
          <div className="evento-meta-grid">
            {evento.dataEvento && (
              <div className="meta-info">
                <Calendar size={16} />
                <span>Data: {new Date(evento.dataEvento).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
            {evento.hora && (
              <div className="meta-info">
                <Clock size={16} />
                <span>Horário: {evento.hora}</span>
              </div>
            )}
            {evento.local && (
              <div className="meta-info">
                <MapPin size={16} />
                <span>Local: {evento.local}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Galeria de Mídias */}
      <div className="eventos-section-title flex-between">
        <div>
          <h2>Galeria de Mídias</h2>
          <p>Fotos e vídeos deste evento (Visível para os formandos da turma)</p>
        </div>
        <AppButton icon={<ImagePlus size={18} />}>Subir Mídia</AppButton>
      </div>

      <div className="midias-grid">
        {midias.length === 0 ? (
          <div className="glass-panel empty-state" style={{ gridColumn: '1 / -1', minHeight: '200px' }}>
            <p>Nenhuma mídia enviada para este evento ainda.</p>
          </div>
        ) : (
          midias.map((midia) => (
            <div key={midia.id} className="midia-card glass-panel">
              {midia.tipo === 'VIDEO' ? (
                <div className="midia-video-placeholder flex-center">
                  <span>Vídeo</span>
                </div>
              ) : (
                <img src={midia.url} alt="Mídia do Evento" className="midia-img" />
              )}
              <div className="midia-info">
                <button className="btn-link danger">Remover</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
