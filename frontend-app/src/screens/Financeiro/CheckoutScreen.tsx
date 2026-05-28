import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // Pegando a parcela que foi passada pela tela anterior
  const { parcela } = route.params || {};

  // Configuração da animação de deslize (começa lá embaixo, fora da tela)
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  useEffect(() => {
    // Assim que a tela abre, o card sobe até a posição 0 (posição original)
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const closeModal = () => {
    // Anima a caixa descendo de volta para fora da tela antes de fechar a rota
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => navigation.goBack());
  };

  return (
    <View style={styles.modalOverlay}>
      
      {/* Área transparente em cima para fechar ao clicar fora (Opcional) */}
      <TouchableOpacity 
        style={styles.touchableBackground} 
        activeOpacity={1} 
        onPress={closeModal} 
      />

      {/* Conteúdo do Bottom Sheet */}
      <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.modalTitle}>Escolha a forma de pagamento</Text>
        
        {parcela && (
          <Text style={styles.modalSubtitle}>
            Parcela {parcela.numero}/{parcela.totalParcelas} - R$ {parcela.valor.toFixed(2)}
          </Text>
        )}

        {/* OPÇÃO PIX */}
        <TouchableOpacity style={styles.methodCard} activeOpacity={0.7}>
          <LinearGradient colors={COLORS.buttonGradient as [string, string]} style={styles.methodIconBg}>
            <Feather name="copy" size={20} color="#000" />
          </LinearGradient>
          <View style={styles.methodTextContainer}>
            <Text style={styles.methodTitle}>Pagar via PIX</Text>
            <Text style={styles.methodDesc}>Confirmação em minutos</Text>
          </View>
          <Feather name="chevron-right" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        {/* OPÇÃO CARTÃO */}
        <TouchableOpacity style={styles.methodCard} activeOpacity={0.7}>
          <LinearGradient colors={COLORS.buttonGradient as [string, string]} style={styles.methodIconBg}>
            <Feather name="credit-card" size={20} color="#000" />
          </LinearGradient>
          <View style={styles.methodTextContainer}>
            <Text style={styles.methodTitle}>Pagar via Cartão</Text>
            <Text style={styles.methodDesc}>Crédito ou débito</Text>
          </View>
          <Feather name="chevron-right" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        {/* BOTÃO CANCELAR */}
        <TouchableOpacity 
          style={styles.cancelButton} 
          activeOpacity={0.7}
          onPress={closeModal}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </Animated.View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  touchableBackground: {
    flex: 1, // Preenche todo o espaço vazio em cima
  },
  modalContent: {
    backgroundColor: '#071A1C',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalTitle: { fontFamily: 'Inter_400Regular', fontSize: 16, color: COLORS.white, marginBottom: 4 },
  modalSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textLight, marginBottom: 24 },
  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: 16, marginBottom: 12 },
  methodIconBg: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  methodTextContainer: { flex: 1 },
  methodTitle: { fontFamily: 'Inter_400Regular', fontSize: 15, color: COLORS.white, marginBottom: 4 },
  methodDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textLight },
  cancelButton: { marginTop: 16, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', backgroundColor: 'rgba(255, 255, 255, 0.01)' },
  cancelButtonText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.primary }
});