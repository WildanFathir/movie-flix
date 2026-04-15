import MovieList from '@/components/MovieList';
import { useMovieStore } from '@/store/movieStore';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, Text, View } from 'react-native';

const FavoritesScreen = () => {
  const { favorites } = useMovieStore();

  return (
    <View className="flex-1 bg-white">
      {favorites.length === 0 ? (
        <View className="items-center justify-center flex-1">
          <Ionicons name="heart" size={64} color="#D1D5DB" />
          <Text className="mt-4 text-center text-gray-500">
            Belum ada film favorit{'\n'}Tambahkan film yang kamu sukai!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MovieList movies={item} withRemoveButton />}
        />
      )}
    </View>
  );
};

export default FavoritesScreen;
