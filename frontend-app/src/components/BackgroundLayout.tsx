import React, { ReactNode } from 'react';
import { View, Dimensions, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { globalStyles } from '../styles/globalStyles';
import AccessibilityMenu from './AccessibilityMenu';
import { useAccessibility } from '../contexts/AccessibilityContext';

const { width, height } = Dimensions.get("window");

interface Props {
  children: ReactNode;
  hideAccessibility?: boolean;
}

export default function BackgroundLayout({ children, hideAccessibility = false }: Props) {
  const { isHighContrast } = useAccessibility();

  return (
    <View style={{ flex: 1, backgroundColor: isHighContrast ? '#000000' : COLORS.backgroundDark }}>
      {/* Fundo Descolado Travado (Desligado em Alto Contraste) */}
      {!isHighContrast && (
        <LinearGradient
          colors={[
            COLORS.backgroundDark,
            COLORS.background,
            COLORS.backgroundDark,
          ]}
          locations={
            Platform.OS === "android" ? [0.0, 0.48, 1.0] : [0.15, 0.5, 0.85]
          }
          style={{ position: "absolute", width, height, top: 0, left: 0 }}
        />
      )}
      
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView
          style={[
            globalStyles.container,
            { backgroundColor: "transparent", flex: 1 },
          ]}
        >
          {children}
        </SafeAreaView>
      </ScrollView>

      {!hideAccessibility && <AccessibilityMenu />}
    </View>
  );
}
