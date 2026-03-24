// lib/i18n.ts — semua terjemahan app

export const LANGUAGES = [
  { code: "en", name: "English",    flag: "🇬🇧" },
  { code: "id", name: "Indonesia",  flag: "🇮🇩" },
  { code: "ru", name: "Русский",    flag: "🇷🇺" },
  { code: "zh", name: "中文",        flag: "🇨🇳" },
  { code: "ar", name: "العربية",    flag: "🇸🇦" },
] as const;

export type LangCode = typeof LANGUAGES[number]["code"];
export const DEFAULT_LANG: LangCode = "en";

// ─────────────────────────────────────────────────────────────────────────────
// Translation map
// ─────────────────────────────────────────────────────────────────────────────
export const translations = {
  // ── Nav labels ──────────────────────────────────────────────────────────────
  nav: {
    home:    { en: "Home",    id: "Beranda", ru: "Главная",   zh: "首页",  ar: "الرئيسية" },
    faq:     { en: "FAQ",     id: "FAQ",     ru: "FAQ",       zh: "常见问题", ar: "الأسئلة" },
    privacy: { en: "Privacy", id: "Privasi", ru: "Конфиденциальность", zh: "隐私", ar: "الخصوصية" },
    guide:   { en: "Guide",   id: "Panduan", ru: "Руководство", zh: "指南", ar: "الدليل" },
    docs:    { en: "API Docs",id: "Docs API",ru: "API Документы", zh: "API 文档", ar: "توثيق API" },
  },

  // ── Common UI ──────────────────────────────────────────────────────────────
  ui: {
    paste:           { en: "Paste from Clipboard",   id: "Tempel dari Clipboard",   ru: "Вставить из буфера",    zh: "从剪贴板粘贴",   ar: "لصق من الحافظة" },
    pasted:          { en: "Pasted!",                id: "Berhasil Ditempel!",       ru: "Вставлено!",            zh: "已粘贴！",       ar: "تم اللصق!" },
    download_now:    { en: "Download Now",           id: "Unduh Sekarang",           ru: "Скачать",               zh: "立即下载",       ar: "تحميل الآن" },
    processing:      { en: "Processing...",          id: "Memproses...",             ru: "Обработка...",          zh: "处理中...",      ar: "جاري المعالجة..." },
    processing_video:{ en: "Processing video...",    id: "Sedang memproses video...",ru: "Обработка видео...",    zh: "正在处理视频...", ar: "جاري معالجة الفيديو..." },
    result_title:    { en: "Download Result",        id: "Hasil Download",           ru: "Результат",             zh: "下载结果",       ar: "نتيجة التحميل" },
    example_link:    { en: "Example Link",           id: "Contoh Link",              ru: "Пример",                zh: "示例链接",       ar: "رابط مثال" },
    how_it_works:    { en: "How It Works",           id: "Cara Kerja",               ru: "Как это работает",      zh: "使用方法",       ar: "كيف يعمل" },
    help:            { en: "Help",                   id: "Bantuan",                  ru: "Помощь",                zh: "帮助",           ar: "المساعدة" },
    no_media:        { en: "No media available.",    id: "Tidak ada media tersedia.", ru: "Медиа недоступны.",     zh: "暂无可用媒体。",  ar: "لا توجد وسائط." },
  },

  // ── Download button labels ─────────────────────────────────────────────────
  dl: {
    hd_no_wm:   { en: "HD No Watermark",      id: "HD Tanpa Watermark",      ru: "HD без водяного знака", zh: "HD 无水印",      ar: "HD بدون علامة مائية" },
    sd_no_wm:   { en: "SD No Watermark",      id: "SD Tanpa Watermark",      ru: "SD без водяного знака", zh: "SD 无水印",      ar: "SD بدون علامة مائية" },
    with_wm:    { en: "Download with Watermark", id: "Download dengan Watermark", ru: "Скачать с водяным знаком", zh: "下载含水印版", ar: "تحميل مع علامة مائية" },
    audio:      { en: "Download Audio/Music", id: "Download Audio/Musik",    ru: "Скачать аудио",         zh: "下载音频/音乐",   ar: "تحميل الصوت/الموسيقى" },
    video_no_wm:{ en: "Download Video (No Watermark)", id: "Download Video Tanpa Watermark", ru: "Скачать видео (без знака)", zh: "下载视频（无水印）", ar: "تحميل الفيديو بلا علامة" },
    slideshow:  { en: "Slideshow detected", id: "Slideshow terdeteksi",      ru: "Обнаружен слайдшоу",    zh: "检测到幻灯片",    ar: "تم اكتشاف عرض شرائح" },
    images:     { en: "images",             id: "gambar",                    ru: "изображений",           zh: "张图片",          ar: "صور" },
  },

  // ── Search UI
  search: {
    tab_download:  { en: "Download",          id: "Unduh",               ru: "Скачать",           zh: "下载",          ar: "تنزيل" },
    tab_search:    { en: "Search Videos",     id: "Cari Video",          ru: "Поиск видео",       zh: "搜索视频",       ar: "البحث عن مقاطع" },
    placeholder:   { en: "Search TikTok videos...", id: "Cari video TikTok...", ru: "Поиск видео TikTok...", zh: "搜索 TikTok 视频...", ar: "ابحث عن مقاطع TikTok..." },
    btn:           { en: "Search",            id: "Cari",                ru: "Искать",            zh: "搜索",           ar: "بحث" },
    searching:     { en: "Searching...",      id: "Mencari...",          ru: "Поиск...",          zh: "搜索中...",      ar: "جاري البحث..." },
    results:       { en: "results for",       id: "hasil untuk",         ru: "результатов для",   zh: "个结果，关键词：", ar: "نتيجة لـ" },
    no_results:    { en: "No videos found.",  id: "Tidak ada video.",    ru: "Видео не найдено.", zh: "未找到视频。",    ar: "لم يُعثر على مقاطع." },
    play_preview:  { en: "Preview",           id: "Pratinjau",           ru: "Превью",            zh: "预览",           ar: "معاينة" },
    load_more:     { en: "Load More",         id: "Muat Lebih Banyak",   ru: "Загрузить ещё",    zh: "加载更多",       ar: "تحميل المزيد" },
    loading_more:  { en: "Loading...",        id: "Memuat...",           ru: "Загрузка...",       zh: "加载中...",      ar: "جارٍ التحميل..." },
  },

  // ── Error messages ─────────────────────────────────────────────────────────
  err: {
    enter_url:     { en: "Enter a TikTok URL",        id: "Masukkan URL TikTok",         ru: "Введите URL TikTok",         zh: "请输入 TikTok 链接",    ar: "أدخل رابط TikTok" },
    enter_url_dy:  { en: "Enter a Douyin URL",         id: "Masukkan URL Douyin",         ru: "Введите URL Douyin",         zh: "请输入抖音链接",          ar: "أدخل رابط Douyin" },
    invalid_url:   { en: "Invalid URL. Enter a valid TikTok link.", id: "URL tidak valid. Masukkan URL TikTok yang benar.", ru: "Неверный URL TikTok.", zh: "链接无效，请输入正确的 TikTok 链接。", ar: "رابط غير صالح. أدخل رابط TikTok صحيح." },
    invalid_url_dy:{ en: "Invalid URL. Enter a valid Douyin link.", id: "URL tidak valid. Masukkan URL Douyin yang benar.", ru: "Неверный URL Douyin.", zh: "链接无效，请输入正确的抖音链接。",   ar: "رابط غير صالح. أدخل رابط Douyin صحيح." },
    fetch_failed:  { en: "Failed to fetch video. Try again.",       id: "Gagal mengambil data video. Coba lagi.",          ru: "Ошибка загрузки видео.",  zh: "获取视频失败，请重试。",                ar: "فشل جلب الفيديو. حاول مجدداً." },
    dl_failed:     { en: "Download failed. Try again.",             id: "Gagal mengunduh file. Coba lagi.",                ru: "Ошибка скачивания.",      zh: "下载失败，请重试。",                    ar: "فشل التحميل. حاول مجدداً." },
    clipboard:     { en: "Cannot access clipboard.",                id: "Tidak dapat mengakses clipboard.",                ru: "Нет доступа к буферу.",   zh: "无法访问剪贴板。",                      ar: "لا يمكن الوصول إلى الحافظة." },
  },

  // ── TikTok Home page ────────────────────────────────────────────────────────
  tiktok_home: {
    hero_title:  { en: "Download TikTok Without Watermark",     id: "Download TikTok Tanpa Watermark",        ru: "Скачать TikTok без водяного знака",      zh: "无水印下载 TikTok 视频",          ar: "تحميل TikTok بدون علامة مائية" },
    hero_grad:   { en: "Watermark",                              id: "Watermark",                              ru: "знака",                                   zh: "水印",                             ar: "علامة مائية" },
    hero_sub:    { en: "Download TikTok HD videos, MP3 audio, and images without logo. Fast, Safe & Free with no registration.", id: "Unduh video TikTok HD, MP3 audio, dan gambar tanpa logo. Cepat, Aman, & Gratis tanpa registrasi.", ru: "Скачивайте HD видео TikTok, MP3 аудио и картинки без логотипа. Быстро, безопасно и бесплатно.", zh: "下载 TikTok HD 视频、MP3 音频和无 Logo 图片。快速、安全、免费，无需注册。", ar: "حمّل مقاطع TikTok HD وصوت MP3 وصوراً بدون شعار. سريع وآمن ومجاني." },
    placeholder: { en: "Paste TikTok video link here...",        id: "Tempelkan link video TikTok di sini...", ru: "Вставьте ссылку TikTok сюда...",         zh: "在此粘贴 TikTok 视频链接...",     ar: "الصق رابط فيديو TikTok هنا..." },
  },

  // ── Douyin Home page ────────────────────────────────────────────────────────
  douyin_home: {
    hero_title:  { en: "Download Douyin Without Watermark",     id: "Download Douyin Tanpa Watermark",        ru: "Скачать Douyin без водяного знака",      zh: "无水印下载抖音视频",               ar: "تحميل Douyin بدون علامة مائية" },
    hero_grad:   { en: "Watermark",                              id: "Watermark",                              ru: "знака",                                   zh: "水印",                             ar: "علامة مائية" },
    hero_sub:    { en: "Download Douyin (抖音) HD videos without logo. Fast, Safe & Free with no registration.", id: "Unduh video Douyin (抖音) tanpa logo watermark. Cepat, Aman, & Gratis tanpa registrasi.", ru: "Скачивайте HD видео Douyin (抖音) без логотипа. Быстро и бесплатно.", zh: "下载抖音（抖音）高清视频，无水印。快速、安全、免费。", ar: "حمّل مقاطع Douyin (抖音) HD بدون علامة مائية. سريع وآمن ومجاني." },
    placeholder: { en: "Paste Douyin video link here...",        id: "Tempelkan link video Douyin di sini...", ru: "Вставьте ссылку Douyin сюда...",         zh: "在此粘贴抖音视频链接...",          ar: "الصق رابط فيديو Douyin هنا..." },
  },

  // ── Stats ───────────────────────────────────────────────────────────────────
  stats: {
    free:    { en: "Free",    id: "Gratis",  ru: "Бесплатно", zh: "免费",  ar: "مجاني" },
    no_wm:   { en: "No Watermark", id: "Tanpa WM", ru: "Без знака", zh: "无水印", ar: "بلا علامة" },
    quality: { en: "Quality", id: "Kualitas",ru: "Качество",  zh: "高质量", ar: "جودة" },
    fast:    { en: "Fast",    id: "Cepat",   ru: "Быстро",    zh: "极速",   ar: "سريع" },
  },

  // ── Features ────────────────────────────────────────────────────────────────
  features: {
    why_tiktok:  { en: "Why Choose Snaptok?",  id: "Mengapa Memilih Snaptok?",  ru: "Почему Snaptok?",  zh: "为什么选择 Snaptok？", ar: "لماذا Snaptok؟" },
    why_douyin:  { en: "Why Choose SnapYin?",  id: "Mengapa Memilih SnapYin?",  ru: "Почему SnapYin?",  zh: "为什么选择 SnapYin？",  ar: "لماذا SnapYin؟" },
    fast_t:      { en: "Super Fast",           id: "Super Cepat",               ru: "Молниеносно",       zh: "极速下载",              ar: "فائق السرعة" },
    fast_d:      { en: "Download in seconds",  id: "Proses download dalam hitungan detik tanpa delay", ru: "Загрузка за секунды", zh: "几秒内完成下载，无延迟", ar: "تنزيل خلال ثوانٍ بدون تأخير" },
    safe_t:      { en: "Safe & Trusted",       id: "Aman & Terpercaya",         ru: "Безопасно",         zh: "安全可信",              ar: "آمن وموثوق" },
    safe_d:      { en: "No virus, malware, or software to install", id: "Tanpa virus, malware, atau software yang perlu diinstall", ru: "Без вирусов и вредоносных программ", zh: "无病毒、恶意软件，无需安装任何程序", ar: "بدون فيروسات أو برامج ضارة" },
    nowm_t:      { en: "No Watermark",         id: "Tanpa Watermark",           ru: "Без водяного знака", zh: "无水印",               ar: "بدون علامة مائية" },
    nowm_d:      { en: "High quality video without TikTok logo", id: "Video HD berkualitas tinggi tanpa logo TikTok", ru: "HD видео без логотипа TikTok", zh: "高清视频，去除 TikTok 水印", ar: "فيديو عالي الجودة بدون شعار TikTok" },
    nowm_d_dy:   { en: "High quality video without Douyin logo", id: "Video berkualitas tinggi tanpa logo Douyin",  ru: "HD видео без логотипа Douyin", zh: "高清视频，去除抖音水印",       ar: "فيديو عالي الجودة بدون شعار Douyin" },
    multi_t:     { en: "Multi Platform",       id: "Multi Platform",            ru: "Мультиплатформа",   zh: "多平台支持",            ar: "متعدد المنصات" },
    multi_d:     { en: "Works on phone, tablet, and computer", id: "Dapat diakses dari HP, tablet, maupun komputer", ru: "Работает на телефоне, планшете и ПК", zh: "支持手机、平板和电脑",         ar: "يعمل على الهاتف والتابلت والكمبيوتر" },
    china_t:     { en: "Chinese Content",      id: "Konten China",              ru: "Китайский контент", zh: "中国原创内容",           ar: "محتوى صيني" },
    china_d:     { en: "Access exclusive content from Douyin platform", id: "Akses dan download konten eksklusif dari platform Douyin", ru: "Эксклюзивный контент платформы Douyin", zh: "访问和下载抖音平台独家内容", ar: "الوصول إلى المحتوى الحصري على Douyin" },
  },

  // ── Footer ──────────────────────────────────────────────────────────────────
  footer: {
    disclaimer_tiktok: {
      en: "Snaptok is not affiliated with TikTok. We provide video download services for personal use only. Please respect creator copyrights.",
      id: "Snaptok tidak berafiliasi dengan TikTok. Kami menyediakan layanan download video untuk penggunaan pribadi. Harap hormati hak cipta konten kreator.",
      ru: "Snaptok не связан с TikTok. Сервис предназначен только для личного использования. Уважайте авторские права.",
      zh: "Snaptok 与 TikTok 无任何关联。我们仅提供个人使用的视频下载服务。请尊重创作者版权。",
      ar: "Snaptok غير مرتبط بـ TikTok. نقدم خدمات التنزيل للاستخدام الشخصي فقط. يرجى احترام حقوق المبدعين.",
    },
    disclaimer_douyin: {
      en: "SnapYin is not affiliated with Douyin (抖音) or ByteDance. We provide video download services for personal use only. Please respect creator copyrights.",
      id: "SnapYin tidak berafiliasi dengan Douyin (抖音) atau ByteDance. Kami menyediakan layanan download video untuk penggunaan pribadi. Harap hormati hak cipta konten kreator.",
      ru: "SnapYin не связан с Douyin (抖音) или ByteDance. Сервис предназначен только для личного использования.",
      zh: "SnapYin 与抖音（抖音）或字节跳动无任何关联。我们仅提供个人使用的视频下载服务。",
      ar: "SnapYin غير مرتبط بـ Douyin (抖音) أو ByteDance. نقدم خدمات التنزيل للاستخدام الشخصي فقط.",
    },
    rights: {
      en: "All rights reserved.",
      id: "Semua hak dilindungi.",
      ru: "Все права защищены.",
      zh: "版权所有。",
      ar: "جميع الحقوق محفوظة.",
    },
  },

  // ── FAQ page ────────────────────────────────────────────────────────────────
  faq_page: {
    title:    { en: "Frequently Asked Questions", id: "Pertanyaan yang Sering Diajukan", ru: "Часто задаваемые вопросы", zh: "常见问题", ar: "الأسئلة الشائعة" },
    subtitle: { en: "Find answers to common questions about our service", id: "Temukan jawaban untuk pertanyaan umum tentang layanan kami", ru: "Найдите ответы на частые вопросы", zh: "查找关于我们服务的常见问题解答", ar: "اعثر على إجابات للأسئلة الشائعة" },
    still_q:  { en: "Still have questions?", id: "Masih punya pertanyaan?", ru: "Остались вопросы?", zh: "还有问题？", ar: "لا تزال لديك أسئلة؟" },
    contact:  { en: "Feel free to contact our support team", id: "Jangan ragu untuk menghubungi tim support kami", ru: "Свяжитесь с нашей поддержкой", zh: "随时联系我们的支持团队", ar: "لا تتردد في التواصل مع فريق الدعم" },
  },

  // ── Guide page ──────────────────────────────────────────────────────────────
  guide_page: {
    title:    { en: "User Guide",             id: "Panduan Penggunaan",       ru: "Руководство пользователя", zh: "使用指南",   ar: "دليل المستخدم" },
    subtitle_tiktok: { en: "Follow these simple steps to download TikTok videos without watermark", id: "Ikuti langkah-langkah sederhana berikut untuk mengunduh video TikTok tanpa watermark", ru: "Следуйте простым шагам для скачивания видео TikTok", zh: "按照以下简单步骤下载无水印的 TikTok 视频", ar: "اتبع هذه الخطوات البسيطة لتنزيل مقاطع TikTok بدون علامة مائية" },
    subtitle_douyin: { en: "Follow these simple steps to download Douyin videos without watermark", id: "Ikuti langkah-langkah sederhana berikut untuk mengunduh video Douyin tanpa watermark", ru: "Следуйте простым шагам для скачивания видео Douyin", zh: "按照以下简单步骤下载无水印的抖音视频",   ar: "اتبع هذه الخطوات البسيطة لتنزيل مقاطع Douyin بدون علامة مائية" },
    devices:  { en: "Works on All Devices",   id: "Dapat Diakses dari Berbagai Perangkat", ru: "Работает на всех устройствах", zh: "支持所有设备", ar: "يعمل على جميع الأجهزة" },
    tips:     { en: "Tips for Best Results",  id: "Tips untuk Hasil Terbaik", ru: "Советы для лучшего результата", zh: "最佳使用技巧", ar: "نصائح للحصول على أفضل النتائج" },
    ready:    { en: "Ready to Try?",          id: "Siap Mencoba?",            ru: "Готовы попробовать?",          zh: "准备好了吗？", ar: "هل أنت مستعد؟" },
    start:    { en: "Start Downloading",      id: "Mulai Download",           ru: "Начать загрузку",             zh: "开始下载",    ar: "ابدأ التنزيل" },
  },

  // ── Privacy page ────────────────────────────────────────────────────────────
  privacy_page: {
    title:    { en: "Privacy Policy",   id: "Kebijakan Privasi",  ru: "Политика конфиденциальности", zh: "隐私政策",   ar: "سياسة الخصوصية" },
    subtitle: { en: "We are committed to protecting your privacy. This page explains how we collect, use, and protect your information.", id: "Kami berkomitmen untuk melindungi privasi Anda. Halaman ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.", ru: "Мы обязуемся защищать вашу конфиденциальность.", zh: "我们致力于保护您的隐私。本页面说明我们如何收集、使用和保护您的信息。", ar: "نحن ملتزمون بحماية خصوصيتك. توضح هذه الصفحة كيفية جمع معلوماتك واستخدامها وحمايتها." },
    updated:  { en: "Last updated: January 2026", id: "Terakhir diperbarui: Januari 2026", ru: "Последнее обновление: январь 2026", zh: "最后更新：2026年1月", ar: "آخر تحديث: يناير 2026" },
    contact:  { en: "Contact Us", id: "Hubungi Kami", ru: "Свяжитесь с нами", zh: "联系我们", ar: "اتصل بنا" },
    contact_sub: { en: "If you have questions about our privacy policy, contact us at:", id: "Jika Anda memiliki pertanyaan tentang kebijakan privasi kami, silakan hubungi kami di:", ru: "Если у вас есть вопросы о конфиденциальности:", zh: "如您对我们的隐私政策有任何疑问，请联系：", ar: "إذا كانت لديك أسئلة حول سياسة الخصوصية، تواصل معنا على:" },
    changes:  { en: "Policy Changes", id: "Perubahan Kebijakan", ru: "Изменения политики", zh: "政策变更", ar: "تغييرات السياسة" },
    changes_body: { en: "We may update this privacy policy from time to time. Significant changes will be announced via a notice on our website.", id: "Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan signifikan akan diumumkan melalui pemberitahuan di website kami.", ru: "Мы можем обновлять политику конфиденциальности. Значительные изменения будут объявлены на сайте.", zh: "我们可能会不时更新本隐私政策。重大变更将通过网站通知公告。", ar: "قد نحدّث سياسة الخصوصية من وقت لآخر. سيُعلَن عن التغييرات الجوهرية عبر إشعار على موقعنا." },
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Helper — get translation
// ─────────────────────────────────────────────────────────────────────────────
export function t(
  obj: Record<string, string>,
  lang: LangCode
): string {
  return (obj as Record<string, string>)[lang] ?? (obj as Record<string, string>)["en"] ?? "";
}
