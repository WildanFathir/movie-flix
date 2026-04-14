/**
 * Favorites Screen
 * Menampilkan daftar film favorit user
 */

import { useMovies } from '@/hooks/useMovies';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

const FavoritesScreen = () => {
  const { favorites, removeFavorite } = useMovies();

  return (
    <View className="flex-1 bg-white">
      {favorites.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-500 mt-4 text-center">
            Belum ada film favorit{'\n'}Tambahkan film yang kamu sukai!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="font-bold text-lg">{item.title}</Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Rating: {item.vote_average.toFixed(1)}/10
                </Text>
              </View>
              <TouchableOpacity onPress={() => removeFavorite(item.id)} className="ml-2 p-2">
                <Ionicons name="close-circle" size={28} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default FavoritesScreen;
