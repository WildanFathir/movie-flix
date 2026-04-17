# Zustand State Management Guide (Untuk yang terbiasa Pinia)

Panduan ini dibuat khusus untuk kamu yang background-nya Vue/Nuxt + Pinia, supaya transisi ke Zustand lebih gampang.

## 1. Mental Model: Pinia vs Zustand

Perbandingan cepat:

- Pinia: state, getters, actions dipisah jelas per store.
- Zustand: state dan action digabung dalam satu object store.
- Keduanya: sama-sama global store dan reactive.

Di Zustand, store biasanya dibuat seperti ini:

```ts
const useStore = create((set, get) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

## 2. Kenapa pakai spread pada object state

Contoh yang kamu tanyakan:

```ts
movieDetail: { ...state.movieDetail, [movieId]: detail },
isLoadingDetail: { ...state.isLoadingDetail, [movieId]: false },
```

Alasan utamanya: `movieDetail` dan `isLoadingDetail` adalah object map dengan banyak key berdasarkan `movieId`.

Misal state lama:

```ts
movieDetail = {
  101: { title: 'A' },
  202: { title: 'B' },
};
```

Lalu kamu fetch detail movie 303. Kalau kamu tulis langsung:

```ts
movieDetail: detail;
```

itu berarti seluruh object `movieDetail` diganti jadi satu nilai detail saja, data movie 101 dan 202 hilang.

Dengan spread:

```ts
movieDetail: { ...state.movieDetail, [movieId]: detail }
```

hasilnya merge:

```ts
movieDetail = {
  101: { title: 'A' },
  202: { title: 'B' },
  303: { title: 'C' },
};
```

Intinya: spread dipakai untuk immutable update pada nested object supaya data lama tetap aman.

## 3. `set` dan `get` di Zustand

Dalam `create((set, get) => ({ ... }))`:

- `set`: untuk update state.
- `get`: untuk membaca state terbaru saat ini dari dalam action.

Contoh dari code kamu:

```ts
addFavorite: (movie) => {
  const state = get();
  if (!state.isFavorite(movie.id)) {
    set({ favorites: [...state.favorites, movie] });
  }
};
```

Penjelasan:

1. `get()` dipakai ambil state terkini.
2. Cek dulu apakah movie sudah ada di favorite.
3. Kalau belum, `set(...)` update favorites dengan array baru.

## 4. Bentuk `set` yang umum

### Object update langsung

```ts
set({ isLoading: true });
```

Cocok untuk update sederhana.

### Functional update (direkomendasikan saat tergantung state lama)

```ts
set((state) => ({
  favorites: [...state.favorites, userMovie],
}));
```

Ini lebih aman ketika update bergantung ke nilai state sebelumnya.

## 5. Selain `set` dan `get`, apa lagi?

Di level store (dari hook `useMovieStore`) ada API tambahan:

- `useMovieStore.getState()` untuk baca state di luar komponen.
- `useMovieStore.setState()` untuk update state di luar komponen.
- `useMovieStore.subscribe()` untuk listen perubahan state.

Selain itu, ada middleware yang sering dipakai:

- `persist` untuk simpan state ke storage.
- `devtools` untuk debugging.
- `subscribeWithSelector` untuk subscribe bagian state tertentu.
- `immer` untuk update nested state lebih nyaman.

## 6. Best Practice untuk project kamu

- Untuk array/object, prefer functional `set((state) => ...)`.
- Simpan state serializable saja di store persist.
- Gunakan selector di komponen supaya re-render lebih efisien.

Contoh selector bagus:

```ts
const favorites = useMovieStore((state) => state.favorites);
```

## 7. Contoh refactor kecil dari `addFavorite`

Versi sekarang bekerja, tapi bisa dibuat lebih aman dari race condition kecil dengan functional set.

```ts
addFavorite: (movie) => {
  set((state) => {
    if (state.favorites.some((m) => m.id === movie.id)) {
      return state;
    }

    return {
      favorites: [
        ...state.favorites,
        {
          ...movie,
          savedAt: Date.now(),
        },
      ],
    };
  });
},
```

## 8. Ringkasan singkat

- Spread dipakai agar object lama tidak ketimpa total.
- `set` untuk ubah state, `get` untuk baca state.
- Selain itu ada `getState`, `setState`, `subscribe`, dan middleware.
- Pola Zustand mirip Pinia secara konsep global store, beda pada API dan gaya penulisannya.
