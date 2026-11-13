import type { ProductPage } from "../product-pages";

export const HEALTH: ProductPage = {
  title: "Tamamlayıcı Sağlık Sigortası",
  description:
    "Tamamlayıcı sağlık sigortası, SGK'lıların özel hastanelerde fark ücreti ödemeden tedavi olmasına yardımcı olur. Teklif isteyin, kapsamı netleştirelim.",
  h1: "Tamamlayıcı Sağlık Sigortası",
  shortName: "Tamamlayıcı sağlık",
  form: "health",
  nav: { cover: "Kapsam", packages: "Seçenekler", factors: "Fiyat", tips: "Dikkat", claim: "Kullanım" },
  intro:
    "Tamamlayıcı sağlık sigortası, SGK'lıların anlaşmalı özel hastanelerde, devletin karşıladığı kısmın dışında kalan fark ücretini ödemeden muayene, tahlil ve tedavi olmasına yardımcı olur. Birkaç bilgiyle size uygun teklifi birlikte netleştirelim.",
  assurances: ["Anlık fiyat, tek formla", "Birden fazla şirketi yan yana karşılaştırın"],
  quoteSteps: [
    { title: "Teminatı seçin", body: "Yatarak ya da yatarak + ayakta tedaviyi seçin, boy ve kilonuzu yazın." },
    { title: "Kimliğinizi doğrulayın", body: "T.C. kimlik no, doğum tarihi ve cep telefonunuz teklif için yeterli." },
    { title: "Fiyatları karşılaştırın", body: "Şirketlerin fiyatları kısa sürede, en uygundan başlayarak listelenir." },
  ],

  coverTitle: "Tamamlayıcı sağlık sigortası neleri kapsar?",
  coverIntro:
    "Kapsam, seçtiğiniz pakete ve şirkete göre değişir. Aşağıdakiler en sık karşılaşılan teminatlardır.",
  covers: [
    {
      icon: "hospital",
      title: "Özel hastanelerde fark ücreti",
      body: "SGK'nın karşıladığı kısmın dışında özel hastanelerin talep ettiği fark ücreti, poliçedeki şartlara göre karşılanır.",
    },
    {
      icon: "user",
      title: "Ayakta tedavi",
      body: "Muayene, tahlil ve görüntüleme gibi ayakta yapılan sağlık hizmetleri teminata dahil edilebilir.",
    },
    {
      icon: "cross",
      title: "Yatarak tedavi",
      body: "Hastane yatışı, ameliyat ve ilgili işlemler poliçedeki limitler dahilinde kapsama girebilir.",
    },
    {
      icon: "heart",
      title: "Doğum ve ek teminatlar",
      body: "Doğum, diş ya da check-up gibi hizmetler bazı paketlerde ek teminat olarak sunulur.",
    },
    {
      icon: "users",
      title: "Aile paketi",
      body: "Eş ve çocukları tek poliçede toplayarak, aile bireylerinin hepsini kapsayan paketler seçilebilir.",
    },
    {
      icon: "alert",
      title: "Kapsam dışında kalanlar",
      body: "Önceden var olan hastalıklar, bekleme süresi içindeki tedaviler gibi durumlar çoğu poliçede kısıtlıdır. Şartları poliçeden okuyun.",
    },
  ],

  packagesTitle: "Hangi paket size uygun?",
  packages: [
    {
      title: "Bireysel paket",
      tag: "Tek kişi",
      body: "Yalnızca kendiniz için poliçe isteyenlere uygundur. Hastane grubu ve teminat seçenekleriyle ihtiyacınıza göre belirlenir.",
    },
    {
      title: "Aile paketi",
      tag: "Eş ve çocuklar",
      body: "Aile bireylerini tek poliçede toplar. Kişi sayısına göre prim değişir, kapsam herkes için ortak şartlarda sunulur.",
    },
    {
      title: "Hastane grubu seçimi",
      tag: "Önemli karar",
      body: "Anlaşmalı hastane ağı geniş olan paketler daha fazla seçenek sunar ve genellikle daha yüksek primlidir. Yaşadığınız ildeki hastaneleri kontrol edin.",
    },
  ],

  factorsTitle: "Tamamlayıcı sağlık sigortası fiyatını ne belirler?",
  factorsIntro: "Fiyat, sigortalanacak kişilerin özelliklerine ve seçtiğiniz pakete göre değişir. Başlıca unsurlar şunlardır.",
  factorsCta: { label: "Paketi seçmeme yardım edin", question: "Tamamlayıcı sağlık sigortasında hangi hastane grubunu ve paketi seçmeliyim?" },
  factors: [
    { title: "Yaş", body: "Sigortalının yaşı arttıkça prim genellikle artar." },
    { title: "Hastane grubu", body: "Anlaşmalı hastane ağı genişledikçe prim yükselir." },
    { title: "Teminat kapsamı", body: "Ayakta, yatarak ve ek teminatların seçimi primi değiştirir." },
    { title: "Kişi sayısı", body: "Aile poliçelerinde kişi sayısı toplam primi etkiler." },
    { title: "Yaşadığınız il", body: "Sağlık hizmetinin maliyeti illere göre farklılaşabilir." },
    { title: "Sağlık beyanı", body: "Bazı şirketler sağlık durumuna göre farklı tarife uygulayabilir." },
  ],

  tipsTitle: "Poliçe alırken nelere bakmalısınız?",
  tips: [
    {
      title: "SGK'lı olmanız",
      body: "Tamamlayıcı sağlık sigortası, SGK güvencesi olanlar içindir. Sosyal güvence durumunuzu önceden netleştirin.",
    },
    {
      title: "Anlaşmalı hastaneler",
      body: "Yaşadığınız ildeki ve tercih ettiğiniz hastanelerin poliçenin anlaşmalı listesinde olduğunu kontrol edin.",
    },
    {
      title: "Bekleme süreleri",
      body: "Bazı tedaviler için poliçe başladıktan sonra beklemeniz gereken süreler olabilir. Bu şartları baştan öğrenin.",
    },
    {
      title: "Önceden var olan hastalıklar",
      body: "Poliçe öncesindeki rahatsızlıkların kapsam dışı kalabileceğini göz önünde bulundurun.",
    },
    {
      title: "Yıllık limitler",
      body: "Teminatların yıllık limitlerini ve muafiyetleri poliçeden kontrol edin.",
    },
  ],
  tipsAside: {
    title: "Poliçenizi birlikte inceleyelim",
    body: "Elinizdeki teklifi ya da poliçeyi Sofya'ya anlatın, kapsamı ve limitleri sade bir dille açıklasın.",
    question: "Elimdeki tamamlayıcı sağlık sigortası teklifini birlikte inceleyebilir miyiz?",
  },

  claimTitle: "Poliçenizi nasıl kullanırsınız?",
  claimSteps: [
    {
      title: "Hastaneyi seçin",
      body: "Poliçenizdeki anlaşmalı hastane listesinden size en yakın ve uygun kurumu seçin.",
    },
    {
      title: "Kimliğinizi ve poliçenizi gösterin",
      body: "Muayene için hastaneye giderken kimlik ve poliçe bilgilerinizi yanınızda bulundurun.",
    },
    {
      title: "Kapsamdaki işlemler",
      body: "Anlaşmalı kurumda, poliçe kapsamındaki işlemler için fark ücreti genellikle doğrudan şirket tarafından ödenir.",
    },
    {
      title: "Kapsam dışı işlemleri öğrenin",
      body: "Poliçe kapsamı dışındaki işlemler ve limit aşımları için hastaneden önce bilgi isteyin.",
    },
  ],

  related: { title: "Sağlığınızla ilgili diğer sigortalar", slugs: ["ferdi-kaza", "seyahat-sigortasi", "konut-sigortasi"] },
  faq: [
    {
      q: "Tamamlayıcı sağlık sigortası nedir?",
      a: "SGK'lıların anlaşmalı özel hastanelerde, devletin karşıladığı kısmın dışındaki fark ücretini ödemeden muayene, tahlil ve tedavi olmasına yardımcı olan sigorta türüdür.",
    },
    {
      q: "Kimler tamamlayıcı sağlık sigortası yaptırabilir?",
      a: "SGK güvencesi olanlar yaptırabilir. Şirketlerin yaş sınırları ve şartları farklılık gösterebilir.",
    },
    {
      q: "Tamamlayıcı sağlık sigortası özel sağlık sigortasından farkı nedir?",
      a: "Tamamlayıcı sağlık sigortası SGK'nın üzerine fark ücretini kapsar ve genellikle daha uygun primlidir. Özel sağlık sigortası ise SGK'dan bağımsız, daha kapsamlı bir teminat sunar.",
    },
    {
      q: "Fiyatını ne belirler?",
      a: "Sigortalının yaşı, seçilen hastane grubu, teminat kapsamı, kişi sayısı ve yaşadığı il fiyatı etkiler.",
    },
    {
      q: "Önceden var olan hastalıklar kapsanır mı?",
      a: "Çoğu poliçede poliçe öncesinde var olan hastalıklar kapsam dışıdır ya da bekleme süresine tabidir. Şartları poliçeden kontrol edin.",
    },
    {
      q: "Bekleme süresi var mı?",
      a: "Bazı tedaviler için poliçe başladıktan sonra beklemeniz gereken süreler olabilir. Bunlar şirketten şirkete değişir.",
    },
    {
      q: "Aile üyelerini aynı poliçeye ekleyebilir miyim?",
      a: "Evet, birçok şirket eş ve çocukları aynı poliçede toplayan aile paketleri sunar. Kişi sayısına göre prim değişir.",
    },
    {
      q: "Teklif almak için hangi bilgiler gerekir?",
      a: "Sosyal güvence durumunuz, doğum yılınız ve poliçede kaç kişi olacağı teklif için yeterlidir. Poliçeyi başlatırken danışmanımız ek bilgiler isteyebilir.",
    },
  ],
};
