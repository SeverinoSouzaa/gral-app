import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { api } from '../../services/api';
import { COLORS } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import BackgroundLayout from '../../components/BackgroundLayout';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface Parcela {
  id: string;
  numero: number;
  totalParcelas: number;
  vencimento: string;
  valor: number;
  status: 'pendente' | 'pago';
  dataPagamento?: string;
}

interface DadosFinanceiros {
  resumo: {
    statusAtual: string;
    parcelasPagas: number;
    totalParcelas: number;
    totalPago: number;
    totalPendente: number;
  };
  pendentes: Parcela[];
  historico: Parcela[];
}

export default function PagamentosScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused(); // Para recarregar quando voltar do Checkout

  const [abaAtiva, setAbaAtiva] = useState<'pendentes' | 'historico'>('pendentes');
  const [dados, setDados] = useState<DadosFinanceiros | null>(null);
  const [loading, setLoading] = useState(true);

  const { textMultiplier, isHighContrast } = useAccessibility();

  useEffect(() => {
    if (isFocused) {
      carregarDadosFinanceiros();
    }
  }, [isFocused]);

  const carregarDadosFinanceiros = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) return;

      const data = await api.finance.getResumo(token);
      setDados(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os dados financeiros.');
    } finally {
      setLoading(false);
    }
  };

  const parcelasPendentes = dados ? dados.pendentes : [];
  const parcelasPagas = dados ? dados.historico : [];
  const resumo = dados ? dados.resumo : null;

  // Calcula a porcentagem da barra de progresso (Ex: 2 de 10 = 20%)
  const progresso = resumo && resumo.totalParcelas > 0
    ? (resumo.parcelasPagas / resumo.totalParcelas) * 100
    : 0;

  return (
    <BackgroundLayout>
      <View style={styles.container}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: 16 * textMultiplier }]}>Pagamentos</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* CARD RESUMO */}
            <View style={[globalStyles.card, styles.summaryCard, isHighContrast && { backgroundColor: '#111', borderColor: COLORS.primary }]}>
              <View style={styles.statusRow}>
                <Text style={[styles.summaryLabel, { fontSize: 13 * textMultiplier }]}>Status atual:</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={[styles.statusText, { fontSize: 14 * textMultiplier }]}>
                    {resumo ? resumo.statusAtual : 'Carregando...'}
                  </Text>
                </View>
              </View>

              <View style={styles.progressHeader}>
                <Text style={styles.summaryLabel}>Contribuição</Text>
                <Text style={styles.summaryLabel}>
                  {resumo ? resumo.parcelasPagas : 0}/{resumo ? resumo.totalParcelas : 0} parcelas
                </Text>
              </View>
              
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${progresso}%` }]} />
              </View>

              <View style={styles.totalsRow}>
                <View>
                  <Text style={[styles.summaryLabel, { fontSize: 13 * textMultiplier }]}>Total pago</Text>
                  <Text style={[styles.totalsValue, { fontSize: 16 * textMultiplier }]}>R$ {resumo ? resumo.totalPago.toFixed(2) : '0.00'}</Text>
                </View>
                <View>
                  <Text style={[styles.summaryLabel, { fontSize: 13 * textMultiplier }]}>Pendente</Text>
                  <Text style={[styles.totalsValue, { fontSize: 16 * textMultiplier }]}>R$ {resumo ? resumo.totalPendente.toFixed(2) : '0.00'}</Text>
                </View>
              </View>
            </View>

            {/* SELETOR DE ABAS (TABS) */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity 
                style={styles.tabButton} 
                activeOpacity={0.8}
                onPress={() => setAbaAtiva('pendentes')}
              >
                {abaAtiva === 'pendentes' ? (
                  <LinearGradient colors={COLORS.buttonGradient as [string, string]} style={styles.activeTabBg}>
                    <Text style={[styles.activeTabText, { fontSize: 14 * textMultiplier }]}>Pendentes ({parcelasPendentes.length})</Text>
                  </LinearGradient>
                ) : (
                  <Text style={[styles.inactiveTabText, { fontSize: 14 * textMultiplier }]}>Pendentes</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.tabButton} 
                activeOpacity={0.8}
                onPress={() => setAbaAtiva('historico')}
              >
                {abaAtiva === 'historico' ? (
                  <LinearGradient colors={COLORS.buttonGradient as [string, string]} style={styles.activeTabBg}>
                    <Text style={[styles.activeTabText, { fontSize: 14 * textMultiplier }]}>Histórico ({parcelasPagas.length})</Text>
                  </LinearGradient>
                ) : (
                  <Text style={[styles.inactiveTabText, { fontSize: 14 * textMultiplier }]}>Histórico</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* LISTA DE PARCELAS */}
            <View style={styles.listContainer}>
              {abaAtiva === 'pendentes' ? (
                parcelasPendentes.length === 0 ? (
                  <Text style={{color: COLORS.textLight, textAlign: 'center'}}>Nenhuma parcela pendente.</Text>
                ) : (
                  parcelasPendentes.map((parcela) => (
                    <View key={parcela.id} style={[globalStyles.card, styles.parcelaCard, isHighContrast && { backgroundColor: '#111', borderColor: COLORS.primary }]}>
                      <View style={styles.parcelaHeader}>
                        <View>
                          <Text style={[styles.parcelaTitle, { fontSize: 14 * textMultiplier }]}>
                            Parcela {parcela.numero}/{parcela.totalParcelas}
                          </Text>
                          <Text style={[styles.parcelaSubtitle, { fontSize: 12 * textMultiplier }]}>
                            Vencimento: {parcela.vencimento}
                          </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={[styles.parcelaValor, { fontSize: 14 * textMultiplier }]}>R$ {parcela.valor.toFixed(2)}</Text>
                          <View style={styles.statusBadgeRow}>
                            <Feather name="clock" size={12} color={COLORS.primary} style={{ marginRight: 4 }} />
                            <Text style={[styles.statusPendenteText, { fontSize: 12 * textMultiplier }]}>Pendente</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.actionRow}>
                        <TouchableOpacity 
                          style={{ flex: 1, marginRight: 12 }} 
                          activeOpacity={0.8}
                          onPress={() => navigation.navigate('Checkout', { parcela })}
                        >
                          <LinearGradient colors={COLORS.buttonGradient as [string, string]} style={styles.payButton}>
                            <Text style={styles.payButtonText}>Pagar agora</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )
              ) : (
                parcelasPagas.length === 0 ? (
                  <Text style={{color: COLORS.textLight, textAlign: 'center'}}>Nenhuma parcela paga ainda.</Text>
                ) : (
                  parcelasPagas.map((parcela) => (
                    <View key={parcela.id} style={[globalStyles.card, styles.parcelaCard, isHighContrast && { backgroundColor: '#111', borderColor: COLORS.primary }]}>
                      <View style={styles.parcelaHeader}>
                        <View>
                          <Text style={[styles.parcelaTitle, { fontSize: 14 * textMultiplier }]}>
                            Parcela {parcela.numero}/{parcela.totalParcelas}
                          </Text>
                          <Text style={[styles.parcelaSubtitle, { fontSize: 12 * textMultiplier }]}>
                            Pago em: {parcela.dataPagamento}
                          </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={[styles.parcelaValor, { fontSize: 14 * textMultiplier }]}>R$ {parcela.valor.toFixed(2)}</Text>
                          <View style={styles.statusBadgeRow}>
                            <Feather name="check-circle" size={12} color="#4CAF50" style={{ marginRight: 4 }} />
                            <Text style={[styles.statusPagoText, { fontSize: 12 * textMultiplier }]}>Pago</Text>
                          </View>
                        </View>
                      </View>

                      <TouchableOpacity style={styles.downloadButton} activeOpacity={0.8}>
                        <Feather name="download" size={16} color={COLORS.primary} style={{ marginRight: 8 }} />
                        <Text style={styles.downloadButtonText}>Baixar comprovante</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: -30, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, marginTop: 8 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.03)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', marginRight: 16 },
  headerTitle: { fontFamily: 'Inter_400Regular', fontSize: 16, color: COLORS.white },
  summaryCard: { marginBottom: 24 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  statusBadge: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4CAF50', marginRight: 6 },
  statusText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#4CAF50' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textLight },
  progressBarBackground: { height: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2, marginBottom: 20 },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalsValue: { fontFamily: 'Inter_400Regular', fontSize: 16, color: COLORS.white, marginTop: 4 },
  tabsContainer: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12, padding: 4, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  tabButton: { flex: 1, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  activeTabBg: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  activeTabText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#000' },
  inactiveTabText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textLight },
  listContainer: { gap: 16 },
  parcelaCard: { padding: 16 },
  parcelaHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  parcelaTitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.white, marginBottom: 4 },
  parcelaSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textLight },
  parcelaValor: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.white, marginBottom: 4 },
  statusBadgeRow: { flexDirection: 'row', alignItems: 'center' },
  statusPendenteText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.primary },
  statusPagoText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#4CAF50' },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  payButton: { height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  payButtonText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#000' },
  downloadButton: { flexDirection: 'row', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(221, 130, 65, 0.3)', backgroundColor: 'rgba(221, 130, 65, 0.05)' },
  downloadButtonText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.primary }
});
