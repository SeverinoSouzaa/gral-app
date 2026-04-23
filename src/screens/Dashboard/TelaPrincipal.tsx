import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import BackgroundLayout from "../../components/BackgroundLayout";

export default function TelaPrincipal() {
  return (
    <BackgroundLayout>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="menu" size={22} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons
              name="accessibility-new"
              size={22}
              color={COLORS.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Feather name="bell" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* TEXTO */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.title}>
          Olá, <Text style={{ color: COLORS.primary }}>formando(a)!</Text>
        </Text>
        <Text style={styles.subtitle}>
          Aqui está sua formatura organizada em um só lugar.
        </Text>
      </View>

      {/* MENU */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.menuRow}
      >
        <View style={styles.menuItem}>
          <Feather name="file-text" size={18} color={COLORS.primary} />
          <Text style={styles.menuText}>Documentos</Text>
        </View>

        <View style={styles.menuItem}>
          <Feather name="bell" size={18} color={COLORS.primary} />
          <Text style={styles.menuText}>Avisos</Text>
        </View>

        <View style={styles.menuItem}>
          <Feather name="credit-card" size={18} color={COLORS.primary} />
          <Text style={styles.menuText}>Pagamentos</Text>
        </View>
      </ScrollView>

      {/* EVENTO */}
      <View style={styles.card}>
          <View style={styles.topBorder} />
        <Text style={styles.cardTitle}>Próximos Eventos</Text>

        <View style={styles.eventBox}>
          <View style={styles.dateBox}>
            <Text style={styles.dateDay}>18</Text>
            <Text style={styles.dateMonth}>NOV</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.eventTitle}>Reunião da Comissão</Text>
            <Text style={styles.eventSubtitle}>Às 19h00 • Online</Text>
          </View>

          <Feather name="chevron-right" size={20} color={COLORS.primary} />
        </View>
      </View>

      {/* PAGAMENTOS */}
      <View style={styles.card}>
        <View style={styles.topBorder} />
        <Text style={styles.cardTitle}>Pagamentos</Text>

        <Text style={styles.status}>
          Status atual: <Text style={{ color: "lime" }}>Em dia</Text>
        </Text>

        <View style={styles.rowBetween}>
          <Text style={styles.subtitleSmall}>Contribuição</Text>
          <Text style={styles.subtitleSmall}>7/12 parcelas</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        <TouchableOpacity style={styles.buttonOutline}>
          <Text style={styles.buttonText}>Ver detalhes</Text>
        </TouchableOpacity>
      </View>

      {/* CHECKLIST */}
      <View style={styles.card}>
        <View style={styles.topBorder} />
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Checklist</Text>
          <Text style={styles.count}>2/3</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        <View style={styles.checkItem}>
          <Feather name="check-circle" size={18} color={COLORS.primary} />
          <Text style={styles.checkText}>Enviar documento de identidade</Text>
        </View>

        <View style={styles.checkItem}>
          <Feather name="check-circle" size={18} color={COLORS.primary} />
          <Text style={styles.checkText}>Escolher foto do convite</Text>
        </View>

        <View style={styles.checkItem}>
          <Feather name="circle" size={18} color="gray" />
          <Text style={styles.checkText}>Confirmar presença na reunião</Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.link}>Abrir checklist completo →</Text>
        </TouchableOpacity>
      </View>

      {/* MIDIAS */}
      <View style={styles.card}>
        <View style={styles.topBorder} />
        <Text style={styles.cardTitle}>Mídias</Text>

        <View style={styles.mediaRow}>
          <View style={styles.mediaBox}>
            <Feather name="image" size={22} color={COLORS.primary} />
          </View>

          <View style={styles.mediaBox}>
            <Feather name="play" size={22} color={COLORS.primary} />
          </View>

          <View style={styles.mediaBox}>
            <Feather name="image" size={22} color={COLORS.primary} />
          </View>
        </View>

        <TouchableOpacity>
          <Text style={styles.link}>Ver todas →</Text>
        </TouchableOpacity>
      </View>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
    marginTop: -20,
  },

  rightIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  iconButton: {
    backgroundColor: "#0B2225",
    padding: 22,
    borderRadius: 35,
    shadowColor: COLORS.primary,
  },

  title: {
    fontFamily: "Inter_400Regular",
    color: COLORS.white,
    fontSize: 26,
    marginBottom: 5,
    marginTop: 10,

    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },

  subtitle: {
    fontFamily: "Inter_400Regular",
    color: COLORS.textLight,
    fontSize: 18,
    marginBottom: 5,
  },

  subtitleSmall: {
    fontFamily: "Inter_400Regular",
    color: COLORS.textLight,
    textAlign: "right",
    fontSize: 12,
    marginBottom: 6,
  },

  menuRow: {
    flexDirection: "row",
    paddingRight: 10,
    marginBottom: 30,
  },

  menuItem: {
    backgroundColor: "#0B2225",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 28,
    alignItems: "center",
    width: 120,
    marginRight: 10,

    shadowColor: COLORS.backgroundDark,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.0,
    shadowRadius: 10,
    elevation: 10,
  },

  menuText: {
    fontFamily: "Inter_400Regular",
    color: COLORS.white,
    fontSize: 14,
    marginTop: 10,
  },

 card: {
  backgroundColor: "#0B2225",
  padding: 28,
  borderRadius: 20,
  marginBottom: 20,
  position: "relative", 
},

topBorder: {
  position: "absolute",
  top: 0,
  alignSelf: "center",

  width: 150, // controla o tamanho da barrinha
  height: 1,
  backgroundColor: COLORS.primary,

  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
},

  cardTitle: {
    fontFamily: "Inter_700Bold",
    color: COLORS.white,
    marginBottom: 10,
  },

  count: {
    color: COLORS.textLight,
    fontFamily: "Inter_400Regular",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  eventBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  dateBox: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },

  dateDay: {
    fontWeight: "bold",
  },

  dateMonth: {
    fontSize: 10,
  },

  eventTitle: {
    color: COLORS.white,
    fontFamily: "Inter_400Regular",
  },

  eventSubtitle: {
    color: COLORS.textLight,
    fontSize: 12,
  },

  status: {
    color: COLORS.textLight,
    marginBottom: 5,
  },

  progressBar: {
    height: 6,
    backgroundColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },

  progressFill: {
    width: "60%",
    height: "100%",
    backgroundColor: COLORS.primary,
  },

  buttonOutline: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: COLORS.primary,
    fontFamily: "Inter_700Bold",
  },

  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  checkText: {
    color: COLORS.white,
    marginLeft: 10,
    fontFamily: "Inter_400Regular",
  },

  link: {
    color: COLORS.primary,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginTop: 10,
  },

  mediaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  mediaBox: {
    backgroundColor: "#071A1C",
    width: "30%",
    height: 70,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
