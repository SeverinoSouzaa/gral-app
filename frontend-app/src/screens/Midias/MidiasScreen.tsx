import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { COLORS } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import BackgroundLayout from '../../components/BackgroundLayout';
import { api } from '../../services/api';

// Interface do retorno real da API
interface Evento {
  id: number;
  nomeEvento: string;
}

interface MidiaAPI {
  id: number;
  arquivo: string;
  tipo: 'IMAGE' | 'VIDEO';
  evento: Evento;
}

export default function MidiasScreen() {
  const navigation = useNavigation<any>();
  const [midias, setMidias] = useState<MidiaAPI[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para controlar o filtro ativo ('todas' ou nome do evento)
  const [filtroAtivo, setFiltroAtivo] = useState<string>('todas');
  // Estado para alternar entre os tipos de mídia
  const [abaAtiva, setAbaAtiva] = useState<'tudo' | 'videos'>('tudo');

  useEffect(() => {
    loadMidias();
  }, []);

  const loadMidias = async () => {
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) return;
      
      const data: MidiaAPI[] = await api.midias.getMidias(token);
      setMidias(data);

      // Extrair dinamicamente as categorias (nomes dos eventos que tem mídia)
      const nomesEventos = Array.from(new Set(data.map(m => m.evento.nomeEvento)));
      setCategorias(nomesEventos);
    } catch (error) {
      console.error('Erro ao carregar mídias:', error);
      Alert.alert('Erro', 'Não foi possível carregar suas mídias');
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (arquivo: string) => {
    // Se o usuário inseriu uma URL completa no banco (ex: via Prisma Studio)
    if (arquivo.startsWith('http')) return arquivo;
    // Se for arquivo local do servidor
    return `http://192.168.80.106:3000/uploads/midias/${arquivo}`;
  };

  const handleDownload = async (tipo: 'tudo' | 'videos') => {
    try {
      Alert.alert('Iniciando Download', 'Seu pacote ZIP está sendo gerado. Isso pode demorar alguns segundos...');
      const token = await SecureStore.getItemAsync('userToken');
      const baseUrl = 'http://192.168.80.106:3000/api/v1';
      
      const endpoint = tipo === 'tudo' ? `${baseUrl}/midias/download-zip` : `${baseUrl}/midias/download-zip?tipo=video`;
      const fileName = tipo === 'tudo' ? 'midias-todas.zip' : 'midias-videos.zip';
      const fileUri = FileSystem.documentDirectory + fileName;

      const downloadRes = await FileSystem.downloadAsync(endpoint, fileUri, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (downloadRes.status !== 200) {
        throw new Error('Falha no backend');
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadRes.uri);
      } else {
        Alert.alert('Sucesso', 'Download concluído!');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível fazer o download do ZIP.');
    }
  };

  // Aplica os filtros na listagem
  const midiasFiltradas = midias.filter(media => {
    // 1. Filtro da aba (tudo ou videos)
    if (abaAtiva === 'videos' && media.tipo !== 'VIDEO') return false;
    
    // 2. Filtro da pílula (evento)
    if (filtroAtivo !== 'todas' && media.evento.nomeEvento !== filtroAtivo) return false;

    return true;
  });

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
            onPress={() => { setAbaAtiva('tudo'); handleDownload('tudo'); }}
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
            onPress={() => { setAbaAtiva('videos'); handleDownload('videos'); }}
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

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : midias.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 24, borderRadius: 60, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
              <Feather name="image" size={56} color={COLORS.primary} style={{ opacity: 0.8 }} />
            </View>
            <Text style={styles.emptyStateTitle}>Ainda sem memórias</Text>
            <Text style={styles.emptyStateDesc}>Nenhuma foto ou vídeo foi disponibilizado para a sua turma ainda.</Text>
          </View>
        ) : (
          <>
            {/* FILTROS DINÂMICOS (Rolagem Horizontal) */}
            <View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.filtersContainer}
                contentContainerStyle={{ paddingRight: 24 }}
              >
                {/* Filtro: Todas (Sempre fixo) */}
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

                {/* Filtros Dinâmicos extraídos dos eventos */}
                {categorias.map(categoria => (
                  <TouchableOpacity key={categoria} onPress={() => setFiltroAtivo(categoria)} activeOpacity={0.8}>
                    {filtroAtivo === categoria ? (
                      <LinearGradient colors={COLORS.buttonGradient as [string, string]} style={styles.filterPillActive}>
                        <Feather name="image" size={14} color="#000" style={styles.filterIcon} />
                        <Text style={styles.filterTextActive}>{categoria}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.filterPillInactive}>
                        <Feather name="image" size={14} color={COLORS.textLight} style={styles.filterIcon} />
                        <Text style={styles.filterTextInactive}>{categoria}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* GRID DE MÍDIAS (Galeria) */}
            {midiasFiltradas.length === 0 ? (
               <View style={styles.emptyStateContainer}>
                 <Feather name="video-off" size={48} color={COLORS.textLight} style={{ marginBottom: 16, opacity: 0.4 }} />
                 <Text style={styles.emptyStateTitle}>Nenhum resultado</Text>
                 <Text style={styles.emptyStateDesc}>Nenhuma mídia encontrada para este filtro.</Text>
               </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.mediaGrid}>
                  {midiasFiltradas.map((media) => (
                    <TouchableOpacity 
                      key={media.id.toString()} 
                      style={styles.thumbnailContainer}
                      activeOpacity={0.7}
                    >
                      <View style={[globalStyles.card, styles.thumbnailCard]}>
                        {media.tipo === 'IMAGE' ? (
                          <Image 
                            source={{ uri: getImageUrl(media.arquivo) }} 
                            style={{ width: '100%', height: '100%', borderRadius: 12 }} 
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
                            <Feather name="play" size={28} color={COLORS.primary} style={{ marginBottom: 4 }} />
                            <Feather name="film" size={16} color={COLORS.primary} />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}
          </>
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
    borderColor: 'rgba(221, 130, 65, 0.3)',
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
    marginLeft: -24,
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
    gap: 16,
  },
  thumbnailContainer: {
    width: '47%',
    aspectRatio: 1,
  },
  thumbnailCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyStateTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: COLORS.white,
    marginBottom: 8,
  },
  emptyStateDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 22,
  },
});