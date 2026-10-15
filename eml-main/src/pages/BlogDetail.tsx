import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blogPosts";
import { ArrowLeft, Calendar, Clock, BookOpen, Video, FileText, Download, FileDown, Instagram, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import NotFound from "./NotFound";

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return <NotFound />;
  }

  const getPostIcon = (type: typeof post.type) => {
    switch (type) {
      case "article":
        return <BookOpen size={18} />;
      case "video":
        return <Video size={18} />;
      case "slides":
        return <FileText size={18} />;
    }
  };

  // Safe simple parser to render content blocks into HTML tags
  const renderContent = (text: string) => {
    return text.split("\n\n").map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={idx} className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">
            {trimmed.replace("### ", "")}
          </h3>
        );
      }

      if (trimmed.startsWith("- ")) {
        const items = trimmed.split("\n").map((item) => item.replace("- ", "").trim());
        return (
          <ul key={idx} className="list-disc pl-5 rtl:pr-5 rtl:pl-0 space-y-2 mb-6 font-body text-foreground/80 leading-relaxed">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      }

      if (trimmed.startsWith("1. ")) {
        const items = trimmed.split("\n").map((item) => item.replace(/^\d+\.\s+/, "").trim());
        return (
          <ol key={idx} className="list-decimal pl-5 rtl:pr-5 rtl:pl-0 space-y-2 mb-6 font-body text-foreground/80 leading-relaxed">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        );
      }

      return (
        <p key={idx} className="font-body text-foreground/80 text-base md:text-lg leading-relaxed mb-6">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-32 pb-20 min-h-screen relative overflow-hidden bg-gradient-to-b from-transparent to-primary/5">
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -z-10" />

        <div className="container max-w-4xl px-4 mx-auto relative z-10">
          {/* Back Button */}
          <div className="mb-8 text-start">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-primary font-heading font-semibold hover:opacity-85 transition-opacity"
            >
              <ArrowLeft size={16} className={isArabic ? "rotate-180" : ""} />
              <span>{t("blogPage.backToBlog")}</span>
            </Link>
          </div>

          <article className="bg-cream/90 backdrop-blur-md border border-border/80 rounded-3xl p-6 md:p-12 shadow-xl">
            {/* Category / Type Badge */}
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider mb-6">
              {getPostIcon(post.type)}
              <span>{isArabic ? post.categoryAr : post.category}</span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground font-extrabold leading-tight text-start mb-6">
              {isArabic ? post.titleAr : post.title}
            </h1>

            {/* Meta details */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-body pb-8 border-b border-border/50 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-heading text-primary font-semibold text-xs">
                  {(isArabic ? post.authorAr : post.author).charAt(0)}
                </div>
                <span className="font-medium text-foreground/80">
                  {isArabic ? post.authorAr : post.author}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={15} />
                <span>{isArabic ? post.dateAr : post.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={15} />
                <span>
                  {post.readTime} {post.type === "video" ? t("blogPage.watchTime") : t("blogPage.readTime")}
                </span>
              </div>
            </div>

            {/* Featured Cover Image (For non-video posts) */}
            {post.type !== "video" && post.coverImage && (
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-border/50 mb-10 max-h-[500px]">
                <img
                  src={post.coverImage}
                  alt={isArabic ? post.titleAr : post.title}
                  className="w-full h-full object-cover max-h-[500px]"
                />
              </div>
            )}

            {/* Video Player (If post is a video) */}
            {post.type === "video" && post.videoUrl && (
              <div className="relative rounded-3xl overflow-hidden aspect-video shadow-lg bg-black border border-border/50 mb-10">
                <video src={post.videoUrl} className="w-full h-full object-cover" controls playsInline poster={post.coverImage} />
              </div>
            )}

            {/* Body Content */}
            <div className="prose prose-neutral max-w-none text-start text-foreground/90 font-body">
              {renderContent(isArabic ? post.contentAr : post.content)}
            </div>

            {/* Instagram Post Link Banner */}
            {post.instagramUrl && (
              <div className="mt-12 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-primary/10 rounded-3xl border border-pink-500/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-start">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Instagram size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {isArabic ? "اقرأ هذا المنشور على إنستغرام" : "View original post on Instagram"}
                    </h3>
                    <p className="font-body text-xs text-muted-foreground">
                      {isArabic ? "انضم إلى النقاش وتفاعل مع المنشور الأصلي على حسابنا الرسمي" : "Join the conversation and view the official post on Instagram"}
                    </p>
                  </div>
                </div>
                <a
                  href={post.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-heading text-xs md:text-sm px-6 py-3.5 rounded-full transition-all shadow-md shrink-0 active:scale-95 cursor-pointer"
                >
                  <Instagram size={16} />
                  <span>{t("blogPage.viewOnInstagram")}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            {/* Slides / PDF Download Box (If post is slides) */}
            {post.type === "slides" && post.pdfUrl && (
              <div className="mt-12 bg-primary/5 rounded-3xl border border-primary/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-start">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <FileDown size={30} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {isArabic ? "ملف العرض التقديمي (PDF)" : "Presentation Slides (PDF)"}
                    </h3>
                    <p className="font-body text-xs text-muted-foreground">
                      {isArabic ? "قم بتحميل الأوراق البحثية والشرائح الكاملة" : "Download the complete research paper and slide deck"}
                    </p>
                  </div>
                </div>
                <a
                  href={post.pdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/95 font-heading text-sm px-6 py-3.5 rounded-full transition-all shadow-md shrink-0 active:scale-95 cursor-pointer"
                >
                  <Download size={16} />
                  <span>{t("blogPage.downloadSlides")}</span>
                </a>
              </div>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
