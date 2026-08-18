import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FONT = "Plus Jakarta Sans";
const ORANGE = "#F97000";

export default function OrdersScreen() {
  // Replace with real order history once the orders API is available.
  const hasOrders = false;

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>My Orders</Text>

      {hasOrders ? null : (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={72} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>Your order history will appear here</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => router.push("/(tabs)/home")}>
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 22,
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
  },
  emptySubtitle: {
    color: "#8A8A8A",
    fontFamily: FONT,
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },
  browseButton: {
    height: 48,
    paddingHorizontal: 32,
    borderRadius: 9,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: "700",
  },
});
