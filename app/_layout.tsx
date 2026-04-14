import '@/assets/css/nativewind.css';
import { useAuthStore } from '@/store/authStore';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Keep splash screen visible
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [appIsReady, setAppIsReady] = useState(false);

  // Initialize app
  const prepare = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      console.log('✅ App initialized');
    } catch (e) {
      console.warn('❌ App init error:', e);
    } finally {
      setAppIsReady(true);
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    prepare();
  }, []);

  // Show loading screen while app is initializing
  if (!appIsReady) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Debug auth state
  console.log('🔐 Current auth state:', {
    isAuthenticated,
    user: user?.name,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {isAuthenticated ? (
        <Stack key="app" screenOptions={{ animation: 'none', headerShown: false }}>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              animation: 'none',
            }}
          />
          <Stack.Screen
            name="movie/[id]"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      ) : (
        <Stack key="auth" screenOptions={{ animation: 'none', headerShown: false }}>
          <Stack.Screen
            name="auth"
            options={{
              headerShown: false,
              animation: 'none',
            }}
          />
        </Stack>
      )}
    </GestureHandlerRootView>
  );
}
