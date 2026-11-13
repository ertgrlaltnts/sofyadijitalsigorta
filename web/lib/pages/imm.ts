import type { ProductPage } from "../product-pages";

export const IMM: ProductPage = {
  title: "İMM Sigortası Teklifi",
  description:
    "İMM (İhtiyari Mali Mesuliyet) sigortası trafik sigortasının yetmediği yerde devreye girer. Araç bilgilerinizi paylaşın, teklifinizi birlikte netleştirelim.",
  h1: "İMM Sigortası",
  shortName: "İMM",
  form: "imm",
  nav: { cover: "Kapsam", packages: "Nasıl alınır?", factors: "Fiyat", tips: "Dikkat", claim: "Hasar" },
  intro:
    "İMM sigortası, trafik sigortasının limitleri yetersiz kaldığında karşı tarafa ödemeniz gereken ek tutarı karşılayan ihtiyari bir sigortadır. Araç bilgilerinizi paylaşın, size uygun İMM teklifini birlikte netleştirelim.",
  assurances: ["Anlaşmalı şirketlerden teklif alın", "Limit seçimi sade bir dille anlatılır"],
  quoteSteps: [
    { title: "Aracınızı tanıtın", body: "Plaka ve ruhsat bilgisi yeterli; araç bulunamazsa bilgileri elle girersiniz." },
    { title: "Limiti seçin", body: "İMM bedelini ve manevi tazminatı belirleyin." },
    { title: "Fiyatları karşılaştırın", body: "Şirketlerin fiyatları kısa sürede, en uygundan başlayarak listelenir." },
  ],

  coverTitle: "İMM sigortası neleri karşılar?",
  coverIntro: "İMM, trafik sigortasının üstüne ek teminat sağlar. Kapsam ve limitler şirkete ve seçtiğiniz pakete göre değişir.",
  covers: [
    {
      icon: "shieldCheck",
      title: "Trafik sigortasının üstündeki zarar",
      body: "Kazada karşı tarafa ödemeniz gereken tutar trafik sigortası limitini aşarsa, aşan kısım İMM teminatı kapsamında karşılanır.",
    },
    {
      icon: "car",
      title: "Maddi zararlar",
      body: "Karşı taraftaki araç ve eşyaların hasarında, trafik limitini aşan maddi zarar poliçeye göre ödenir.",
    },
    {
      icon: "heart",
      title: "Bedeni zararlar",
      body: "Ağır yaralanma, sakatlık ya da ölüm gibi yüksek tazminat taleplerinde ek limit sunar.",
    },
    {
      icon: "scale",
      title: "Hukuki sorumluluk",
      body: "Poliçeye bağlı olarak manevi tazminat gibi kalemler de teminata dahil edilebilir. Kapsamı poliçenizde kontrol edin.",
    },
    {
      icon: "coin",
      title: "Yüksek limit seçenekleri",
      body: "Farklı limit seçenekleriyle, ödeyebileceğiniz en yüksek tutarı kendi riskinize göre belirlersiniz.",
    },
    {
      icon: "alert",
      title: "Kendi aracınız kapsam dışı",
      body: "İMM karşı tarafı korur. Kendi aracınızın hasarı için kasko gerekir.",
    },
  ],

  packagesTitle: "İMM sigortasını nasıl alırsınız?",
  packages: [
    {
      title: "Trafiğin üstünde ek teminat",
      tag: "İlave koruma",
      body: "İMM, zorunlu trafik sigortasının yerine geçmez; üzerine eklenir. Bu yüzden ikisinin de poliçede bulunması gerekir.",
    },
    {
      title: "Kasko içinde ya da ayrı",
      tag: "Seçenek",
      body: "Birçok kasko poliçesinde İMM teminatı yer alır. Kaskonuz yoksa ya da limit yetersizse İMM ayrı bir poliçe olarak da yapılabilir.",
    },
    {
      title: "Limit seçimi",
      tag: "En önemli karar",
      body: "Limit yükseldikçe koruma artar. Kullanım sıklığınıza ve riskinize uygun bir limit seçmek için danışmanlığımızdan yararlanabilirsiniz.",
    },
  ],

  factorsTitle: "İMM fiyatını ne belirler?",
  factorsIntro: "İMM primi, seçtiğiniz limite ve aracınıza göre değişir. Fiyatı etkileyen başlıca unsurlar şunlardır.",
  factorsCta: { label: "Limit seçmeme yardım edin", question: "İMM sigortasında hangi limiti seçmeliyim?" },
  factors: [
    { title: "Teminat limiti", body: "Yüksek limit daha fazla koruma sağlar ve primi artırır." },
    { title: "Araç bilgileri", body: "Marka, model, model yılı ve araç türü risk hesabında dikkate alınır." },
    { title: "Hasar geçmişi", body: "Hasarsız geçirdiğiniz yıllar prim avantajı sağlayabilir." },
    { title: "Sürücü profili", body: "Sürücünün yaşı ve ehliyet süresi fiyatı etkileyebilir." },
    { title: "Kullanım şekli", body: "Aracın kişisel mi ticari mi kullanıldığı ve kullanım yoğunluğu primi değiştirir." },
    { title: "Bulunduğunuz il", body: "Trafik yoğunluğu ve kaza sıklığı illere göre farklıdır." },
  ],

  tipsTitle: "İMM alırken nelere bakmalısınız?",
  tips: [
    {
      title: "Kaskonuzdaki İMM limiti",
      body: "Kaskonuzda İMM varsa limitini kontrol edin. Yetersizse ayrı bir İMM ya da limit artırımı düşünün.",
    },
    {
      title: "Kapsamın dışında kalanlar",
      body: "Manevi tazminat ve diğer kalemlerin dahil olup olmadığını poliçeden öğrenin.",
    },
    {
      title: "Kişi ve kaza başına limit",
      body: "Limitin kaza başına mı, kişi başına mı uygulandığını sorun.",
    },
    {
      title: "Trafik sigortası geçerliliği",
      body: "İMM, trafik sigortasıyla birlikte çalışır. Trafik poliçenizin süresinin dolmadığından emin olun.",
    },
    {
      title: "Şirketler arası farklar",
      body: "Aynı limit için bile teminat şartları şirketlere göre değişir. Teklifleri yalnızca fiyata göre değil kapsama göre karşılaştırın.",
    },
  ],
  tipsAside: {
    title: "Limitinizi birlikte değerlendirelim",
    body: "Mevcut poliçenizi ya da teklifi Sofya'ya anlatın, limitin size yeterli olup olmadığını sade bir dille açıklasın.",
    question: "Elimdeki İMM limiti yeterli mi, birlikte inceleyebilir miyiz?",
  },

  claimTitle: "Kaza olursa ne yapmalısınız?",
  claimSteps: [
    {
      title: "Güvenliği sağlayın",
      body: "Önce güvenliği sağlayın, gerekiyorsa 112'yi arayın ve aracı güvenli bir yere çekin.",
    },
    {
      title: "Tutanak ve fotoğraf",
      body: "Kaza tespit tutanağı düzenleyin, aracın ve olay yerinin fotoğraflarını çekin.",
    },
    {
      title: "Şirkete bildirin",
      body: "Trafik ve İMM poliçenizin bulunduğu şirkete hasarı en kısa sürede bildirin.",
    },
    {
      title: "Limit aşımını takip edin",
      body: "Tazminat trafik sigortası limitini aştığında şirket, fazlasını İMM teminatından değerlendirir. Süreçte belgeleri eksiksiz teslim edin.",
    },
  ],

  related: { title: "Aracınız için diğer sigortalar", slugs: ["trafik-sigortasi", "kasko", "ferdi-kaza"] },
  faq: [
    {
      q: "İMM sigortası nedir?",
      a: "İhtiyari Mali Mesuliyet sigortası, trafik sigortasının limitleri yetersiz kaldığında karşı tarafa ödemeniz gereken ek tutarı karşılayan isteğe bağlı bir sigortadır.",
    },
    {
      q: "İMM zorunlu mu?",
      a: "Hayır. İMM isteğe bağlıdır. Zorunlu olan trafik sigortasıdır. İMM, bu sigortanın limitinin üstünde koruma isteyenler içindir.",
    },
    {
      q: "İMM ile trafik sigortası arasındaki fark nedir?",
      a: "Trafik sigortası belirli limitlere kadar karşı tarafın zararını karşılar. İMM bu limit aşıldığında devreye girer. İkisi birbirinin yerine geçmez.",
    },
    {
      q: "İMM kaskonun içinde mi geliyor?",
      a: "Birçok kasko poliçesinde İMM teminatı bulunur. Limiti ve kapsamı poliçenizden kontrol edin. Yetersizse ayrı bir İMM poliçesi yaptırılabilir.",
    },
    {
      q: "İMM'de hangi limiti seçmeliyim?",
      a: "Aracınızı ne sıklıkla ve nerede kullandığınıza, yaşadığınız ildeki trafik yoğunluğuna ve karşılamak istediğiniz risk düzeyine göre seçilir. Sofya ve danışmanlarımız bu kararda yardımcı olur.",
    },
    {
      q: "İMM fiyatı neye göre belirlenir?",
      a: "Seçtiğiniz limit, araç bilgileri, hasar geçmişiniz, sürücü profiliniz ve bulunduğunuz il fiyatı etkiler.",
    },
    {
      q: "Kendi aracımın hasarını karşılar mı?",
      a: "Hayır. İMM karşı tarafın zararını karşılar. Kendi aracınızın hasarı için kasko sigortası gerekir.",
    },
    {
      q: "Teklif almak için hangi bilgiler gerekir?",
      a: "Aracınızın marka, model ve model yılı ile iletişim bilgileriniz yeterlidir. Poliçeyi başlatırken danışmanımız ek bilgiler isteyebilir.",
    },
  ],
};
