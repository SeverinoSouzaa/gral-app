import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { globalStyles } from '../styles/globalStyles';

interface Props {
  position?: 'top' | 'bottom';
  renderTrigger?: (onPress: () => void) => React.ReactNode;
}

export default function AccessibilityMenu({ position = 'bottom', renderTrigger }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const triggerRef = useRef<View>(null);
  
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [mediaAccess, setMediaAccess] = useState(false);

  const handleOpen = () => {
    if (renderTrigger) {
      // Mede a posição exata (pixel) do botão na tela atual antes de abrir o modal
      triggerRef.current?.measureInWindow((x, y, width, height) => {
        setTriggerLayout({ x, y, width, height });
        setModalVisible(true);
      });
    } else {
      setModalVisible(true);
    }
  };

  return (
    <>
      {renderTrigger ? (
        <View ref={triggerRef} collapsable={false}>
          {renderTrigger(handleOpen)}
        </View>
      ) : (
        <TouchableOpacity 
          style={[styles.fab, globalStyles.glowEffect, globalStyles.glassBorder]} 
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="accessibility-new" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>

          {/* Fundo clicável invisível que fecha o modal ao clicar fora */}
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setModalVisible(false)} />

          <View style={[
            styles.modalContent, 
            position === 'top' && triggerLayout.height > 0
              ? { top: triggerLayout.y + triggerLayout.height + 16 } // Dinâmico logo abaixo do botão (16 de margem)
              : position === 'top' ? styles.contentTop : styles.contentBottom
          ]}>
            
            <View style={styles.header}>
              <Text style={styles.title}>Acessibilidade</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Feather name="x" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.optionCard, highContrast && styles.optionCardActive]}
              onPress={() => setHighContrast(!highContrast)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, highContrast && styles.iconBoxActive]}>
                <Feather name="eye" size={20} color={highContrast ? COLORS.white : COLORS.textLight} />
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.optionTitle}>Aumentar contraste</Text>
                <Text style={styles.optionStatus}>{highContrast ? 'Ativado' : 'Desativado'}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.optionCard, largeText && styles.optionCardActive]}
              onPress={() => setLargeText(!largeText)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, largeText && styles.iconBoxActive]}>
                <Feather name="type" size={20} color={largeText ? COLORS.white : COLORS.textLight} />
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.optionTitle}>Aumentar tamanho do texto</Text>
                <Text style={styles.optionStatus}>{largeText ? 'Aumentado' : 'Normal'}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.optionCard, mediaAccess && styles.optionCardActive]}
              onPress={() => setMediaAccess(!mediaAccess)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, mediaAccess && styles.iconBoxActive]}>
                <Feather name="volume-2" size={20} color={mediaAccess ? COLORS.white : COLORS.textLight} />
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.optionTitle}>Acessibilidade de mídia</Text>
                <Text style={styles.optionStatus}>{mediaAccess ? 'Ativado' : 'Desativado'}</Text>
              </View>
            </TouchableOpacity>

          </View>

          {renderTrigger && triggerLayout.height > 0 && (
            /* Clone dinâmico do botão do topo posicionado perfeitamente acima do fundo escurecido */
            <View style={{ position: 'absolute', top: triggerLayout.y, left: triggerLayout.x }} pointerEvents="box-none">
              {renderTrigger(() => setModalVisible(false))}
            </View>
          )}

          {!renderTrigger && (
            /* Clone do botão de acessibilidade que ficará acima do fundo escurecido */
            <TouchableOpacity 
              style={[styles.fab, globalStyles.glowEffect, globalStyles.glassBorder]} 
              onPress={() => setModalVisible(false)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="accessibility-new" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          )}

        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0B2225',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    position: 'absolute',
    right: 24, // Alinha à direita com o botão perfeitamente
    width: 310, // Limita a largura para parecer um balãozinho
    backgroundColor: '#071A1C',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  contentBottom: {
    bottom: 104, // 32 (espaçamento do botão) + 56 (altura do botão) + 16 de respiro
  },
  contentTop: {
    top: 70, // Ajuste compensando a subida da Tela Principal (100 - 30)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: COLORS.white,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionCardActive: {
    backgroundColor: 'rgba(221, 130, 65, 0.1)',
    borderColor: 'rgba(221, 130, 65, 0.3)',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconBoxActive: {
    backgroundColor: COLORS.primary,
  },
  textWrapper: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 4,
  },
  optionStatus: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textLight,
  },
});