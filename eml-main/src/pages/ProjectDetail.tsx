import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { ArrowLeft, CalendarDays, MapPin, Users, Camera, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Use Vite's import.meta.glob to dynamically import all images from the assets folders
const bridgingGapsImages = import.meta.glob("@/assets/bridging-gaps/*.{JPG,jpg,png,jpeg}", { eager: true, import: 'default' });
const springWorkshopImages = import.meta.glob("@/assets/spring-workshop/*.{JPG,jpg,png,jpeg}", { eager: true, import: 'default' });
const antiXenophobicImages = import.meta.glob("@/assets/anti-xenophobic/*.{JPG,jpg,png,jpeg}", { eager: true, import: 'default' });

const projectGalleries: Record<string, string[]> = {
  "bridging-gaps": Object.values(bridgingGapsImages) as string[],
  "spring-workshop": Object.values(springWorkshopImages) as string[],
  "anti-xenophobic": Object.values(antiXenophobicImages) as string[],
};

const ProjectDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const projects = isArabic
    ? [
        {
          id: "bridging-gaps",
          title: "ردم الفجوة في الإعلام العربي",
          category: "مائدة مستديرة",
          color: "bg-primary",
          year: "2023",
          period: "أبريل 2023",
          location: "بيروت، لبنان",
          collaborators: "AUB / LAU / AP / الجزيرة",
          description:
            "جمعنا 25 طالباً من الجامعة الأمريكية في بيروت والجامعة اللبنانية الأمريكية مع صحفيين من مؤسسات إقليمية ودولية رائدة، بما في ذلك وكالة أسوشيتد برس، والجزيرة، ولوريان لو جور.\n\nخلقت هذه المائدة المستديرة مساحة نادرة للتبادل المفتوح بين منتجي الأخبار ومستهلكيها. واستكشف المشاركون معاً كيفية تغير المشهد الإعلامي في منطقة الشرق الأوسط وشمال إفريقيا، لا سيما الانقسام الجيلي المتزايد في كيفية الوصول إلى الأخبار وتفسيرها والثقة بها.\n\nتفاعل الطلاب مباشرة مع المفاهيم الأساسية مثل وضع الأجندة، والتأطير، والتربية الإعلامية النقدية. وفي الوقت نفسه، اكتسب الصحفيون رؤية مباشرة حول العادات الرقمية للجيل Z واعتمادهم على المنصات الاجتماعية الناشئة.\n\nكما تناول النقاش العواقب الأوسع لاضطراب المعلومات، مسلطاً الضوء على آثاره المتتالية على الحريات المدنية والسياسية في المنطقة. واختتمت الجلسة بمجموعة من الأفكار المشتركة والتوصيات العملية لردم هذه الفجوات للمضي قدماً.",
          highlights: [
            "نقاش معمق حول صناعة الأجندة والتأطير والقراءة النقدية للإعلام",
            "رصد عادات الجيل الرقمي والمنصات الصاعدة في تلقي الأخبار",
            "توصيات عملية لردم الفجوة بين غرف الأخبار والجمهور الشاب",
          ],
        },
        {
          id: "spring-workshop",
          title: "ورشة Media Spring",
          category: "تدريب عملي",
          color: "bg-secondary",
          year: "2023",
          period: "7-9 يوليو 2023",
          location: "تونس، أميديست",
          collaborators: "Solutions Journalism Network",
          description:
            "جمعت ورشة عمل 'ربيع الإعلام' (Media Spring)، التي أقيمت في الفترة من 7 إلى 9 يوليو 2023، 17 صحفياً وصانع محتوى تونسياً في بداية مسارهم المهني لخوض تجربة تدريبية عملية مكثفة.\n\nبدأت الورشة بدراسة الأثر الحقيقي للمعلومات المضللة على المشاركة المدنية في تونس. وباستخدام موضوع الإقبال على لقاح كوفيد-19 في المناطق الريفية المهمشة كدراسة حالة، بحث المشاركون في كيفية تأثير الوصول المحدود إلى وسائل الإعلام المحلية الموثوقة على سلوك الجمهور وثقته.\n\nتلقى المشاركون تدريباً على المهارات الأساسية للصحافة الاستقصائية، بما في ذلك جمع المعلومات، وتقنيات التحقق، واستخدام أدوات الاستخبارات مفتوحة المصدر (OSINT) سهلة الاستخدام، بالإضافة إلى مقدمة حول صحافة الحلول بالشراكة مع شبكة صحافة الحلول.\n\nوتوج البرنامج بجلسة عرض مشاريع تفاعلية، حيث حدد كل مشارك قضية محلية ملحة وطور مقترحاً لإجراء تحقيق صحفي مطبوع أو متعدد الوسائط.",
          highlights: [
            "دراسة حالة حول أثر التضليل في الثقة العامة خلال جائحة كوفيد-19",
            "تدريب عملي على جمع المعلومات والتحقق وإنتاج قصص ميدانية",
            "جلسة عرض مشاريع حول قضايا محلية بصيغ مطبوعة ومتعددة الوسائط",
          ],
        },
        {
          id: "anti-xenophobic",
          title: "موجز مواجهة الخطاب المعادي للأجانب",
          category: "بحث وسياسات",
          color: "bg-aqua",
          year: "2024",
          period: "2024",
          location: "تونس ولبنان",
          collaborators: "تكريم من MEPI",
          description:
            "استجابةً لتصاعد العنف ضد مهاجري جنوب الصحراء الكبرى في تونس، قمنا بإعداد موجز عمل لمواجهة خطاب كراهية الأجانب لعام 2024.\n\nجمع هذا المشروع بين البحث في المعلومات المضللة وخطاب الكراهية عبر الإنترنت، وبين المقابلات مع الخبراء والشهادات الحية من المجتمعات المتضررة. كان هدفنا هو دراسة كيفية مساهمة السرديات الرقمية في إلحاق الضرر الفعلي على أرض الواقع، باستخدام دراسات حالة تشمل تصاعد العنف ضد مهاجري جنوب الصحراء في تونس وأنماط الكراهية عبر الإنترنت التي تستهدف عاملات المنازل المهاجرات في لبنان.\n\nيرسم الموجز خريطة للاتجاهات الرئيسية في الخطاب المعادي للأجانب عبر الإنترنت، ويبحث عواقبه المجتمعية، ويحدد الاستراتيجيات التي يقودها المجتمع لمواجهة السرديات الضارة وتعزيز مساحات رقمية أكثر أماناً وشمولاً.\n\nوقد حظي هذا العمل بتقدير مبادرة الشراكة الشرق أوسطية (MEPI) لتأثيره، حيث منحت 'إل ميديا لاب' جائزة الخدمة المجتمعية بالمركز الأول في يونيو 2024.",
          highlights: [
            "تحليل اتجاهات الخطاب الإقصائي وآثاره الاجتماعية والسياسية",
            "دمج شهادات وخبرات ميدانية من مجتمعات متأثرة",
            "الحصول على جائزة المركز الأول للخدمة المجتمعية من MEPI (يونيو 2024)",
          ],
        },
      ]
    : [
        {
          id: "bridging-gaps",
          title: "Bridging Gaps in Arab Media",
          category: "Roundtable",
          color: "bg-primary",
          year: "2023",
          period: "April 2023",
          location: "Beirut, Lebanon",
          collaborators: "AUB / LAU / AP / Al Jazeera",
          description:
            "We brought together 25 students from the American University of Beirut and the Lebanese American University with journalists from leading international and regional outlets, including the Associated Press, Al Jazeera, and L’Orient-Le Jour.\n\nThis roundtable created a rare space for open exchange between those producing the news and those consuming it. Together, participants explored how the MENA media landscape is shifting, particularly the growing generational divide in how news is accessed, interpreted, and trusted.\n\nStudents engaged directly with key concepts such as agenda-setting, framing, and critical media literacy. At the same time, journalists gained first-hand insight into Gen Z’s digital-first habits and their reliance on emerging social platforms.\n\nThe discussion also addressed the broader consequences of information disorder, highlighting its ripple effects on civic and political freedoms in the region. The session concluded with a set of shared reflections and practical recommendations for bridging these gaps moving forward.",
          highlights: [
            "Hands-on discussion on agenda-setting, framing, and critical media literacy",
            "Direct exchange between Gen Z participants and newsroom professionals",
            "Practical recommendations to bridge newsroom-audience gaps in SWANA",
          ],
        },
        {
          id: "spring-workshop",
          title: "Media Spring Workshop",
          category: "Hands-on Training",
          color: "bg-secondary",
          year: "2023",
          period: "July 7-9, 2023",
          location: "Tunis, Tunisia",
          collaborators: "Solutions Journalism Network",
          description:
            "Held July 7–9, 2023, the Media Spring workshop brought together 17 early-career Tunisian journalists and storytellers for an intensive, hands-on training experience.\n\nThe workshop began by examining the real-world impact of misinformation on civic engagement in Tunisia. Using COVID-19 vaccine uptake in underserved rural areas as a case study, participants examined how limited access to reliable local media can shape public behavior and trust.\n\nParticipants received training in core investigative reporting skills, including information gathering, verification techniques, and the use of accessible OSINT (Open-Source Intelligence) tools, as well as an introduction to solutions journalism in partnership with the Solutions Journalism Network.\n\nThe program culminated in an interactive pitching session, where each participant identified a pressing local issue and developed a proposal for a print or multimedia investigation.",
          highlights: [
            "Case-study based learning on misinformation and civic engagement in Tunisia",
            "Practical training in information gathering and verification techniques",
            "Interactive pitching session for print and multimedia investigations",
          ],
        },
        {
          id: "anti-xenophobic",
          title: "Anti-Xenophobic Speech Action Brief",
          category: "Research & Advocacy",
          color: "bg-aqua",
          year: "2024",
          period: "2024",
          location: "Tunisia and Lebanon",
          collaborators: "Recognized by MEPI",
          description:
            "In response to the surge in violence against sub-Saharan migrants in Tunisia, we developed a 2024 Anti-Xenophobic Speech Action Brief.\n\nThis project combined research on misinformation and online hate speech with expert interviews and testimonies from affected communities. Our goal was to examine how digital narratives can contribute to real-world harm, using case studies including the rise in anti-sub-Saharan violence in Tunisia and patterns of online hate targeting migrant domestic workers in Lebanon.\n\nThe brief maps key trends in online xenophobic discourse, examines its societal consequences, and outlines community-driven strategies to counter harmful narratives and promote safer, more inclusive digital spaces.\n\nThis work was recognized for its impact by the Middle East Partnership Initiative (MEPI), which awarded El Media Lab the first-place Community Service Award in June 2024.",
          highlights: [
            "Mapped key patterns in online xenophobic discourse",
            "Integrated testimonies and expert insights from affected communities",
            "Awarded MEPI First-Place Community Service Award (June 2024)",
          ],
        },
      ];

  const project = useMemo(() => projects.find((p) => p.id === id), [id, projects]);
  const gallery = useMemo(() => (id ? projectGalleries[id] || [] : []), [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <h1 className="text-2xl font-heading mb-4">Project not found</h1>
          <Link to="/projects" className="text-primary hover:underline">Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-cream">
        <div className="container py-12">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-primary font-heading text-sm mb-8 hover:translate-x-[-4px] transition-transform"
          >
            <ArrowLeft size={16} /> {isArabic ? "العودة للمشاريع" : "Back to Projects"}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Project Header */}
            <div className={`${project.color} rounded-3xl p-8 md:p-12 text-primary-foreground mb-12`}>
              <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-xs uppercase tracking-widest font-heading mb-4">
                {project.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-heading mb-6">{project.title}</h1>
              <div className="flex flex-wrap gap-6 text-sm font-heading opacity-90">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} /> {project.period}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} /> {project.location}
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} /> {project.collaborators}
                </div>
              </div>
            </div>

            {/* About & Outcomes Grid */}
            <div className="grid lg:grid-cols-2 gap-12 mb-20">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-heading text-foreground mb-4">
                    {isArabic ? "عن المشروع" : "About the Project"}
                  </h2>
                  <p className="font-body text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-foreground mb-4">
                  {isArabic ? "أبرز النتائج" : "Key Outcomes"}
                </h2>
                <ul className="space-y-3">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white border border-border p-4 rounded-2xl shadow-sm">
                      <div className="h-2 w-2 rounded-full bg-secondary mt-2 shrink-0" />
                      <span className="text-foreground font-body">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gallery Section - Increased grid size */}
            {gallery.length > 0 && (
              <div className="space-y-8 border-t border-border pt-16">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-heading text-foreground flex items-center gap-3">
                    <Camera size={28} className="text-primary" />
                    {isArabic ? "معرض الصور" : "Project Gallery"}
                  </h2>
                  <span className="text-muted-foreground font-body text-sm">
                    {gallery.length} {isArabic ? "صورة" : "Photos"}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gallery.map((img, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.02, zIndex: 10 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedImage(img)}
                      className="aspect-[4/3] rounded-3xl overflow-hidden border border-border shadow-md bg-white group relative"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/20 to-transparent flex items-end p-6">
                         <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
                            <Camera size={20} />
                         </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Image Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={selectedImage}
              alt=""
              className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
            />
            <button
              className="absolute top-8 right-8 text-white/70 hover:text-white hover:scale-110 transition-all p-3 bg-white/10 backdrop-blur-md rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ProjectDetail;
