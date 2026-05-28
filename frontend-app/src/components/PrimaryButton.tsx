import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { globalStyles } from '../styles/globalStyles';

interface Props {
  title: string;
  onPress: () => void;
}

export default function PrimaryButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ width: '100%' }}>
      <LinearGradient
        colors={COLORS.buttonGradient as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={globalStyles.button}
      >
        <Text style={[globalStyles.buttonText, { color: COLORS.backgroundDark }]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}