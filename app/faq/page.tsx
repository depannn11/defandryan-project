"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t, LangCode } from "@/lib/i18n";

const faqData: { q: Record<LangCode, string>; a: Record<LangCode, string> }[] = [
    {
      q: { en: "What is Snaptok?", id: "Apa itu Snaptok?", ru: "Что такое Snaptok?", zh: "什么是 Snaptok？", ar: "ما هو Snaptok؟" },
      a: { en: "Snaptok is a free online service that lets you download TikTok videos without watermark. We support HD video, MP3 audio, and slideshow images.", id: "Snaptok adalah layanan online gratis yang memungkinkan Anda mengunduh video TikTok tanpa watermark. Kami mendukung video HD, audio MP3, dan gambar slideshow.", ru: "Snaptok — бесплатный сервис для скачивания видео TikTok без водяного знака. Поддерживаем HD видео, MP3 и картинки.", zh: "Snaptok 是一项免费的在线服务，可让您下载无水印的 TikTok 视频。支持 HD 视频、MP3 音频和幻灯片图片。", ar: "Snaptok هي خدمة مجانية عبر الإنترنت تتيح لك تنزيل مقاطع TikTok بدون علامة مائية. ندعم فيديو HD وصوت MP3 وصور." },
    },
    {
      q: { en: "Is it free?", id: "Apakah layanan ini gratis?", ru: "Это бесплатно?", zh: "免费吗？", ar: "هل هو مجاني؟" },
      a: { en: "Yes, 100% free. No hidden fees or subscriptions. Download as many videos as you want.", id: "Ya, 100% gratis. Tidak ada biaya tersembunyi atau langganan. Unduh video sebanyak yang Anda mau.", ru: "Да, 100% бесплатно. Никаких скрытых платежей или подписок.", zh: "是的，100% 免费。没有隐藏费用或订阅。随意下载。", ar: "نعم، مجاني 100%. لا رسوم خفية أو اشتراكات." },
    },
    {
      q: { en: "How do I download a TikTok video?", id: "Bagaimana cara mengunduh video TikTok?", ru: "Как скачать видео TikTok?", zh: "如何下载 TikTok 视频？", ar: "كيف أحمّل مقطع TikTok؟" },
      a: { en: "1) Open TikTok and find the video, 2) Copy the link, 3) Paste it on Snaptok, 4) Click Download Now, 5) Choose your format (HD, MP3, or Image).", id: "1) Buka TikTok dan temukan video, 2) Salin link, 3) Tempel di Snaptok, 4) Klik Unduh Sekarang, 5) Pilih format (HD, MP3, atau Gambar).", ru: "1) Откройте TikTok, 2) скопируйте ссылку, 3) вставьте на Snaptok, 4) нажмите «Скачать», 5) выберите формат.", zh: "1) 打开 TikTok 找到视频，2) 复制链接，3) 粘贴到 Snaptok，4) 点击立即下载，5) 选择格式（HD、MP3 或图片）。", ar: "1) افتح TikTok وابحث عن الفيديو، 2) انسخ الرابط، 3) الصقه في Snaptok، 4) اضغط تنزيل الآن، 5) اختر الصيغة." },
    },
    {
      q: { en: "Is it safe to use?", id: "Apakah aman menggunakan layanan ini?", ru: "Это безопасно?", zh: "使用安全吗？", ar: "هل الاستخدام آمن؟" },
      a: { en: "Yes, 100% safe. We don't store personal data, require no login, and install nothing on your device.", id: "Ya, 100% aman. Kami tidak menyimpan data pribadi, tidak perlu login, dan tidak menginstall apapun.", ru: "Да, безопасно. Мы не храним личные данные, не требуем входа, ничего не устанавливаем.", zh: "是的，100% 安全。我们不存储个人数据，无需登录，也不会在您的设备上安装任何东西。", ar: "نعم، آمن 100%. لا نخزن بيانات شخصية، ولا نحتاج إلى تسجيل دخول." },
    },
    {
      q: { en: "What formats are available?", id: "Format apa saja yang tersedia?", ru: "Какие форматы доступны?", zh: "支持哪些格式？", ar: "ما الصيغ المتاحة؟" },
      a: { en: "HD video (no watermark), SD video (no watermark), video with watermark, audio (MP3), and slideshow images (JPG).", id: "Video HD tanpa watermark, Video SD tanpa watermark, video dengan watermark, audio (MP3), dan gambar slideshow (JPG).", ru: "HD видео (без знака), SD видео, аудио MP3 и картинки слайдшоу.", zh: "HD 视频（无水印）、SD 视频、含水印视频、音频（MP3）和幻灯片图片（JPG）。", ar: "فيديو HD (بدون علامة)، فيديو SD، صوت MP3، وصور." },
    },
    {
      q: { en: "Can I use it on mobile?", id: "Apakah bisa download di HP?", ru: "Работает на мобильном?", zh: "支持手机使用吗？", ar: "هل يعمل على الهاتف؟" },
      a: { en: "Yes! Works on Android, iPhone, iPad, laptop, and desktop. Just open in any browser.", id: "Tentu! Bekerja di Android, iPhone, iPad, laptop, dan desktop. Cukup buka di browser apapun.", ru: "Да! Работает на Android, iPhone, iPad, ноутбуке и ПК.", zh: "支持！适用于 Android、iPhone、iPad、笔记本和台式机。", ar: "نعم! يعمل على Android وiPhone وiPad والكمبيوتر." },
    },
    {
      q: { en: "Why can't I download a video?", id: "Mengapa video tidak bisa diunduh?", ru: "Почему не скачивается?", zh: "为什么无法下载？", ar: "لماذا لا يمكنني التنزيل؟" },
      a: { en: "Possible reasons: 1) Video is private or deleted, 2) Invalid link, 3) Temporary server issue. Check the link and try again.", id: "Kemungkinan: 1) Video privat atau dihapus, 2) Link tidak valid, 3) Gangguan server sementara. Periksa link dan coba lagi.", ru: "Возможные причины: 1) Видео приватное или удалено, 2) Неверная ссылка, 3) Временная ошибка сервера.", zh: "可能原因：1) 视频为私密或已删除，2) 链接无效，3) 服务器暂时故障。请检查链接后重试。", ar: "الأسباب المحتملة: 1) الفيديو خاص أو محذوف، 2) رابط غير صالح، 3) عطل مؤقت في الخادم." },
    },
    {
      q: { en: "Is there a daily limit?", id: "Berapa batas download per hari?", ru: "Есть ли дневной лимит?", zh: "每天有下载限制吗？", ar: "هل هناك حد يومي؟" },
      a: { en: "No limit! Download as many videos as you want with no daily or monthly limit.", id: "Tidak ada batasan! Unduh sebanyak yang Anda mau tanpa limit harian atau bulanan.", ru: "Нет лимита! Скачивайте сколько угодно.", zh: "没有限制！随心所欲下载，无每日或每月限制。", ar: "لا حدود! نزّل بقدر ما تشاء بدون أي قيود." },
    },
  ];

export default function FAQPage() {
  const { lang } = useLang();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 mb-6">
              <HelpCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t(tr.faq_page.title, lang)}</h1>
            <p className="text-muted-foreground text-lg">{t(tr.faq_page.subtitle, lang)}</p>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-lg px-6 data-[state=open]:bg-muted/50">
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                  {(item.q as Record<string, string>)[lang] ?? item.q.en}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  {(item.a as Record<string, string>)[lang] ?? item.a.en}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-12 text-center p-8 bg-muted/50 rounded-xl border border-border">
            <h2 className="text-xl font-semibold mb-2">{t(tr.faq_page.still_q, lang)}</h2>
            <p className="text-muted-foreground mb-4">{t(tr.faq_page.contact, lang)}</p>
            <a href="mailto:defandryannn@gmail.com" className="text-primary font-medium hover:underline">defandryannn@gmail.com</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
