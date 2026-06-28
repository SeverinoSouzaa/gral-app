import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import BackgroundLayout from '../../components/BackgroundLayout';
import { COLORS } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useChecklist } from '../../hooks/useChecklist';

export default function ChecklistScreen() {
  const navigation = useNavigation<any>();
  const { textMultiplier, isHighContrast } = useAccessibility();
  const { items, loading, progress, refresh } = useChecklist();

  return (
    <BackgroundLayout>
      <View style={styles.container}>
        
        {/* HEADER DA TELA */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: 16 * textMultiplier }]}>Checklist da Formatura</Text>
          <View style={{ width: 40 }} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={[styles.loadingText, { fontSize: 14 * textMultiplier }]}>Analisando suas tarefas...</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            
            {/* CARD DE PROGRESSO */}
            <View style={[globalStyles.card, styles.progressCard, isHighContrast && { backgroundColor: '#111', borderColor: COLORS.primary }]}>
              <View style={styles.progressHeaderRow}>
                <Text style={[styles.progressTitle, { fontSize: 16 * textMultiplier }]}>Progresso</Text>
                <Text style={[styles.progressPercent, { fontSize: 18 * textMultiplier }]}>{progress}%</Text>
              </View>
              
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
              </View>
              
              <Text style={[styles.progressSubtitle, { fontSize: 13 * textMultiplier }]}>
                {progress === 100 
                  ? "Tudo pronto! Você concluiu todas as pendências."
                  : "Complete os itens abaixo para ficar em dia com sua formatura."}
              </Text>
            </View>

            {/* LISTA DE TAREFAS */}
            <Text style={[styles.sectionTitle, { fontSize: 18 * textMultiplier }]}>Suas Tarefas</Text>
            
            {items.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="check-circle" size={48} color={COLORS.primary} style={{ marginBottom: 16 }} />
                <Text style={[styles.emptyText, { fontSize: 16 * textMultiplier }]}>Nenhuma tarefa exigida no momento!</Text>
              </View>
            ) : (
              items.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    globalStyles.card, 
                    styles.taskItem, 
                    isHighContrast && { backgroundColor: '#111', borderColor: COLORS.primary }
                  ]}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate(item.actionRoute)}
                >
                  <View style={styles.taskIconBox}>
                    {item.done ? (
                      <Feather name="check-circle" size={24} color="#4CAF50" />
                    ) : (
                      <Feather name="circle" size={24} color={COLORS.textLight} />
                    )}
                  </View>
                  <View style={styles.taskInfo}>
                    <Text 
                      style={[
                        styles.taskTitle, 
                        { fontSize: 15 * textMultiplier },
                        item.done && styles.taskTitleDone
                      ]}
                    >
                      {item.title}
                    </Text>
                    {!item.done && (
                      <Text style={[styles.taskActionText, { fontSize: 12 * textMultiplier }]}>
                        Toque para resolver
                      </Text>
                    )}
                  </View>
                  <Feather name="chevron-right" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              ))
            )}

            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={refresh}
            >
              <Feather name="refresh-cw" size={16} color={COLORS.textLight} style={{ marginRight: 8 }} />
              <Text style={[styles.refreshText, { fontSize: 14 * textMultiplier }]}>Atualizar status</Text>
            </TouchableOpacity>

          </ScrollView>
        )}
      </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8
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
  },
  headerTitle: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textLight,
    marginTop: 16
  },
  progressCard: {
    marginBottom: 32,
    padding: 24,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontFamily: 'Inter_700Bold',
    color: COLORS.white,
  },
  progressPercent: {
    fontFamily: 'Inter_700Bold',
    color: COLORS.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressSubtitle: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textLight,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    color: COLORS.white,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textLight,
    textAlign: 'center'
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
  },
  taskIconBox: {
    marginRight: 16,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.white,
  },
  taskTitleDone: {
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  taskActionText: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.primary,
    marginTop: 4,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 16,
  },
  refreshText: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textLight,
  }
});
