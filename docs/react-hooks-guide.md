# React Hooks Guide (Untuk Developer Vue/Nuxt)

Panduan ini fokus ke hook React yang paling sering dipakai di project nyata, dengan analogi ke Vue/Nuxt supaya transisinya lebih gampang.

## 1. Mindset: React Hooks vs Vue Composition API

Perbandingan cepat:

- Vue `ref` dan `reactive` mirip konsep state di React.
- Vue `computed` paling dekat dengan `useMemo`.
- Vue `watch` dan `watchEffect` paling dekat dengan `useEffect`.
- Vue `provide/inject` paling dekat dengan `useContext`.

Bedanya, di React kita tidak menulis watcher terpisah. Kita menulis effect dan dependency secara eksplisit.

## 2. Hook Yang Paling Sering Dipakai

## useState

Dipakai untuk state lokal komponen.

```tsx
const [count, setCount] = useState(0);
```

Kapan dipakai:

- Input form
- Toggle modal
- Loading lokal komponen

Tips:

- Jika update state bergantung nilai sebelumnya, pakai functional update:

```tsx
setCount((prev) => prev + 1);
```

## useEffect

Dipakai untuk side effect:

- Fetch API
- Subscribe event
- Timer
- Sinkronisasi ke local storage

```tsx
useEffect(() => {
  fetchData();
}, []);
```

Makna dependency array:

- `[]`: jalan sekali saat mount.
- `[a, b]`: jalan lagi jika `a` atau `b` berubah.
- tanpa array: jalan tiap render.

### Cara berpikir dependency yang benar

Rule sederhana:

1. Semua nilai dari luar effect yang dipakai di dalam effect harus masuk dependency.
2. Kalau function dipakai di effect dan function itu dibuat ulang tiap render, stabilkan dengan `useCallback` atau pindahkan logic ke dalam effect.
3. Jangan "mengakali" dependency untuk menghilangkan warning; biasanya itu jadi bug stale data.

Contoh rawan bug:

```tsx
useEffect(() => {
  if (query) {
    searchMovies(query);
  }
}, []); // query tidak masuk dependency -> stale
```

Versi benar:

```tsx
useEffect(() => {
  if (query) {
    searchMovies(query);
  }
}, [query, searchMovies]);
```

### Pola advanced useEffect

#### a) Conditional effect

```tsx
useEffect(() => {
  if (!userId) return;
  fetchUser(userId);
}, [userId]);
```

#### b) Cleanup subscription

```tsx
useEffect(() => {
  const unsub = subscribeToSomething();
  return () => {
    unsub();
  };
}, []);
```

#### c) Debounce input (contoh search)

```tsx
useEffect(() => {
  if (!query.trim()) return;

  const timeoutId = setTimeout(() => {
    void searchMovies(query);
  }, 400);

  return () => clearTimeout(timeoutId);
}, [query, searchMovies]);
```

## useMemo

`useMemo` dipakai untuk memoize hasil komputasi supaya tidak hitung ulang di setiap render.

Analogi Vue: `computed`.

```tsx
const expensiveValue = useMemo(() => {
  return bigList.filter((item) => item.score > 80);
}, [bigList]);
```

Kapan dipakai:

- Komputasi berat
- Derived data yang sering dipakai
- Menjaga referensi object/array stabil untuk optimasi

Kapan tidak perlu:

- Komputasi ringan
- Hanya karena ingin "pakai semua hook"

## useCallback

`useCallback` memoize function reference.

```tsx
const handleSave = useCallback(() => {
  saveData(form);
}, [form]);
```

Kapan dipakai:

- Function dipassing ke child component yang pakai `React.memo`
- Function masuk dependency `useEffect`

## useRef

`useRef` menyimpan nilai mutable yang tidak memicu re-render.

```tsx
const inputRef = useRef<TextInput | null>(null);
const timerRef = useRef<NodeJS.Timeout | null>(null);
```

Use case:

- Akses instance UI (focus input, scroll)
- Simpan id timer
- Simpan previous value tanpa trigger render

## useContext

Untuk berbagi data global sederhana tanpa prop drilling.

Analogi Vue: `provide/inject`.

```tsx
const ThemeContext = createContext<'light' | 'dark'>('light');

const value = useContext(ThemeContext);
```

Catatan penting:

- Jika value context sering berubah dan tree besar, bisa memicu re-render luas.
- Untuk state global kompleks/frequent update, Zustand sering lebih efisien.

## useReducer

Dipakai saat state logic kompleks atau banyak transisi state.

```tsx
type State = { count: number };
type Action = { type: 'inc' } | { type: 'dec' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'inc':
      return { count: state.count + 1 };
    case 'dec':
      return { count: state.count - 1 };
    default:
      return state;
  }
};
```

Kapan dipakai:

- State machine sederhana
- Form kompleks
- Banyak update yang saling terkait

## 3. Hook yang sering dipakai di React Native

- `useState`: form input, modal, loading
- `useEffect`: fetch API, listener, timer
- `useMemo`: filtering/sorting list
- `useCallback`: handler yang dipassing ke list item
- `useRef`: focus input, scroll control

## 4. Cheat Sheet Vue/Nuxt -> React

- `ref` -> `useState`
- `computed` -> `useMemo`
- `watch/watchEffect` -> `useEffect`
- `provide/inject` -> `useContext`
- Store Pinia -> Zustand atau Context + useReducer

## 5. Common Mistakes

1. Dependency effect tidak lengkap -> data stale.
2. Overuse `useMemo`/`useCallback` untuk hal ringan.
3. Menaruh fetch langsung di body komponen (bukan di effect).
4. Menyimpan semua hal di global store padahal cukup local state.

## 6. Praktik di Project Ini

Tempat yang bagus untuk belajar langsung:

1. Auth screen untuk `useState` + `useEffect`.
2. Movie detail untuk `useMemo` dan async effect.
3. Search screen untuk effect berbasis query.
4. Store Zustand untuk membedakan local UI state vs global app state.

## 7. Next Practice

Latihan bertahap:

1. Tambah debounce search dengan `useEffect` cleanup.
2. Hitung derived list dengan `useMemo` (contoh top-rated movies).
3. Buat `usePrevious` custom hook pakai `useRef`.
4. Buat context kecil (misal language/theme sederhana) pakai `useContext`.

Kalau sudah nyaman, lanjut ke custom hooks pattern dan optimasi render dengan `React.memo` + selector state.
