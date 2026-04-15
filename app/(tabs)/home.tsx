import MovieList from '@/components/MovieList';
import { useMovieStore } from '@/store/movieStore';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';

const HomeScreen = () => {
  let footer = null;
  let content = null;

  const {
    trendingMovies,
    isLoadingTrending,
    isLoadingMoreTrending,
    trendingPage,
    trendingTotalPages,
    fetchTrendingMovies,
    loadMoreTrendingMovies,
    error,
  } = useMovieStore();

  useEffect(() => {
    fetchTrendingMovies({ page: 1, append: false });
  }, [fetchTrendingMovies]);

  const handleRefresh = () => {
    fetchTrendingMovies({ page: 1, append: false });
  };

  const handleLoadMore = () => {
    loadMoreTrendingMovies();
  };

  if (isLoadingMoreTrending) {
    footer = (
      <View className="items-center py-4">
        <ActivityIndicator size="small" color="#3B82F6" />
        <Text className="mt-2 text-xs text-gray-500">Loading more...</Text>
      </View>
    );
  } else if (trendingPage >= trendingTotalPages && trendingMovies.length > 0) {
    footer = (
      <View className="items-center py-4">
        <Text className="text-xs text-gray-400">No more movies</Text>
      </View>
    );
  }

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
        renderItem={({ item }) => <MovieList movies={item} />}
        refreshControl={<RefreshControl refreshing={isLoadingTrending} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={footer}
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
};

export default HomeScreen;
