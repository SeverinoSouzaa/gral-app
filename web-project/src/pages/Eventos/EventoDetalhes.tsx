import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ImagePlus, MapPin, Calendar, Clock, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import { AppButton } from '../../components/AppButton/AppButton';
import { AppModal } from '../../components/AppModal/AppModal';
import { AppInput } from '../../components/AppInput/AppInput';
import './Eventos.css';

export function EventoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<any>(null);
  const [midias, setMidias] = useState<any[]>([]);
  const [presencas, setPresencas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States para Edição e Exclusão
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTipo, setUploadTipo] = useState<'foto' | 'video'>('foto');
  const [isUploading, setIsUploading] = useState(false);
  const [formEditar, setFormEditar] = useState({
    nomeEvento: '', dataEvento: '', local: '', descricao: ''
  });

  useEffect(() => {
    carregarDetalhes();
  }, [id]);

  const carregarDetalhes = async () => {
    try {
      setLoading(true);
      const [dadosEvento, listaMidias, relatorioPresencas] = await Promise.all([
        api.eventosAdmin.buscarPorId(Number(id)),
        api.midiasAdmin.listarPorEvento(Number(id)).catch(() => []),
        api.eventosAdmin.listarPresencas(Number(id)).catch(() => ({ presencas: [] }))
      ]);
      setEvento(dadosEvento);
      
      // Ajuste de fuso para o input datetime-local (remove o 'Z' final e ajusta para local)
      let dataFormatada = '';
      if (dadosEvento.dataEvento) {
        const d = new Date(dadosEvento.dataEvento);
        dataFormatada = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      }

      setFormEditar({
        nomeEvento: dadosEvento.titulo || '',
        dataEvento: dataFormatada,
        local: dadosEvento.local || '',
        descricao: dadosEvento.descricao || ''
      });
      setMidias(Array.isArray(listaMidias) ? listaMidias : []);
      setPresencas(relatorioPresencas?.presencas || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex-center" style={{minHeight: '50vh'}}>Carregando...</div>;
  if (!evento) return <div className="flex-center" style={{minHeight: '50vh'}}>Evento não encontrado.</div>;

  const handleAtualizar = async () => {
    try {
      const payload: any = {
        nomeEvento: formEditar.nomeEvento,
        local: formEditar.local,
        descricao: formEditar.descricao,
      };
      if (formEditar.dataEvento) {
        payload.dataEvento = new Date(formEditar.dataEvento).toISOString();
      }

      await api.eventosAdmin.atualizar(Number(id), payload);
      setModalEditar(false);
      carregarDetalhes();
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar evento.');
    }
  };

  const handleExcluir = async () => {
    try {
      await api.eventosAdmin.remover(Number(id));
      navigate('/eventos');
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir evento.');
    }
  };

  const handleUploadMidia = async () => {
    if (!uploadFile) {
      alert('Selecione um arquivo primeiro.');
      return;
    }
    try {
      setIsUploading(true);
      await api.midiasAdmin.uploadArquivo(Number(id), uploadTipo, uploadFile);
      setModalUpload(false);
      setUploadFile(null);
      carregarDetalhes();
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer upload da mídia.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoverMidia = async (midiaId: number) => {
    if (window.confirm('Tem certeza que deseja remover esta mídia permanentemente da galeria dos alunos?')) {
      try {
        await api.midiasAdmin.excluir(midiaId);
        carregarDetalhes();
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir mídia.');
      }
    }
  };

  return (
    <div className="eventos-container animate-fade-in">
      <button className="back-button" onClick={() => navigate('/eventos')}>
        <ArrowLeft size={18} /> Voltar para Eventos
      </button>

      {/* Topo: Detalhes do Evento */}
      <div className="glass-panel evento-detalhes-header" style={{ position: 'relative' }}>
        
        {/* Ações Discretas */}
        <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: '8px' }}>
            <AppButton size="sm" variant="secondary" onClick={() => setModalEditar(true)}>
                <Edit2 size={14} /> Editar
            </AppButton>
            <AppButton size="sm" variant="danger" onClick={() => setModalExcluir(true)}>
                <Trash2 size={14} /> Excluir
            </AppButton>
        </div>

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
        <AppButton icon={<ImagePlus size={18} />} onClick={() => setModalUpload(true)}>Subir Mídia</AppButton>
      </div>

      <div className="midias-grid">
        {midias.length === 0 ? (
          <div className="glass-panel empty-state" style={{ gridColumn: '1 / -1', minHeight: '200px' }}>
            <p>Nenhuma mídia enviada para este evento ainda.</p>
          </div>
        ) : (
          midias.map((midia) => (
            <div key={midia.id} className="midia-card glass-panel" style={{ overflow: 'hidden' }}>
              {midia.tipo === 'VIDEO' ? (
                <div className="midia-video-placeholder flex-center" style={{ backgroundColor: 'rgba(255,255,255,0.05)', flex: 1, padding: 30 }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>Vídeo</span>
                </div>
              ) : (
                <img 
                  src={`${api.getBaseUrl()}/uploads/midias/${midia.arquivo}`} 
                  alt="Mídia do Evento" 
                  className="midia-img" 
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x180?text=Indispon%C3%ADvel'; }}
                />
              )}
              <div className="midia-info" style={{ padding: '12px' }}>
                <button className="btn-link danger" onClick={() => handleRemoverMidia(midia.id)}>Remover</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Relatório de Presenças */}
      <div className="eventos-section-title" style={{ marginTop: '32px' }}>
        <h2>Relatório de Presenças</h2>
        <p>Acompanhe a lista de formandos e suas confirmações para este evento.</p>
      </div>

      <div className="glass-panel table-container">
        {presencas.length === 0 ? (
          <div className="flex-center py-4 text-muted">Nenhum formando encontrado para a turma deste evento.</div>
        ) : (
          <table className="app-table">
            <thead>
              <tr>
                <th>Formando</th>
                <th style={{ textAlign: 'right' }}>Status da Presença</th>
              </tr>
            </thead>
            <tbody>
              {presencas.map((p: any) => (
                <tr key={p.formandoId}>
                  <td>
                    <div className="user-cell">
                      <strong>{p.nome}</strong>
                      <span className="text-muted" style={{fontSize: '12px'}}>{p.email}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={`status-badge ${p.status === 'PENDENTE' ? 'pendente' : p.status === 'CONFIRMADO' ? 'aprovado' : 'rejeitado'}`}>
                      {p.status === 'PENDENTE' ? 'Aguardando' : p.status === 'CONFIRMADO' ? 'Confirmado' : 'Ausente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Editar */}
      <AppModal
        isOpen={modalEditar}
        onClose={() => setModalEditar(false)}
        title="Editar Evento"
        footer={
          <>
            <AppButton variant="secondary" onClick={() => setModalEditar(false)}>Cancelar</AppButton>
            <AppButton variant="primary" onClick={handleAtualizar}>Salvar Alterações</AppButton>
          </>
        }
      >
        <div className="modal-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AppInput 
            label="Nome do Evento" 
            value={formEditar.nomeEvento} 
            onChange={e => setFormEditar({...formEditar, nomeEvento: e.target.value})} 
          />
          <AppInput 
            label="Data do Evento" 
            type="datetime-local"
            value={formEditar.dataEvento} 
            onChange={e => setFormEditar({...formEditar, dataEvento: e.target.value})} 
          />
          <AppInput 
            label="Local" 
            value={formEditar.local} 
            onChange={e => setFormEditar({...formEditar, local: e.target.value})} 
          />
          <AppInput 
            label="Descrição" 
            value={formEditar.descricao} 
            onChange={e => setFormEditar({...formEditar, descricao: e.target.value})} 
          />
        </div>
      </AppModal>

      {/* Modal Excluir */}
      <AppModal
        isOpen={modalExcluir}
        onClose={() => setModalExcluir(false)}
        title="Excluir Evento"
        footer={
          <>
            <AppButton variant="secondary" onClick={() => setModalExcluir(false)}>Cancelar</AppButton>
            <AppButton variant="danger" onClick={handleExcluir}>Sim, Excluir</AppButton>
          </>
        }
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <p style={{ color: 'var(--color-text-primary)', fontSize: '16px', marginBottom: '8px' }}>
            Tem certeza que deseja excluir o evento <strong>{evento.titulo}</strong>?
          </p>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            Esta ação removerá o evento para todos os formandos desta turma e não pode ser desfeita.
          </p>
        </div>
      </AppModal>

      {/* Modal Subir Mídia */}
      <AppModal
        isOpen={modalUpload}
        onClose={() => !isUploading && setModalUpload(false)}
        title="Subir Nova Mídia"
        footer={
          <>
            <AppButton variant="secondary" onClick={() => setModalUpload(false)} disabled={isUploading}>Cancelar</AppButton>
            <AppButton variant="primary" onClick={handleUploadMidia} disabled={isUploading || !uploadFile}>
              {isUploading ? 'Enviando...' : 'Fazer Upload'}
            </AppButton>
          </>
        }
      >
        <div className="modal-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="app-input-label" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Tipo de Mídia</label>
            <select 
              className="app-input" 
              value={uploadTipo} 
              onChange={(e) => setUploadTipo(e.target.value as 'foto' | 'video')}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '15px' }}
            >
              <option value="foto" style={{color: '#000'}}>Foto / Imagem</option>
              <option value="video" style={{color: '#000'}}>Vídeo</option>
            </select>
          </div>
          <div>
            <label className="app-input-label" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Arquivo</label>
            <div style={{ border: '1px dashed rgba(255,255,255,0.2)', padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <input 
                type="file" 
                accept={uploadTipo === 'foto' ? 'image/png, image/jpeg, image/jpg' : 'video/mp4, video/quicktime'}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setUploadFile(e.target.files[0]);
                  }
                }}
                style={{ width: '100%', color: '#fff' }}
              />
            </div>
          </div>
          <p className="text-muted" style={{fontSize: '12px'}}>
            Tamanho máximo suportado: 50MB. A mídia ficará imediatamente disponível para a turma no aplicativo na aba 'Mídias'.
          </p>
        </div>
      </AppModal>

    </div>
  );
}
