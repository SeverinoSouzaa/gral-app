import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import BackgroundLayout from '../../components/BackgroundLayout';
import PrimaryButton from '../../components/PrimaryButton';

export default function ConfirmacaoEnvioScreen() {
  const navigation = useNavigation<any>();

  return (
    <BackgroundLayout>
      <View style={styles.content}>
        <View style={globalStyles.card}>
          
          <View style={styles.iconContainer}>
            <Feather name="check-circle" size={50} color="#4CAF50" />
          </View>

          <Text style={[globalStyles.title, { marginBottom: 24 }]}>Solicitação Enviada</Text>

          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              Sua solicitação foi enviada ao administrador. Aguarde o retorno por email em até 24 horas.
            </Text>
          </View>

          <View style={styles.emailBox}>
            <Text style={styles.emailLabel}>Email cadastrado:</Text>
            <Text style={styles.emailValue}>amandainvestings@gmail.com</Text>
          </View>

          <PrimaryButton
            title="Voltar para o Login"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.accessibilityFab}>
        <MaterialIcons name="accessibility-new" size={28} color={COLORS.primary} />
      </TouchableOpacity>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  messageBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  messageText: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
  },
  emailBox: {
    backgroundColor: '#071A1C',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  emailLabel: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textLight,
    fontSize: 12,
    marginBottom: 4,
  },
  emailValue: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.primary,
    fontSize: 14,
  },
  accessibilityFab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0B2225',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.11)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});