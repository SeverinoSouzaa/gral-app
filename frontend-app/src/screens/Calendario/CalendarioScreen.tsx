import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { COLORS } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import BackgroundLayout from '../../components/BackgroundLayout';
import ConfirmModal from '../../components/ConfirmModal';
import { api } from '../../services/api';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface EventoAPI {
  id: number;
  nomeEvento: string;
  dataEvento: string;
  local: string;
  descricao: string;
  eventType: string;
  statusPresencaUsuario: string;
}

export default function CalendarioScreen() {
  const navigation = useNavigation<any>();
  const [eventos, setEventos] = useState<EventoAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States do ConfirmModal
  const [modalVisible, setModalVisible] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<EventoAPI | null>(null);

  const { textMultiplier, isHighContrast } = useAccessibility();

  useEffect(() => {
    loadEventos();
  }, []);

  const loadEventos = async () => {
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) return;
      
      const data = await api.eventos.getEventos(token);
      setEventos(data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      Alert.alert('Erro', 'Não foi possível carregar o calendário');
    } finally {
      setIsLoading(false);
    }
  };

  const promptConfirmarPresenca = (evento: EventoAPI) => {
    setEventoSelecionado(evento);
    setModalVisible(true);
  };

  const confirmarPresenca = async () => {
    if (!eventoSelecionado) return;
    const id = eventoSelecionado.id;
    setModalVisible(false);

    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) return;

      // Chama a API com status CONFIRMADO
      await api.eventos.setPresenca(token, id, 'CONFIRMADO');
      
      // Atualização otimista: atualiza a UI instantaneamente para o usuário sem recarregar a lista inteira
      setEventos(prev => prev.map(ev => ev.id === id ? { ...ev, statusPresencaUsuario: 'CONFIRMADO' } : ev));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível confirmar sua presença');
    }
  };

  // Funções de formatação puras (O frontend cuida da apresentação)
  const formatDay = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.getDate().toString().padStart(2, '0');
  };

  const formatMonth = (isoDate: string) => {
    const date = new Date(isoDate);
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    return months[date.getMonth()];
  };

  const formatTime = (isoDate: string) => {
    const date = new Date(isoDate);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}h${minutes}`;
  };

  const getIcon = (eventType: string): keyof typeof Feather.glyphMap => {
    switch (eventType) {
      case 'REHEARSAL': return 'users';
      case 'DEADLINE': return 'clock';
      case 'EVENT':
      default: return 'calendar';
    }
  };

  return (
    <BackgroundLayout>
      <View style={styles.container}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: 16 * textMultiplier }]}>Calendário</Text>
        </View>

        <Text style={[styles.subtitle, { fontSize: 14 * textMultiplier }]}>Todos os eventos da sua formatura</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : eventos.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 60, paddingHorizontal: 32 }}>
            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 24, borderRadius: 60, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
              <Feather name="calendar" size={56} color={COLORS.primary} style={{ opacity: 0.8 }} />
            </View>
            <Text style={{ color: COLORS.white, fontFamily: 'Inter_700Bold', fontSize: 18 * textMultiplier, marginBottom: 8, textAlign: 'center' }}>
              Nenhum evento agendado
            </Text>
            <Text style={{ color: COLORS.textLight, fontFamily: 'Inter_400Regular', fontSize: 14 * textMultiplier, textAlign: 'center', lineHeight: 22 }}>
              A sua turma ainda não possui eventos oficiais cadastrados. Fique de olho, novidades aparecerão aqui!
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.eventsList}>
              {eventos.map((evento) => (
                <View key={evento.id.toString()} style={[globalStyles.card, styles.eventCard, isHighContrast && { backgroundColor: '#111', borderColor: COLORS.primary }]}>
                  
                  <View style={styles.cardContent}>
                    {/* Bloco de Data (Esquerda) */}
                    <LinearGradient
                      colors={COLORS.buttonGradient as [string, string]}
                      style={styles.dateBlock}
                    >
                      <Text style={[styles.dateNumber, { fontSize: 20 * textMultiplier }]}>{formatDay(evento.dataEvento)}</Text>
                      <Text style={[styles.dateMonth, { fontSize: 12 * textMultiplier }]}>{formatMonth(evento.dataEvento)}</Text>
                    </LinearGradient>

                    {/* Informações do Evento (Direita) */}
                    <View style={styles.infoBlock}>
                      <View style={styles.titleRow}>
                        <Feather name={getIcon(evento.eventType)} size={16} color={COLORS.textLight} style={styles.infoIcon} />
                        <Text style={[styles.eventTitle, { fontSize: 15 * textMultiplier }]} numberOfLines={2}>{evento.nomeEvento}</Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Feather name="clock" size={14} color={COLORS.textLight} style={styles.infoIcon} />
                        <Text style={[styles.detailText, { fontSize: 12 * textMultiplier }]}>{formatTime(evento.dataEvento)}</Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Feather name="map-pin" size={14} color={COLORS.textLight} style={styles.infoIcon} />
                        <Text style={[styles.detailText, { fontSize: 12 * textMultiplier }]} numberOfLines={1}>{evento.local}</Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Feather 
                          name={evento.statusPresencaUsuario === 'CONFIRMADO' ? 'check-circle' : 'clock'} 
                          size={14} 
                          color={evento.statusPresencaUsuario === 'CONFIRMADO' ? '#4CAF50' : COLORS.primary} 
                          style={styles.infoIcon} 
                        />
                        <Text style={[styles.detailText, { fontSize: 12 * textMultiplier, color: evento.statusPresencaUsuario === 'CONFIRMADO' ? '#4CAF50' : COLORS.primary }]}>
                          {evento.statusPresencaUsuario === 'CONFIRMADO' ? 'Confirmado' : 'Pendente'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* RENDERIZAÇÃO CONDICIONAL DOS BOTÕES */}
                  {evento.statusPresencaUsuario === 'PENDENTE' && (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => promptConfirmarPresenca(evento)}>
                      <LinearGradient
                        colors={COLORS.buttonGradient as [string, string]}
                        style={styles.primaryButton}
                      >
                        <Text style={[styles.primaryButtonText, { fontSize: 14 * textMultiplier }]}>Confirmar presença</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}

                  {evento.statusPresencaUsuario === 'CONFIRMADO' && (
                    <View style={styles.successButton}>
                      <Feather name="check-circle" size={16} color="#4CAF50" style={{ marginRight: 8 }} />
                      <Text style={[styles.successButtonText, { fontSize: 14 * textMultiplier }]}>Presença confirmada</Text>
                    </View>
                  )}
                  
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
      
      <ConfirmModal 
        visible={modalVisible}
        title="Confirmar Presença"
        description={`Deseja realmente confirmar sua presença em "${eventoSelecionado?.nomeEvento}"?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        iconName="check-circle"
        onConfirm={confirmarPresenca}
        onCancel={() => setModalVisible(false)}
      />
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -35,
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
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  eventsList: {
    gap: 16,
  },
  eventCard: {
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dateBlock: {
    width: 64,
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dateNumber: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#000',
  },
  dateMonth: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#000',
    textTransform: 'uppercase',
  },
  infoBlock: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: COLORS.white,
    flex: 1,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  detailText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textLight,
  },
  onlineBadge: {
    backgroundColor: 'rgba(221, 130, 65, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  onlineText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: COLORS.primary,
  },
  primaryButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#000',
  },
  successButton: {
    height: 48,
    flexDirection: 'row',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  successButtonText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#4CAF50',
  }
});