import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { APP_COLORS } from "@/constants/app-theme";
import { trpc } from "@/lib/trpc";

export type NotificationAssistantContext = {
  title: string;
  body: string;
  project: string;
  priority: string;
};

type FoundryAssistantProps = {
  mode: "chat" | "notification";
  notification?: NotificationAssistantContext;
};

export function FoundryAssistant({ mode, notification }: FoundryAssistantProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const chatMutation = trpc.foundry.chat.useMutation();
  const summarizeMutation = trpc.foundry.summarizeNotification.useMutation();
  const isPending = chatMutation.isPending || summarizeMutation.isPending;

  const run = async () => {
    if (mode === "chat") {
      if (!input.trim()) return;
      const result = await chatMutation.mutateAsync({ message: input.trim() });
      setAnswer(result.text);
      return;
    }
    if (!notification) return;
    const result = await summarizeMutation.mutateAsync(notification);
    setAnswer(result.text);
  };

  const errorMessage = chatMutation.error?.message ?? summarizeMutation.error?.message;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.trigger} onPress={() => setOpen((value) => !value)} activeOpacity={0.85}>
        <View style={styles.triggerIcon}><Ionicons name="sparkles-outline" size={17} color={APP_COLORS.brandDark} /></View>
        <View style={styles.triggerCopy}><Text style={styles.triggerTitle}>{mode === "chat" ? "اسأل وكيل العزب" : "حلّل الإشعار بالوكيل"}</Text><Text style={styles.triggerHint}>{mode === "chat" ? "مساعد Microsoft Foundry داخل المحادثات" : "تلخيص وأولوية ومسودة رد"}</Text></View>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={17} color={APP_COLORS.inkFaint} />
      </TouchableOpacity>
      {open && <View style={styles.panel}>
        {mode === "chat" && <TextInput value={input} onChangeText={(value) => { setInput(value); setAnswer(""); }} placeholder="مثال: ما آخر تحديث لمشروع برج الأمير؟" placeholderTextColor={APP_COLORS.inkFaint} multiline textAlign="right" style={styles.input} />}
        {mode === "notification" && !answer && <Text style={styles.panelIntro}>سيقرأ الوكيل عنوان الإشعار ومحتواه وسياقه ثم يقترح ملخصًا وأولوية ومسودة رد.</Text>}
        <TouchableOpacity style={[styles.runButton, (isPending || (mode === "chat" && !input.trim())) && styles.runButtonDisabled]} onPress={run} disabled={isPending || (mode === "chat" && !input.trim())}>
          {isPending ? <ActivityIndicator size="small" color={APP_COLORS.white} /> : <Ionicons name="sparkles" size={15} color={APP_COLORS.white} />}
          <Text style={styles.runButtonText}>{isPending ? "جاري التحليل..." : mode === "chat" ? "اسأل الوكيل" : "تحليل الإشعار"}</Text>
        </TouchableOpacity>
        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        {!!answer && <View style={styles.answerBox}><View style={styles.answerLabel}><Ionicons name="checkmark-circle-outline" size={15} color={APP_COLORS.success} /><Text style={styles.answerLabelText}>رد وكيل العزب</Text></View><Text style={styles.answerText}>{answer}</Text></View>}
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: APP_COLORS.surface, borderRadius: 18, borderWidth: 1, borderColor: "#E7D3BF", overflow: "hidden" },
  trigger: { flexDirection: "row-reverse", alignItems: "center", padding: 12, gap: 9 },
  triggerIcon: { width: 32, height: 32, borderRadius: 11, backgroundColor: APP_COLORS.brandPale, alignItems: "center", justifyContent: "center" },
  triggerCopy: { flex: 1, alignItems: "flex-end" },
  triggerTitle: { color: APP_COLORS.ink, fontSize: 12, fontWeight: "900", writingDirection: "rtl" },
  triggerHint: { color: APP_COLORS.inkFaint, fontSize: 9, marginTop: 2, textAlign: "right", writingDirection: "rtl" },
  panel: { borderTopWidth: 1, borderTopColor: APP_COLORS.surfaceMuted, padding: 12, gap: 9 },
  panelIntro: { color: APP_COLORS.inkSoft, fontSize: 11, lineHeight: 18, textAlign: "right", writingDirection: "rtl" },
  input: { minHeight: 72, backgroundColor: APP_COLORS.background, borderRadius: 12, padding: 11, color: APP_COLORS.ink, fontSize: 12, lineHeight: 19, writingDirection: "rtl" },
  runButton: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 7, backgroundColor: APP_COLORS.brand, borderRadius: 11, paddingVertical: 10 },
  runButtonDisabled: { backgroundColor: "#CFC7BE" },
  runButtonText: { color: APP_COLORS.white, fontSize: 11, fontWeight: "900", writingDirection: "rtl" },
  errorText: { color: APP_COLORS.danger, fontSize: 10, lineHeight: 16, textAlign: "right", writingDirection: "rtl" },
  answerBox: { backgroundColor: APP_COLORS.successPale, borderRadius: 12, padding: 11 },
  answerLabel: { flexDirection: "row-reverse", alignItems: "center", gap: 5, marginBottom: 6 },
  answerLabelText: { color: APP_COLORS.success, fontSize: 10, fontWeight: "900", writingDirection: "rtl" },
  answerText: { color: APP_COLORS.ink, fontSize: 12, lineHeight: 20, textAlign: "right", writingDirection: "rtl" },
});
