import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { Animated, Easing, SafeAreaView, StyleSheet, Text, View } from "react-native";

const FONT = "Plus Jakarta Sans";

export default function SplashScreen() {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(Animated.sequence([
      Animated.timing(scale, { toValue: 1.08, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]));
    pulse.start();
    const timeout = setTimeout(() => router.replace("/(auth)/login"), 3000);
    return () => { pulse.stop(); clearTimeout(timeout); };
  }, [scale]);

  return <SafeAreaView style={styles.container}><View style={styles.content}>
    <Animated.Image source={require("../../assets/images/morebytes.png")} style={[styles.logo, { transform: [{ scale }] }]} />
    <Text style={styles.tagline}>Good food for Good life</Text>
  </View></SafeAreaView>;
}

const styles = StyleSheet.create({
  container: { alignItems: "center", backgroundColor: "#F97000", flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  content: { alignItems: "center" }, logo: { height: 215, resizeMode: "contain", width: 215 },
  tagline: { color: "#FFFFFF", fontFamily: FONT, fontSize: 30, lineHeight: 36, marginTop: 24, textAlign: "center" },
});
