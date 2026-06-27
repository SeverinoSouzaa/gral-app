import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import BackgroundLayout from '../../components/BackgroundLayout';
import { LinearGradient } from 'expo-linear-gradient';
import AccessibilityMenu from '../../components/AccessibilityMenu';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SidebarMenu from './SidebarMenu';
import * as SecureStore from 'expo-secure-store';
import { api, BASE_URL } from '../../services/api';

export default function TelaPrincipal() {
  const navigation = useNavigation<any>();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const [proximoEvento, setProximoEvento] = useState<any>(null);
  const [resumoFinanceiro, setResumoFinanceiro] = useState<any>(null);
  const [midias, setMidias] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        try {
          const token = await SecureStore.getItemAsync('userToken');
          if (!token || !isActive) return;

          // Fetch Eventos
          const eventosData = await api.eventos.getEventos(token).catch(() => []);
          if (eventosData.length > 0 && isActive) {
            const futuros = eventosData.filter((e: any) => new Date(e.dataEvento).getTime() >= Date.now());
            const sorted = futuros.sort((a: any, b: any) => new Date(a.dataEvento).getTime() - new Date(b.dataEvento).getTime());
            setProximoEvento(sorted.length > 0 ? sorted[0] : eventosData[0]);
          }

          // Fetch Financeiro
          const financeData = await api.finance.getResumo(token).catch(() => null);
          if (financeData && financeData.resumo && isActive) {
            setResumoFinanceiro(financeData.resumo);
          }

          // Fetch Midias
          const midiasData = await api.midias.getMidias(token).catch(() => []);
          if (isActive) {
            setMidias(midiasData.slice(0, 3));
          }
        } catch (err) {
          console.error('Erro ao carregar dados do dashboard', err);
        }
      };

      loadData();
      
      const intervalId = setInterval(() => {
        if (isActive) loadData();
      }, 5000);

      return () => {
        isActive = false;
        clearInterval(intervalId);
      };
    }, [])
  );

  const getImageUrl = (arquivo: string) => {
    if (arquivo.startsWith('http')) return arquivo;
    return `${BASE_URL.replace('/api/v1', '')}/uploads/midias/${arquivo}`;
  };

  return (
    <BackgroundLayout hideAccessibility={true}>
      <View style={styles.container}>
        
        {/* 1. TOP BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setIsSidebarVisible(true)}
          >
            <Feather name="menu" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          
          <View style={styles.rightIcons}>
            <AccessibilityMenu 
              position="top"
              renderTrigger={(onPress) => (
                <TouchableOpacity style={styles.accessibilityButton} onPress={onPress}>
                  <MaterialIcons name="accessibility-new" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="bell" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. HEADER: SAUDAÇÃO */}
        <View style={styles.headerArea}>
          <Text style={styles.greetingTitle}>
            Olá, <Text style={styles.greetingHighlight}>formando(a)!</Text>
          </Text>
          <Text style={styles.greetingSubtitle}>
            Aqui está sua formatura organizada em um só lugar.
          </Text>
        </View>

        {/* 3. QUICK ACTIONS */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.actionPill} 
            onPress={() => navigation.navigate('Documentos')}
          >
            <Feather name="file-text" size={14} color={COLORS.primary} style={styles.pillIcon} />
            <Text style={styles.pillText} numberOfLines={1}>Documentos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionPill, { marginHorizontal: 8 }]}>
            <Feather name="bell" size={14} color={COLORS.primary} style={styles.pillIcon} />
            <Text style={styles.pillText} numberOfLines={1}>Avisos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionPill}
            onPress={() => navigation.navigate('Pagamentos')}
          >
            <Feather name="credit-card" size={14} color={COLORS.primary} style={styles.pillIcon} />
            <Text style={styles.pillText} numberOfLines={1}>Pagamentos</Text>
          </TouchableOpacity>
        </View>

        {/* 4. CARDS DE INFORMAÇÃO */}
        
        {/* CARD: PRÓXIMOS EVENTOS */}
        <TouchableOpacity 
          style={[globalStyles.card, styles.cardSpacing]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Calendario')}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Próximos Eventos</Text>
            <Feather name="chevron-right" size={20} color={COLORS.primary} />
          </View>
          
          {proximoEvento ? (
            <View style={styles.eventBody}>
              <LinearGradient
                colors={COLORS.buttonGradient as [string, string]}
                style={styles.dateBlock}
              >
                <Text style={styles.dateNumber}>
                  {new Date(proximoEvento.dataEvento).getDate().toString().padStart(2, '0')}
                </Text>
                <Text style={styles.dateMonth}>
                  {new Date(proximoEvento.dataEvento).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
                </Text>
              </LinearGradient>
              <View style={styles.eventInfo}>
                <Text style={styles.eventName}>{proximoEvento.nomeEvento}</Text>
                <Text style={styles.eventDetails}>
                  {proximoEvento.local || 'Sem local definido'}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyStateSimple}>
              <Feather name="calendar" size={24} color={COLORS.textLight} style={{ marginRight: 12 }} />
              <Text style={styles.emptyStateText}>Nenhum evento agendado</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* CARD: PAGAMENTOS */}
        <View style={[globalStyles.card, styles.cardSpacing]}>
          <View style={styles.cardHeader}>
            <View style={styles.titleWithIcon}>
              <Text style={styles.cardTitle}>Pagamentos</Text>
              <Feather name="info" size={14} color={COLORS.textLight} style={{ marginLeft: 8 }} />
            </View>
          </View>

          {resumoFinanceiro ? (
            <>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Status atual:</Text>
                <View style={styles.statusBadge}>
                  <View style={[styles.statusDot, { backgroundColor: resumoFinanceiro.pendente > 0 ? '#F44336' : '#4CAF50' }]} />
                  <Text style={[styles.statusText, { color: resumoFinanceiro.pendente > 0 ? '#F44336' : '#4CAF50' }]}>
                    {resumoFinanceiro.pendente > 0 ? 'Com pendências' : 'Em dia'}
                  </Text>
                </View>
              </View>

              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Contribuição</Text>
                <Text style={styles.progressValue}>
                  {`${resumoFinanceiro.parcelasPagas || 0}/${resumoFinanceiro.totalParcelas || 1} parcelas`}
                </Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View style={[
                  styles.progressBarFill, 
                  { width: `${((resumoFinanceiro.parcelasPagas || 0) / (resumoFinanceiro.totalParcelas || 1)) * 100}%` }
                ]} />
              </View>
            </>
          ) : (
            <View style={styles.emptyStateSimple}>
              <Feather name="dollar-sign" size={24} color={COLORS.textLight} style={{ marginRight: 12 }} />
              <Text style={styles.emptyStateText}>Nenhum plano financeiro gerado</Text>
            </View>
          )}

          <TouchableOpacity 
            style={styles.cardButtonOutline}
            onPress={() => navigation.navigate('Pagamentos')}
          >
            <Text style={styles.cardButtonOutlineText}>Ver detalhes</Text>
          </TouchableOpacity>
        </View>

        {/* CARD: CHECKLIST */}
        <View style={[globalStyles.card, styles.cardSpacing]}>
          <View style={styles.cardHeader}>
            <View style={styles.titleWithIcon}>
              <Text style={styles.cardTitle}>Checklist</Text>
              <Feather name="info" size={14} color={COLORS.textLight} style={{ marginLeft: 8 }} />
            </View>
            <Text style={styles.progressValue}>2/3</Text>
          </View>

          <View style={[styles.progressBarBackground, { marginBottom: 20 }]}>
            <View style={[styles.progressBarFill, { width: '66%' }]} />
          </View>

          <View style={styles.checklistItem}>
            <Feather name="check-circle" size={20} color={COLORS.primary} />
            <Text style={styles.checklistItemTextDone}>Enviar documento de identidade</Text>
          </View>
          <View style={styles.checklistItem}>
            <Feather name="check-circle" size={20} color={COLORS.primary} />
            <Text style={styles.checklistItemTextDone}>Escolher foto do convite</Text>
          </View>
          <View style={styles.checklistItem}>
            <Feather name="circle" size={20} color={COLORS.textLight} />
            <Text style={styles.checklistItemTextPending}>Confirmar presença na reunião</Text>
          </View>

          <TouchableOpacity style={styles.textButton}>
            <Text style={styles.textButtonLabel}>Abrir Checklist completo</Text>
            <Feather name="chevron-right" size={16} color={COLORS.primary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* CARD: MÍDIAS */}
        <View style={[globalStyles.card, styles.cardSpacing, { marginBottom: 40 }]}>
          <View style={styles.cardHeader}>
            <View style={styles.titleWithIcon}>
              <Text style={styles.cardTitle}>Mídias</Text>
              <Feather name="info" size={14} color={COLORS.textLight} style={{ marginLeft: 8 }} />
            </View>
          </View>

          {midias.length > 0 ? (
            <View style={styles.mediaGrid}>
              {midias.map((midia: any, idx: number) => (
                <View key={idx} style={[styles.mediaThumbnail, { overflow: 'hidden' }]}>
                  {midia.tipo === 'IMAGE' ? (
                    <Image source={{ uri: getImageUrl(midia.arquivo) }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  ) : (
                    <Feather name="play" size={24} color={COLORS.primary} />
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateSimple}>
              <Feather name="image" size={24} color={COLORS.textLight} style={{ marginRight: 12 }} />
              <Text style={styles.emptyStateText}>Nenhuma mídia publicada</Text>
            </View>
          )}

          <TouchableOpacity 
            style={styles.textButton}
            onPress={() => navigation.navigate('Midias')}
          >
            <Text style={styles.textButtonLabel}>Ver todas</Text>
            <Feather name="chevron-right" size={16} color={COLORS.primary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

      </View>

      {/* SIDEBAR MENU */}
      <SidebarMenu 
        visible={isSidebarVisible} 
        onClose={() => setIsSidebarVisible(false)} 
      />
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -30, // Puxa todo o conteúdo da tela mais para cima
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accessibilityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(221, 130, 65, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(221, 130, 65, 0.3)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  headerArea: {
    marginBottom: 24,
  },
  greetingTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: COLORS.white,
    marginBottom: 8,
  },
  greetingHighlight: {
    color: COLORS.primary,
  },
  greetingSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  pillIcon: {
    marginRight: 6,
  },
  pillText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.white,
  },
  cardSpacing: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.white,
  },
  eventBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBlock: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dateNumber: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#000',
  },
  dateMonth: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#000',
    textTransform: 'uppercase',
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 4,
  },
  eventDetails: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textLight,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textLight,
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
  progressLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textLight,
  },
  progressValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.white,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 2,
    marginBottom: 24,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  cardButtonOutline: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  cardButtonOutlineText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.primary,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  checklistItemTextDone: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.white,
    marginLeft: 12,
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  checklistItemTextPending: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.white,
    marginLeft: 12,
  },
  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  textButtonLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.primary,
  },
  mediaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaThumbnail: {
    width: '31%',
    aspectRatio: 1, // Mantém o quadrado perfeito
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  emptyStateSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyStateText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textLight,
  },
});