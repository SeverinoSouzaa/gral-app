import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import BackgroundLayout from "../../components/BackgroundLayout";
import PrimaryButton from "../../components/PrimaryButton";
import InputField from "../../components/InputField";
import { globalStyles } from "../../styles/globalStyles";

export default function RecuperarAcesso() {
  const [email, setEmail] = useState("");
  const navigation = useNavigation<any>();

  return (
    <BackgroundLayout>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.card, { width: '100%' }]}>
              
              {/* BOTÃO VOLTAR */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Feather name="arrow-left" size={18} color={COLORS.primary} />
              </TouchableOpacity>

              {/* ÍCONE */}
              <View style={styles.iconContainer}>
                <Feather name="mail" size={28} color={COLORS.primary} />
              </View>

              {/* TÍTULO */}
              <Text style={styles.title}>Recuperar Acesso</Text>

              {/* SUBTÍTULO */}
              <Text style={styles.subtitle}>
                Digite o email cadastrado{"\n"}pelo administrador
              </Text>

              {/* CARD INFORMATIVO */}
              <View style={styles.infoBox}>
                <Feather name="alert-circle" size={18} color={COLORS.primary} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.infoTitle}>Solicitação manual</Text>
                  <Text style={styles.infoText}>
                    O administrador receberá sua solicitação e enviará as
                    instruções de recuperação para o email cadastrado.
                  </Text>
                </View>
              </View>

              <InputField 
                label="Email cadastrado"
                placeholder="seuemail@gmail.com"
                keyboardType="email-address"
                iconName="mail"
                value={email}
                onChangeText={setEmail}
              />

              {/* BOTÃO */}
              <PrimaryButton title="Enviar solicitação" onPress={() => navigation.navigate("solicitacaoEnviada")} />
            </View>
          </ScrollView>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },

 backButton: {
  position: "absolute",
  top: 30,          
  left: 28, // Alinhado com o padding interno da caixa para ficar harmônico

  width: 38,
  height: 38,

  backgroundColor: "#071A1C", 
  borderRadius: 10,

  justifyContent: "center",
  alignItems: "center",

  shadowColor: COLORS.primary,
  shadowOpacity: 0.2,
  shadowRadius: 10,

  elevation: 6,
  zIndex: 10,
},

  card: {
    backgroundColor: "#0B2225",
    borderRadius: 28,
    marginTop: -130, // Move toda a caixa um pouco mais para cima
    paddingTop: 115, // Deixa a parte de cima ainda maior
    paddingBottom: 50, // Mantém a altura da base como estava antes
    paddingHorizontal: 28, // Faz o conteúdo respirar mais internamente
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  iconContainer: {
    alignSelf: "center",
    marginTop: -35, // Puxa o ícone (e os textos que vêm abaixo dele) para mais perto do topo
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,140,0,0.1)",
    marginBottom: 16,
  },

  title: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },

  subtitle: {
    textAlign: "center",
    color: COLORS.textLight,
    fontSize: 14,
    marginBottom: 20,
  },

  infoBox: {
    flexDirection: "row",
    backgroundColor: "rgba(255,140,0,0.08)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,140,0,0.2)",
  },

  infoTitle: {
    color: COLORS.white,
    fontSize: 14,
    marginBottom: 4,
  },

  infoText: {
    color: COLORS.textLight,
    fontSize: 12,
  },
});
