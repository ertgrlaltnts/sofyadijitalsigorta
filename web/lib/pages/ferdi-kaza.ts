import type { ProductPage } from "../product-pages";

export const ACCIDENT: ProductPage = {
  title: "Ferdi Kaza Sigortası Teklifi",
  description:
    "Ferdi kaza sigortası kaza sonucu ölüm, sakatlık ve tedavi masraflarına karşı sizi korur. Birkaç bilgiyle teklif isteyin, teminatları netleştirelim.",
  h1: "Ferdi Kaza Sigortası",
  shortName: "Ferdi kaza",
  form: "accident",
  nav: { cover: "Teminatlar", packages: "Seçenekler", factors: "Fiyat", tips: "Dikkat", claim: "Kaza" },
  intro:
    "Ferdi kaza sigortası, beklenmedik bir kaza sonucu ölüm, sürekli sakatlık ya da tedavi masrafı gibi durumlarda sizi ve ailenizi maddi olarak güvence altına alır. Birkaç bilgiyle size uygun ferdi kaza teklifini birlikte netleştirelim.",
  assurances: ["Anlık fiyat, tek formla", "Vefat bedelini ve ek teminatları siz seçersiniz"],
  quoteSteps: [
    { title: "Teminatı seçin", body: "Vefat bedelini belirleyin, deprem ve asistans eklerini isteğe göre açın." },
    { title: "Kimliğinizi doğrulayın", body: "T.C. kimlik no, doğum tarihi ve cep telefonunuz teklif için yeterli." },
    { title: "Fiyatları karşılaştırın", body: "Şirketlerin fiyatları kısa sürede, en uygundan başlayarak listelenir." },
  ],

  coverTitle: "Ferdi kaza sigortası neleri güvence altına alır?",
  coverIntro:
    "Ferdi kaza sigortası yalnızca kaza sonucu oluşan durumları kapsar; hastalıklar kapsam dışıdır. Teminat ve limitler poliçeye göre değişir.",
  covers: [
    {
      icon: "heart",
      title: "Kaza sonucu ölüm",
      body: "Poliçe süresince geçirilen bir kaza sonucu ölüm halinde, belirlenen teminat tutarı lehdarlara ödenir.",
    },
    {
      icon: "user",
      title: "Kalıcı sakatlık",
      body: "Kaza sonucu oluşan sürekli sakatlıkta, sakatlık oranına göre teminat tutarı üzerinden ödeme yapılır.",
    },
    {
      icon: "hospital",
      title: "Tedavi masrafları",
      body: "Kaza sonrası tedavi, ilaç ve hastane masrafları, poliçedeki limite kadar karşılanabilir.",
    },
    {
      icon: "calendar",
      title: "Geçici iş göremezlik",
      body: "Kaza nedeniyle çalışamadığınız günler için günlük tazminat ödenmesi ek teminat olarak seçilebilir.",
    },
    {
      icon: "globe",
      title: "Her yerde geçerli teminat",
      body: "Birçok poliçe, kazaların nerede olduğundan bağımsız olarak günün 24 saati koruma sağlar. Kapsam bölgesini poliçeden kontrol edin.",
    },
    {
      icon: "alert",
      title: "Kapsam dışında kalanlar",
      body: "Hastalıklar, intihar, alkollü araç kullanma gibi durumlar çoğu poliçede kapsam dışıdır. Şartları satın almadan önce okuyun.",
    },
  ],

  packagesTitle: "Hangi ferdi kaza poliçesi size uygun?",
  packages: [
    {
      title: "Kişisel poliçe",
      tag: "Tek kişi",
      body: "Yalnızca kendiniz için güvence isteyenlere uygundur. Mesleğinize ve yaşınıza göre teminat belirlenir.",
    },
    {
      title: "Aile poliçesi",
      tag: "Eş ve çocuklar",
      body: "Aile bireylerini tek poliçede toplayarak hem pratik hem de ekonomik bir çözüm sunar.",
    },
    {
      title: "Ek teminatlarla zenginleştirin",
      tag: "İsteğe bağlı",
      body: "Geçici iş göremezlik, tedavi masrafı ve ek tazminat gibi teminatlarla poliçenizi ihtiyacınıza göre şekillendirebilirsiniz.",
    },
  ],

  factorsTitle: "Ferdi kaza sigortası fiyatını ne belirler?",
  factorsIntro: "Ferdi kaza primi; kişiye, mesleğe ve seçilen teminatlara göre değişir. Başlıca unsurlar şunlardır.",
  factorsCta: { label: "Teminat seçmeme yardım edin", question: "Ferdi kaza sigortasında hangi teminat tutarını seçmeliyim?" },
  factors: [
    { title: "Meslek ve risk grubu", body: "Mesleğin kaza riskine göre belirlenen risk grubu primi doğrudan etkiler." },
    { title: "Teminat tutarı", body: "Ölüm ve sakatlık teminatı arttıkça prim de artar." },
    { title: "Yaş", body: "Sigortalının yaşı risk hesabında dikkate alınır." },
    { title: "Kişi sayısı", body: "Aile poliçelerinde kişi sayısı toplam primi değiştirir." },
    { title: "Ek teminatlar", body: "Tedavi masrafı ve geçici iş göremezlik gibi ek teminatlar primi artırır." },
    { title: "Poliçe süresi", body: "Poliçeler genellikle bir yıllıktır ve her yıl yenilenmesi gerekir." },
  ],

  tipsTitle: "Poliçe alırken nelere bakmalısınız?",
  tips: [
    {
      title: "Teminat tutarları",
      body: "Ölüm, sakatlık ve tedavi teminatlarının ayrı ayrı tutarlarını kontrol edin. Ailenizin ihtiyaçlarına uygun bir tutar seçin.",
    },
    {
      title: "Lehdar bilgisi",
      body: "Ölüm teminatı için lehdarın (ödemeyi alacak kişi) doğru belirlendiğinden emin olun.",
    },
    {
      title: "Meslek bilgisi",
      body: "Mesleğinizi doğru bildirin. Hatalı beyan, hasarda ödemeyi etkileyebilir.",
    },
    {
      title: "Kapsam dışı durumlar",
      body: "Riskli sporlar, alkollü sürüş gibi durumların kapsama girip girmediğini öğrenin.",
    },
    {
      title: "Diğer sigortalarla ilişkisi",
      body: "Trafik ve kasko sürücünün kendi yaralanmasını kapsamaz. Ferdi kaza bu boşluğu doldurabilir.",
    },
  ],
  tipsAside: {
    title: "Poliçenizi birlikte inceleyelim",
    body: "Elinizdeki teklifi ya da poliçeyi Sofya'ya anlatın, teminatları ve limitleri sade bir dille açıklasın.",
    question: "Elimdeki ferdi kaza sigortası teklifini birlikte inceleyebilir miyiz?",
  },

  claimTitle: "Kaza olursa ne yapmalısınız?",
  claimSteps: [
    {
      title: "Tıbbi yardım alın",
      body: "Önce sağlığınızı koruyun, gerekirse 112'yi arayın ve gerekli tedaviyi alın.",
    },
    {
      title: "Kaydı oluşturun",
      body: "Kazaya ilişkin tutanak, rapor ve tıbbi belgeleri saklayın. Gerekirse ilgili kurumlardan resmi kayıt alın.",
    },
    {
      title: "Şirkete bildirin",
      body: "Kazayı en kısa sürede, poliçede belirtilen süreyi aşmadan sigorta şirketine bildirin.",
    },
    {
      title: "Tazminat başvurusu",
      body: "Gerekli belgelerle başvurun. Şirket dosyayı inceler ve poliçe şartlarına göre teminat tutarı ödenir.",
    },
  ],

  related: { title: "Sizinle ilgili diğer sigortalar", slugs: ["tamamlayici-saglik", "seyahat-sigortasi", "trafik-sigortasi"] },
  faq: [
    {
      q: "Ferdi kaza sigortası nedir?",
      a: "Beklenmedik bir kaza sonucu oluşan ölüm, sürekli sakatlık ve tedavi masraflarına karşı maddi güvence sağlayan sigorta türüdür.",
    },
    {
      q: "Ferdi kaza sigortası hastalıkları kapsar mı?",
      a: "Hayır. Ferdi kaza sigortası yalnızca kaza sonucu oluşan durumları kapsar. Hastalıklar için sağlık sigortası gerekir.",
    },
    {
      q: "Neleri karşılar?",
      a: "Poliçeye göre kaza sonucu ölüm, sürekli sakatlık, tedavi masrafları ve geçici iş göremezlik gibi teminatlar yer alır.",
    },
    {
      q: "Trafik sigortası veya kasko ferdi kazanın yerini tutar mı?",
      a: "Hayır. Trafik sigortası ve kasko, sürücünün kendi yaralanmasını kapsamaz. Ferdi kaza sigortası bu açığı kapatabilir.",
    },
    {
      q: "Fiyatı neye göre belirlenir?",
      a: "Mesleğiniz, yaşınız, seçtiğiniz teminat tutarları ve ek teminatlar fiyatı etkiler.",
    },
    {
      q: "Aile poliçesi yaptırabilir miyim?",
      a: "Evet. Birçok şirket eş ve çocukları tek poliçede toplayan aile paketleri sunar.",
    },
    {
      q: "Kaza olursa ne yapmalıyım?",
      a: "Önce tıbbi yardım alın, tutanak ve tıbbi belgeleri saklayın, ardından kazayı en kısa sürede sigorta şirketine bildirin.",
    },
    {
      q: "Teklif almak için hangi bilgiler gerekir?",
      a: "Poliçe türü, doğum yılı ve mesleğiniz teklif için yeterlidir. Poliçeyi başlatırken danışmanımız ek bilgiler isteyebilir.",
    },
  ],
};
