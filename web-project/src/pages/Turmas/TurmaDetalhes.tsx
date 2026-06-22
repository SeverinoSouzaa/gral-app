import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Search, ShieldCheck } from 'lucide-react';
import { api } from '../../api/client';
import { AppButton } from '../../components/AppButton/AppButton';
import { AppInput } from '../../components/AppInput/AppInput';
import { AppModal } from '../../components/AppModal/AppModal';
import './Turmas.css';

export function TurmaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [turma, setTurma] = useState<any>(null);
  const [formandos, setFormandos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  const [modalNovoFormando, setModalNovoFormando] = useState(false);
  const [formFormando, setFormFormando] = useState({
    nome: '', cpf: '', email: '', telefone: '', matricula: '', curso: ''
  });

  const [modalEditarFormando, setModalEditarFormando] = useState(false);
  const [formandoIdSelecionado, setFormandoIdSelecionado] = useState<number | null>(null);
  const [formEditarFormando, setFormEditarFormando] = useState({
    nome: '', cpf: '', email: '', telefone: '', matricula: '', curso: ''
  });

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      // Fetch turmas
      const listaTurmas = await api.turmas.listar();
      const turmaAtual = listaTurmas.find((t: any) => t.id === Number(id));
      if (turmaAtual) setTurma(turmaAtual);

      // Fetch usuarios (formandos)
      const listaUsers = await api.usuariosAdmin.listar();
      const formandosDaTurma = listaUsers.filter((u: any) => {
        const isStudent = u.tipoUsuario === 'STUDENT' || u.tipoUsuario === 'FORMANDO' || !u.tipoUsuario;
        const matchTurmaId = u.turmaId === Number(id) || u.formando?.turmaId === Number(id);
        const matchTurmaNome = u.turma && turmaAtual && u.turma === turmaAtual.nomeTurma;
        return isStudent && (matchTurmaId || matchTurmaNome);
      });
      
      // Buscar os detalhes completos de cada formando para garantir que telefone, email, matricula e curso venham
      const formandosCompletos = await Promise.all(
        formandosDaTurma.map(async (f: any) => {
          try {
            const detalhes = await api.usuariosAdmin.buscarPorId(f.id);
            // Mesclar os dados do endpoint simplificado com os dados completos do detalhe
            return { 
              ...f, 
              ...detalhes,
              matricula: detalhes.formando?.matricula || f.matricula,
              curso: detalhes.formando?.curso || f.curso,
              statusFinanceiro: detalhes.formando?.statusFinanceiro || f.statusFinanceiro
            };
          } catch {
            return f;
          }
        })
      );
      
      setFormandos(formandosCompletos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCriarFormando = async () => {
    try {
      await api.usuariosAdmin.criarFormando({
        ...formFormando,
        turmaId: Number(id)
      });
      setModalNovoFormando(false);
      setFormFormando({ nome: '', cpf: '', email: '', telefone: '', matricula: '', curso: '' });
      carregarDados();
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar formando. Verifique os dados (CPF com 11 dígitos numéricos).');
    }
  };

  const abrirModalEditar = (f: any) => {
    setFormandoIdSelecionado(f.id);
    setFormEditarFormando({
      nome: f.usuario?.nome || f.nome || '',
      cpf: f.usuario?.cpf || f.cpf || '',
      email: f.usuario?.email || f.email || '',
      telefone: f.usuario?.telefone || f.telefone || '',
      matricula: f.matricula || '',
      curso: f.curso || ''
    });
    setModalEditarFormando(true);
  };

  const handleAtualizarFormando = async () => {
    if (!formandoIdSelecionado) return;
    try {
      await api.usuariosAdmin.atualizar(formandoIdSelecionado, {
        ...formEditarFormando
      });
      setModalEditarFormando(false);
      setFormandoIdSelecionado(null);
      carregarDados();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erro ao atualizar formando.');
    }
  };

  if (loading) return <div className="flex-center" style={{minHeight: '50vh'}}>Carregando detalhes...</div>;
  if (!turma) return <div className="flex-center" style={{minHeight: '50vh'}}>Turma não encontrada.</div>;

  const formandosFiltrados = formandos.filter(f => 
    f.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    f.cpf?.includes(busca)
  );

  return (
    <div className="turmas-container animate-fade-in">
      <button className="back-button" onClick={() => navigate('/turmas')}>
        <ArrowLeft size={18} /> Voltar para Turmas
      </button>

      {/* Topo: Detalhes da Turma */}
      <div className="glass-panel turma-detalhes-header">
        <div className="turma-info-main">
          <h1>{turma.nomeTurma || turma.nome}</h1>
          <div className="turma-tags">
            <span className="turma-badge">Código: {turma.codigoAcesso}</span>
            <span className="turma-badge">ID: {turma.id}</span>
            {turma.curso && <span className="turma-badge">Curso: {turma.curso}</span>}
            {turma.anoFormatura && <span className="turma-badge">Ano: {turma.anoFormatura}</span>}
          </div>
        </div>
        <div className="turma-stats">
          <div className="stat-box">
            <span>Total Formandos</span>
            <strong>{formandos.length}</strong>
          </div>
        </div>
      </div>

      {/* Parte Inferior: Lista de Formandos */}
      <div className="turmas-section-title flex-between">
        <h2>Formandos Matriculados</h2>
        <AppButton icon={<UserPlus size={18} />} onClick={() => setModalNovoFormando(true)}>
          Cadastrar Novo Formando
        </AppButton>
      </div>

      <div className="turmas-filters glass-panel">
        <AppInput
          placeholder="Pesquisar formando por nome ou CPF..."
          icon={<Search size={18} />}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="glass-panel table-container">
        <table className="app-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Matrícula</th>
              <th>Curso</th>
              <th>Telefone</th>
              <th>E-mail</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {formandosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">Nenhum formando encontrado.</td>
              </tr>
            ) : (
              formandosFiltrados.map((f: any) => (
                <tr key={f.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar-sm">{(f.usuario?.nome || f.nome || '?').charAt(0)}</div>
                      <span>{f.usuario?.nome || f.nome}</span>
                    </div>
                  </td>
                  <td>{f.usuario?.cpf || f.cpf}</td>
                  <td>{f.matricula || '---'}</td>
                  <td>{f.curso || '---'}</td>
                  <td>{f.usuario?.telefone || f.telefone || '---'}</td>
                  <td>{f.usuario?.email || f.email || '---'}</td>
                  <td><span className={`status-badge ${(f.statusFinanceiro || f.status || 'Ativo').toLowerCase()}`}><ShieldCheck size={14}/> {f.statusFinanceiro || f.status || 'Ativo'}</span></td>
                  <td><button className="btn-link" onClick={() => abrirModalEditar(f)}>Editar</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Novo Formando */}
      <AppModal
        isOpen={modalNovoFormando}
        onClose={() => setModalNovoFormando(false)}
        title="Cadastrar Novo Formando"
        footer={
          <>
            <AppButton variant="secondary" onClick={() => setModalNovoFormando(false)}>Cancelar</AppButton>
            <AppButton variant="primary" onClick={handleCriarFormando}>Salvar Formando</AppButton>
          </>
        }
      >
        <div className="modal-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AppInput 
            label="Nome Completo" 
            value={formFormando.nome} 
            onChange={e => setFormFormando({...formFormando, nome: e.target.value})} 
          />
          <AppInput 
            label="CPF (Apenas números)" 
            value={formFormando.cpf} 
            onChange={e => setFormFormando({...formFormando, cpf: e.target.value.replace(/\D/g, '')})} 
          />
          <AppInput 
            label="E-mail" 
            type="email"
            value={formFormando.email} 
            onChange={e => setFormFormando({...formFormando, email: e.target.value})} 
          />
          <AppInput 
            label="Telefone (Apenas números)" 
            value={formFormando.telefone} 
            onChange={e => setFormFormando({...formFormando, telefone: e.target.value.replace(/\D/g, '')})} 
          />
          <AppInput 
            label="Matrícula" 
            value={formFormando.matricula} 
            onChange={e => setFormFormando({...formFormando, matricula: e.target.value})} 
          />
          <AppInput 
            label="Curso" 
            value={formFormando.curso} 
            onChange={e => setFormFormando({...formFormando, curso: e.target.value})} 
          />
        </div>
      </AppModal>

      {/* Modal Editar Formando */}
      <AppModal
        isOpen={modalEditarFormando}
        onClose={() => setModalEditarFormando(false)}
        title="Editar Formando"
        footer={
          <>
            <AppButton variant="secondary" onClick={() => setModalEditarFormando(false)}>Cancelar</AppButton>
            <AppButton variant="primary" onClick={handleAtualizarFormando}>Salvar Alterações</AppButton>
          </>
        }
      >
        <div className="modal-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AppInput 
            label="Nome Completo" 
            value={formEditarFormando.nome} 
            onChange={e => setFormEditarFormando({...formEditarFormando, nome: e.target.value})} 
          />
          <AppInput 
            label="CPF (Apenas números)" 
            value={formEditarFormando.cpf} 
            onChange={e => setFormEditarFormando({...formEditarFormando, cpf: e.target.value.replace(/\D/g, '')})} 
          />
          <AppInput 
            label="E-mail" 
            type="email"
            value={formEditarFormando.email} 
            onChange={e => setFormEditarFormando({...formEditarFormando, email: e.target.value})} 
          />
          <AppInput 
            label="Telefone (Apenas números)" 
            value={formEditarFormando.telefone} 
            onChange={e => setFormEditarFormando({...formEditarFormando, telefone: e.target.value.replace(/\D/g, '')})} 
          />
          <AppInput 
            label="Matrícula" 
            value={formEditarFormando.matricula} 
            onChange={e => setFormEditarFormando({...formEditarFormando, matricula: e.target.value})} 
          />
          <AppInput 
            label="Curso" 
            value={formEditarFormando.curso} 
            onChange={e => setFormEditarFormando({...formEditarFormando, curso: e.target.value})} 
          />
        </div>
      </AppModal>
    </div>
  );
}
