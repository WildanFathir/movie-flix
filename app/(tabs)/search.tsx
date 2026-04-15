import MovieList from '@/components/MovieList';
import { useMovieStore } from '@/store/movieStore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, View } from 'react-native';

const SearchScreen = () => {
  const { searchResults, isLoadingSearch, searchMovies, clearSearchResults, error } =
    useMovieStore();

  const [query, setQuery] = useState('');
  let content = null;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchMovies(query);
      } else {
        clearSearchResults();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, searchMovies, clearSearchResults]);

  if (isLoadingSearch) {
    content = (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  } else if (searchResults.length === 0) {
    content = (
      <View className="items-center justify-center flex-1">
        <Text className="text-gray-500">
          {query ? 'Film tidak ditemukan' : 'Cari film favorit kamu...'}
        </Text>
      </View>
    );
  } else {
    content = (
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieList movies={item} />}
      />
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Search Input */}
      <View className="p-4 bg-gray-50">
        <TextInput
          className="px-4 py-3 text-base border border-gray-300 rounded-lg"
          placeholder="Cari film..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {error && (
        <View className="p-4 bg-red-100">
          <Text className="text-red-700">{error}</Text>
        </View>
      )}

      {content}
    </View>
  );
};

export default SearchScreen;
