# 🎬 Movie App Learning Guide

Selamat! Kamu sudah setup movie app dengan best practice React Native Expo. Berikut breakdown lengkap dari yang sudah dibuat:

---

## 📁 Project Structure

```
app/
├── _layout.tsx              ← ROOT LAYOUT (navigation logic)
├── index.tsx                ← dummy (tidak dipakai)
├── auth/
│   ├── _layout.tsx          ← Auth stack layout
│   ├── login.tsx            ← Login screen
│   └── register.tsx         ← Register screen
└── (tabs)/
    ├── _layout.tsx          ← Tab navigation
    ├── home.tsx             ← Home screen (trending movies)
    ├── search.tsx           ← Search movies
    ├── favorites.tsx        ← Saved favorite movies
    └── profile.tsx          ← User profile & logout

store/
├── authStore.ts             ← Zustand auth state management
└── movieStore.ts            ← Zustand movie state management

api/
├── types.ts                 ← TypeScript types untuk TMDB API
└── tmdb.ts                  ← TMDB API integration

components/
├── AuthInput.tsx            ← Auth form input component
└── Button.tsx               ← Reusable button with loading state

hooks/
├── useAuth.ts               ← Custom hook untuk auth
└── useMovies.ts             ← Custom hook untuk movies
```

---

## 🔑 Key Concepts Yang Harus Dipahami

### 1. **Routing & Navigation** (Expo Router)

- **Root Layout** (`app/_layout.tsx`): Entry point, decide apakah user lihat auth atau app
- **Stack vs Tabs**:
  - Stack = layering screens (bisa push/pop)
  - Tabs = navigation dengan tab di bottom
- **Conditional Rendering**: Render auth atau tabs berdasarkan `isAuthenticated`

### 2. **State Management** (Zustand)

- **Lightweight & Simple**: Lebih ringan dari Redux/Context
- **Persist**: Auto save ke AsyncStorage pake middleware
- **Custom Store Pattern**:
  ```tsx
  // Create store
  export const useMovieStore = create((set) => ({...}));
  // Use in component
  const { movies, fetchMovies } = useMovieStore();
  ```

### 3. **Authentication Flow**

```
User opens app
  ↓
Check isAuthenticated in Zustand store
  ↓
False → Show auth layout (login/register)
  ↓
User login → Update store isAuthenticated = true
  ↓
Re-render root layout → Show app (tabs)
  ↓
User logout → Update store → Show auth kembali
```

### 4. **API Integration**

- TMDB API functions di `api/tmdb.ts`
- Type-safe dengan TypeScript types
- Error handling built-in
- Parameterized functions (page, search query, dll)

### 5. **Styling dengan NativeWind**

- Tailwind CSS untuk React Native
- Utility-first approach
- Responsive design bawaan

---

## 🚀 Next Steps - Lanjut Belajar

### Step 1: Setup TMDB API Key

1. Pergi ke https://www.themoviedb.org/settings/api
2. Register atau login
3. Create API key
4. Paste ke `.env`:
   ```
   EXPO_PUBLIC_TMDB_API_KEY=your_actual_api_key_here
   ```
5. Restart dev server: `npx expo start -c`

### Step 2: Test Authentication

```tsx
// Buka Login Screen
// Test credentials sudah ada di screen (demo@example.com / password)
// Coba login → akan pindah ke app (tabs)
// Coba logout dari profile tab → back ke auth
```

### Step 3: Fetch Real Movies Data

Login screen sudah working, tapi movies masih placeholder. Kamu perlu:

1. Ganti login/register validation ke real backend (atau mock API lebih advanced)
2. Test `fetchTrendingMovies()` di home screen
3. Lihat console untuk API responses

### Step 4: Build Movie Features

**Movie Detail Screen** (belum dibuat):

- Buat `app/movie/[id].tsx`
- Fetch movie detail pake `getMovieDetail(movieId)`
- Show cast, rating, budget, dll
- Add to favorites button

**Advanced Search**:

- Filter by genre (gunakan `getMoviesByGenre()`)
- Sort by rating/popularity
- Pagination

### Step 5: UI Polish

Kamu pakai NativeWind, jadi:

- Install Tailwind VSCode extension untuk autocomplete
- Gunakan utility classes: `className="flex justify-center items-center"`
- Responsive design: `className="w-full md:w-1/2"`
- Dark mode support

---

## 🎓 Learning Resources

### Zustand Best Practices

```tsx
// ✅ GOOD: Destructure yang dibutuhkan
const { movies, fetchMovies } = useMovieStore();

// ❌ AVOID: Subscribe seluruh store
const store = useMovieStore();
```

### Async Error Handling

```tsx
// API function auto throw error
try {
  await fetchMovies();
} catch (error) {
  // Handle error - sudah di-store dari Zustand
}
```

### Navigation Tips

```tsx
// Use useRouter untuk navigate
const router = useRouter();

// Navigate to screen
router.push('/search');

// Go back
router.back();

// Replace (tidak bisa go back)
router.replace('/home');
```

---

## 🛠️ Development Workflow

**Start Dev Server**:

```bash
npx expo start -c  # -c = clear cache
```

**Test on Android**:

- Press 'a' di terminal
- Atau buka di Android emulator

**Test on iOS**:

- Press 'i' di terminal

**Hot Reload**:

- Automatic saat save file
- Atau manual: press 'r' di terminal

---

## 📋 Checklist untuk Deep Learning

- [ ] Pahami routing logic di `app/_layout.tsx`
- [ ] Pahami Zustand store structure
- [ ] Test auth flow (login → app → logout)
- [ ] Setup TMDB API key
- [ ] Fetch real data & verify console logs
- [ ] Buat movie detail screen
- [ ] Add more filters & search options
- [ ] Polish UI with NativeWind
- [ ] Test all navigation flows

---

## 💡 Common Issues & Solutions

**Q: Lanjut-lanjut styling NativeWind tidak work?**
A: Clear cache: `npx expo start -c` dan restart

**Q: API returns error?**
A: Check API key di `.env` dan network connection

**Q: favorites tidak persist?**
A: Zustand auto persist ke AsyncStorage, check react-native-async-storage installed

**Q: Navigation stuck?**
A: Check `isAuthenticated` state di auth store

---

## 🎯 Final Tips

1. **Read the docs**: Expo Router & Zustand docs sangat helpful
2. **Test often**: Jangan code banyak baru test
3. **Type everything**: TypeScript bisa prevent bugs
4. **Modularize**: Buat components reusable
5. **Error handling**: Always handle errors gracefully

Semangat belajar! 🚀
