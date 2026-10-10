export type UserRole = "عميل" | "عضو فريق" | "إداري";
export type Priority = "عاجل" | "مهم" | "عادي";

export type NotificationItem = {
  id: string;
  title: string;
  preview: string;
  body: string;
  category: string;
  priority: Priority;
  sender: string;
  senderRole: string;
  time: string;
  unread: boolean;
  project: string;
};

export type ThreadItem = {
  id: string;
  title: string;
  project: string;
  lastMessage: string;
  author: string;
  time: string;
  participants: number;
  status: "مفتوح" | "بانتظار العميل" | "مكتمل";
  accent: string;
};

export const notificationData: NotificationItem[] = [
  {
    id: "n1",
    title: "تحديث مشروع برج الأمير",
    preview: "تم اعتماد مخطط الإضاءة للدور الثالث. نحتاج رأيك قبل بدء التنفيذ.",
    body: "تم اعتماد مخطط الإضاءة للدور الثالث من فريق التصميم والاستشاري. أرسل ردك قبل الساعة 6:00 مساءً حتى يبدأ فريق التنفيذ في تجهيز الخامات.",
    category: "المشاريع",
    priority: "عاجل",
    sender: "م. أحمد سامي",
    senderRole: "مدير المشروع",
    time: "منذ 12 دقيقة",
    unread: true,
    project: "برج الأمير السكني",
  },
  {
    id: "n2",
    title: "مرفق جديد من العميل",
    preview: "أضافت سارة مخططًا محدثًا للمطبخ إلى ملفات المشروع.",
    body: "أضافت سارة مخططًا محدثًا للمطبخ إلى ملفات مشروع فيلا الواحة الخضراء. راجع الملاحظات وأخبر الفريق إذا كان هناك تعديل مطلوب.",
    category: "الملفات",
    priority: "مهم",
    sender: "سارة حسن",
    senderRole: "العميل",
    time: "منذ ساعة",
    unread: true,
    project: "فيلا الواحة الخضراء",
  },
  {
    id: "n3",
    title: "مهمة صيانة UberFix جديدة",
    preview: "بلاغ تسريب في فرع أبو عوف — الاستجابة المطلوبة خلال ساعتين.",
    body: "تم تسجيل بلاغ صيانة طارئ في فرع أبو عوف بمدينة نصر. يرجى تأكيد استلام المهمة وتحديد الفني المناوب قبل بدء التحرك.",
    category: "UberFix",
    priority: "عاجل",
    sender: "غرفة عمليات UberFix",
    senderRole: "الإدارة",
    time: "منذ ساعتين",
    unread: true,
    project: "فرع أبو عوف — مدينة نصر",
  },
  {
    id: "n4",
    title: "تذكير باجتماع فريق التشطيبات",
    preview: "الاجتماع غدًا الساعة 10:00 صباحًا لمراجعة جدول التسليم.",
    body: "تذكير: اجتماع فريق التشطيبات غدًا الساعة 10:00 صباحًا لمراجعة المراحل المتبقية وتأكيد جدول التسليم النهائي.",
    category: "الفريق",
    priority: "عادي",
    sender: "مكتب إدارة المشاريع",
    senderRole: "الإدارة",
    time: "أمس، 4:30 م",
    unread: false,
    project: "اجتماع التشغيل الأسبوعي",
  },
  {
    id: "n5",
    title: "اعتماد عرض توريد الرخام",
    preview: "تمت مراجعة عينة Carrara وإرسال العرض المالي للاعتماد.",
    body: "انتهت مراجعة عينة رخام Carrara من فريق التوريدات. العرض المالي جاهز للاعتماد ويمكن بدء إجراءات الشحن بعد تأكيدك.",
    category: "التوريدات",
    priority: "مهم",
    sender: "محمود السيد",
    senderRole: "التوريدات",
    time: "الأحد، 11:20 ص",
    unread: false,
    project: "Laban Alasfour",
  },
];

export const threadData: ThreadItem[] = [
  {
    id: "t1",
    title: "ملاحظات التشطيب — الدور الثالث",
    project: "برج الأمير السكني",
    lastMessage: "تم تحديث جدول الخامات، ننتظر تأكيدك على الإضاءة.",
    author: "م. أحمد سامي",
    time: "منذ 12 دقيقة",
    participants: 6,
    status: "مفتوح",
    accent: "#FFB900",
  },
  {
    id: "t2",
    title: "تسليم واجهة فرع الإسكندرية",
    project: "هوية العلامة التجارية",
    lastMessage: "الصور النهائية جاهزة للمراجعة قبل الافتتاح.",
    author: "ريم عادل",
    time: "منذ 45 دقيقة",
    participants: 4,
    status: "بانتظار العميل",
    accent: "#15803D",
  },
  {
    id: "t3",
    title: "خطة طوارئ فروع أبو عوف",
    project: "UberFix للصيانة",
    lastMessage: "تم توزيع المناوبات الليلية على فريق الصيانة.",
    author: "غرفة العمليات",
    time: "أمس",
    participants: 9,
    status: "مفتوح",
    accent: "#DC2626",
  },
  {
    id: "t4",
    title: "تأكيد خامات المشروع الجديد",
    project: "Laban Alasfour",
    lastMessage: "تم إغلاق الموضوع بعد اعتماد العينة.",
    author: "محمود السيد",
    time: "الأحد",
    participants: 3,
    status: "مكتمل",
    accent: "#6E7D89",
  },
];

export const productionLines = [
  { name: "التشطيب الراقي", english: "Luxury Finishing", icon: "layers-outline" as const, color: "#FFB900" },
  { name: "هوية العلامة التجارية", english: "Brand Identity", icon: "storefront-outline" as const, color: "#030957" },
  { name: "UberFix للصيانة", english: "Architectural Maintenance", icon: "construct-outline" as const, color: "#DC2626" },
  { name: "Laban Alasfour", english: "Rare Materials", icon: "diamond-outline" as const, color: "#4B5563" },
];
