import { getBestTrailerUrl, getImageUrl, getMovieVideos } from '@/api/tmdb';
import { Button } from '@/components/Button';
import { useMovieStore } from '@/store/movieStore';
import type { MovieVideo } from '@/types/movie';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

const MovieDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);
  let videoContent = null;

  const favorites = useMovieStore((state) => state.favorites);
  const { movieDetail, isLoadingDetail, fetchMovieDetail, addFavorite, removeFavorite } =
    useMovieStore();

  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

  const detail = movieDetail[movieId];
  const loading = isLoadingDetail[movieId] || false;
  const favorite = useMemo(
    () => favorites.some((movie) => movie.id === movieId),
    [favorites, movieId],
  );

  useEffect(() => {
    if (!Number.isFinite(movieId)) return;

    fetchMovieDetail(movieId);

    const loadVideos = async () => {
      try {
        setIsLoadingVideos(true);
        const response = await getMovieVideos(movieId);
        setVideos(response.results || []);
      } catch (error) {
        console.error('Failed to load videos:', error);
      } finally {
        setIsLoadingVideos(false);
      }
    };

    loadVideos();
  }, [movieId, fetchMovieDetail]);

  const trailerUrl = getBestTrailerUrl(videos);

  if (isLoadingVideos) {
    videoContent = (
      <View className="py-3">
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  } else if (trailerUrl) {
    videoContent = (
      <TouchableOpacity
        className="flex-row items-center justify-center w-full px-4 py-3 bg-red-600 rounded-xl"
        onPress={() => openTrailer(trailerUrl)}
        activeOpacity={0.8}
      >
        <Ionicons name="play" size={18} color="#fff" />
        <Text className="ml-2 font-semibold text-white">Watch Trailer</Text>
      </TouchableOpacity>
    );
  } else {
    videoContent = <Text className="text-gray-600">Trailer belum tersedia untuk movie ini.</Text>;
  }

  const handleToggleFavorite = () => {
    if (!detail) return;
    if (favorite) {
      removeFavorite(detail.id);
      showFavoriteFeedback('Removed from favorites');
      return;
    }
    addFavorite(detail);
    showFavoriteFeedback('Added to favorites');
  };

  const showFavoriteFeedback = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      return;
    }

    Alert.alert('Favorites', message);
  };

  const openTrailer = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  if (!Number.isFinite(movieId)) {
    return (
      <View className="items-center justify-center flex-1 px-6 bg-white">
        <Text className="text-base text-gray-700">Movie ID tidak valid.</Text>
      </View>
    );
  }

  if (loading && !detail) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-3 text-gray-600">Loading detail movie...</Text>
      </View>
    );
  }

  if (!detail) {
    return (
      <View className="items-center justify-center flex-1 px-6 bg-white">
        <Text className="text-base text-center text-gray-700">Detail movie belum tersedia.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="w-full bg-gray-200 h-72">
        {detail.backdrop_path ? (
          <Image
            source={getImageUrl(detail.backdrop_path, 'large') ?? undefined}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View className="items-center justify-center flex-1">
            <Text className="text-gray-500">No Backdrop</Text>
          </View>
        )}
      </View>

      <View className="flex items-center w-full gap-6 px-4 pt-4">
        <View className="flex-row gap-4">
          <View className="h-40 -mt-16 overflow-hidden bg-gray-200 border-2 border-white w-28 rounded-xl">
            {detail.poster_path ? (
              <Image
                source={getImageUrl(detail.poster_path, 'medium') ?? undefined}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                transition={150}
              />
            ) : (
              <View className="items-center justify-center flex-1">
                <Text className="text-xs text-gray-500">No Poster</Text>
              </View>
            )}
          </View>

          <View className="flex items-start flex-1 w-full gap-3">
            <View className="flex items-start w-full gap-1">
              <Text className="text-2xl font-bold text-gray-900" numberOfLines={2}>
                {detail.title}
              </Text>
              {!!detail.tagline && <Text className="text-sm text-gray-500">{detail.tagline}</Text>}
            </View>

            <View className="flex items-start w-full gap-2">
              <View className="flex-row items-center gap-1">
                <Ionicons name="star" color="#F59E0B" size={16} />
                <Text className="text-sm text-gray-700">
                  {detail.vote_average.toFixed(1)} / 10 ({detail.vote_count})
                </Text>
              </View>

              <Text className="text-sm text-gray-600">
                {detail.release_date} • {detail.runtime ? `${detail.runtime} min` : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {favorite ? (
          <Button title="Remove From Favorites" onPress={handleToggleFavorite} variant="danger" />
        ) : (
          <Button title="Add To Favorites" onPress={handleToggleFavorite} variant="primary" />
        )}

        <View className="flex items-start w-full gap-2">
          <Text className="text-lg font-bold text-gray-900">Overview</Text>
          <Text className="leading-6 text-justify text-gray-700">
            {detail.overview || 'No overview available.'}
          </Text>
        </View>

        {!!detail.genres?.length && (
          <View className="flex items-start w-full gap-2">
            <Text className="text-lg font-bold text-gray-900">Genres</Text>
            <View className="flex-row flex-wrap gap-2">
              {detail.genres.map((genre: { id: number; name: string }) => (
                <View key={genre.id} className="px-3 py-1 bg-gray-100 rounded-full">
                  <Text className="text-sm text-gray-700">{genre.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className="flex items-start w-full gap-2">
          <Text className="text-lg font-bold text-gray-900">Videos</Text>

          {videoContent}

          {videos.slice(0, 4).map((video) => {
            const isYoutube = video.site === 'YouTube';
            const url = isYoutube ? `https://www.youtube.com/watch?v=${video.key}` : null;
            return (
              <TouchableOpacity
                key={video.id}
                className="w-full px-3 py-3 border border-gray-200 rounded-lg"
                onPress={() => {
                  if (url) {
                    void openTrailer(url);
                  }
                }}
                disabled={!url}
                activeOpacity={0.8}
              >
                <Text className="font-medium text-gray-900" numberOfLines={1}>
                  {video.name}
                </Text>
                <Text className="mt-1 text-xs text-gray-500">
                  {video.type} • {video.site}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default MovieDetailScreen;
