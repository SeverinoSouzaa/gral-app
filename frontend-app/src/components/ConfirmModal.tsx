import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { globalStyles } from '../styles/globalStyles';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  iconName?: keyof typeof Feather.glyphMap;
  hideCancel?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

const { width } = Dimensions.get('window');

export default function ConfirmModal({
  visible,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  iconName = "info",
  hideCancel = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { textMultiplier, isHighContrast } = useAccessibility();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.modalContainer, 
          isHighContrast && { backgroundColor: '#000000', borderColor: COLORS.primary, borderWidth: 1 }
        ]}>
          {!isHighContrast && (
            <LinearGradient
              colors={[COLORS.backgroundDark, COLORS.background]}
              style={[StyleSheet.absoluteFillObject, { borderRadius: 24 }]}
            />
          )}
          
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Feather name={iconName} size={32} color={COLORS.primary} />
            </View>

            <Text style={[styles.title, { fontSize: 20 * textMultiplier }]}>{title}</Text>
            <Text style={[styles.description, { fontSize: 14 * textMultiplier }]}>{description}</Text>

            <View style={styles.buttonContainer}>
              {!hideCancel && (
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton, isHighContrast && { borderColor: 'rgba(255, 255, 255, 0.2)' }]} 
                  onPress={onCancel}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.cancelButtonText, { fontSize: 14 * textMultiplier }]}>{cancelText}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={[styles.button, styles.confirmButton]} 
                onPress={onConfirm}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={COLORS.buttonGradient as [string, string]}
                  style={[StyleSheet.absoluteFillObject, { borderRadius: 12 }]}
                />
                <Text style={[styles.confirmButtonText, { fontSize: 14 * textMultiplier }]}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: width - 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(221, 130, 65, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(221, 130, 65, 0.2)',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    color: COLORS.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  confirmButton: {
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.white,
  },
  confirmButtonText: {
    fontFamily: 'Inter_700Bold',
    color: '#000',
  }
});
