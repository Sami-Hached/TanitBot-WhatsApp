import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "motion/react";
import { Upload, FileText, CheckCircle, AlertCircle, X, Mail, User, HelpCircle, MessageSquare } from "lucide-react";

export default function Contact() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    message: "",
  });

  const [attachment, setAttachment] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // File size limit (20MB in bytes)
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const extension = file.name.split(".").pop()?.toLowerCase();
    const isJpgOrPdf = extension === "jpg" || extension === "jpeg" || extension === "pdf";

    if (!isJpgOrPdf) {
      setErrorMsg(t("contactPage.errorType"));
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg(t("contactPage.errorSize"));
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setAttachment(file);
  };

  const handleRemoveFile = () => {
    setAttachment(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name || !formData.email || !formData.reason || !formData.message) {
      return;
    }

    setIsSubmitting(true);

    try {
      let attachmentData = "";
      let attachmentName = "";
      let attachmentMimeType = "";

      if (attachment) {
        attachmentData = await fileToBase64(attachment);
        attachmentName = attachment.name;
        attachmentMimeType = attachment.type;
      }

      const payload = {
        ...formData,
        attachmentData,
        attachmentName,
        attachmentMimeType,
      };

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzkMtYfd6hu1m50-y-Qk8W2TgwNhxbepZLZ1oB81W1YQBj7atjpPiqm8qZYoqncNaIieg/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          reason: "",
          message: "",
        });
        setAttachment(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        throw new Error(result.message || "Failed to submit form");
      }
    } catch (err: any) {
      console.error("Form submission error:", err);
      setErrorMsg(
        isArabic
          ? "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى لاحقاً."
          : "An error occurred while sending the message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-32 pb-20 min-h-screen relative overflow-hidden bg-gradient-to-b from-transparent to-primary/5">
        {/* Visual Background Elements */}
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-aqua/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-blush/10 rounded-full blur-3xl -z-10" />

        <div className="container max-w-4xl px-4 mx-auto relative z-10">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-heading text-foreground mb-4"
            >
              {t("contactPage.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-muted-foreground font-body text-base md:text-lg max-w-xl mx-auto"
            >
              {t("contactPage.subtitle")}
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-1 bg-secondary mx-auto rounded-full mt-6 origin-center"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="bg-cream/80 backdrop-blur-md border border-border/80 rounded-3xl p-8 md:p-12 shadow-xl"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-12 flex flex-col items-center justify-center"
                >
                  <div className="w-20 h-20 bg-wattle/25 rounded-full flex items-center justify-center mb-6 text-primary">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-4">
                    {t("contactPage.successTitle")}
                  </h2>
                  <p className="text-muted-foreground font-body text-base max-w-md mb-8">
                    {t("contactPage.successBody")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="bg-primary text-primary-foreground font-heading text-sm px-8 py-3 rounded-full hover:bg-primary/95 transition-all active:scale-95 shadow-md"
                  >
                    {isArabic ? "إرسال رسالة أخرى" : "Send Another Message"}
                  </button>
                </motion.div>
              ) : (
                <form key="contact-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
                        <User size={16} className="text-primary" />
                        {t("contactPage.fullName")}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-cream font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        placeholder={t("contactPage.fullNamePlaceholder")}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
                        <Mail size={16} className="text-primary" />
                        {t("contactPage.email")}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-cream font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-start"
                        placeholder={t("contactPage.emailPlaceholder")}
                      />
                    </div>
                  </div>

                  {/* Reason for Contact */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
                      <HelpCircle size={16} className="text-primary" />
                      {t("contactPage.reason")}
                    </label>
                    <select
                      required
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-cream font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer"
                    >
                      <option value="">{t("contactPage.selectReason")}</option>
                      <option value="general">{t("contactPage.reasonOptions.general")}</option>
                      <option value="collaboration">{t("contactPage.reasonOptions.collaboration")}</option>
                      <option value="participation">{t("contactPage.reasonOptions.participation")}</option>
                      <option value="spontaneous">{t("contactPage.reasonOptions.spontaneous")}</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
                      <MessageSquare size={16} className="text-primary" />
                      {t("contactPage.message")}
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-cream font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all"
                      placeholder={t("contactPage.messagePlaceholder")}
                    />
                  </div>

                  {/* File Upload Attachment */}
                  <div className="space-y-2">
                    <label className="font-heading text-sm font-semibold text-foreground block">
                      {t("contactPage.attachments")}
                    </label>
                    
                    <div className="relative border-2 border-dashed border-border/80 hover:border-primary/50 rounded-2xl p-6 transition-all bg-cream/40 flex flex-col items-center justify-center text-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                      <p className="font-heading text-sm text-foreground/80 mb-1">
                        {isArabic ? "اضغط لرفع ملف أو اسحبه هنا" : "Click to upload a file or drag & drop"}
                      </p>
                      <p className="font-body text-xs text-muted-foreground">
                        {t("contactPage.attachmentsHelp")}
                      </p>
                    </div>

                    {/* Show Selected File Details */}
                    {attachment && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 border border-border bg-white rounded-xl mt-3 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="text-primary" size={24} />
                          <div className="text-start">
                            <p className="font-heading text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-xs">
                              {attachment.name}
                            </p>
                            <p className="font-body text-xs text-muted-foreground">
                              {(attachment.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-muted hover:bg-destructive/10 hover:text-destructive transition-colors"
                          aria-label="Remove attachment"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    )}

                    {/* File Error Messages */}
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-destructive font-body text-xs mt-2"
                      >
                        <AlertCircle size={14} />
                        <span>{errorMsg}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-primary-foreground font-heading text-sm py-4 rounded-full hover:bg-primary/95 transition-all shadow-md active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                          <span>{t("contactPage.submitting")}</span>
                        </>
                      ) : (
                        <span>{t("contactPage.submit")}</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
