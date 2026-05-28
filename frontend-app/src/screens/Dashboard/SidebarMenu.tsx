import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions, Image, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';

const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.85; // A sidebar ocupa 85% da tela

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

// "Contrato" dos botões do Menu
interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  route: string;
  badge?: number;
  isActive?: boolean;
}

// Lista de abas (Fácil de alterar a ordem ou adicionar novas)
const MENU_ITEMS: MenuItem[] = [
  { id: '1', label: 'Dashboard', icon: 'home', route: 'TelaPrincipal', isActive: true },
  { id: '2', label: 'Pagamentos', icon: 'credit-card', route: 'Pagamentos' },
  { id: '3', label: 'Documentos', icon: 'file-text', route: 'Documentos' },
  { id: '4', label: 'Checklist', icon: 'check-square', route: 'Checklist' },
  { id: '5', label: 'Calendário', icon: 'calendar', route: 'Calendario' },
  { id: '6', label: 'Mídias', icon: 'image', route: 'Midias' },
  { id: '7', label: 'Notificações', icon: 'bell', route: 'Notificacoes', badge: 3 },
  { id: '8', label: 'Loja GRAL', icon: 'shopping-bag', route: 'Loja' },
  { id: '9', label: 'Acessibilidade', icon: 'user', route: 'Acessibilidade' },
  { id: '10', label: 'Suporte', icon: 'headphones', route: 'Suporte' },
];

export default function SidebarMenu({ visible, onClose }: SidebarProps) {
  const navigation = useNavigation<any>();

  const handleNavigate = (route: string) => {
    onClose(); // Fecha a sidebar primeiro
    
    // Lista de telas que já existem no nosso arquivo routes/index.tsx
    const telasProntas = ['TelaPrincipal', 'Pagamentos', 'Documentos', 'Calendario', 'Midias'];
    
    if (telasProntas.includes(route)) {
      navigation.navigate(route); // Se a tela já existe, navega normalmente
    } else {
      Alert.alert("Em breve", "Esta funcionalidade estará disponível nas próximas atualizações.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        
        {/* Área escura clicável para fechar (ocupa os 15% restantes da tela direita) */}
        <TouchableOpacity style={styles.closeArea} activeOpacity={1} onPress={onClose} />

        {/* ================= CONTEÚDO DA SIDEBAR ================= */}
        <LinearGradient
          colors={[COLORS.backgroundDark, COLORS.background, COLORS.backgroundDark]}
          locations={Platform.OS === "android" ? [0.0, 0.48, 1.0] : [0.15, 0.5, 0.85]}
          style={styles.sidebarContainer}
        >
          
          {/* HEADER: LOGO E BOTÃO FECHAR */}
          <View style={styles.header}>
            <View style={styles.logoPlaceholder}>
              <Image 
                source={require('../../../assets/GRAL_logo.png')} 
                style={styles.logoImage} 
                resizeMode="contain" 
              />
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
              <Feather name="x" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* PERFIL DO USUÁRIO */}
          <View style={styles.profileCard}>
            <View style={styles.profileTopRow}>
              <View style={styles.avatarBox}>
                <Feather name="user" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Formando(a)</Text>
                <Text style={styles.profileClass}>Turma 2024</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.profileLink} activeOpacity={0.7}>
              <Text style={styles.profileLinkText}>Ver Perfil</Text>
            </TouchableOpacity>
          </View>

          {/* LISTA DE MENU ROLÁVEL */}
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.menuScroll}
          >
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.menuItem, item.isActive && styles.menuItemActive]}
                activeOpacity={0.7}
                onPress={() => handleNavigate(item.route)}
              >
                <Feather 
                  name={item.icon} 
                  size={20} 
                  color={item.isActive ? COLORS.primary : COLORS.textLight} 
                  style={styles.menuIcon} 
                />
                <Text style={[styles.menuText, item.isActive && styles.menuTextActive]}>
                  {item.label}
                </Text>

                {/* Badge Laranja de Notificação */}
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* FOOTER: SAIR E VERSÃO */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.logoutButton} 
              activeOpacity={0.7}
              onPress={() => { onClose(); navigation.replace('Login'); }}
            >
              <Feather name="log-out" size={20} color="#E57373" style={styles.menuIcon} />
              <Text style={styles.logoutText}>Sair da conta</Text>
            </TouchableOpacity>
            <Text style={styles.versionText}>GRAL v1.0.0</Text>
          </View>

        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fundo escurecido atrás da sidebar
  },
  closeArea: {
    flex: 1, // Ocupa o espaço vazio à direita para permitir clique de fechamento
  },
  sidebarContainer: {
    width: SIDEBAR_WIDTH,
    height: height,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 50, // Espaço para a status bar do celular
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  logoPlaceholder: {
    backgroundColor: '#0B2225', // Fundo escuro combinando com o card do LoginScreen
    width: 56,
    height: 56,
    borderRadius: 28, // Mantém perfeitamente redondo
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary, // Cor laranja da paleta
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 0.3, // Mesma transparência da Home
    shadowRadius: 20, // Menos espalhado para ficar proporcional à miniatura
    elevation: 8, 
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)", // Efeito de vidro (Borda translúcida)
  },
  logoImage: {
    width: 36,
    height: 36,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    marginHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    position: 'relative',
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarBox: {
    backgroundColor: '#0B2225', // Fundo escuro igual da logo
    width: 48,
    height: 48,
    borderRadius: 16, // Caixinha arredondada
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16, // Empurra o texto para o lado
    shadowColor: COLORS.primary, // Esfumaçado Laranja
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)', // Borda vidro
  },
  profileInfo: {
    flex: 1, // Faz a informação do texto ocupar o restante do espaço
    justifyContent: 'center',
  },
  profileName: {
    fontFamily: 'Inter_700Bold', // Trocado para Negrito para dar destaque ao lado do ícone
    fontSize: 15,
    color: COLORS.white,
    marginBottom: 2,
  },
  profileClass: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textLight,
  },
  profileLink: {
    width: '100%', // Ocupa toda a caixa do Card
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundDark, // Verde escuro da paleta
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  profileLinkText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.primary,
  },
  menuScroll: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: 'rgba(221, 130, 65, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(221, 130, 65, 0.2)',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textLight,
    flex: 1,
  },
  menuTextActive: {
    color: COLORS.primary,
    fontFamily: 'Inter_700Bold',
  },
  badge: {
    backgroundColor: COLORS.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: '#000',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 115, 115, 0.05)',
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 115, 115, 0.1)',
  },
  logoutText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#E57373', // Tom de vermelho suave para combinar com o dark mode
  },
  versionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: 'center',
    opacity: 0.5,
  }
});