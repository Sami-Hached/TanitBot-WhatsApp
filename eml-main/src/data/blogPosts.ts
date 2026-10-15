export interface BlogPost {
  id: string;
  type: "article" | "video" | "slides";
  date: string;
  dateAr: string;
  readTime: number; // in minutes
  category: string;
  categoryAr: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  content: string;
  contentAr: string;
  coverImage: string;
  videoUrl?: string;
  pdfUrl?: string;
  instagramUrl?: string;
  author: string;
  authorAr: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "nextgen-icann-salsabil-yaakoubi",
    type: "article",
    date: "June 11, 2026",
    dateAr: "11 يونيو 2026",
    readTime: 5,
    category: "Internet Governance",
    categoryAr: "حوكمة الإنترنت",
    title: "My Journey at NextGen@ICANN, More than just Code!",
    titleAr: "رحلتي في برنامج NextGen@ICANN: أكثر من مجرد كود برمجي!",
    excerpt: "Reflecting on NextGen@ICANN86 in Seville: discovering how Internet governance is driven by community, human trust, and multilingual digital inclusion.",
    excerptAr: "تأملات من مشاركتي في برنامج NextGen@ICANN86 في إشبيلية: كيف تبين أن حوكمة الإنترنت تقوم على المجتمع، الثقة الإنسانية، والإدماج الرقمي متعدد اللغات.",
    author: "Salsabil Yaakoubi",
    authorAr: "سلسبيل يعقوبي",
    coverImage: "/images/icann-nextgen.png",
    instagramUrl: "https://www.instagram.com/p/DZ3E3dGn_AP/?hl=fr&img_index=1",
    content: `
Ever thought about what actually happens in the split seconds between typing a domain name and hitting the enter tab? Honestly, me neither. Certainly, I have always believed in the importance of internet governance, but somehow viewed it as an abstract concept that lacks hands-on tools to be thoroughly understood. Here came the chance of participating in the NextGen@ICANN program at ICANN86 that I couldn’t miss. Held in Seville between the 8th and 11th of June, it focused on current policy development work, outreach, and daily opportunities to network with the community, and most importantly, expanded my knowledge and my network.

### The Internet is a Community, Not Just Code

Thanks to ICANN, I understood that the internet isn’t mere code; it is a community. In other terms, if you peel back the technical layers of the internet, you don’t just find servers and protocols; you find people, policies, and a delicate balance of human trust. I had the chance to explore how different parts of the ICANN ecosystem interact, including registries, registrars, policy processes, the Generic Names Supporting Organization, and the broader multistakeholder model. The structure can feel complex at first, but that complexity reflects how many actors are involved in keeping the Internet stable, interoperable, and globally accessible.

### Universal Acceptance & Multilingual Digital Inclusion

As part of NextGen@ICANN, I took the stage to talk about Universal Acceptance and multilingual digital inclusion, a critical yet mostly overlooked issue of global internet accessibility. Bearing the hassle of a personal experience as an Arabic speaker, the core issue I put on the table was: can digital systems properly validate domain names and email addresses across all languages and scripts? As a matter of fact, digital inclusion isn't just about getting people connected to the Internet. It’s about ensuring they are seen, recognized, and respected once they get there. Hence, the digital space should not be another weapon for ensuring one language or one identity supremacy over others, as it was primarily developed to interconnect humans regardless of their differences.

### A Global Tour of Internet Governance

What I value the most in this experience are the exchanges I had with other participants in the cohort. The discussions we engaged in felt like having a global tour of the Internet governance landscape, as everyone brought something unique to share with others. The presentations covered topics such as DNS abuse, cyber threats in domain infrastructure, privacy in domain name governance, Internet fragmentation, the digital divide, AI-supported policy deliberation, and community dynamics in Internet governance. Together, these topics helped me understand how wide and interconnected the field is.

### Empowering Youth in Digital Governance

Most importantly, NextGen@ICANN86 reminded me that youth can indeed make a change and have a meaningful role to play in Internet governance. We do not need to enter the space already knowing everything. We can contribute through our perspectives, questions, lived experiences, and research interests. For me, NextGen was not only an opportunity to present, but also an invitation to keep learning, engaging, and thinking critically about how the Internet can remain open, inclusive, trusted, and usable for people across languages, regions, and communities.
    `,
    contentAr: `
هل فكرت يوماً في ما يحدث بالتحديد في تلك الأجزاء من الثانية بين كتابة اسم النطاق والضغط على زر الإدخال؟ بصراحة، أنا أيضاً لم أكن أفكر في ذلك. بالتأكيد، كنت أؤمن دائماً بأهمية حوكمة الإنترنت، لكنني كنت أراها كمفهوم تجريدي يفتقر إلى الأدوات العملية لفهمه بشكل كامل. وهنا جاءت فرصة المشاركة في برنامج NextGen@ICANN خلال مؤتمر ICANN86 والتي لم يكن بإمكاني تفويتها. عُقد البرنامج في إشبيلية بين 8 و11 يونيو، وركز على أعمال تطوير السياسات الحالية، والتواصل والتوعية، وفرص يومية لبناء شبكات التواصل مع المجتمع، والأهم من ذلك أنه وسع آفاق معرفتي وشبكة علاقاتي.

### الإنترنت مجتمع وليس مجرد كود برمجي

بفضل ICANN، أدركت أن الإنترنت ليس مجرد كود برمجي؛ بل هو مجتمع متكامل. بعبارة أخرى، إذا قمت بإزالة الطبقات التقنية للإنترنت، فلن تجد مجرد خوادم وبروتوكولات فحسب؛ بل ستجد بشراً وسياسات وتوازناً دقيقاً من الثقة الإنسانية. أتيحت لي الفرصة لاستكشاف كيفية تفاعل الأجزاء المختلفة من منظومة ICANN، بما في ذلك السجلات، والمُسجِّلين، وعمليات تطوير السياسات، ومنظمة دعم الأسماء العامة (GNSO)، والنموذج الأوسع متعدد أصحاب المصلحة. قد تبدو البنية معقدة في البداية، لكن هذا التعقيد يعكس عدد الفاعلين المشاركين في الحفاظ على استقرار الإنترنت وتوافقها وإمكانية الوصول إليها عالمياً.

### القبول الشامل والإدماج الرقمي متعدد اللغات

كجزء من مشاركتي في NextGen@ICANN، اعتليت المنصة للتحدث عن "القبول الشامل" (Universal Acceptance) والإدماج الرقمي متعدد اللغات، وهي قضية بالغة الأهمية ورغم ذلك يُغفل عنها كثيراً في إمكانية الوصول إلى الإنترنت عالمياً. انطلاقاً من تجربتي الشخصية كمتحدثة باللغة العربية، كانت القضية الجوهرية التي طرحتها هي: هل يمكن للأنظمة الرقمية التحقق بشكل صحيح من أسماء النطاقات وعناوين البريد الإلكتروني عبر جميع اللغات والخطوط؟ في الواقع، لا يقتصر الإدماج الرقمي على توصيل الأشخاص بالإنترنت فحسب، بل يتعلق بضمان رؤيتهم والاعتراف بهم واحترامهم بمجرد وصولهم إليها. ومن ثم، لا ينبغي للمجال الرقمي أن يكون سلاحاً آخر لضمان هيمنة لغة أو هوية واحدة على الأخرى، فقد تم تطويره في الأساس لربط البشر بغض النظر عن اختلافاتهم.

### جولة عالمية في مشهد حوكمة الإنترنت

أكثر ما أقدره في هذه التجربة هي الحوارات والتبادلات التي أجريتها مع المشاركين الآخرين في الدفعة. شعرت أن المناقشات التي شاركنا فيها كانت بمثابة جولة عالمية في مشهد حوكمة الإنترنت، حيث قدم كل شخص شيئاً فريداً لمشاركته مع الآخرين. غطت العروض التقديمية مواضيع مثل إساءة استخدام نظام أسماء النطاقات (DNS)، والتهديدات السيبرانية في البنية التحتية للنطاقات، والخصوصية في حوكمة أسماء النطاقات، وتجزئة الإنترنت، والفجوة الرقمية، والمداولات السياساتية المدعومة بالذكاء الاصطناعي، وديناميكيات المجتمع في حوكمة الإنترنت. معاً، ساعدتني هذه المواضيع على فهم مدى اتساع وتداخل هذا المجال.

### تمكين الشباب في الحوكمة الرقمية

والأهم من ذلك كله، ذكرني برنامج NextGen@ICANN86 بأن الشباب يمكنهم حقاً إحداث التغيير ولعب دور معنوي ومؤثر في حوكمة الإنترنت. لسنا بحاجة لدخول هذا المجال ونحن نعرف كل شيء مسبقاً. يمكننا المساهمة من خلال وجهات نظرنا، وأسئلتنا، وتجاربنا المعاشة، واهتماماتنا البحثية. بالنسبة لي، لم يكن NextGen مجرد فرصة للتقديم فحسب، بل كان أيضاً دعوة لمواصلة التعلم والتفاعل والتفكير النقدي حول كيفية بقاء الإنترنت مفتوحاً وشاملاً وموثوقاً وقابلاً للاستخدام للجميع عبر مختلف اللغات والمناطق والمجتمعات.
    `
  }
];
