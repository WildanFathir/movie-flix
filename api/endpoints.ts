export const TMDB_ENDPOINTS = {
  trendingMovies: (timeWindow: 'day' | 'week') => `/trending/movie/${timeWindow}`,
  popularMovies: '/movie/popular',
  topRatedMovies: '/movie/top_rated',
  upcomingMovies: '/movie/upcoming',
  movieDetail: (movieId: number) => `/movie/${movieId}`,
  movieVideos: (movieId: number) => `/movie/${movieId}/videos`,
  searchMovie: '/search/movie',
  discoverMovie: '/discover/movie',
  movieGenres: '/genre/movie/list',
} as const;
