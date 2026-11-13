export const CONTACT = {
  whatsappUrl: "https://wa.me/905301764894",
  phone: "+90 530 176 48 94",
  phoneHref: "tel:+905301764894",
  email: "bilgi@sofyadijitalsigorta.com",
  quoteBase: "https://teklif.sofyadijitalsigorta.com",
  kvkkUrl: "/kvkk",
  privacyUrl: "/gizlilik-politikasi",
  cookieUrl: "/cerez-politikasi",
  insuranceInfoUrl: "/sigorta-bilgilendirme",
  refundUrl: "/cayma-iptal-iade",
  /** Official social profiles (full URLs), used as sameAs in the structured data. Add them when the accounts exist. */
  sameAs: [] as string[],
  aboutUrl: "https://www.sofyadijitalsigorta.com/hakkimizda/",
};

export const NAV = [
  { href: "/", label: "Anasayfa" },
  { href: "/urunler", label: "Ürünlerimiz" },
  { href: "/sofya", label: "Sofya" },
  { href: "/sss", label: "Sık sorulanlar" },
];

export const DEFAULT_WELCOME = "Merhaba, ben Sofya 👋 Hangi sigorta konusunda yardımcı olabilirim?";

export const DEFAULT_SUGGESTIONS = [
  "Kasko ile trafik sigortası arasındaki fark nedir?",
  "DASK eşyalarımı da kapsar mı?",
  "Kiracıyım, konut sigortası yaptırabilir miyim?",
  "Tamamlayıcı sağlık sigortası nedir?",
];

export const ASK_EVENT = "sofya:ask";
export const OPEN_EVENT = "sofya:open";

export interface Product {
  slug: string;
  /** Path of this product's page on the quote site (CONTACT.quoteBase). */
  quote: string;
  name: string;
  summary: string;
  question: string;
  intro: string;
  points: string[];
  questions: string[];
}

const PRODUCT_LIST: Product[] = [
  {
    slug: "kasko",
    quote: "kasko-sigortasi",
    name: "Kasko",
    summary: "Aracınızın kendi hasarlarını karşılar. İsteğe bağlıdır.",
    question: "Kasko sigortası için teklif almak istiyorum.",
    intro:
      "Kasko, aracınızın kendi hasarlarını güvence altına alan isteğe bağlı bir sigortadır. Kapsamı poliçeye göre değişir: çarpma gibi kazaların yanı sıra çalınma, yangın ve doğal afet gibi riskler de teminata dahil edilebilir.",
    points: [
      "Zorunlu değildir, ama aracınızın değerini korur.",
      "Teminat kapsamı ve muafiyet tutarı şirkete ve pakete göre değişir.",
      "Teklifleri yalnızca fiyata göre değil, teminatlara ve muafiyete göre karşılaştırın.",
    ],
    questions: ["Kasko neleri kapsar?", "Muafiyet ne demek?", "Kasko ile trafik sigortası arasındaki fark nedir?"],
  },
  {
    slug: "trafik-sigortasi",
    quote: "trafik-sigortasi",
    name: "Trafik Sigortası",
    summary: "Zorunludur. Kazada başkalarına verdiğiniz zararları karşılar.",
    question: "Trafik sigortası için teklif almak istiyorum.",
    intro:
      "Zorunlu trafik sigortası, aracınızla bir kazaya karıştığınızda karşı tarafa verdiğiniz maddi ve bedeni zararları karşılar. Aracı olan herkes için yasal bir zorunluluktur.",
    points: [
      "Sigortasız araç tespit edildiğinde trafikten men edilebilir ve para cezası uygulanır.",
      "Kendi aracınızın hasarını karşılamaz, bunun için kasko gerekir.",
      "Poliçe süresi dolmadan yenilemeyi unutmayın.",
    ],
    questions: ["Trafik sigortası süresi bitince ne olur?", "Trafik sigortası kendi aracımı kapsar mı?", "İMM nedir?"],
  },
  {
    slug: "dask",
    quote: "deprem-sigortasi",
    name: "DASK / Deprem",
    summary: "Zorunlu deprem sigortası. Binanızı güvence altına alır, içindeki eşyayı almaz.",
    question: "DASK zorunlu deprem sigortası hakkında bilgi almak istiyorum.",
    intro:
      "DASK, zorunlu deprem sigortasıdır. Yalnızca binanın kendisini (duvarlar, çatı, temel gibi) güvence altına alır. Evin içindeki eşyalar teminat dışındadır.",
    points: [
      "Eşyalarınızı korumak için ayrıca konut sigortası yaptırmanız gerekir.",
      "Prim, binanın yapı özelliklerine ve bulunduğu bölgeye göre değişir.",
      "Poliçeyi süresi dolmadan yenilemek gerekir.",
    ],
    questions: ["DASK eşyalarımı da kapsar mı?", "DASK zorunlu mu?", "DASK ile konut sigortası farkı nedir?"],
  },
  {
    slug: "konut-sigortasi",
    quote: "konut-sigortasi",
    name: "Konut Sigortası",
    summary: "Yangın, su baskını ve hırsızlığa karşı evinizi ve eşyalarınızı korur.",
    question: "Konut sigortası hakkında bilgi almak istiyorum.",
    intro:
      "Konut sigortası, evinizi ve içindeki eşyalarınızı yangın, su baskını ve hırsızlık gibi risklere karşı korur. Kiracılar da evin kendisini değil, kendi eşyalarını güvence altına alan bir poliçe yaptırabilir.",
    points: [
      "Ev sahipleri bina ve eşya için, kiracılar yalnızca eşya için poliçe alabilir.",
      "DASK'tan farklı olarak içerideki eşyaları da kapsayabilir.",
      "Kıymetli eşyalar için poliçedeki limitlere dikkat edin.",
    ],
    questions: ["Kiracıyım, konut sigortası yaptırabilir miyim?", "Konut sigortası neleri kapsar?", "Eşya sigortası nedir?"],
  },
  {
    slug: "tamamlayici-saglik",
    quote: "tamamlayici-saglik-sigortasi",
    name: "Tamamlayıcı Sağlık Sigortası",
    summary: "SGK'lılar için anlaşmalı özel hastanelerde fark ücreti ödemeden muayene ve tedavi.",
    question: "Tamamlayıcı sağlık sigortası hakkında bilgi almak istiyorum.",
    intro:
      "Tamamlayıcı sağlık sigortası, SGK'lıların anlaşmalı özel hastanelerde yalnızca devlete ödenen zorunlu katkı payını ödeyerek, ilave fark ücreti vermeden muayene, tahlil ve tedavi olmasını sağlar.",
    points: [
      "SGK kapsamında olmanız gerekir.",
      "Yalnızca poliçedeki anlaşmalı hastane listesinde geçerlidir.",
      "Hastane ağını ve yıllık limitleri satın almadan önce kontrol edin.",
    ],
    questions: ["Tamamlayıcı sağlık sigortası nedir?", "Hangi hastanelerde geçerli?", "Özel sağlık sigortasından farkı nedir?"],
  },
  {
    slug: "seyahat-sigortasi",
    quote: "seyahat-saglik-sigortasi",
    name: "Seyahat Sigortası",
    summary: "Yurt dışı gezilerde sağlık gideri ve bagaj gibi beklenmedik durumlara karşı güvence.",
    question: "Seyahat sigortası hakkında bilgi almak istiyorum.",
    intro:
      "Seyahat sigortası, yolculuk sırasında ortaya çıkabilecek acil sağlık giderleri, bagaj kaybı ve seyahat iptali gibi beklenmedik durumlara karşı güvence sağlar. Kapsam gideceğiniz ülkeye ve süreye göre değişir.",
    points: [
      "Bazı ülkelerin vizesi için seyahat sigortası şarttır.",
      "Yolculuk süresi ve gideceğiniz bölge prim ve teminatı belirler.",
      "Riskli sporlar gibi bazı durumlar kapsam dışında kalabilir.",
    ],
    questions: ["Vize için seyahat sigortası gerekir mi?", "Seyahat sigortası neleri kapsar?", "Bagaj kaybolursa ne olur?"],
  },
  {
    slug: "imm",
    quote: "imm-sigortasi",
    name: "İMM Sigortası",
    summary: "Trafik sigortası limitlerini aşan zararlar için ek koruma sağlar.",
    question: "İMM sigortası nedir, ne işe yarar?",
    intro:
      "İhtiyari Mali Mesuliyet (İMM) sigortası, zorunlu trafik sigortasının limitlerini aşan zararlar için ek koruma sağlar. Büyük bir kazada trafik sigortasının ödediği tutar yetmediğinde farkı karşılar.",
    points: [
      "Daha yüksek limit, ağır kazalarda daha geniş güvence demektir.",
      "Trafik sigortasının yerine geçmez, onu tamamlar.",
      "Limiti aracınızın kullanımına ve riskinize göre seçin.",
    ],
    questions: ["İMM nedir?", "Hangi limiti seçmeliyim?", "İMM ile trafik sigortası farkı nedir?"],
  },
  {
    slug: "ferdi-kaza",
    quote: "ferdi-kaza-sigortasi",
    name: "Ferdi Kaza Sigortası",
    summary: "Kaza sonucu oluşan ölüm, sakatlık ve tedavi giderlerine karşı güvence.",
    question: "Ferdi kaza sigortası hakkında bilgi almak istiyorum.",
    intro:
      "Ferdi kaza sigortası, kaza sonucu ortaya çıkabilecek ölüm, sürekli sakatlık ve tedavi giderlerine karşı sizi ya da yakınlarınızı güvence altına alır.",
    points: [
      "Yalnızca kaza kaynaklı olayları kapsar, hastalıkları kapsamaz.",
      "Teminat tutarları poliçede ayrı ayrı belirlenir.",
      "Araç içi kişiler için trafik ve kasko poliçeleriyle birlikte de düşünülebilir.",
    ],
    questions: ["Ferdi kaza sigortası neleri kapsar?", "Hastalık da kapsanır mı?", "Kimler için uygun?"],
  },
];

const PRODUCT_ORDER = ["kasko", "trafik-sigortasi", "imm", "konut-sigortasi", "dask", "seyahat-sigortasi", "tamamlayici-saglik", "ferdi-kaza"];

export const PRODUCTS: Product[] = PRODUCT_ORDER.map((slug) => PRODUCT_LIST.find((product) => product.slug === slug)!);

/** The ninth tile on the product grid: not a product page, it opens WhatsApp. */
export const QUOTE_ACTION = {
  slug: "ruhsat-teklif",
  name: "Ruhsatını Gönder, Teklif Al",
  href: CONTACT.whatsappUrl,
};

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

/** Illustrative conversation fragments floating around Sofya in the home hero. */
export const HERO_BUBBLES = [
  { from: "user", text: "Kasko yaptırmak istiyorum" },
  { from: "bot", text: "Harika! Aracınızın plakasını yazın, birlikte bakalım 🚗" },
  { from: "user", text: "DASK eşyalarımı da kapsar mı?" },
  { from: "bot", text: "Hayır, yalnızca binayı. Eşyalar için konut sigortası gerekir." },
  { from: "user", text: "Kiracıyım, ne yapmalıyım?" },
  { from: "bot", text: "Eşya sigortası tam size göre ✓" },
] as const;

export const MARQUEE_ITEMS = ["Kasko", "Trafik sigortası", "DASK", "Konut sigortası", "Tamamlayıcı sağlık", "Seyahat", "İMM", "Ferdi kaza"];

export const BENEFITS = [
  {
    title: "Form doldurmadan başlayın",
    body: "İhtiyacınızı sohbete yazmanız yeterli. Sofya size sayfalarca soru yerine tek tek, sade sorular sorar.",
  },
  {
    title: "Sigorta diline çeviri",
    body: "Muafiyet, teminat, limit... Sofya poliçedeki terimleri herkesin anlayacağı bir dille anlatır.",
  },
  {
    title: "Yalnızca ihtiyacınız olan teminat",
    body: "Standart paketler yerine gerçekten gerekli olanı belirlemenize yardım eder, gereksiz ek ödemeyi önler.",
  },
  {
    title: "7/24 açık",
    body: "Pazar sabahı kasko ya da gece yarısı hasar sonrası yönlendirme. Sofya mesai saati beklemez.",
  },
];

export const STEPS = [
  {
    title: "Sofya'ya sorun",
    body: "Ne aradığınızı kendi cümlelerinizle yazın. Hangi sigortaya ihtiyacınız olduğundan emin değilseniz de sorun.",
  },
  {
    title: "Teminatları anlayın",
    body: "Sofya seçenekleri, muafiyetleri ve kapsamı sade bir dille anlatır. Aklınıza takılan her şeyi tekrar sorabilirsiniz.",
  },
  {
    title: "Teklifle devam edin",
    body: "Hazır olduğunuzda teklif sayfasına geçin ya da danışmanımızla WhatsApp'tan yazışın.",
  },
];

export const PRIVACY_POINTS = [
  {
    title: "Hassas bilgiler kaydedilmeden maskelenir",
    body: "Sohbete TC kimlik no, kart no, IBAN ya da telefon yazsanız bile bu bilgiler saklanmadan ve yapay zekaya gönderilmeden önce gizlenir.",
  },
  {
    title: "Sofya uydurmaz",
    body: "Bilmediği bir konuda fiyat, kampanya ya da anlaşmalı şirket bilgisi icat etmez. Kesin bilgi için sizi danışmana yönlendirir.",
  },
  {
    title: "IP adresiniz ham olarak tutulmaz",
    body: "Kötüye kullanımı önlemek için yalnızca geri döndürülemeyen bir özet saklanır.",
  },
];

export const FAQ = [
  {
    q: "Kasko ve trafik sigortası arasındaki fark nedir?",
    a: "Trafik sigortası zorunludur ve başkalarına verdiğiniz zararları karşılar. Kasko isteğe bağlıdır ve aracınızın kendi hasarlarını teminat altına alır.",
  },
  {
    q: "Trafik sigortasını yaptırmazsam ne olur?",
    a: "Sigortasız araç tespit edildiğinde trafikten men edilebilir ve para cezası uygulanır. Olası bir kazada tüm masrafları kendiniz karşılamak zorunda kalırsınız.",
  },
  {
    q: "Tamamlayıcı sağlık sigortası nedir?",
    a: "SGK'lıların anlaşmalı özel hastanelerde yalnızca devlete ödenen zorunlu katkı payını ödeyerek, ilave fark ücreti vermeden muayene, tahlil ve tedavi olmasını sağlayan sigorta türüdür.",
  },
  {
    q: "Deprem sigortasında eşyalar teminat altında mıdır?",
    a: "Hayır. Zorunlu Deprem Sigortası (DASK) yalnızca binanızı (duvarlar, çatı, temel gibi) güvence altına alır. Evin içindeki eşyalar için Özel Konut Sigortası yaptırmanız gerekir.",
  },
  {
    q: "Konut sigortasını kiracılar da yaptırabilir mi?",
    a: "Evet. Eşya sigortası olarak da bilinen bu modelle evin kendisini değil, içindeki eşyalarınızı yangın, su baskını ve hırsızlık gibi zararlara karşı güvence altına alırsınız.",
  },
  {
    q: "DASK zorunlu mu?",
    a: "Evet. Zorunlu Deprem Sigortası (DASK), tapu kaydı olan konutlar için yasal bir zorunluluktur. Yalnızca binayı güvence altına alır, evin içindeki eşyaları kapsamaz.",
  },
  {
    q: "Seyahat sigortası ne zaman gerekir?",
    a: "Yurt dışı yolculuklarda sağlık giderlerine karşı teminat sağlar. Bazı ülkelerin vize başvurularında da istenir. Gideceğiniz ülkenin şartlarını önceden kontrol edin.",
  },
  {
    q: "Sofya gerçek bir kişi mi?",
    a: "Hayır, Sofya yapay zeka destekli bir sigorta asistanıdır. Sorularınızı yanıtlar ve sizi yönlendirir. Kesin fiyat ve poliçe işlemleri için uzman danışmanlarımızla da görüşebilirsiniz.",
  },
];

/** Contracted insurers. Logo files live in public/partners and are named after the file stem. */
export const PARTNERS = [
  { name: "AXA Sigorta", file: "axasigorta" },
  { name: "Allianz Sigorta", file: "allianzsigorta" },
  { name: "HDI Sigorta", file: "hdisigorta" },
  { name: "AK Sigorta", file: "aksigorta" },
  { name: "Neova Sigorta", file: "neovasigorta" },
  { name: "Ana Sigorta", file: "anasigorta" },
  { name: "Anadolu Sigorta", file: "anadolu-sigorta" },
  { name: "Hepiyi Sigorta", file: "hepiyisigorta" },
  { name: "Quick Sigorta", file: "quicksigorta" },
  { name: "Emaa Sigorta", file: "emaa-sigorta" },
  { name: "AXA Hayat ve Emeklilik", file: "axahayatemeklilik" },
  { name: "Unico Sigorta", file: "unico-sigorta" },
  { name: "GIG Sigorta", file: "gig-sigorta" },
  { name: "Doğa Sigorta", file: "doga-sigorta" },
];

/**
 * PLACEHOLDER: these testimonials are sample text. Replace them with real, consented customer quotes before launch.
 */
export const TESTIMONIALS = [
  {
    quote: "Kaskomu yenilemek için saatlerce form doldurmayı bekliyordum. Sofya'yla birkaç cümle yazdım, teklifler yan yana karşıma geldi. Hangisinin neden daha uygun olduğunu da anlattı.",
    name: "Ayşe K.",
    detail: "Kasko",
  },
  {
    quote: "Muafiyet, teminat, limit... hiçbirini tam anlamıyordum. İlk kez bir poliçede neye ödediğimi net olarak gördüm.",
    name: "Mehmet T.",
    detail: "Konut Sigortası",
  },
  {
    quote: "Seyahatime bir gün kala yazdım. Hangi teminatın bana yeteceğini sordu, gereksiz ek ödeme yapmadan poliçemi aldım.",
    name: "Elif S.",
    detail: "Seyahat Sigortası",
  },
  {
    quote: "Trafik sigortası bitiş tarihimi unutmuştum. Ruhsatımı gönderdim, kısa sürede fiyatları karşılaştırıp seçimimi yaptım.",
    name: "Burak D.",
    detail: "Trafik Sigortası",
  },
  {
    quote: "DASK'ın zorunlu olduğunu biliyordum ama kapsamını bilmiyordum. Sorularımı tek tek, sabırla cevapladı.",
    name: "Zeynep A.",
    detail: "DASK / Deprem",
  },
  {
    quote: "Annem için tamamlayıcı sağlık sigortası arıyordum. Seçenekleri sade bir dille anlattı, kararımızı rahatça verdik.",
    name: "Can Y.",
    detail: "Tamamlayıcı Sağlık Sigortası",
  },
];
