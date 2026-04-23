import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { globalStyles } from "../../styles/globalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AccessibilityMenu from "../../components/AccessibilityMenu";

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      bounces={false}
      overScrollMode="never"
    >
      <LinearGradient
        colors={[
          COLORS.backgroundDark,
          COLORS.background,
          COLORS.backgroundDark,
        ]}
        locations={[0.15, 0.5, 0.85]}
        style={[globalStyles.container, { backgroundColor: "transparent" }]}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/GRAL_logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={globalStyles.title}>
            Bem-vindo a <Text style={styles.highlightText}>GRAL</Text>
          </Text>
          <Text style={globalStyles.subtitle}>Faça login para continuar</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Código da Turma</Text>
            <Text style={styles.subLabel}>
              Digite o código de 5 dígitos da sua turma
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="12345"
                placeholderTextColor={COLORS.textLight}
                keyboardType="numeric"
              />
              <Feather
                name="check-circle"
                size={20}
                color={COLORS.primary}
                style={styles.icon}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CPF</Text>
            <Text style={styles.subLabel}>
              Informe seu CPF no formato 000.000.000-00
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="028.447.472-05"
                placeholderTextColor={COLORS.textLight}
                keyboardType="numeric"
              />
              <Feather
                name="check-circle"
                size={20}
                color={COLORS.primary}
                style={styles.icon}
              />
              <Feather
                name="eye"
                size={20}
                color={COLORS.primary}
                style={styles.icon}
              />
            </View>
          </View>

          <TouchableOpacity onPress={() => navigation.replace("TelaPrincipal")}>
            <LinearGradient
              colors={COLORS.buttonGradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={globalStyles.button}
            >
              <Text
                style={[
                  globalStyles.buttonText,
                  { color: COLORS.backgroundDark },
                ]}
              >
                CONFIRMAR LOGIN
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("RecuperarAcesso")}
          >
            <Text style={styles.forgotPasswordText}>Esqueceu seu acesso?</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Sistema seguro • Dados protegidos</Text>

        <AccessibilityMenu />

        {/* HACK DE TESTE: REMOVER DEPOIS */}
        <TouchableOpacity 
          style={{ marginTop: 10, alignSelf: 'center', padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }}
          onPress={() => navigation.navigate('Documentos')}
        >
          <Text style={{ color: COLORS.white }}>Ir para Documentos (Teste)</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    backgroundColor: COLORS.backgroundDarklight, // Fundo mais escuro combinando com o topo
    width: 120,
    height: 120,
    borderRadius: 60, // Deixa perfeitamente redondo
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: COLORS.primary, // Cor laranja da paleta
    shadowOffset: { width: 0, height: 0 }, // Sombra centralizada, criando o efeito de esfumaçado
    shadowOpacity: 0.3, // Leve transparência
    shadowRadius: 30, // Deixa o esfumaçado mais espalhado e suave (iOS)
    elevation: 12, // Reduzido para o Android não "empurrar" o esfumaçado muito para baixo
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)", // Borda branca translúcida fina (efeito vidro)
  },
  logo: {
    width: 80,
    height: 80,
  },
  highlightText: {
    color: COLORS.primary,
  },
  formContainer: {
    backgroundColor: "#0B2225",
    padding: 24,
    borderRadius: 24,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: "Inter_400Regular",
    color: COLORS.white,
    fontSize: 14,
    marginBottom: 4,
  },
  subLabel: {
    fontFamily: "Inter_400Regular",
    color: COLORS.textLight,
    fontSize: 12,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  icon: {
    marginLeft: 12,
  },
  forgotPassword: {
    marginTop: 24,
    alignItems: "center",
  },
  forgotPasswordText: {
    fontFamily: "Inter_400Regular",
    color: COLORS.textLight,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  footerText: {
    fontFamily: "Inter_400Regular",
    color: COLORS.textLight,
    fontSize: 12,
    textAlign: "center",
    marginTop: "auto",
    marginBottom: 24,
  },
});
