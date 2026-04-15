# React Native Components Guide

Panduan ringkas untuk memahami komponen React Native yang paling sering dipakai di project ini.

## 1. Mindset Dasar

React Native bukan HTML di browser.

- Web: UI dirender dengan elemen HTML.
- React Native: UI dirender ke komponen native iOS/Android.

Karena itu, komponen seperti `View` dan `Text` menjadi fondasi utama.

## 2. Komponen Inti dan Analogi Web

### View

- Fungsi: container/layout.
- Analogi web: div.

### Text

- Fungsi: menampilkan teks.
- Analogi web: p/span/h1-h6.
- Catatan: teks wajib dibungkus `Text`.

### Image

- Fungsi: menampilkan gambar.
- Analogi web: img.

### TextInput

- Fungsi: input teks.
- Analogi web: input/textarea.

### Pressable atau TouchableOpacity

- Fungsi: elemen interaktif untuk klik/tap.
- Analogi web: button atau a.

### ScrollView

- Fungsi: konten scroll untuk item sedikit/sederhana.
- Analogi web: container dengan overflow scroll.

### FlatList

- Fungsi: list data panjang dengan performa lebih baik.
- Analogi web: map list + virtualization.

### SectionList

- Fungsi: list dengan grup section.

### ActivityIndicator

- Fungsi: indikator loading.

## 3. Kenapa FlatList Penting

`FlatList` hanya merender item yang terlihat di layar + sedikit buffer.

Keuntungan:

- Lebih hemat memori.
- Scroll lebih smooth.
- Cocok untuk data API yang bisa panjang.

Di project ini, home screen menggunakan `FlatList` + infinite scroll, jadi ini contoh real penggunaan yang benar.

## 4. Props FlatList Yang Wajib Dipahami

### data

Array item yang akan dirender.

### renderItem

Function untuk render satu item.

### keyExtractor

Function untuk key unik, biasanya id.

### ListEmptyComponent

UI saat data kosong.

### refreshControl

Mendukung pull-to-refresh.

### onEndReached

Dipakai untuk pagination/load more.

## 5. Contoh FlatList Sederhana

```tsx
<FlatList
  data={movies}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View>
      <Text>{item.title}</Text>
    </View>
  )}
  ListEmptyComponent={<Text>Data kosong</Text>}
/>
```

## 6. Kapan Pakai ScrollView vs FlatList

- ScrollView: konten statis, item sedikit.
- FlatList: list dinamis dari API, item banyak.
- SectionList: list berkelompok (misal per genre/tanggal).

## 7. Mapping Cepat Web ke React Native

- div -> View
- p/span/h1 -> Text
- img -> Image
- input -> TextInput
- button -> Pressable atau TouchableOpacity
- ul/li -> FlatList + renderItem

## 8. Relevansi Ke Project Ini

Contoh penggunaan komponen di project:

- Home: `FlatList`, `RefreshControl`, `ActivityIndicator`.
- Search: input query + list result.
- Detail: `ScrollView`, `Image`, tombol favorite, trailer launcher.
- Auth: `TextInput` dan tombol action.

## 9. Latihan Praktik

1. Tambahkan loading skeleton di Home.
2. Tambahkan empty state yang lebih informatif di Search.
3. Tambahkan section recommendation di detail (pakai list horizontal).

## 10. Referensi Resmi

- React Native Components and APIs:
  https://reactnative.dev/docs/components-and-apis
