import { router } from "expo-router";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Registration will be available here soon.</Text>
      </View>
      <TouchableOpacity onPress={() => router.back()} style={styles.button}>
        <Text style={styles.buttonText}>Back to Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ECECEC", justifyContent: "center", padding: 28 },
  title: { color: "#121212", fontSize: 32, fontWeight: "700" },
  subtitle: { color: "#6B7280", fontSize: 16, marginTop: 10 },
  button: { alignItems: "center", backgroundColor: "#101215", borderRadius: 9, marginTop: 32, padding: 16 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
