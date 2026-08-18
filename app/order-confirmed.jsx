import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const FONT = "Plus Jakarta Sans";
const PRIMARY = "#F97000";

export default function OrderConfirmedScreen() {
  const { order } = useLocalSearchParams();
  const orderId = order ? JSON.parse(order).orderId : "";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="checkmark-circle" size={100} color="#22C55E" />
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>
          {orderId ? `Your order ${orderId} is being prepared` : "Your order is being prepared"}
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace("/(tabs)/home")}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECECEC",
    paddingHorizontal: 28,
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 30,
    fontWeight: "700",
    marginTop: 24,
    textAlign: "center",
  },
  subtitle: {
    color: "#8F8F8F",
    fontFamily: FONT,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: PRIMARY,
    borderRadius: 9,
    height: 54,
    justifyContent: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: "700",
  },
});
