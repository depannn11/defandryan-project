"use client";
import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Copy, Link as LinkIcon, Download, CheckCircle, Smartphone, Monitor, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t, LangCode } from "@/lib/i18n";

type StepData = { title: Record<LangCode,string>; desc: Record<LangCode,string> };

const steps: StepData[] = [
  {
    title: { en:"Open TikTok App", id:"Buka Aplikasi TikTok", ru:"Откройте TikTok", zh:"打开 TikTok 应用", ar:"افتح تطبيق TikTok" },
    desc:  { en:"Open TikTok on your phone or website. Find the video you want to download.", id:"Buka aplikasi TikTok di HP atau website. Temukan video yang ingin diunduh.", ru:"Откройте TikTok на телефоне или сайте. Найдите нужное видео.", zh:"在手机或网页上打开 TikTok，找到您想下载的视频。", ar:"افتح TikTok على هاتفك أو الموقع وابحث عن الفيديو." },
  },
  {
    title: { en:"Copy Video Link", id:"Salin Link Video", ru:"Скопируйте ссылку", zh:"复制视频链接", ar:"انسخ رابط الفيديو" },
    desc:  { en:'Tap "Share" on the video, then choose "Copy Link".', id:'Klik tombol "Share" lalu pilih "Salin Link".', ru:'Нажмите «Поделиться», затем «Скопировать ссылку».', zh:'点击"分享"按钮，然后选择"复制链接"。', ar:'اضغط "مشاركة" ثم اختر "نسخ الرابط".' },
  },
  {
    title: { en:"Paste the Link", id:"Tempelkan Link", ru:"Вставьте ссылку", zh:"粘贴链接", ar:"الصق الرابط" },
    desc:  { en:"Come back to Snaptok and paste the link in the input field.", id:"Kembali ke Snaptok dan tempelkan link di kolom input.", ru:"Вернитесь на Snaptok и вставьте ссылку в поле ввода.", zh:"回到 Snaptok，将链接粘贴到输入框。", ar:"عد إلى Snaptok والصق الرابط في حقل الإدخال." },
  },
  {
    title: { en:"Download", id:"Unduh Video", ru:"Скачайте", zh:"下载视频", ar:"حمّل الفيديو" },
    desc:  { en:'Click "Download Now" and choose your format (HD, MP3, or Image).', id:'Klik "Unduh Sekarang" dan pilih format (Video HD, MP3, atau Gambar).', ru:'Нажмите «Скачать» и выберите формат (HD, MP3 или картинку).', zh:'点击"立即下载"，选择格式（HD、MP3 或图片）。', ar:'اضغط "تنزيل الآن" واختر الصيغة (HD أو MP3 أو صورة).' },
  },
  {
    title: { en:"Done!", id:"Selesai!", ru:"Готово!", zh:"完成！", ar:"انتهى!" },
    desc:  { en:"Your watermark-free video is downloaded. Enjoy!", id:"Video tanpa watermark sudah terunduh. Nikmati!", ru:"Видео без водяного знака загружено. Наслаждайтесь!", zh:"无水印视频已下载完成，尽情享用！", ar:"تم تنزيل الفيديو بدون علامة مائية. استمتع!" },
  },
];

const tips: { title: Record<LangCode,string>; desc: Record<LangCode,string> }[] = [
  {
    title: { en:"Use Valid Links", id:"Pastikan Link Valid", ru:"Используйте правильные ссылки", zh:"使用有效链接", ar:"استخدم روابط صالحة" },
    desc:  { en:"Use links directly from TikTok. Links copied from other platforms may not work.", id:"Gunakan link langsung dari TikTok. Link dari platform lain mungkin tidak berfungsi.", ru:"Используйте ссылки непосредственно из TikTok.", zh:"使用直接来自 TikTok 的链接，其他平台的链接可能无效。", ar:"استخدم الروابط مباشرةً من TikTok. الروابط من منصات أخرى قد لا تعمل." },
  },
  {
    title: { en:"Stable Connection", id:"Koneksi Stabil", ru:"Стабильное соединение", zh:"稳定的网络连接", ar:"اتصال مستقر" },
    desc:  { en:"A stable internet connection ensures smooth downloads.", id:"Koneksi internet stabil memastikan proses download yang lancar.", ru:"Стабильное соединение обеспечивает плавную загрузку.", zh:"稳定的网络连接确保流畅下载。", ar:"الاتصال المستقر يضمن تنزيلاً سلساً." },
  },
  {
    title: { en:"Public Videos Only", id:"Video Publik", ru:"Только публичные видео", zh:"仅限公开视频", ar:"الفيديوهات العامة فقط" },
    desc:  { en:"Only public videos can be downloaded. Private videos are not accessible.", id:"Hanya video publik yang dapat diunduh. Video privat tidak dapat diakses.", ru:"Только публичные видео доступны для скачивания.", zh:"只有公开视频可以下载，私密视频无法访问。", ar:"يمكن تنزيل الفيديوهات العامة فقط. الفيديوهات الخاصة غير متاحة." },
  },
  {
    title: { en:"Respect Copyright", id:"Hormati Hak Cipta", ru:"Уважайте авторские права", zh:"尊重版权", ar:"احترم حقوق النشر" },
    desc:  { en:"Use downloaded content for personal use only. Always credit the original creator.", id:"Gunakan konten untuk keperluan pribadi. Selalu berikan kredit kepada kreator asli.", ru:"Используйте загруженный контент только в личных целях.", zh:"仅将下载内容用于个人用途，始终向原创作者致谢。", ar:"استخدم المحتوى للأغراض الشخصية فقط واذكر دائماً المبدع الأصلي." },
  },
];

const icons = [Smartphone, Copy, LinkIcon, Download, CheckCircle];

export default function GuidePage() {
  const { lang } = useLang();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t(tr.guide_page.title, lang)}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t(tr.guide_page.subtitle_tiktok, lang)}</p>
          </div>
          <div className="space-y-6 mb-16">
            {steps.map((step, i) => {
              const Icon = icons[i];
              return (
                <Card key={i} className="border-border overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex items-center justify-center bg-primary/5 p-6 md:p-8 md:w-32">
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground font-bold text-xl">{i+1}</div>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-start gap-4">
                          <div className="hidden sm:flex items-center justify-center rounded-lg bg-muted p-3">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-2">{(step.title as Record<string,string>)[lang] ?? step.title.en}</h3>
                            <p className="text-muted-foreground leading-relaxed">{(step.desc as Record<string,string>)[lang] ?? step.desc.en}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">{t(tr.guide_page.devices, lang)}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Smartphone, title: { en:"Smartphone & Tablet", id:"Smartphone & Tablet", ru:"Смартфон и планшет", zh:"智能手机和平板", ar:"الهاتف والجهاز اللوحي" }, desc: { en:"Android, iPhone, iPad — all browsers supported", id:"Android, iPhone, iPad — semua browser didukung", ru:"Android, iPhone, iPad — все браузеры", zh:"Android、iPhone、iPad，所有浏览器均支持", ar:"Android وiPhone وiPad — جميع المتصفحات مدعومة" } },
                { icon: Monitor,    title: { en:"Desktop & Laptop",    id:"Desktop & Laptop",    ru:"ПК и ноутбук",       zh:"桌面和笔记本",     ar:"الكمبيوتر والحاسوب المحمول" }, desc: { en:"Windows, Mac, Linux — Chrome, Firefox, Safari, Edge", id:"Windows, Mac, Linux — Chrome, Firefox, Safari, Edge", ru:"Windows, Mac, Linux — Chrome, Firefox, Safari, Edge", zh:"Windows、Mac、Linux — Chrome、Firefox、Safari、Edge", ar:"Windows وMac وLinux — Chrome وFirefox وSafari وEdge" } },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <Card key={i} className="border-border">
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="rounded-full bg-primary/10 p-4"><Icon className="h-8 w-8 text-primary" /></div>
                      <div>
                        <h3 className="font-semibold">{(item.title as Record<string,string>)[lang] ?? item.title.en}</h3>
                        <p className="text-sm text-muted-foreground">{(item.desc as Record<string,string>)[lang] ?? item.desc.en}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">{t(tr.guide_page.tips, lang)}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {tips.map((tip, i) => (
                <Card key={i} className="border-border">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-2">{(tip.title as Record<string,string>)[lang] ?? tip.title.en}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{(tip.desc as Record<string,string>)[lang] ?? tip.desc.en}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Card className="border-border bg-primary text-primary-foreground">
            <CardContent className="text-center p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{t(tr.guide_page.ready, lang)}</h2>
              <Button asChild size="lg" variant="secondary" className="font-semibold">
                <Link href="/">{t(tr.guide_page.start, lang)}<ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
