import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AccessibilityContextData {
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  isLargeText: boolean;
  toggleLargeText: () => void;
  textMultiplier: number;
}

const AccessibilityContext = createContext<AccessibilityContextData>({} as AccessibilityContextData);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);

  useEffect(() => {
    // Carregar preferências salvas
    async function loadPreferences() {
      const savedContrast = await SecureStore.getItemAsync('accessibility_contrast');
      const savedLargeText = await SecureStore.getItemAsync('accessibility_large_text');
      if (savedContrast === 'true') setIsHighContrast(true);
      if (savedLargeText === 'true') setIsLargeText(true);
    }
    loadPreferences();
  }, []);

  const toggleHighContrast = async () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    await SecureStore.setItemAsync('accessibility_contrast', String(newValue));
  };

  const toggleLargeText = async () => {
    const newValue = !isLargeText;
    setIsLargeText(newValue);
    await SecureStore.setItemAsync('accessibility_large_text', String(newValue));
  };

  const textMultiplier = isLargeText ? 1.2 : 1.0;

  return (
    <AccessibilityContext.Provider value={{
      isHighContrast,
      toggleHighContrast,
      isLargeText,
      toggleLargeText,
      textMultiplier
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
