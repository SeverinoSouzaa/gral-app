import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { globalStyles } from '../../styles/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { api } from '../../services/api';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import ConfirmModal from '../../components/ConfirmModal';

export default function DocumentosScreen() {
  const navigation = useNavigation<any>();
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [fotoDoc, setFotoDoc] = useState<any>(null);
  const [canudoDoc, setCanudoDoc] = useState<any>(null);

  // States dos modais customizados
  const [confirmPhotoVisible, setConfirmPhotoVisible] = useState(false);
  const [selectedFotoUri, setSelectedFotoUri] = useState<string | null>(null);
  const [confirmNameVisible, setConfirmNameVisible] = useState(false);
  
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusModalConfig, setStatusModalConfig] = useState({ title: '', desc: '', icon: 'info' as any });

  const { textMultiplier, isHighContrast } = useAccessibility();

  const showStatus = (title: string, desc: string, icon: any) => {
    setStatusModalConfig({ title, desc, icon });
    setStatusModalVisible(true);
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) return;
      
      const docs = await api.documentos.me(token);
      
      const foto = docs.find((d: any) => d.tipoDocumento === 'FRAME_PHOTO');
      const canudo = docs.find((d: any) => d.tipoDocumento === 'CAP_NAME');
      
      setFotoDoc(foto || null);
      setCanudoDoc(canudo || null);
      
      if (canudo && canudo.valorConteudo) {
        const parts = canudo.valorConteudo.split(' ');
        setNome(parts[0] || '');
        setSobrenome(parts.slice(1).join(' ') || '');
      }
    } catch (error) {
      console.log('Erro ao buscar docs', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    if (fotoDoc && fotoDoc.status !== 'REJEITADO') return; // Bloqueia clique se já está pendente/aprovado
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      showStatus('Permissão negada', 'Precisamos de acesso às suas fotos!', 'x-circle');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setSelectedFotoUri(uri);
      setConfirmPhotoVisible(true);
    }
  };

  const confirmarEnviarFoto = async () => {
    if (!selectedFotoUri) return;
    setConfirmPhotoVisible(false);
    
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      await api.documentos.uploadFile(token!, 'FRAME_PHOTO', selectedFotoUri);
      showStatus('Sucesso', 'Sua foto foi enviada e está sob avaliação.', 'check-circle');
      fetchDocumentos();
    } catch (error) {
      showStatus('Erro', 'Não foi possível enviar a foto.', 'x-circle');
      setLoading(false);
    }
  };

  const enviarNomeCanudo = () => {
    if (!nome.trim() || !sobrenome.trim()) {
      showStatus('Atenção', 'Preencha o nome e sobrenome.', 'alert-triangle');
      return;
    }
    setConfirmNameVisible(true);
  };

  const confirmarEnviarNomeCanudo = async () => {
    setConfirmNameVisible(false);
    
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      const nomeCompleto = `${nome.trim()} ${sobrenome.trim()}`;
      await api.documentos.uploadText(token!, 'CAP_NAME', nomeCompleto);
      showStatus('Sucesso', 'Seu nome foi enviado para avaliação.', 'check-circle');
      fetchDocumentos();
    } catch (error) {
      showStatus('Erro', 'Não foi possível enviar o nome.', 'x-circle');
      setLoading(false);
    }
  };

  const renderFotoStatus = () => {
    if (!fotoDoc) {
      return (
        <>
          <View style={styles.cameraGlow}>
            <Feather name="camera" size={28} color={COLORS.primary} />
          </View>
          <Text style={[styles.uploadTitle, { fontSize: 14 * textMultiplier }]}>Toque para selecionar</Text>
          <Text style={[styles.uploadSubtitle, { fontSize: 12 * textMultiplier }]}>Formatos aceitos: JPG, PNG</Text>
        </>
      );
    }

    if (fotoDoc.status === 'PENDENTE') {
      return (
        <>
          <View style={[styles.cameraGlow, { borderColor: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
            <Feather name="clock" size={28} color="#F59E0B" />
          </View>
          <Text style={[styles.uploadTitle, { color: '#F59E0B', fontSize: 14 * textMultiplier }]}>Em Avaliação</Text>
          <Text style={[styles.uploadSubtitle, { fontSize: 12 * textMultiplier }]}>Aguarde a Equipe Interna aprovar.</Text>
        </>
      );
    }

    if (fotoDoc.status === 'APROVADO') {
      return (
        <>
          <View style={[styles.cameraGlow, { borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
            <Feather name="check-circle" size={28} color="#10B981" />
          </View>
          <Text style={[styles.uploadTitle, { color: '#10B981', fontSize: 14 * textMultiplier }]}>Foto Aprovada!</Text>
          <Text style={[styles.uploadSubtitle, { fontSize: 12 * textMultiplier }]}>Tudo certo com a sua foto do quadro.</Text>
        </>
      );
    }

    if (fotoDoc.status === 'REJEITADO') {
      return (
        <>
          <View style={[styles.cameraGlow, { borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <Feather name="alert-circle" size={28} color="#EF4444" />
          </View>
          <Text style={[styles.uploadTitle, { color: '#EF4444', fontSize: 14 * textMultiplier }]}>Foto Rejeitada</Text>
          <Text style={[styles.uploadSubtitle, { color: '#FCA5A5', textAlign: 'center', marginHorizontal: 20, fontSize: 12 * textMultiplier }]}>
            {fotoDoc.motivoRejeicao || 'Sua foto não atendeu aos critérios.'}
          </Text>
          <Text style={[styles.uploadSubtitle, { color: COLORS.white, marginTop: 8, textDecorationLine: 'underline', fontSize: 12 * textMultiplier }]}>
            Toque para enviar outra foto
          </Text>
        </>
      );
    }
  };

  const renderCanudoFields = () => {
    // Se estiver Pendente ou Aprovado, os inputs são bloqueados para edição
    const isLocked = canudoDoc && (canudoDoc.status === 'PENDENTE' || canudoDoc.status === 'APROVADO');
    
    return (
      <View style={[globalStyles.card, styles.glowCard, isLocked && { opacity: 0.8 }, isHighContrast && { backgroundColor: '#111', borderColor: COLORS.primary }]} pointerEvents={isLocked ? 'none' : 'auto'}>
        {canudoDoc && canudoDoc.status === 'REJEITADO' && (
           <View style={styles.rejectAlertBox}>
             <Feather name="alert-triangle" size={16} color="#EF4444" style={{marginRight: 6}} />
             <Text style={styles.rejectAlertText}>
               Rejeitado: {canudoDoc.motivoRejeicao}
             </Text>
           </View>
        )}
        
        {canudoDoc && canudoDoc.status === 'PENDENTE' && (
           <View style={[styles.rejectAlertBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: '#F59E0B' }]}>
             <Feather name="clock" size={16} color="#F59E0B" style={{marginRight: 6}} />
             <Text style={[styles.rejectAlertText, { color: '#FCD34D' }]}>Nome em avaliação.</Text>
           </View>
        )}

        {canudoDoc && canudoDoc.status === 'APROVADO' && (
           <View style={[styles.rejectAlertBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: '#10B981' }]}>
             <Feather name="check" size={16} color="#10B981" style={{marginRight: 6}} />
             <Text style={[styles.rejectAlertText, { color: '#6EE7B7' }]}>Nome aprovado com sucesso!</Text>
           </View>
        )}

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

        <View style={{ marginTop: 8 }}>
          {!isLocked && (
            <PrimaryButton 
              title="ENVIAR NOME" 
              onPress={enviarNomeCanudo} 
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[{ flex: 1 }, isHighContrast ? { backgroundColor: '#000000' } : {}]}>
      {!isHighContrast && (
        <LinearGradient 
          colors={[COLORS.backgroundDark, COLORS.background, COLORS.backgroundDark]}
          locations={[0.15, 0.5, 0.85]} 
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <View style={[globalStyles.container, { backgroundColor: 'transparent' }]}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      <View style={styles.container}>
      
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <Text style={[globalStyles.title, { textAlign: 'left', marginTop: 16, fontSize: 28 * textMultiplier }]}>
          Documentos
        </Text>
        <Text style={[globalStyles.subtitle, { textAlign: 'left', marginBottom: 32, fontSize: 16 * textMultiplier }]}>
          Acompanhe seus documentos obrigatórios
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: 14 * textMultiplier }]}>1. Foto do Quadro</Text>
          <Text style={[styles.sectionSubtitle, { fontSize: 12 * textMultiplier }]}>Envie uma foto de rosto.</Text>
        
          <TouchableOpacity 
            style={[globalStyles.card, styles.uploadCard, styles.glowCard, isHighContrast && { backgroundColor: '#111', borderColor: COLORS.primary }]} 
            activeOpacity={0.8}
            onPress={handlePickImage}
          >
            {renderFotoStatus()}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: 14 * textMultiplier }]}>2. Nome para o canudo</Text>
          <Text style={[styles.sectionSubtitle, { fontSize: 12 * textMultiplier }]}>Como você quer ser chamado?</Text>
        
          {renderCanudoFields()}
        </View>

      </View>
      </View>
      
      <ConfirmModal 
        visible={confirmPhotoVisible}
        title="Enviar Foto"
        description="Tem certeza que deseja enviar esta foto para avaliação?"
        confirmText="Sim, enviar"
        cancelText="Cancelar"
        iconName="image"
        onConfirm={confirmarEnviarFoto}
        onCancel={() => setConfirmPhotoVisible(false)}
      />

      <ConfirmModal 
        visible={confirmNameVisible}
        title="Confirmar Nome"
        description={`Seu nome para o canudo será:\n"${nome.trim()} ${sobrenome.trim()}"\n\nDeseja enviar para aprovação?`}
        confirmText="Sim, confirmar"
        cancelText="Cancelar"
        iconName="type"
        onConfirm={confirmarEnviarNomeCanudo}
        onCancel={() => setConfirmNameVisible(false)}
      />

      <ConfirmModal 
        visible={statusModalVisible}
        title={statusModalConfig.title}
        description={statusModalConfig.desc}
        iconName={statusModalConfig.icon}
        hideCancel={true}
        confirmText="Entendido"
        onConfirm={() => setStatusModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20, 
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
    shadowColor: COLORS.backgroundDark, 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, 
    shadowRadius: 20, 
    elevation: 8, 
  },
  uploadCard: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(11, 34, 37, 0.6)', 
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  rejectAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  rejectAlertText: {
    fontFamily: 'Inter_400Regular',
    color: '#FCA5A5',
    fontSize: 12,
    flex: 1,
  }
});