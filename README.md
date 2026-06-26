# ☁️ CloudUs 

Aplikasi React Native (Expo) yang menampilkan cuaca terkini berdasarkan lokasi GPS pengguna, dilengkapi nama tempat (reverse geocoding) dan tombol untuk membuka lokasi di Google Maps.

## 📱 Fitur Native yang Dipakai

- **GPS (expo-location)** — mengambil koordinat lokasi pengguna dengan permission flow yang benar.

## ✅ Daftar Fitur

### Level 1 — Core
- Permission flow: request izin → cek `status === 'granted'` → ambil lokasi
- Penolakan izin ditangani dengan Alert ramah, tidak crash
- Tampilkan latitude/longitude pengguna
- UI rapi menampilkan hasil cuaca & lokasi

### Level 2 — Pengembangan 
- 🗺️ **Buka di Maps** — tombol yang membuka koordinat di Google Maps via `Linking`
- 💾 **Persistensi** — data lokasi & cuaca terakhir disimpan di `AsyncStorage`, dimuat otomatis saat app dibuka

### Level 3 — Bonus
- 🌐 **GPS + API Cuaca** — integrasi dengan Open-Meteo API untuk cuaca real-time
- 🔁 **Reverse Geocoding** — koordinat diubah menjadi nama tempat (`Location.reverseGeocodeAsync`)
- 🔁 **Tombol Settings** — saat izin ditolak, ada tombol langsung ke Pengaturan HP

## 📸 Screenshot
1. Dialog permission izin lokasi
   <img width="720" height="1600" alt="dialog izin" src="https://github.com/user-attachments/assets/57b6d37c-3971-44a9-8efe-2e0984c307b5" />

2. Hasil cuaca & lokasi setelah izin diberikan
   <img width="720" height="1600" alt="hasil" src="https://github.com/user-attachments/assets/c6003497-dfe1-44ee-9c4a-f191dfc7152d" />

3. Penanganan saat izin ditolak (Alert + tombol Settings)
   <img width="720" height="1600" alt="penanganan penolakan" src="https://github.com/user-attachments/assets/43e78c90-e265-4207-8fc3-852340109cbe" />


## 🛠️ Tech Stack

- React Native + Expo
- `expo-location` — GPS & reverse geocoding
- `@react-native-async-storage/async-storage` — persistensi data
- [Open-Meteo API](https://open-meteo.com/) — data cuaca gratis tanpa API key

## 🚀 Cara Menjalankan

\`\`\`bash
git clone https://github.com/USERNAME/CloudUs.git
cd CloudUs
npm install
npx expo start
\`\`\`

Scan QR code yang muncul menggunakan aplikasi **Expo Go** di HP Android/iOS.

## 🔗 Expo Snack

https://snack.expo.dev/@niell77/cloudus

## 👤 Dibuat oleh

Revael Daniel 
