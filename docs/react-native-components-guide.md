# React Native Components Guide (Dengan Analoginya di Web)

Dokumen ini dibuat biar kamu cepat paham komponen bawaan React Native, terutama kenapa beda dari tag HTML.

## 1) Mindset Dasar: React Native Bukan HTML

Di web, browser paham tag seperti div, p, img, button.
Di React Native, kamu render komponen native iOS/Android, jadi tag HTML tidak dipakai.

Ibaratnya:

- Web = browser membaca HTML + CSS
- React Native = JavaScript memerintah UI native lewat komponen React Native

Makanya yang dipakai adalah View, Text, Image, FlatList, dan lain-lain.

## 2) Komponen Dasar dan Analogi Web

## View

- Kegunaan: container/layout utama
- Analogi web: div
- Catatan: semua layout hampir selalu dibungkus View

## Text

- Kegunaan: menampilkan teks
- Analogi web: p, span, h1-h6 (tergantung styling)
- Catatan penting: teks harus dibungkus Text, tidak bisa plain text langsung seperti di HTML

## Image

- Kegunaan: menampilkan gambar
- Analogi web: img
- Catatan: source pakai object, misal source={{ uri: '...' }}

## TextInput

- Kegunaan: input teks
- Analogi web: input, textarea
- Catatan: pakai value + onChangeText (controlled input)

## Pressable / TouchableOpacity

- Kegunaan: area yang bisa ditekan
- Analogi web: button, a
- Catatan: di React Native tidak ada hover seperti web desktop secara default

## ScrollView

- Kegunaan: konten yang bisa di-scroll
- Analogi web: div dengan overflow: auto
- Catatan: render semua item sekaligus, cocok untuk list kecil

## FlatList

- Kegunaan: render list panjang secara efisien
- Analogi web: map array, tapi dengan virtualized rendering
- Catatan penting: ini pengganti map biasa untuk data banyak

## SectionList

- Kegunaan: list dengan grup section
- Analogi web: list yang dikelompokkan per kategori

## SafeAreaView

- Kegunaan: menghindari notch/status bar area
- Analogi web: tidak ada padanan langsung, lebih ke layout helper mobile

## Modal

- Kegunaan: pop up layer di atas konten utama
- Analogi web: modal/dialog

## ActivityIndicator

- Kegunaan: loading spinner
- Analogi web: spinner/loading icon

## Switch

- Kegunaan: toggle on/off
- Analogi web: checkbox toggle

## 3) FlatList: Kenapa Penting?

Ini jawaban inti pertanyaan kamu.

FlatList dipakai untuk list data yang bisa banyak, misalnya movie list.
Alasan pakai FlatList:

- Lebih hemat memori
- Lebih smooth
- Hanya render item yang terlihat di layar (virtualization)

Kalau kamu pakai ScrollView + map untuk 1000 item:

- Semua item dirender sekaligus
- Berat
- Potensi lag

Kalau pakai FlatList:

- Yang dirender cuma item terlihat + buffer
- Jauh lebih ringan

## 4) Props FlatList yang Sering Dipakai

## data

Array data yang mau ditampilkan.

## renderItem

Function untuk render 1 item.

## keyExtractor

Kasih key unik untuk setiap item.

## ListEmptyComponent

UI saat data kosong.

## refreshControl / onRefresh / refreshing

Untuk pull-to-refresh.

## onEndReached

Trigger saat hampir ke bawah list, biasa untuk pagination/infinite scroll.

## 5) Contoh FlatList Sederhana

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

## 6) Kapan Pakai Apa? (Cheat Sheet)

- List kecil (5-20 item statis): ScrollView + map boleh
- List dinamis banyak item: FlatList
- List berkelompok kategori: SectionList
- Konten form panjang: ScrollView
- Tombol custom: Pressable atau TouchableOpacity

## 7) Mapping Cepat Web ke React Native

- div -> View
- p/span/h\* -> Text
- img -> Image
- input -> TextInput
- button -> Pressable atau TouchableOpacity
- ul/li (list) -> FlatList renderItem
- modal -> Modal

## 8) Tips Belajar Biar Cepat Paham

- Fokus dulu 6 komponen inti: View, Text, Image, TextInput, Pressable, FlatList
- Setiap bikin screen, mulai dari struktur:
  1. Wrapper View
  2. Header Text
  3. Content (FlatList/ScrollView)
  4. Action Button
- Cek dokumentasi resmi saat ragu props:
  https://reactnative.dev/docs/components-and-apis

## 9) Relevansi ke Project Kamu

Di Home screen kamu sekarang, FlatList sudah tepat karena data movie bisa panjang.
Nanti kalau tambah pagination (load more), FlatList akan makin terasa manfaatnya.

---

Kalau kamu mau, next step saya bisa buatkan versi lanjutan:

- FlatList advanced (pagination + skeleton loading + error state)
- Perbandingan performa ScrollView vs FlatList langsung di project kamu
