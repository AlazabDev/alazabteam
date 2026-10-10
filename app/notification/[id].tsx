import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { FoundryAssistant } from "@/components/foundry-assistant";
import { APP_COLORS, APP_SHADOW } from "@/constants/app-theme";
import { notificationData } from "@/lib/demo-data";

export default function NotificationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = useMemo(() => notificationData.find((notification) => notification.id === id) ?? notificationData[0], [id]);
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState(false);

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSent(true);
    setReply("");
    Keyboard.dismiss();
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
  };

  return (
    <ScreenContainer edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}><TouchableOpacity style={styles.backButton} onPress={() => router.back()}><Ionicons name="arrow-forward" size={21} color={APP_COLORS.ink} /></TouchableOpacity><Text style={styles.topTitle}>تفاصيل الإشعار</Text><View style={styles.topSpacer} /></View>
        <View style={styles.detailCard}>
          <View style={styles.detailMeta}><View style={styles.categoryPill}><Ionicons name="folder-open-outline" size={13} color={APP_COLORS.brandDark} /><Text style={styles.categoryText}>{item.category}</Text></View><Text style={styles.timeText}>{item.time}</Text></View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.project}>{item.project}</Text>
          <View style={styles.senderRow}><View style={styles.senderAvatar}><Text style={styles.senderInitial}>{item.sender.slice(0, 1)}</Text></View><View style={styles.senderCopy}><Text style={styles.senderName}>{item.sender}</Text><Text style={styles.senderRole}>{item.senderRole}</Text></View><View style={styles.priorityPill}><View style={styles.priorityDot} /><Text style={styles.priorityText}>{item.priority}</Text></View></View>
          <View style={styles.separator} />
          <Text style={styles.body}>{item.body}</Text>
        </View>
        <View style={styles.assistantWrap}><FoundryAssistant mode="notification" notification={{ title: item.title, body: item.body, project: item.project, priority: item.priority }} /></View>

        {sent && <View style={styles.successBanner}><View style={styles.successIcon}><Ionicons name="checkmark" size={16} color={APP_COLORS.success} /></View><View style={styles.successCopy}><Text style={styles.successTitle}>تم إرسال ردك</Text><Text style={styles.successText}>وصل ردك إلى {item.sender} وفريق المشروع.</Text></View><TouchableOpacity onPress={() => setSent(false)}><Ionicons name="close" size={18} color={APP_COLORS.inkFaint} /></TouchableOpacity></View>}

        <Text style={styles.sectionTitle}>أضف ردًا للفريق</Text>
        <View style={styles.replyCard}>
          <TextInput value={reply} onChangeText={(value) => { setReply(value); setSent(false); }} placeholder="اكتب ملاحظتك أو تأكيدك هنا..." placeholderTextColor={APP_COLORS.inkFaint} multiline numberOfLines={5} textAlign="right" textAlignVertical="top" style={styles.replyInput} />
          <View style={styles.replyFooter}><Text style={styles.replyHint}>سيظهر الرد ضمن موضوع المشروع</Text><TouchableOpacity style={[styles.sendButton, !reply.trim() && styles.sendButtonDisabled]} onPress={sendReply} disabled={!reply.trim()}><Text style={styles.sendButtonText}>إرسال الرد</Text><Ionicons name="send-outline" size={16} color={APP_COLORS.white} /></TouchableOpacity></View>
        </View>
        <View style={styles.nextStep}><Ionicons name="information-circle-outline" size={18} color={APP_COLORS.brand} /><Text style={styles.nextStepText}>يمكنك العودة إلى الإشعارات لمتابعة بقية الأولويات.</Text></View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, maxWidth: 760, width: "100%", alignSelf: "center" },
  topBar: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  backButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: APP_COLORS.surface, alignItems: "center", justifyContent: "center", ...APP_SHADOW },
  topTitle: { color: APP_COLORS.ink, fontSize: 16, fontWeight: "900", writingDirection: "rtl" },
  topSpacer: { width: 42 },
  detailCard: { backgroundColor: APP_COLORS.surface, borderRadius: 21, padding: 18, borderWidth: 1, borderColor: APP_COLORS.border, ...APP_SHADOW },
  detailMeta: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  categoryPill: { flexDirection: "row-reverse", alignItems: "center", gap: 5, backgroundColor: APP_COLORS.brandPale, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  categoryText: { color: APP_COLORS.brandDark, fontSize: 10, fontWeight: "900", writingDirection: "rtl" },
  timeText: { color: APP_COLORS.inkFaint, fontSize: 10, writingDirection: "rtl" },
  title: { color: APP_COLORS.ink, fontSize: 24, lineHeight: 31, fontWeight: "900", textAlign: "right", marginTop: 17, writingDirection: "rtl" },
  project: { color: APP_COLORS.brandDark, fontSize: 12, fontWeight: "800", textAlign: "right", marginTop: 5, writingDirection: "rtl" },
  senderRow: { flexDirection: "row-reverse", alignItems: "center", marginTop: 20 },
  senderAvatar: { width: 37, height: 37, borderRadius: 13, backgroundColor: APP_COLORS.brandPale, alignItems: "center", justifyContent: "center" },
  senderInitial: { color: APP_COLORS.brandDark, fontSize: 15, fontWeight: "900" },
  senderCopy: { flex: 1, alignItems: "flex-end", marginRight: 9 },
  senderName: { color: APP_COLORS.ink, fontSize: 12, fontWeight: "900", writingDirection: "rtl" },
  senderRole: { color: APP_COLORS.inkFaint, fontSize: 10, marginTop: 2, writingDirection: "rtl" },
  priorityPill: { flexDirection: "row-reverse", alignItems: "center", gap: 5, backgroundColor: APP_COLORS.dangerPale, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  priorityDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: APP_COLORS.danger },
  priorityText: { color: APP_COLORS.danger, fontSize: 10, fontWeight: "900", writingDirection: "rtl" },
  separator: { height: 1, backgroundColor: APP_COLORS.surfaceMuted, marginVertical: 18 },
  body: { color: APP_COLORS.inkSoft, fontSize: 14, lineHeight: 24, textAlign: "right", writingDirection: "rtl" },
  assistantWrap: { marginTop: 13 },
  successBanner: { flexDirection: "row-reverse", alignItems: "center", gap: 9, backgroundColor: APP_COLORS.successPale, borderRadius: 16, padding: 12, marginTop: 13 },
  successIcon: { width: 29, height: 29, borderRadius: 10, backgroundColor: APP_COLORS.white, alignItems: "center", justifyContent: "center" },
  successCopy: { flex: 1, alignItems: "flex-end" },
  successTitle: { color: APP_COLORS.success, fontSize: 12, fontWeight: "900", writingDirection: "rtl" },
  successText: { color: APP_COLORS.inkSoft, fontSize: 10, marginTop: 2, textAlign: "right", writingDirection: "rtl" },
  sectionTitle: { color: APP_COLORS.ink, fontSize: 17, fontWeight: "900", textAlign: "right", marginTop: 27, marginBottom: 10, writingDirection: "rtl" },
  replyCard: { backgroundColor: APP_COLORS.surface, borderRadius: 18, padding: 13, borderWidth: 1, borderColor: APP_COLORS.border },
  replyInput: { minHeight: 110, color: APP_COLORS.ink, fontSize: 13, lineHeight: 21, writingDirection: "rtl" },
  replyFooter: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: APP_COLORS.surfaceMuted, paddingTop: 11, marginTop: 7 },
  replyHint: { color: APP_COLORS.inkFaint, fontSize: 10, writingDirection: "rtl" },
  sendButton: { flexDirection: "row-reverse", alignItems: "center", gap: 7, backgroundColor: APP_COLORS.brand, borderRadius: 11, paddingHorizontal: 13, paddingVertical: 10 },
  sendButtonDisabled: { backgroundColor: "#CFC7BE" },
  sendButtonText: { color: APP_COLORS.white, fontSize: 11, fontWeight: "900", writingDirection: "rtl" },
  nextStep: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 21 },
  nextStepText: { color: APP_COLORS.inkFaint, fontSize: 10, writingDirection: "rtl" },
});
