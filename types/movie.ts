export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres?: Genre[];
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetail extends Movie {
  budget: number;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: Language[];
  credits: Credits;
  videos: MovieVideo[];
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface Language {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface UserMovie extends Movie {
  savedAt: number;
  rating?: number;
  notes?: string;
}

export interface MovieState {
  // Data
  trendingMovies: Movie[];
  trendingPage: number;
  trendingTotalPages: number;
  popularMovies: Movie[];
  searchResults: Movie[];
  favorites: UserMovie[]; // Movies yang di-save user
  movieDetail: Record<number, any>; // Cache detail movie by ID

  // Loading & error states
  isLoadingTrending: boolean;
  isLoadingMoreTrending: boolean;
  isLoadingPopular: boolean;
  isLoadingSearch: boolean;
  isLoadingDetail: Record<number, boolean>;
  error: string | null;

  // Actions
  fetchTrendingMovies: (options?: {
    timeWindow?: 'day' | 'week';
    page?: number;
    append?: boolean;
  }) => Promise<void>;
  loadMoreTrendingMovies: (timeWindow?: 'day' | 'week') => Promise<void>;
  fetchPopularMovies: (page?: number) => Promise<void>;
  searchMovies: (query: string) => Promise<void>;
  fetchMovieDetail: (movieId: number) => Promise<void>;
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  clearError: () => void;
  clearSearchResults: () => void;
}
