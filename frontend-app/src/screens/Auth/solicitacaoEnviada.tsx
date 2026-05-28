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
        <View style={[globalStyles.card, styles.card]}>
          
          <View style={styles.iconContainer}>
            <Feather name="check-circle" size={50} color="#4CAF50" />
          </View>

          <Text style={[globalStyles.title, { marginBottom: 26, textAlign: 'center', color: COLORS.textLight} ]}>Solicitação Enviada</Text>

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
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    marginTop: -130, // Move toda a caixa para cima, igual ao Recuperar Acesso
    paddingTop: 115, // Estica a parte de cima
    paddingBottom: 50, // Mantém a altura da base
    paddingHorizontal: 28, // Faz o conteúdo respirar
    borderRadius: 28, // Bordas arredondadas consistentes
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: -35, // Puxa o ícone (e textos) para mais perto do topo, igual a outra tela
    marginBottom: 25,
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
    color: COLORS.textLight,
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
});