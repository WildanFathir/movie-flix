/**
 * Button Component
 * Reusable button with loading state
 */

import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-400',
    danger: 'bg-red-600',
  };

  const isDisabledState = disabled || isLoading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabledState}
      className={`${variantClasses[variant]} rounded-lg py-3 px-4 items-center flex-row justify-center ${
        isDisabledState ? 'opacity-50' : ''
      }`}
    >
      {isLoading && <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />}
      <Text className="text-white font-semibold text-base">{title}</Text>
    </TouchableOpacity>
  );
}
