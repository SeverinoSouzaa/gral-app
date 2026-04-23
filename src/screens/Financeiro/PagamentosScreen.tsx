import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import BackgroundLayout from '../../components/BackgroundLayout';

// "Contrato" Atualizado: Adicionamos a data de pagamento
interface Parcela {
  id: string;
  numero: number;
  totalParcelas: number;
  vencimento: string;
  valor: number;
  status: 'pendente' | 'pago';
  dataPagamento?: string; // Opcional, pois as pendentes não têm
}

// MOCK: Parcelas Pendentes
const PARCELAS_PENDENTES: Parcela[] = [
  { id: '8', numero: 8, totalParcelas: 12, vencimento: '05/08/2024', valor: 75.00, status: 'pendente' },
  { id: '9', numero: 9, totalParcelas: 12, vencimento: '05/09/2024', valor: 75.00, status: 'pendente' },
  { id: '10', numero: 10, totalParcelas: 12, vencimento: '05/10/2024', valor: 75.00, status: 'pendente' },
  { id: '11', numero: 11, totalParcelas: 12, vencimento: '05/11/2024', valor: 75.00, status: 'pendente' },
  { id: '12', numero: 12, totalParcelas: 12, vencimento: '05/12/2024', valor: 75.00, status: 'pendente' },
];

// MOCK: Parcelas Pagas (Histórico)
const PARCELAS_PAGAS: Parcela[] = [
  { id: '1', numero: 1, totalParcelas: 12, vencimento: '05/01/2024', valor: 75.00, status: 'pago', dataPagamento: '04/01/2024' },
  { id: '2', numero: 2, totalParcelas: 12, vencimento: '05/02/2024', valor: 75.00, status: 'pago', dataPagamento: '03/02/2024' },
  { id: '3', numero: 3, totalParcelas: 12, vencimento: '05/03/2024', valor: 75.00, status: 'pago', dataPagamento: '05/03/2024' },
  { id: '4', numero: 4, totalParcelas: 12, vencimento: '05/04/2024', valor: 75.00, status: 'pago', dataPagamento: '02/04/2024' },
  { id: '5', numero: 5, totalParcelas: 12, vencimento: '05/05/2024', valor: 75.00, status: 'pago', dataPagamento: '04/05/2024' },
  { id: '6', numero: 6, totalParcelas: 12, vencimento: '05/06/2024', valor: 75.00, status: 'pago', dataPagamento: '03/06/2024' },
  { id: '7', numero: 7, totalParcelas: 12, vencimento: '05/07/2024', valor: 75.00, status: 'pago', dataPagamento: '05/07/2024' },
];

export default function PagamentosScreen() {
  const navigation = useNavigation<any>();
  const [abaAtiva, setAbaAtiva] = useState<'pendentes' | 'historico'>('pendentes');

  return (
    <BackgroundLayout>
      <View style={styles.container}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pagamentos</Text>
        </View>

        {/* CARD RESUMO (Permanece inalterado ao trocar de aba) */}
        <View style={[globalStyles.card, styles.summaryCard]}>
          <View style={styles.statusRow}>
            <Text style={styles.summaryLabel}>Status atual:</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Em dia</Text>
            </View>
          </View>

          <View style={styles.progressHeader}>
            <Text style={styles.summaryLabel}>Contribuição</Text>
            <Text style={styles.summaryLabel}>7/12 parcelas</Text>
          </View>
          
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '58%' }]} />
          </View>

          <View style={styles.totalsRow}>
            <View>
              <Text style={styles.summaryLabel}>Total pago</Text>
              <Text style={styles.totalsValue}>R$ 525.00</Text>
            </View>
            <View>
              <Text style={styles.summaryLabel}>Pendente</Text>
              <Text style={styles.totalsValue}>R$ 375.00</Text>
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
                <Text style={styles.activeTabText}>Pendentes</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.inactiveTabText}>Pendentes</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tabButton} 
            activeOpacity={0.8}
            onPress={() => setAbaAtiva('historico')}
          >
            {abaAtiva === 'historico' ? (
              <LinearGradient colors={COLORS.buttonGradient as [string, string]} style={styles.activeTabBg}>
                <Text style={styles.activeTabText}>Histórico</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.inactiveTabText}>Histórico</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* LISTA DE PARCELAS (Renderização Dinâmica) */}
        <View style={styles.listContainer}>
          {abaAtiva === 'pendentes' ? (
            
            // ================= RENDER: PENDENTES =================
            PARCELAS_PENDENTES.map((parcela) => (
              <View key={parcela.id} style={[globalStyles.card, styles.parcelaCard]}>
                <View style={styles.parcelaHeader}>
                  <View>
                    <Text style={styles.parcelaTitle}>
                      Parcela {parcela.numero}/{parcela.totalParcelas}
                    </Text>
                    <Text style={styles.parcelaSubtitle}>
                      Vencimento: {parcela.vencimento}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.parcelaValor}>R$ {parcela.valor.toFixed(2)}</Text>
                    <View style={styles.statusBadgeRow}>
                      <Feather name="clock" size={12} color={COLORS.primary} style={{ marginRight: 4 }} />
                      <Text style={styles.statusPendenteText}>Pendente</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={{ flex: 1, marginRight: 12 }} activeOpacity={0.8}>
                    <LinearGradient colors={COLORS.buttonGradient as [string, string]} style={styles.payButton}>
                      <Text style={styles.payButtonText}>Pagar agora</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.copyButton}>
                    <Feather name="copy" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            ))

          ) : (

            // ================= RENDER: HISTÓRICO =================
            PARCELAS_PAGAS.map((parcela) => (
              <View key={parcela.id} style={[globalStyles.card, styles.parcelaCard]}>
                <View style={styles.parcelaHeader}>
                  <View>
                    <Text style={styles.parcelaTitle}>
                      Parcela {parcela.numero}/{parcela.totalParcelas}
                    </Text>
                    <Text style={styles.parcelaSubtitle}>
                      Pago em: {parcela.dataPagamento}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.parcelaValor}>R$ {parcela.valor.toFixed(2)}</Text>
                    <View style={styles.statusBadgeRow}>
                      <Feather name="check-circle" size={12} color="#4CAF50" style={{ marginRight: 4 }} />
                      <Text style={styles.statusPagoText}>Pago</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.downloadButton} activeOpacity={0.8}>
                  <Feather name="download" size={16} color={COLORS.primary} style={{ marginRight: 8 }} />
                  <Text style={styles.downloadButtonText}>Baixar comprovante</Text>
                </TouchableOpacity>
              </View>
            ))

          )}
        </View>

      </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -30,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 16,
  },
  headerTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: COLORS.white,
  },
  summaryCard: {
    marginBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 6,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  statusText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#4CAF50',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textLight,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 2,
    marginBottom: 20,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalsValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: COLORS.white,
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#000', 
  },
  inactiveTabText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textLight,
  },
  listContainer: {
    gap: 16,
  },
  parcelaCard: {
    padding: 16,
  },
  parcelaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  parcelaTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 4,
  },
  parcelaSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textLight,
  },
  parcelaValor: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 4,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusPendenteText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.primary,
  },
  statusPagoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#4CAF50', // Verde
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#000',
  },
  copyButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(221, 130, 65, 0.3)', 
    backgroundColor: 'rgba(221, 130, 65, 0.05)',
  },
  downloadButton: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(221, 130, 65, 0.3)', 
    backgroundColor: 'rgba(221, 130, 65, 0.05)',
  },
  downloadButtonText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.primary, // Laranja
  }
});