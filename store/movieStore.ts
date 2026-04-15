import * as tmdbApi from '@/api/tmdb';
import { Movie, MovieState, UserMovie } from '@/types/movie';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const mergeUniqueMovies = (current: Movie[], incoming: Movie[]) => {
  const movieMap = new Map<number, Movie>();
  [...current, ...incoming].forEach((movie) => {
    movieMap.set(movie.id, movie);
  });
  return Array.from(movieMap.values());
};

export const useMovieStore = create<MovieState>()(
  persist(
    (set, get) => ({
      // Initial state
      trendingMovies: [],
      trendingPage: 0,
      trendingTotalPages: 1,
      popularMovies: [],
      searchResults: [],
      favorites: [],
      movieDetail: {},

      isLoadingTrending: false,
      isLoadingMoreTrending: false,
      isLoadingPopular: false,
      isLoadingSearch: false,
      isLoadingDetail: {},
      error: null,

      // FETCH TRENDING MOVIES
      fetchTrendingMovies: async ({ timeWindow = 'week', page = 1, append = false } = {}) => {
        if (append) {
          set({ isLoadingMoreTrending: true, error: null });
        } else {
          set({ isLoadingTrending: true, error: null });
        }

        try {
          const response = await tmdbApi.getTrendingMovies(timeWindow, page);

          set((state) => {
            const mergedMovies = append
              ? mergeUniqueMovies(state.trendingMovies, response.results)
              : response.results;

            return {
              trendingMovies: mergedMovies,
              trendingPage: response.page,
              trendingTotalPages: response.total_pages,
              isLoadingTrending: false,
              isLoadingMoreTrending: false,
            };
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to fetch trending movies';
          set({
            error: errorMessage,
            isLoadingTrending: false,
            isLoadingMoreTrending: false,
          });
        }
      },

      loadMoreTrendingMovies: async (timeWindow = 'week') => {
        const state = get();

        if (state.isLoadingTrending || state.isLoadingMoreTrending) return;
        if (state.trendingPage >= state.trendingTotalPages) return;

        await state.fetchTrendingMovies({
          timeWindow,
          page: state.trendingPage + 1,
          append: true,
        });
      },

      // FETCH POPULAR MOVIES
      fetchPopularMovies: async (page = 1) => {
        set({ isLoadingPopular: true, error: null });
        try {
          const response = await tmdbApi.getPopularMovies(page);
          set({
            popularMovies: response.results,
            isLoadingPopular: false,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to fetch popular movies';
          set({
            error: errorMessage,
            isLoadingPopular: false,
          });
        }
      },

      // SEARCH MOVIES
      searchMovies: async (query: string) => {
        if (!query.trim()) {
          set({ searchResults: [] });
          return;
        }

        set({ isLoadingSearch: true, error: null });
        try {
          const response = await tmdbApi.searchMovies(query);
          set({
            searchResults: response.results,
            isLoadingSearch: false,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Search failed';
          set({
            error: errorMessage,
            isLoadingSearch: false,
          });
        }
      },

      // FETCH MOVIE DETAIL
      fetchMovieDetail: async (movieId: number) => {
        set((state) => ({
          isLoadingDetail: { ...state.isLoadingDetail, [movieId]: true },
          error: null,
        }));

        try {
          const detail = await tmdbApi.getMovieDetail(movieId);
          set((state) => ({
            movieDetail: { ...state.movieDetail, [movieId]: detail },
            isLoadingDetail: { ...state.isLoadingDetail, [movieId]: false },
          }));
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to fetch movie detail';
          set((state) => ({
            error: errorMessage,
            isLoadingDetail: { ...state.isLoadingDetail, [movieId]: false },
          }));
        }
      },

      // ADD TO FAVORITES
      addFavorite: (movie: Movie) => {
        const state = get();
        if (!state.isFavorite(movie.id)) {
          const userMovie: UserMovie = {
            ...movie,
            savedAt: Date.now(),
          };
          set({
            favorites: [...state.favorites, userMovie],
          });
        }
      },

      // REMOVE FROM FAVORITES
      removeFavorite: (movieId: number) => {
        set((state) => ({
          favorites: state.favorites.filter((m) => m.id !== movieId),
        }));
      },

      // CHECK IF MOVIE IS FAVORITE
      isFavorite: (movieId: number) => {
        const state = get();
        return state.favorites.some((m) => m.id === movieId);
      },

      // CLEAR ERROR
      clearError: () => {
        set({ error: null });
      },

      // CLEAR SEARCH RESULTS
      clearSearchResults: () => {
        set({ searchResults: [] });
      },
    }),
    {
      name: 'movie-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist only favorites (data yang penting)
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    },
  ),
);
