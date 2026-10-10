import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { APP_COLORS, APP_SHADOW } from "@/constants/app-theme";
import { threadData } from "@/lib/demo-data";

export default function ThreadDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = useMemo(() => threadData.find((item) => item.id === id), [id]);
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState(false);

  if (!thread) {
    return (
      <ScreenContainer edges={["top"]}>
        <View style={styles.missingState}><Ionicons name="chatbubble-ellipses-outline" size={30} color={APP_COLORS.inkFaint} /><Text style={styles.missingTitle}>الموضوع غير موجود</Text><TouchableOpacity style={styles.backCta} onPress={() => router.back()}><Text style={styles.backCtaText}>العودة للمحادثات</Text></TouchableOpacity></View>
      </ScreenContainer>
    );
  }

  const sendReply = () => {
    if (!reply.trim()) return;
    setReply("");
    setSent(true);
    Keyboard.dismiss();
  };

  return (
    <ScreenContainer edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}><TouchableOpacity style={styles.backButton} onPress={() => router.back()}><Ionicons name="arrow-forward" size={21} color={APP_COLORS.ink} /></TouchableOpacity><Text style={styles.topTitle}>موضوع الفريق</Text><View style={styles.topSpacer} /></View>
        <View style={[styles.threadHero, { borderRightColor: thread.accent }]}><View style={styles.heroMeta}><View style={styles.statusPill}><View style={styles.statusDot} /><Text style={styles.statusText}>{thread.status}</Text></View><Text style={styles.heroProject}>{thread.project}</Text></View><Text style={styles.threadTitle}>{thread.title}</Text><Text style={styles.threadSubtitle}>{thread.participants} مشاركين · آخر تحديث {thread.time}</Text></View>
        {sent && <View style={styles.successBanner}><Ionicons name="checkmark-circle" size={18} color={APP_COLORS.success} /><Text style={styles.successText}>تمت إضافة ردك إلى موضوع الفريق.</Text></View>}
        <Text style={styles.sectionTitle}>النقاش</Text>
        <View style={styles.messageList}>
          <View style={styles.messageRow}><View style={[styles.messageAvatar, { backgroundColor: `${thread.accent}22` }]}><Text style={[styles.messageInitial, { color: thread.accent }]}>{thread.author.slice(0, 1)}</Text></View><View style={styles.messageBubble}><View style={styles.messageHead}><Text style={styles.messageAuthor}>{thread.author}</Text><Text style={styles.messageTime}>{thread.time}</Text></View><Text style={styles.messageText}>{thread.lastMessage}</Text></View></View>
          <View style={styles.mineMessageWrap}><View style={styles.mineMeta}><Text style={styles.mineAuthor}>أنت · منذ 5 دقائق</Text><View style={styles.messageAvatarMine}><Text style={styles.messageInitialMine}>ي</Text></View></View><View style={styles.messageBubbleMine}><Text style={styles.messageTextMine}>سأراجع التفاصيل وأعود بتأكيد واضح للفريق.</Text></View></View>
        </View>
        <Text style={styles.sectionTitle}>أضف إلى النقاش</Text>
        <View style={styles.replyCard}><TextInput value={reply} onChangeText={(value) => { setReply(value); setSent(false); }} placeholder="اكتب ردك للفريق..." placeholderTextColor={APP_COLORS.inkFaint} multiline textAlign="right" textAlignVertical="top" style={styles.replyInput} /><View style={styles.replyFooter}><Text style={styles.replyHint}>يراه جميع المشاركين</Text><TouchableOpacity style={[styles.sendButton, !reply.trim() && styles.sendButtonDisabled]} onPress={sendReply} disabled={!reply.trim()}><Text style={styles.sendButtonText}>إرسال</Text><Ionicons name="send-outline" size={15} color={APP_COLORS.white} /></TouchableOpacity></View></View>
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
  threadHero: { backgroundColor: APP_COLORS.ink, borderRadius: 21, borderRightWidth: 5, padding: 18, ...APP_SHADOW },
  heroMeta: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  statusPill: { flexDirection: "row-reverse", alignItems: "center", gap: 5, backgroundColor: "#35434B", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#65C39F" },
  statusText: { color: "#D5E4DD", fontSize: 10, fontWeight: "900", writingDirection: "rtl" },
  heroProject: { color: "#D9B38D", fontSize: 10, fontWeight: "800", writingDirection: "rtl" },
  threadTitle: { color: APP_COLORS.white, fontSize: 22, lineHeight: 29, fontWeight: "900", textAlign: "right", marginTop: 17, writingDirection: "rtl" },
  threadSubtitle: { color: "#B4C0C4", fontSize: 10, textAlign: "right", marginTop: 7, writingDirection: "rtl" },
  successBanner: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 7, backgroundColor: APP_COLORS.successPale, borderRadius: 14, padding: 11, marginTop: 13 },
  successText: { color: APP_COLORS.success, fontSize: 11, fontWeight: "800", writingDirection: "rtl" },
  sectionTitle: { color: APP_COLORS.ink, fontSize: 17, fontWeight: "900", textAlign: "right", marginTop: 26, marginBottom: 11, writingDirection: "rtl" },
  messageList: { gap: 12 },
  messageRow: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 8 },
  mineMessageWrap: { width: "88%", alignSelf: "flex-end" },
  mineMeta: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "flex-start", gap: 7, marginBottom: 6 },
  messageAvatar: { width: 32, height: 32, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  messageAvatarMine: { width: 32, height: 32, borderRadius: 11, backgroundColor: APP_COLORS.brand, alignItems: "center", justifyContent: "center" },
  messageInitial: { fontSize: 13, fontWeight: "900" },
  messageInitialMine: { color: APP_COLORS.white, fontSize: 13, fontWeight: "900" },
  messageBubble: { flex: 1, backgroundColor: APP_COLORS.surface, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: APP_COLORS.border },
  messageBubbleMine: { backgroundColor: APP_COLORS.brandPale, borderColor: "#E7CBAE", borderRadius: 16, padding: 12, borderWidth: 1 },
  messageHead: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  messageAuthor: { color: APP_COLORS.ink, fontSize: 11, fontWeight: "900", writingDirection: "rtl" },
  messageTime: { color: APP_COLORS.inkFaint, fontSize: 9, writingDirection: "rtl" },
  messageText: { color: APP_COLORS.inkSoft, fontSize: 12, lineHeight: 20, textAlign: "right", marginTop: 7, writingDirection: "rtl" },
  messageTextMine: { color: APP_COLORS.ink, fontSize: 12, lineHeight: 20, textAlign: "right", writingDirection: "rtl" },
  mineAuthor: { color: APP_COLORS.brandDark, fontSize: 9, fontWeight: "800", writingDirection: "rtl" },
  replyCard: { backgroundColor: APP_COLORS.surface, borderRadius: 18, padding: 13, borderWidth: 1, borderColor: APP_COLORS.border },
  replyInput: { minHeight: 92, color: APP_COLORS.ink, fontSize: 13, lineHeight: 21, writingDirection: "rtl" },
  replyFooter: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: APP_COLORS.surfaceMuted, paddingTop: 11, marginTop: 7 },
  replyHint: { color: APP_COLORS.inkFaint, fontSize: 10, writingDirection: "rtl" },
  sendButton: { flexDirection: "row-reverse", alignItems: "center", gap: 6, backgroundColor: APP_COLORS.brand, borderRadius: 11, paddingHorizontal: 14, paddingVertical: 10 },
  sendButtonDisabled: { backgroundColor: "#CFC7BE" },
  sendButtonText: { color: APP_COLORS.white, fontSize: 11, fontWeight: "900", writingDirection: "rtl" },
  missingState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30 },
  missingTitle: { color: APP_COLORS.ink, fontSize: 18, fontWeight: "900", marginTop: 12, writingDirection: "rtl" },
  backCta: { backgroundColor: APP_COLORS.brand, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 11, marginTop: 15 },
  backCtaText: { color: APP_COLORS.white, fontSize: 12, fontWeight: "900", writingDirection: "rtl" },
});
