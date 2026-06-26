import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import WeatherCard from "./components/WeatherCard";

const STORAGE_KEY = "@cloudus_last_data";

// 3-state UI: 'idle' | 'loading' | 'success' | 'error'
export default function App() {
  const [status, setStatus] = useState("idle");
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [location, setLocation] = useState(null);
  const [placeName, setPlaceName] = useState(null);
  const [weather, setWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Load data terakhir dari AsyncStorage saat app dibuka (Persistensi)
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setLocation(parsed.location);
        setPlaceName(parsed.placeName);
        setWeather(parsed.weather);
        setStatus("success");
      }
    } catch (error) {
      console.log("Gagal load data tersimpan:", error);
    }
  };

  const saveData = async (locationData, place, weatherData) => {
    try {
      const payload = JSON.stringify({
        location: locationData,
        placeName: place,
        weather: weatherData,
      });
      await AsyncStorage.setItem(STORAGE_KEY, payload);
    } catch (error) {
      console.log("Gagal simpan data:", error);
    }
  };

  // Reverse geocoding: koordinat -> nama tempat
  const getPlaceName = async (latitude, longitude) => {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (result.length > 0) {
        const place = result[0];
        const parts = [place.city || place.subregion, place.region].filter(
          Boolean,
        );
        return parts.join(", ") || "Lokasi Tidak Diketahui";
      }
      return "Lokasi Tidak Diketahui";
    } catch (error) {
      console.log("Reverse geocode gagal:", error);
      return "Lokasi Tidak Diketahui";
    }
  };

  // Ambil cuaca dari Open-Meteo berdasarkan koordinat
  const getWeather = async (latitude, longitude) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Gagal mengambil data cuaca");
    }
    const data = await response.json();
    return data.current_weather;
  };

  const handleGetWeather = async () => {
    setStatus("loading");
    setErrorMsg(null);

    try {
      // 1. Request permission
      const { status: permStatus } =
        await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(permStatus);

      // 2. Cek status === 'granted'
      if (permStatus !== "granted") {
        setStatus("error");
        Alert.alert(
          "Izin Lokasi Ditolak",
          "CloudUs butuh akses lokasi untuk menampilkan cuaca di sekitarmu. Aktifkan izin lokasi di Pengaturan.",
          [
            { text: "Batal", style: "cancel" },
            { text: "Buka Pengaturan", onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }

      // 3. Ambil koordinat GPS
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      const coords = { latitude, longitude };
      setLocation(coords);

      // 4. Reverse geocoding (Level 3 bonus)
      const place = await getPlaceName(latitude, longitude);
      setPlaceName(place);

      // 5. Fetch cuaca dari Open-Meteo
      const weatherData = await getWeather(latitude, longitude);
      setWeather(weatherData);

      // 6. Simpan ke AsyncStorage (Persistensi)
      await saveData(coords, place, weatherData);

      setStatus("success");
    } catch (error) {
      console.log("Error:", error);
      setStatus("error");
      setErrorMsg(error.message || "Terjadi kesalahan tak terduga");
      Alert.alert("Gagal Memuat Cuaca", "Coba lagi beberapa saat lagi ya.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>☁️ CloudUs</Text>
        <Text style={styles.subtitle}>Cuaca Lokasimu, Sekarang Juga</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleGetWeather}
          disabled={status === "loading"}
        >
          <Text style={styles.buttonText}>
            {status === "loading" ? "Memuat..." : "📍 Cek Cuaca Lokasiku"}
          </Text>
        </TouchableOpacity>

        {/* STATE: loading */}
        {status === "loading" && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#0077b6" />
            <Text style={styles.infoText}>Mengambil lokasi & cuaca...</Text>
          </View>
        )}

        {/* STATE: error */}
        {status === "error" && (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>
              ⚠️ {errorMsg || "Izin lokasi diperlukan untuk melanjutkan"}
            </Text>
          </View>
        )}

        {/* STATE: success */}
        {status === "success" && weather && location && (
          <WeatherCard
            location={location}
            placeName={placeName}
            weather={weather}
          />
        )}

        {/* STATE: idle */}
        {status === "idle" && (
          <View style={styles.centerBox}>
            <Text style={styles.infoText}>
              Tekan tombol di atas untuk melihat cuaca di lokasimu sekarang.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0077b6",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#0077b6",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  centerBox: {
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  infoText: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#d00000",
    textAlign: "center",
  },
});
