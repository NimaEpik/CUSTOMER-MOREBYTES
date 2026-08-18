import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCart } from "../../src/context/CartContext";

const ORANGE = "#F97000";
const CATEGORIES = ["All", "Pizza", "Snacks", "Desserts", "Beverages", "Rice Meals"];

// Replace this local data with the menu API response when it is available.
const MENU_ITEMS = [
  { id: "supreme-pizza", name: "Supreme Pizza", category: "Pizza", price: 285, priceLabel: "₱285 - ₱1185", hasSizes: true },
  { id: "full-house", name: "Full House", category: "Pizza", price: 285, priceLabel: "₱285 - ₱1185", hasSizes: true },
  { id: "pepperoni-pizza", name: "Pepperoni Pizza", category: "Pizza", price: 265, priceLabel: "₱265 - ₱995", hasSizes: true },
  { id: "chicken-wing", name: "Chicken Wing", category: "Snacks", price: 349, priceLabel: "₱349", hasSizes: false },
  { id: "fries", name: "Fries", category: "Snacks", price: 65, priceLabel: "₱65", hasSizes: false },
  { id: "heavenly-ube", name: "Heavenly Ube", category: "Desserts", price: 185, priceLabel: "₱185", hasSizes: false },
  { id: "cheesy-overload", name: "Cheesy Overload", category: "Desserts", price: 155, priceLabel: "₱155", hasSizes: false },
  { id: "halo-halo", name: "Halo Halo", category: "Desserts", price: 145, priceLabel: "₱145", hasSizes: false },
  { id: "sprite-1-5l", name: "Sprite 1.5L", category: "Beverages", price: 67, priceLabel: "₱67", hasSizes: false },
  { id: "coke-1-5l", name: "Coke 1.5L", category: "Beverages", price: 67, priceLabel: "₱67", hasSizes: false },
  { id: "chicken-thigh-rice", name: "Chicken Thigh Rice Meal", category: "Rice Meals", price: 120, priceLabel: "₱120", hasSizes: false },
  { id: "burger-steak-rice", name: "Burger Steak Rice Meal", category: "Rice Meals", price: 110, priceLabel: "₱110", hasSizes: false },
];

const POPULAR_IDS = ["supreme-pizza", "chicken-wing", "heavenly-ube", "chicken-thigh-rice"];

function FoodCard({ item }) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push({ pathname: "/food-details", params: { item: JSON.stringify(item) } })}
    >
      <View style={styles.placeholderImage}>
        <Ionicons name="fast-food-outline" size={42} color="#8A8A8A" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.foodName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.price}>{item.priceLabel}</Text>
      </View>
    </Pressable>
  );
}

function FoodGrid({ items }) {
  return <View style={styles.grid}>{items.map((item) => <FoodCard item={item} key={item.id} />)}</View>;
}

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [user, setUser] = useState({ fullName: "Customer", photo: null });
  const { cartCount } = useCart();

  useEffect(() => {
    async function loadUser() {
      try {
        const savedUser = await AsyncStorage.getItem("current_user");
        if (savedUser) setUser((current) => ({ ...current, ...JSON.parse(savedUser) }));
      } catch (_error) {
        // Keep the default greeting when stored data cannot be read.
      }
    }
    loadUser();
  }, []);

  const popularItems = MENU_ITEMS.filter((item) => POPULAR_IDS.includes(item.id));
  const selectedItems = MENU_ITEMS.filter((item) => item.category === activeCategory);

  const renderCategorySections = () => {
    if (activeCategory !== "All") {
      return (
        <>
          <Text style={styles.sectionTitle}>Popular Items</Text>
          <FoodGrid items={selectedItems} />
        </>
      );
    }

    return (
      <>
        <Text style={styles.sectionTitle}>Popular Items</Text>
        <FoodGrid items={popularItems} />

        {CATEGORIES.slice(1).map((category) => {
          const items = MENU_ITEMS.filter((item) => item.category === category);

          if (!items.length) {
            return null;
          }

          return (
            <View key={category}>
              <Text style={styles.sectionTitle}>{category}</Text>
              <FoodGrid items={items} />
            </View>
          );
        })}
      </>
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.greetingRow}>
            {user.photo ? (
              <Image source={{ uri: user.photo }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Ionicons name="person" size={28} color="#8A8A8A" />
              </View>
            )}

            <View style={styles.greetingCopy}>
              <Text style={styles.greeting}>
                Hello, <Text style={styles.userName}>{user.fullName}</Text>
              </Text>
              <Text style={styles.subtitle}>What do you want to eat today?</Text>
            </View>
          </View>

          <Pressable style={styles.cartButton} onPress={() => router.push("/cart")} hitSlop={8}>
            <Ionicons name="cart-outline" size={26} color="#121212" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount > 99 ? "99+" : cartCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <Pressable style={styles.searchBar} onPress={() => router.push("/search")}>
          <Ionicons name="search-outline" size={21} color="#8A8A8A" />
          <Text style={styles.searchText}>Search menu...</Text>
        </Pressable>

        <Text style={styles.categoryTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;

            return (
              <Pressable
                key={category}
                onPress={() => setActiveCategory(category)}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
              >
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {renderCategorySections()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greetingRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: ORANGE,
    backgroundColor: "#E5E5E5",
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: ORANGE,
    backgroundColor: "#E9E9E9",
    justifyContent: "center",
    alignItems: "center",
  },
  greetingCopy: {
    marginLeft: 10,
    flexShrink: 1,
  },
  greeting: {
    color: "#707070",
    fontFamily: "Plus Jakarta Sans",
    fontSize: 16,
  },
  userName: {
    color: ORANGE,
    fontWeight: "700",
  },
  subtitle: {
    color: "#707070",
    fontFamily: "Plus Jakarta Sans",
    fontSize: 11,
    marginTop: 2,
  },
  cartButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    right: 0,
    top: 0,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 3,
    borderRadius: 9,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  searchBar: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  searchText: {
    marginLeft: 9,
    color: "#8A8A8A",
    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
  },
  categoryTitle: {
    color: "#121212",
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 10,
  },
  categoryList: {
    paddingRight: 16,
    marginBottom: 23,
  },
  categoryChip: {
    backgroundColor: "#F3F3F3",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: ORANGE,
  },
  categoryText: {
    color: "#707070",
    fontFamily: "Plus Jakarta Sans",
    fontSize: 13,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  sectionTitle: {
    color: "#121212",
    fontFamily: "Plus Jakarta Sans",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  placeholderImage: {
    height: 118,
    backgroundColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    padding: 11,
    minHeight: 76,
    justifyContent: "space-between",
  },
  foodName: {
    color: "#121212",
    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 19,
  },
  price: {
    color: ORANGE,
    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 7,
  },
});
