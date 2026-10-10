import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { FoundryAssistant } from "@/components/foundry-assistant";
import { APP_COLORS, APP_SHADOW } from "@/constants/app-theme";
import { threadData, type ThreadItem } from "@/lib/demo-data";

function ThreadCard({ item }: { item: ThreadItem }) {
  const statusColor = item.status === "مفتوح" ? APP_COLORS.brand : item.status === "بانتظار العميل" ? APP_COLORS.warning : APP_COLORS.success;
  return (
    <TouchableOpacity style={styles.threadCard} activeOpacity={0.86} onPress={() => router.push(`/thread/${item.id}`)}>
      <View style={[styles.threadAccent, { backgroundColor: item.accent }]} />
      <View style={styles.threadTopline}>
        <View style={[styles.statusPill, { backgroundColor: `${statusColor}18` }]}><View style={[styles.statusDot, { backgroundColor: statusColor }]} /><Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text></View>
        <Text style={styles.threadTime}>{item.time}</Text>
      </View>
      <Text style={styles.threadTitle}>{item.title}</Text>
      <Text style={styles.threadProject}>{item.project}</Text>
      <Text style={styles.threadMessage} numberOfLines={1}>{item.lastMessage}</Text>
      <View style={styles.threadFooter}>
        <View style={styles.people}><View style={styles.peopleIcon}><Ionicons name="people-outline" size={14} color={APP_COLORS.inkSoft} /></View><Text style={styles.peopleText}>{item.participants} مشاركين</Text></View>
        <Text style={styles.author}>{item.author}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ConversationsScreen() {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => threadData.filter((item) => `${item.title} ${item.project} ${item.lastMessage}`.includes(search.trim())), [search]);
  return (
    <ScreenContainer edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}><View style={styles.headerCopy}><Text style={styles.eyebrow}>مساحة العمل المشتركة</Text><Text style={styles.title}>مواضيع الفريق</Text></View><View style={styles.headerIcon}><Ionicons name="chatbubbles-outline" size={24} color={APP_COLORS.success} /></View></View>
        <Text style={styles.subtitle}>تابع النقاشات وابقَ قريبًا من كل قرار في المشروع.</Text>
        <View style={styles.assistantWrap}><FoundryAssistant mode="chat" /></View>
        <View style={styles.searchBox}><Ionicons name="search-outline" size={19} color={APP_COLORS.inkFaint} /><TextInput value={search} onChangeText={setSearch} placeholder="ابحث في المواضيع..." placeholderTextColor={APP_COLORS.inkFaint} style={styles.searchInput} textAlign="right" /></View>
        <View style={styles.summaryStrip}><View style={styles.summaryItem}><Text style={styles.summaryValue}>{threadData.length}</Text><Text style={styles.summaryLabel}>كل المواضيع</Text></View><View style={styles.summaryDivider} /><View style={styles.summaryItem}><Text style={[styles.summaryValue, { color: APP_COLORS.brand }]}>{threadData.filter((item) => item.status === "مفتوح").length}</Text><Text style={styles.summaryLabel}>تحتاج متابعة</Text></View><View style={styles.summaryDivider} /><View style={styles.summaryItem}><Text style={[styles.summaryValue, { color: APP_COLORS.success }]}>{threadData.filter((item) => item.status === "مكتمل").length}</Text><Text style={styles.summaryLabel}>مكتملة</Text></View></View>
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>أحدث المواضيع</Text><Text style={styles.resultText}>{filtered.length} نتائج</Text></View>
        {filtered.length > 0 ? filtered.map((item) => <ThreadCard key={item.id} item={item} />) : <View style={styles.emptyState}><Ionicons name="search-outline" size={25} color={APP_COLORS.inkFaint} /><Text style={styles.emptyTitle}>لم نجد هذا الموضوع</Text><Text style={styles.emptyBody}>جرّب كلمة أخرى أو اسم مشروع مختلف.</Text></View>}
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
  headerIcon: { width: 49, height: 49, borderRadius: 17, backgroundColor: APP_COLORS.successPale, alignItems: "center", justifyContent: "center" },
  subtitle: { color: APP_COLORS.inkSoft, fontSize: 13, textAlign: "right", marginTop: 7, writingDirection: "rtl" },
  assistantWrap: { marginTop: 16 },
  searchBox: { height: 48, marginTop: 20, borderRadius: 15, backgroundColor: APP_COLORS.surface, borderWidth: 1, borderColor: APP_COLORS.border, flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 14, gap: 8 },
  searchInput: { flex: 1, color: APP_COLORS.ink, fontSize: 13, writingDirection: "rtl" },
  summaryStrip: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-around", backgroundColor: APP_COLORS.ink, borderRadius: 18, marginTop: 14, paddingVertical: 15 },
  summaryItem: { alignItems: "center", flex: 1 },
  summaryValue: { color: APP_COLORS.white, fontSize: 21, fontWeight: "900" },
  summaryLabel: { color: "#B9C2C7", fontSize: 10, fontWeight: "600", marginTop: 3, writingDirection: "rtl" },
  summaryDivider: { width: 1, height: 28, backgroundColor: "#45525A" },
  sectionHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginTop: 25, marginBottom: 11 },
  sectionTitle: { color: APP_COLORS.ink, fontSize: 17, fontWeight: "900", writingDirection: "rtl" },
  resultText: { color: APP_COLORS.inkFaint, fontSize: 11, writingDirection: "rtl" },
  threadCard: { backgroundColor: APP_COLORS.surface, borderRadius: 18, padding: 16, marginBottom: 11, borderWidth: 1, borderColor: APP_COLORS.border, overflow: "hidden", ...APP_SHADOW },
  threadAccent: { position: "absolute", right: 0, top: 0, bottom: 0, width: 4 },
  threadTopline: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  statusPill: { flexDirection: "row-reverse", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: "900", writingDirection: "rtl" },
  threadTime: { color: APP_COLORS.inkFaint, fontSize: 10, writingDirection: "rtl" },
  threadTitle: { color: APP_COLORS.ink, fontSize: 16, fontWeight: "900", textAlign: "right", marginTop: 13, writingDirection: "rtl" },
  threadProject: { color: APP_COLORS.brandDark, fontSize: 11, fontWeight: "700", textAlign: "right", marginTop: 4, writingDirection: "rtl" },
  threadMessage: { color: APP_COLORS.inkSoft, fontSize: 12, textAlign: "right", marginTop: 9, writingDirection: "rtl" },
  threadFooter: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 11, borderTopWidth: 1, borderTopColor: APP_COLORS.surfaceMuted },
  people: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  peopleIcon: { width: 25, height: 25, borderRadius: 8, backgroundColor: APP_COLORS.surfaceMuted, alignItems: "center", justifyContent: "center" },
  peopleText: { color: APP_COLORS.inkSoft, fontSize: 10, fontWeight: "700", writingDirection: "rtl" },
  author: { color: APP_COLORS.inkFaint, fontSize: 10, writingDirection: "rtl" },
  emptyState: { backgroundColor: APP_COLORS.surface, borderRadius: 20, padding: 32, alignItems: "center", borderWidth: 1, borderColor: APP_COLORS.border },
  emptyTitle: { color: APP_COLORS.ink, fontSize: 16, fontWeight: "900", marginTop: 11, writingDirection: "rtl" },
  emptyBody: { color: APP_COLORS.inkSoft, fontSize: 12, marginTop: 5, writingDirection: "rtl" },
});
