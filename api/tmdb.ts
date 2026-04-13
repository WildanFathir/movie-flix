/**
 * TMDB API Integration
 * Semua API calls untuk The Movie Database
 */

import { Movie, MovieDetail, PaginatedResponse, SearchResult } from '@/types/movie';

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.EXPO_PUBLIC_TMDB_BASE_URL;

if (!API_KEY) {
  console.warn('⚠️ TMDB_API_KEY tidak ditemukan di .env');
}

/**
 * Base function untuk semua API calls
 * Includes error handling & type safety
 */
async function fetchTMDB<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY || '',
      ...params,
    });

    const url = `${BASE_URL}${endpoint}?${queryParams}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// ============================================
// MOVIE ENDPOINTS
// ============================================

/**
 * Get trending movies
 * @param timeWindow - 'day' | 'week'
 */
export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  return fetchTMDB<PaginatedResponse<Movie>>(`/trending/movie/${timeWindow}`, {
    language: 'en-US',
  });
}

/**
 * Get popular movies
 * @param page - Halaman (default 1)
 */
export async function getPopularMovies(page: number = 1) {
  return fetchTMDB<PaginatedResponse<Movie>>('/movie/popular', {
    language: 'en-US',
    page,
  });
}

/**
 * Get top rated movies
 */
export async function getTopRatedMovies(page: number = 1) {
  return fetchTMDB<PaginatedResponse<Movie>>('/movie/top_rated', {
    language: 'en-US',
    page,
  });
}

/**
 * Get upcoming movies
 */
export async function getUpcomingMovies(page: number = 1) {
  return fetchTMDB<PaginatedResponse<Movie>>('/movie/upcoming', {
    language: 'en-US',
    page,
  });
}

/**
 * Get movie detail dengan credits
 * @param movieId - Movie ID dari TMDB
 */
export async function getMovieDetail(movieId: number) {
  return fetchTMDB<MovieDetail>(`/movie/${movieId}`, {
    language: 'en-US',
    append_to_response: 'credits', // Add credits ke response
  });
}

/**
 * Get movie videos (trailers, teasers, clips)
 */
export async function getMovieVideos(movieId: number) {
  return fetchTMDB<{ id: number; results: MovieVideo[] }>(`/movie/${movieId}/videos`, {
    language: 'en-US',
  });
}

/**
 * Pick best YouTube trailer URL from TMDB video list
 */
export function getBestTrailerUrl(videos: MovieVideo[]) {
  const youtubeVideos = videos.filter((video) => video.site === 'YouTube');

  const preferred =
    youtubeVideos.find((video) => video.type === 'Trailer' && video.official) ||
    youtubeVideos.find((video) => video.type === 'Trailer') ||
    youtubeVideos.find((video) => video.type === 'Teaser') ||
    youtubeVideos[0];

  if (!preferred) return null;
  return `https://www.youtube.com/watch?v=${preferred.key}`;
}

/**
 * Search movies by query
 * @param query - Search keyword
 * @param page - Halaman (default 1)
 */
export async function searchMovies(query: string, page: number = 1) {
  return fetchTMDB<PaginatedResponse<SearchResult>>('/search/movie', {
    language: 'en-US',
    query,
    page,
    include_adult: false,
  });
}

/**
 * Get movies by genre
 * @param genreId - Genre ID
 * @param page - Halaman
 */
export async function getMoviesByGenre(genreId: number, page: number = 1) {
  return fetchTMDB<PaginatedResponse<Movie>>('/discover/movie', {
    language: 'en-US',
    with_genres: genreId,
    page,
    sort_by: 'popularity.desc',
  });
}

/**
 * Get all available genres
 */
export async function getGenres() {
  return fetchTMDB<{ genres: { id: number; name: string }[] }>('/genre/movie/list', {
    language: 'en-US',
  });
}

/**
 * Build image URL untuk poster/backdrop
 * @param path - path dari API response
 * @param size - 'small' | 'medium' | 'large' (default 'medium')
 */
export function getImageUrl(path: string | null, size: 'small' | 'medium' | 'large' = 'medium') {
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
}
