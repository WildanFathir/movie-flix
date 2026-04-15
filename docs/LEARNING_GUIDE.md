# Movie App Learning Guide

Dokumen ini menjelaskan alur belajar dan arsitektur project React Native ini secara praktis.

## Tujuan Project

- Belajar React Native lewat project real, bukan hanya todo app sederhana.
- Paham alur data dari UI ke API dan kembali ke UI.
- Latihan struktur code yang scalable sejak awal.

## Arsitektur Singkat

Alur utama aplikasi:

1. Screen memanggil action dari store.
2. Store memanggil service API.
3. Service API menggunakan endpoint + client generic.
4. Response disimpan di store.
5. UI otomatis update dari state terbaru.

## Struktur Folder (Current)

```text
app/
  _layout.tsx
  auth/
    _layout.tsx
    login.tsx
    register.tsx
  (tabs)/
    _layout.tsx
    home.tsx
    search.tsx
    favorites.tsx
    profile.tsx
  movie/
    [id].tsx

api/
  client.ts
  endpoints.ts
  tmdb.ts
  user.ts

store/
  authStore.ts
  movieStore.ts

types/
  auth.ts
  movie.ts
  profile.ts

utils/
  validators/
```

## Konsep Kunci Yang Dipakai

### 1) Routing dan Navigation (Expo Router)

- Root layout menentukan user masuk ke auth flow atau app flow.
- Group `(tabs)` dipakai untuk bottom tab.
- Route dinamis dipakai untuk detail movie: `movie/[id]`.

### 2) State Management (Zustand)

- `authStore`: state login/register/logout sederhana.
- `movieStore`: trending, search, detail, favorite, pagination.
- Komponen mengambil state langsung dari store.

### 3) API Layer Separation

- `api/endpoints.ts`: daftar endpoint.
- `api/client.ts`: request generic + method GET/POST/PUT/PATCH/DELETE.
- `api/tmdb.ts`: fungsi domain movie (trending, detail, videos, search).

### 4) Styling (NativeWind)

- Utility-first styling pakai className.
- Fokus ke konsistensi layout dan spacing.

## Feature Checklist

- [x] Login dan register screen
- [x] Bottom tab navigation
- [x] Home trending movies
- [x] Infinite scroll pagination
- [x] Search movies
- [x] Favorite movies
- [x] Movie detail
- [x] Trailer URL launcher

## Cara Menjalankan Project

1. Install dependency:

```bash
npm install
```

2. Isi environment variable di `.env`:

```env
EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
EXPO_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
EXPO_PUBLIC_TMDB_IMAGE_URL=https://image.tmdb.org/t/p/w500
```

3. Jalankan app:

```bash
npx expo start -c
```

## Learning Path yang Direkomendasikan

1. Pelajari dulu navigation flow di `app/_layout.tsx`.
2. Pahami state shape pada `store/authStore.ts` dan `store/movieStore.ts`.
3. Ikuti alur request movie dari `app/(tabs)/home.tsx` ke `api/tmdb.ts`.
4. Latihan ubah UI menggunakan NativeWind classes.
5. Tambah satu fitur baru mandiri (contoh: watchlist atau filter genre).

## Common Pitfalls

### NativeWind style tidak ter-apply

- Restart bundler dengan cache clear: `npx expo start -c`.
- Pastikan config Babel/Tailwind benar.

### Data movie tidak muncul

- Cek API key TMDB di `.env`.
- Cek request error di console.

### Route tidak berpindah setelah auth

- Cek `isAuthenticated` pada auth store.
- Cek conditional rendering di root layout.

## Next Challenge

- Tambahkan skeleton loading untuk home dan detail.
- Tambahkan retry action saat API error.
- Tambahkan test untuk validator dan store action.
- Dokumentasikan screenshot/GIF flow di README.
