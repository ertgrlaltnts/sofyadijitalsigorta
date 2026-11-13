import type { ProductPage } from "../product-pages";

export const TRAVEL: ProductPage = {
  title: "Seyahat Sağlık Sigortası Teklifi",
  description:
    "Seyahat sağlık sigortası yurt dışında tedavi masraflarınızı karşılar, vize başvurularında da istenir. Gideceğiniz ülkeyi yazın, teklifinizi netleştirelim.",
  h1: "Seyahat Sağlık Sigortası",
  shortName: "Seyahat sigortası",
  form: "travel",
  nav: { cover: "Teminatlar", packages: "Seçenekler", factors: "Fiyat", tips: "Dikkat", claim: "Sorun halinde" },
  intro:
    "Seyahat sağlık sigortası, yurt dışında hastalanırsanız ya da kaza geçirirseniz tedavi masraflarınızı karşılar ve bazı ülkelerin vize başvurularında istenir. Gideceğiniz yeri ve tarihleri yazın, size uygun seyahat sigortası teklifini birlikte netleştirelim.",
  assurances: ["Vize başvurusu için uygun poliçeler", "Teminat ve limit farkları sade bir dille anlatılır"],
  quoteSteps: [
    { title: "Yolculuğunuzu tanıtın", body: "Gideceğiniz yer, gidiş-dönüş tarihleri ve paket yeterli." },
    { title: "Kimliğinizi doğrulayın", body: "T.C. kimlik no, doğum tarihi ve cep telefonunuz teklif için yeterli." },
    { title: "Fiyatları karşılaştırın", body: "Şirketlerin fiyatları kısa sürede, en uygundan başlayarak listelenir." },
  ],

  coverTitle: "Seyahat sigortası neleri güvence altına alır?",
  coverIntro:
    "Aşağıdakiler seyahat sağlık sigortasının en sık karşılaşılan teminatlarıdır. Hangilerinin pakete dahil olduğu şirkete ve seçtiğiniz pakete göre değişir.",
  covers: [
    {
      icon: "cross",
      title: "Acil tedavi masrafları",
      body: "Yurt dışında ani hastalık ya da kaza halinde muayene, tedavi ve ilaç masrafları poliçe limitine kadar karşılanır.",
    },
    {
      icon: "hospital",
      title: "Hastane yatışı ve ameliyat",
      body: "Hastaneye yatış, ameliyat gibi yüksek maliyetli tedaviler teminat limitleri dahilinde karşılanabilir.",
    },
    {
      icon: "plane",
      title: "Tıbbi tahliye ve ülkeye dönüş",
      body: "Tedavinin yerinde mümkün olmadığı durumlarda, sağlık gerekçesiyle ülkeye nakil masrafları teminata dahil edilebilir.",
    },
    {
      icon: "suitcase",
      title: "Bagaj kaybı ve gecikmesi",
      body: "Bagajınızın kaybolması ya da gecikmesi durumunda poliçedeki şartlara göre ödeme yapılır.",
    },
    {
      icon: "calendar",
      title: "Seyahat iptali ve kesintisi",
      body: "Beklenmedik durumlar nedeniyle yolculuğun iptali ya da yarıda kesilmesi ek teminatla güvence altına alınabilir.",
    },
    {
      icon: "heart",
      title: "Kişisel kaza",
      body: "Seyahat sırasındaki kazalarda ölüm ya da sürekli sakatlık gibi durumlar için teminat sunulabilir.",
    },
    {
      icon: "scale",
      title: "Üçüncü kişilere karşı sorumluluk",
      body: "Seyahatte yanlışlıkla başkasına verdiğiniz zararlar için sorumluluk teminatı seçilebilir.",
    },
    {
      icon: "phone",
      title: "7/24 asistans hizmeti",
      body: "Sağlık sorunu yaşadığınızda telefonla tıbbi yönlendirme ve hastane ayarlama hizmetleri sunulabilir.",
    },
  ],

  packagesTitle: "Hangi seyahat sigortası size uygun?",
  packages: [
    {
      title: "Schengen paketi",
      tag: "Vize için",
      body: "Schengen vizesi başvurularında, belirli bir asgari teminat tutarını sağlayan poliçe istenir. Güncel şartlar için konsolosluk ya da vize merkezine danışın.",
    },
    {
      title: "Tatil ve iş seyahati",
      tag: "Standart",
      body: "Vize gerekmese de yurt dışında sağlık masrafları yüksek olabilir. Seyahat süresine ve ülkeye uygun bir poliçe seçilebilir.",
    },
    {
      title: "Ek teminatlarla zenginleştirin",
      tag: "İsteğe bağlı",
      body: "Seyahat iptali, bagaj, kişisel kaza gibi ek teminatlarla poliçenizi yolculuğunuza göre şekillendirebilirsiniz.",
    },
  ],

  factorsTitle: "Seyahat sigortası fiyatını ne belirler?",
  factorsIntro: "Fiyat; nereye, ne kadar süre ve kaç kişiyle gittiğinize göre değişir. Başlıca unsurlar şunlardır.",
  factorsCta: { label: "Doğru teminatı seçmeme yardım edin", question: "Seyahat sağlık sigortasında hangi teminat limitini seçmeliyim?" },
  factors: [
    { title: "Gidilecek ülke", body: "Sağlık maliyetlerinin yüksek olduğu ülkeler için prim daha yüksek olabilir." },
    { title: "Seyahat süresi", body: "Gün sayısı arttıkça prim de artar." },
    { title: "Yolcunun yaşı", body: "Yaş grubu primi etkiler. Çocuk ve ileri yaş için farklı tarifeler olabilir." },
    { title: "Teminat limiti", body: "Daha yüksek tedavi limiti daha fazla koruma sağlar ve primi artırır." },
    { title: "Ek teminatlar", body: "İptal, bagaj, kişisel kaza gibi ek teminatlar toplam maliyete eklenir." },
    { title: "Yolcu sayısı", body: "Aile ya da grup poliçelerinde kişi başına maliyet değişebilir." },
  ],

  tipsTitle: "Poliçe alırken nelere bakmalısınız?",
  tips: [
    {
      title: "Vize şartları",
      body: "Gideceğiniz ülkenin asgari teminat ve kapsam şartlarını önceden kontrol edin. Poliçe süresi vize sürenizi kapsamalıdır.",
    },
    {
      title: "Tedavi limiti",
      body: "Tedavi giderleri yurt dışında yüksek olabilir. Limiti ülkeye ve ihtiyacınıza göre seçin.",
    },
    {
      title: "Önceden var olan hastalıklar",
      body: "Seyahat öncesinde mevcut olan rahatsızlıklar çoğu poliçede kapsam dışındadır. Kronik bir hastalığınız varsa şartlara dikkat edin.",
    },
    {
      title: "Riskli aktiviteler",
      body: "Kayak, dalış gibi aktiviteler standart poliçe dışında kalabilir. Planlıyorsanız önceden öğrenin.",
    },
    {
      title: "Poliçe tarihleri",
      body: "Başlangıç ve bitiş tarihlerinin yolculuğunuzu tam kapsadığından ve vizeye uygun olduğundan emin olun.",
    },
  ],
  tipsAside: {
    title: "Poliçenizi birlikte inceleyelim",
    body: "Gideceğiniz ülkeyi ve planınızı Sofya'ya anlatın, hangi teminatların işinize yarayacağını sade bir dille açıklasın.",
    question: "Yurt dışı seyahatim için hangi seyahat sigortası teminatları gerekir?",
  },

  claimTitle: "Yurt dışında sağlık sorunu yaşarsanız ne yapmalısınız?",
  claimSteps: [
    {
      title: "Önce acil yardımı alın",
      body: "Acil bir durumda öncelikle bulunduğunuz ülkenin acil numarasını arayın ve gerekli tıbbi müdahaleyi alın.",
    },
    {
      title: "Asistans hattını arayın",
      body: "Poliçenizdeki 7/24 asistans numarasını arayın. Hangi hastaneye gideceğiniz ve ödeme süreci konusunda yönlendirilirsiniz.",
    },
    {
      title: "Belgeleri saklayın",
      body: "Tıbbi raporları, faturaları ve makbuzları eksiksiz saklayın. Hasar dosyası için bunlara ihtiyaç duyulur.",
    },
    {
      title: "Dönüşte başvuru yapın",
      body: "Poliçenizde belirtilen süre içinde belgelerle birlikte sigorta şirketine başvurun, ödeme poliçe şartlarına göre yapılır.",
    },
  ],

  related: { title: "Seyahatinizle ilgili diğer sigortalar", slugs: ["ferdi-kaza", "tamamlayici-saglik", "konut-sigortasi"] },
  faq: [
    {
      q: "Seyahat sigortası ne zaman gerekir?",
      a: "Yurt dışına çıkarken sağlık masraflarına karşı korunmak istediğinizde gerekir. Bazı ülkelerin vize başvurularında da zorunlu olarak istenir. Gideceğiniz ülkenin şartlarını önceden kontrol edin.",
    },
    {
      q: "Schengen vizesi için seyahat sigortası şart mı?",
      a: "Schengen vizesi başvurularında, belirli asgari teminat şartlarını sağlayan bir seyahat sağlık sigortası istenir. Güncel şartları konsolosluk ya da vize merkezi sitesinden teyit edin.",
    },
    {
      q: "Seyahat sigortası neleri karşılar?",
      a: "Pakete göre acil tedavi masrafları, hastane yatışı, tıbbi tahliye, bagaj kaybı, seyahat iptali, kişisel kaza ve sorumluluk gibi teminatlar yer alır.",
    },
    {
      q: "Seyahat sigortası fiyatını ne belirler?",
      a: "Gidilecek ülke, seyahat süresi, yolcunun yaşı, seçilen teminat limiti ve ek teminatlar fiyatı etkiler.",
    },
    {
      q: "Önceden var olan hastalıklar kapsanır mı?",
      a: "Çoğu poliçede seyahat öncesinde var olan hastalıklar kapsam dışıdır. Bu konuda şirketin şartlarını poliçeden kontrol edin.",
    },
    {
      q: "Seyahat sigortasını yolculuktan kısa süre önce alabilir miyim?",
      a: "Genellikle yolculuktan kısa süre önce de alınabilir. Poliçenin başlangıç tarihinin seyahatinizin başlangıcından önce olduğundan emin olun.",
    },
    {
      q: "Sağlık sorunu yaşarsam ne yapmalıyım?",
      a: "Önce acil yardımı alın, ardından poliçenizdeki 7/24 asistans hattını arayın. Tüm belgeleri saklayıp dönüşte şirkete başvurun.",
    },
    {
      q: "Teklif almak için hangi bilgiler gerekir?",
      a: "Gideceğiniz ülke, gidiş ve dönüş tarihleri ile yolcu sayısı teklif için yeterlidir. Poliçeyi başlatırken danışmanımız yolcu bilgilerini ayrıca isteyebilir.",
    },
  ],
};
