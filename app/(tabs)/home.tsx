import { getImageUrl } from '@/api/tmdb';
import { useMovies } from '@/hooks/useMovies';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { trendingMovies, isLoadingTrending, fetchTrendingMovies, error } = useMovies();

  useEffect(() => {
    // Fetch trending movies saat screen pertama kali load
    fetchTrendingMovies();
  }, [fetchTrendingMovies]);

  const handleRefresh = () => {
    fetchTrendingMovies();
  };

  let content = null;

  if (isLoadingTrending) {
    content = (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading movies...</Text>
      </View>
    );
  } else if (trendingMovies.length === 0) {
    content = (
      <View className="items-center justify-center flex-1">
        <Text className="text-gray-500">No movies available</Text>
      </View>
    );
  } else {
    content = (
      <FlatList
        data={trendingMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center gap-3 p-4 border-b border-gray-200"
            activeOpacity={0.75}
            onPress={() => router.push(`/movie/${item.id}`)}
          >
            <View className="w-20 overflow-hidden bg-gray-200 rounded-lg h-28">
              {item.poster_path ? (
                <Image
                  source={getImageUrl(item.poster_path, 'small') ?? undefined}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                  transition={150}
                />
              ) : (
                <View className="items-center justify-center flex-1">
                  <Text className="text-xs text-gray-500">No Image</Text>
                </View>
              )}
            </View>

            <View className="flex items-start flex-1 gap-2">
              <Text className="text-lg font-bold" numberOfLines={1}>
                {item.title}
              </Text>
              <Text className="text-sm text-gray-600" numberOfLines={3}>
                {item.overview}
              </Text>
              <View className="flex-row justify-between w-full">
                <Text className="text-xs text-gray-500">
                  Rating: {item.vote_average.toFixed(1)}/10
                </Text>
                <Text className="text-xs text-gray-500">{item.release_date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={isLoadingTrending} onRefresh={handleRefresh} />}
      />
    );
  }

  return (
    <View className="flex-1 bg-white">
      {error && (
        <View className="p-4 bg-red-100">
          <Text className="text-red-700">{error}</Text>
        </View>
      )}

      {content}
    </View>
  );
}
