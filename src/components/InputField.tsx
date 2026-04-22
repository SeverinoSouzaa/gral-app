import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface Props {
  label: string;
  subLabel?: string;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  iconName?: keyof typeof Feather.glyphMap;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function InputField({ label, subLabel, placeholder, keyboardType = 'default', iconName, value, onChangeText }: Props) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
      
      <View style={styles.inputWrapper}>
        {/* Se o input for pra email, o ícone fica na esquerda. Senão, fica o padrão. */}
        {iconName === 'mail' && <Feather name="mail" size={18} color={COLORS.primary} style={{ marginRight: 10 }} />}
        
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
        />
        
        {/* Ícone de check para os inputs da direita (como na LoginScreen) */}
        {iconName === 'check-circle' && <Feather name="check-circle" size={20} color={COLORS.primary} style={styles.icon} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: COLORS.backgroundDark,
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
});