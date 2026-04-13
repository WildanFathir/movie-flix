import { AuthInput } from '@/components/AuthInput';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { useAuthValidation } from '@/hooks/useAuthValidation';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, error, isAuthenticated, clearError } = useAuth();
  const { validationError, clearValidationError, validateRegisterForm } = useAuthValidation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect saat register berhasil
  useEffect(() => {
    if (isAuthenticated) {
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

  const handleRegister = () => {
    if (!validateRegisterForm(name, email, password, confirmPassword)) {
      return;
    }

    setIsLoading(true);

    // Synchronous
    register(name, email, password);

    // Delay untuk show loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex flex-col items-center justify-center flex-1 w-full gap-12 px-6">
        {/* Header */}
        <View className="flex items-center w-full">
          <Text className="text-4xl font-bold text-gray-900">MovieFlix</Text>
          <Text className="mt-2 text-lg text-gray-600">Buat akun baru</Text>
        </View>

        <View className="flex flex-col items-center w-full gap-6">
          {/* Error Messages */}
          {Boolean(error || validationError) && (
            <View className="flex items-center w-full p-4 bg-red-100 rounded-lg">
              <Text className="font-medium text-red-700">{error || validationError}</Text>
            </View>
          )}

          {/* Form */}
          <View className="w-full">
            <AuthInput
              label="Nama Lengkap"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
            />

            <AuthInput
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
            />

            <AuthInput
              label="Password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <AuthInput
              label="Konfirmasi Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            {/* Register Button */}
            <Button
              title="Daftar"
              onPress={handleRegister}
              isLoading={isLoading}
              disabled={isLoading}
            />
          </View>

          {/* Login Link */}
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24 }}>
            <Text className="text-center text-gray-700">
              Sudah punya akun? <Text className="font-bold text-blue-600">Login di sini</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
