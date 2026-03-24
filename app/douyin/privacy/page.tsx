"use client";
import React from "react";
import { DouyinHeader } from "@/components/douyin-header";
import { DouyinFooter } from "@/components/douyin-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Cookie, Mail, FileText } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t, LangCode } from "@/lib/i18n";

type Section = { icon: React.ElementType; title: Record<LangCode,string>; content: Record<LangCode,string> };

const sections: Section[] = [
  {
    icon: Eye,
    title: { en:"Information We Collect", id:"Informasi yang Kami Kumpulkan", ru:"Информация, которую мы собираем", zh:"我们收集的信息", ar:"المعلومات التي نجمعها" },
    content: {
      en: "We collect minimal information:\n\n• The TikTok URL you submit\n• Anonymous analytics (visitor counts, pages visited)\n• Technical info like browser type\n\nWe do NOT collect:\n• Personal info (name, email, phone)\n• Your TikTok login data\n• Your browsing history outside our site",
      id: "Kami mengumpulkan informasi minimal:\n\n• URL TikTok yang Anda masukkan\n• Data analitik anonim (jumlah pengunjung, halaman)\n• Informasi teknis seperti jenis browser\n\nKami TIDAK mengumpulkan:\n• Informasi pribadi (nama, email, telepon)\n• Data login TikTok Anda\n• Riwayat browsing di luar situs kami",
      ru: "Мы собираем минимум информации:\n\n• URL TikTok, который вы вводите\n• Анонимная аналитика\n• Технические данные (тип браузера)\n\nМЫ НЕ собираем:\n• Личные данные\n• Данные входа в TikTok\n• Историю просмотров",
      zh: "我们收集最少量的信息：\n\n• 您提交的 TikTok 链接\n• 匿名分析数据（访客数量、浏览页面）\n• 技术信息（如浏览器类型）\n\n我们不收集：\n• 个人信息（姓名、邮箱、电话）\n• 您的 TikTok 登录数据\n• 您在我们网站以外的浏览记录",
      ar: "نجمع معلومات بالحد الأدنى:\n\n• رابط TikTok الذي تُدخله\n• بيانات تحليلية مجهولة الهوية\n• معلومات تقنية (نوع المتصفح)\n\nلا نجمع:\n• معلومات شخصية\n• بيانات تسجيل الدخول إلى TikTok\n• سجل التصفح خارج موقعنا",
    },
  },
  {
    icon: Lock,
    title: { en:"Data Security", id:"Keamanan Data", ru:"Безопасность данных", zh:"数据安全", ar:"أمان البيانات" },
    content: {
      en: "Your security is our priority:\n\n• All connections are SSL/TLS encrypted\n• We don't store downloaded videos on our servers\n• URLs are processed temporarily and not permanently stored\n• We use secure cloud infrastructure",
      id: "Keamanan Anda adalah prioritas kami:\n\n• Semua koneksi dienkripsi SSL/TLS\n• Kami tidak menyimpan video di server\n• URL diproses sementara, tidak disimpan permanen\n• Infrastruktur cloud yang aman",
      ru: "Безопасность — наш приоритет:\n\n• Все соединения зашифрованы SSL/TLS\n• Видео не хранятся на серверах\n• URL обрабатываются временно\n• Безопасная облачная инфраструктура",
      zh: "您的安全是我们的首要任务：\n\n• 所有连接均使用 SSL/TLS 加密\n• 我们不在服务器上存储下载的视频\n• URL 仅被临时处理，不永久存储\n• 使用安全的云基础设施",
      ar: "أمانك هو أولويتنا:\n\n• جميع الاتصالات مشفرة بـ SSL/TLS\n• لا نخزن مقاطع الفيديو على خوادمنا\n• تُعالج الروابط مؤقتاً ولا تُخزَّن\n• نستخدم بنية تحتية سحابية آمنة",
    },
  },
  {
    icon: Cookie,
    title: { en:"Cookie Usage", id:"Penggunaan Cookies", ru:"Использование cookies", zh:"Cookie 使用", ar:"استخدام ملفات الكوكيز" },
    content: {
      en: "We use cookies to:\n\n• Improve user experience\n• Remember your preferences (including language)\n• Website analytics\n\nYou can manage cookie preferences in your browser settings.",
      id: "Kami menggunakan cookies untuk:\n\n• Meningkatkan pengalaman pengguna\n• Mengingat preferensi Anda (termasuk bahasa)\n• Analitik website\n\nAnda dapat mengelola cookies di pengaturan browser.",
      ru: "Мы используем cookies для:\n\n• Улучшения пользовательского опыта\n• Сохранения настроек (включая язык)\n• Аналитики сайта",
      zh: "我们使用 Cookie 来：\n\n• 提升用户体验\n• 记住您的偏好（包括语言）\n• 网站分析\n\n您可以在浏览器设置中管理 Cookie 偏好。",
      ar: "نستخدم ملفات الكوكيز من أجل:\n\n• تحسين تجربة المستخدم\n• تذكر تفضيلاتك (بما في ذلك اللغة)\n• تحليلات الموقع",
    },
  },
  {
    icon: FileText,
    title: { en:"Copyright & Usage", id:"Hak Cipta & Penggunaan", ru:"Авторские права и использование", zh:"版权与使用", ar:"حقوق النشر والاستخدام" },
    content: {
      en: "Important copyright notice:\n\n• Snaptok does not own downloaded videos\n• Users are fully responsible for how they use downloaded content\n• We recommend always respecting creator copyrights\n• Use downloaded content for personal use only\n• Do not redistribute without creator's permission",
      id: "Ketentuan hak cipta:\n\n• Snaptok tidak memiliki video yang diunduh\n• Pengguna bertanggung jawab atas penggunaan konten\n• Hormati hak cipta kreator\n• Gunakan hanya untuk keperluan pribadi\n• Jangan distribusikan ulang tanpa izin",
      ru: "Важно об авторских правах:\n\n• Snaptok не владеет скачанными видео\n• Пользователи несут полную ответственность\n• Уважайте авторские права\n• Только для личного использования",
      zh: "版权重要说明：\n\n• Snaptok 不拥有下载的视频\n• 用户对下载内容的使用负全责\n• 建议始终尊重创作者版权\n• 仅供个人使用\n• 未经许可不得转发",
      ar: "إشعار حقوق النشر:\n\n• Snaptok لا تمتلك مقاطع الفيديو المنزّلة\n• يتحمل المستخدمون المسؤولية الكاملة\n• يرجى احترام حقوق المبدعين دائماً\n• للاستخدام الشخصي فقط",
    },
  },
];

export default function PrivacyPage() {
  const { lang } = useLang();
  return (
    <div className="flex min-h-screen flex-col">
      <DouyinHeader />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 mb-6">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t(tr.privacy_page.title, lang)}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t(tr.privacy_page.subtitle, lang)}</p>
            <p className="text-sm text-muted-foreground mt-4">{t(tr.privacy_page.updated, lang)}</p>
          </div>
          <div className="space-y-6">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <Card key={i} className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="rounded-lg bg-primary/10 p-2"><Icon className="h-5 w-5 text-primary" /></div>
                      {(section.title as Record<string,string>)[lang] ?? section.title.en}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {(section.content as Record<string,string>)[lang] ?? section.content.en}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <Card className="mt-8 border-border bg-muted/50">
            <CardContent className="p-8 text-center">
              <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t(tr.privacy_page.contact, lang)}</h2>
              <p className="text-muted-foreground mb-4">{t(tr.privacy_page.contact_sub, lang)}</p>
              <a href="mailto:defandryannn@gmail.com" className="text-primary font-medium hover:underline">defandryannn@gmail.com</a>
            </CardContent>
          </Card>
          <div className="mt-8 p-6 bg-muted/30 rounded-xl border border-border">
            <h3 className="font-semibold mb-3">{t(tr.privacy_page.changes, lang)}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{t(tr.privacy_page.changes_body, lang)}</p>
          </div>
        </div>
      </main>
      <DouyinFooter />
    </div>
  );
}
