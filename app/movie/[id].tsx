import { getBestTrailerUrl, getImageUrl, getMovieVideos, MovieVideo } from '@/api/tmdb';
import { useMovieStore } from '@/store/movieStore';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const MovieDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);

  const {
    movieDetail,
    isLoadingDetail,
    fetchMovieDetail,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useMovieStore();

  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

  const detail = movieDetail[movieId];
  const loading = isLoadingDetail[movieId] || false;
  const favorite = useMemo(() => isFavorite(movieId), [isFavorite, movieId, movieDetail]);

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

  let videoContent = null;
  if (isLoadingVideos) {
    videoContent = (
      <View className="py-3">
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  } else if (trailerUrl) {
    videoContent = (
      <TouchableOpacity
        className="bg-red-600 rounded-xl py-3 px-4 flex-row items-center justify-center"
        onPress={() => openTrailer(trailerUrl)}
        activeOpacity={0.8}
      >
        <Ionicons name="play" size={18} color="#fff" />
        <Text className="text-white font-semibold ml-2">Watch Trailer</Text>
      </TouchableOpacity>
    );
  } else {
    videoContent = <Text className="text-gray-600">Trailer belum tersedia untuk movie ini.</Text>;
  }

  const handleToggleFavorite = () => {
    if (!detail) return;
    if (favorite) {
      removeFavorite(detail.id);
      return;
    }
    addFavorite(detail);
  };

  const openTrailer = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  if (!Number.isFinite(movieId)) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-gray-700 text-base">Movie ID tidak valid.</Text>
      </View>
    );
  }

  if (loading && !detail) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-3">Loading detail movie...</Text>
      </View>
    );
  }

  if (!detail) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-gray-700 text-base text-center">Detail movie belum tersedia.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="w-full h-64 bg-gray-200">
        {detail.backdrop_path ? (
          <Image
            source={getImageUrl(detail.backdrop_path, 'large') ?? undefined}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">No Backdrop</Text>
          </View>
        )}
      </View>

      <View className="px-4 pt-4">
        <View className="flex-row gap-4">
          <View className="w-28 h-40 rounded-xl overflow-hidden bg-gray-200 -mt-16 border-2 border-white">
            {detail.poster_path ? (
              <Image
                source={getImageUrl(detail.poster_path, 'medium') ?? undefined}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                transition={150}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-xs text-gray-500">No Poster</Text>
              </View>
            )}
          </View>

          <View className="flex-1 pt-2">
            <Text className="text-2xl font-bold text-gray-900" numberOfLines={2}>
              {detail.title}
            </Text>
            {!!detail.tagline && (
              <Text className="text-sm text-gray-500 mt-1">{detail.tagline}</Text>
            )}

            <View className="flex-row items-center mt-3">
              <Ionicons name="star" color="#F59E0B" size={16} />
              <Text className="text-sm text-gray-700 ml-1">
                {detail.vote_average.toFixed(1)} / 10 ({detail.vote_count})
              </Text>
            </View>

            <Text className="text-sm text-gray-600 mt-2">
              {detail.release_date} • {detail.runtime ? `${detail.runtime} min` : 'N/A'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleToggleFavorite}
          className={`mt-4 rounded-xl py-3 px-4 items-center ${favorite ? 'bg-rose-600' : 'bg-blue-600'}`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold">
            {favorite ? 'Remove From Favorites' : 'Add To Favorites'}
          </Text>
        </TouchableOpacity>

        <Text className="text-lg font-bold text-gray-900 mt-6 mb-2">Overview</Text>
        <Text className="text-gray-700 leading-6">
          {detail.overview || 'No overview available.'}
        </Text>

        {!!detail.genres?.length && (
          <View className="mt-6">
            <Text className="text-lg font-bold text-gray-900 mb-2">Genres</Text>
            <View className="flex-row flex-wrap gap-2">
              {detail.genres.map((genre: { id: number; name: string }) => (
                <View key={genre.id} className="px-3 py-1 rounded-full bg-gray-100">
                  <Text className="text-gray-700 text-sm">{genre.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className="mt-6">
          <Text className="text-lg font-bold text-gray-900 mb-2">Videos</Text>

          {videoContent}

          {videos.slice(0, 4).map((video) => {
            const isYoutube = video.site === 'YouTube';
            const url = isYoutube ? `https://www.youtube.com/watch?v=${video.key}` : null;
            return (
              <TouchableOpacity
                key={video.id}
                className="mt-2 border border-gray-200 rounded-lg px-3 py-3"
                onPress={() => {
                  if (url) {
                    void openTrailer(url);
                  }
                }}
                disabled={!url}
                activeOpacity={0.8}
              >
                <Text className="text-gray-900 font-medium" numberOfLines={1}>
                  {video.name}
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
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
