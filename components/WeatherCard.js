import {
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Mapping kode cuaca dari Open-Meteo ke label & emoji Bahasa Indonesia
const WEATHER_LABELS = {
  0: { label: "Cerah", emoji: "☀️" },
  1: { label: "Cerah Berawan", emoji: "🌤️" },
  2: { label: "Berawan Sebagian", emoji: "⛅" },
  3: { label: "Berawan", emoji: "☁️" },
  45: { label: "Berkabut", emoji: "🌫️" },
  48: { label: "Berkabut Tebal", emoji: "🌫️" },
  51: { label: "Gerimis Ringan", emoji: "🌦️" },
  53: { label: "Gerimis", emoji: "🌦️" },
  55: { label: "Gerimis Lebat", emoji: "🌧️" },
  61: { label: "Hujan Ringan", emoji: "🌧️" },
  63: { label: "Hujan", emoji: "🌧️" },
  65: { label: "Hujan Lebat", emoji: "🌧️" },
  80: { label: "Hujan Lokal", emoji: "🌦️" },
  95: { label: "Badai Petir", emoji: "⛈️" },
};

function getWeatherInfo(code) {
  return WEATHER_LABELS[code] || { label: "Tidak diketahui", emoji: "❓" };
}

export default function WeatherCard({ location, placeName, weather }) {
  if (!weather) return null;

  const info = getWeatherInfo(weather.weathercode);

  const openInMaps = () => {
    const { latitude, longitude } = location;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{info.emoji}</Text>
      <Text style={styles.placeName}>
        {placeName || "Lokasi Tidak Diketahui"}
      </Text>
      <Text style={styles.temp}>{Math.round(weather.temperature)}°C</Text>
      <Text style={styles.label}>{info.label}</Text>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.detailText}>
          💨 Angin: {weather.windspeed} km/h
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.detailText}>
          📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </Text>
      </View>

      <TouchableOpacity style={styles.mapsButton} onPress={openInMaps}>
        <Text style={styles.mapsButtonText}>🗺️ Buka di Google Maps</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emoji: {
    fontSize: 56,
  },
  placeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },
  temp: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#0077b6",
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  row: {
    marginVertical: 2,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  mapsButton: {
    marginTop: 16,
    backgroundColor: "#0077b6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  mapsButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
