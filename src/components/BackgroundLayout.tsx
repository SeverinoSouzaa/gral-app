import React, { ReactNode } from 'react';
import { View, Dimensions, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { globalStyles } from '../styles/globalStyles';

const { width, height } = Dimensions.get('window');

interface Props {
  children: ReactNode;
}

export default function BackgroundLayout({ children }: Props) {
  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }} 
      keyboardShouldPersistTaps="handled"
      bounces={false}
      overScrollMode="never"
    >
      <View style={{ flex: 1 }}>
        {/* Fundo Descolado Travado (Exatamente o da sua LoginScreen) */}
        <LinearGradient 
          colors={[COLORS.backgroundDark, COLORS.background, COLORS.backgroundDark]}
          locations={Platform.OS === 'android' ? [0.0, 0.48, 1.0] : [0.15, 0.5, 0.85]} 
          style={{ position: 'absolute', width, height, top: 0, left: 0 }}
        />
        <SafeAreaView style={[globalStyles.container, { backgroundColor: 'transparent', flex: 1 }]}>
          {children}
        </SafeAreaView>
      </View>
    </ScrollView>
  );
}