import { AuthInput } from '@/components/AuthInput';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { useAuthValidation } from '@/hooks/useAuthValidation';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login, error, clearError, isAuthenticated } = useAuth();
  const { validationError, clearValidationError } = useAuthValidation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect saat login berhasil
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🎉 Login successful! Redirecting...');
      setIsLoading(false);
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    return () => {
      clearError();
      clearValidationError();
    };
  }, [clearError, clearValidationError]);

  const handleLogin = () => {
    setIsLoading(true);
    // Synchronous - langsung cek hardcoded credentials
    login(email, password);

    // Delay untuk user lihat loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex flex-col items-center justify-center flex-1 w-full gap-12 px-6">
        {/* Header */}
        <View className="flex flex-col items-center w-full">
          <Text className="text-4xl font-bold text-gray-900">MovieFlix</Text>
          <Text className="mt-2 text-lg text-gray-600">Welcome back!</Text>
        </View>

        <View className="flex flex-col items-center w-full gap-6">
          {/* Error Messages */}
          {Boolean(error || validationError) && (
            <View className="flex items-center w-full p-4 bg-red-100 rounded-lg">
              <Text className="font-medium text-red-700">{`${error || validationError}`}</Text>
            </View>
          )}

          {/* Success Message - saat isLoading */}
          {isLoading && !error && !validationError && (
            <View className="p-4 bg-green-100 rounded-lg">
              <Text className="font-medium text-green-700">Logging in...</Text>
            </View>
          )}

          {/* Form */}
          <View className="w-full">
            <AuthInput
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
            />

            <AuthInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Login Button */}
            <Button
              title="Login"
              onPress={handleLogin}
              isLoading={isLoading}
              disabled={isLoading}
            />
          </View>

          {/* Divider */}
          <View className="flex-row items-center">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-3 text-gray-500">atau</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Register Link */}
          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <View className="flex-row items-center justify-center">
              <Text className="text-center text-gray-700">Belum punya akun? </Text>
              <Text className="font-bold text-blue-600">Daftar di sini</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
