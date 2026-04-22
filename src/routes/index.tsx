import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importando as telas
import LoginScreen from '../screens/Auth/LoginScreen';
import RecuperarAcesso from '../screens/Auth/RecuperarAcesso';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* 👇 ADICIONA ISSO */}
        <Stack.Screen name="RecuperarAcesso" component={RecuperarAcesso} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}