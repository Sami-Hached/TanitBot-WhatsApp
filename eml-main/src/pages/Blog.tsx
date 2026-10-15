import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts, BlogPost } from "@/data/blogPosts";
import { Search, BookOpen, Video, FileText, Calendar, Clock, ArrowRight, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Blog() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "article" | "video" | "slides">("all");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.titleAr.includes(searchQuery) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerptAr.includes(searchQuery) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.categoryAr.includes(searchQuery);

    const matchesCategory = activeCategory === "all" || post.type === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const getPostIcon = (type: BlogPost["type"]) => {
    switch (type) {
      case "article":
        return <BookOpen size={16} />;
      case "video":
        return <Video size={16} />;
      case "slides":
        return <FileText size={16} />;
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-32 pb-20 min-h-screen relative overflow-hidden bg-gradient-to-b from-transparent to-primary/5">
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="container max-w-6xl px-4 mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-heading text-foreground mb-4"
            >
              {t("blogPage.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-muted-foreground font-body text-base md:text-lg max-w-xl mx-auto"
            >
              {t("blogPage.subtitle")}
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-1 bg-primary mx-auto rounded-full mt-6"
            />
          </div>

          {/* Search and Category Filters */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12 bg-cream border border-border/80 rounded-2xl p-4 shadow-sm">
            {/* Search Input */}
            <div className="relative w-full md:max-w-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("blogPage.searchPlaceholder")}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-cream font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-start"
              />
              <Search className={`absolute ${isArabic ? 'left-3' : 'left-3'} top-1/2 -translate-y-1/2 text-muted-foreground`} size={18} />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {(["all", "article", "video", "slides"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs font-heading rounded-full transition-all border ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-cream border-border text-foreground hover:bg-primary/5 hover:border-primary/20"
                  }`}
                >
                  {cat === "all" && t("blogPage.all")}
                  {cat === "article" && t("blogPage.articles")}
                  {cat === "video" && t("blogPage.videos")}
                  {cat === "slides" && t("blogPage.presentations")}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Post Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="group flex flex-col h-full bg-cream border border-border/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <Link to={`/blog/${post.id}`} className="block relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={post.coverImage}
                      alt={isArabic ? post.titleAr : post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-primary/95 text-primary-foreground flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading shadow-md">
                      {getPostIcon(post.type)}
                      <span className="uppercase tracking-wider">
                        {isArabic ? post.categoryAr : post.category}
                      </span>
                    </div>
                    {post.instagramUrl && (
                      <a
                        href={post.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title={isArabic ? "عرض على إنستغرام" : "View on Instagram"}
                        className="absolute top-4 right-4 bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 text-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                      >
                        <Instagram size={14} />
                      </a>
                    )}
                  </Link>

                  {/* Body */}
                  <div className="flex-1 p-6 flex flex-col justify-between text-start">
                    <div>
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-body mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {isArabic ? post.dateAr : post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          {post.readTime} {post.type === "video" ? t("blogPage.watchTime") : t("blogPage.readTime")}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-lg text-foreground font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        <Link to={`/blog/${post.id}`}>
                          {isArabic ? post.titleAr : post.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      <p className="font-body text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                        {isArabic ? post.excerptAr : post.excerpt}
                      </p>
                    </div>

                    {/* Footer / Read More */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
                      <span className="font-heading text-xs text-foreground/60">
                        {isArabic ? post.authorAr : post.author}
                      </span>
                      <Link
                        to={`/blog/${post.id}`}
                        className="inline-flex items-center gap-1.5 text-xs text-primary font-heading font-semibold group/link"
                      >
                        {isArabic ? "اقرأ المزيد" : "Read More"}
                        <ArrowRight size={14} className={`transition-transform ${isArabic ? 'rotate-180 group-hover/link:-translate-x-1' : 'group-hover/link:translate-x-1'}`} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-cream border border-border/80 rounded-2xl p-8"
            >
              <p className="font-heading text-lg text-muted-foreground">
                {t("blogPage.noResults")}
              </p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
