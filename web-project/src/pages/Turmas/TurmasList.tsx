import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Search, ChevronRight } from 'lucide-react';
import { api } from '../../api/client';
import { AppButton } from '../../components/AppButton/AppButton';
import { AppInput } from '../../components/AppInput/AppInput';
import { AppModal } from '../../components/AppModal/AppModal';
import './Turmas.css';

export function TurmasList() {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  
  const [modalNovaTurma, setModalNovaTurma] = useState(false);
  const [formTurma, setFormTurma] = useState({
    nomeTurma: '',
    curso: '',
    anoFormatura: '',
    codigoAcesso: ''
  });

  useEffect(() => {
    carregarTurmas();
  }, []);

  const carregarTurmas = async () => {
    try {
      setLoading(true);
      const data = await api.turmas.listar();
      setTurmas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      // fallback mock se a api estiver vazia ou com erro
    } finally {
      setLoading(false);
    }
  };

  const handleCriarTurma = async () => {
    try {
      const nomeNormalizado = formTurma.nomeTurma.trim().toLowerCase();
      const nomeExiste = turmas.some(t => 
        (t.nomeTurma || t.nome || '').trim().toLowerCase() === nomeNormalizado
      );

      if (nomeExiste) {
        alert(`A turma "${formTurma.nomeTurma}" já está cadastrada no sistema. Escolha outro nome.`);
        return;
      }

      await api.turmas.criar({
        nomeTurma: formTurma.nomeTurma,
        curso: formTurma.curso,
        anoFormatura: Number(formTurma.anoFormatura),
        codigoAcesso: formTurma.codigoAcesso
      });
      setModalNovaTurma(false);
      setFormTurma({ nomeTurma: '', curso: '', anoFormatura: '', codigoAcesso: '' });
      carregarTurmas();
    } catch (err: any) {
      console.error(err);
      alert('Erro ao criar turma. Verifique se o código possui 5 dígitos ou já existe.');
    }
  };

  const turmasFiltradas = turmas.filter(t => 
    (t.nomeTurma?.toLowerCase() || '').includes(busca.toLowerCase()) ||
    t.codigoAcesso?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="turmas-container animate-fade-in">
      <div className="page-header flex-between">
        <div>
          <h1>Turmas e Formandos</h1>
          <p>Gerencie todas as turmas e acesse a lista de formandos de cada uma.</p>
        </div>
        <AppButton icon={<Plus size={18} />} onClick={() => setModalNovaTurma(true)}>Nova Turma</AppButton>
      </div>

      <div className="turmas-filters glass-panel">
        <AppInput
          placeholder="Pesquisar por nome ou código da turma..."
          icon={<Search size={18} />}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: '200px' }}>Carregando turmas...</div>
      ) : turmasFiltradas.length === 0 ? (
        <div className="glass-panel empty-state">
          <p>Nenhuma turma encontrada.</p>
        </div>
      ) : (
        <div className="turmas-grid">
          {turmasFiltradas.map((turma) => (
            <div 
              key={turma.id} 
              className="glass-panel turma-card"
              onClick={() => navigate(`/turmas/${turma.id}`)}
            >
              <div className="turma-card-header">
                <h3>{turma.nomeTurma || turma.nome}</h3>
                <span className="turma-badge">{turma.codigoAcesso}</span>
              </div>
              <div className="turma-card-body">
                <p><strong>Curso:</strong> {turma.curso || 'Não especificado'}</p>
                <p><strong>Ano de Formatura:</strong> {turma.anoFormatura || '---'}</p>
                <div className="info-row">
                  <Users size={16} className="icon-muted" />
                  <span>{turma._count?.formandos || turma.formandos?.length || 0} formandos</span>
                </div>
              </div>
              <div className="turma-card-footer">
                <span>Ver detalhes</span>
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nova Turma */}
      <AppModal 
        isOpen={modalNovaTurma} 
        onClose={() => setModalNovaTurma(false)} 
        title="Cadastrar Nova Turma"
        footer={
          <>
            <AppButton variant="secondary" onClick={() => setModalNovaTurma(false)}>Cancelar</AppButton>
            <AppButton variant="primary" onClick={handleCriarTurma}>Salvar Turma</AppButton>
          </>
        }
      >
        <div className="modal-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AppInput 
            label="Nome da Turma" 
            placeholder="Ex: Engenharia 2026" 
            value={formTurma.nomeTurma} 
            onChange={(e) => setFormTurma({...formTurma, nomeTurma: e.target.value})} 
          />
          <AppInput 
            label="Curso" 
            placeholder="Ex: Engenharia de Software" 
            value={formTurma.curso} 
            onChange={(e) => setFormTurma({...formTurma, curso: e.target.value})} 
          />
          <AppInput 
            label="Ano de Formatura" 
            type="number"
            placeholder="Ex: 2026" 
            value={formTurma.anoFormatura} 
            onChange={(e) => setFormTurma({...formTurma, anoFormatura: e.target.value})} 
          />
          <AppInput 
            label="Código de Acesso (Exatos 5 dígitos numéricos)" 
            placeholder="Ex: 12345" 
            value={formTurma.codigoAcesso} 
            onChange={(e) => setFormTurma({...formTurma, codigoAcesso: e.target.value})} 
          />
        </div>
      </AppModal>
    </div>
  );
}
