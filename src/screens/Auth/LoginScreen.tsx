import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';

export default function LoginScreen() {
  return (
    <View style={globalStyles.container}>
      
      <View style={styles.header}>
        <View style={styles.logoPlaceholder} />
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

        <TouchableOpacity style={globalStyles.button}>
          <Text style={globalStyles.buttonText}>CONFIRMAR LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueceu seu acesso?</Text>
        </TouchableOpacity>

      </View>

      <Text style={styles.footerText}>Sistema seguro • Dados protegidos</Text>

      <TouchableOpacity style={styles.accessibilityFab}>
        <Feather name="user" size={24} color={COLORS.primary} />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.secondary,
    borderRadius: 40,
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