import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const FONT_REGULAR = "Plus Jakarta Sans";
const FONT_MEDIUM = "Plus Jakarta Sans";
const FONT_BOLD = "Plus Jakarta Sans";

export default function LoginScreen() {
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [loginError, setLoginError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const signIn = async () => {
    const hasPhone = phoneValue.trim().length > 0;
    const hasPassword = passwordValue.trim().length > 0;

    if (!hasPhone || !hasPassword) {
      setLoginError("Incorrect phone number or password. Please try again.");
      setPhoneError(!hasPhone ? "Phone number is required" : "");
      setPasswordError(!hasPassword ? "Password is required" : "");
      return;
    }

    // Read the latest saved accounts for each sign-in attempt.
    const savedAccounts = await AsyncStorage.getItem("registered_accounts");
    const accounts = savedAccounts ? JSON.parse(savedAccounts) : [];
    const account = accounts.find((savedAccount) => savedAccount.phone === phoneValue);

    if (!account) {
      setLoginError("");
      setPhoneError("Phone number not found");
      setPasswordError("");
      return;
    }
    if (account.password !== passwordValue) {
      setLoginError("");
      setPhoneError("");
      setPasswordError("Incorrect Password");
      return;
    }

    await AsyncStorage.setItem("current_user", JSON.stringify({ fullName: account.fullName, phone: account.phone }));
    setLoginError("");
    setPhoneError("");
    setPasswordError("");
    router.push("/(tabs)/home");
  };
  return (
    <SafeAreaView style={styles.loginContainer}>
      <View style={styles.loginHeader}>
        <Text style={styles.loginTitle}>Login Account</Text>
        <Text style={styles.loginSubtitle}>Enter your account to proceed</Text>
        <View style={styles.headerDivider} />
      </View>

      <View style={styles.formArea}>
        {loginError ? (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={18} color="#D94343" style={styles.errorBannerIcon} />
            <Text style={styles.errorBannerText}>{loginError}</Text>
          </View>
        ) : null}
        <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
        <View style={[styles.inputWrap, phoneFocused && styles.focusedInputWrap, phoneError && styles.errorInputWrap]}>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="09XX XXX XXX"
            placeholderTextColor="#9CA3AF"
            value={phoneValue}
            onChangeText={setPhoneValue}
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
          />
        </View>
        {phoneError ? (
          <View style={styles.fieldErrorRow}>
            <Ionicons name="warning-outline" size={14} color="#D94343" style={styles.fieldErrorIcon} />
            <Text style={styles.fieldErrorText}>{phoneError}</Text>
          </View>
        ) : null}

        <Text style={styles.fieldLabel}>PASSWORD</Text>
        <View style={[styles.inputWrap, styles.passwordWrap, passwordFocused && styles.focusedInputWrap, passwordError && styles.errorInputWrap]}>
          <TextInput
            style={styles.input}
            secureTextEntry={!passwordVisible}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            value={passwordValue}
            onChangeText={setPasswordValue}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} activeOpacity={0.7}>
            <Ionicons name={passwordVisible ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <View style={styles.fieldErrorRow}>
            <Ionicons name="warning-outline" size={14} color="#D94343" style={styles.fieldErrorIcon} />
            <Text style={styles.fieldErrorText}>{passwordError}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.forgotRow} activeOpacity={0.8} onPress={() => router.push("/(auth)/forgot-password")}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton} activeOpacity={0.85} onPress={signIn}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.signupRow}>
        <Text style={styles.signupText}>Don&apos;t have an account? </Text>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/(auth)/register")}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: "#ECECEC",
    paddingHorizontal: 28,
    justifyContent: "flex-start",
    paddingTop: 60,
    paddingBottom: 26,
  },
  loginHeader: {
    marginTop: 10,
  },
  loginTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 37,
    color: "#121212",
  },
  loginSubtitle: {
    marginTop: 8,
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: "#8F8F8F",
  },
  headerDivider: {
    marginTop: 16,
    height: 1,
    width: "100%",
    backgroundColor: "#F0F0F0",
  },
  formArea: {
    marginTop: 18,
  },
  fieldLabel: {
    marginTop: 12,
    marginBottom: 8,
    fontFamily: FONT_MEDIUM,
    color: "#4B4B4B",
    fontSize: 12,
    letterSpacing: 0.3,
  },
  inputWrap: {
    minHeight: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  focusedInputWrap: {
    borderColor: "#F97000",
    backgroundColor: "#FFFFFF",
  },
  errorInputWrap: {
    borderColor: "#D94343",
    backgroundColor: "#FFF3F2",
  },
  passwordWrap: {
    borderColor: "#D4D4D4",
  },
  input: {
    flex: 1,
    fontFamily: FONT_REGULAR,
    color: "#1F2937",
    fontSize: 14,
    paddingVertical: 10,
  },
  forgotRow: {
    alignSelf: "flex-end",
    marginTop: 12,
    marginBottom: 14,
  },
  forgotText: {
    color: "#E37925",
    fontFamily: FONT_MEDIUM,
    fontSize: 13,
  },
  errorBanner: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#FDEDEC",
    borderWidth: 1,
    borderColor: "#F5C6CB",
    flexDirection: "row",
    alignItems: "center",
  },
  errorBannerIcon: {
    marginRight: 10,
  },
  errorBannerText: {
    flex: 1,
    color: "#9B2C2C",
    fontFamily: FONT_MEDIUM,
    fontSize: 13,
    lineHeight: 18,
  },
  fieldErrorRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  fieldErrorIcon: {
    marginRight: 6,
  },
  fieldErrorText: {
    color: "#D94343",
    fontFamily: FONT_REGULAR,
    fontSize: 12,
  },
  signInButton: {
    height: 54,
    borderRadius: 9,
    backgroundColor: "#101215",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  signInText: {
    color: "#FFFFFF",
    fontFamily: FONT_BOLD,
    fontSize: 24,
  },
  signupRow: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontFamily: FONT_REGULAR,
    color: "#8A8A8A",
    fontSize: 14,
  },
  signupLink: {
    fontFamily: FONT_BOLD,
    color: "#E37925",
    fontSize: 14,
  },
});
