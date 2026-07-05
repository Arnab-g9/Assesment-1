import { useEffect, useState } from 'react';
import { Stack, DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { storage } from '../services/storage';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = storage.getString('@theme_preference');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setColorScheme(savedTheme);
      } else {
        setColorScheme('dark');
      }
    } catch (e) {
      // Ignore
    } finally {
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return null; // Or a splash screen
  }
  
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="detail/[id]" 
              options={{ 
                headerShown: false
              }} 
            />
          </Stack>
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
