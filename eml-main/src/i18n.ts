import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        about: "About",
        projects: "Projects",
        partners: "Partners",
        testimonials: "Testimonials",
        tanitbot: "TanitBot",
        getInvolved: "Get Involved",
        toggleMenu: "Toggle menu",
      },
      chatPage: {
        title: "TanitBot",
        subtitle: "Confidential guidance on digital safety, online harassment, and account security in Tunisia. Ask in Tunisian Derja, Arabic, or English.",
        anonymousNotice: "100% Anonymous & Confidential",
        inputPlaceholder: "Ask in Tunisian Derja, Arabic, or English...",
        send: "Send",
        stop: "Stop",
        clear: "New Chat",
        topicsTitle: "Suggested Questions",
        topics: [
          {
            title: "Blackmail & Harassment",
            desc: "What to do if someone threatens to publish private photos?",
            query: "شكون يبتز فيا بتصاور خاصة ويهدد بنشرهم، شنوة نعمل توا خطوة بخطوة؟"
          },
          {
            title: "Account Security",
            desc: "How to secure Facebook & Instagram with 2FA?",
            query: "كيفاش نحمي حساباتي على فيسبوك وانستغرام من الاختراق ونفعّل التحقق بخطوتين؟"
          },
          {
            title: "Legal Protection in Tunisia",
            desc: "Decree 54, telecom laws & reporting cybercrimes",
            query: "شنوة الإجراءات والقوانين التونسية لحمايتي من الجرائم الإلكترونية والابتزاز؟"
          },
          {
            title: "Phishing & Fake Links",
            desc: "How to verify suspicious messages and fake links?",
            query: "كيفاش نكشف الروابط المشبوهة والتصيد الاحتيالي (Phishing)؟"
          }
        ],
        disclaimer: "TanitBot provides guidance grounded in verified digital security guides. In critical emergencies, please contact competent authorities.",
        copy: "Copy",
        copied: "Copied!"
      },
      hero: {
        badge: "Empowering SWANA Youth",
        titlePrefix: "Fostering",
        titleHighlight: "Media Literacy",
        titleSuffix: "for the Next Generation",
        description:
          "An independent youth-led initiative revitalizing the SWANA region's information landscape through critical media production and conscious digital citizenship.",
        primaryCta: "Get Started",
        secondaryCta: "Learn More",
        imageAlt: "Young people collaborating on media projects",
      },
      partners: {
        title: "Our Partners & Supporters",
      },
      about: {
        titlePrefix: "About",
        titleHighlight: "El Media Lab",
        missionTitle: "Our Mission",
        missionBody:
          "El Media Lab is an independent youth-led media literacy initiative aiming to revitalize the SWANA region's information landscape by fostering the next generation of critical media producers and inspiring conscious digital citizenship practices.",
        visionTitle: "Our Vision",
        visionBody:
          "An independent initiative by and for SWANA youth that fosters critical media literacy and conscious digital citizenship through accessible training workshops, inclusive media campaigns, and innovative tech-forward solutions to the region's information disorders.",
        imageAlt: "Workshop participants",
        whoAreWe: "Who are we?",
        whoAreWeBody: "El Media Lab (EML) is an independent, youth-led initiative working at the intersection of media literacy, technology, and society in the SWANA region. We build tools, knowledge, and communities that help people better understand and shape the information spaces they live in.",
        question: "How do we create more informed, critical, and resilient societies?",
        ourStory: "Our Story",
        ourStoryBody: "El Media Lab started as a student-led response to a clear gap: young people in the SWANA region navigate increasingly complex information environments without the tools to understand or challenge them fully. What began as a small initiative has grown into an award-winning project recognized for its impact on media literacy and digital rights in the SWANA region. Our leading members have presented and pitched our work to field experts and young entrepreneurs at competitive international conferences in Austria, Egypt, Germany, Hungary, Lebanon, and the Czech Republic.",
        ourStoryBody2: "Our work has brought together over 100 journalists, researchers, technologists, and students to co-create solutions that are locally grounded and globally relevant.",
        whatWeDo: "What We Do",
        pillars: [
          {
            title: "Media & Information Literacy",
            desc: "We develop training programs and learning modules that equip young people, journalists, and civil society actors with the skills to critically engage with news, digital content, and online narratives.",
          },
          {
            title: "Research & Knowledge Dissemination",
            desc: "We amplify grounded, regionally relevant research on media systems, information disorder, and digital rights, bridging the gap between academic insight and real-world application through roundtables, online resources, and digital content.",
          },
          {
            title: "Innovation & Digital Tools",
            desc: "We experiment with new technologies, including AI, to build tools that support safer digital environments, especially in Arabic and Tunisian/North African dialect contexts.",
          },
        ],
        howWeDoIt: "How we do it",
        values: [
          { title: "Context-driven", desc: "Rooted in the realities of the SWANA region." },
          { title: "Youth-oriented", desc: "Focused on practical solutions for the next generation of media consumers and producers." },
          { title: "Interdisciplinary", desc: "Combining media studies, technology, and social research." },
          { title: "Collaborative", desc: "Built with journalists, educators, and civil society." },
        ],
        tagline: "Let’s build better SWANA information ecosystems together.",
      },
      aboutAnimated: {
        prefix: "We are",
        highlightOne: "rethinking",
        middle: "media literacy so it is practical, inclusive, and youth-first. Our goal is to keep raising the bar and",
        highlightTwo: "challenge",
        almostEnd: "how civic information",
        highlightThree: "works for communities.",
        subheadingTop: "We are El Media Lab and we will",
        subheadingBottom: "take media literacy further",
        button: "About El Media Lab",
      },
      currentProjects: {
        titlePrefix: "Current",
        titleHighlight: "Projects",
        description:
          "Explore what we're working on right now to advance media literacy in the SWANA region.",
        viewAll: "View all projects & register",
        items: [
          {
            title: "Media Literacy Bootcamp 2025",
            description:
              "A 6-week intensive program training 30 young journalists from the SWANA region in critical media analysis and digital storytelling.",
            tag: "Training",
            color: "bg-primary",
          },
          {
            title: "Truth Lens Campaign",
            description:
              "An inclusive social media campaign combating misinformation with fact-checked visual content produced by our alumni network.",
            tag: "Campaign",
            color: "bg-secondary",
          },
          {
            title: "Open Source Fact-Check Toolkit",
            description:
              "Building accessible, multilingual tools for Arabic-speaking communities to verify information and combat disinformation.",
            tag: "Tech",
            color: "bg-lime",
          },
        ],
      },
      testimonials: {
        titlePrefix: "Voices from Our",
        titleHighlight: "Alumni",
        description:
          "Hear from the young media producers who participated in our programs.",
        items: [
          {
            name: "Sara Al-Hamdi",
            role: "Alumni - Cohort 2024",
            quote:
              "El Media Lab transformed how I think about media. I went from passively consuming content to critically analyzing and producing stories that matter to my community.",
          },
          {
            name: "Omar Youssef",
            role: "Alumni - Cohort 2023",
            quote:
              "The workshops were incredibly hands-on. I learned video production, fact-checking, and digital storytelling - skills I now use daily in my journalism career.",
          },
          {
            name: "Lina Khoury",
            role: "Alumni - Cohort 2024",
            quote:
              "Being part of a community of young media producers from across the SWANA region was the most empowering experience. The connections I made are invaluable.",
          },
        ],
      },
      cta: {
        titlePrefix: "Join the Movement for",
        titleHighlight: "Media Literacy",
        description:
          "Whether you're a young journalist, content creator, or passionate about fighting misinformation - there's a place for you at El Media Lab.",
        button: "Get Started",
        imageAlt: "Digital content creation",
      },
      footer: {
        description: "An independent youth-led media literacy initiative for the SWANA region.",
        quickLinks: "Quick Links",
        aboutUs: "About Us",
        projects: "Projects",
        partners: "Partners",
        testimonials: "Testimonials",
        getInvolved: "Get Involved",
        registerNow: "Register Now",
        volunteer: "Volunteer",
        donate: "Donate",
        getInTouch: "Get in Touch",
        contact: "Contact",
        rights: "All rights reserved.",
        arabicTagline: "El Media Lab - An independent youth-led media literacy initiative",
      },
      projectsPage: {
        titlePrefix: "Our",
        titleHighlight: "Projects",
        intro:
          "From training bootcamps to tech tools, explore our initiatives driving media literacy across the SWANA region.",
        registerTitle: "Register as a Participant",
        registerIntro: "Fill in the form below to join one of our current programs.",
        thanksTitle: "Thank you!",
        thanksBody: "Your registration has been submitted. We'll be in touch soon.",
        fullName: "Full Name",
        fullNamePlaceholder: "Your full name",
        email: "Email",
        emailPlaceholder: "you@email.com",
        projectInterest: "Project Interest",
        selectProject: "Select a project",
        message: "Message (optional)",
        messagePlaceholder: "Tell us about yourself...",
        submit: "Submit Registration",
        pastTitlePrefix: "Past",
        pastTitleHighlight: "Projects",
        pastTitleSuffix: "Gallery",
        pastIntro: "A look back at the programs and events that have shaped our community.",
        newTitlePrefix: "New",
        newTitleHighlight: "Projects",
        newIntro: "Stay tuned for future training workshops, roundtables, and other events.",
        testimonialsTitlePrefix: "Workshop",
        testimonialsTitleHighlight: "Testimonials",
        testimonialsIntro: "Hear from participants of the media literacy and writing workshops led by Houssem in collaboration with the American Corner.",
        testimonialsItems: [
          {
            quote: "The hands-on workshop led by Houssem was a turning point. It bridged the gap between theoretical media critique and active civic engagement.",
            name: "Yasmine Belhadj",
            role: "Participant, American Corner Workshop"
          },
          {
            quote: "We didn't just learn about media literacy; we practiced verified content creation and understood digital rights in our local context.",
            name: "Ahmed Dridi",
            role: "Participant, American Corner Workshop"
          },
          {
            quote: "I really enjoyed this experience! I learned so much about graphic design, and I want to thank Houssem for the great explanations and the well-structured presentation",
            name: "Ahmed F.",
            role: "Participant, Graphic Design Workshop"
          },
          {
            quote: "The training sessions offered by El Media Lab are a truly valuable asset, I will keep on the lookout for future opportunities",
            name: "Salma H.",
            role: "Participant, Workshop"
          },
          {
            quote: "I loved the way Houssem made such a big and complicated topic comprehensible to people with no experience and really tried to help us understand the main goal of graphic design and its basics.",
            name: "Kmar B.",
            role: "Participant, Graphic Design Workshop"
          }
        ],
        modalOutcomes: "Key Outcomes",
        modalOverviewPrefix: "Detailed overview for",
        currentItems: [
          {
            title: "Media Literacy Bootcamp 2025",
            description:
              "A 6-week intensive program training 30 young journalists from the SWANA region in critical media analysis and digital storytelling.",
            tag: "Training",
            status: "Registrations Open",
            icon: "book",
          },
          {
            title: "Truth Lens Campaign",
            description:
              "An inclusive social media campaign combating misinformation with fact-checked visual content produced by our alumni network.",
            tag: "Campaign",
            status: "In Progress",
            icon: "globe",
          },
          {
            title: "Open Source Fact-Check Toolkit",
            description:
              "Building accessible, multilingual tools for Arabic-speaking communities to verify information and combat disinformation.",
            tag: "Tech",
            status: "In Development",
            icon: "users",
          },
        ],
        pastItems: [
          {
            title: "Bootcamp Cohort 2024",
            category: "Training",
            color: "bg-primary",
            year: "2024",
            location: "SWANA Region",
            description:
              "Our first regional cohort delivered practical media literacy training for young journalists, creators, and community organizers.",
            highlights: [
              "48 participants completed the full curriculum",
              "12 collaborative media projects launched",
              "Regional mentor network established for alumni",
            ],
          },
          {
            title: "Digital Rights Workshop",
            category: "Workshop",
            color: "bg-secondary",
            year: "2023",
            location: "Hybrid",
            description:
              "A hands-on workshop exploring privacy, digital safety, and ethical online communication for emerging media practitioners.",
            highlights: [
              "Over 150 youth attendees participated",
              "Interactive safety playbooks shared in Arabic and English",
              "Follow-up clinics provided one-on-one guidance",
            ],
          },
          {
            title: "Youth Voices Podcast",
            category: "Media",
            color: "bg-lime",
            year: "2023",
            location: "Regional",
            description:
              "A storytelling podcast amplifying youth-led perspectives on misinformation, identity, and community journalism.",
            highlights: [
              "20 episodes produced by emerging hosts",
              "Featured voices from 7 countries",
              "Community listening circles hosted monthly",
            ],
          },
          {
            title: "Fact-Check Fellowship",
            category: "Fellowship",
            color: "bg-aqua",
            year: "2022",
            location: "SWANA Region",
            description:
              "A fellowship program designed to train early-career researchers in verification workflows and evidence-based reporting.",
            highlights: [
              "25 fellows completed newsroom simulation labs",
              "90+ misinformation claims reviewed collaboratively",
              "Fellow reports informed partner media outlets",
            ],
          },
          {
            title: "SWANA Media Forum",
            category: "Event",
            color: "bg-primary",
            year: "2022",
            location: "Tunis",
            description:
              "A convening of youth leaders, educators, and journalists focused on strengthening independent media ecosystems.",
            highlights: [
              "300+ attendees across two days",
              "Policy roundtables on media literacy in schools",
              "Cross-border project teams formed after the event",
            ],
          },
          {
            title: "Citizen Journalism Lab",
            category: "Training",
            color: "bg-secondary",
            year: "2021",
            location: "Hybrid",
            description:
              "An introductory lab helping first-time storytellers build confidence in interviewing, sourcing, and narrative framing.",
            highlights: [
              "60 learners published their first verified stories",
              "Skill tracks covered mobile reporting and editing",
              "Alumni circle continues with peer-review meetups",
            ],
          },
        ],
      },
      digitalRights: {
        titlePrefix: "EML –",
        titleHighlight: "Media Literacy & Digital Rights",
        titleSuffix: "Guide",
        subtitle: "A practical guide to conscious digital citizenship, critical consumption, and source verification in the SWANA region.",
        doTitle: "DO / What to Practice",
        doSubtitle: "Best practices for active and critical digital engagement",
        dontTitle: "DON'T / What to Avoid",
        dontSubtitle: "Crucial actions to avoid online traps and misinformation",
        showMore: "Show All Guidelines",
        showLess: "Show Less",
        dos: [
          "Verify the credibility of the sources of information you consume or share.",
          "Credit the original writers/creators when sharing their content.",
          "Think critically about the purpose and potential bias of content shared.",
          "Protect your data by using strong passwords and two-factor authentication to prevent unauthorized access.",
          "Respect other people’s privacy and ownership and ask for consent before sharing any information belonging to them.",
          "Report content that is misleading, and flag hate speech in order to prevent it from spreading.",
          "Review terms of services carefully to know who has access to your data, and how it will be used.",
          "Question and challenge media representation that stereotypes people or generalizes groups unfairly.",
          "Be careful of AI-generated content and verify the information using known credible sources.",
          "Seek out multiple journalists, organizations and reporters with transparent evidence and corrections.",
          "Identify whether the media you are consuming is news, opinions, or advertising.",
          "Compare how different sources cover the same topic, event or issue.",
          "Question what information is missing, ignored, or intentionally left unclear.",
          "Notice how visuals and sound are used to shape emotions."
        ],
        donts: [
          "Share private information publicly, specifically regarding personal health, location, or credit card information.",
          "React impulsively to content posted online that is designed to trigger strong emotions or aggression.",
          "Believe statistics or graphs without checking dates, sources, and research methods.",
          "Click links or download files from unverified sources or suspicious websites.",
          "Engage with media or online personas that promote violence, hate speech or harassment.",
          "Take titles literally without reading the entire article and checking the background of authors and publishing organizations.",
          "Fall into algorithmic echo chambers, instead, diversify your sources and points of view.",
          "Give apps and websites unnecessary access to data, camera, location or contacts.",
          "Rely on AI for news or share AI generated content that violates ownership rights and disregards intellectual property.",
          "Take medical, legal or financial advice from content creators or publishers that don’t cite experts or credible studies.",
          "Assume that repeated information is true just because it appears everywhere.",
          "Confuse professional design with credibility or factual accuracy.",
          "Measure credibility by likes, comments, or online attention.",
          "Accept images or videos without checking their context: date, original source, event, location..."
        ]
      },
      notFound: {
        message: "Oops! Page not found",
        backHome: "Return to Home",
      },
      common: {
        close: "Close",
        language: "Language",
        english: "EN",
        arabic: "AR",
      },
      contactPage: {
        title: "Get in Touch",
        subtitle: "Have a question or want to collaborate? Feel free to reach out to us.",
        fullName: "Full Name",
        fullNamePlaceholder: "Enter your full name",
        email: "Email Address",
        emailPlaceholder: "Enter your email address",
        reason: "Reason for Contact",
        selectReason: "Select a reason",
        reasonOptions: {
          general: "General Inquiry",
          collaboration: "Collaboration Opportunity",
          participation: "Project Participation",
          spontaneous: "Spontaneous team application"
        },
        message: "Message",
        messagePlaceholder: "Write your message here...",
        attachments: "Attachments (optional)",
        attachmentsHelp: "Upload PDF or JPG files only. Maximum file size: 10-20MB.",
        submit: "Send Message",
        submitting: "Sending...",
        successTitle: "Message Sent!",
        successBody: "Thank you for reaching out. We have received your message and will get back to you shortly.",
        errorSize: "File size exceeds the 10-20MB limit.",
        errorType: "Only PDF and JPG files are allowed."
      },
      blogPage: {
        title: "Our Blog",
        subtitle: "Academic and research-oriented work from El Media Lab, including articles, presentations, and videos.",
        searchPlaceholder: "Search articles...",
        all: "All",
        articles: "Articles",
        videos: "Videos",
        presentations: "Presentations",
        readTime: "min read",
        watchTime: "min watch",
        backToBlog: "Back to Blog",
        downloadSlides: "Download Presentation Slides",
        noResults: "No posts found matching your search.",
        viewOnInstagram: "View on Instagram"
      },
    },
  },
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        about: "من نحن",
        projects: "المشاريع",
        partners: "الشركاء",
        testimonials: "الشهادات",
        tanitbot: "تانيت بوت",
        getInvolved: "شارك معنا",
        toggleMenu: "تبديل القائمة",
      },
      chatPage: {
        title: "تانيت بوت",
        subtitle: "دليلك الآمن والموثوق للأمان الرقمي ومكافحة الابتزاز والخصوصية في تونس بالدارجة والعربية.",
        anonymousNotice: "فضاء آمن وخاص 100% · لا يتم حفظ أي بيانات شخصية",
        inputPlaceholder: "اكتب سؤالك بالدارجة التونسية أو العربية...",
        send: "إرسال",
        stop: "إيقاف",
        clear: "محادثة جديدة",
        topicsTitle: "أسئلة شائعة",
        topics: [
          {
            title: "التعامل مع الابتزاز",
            desc: "شنوة نعمل إذا تعرضت للابتزاز بتصاور خاصة؟",
            query: "شكون يبتز فيا بتصاور خاصة ويهدد بنشرهم، شنوة نعمل توا خطوة بخطوة؟"
          },
          {
            title: "حماية الحسابات",
            desc: "كيفاش نحمي حساباتي ونفعّل التحقق بخطوتين (2FA)؟",
            query: "كيفاش نحمي حساباتي على فيسبوك وانستغرام من الاختراق ونفعّل التحقق بخطوتين؟"
          },
          {
            title: "الحماية القانونية في تونس",
            desc: "القوانين التونسية وطريقة تقديم شكاية",
            query: "شنوة الإجراءات والقوانين التونسية لحمايتي من الجرائم الإلكترونية والابتزاز؟"
          },
          {
            title: "الروابط المشبوهة والاحتيال",
            desc: "كيفاش نكشف الروابط المشبوهة و Phishing؟",
            query: "كيفاش نكشف الروابط المشبوهة والتصيد الاحتيالي (Phishing)؟"
          }
        ],
        disclaimer: "تانيت بوت مساعد استرشادي للتوعية الرقمية. في حالات الخطر القصوى تواصل مباشرة مع الإدارة الفرعية للوقاية الاجتماعية أو الوحدة الوطنية لمكافحة الإجرام.",
        copy: "نسخ",
        copied: "تم النسخ!"
      },
      hero: {
        badge: "تمكين شباب سوانا",
        titlePrefix: "نعزز",
        titleHighlight: "محو الأمية الإعلامية",
        titleSuffix: "للجيل القادم",
        description:
          "مبادرة مستقلة يقودها الشباب لإحياء المشهد المعلوماتي في منطقة سوانا عبر إنتاج إعلامي نقدي ومواطنة رقمية واعية.",
        primaryCta: "ابدأ الآن",
        secondaryCta: "اعرف المزيد",
        imageAlt: "شباب يتعاونون في مشاريع إعلامية",
      },
      partners: {
        title: "شركاؤنا وداعمونا",
      },
      about: {
        titlePrefix: "حول",
        titleHighlight: "إل ميديا لاب",
        missionTitle: "رسالتنا",
        missionBody:
          "إل ميديا لاب مبادرة مستقلة يقودها الشباب في مجال محو الأمية الإعلامية، تهدف إلى تجديد المشهد المعلوماتي في منطقة سوانا عبر إعداد جيل جديد من منتجي الإعلام النقدي وتعزيز المواطنة الرقمية الواعية.",
        visionTitle: "رؤيتنا",
        visionBody:
          "مبادرة مستقلة من أجل شباب سوانا وبقيادتهم، تعزز محو الأمية الإعلامية والمواطنة الرقمية الواعية من خلال تدريبات متاحة للجميع، وحملات إعلامية شاملة، وحلول تقنية مبتكرة لمواجهة اضطرابات المعلومات في المنطقة.",
        imageAlt: "مشاركون في ورشة عمل",
        whoAreWe: "من نحن؟",
        whoAreWeBody: "مختبر الإعلام (El Media Lab - EML) هو مبادرة مستقلة يقودها الشباب، تعمل عند تقاطع التربية الإعلامية، والتكنولوجيا، والمجتمع في منطقة جنوب غرب آسيا وشمال إفريقيا (SWANA). نقوم بتطوير أدوات، وإنتاج معرفة، وبناء مجتمعات تساعد الأفراد على فهم الفضاءات المعلوماتية التي يعيشون فيها والمساهمة في تشكيلها.",
        question: "كيف نبني مجتمعات أكثر وعياً ونقداً وقدرة على الصمود؟",
        ourStory: "قصتنا",
        ourStoryBody: "انطلق مختبر الإعلام كمبادرة طلابية جاءت استجابة لفجوة واضحة: إذ يواجه الشباب في منطقة SWANA بيئات معلوماتية تزداد تعقيداً، دون امتلاك الأدوات الكافية لفهمها أو مساءلتها بشكل كامل. ما بدأ كمبادرة صغيرة تطور ليصبح مشروعاً حائزاً على جوائز، ومعترفاً به لتأثيره في مجالي التربية الإعلامية والحقوق الرقمية في المنطقة. وقد قدّم أعضاء الفريق الأساسيون أعمالهم وطرحوا مشاريعهم أمام خبراء المجال ورواد الأعمال الشباب في مؤتمرات دولية تنافسية في النمسا، ومصر، وألمانيا، والمجر، ولبنان، وجمهورية التشيك.",
        ourStoryBody2: "كما نجحنا في جمع أكثر من 100 صحفي وباحث وتقني وطالب للعمل معاً على تطوير حلول تنطلق من الواقع المحلي وتواكب السياقات العالمية.",
        whatWeDo: "ماذا نفعل؟",
        pillars: [
          {
            title: "التربية الإعلامية والمعلوماتية",
            desc: "نطوّر برامج تدريبية ووحدات تعليمية تمكّن الشباب، والصحفيين، وفاعلي المجتمع المدني من اكتساب مهارات التفكير النقدي والتفاعل الواعي مع الأخبار والمحتوى الرقمي والسرديات المنتشرة عبر الإنترنت.",
          },
          {
            title: "البحث ونشر المعرفة",
            desc: "نعمل على إبراز ونشر أبحاث رصينة ومرتبطة بسياق المنطقة حول أنظمة الإعلام، واضطراب المعلومات، والحقوق الرقمية. كما نسعى إلى ردم الفجوة بين المعرفة الأكاديمية والتطبيق العملي من خلال الطاولات المستديرة، والموارد الرقمية، والمحتوى التوعوي.",
          },
          {
            title: "الابتكار والأدوات الرقمية",
            desc: "نستكشف استخدام التقنيات الحديثة، بما في ذلك الذكاء الاصطناعي، لتطوير أدوات تساهم في خلق بيئات رقمية أكثر أماناً، خاصة في السياقات اللغوية العربية واللهجات التونسية وشمال الإفريقية.",
          },
        ],
        howWeDoIt: "كيف نعمل؟",
        values: [
          { title: "الاستناد إلى السياق", desc: "حلولنا نابعة من واقع منطقة SWANA وتحدياتها." },
          { title: "التركيز على الشباب", desc: "نطور حلولاً عملية تستهدف الجيل القادم من مستهلكي ومنتجي الإعلام." },
          { title: "النهج متعدد التخصصات", desc: "نجمع بين دراسات الإعلام، والتكنولوجيا، والبحث الاجتماعي." },
          { title: "العمل التشاركي", desc: "نعمل جنباً إلى جنب مع الصحفيين، والمربين، ومنظمات المجتمع المدني." },
        ],
        tagline: "لُنسهم معاً في بناء بيئات معلوماتية أفضل في منطقة SWANA.",
      },
      aboutAnimated: {
        prefix: "نحن",
        highlightOne: "نعيد التفكير",
        middle: "في محو الأمية الإعلامية ليكون عمليا وشاملا ومتمحورا حول الشباب. هدفنا أن نواصل رفع المستوى وأن",
        highlightTwo: "نتحدى",
        almostEnd: "كيف تعمل المعلومات المدنية",
        highlightThree: "لصالح المجتمعات.",
        subheadingTop: "نحن إل ميديا لاب وسنواصل",
        subheadingBottom: "دفع محو الأمية الإعلامية إلى الأمام",
        button: "عن إل ميديا لاب",
      },
      currentProjects: {
        titlePrefix: "المشاريع",
        titleHighlight: "الحالية",
        description: "تعرّف على ما نعمل عليه حاليا لدعم محو الأمية الإعلامية في منطقة سوانا.",
        viewAll: "عرض جميع المشاريع والتسجيل",
        items: [
          {
            title: "معسكر محو الأمية الإعلامية 2025",
            description:
              "برنامج مكثف لمدة 6 أسابيع يدرّب 30 صحفيا شابا من منطقة سوانا على التحليل الإعلامي النقدي والسرد الرقمي.",
            tag: "تدريب",
            color: "bg-primary",
          },
          {
            title: "حملة عدسة الحقيقة",
            description:
              "حملة تواصل اجتماعي شاملة لمواجهة التضليل عبر محتوى بصري موثّق ينتجه خريجونا.",
            tag: "حملة",
            color: "bg-secondary",
          },
          {
            title: "عدة التحقق مفتوحة المصدر",
            description:
              "تطوير أدوات متاحة ومتعددة اللغات للمجتمعات الناطقة بالعربية للتحقق من المعلومات ومواجهة التضليل.",
            tag: "تقنية",
            color: "bg-lime",
          },
        ],
      },
      testimonials: {
        titlePrefix: "أصوات من",
        titleHighlight: "خريجينا",
        description: "استمع إلى تجارب منتجي الإعلام الشباب الذين شاركوا في برامجنا.",
        items: [
          {
            name: "سارة الحمدي",
            role: "خريجة - دفعة 2024",
            quote:
              "غيّر إل ميديا لاب طريقة تفكيري تجاه الإعلام. انتقلت من الاستهلاك السلبي إلى التحليل النقدي وإنتاج قصص تهم مجتمعي.",
          },
          {
            name: "عمر يوسف",
            role: "خريج - دفعة 2023",
            quote:
              "كانت الورش عملية جدا. تعلمت إنتاج الفيديو والتحقق من المعلومات والسرد الرقمي - وهي مهارات أستخدمها يوميا في عملي الصحفي.",
          },
          {
            name: "لينا خوري",
            role: "خريجة - دفعة 2024",
            quote:
              "كان الانضمام إلى مجتمع من منتجي الإعلام الشباب من مختلف منطقة سوانا تجربة ملهمة للغاية. الروابط التي بنيتها لا تقدّر بثمن.",
          },
        ],
      },
      cta: {
        titlePrefix: "انضم إلى حركة",
        titleHighlight: "محو الأمية الإعلامية",
        description:
          "سواء كنت صحفيا شابا، صانع محتوى، أو مهتما بمكافحة التضليل - فهناك مكان لك في إل ميديا لاب.",
        button: "ابدأ الآن",
        imageAlt: "صناعة محتوى رقمي",
      },
      footer: {
        description: "مبادرة مستقلة يقودها الشباب لمحو الأمية الإعلامية في منطقة سوانا.",
        quickLinks: "روابط سريعة",
        aboutUs: "من نحن",
        projects: "المشاريع",
        partners: "الشركاء",
        testimonials: "الشهادات",
        getInvolved: "شارك معنا",
        registerNow: "سجل الآن",
        volunteer: "تطوع",
        donate: "تبرع",
        getInTouch: "تواصل معنا",
        contact: "تواصل معنا",
        rights: "جميع الحقوق محفوظة.",
        arabicTagline: "إل ميديا لاب - مبادرة شبابية مستقلة لمحو الأمية الإعلامية",
      },
      projectsPage: {
        titlePrefix: "مشاريعنا",
        titleHighlight: "",
        intro:
          "من المعسكرات التدريبية إلى الأدوات التقنية، استكشف مبادراتنا التي تدفع محو الأمية الإعلامية في منطقة سوانا.",
        registerTitle: "سجل كمشارك",
        registerIntro: "املأ النموذج أدناه للانضمام إلى أحد برامجنا الحالية.",
        thanksTitle: "شكرا لك!",
        thanksBody: "تم إرسال تسجيلك بنجاح. سنتواصل معك قريبا.",
        fullName: "الاسم الكامل",
        fullNamePlaceholder: "اكتب اسمك الكامل",
        email: "البريد الإلكتروني",
        emailPlaceholder: "you@email.com",
        projectInterest: "المشروع الذي يهمك",
        selectProject: "اختر مشروعا",
        message: "رسالة (اختيارية)",
        messagePlaceholder: "أخبرنا عن نفسك...",
        submit: "إرسال التسجيل",
        pastTitlePrefix: "معرض المشاريع",
        pastTitleHighlight: "السابقة",
        pastTitleSuffix: "",
        pastIntro: "نظرة على البرامج والفعاليات التي شكّلت مجتمعنا.",
        newTitlePrefix: "المشاريع",
        newTitleHighlight: "الجديدة",
        newIntro: "ترقبوا ورش العمل التدريبية والموائد المستديرة والفعاليات الأخرى في المستقبل.",
        testimonialsTitlePrefix: "شهادات",
        testimonialsTitleHighlight: "ورش العمل",
        testimonialsIntro: "آراء وانطباعات المشاركين في ورش عمل التربية الإعلامية والكتابة التي أشرف عليها حسام بالتعاون مع الركن الأمريكي (American Corner).",
        testimonialsItems: [
          {
            quote: "كانت ورشة العمل العملية التي قادها حسام نقطة تحول بالنسبة لي. لقد جسرت الفجوة بين النقد الإعلامي النظري والمشاركة المدنية الفعالة.",
            name: "ياسمين بلحاج",
            role: "مشاركة، ورشة الركن الأمريكي"
          },
          {
            quote: "لم نتعلم فقط عن التربية الإعلامية، بل مارسنا عملياً صناعة المحتوى الموثوق وفهمنا الحقوق الرقمية في سياقنا المحلي.",
            name: "أحمد الدريدي",
            role: "مشارك، ورشة الركن الأمريكي"
          },
          {
            quote: "لقد استمتعت حقاً بهذه التجربة! تعلمت الكثير عن التصميم الجرافيكي، وأود أن أشكر حسام على التفسيرات الرائعة والعرض التقديمي المنظم جيداً",
            name: "أحمد ف.",
            role: "مشارك، ورشة عمل التصميم الجرافيكي"
          },
          {
            quote: "إن الدورات التدريبية التي يقدمها إل ميديا لاب هي مكسب قيم حقاً، وسأبقى على اطلاع دائم بانتظار الفرص المستقبلية",
            name: "سلمى هـ.",
            role: "مشاركة، ورشة عمل"
          },
          {
            quote: "لقد أحببت الطريقة التي جعل بها حسام موضوعاً كبيراً ومعقداً كهذا مفهوماً للأشخاص الذين ليس لديهم خبرة، وحاول حقاً مساعدتنا في فهم الهدف الرئيسي للتصميم الجرافيكي وأساسياته.",
            name: "قمر ب.",
            role: "مشاركة، ورشة عمل التصميم الجرافيكي"
          }
        ],
        modalOutcomes: "أبرز النتائج",
        modalOverviewPrefix: "نظرة تفصيلية على",
        currentItems: [
          {
            title: "معسكر محو الأمية الإعلامية 2025",
            description:
              "برنامج مكثف لمدة 6 أسابيع يدرّب 30 صحفيا شابا من منطقة سوانا على التحليل الإعلامي النقدي والسرد الرقمي.",
            tag: "تدريب",
            status: "التسجيل مفتوح",
            icon: "book",
          },
          {
            title: "حملة عدسة الحقيقة",
            description:
              "حملة تواصل اجتماعي شاملة لمواجهة التضليل عبر محتوى بصري موثّق ينتجه خريجونا.",
            tag: "حملة",
            status: "قيد التنفيذ",
            icon: "globe",
          },
          {
            title: "عدة التحقق مفتوحة المصدر",
            description:
              "تطوير أدوات متاحة ومتعددة اللغات للمجتمعات الناطقة بالعربية للتحقق من المعلومات ومواجهة التضليل.",
            tag: "تقنية",
            status: "قيد التطوير",
            icon: "users",
          },
        ],
        pastItems: [
          {
            title: "دفعة المعسكر 2024",
            category: "تدريب",
            color: "bg-primary",
            year: "2024",
            location: "منطقة سوانا",
            description:
              "قدمت دفعتنا الإقليمية الأولى تدريبات عملية في محو الأمية الإعلامية للصحفيين الشباب وصناع المحتوى ومنظمي المجتمع.",
            highlights: [
              "أكمل 48 مشاركا المنهج بالكامل",
              "إطلاق 12 مشروعا إعلاميا تعاونيا",
              "تأسيس شبكة إرشاد إقليمية للخريجين",
            ],
          },
          {
            title: "ورشة الحقوق الرقمية",
            category: "ورشة",
            color: "bg-secondary",
            year: "2023",
            location: "حضوري وعن بعد",
            description:
              "ورشة عملية تناولت الخصوصية والسلامة الرقمية والتواصل الأخلاقي عبر الإنترنت للممارسين الإعلاميين الناشئين.",
            highlights: [
              "مشاركة أكثر من 150 شابا وشابة",
              "توزيع أدلة سلامة تفاعلية بالعربية والإنجليزية",
              "جلسات متابعة فردية للدعم",
            ],
          },
          {
            title: "بودكاست أصوات الشباب",
            category: "إعلام",
            color: "bg-lime",
            year: "2023",
            location: "إقليمي",
            description:
              "بودكاست قصصي يبرز أصواتا شبابية حول التضليل والهوية وصحافة المجتمع.",
            highlights: [
              "إنتاج 20 حلقة بأصوات مقدمي برامج ناشئين",
              "استضافة مشاركين من 7 دول",
              "تنظيم جلسات استماع مجتمعية شهرية",
            ],
          },
          {
            title: "زمالة التحقق من المعلومات",
            category: "زمالة",
            color: "bg-aqua",
            year: "2022",
            location: "منطقة سوانا",
            description:
              "برنامج زمالة لتدريب الباحثين في بداياتهم المهنية على منهجيات التحقق وإعداد تقارير مبنية على الأدلة.",
            highlights: [
              "أكمل 25 زميلا مختبرات محاكاة غرف الأخبار",
              "مراجعة أكثر من 90 ادعاء تضليل بشكل تعاوني",
              "استفادت مؤسسات إعلامية شريكة من تقارير الزملاء",
            ],
          },
          {
            title: "منتدى سوانا الإعلامي",
            category: "فعالية",
            color: "bg-primary",
            year: "2022",
            location: "تونس",
            description:
              "ملتقى جمع قادة شبابا ومربين وصحفيين لتعزيز منظومات الإعلام المستقل في المنطقة.",
            highlights: [
              "أكثر من 300 مشارك على مدار يومين",
              "حوارات سياسات حول إدماج محو الأمية الإعلامية في التعليم",
              "تشكيل فرق مشاريع عابرة للحدود بعد المنتدى",
            ],
          },
          {
            title: "مختبر صحافة المواطن",
            category: "تدريب",
            color: "bg-secondary",
            year: "2021",
            location: "حضوري وعن بعد",
            description:
              "مختبر تمهيدي ساعد رواة القصص الجدد على تطوير الثقة في المقابلات والتحقق وصياغة السرد.",
            highlights: [
              "نشر 60 متعلما أولى قصصهم الموثقة",
              "مسارات مهارية في الصحافة عبر الهاتف والتحرير",
              "مجتمع خريجين مستمر بجلسات مراجعة أقران",
            ],
          },
        ],
      },
      digitalRights: {
        titlePrefix: "إل ميديا لاب –",
        titleHighlight: "دليل الثقافة الإعلامية والحقوق الرقمية",
        titleSuffix: "",
        subtitle: "دليلك العملي للمواطنة الرقمية الواعية، والاستهلاك النقدي، والتحقق من المصادر في منطقة سوانا.",
        doTitle: "افعل / يجب عليك أن",
        doSubtitle: "ممارسات واعية لتعزيز الوعي الرقمي والتفكير النقدي",
        dontTitle: "لا تفعل / يجب عليك أن لا",
        dontSubtitle: "سلوكيات ينصح بتجنبها لحماية بياناتك والحد من التضليل",
        showMore: "عرض كل التوصيات",
        showLess: "عرض أقل",
        dos: [
          "تحقّق من مصداقية مصادر المعلومات التي تستهلكها أو تشاركها.",
          "انسب المحتوى إلى الكتّاب أو المبدعين الأصليين عند مشاركته.",
          "فكّر نقديًا في هدف المحتوى المتداوَل واحتمال وجود أي تحيّز فيه.",
          "احمِ بياناتك باستخدام كلمات مرور قوية والمصادقة الثنائية (Two-Factor Authentication) لحماية حساباتك من الاختراق.",
          "احترم خصوصية الآخرين وملكيتهم، واحصل على موافقتهم قبل مشاركة أي معلومات تخصّهم.",
          "بلغ عن المحتوى المضلّل، وخطاب الكراهية لمنع انتشاره.",
          "راجع شروط الخدمة بعناية لمعرفة من يمكنه الوصول إلى بياناتك وكيف ستُستخدم.",
          "انتقد التمثيل الإعلامي الذي يرسّخ الصور النمطية أو يعمّم على المجموعات بشكل غير عادل.",
          "كن حذرًا من المحتوى المُنتَج بالذكاء الإصطناعي، وتحقّق من المعلومات بإستخدام مصادر موثوقة ومعروفة.",
          "إبحث عن صحفيين ومنظمات ومراسلين متعدّدين يقدّمون أدلة واضحة وتصحيحات شفافة.",
          "حدّد ما إذا كان المحتوى الإعلامي الذي تستهلكه خبرًا أو رأيًا أو إعلانًا.",
          "قارن تغطية مصادرمختلفة للموضوع أو الحدث أو القضية نفسها.",
          "تساءل عن المعلومات الناقصة أو المُهمَلة أو المتروكة غامضة عمدًا.",
          "انتبه إلى كيفية استخدام الصور والصوت للتأثير في المشاعر."
        ],
        donts: [
          "لا تشارك معلوماتك الخاصة علنًا، خصوصًا ما يتعلّق بالصّحتك الشّخصيّة أو عنوانك أو معلومات بطاقة الائتمان.",
          "لا تتفاعل بتهوّر مع محتوى منشور على الإنترنت صُمّم لإثارة مشاعر قوية أو عدوانية.",
          "لا تصدّق الإحصاءات أو الرسوم البيانية من دون التّحقق من التّواريخ والمصادر وطرق البحث.",
          "لا تضغط على روابط أو تحمّل ملفات من مصادر غير موثوقة أو مواقع مشبوهة.",
          "لا تتفاعل مع محتوى إعلامي أو شخصيات رقميّة تروّج للعنف أو خطاب الكراهية أو التحرّش.",
          "لا تأخذ العناوين بحرفيتها من دون قراءة المقال كاملًا والتحقق من خلفية الكتّاب والمؤسسات الناشرة.",
          "لا تقع في \"غرف الصدى\" الرقميّة ؛ بل نوّع مصادرك ووجهات نظرك.",
          "لا تمنح التطبيقات والمواقع وصولًا غير ضروري إلى البيانات أو الكاميرا أو الموقع أو جهات الاتصال.",
          "لا تعتمد على الذكاء الاصطناعي للحصول على الأخبار، ولا تشارك محتوى مُنتَجًا بالذكاء الاصطناعي ينتهك حقوق الملكية ويتجاهل الملكية الفكرية.",
          "لا تأخذ نصائح طبية أو قانونية أو مالية من صانعي محتوى أو ناشرين لا يستشهدون بخبراء أو دراسات موثوقة.",
          "لا تفترض أن المعلومات المتكررة صحيحة لمجرد أنها تظهر في كل مكان.",
          "لا تخلط بين التصميم الاحترافي والمصداقية أو الدقة الواقعية.",
          "لا تقِس المصداقية بعدد الإعجابات أو التعليقات أو الاهتمام على الإنترنت.",
          "لا تقبل الصور أو الفيديوهات من دون التحقق من سياقها: التاريخ، المصدر الأصلي، الحدث، الموقع..."
        ]
      },
      notFound: {
        message: "عفوا، الصفحة غير موجودة",
        backHome: "العودة إلى الرئيسية",
      },
      common: {
        close: "إغلاق",
        language: "اللغة",
        english: "EN",
        arabic: "AR",
      },
      contactPage: {
        title: "تواصل معنا",
        subtitle: "لديك سؤال أو ترغب في التعاون؟ لا تتردد في الاتصال بنا.",
        fullName: "الاسم الكامل",
        fullNamePlaceholder: "أدخل اسمك الكامل",
        email: "البريد الإلكتروني",
        emailPlaceholder: "أدخل بريدك الإلكتروني",
        reason: "سبب الاتصال",
        selectReason: "اختر سبباً",
        reasonOptions: {
          general: "استفسار عام",
          collaboration: "فرصة تعاون",
          participation: "المشاركة في مشروع",
          spontaneous: "طلب انضمام تلقائي للفريق"
        },
        message: "الرسالة",
        messagePlaceholder: "اكتب رسالتك هنا...",
        attachments: "المرفقات (اختياري)",
        attachmentsHelp: "تحميل ملفات PDF أو JPG فقط. حجم الملف الأقصى: 10-20 ميجابايت.",
        submit: "إرسال الرسالة",
        submitting: "جاري الإرسال...",
        successTitle: "تم إرسال الرسالة!",
        successBody: "شكراً لتواصلك معنا. لقد استلمنا رسالتك وسنرد عليك في أقرب وقت ممكن.",
        errorSize: "حجم الملف يتجاوز الحد المسموح به (10-20 ميجابايت).",
        errorType: "يُسمح فقط بملفات PDF و JPG."
      },
      blogPage: {
        title: "مدونتنا",
        subtitle: "الأعمال الأكاديمية والبحثية من إل ميديا لاب، بما في ذلك المقالات والعروض التقديمية ومقاطع الفيديو.",
        searchPlaceholder: "البحث في المقالات...",
        all: "الكل",
        articles: "مقالات",
        videos: "فيديو",
        presentations: "عروض تقديمية",
        readTime: "دقائق قراءة",
        watchTime: "دقائق مشاهدة",
        backToBlog: "العودة إلى المدونة",
        downloadSlides: "تحميل العرض التقديمي",
        noResults: "لم يتم العثور على منشورات تطابق بحثك.",
        viewOnInstagram: "عرض على إنستغرام"
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "appLang",
    },
  });

const applyDirection = (lang: string) => {
  const isArabic = lang === "ar";
  document.documentElement.lang = lang;
  document.documentElement.dir = isArabic ? "rtl" : "ltr";
};

applyDirection(i18n.language);
i18n.on("languageChanged", applyDirection);

export default i18n;
