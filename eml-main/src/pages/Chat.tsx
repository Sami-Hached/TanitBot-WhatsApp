import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThreatMonitor from "@/components/ThreatMonitor";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Square,
  RotateCcw,
  Copy,
  Check,
  ShieldAlert,
  Lock,
  BookOpen,
  ArrowRight,
  Shield,
  HelpCircle,
  FileCheck,
  Bot,
} from "lucide-react";
import avatarImg from "@/assets/tanitbot-avatar.png";

type ChatRole = "user" | "assistant";

interface Message {
  id: string;
  role: ChatRole;
  content: string;
}

interface ChatProps {
  defaultTab?: "chat" | "monitor";
}

export default function Chat({ defaultTab = "chat" }: ChatProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTabState] = useState<"chat" | "monitor">(
    tabParam === "monitor" || defaultTab === "monitor" ? "monitor" : "chat"
  );

  const handleTabChange = (tab: "chat" | "monitor") => {
    setActiveTabState(tab);
    setSearchParams({ tab });
  };

  const handleConsultTanitBot = (presetPrompt: string) => {
    handleTabChange("chat");
    setInput(presetPrompt);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 150);
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load chat history from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("tanitbot_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
  }, []);

  // Save chat history to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("tanitbot_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll on new tokens
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isStreaming]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    sessionStorage.removeItem("tanitbot_chat_history");
    setInput("");
    textareaRef.current?.focus();
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
  };

  const sendMessage = async (text: string) => {
    const query = text.trim();
    if (!query || isStreaming) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setIsStreaming(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const apiUrl = (import.meta as any).env?.VITE_CHAT_API_URL || "/api/chat";

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        signal: abortController.signal,
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          lang: isArabic ? "ar" : "en",
          stream: true,
        }),
      });

      if (!res.ok) {
        let errDetail = "";
        try {
          const errJson = await res.json();
          errDetail = errJson.error || "";
        } catch {
          // ignore
        }
        throw new Error(errDetail || `Server returned error ${res.status}`);
      }

      if (!res.body) throw new Error("No response body received");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullText = "";
      let sseBuffer = "";
      const isSSE = res.headers.get("content-type")?.includes("text/event-stream") ?? false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // If content-type is SSE or chunk contains data frames
        if (isSSE || chunk.includes("data:")) {
          sseBuffer += chunk;
          let sep: number;
          while ((sep = sseBuffer.indexOf("\n\n")) !== -1) {
            const frame = sseBuffer.slice(0, sep);
            sseBuffer = sseBuffer.slice(sep + 2);

            const dataLine = frame.split("\n").find((l) => l.startsWith("data:"));
            if (!dataLine) continue;

            const rawJson = dataLine.slice(5).trim();
            if (!rawJson) continue;

            try {
              const event = JSON.parse(rawJson);
              if (event.delta) {
                fullText += event.delta;
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
                );
              }
              if (event.error) {
                fullText = (fullText ? fullText + "\n\n" : "") + `⚠️ ${event.error}`;
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
                );
              }
              if (event.done) break;
            } catch {
              fullText += rawJson;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
              );
            }
          }
        } else {
          // Direct plain-text stream
          fullText += chunk;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
          );
        }
      }

      // If stream ended without any text or error
      if (!fullText.trim()) {
        const emptyMsg = isArabic
          ? "لم يتم استلام أي إجابة من الخادم. يرجى التحقق من إعدادات الاتصال."
          : "No response was received from the server. Please check the backend connection.";
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: emptyMsg } : m))
        );
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Chat error:", err);
        const errMsg = err?.message || (isArabic
          ? "عذراً، تعذر الاتصال بالخادم في الوقت الحالي. يرجى إعادة المحاولة."
          : "Sorry, unable to connect to the server right now. Please try again.");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: m.content || errMsg,
                }
              : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Helper to format citations: [المصدر: ...، صفحة X] and bold **text**
  const renderFormattedContent = (content: string) => {
    if (!content) return null;

    // Helper to format inline bold text (**text**)
    const renderInlineBold = (text: string) => {
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((seg, i) => {
        if (seg.startsWith("**") && seg.endsWith("**")) {
          return (
            <strong key={i} className="font-bold text-foreground">
              {seg.slice(2, -2)}
            </strong>
          );
        }
        return seg;
      });
    };

    // Split text by citations
    const citationRegex = /\[(المصدر:[^\]]+)\]/g;
    const parts = content.split(citationRegex);

    return parts.map((part, index) => {
      if (part.startsWith("المصدر:")) {
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1.5 px-3 py-1 my-1 mx-0.5 rounded-lg bg-lime/20 text-jungle font-semibold text-xs border border-lime/40 align-middle shadow-xs"
          >
            <BookOpen size={13} className="text-primary shrink-0" />
            <span>{part}</span>
          </span>
        );
      }

      // Format bold markdown **text** and bullet lines
      const lines = part.split("\n");
      return (
        <span key={index}>
          {lines.map((line, lineIdx) => {
            const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-");
            return (
              <span key={lineIdx} className={isBullet ? "block my-1 ps-2" : "inline"}>
                {renderInlineBold(line)}
                {lineIdx < lines.length - 1 && <br />}
              </span>
            );
          })}
        </span>
      );
    });
  };

  const topicPrompts = (t("chatPage.topics", { returnObjects: true }) as Array<{
    title: string;
    desc: string;
    query: string;
  }>) || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header Title & Intro */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-xl mx-auto mb-8 space-y-3"
          >
            <div className="flex justify-center mb-2">
              <img
                src={avatarImg}
                alt="TanitBot"
                className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-sm transition-transform hover:scale-105 duration-300"
              />
            </div>

            <h1 className="font-heading text-3xl md:text-4xl text-foreground font-bold tracking-tight">
              {t("chatPage.title") || (isArabic ? "تانيت بوت" : "TanitBot")}
            </h1>

            <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed">
              {t("chatPage.subtitle") ||
                (isArabic
                  ? "دليلك الآمن والموثوق للأمان الرقمي ومكافحة الابتزاز والخصوصية في تونس بالدارجة والعربية."
                  : "Confidential guidance on digital safety, online harassment, and account security in Tunisia.")}
            </p>

            <div className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground/85 font-body bg-cream/70 border border-border/60 px-3.5 py-1 rounded-full">
              <Lock size={12} className="text-primary/80" />
              <span>{t("chatPage.anonymousNotice") || (isArabic ? "فضاء آمن وخاص 100%" : "100% Anonymous & Confidential")}</span>
            </div>
          </motion.div>

          {/* Mode Switcher Tabs */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center p-1.5 rounded-full bg-cream/80 border border-border/80 shadow-2xs gap-1.5">
              <button
                type="button"
                onClick={() => handleTabChange("chat")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-heading text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "chat"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/60"
                }`}
              >
                <Bot size={15} />
                <span>{isArabic ? "المساعد الذكي (TanitBot)" : "TanitBot Assistant"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("monitor")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-heading text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "monitor"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/60"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                <ShieldAlert size={15} />
                <span>{isArabic ? "رصد الأنشطة المشبوهة" : "Threat Monitor"}</span>
              </button>
            </div>
          </div>

          {activeTab === "monitor" ? (
            <ThreatMonitor onConsultTanitBot={handleConsultTanitBot} />
          ) : (
            /* Main Chat Interface Card */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl border border-border/80 bg-white shadow-xs overflow-hidden flex flex-col h-[640px] md:h-[660px] relative"
            >
            {/* Card Header Bar */}
            <header className="flex items-center justify-between border-b border-border/60 bg-cream/35 backdrop-blur px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-border/60 bg-white p-1 shadow-2xs shrink-0 flex items-center justify-center">
                  <img src={avatarImg} alt="TanitBot" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="font-heading text-sm font-semibold text-foreground leading-none">
                    {isArabic ? "تانيت بوت" : "TanitBot"}
                  </h2>
                </div>
              </div>

              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body text-muted-foreground hover:text-foreground hover:bg-cream/70 transition-colors"
                  title={t("chatPage.clear") || (isArabic ? "محادثة جديدة" : "New Chat")}
                >
                  <RotateCcw size={12} />
                  <span>{t("chatPage.clear") || (isArabic ? "محادثة جديدة" : "New Chat")}</span>
                </button>
              )}
            </header>

            {/* Chat Messages Viewport */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-cream/15">
              {messages.length === 0 ? (
                /* Empty state: Clean greeting & Quick Topics */
                <div className="max-w-xl mx-auto py-6 space-y-5 text-center sm:text-start">
                  <div className="p-4 sm:p-5 rounded-2xl bg-cream/50 border border-border/60 text-start">
                    <h3 className="font-heading text-sm sm:text-base font-bold text-foreground mb-1">
                      {isArabic ? "أهلاً بيك! كيفاش نجم نعاونك اليوم؟" : "Hello! How can I assist you today?"}
                    </h3>
                    <p className="text-muted-foreground font-body text-xs sm:text-sm leading-relaxed">
                      {isArabic
                        ? "نجم نجاوبك على أسئلتك حول كيفية حماية حساباتك، التصرف عند التعرض للابتزاز أو التهديد الإلكتروني، وكيفية تقديم شكاية قانونية في تونس."
                        : "Ask questions on securing your accounts, handling extortion or suspicious links, and legal remedies in Tunisia."}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-heading font-semibold uppercase tracking-wider text-muted-foreground mb-2.5 px-1">
                      {t("chatPage.topicsTitle") || (isArabic ? "أسئلة شائعة" : "Suggested Questions")}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {topicPrompts.map((topic, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => sendMessage(topic.query)}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white border border-border/70 hover:border-primary/40 hover:bg-cream/30 transition-all text-start group shadow-2xs"
                        >
                          <span className="w-7 h-7 rounded-lg bg-cream flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform border border-border/40">
                            {idx === 0 && <ShieldAlert size={14} className="text-secondary" />}
                            {idx === 1 && <Lock size={14} className="text-primary" />}
                            {idx === 2 && <FileCheck size={14} className="text-foreground" />}
                            {idx === 3 && <HelpCircle size={14} className="text-primary" />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="block font-heading text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                              {topic.title}
                            </span>
                            <span className="block font-body text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {topic.desc}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Message History */
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-2.5 items-start ${
                      m.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-heading text-xs font-bold shadow-2xs ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-white border border-border/70 text-foreground overflow-hidden p-0.5"
                      }`}
                    >
                      {m.role === "user" ? (
                        isArabic ? "أنت" : "You"
                      ) : (
                        <img src={avatarImg} alt="Bot" className="w-full h-full object-contain" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`relative group max-w-[85%] sm:max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed font-body shadow-2xs ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-xs"
                          : "bg-white border border-border/70 text-foreground rounded-tl-xs"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {renderFormattedContent(m.content)}
                        {m.role === "assistant" && !m.content && isStreaming && (
                          <span className="inline-flex items-center gap-1.5 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                          </span>
                        )}
                      </div>

                      {/* Clean Message Actions: Copy only */}
                      {m.role === "assistant" && m.content && (
                        <div className="mt-2 pt-1.5 border-t border-border/30 flex items-center justify-end text-xs text-muted-foreground">
                          <button
                            type="button"
                            onClick={() => handleCopy(m.id, m.content)}
                            className="inline-flex items-center gap-1 hover:text-primary transition-colors py-0.5 px-1.5 rounded-md hover:bg-cream/60"
                            title={t("chatPage.copy") || (isArabic ? "نسخ" : "Copy")}
                          >
                            {copiedId === m.id ? (
                              <>
                                <Check size={12} className="text-primary" />
                                <span className="text-primary font-medium text-[11px]">
                                  {t("chatPage.copied") || (isArabic ? "تم النسخ" : "Copied!")}
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span className="text-[11px]">{t("chatPage.copy") || (isArabic ? "نسخ" : "Copy")}</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Form Footer */}
            <footer className="border-t border-border/60 bg-white p-3.5 sm:p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-end gap-2 max-w-3xl mx-auto"
              >
                <div className="flex-1 bg-cream/30 border border-border/70 focus-within:border-primary/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 rounded-2xl px-3.5 py-2 transition-all">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      t("chatPage.inputPlaceholder") ||
                      (isArabic ? "اكتب سؤالك بالدارجة التونسية أو العربية..." : "Ask your digital safety question...")
                    }
                    className="w-full bg-transparent resize-none outline-none font-body text-sm text-foreground placeholder:text-muted-foreground/60 max-h-32"
                  />
                </div>

                {isStreaming ? (
                  <button
                    type="button"
                    onClick={handleStop}
                    className="h-10 w-10 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center justify-center shrink-0 transition-colors shadow-2xs"
                    title={t("chatPage.stop") || (isArabic ? "إيقاف" : "Stop")}
                  >
                    <Square size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="h-10 w-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shrink-0 transition-colors shadow-2xs"
                    title={t("chatPage.send") || (isArabic ? "إرسال" : "Send")}
                  >
                    <Send size={15} className={isArabic ? "rotate-180" : ""} />
                  </button>
                )}
              </form>

              <div className="text-center mt-2.5 text-[11px] text-muted-foreground/70 font-body max-w-xl mx-auto">
                {t("chatPage.disclaimer") ||
                  (isArabic
                    ? "تانيت بوت مساعد استرشادي للأمان الرقمي. في حالات الطوارئ القصوى اتصل بالسلطات المختصة."
                    : "TanitBot provides guidance grounded in digital safety documents. In emergencies, please contact competent authorities.")}
              </div>
            </footer>
          </motion.div>
        )}
      </div>
      </main>

      <Footer />
    </div>
  );
}
