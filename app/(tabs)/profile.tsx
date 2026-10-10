import Ionicons from "@expo/vector-icons/Ionicons";
import * as Linking from "expo-linking";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { APP_COLORS, APP_SHADOW } from "@/constants/app-theme";
import { productionLines, type UserRole } from "@/lib/demo-data";
import { setDemoRole, useDemoRole } from "@/lib/demo-state";
import { getApiBaseUrl } from "@/constants/oauth";

const roles: { label: UserRole; icon: keyof typeof Ionicons.glyphMap; description: string }[] = [
  { label: "عميل", icon: "person-outline", description: "تابع مشروعك وأرسل ملاحظاتك للفريق." },
  { label: "عضو فريق", icon: "construct-outline", description: "رتّب مهامك ورد على أولويات المشروع." },
  { label: "إداري", icon: "briefcase-outline", description: "راقب التشغيل ووزّع القرارات على الفرق." },
];

export default function ProfileScreen() {
  const role = useDemoRole();
  const activeRole = roles.find((item) => item.label === role) ?? roles[1];
  return (
    <ScreenContainer edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}><View style={styles.headerCopy}><Text style={styles.eyebrow}>مساحتك داخل العزب</Text><Text style={styles.title}>حسابي</Text></View><View style={styles.headerIcon}><Ionicons name="person-outline" size={23} color={APP_COLORS.brand} /></View></View>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}><Text style={styles.profileInitial}>ي</Text></View>
          <View style={styles.profileCopy}><Text style={styles.profileName}>يارا محمد</Text><Text style={styles.profileMeta}>فريق إدارة المشاريع · القاهرة</Text><View style={styles.activeRole}><View style={styles.roleDot} /><Text style={styles.activeRoleText}>{role}</Text></View></View>
          <TouchableOpacity style={styles.editButton}><Ionicons name="create-outline" size={18} color={APP_COLORS.inkSoft} /></TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>تجربة الدور</Text>
        <Text style={styles.sectionHint}>تبديل تجريبي لمعاينة ما يراه كل طرف.</Text>
        <View style={styles.roleList}>{roles.map((item) => { const selected = item.label === role; return <TouchableOpacity key={item.label} style={[styles.roleCard, selected && styles.roleCardSelected]} onPress={() => setDemoRole(item.label)}><View style={[styles.roleIcon, selected && styles.roleIconSelected]}><Ionicons name={item.icon} size={19} color={selected ? APP_COLORS.white : APP_COLORS.inkSoft} /></View><View style={styles.roleCopy}><Text style={[styles.roleTitle, selected && styles.roleTitleSelected]}>{item.label}</Text><Text style={[styles.roleDescription, selected && styles.roleDescriptionSelected]}>{item.description}</Text></View><Ionicons name={selected ? "checkmark-circle" : "ellipse-outline"} size={21} color={selected ? APP_COLORS.brand : APP_COLORS.border} /></TouchableOpacity>; })}</View>

        <View style={styles.contextCard}><View style={styles.contextIcon}><Ionicons name={activeRole.icon} size={21} color={APP_COLORS.brandDark} /></View><View style={styles.contextCopy}><Text style={styles.contextEyebrow}>المعاينة الحالية</Text><Text style={styles.contextTitle}>أنت ترى تجربة {activeRole.label}</Text><Text style={styles.contextBody}>{activeRole.description}</Text></View></View>
        <TouchableOpacity style={styles.entraButton} onPress={() => { void Linking.openURL(`${getApiBaseUrl()}/api/entra/login?returnPath=${encodeURIComponent("/")}`); }} activeOpacity={0.85}><View style={styles.entraIcon}><Ionicons name="logo-microsoft" size={17} color={APP_COLORS.brandDark} /></View><View style={styles.entraCopy}><Text style={styles.entraTitle}>ربط Microsoft Entra</Text><Text style={styles.entraHint}>لتفعيل هوية المستخدم مع وكيل Foundry</Text></View><Ionicons name="arrow-back" size={17} color={APP_COLORS.inkFaint} /></TouchableOpacity>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>خطوط العزب الأربعة</Text><Text style={styles.experienceText}>20+ سنة خبرة</Text></View>
        <View style={styles.linesCard}>{productionLines.map((line, index) => <View key={line.name} style={[styles.lineRow, index === productionLines.length - 1 && styles.lastLine]}><View style={[styles.lineIcon, { backgroundColor: `${line.color}18` }]}><Ionicons name={line.icon} size={18} color={line.color} /></View><View style={styles.lineCopy}><Text style={styles.lineName}>{line.name}</Text><Text style={styles.lineEnglish}>{line.english}</Text></View><Ionicons name="chevron-back" size={17} color={APP_COLORS.inkFaint} /></View>)}</View>
        <TouchableOpacity style={styles.supportButton}><Ionicons name="chatbubble-ellipses-outline" size={18} color={APP_COLORS.brandDark} /><Text style={styles.supportText}>تحتاج مساعدة؟ تواصل مع غرفة العمليات</Text></TouchableOpacity>
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
  profileCard: { flexDirection: "row-reverse", alignItems: "center", backgroundColor: APP_COLORS.ink, borderRadius: 21, padding: 17, marginTop: 22, ...APP_SHADOW },
  profileAvatar: { width: 54, height: 54, borderRadius: 18, backgroundColor: APP_COLORS.brand, alignItems: "center", justifyContent: "center" },
  profileInitial: { color: APP_COLORS.white, fontSize: 24, fontWeight: "900" },
  profileCopy: { flex: 1, alignItems: "flex-end", marginRight: 12 },
  profileName: { color: APP_COLORS.white, fontSize: 18, fontWeight: "900", writingDirection: "rtl" },
  profileMeta: { color: "#B6C0C4", fontSize: 11, marginTop: 3, writingDirection: "rtl" },
  activeRole: { flexDirection: "row-reverse", alignItems: "center", gap: 6, marginTop: 8 },
  roleDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#65C39F" },
  activeRoleText: { color: "#D2DBDE", fontSize: 10, fontWeight: "700", writingDirection: "rtl" },
  editButton: { width: 34, height: 34, borderRadius: 12, backgroundColor: "#33424B", alignItems: "center", justifyContent: "center" },
  sectionTitle: { color: APP_COLORS.ink, fontSize: 17, fontWeight: "900", textAlign: "right", marginTop: 26, writingDirection: "rtl" },
  sectionHint: { color: APP_COLORS.inkSoft, fontSize: 12, textAlign: "right", marginTop: 5, writingDirection: "rtl" },
  roleList: { gap: 9, marginTop: 13 },
  roleCard: { flexDirection: "row-reverse", alignItems: "center", backgroundColor: APP_COLORS.surface, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: APP_COLORS.border, gap: 10 },
  roleCardSelected: { borderColor: "#D8B38E", backgroundColor: "#FFFDFC" },
  roleIcon: { width: 37, height: 37, borderRadius: 12, backgroundColor: APP_COLORS.surfaceMuted, alignItems: "center", justifyContent: "center" },
  roleIconSelected: { backgroundColor: APP_COLORS.brand },
  roleCopy: { flex: 1, alignItems: "flex-end" },
  roleTitle: { color: APP_COLORS.ink, fontSize: 13, fontWeight: "900", writingDirection: "rtl" },
  roleTitleSelected: { color: APP_COLORS.brandDark },
  roleDescription: { color: APP_COLORS.inkFaint, fontSize: 10, marginTop: 3, textAlign: "right", writingDirection: "rtl" },
  roleDescriptionSelected: { color: APP_COLORS.inkSoft },
  contextCard: { flexDirection: "row-reverse", alignItems: "center", gap: 11, backgroundColor: APP_COLORS.brandPale, borderRadius: 17, padding: 14, marginTop: 18 },
  contextIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#FFF8F1", alignItems: "center", justifyContent: "center" },
  contextCopy: { flex: 1, alignItems: "flex-end" },
  contextEyebrow: { color: APP_COLORS.brandDark, fontSize: 10, fontWeight: "800", writingDirection: "rtl" },
  contextTitle: { color: APP_COLORS.ink, fontSize: 13, fontWeight: "900", marginTop: 3, writingDirection: "rtl" },
  contextBody: { color: APP_COLORS.inkSoft, fontSize: 10, marginTop: 3, textAlign: "right", writingDirection: "rtl" },
  entraButton: { flexDirection: "row-reverse", alignItems: "center", gap: 9, backgroundColor: APP_COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: "#C6D8E1", padding: 12, marginTop: 12 },
  entraIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: "#E8F1F6", alignItems: "center", justifyContent: "center" },
  entraCopy: { flex: 1, alignItems: "flex-end" },
  entraTitle: { color: APP_COLORS.ink, fontSize: 12, fontWeight: "900", writingDirection: "rtl" },
  entraHint: { color: APP_COLORS.inkFaint, fontSize: 9, marginTop: 2, writingDirection: "rtl" },
  sectionHeader: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginTop: 28, marginBottom: 11 },
  experienceText: { color: APP_COLORS.brandDark, fontSize: 11, fontWeight: "800", writingDirection: "rtl" },
  linesCard: { backgroundColor: APP_COLORS.surface, borderRadius: 18, paddingHorizontal: 14, borderWidth: 1, borderColor: APP_COLORS.border },
  lineRow: { minHeight: 64, flexDirection: "row-reverse", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: APP_COLORS.surfaceMuted },
  lastLine: { borderBottomWidth: 0 },
  lineIcon: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  lineCopy: { flex: 1, alignItems: "flex-end" },
  lineName: { color: APP_COLORS.ink, fontSize: 12, fontWeight: "800", writingDirection: "rtl" },
  lineEnglish: { color: APP_COLORS.inkFaint, fontSize: 9, marginTop: 2, writingDirection: "ltr" },
  supportButton: { flexDirection: "row-reverse", justifyContent: "center", alignItems: "center", gap: 7, paddingVertical: 17 },
  supportText: { color: APP_COLORS.brandDark, fontSize: 11, fontWeight: "800", writingDirection: "rtl" },
});
