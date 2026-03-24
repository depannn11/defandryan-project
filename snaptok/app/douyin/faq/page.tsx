"use client";
import { DouyinHeader } from "@/components/douyin-header";
import { DouyinFooter } from "@/components/douyin-footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t, LangCode } from "@/lib/i18n";

const faqData: { q: Record<LangCode, string>; a: Record<LangCode, string> }[] = [
  {
    q: { en: "What is SnapYin?", id: "Apa itu SnapYin?", ru: "Что такое SnapYin?", zh: "什么是 SnapYin？", ar: "ما هو SnapYin؟" },
    a: { en: "SnapYin is a free online service to download Douyin (抖音) videos without watermark. Fast, safe and free.", id: "SnapYin adalah layanan online gratis untuk mengunduh video Douyin (抖音) tanpa watermark. Cepat, aman, dan gratis.", ru: "SnapYin — бесплатный сервис для скачивания видео Douyin (抖音) без водяного знака.", zh: "SnapYin 是一项免费在线服务，可下载无水印的抖音视频。快速、安全、免费。", ar: "SnapYin هي خدمة مجانية لتنزيل مقاطع Douyin (抖音) بدون علامة مائية." },
  },
  {
    q: { en: "What is the difference between Douyin and TikTok?", id: "Apa perbedaan Douyin dan TikTok?", ru: "В чём разница между Douyin и TikTok?", zh: "抖音和 TikTok 有什么区别？", ar: "ما الفرق بين Douyin وTikTok؟" },
    a: { en: "Douyin (抖音) is the Chinese version of TikTok, operated by ByteDance exclusively for users in mainland China. It has exclusive content not available on TikTok.", id: "Douyin (抖音) adalah versi China dari TikTok yang dioperasikan oleh ByteDance khusus untuk pengguna di daratan China. Memiliki konten eksklusif yang tidak ada di TikTok.", ru: "Douyin (抖音) — китайская версия TikTok, только для материкового Китая. Имеет эксклюзивный контент.", zh: "抖音是专为中国大陆用户运营的 TikTok 中国版，由字节跳动运营，拥有 TikTok 上没有的独家内容。", ar: "Douyin (抖音) هو نسخة TikTok الصينية تعمل حصرياً لمستخدمي البر الرئيسي الصيني، وتضم محتوى حصرياً." },
  },
  {
    q: { en: "Is it free?", id: "Apakah gratis?", ru: "Это бесплатно?", zh: "免费吗？", ar: "هل هو مجاني؟" },
    a: { en: "Yes, 100% free with no limits.", id: "Ya, 100% gratis tanpa batasan.", ru: "Да, 100% бесплатно без ограничений.", zh: "是的，100% 免费，无限制。", ar: "نعم، مجاني 100% بدون قيود." },
  },
  {
    q: { en: "How do I download a Douyin video?", id: "Bagaimana cara mengunduh video Douyin?", ru: "Как скачать видео Douyin?", zh: "如何下载抖音视频？", ar: "كيف أحمّل فيديو Douyin؟" },
    a: { en: "1) Open Douyin and find the video, 2) Copy the link, 3) Paste on SnapYin, 4) Click Download Now.", id: "1) Buka Douyin dan temukan video, 2) Salin link, 3) Tempel di SnapYin, 4) Klik Unduh Sekarang.", ru: "1) Откройте Douyin, 2) скопируйте ссылку, 3) вставьте на SnapYin, 4) нажмите «Скачать».", zh: "1) 打开抖音找到视频，2) 复制链接，3) 粘贴到 SnapYin，4) 点击立即下载。", ar: "1) افتح Douyin وابحث عن الفيديو، 2) انسخ الرابط، 3) الصقه في SnapYin، 4) اضغط تنزيل الآن." },
  },
  {
    q: { en: "Is it safe?", id: "Apakah aman?", ru: "Безопасно ли это?", zh: "安全吗？", ar: "هل هو آمن؟" },
    a: { en: "Yes, 100% safe. No personal data stored, no login required.", id: "Ya, 100% aman. Tidak ada data pribadi yang disimpan, tidak perlu login.", ru: "Да, безопасно. Личные данные не хранятся, вход не требуется.", zh: "是的，100% 安全。不存储个人数据，无需登录。", ar: "نعم، آمن 100%. لا نخزن بيانات شخصية ولا نحتاج إلى تسجيل دخول." },
  },
  {
    q: { en: "Why can't I download?", id: "Mengapa tidak bisa diunduh?", ru: "Почему не скачивается?", zh: "为什么无法下载？", ar: "لماذا لا يمكنني التنزيل؟" },
    a: { en: "Possible reasons: 1) Video is private or deleted, 2) Invalid link, 3) Temporary server issue.", id: "Kemungkinan: 1) Video privat atau dihapus, 2) Link tidak valid, 3) Gangguan server sementara.", ru: "Возможные причины: 1) Видео приватное или удалено, 2) Неверная ссылка, 3) Ошибка сервера.", zh: "可能原因：1) 视频私密或已删除，2) 链接无效，3) 服务器故障。", ar: "الأسباب المحتملة: 1) الفيديو خاص أو محذوف، 2) رابط غير صالح، 3) عطل مؤقت." },
  },
];

export default function DouyinFAQPage() {
  const { lang } = useLang();
  return (
    <div className="flex min-h-screen flex-col">
      <DouyinHeader />
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
      <DouyinFooter />
    </div>
  );
}
