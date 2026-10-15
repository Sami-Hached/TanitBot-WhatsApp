import { Camera, CalendarDays, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PastProject = {
  id: string;
  title: string;
  category: string;
  color: string;
  year: string;
  location: string;
  period?: string;
  collaborators?: string;
  mediaNote?: string;
  description: string;
  highlights: string[];
  coverImage?: string;
};

type PastProjectDetailsModalProps = {
  project: PastProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const PastProjectDetailsModal = ({ project, open, onOpenChange }: PastProjectDetailsModalProps) => {
  const { t, i18n } = useTranslation();
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border bg-cream p-0 sm:rounded-2xl overflow-hidden [&>button]:bg-white/20 [&>button]:backdrop-blur-md [&>button]:text-white [&>button]:hover:bg-white/40 [&>button]:border [&>button]:border-white/20 [&>button]:rounded-full [&>button]:p-1.5 [&>button]:right-4 [&>button]:top-4 [&>button]:transition-all max-h-[90vh] flex flex-col">
        <div className="relative h-48 md:h-64 w-full flex-shrink-0 overflow-hidden">
          {project.coverImage ? (
            <img 
              src={project.coverImage} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full ${project.color}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 md:bottom-6 md:left-8 z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 text-[11px] uppercase tracking-wider font-heading text-white">
              <Camera size={14} />
              {project.category}
            </span>
            <h3 className="font-heading text-xl md:text-2xl mt-2 text-white drop-shadow-lg">{project.title}</h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <DialogHeader className="px-6 pt-6 md:px-8">
            <DialogTitle className="sr-only">{project.title}</DialogTitle>
            <DialogDescription className="sr-only">
              {t("projectsPage.modalOverviewPrefix")} {project.title}.
            </DialogDescription>
            <div className="flex flex-wrap gap-3 text-[11px] font-heading">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-primary">
                <CalendarDays size={14} />
                {project.period ?? project.year}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1 text-foreground">
                <MapPin size={14} />
                {project.location}
              </span>
              {project.collaborators && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-aqua/20 px-3 py-1 text-foreground">
                  {project.collaborators}
                </span>
              )}
            </div>
          </DialogHeader>

          <div className="px-6 pb-7 md:px-8 md:pb-8">
            <p className="font-body text-muted-foreground leading-relaxed mt-4 text-sm md:text-base whitespace-pre-line">
              {project.description}
            </p>

            <div className="mt-6">
              <h4 className="font-heading text-foreground text-sm mb-3 inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-secondary" />
                {t("projectsPage.modalOutcomes")}
              </h4>
              <ul className="space-y-2">
                {project.highlights.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-border bg-background/70 px-4 py-2.5 text-xs md:text-sm text-foreground font-body"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                to={`/projects/${project.id}`}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-heading text-xs md:text-sm px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
              >
                {i18n.language === "ar" ? "عرض التفاصيل والصور" : "View Details & Photos"}
                <ArrowRight size={16} className={i18n.language === "ar" ? "rotate-180" : ""} />
              </Link>
            </div>

            {project.mediaNote && (
              <p className="mt-5 text-[11px] text-muted-foreground font-body bg-primary/5 border border-border rounded-xl px-4 py-3">
                {project.mediaNote}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PastProjectDetailsModal;
