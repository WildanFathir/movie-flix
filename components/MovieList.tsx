import { getImageUrl } from '@/api/tmdb';
import type { Movie } from '@/types/movie';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

const MovieList = ({ movies }: { movies: Movie }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 p-4 border-b border-gray-200"
      activeOpacity={0.75}
      onPress={() => router.push(`/movie/${movies.id}`)}
    >
      <View className="w-20 overflow-hidden bg-gray-200 rounded-lg h-28">
        {movies.poster_path ? (
          <Image
            source={getImageUrl(movies.poster_path, 'small') ?? undefined}
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
          {movies.title}
        </Text>
        <Text className="text-sm text-gray-600" numberOfLines={3}>
          {movies.overview}
        </Text>
        <View className="flex-row justify-between w-full">
          <Text className="text-xs text-gray-500">Rating: {movies.vote_average.toFixed(1)}/10</Text>
          <Text className="text-xs text-gray-500">{movies.release_date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MovieList;
