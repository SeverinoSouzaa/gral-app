import React from 'react';
import { StatusBar, View } from 'react-native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { AccessibilityProvider } from './src/contexts/AccessibilityContext';

// Importando o nosso mapa de rotas
import Routes from './src/routes';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  // Função que esconde a tela de carregamento quando a fonte carrega
  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync(); // É aqui que a mágica de esconder acontece!
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AccessibilityProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
        <Routes />
      </View>
    </AccessibilityProvider>
  );
}