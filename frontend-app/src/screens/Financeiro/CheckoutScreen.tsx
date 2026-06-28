import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Image, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { api } from '../../services/api';
import { COLORS } from '../../constants/colors';

interface PixData {
  qrCodeImageBase64: string;
  pixCopiaECola: string;
  txid: string;
}

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const { parcela, token } = route.params || {};

  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => navigation.goBack());
  };

  const handleGerarPix = async () => {
    if (!parcela) return;
    try {
      setLoadingPix(true);
      if (!token) throw new Error('Usuário não autenticado');

      const response = await api.finance.payParcela(token, Number(parcela.id), 'PIX', parcela.valor);
      
      setPixData({
        qrCodeImageBase64: response.transacaoGateway.qrCodeImage,
        pixCopiaECola: response.transacaoGateway.qrCodeText,
        txid: response.transacaoGateway.transactionId,
      });
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erro no Pagamento', error.message || 'Falha ao processar pagamento via PIX');
    } finally {
      setLoadingPix(false);
    }
  };

  const copyToClipboard = async () => {
    if (pixData?.pixCopiaECola) {
      await Clipboard.setStringAsync(pixData.pixCopiaECola);
      Alert.alert('Copiado!', 'Código Pix Copia e Cola enviado para a área de transferência.');
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity 
        style={styles.touchableBackground} 
        activeOpacity={1} 
        onPress={closeModal} 
      />

      <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.modalTitle}>
          {pixData ? 'Pagamento via PIX' : 'Escolha a forma de pagamento'}
        </Text>
        
        {parcela && !pixData && (
          <Text style={styles.modalSubtitle}>
            Parcela {parcela.numero}/{parcela.totalParcelas} - R$ {parcela.valor.toFixed(2)}
          </Text>
        )}

        {pixData ? (
          // =================== TELA DO QR CODE ===================
          <View style={styles.qrCodeContainer}>
            <Text style={styles.qrCodeInstructions}>
              Escaneie o QR Code abaixo com o app do seu banco ou copie o código para pagar.
            </Text>
            
            <View style={styles.imageWrapper}>
              <Image 
                source={{ uri: pixData.qrCodeImageBase64 }} 
                style={styles.qrCodeImage} 
                resizeMode="contain"
              />
            </View>

            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard} activeOpacity={0.8}>
              <LinearGradient colors={COLORS.buttonGradient as [string, string]} style={styles.copyButtonGradient}>
                <Feather name="copy" size={20} color="#000" style={{ marginRight: 8 }} />
                <Text style={styles.copyButtonText}>Copiar Código Pix</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton} 
              activeOpacity={0.7}
              onPress={closeModal}
            >
              <Text style={styles.cancelButtonText}>Voltar aos pagamentos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // =================== TELA DE ESCOLHA ===================
          <>
            <TouchableOpacity 
              style={styles.methodCard} 
              activeOpacity={0.7}
              onPress={handleGerarPix}
              disabled={loadingPix}
            >
              <LinearGradient colors={COLORS.buttonGradient as [string, string]} style={styles.methodIconBg}>
                {loadingPix ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <Feather name="copy" size={20} color="#000" />
                )}
              </LinearGradient>
              <View style={styles.methodTextContainer}>
                <Text style={styles.methodTitle}>Pagar via PIX</Text>
                <Text style={styles.methodDesc}>Confirmação em minutos</Text>
              </View>
              <Feather name="chevron-right" size={20} color={COLORS.primary} />
            </TouchableOpacity>


            <TouchableOpacity 
              style={styles.cancelButton} 
              activeOpacity={0.7}
              onPress={closeModal}
              disabled={loadingPix}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.65)' },
  touchableBackground: { flex: 1 },
  modalContent: { backgroundColor: '#071A1C', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  modalTitle: { fontFamily: 'Inter_400Regular', fontSize: 16, color: COLORS.white, marginBottom: 4 },
  modalSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textLight, marginBottom: 24 },
  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: 16, marginBottom: 12 },
  methodIconBg: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  methodTextContainer: { flex: 1 },
  methodTitle: { fontFamily: 'Inter_400Regular', fontSize: 15, color: COLORS.white, marginBottom: 4 },
  methodDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textLight },
  cancelButton: { marginTop: 16, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', backgroundColor: 'rgba(255, 255, 255, 0.01)' },
  cancelButtonText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.primary },
  
  // Estilos do QR Code
  qrCodeContainer: { alignItems: 'center', marginTop: 16 },
  qrCodeInstructions: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginBottom: 24 },
  imageWrapper: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 24, shadowColor: '#FFF', shadowOpacity: 0.1, shadowRadius: 10 },
  qrCodeImage: { width: 200, height: 200 },
  copyButton: { width: '100%', height: 48, borderRadius: 12, overflow: 'hidden', marginBottom: 8 },
  copyButtonGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  copyButtonText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#000' }
});