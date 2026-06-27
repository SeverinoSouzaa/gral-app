import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import BackgroundLayout from '../../components/BackgroundLayout';
import { useAccessibility } from '../../contexts/AccessibilityContext';

// Dados mockados para exibição (simulando as informações coletadas na reunião)
const DADOS_PERFIL = {
  nome: 'Lucas Alves da Silva',
  turma: 'T2024 - Engenharia de Software',
  codigoTurma: '12345',
  email: 'lucas.alves@exemplo.com',
  cpf: '028.447.472-05',
  telefone: '(11) 98765-4321',
  dataAdesao: '15/03/2023',
};

const { width } = Dimensions.get('window');

export default function PerfilScreen() {
  const navigation = useNavigation<any>();
  const { textMultiplier, isHighContrast } = useAccessibility();

  const renderInfoCard = (icon: keyof typeof Feather.glyphMap, label: string, value: string) => (
    <View style={[styles.infoCard, isHighContrast && { backgroundColor: '#111', borderColor: COLORS.primary }]}>
      <View style={styles.iconWrapper}>
        <Feather name={icon} size={20} color={COLORS.primary} />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={[styles.infoLabel, { fontSize: 12 * textMultiplier }]}>{label}</Text>
        <Text style={[styles.infoValue, { fontSize: 14 * textMultiplier }]} numberOfLines={2}>
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <BackgroundLayout>
      <View style={styles.container}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: 16 * textMultiplier }]}>Meu Perfil</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* FOTO E NOME (SIMPLES, SEM IMAGEM) */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarPlaceholder}>
              <Feather name="user" size={48} color={COLORS.primary} />
            </View>
            <Text style={[styles.profileName, { fontSize: 24 * textMultiplier }]}>{DADOS_PERFIL.nome}</Text>
            <Text style={[styles.profileClass, { fontSize: 14 * textMultiplier }]}>{DADOS_PERFIL.turma}</Text>
          </View>

          {/* DADOS CADASTRAIS */}
          <Text style={[styles.sectionTitle, { fontSize: 16 * textMultiplier }]}>Dados Cadastrais</Text>
          <View style={styles.infoGrid}>
            {renderInfoCard('hash', 'Código da Turma', DADOS_PERFIL.codigoTurma)}
            {renderInfoCard('credit-card', 'CPF', DADOS_PERFIL.cpf)}
            {renderInfoCard('mail', 'E-mail', DADOS_PERFIL.email)}
            {renderInfoCard('smartphone', 'Telefone', DADOS_PERFIL.telefone)}
            {renderInfoCard('calendar', 'Data de Adesão', DADOS_PERFIL.dataAdesao)}
          </View>

          {/* AVISO / SUPORTE */}
          <View style={[styles.supportBox, isHighContrast && { backgroundColor: '#111', borderColor: COLORS.primary, borderWidth: 1 }]}>
            <Feather name="info" size={24} color={COLORS.textLight} style={{ marginBottom: 12 }} />
            <Text style={[styles.supportText, { fontSize: 14 * textMultiplier }]}>
              As suas informações são registradas presencialmente com a nossa equipe. 
              Caso necessite alterar algum de seus dados (como E-mail ou Telefone), entre em contato com o suporte!
            </Text>
            
            <TouchableOpacity 
              style={styles.supportButton}
              activeOpacity={0.7}
              onPress={() => {
                // Aqui no futuro poderia levar pra tela de Suporte
              }}
            >
              <Text style={[styles.supportButtonText, { fontSize: 14 * textMultiplier }]}>Falar com o Suporte</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -35,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    color: COLORS.white,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#0B2225',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(221, 130, 65, 0.2)', // Borda sutil laranja
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  profileName: {
    fontFamily: 'Inter_700Bold',
    color: COLORS.white,
    marginBottom: 4,
    textAlign: 'center',
  },
  profileClass: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textLight,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.white,
    marginBottom: 16,
    marginTop: 8,
  },
  infoGrid: {
    gap: 12,
    marginBottom: 32,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(221, 130, 65, 0.1)', // Fundo translúcido da cor primária
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.white,
  },
  supportBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  supportText: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  supportButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  supportButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.primary,
  }
});
