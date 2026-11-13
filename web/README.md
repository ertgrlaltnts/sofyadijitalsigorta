# Sofya AI web sitesi

Next.js (App Router, Tailwind 4) ile yazılmış public site. Chat, `api/` içindeki NestJS servisine tarayıcıdan doğrudan bağlanır.

```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_URL
npm install
npm run dev                  # http://localhost:4001
```

`api/.env` içindeki `CORS_ORIGINS` değerine bu sitenin adresi (`http://localhost:4001` ve canlı alan adı) eklenmelidir.

## Sayfalar

`/` anasayfa · `/urunler` · `/urunler/[slug]` · `/sofya` · `/sss` · `/rehber` · `/rehber/[slug]` · `/kvkk` · `/gizlilik-politikasi`

Ürün metinleri, SSS ve iletişim bilgileri `lib/content.ts` içindedir.

## Notlar

- **Sayfa geçişleri:** React `<ViewTransition>` + View Transitions API. Her sayfa `PageTransition` ile sarılır, iç bağlantılar `AppLink` kullanır. Desteklemeyen tarayıcılarda geçiş animasyonsuz çalışır.
- **Chat:** Anasayfada hero'nun içindedir, diğer sayfalarda sağ alttaki yüzen düğmeyle açılır. Konuşma `sessionStorage`'da tutulur, sayfa değişince kaybolmaz.
- **Sofya görselleri:** `public/sofya-master.png` (hero), `public/sofya-hello.png` ("Şeffaf, hızlı ve güvenli" bölümü) 1600×1600 şeffaf PNG kaynaklardır; ziyaretçiye `next/image` ile AVIF/WebP ve ekrana uygun boyutta sunulur. `public/sofya-avatar.png` (288 px) master görselden yüz odaklı kırpılmış küçük yuvarlak avatardır (sohbet, "Sofya'ya sorun" düğmesi). Master değişirse avatarı yeniden kırpın.
- **Ürün ikonları:** Kendi ikonlarınızı `public/icons/<slug>.svg` (ya da `.png` / `.webp`) olarak ekleyin. Dosya varsa kartta otomatik kullanılır, yoksa yer tutucu çizgi ikon görünür. Slug'lar: `kasko`, `trafik-sigortasi`, `dask`, `konut-sigortasi`, `tamamlayici-saglik`, `seyahat-sigortasi`, `imm`, `ferdi-kaza`, `ruhsat-teklif`. Kare, şeffaf zeminli ve en az 128 px olmalı.
- **Anlaşmalı şirketler:** Logolar `public/partners/` içindedir, liste `lib/content.ts` içindeki `PARTNERS` dizisidir. Yeni logo eklemek için dosyayı koyup diziye bir satır eklemek yeterli (300×150, şeffaf PNG).
- **Hareket:** `prefers-reduced-motion` açıkken animasyonlar kapanır.

## SEO ve yayın

- `NEXT_PUBLIC_SITE_URL` (canlı alan adı, sonunda `/` olmadan) canonical, sitemap, `robots.txt` ve schema.org için kullanılır. Canlıya almadan önce `.env.production` ya da barındırma ayarlarında tanımlayın.
- `GOOGLE_SITE_VERIFICATION` (isteğe bağlı): Search Console HTML etiketi doğrulama kodu.
- Otomatik üretilenler: `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, paylaşım görseli (`app/opengraph-image.jpg`, `app/twitter-image.jpg`), `app/apple-icon.png`.
- Yapılandırılmış veri: `InsuranceAgency` + `WebSite` (tüm sayfalar, `app/layout.tsx`), `FAQPage` (anasayfa, `components/home-seo.tsx`). Soru-cevaplar `lib/content.ts` içindeki `FAQ` listesinden gelir.
- `components/reviews.tsx` (müşteri yorumları) anasayfada **kullanılmıyor**. `TESTIMONIALS` örnek metindir; gerçek ve izinli yorumlar gelmeden yayınlamayın. Yorumlar şemaya (`Review`/`AggregateRating`) da eklenmemelidir.
- Yayından önce: eski WordPress adresleri için `next.config.ts` içine 301 yönlendirmeleri ekleyin; KVKK ve Hakkımızda bağlantıları (`CONTACT.kvkkUrl`, `aboutUrl`) hâlâ eski siteyi gösterir.

## Ürün sayfaları

- `lib/product-pages.ts` içinde içeriği tanımlanan ürünler (şu an yalnızca `kasko`) `components/product-landing.tsx` şablonuyla açılır: hero'da teklif formu, altında kapsam, paketler, fiyat etkenleri, dikkat edilecekler, hasar adımları, SSS. Girişi olmayan ürünler kısa şablonu kullanır (`app/urunler/[slug]/page.tsx`).
- `components/quote-form.tsx` sunucuya veri göndermez; form bilgilerini hazır bir WhatsApp mesajına çevirir (`CONTACT.whatsappUrl`). Başvuruların bir sistemde (CRM, e-posta, API) toplanması isteniyorsa gönderme işlemi orada değiştirilmelidir. TC kimlik numarası istenmez.
- Sayfa metinleri genel bilgi niteliğindedir; yayından önce bir sigorta uzmanı gözden geçirmelidir.
