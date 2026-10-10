import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { APP_COLORS } from "@/constants/app-theme";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: APP_COLORS.brand,
        tabBarInactiveTintColor: APP_COLORS.inkFaint,
        tabBarButton: HapticTab,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: { height: 63 + bottomPadding, paddingTop: 7, paddingBottom: bottomPadding, backgroundColor: APP_COLORS.surface, borderTopColor: APP_COLORS.border, borderTopWidth: StyleSheet.hairlineWidth },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "الرئيسية", tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="notifications" options={{ title: "الإشعارات", tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="conversations" options={{ title: "المحادثات", tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: "حسابي", tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({ tabLabel: { fontSize: 10, fontWeight: "700", writingDirection: "rtl" }, });
