import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { APP_COLORS, APP_SHADOW } from "@/constants/app-theme";
import { notificationData, threadData } from "@/lib/demo-data";
import { useDemoDataVersion, useDemoRole } from "@/lib/demo-state";

function MetricTile({ value, label, accent, icon }: { value: string; label: string; accent: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.metricTile}>
      <View style={[styles.metricIcon, { backgroundColor: `${accent}18` }]}>
        <Ionicons name={icon} size={18} color={accent} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function ActivityRow({ name, text, time, color }: { name: string; text: string; time: string; color: string }) {
  return (
    <View style={styles.activityRow}>
      <View style={[styles.avatar, { backgroundColor: `${color}20` }]}>
        <Text style={[styles.avatarText, { color }]}>{name.slice(0, 1)}</Text>
      </View>
      <View style={styles.activityCopy}>
        <Text style={styles.activityText} numberOfLines={1}>{text}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
      <View style={[styles.activityDot, { backgroundColor: color }]} />
    </View>
  );
}

export default function HomeScreen() {
  const activeRole = useDemoRole();
  const dataVersion = useDemoDataVersion();
  void dataVersion;
  const unreadCount = notificationData.filter((item) => item.unread).length;
  const urgentCount = notificationData.filter((item) => item.priority === "عاجل").length;
  const priorityNotification = notificationData[0];

  return (
    <ScreenContainer edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brandLockup}>
            <Image source={require("@/assets/images/icon.png")} style={styles.brandMark} accessibilityLabel="شعار العزب" />
            <View style={styles.brandText}><Text style={styles.wordmark}>العزب</Text><Text style={styles.brandSubline}>مركز العمليات</Text></View>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={() => router.push("/(tabs)/notifications")} accessibilityLabel="فتح الإشعارات">
            <Ionicons name="notifications-outline" size={22} color={APP_COLORS.ink} />
            <View style={styles.notificationBadge}><Text style={styles.notificationBadgeText}>{unreadCount}</Text></View>
          </TouchableOpacity>
        </View>

        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.eyebrow}>مساء الخير، يارا</Text>
            <Text style={styles.pageTitle}>نحوّل الرؤية إلى مساحة تُنجز</Text>
          </View>
          <View style={styles.rolePill}><View style={styles.roleDot} /><Text style={styles.roleText}>{activeRole}</Text></View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroAccent} />
          <View style={styles.heroContent}>
            <Text style={styles.heroKicker}>ملخص اليوم</Text>
            <Text style={styles.heroTitle}>هناك قرار يحتاج ردك اليوم.</Text>
            <Text style={styles.heroBody}>راجع الأولوية الجديدة لتبقي فريق المشروع على نفس المسار.</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/(tabs)/notifications")}>
              <Text style={styles.primaryButtonText}>فتح مركز الإشعارات</Text>
              <Ionicons name="arrow-back" size={17} color={APP_COLORS.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.heroMark}><Text style={styles.heroMarkText}>20</Text><Text style={styles.heroMarkCaption}>سنة خبرة</Text></View>
        </View>

        <View style={styles.metricRow}>
          <MetricTile value={`${unreadCount}`} label="غير مقروء" accent={APP_COLORS.brand} icon="mail-unread-outline" />
          <MetricTile value={`${urgentCount}`} label="أولوية عاجلة" accent={APP_COLORS.danger} icon="flash-outline" />
          <MetricTile value={`${threadData.filter((thread) => thread.status !== "مكتمل").length}`} label="مواضيع نشطة" accent={APP_COLORS.success} icon="chatbubbles-outline" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>أولوية اليوم</Text>
          <TouchableOpacity onPress={() => router.push(`/notification/${priorityNotification.id}`)}><Text style={styles.linkText}>التفاصيل</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.priorityCard} onPress={() => router.push(`/notification/${priorityNotification.id}`)} activeOpacity={0.9}>
          <View style={styles.priorityTopline}>
            <View style={styles.priorityTag}><View style={styles.priorityTagDot} /><Text style={styles.priorityTagText}>{priorityNotification.priority}</Text></View>
            <Text style={styles.priorityTime}>{priorityNotification.time}</Text>
          </View>
          <Text style={styles.priorityTitle}>{priorityNotification.title}</Text>
          <Text style={styles.priorityBody} numberOfLines={2}>{priorityNotification.preview}</Text>
          <View style={styles.priorityFooter}>
            <Text style={styles.projectText}>{priorityNotification.project}</Text>
            <View style={styles.circleArrow}><Ionicons name="arrow-back" size={16} color={APP_COLORS.brandDark} /></View>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>آخر نشاط للفريق</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/conversations")}><Text style={styles.linkText}>كل المواضيع</Text></TouchableOpacity>
        </View>
        <View style={styles.activityCard}>
          <ActivityRow name="أ" text="أحمد أضاف ملاحظة على مخطط الإضاءة" time="منذ 12 دقيقة" color={APP_COLORS.brand} />
          <ActivityRow name="س" text="سارة أرسلت مرفقًا جديدًا للمشروع" time="منذ ساعة" color={APP_COLORS.success} />
          <ActivityRow name="غ" text="غرفة العمليات حدّثت مناوبة الصيانة" time="منذ ساعتين" color={APP_COLORS.danger} />
        </View>

        <View style={styles.trustRow}>
          <Ionicons name="shield-checkmark-outline" size={18} color={APP_COLORS.success} />
          <Text style={styles.trustText}>تواصل واضح بين العميل والفريق والإدارة</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 36, maxWidth: 760, width: "100%", alignSelf: "center" },
  topBar: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginBottom: 26 },
  brandLockup: { flexDirection: "row-reverse", alignItems: "center", gap: 9 },
  brandMark: { width: 42, height: 42, borderRadius: 13, backgroundColor: APP_COLORS.surface, borderWidth: 1, borderColor: APP_COLORS.border },
  brandText: { alignItems: "flex-end" },
  wordmark: { color: APP_COLORS.ink, fontSize: 24, fontWeight: "900", letterSpacing: 0.4, writingDirection: "rtl" },
  brandSubline: { color: APP_COLORS.brand, fontSize: 11, fontWeight: "700", marginTop: 1, writingDirection: "rtl" },
  notificationButton: { width: 44, height: 44, borderRadius: 16, backgroundColor: APP_COLORS.surface, alignItems: "center", justifyContent: "center", ...APP_SHADOW },
  notificationBadge: { position: "absolute", top: -3, right: -3, minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 10, backgroundColor: APP_COLORS.danger, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: APP_COLORS.background },
  notificationBadgeText: { color: APP_COLORS.white, fontSize: 10, fontWeight: "800" },
  greetingRow: { alignItems: "flex-end", marginBottom: 18 },
  eyebrow: { color: APP_COLORS.brandDark, fontSize: 14, fontWeight: "700", textAlign: "right", writingDirection: "rtl" },
  pageTitle: { color: APP_COLORS.ink, fontSize: 26, lineHeight: 34, fontWeight: "900", textAlign: "right", marginTop: 4, writingDirection: "rtl" },
  rolePill: { flexDirection: "row-reverse", alignItems: "center", gap: 7, backgroundColor: APP_COLORS.surfaceMuted, borderRadius: 20, paddingHorizontal: 11, paddingVertical: 7, marginTop: 13 },
  roleDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: APP_COLORS.success },
  roleText: { color: APP_COLORS.inkSoft, fontSize: 12, fontWeight: "700", writingDirection: "rtl" },
  heroCard: { backgroundColor: APP_COLORS.ink, borderRadius: 24, padding: 20, minHeight: 174, overflow: "hidden", flexDirection: "row-reverse", ...APP_SHADOW },
  heroAccent: { position: "absolute", right: 0, top: 0, bottom: 0, width: 5, backgroundColor: APP_COLORS.brand },
  heroContent: { flex: 1, alignItems: "flex-end", paddingRight: 8 },
  heroKicker: { color: APP_COLORS.brand, fontSize: 12, fontWeight: "800", marginBottom: 9, writingDirection: "rtl" },
  heroTitle: { color: APP_COLORS.white, fontSize: 21, fontWeight: "900", lineHeight: 28, textAlign: "right", writingDirection: "rtl" },
  heroBody: { color: "#D1D5DB", fontSize: 13, lineHeight: 20, marginTop: 6, textAlign: "right", writingDirection: "rtl" },
  primaryButton: { backgroundColor: APP_COLORS.brand, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 11, flexDirection: "row-reverse", alignItems: "center", gap: 8, marginTop: 16 },
  primaryButtonText: { color: APP_COLORS.white, fontSize: 12, fontWeight: "800", writingDirection: "rtl" },
  heroMark: { width: 68, height: 68, borderRadius: 34, borderWidth: 1, borderColor: "#5D6870", alignItems: "center", justifyContent: "center", marginTop: 4, marginLeft: 4 },
  heroMarkText: { color: "#E8C6A6", fontSize: 22, fontWeight: "900" },
  heroMarkCaption: { color: "#A9B3B7", fontSize: 8, marginTop: 1, writingDirection: "rtl" },
  metricRow: { flexDirection: "row-reverse", gap: 10, marginTop: 14 },
  metricTile: { flex: 1, backgroundColor: APP_COLORS.surface, borderRadius: 17, padding: 13, alignItems: "flex-end", borderWidth: 1, borderColor: APP_COLORS.border },
  metricIcon: { width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 9 },
  metricValue: { color: APP_COLORS.ink, fontSize: 22, fontWeight: "900" },
  metricLabel: { color: APP_COLORS.inkSoft, fontSize: 11, fontWeight: "600", marginTop: 2, writingDirection: "rtl" },
  sectionHeader: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginTop: 28, marginBottom: 11 },
  sectionTitle: { color: APP_COLORS.ink, fontSize: 17, fontWeight: "900", writingDirection: "rtl" },
  linkText: { color: APP_COLORS.brandDark, fontSize: 12, fontWeight: "800", writingDirection: "rtl" },
  priorityCard: { backgroundColor: APP_COLORS.surface, borderRadius: 19, padding: 17, borderWidth: 1, borderColor: APP_COLORS.border, borderRightWidth: 4, borderRightColor: APP_COLORS.brand, ...APP_SHADOW },
  priorityTopline: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  priorityTag: { flexDirection: "row-reverse", alignItems: "center", gap: 6, backgroundColor: APP_COLORS.dangerPale, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8 },
  priorityTagDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: APP_COLORS.danger },
  priorityTagText: { color: APP_COLORS.danger, fontSize: 11, fontWeight: "800", writingDirection: "rtl" },
  priorityTime: { color: APP_COLORS.inkFaint, fontSize: 11, writingDirection: "rtl" },
  priorityTitle: { color: APP_COLORS.ink, fontSize: 17, fontWeight: "900", textAlign: "right", marginTop: 14, writingDirection: "rtl" },
  priorityBody: { color: APP_COLORS.inkSoft, fontSize: 13, lineHeight: 20, textAlign: "right", marginTop: 6, writingDirection: "rtl" },
  priorityFooter: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginTop: 15 },
  projectText: { color: APP_COLORS.brandDark, fontSize: 11, fontWeight: "700", writingDirection: "rtl" },
  circleArrow: { width: 30, height: 30, borderRadius: 15, backgroundColor: APP_COLORS.brandPale, alignItems: "center", justifyContent: "center" },
  activityCard: { backgroundColor: APP_COLORS.surface, borderRadius: 19, padding: 6, borderWidth: 1, borderColor: APP_COLORS.border },
  activityRow: { minHeight: 61, flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: APP_COLORS.surfaceMuted, gap: 10 },
  activityRowLast: { borderBottomWidth: 0 },
  avatar: { width: 34, height: 34, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 15, fontWeight: "900" },
  activityCopy: { flex: 1, alignItems: "flex-end" },
  activityText: { color: APP_COLORS.ink, fontSize: 12, fontWeight: "700", textAlign: "right", writingDirection: "rtl" },
  activityTime: { color: APP_COLORS.inkFaint, fontSize: 10, marginTop: 3, textAlign: "right", writingDirection: "rtl" },
  activityDot: { width: 6, height: 6, borderRadius: 3 },
  trustRow: { flexDirection: "row-reverse", justifyContent: "center", alignItems: "center", gap: 7, marginTop: 22 },
  trustText: { color: APP_COLORS.inkFaint, fontSize: 11, fontWeight: "600", writingDirection: "rtl" },
});
