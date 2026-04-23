import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importando as telas
import LoginScreen from '../screens/Auth/LoginScreen';
import RecuperarAcesso from '../screens/Auth/RecuperarAcesso';
import solicitacaoEnviadaScreen from '../screens/Auth/solicitacaoEnviada';

import DocumentosScreen from '../screens/Documentos/DocumentosScreen';

import TelaPrincipal from '../screens/Dashboard/TelaPrincipal';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Login" component={LoginScreen} />
        
        <Stack.Screen name="RecuperarAcesso" component={RecuperarAcesso} />

        <Stack.Screen name="solicitacaoEnviada" component={solicitacaoEnviadaScreen} />
        
        <Stack.Screen name="Documentos" component={DocumentosScreen} />

        <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}