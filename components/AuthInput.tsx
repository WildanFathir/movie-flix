/**
 * AuthInput Component
 * Input for login/register forms
 */

import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface AuthInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
}

export function AuthInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
}: AuthInputProps) {
  return (
    <View className="mb-5 w-full">
      <Text className="mb-2 text-base font-semibold text-gray-800">{label}</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800"
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        editable={true}
      />
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
}
