import type { ProductPage } from "../product-pages";

export const HOME: ProductPage = {
  title: "Konut Sigortası Teklifi",
  description:
    "Konut sigortası evinizi ve eşyalarınızı yangın, su baskını ve hırsızlığa karşı korur. Birkaç bilgiyle teklif isteyin, kapsamı birlikte netleştirelim.",
  h1: "Konut Sigortası",
  shortName: "Konut sigortası",
  form: "home",
  nav: { cover: "Teminatlar", packages: "Paketler", factors: "Fiyat", tips: "Dikkat", claim: "Hasar" },
  intro:
    "Konut sigortası, evinizi ve içindeki eşyaları yangın, su baskını, hırsızlık gibi risklere karşı güvence altına alır. Ev sahibi de olsanız kiracı da, birkaç bilgiyle size uygun konut sigortası teklifini birlikte netleştirelim.",
  assurances: ["Ev sahipleri ve kiracılar için", "Eşya ve bina ayrı ayrı seçilebilir"],
  quoteSteps: [
    { title: "Adresinizi ve konutunuzu tanıtın", body: "Adres, yapı bilgileri, kullanım şekli ve metrekare yeterli." },
    { title: "Bedelleri belirleyin", body: "Konutunuzun ve eşyalarınızın bedelini yazın." },
    { title: "Fiyatları karşılaştırın", body: "Şirketlerin fiyatları kısa sürede, en uygundan başlayarak listelenir." },
  ],

  coverTitle: "Konut sigortası neleri güvence altına alır?",
  coverIntro:
    "Aşağıdakiler konut sigortasının en sık karşılaşılan teminatlarıdır. Hangilerinin pakete dahil olduğu şirkete ve seçtiğiniz pakete göre değişir.",
  covers: [
    {
      icon: "flame",
      title: "Yangın, yıldırım ve patlama",
      body: "Evinizde çıkan yangın, yıldırım düşmesi ya da patlama sonucu bina ve eşyalarınızın uğradığı zararlar karşılanır.",
    },
    {
      icon: "water",
      title: "Su baskını ve su hasarı",
      body: "Tesisat patlaması, sızıntı ya da su baskını nedeniyle oluşan hasarlar teminat kapsamında yer alabilir.",
    },
    {
      icon: "lock",
      title: "Hırsızlık",
      body: "Evinizden eşyalarınızın çalınması ya da hırsızlık girişiminde verilen hasarlar karşılanır.",
    },
    {
      icon: "storm",
      title: "Fırtına, dolu ve doğal afetler",
      body: "Fırtına, dolu, kar ağırlığı gibi doğal olayların neden olduğu zararlar pakete göre dahil edilebilir.",
    },
    {
      icon: "wave",
      title: "Deprem (ek teminat)",
      body: "Zorunlu deprem sigortasının (DASK) üstünde, ek teminat olarak deprem koruması seçilebilir.",
    },
    {
      icon: "glass",
      title: "Cam kırılması",
      body: "Pencere, cam balkon gibi camların kırılması için ek teminat seçeneği sunulur.",
    },
    {
      icon: "scale",
      title: "Üçüncü kişilere karşı sorumluluk",
      body: "Evinizden kaynaklanan bir olayda komşunuza ya da üçüncü kişilere verdiğiniz zarar poliçe limitiyle karşılanabilir.",
    },
    {
      icon: "phone",
      title: "Ev asistans hizmetleri",
      body: "Çilingir, tesisatçı, elektrik tamiri gibi acil durum hizmetleri pakete eklenebilir.",
    },
  ],

  packagesTitle: "Hangi konut sigortası size uygun?",
  packages: [
    {
      title: "Eşya sigortası",
      tag: "Kiracılar için",
      body: "Kiracılar ve evinin içindeki eşyayı korumak isteyenler için uygundur. Evin kendisi değil, içindeki eşyalar güvence altına alınır.",
    },
    {
      title: "Bina sigortası",
      tag: "Ev sahipleri için",
      body: "Ev sahibi olarak binanızın yapısal hasarlarına karşı koruma sağlar. Tek başına ya da eşya sigortasıyla birlikte alınabilir.",
    },
    {
      title: "Eşya ve bina birlikte",
      tag: "Kapsamlı paket",
      body: "Hem evinizi hem içindekileri tek poliçede toplar. Ek teminatlarla ihtiyacınıza göre şekillendirilebilir.",
    },
  ],

  factorsTitle: "Konut sigortası fiyatını ne belirler?",
  factorsIntro: "Aynı büyüklükteki iki ev için bile teklifler farklı çıkabilir. Fiyatı etkileyen başlıca unsurlar şunlardır.",
  factorsCta: { label: "Primi nasıl düşürürüm?", question: "Konut sigortası fiyatı neye göre belirlenir, primi nasıl düşürebilirim?" },
  factors: [
    { title: "Konutun büyüklüğü", body: "Brüt metrekare ve oda sayısı, bina bedelini ve primi doğrudan etkiler." },
    { title: "Eşya bedeli", body: "Sigortalanan eşyaların toplam değeri arttıkça prim de artar." },
    { title: "Yapı tarzı ve yaşı", body: "Binanın yapım tarzı ve yaşı, risk hesabında dikkate alınır." },
    { title: "Konumu", body: "Bulunduğunuz il ve ilçe, hırsızlık ve doğal afet riskleri nedeniyle fiyatı değiştirir." },
    { title: "Seçilen teminatlar", body: "Deprem, cam kırılması, asistans gibi ek teminatlar primi artırır." },
    { title: "Güvenlik önlemleri", body: "Alarm, çelik kapı ya da güvenlikli site gibi unsurlar bazı şirketlerde prime yansıyabilir." },
  ],

  tipsTitle: "Teklif alırken nelere bakmalısınız?",
  tips: [
    {
      title: "Sigorta bedeli",
      body: "Eşyalarınızın ve evinizin gerçek değerine yakın bir bedel seçin. Düşük bedel, hasarda eksik ödeme anlamına gelebilir.",
    },
    {
      title: "DASK ile farkı",
      body: "DASK yalnızca binayı depreme karşı korur. Eşyalar ve diğer riskler için konut sigortası gerekir.",
    },
    {
      title: "Muafiyet ve limitler",
      body: "Hasarda kendi payınıza düşen tutarı ve her teminatın limitini poliçeden kontrol edin.",
    },
    {
      title: "Değerli eşyalar",
      body: "Mücevher, sanat eseri gibi değerli eşyalar için ayrı limit ya da özel teminat gerekebilir.",
    },
    {
      title: "Hariç tutulan durumlar",
      body: "Boş bırakılan evler, ihmal ve bakımsızlık gibi durumlar bazı poliçelerde kapsam dışıdır. Şartları satın almadan önce okuyun.",
    },
  ],
  tipsAside: {
    title: "Poliçenizi birlikte inceleyelim",
    body: "Elinizdeki teklifi ya da poliçeyi Sofya'ya anlatın, kapsamı ve limitleri sade bir dille açıklasın.",
    question: "Elimdeki konut sigortası teklifini birlikte inceleyebilir miyiz?",
  },

  claimTitle: "Hasar olursa ne yapmalısınız?",
  claimSteps: [
    {
      title: "Güvenliği sağlayın",
      body: "Önce kendinizin ve ailenizin güvenliğini sağlayın. Gerekirse 112, 110 ya da 155'i arayın ve hasarı büyütecek durumları (su, elektrik, gaz) kesin.",
    },
    {
      title: "Hasarı belgeleyin",
      body: "Hasarı fotoğraf ve videoyla kayıt altına alın. Hırsızlık ve yangın gibi durumlarda ilgili birimlere başvurup tutanak alın.",
    },
    {
      title: "Şirkete bildirin",
      body: "Hasarı en kısa sürede, poliçenizde belirtilen süreyi aşmadan sigorta şirketine bildirin.",
    },
    {
      title: "Ekspertiz ve ödeme",
      body: "Şirket bir eksper görevlendirir. İncelemeden sonra hasar, poliçe şartlarına göre karşılanır.",
    },
  ],

  related: { title: "Evinizle ilgili diğer sigortalar", slugs: ["dask", "ferdi-kaza", "tamamlayici-saglik"] },
  faq: [
    {
      q: "Konut sigortası zorunlu mu?",
      a: "Hayır, konut sigortası isteğe bağlıdır. Zorunlu olan deprem sigortası DASK'tır. Konut sigortası, yangın, su baskını, hırsızlık gibi diğer risklere karşı koruma sağlar.",
    },
    {
      q: "Kiracılar konut sigortası yaptırabilir mi?",
      a: "Evet. Kiracılar, evin kendisini değil içindeki eşyalarını eşya sigortasıyla koruyabilir. Ayrıca kiralanan evde oluşabilecek zararlara karşı sorumluluk teminatı da seçilebilir.",
    },
    {
      q: "Konut sigortası neleri karşılar?",
      a: "Pakete göre yangın, su baskını, hırsızlık, doğal afetler, cam kırılması, üçüncü kişilere karşı sorumluluk ve asistans hizmetleri gibi teminatlar yer alır.",
    },
    {
      q: "Konut sigortası ile DASK arasındaki fark nedir?",
      a: "DASK zorunludur ve yalnızca binayı depreme ve depremin doğrudan sonuçlarına karşı korur. Konut sigortası isteğe bağlıdır ve eşya ile diğer riskleri de kapsayabilir.",
    },
    {
      q: "Konut sigortası fiyatı neye göre belirlenir?",
      a: "Konutun büyüklüğü, eşya ve bina bedeli, yapı tarzı, bulunduğu yer, seçilen teminatlar ve güvenlik önlemleri fiyatı etkiler.",
    },
    {
      q: "Ev boşken konut sigortası geçerli mi?",
      a: "Uzun süre boş bırakılan evler için bazı poliçelerde kısıtlamalar olabilir. Boş kalma süresi şartlarını poliçenizden kontrol edin.",
    },
    {
      q: "Hasar durumunda ne yapmalıyım?",
      a: "Güvenliği sağlayın, hasarı fotoğraflayıp belgeleyin, gerekiyorsa ilgili kurumlardan tutanak alın ve hasarı en kısa sürede sigorta şirketine bildirin.",
    },
    {
      q: "Teklif almak için hangi bilgiler gerekir?",
      a: "Konutun bulunduğu il ve ilçe, ev sahibi mi kiracı mı olduğunuz, neyi sigortalatmak istediğiniz ve yaklaşık metrekare bilgisi teklif için yeterlidir.",
    },
  ],
};
