// App.tsx
import React from 'react';
import { StatusBar } from 'react-native';
import { 
  useFonts, 
  Inter_400Regular, 
  Inter_700Bold 
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

// Impede que a tela de carregamento (splash) suma antes da fonte estar pronta
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Carrega as fontes do Google
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  // Função que esconde a tela de carregamento quando tudo estiver pronto
  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Retorna nulo enquanto a fonte baixa (o Expo mostra a splash screen)
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0F2D2D" />
      {/* Aqui dentro colocaremos o nosso sistema de rotas e telas no futuro */}
    </>
  );
}