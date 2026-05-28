import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import BackgroundLayout from '../../components/BackgroundLayout';

// Interface para garantir que os dados do evento estejam corretos (TypeScript)
interface Evento {
  id: string;
  dia: string;
  mes: string;
  titulo: string;
  icon: keyof typeof Feather.glyphMap;
  horario: string;
  local: string;
  isOnline?: boolean;
  statusText: string;
  statusColor: string;
  botaoTipo: 'confirmar' | 'confirmado' | 'nenhum';
}

// Simulando os dados vindos do Banco de Dados baseados no seu print
const EVENTOS: Evento[] = [
  {
    id: '1', dia: '15', mes: 'NOV', titulo: 'Aula da Saudade', icon: 'calendar',
    horario: '14h00', local: 'Auditório Principal', statusText: 'Confirmado', statusColor: '#4CAF50',
    botaoTipo: 'confirmado'
  },
  {
    id: '2', dia: '18', mes: 'NOV', titulo: 'Missa de Formatura', icon: 'users',
    horario: '19h00', local: 'Capela da Universidade', statusText: 'Confirmado', statusColor: '#4CAF50',
    botaoTipo: 'confirmar'
  },
  {
    id: '3', dia: '18', mes: 'NOV', titulo: 'Reunião da Comissão', icon: 'video',
    horario: '19h00', local: 'Google Meet', isOnline: true, statusText: 'Confirmado', statusColor: '#4CAF50',
    botaoTipo: 'nenhum'
  },
  {
    id: '4', dia: '22', mes: 'NOV', titulo: 'Studio Day - Sessão de Fotos', icon: 'users',
    horario: '09h00 - 18h00', local: 'Estúdio Momentos', statusText: 'Confirmado', statusColor: '#4CAF50',
    botaoTipo: 'confirmado'
  },
  {
    id: '5', dia: '15', mes: 'DEZ', titulo: 'Outorga de Grau', icon: 'calendar',
    horario: '18h00', local: 'Teatro Municipal', statusText: 'Confirmado', statusColor: '#4CAF50',
    botaoTipo: 'confirmar'
  },
  {
    id: '6', dia: '28', mes: 'NOV', titulo: 'Ensaio Fotográfico - Externa', icon: 'users',
    horario: '15h00', local: 'Parque das Águas', statusText: 'Pendente', statusColor: COLORS.primary,
    botaoTipo: 'nenhum'
  }
];

export default function CalendarioScreen() {
  const navigation = useNavigation<any>();

  return (
    <BackgroundLayout>
      <View style={styles.container}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calendário</Text>
        </View>

        <Text style={styles.subtitle}>Todos os eventos da sua formatura</Text>

        {/* LISTA DE EVENTOS */}
        <View style={styles.eventsList}>
          {EVENTOS.map((evento) => (
            <View key={evento.id} style={[globalStyles.card, styles.eventCard]}>
              
              <View style={styles.cardContent}>
                {/* Bloco de Data (Esquerda) */}
                <LinearGradient
                  colors={COLORS.buttonGradient as [string, string]}
                  style={styles.dateBlock}
                >
                  <Text style={styles.dateNumber}>{evento.dia}</Text>
                  <Text style={styles.dateMonth}>{evento.mes}</Text>
                </LinearGradient>

                {/* Informações do Evento (Direita) */}
                <View style={styles.infoBlock}>
                  <View style={styles.titleRow}>
                    <Feather name={evento.icon} size={16} color={COLORS.textLight} style={styles.infoIcon} />
                    <Text style={styles.eventTitle} numberOfLines={2}>{evento.titulo}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Feather name="clock" size={14} color={COLORS.textLight} style={styles.infoIcon} />
                    <Text style={styles.detailText}>{evento.horario}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Feather name="map-pin" size={14} color={COLORS.textLight} style={styles.infoIcon} />
                    <Text style={styles.detailText} numberOfLines={1}>{evento.local}</Text>
                    {evento.isOnline && (
                      <View style={styles.onlineBadge}>
                        <Text style={styles.onlineText}>Online</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.detailRow}>
                    <Feather 
                      name={evento.statusText === 'Confirmado' ? 'check-circle' : 'clock'} 
                      size={14} 
                      color={evento.statusColor} 
                      style={styles.infoIcon} 
                    />
                    <Text style={[styles.detailText, { color: evento.statusColor }]}>
                      {evento.statusText}
                    </Text>
                  </View>
                </View>
              </View>

              {/* RENDERIZAÇÃO CONDICIONAL DOS BOTÕES */}
              {evento.botaoTipo === 'confirmar' && (
                <TouchableOpacity activeOpacity={0.8}>
                  <LinearGradient
                    colors={COLORS.buttonGradient as [string, string]}
                    style={styles.primaryButton}
                  >
                    <Text style={styles.primaryButtonText}>Confirmar presença</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {evento.botaoTipo === 'confirmado' && (
                <View style={styles.successButton}>
                  <Feather name="check-circle" size={16} color="#4CAF50" style={{ marginRight: 8 }} />
                  <Text style={styles.successButtonText}>Presença confirmada</Text>
                </View>
              )}
              
            </View>
          ))}
        </View>

      </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -35, // Puxa todo o conteúdo da tela mais para cima
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
    gap: 16, // Espaçamento entre os cards
  },
  eventCard: {
    padding: 16, // Sobrescreve o padding do card global para ajustar os botões colados
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 16, // Espaço entre o conteúdo e os botões
  },
  dateBlock: {
    width: 64,
    height: 100, // Mais alto para acompanhar o conteúdo
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
    marginTop: 2, // Ajuste fino para alinhar o ícone com o texto
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
    fontFamily: 'Inter_700Bold', // Botão laranja costuma ter peso maior
    fontSize: 14,
    color: '#000', // Texto escuro para dar contraste no fundo laranja
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