import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const FONT = "Plus Jakarta Sans";
const PRIMARY = "#F97000";
const DANGCAGAN = {
  latitude: 7.9667,
  longitude: 124.9167,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

function firstParam(value) {
  return Array.isArray(value) ? value[0] : value;
}

export default function MapPickerScreen() {
  const params = useLocalSearchParams();
  const latitude = Number(firstParam(params.latitude));
  const longitude = Number(firstParam(params.longitude));
  const returnTo = firstParam(params.returnTo) || "/add-address";
  const draft = firstParam(params.draft) || "{}";
  const initialCoordinate =
    Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude } : null;
  const [selectedCoordinate, setSelectedCoordinate] = useState(initialCoordinate);

  const selectCoordinate = (coordinate) => {
    setSelectedCoordinate({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  };

  const confirmLocation = () => {
    if (!selectedCoordinate) return;

    router.replace({
      pathname: returnTo,
      params: {
        draft,
        latitude: String(selectedCoordinate.latitude),
        longitude: String(selectedCoordinate.longitude),
      },
    });
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "right", "bottom", "left"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#191919" />
        </Pressable>
        <Text style={styles.headerTitle}>Pick Location</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.mapArea}>
        <MapView
          style={styles.map}
          initialRegion={
            initialCoordinate
              ? { ...initialCoordinate, latitudeDelta: 0.005, longitudeDelta: 0.005 }
              : DANGCAGAN
          }
          onPress={(event) => selectCoordinate(event.nativeEvent.coordinate)}
        >
          {selectedCoordinate ? (
            <Marker
              coordinate={selectedCoordinate}
              draggable
              onDragEnd={(event) => selectCoordinate(event.nativeEvent.coordinate)}
            />
          ) : null}
        </MapView>

        <View style={styles.searchWrap} pointerEvents="box-none">
          <View style={styles.searchBar}>
            <Ionicons name="search" size={19} color="#777777" />
            {/* TODO: Connect search to the backend. */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search location"
              placeholderTextColor="#888888"
              editable={false}
            />
          </View>
        </View>

        <View style={styles.bottomCard}>
          <View style={styles.handle} />
          <View style={styles.addressRow}>
            <View style={styles.pinCircle}>
              <Ionicons name="location" size={21} color={PRIMARY} />
            </View>
            <View style={styles.addressCopy}>
              {selectedCoordinate ? (
                <>
                  <Text style={styles.addressLabel}>Selected address</Text>
                  {/* TODO: Replace with reverse-geocoded coordinates. */}
                  <Text style={styles.addressText}>Dangcagan, Bukidnon</Text>
                  <Text style={styles.coordinatesText}>
                    {selectedCoordinate.latitude.toFixed(6)}, {selectedCoordinate.longitude.toFixed(6)}
                  </Text>
                </>
              ) : (
                <Text style={styles.tapHint}>Tap on the map to select your location</Text>
              )}
            </View>
          </View>
          <Pressable
            style={[styles.confirmButton, !selectedCoordinate && styles.disabledButton]}
            onPress={confirmLocation}
            disabled={!selectedCoordinate}
          >
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 15, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#EEEEEE", zIndex: 2 },
  headerTitle: { flex: 1, textAlign: "center", fontFamily: FONT, fontSize: 18, fontWeight: "700", color: "#191919" },
  headerSpacer: { width: 24 },
  mapArea: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  searchWrap: { position: "absolute", top: 14, right: 16, left: 16 },
  searchBar: { height: 48, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, borderRadius: 12, backgroundColor: "#FFFFFF", shadowColor: "#000000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 4 },
  searchInput: { flex: 1, marginLeft: 9, paddingVertical: 0, fontFamily: FONT, fontSize: 13, color: "#333333" },
  bottomCard: { position: "absolute", right: 0, bottom: 0, left: 0, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 18, borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: "#FFFFFF", shadowColor: "#000000", shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 8 },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: "#D7D7D7", marginBottom: 17 },
  addressRow: { flexDirection: "row", alignItems: "center" },
  pinCircle: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: "#FFF0E5", marginRight: 12 },
  addressCopy: { flex: 1 },
  addressLabel: { fontFamily: FONT, fontSize: 11, color: "#858585" },
  addressText: { marginTop: 2, fontFamily: FONT, fontSize: 14, fontWeight: "700", color: "#252525" },
  coordinatesText: { marginTop: 3, fontFamily: FONT, fontSize: 10, color: "#888888" },
  tapHint: { fontFamily: FONT, fontSize: 12, color: "#777777" },
  confirmButton: { height: 54, alignItems: "center", justifyContent: "center", marginTop: 18, borderRadius: 11, backgroundColor: PRIMARY },
  disabledButton: { backgroundColor: "#CFCFCF" },
  confirmButtonText: { fontFamily: FONT, fontSize: 14, fontWeight: "700", color: "#FFFFFF" },
});
