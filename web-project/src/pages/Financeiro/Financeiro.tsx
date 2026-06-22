import { useEffect, useState } from 'react';
import { DollarSign, AlertTriangle, CreditCard, Banknote } from 'lucide-react';
import { api } from '../../api/client';
import { AppButton } from '../../components/AppButton/AppButton';
import { AppInput } from '../../components/AppInput/AppInput';
import { AppSelect } from '../../components/AppSelect/AppSelect';
import { AppModal } from '../../components/AppModal/AppModal';
import './Financeiro.css';

export function Financeiro() {
  const [turmas, setTurmas] = useState<any[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | ''>('');
  
  const [resumo, setResumo] = useState<any>(null);
  const [inadimplentes, setInadimplentes] = useState<any[]>([]);
  const [visaoGeral, setVisaoGeral] = useState<any[]>([]);
  const [formandosDropdown, setFormandosDropdown] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'resumo' | 'visaoGeral' | 'inadimplentes'>('resumo');

  // Modal Gerar Parcelas
  const [modalGerar, setModalGerar] = useState(false);
  const [formGerar, setFormGerar] = useState({ valorTotal: '', quantidadeParcelas: '', dataVencimentoInicial: '' });

  // Modal Baixa Manual
  const [modalBaixa, setModalBaixa] = useState(false);
  const [formBaixa, setFormBaixa] = useState({ formandoId: '', numeroParcela: '', observacao: '' });

  useEffect(() => {
    carregarTurmas();
  }, []);

  useEffect(() => {
    if (turmaSelecionada) {
      carregarDadosTurma(Number(turmaSelecionada));
      // Pré-carrega a lista de formandos para o Select do modal Baixa Manual
      api.financeiroAdmin.visaoGeral(Number(turmaSelecionada))
        .then(res => {
          setFormandosDropdown(res.visaoGeral || []);
          setVisaoGeral(res.visaoGeral || []);
        })
        .catch(err => console.error('Erro ao carregar dropdown de formandos', err));
    } else {
      setResumo(null); setInadimplentes([]); setVisaoGeral([]); setFormandosDropdown([]);
    }
  }, [turmaSelecionada, abaAtiva]);

  const carregarTurmas = async () => {
    try {
      const data = await api.turmas.listar();
      setTurmas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const carregarDadosTurma = async (id: number) => {
    setLoading(true);
    try {
      if (abaAtiva === 'resumo') {
        const res = await api.financeiroAdmin.resumoArrecadacao(id);
        setResumo(res);
      } else if (abaAtiva === 'inadimplentes') {
        const res = await api.financeiroAdmin.listarInadimplentes(id);
        setInadimplentes(Array.isArray(res) ? res : []);
      } else if (abaAtiva === 'visaoGeral') {
        const res = await api.financeiroAdmin.visaoGeral(id);
        setVisaoGeral(res.visaoGeral || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGerarParcelas = async () => {
    if (!turmaSelecionada) return;
    try {
      await api.financeiroAdmin.gerarParcelas(Number(turmaSelecionada), {
        valorTotalPorAluno: Number(formGerar.valorTotal),
        quantidadeDeParcelas: Number(formGerar.quantidadeParcelas),
        dataVencimentoInicial: formGerar.dataVencimentoInicial
      });
      setModalGerar(false);
      carregarDadosTurma(Number(turmaSelecionada));
      setFormGerar({ valorTotal: '', quantidadeParcelas: '', dataVencimentoInicial: '' });
      alert('Parcelas geradas com sucesso!');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erro ao gerar parcelas. (Verifique console para mais detalhes)');
    }
  };

  const handleBaixaManual = async () => {
    if (!formBaixa.formandoId || !formBaixa.numeroParcela) {
      alert('Selecione o formando e a parcela.');
      return;
    }
    try {
      await api.financeiroAdmin.baixaManual(Number(formBaixa.formandoId), Number(formBaixa.numeroParcela), {
        observacao: formBaixa.observacao || 'Baixa manual registrada pela equipe.'
      });
      setModalBaixa(false);
      setFormBaixa({ formandoId: '', numeroParcela: '', observacao: '' });
      if (turmaSelecionada) carregarDadosTurma(Number(turmaSelecionada));
      alert('Baixa manual registrada com sucesso!');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erro ao realizar baixa manual.');
    }
  };

  return (
    <div className="financeiro-container animate-fade-in">
      <div className="page-header">
        <h1>Gestão Financeira</h1>
        <p>Gerencie pagamentos, parcelamentos e inadimplências por turma.</p>
      </div>

      <div className="financeiro-top-actions glass-panel">
        <div className="turma-selector-wrapper">
          <AppSelect 
            label="Selecione a Turma"
            options={turmas.map(t => ({ value: t.id, label: t.nomeTurma || t.nome || `Turma #${t.id}` }))}
            value={turmaSelecionada}
            onChange={(val) => setTurmaSelecionada(Number(val))}
            placeholder="Selecione uma turma para carregar dados..."
          />
        </div>
        
        {turmaSelecionada && (
          <div className="action-buttons">
            <AppButton variant="secondary" onClick={() => setModalBaixa(true)}>Baixa Manual de Pagamento</AppButton>
            <AppButton variant="primary" onClick={() => setModalGerar(true)}>Gerar Parcelas em Lote</AppButton>
          </div>
        )}
      </div>

      {turmaSelecionada && (
        <div className="financeiro-content">
          {visaoGeral && visaoGeral.length > 0 && (visaoGeral[0]?.parcelasPagas + visaoGeral[0]?.parcelasPendentes) > 0 ? (
            <div className="contrato-resumo" style={{ display: 'flex', gap: '32px', background: 'rgba(211, 88, 23, 0.08)', padding: '16px 24px', borderRadius: '12px', border: '1px solid rgba(211, 88, 23, 0.2)', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-primary)', display: 'block', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Valor do Contrato (Por Aluno)</span>
                <strong style={{ fontSize: '20px', color: '#fff' }}>R$ {(visaoGeral[0]?.valorTotalPago + visaoGeral[0]?.valorTotalPendente).toFixed(2)}</strong>
              </div>
              <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-primary)', display: 'block', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Formato Padrão de Parcelamento</span>
                <strong style={{ fontSize: '20px', color: '#fff' }}>
                  {visaoGeral[0]?.parcelasPagas + visaoGeral[0]?.parcelasPendentes}x de R$ {((visaoGeral[0]?.valorTotalPago + visaoGeral[0]?.valorTotalPendente) / (visaoGeral[0]?.parcelasPagas + visaoGeral[0]?.parcelasPendentes || 1)).toFixed(2)}
                </strong>
              </div>
              <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-primary)', display: 'block', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Total de Alunos Matriculados</span>
                <strong style={{ fontSize: '20px', color: '#fff' }}>{visaoGeral.length} formandos</strong>
              </div>
            </div>
          ) : visaoGeral && visaoGeral.length > 0 ? (
            <div className="empty-state text-muted" style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--glass-border)', marginBottom: '24px' }}>
              ℹ️ Nenhuma parcela foi gerada para esta turma ainda. Utilize o botão "Gerar Parcelas em Lote" para iniciar o faturamento.
            </div>
          ) : null}

          <div className="financeiro-tabs">
            <button className={`tab-btn ${abaAtiva === 'resumo' ? 'active' : ''}`} onClick={() => setAbaAtiva('resumo')}>Resumo Arrecadação</button>
            <button className={`tab-btn ${abaAtiva === 'visaoGeral' ? 'active' : ''}`} onClick={() => setAbaAtiva('visaoGeral')}>Visão Geral</button>
            <button className={`tab-btn ${abaAtiva === 'inadimplentes' ? 'active' : ''}`} onClick={() => setAbaAtiva('inadimplentes')}>Inadimplentes</button>
          </div>

          <div className="tab-content glass-panel" style={{ padding: '24px' }}>
            {loading ? (
              <div className="flex-center py-4">Carregando dados financeiros...</div>
            ) : visaoGeral && visaoGeral.length > 0 && (visaoGeral[0]?.parcelasPagas + visaoGeral[0]?.parcelasPendentes) === 0 ? (
              <div className="flex-center py-4 text-muted">Aguardando geração de faturamento para preencher esta aba.</div>
            ) : abaAtiva === 'resumo' && resumo ? (
                <>
                  <div className="resumo-grid" style={{ marginBottom: '32px', padding: 0 }}>
                    <div className="resumo-card">
                      <div className="resumo-icon"><DollarSign size={24} color="var(--color-success)"/></div>
                      <div>
                        <span className="resumo-label">Arrecadação Geral</span>
                        <h3 className="resumo-value">R$ {resumo.totais?.arrecadacaoGeral?.toFixed(2) || '0.00'}</h3>
                      </div>
                    </div>
                    <div className="resumo-card">
                      <div className="resumo-icon"><AlertTriangle size={24} color="var(--color-primary)"/></div>
                      <div>
                        <span className="resumo-label">Total via PIX</span>
                        <h3 className="resumo-value">R$ {resumo.totais?.viaPix?.toFixed(2) || '0.00'}</h3>
                      </div>
                    </div>
                    <div className="resumo-card">
                      <div className="resumo-icon"><CreditCard size={24} color="var(--color-secondary)"/></div>
                      <div>
                        <span className="resumo-label">Total via Cartão</span>
                        <h3 className="resumo-value">R$ {resumo.totais?.viaCartao?.toFixed(2) || '0.00'}</h3>
                      </div>
                    </div>
                    <div className="resumo-card">
                      <div className="resumo-icon"><Banknote size={24} color="var(--color-warning)"/></div>
                      <div>
                        <span className="resumo-label">Total em Espécie (Manual)</span>
                        <h3 className="resumo-value">R$ {resumo.totais?.viaDinheiroManual?.toFixed(2) || '0.00'}</h3>
                      </div>
                    </div>
                  </div>

                  <h3 style={{marginBottom: 16, color: '#fff', fontSize: '18px'}}>Ranking de Arrecadação por Formando</h3>
                  <div className="table-container" style={{ padding: 0 }}>
                    <table className="app-table">
                      <thead>
                        <tr>
                          <th>Formando</th>
                          <th>CPF</th>
                          <th>Parcelas Pagas</th>
                          <th>Total Contribuído</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resumo.formandos?.map((f: any, idx: number) => (
                          <tr key={idx}>
                            <td><strong>{f.nome || `Formando #${f.formandoId}`}</strong></td>
                            <td>{f.cpf || '---'}</td>
                            <td>{f.parcelasPagas}</td>
                            <td style={{color: 'var(--color-success)', fontWeight: 600}}>R$ {f.totalPago?.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
            ) : abaAtiva === 'visaoGeral' && visaoGeral.length > 0 ? (
              <div className="table-container" style={{ padding: 0 }}>
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Formando</th>
                      <th>Status Geral</th>
                      <th>Parcelas</th>
                      <th>Saldos (Pago / Pendente)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visaoGeral.map((vg, idx) => (
                      <tr key={idx}>
                        <td>
                          <strong>{vg.nome || `Formando #${vg.formandoId}`}</strong><br/>
                          <span className="text-muted" style={{fontSize: 12}}>{vg.telefone || 'Sem contato'}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${vg.statusGeral === 'EM DIA' ? 'info' : vg.statusGeral === 'QUITADO' ? 'success' : 'error'}`}>
                            {vg.statusGeral}
                          </span>
                        </td>
                        <td>
                          <span style={{color: 'var(--color-success)'}}>{vg.parcelasPagas} Pagas</span> <br/>
                          {vg.parcelasPendentes > 0 && <span style={{fontSize: 12, color: 'var(--color-primary)'}}>{vg.parcelasPendentes} Pendentes</span>}
                        </td>
                        <td>
                          <strong>R$ {vg.valorTotalPago?.toFixed(2)}</strong> <br/>
                          {vg.valorTotalPendente > 0 && <span style={{fontSize: 12, color: 'var(--color-danger)'}}>R$ {vg.valorTotalPendente?.toFixed(2)} pendente</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : abaAtiva === 'inadimplentes' && inadimplentes.length > 0 ? (
              <div className="inadimplentes-list">
                {inadimplentes.map((ind, idx) => (
                  <div key={idx} className="inadimplente-card" style={{ background: 'rgba(255, 59, 48, 0.05)', padding: 16, borderRadius: 8, marginBottom: 16, borderLeft: '4px solid var(--color-danger)'}}>
                    <div className="flex-between" style={{marginBottom: 12}}>
                      <div>
                        <h4 style={{margin: 0, color: '#fff'}}>{ind.nome}</h4>
                        <span className="text-muted" style={{fontSize: 13}}>{ind.telefone || ind.email}</span>
                      </div>
                      <div style={{textAlign: 'right'}}>
                        <strong style={{color: 'var(--color-danger)', fontSize: 18}}>R$ {ind.valorTotalAtrasado?.toFixed(2)}</strong>
                        <div style={{fontSize: 12, color: '#888'}}>{ind.parcelasAtrasadas} parcelas atrasadas</div>
                      </div>
                    </div>
                    <table className="app-table" style={{background: 'rgba(0,0,0,0.2)'}}>
                      <thead>
                        <tr>
                          <th>Parcela</th>
                          <th>Vencimento</th>
                          <th>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ind.detalhes?.map((det: any, dIdx: number) => (
                          <tr key={dIdx}>
                            <td>Parcela {det.numero}/{det.totalParcelas}</td>
                            <td style={{color: 'var(--color-danger)'}}>{det.vencimento}</td>
                            <td>R$ {det.valor?.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-center py-4 text-muted">Nenhum dado financeiro encontrado para esta aba.</div>
            )}
          </div>
        </div>
      )}

      {/* Modal Gerar Parcelas */}
      <AppModal isOpen={modalGerar} onClose={() => setModalGerar(false)} title="Gerar Parcelas em Lote (Turma)">
        <div className="modal-form-grid">
          <AppInput label="Valor Total do Contrato por Aluno (R$)" type="number" value={formGerar.valorTotal} onChange={e => setFormGerar({...formGerar, valorTotal: e.target.value})} placeholder="Ex: 1500" />
          <AppInput label="Quantidade Total de Parcelas" type="number" value={formGerar.quantidadeParcelas} onChange={e => setFormGerar({...formGerar, quantidadeParcelas: e.target.value})} placeholder="Ex: 12" />
          <AppInput label="Vencimento da 1ª Parcela" type="date" value={formGerar.dataVencimentoInicial} onChange={e => setFormGerar({...formGerar, dataVencimentoInicial: e.target.value})} />
        </div>
        <div className="modal-footer" style={{marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12}}>
          <AppButton variant="secondary" onClick={() => setModalGerar(false)}>Cancelar</AppButton>
          <AppButton variant="primary" onClick={handleGerarParcelas}>Confirmar Geração de Parcelas</AppButton>
        </div>
      </AppModal>

      {/* Modal Baixa Manual */}
      <AppModal isOpen={modalBaixa} onClose={() => setModalBaixa(false)} title="Registrar Baixa Manual (Pix/Espécie Local)">
        <div className="modal-form-grid">
          <div className="app-input-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'transparent', border: 'none' }}>
            <AppSelect 
              label="Selecione o Formando"
              options={formandosDropdown.map(f => ({ value: String(f.formandoId), label: f.nome || `Formando #${f.formandoId}` }))}
              value={formBaixa.formandoId}
              onChange={(val) => setFormBaixa({...formBaixa, formandoId: String(val)})}
              placeholder="Selecione um aluno da lista..."
            />
          </div>
          <AppInput label="Número Exato da Parcela Paga" type="number" value={formBaixa.numeroParcela} onChange={e => setFormBaixa({...formBaixa, numeroParcela: e.target.value})} placeholder="Ex: 3" />
          <AppInput label="Observação / Motivo" placeholder="Ex: Pagamento recebido em espécie na sede" value={formBaixa.observacao} onChange={e => setFormBaixa({...formBaixa, observacao: e.target.value})} />
        </div>
        <p className="text-muted" style={{ fontSize: 12, marginTop: 12 }}>A baixa manual marca a parcela como PAGA independentemente do sistema bancário.</p>
        <div className="modal-footer" style={{marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12}}>
          <AppButton variant="secondary" onClick={() => setModalBaixa(false)}>Cancelar</AppButton>
          <AppButton variant="primary" onClick={handleBaixaManual}>Registrar Pagamento</AppButton>
        </div>
      </AppModal>

    </div>
  );
}
