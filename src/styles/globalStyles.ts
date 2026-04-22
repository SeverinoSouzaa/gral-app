// src/styles/globalStyles.ts
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { COLORS } from '../constants/colors';

export const globalStyles = StyleSheet.create({
  // Container principal usado em quase todas as telas
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    // No iOS mantém os 60. No Android, calcula a altura exata da barra e adiciona um espaço proporcional
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 60,
  },

  card: {
    backgroundColor: '#0B2225',
    padding: 24,
    borderRadius: 24, // Bordas arredondadas estilo Apple
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    width: '100%',
  },
  // Efeito de Esfumaçado Laranja (Glow) reaproveitável para qualquer tela
  glowEffect: Platform.select({
    ios: {
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4, // Um pouco mais opaco para dar presença
      shadowRadius: 20,   // Menos espalhado para ficar em volta do botão
    },
    android: {
      elevation: 10, // Ajustado para não criar uma sombra preta excessiva e focar no brilho
      shadowColor: COLORS.primary, // Define a cor do esfumaçado no Android
    }
  }) as any,

  // Efeito de borda de vidro (Glassmorphism) reaproveitável
  glassBorder: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  
  // Padrões de Texto usando a fonte Inter
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 32,
  },
  
  // Padronização do arredondamento (Estilo Clean/Minimalista)
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  buttonText: {
    fontFamily: 'Inter_700Bold',
    color: COLORS.white,
    fontSize: 16,
    textTransform: 'uppercase', // Deixa o texto do botão sempre maiúsculo
  }
});