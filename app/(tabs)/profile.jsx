import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

const FONT = "Plus Jakarta Sans";
const ORANGE = "#F97000";

export default function ProfileScreen() {
  const [user, setUser] = useState({ fullName: "Customer", phone: "", photo: null });

  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await AsyncStorage.getItem("current_user");
      if (savedUser) setUser((current) => ({ ...current, ...JSON.parse(savedUser) }));
    };
    loadUser();
  }, []);

  const logOut = async () => {
    await AsyncStorage.removeItem("current_user");
    router.replace("/(auth)/login");
  };

  const confirmLogout = () => {
    Alert.alert("Log out?", "You will need to sign in again.", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: logOut },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        {user.photo ? (
          <Image source={{ uri: user.photo }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Ionicons name="person" size={32} color="#8A8A8A" />
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{user.fullName}</Text>
          {user.phone ? <Text style={styles.phone}>{user.phone}</Text> : null}
        </View>
      </View>

      <Pressable style={styles.logoutButton} onPress={confirmLogout}>
        <Ionicons name="log-out-outline" size={20} color="#D94343" />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
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
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    padding: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: ORANGE,
    backgroundColor: "#E5E5E5",
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: ORANGE,
    backgroundColor: "#E9E9E9",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    marginLeft: 14,
  },
  name: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 17,
    fontWeight: "700",
  },
  phone: {
    color: "#8A8A8A",
    fontFamily: FONT,
    fontSize: 13,
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 50,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#D94343",
    marginTop: "auto",
    marginBottom: 24,
  },
  logoutText: {
    color: "#D94343",
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: "700",
  },
});
