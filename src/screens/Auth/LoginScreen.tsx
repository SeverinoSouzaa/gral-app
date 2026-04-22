import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient 
        colors={[COLORS.backgroundDark, COLORS.background, COLORS.backgroundDark]}
        locations={[0.15, 0.5, 0.85]} // Controla onde as cores ficam: 15% (topo), 50% (meio), 85% (base)
        style={[globalStyles.container, { backgroundColor: 'transparent' }]}
      >

        <View style={styles.header}>
          <Image 
            source={require('../../../assets/GRAL_logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={globalStyles.title}>
            Bem-vindo a <Text style={styles.highlightText}>GRAL</Text>
          </Text>
          <Text style={globalStyles.subtitle}>Faça login para continuar</Text>
        </View>

        <View style={styles.formContainer}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Código da Turma</Text>
            <Text style={styles.subLabel}>Digite o código de 5 dígitos da sua turma</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="12345"
                placeholderTextColor={COLORS.textLight}
                keyboardType="numeric"
              />
              <Feather name="check-circle" size={20} color={COLORS.primary} style={styles.icon} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CPF</Text>
            <Text style={styles.subLabel}>Informe seu CPF no formato 000.000.000-00</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="028.447.472-05"
                placeholderTextColor={COLORS.textLight}
                keyboardType="numeric"
              />
              <Feather name="check-circle" size={20} color={COLORS.primary} style={styles.icon} />
              <Feather name="eye" size={20} color={COLORS.textLight} style={styles.icon} />
            </View>
          </View>

          <TouchableOpacity>
            <LinearGradient
              colors={COLORS.buttonGradient as [string, string]}
              start={{ x: 0, y: 0 }} // Início do gradiente (topo)
              end={{ x: 0, y: 1 }}   // Fim do gradiente (base)
              style={globalStyles.button}
            >
              <Text style={globalStyles.buttonText}>CONFIRMAR LOGIN</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu seu acesso?</Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.footerText}>Sistema seguro • Dados protegidos</Text>

        <TouchableOpacity style={styles.accessibilityFab}>
          <Feather name="user" size={24} color={COLORS.primary} />
        </TouchableOpacity>

      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  highlightText: {
    color: COLORS.primary,
  },
  formContainer: {
    backgroundColor: '#0B2225',
    padding: 24,
    borderRadius: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.white,
    fontSize: 14,
    marginBottom: 4,
  },
  subLabel: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textLight,
    fontSize: 12,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  icon: {
    marginLeft: 12,
  },
  forgotPassword: {
    marginTop: 24,
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textLight,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textLight,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 24,
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
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});