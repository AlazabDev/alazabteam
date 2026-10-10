import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { APP_COLORS, APP_SHADOW } from "@/constants/app-theme";
import { notificationData, type NotificationItem } from "@/lib/demo-data";
import { markNotificationRead, useDemoDataVersion } from "@/lib/demo-state";

type Filter = "الكل" | "غير مقروءة" | "عاجلة";

function priorityColors(priority: NotificationItem["priority"]) {
  if (priority === "عاجل") return { text: APP_COLORS.danger, bg: APP_COLORS.dangerPale, icon: "flash-outline" as const };
  if (priority === "مهم") return { text: APP_COLORS.warning, bg: APP_COLORS.warningPale, icon: "bookmark-outline" as const };
  return { text: APP_COLORS.inkSoft, bg: APP_COLORS.surfaceMuted, icon: "time-outline" as const };
}

function NotificationCard({ item }: { item: NotificationItem }) {
  const colors = priorityColors(item.priority);
  return (
    <TouchableOpacity style={[styles.card, item.unread && styles.unreadCard]} onPress={() => { markNotificationRead(item.id); router.push(`/notification/${item.id}`); }} activeOpacity={0.86}>
      {item.unread && <View style={styles.unreadLine} />}
      <View style={styles.cardTopline}>
        <View style={[styles.priorityPill, { backgroundColor: colors.bg }]}>
          <Ionicons name={colors.icon} size={13} color={colors.text} />
          <Text style={[styles.priorityText, { color: colors.text }]}>{item.priority}</Text>
        </View>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardPreview} numberOfLines={2}>{item.preview}</Text>
      <View style={styles.cardBottom}>
        <View style={styles.senderGroup}>
          <View style={[styles.senderAvatar, { backgroundColor: `${colors.text}1A` }]}><Text style={[styles.senderInitial, { color: colors.text }]}>{item.sender.slice(0, 1)}</Text></View>
          <View>
            <Text style={styles.senderName}>{item.sender}</Text>
            <Text style={styles.categoryText}>{item.category} · {item.project}</Text>
          </View>
        </View>
        <Ionicons name="chevron-back" size={18} color={APP_COLORS.inkFaint} />
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const [filter, setFilter] = useState<Filter>("الكل");
  useDemoDataVersion();
  const filtered = (() => {
    if (filter === "غير مقروءة") return notificationData.filter((item) => item.unread);
    if (filter === "عاجلة") return notificationData.filter((item) => item.priority === "عاجل");
    return notificationData;
  })();

  return (
    <ScreenContainer edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}><Text style={styles.eyebrow}>مركز التواصل</Text><Text style={styles.title}>الإشعارات</Text></View>
          <View style={styles.headerIcon}><Ionicons name="notifications" size={23} color={APP_COLORS.brand} /></View>
        </View>
        <Text style={styles.subtitle}>كل ما يحتاج انتباهك، مرتبًا في مكان واحد.</Text>

        <View style={styles.filterRow}>
          {(["الكل", "غير مقروءة", "عاجلة"] as Filter[]).map((item) => (
            <TouchableOpacity key={item} style={[styles.filterPill, filter === item && styles.filterPillActive]} onPress={() => setFilter(item)}>
              <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
              {item === "غير مقروءة" && <View style={[styles.filterCount, filter === item && styles.filterCountActive]}><Text style={[styles.filterCountText, filter === item && styles.filterCountTextActive]}>{notificationData.filter((note) => note.unread).length}</Text></View>}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.resultHeader}><Text style={styles.resultLabel}>{filtered.length} إشعارات</Text><Text style={styles.resultHint}>الأحدث أولًا</Text></View>
        {filtered.length > 0 ? filtered.map((item) => <NotificationCard key={item.id} item={item} />) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><Ionicons name="checkmark-done-outline" size={27} color={APP_COLORS.success} /></View>
            <Text style={styles.emptyTitle}>لا توجد إشعارات هنا</Text>
            <Text style={styles.emptyBody}>أحسنت، لا توجد عناصر تطابق هذا الفلتر حاليًا.</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 34, maxWidth: 760, width: "100%", alignSelf: "center" },
  headerRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" },
  headerCopy: { alignItems: "flex-end" },
  eyebrow: { color: APP_COLORS.brandDark, fontSize: 12, fontWeight: "800", writingDirection: "rtl" },
  title: { color: APP_COLORS.ink, fontSize: 29, fontWeight: "900", marginTop: 2, writingDirection: "rtl" },
  headerIcon: { width: 49, height: 49, borderRadius: 17, backgroundColor: APP_COLORS.brandPale, alignItems: "center", justifyContent: "center" },
  subtitle: { color: APP_COLORS.inkSoft, fontSize: 13, textAlign: "right", marginTop: 7, writingDirection: "rtl" },
  filterRow: { flexDirection: "row-reverse", gap: 8, marginTop: 22, marginBottom: 17 },
  filterPill: { minHeight: 38, borderRadius: 13, paddingHorizontal: 13, backgroundColor: APP_COLORS.surface, borderWidth: 1, borderColor: APP_COLORS.border, flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  filterPillActive: { backgroundColor: APP_COLORS.ink, borderColor: APP_COLORS.ink },
  filterText: { color: APP_COLORS.inkSoft, fontSize: 12, fontWeight: "800", writingDirection: "rtl" },
  filterTextActive: { color: APP_COLORS.white },
  filterCount: { minWidth: 18, height: 18, borderRadius: 9, backgroundColor: APP_COLORS.dangerPale, alignItems: "center", justifyContent: "center" },
  filterCountActive: { backgroundColor: APP_COLORS.brand },
  filterCountText: { color: APP_COLORS.danger, fontSize: 10, fontWeight: "900" },
  filterCountTextActive: { color: APP_COLORS.white },
  resultHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  resultLabel: { color: APP_COLORS.ink, fontSize: 14, fontWeight: "900", writingDirection: "rtl" },
  resultHint: { color: APP_COLORS.inkFaint, fontSize: 11, writingDirection: "rtl" },
  card: { backgroundColor: APP_COLORS.surface, borderRadius: 18, padding: 16, marginBottom: 11, borderWidth: 1, borderColor: APP_COLORS.border, overflow: "hidden", ...APP_SHADOW },
  unreadCard: { borderColor: "#E4C8B2" },
  unreadLine: { position: "absolute", right: 0, top: 0, bottom: 0, width: 4, backgroundColor: APP_COLORS.brand },
  cardTopline: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  priorityPill: { flexDirection: "row-reverse", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  priorityText: { fontSize: 10, fontWeight: "900", writingDirection: "rtl" },
  timeText: { color: APP_COLORS.inkFaint, fontSize: 10, writingDirection: "rtl" },
  cardTitle: { color: APP_COLORS.ink, fontSize: 16, fontWeight: "900", textAlign: "right", marginTop: 13, writingDirection: "rtl" },
  cardPreview: { color: APP_COLORS.inkSoft, fontSize: 12, lineHeight: 19, textAlign: "right", marginTop: 5, writingDirection: "rtl" },
  cardBottom: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: APP_COLORS.surfaceMuted },
  senderGroup: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  senderAvatar: { width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  senderInitial: { fontWeight: "900", fontSize: 13 },
  senderName: { color: APP_COLORS.ink, fontSize: 11, fontWeight: "800", textAlign: "right", writingDirection: "rtl" },
  categoryText: { color: APP_COLORS.inkFaint, fontSize: 10, marginTop: 2, textAlign: "right", writingDirection: "rtl" },
  emptyState: { backgroundColor: APP_COLORS.surface, borderRadius: 20, padding: 32, alignItems: "center", borderWidth: 1, borderColor: APP_COLORS.border, marginTop: 10 },
  emptyIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: APP_COLORS.successPale, alignItems: "center", justifyContent: "center" },
  emptyTitle: { color: APP_COLORS.ink, fontSize: 16, fontWeight: "900", marginTop: 13, writingDirection: "rtl" },
  emptyBody: { color: APP_COLORS.inkSoft, fontSize: 12, lineHeight: 19, textAlign: "center", marginTop: 6, writingDirection: "rtl" },
});
