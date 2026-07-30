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

SYSTEM_INSTRUCTION = """أنت خبير محترف وموثوق في السلامة الرقمية والأمن السيبراني (Digital Safety Expert) لمساعدة المستخدمين التوانسة وحمايتهم من المخاطر الرقمية.
أجب عن سؤال المستخدم بالاعتماد على سياق المعلومات المرفق (Retrieved Context) الذي يحتوي على مستندات أمان رقمي باللغة العربية والانجليزية.

اتبع القواعد التالية بدقة:
1. قواعد السلامة الرقمية ومكافحة الابتزاز (هام جداً):
   - تحذير حرج: لا تنصح المستخدم أبداً بأفعال قد تعرض سلامته أو خصوصيته للخطر.
   - يمنع منعاً باتاً اقتراح ردود فعل علنية أو تنظيم حملات مضادة على منصات التواصل الاجتماعي، أو محاولة التواصل مع المبتز/المهدد والتفاوض معه.
   - التزم بالخطوات القياسية والآمنة للتعامل مع الابتزاز والعنف الرقمي:
     1. المحافظة على الهدوء وعدم الاستسلام أو التجاوب مع التهديدات (عدم إرسال أموال أو صور إضافية).
     2. جمع وتوثيق الأدلة فوراً وبدقة (أخذ لقطات شاشة واضحة للمحادثات، الحسابات، الروابط، وأرقام الهواتف) دون حذفها، وحفظها في مكان آمن.
     3. قطع الاتصال تماماً بالجهة المبتزة (حظر الحسابات Block) والإبلاغ عنها داخل المنصة الرقمية (Report).
     4. التوجه الفوري إلى السلطات الأمنية المختصة (الإدارة الفرعية للوقاية الاجتماعية أو إدارة الشرطة العدلية بتونس، أو القضاء) وتقديم شكاية رسمية استناداً للقوانين التونسية (مثل القانون الأساسي عدد 58 لسنة 2017 المتعلق بالقضاء على العنف ضد المرأة)، والاتصال بمراكز الدعم أو الجمعيات الحقوقية (مثل جمعية النساء الديمقراطيات أو الكريديف على الرقم الأخضر 1805).

2. اللغة والأسلوب (دارجة تونسية قحّة):
   - يجب أن تكون الإجابة كاملة بالدارجة التونسية (Derja) بأسلوب مبسط، واضح، ومحترف للغاية.
   - تنبيه هام جداً: لا تكتب أبداً باللهجة المصرية أو الخليجية (تجنب تماماً كلمات مثل: "عايز"، "كده"، "دي"، "إيه"، "علشان"، "بتاع"، "شوية"، "هكذا"، "دون"، "نقدر").
   - تجنب تماماً الكلمات المبتذلة أو غير المهنية مثل "صديقي" أو "يا باهي" أو "friend" أو "عزيزي". كن رصيناً ومحترفاً في كلامك.

3. التفاعل والأسئلة التوجيهية (هام جداً):
   - في نهاية إجابتك، اطرح سؤالاً توجيهياً أو سؤال متابعة (Follow-up question) واحد بذكاء لمساعدة المستخدم على توضيح مشكلته أكثر (مثال: هل ما زلت تدخل لحسابك؟ هل فما شكون يبتز فيك؟).
   - كن تفاعلياً ومشاركاً وحاول فهم تفاصيل التهديد لتقديم حل دقيق ومخصص.

4. توثيق المراجع والملفات (هام جداً):
   - يجب عليك توثيق مصدر كل معلومة تذكرها من السياق المرفق.
   - اكتب اسم المصدر ورقم الصفحة في نهاية الجملة مباشرة مستخدماً الصيغة التالية حرفياً: [المصدر: اسم_المصدر، صفحة X]
   - تنبيه حاسم جداً: "اسم_المصدر" هو القيمة المكتوبة بجانب كلمة "المصدر:" في السياق المرفق حرفياً وبشكل كامل دون أي تغيير أو اختصار. انقل العنوان الكامل المكتوب في السياق حرفياً.
   - خذ اسم المصدر ورقم الصفحة بدقة من البيانات المرافقة لكل مستند في السياق. لا تخترع أسماء ملفات أبداً.

5. المصطلحات التقنية: استخدم المصطلحات التقنية المعروفة (مثل VPN, 2FA, Password Manager) مع شرحها بالدارجة التونسية بطريقة مبسطة جداً عند ذكرها لأول مرة.

6. الهيكلة والتركيز الشديد (منعاً لانقطاع الإجابة):
   - قدّم الإجابة في نقاط واضحة (Bullet points) لخطوات عملية متسلسلة.
   - اقتصر على 3 نقاط فقط كحد أقصى، واجعل كل نقطة قصيرة جداً (لا تتجاوز جملة واحدة بسيطة ومباشرة).
   - لا تكتب مقدمات طويلة أو خاتمة مكررة لضمان سرعة توليد الإجابة ومنع انقطاع الاتصال.

7. النبرة والأداء العالي: نبرة مطمئنة، محترفة وموثوقة، خالية من العاطفة الزائدة، ولكن فيها تعاطف ودعم حقيقي للمستخدم الذي يمر بظرف صعب رقمياً (مثل حالات الابتزاز أو العنف الرقمي). ركّز على النقاط الأساسية وتجنب الشروح الطويلة غير الضرورية لضمان سرعة توليد الإجابة."""

USER_PROMPT_TEMPLATE = """السياق المرفق (Retrieved Context):
{context}

سؤال المستخدم: {query}"""

_SOURCE_NAME_MAP = {
    "Digital-Safety-Guide-JOSA-FB-Arabic.pdf": "دليل السلامة الرقمية (JOSA & Facebook)",
    "Digital-Safety-Toolkit-Nevada.pdf": "دليل السلامة الرقمية (NCEDSV)",
    "Digital-Security-Arabic.pdf": "تدريب الأمن السيبراني الرقمي (UNPO Academy)",
    "EU-WP2016 2-3 1 Cyber Hygiene.pdf": "مراجعة ممارسات النظافة السيبرانية (ENISA)",
    "MENA-PSS-Manual-English.pdf": "دليل الدعم النفسي والاجتماعي للناجيات من العنف الرقمي (SecDev)",
    "Tunisia-DVAW-2021-legal-dimensions-AR.pdf": "دراسة الكريديف حول واقع النصوص القانونية والعنف الرقمي - أنوار منصري (2021)",
    "Tunisia-DVAW-2021-women-in-journalism-AR.pdf": "دراسة الكريديف حول العنف الرقمي ضد الصحفيات التونسيات - هدى الحاج قاسم (2021)",
    "MENA-Tunisia-DVAW-2022-CREDIF-Review-Issue53-ARFR.pdf": "مجلة الكريديف عدد 53: العنف الرقمي ضد النساء والفتيات (2022)",
    "FB_CoC_EXTERNAL_en_EN_Update_Final-6_2-FINAL-ua.pdf": "مدونة سلوك فيسبوك بشأن مكافحة خطاب الكراهية (Meta)",
    "FB-stay-safe-online-1.pdf": "دليل فيسبوك للسلامة على الإنترنت (Meta)",
    "digital security guide mena arabic-access now.pdf": "دليل الأمن الرقمي لمنطقة الشرق الأوسط وشمال إفريقيا (Access Now)",
    "Wesnet_A-guide-to-staying-safe-on-Meta-WEB-1.pdf": "دليل السلامة على منصات Meta (WESNET)",
    "AI-civilsociety-simsim-Morocco.pdf": "دليل الذكاء الاصطناعي والمجتمع المدني (Simsim - المغرب)",
    "a-guide-to-staying-safe-on-facebook.pdf": "دليل السلامة على فيسبوك (Meta)",
    "NNEDV-FB+Guide_2015_Online_English_US-version.pdf": "دليل السلامة على فيسبوك (NNEDV)",
    "data_and_cybersecurity_The-study_of_Facebook_Meta.pdf": "دراسة حماية البيانات والأمن السيبراني على فيسبوك (Meta)",
    "Digital Security Training_Ar.pptx.pdf": "تدريب الأمن الرقمي",
    "DRI Tunisia - Les impacts de la trandformation digitale sur la transition démocratique en Tunisie  - .pdf": "دراسة DRI حول تأثير التحول الرقمي على الانتقال الديمقراطي في تونس",
}


def get_clean_source_name(filename: str) -> str:
    if filename in _SOURCE_NAME_MAP:
        return _SOURCE_NAME_MAP[filename]
    return filename.replace(".pdf", "").replace("-", " ").replace("_", " ").strip()


def _extract_documents(pdf_dir: str) -> list[dict]:
    import logging

    from pypdf import PdfReader

    # pypdf logs an INFO line per object it finds while recovering a malformed
    # cross-reference table, which can flood the logs and add real overhead
    # over Modal's log-streaming pipeline for large or malformed PDFs.
    logging.getLogger("pypdf").setLevel(logging.ERROR)

    documents = []
    for pdf_path in sorted(glob.glob(os.path.join(pdf_dir, "*.pdf"))):
        filename = os.path.basename(pdf_path)
        try:
            reader = PdfReader(pdf_path)
            for page_idx, page in enumerate(reader.pages):
                text = (page.extract_text() or "").strip()
                if text:
                    documents.append({"text": text, "metadata": {"source": filename, "page": page_idx + 1}})
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

    splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=120)
    chunks = [
        {"text": chunk_text, "metadata": doc["metadata"]}
        for doc in documents
        for chunk_text in splitter.split_text(doc["text"])
    ]

    embeddings = embed_model.encode(
        [c["text"] for c in chunks], normalize_embeddings=True, show_progress_bar=False
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

    pdf_filenames = {os.path.basename(f) for f in glob.glob(os.path.join(pdf_dir, "*.pdf"))}
    with open(meta_file, "r", encoding="utf-8") as f:
        chunks = json.load(f)
    indexed_filenames = {c["metadata"]["source"] for c in chunks if "metadata" in c}

    # Filename-set comparison only (not mtimes): local PDFs are mounted fresh into
    # each container, so their mtimes reflect mount time, not actual content changes.
    return pdf_filenames == indexed_filenames


def _save_index(index, chunks: list[dict], index_dir: str) -> None:
    import faiss

    os.makedirs(index_dir, exist_ok=True)
    index_file, meta_file = _index_paths(index_dir)
    faiss.write_index(index, index_file)
    with open(meta_file, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False)


def _load_index(index_dir: str):
    import faiss

    index_file, meta_file = _index_paths(index_dir)
    index = faiss.read_index(index_file)
    with open(meta_file, "r", encoding="utf-8") as f:
        chunks = json.load(f)
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


def retrieve(query: str, index, chunks: list[dict], embed_model, top_k: int = 4) -> list[dict]:
    query_vector = embed_model.encode([query], normalize_embeddings=True).astype("float32")
    distances, indices = index.search(query_vector, top_k)
    return [
        {"chunk": chunks[idx], "score": float(dist)}
        for idx, dist in zip(indices[0], distances[0])
        if 0 <= idx < len(chunks)
    ]


def _build_context_block(retrieved_items: list[dict]) -> str:
    blocks = []
    for i, item in enumerate(retrieved_items):
        source = get_clean_source_name(item["chunk"]["metadata"]["source"])
        page = item["chunk"]["metadata"]["page"]
        blocks.append(f"المستند [{i + 1}]:\nالمصدر: {source}\nالصفحة: {page}\nالنص:\n{item['chunk']['text']}")
    return "\n\n".join(blocks)


def build_rag_messages(messages: list[dict], retrieved_items: list[dict]) -> list[dict]:
    if not messages or messages[-1]["role"] != "user":
        raise ValueError("messages must end with a user message")

    query = messages[-1]["content"]
    wrapped_query = USER_PROMPT_TEMPLATE.format(context=_build_context_block(retrieved_items), query=query)
    return [
        {"role": "system", "content": SYSTEM_INSTRUCTION},
        *messages[:-1],
        {"role": "user", "content": wrapped_query},
    ]
