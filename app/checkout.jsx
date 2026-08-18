import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCart } from "../src/context/CartContext";

const FONT = "Plus Jakarta Sans";
const PRIMARY = "#F97000";
const DELIVERY_FEE = 40;
const SERVICE_FEE = 20;

// Shared labeled input with the same focus/error styling used across the app
function FormField({ label, error, focused, onFocus, onBlur, ...inputProps }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputWrap, focused && styles.focusedInput, error && styles.errorInput]}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          onFocus={onFocus}
          onBlur={onBlur}
          {...inputProps}
        />
      </View>
      {error ? (
        <View style={styles.fieldErrorRow}>
          <Ionicons name="warning-outline" size={14} color="#D94343" />
          <Text style={styles.fieldErrorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function CheckoutScreen() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const total = cartTotal + DELIVERY_FEE + SERVICE_FEE;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState("");
  const [showOrderSheet, setShowOrderSheet] = useState(false);

  useEffect(() => {
    // Pre-fill contact info and the default saved address, if any.
    const loadSavedDetails = async () => {
      const savedUser = await AsyncStorage.getItem("current_user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setFullName(user.fullName || "");
        setPhone(user.phone || "");
      }

      const savedAddresses = await AsyncStorage.getItem("saved_addresses");
      if (savedAddresses) {
        const addresses = JSON.parse(savedAddresses);
        const defaultAddress = addresses.find((address) => address.isDefault) || addresses[0];
        if (defaultAddress) {
          setStreet(defaultAddress.street || "");
          setBarangay(defaultAddress.barangay || "");
          setCity(defaultAddress.city || "");
          setLandmark(defaultAddress.landmark || "");
        }
      }
    };
    loadSavedDetails();
  }, []);

  const focusField = (name) => setFocusedField(name);
  const blurField = () => setFocusedField("");

  const validate = () => {
    const next = {};
    if (!fullName.trim()) next.fullName = "Full name is required";
    if (!phone.trim()) next.phone = "Phone number is required";
    if (!street.trim()) next.street = "Street address is required";
    if (!barangay.trim()) next.barangay = "Barangay is required";
    if (!city.trim()) next.city = "City is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const confirmOrder = () => {
    if (!validate()) return;

    const orderId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const order = {
      orderId,
      items: cartItems,
      total,
      fullName,
      phone,
      street,
      barangay,
      city,
      landmark,
      paymentMethod: "COD",
    };

    clearCart();
    router.push({ pathname: "/order-confirmed", params: { order: JSON.stringify(order) } });
  };

  const cancelOrder = () => {
    Alert.alert("Cancel this order?", "", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          clearCart();
          router.replace("/(tabs)/home");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={PRIMARY} />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.orderBar}>
          <View style={styles.orderIconWrap}>
            <Ionicons name="briefcase-outline" size={20} color={PRIMARY} />
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.orderLabel}>Your Order</Text>
            <Text style={styles.orderTotal}>₱ {total.toFixed(2)}</Text>
          </View>
          <Pressable onPress={() => setShowOrderSheet(true)}>
            <Text style={styles.viewLink}>View</Text>
          </Pressable>
        </View>

        <FormField
          label="Full Name"
          placeholder="John Doe"
          value={fullName}
          onChangeText={setFullName}
          error={errors.fullName}
          focused={focusedField === "fullName"}
          onFocus={() => focusField("fullName")}
          onBlur={blurField}
        />

        <FormField
          label="Phone Number"
          placeholder="09XX XXX XXXX"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          error={errors.phone}
          focused={focusedField === "phone"}
          onFocus={() => focusField("phone")}
          onBlur={blurField}
        />

        <FormField
          label="Street Address"
          placeholder="House no., Street name..."
          value={street}
          onChangeText={setStreet}
          error={errors.street}
          focused={focusedField === "street"}
          onFocus={() => focusField("street")}
          onBlur={blurField}
        />

        <View style={styles.row}>
          <View style={styles.halfField}>
            <FormField
              label="Barangay"
              placeholder="Barangay"
              value={barangay}
              onChangeText={setBarangay}
              error={errors.barangay}
              focused={focusedField === "barangay"}
              onFocus={() => focusField("barangay")}
              onBlur={blurField}
            />
          </View>
          <View style={styles.halfField}>
            <FormField
              label="City"
              placeholder="City"
              value={city}
              onChangeText={setCity}
              error={errors.city}
              focused={focusedField === "city"}
              onFocus={() => focusField("city")}
              onBlur={blurField}
            />
          </View>
        </View>

        <Text style={styles.fieldLabel}>Payment Method</Text>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentValue}>COD</Text>
          {/* Only cash on delivery is supported for now */}
          <Text style={styles.changeText}>CHANGE</Text>
        </View>

        <FormField
          label="Landmark (optional)"
          placeholder="e.g. near 7 Eleven..."
          value={landmark}
          onChangeText={setLandmark}
          focused={focusedField === "landmark"}
          onFocus={() => focusField("landmark")}
          onBlur={blurField}
        />

        <Pressable style={styles.cancelButton} onPress={cancelOrder}>
          <Text style={styles.cancelText}>Cancel Order</Text>
        </Pressable>

        <Pressable style={styles.confirmButton} onPress={confirmOrder}>
          <Text style={styles.confirmText}>Confirm Order</Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={showOrderSheet}
        animationType="slide"
        transparent
        onRequestClose={() => setShowOrderSheet(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Your Order</Text>
            <ScrollView style={styles.sheetList}>
              {cartItems.map((item) => (
                <View key={`${item.id}-${item.size}`} style={styles.sheetRow}>
                  <Text style={styles.sheetItemName} numberOfLines={1}>
                    {item.name}{item.size ? ` (${item.size})` : ""} x{item.quantity}
                  </Text>
                  <Text style={styles.sheetItemPrice}>₱{item.price * item.quantity}</Text>
                </View>
              ))}
            </ScrollView>
            <Pressable style={styles.closeButton} onPress={() => setShowOrderSheet(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#121212",
    fontFamily: FONT,
    fontSize: 20,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  orderBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBEAE1",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  orderIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  orderInfo: {
    flex: 1,
  },
  orderLabel: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 13,
  },
  orderTotal: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },
  viewLink: {
    color: PRIMARY,
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: "700",
  },
  fieldGroup: {
    marginBottom: 4,
  },
  fieldLabel: {
    color: "#4B4B4B",
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputWrap: {
    minHeight: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  focusedInput: {
    borderColor: PRIMARY,
  },
  errorInput: {
    borderColor: "#D94343",
    backgroundColor: "#FFF3F2",
  },
  input: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 14,
    paddingVertical: 10,
  },
  fieldErrorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  fieldErrorText: {
    color: "#D94343",
    fontFamily: FONT,
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  paymentValue: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 14,
  },
  changeText: {
    color: "#9CA3AF",
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: "600",
  },
  cancelButton: {
    height: 54,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#121212",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  cancelText: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: "700",
  },
  confirmButton: {
    height: 54,
    borderRadius: 9,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  confirmText: {
    color: "#FFFFFF",
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  sheetTitle: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  sheetList: {
    marginBottom: 16,
  },
  sheetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sheetItemName: {
    flex: 1,
    marginRight: 8,
    color: "#121212",
    fontFamily: FONT,
    fontSize: 14,
  },
  sheetItemPrice: {
    color: PRIMARY,
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: "700",
  },
  closeButton: {
    height: 48,
    borderRadius: 9,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: "700",
  },
});
