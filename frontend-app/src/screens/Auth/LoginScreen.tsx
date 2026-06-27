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
import { api } from "../../services/api";
import * as SecureStore from 'expo-secure-store';
import BackgroundLayout from '../../components/BackgroundLayout';
import { useAccessibility } from '../../contexts/AccessibilityContext';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [codigoTurma, setCodigoTurma] = React.useState("");
  const [cpf, setCpf] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const { textMultiplier, isHighContrast } = useAccessibility();

  const handleCpfChange = (text: string) => {
    // Máscara de CPF: 000.000.000-00
    let masked = text.replace(/\D/g, "");
    if (masked.length > 11) {
      masked = masked.substring(0, 11);
    }
    masked = masked.replace(/(\d{3})(\d)/, "$1.$2");
    masked = masked.replace(/(\d{3})(\d)/, "$1.$2");
    masked = masked.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpf(masked);
  };

  const handleLogin = async () => {
    if (!codigoTurma || !cpf) {
      setErrorMsg("Preencha ambos os campos.");
      return;
    }
    
    setLoading(true);
    setErrorMsg("");

    try {
      const cpfNumeros = cpf.replace(/\D/g, "");
      const response = await api.login(cpfNumeros, codigoTurma);
      console.log("Login OK, salvando Token...");
      
      // Salva o JWT no SecureStore
      await SecureStore.setItemAsync('userToken', response.accessToken);
      
      // Navega para a tela principal
      navigation.replace("TelaPrincipal");
    } catch (err: any) {
      if (err.message === 'Credenciais inválidas') {
        setErrorMsg("Código ou CPF incorretos.");
      } else if (err.message === 'TIMEOUT_ERROR') {
        setErrorMsg(__DEV__ 
          ? "Demora na resposta! Verifique se o IP LOCAL_URL no api.ts está correto." 
          : "O servidor na nuvem está acordando. Tente novamente em 15 segundos!");
      } else {
        setErrorMsg("Erro de conexão. Verifique se o servidor está ligado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      bounces={false}
      overScrollMode="never"
    >
      <View style={[{ flex: 1 }, isHighContrast ? { backgroundColor: '#000000' } : {}]}>
        {!isHighContrast && (
          <LinearGradient
            colors={[
              COLORS.backgroundDark,
              COLORS.background,
              COLORS.backgroundDark,
            ]}
            locations={[0.15, 0.5, 0.85]}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        <View style={[globalStyles.container, { backgroundColor: "transparent" }]}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/GRAL_logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={[globalStyles.title, { fontSize: 28 * textMultiplier }]}>Bem-vindo a <Text style={{ color: COLORS.primary }}>GRAL</Text></Text>
          <Text style={[globalStyles.subtitle, { fontSize: 16 * textMultiplier }]}>Faça login para continuar</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontSize: 14 * textMultiplier }]}>Código da Turma</Text>
            <Text style={[styles.subLabel, { fontSize: 12 * textMultiplier }]}>
              Digite o código de 5 dígitos da sua turma
            </Text>
            <View style={[styles.inputWrapper, isHighContrast && { backgroundColor: '#111', borderColor: COLORS.primary, borderWidth: 1 }]}>
              <TextInput
                style={[styles.input, { fontSize: 14 * textMultiplier }]}
                placeholder="00000"
                placeholderTextColor={COLORS.textLight}
                keyboardType="numeric"
                value={codigoTurma}
                onChangeText={setCodigoTurma}
              />
              {codigoTurma.length === 5 && (
                <Feather
                  name="check-circle"
                  size={20}
                  color={COLORS.primary}
                  style={styles.icon}
                />
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontSize: 14 * textMultiplier }]}>CPF</Text>
            <Text style={[styles.subLabel, { fontSize: 12 * textMultiplier }]}>
              Informe seu CPF de 11 dígitos
            </Text>
            <View style={[styles.inputWrapper, isHighContrast && { backgroundColor: '#111', borderColor: COLORS.primary, borderWidth: 1 }]}>
              <TextInput
                style={[styles.input, { fontSize: 14 * textMultiplier }]}
                placeholder="000.000.000-00"
                placeholderTextColor={COLORS.textLight}
                keyboardType="numeric"
                value={cpf}
                onChangeText={handleCpfChange}
                maxLength={14}
              />
              {cpf.replace(/\D/g, "").length === 11 && (
                <Feather
                  name="check-circle"
                  size={20}
                  color={COLORS.primary}
                  style={styles.icon}
                />
              )}
            </View>
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <TouchableOpacity onPress={handleLogin} disabled={loading}>
            <LinearGradient
              colors={COLORS.buttonGradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[globalStyles.button, loading && { opacity: 0.7 }]}
            >
              <Text
                style={[
                  globalStyles.buttonText,
                  { color: COLORS.backgroundDark, fontSize: 16 * textMultiplier },
                ]}
              >
                {loading ? "CARREGANDO..." : "CONFIRMAR LOGIN"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("RecuperarAcesso")}
          >
            <Text style={[styles.forgotPasswordText, { fontSize: 14 * textMultiplier }]}>Esqueceu seu acesso?</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.footerText, { fontSize: 12 * textMultiplier }]}>Sistema seguro • Dados protegidos</Text>

        <AccessibilityMenu />
        </View>
      </View>
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
  errorText: {
    fontFamily: "Inter_400Regular",
    color: "#ff4d4d",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
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
