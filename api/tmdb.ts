import { apiClient } from '@/api/client';
import { TMDB_ENDPOINTS } from '@/api/endpoints';
import { Movie, MovieDetail, MovieVideo, PaginatedResponse } from '@/types/movie';

/**
 * Get trending movies
 * @param timeWindow - 'day' | 'week'
 */
export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week', page: number = 1) => {
  return apiClient.get<PaginatedResponse<Movie>>(TMDB_ENDPOINTS.trendingMovies(timeWindow), {
    language: 'en-US',
    page,
  });
};

/**
 * Get popular movies
 * @param page - Halaman (default 1)
 */
export const getPopularMovies = async (page: number = 1) => {
  return apiClient.get<PaginatedResponse<Movie>>(TMDB_ENDPOINTS.popularMovies, {
    language: 'en-US',
    page,
  });
};

/**
 * Get top rated movies
 */
export const getTopRatedMovies = async (page: number = 1) => {
  return apiClient.get<PaginatedResponse<Movie>>(TMDB_ENDPOINTS.topRatedMovies, {
    language: 'en-US',
    page,
  });
};

/**
 * Get upcoming movies
 */
export const getUpcomingMovies = async (page: number = 1) => {
  return apiClient.get<PaginatedResponse<Movie>>(TMDB_ENDPOINTS.upcomingMovies, {
    language: 'en-US',
    page,
  });
};

/**
 * Get movie detail dengan credits
 * @param movieId - Movie ID dari TMDB
 */
export const getMovieDetail = async (movieId: number) => {
  return apiClient.get<MovieDetail>(TMDB_ENDPOINTS.movieDetail(movieId), {
    language: 'en-US',
    append_to_response: 'credits', // Add credits ke response
  });
};

/**
 * Get movie videos (trailers, teasers, clips)
 */
export const getMovieVideos = async (movieId: number) => {
  return apiClient.get<{ id: number; results: MovieVideo[] }>(TMDB_ENDPOINTS.movieVideos(movieId), {
    language: 'en-US',
  });
};

/**
 * Pick best YouTube trailer URL from TMDB video list
 */
export const getBestTrailerUrl = (videos: MovieVideo[]) => {
  const youtubeVideos = videos.filter((video) => video.site === 'YouTube');

  const preferred =
    youtubeVideos.find((video) => video.type === 'Trailer' && video.official) ||
    youtubeVideos.find((video) => video.type === 'Trailer') ||
    youtubeVideos.find((video) => video.type === 'Teaser') ||
    youtubeVideos[0];

  if (!preferred) return null;
  return `https://www.youtube.com/watch?v=${preferred.key}`;
};

/**
 * Search movies by query
 * @param query - Search keyword
 * @param page - Halaman (default 1)
 */
export const searchMovies = async (query: string, page: number = 1) => {
  return apiClient.get<PaginatedResponse<Movie>>(TMDB_ENDPOINTS.searchMovie, {
    language: 'en-US',
    query,
    page,
    include_adult: false,
  });
};

/**
 * Get movies by genre
 * @param genreId - Genre ID
 * @param page - Halaman
 */
export const getMoviesByGenre = async (genreId: number, page: number = 1) => {
  return apiClient.get<PaginatedResponse<Movie>>(TMDB_ENDPOINTS.discoverMovie, {
    language: 'en-US',
    with_genres: genreId,
    page,
    sort_by: 'popularity.desc',
  });
};

/**
 * Get all available genres
 */
export const getGenres = async () => {
  return apiClient.get<{ genres: { id: number; name: string }[] }>(TMDB_ENDPOINTS.movieGenres, {
    language: 'en-US',
  });
};

/**
 * Build image URL untuk poster/backdrop
 * @param path - path dari API response
 * @param size - 'small' | 'medium' | 'large' (default 'medium')
 */
export const getImageUrl = (path: string | null, size: 'small' | 'medium' | 'large' = 'medium') => {
  if (!path) return null;

  const sizes = {
    small: 'w342',
    medium: 'w500',
    large: 'w780',
  };

  const imageBase = process.env.EXPO_PUBLIC_TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p';
  const cleanBase = imageBase.replace(/\/+$/, '');
  const includesSize = /\/w\d+$/i.test(cleanBase);

  if (includesSize) {
    return `${cleanBase}${path}`;
  }

  return `${cleanBase}/${sizes[size]}${path}`;
};
