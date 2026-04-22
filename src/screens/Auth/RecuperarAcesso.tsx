import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function RecuperarAcesso() {
  const [email, setEmail] = useState("");
  const navigation = useNavigation<any>();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={[
          COLORS.backgroundDark,
          COLORS.background,
          COLORS.backgroundDark,
        ]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.card, { width: width * 0.9 }]}>
              
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

              {/* INPUT */}
              <Text style={styles.label}>Email cadastrado</Text>

              <View style={styles.inputWrapper}>
                <Feather name="mail" size={18} color={COLORS.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="seuemail@gmail.com"
                  placeholderTextColor={COLORS.textLight}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* BOTÃO */}
              <TouchableOpacity activeOpacity={0.8}>
                <LinearGradient
                  colors={COLORS.buttonGradient as [string, string]}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Enviar solicitação</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* FAB */}
          <TouchableOpacity style={styles.accessibilityFab}>
            <MaterialIcons
              name="accessibility-new"
              size={26}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    marginTop: -15,
  },

 backButton: {
  position: "absolute",
  top: 30,          
  left: 25,

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
    padding: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  iconContainer: {
    alignSelf: "center",
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

  label: {
    color: COLORS.textLight,
    marginBottom: 8,
    fontSize: 13,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.white,
  },

  button: {
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },

  accessibilityFab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0B2225",
    justifyContent: "center",
    alignItems: "center",
  },
});
