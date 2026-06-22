import { useEffect, useState } from 'react';
import { FileText, Eye, CheckCircle, XCircle, Search } from 'lucide-react';
import { api } from '../../api/client';
import { AppButton } from '../../components/AppButton/AppButton';
import { AppModal } from '../../components/AppModal/AppModal';
import { AppInput } from '../../components/AppInput/AppInput';
import './Documentos.css';

const TIPOS_DOC_NOME = {
  FRAME_PHOTO: 'Foto do Quadro',
  IDENTITY_DOC: 'Documento de Identidade',
  INVITATION_PHOTO: 'Foto do Convite',
  CAP_NAME: 'Nome no Canudo (Texto)'
};

const API_UPLOADS_URL = 'https://gral-api.onrender.com/uploads/documentos/';

type TabType = 'PENDENTE' | 'APROVADO' | 'REJEITADO';

export function DocumentosList() {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('PENDENTE');
  
  // Modais State
  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [modalRejeitar, setModalRejeitar] = useState(false);
  const [docSelecionado, setDocSelecionado] = useState<any>(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState('');

  useEffect(() => {
    carregarDocumentos();
  }, []);

  const carregarDocumentos = async () => {
    try {
      setLoading(true);
      const data = await api.documentosAdmin.listarTodos();
      setDocumentos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id: number) => {
    try {
      await api.documentosAdmin.aprovar(id);
      carregarDocumentos(); // Recarrega lista
    } catch (err) {
      console.error(err);
      alert('Erro ao aprovar documento.');
    }
  };

  const handleRejeitar = async () => {
    if (!docSelecionado || !motivoRejeicao) {
      alert('Preencha o motivo da rejeição.');
      return;
    }
    try {
      await api.documentosAdmin.rejeitar(docSelecionado.id, motivoRejeicao);
      setModalRejeitar(false);
      setMotivoRejeicao('');
      carregarDocumentos();
    } catch (err) {
      console.error(err);
      alert('Erro ao rejeitar documento.');
    }
  };

  const openVisualizar = (doc: any) => {
    setDocSelecionado(doc);
    setModalVisualizar(true);
  };

  const openRejeitar = (doc: any) => {
    setDocSelecionado(doc);
    setModalRejeitar(true);
  };

  const docsFiltrados = documentos.filter(doc => {
    const isSameTab = doc.status === activeTab;
    const nomeFormando = doc.formando?.usuario?.nome || '';
    const cpfFormando = doc.formando?.usuario?.cpf || '';
    const nomeTurma = doc.formando?.turma?.nomeTurma || '';
    
    const termo = busca.toLowerCase();
    const matchBusca = nomeFormando.toLowerCase().includes(termo) || 
                       cpfFormando.includes(termo) || 
                       nomeTurma.toLowerCase().includes(termo);
                       
    return isSameTab && matchBusca;
  });

  return (
    <div className="documentos-container animate-fade-in">
      <div className="page-header">
        <h1>Gestão de Documentos</h1>
        <p>Aprove, rejeite e consulte os documentos e informações enviados pelos formandos.</p>
      </div>

      {/* Barra de Pesquisa e Abas */}
      <div className="documentos-toolbar glass-panel flex-between">
        <div className="tabs-container">
          <button className={`tab-btn ${activeTab === 'PENDENTE' ? 'active' : ''}`} onClick={() => setActiveTab('PENDENTE')}>
            Pendentes
          </button>
          <button className={`tab-btn ${activeTab === 'APROVADO' ? 'active' : ''}`} onClick={() => setActiveTab('APROVADO')}>
            Aprovados
          </button>
          <button className={`tab-btn ${activeTab === 'REJEITADO' ? 'active' : ''}`} onClick={() => setActiveTab('REJEITADO')}>
            Rejeitados
          </button>
        </div>
        
        <div style={{ flex: 1, maxWidth: '400px' }}>
          <AppInput
            placeholder="Buscar por Nome, CPF ou Turma..."
            icon={<Search size={18} />}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel table-container">
        {loading ? (
          <div className="flex-center py-4">Carregando documentos...</div>
        ) : docsFiltrados.length === 0 ? (
          <div className="flex-center py-4 text-muted">Nenhum documento encontrado para esta categoria.</div>
        ) : (
          <table className="app-table">
            <thead>
              <tr>
                <th>Tipo de Documento</th>
                <th>Formando</th>
                <th>Turma</th>
                <th>Data de Envio</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {docsFiltrados.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div className="doc-tipo-cell">
                      <FileText size={18} className="icon-muted" />
                      <span>{TIPOS_DOC_NOME[doc.tipoDocumento as keyof typeof TIPOS_DOC_NOME] || doc.tipoDocumento}</span>
                    </div>
                  </td>
                  <td>
                    <div className="user-cell">
                      <strong>{doc.formando?.usuario?.nome || `Formando #${doc.formandoId}`}</strong>
                      <span className="text-muted" style={{fontSize: '12px'}}>{doc.formando?.usuario?.cpf}</span>
                    </div>
                  </td>
                  <td>{doc.formando?.turma?.nomeTurma || '---'}</td>
                  <td>{new Date(doc.dataEnvio).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <span className={`status-badge ${doc.status.toLowerCase()}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="doc-actions">
                      <AppButton size="sm" variant="secondary" onClick={() => openVisualizar(doc)}>
                        <Eye size={14} /> Visualizar
                      </AppButton>
                      {doc.status === 'PENDENTE' && (
                        <>
                          <AppButton size="sm" variant="primary" onClick={() => handleAprovar(doc.id)}>
                            <CheckCircle size={14} />
                          </AppButton>
                          <AppButton size="sm" variant="danger" onClick={() => openRejeitar(doc)}>
                            <XCircle size={14} />
                          </AppButton>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Visualizar Conteúdo/Imagem */}
      <AppModal 
        isOpen={modalVisualizar} 
        onClose={() => setModalVisualizar(false)}
        title={`Visualizar: ${docSelecionado ? (TIPOS_DOC_NOME[docSelecionado.tipoDocumento as keyof typeof TIPOS_DOC_NOME] || docSelecionado.tipoDocumento) : ''}`}
        maxWidth="700px"
      >
        <div className="doc-preview-container">
          {docSelecionado?.tipoDocumento === 'CAP_NAME' || docSelecionado?.nomeArquivo === 'TEXTO_APENAS' ? (
            <div className="text-preview">
              <h3>Texto Preenchido pelo Formando:</h3>
              <p className="conteudo-destaque">{docSelecionado.valorConteudo || 'Nenhum texto informado.'}</p>
            </div>
          ) : docSelecionado?.nomeArquivo ? (
            <div className="image-preview-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <a 
                href={`${API_UPLOADS_URL}${docSelecionado.nomeArquivo}`} 
                target="_blank" 
                rel="noopener noreferrer"
                title="Clique para ver a imagem em tamanho e qualidade originais"
              >
                <img 
                  src={`${API_UPLOADS_URL}${docSelecionado.nomeArquivo}`} 
                  alt="Documento" 
                  className="doc-preview-img"
                  style={{ cursor: 'zoom-in', border: '1px solid rgba(255,255,255,0.1)' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Imagem+Indispon%C3%ADvel';
                  }}
                />
              </a>
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <a 
                  href={`${API_UPLOADS_URL}${docSelecionado.nomeArquivo}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="app-btn primary"
                  style={{ textDecoration: 'none', display: 'inline-flex', padding: '10px 20px', borderRadius: '6px', fontWeight: 600 }}
                >
                  Abrir Imagem em Alta Qualidade (Nova Aba)
                </a>
                <p className="text-muted" style={{textAlign: 'center', fontSize: '12px'}}>
                  Ao abrir em nova aba, você pode visualizar os detalhes originais ou clicar com botão direito para Salvar.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-center py-4 text-muted">Arquivo não encontrado.</div>
          )}
        </div>
      </AppModal>

      {/* Modal Rejeitar */}
      <AppModal
        isOpen={modalRejeitar}
        onClose={() => setModalRejeitar(false)}
        title="Rejeitar Documento"
        footer={
          <>
            <AppButton variant="secondary" onClick={() => setModalRejeitar(false)}>Cancelar</AppButton>
            <AppButton variant="danger" onClick={handleRejeitar}>Confirmar Rejeição</AppButton>
          </>
        }
      >
        <div className="rejeicao-form">
          <p className="text-muted" style={{marginBottom: 16}}>
            Informe o motivo da rejeição. O formando receberá uma notificação no aplicativo com esse exato motivo para poder corrigir e reenviar.
          </p>
          <AppInput 
            label="Motivo da Rejeição"
            placeholder="Ex: Documento ilegível, enviar novamente. Ou: Nome com erros de digitação."
            value={motivoRejeicao}
            onChange={(e) => setMotivoRejeicao(e.target.value)}
          />
        </div>
      </AppModal>
    </div>
  );
}
