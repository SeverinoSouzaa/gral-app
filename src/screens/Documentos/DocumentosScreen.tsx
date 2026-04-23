import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';

export default function DocumentosScreen() {
  const navigation = useNavigation<any>();
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');

  return (
    <LinearGradient 
      colors={[COLORS.backgroundDark, COLORS.background, COLORS.backgroundDark]}
      locations={[0.15, 0.5, 0.85]} 
      style={globalStyles.container}
    >
      <View style={styles.container}>
      
        {/* Cabeçalho: Botão Voltar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Títulos principais (Alinhados à esquerda, sobrescrevendo o estilo global) */}
        <Text style={[globalStyles.title, { textAlign: 'left', marginTop: 16 }]}>
          Documentos
        </Text>
        <Text style={[globalStyles.subtitle, { textAlign: 'left', marginBottom: 32 }]}>
          Envie seus documentos obrigatórios
        </Text>

        {/* SEÇÃO 1: Upload de Imagem */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Foto do Quadro</Text>
          <Text style={styles.sectionSubtitle}>Envie uma foto de rosto.</Text>
        
          <TouchableOpacity style={[globalStyles.card, styles.uploadCard, styles.glowCard]} activeOpacity={0.8}>
            <View style={styles.cameraGlow}>
              <Feather name="camera" size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.uploadTitle}>Toque para selecionar</Text>
            <Text style={styles.uploadSubtitle}>Formatos aceitos: JPG, PNG</Text>
          </TouchableOpacity>
        </View>

        {/* SEÇÃO 2: Inputs de Nome */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Nome para o canudo</Text>
          <Text style={styles.sectionSubtitle}>Como você quer ser chamado?</Text>
        
          <View style={[globalStyles.card, styles.glowCard]}>
            <InputField 
              label="Nome" 
              subLabel="Digite seu primeiro nome" 
              placeholder="Ex: Lucas"
              value={nome}
              onChangeText={setNome}
            />
          
            <InputField 
              label="Sobrenome" 
              subLabel="Digite seu sobrenome" 
              placeholder="Ex: Alves"
              value={sobrenome}
              onChangeText={setSobrenome}
            />

            {/* O botão fica com estilo primário. Se os campos estiverem vazios, ele pode ficar mais transparente no futuro */}
            <View style={{ marginTop: 8 }}>
              <PrimaryButton 
                title="REVISAR DADOS" 
                onPress={() => console.log("Revisar clicado")} 
              />
            </View>
          </View>
        </View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20, // Espaço básico na base apenas
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.white,
    fontSize: 14,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textLight,
    fontSize: 12,
    marginBottom: 16,
  },
  glowCard: {
    shadowColor: COLORS.backgroundDark, // Verde super escuro da paleta
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, // Suave e sutil
    shadowRadius: 20, // Bem espalhadinho para o efeito 3D
    elevation: 8, // Equivalente suave no Android
  },
  uploadCard: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(11, 34, 37, 0.6)', // Um pouco mais transparente para dar destaque à câmera
  },
  cameraGlow: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(221, 130, 65, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(221, 130, 65, 0.2)',
    // Efeito de brilho
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  uploadTitle: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.white,
    fontSize: 14,
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textLight,
    fontSize: 12,
  },
});