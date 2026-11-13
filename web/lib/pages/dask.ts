import type { ProductPage } from "../product-pages";

export const DASK: ProductPage = {
  title: "DASK Zorunlu Deprem Sigortası",
  description:
    "DASK nedir, kimler yaptırmak zorunda, neleri karşılar? Binanızın bilgilerini paylaşın, zorunlu deprem sigortası teklifinizi birlikte netleştirelim.",
  h1: "DASK / Zorunlu Deprem Sigortası",
  shortName: "DASK",
  form: "dask",
  nav: { cover: "Kapsam", packages: "Bilmeniz gerekenler", factors: "Fiyat", tips: "Dikkat", claim: "Hasar" },
  intro:
    "DASK, tapu kaydı olan konutlar için zorunlu olan deprem sigortasıdır ve binanızı depremin neden olduğu hasarlara karşı korur. Binanızın bilgilerini paylaşın, DASK poliçenizi birlikte netleştirelim.",
  assurances: ["Zorunlu poliçeyi kolayca yaptırın", "DASK'ın neyi karşılayıp neyi karşılamadığı anlatılır"],
  quoteSteps: [
    { title: "Adresinizi seçin", body: "İl, ilçe, mahalle ve daireye kadar adresinizi seçin." },
    { title: "Binanızı tanıtın", body: "Yapı tarzı, inşaat yılı, kat sayısı ve metrekare bilgisi yeterli." },
    { title: "Fiyatları karşılaştırın", body: "Şirketlerin fiyatları kısa sürede, en uygundan başlayarak listelenir." },
  ],

  coverTitle: "DASK neleri karşılar?",
  coverIntro:
    "DASK, binanın yapısını depremden gelen zararlara karşı korur. Evin içindeki eşyaları ve kişileri kapsamaz.",
  covers: [
    {
      icon: "wave",
      title: "Deprem hasarı",
      body: "Deprem nedeniyle binanın duvar, kolon, kiriş, çatı ve temel gibi taşıyıcı ve yapısal kısımlarında oluşan zararlar karşılanır.",
    },
    {
      icon: "flame",
      title: "Depremin sonucu yangın ve patlama",
      body: "Depremin doğrudan neden olduğu yangın ve patlama zararları da kapsamdadır.",
    },
    {
      icon: "water",
      title: "Tsunami ve yer kayması",
      body: "Depremin sebep olduğu tsunami ve yer kayması gibi doğrudan sonuçlar teminata dahildir.",
    },
    {
      icon: "building",
      title: "Binanın kendisi",
      body: "DASK yalnızca konut binasını, yani tapusu olan yapıyı güvence altına alır. Ortak alanlar da bina kapsamında değerlendirilir.",
    },
    {
      icon: "coin",
      title: "Belirlenen limite kadar ödeme",
      body: "Teminat, DASK'ın belirlediği üst limite kadar geçerlidir. Gerçek bina değeri limitten yüksekse farkı tamamlayıcı sigorta ile kapatabilirsiniz.",
    },
    {
      icon: "alert",
      title: "Kapsam dışında kalanlar",
      body: "Evin içindeki eşyalar, araçlar ve kişisel yaralanmalar DASK kapsamında değildir. Eşyalar için konut sigortası, kişiler için ferdi kaza gerekir.",
    },
  ],

  packagesTitle: "DASK hakkında bilmeniz gerekenler",
  packages: [
    {
      title: "Zorunludur",
      tag: "Yasal zorunluluk",
      body: "Tapu kaydı olan konutlar için DASK yaptırmak zorunludur. Poliçe yoksa, tapu işlemlerinde ve bazı kamu hizmetlerinde engellerle karşılaşabilirsiniz.",
    },
    {
      title: "Tarife herkes için aynıdır",
      tag: "Fiyat",
      body: "DASK primleri ortak tarifeye göre hesaplanır. Şirket değiştirmek fiyatı değiştirmez, önemli olan doğru bilgiyle ve zamanında yaptırmaktır.",
    },
    {
      title: "Eşyalar ve fazlası için ek koruma",
      tag: "Tamamlayıcı",
      body: "DASK yalnızca binayı korur. Eşyalarınız ve limitin üzerindeki bina bedeli için konut sigortasındaki deprem teminatını düşünebilirsiniz.",
    },
  ],

  factorsTitle: "DASK fiyatını ne belirler?",
  factorsIntro: "DASK primi belirlenmiş tarifeye göre hesaplanır. Fiyat, binanızın özelliklerine bağlı olarak şu unsurlarla değişir.",
  factorsCta: { label: "Bilgilerim doğru mu?", question: "DASK fiyatı neye göre hesaplanır, bilgilerimi nasıl doğru girmeliyim?" },
  factors: [
    { title: "Yapı tarzı", body: "Betonarme, yığma gibi yapı tarzları farklı tarifeye tabidir." },
    { title: "Brüt metrekare", body: "Binanın kullanım alanı büyüdükçe teminat bedeli ve prim artar." },
    { title: "Deprem risk bölgesi", body: "Bulunduğunuz il ve ilçenin deprem risk grubuna göre prim farklılaşır." },
    { title: "Bina yaşı ve kat sayısı", body: "Yapının yapıldığı dönem ve kat sayısı tarifede dikkate alınabilir." },
    { title: "Poliçe süresi", body: "DASK poliçeleri yıllıktır. Her yıl yenilenmesi gerekir." },
    { title: "Doğru bilgi", body: "Metrekare ya da yapı tarzının hatalı beyanı, hasarda ödemeyi etkileyebilir." },
  ],

  tipsTitle: "DASK yaptırırken nelere bakmalısınız?",
  tips: [
    {
      title: "Bilgilerin doğruluğu",
      body: "Yapı tarzı, metrekare ve adres bilgisinin tapu ve ruhsatla uyumlu olduğundan emin olun.",
    },
    {
      title: "Poliçe bitiş tarihi",
      body: "Poliçeniz bittiğinde bina korumasız kalır. Süreyi takip edin ve zamanında yenileyin.",
    },
    {
      title: "Eşyalarınızı unutmayın",
      body: "DASK evin içindeki eşyaları karşılamaz. Eşyaları korumak için konut sigortası yaptırabilirsiniz.",
    },
    {
      title: "Limit yeterli mi?",
      body: "DASK limiti binanızın gerçek değerinden düşükse, farkı için tamamlayıcı deprem teminatı düşünebilirsiniz.",
    },
    {
      title: "Kiracıysanız",
      body: "DASK'ı bina sahibi yaptırmakla yükümlüdür. Kiracı olarak eşyalarınız için ayrıca konut sigortası alabilirsiniz.",
    },
  ],
  tipsAside: {
    title: "Poliçenizi birlikte inceleyelim",
    body: "DASK poliçenizi ya da bilgilerinizi Sofya'ya anlatın, neyin kapsamda olduğunu sade bir dille açıklasın.",
    question: "DASK poliçemde nelerin kapsamda olduğunu birlikte inceleyebilir miyiz?",
  },

  claimTitle: "Deprem sonrası ne yapmalısınız?",
  claimSteps: [
    {
      title: "Güvenliği sağlayın",
      body: "Önce kendinizin ve ailenizin güvenliğini sağlayın. Hasarlı binaya yetkililer izin vermeden girmeyin.",
    },
    {
      title: "Hasarı belgeleyin",
      body: "Binadaki hasarı mümkün olduğunda fotoğraf ve videoyla kayıt altına alın. Güvenli olmayan alanlara girmeyin.",
    },
    {
      title: "Başvuruyu yapın",
      body: "DASK'a ya da poliçeyi yaptırdığınız sigorta şirketine en kısa sürede hasar bildiriminde bulunun.",
    },
    {
      title: "Ekspertiz ve ödeme",
      body: "Görevlendirilen eksper hasarı belirler. Hasar tespit edildikten sonra ödeme, poliçe limitine kadar yapılır.",
    },
  ],

  related: { title: "Evinizle ilgili diğer sigortalar", slugs: ["konut-sigortasi", "ferdi-kaza", "tamamlayici-saglik"] },
  faq: [
    {
      q: "DASK zorunlu mu?",
      a: "Evet. Zorunlu Deprem Sigortası (DASK), tapu kaydı olan konutlar için yasal bir zorunluluktur.",
    },
    {
      q: "DASK neleri karşılar?",
      a: "Depremin binanın yapısında oluşturduğu hasarları, depremin doğrudan neden olduğu yangın, patlama, tsunami ve yer kayması zararlarını karşılar.",
    },
    {
      q: "DASK eşyalarımı da kapsar mı?",
      a: "Hayır. DASK yalnızca binayı güvence altına alır. Evin içindeki eşyalar için konut sigortası yaptırmanız gerekir.",
    },
    {
      q: "DASK fiyatı şirketlere göre değişir mi?",
      a: "Hayır. DASK primleri ortak tarifeye göre hesaplanır. Yapı tarzı, metrekare ve deprem risk bölgesi gibi bilgiler fiyatı belirler.",
    },
    {
      q: "Kiracı DASK yaptırmak zorunda mı?",
      a: "Hayır. DASK'ı bina sahibi yaptırır. Kiracılar kendi eşyaları için ayrıca konut sigortası yaptırabilir.",
    },
    {
      q: "DASK poliçesi ne kadar geçerli?",
      a: "DASK poliçeleri bir yıllıktır. Süresi dolmadan yenilenmesi gerekir.",
    },
    {
      q: "DASK limiti neden önemli?",
      a: "Hasar ödemesi DASK'ın belirlediği üst limitle sınırlıdır. Binanızın değeri bu limitten yüksekse, farkı tamamlayıcı bir sigorta ile karşılayabilirsiniz.",
    },
    {
      q: "Teklif almak için hangi bilgiler gerekir?",
      a: "Binanın il ve ilçesi, yapı tarzı ve brüt metrekare bilgisi teklif için yeterlidir. Poliçeyi başlatırken danışmanımız adres ve tapu bilgilerinizi ayrıca isteyebilir.",
    },
  ],
};
