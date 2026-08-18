import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FONT = "Plus Jakarta Sans";
const PRIMARY = "#F97000";

function RatingStars({ rating, onRate }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} onPress={() => onRate(star)} hitSlop={4}>
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={36}
            color={star <= rating ? PRIMARY : "#9CA3AF"}
          />
        </Pressable>
      ))}
    </View>
  );
}

export default function RateOrderScreen() {
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("order");
  const [foodRating, setFoodRating] = useState(0);
  const [riderRating, setRiderRating] = useState(0);
  const [foodComment, setFoodComment] = useState("");
  const [riderComment, setRiderComment] = useState("");
  const foodName = params.foodName || "Supreme Pizza";
  const foodPrice = Number(params.foodPrice) || 480;

  const finishRating = () => {
    router.push({
      pathname: "/rate-thanks",
      params: { foodName, foodPrice, foodRating, riderRating },
    });
  };

  const submitRating = () => {
    if (activeTab === "order") {
      setActiveTab("rider");
      return;
    }
    finishRating();
  };

  const skipRating = () => {
    if (activeTab === "order") {
      setActiveTab("rider");
      return;
    }
    finishRating();
  };

  const isOrderTab = activeTab === "order";

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <Ionicons name="checkmark-circle" size={70} color="#22C55E" />
          <Text style={styles.title}>Order delivered!</Text>
          <Text style={styles.subtitle}>Hope you enjoy your meal</Text>
        </View>

        <View style={styles.tabs}>
          <Pressable style={styles.tab} onPress={() => setActiveTab("order")}>
            <Text style={[styles.tabText, isOrderTab && styles.activeTabText]}>Rate Order</Text>
            {isOrderTab ? <View style={styles.activeUnderline} /> : null}
          </Pressable>
          <Pressable style={styles.tab} onPress={() => setActiveTab("rider")}>
            <Text style={[styles.tabText, !isOrderTab && styles.activeTabText]}>Rate Rider</Text>
            {!isOrderTab ? <View style={styles.activeUnderline} /> : null}
          </Pressable>
        </View>

        {isOrderTab ? (
          <>
            <View style={styles.infoCard}>
              <View style={styles.foodPlaceholder}>
                <Ionicons name="pizza-outline" size={30} color="#8A8A8A" />
              </View>
              <View>
                <Text style={styles.cardTitle}>{foodName}</Text>
                <Text style={styles.foodPrice}>₱{foodPrice}</Text>
              </View>
            </View>
            <Text style={styles.question}>HOW WAS YOUR FOOD?</Text>
            <RatingStars rating={foodRating} onRate={setFoodRating} />
            <Text style={styles.ratingHint}>Tap a star to rate</Text>
            <TextInput
              style={styles.commentInput}
              value={foodComment}
              onChangeText={setFoodComment}
              placeholder="Add a comment (optional)"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />
          </>
        ) : (
          <>
            <View style={styles.infoCard}>
              <View style={styles.riderIcon}>
                <Ionicons name="bicycle" size={28} color="#121212" />
              </View>
              <View>
                <Text style={styles.cardTitle}>John Morebytes</Text>
                <Text style={styles.cardSubtitle}>Your delivery rider</Text>
              </View>
            </View>
            <Text style={styles.question}>HOW WAS YOUR RIDER?</Text>
            <RatingStars rating={riderRating} onRate={setRiderRating} />
            <Text style={styles.ratingHint}>Tap a star to rate</Text>
            <TextInput
              style={styles.commentInput}
              value={riderComment}
              onChangeText={setRiderComment}
              placeholder="Add a comment (optional)"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />
          </>
        )}
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.submitButton} onPress={submitRating}>
          <Text style={styles.submitText}>Submit Rating</Text>
        </Pressable>
        <Pressable onPress={skipRating} hitSlop={8}>
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  topSection: {
    alignItems: "center",
  },
  title: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 14,
  },
  subtitle: {
    color: "#6B7280",
    fontFamily: FONT,
    fontSize: 14,
    marginTop: 6,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginTop: 26,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 13,
  },
  tabText: {
    color: "#8A8A8A",
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: PRIMARY,
  },
  activeUnderline: {
    position: "absolute",
    right: 20,
    bottom: -1,
    left: 20,
    height: 2,
    backgroundColor: PRIMARY,
  },
  infoCard: {
    height: 78,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#F7F7F7",
    padding: 10,
    marginTop: 16,
  },
  foodPlaceholder: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: "#E5E7EB",
    marginRight: 12,
  },
  riderIcon: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: "#E5E7EB",
    marginRight: 12,
  },
  cardTitle: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: "700",
  },
  foodPrice: {
    color: PRIMARY,
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  cardSubtitle: {
    color: "#8A8A8A",
    fontFamily: FONT,
    fontSize: 12,
    marginTop: 4,
  },
  question: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  ratingHint: {
    color: "#9CA3AF",
    fontFamily: FONT,
    fontSize: 12,
    marginTop: 7,
  },
  commentInput: {
    height: 100,
    color: "#121212",
    fontFamily: FONT,
    fontSize: 13,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  submitButton: {
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: PRIMARY,
  },
  submitText: {
    color: "#FFFFFF",
    fontFamily: FONT,
    fontSize: 17,
    fontWeight: "700",
  },
  skipText: {
    color: "#9CA3AF",
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 14,
  },
});
