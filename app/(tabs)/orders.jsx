import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FONT = "Plus Jakarta Sans";
const PRIMARY = "#F97000";
const DELIVERY_FEE = 40;
const SERVICE_FEE = 20;

const ORDERS = [
  {
    id: "#PH-1232",
    status: "Out for Delivery",
    date: "2026-03-29T13:20:00",
    dateLabel: "Mar 29, 2026 · 1:20 PM",
    total: 880,
    itemsLabel: "1x Full House (XL), 1x Heavenly Ube",
    items: [
      { id: "full-house", name: "Full House", size: "XL", quantity: 1, price: 675 },
      { id: "heavenly-ube", name: "Heavenly Ube", size: null, quantity: 1, price: 145 },
    ],
  },
  {
    id: "#PH-1231",
    status: "Completed",
    date: "2026-03-07T14:30:00",
    dateLabel: "Mar 7, 2026 · 2:30 PM",
    total: 935,
    itemsLabel: "2x Supreme Pizza (Large), 1x Mango Halo2x",
    items: [
      { id: "supreme-pizza", name: "Supreme Pizza", size: "Large", quantity: 2, price: 395 },
      { id: "mango-halo2x", name: "Mango Halo2x", size: null, quantity: 1, price: 85 },
    ],
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "delivery",
    message: "Order #ORD-1232 is out for delivery. Track your rider live.",
    timestamp: "Just now",
    unread: true,
  },
  {
    id: "preparing",
    message: "Order #ORD-1232 is now being prepared by the kitchen.",
    timestamp: "15 mins ago",
    unread: true,
  },
  {
    id: "confirmed",
    message: "Order #ORD-1232 confirmed. Your order is being processed",
    timestamp: "19 mins ago",
    unread: false,
  },
  {
    id: "delivered",
    message: "Order #ORD-892 has been delivered. Enjoy your meal!",
    timestamp: "Feb 27 · 2:20 PM",
    unread: false,
  },
];

const STATUS_DETAILS = {
  "Out for Delivery": { icon: "bicycle" },
  Completed: { icon: "checkmark-circle" },
  Preparing: { icon: "flame" },
  Pending: { icon: "time" },
  Cancelled: { icon: "close-circle" },
};

function StatusBadge({ status }) {
  const details = STATUS_DETAILS[status] || STATUS_DETAILS.Pending;
  const badgeStyle = {
    "Out for Delivery": styles.deliveryBadge,
    Completed: styles.completedBadge,
    Preparing: styles.preparingBadge,
    Pending: styles.pendingBadge,
    Cancelled: styles.cancelledBadge,
  }[status] || styles.pendingBadge;

  return (
    <View style={[styles.statusBadge, badgeStyle]}>
      <Ionicons name={details.icon} size={12} color="#FFFFFF" />
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
}

function OrderCard({ order, onViewDetails }) {
  const canTrack = order.status === "Out for Delivery";

  return (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderIdLabel}>ORDER ID</Text>
          <Text style={styles.orderId}>{order.id}</Text>
        </View>
        <StatusBadge status={order.status} />
      </View>

      <View style={styles.itemSummaryRow}>
        <Ionicons name="pizza-outline" size={16} color={PRIMARY} />
        <Text style={styles.itemsText}>{order.itemsLabel}</Text>
      </View>

      <View style={styles.dateRow}>
        <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
        <Text style={styles.dateText}>{order.dateLabel}</Text>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
        <Text style={styles.totalAmount}>₱{order.total.toLocaleString()}</Text>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.detailsButton} onPress={() => onViewDetails(order)}>
          <Text style={styles.detailsButtonText}>View Details</Text>
        </Pressable>
        {canTrack ? (
          <Pressable
            style={styles.trackButton}
            onPress={() => router.push({ pathname: "/order-tracking", params: { orderId: order.id } })}
          >
            <Ionicons name="location-outline" size={15} color="#FFFFFF" />
            <Text style={styles.trackButtonText}>Track</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="receipt-outline" size={68} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No orders yet</Text>
      <Text style={styles.emptySubtitle}>Your order history will appear here</Text>
      <Pressable style={styles.orderNowButton} onPress={() => router.push("/(tabs)/home")}>
        <Text style={styles.orderNowText}>Order Now</Text>
      </Pressable>
    </View>
  );
}

function NotificationsModal({ visible, notifications, onClose, onRead }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.notificationsSheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Notifications</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color="#6B7280" />
            </Pressable>
          </View>

          {notifications.map((notification) => (
            <Pressable
              key={notification.id}
              style={styles.notificationRow}
              onPress={() => onRead(notification.id)}
            >
              <View style={[styles.notificationDot, notification.unread && styles.unreadDot]} />
              <View style={styles.notificationContent}>
                <Text style={[styles.notificationText, notification.unread && styles.unreadText]}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>{notification.timestamp}</Text>
              </View>
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function SummaryRow({ label, value, total, discount }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, total && styles.summaryTotalLabel]}>{label}</Text>
      <Text
        style={[
          styles.summaryValue,
          total && styles.summaryTotalValue,
          discount && styles.discountValue,
        ]}
      >
        {discount ? "- ₱0" : `₱${value.toLocaleString()}`}
      </Text>
    </View>
  );
}

function OrderDetailsModal({ visible, order, onClose }) {
  if (!order) return null;

  const subtotal = order.total - DELIVERY_FEE - SERVICE_FEE;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.detailsModalOverlay} onPress={onClose}>
        <Pressable style={styles.detailsSheet} onPress={(event) => event.stopPropagation()}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.detailsHeader}>
              <View>
                <Text style={styles.orderIdLabel}>ORDER ID</Text>
                <Text style={styles.detailsOrderId}>{order.id}</Text>
              </View>
              <StatusBadge status={order.status} />
            </View>

            <View style={styles.detailsDateRow}>
              <Ionicons name="calendar-outline" size={15} color="#8A8A8A" />
              <Text style={styles.dateText}>{order.dateLabel}</Text>
            </View>

            <Text style={styles.sectionTitle}>Items</Text>
            <View style={styles.sectionCard}>
              {order.items.map((item) => (
                <View key={item.id} style={styles.detailItemRow}>
                  <View style={styles.foodPlaceholder}>
                    <Ionicons name="fast-food-outline" size={25} color="#8A8A8A" />
                  </View>
                  <View style={styles.detailItemInfo}>
                    <Text style={styles.detailItemName}>{item.name}</Text>
                    {item.size ? <Text style={styles.detailItemSize}>Size: {item.size}</Text> : null}
                    <Text style={styles.detailItemPrice}>₱{item.price}</Text>
                  </View>
                  <Text style={styles.detailQuantity}>x{item.quantity}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.sectionCard}>
              <SummaryRow label="Subtotal" value={subtotal} />
              <SummaryRow label="Delivery Fee" value={DELIVERY_FEE} />
              <SummaryRow label="Service Fee" value={SERVICE_FEE} />
              <SummaryRow label="Discount" value={0} discount />
              <View style={styles.summaryDivider} />
              <SummaryRow label="Total Amount" value={order.total} total />
            </View>

            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressCard}>
              <Ionicons name="location-outline" size={20} color={PRIMARY} />
              <View style={styles.addressContent}>
                <Text style={styles.customerName}>John Doe</Text>
                <Text style={styles.addressText}>09XX XXX XXXX</Text>
                <Text style={styles.addressText}>
                  Blk 12 Lot 5, Sampaguita St., Barangay San Antonio, City of San Pedro, Laguna
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentCard}>
              <Ionicons name="cash-outline" size={20} color="#6B7280" />
              <Text style={styles.paymentText}>Cash on Delivery (COD)</Text>
            </View>
          </ScrollView>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState("All");
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((notification) => notification.unread).length;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const visibleOrders = activeTab === "All"
    ? ORDERS
    : ORDERS.filter((order) => new Date(order.date) >= thirtyDaysAgo);

  const openDetails = (order) => {
    setSelectedOrder(order);
    setDetailsVisible(true);
  };

  const closeDetails = () => {
    setDetailsVisible(false);
    setSelectedOrder(null);
  };

  const markAsRead = (notificationId) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId ? { ...notification, unread: false } : notification
      )
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Pressable onPress={() => setNotificationsVisible(true)} hitSlop={8}>
          <Ionicons name="notifications-outline" size={24} color="#121212" />
          {unreadCount > 0 ? <View style={styles.bellBadge} /> : null}
        </Pressable>
      </View>

      <View style={styles.tabsContainer}>
        {["All", "Past 30 Days"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              style={[styles.tabButton, isActive && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {visibleOrders.length ? (
          <>
            {visibleOrders.map((order) => (
              <OrderCard key={order.id} order={order} onViewDetails={openDetails} />
            ))}
            <View style={styles.endState}>
              <Ionicons name="pizza-outline" size={64} color="#9CA3AF" />
              <Text style={styles.endText}>End of history</Text>
            </View>
          </>
        ) : (
          <EmptyState />
        )}
      </ScrollView>

      <NotificationsModal
        visible={notificationsVisible}
        notifications={notifications}
        onClose={() => setNotificationsVisible(false)}
        onRead={markAsRead}
      />
      <OrderDetailsModal
        visible={detailsVisible}
        order={selectedOrder}
        onClose={closeDetails}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9F7",
  },
  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0E5E2",
  },
  headerTitle: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 20,
    fontWeight: "700",
  },
  bellBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  tabsContainer: {
    flexDirection: "row",
    gap: 8,
    margin: 16,
    padding: 4,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
  },
  tabButton: {
    flex: 1,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#121212",
  },
  tabText: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingBottom: 28,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    padding: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  orderIdLabel: {
    color: "#9CA3AF",
    fontFamily: FONT,
    fontSize: 10,
    fontWeight: "600",
  },
  orderId: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  deliveryBadge: {
    backgroundColor: PRIMARY,
  },
  completedBadge: {
    backgroundColor: "#22C55E",
  },
  preparingBadge: {
    backgroundColor: PRIMARY,
  },
  pendingBadge: {
    backgroundColor: "#9CA3AF",
  },
  cancelledBadge: {
    backgroundColor: "#EF4444",
  },
  statusText: {
    color: "#FFFFFF",
    fontFamily: FONT,
    fontSize: 10,
    fontWeight: "700",
  },
  itemSummaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    marginTop: 14,
  },
  itemsText: {
    flex: 1,
    color: "#6B7280",
    fontFamily: FONT,
    fontSize: 13,
    lineHeight: 18,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 7,
  },
  dateText: {
    color: "#8A8A8A",
    fontFamily: FONT,
    fontSize: 12,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 14,
  },
  totalLabel: {
    color: "#9CA3AF",
    fontFamily: FONT,
    fontSize: 10,
    fontWeight: "600",
  },
  totalAmount: {
    color: PRIMARY,
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  detailsButton: {
    flex: 1,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
  },
  detailsButtonText: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: "600",
  },
  trackButton: {
    flex: 1,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 9,
    backgroundColor: "#121212",
  },
  trackButtonText: {
    color: "#FFFFFF",
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: "700",
  },
  endState: {
    alignItems: "center",
    paddingVertical: 30,
  },
  endText: {
    color: "#9CA3AF",
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    minHeight: 390,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 14,
  },
  emptySubtitle: {
    color: "#8A8A8A",
    fontFamily: FONT,
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },
  orderNowButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: PRIMARY,
    paddingHorizontal: 30,
    marginTop: 22,
  },
  orderNowText: {
    color: "#FFFFFF",
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(18, 18, 18, 0.45)",
  },
  notificationsSheet: {
    marginTop: 66,
    marginHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  detailsModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(18, 18, 18, 0.45)",
  },
  sheetHeader: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sheetTitle: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 17,
    fontWeight: "700",
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
    marginTop: 5,
    marginRight: 10,
  },
  unreadDot: {
    backgroundColor: PRIMARY,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    color: "#4B5563",
    fontFamily: FONT,
    fontSize: 13,
    lineHeight: 18,
  },
  unreadText: {
    color: "#121212",
    fontWeight: "700",
  },
  notificationTime: {
    color: "#9CA3AF",
    fontFamily: FONT,
    fontSize: 11,
    marginTop: 4,
  },
  detailsSheet: {
    height: "92%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#FFF9F7",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 14,
  },
  detailsHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  detailsOrderId: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
  },
  detailsDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 9,
  },
  sectionCard: {
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    padding: 12,
    marginBottom: 18,
  },
  detailItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  foodPlaceholder: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: "#E5E7EB",
  },
  detailItemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  detailItemName: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: "700",
  },
  detailItemSize: {
    color: "#8A8A8A",
    fontFamily: FONT,
    fontSize: 12,
    marginTop: 2,
  },
  detailItemPrice: {
    color: PRIMARY,
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 3,
  },
  detailQuantity: {
    color: "#6B7280",
    fontFamily: FONT,
    fontSize: 13,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    color: "#6B7280",
    fontFamily: FONT,
    fontSize: 13,
  },
  summaryValue: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: "600",
  },
  discountValue: {
    color: "#22C55E",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 10,
  },
  summaryTotalLabel: {
    color: "#121212",
    fontWeight: "700",
  },
  summaryTotalValue: {
    color: PRIMARY,
    fontSize: 17,
    fontWeight: "700",
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    padding: 14,
    marginBottom: 18,
  },
  addressContent: {
    flex: 1,
    marginLeft: 10,
  },
  customerName: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: "700",
  },
  addressText: {
    color: "#6B7280",
    fontFamily: FONT,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  paymentCard: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  paymentText: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: "600",
  },
  closeButton: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#121212",
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: "700",
  },
});
