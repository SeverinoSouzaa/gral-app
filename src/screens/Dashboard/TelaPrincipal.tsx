import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import BackgroundLayout from '../../components/BackgroundLayout';
import { LinearGradient } from 'expo-linear-gradient';

export default function TelaPrincipal() {
  return (
    <BackgroundLayout>
      <View style={styles.container}>
        
        {/* 1. TOP BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="menu" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.accessibilityButton}>
              <MaterialIcons name="accessibility-new" size={24} color={COLORS.primary} />
            </TouchableOpacity>
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

        {/* 3. QUICK ACTIONS (Rolagem Horizontal) */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.quickActionsContainer}
          contentContainerStyle={{ paddingRight: 24 }}
        >
          <TouchableOpacity style={styles.actionPill}>
            <Feather name="file-text" size={16} color={COLORS.primary} style={styles.pillIcon} />
            <Text style={styles.pillText}>Documentos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionPill}>
            <Feather name="bell" size={16} color={COLORS.primary} style={styles.pillIcon} />
            <Text style={styles.pillText}>Avisos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionPill}>
            <Feather name="credit-card" size={16} color={COLORS.primary} style={styles.pillIcon} />
            <Text style={styles.pillText}>Pagamentos</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* 4. CARDS DE INFORMAÇÃO */}
        
        {/* CARD: PRÓXIMOS EVENTOS */}
        <View style={[globalStyles.card, styles.cardSpacing]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Próximos Eventos</Text>
            <Feather name="chevron-right" size={20} color={COLORS.primary} />
          </View>
          
          <View style={styles.eventBody}>
            <LinearGradient
              colors={COLORS.buttonGradient as [string, string]}
              style={styles.dateBlock}
            >
              <Text style={styles.dateNumber}>18</Text>
              <Text style={styles.dateMonth}>NOV</Text>
            </LinearGradient>
            <View style={styles.eventInfo}>
              <Text style={styles.eventName}>Reunião da Comissão</Text>
              <Text style={styles.eventDetails}>Às 19h00 • Online</Text>
            </View>
          </View>
        </View>

        {/* CARD: PAGAMENTOS */}
        <View style={[globalStyles.card, styles.cardSpacing]}>
          <View style={styles.cardHeader}>
            <View style={styles.titleWithIcon}>
              <Text style={styles.cardTitle}>Pagamentos</Text>
              <Feather name="info" size={14} color={COLORS.textLight} style={{ marginLeft: 8 }} />
            </View>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status atual:</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Em dia</Text>
            </View>
          </View>

          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Contribuição</Text>
            <Text style={styles.progressValue}>7/12 parcelas</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '58%' }]} />
          </View>

          <TouchableOpacity style={styles.cardButtonOutline}>
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

          <View style={styles.mediaGrid}>
            <View style={styles.mediaThumbnail}>
              <Feather name="image" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.mediaThumbnail}>
              <Feather name="play" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.mediaThumbnail}>
              <Feather name="image" size={24} color={COLORS.primary} />
            </View>
          </View>

          <TouchableOpacity style={styles.textButton}>
            <Text style={styles.textButtonLabel}>Ver todas</Text>
            <Feather name="chevron-right" size={16} color={COLORS.primary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

      </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 32,
    marginLeft: -24, // Compensa o padding do container global para a rolagem ir até a borda
    paddingLeft: 24,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  pillIcon: {
    marginRight: 8,
  },
  pillText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
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
});