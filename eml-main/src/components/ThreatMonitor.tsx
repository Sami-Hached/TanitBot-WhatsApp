import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  Users,
  MessageSquareWarning,
  Lock,
  UserX,
  FileText,
  Bot,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
  LogOut,
  LogIn,
  KeyRound,
  BadgeCheck,
  Building2,
  Clock,
  ArrowRight,
  Share2,
  Heart,
  MessageCircle,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

interface ThreatMonitorProps {
  onConsultTanitBot: (presetPrompt: string) => void;
}

export default function ThreatMonitor({ onConsultTanitBot }: ThreatMonitorProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("tanitbot_monitor_auth") === "true";
  });
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState("amira.mansour@investigation.tn");
  const [loginPassword, setLoginPassword] = useState("••••••••••••");
  const [pressId, setPressId] = useState("SNJT-TN-PRESS-2026-904");

  // Operational State
  const [commentsLimited, setCommentsLimited] = useState<boolean>(() => {
    return sessionStorage.getItem("tanitbot_comments_limited") === "true";
  });
  const [reportedBlocked, setReportedBlocked] = useState<boolean>(() => {
    return sessionStorage.getItem("tanitbot_reported_blocked") === "true";
  });
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [showFlaggedComments, setShowFlaggedComments] = useState(true);

  useEffect(() => {
    sessionStorage.setItem("tanitbot_monitor_auth", isAuthenticated ? "true" : "false");
  }, [isAuthenticated]);

  useEffect(() => {
    sessionStorage.setItem("tanitbot_comments_limited", commentsLimited ? "true" : "false");
  }, [commentsLimited]);

  useEffect(() => {
    sessionStorage.setItem("tanitbot_reported_blocked", reportedBlocked ? "true" : "false");
  }, [reportedBlocked]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      setIsAuthenticated(true);
    }, 600);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCommentsLimited(false);
    setReportedBlocked(false);
    setEvidenceModalOpen(false);
    sessionStorage.removeItem("tanitbot_monitor_auth");
    sessionStorage.removeItem("tanitbot_comments_limited");
    sessionStorage.removeItem("tanitbot_reported_blocked");
  };

  const journalistQuestion = isArabic
    ? "نشرت تحقيق صحفي وجاتني هجمات وتعليقات فيها تهديد ومحاولات لكشف عنواني ورقمي، شنوة نعمل توا خطوة بخطوة باش نحمي روحي ونوثق الأدلة قانونياً؟"
    : "I published an investigative article and started receiving hostile threats and attempts to find my home address and phone. What concrete steps should I take now to secure myself and preserve legal evidence?";

  /* ========================================================================= */
  /* 1. Unauthenticated View: Secure Journalist Login Portal                   */
  /* ========================================================================= */
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-xs space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-2xs">
              <ShieldAlert size={26} />
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {isArabic ? "مرصد السلامة الرقمية (TanitWatch)" : "Tanit Threat Monitor"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-body leading-relaxed max-w-md mx-auto">
              {isArabic
                ? "منظومة الحماية والاستشعار المبكر المخصصة للصحفيين والمدافعين عن حقوق الإنسان في تونس لمتابعة وتحليل التهديدات الرقمية."
                : "Automated early warning and telemetry protection for verified journalists and civil society organizations in Tunisia."}
            </p>
          </div>

          {/* Secure Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-semibold text-foreground">
                {isArabic ? "البريد الإلكتروني المهني" : "Professional Email"}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@press-organization.tn"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-cream/30 text-xs sm:text-sm font-body text-foreground focus:outline-none focus:border-primary focus:bg-white transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-semibold text-foreground">
                {isArabic ? "كلمة المرور المشفرة" : "Password"}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-cream/30 text-xs sm:text-sm font-body text-foreground focus:outline-none focus:border-primary focus:bg-white transition-all shadow-2xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-heading font-semibold text-foreground">
                  {isArabic ? "معرّف الاعتماد الصحفي (Press Token)" : "Press Credential Token"}
                </label>
                <span className="text-2xs text-primary font-body font-semibold">
                  {isArabic ? "معتمد (SNJT)" : "Verified (SNJT)"}
                </span>
              </div>
              <input
                type="text"
                value={pressId}
                onChange={(e) => setPressId(e.target.value)}
                placeholder="SNJT-TN-PRESS-2026-904"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-cream/30 text-xs sm:text-sm font-body text-foreground focus:outline-none focus:border-primary focus:bg-white transition-all shadow-2xs font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-heading text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>{isArabic ? "جاري التحقق وتشفير الجلسة..." : "Establishing Secure Session..."}</span>
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  <span>{isArabic ? "تسجيل الدخول ومتابعة الرصد" : "Sign In & Access Telemetry"}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Connect Pre-fill Helper */}
          <div className="pt-2 border-t border-border/50 text-center">
            <button
              type="button"
              onClick={() => {
                setLoginEmail("amira.mansour@investigation.tn");
                setLoginPassword("••••••••••••");
                setPressId("SNJT-TN-PRESS-2026-904");
                handleLogin();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-body transition-colors"
            >
              <BadgeCheck size={14} />
              <span>
                {isArabic
                  ? "تسجيل دخول مباشر بحساب الصحفية المعتمدة (أميرة منصور)"
                  : "Quick Sign-In with Verified Journalist Profile (Amira Mansour)"}
              </span>
            </button>
          </div>

          {/* Security & Regulatory Compliance Footer */}
          <div className="p-3 rounded-2xl bg-cream/50 border border-border/60 text-2xs text-muted-foreground font-body space-y-1 text-center">
            <div className="flex items-center justify-center gap-1.5 text-foreground font-semibold">
              <ShieldCheck size={13} className="text-primary" />
              <span>{isArabic ? "حماية وتشفير عالي المستوى (TLS 1.3)" : "End-to-End Encrypted Session"}</span>
            </div>
            <p>
              {isArabic
                ? "متوافق مع المعايير التونسية للهيئة الوطنية لحماية المعطيات الشخصية (INPDP). لا يتم تخزين مفاتيح التشفير على خوادم خارجية."
                : "Compliant with Tunisian data protection standards (INPDP). No credentials or private tokens are stored on third-party servers."}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ========================================================================= */
  /* 2. Authenticated View: Active Threat Monitor & Telemetry Dashboard        */
  /* ========================================================================= */
  return (
    <div className="space-y-6">
      {/* Verified Account Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-border/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-heading font-bold text-sm">
            {isArabic ? "أم" : "AM"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm text-foreground">
                {isArabic ? "أميرة منصور" : "Amira Mansour"}
              </span>
              <span className="inline-flex items-center gap-1 text-2xs font-body font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                <BadgeCheck size={11} />
                {isArabic ? "معتمدة لدى النقابة (SNJT)" : "SNJT Verified Press"}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xs text-muted-foreground font-mono">
                ID: SNJT-TN-2026-904
              </span>
              <span className="text-2xs text-muted-foreground/60">•</span>
              <span className="text-2xs text-muted-foreground font-body">
                {isArabic ? "معرّف البلاغ: #INC-2026-0841" : "Incident: #INC-2026-0841"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-2xs font-heading font-semibold bg-cream text-foreground border border-border/70">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {isArabic ? "الرصد المباشر: متصل" : "Live Telemetry: Active"}
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-2xs font-body text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-border/60 transition-colors"
            title={isArabic ? "تسجيل الخروج" : "Sign Out"}
          >
            <LogOut size={12} />
            <span>{isArabic ? "خروج" : "Sign Out"}</span>
          </button>
        </div>
      </div>

      {/* Main Alert Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-secondary/30 bg-gradient-to-br from-secondary/10 via-cream/40 to-white p-5 sm:p-6 shadow-xs relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 border border-secondary/20 shadow-2xs">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-heading font-semibold bg-secondary/20 text-secondary mb-1">
                {isArabic ? "إنذار أمني استباقي" : "Early Warning Alert"}
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                {isArabic
                  ? "تم رصد نشاط غير معتاد في هذا المنشور"
                  : "We detected unusual activity in this post"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-body mt-1 max-w-2xl leading-relaxed">
                {isArabic
                  ? "تم رصد تسارع غير نمطي في التفاعل والوصول مصحوباً بنبرة عدائية ومحاولات استدراج لمعلومات شخصية عقب نشر المقال الاستقصائي."
                  : "Anomalous velocity spike, suspicious reach origin, and hostile comments attempting to crowdsource private contact details were detected."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-2xs font-heading px-3 py-1.5 rounded-xl bg-white/90 border border-border/60 text-muted-foreground shadow-2xs">
              {isArabic ? "المستوى: تحذير احترازي عاجل" : "Priority: Immediate Precautionary"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* The Monitored Post Card */}
      <div className="rounded-3xl border border-border/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-heading font-bold text-sm">
              {isArabic ? "أم" : "AM"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm text-foreground">
                  {isArabic ? "أميرة منصور" : "Amira Mansour"}
                </span>
                <span className="text-2xs font-body px-2 py-0.5 rounded-full bg-cream text-primary border border-primary/20">
                  {isArabic ? "صحفية استقصائية" : "Investigative Reporter"}
                </span>
              </div>
              <span className="text-2xs text-muted-foreground font-body flex items-center gap-1 mt-0.5">
                <Clock size={11} />
                {isArabic ? "منذ ساعتين • عام" : "2 hours ago • Public"}
              </span>
            </div>
          </div>

          <span className="text-2xs font-heading font-semibold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            {isArabic ? "تحت الرصد المباشر" : "Monitored Target"}
          </span>
        </div>

        <p className="text-sm sm:text-base text-foreground font-body leading-relaxed">
          {isArabic
            ? "تحقيقنا الميداني حول ملف النفايات والشفافية البيئية بجهة صفاقس: الوثائق والشهادات تكشف شبهات تجاوزات كبرى في صفقات التصرف بالنفايات وتلوث المياه الجوفية. الحق في بيئة سليمة وحق النفاذ للمعلومة مكفولان بالدستور. #تونس #استقصاء #بيئة"
            : "Our field investigation into municipal waste management & environmental transparency in Sfax: Documents and testimonies reveal serious suspicions of irregularities in waste contracts and groundwater pollution. The right to a clean environment and access to public info are constitutionally protected. #Tunisia #Investigation"}
        </p>

        <div className="flex items-center gap-5 pt-2 text-xs text-muted-foreground font-body border-t border-border/40">
          <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Heart size={14} /> 1.2k
          </span>
          <span className="flex items-center gap-1.5 text-secondary font-semibold">
            <MessageCircle size={14} /> 342 {isArabic ? "(ارتفاع مفاجئ)" : "(Anomalous spike)"}
          </span>
          <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Share2 size={14} /> 189
          </span>
        </div>
      </div>

      {/* The Anomaly Report (3 Core Metrics) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="font-heading text-sm font-bold text-foreground uppercase tracking-wide">
            {isArabic ? "تقرير الرصد والمؤشرات الرقمية (Telemetry Report)" : "Telemetry & Indicator Report"}
          </h4>
          <span className="text-2xs text-muted-foreground font-body">
            {isArabic ? "تحديث تلقائي: منذ دقيقة" : "Last updated: 1 min ago"}
          </span>
        </div>

        <div className="grid sm:grid-cols-3 gap-3.5">
          {/* Metric 1: Trending Velocity */}
          <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-2xs space-y-2 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <TrendingUp size={16} />
              </span>
              <span className="font-heading text-xs font-bold text-primary px-2 py-0.5 rounded-full bg-cream border border-border/60">
                +115%
              </span>
            </div>
            <h5 className="font-heading text-xs font-bold text-foreground">
              {isArabic ? "تسارع وتيرة التفاعل (Trending)" : "Trending Velocity"}
            </h5>
            <p className="font-body text-xs text-muted-foreground leading-relaxed">
              {isArabic
                ? "المنشور يسجل رواجاً أعلى بنسبة 115% عن المعدل المعتاد لحسابك خلال الـ 45 دقيقة الماضية."
                : "The post is trending 115% higher than your baseline velocity over the last 45 minutes."}
            </p>
          </div>

          {/* Metric 2: Suspicious Reach */}
          <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-2xs space-y-2 hover:border-secondary/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <Users size={16} />
              </span>
              <span className="font-heading text-xs font-bold text-secondary px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20">
                68% {isArabic ? "حسابات مشبوهة" : "Suspicious"}
              </span>
            </div>
            <h5 className="font-heading text-xs font-bold text-foreground">
              {isArabic ? "وصول مشبوه (Suspicious Reach)" : "Suspicious Reach Origin"}
            </h5>
            <p className="font-body text-xs text-muted-foreground leading-relaxed">
              {isArabic
                ? "تدفق غير اعتيادي من حسابات حديثة الإنشاء (أقل من 7 أيام) بدون متابعين، تتنقل بشكل منسق بين المنشورات."
                : "The post got an atypical reach spike driven by recently created accounts (<7 days old) with zero followers."}
            </p>
          </div>

          {/* Metric 3: Harmful Language */}
          <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-2xs space-y-2 hover:border-destructive/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
                <MessageSquareWarning size={16} />
              </span>
              <span className="font-heading text-xs font-bold text-destructive px-2 py-0.5 rounded-full bg-destructive/10 border border-destructive/20">
                31% {isArabic ? "محتوى عدائي" : "Harmful"}
              </span>
            </div>
            <h5 className="font-heading text-xs font-bold text-foreground">
              {isArabic ? "لغة عدائية واستدراج (Harmful Language)" : "Potentially Harmful Content"}
            </h5>
            <p className="font-body text-xs text-muted-foreground leading-relaxed">
              {isArabic
                ? "رصد تعليقات تحتوي على عبارات ترهيب، خطاب كراهية، وأسئلة تستدرج مقر عمل أو رقم هاتف الصحفية (Doxxing)."
                : "Some of the incoming language is labeled harmful: threats, intimidation, and attempts to crowdsource personal details."}
            </p>
          </div>
        </div>
      </div>

      {/* Flagged Comments Inspection Drawer */}
      <div className="rounded-3xl border border-border/80 bg-cream/35 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-secondary" />
            <span className="font-heading text-xs sm:text-sm font-bold text-foreground">
              {isArabic ? "عينات من التعليقات المرصودة" : "Sample Flagged Incoming Comments"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowFlaggedComments(!showFlaggedComments)}
            className="inline-flex items-center gap-1 text-2xs font-heading text-muted-foreground hover:text-foreground transition-colors"
          >
            {showFlaggedComments ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{showFlaggedComments ? (isArabic ? "إخفاء" : "Hide") : (isArabic ? "إظهار" : "Show")}</span>
          </button>
        </div>

        <AnimatePresence>
          {showFlaggedComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2.5 overflow-hidden pt-1"
            >
              {/* Comment 1 */}
              <div className="p-3 rounded-2xl bg-white border border-border/60 text-xs font-body flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-semibold text-foreground">user_938102</span>
                    <span className="text-2xs text-muted-foreground">منذ 24 دقيقة</span>
                  </div>
                  <p className="text-foreground/90">
                    "توا نشوفو شكون باش ينفعك توة يا باهية، نعرفو وين تخدم ونعرفو داركم..."
                  </p>
                </div>
                <span className="inline-flex items-center self-start sm:self-center px-2 py-0.5 rounded-full text-2xs font-heading font-semibold bg-destructive/10 text-destructive border border-destructive/20 shrink-0">
                  {isArabic ? "ترهيب وتهديد مباشر" : "Direct Intimidation"}
                </span>
              </div>

              {/* Comment 2 */}
              <div className="p-3 rounded-2xl bg-white border border-border/60 text-xs font-body flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-semibold text-foreground">khalil_tn_88</span>
                    <span className="text-2xs text-muted-foreground">منذ 38 دقيقة</span>
                  </div>
                  <p className="text-foreground/90">
                    "شكون عندو نومرو تليفونها ولا كرهبتها؟ هبطولنا المعطيات فايسبوكها ما فيه شي"
                  </p>
                </div>
                <span className="inline-flex items-center self-start sm:self-center px-2 py-0.5 rounded-full text-2xs font-heading font-semibold bg-secondary/15 text-secondary border border-secondary/20 shrink-0">
                  {isArabic ? "محاولة كشف بيانات شخصية (Doxxing)" : "Doxxing Attempt"}
                </span>
              </div>

              {/* Comment 3 */}
              <div className="p-3 rounded-2xl bg-white border border-border/60 text-xs font-body flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-semibold text-foreground">patriote_tunisie</span>
                    <span className="text-2xs text-muted-foreground">منذ 50 دقيقة</span>
                  </div>
                  <p className="text-foreground/90">
                    "أجندات أجنبية مشبوهة لتشويه المؤسسات الوطنية، لازم تتحاسب قانونياً..."
                  </p>
                </div>
                <span className="inline-flex items-center self-start sm:self-center px-2 py-0.5 rounded-full text-2xs font-heading font-semibold bg-primary/10 text-primary border border-primary/20 shrink-0">
                  {isArabic ? "تشويه سمعة منظم" : "Coordinated Discredit"}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contextual Analysis & Uncertainty Disclosure Box */}
      <div className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/5 via-cream/30 to-white p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <HelpCircle size={17} />
          </div>
          <div>
            <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">
              {isArabic ? "تحليل السياق وحدود اليقين (Context & Limits of Assessment)" : "Contextual Analysis & Uncertainty Limits"}
            </h4>
            <span className="text-2xs text-muted-foreground font-body">
              {isArabic ? "مبدأ النزاهة التقنية: المساعدة في اتخاذ القرار دون استنتاجات جازمة" : "Guiding informed decisions without overconfident claims"}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs font-body leading-relaxed pt-1">
          <div className="p-3.5 rounded-2xl bg-white/90 border border-border/70 space-y-1">
            <span className="font-heading font-bold text-foreground block text-xs">
              {isArabic ? "ما يمكن للمنظومة تأكيده (المعطيات المرصودة):" : "What the system can establish:"}
            </span>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 marker:text-primary">
              <li>{isArabic ? "ارتفاع غير نمطي في سرعة التفاعل وتدفق حسابات متزامنة." : "Anomalous velocity spike and synchronized account arrival."}</li>
              <li>{isArabic ? "وجود محاولات متكررة لجمع واستدراج بيانات شخصية حساسة." : "Pattern of inquiries seeking home address and phone contact."}</li>
              <li>{isArabic ? "تقديم كل هذه التوجيهات دون طلب أي بيانات شخصية منك." : "Initial guidance delivered without requiring private personal data."}</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/90 border border-border/70 space-y-1">
            <span className="font-heading font-bold text-foreground block text-xs">
              {isArabic ? "ما لا يمكن الجزم به آلياً (حدود اليقين):" : "What the system CANNOT conclude:"}
            </span>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 marker:text-secondary">
              <li>{isArabic ? "لا يمكن الجزم بأن الهجوم منسق مركزياً أو موجه من جهة معينة." : "Cannot definitively establish a centralized bot attack without forensic server logs."}</li>
              <li>{isArabic ? "تنبيه المنظومة هو إرشاد وقائي وليس تقريراً قضائياً قاطعاً." : "An alert is an advisory warning, not a verified legal judgment."}</li>
              <li>{isArabic ? "الأولوية هي حمايتك الشخصية وحفظ الأدلة بهدوء." : "Goal is empowering your safety while keeping you in full control."}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendations & Immediate Actions */}
      <div className="rounded-3xl border border-border/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">
              {isArabic ? "الخطوات والإجراءات الموصى بها (Recommended Actions)" : "Recommended Safety Actions"}
            </h4>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              {isArabic ? "إجراءات فورية للحد من الأثر وتأمين الفضاء الرقمي" : "Immediate steps to reduce exposure and protect accounts"}
            </p>
          </div>
          <span className="text-2xs font-heading font-semibold px-2.5 py-1 rounded-full bg-cream text-foreground border border-border/60">
            {isArabic ? "3 خطوات عملية" : "3 Practical Steps"}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Action 1: Limit Comments */}
          <button
            type="button"
            onClick={() => setCommentsLimited(!commentsLimited)}
            className={`flex flex-col justify-between p-4 rounded-2xl border text-start transition-all shadow-2xs group cursor-pointer ${
              commentsLimited
                ? "bg-primary/10 border-primary/40 text-foreground"
                : "bg-white border-border/80 hover:border-primary/40 hover:bg-cream/20"
            }`}
          >
            <div className="space-y-2">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                commentsLimited ? "bg-primary text-primary-foreground" : "bg-cream text-primary border border-border/60"
              }`}>
                {commentsLimited ? <CheckCircle2 size={16} /> : <Lock size={16} />}
              </span>
              <span className="font-heading text-xs font-bold block text-foreground">
                {isArabic ? "تقييد التعليقات" : "Limit Comments"}
              </span>
              <p className="font-body text-2xs text-muted-foreground leading-relaxed">
                {commentsLimited
                  ? (isArabic ? "تم تقييد التعليقات للأصدقاء وجهات الاتصال الموثوقة فقط." : "Comments limited to approved contacts only.")
                  : (isArabic ? "حصر التعليقات على المتابعين المعتمدين لقطع مسار الترهيب." : "Restrict comment permissions to halt spam and hostility.")}
              </p>
            </div>
            <span className={`mt-3 text-2xs font-heading font-semibold inline-flex items-center gap-1 ${
              commentsLimited ? "text-primary" : "text-foreground group-hover:text-primary"
            }`}>
              {commentsLimited ? (isArabic ? "✓ مفعّل الآن" : "✓ Active") : (isArabic ? "تفعيل التقييد ➔" : "Enable Limit ➔")}
            </span>
          </button>

          {/* Action 2: Report and Block */}
          <button
            type="button"
            onClick={() => setReportedBlocked(!reportedBlocked)}
            className={`flex flex-col justify-between p-4 rounded-2xl border text-start transition-all shadow-2xs group cursor-pointer ${
              reportedBlocked
                ? "bg-secondary/15 border-secondary/40 text-foreground"
                : "bg-white border-border/80 hover:border-secondary/40 hover:bg-cream/20"
            }`}
          >
            <div className="space-y-2">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                reportedBlocked ? "bg-secondary text-secondary-foreground" : "bg-cream text-secondary border border-border/60"
              }`}>
                {reportedBlocked ? <CheckCircle2 size={16} /> : <UserX size={16} />}
              </span>
              <span className="font-heading text-xs font-bold block text-foreground">
                {isArabic ? "إبلاغ وحظر الحسابات" : "Report & Block"}
              </span>
              <p className="font-body text-2xs text-muted-foreground leading-relaxed">
                {reportedBlocked
                  ? (isArabic ? "تم إبلاغ المنصة وحظر 14 حساباً متورطاً في التهديد." : "14 flagged hostile profiles reported & blocked.")
                  : (isArabic ? "حظر فوري للحسابات الـ 14 التي وجهت تهديدات صريحة." : "Batch block and report the 14 accounts issuing threats.")}
              </p>
            </div>
            <span className={`mt-3 text-2xs font-heading font-semibold inline-flex items-center gap-1 ${
              reportedBlocked ? "text-secondary" : "text-foreground group-hover:text-secondary"
            }`}>
              {reportedBlocked ? (isArabic ? "✓ تم الحظر والإبلاغ" : "✓ Accounts Blocked") : (isArabic ? "حظر الحسابات ➔" : "Block Profiles ➔")}
            </span>
          </button>

          {/* Action 3: Preserve Evidence */}
          <button
            type="button"
            onClick={() => setEvidenceModalOpen(true)}
            className="flex flex-col justify-between p-4 rounded-2xl border border-border/80 bg-white hover:border-foreground/30 hover:bg-cream/20 text-start transition-all shadow-2xs group cursor-pointer"
          >
            <div className="space-y-2">
              <span className="w-8 h-8 rounded-xl bg-cream text-foreground border border-border/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText size={16} />
              </span>
              <span className="font-heading text-xs font-bold block text-foreground">
                {isArabic ? "توثيق الأدلة وحفظها" : "Preserve Evidence"}
              </span>
              <p className="font-body text-2xs text-muted-foreground leading-relaxed">
                {isArabic
                  ? "تصدير محضر توثيق رقمي فوري يضم لقطات الشاشة، الروابط، وأرقام المعرفات."
                  : "Generate a timestamped evidence log with URLs and IDs for legal filing."}
              </p>
            </div>
            <span className="mt-3 text-2xs font-heading font-semibold text-foreground group-hover:text-primary inline-flex items-center gap-1">
              {isArabic ? "عرض ملف التوثيق ➔" : "View Evidence Log ➔"}
            </span>
          </button>

          {/* Action 4: Consult TanitBot */}
          <button
            type="button"
            onClick={() => onConsultTanitBot(journalistQuestion)}
            className="flex flex-col justify-between p-4 rounded-2xl border border-primary/50 bg-primary/10 hover:bg-primary/15 text-start transition-all shadow-2xs group cursor-pointer"
          >
            <div className="space-y-2">
              <span className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                <Bot size={16} />
              </span>
              <span className="font-heading text-xs font-bold block text-primary">
                {isArabic ? "استشارة تانيت بوت" : "Consult TanitBot"}
              </span>
              <p className="font-body text-2xs text-muted-foreground leading-relaxed">
                {isArabic
                  ? "انتقل إلى محادثة تانيت بوت مع تحميل هذا السياق لتلقي إرشاد قانوني وتقني فوري."
                  : "Switch to TanitBot Chat with this context pre-filled for direct legal & safety advice."}
              </p>
            </div>
            <span className="mt-3 text-2xs font-heading font-bold text-primary inline-flex items-center gap-1">
              {isArabic ? "بدء المحادثة الآن ➔" : "Ask TanitBot ➔"}
            </span>
          </button>
        </div>
      </div>

      {/* Evidence Log Modal */}
      <AnimatePresence>
        {evidenceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-white border border-border shadow-lg p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <FileText className="text-primary" size={18} />
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {isArabic ? "محضر توثيق الأدلة الرقمية (Evidence Sheet)" : "Timestamped Evidence Audit Sheet"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEvidenceModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-cream hover:bg-cream/80 flex items-center justify-center text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream/50 border border-border/60 text-2xs font-body space-y-2 text-foreground/80 leading-relaxed">
                <p>
                  <strong>{isArabic ? "المرجع القانوني التونسي:" : "Tunisian Legal Framework:"}</strong>{" "}
                  {isArabic
                    ? "القانون الأساسي عدد 58 لسنة 2017 ومجلة الاتصالات. الأدلة الرقمية المحفوظة مع التاريخ ورابط المعرّف مقبولة لدى الإدارة الفرعية للوقاية الاجتماعية / الشرطة العدلية."
                    : "Organic Law No. 58 of 2017 & Telecommunications Code. Preserved digital metadata with timestamps is admissible when filing complaints."}
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono bg-cream/20 p-3 rounded-2xl border border-border/40">
                <div className="text-muted-foreground">{isArabic ? "تاريخ الحفظ والتوثيق:" : "Timestamp:"} {new Date().toISOString()}</div>
                <div className="text-muted-foreground">{isArabic ? "رابط المنشور:" : "Post URL:"} https://social.tn/posts/84920491</div>
                <div className="text-muted-foreground">{isArabic ? "عدد التعليقات المؤرشفة:" : "Archived Comments:"} 14 Flagged Threats</div>
                <div className="text-muted-foreground">{isArabic ? "بصمة التوثيق الرقمية (SHA-256):" : "Integrity Hash (SHA-256):"} e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEvidenceModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-border text-xs font-heading hover:bg-cream/50 transition-colors cursor-pointer"
                >
                  {isArabic ? "إغلاق" : "Close"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(isArabic ? "تم تحميل ملف التوثيق المعتمد بصيغة PDF." : "Evidence dossier downloaded successfully.");
                    setEvidenceModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-heading hover:bg-primary/90 transition-colors shadow-2xs cursor-pointer"
                >
                  {isArabic ? "تحميل التقرير (PDF)" : "Download Dossier (PDF)"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
