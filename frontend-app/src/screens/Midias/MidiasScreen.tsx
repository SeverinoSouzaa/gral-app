import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import BackgroundLayout from '../../components/BackgroundLayout';

// "Contrato" para o Backend
interface MediaItem {
  id: string;
  tipo: 'foto' | 'video';
  categoria: 'studio' | 'missa' | 'festa';
  url?: string; // Futuramente a URL real da imagem/vídeo
}

// Simulando os dados vindos do Banco de Dados
const MIDIAS_MOCK: MediaItem[] = [
  { id: '1', tipo: 'foto', categoria: 'studio' },
  { id: '2', tipo: 'foto', categoria: 'studio' },
  { id: '3', tipo: 'foto', categoria: 'missa' },
  { id: '4', tipo: 'video', categoria: 'missa' },
  { id: '5', tipo: 'foto', categoria: 'festa' },
  { id: '6', tipo: 'foto', categoria: 'festa' },
  { id: '7', tipo: 'video', categoria: 'studio' },
  { id: '8', tipo: 'foto', categoria: 'studio' },
  { id: '9', tipo: 'foto', categoria: 'missa' },
  { id: '10', tipo: 'foto', categoria: 'missa' },
];

export default function MidiasScreen() {
  const navigation = useNavigation<any>();
  // Estado para controlar o filtro ativo
  const [filtroAtivo, setFiltroAtivo] = useState<'todas' | 'studio' | 'missa'>('todas');
  // Estado para alternar entre os tipos de mídia (facilita o controle do Backend)
  const [abaAtiva, setAbaAtiva] = useState<'tudo' | 'videos'>('tudo');

  return (
    <BackgroundLayout>
      <View style={styles.container}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mídias</Text>
        </View>

        <Text style={styles.subtitle}>Fotos e vídeos da sua formatura</Text>

        {/* BOTÕES DE AÇÃO PRINCIPAIS */}
        <View style={styles.mainActionsContainer}>
          <TouchableOpacity 
            style={{ flex: 1, marginRight: 12 }} 
            activeOpacity={0.8}
            onPress={() => setAbaAtiva('tudo')}
          >
            {abaAtiva === 'tudo' ? (
              <LinearGradient colors={COLORS.buttonGradient as [string, string]} style={styles.actionButtonPrimary}>
                <Feather name="download" size={16} color="#000" style={styles.actionIcon} />
                <Text style={styles.actionButtonTextPrimary}>Baixar tudo (ZIP)</Text>
              </LinearGradient>
            ) : (
              <View style={styles.actionButtonSecondary}>
                <Feather name="download" size={16} color={COLORS.primary} style={styles.actionIcon} />
                <Text style={styles.actionButtonTextSecondary}>Baixar tudo (ZIP)</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ flex: 1 }} 
            activeOpacity={0.8}
            onPress={() => setAbaAtiva('videos')}
          >
            {abaAtiva === 'videos' ? (
              <LinearGradient colors={COLORS.buttonGradient as [string, string]} style={styles.actionButtonPrimary}>
                <Feather name="film" size={16} color="#000" style={styles.actionIcon} />
                <Text style={styles.actionButtonTextPrimary}>Vídeos (ZIP)</Text>
              </LinearGradient>
            ) : (
              <View style={styles.actionButtonSecondary}>
                <Feather name="film" size={16} color={COLORS.primary} style={styles.actionIcon} />
                <Text style={styles.actionButtonTextSecondary}>Vídeos (ZIP)</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* RENDERIZAÇÃO CONDICIONAL COM BASE NA ABA ATIVA */}
        {abaAtiva === 'tudo' ? (
          <>
            {/* FILTROS (Rolagem Horizontal) */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.filtersContainer}
              contentContainerStyle={{ paddingRight: 24 }}
            >
              {/* Filtro: Todas */}
              <TouchableOpacity onPress={() => setFiltroAtivo('todas')} activeOpacity={0.8}>
                {filtroAtivo === 'todas' ? (
                  <LinearGradient colors={COLORS.buttonGradient as [string, string]} style={styles.filterPillActive}>
                    <Feather name="camera" size={14} color="#000" style={styles.filterIcon} />
                    <Text style={styles.filterTextActive}>Todas</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.filterPillInactive}>
                    <Feather name="camera" size={14} color={COLORS.textLight} style={styles.filterIcon} />
                    <Text style={styles.filterTextInactive}>Todas</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Filtro: Studio Day */}
              <TouchableOpacity onPress={() => setFiltroAtivo('studio')} activeOpacity={0.8}>
                {filtroAtivo === 'studio' ? (
                  <LinearGradient colors={COLORS.buttonGradient as [string, string]} style={styles.filterPillActive}>
                    <Feather name="camera" size={14} color="#000" style={styles.filterIcon} />
                    <Text style={styles.filterTextActive}>Studio Day</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.filterPillInactive}>
                    <Feather name="camera" size={14} color={COLORS.textLight} style={styles.filterIcon} />
                    <Text style={styles.filterTextInactive}>Studio Day</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Filtro: Missa */}
              <TouchableOpacity onPress={() => setFiltroAtivo('missa')} activeOpacity={0.8}>
                {filtroAtivo === 'missa' ? (
                  <LinearGradient colors={COLORS.buttonGradient as [string, string]} style={styles.filterPillActive}>
                    <Feather name="image" size={14} color="#000" style={styles.filterIcon} />
                    <Text style={styles.filterTextActive}>Missa</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.filterPillInactive}>
                    <Feather name="image" size={14} color={COLORS.textLight} style={styles.filterIcon} />
                    <Text style={styles.filterTextInactive}>Missa</Text>
                  </View>
                )}
              </TouchableOpacity>
            </ScrollView>

            {/* GRID DE MÍDIAS (Galeria) */}
            <View style={styles.mediaGrid}>
              {MIDIAS_MOCK.map((media) => (
                <TouchableOpacity 
                  key={media.id} 
                  style={styles.thumbnailContainer}
                  activeOpacity={0.7}
                >
                  <View style={[globalStyles.card, styles.thumbnailCard]}>
                    {media.tipo === 'foto' ? (
                      <Feather name="image" size={28} color={COLORS.primary} style={{ opacity: 0.8 }} />
                    ) : (
                      // Ícones empilhados para vídeo (Play em cima, filme embaixo)
                      <View style={{ alignItems: 'center' }}>
                        <Feather name="play" size={28} color={COLORS.primary} style={{ marginBottom: 4 }} />
                        <Feather name="film" size={16} color={COLORS.primary} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          /* ESTADO VAZIO: SIMULANDO TELA DE VÍDEOS SEM ARQUIVOS */
          <View style={styles.emptyStateContainer}>
            <Feather name="video-off" size={48} color={COLORS.textLight} style={{ marginBottom: 16, opacity: 0.4 }} />
            <Text style={styles.emptyStateTitle}>Não há arquivos</Text>
            <Text style={styles.emptyStateDesc}>Nenhum vídeo foi disponibilizado para esta categoria ainda.</Text>
          </View>
        )}

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
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  mainActionsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButtonPrimary: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonTextPrimary: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#000',
  },
  actionButtonSecondary: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(221, 130, 65, 0.3)', // Borda laranjinha sutil
  },
  actionButtonTextSecondary: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: COLORS.primary,
  },
  actionIcon: {
    marginRight: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    marginLeft: -24, // Compensa o padding global para a rolagem colar na borda
    paddingLeft: 24,
  },
  filterPillActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  filterPillInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  filterTextActive: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#000',
  },
  filterTextInactive: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textLight,
  },
  filterIcon: {
    marginRight: 6,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16, // Espaço entre linhas e colunas (funciona bem nas versões mais recentes do React Native)
  },
  thumbnailContainer: {
    width: '47%', // Deixa cerca de 6% para o espaço no meio
    aspectRatio: 1, // Mantém o card como um quadrado perfeito automaticamente
  },
  thumbnailCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0, // Zera o padding padrão do globalStyles.card
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // Fundo um pouco mais claro para destacar as mídias vazias
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyStateTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 8,
  },
  emptyStateDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});