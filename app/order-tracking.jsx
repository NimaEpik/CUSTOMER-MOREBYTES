import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const FONT = "Plus Jakarta Sans";
const PRIMARY = "#F97000";

// Hardcoded for testing — replace with real API status later
const currentStatus = "Delivered";

const CUSTOMER_LOCATION = { latitude: 7.9667, longitude: 124.9167 };
const RIDER_LOCATION = { latitude: 7.9712, longitude: 124.9109 };
const MAP_REGION = {
  latitude: 7.9667,
  longitude: 124.9167,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

function parseOrder(value) {
  if (!value) return {};
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function TimelineStep({ icon, title, description, timestamp, state, last }) {
  const iconStyle = state === "complete"
    ? styles.completeIcon
    : state === "active"
      ? styles.activeIcon
      : styles.pendingIcon;
  const iconColor = state === "pending" ? "#9CA3AF" : "#FFFFFF";

  return (
    <View style={styles.timelineStep}>
      <View style={styles.timelineIndicator}>
        <View style={[styles.timelineIcon, iconStyle]}>
          <Ionicons name={icon} size={16} color={iconColor} />
        </View>
        {!last ? (
          <View style={[styles.timelineLine, state === "complete" && styles.completeLine]} />
        ) : null}
      </View>
      <View style={styles.timelineCopy}>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineDescription}>{description}</Text>
        {timestamp ? <Text style={styles.timelineTime}>{timestamp}</Text> : null}
      </View>
    </View>
  );
}

export default function OrderTrackingScreen() {
  const params = useLocalSearchParams();
  const order = parseOrder(params.order);
  const orderId = params.orderId || order.orderId || "#ORD-0000";
  const items = Array.isArray(order.items) ? order.items : [];
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const openRating = () => {
    if (currentStatus === "Delivered") router.push("/rate-order");
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#121212" />
        </Pressable>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <View style={styles.orderBadge}>
          <Text style={styles.orderBadgeText}>{orderId}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Replace with real GPS coordinates from backend when ready */}
        <MapView style={styles.map} initialRegion={MAP_REGION}>
          <Marker coordinate={CUSTOMER_LOCATION} title="Delivery Location" />
          <Marker coordinate={RIDER_LOCATION} title="Rider">
            <View style={styles.riderMarker}>
              <Ionicons name="bicycle" size={18} color="#FFFFFF" />
            </View>
          </Marker>
          <Polyline
            coordinates={[RIDER_LOCATION, CUSTOMER_LOCATION]}
            strokeColor={PRIMARY}
            strokeWidth={4}
          />
        </MapView>

        <View style={styles.content}>
          <View style={styles.arrivalCard}>
            <View>
              <Text style={styles.arrivalLabel}>Estimated Arrival</Text>
              <Text style={styles.arrivalTime}>10 min</Text>
            </View>
            <View style={styles.arrivalRight}>
              <Text style={styles.arrivalLabel}>By</Text>
              <Text style={styles.arrivalBy}>1:30 PM</Text>
            </View>
            <View style={styles.distanceRow}>
              <Ionicons name="location" size={14} color="#9CA3AF" />
              <Text style={styles.distanceText}>10.67 km away from your location</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={styles.timelineCard}>
            <TimelineStep
              icon="checkmark"
              title="Order Confirmed"
              description="Your order has been received"
              timestamp="1:07 PM"
              state="complete"
            />
            <TimelineStep
              icon="checkmark"
              title="Preparing"
              description="Your food is being prepared"
              timestamp="1:10 PM"
              state="complete"
            />
            <TimelineStep
              icon="bicycle"
              title="Out For Delivery"
              description="Your order is on the way"
              timestamp="1:20 PM"
              state="active"
            />
            <TouchableOpacity onPress={openRating} activeOpacity={0.8}>
              <TimelineStep
                icon="home-outline"
                title="Delivered"
                description="Order will be delivered soon"
                state="pending"
                last
              />
            </TouchableOpacity>
          </View>

          <Pressable
            style={styles.detailsToggle}
            onPress={() => setDetailsExpanded((current) => !current)}
          >
            <View style={styles.detailsToggleTitle}>
              <Ionicons name="receipt-outline" size={19} color="#121212" />
              <Text style={styles.detailsToggleText}>Order Details</Text>
            </View>
            <Ionicons
              name={detailsExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#6B7280"
            />
          </Pressable>

          {detailsExpanded ? (
            <View style={styles.expandedDetails}>
              {items.length ? items.map((item) => (
                <View key={`${item.id}-${item.size}`} style={styles.itemRow}>
                  <Text style={styles.itemName}>
                    {item.quantity}x {item.name}{item.size ? ` (${item.size})` : ""}
                  </Text>
                  <Text style={styles.itemPrice}>₱{item.price * item.quantity}</Text>
                </View>
              )) : <Text style={styles.emptyDetails}>Order items are unavailable</Text>}
              <View style={styles.detailsDivider} />
              <View style={styles.itemRow}>
                <Text style={styles.detailsTotalLabel}>Total Amount</Text>
                <Text style={styles.detailsTotal}>₱{Number(order.total || 0).toLocaleString()}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {currentStatus === "Delivered" ? (
          <TouchableOpacity style={styles.rateButton} onPress={openRating} activeOpacity={0.85}>
            <Ionicons name="star-outline" size={22} color="#FFFFFF" />
            <Text style={styles.rateButtonText}>Rate Your Order</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    flex: 1,
    color: "#121212",
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginLeft: 12,
  },
  orderBadge: {
    borderWidth: 1,
    borderColor: PRIMARY,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  orderBadgeText: {
    color: PRIMARY,
    fontFamily: FONT,
    fontSize: 10,
    fontWeight: "700",
  },
  map: {
    width: "100%",
    height: 250,
  },
  riderMarker: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: "#2563EB",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  arrivalCard: {
    backgroundColor: "#121212",
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
  },
  arrivalLabel: {
    color: "#9CA3AF",
    fontFamily: FONT,
    fontSize: 11,
  },
  arrivalTime: {
    color: "#FFFFFF",
    fontFamily: FONT,
    fontSize: 26,
    fontWeight: "700",
    marginTop: 2,
  },
  arrivalRight: {
    position: "absolute",
    top: 14,
    right: 14,
    alignItems: "flex-end",
  },
  arrivalBy: {
    color: "#FFFFFF",
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 12,
  },
  distanceText: {
    color: "#9CA3AF",
    fontFamily: FONT,
    fontSize: 10,
  },
  sectionTitle: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },
  timelineCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
  },
  timelineStep: {
    minHeight: 72,
    flexDirection: "row",
  },
  timelineIndicator: {
    width: 38,
    alignItems: "center",
  },
  timelineIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  completeIcon: {
    backgroundColor: "#22C55E",
  },
  activeIcon: {
    backgroundColor: PRIMARY,
  },
  pendingIcon: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#D1D5DB",
  },
  completeLine: {
    backgroundColor: "#22C55E",
  },
  timelineCopy: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 2,
  },
  timelineTitle: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: "700",
  },
  timelineDescription: {
    color: "#6B7280",
    fontFamily: FONT,
    fontSize: 11,
    marginTop: 3,
  },
  timelineTime: {
    color: "#9CA3AF",
    fontFamily: FONT,
    fontSize: 10,
    marginTop: 2,
  },
  detailsToggle: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginTop: 16,
  },
  detailsToggleTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailsToggleText: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: "600",
  },
  expandedDetails: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#E5E7EB",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 14,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },
  itemName: {
    flex: 1,
    color: "#4B5563",
    fontFamily: FONT,
    fontSize: 12,
    marginRight: 10,
  },
  itemPrice: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyDetails: {
    color: "#9CA3AF",
    fontFamily: FONT,
    fontSize: 12,
    textAlign: "center",
  },
  detailsDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 6,
  },
  detailsTotalLabel: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: "700",
  },
  detailsTotal: {
    color: PRIMARY,
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: "700",
  },
  rateButton: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: PRIMARY,
    borderRadius: 9,
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  rateButtonText: {
    color: "#FFFFFF",
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: "700",
  },
});
