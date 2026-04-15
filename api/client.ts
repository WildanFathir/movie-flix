type QueryParams = Record<string, string | number | boolean | null | undefined>;

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.EXPO_PUBLIC_TMDB_BASE_URL;

if (!API_KEY) {
  console.warn('TMDB_API_KEY tidak ditemukan di .env');
}

const buildUrl = (endpoint: string, query?: QueryParams) => {
  const queryParams = new URLSearchParams({
    api_key: API_KEY || '',
  });

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  return `${BASE_URL}${endpoint}?${queryParams.toString()}`;
};

export const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  options?: {
    query?: QueryParams;
    body?: unknown;
    headers?: Record<string, string>;
  },
): Promise<T> => {
  const url = buildUrl(endpoint, options?.query);

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export const apiClient = {
  get: <T>(endpoint: string, query?: QueryParams) =>
    request<T>('GET', endpoint, {
      query,
    }),
  post: <T>(endpoint: string, body?: unknown, query?: QueryParams) =>
    request<T>('POST', endpoint, {
      body,
      query,
    }),
  put: <T>(endpoint: string, body?: unknown, query?: QueryParams) =>
    request<T>('PUT', endpoint, {
      body,
      query,
    }),
  patch: <T>(endpoint: string, body?: unknown, query?: QueryParams) =>
    request<T>('PATCH', endpoint, {
      body,
      query,
    }),
  delete: <T>(endpoint: string, query?: QueryParams) =>
    request<T>('DELETE', endpoint, {
      query,
    }),
};
