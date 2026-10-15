"""
RAG logic for grounding CommandR's answers in the Tunisian digital-safety PDF
corpus under RAG-files/. Adapted from
https://github.com/jasmienjas/TanitBot/blob/main/rag_commandr.py, trimmed to
the retrieval/prompting core — model loading, quantization, and serving are
already handled by modal_transformers_app.py.
"""
import glob
import json
import os

DEFAULT_SYSTEM_INSTRUCTION = """# تعليمات لـ "تانيت بوت" (TanitBot System Prompt)

## 1. الهوية والدور الأساسي
أنت **تانيت بوت (TanitBot)**، مساعد ذكي وموثوق مختص في السلامة الرقمية والأمان السيبراني موجه للمستخدمين، الصحفيين، والنشطاء في تونس. دورك تقديم إرشادات تقنية وقانونية عملية، دقيقة، ومبنية على المراجع والدراسات الرسمية التونسية والدولية.

---

## 2. الإجابة عن الهوية والخدمات ("شكونك؟" / "شنوة تعمل؟" / "عسلامة")
إذا ألقى المستخدم التحية أو سألك عن هويتك أو طبيعة عملك، أجب بوضوح وهدوء دون مبالغة:
"عسلامة! أنا **تانيت بوت (TanitBot)**، مساعدك في السلامة الرقمية، حماية الخصوصية، ومكافحة التهديدات الإلكترونية في تونس.
نجم نعاونك في:
- التعامل مع حالات الابتزاز الإلكتروني والعنف الرقمي.
- تأمين حساباتك وأجهزتك ضد الاختراق والبرمجيات الخبيثة.
- التوجيه القانوني طبقاً للتشريعات التونسية (مثل القانون الأساسي عدد 58 لسنة 2017 ومجلة الاتصالات).
- توجيهك إلى الجهات الرسمية ومراكز الدعم (الشرطة العدلية، الخط الأخضر للكريديف 1805، والمنظمات الحقوقية).

تفضل، احكيلي شنوة الإشكال اللي يعترضك؟"

---

## 3. قواعد اللهجة والأسلوب (دارجة تونسية رصينة)
- **اللهجة:** استخدم الدارجة التونسية السليمة، البسيطة، والمهنية.
- **تجنب المشرقية:** ممنوع استعمال كلمات من لهجات أخرى (مثل: عايز، كده، دي، علشان، بتاع، شوية).
- **تجنب الابتذال:** لا تستخدم ألقاباً غير مهنية (مثل: يا باهي، صديقي، عزيزي).
- **النبرة:** مطمئنة، محترفة، وتدعم المستخدم في مواقف الضغط دون تهويل أو عاطفة زائدة.
- **اللغات الأخرى:** إذا كتب المستخدم بالإنجليزية أو الفرنسية، أجب بنفس اللغة مع الحفاظ على نفس التوجيهات والمراجع التونسية.

---

## 4. بروتوكول الأمان وحالات الابتزاز الإلكتروني (Safety Protocol)
في حالات التهديد والابتزاز أو اختراق الحسابات، التزم بالخطوات الوقائية التالية:
1. **عدم التفاوض:** لا تتجاوب مع المبتز، ولا ترسل أي مبالغ مالية أو بيانات/صور إضافية.
2. **توثيق الأدلة فوراً:** أخذ لقطات شاشة (Screenshots) واضحة للمحادثات، الحسابات، الروابط، وأرقام الهواتف وحفظها دون حذف.
3. **قطع الاتصال:** حظر حساب المبتز (Block) والإبلاغ عنه داخل المنصة (Report).
4. **التوجه للسلطات ومراكز الدعم:** تقديم شكاية لدى الإدارة الفرعية للوقاية الاجتماعية / الشرطة العدلية بتونس، أو الاتصال بالرقم الأخضر المجاني لمركز الكريديف (1805) أو المنظمات المختصة (مثل جمعية النساء الديمقراطيات أو منظمة Access Now).

---

## 5. الاعتماد على المصادر وتوثيق الاستشهاد الكامل (Full Citations)
- اعتمد حصراً على السياق المرفق (Retrieved Context) في أي معلومة قانونية، تقنية، إحصائية، أو إجرائية.
- لا تخترع أرقام فصول قانونية أو نصوصاً غير موجودة بالسياق.
- **التوثيق الإلزامي داخل النص:** ضع المصدر ورقم الصفحة مباشرة في نهاية كل معلومة أو خطوة مستفادة من السياق بالصيغة التالية:
  `[المصدر: اسم_المصدر_الكامل، صفحة X]`
- **اسم المصدر الكامل:** انقل الاسم الكامل للمصدر كما هو مذكور بجانب "المصدر الكامل:" في السياق حرفياً دون اختصار (مثال: `[المصدر: دراسة الأبعاد القانونية للعنف ضد النساء في الفضاء الرقمي - مركز الكريديف (تونس، 2021)، إعداد القاضية أنوار منصري، صفحة 14]`).
- **قائمة المراجع في نهاية الإجابة:** اختم إجابتك بقسم مراجع منظم بالصيغة:
  📚 **المراجع المعتمدة:**
  - اسم المصدر الكامل (صفحة X)

---

## 6. هيكل الإجابة وقواعد الصياغة
- **الإيجاز والتركيز:** قدم الحل في 3 إلى 4 نقاط مرتبة ومباشرة (Bullet Points). تجنب المقدمات الطويلة المكررة لمنع انقطاع الإجابة.
- **المصطلحات التقنية:** اشرح المفاهيم (مثل 2FA, VPN, Phishing) بأسلوب مبسط عند ذكرها لأول مرة.
- **سؤال المتابعة:** اختم إجابتك بسؤال توجيهي ذكي ومباشر لمساعدة المستخدم في تحديد الخطوة الموالية (مثال: "هل المبتز طلب منك مبالغ مالية أو يهدد بنشر صور؟").

---

## 7. متابعة المحادثة وسياق الأسئلة السابقة (Multi-Turn Continuity)
- إذا كانت هذه رسالة متابعة أو سؤالاً تكميلياً لمحادثة جارية:
  - لا تكرر التحية أو تعيد التعريف بنفسك («عسلامة! أنا تانيت بوت...»).
  - أجب مباشرة وبشكل متصل بالرسائل السابقة وأكمل الإرشاد بناءً على تفاصيل المستخدم الجديدة.
  - حافظ على سياق المشكلة الأساسية التي ذكرها المستخدم في الرسائل السابقة واستشهد بالمصادر ذات الصلة."""


def load_system_instructions() -> str:
    """Loads system instructions from System_Instructions.MD if found, falling back to default."""
    candidate_paths = [
        "/root/System_Instructions.MD",
        os.path.join(os.path.dirname(__file__), "System_Instructions.MD"),
        "System_Instructions.MD",
    ]
    for p in candidate_paths:
        if os.path.exists(p):
            try:
                with open(p, "r", encoding="utf-8") as f:
                    content = f.read().strip()
                if content:
                    return content
            except Exception:
                pass
    return DEFAULT_SYSTEM_INSTRUCTION


SYSTEM_INSTRUCTION = DEFAULT_SYSTEM_INSTRUCTION

USER_PROMPT_TEMPLATE = """السياق المرفق (Retrieved Context):
{context}

سؤال المستخدم: {query}

تعليمات الإجابة:
- أجب عن السؤال بالدارجة التونسية بشكل مباشر وعملي.
- إذا كانت هذه متابعة لمحادثة سابقة، اربط إجابتك مباشرة بسياق ما تم الحديث عنه ولا تعد التعريف بنفسك.
- وثّق إجابتك بالمصدر ورقم الصفحة من السياق المرفق أعلاه، واختم إجابتك حتماً بذكر:
📚 **المراجع المعتمدة:**
- اسم المصدر الكامل (صفحة X)"""

_SOURCE_NAME_MAP = {
    "Digital-Safety-Guide-JOSA-FB-Arabic.pdf": "دليل السلامة الرقمية لحماية الحسابات والبيانات - الجمعية الأردنية للمصدر المفتوح (JOSA) وميتا (Meta)",
    "Digital-Safety-Toolkit-Nevada.pdf": "دليل أدوات السلامة الرقمية ومكافحة العنف السيبراني (NCEDSV)",
    "Digital-Security-Arabic.pdf": "دليل تدريب الأمن السيبراني والرقمي - أكاديمية UNPO ومؤسسة نو موري سيكريتس (UNPO)",
    "EU-WP2016 2-3 1 Cyber Hygiene.pdf": "دليل ممارسات النظافة السيبرانية وتأمين المنظومات - وكالة الاتحاد الأوروبي للأمن السيبراني (ENISA)",
    "MENA-PSS-Manual-English.pdf": "دليل الدعم النفسي والاجتماعي لضحايا العنف الرقمي - مؤسسة SecDev Foundation",
    "Tunisia-DVAW-2021-legal-dimensions-AR.pdf": "دراسة الأبعاد القانونية للعنف ضد النساء في الفضاء الرقمي - مركز الكريديف (تونس، 2021)، إعداد القاضية أنوار منصري",
    "Tunisia-DVAW-2021-women-in-journalism-AR.pdf": "دراسة العنف الرقمي المسلط ضد الصحفيات في تونس - مركز البحوث والدراسات والتوثيق والإعلام حول المرأة (الكريديف)، إعداد هدى الحاج قاسم (2021)",
    "MENA-Tunisia-DVAW-2022-CREDIF-Review-Issue53-ARFR.pdf": "مجلة إعلام المرأة - العدد 53: العنف الرقمي المسلط على النساء والفتيات - مركز الكريديف (تونس، 2022)",
    "FB_CoC_EXTERNAL_en_EN_Update_Final-6_2-FINAL-ua.pdf": "مدونة سلوك فيسبوك لمكافحة خطاب الكراهية والعنف - شركة ميتا (Meta)",
    "FB-stay-safe-online-1.pdf": "دليل السلامة والأمان على الإنترنت وحماية الحسابات - شركة ميتا (Meta / Facebook)",
    "digital security guide mena arabic-access now.pdf": "دليل الأمان الرقمي للناشطين والمستخدمين في الشرق الأوسط وشمال إفريقيا - منظمة أكسس ناو (Access Now)",
    "Wesnet_A-guide-to-staying-safe-on-Meta-WEB-1.pdf": "دليل البقاء بأمان على منصات ميتا وحماية الخصوصية - شبكة WESNET وميتا (Meta)",
    "AI-civilsociety-simsim-Morocco.pdf": "دليل أدوات الذكاء الاصطناعي والمجتمع المدني (جمعية سمسم للمشاركة المواطنة)",
    "a-guide-to-staying-safe-on-facebook.pdf": "دليل البقاء آمناً وحماية الخصوصية على فيسبوك - شركة ميتا (Meta)",
    "NNEDV-FB+Guide_2015_Online_English_US-version.pdf": "دليل الخصوصية والسلامة الرقمية على فيسبوك - الشبكة الوطنية لإنهاء العنف الأسري (NNEDV)",
    "data_and_cybersecurity_The-study_of_Facebook_Meta.pdf": "دراسة حماية البيانات والخصوصية والأمن السيبراني على منصات التواصل (Meta)",
    "Digital Security Training_Ar.pptx.pdf": "حقيبة تدريب الأمان الرقمي وحماية الاتصالات والهواتف (Digital Security Training)",
    "DRI Tunisia - Les impacts de la trandformation digitale sur la transition démocratique en Tunisie  - .pdf": "دراسة تأثيرات التحول الرقمي على مسار الانتقال الديمقراطي في تونس - المنظمة الدولية للتقرير عن الديمقراطية (DRI Tunisia)",
}


RAG_INDEX_VERSION = 4

ARABIC_TEXT_SEPARATORS = [
    "\n\n",
    "\n",
    ". ",
    "؟ ",
    "! ",
    "؛ ",
    "، ",
    " ",
    "",
]


def _format_passage(text: str) -> str:
    """Formats document passages for asymmetric embedding models (e.g. Multilingual E5)."""
    return f"passage: {text}"


def _format_query(query: str) -> str:
    """Formats search queries for asymmetric embedding models (e.g. Multilingual E5)."""
    return f"query: {query}"


def clean_and_normalize_text(text: str) -> str:
    """Standardizes Arabic presentation forms, corrects font ligature errors,
    strips non-printable artifacts, and normalizes whitespace."""
    if not text:
        return ""
    import re
    import unicodedata

    # 1. Unicode NFKC normalization (turns presentation forms \uFB50-\uFEFF into standard Arabic characters)
    text = unicodedata.normalize("NFKC", text)

    # 2. Normalize Farsi/Urdu character variants to standard Arabic
    text = text.replace("\u06CC", "\u064A")  # Farsi Yeh -> Arabic Yeh
    text = text.replace("\u06A9", "\u0643")  # Keheh -> Arabic Kaf
    text = text.replace("\u06BE", "\u0647")  # Heh Doachashmee -> Arabic Heh
    text = text.replace("\u06C0", "\u0647")  # Heh with Yeh above -> Arabic Heh

    # 3. Fix known Arabic PDF font ligature and letter-swapping bugs
    text = re.sub(r"\bيف\b", "في", text)
    text = re.sub(r"\bعىل\b", "على", text)
    text = re.sub(r"\bإىل\b", "إلى", text)

    # 4. Strip tatweel/kashida (\u0640) and zero-width/formatting artifacts
    text = re.sub(r"[\u0640\u200b-\u200f\ufeff\u202a-\u202e]", "", text)

    # 5. Remove stray phonetic / private-use symbols found in corrupted PDF encodings
    text = re.sub(r"[\u18B0-\u18FF\u1900-\u194F\u0F00-\u0FFF]", "", text)

    # 6. Normalize whitespace while preserving line structure
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()


def get_clean_source_name(filename: str) -> str:
    if filename in _SOURCE_NAME_MAP:
        return _SOURCE_NAME_MAP[filename]
    return filename.replace(".pdf", "").replace("-", " ").replace("_", " ").strip()


def _extract_documents(pdf_dir: str) -> list[dict]:
    import pymupdf

    documents = []
    for pdf_path in sorted(glob.glob(os.path.join(pdf_dir, "*.pdf"))):
        filename = os.path.basename(pdf_path)
        try:
            doc = pymupdf.open(pdf_path)
            for page_idx, page in enumerate(doc):
                raw_text = page.get_text("text") or ""
                cleaned_text = clean_and_normalize_text(raw_text)
                if cleaned_text:
                    documents.append({"text": cleaned_text, "metadata": {"source": filename, "page": page_idx + 1}})
        except Exception as e:
            print(f"[!] Skipping unreadable PDF {filename}: {e}")
    return documents


def build_index(pdf_dir: str, embed_model):
    import faiss
    import numpy as np
    from langchain_text_splitters import RecursiveCharacterTextSplitter

    documents = _extract_documents(pdf_dir)
    if not documents:
        raise RuntimeError(f"No extractable text found in any PDF under {pdf_dir}")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1100,
        chunk_overlap=200,
        separators=ARABIC_TEXT_SEPARATORS,
    )
    chunks = [
        {"text": chunk_text, "metadata": doc["metadata"]}
        for doc in documents
        for chunk_text in splitter.split_text(doc["text"])
    ]

    embeddings = embed_model.encode(
        [_format_passage(c["text"]) for c in chunks], normalize_embeddings=True, show_progress_bar=False
    )
    embeddings = np.asarray(embeddings, dtype="float32")

    index = faiss.IndexFlatIP(embeddings.shape[1])
    index.add(embeddings)
    return index, chunks


def _index_paths(index_dir: str) -> tuple[str, str]:
    return os.path.join(index_dir, "faiss_index.bin"), os.path.join(index_dir, "chunks_metadata.json")


def _is_index_up_to_date(pdf_dir: str, index_dir: str) -> bool:
    index_file, meta_file = _index_paths(index_dir)
    if not os.path.exists(index_file) or not os.path.exists(meta_file):
        return False

    import unicodedata
    pdf_filenames = {unicodedata.normalize("NFKC", os.path.basename(f)) for f in glob.glob(os.path.join(pdf_dir, "*.pdf"))}
    try:
        with open(meta_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, dict):
            if data.get("version") != RAG_INDEX_VERSION:
                return False
            chunks = data.get("chunks", [])
        else:
            # Stale format (raw list without version key)
            return False
        indexed_filenames = {unicodedata.normalize("NFKC", c["metadata"]["source"]) for c in chunks if "metadata" in c}
        return pdf_filenames == indexed_filenames
    except Exception:
        return False


def _save_index(index, chunks: list[dict], index_dir: str) -> None:
    import faiss

    os.makedirs(index_dir, exist_ok=True)
    index_file, meta_file = _index_paths(index_dir)
    faiss.write_index(index, index_file)
    meta_payload = {
        "version": RAG_INDEX_VERSION,
        "chunks": chunks,
    }
    with open(meta_file, "w", encoding="utf-8") as f:
        json.dump(meta_payload, f, ensure_ascii=False)


def _load_index(index_dir: str):
    import faiss

    index_file, meta_file = _index_paths(index_dir)
    index = faiss.read_index(index_file)
    with open(meta_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    chunks = data["chunks"] if isinstance(data, dict) and "chunks" in data else data
    return index, chunks


def build_or_load_index(pdf_dir: str, index_dir: str, embed_model) -> tuple[object, list[dict], bool]:
    """Returns (index, chunks, was_rebuilt) — was_rebuilt tells the caller whether
    to commit the volume backing index_dir so the build persists for future cold starts."""
    if _is_index_up_to_date(pdf_dir, index_dir):
        print(f"[+] Loading cached RAG index from {index_dir}")
        index, chunks = _load_index(index_dir)
        return index, chunks, False

    print(f"[+] Building RAG index from {pdf_dir} (cache missing or stale)")
    index, chunks = build_index(pdf_dir, embed_model)
    _save_index(index, chunks, index_dir)
    return index, chunks, True


QUERY_REWRITE_SYSTEM = """أنت خبير في صياغة استعلامات البحث لأنظمة الأمان الرقمي واسترجاع المعلومات.
مهمتك: تحويل رسالة المستخدم (التي قد تكون بالدارجة التونسية، العربية، الفرنسية أو لغة مختلطة) إلى كلمات مفتاحية دقيقة للبحث في وثائق الأمان الرقمي:
1. مصطلحات البحث الأساسية باللغة العربية الفصحى (مثل: اختراق حساب، ابتزاز إلكتروني، حماية فيسبوك، شكاية أمنية).
2. المصطلحات التقنية المقابلة باللغة الإنجليزية (مثل: account recovery, sextortion, 2FA, phishing).
اكتب الكلمات المفتاحية فقط مفصولة بمسافات، دون أي مقدمات أو شروحات أو علامات تنصيص."""


def build_rewrite_messages(messages: list[dict]) -> list[dict]:
    """Constructs chat messages to have the LLM rewrite the user query into MSA and English keywords."""
    if not messages:
        raise ValueError("messages must not be empty")

    recent_turns = messages[-3:] if len(messages) > 3 else messages
    return [
        {"role": "system", "content": QUERY_REWRITE_SYSTEM},
        *recent_turns,
    ]


def rerank(query: str, candidates: list[dict], reranker, top_k: int = 4) -> list[dict]:
    """Reranks candidate chunks using a cross-encoder model and returns top_k."""
    if not candidates or not reranker:
        return candidates[:top_k]

    pairs = [(query, item["chunk"]["text"]) for item in candidates]
    scores = reranker.predict(pairs)

    reranked = []
    for idx, item in enumerate(candidates):
        score = float(scores[idx]) if hasattr(scores, "__getitem__") else float(scores)
        reranked.append({
            "chunk": item["chunk"],
            "score": score,
            "dense_score": item.get("score", 0.0),
        })

    reranked.sort(key=lambda x: x["score"], reverse=True)
    return reranked[:top_k]


def get_search_query(messages: list[dict]) -> str:
    """Extracts contextual search query from conversation history for follow-ups."""
    if not messages:
        return ""
    user_turns = [m["content"].strip() for m in messages if m.get("role") == "user" and m.get("content")]
    if not user_turns:
        return ""
    if len(user_turns) == 1:
        return user_turns[-1]
    return f"{user_turns[-2]} {user_turns[-1]}"


def retrieve(
    query: str,
    index,
    chunks: list[dict],
    embed_model,
    reranker=None,
    rewritten_query: str = None,
    retrieve_k: int = 20,
    top_k: int = 4,
) -> list[dict]:
    queries = [query]
    if rewritten_query and rewritten_query.strip() and rewritten_query.strip() != query.strip():
        queries.append(rewritten_query.strip())

    formatted_queries = [_format_query(q) for q in queries]
    query_vectors = embed_model.encode(formatted_queries, normalize_embeddings=True).astype("float32")

    k_per_query = min(max(retrieve_k, top_k), len(chunks))
    distances, indices = index.search(query_vectors, k_per_query)

    seen_indices = set()
    candidates = []

    for q_idx in range(len(queries)):
        for idx, dist in zip(indices[q_idx], distances[q_idx]):
            if 0 <= idx < len(chunks) and idx not in seen_indices:
                seen_indices.add(idx)
                candidates.append({
                    "chunk": chunks[idx],
                    "score": float(dist),
                    "chunk_idx": int(idx),
                })

    candidates = candidates[:max(retrieve_k, top_k)]

    if reranker is not None:
        return rerank(query, candidates, reranker, top_k=top_k)
    return candidates[:top_k]


def _build_context_block(retrieved_items: list[dict]) -> str:
    blocks = []
    for i, item in enumerate(retrieved_items):
        source = get_clean_source_name(item["chunk"]["metadata"]["source"])
        page = item["chunk"]["metadata"]["page"]
        blocks.append(f"المستند [{i + 1}]:\nالمصدر الكامل: {source}\nرقم الصفحة: {page}\nمحتوى النص:\n{item['chunk']['text']}")
    return "\n\n".join(blocks)


def build_rag_messages(messages: list[dict], retrieved_items: list[dict]) -> list[dict]:
    if not messages or messages[-1]["role"] != "user":
        raise ValueError("messages must end with a user message")

    query = messages[-1]["content"]
    wrapped_query = USER_PROMPT_TEMPLATE.format(context=_build_context_block(retrieved_items), query=query)
    return [
        {"role": "system", "content": load_system_instructions()},
        *messages[:-1],
        {"role": "user", "content": wrapped_query},
    ]
