// src/styles/globalStyles.ts
import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export const globalStyles = StyleSheet.create({
  // Container principal usado em quase todas as telas
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 60, // Espaçamento seguro para a barra de status do celular
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