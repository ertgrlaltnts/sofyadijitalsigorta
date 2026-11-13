import type { ProductPage } from "../product-pages";

export const TRAFFIC: ProductPage = {
  title: "Trafik Sigortası Teklifi",
  description:
    "Zorunlu trafik sigortası neyi karşılar, poliçe bitince ne yapmalısınız? Araç bilgilerinizi paylaşın, trafik sigortası teklifinizi birlikte netleştirelim.",
  h1: "Trafik Sigortası",
  shortName: "Trafik sigortası",
  form: "traffic",
  nav: { cover: "Kapsam", packages: "Bilmeniz gerekenler", factors: "Fiyat", tips: "Dikkat", claim: "Kaza" },
  intro:
    "Trafik sigortası, aracınızla bir kazaya karıştığınızda karşı tarafa verdiğiniz zararları karşılayan zorunlu bir sigortadır. Araç bilgilerinizi paylaşın, size uygun trafik sigortası teklifini birlikte netleştirelim.",
  assurances: ["Poliçe bitişinizi kaçırmadan yenileyin", "Anlaşmalı şirketlerden teklif alın"],
  quoteSteps: [
    { title: "Aracınızı tanıtın", body: "Plaka ve ruhsat seri/no bilgisi yeterli." },
    { title: "Kimliğinizi doğrulayın", body: "T.C. kimlik no, doğum tarihi ve cep telefonunuz teklif için yeterli." },
    { title: "Fiyatları karşılaştırın", body: "Şirketlerin fiyatları kısa sürede, en uygundan başlayarak listelenir." },
  ],

  coverTitle: "Trafik sigortası neleri karşılar?",
  coverIntro:
    "Trafik sigortası yalnızca kazada karşı tarafa verdiğiniz zararları kapsar. Ödeme tutarı poliçedeki teminat limitleriyle sınırlıdır.",
  covers: [
    {
      icon: "car",
      title: "Karşı tarafın araç hasarı",
      body: "Kusurlu olduğunuz kazada karşı taraftaki aracın ve diğer eşyaların uğradığı maddi zarar, poliçe limitine kadar karşılanır.",
    },
    {
      icon: "heart",
      title: "Bedeni zararlar",
      body: "Kazada karşı taraftaki kişilerin yaralanması, sürekli sakatlığı ya da ölümü halinde tazminat ödenir.",
    },
    {
      icon: "hospital",
      title: "Tedavi giderleri",
      body: "Kazada yaralananların tedavi giderleri poliçenin teminat kapsamında değerlendirilir.",
    },
    {
      icon: "scale",
      title: "Kusur oranına göre ödeme",
      body: "Tazminat, kazadaki kusur oranına göre belirlenir. Kusuru olmayan tarafın zararı karşı tarafın poliçesinden karşılanır.",
    },
    {
      icon: "shieldCheck",
      title: "Hasarsızlık indirimi",
      body: "Hasar yapmadığınız yıllarda prim indirimi kazanabilirsiniz. Hasar sonrası uygulama şirkete göre değişebilir.",
    },
    {
      icon: "alert",
      title: "Kapsam dışında kalanlar",
      body: "Kendi aracınızın hasarı ve sürücünün kendi yaralanmaları trafik sigortasının dışındadır. Bunlar için kasko ve ferdi kaza sigortasına bakın.",
    },
  ],

  packagesTitle: "Trafik sigortasında bilmeniz gerekenler",
  packages: [
    {
      title: "Zorunlu poliçe",
      tag: "Yasal zorunluluk",
      body: "Aracı olan herkesin yaptırması gerekir. Poliçesi olmayan araç için idari para cezası uygulanır ve araç trafikten men edilebilir.",
    },
    {
      title: "Karşı tarafı korur",
      tag: "Kapsam",
      body: "Poliçe, kusurlu olduğunuz kazalarda karşı tarafın zararını karşılar. Kendi aracınızın hasarı için ayrıca kasko gerekir.",
    },
    {
      title: "Süre ve yenileme",
      tag: "Takip",
      body: "Poliçeler yıllıktır. Bitiş tarihinden önce yenilemek, kesintisiz teminat ve hasarsızlık avantajınızı korumanızı sağlar.",
    },
  ],

  factorsTitle: "Trafik sigortası fiyatını ne belirler?",
  factorsIntro:
    "Trafik sigortası primleri düzenleyici kurumun belirlediği tarife çerçevesinde hesaplanır. Yine de aracınıza ve geçmişinize göre fiyat değişir.",
  factorsCta: { label: "Fiyat farkını öğrenin", question: "Trafik sigortası fiyatları şirketlere göre neden değişir?" },
  factors: [
    { title: "Araç türü ve kullanımı", body: "Aracın binek, ticari ya da motosiklet olması ve kullanım şekli primi etkiler." },
    { title: "Hasar geçmişi", body: "Hasarsız geçirdiğiniz yıllar için indirim, hasar yaptığınız yıllar için ek prim uygulanabilir." },
    { title: "Aracın yaşı ve modeli", body: "Aracın model yılı ve özellikleri risk hesabında dikkate alınır." },
    { title: "Kayıtlı olduğu il", body: "Prim, aracın kayıtlı olduğu şehre göre farklılaşabilir." },
    { title: "Ödeme koşulları", body: "Peşin ödeme ya da taksit seçenekleri toplam maliyeti değiştirebilir." },
    { title: "Hizmet farkları", body: "Şirketlerin sunduğu ek hizmetler ve hasar süreçleri fiyatla birlikte değerlendirilmelidir." },
  ],

  tipsTitle: "Poliçeyi yaptırırken nelere bakmalısınız?",
  tips: [
    {
      title: "Poliçe bitiş tarihi",
      body: "Bitiş tarihinden önce yenileyin. Poliçesiz geçen günler hem ceza riski hem de olası bir kazada tüm zararı kendiniz ödemek demektir.",
    },
    {
      title: "Teminat limitleri",
      body: "Limitler düzenli olarak güncellenir. Poliçenizdeki geçerli limitleri kontrol edin.",
    },
    {
      title: "Hasarsızlık kademeniz",
      body: "Önceki şirketinizden gelen hasarsızlık durumunuzun yeni poliçeye doğru yansıdığından emin olun.",
    },
    {
      title: "Kasko ve İMM ile birlikte düşünün",
      body: "Trafik sigortası yalnızca karşı tarafı korur. Kendi aracınız için kasko, limitin üstündeki zararlar için İMM gerekebilir.",
    },
    {
      title: "Doğru araç bilgisi",
      body: "Plaka, şasi numarası ve kullanım şekli doğru girilmelidir. Hatalı bilgi hasar anında sorun çıkarabilir.",
    },
  ],
  tipsAside: {
    title: "Teklifinizi birlikte inceleyelim",
    body: "Elinizdeki teklifi ya da poliçeyi Sofya'ya anlatın, limitleri ve kapsamı sade bir dille açıklasın.",
    question: "Elimdeki trafik sigortası teklifini birlikte inceleyebilir miyiz?",
  },

  claimTitle: "Kaza olursa ne yapmalısınız?",
  claimSteps: [
    {
      title: "Güvenliği sağlayın",
      body: "Önce kendinizin ve yolcuların güvenliğini sağlayın, gerekiyorsa 112'yi arayın. Aracı yolu kapatmayacak şekilde güvenli bir yere çekin.",
    },
    {
      title: "Tutanak düzenleyin",
      body: "Karşı tarafla birlikte kaza tespit tutanağı doldurun. Plaka, ehliyet ve poliçe bilgilerini birbirinize alın, fotoğraf çekin.",
    },
    {
      title: "Şirketlere bildirin",
      body: "Hasarı en kısa sürede kendi sigorta şirketinize ve karşı tarafın poliçesinin bulunduğu şirkete bildirin.",
    },
    {
      title: "Hasar dosyasını takip edin",
      body: "Şirket kusur oranını ve hasarı değerlendirir. Gerekli belgeleri eksiksiz teslim etmek süreci hızlandırır.",
    },
  ],

  related: { title: "Aracınız için diğer sigortalar", slugs: ["kasko", "imm", "ferdi-kaza"] },
  faq: [
    {
      q: "Trafik sigortası zorunlu mu?",
      a: "Evet. Trafikte yer alan her motorlu aracın geçerli bir zorunlu trafik sigortası olmak zorundadır.",
    },
    {
      q: "Trafik sigortası neyi karşılar?",
      a: "Kazada kusurlu olduğunuzda karşı tarafın araç ve eşya hasarını, yaralanma, sakatlık ve ölüm gibi bedeni zararlarını poliçe limitlerine kadar karşılar.",
    },
    {
      q: "Trafik sigortası olmazsa ne olur?",
      a: "Sigortasız araç tespit edildiğinde idari para cezası uygulanır ve araç trafikten men edilebilir. Olası bir kazada karşı tarafın tüm zararını kendiniz ödemek zorunda kalırsınız.",
    },
    {
      q: "Trafik sigortası ile kasko arasındaki fark nedir?",
      a: "Trafik sigortası zorunludur ve karşı tarafın zararını karşılar. Kasko isteğe bağlıdır ve kendi aracınızın hasarını, çalınmasını, yangın ve doğal afet zararlarını karşılar.",
    },
    {
      q: "Trafik sigortası fiyatı neye göre hesaplanır?",
      a: "Aracın türü ve kullanım şekli, model yılı, hasar geçmişiniz, kayıtlı olduğu il ve ödeme koşulları fiyatı etkiler. Primler düzenleyici kurumun tarifesi çerçevesinde belirlenir.",
    },
    {
      q: "Poliçe süresi dolarsa ne olur?",
      a: "Süre dolduğu andan itibaren aracınız sigortasız sayılır. Kesintisiz teminat için bitiş tarihinden önce yenilemeniz gerekir.",
    },
    {
      q: "Aracımı satarsam poliçe ne olur?",
      a: "Trafik sigortası genellikle araçla birlikte yeni sahibine devredilir. Satış sonrası durumu sigorta şirketine bildirmeniz gerekir.",
    },
    {
      q: "Teklif almak için hangi bilgiler gerekir?",
      a: "Aracınızın marka, model ve model yılı ile iletişim bilgileriniz teklif için yeterlidir. Poliçeyi başlatırken danışmanımız plaka ve ruhsat bilgilerinizi ayrıca isteyebilir.",
    },
  ],
};
