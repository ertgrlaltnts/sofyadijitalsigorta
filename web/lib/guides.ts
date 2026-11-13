import type { Block } from "./legal";
import type { CoverIcon } from "./product-pages";

/**
 * Practical guides shown under /rehber and in the footer's "Hızlı erişim" column.
 *
 * Rules for this content: no tariff, price, rate or list value is stated here, because those are set by regulators
 * or published by official bodies and change often. The guides explain how things work and point to the official
 * source instead. Wording is general guidance, not advice: have an insurance professional read it before launch.
 */
export interface GuideSection {
  id: string;
  title: string;
  blocks: Block[];
}

export interface Guide {
  slug: string;
  /** Short label for the footer and cards. */
  label: string;
  /** <title> of the page. */
  title: string;
  h1: string;
  description: string;
  intro: string;
  icon: CoverIcon;
  kind: "calculator" | "guide";
  /** One-line teaser for the hub cards. */
  teaser: string;
  sections: GuideSection[];
  /** Product page this guide leads to, with the copy of the call-to-action card. */
  cta: { slug: string; title: string; body: string; button: string };
  /** Official place to look the information up, shown as a button. */
  official?: { label: string; href: string; note: string };
  faq: { q: string; a: string }[];
  /** Other guides worth a link. */
  related: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: "arac-yakit-hesaplama",
    label: "Araç yakıt hesaplama",
    title: "Araç Yakıt Hesaplama",
    h1: "Araç yakıt hesaplama",
    description:
      "Yolculuğun yakıt maliyetini, depoyla gidebileceğiniz mesafeyi ve kişi başı payı hesaplayın. Litre fiyatını ve tüketiminizi siz girersiniz.",
    intro:
      "Gideceğiniz mesafe için ne kadar yakıt harcayacağınızı ve bunun maliyetini saniyeler içinde hesaplayın. Güncel litre fiyatını siz girersiniz, böylece sonuç her zaman günceldir.",
    icon: "water",
    kind: "calculator",
    teaser: "Yolculuğun yakıt maliyetini ve depoyla menzilinizi hesaplayın.",
    sections: [
      {
        id: "tuketim",
        title: "Ortalama yakıt tüketiminizi nasıl bulursunuz?",
        blocks: [
          {
            kind: "p",
            text: "Aracın kataloğundaki değer çoğu zaman gerçek kullanımdan düşüktür. Kendi tüketiminizi bulmak için en güvenilir yol depo doldurma yöntemidir:",
          },
          {
            kind: "ul",
            items: [
              "Deposunu tamamen doldurun ve kilometre sayacını not edin ya da sıfırlayın.",
              "Her zamanki gibi kullanın. Depo yarıya indiğinde ya da birkaç yüz kilometre sonra tekrar tamamen doldurun.",
              "Eklenen litreyi, aradaki kilometreye bölüp 100 ile çarpın. Örneğin 500 km'de 35 litre eklediyseniz tüketiminiz 100 km'de 7 litredir.",
            ],
          },
        ],
      },
      {
        id: "maliyet",
        title: "Yakıt maliyetini ne etkiler?",
        blocks: [
          {
            kind: "ul",
            items: [
              "Hız ve sürüş tarzı: ani hızlanma ve yüksek hız tüketimi belirgin biçimde artırır.",
              "Yol ve trafik: şehir içi dur-kalk trafik, açık yola göre daha fazla yakıt harcatır.",
              "Yük ve lastik basıncı: fazla yük ve düşük lastik basıncı tüketimi yükseltir.",
              "Klima ve hava şartları: klima kullanımı ve soğuk havada motorun ısınması tüketimi artırabilir.",
              "Aracın bakımı: düzenli bakım, motorun verimli çalışmasına yardımcı olur.",
            ],
          },
          {
            kind: "p",
            text: "Hesap makinesi sonucu, girdiğiniz tüketim ve fiyatla orantılı bir tahmindir. Gerçek tüketim yol ve sürüş koşullarına göre değişir.",
          },
        ],
      },
      {
        id: "sigorta",
        title: "Yolculuktan önce sigortanız tamam mı?",
        blocks: [
          {
            kind: "p",
            text: "Uzun bir yola çıkmadan önce zorunlu trafik sigortanızın geçerli olduğunu kontrol edin. Aracınızı kendi hasarlarına karşı da korumak istiyorsanız kasko, ek yol yardımı ve çekici hizmetleri sunan paketleri değerlendirebilirsiniz.",
          },
        ],
      },
    ],
    cta: {
      slug: "kasko",
      title: "Yola çıkmadan aracınızı güvenceye alın",
      body: "Kasko ile kaza, hırsızlık ve doğal afet gibi durumlara karşı aracınızı koruyun, paketinize yol yardımı ekleyin.",
      button: "Kasko teklifi al",
    },
    faq: [
      {
        q: "Hesaplama sonucu ne kadar doğru?",
        a: "Sonuç, sizin girdiğiniz tüketim ve litre fiyatına dayanan bir tahmindir. Gerçek tüketim yol, hız, yük ve hava şartlarına göre değişebilir.",
      },
      {
        q: "Litre fiyatını neden kendim giriyorum?",
        a: "Akaryakıt fiyatları sık değiştiği için güncel olmayan bir fiyatı sabit göstermek yanıltıcı olurdu. Pompadaki güncel fiyatı girmeniz sonucu doğru tutar.",
      },
      {
        q: "Gidiş-dönüş seçeneği ne yapar?",
        a: "Girdiğiniz mesafeyi iki katına çıkarır. Böylece tek yön mesafesini yazıp dönüşü de hesaba katabilirsiniz.",
      },
      {
        q: "Elektrikli ve hibrit araçlar için kullanabilir miyim?",
        a: "Bu araç yakıtlı (benzin, dizel, LPG) araçlar için litre üzerinden hesap yapar. Elektrikli araçlar için kWh tüketimi ve şarj ücreti farklıdır.",
      },
    ],
    related: ["kasko-deger-listesi", "zorunlu-trafik-sigortasi-fiyatlari"],
  },

  {
    slug: "kasko-deger-listesi",
    label: "Kasko değer listesi",
    title: "Kasko Değer Listesi Nedir?",
    h1: "Kasko değer listesi",
    description:
      "Kasko değer listesi nedir, aracınızın sigorta bedeli nasıl belirlenir, değerini nereden öğrenirsiniz? Kasko poliçesinde bedelin neden önemli olduğunu öğrenin.",
    intro:
      "Kasko poliçenizdeki sigorta bedeli, hasar durumunda alabileceğiniz tutarı doğrudan belirler. Bu bedelin dayandığı kasko değer listesini ve nasıl yorumlayacağınızı anlatıyoruz.",
    icon: "coin",
    kind: "guide",
    teaser: "Aracınızın kasko bedeli nasıl belirlenir, neden önemlidir?",
    sections: [
      {
        id: "nedir",
        title: "Kasko değer listesi nedir?",
        blocks: [
          {
            kind: "p",
            text: "Kasko değer listesi, araçların marka, model, model yılı ve donanımına göre kasko sigortasında esas alınan değerini gösteren, sektörde kullanılan referans listedir. Sigorta şirketleri poliçedeki sigorta bedelini belirlerken bu tür listelerden yararlanır. Liste periyodik olarak güncellenir.",
          },
          {
            kind: "p",
            text: "Listedeki değer, aracın ikinci el piyasadaki satış fiyatıyla birebir aynı olmayabilir. Piyasa fiyatı kilometre, bakım durumu, renk ve bölgeye göre değişirken liste standart bir değer sunar.",
          },
        ],
      },
      {
        id: "neden-onemli",
        title: "Sigorta bedeli neden önemli?",
        blocks: [
          {
            kind: "ul",
            items: [
              "Hasar ödemesi, poliçedeki sigorta bedeliyle sınırlıdır. Pert olan bir araçta ödenecek üst tutar bu bedeldir.",
              "Bedel aracın değerinden düşük belirlenirse hasarda eksik ödeme riski doğar.",
              "Bedel gereğinden yüksek belirlenirse gereksiz yere daha fazla prim ödersiniz.",
              "Prim, doğrudan sigorta bedeliyle ilişkilidir. Aynı araç için teklifleri karşılaştırırken bedelin aynı olduğundan emin olun.",
            ],
          },
        ],
      },
      {
        id: "ogrenme",
        title: "Aracınızın değerini nasıl öğrenirsiniz?",
        blocks: [
          {
            kind: "ul",
            items: [
              "Resmi liste: Sigorta Bilgi ve Gözetim Merkezi (SBM) güncel kasko değer listesini yayımlar. Marka, model ve yıla göre aracınızı bulabilirsiniz.",
              "Teklif alırken: Kasko teklifinde, şirketin aracınız için esas aldığı sigorta bedeli görünür. Bu değeri listeyle karşılaştırın.",
              "Sofya ve danışmanlarımız: Aracınızın bilgilerini yazın, poliçede hangi bedelin makul olduğunu birlikte değerlendirelim.",
            ],
          },
        ],
      },
      {
        id: "dikkat",
        title: "Bedel belirlenirken dikkat edilecekler",
        blocks: [
          {
            kind: "ul",
            items: [
              "Aracın donanım paketini ve model yılını doğru girin. Yanlış model, yanlış bedel demektir.",
              "Sonradan eklenen aksesuarlar (özel jant, ses sistemi gibi) için ayrıca teminat gerekebilir.",
              "Poliçe süresince araç değeri değişir. Yenileme sırasında bedelin güncel değere uygun olduğunu kontrol edin.",
              "Bazı poliçelerde \"anlaşmalı değer\" uygulanır; bu durumda bedel hasarda sabit kalır. Poliçenizde hangisinin geçerli olduğunu sorun.",
            ],
          },
        ],
      },
    ],
    cta: {
      slug: "kasko",
      title: "Aracınıza uygun kasko bedelini birlikte belirleyelim",
      body: "Marka, model ve yıl bilgilerinizi paylaşın, teklifi ve sigorta bedelini sade bir dille netleştirelim.",
      button: "Kasko teklifi al",
    },
    official: {
      label: "SBM resmi sitesi",
      href: "https://www.sbm.org.tr",
      note: "Güncel kasko değer listesine Sigorta Bilgi ve Gözetim Merkezi'nin sitesinden ulaşabilirsiniz.",
    },
    faq: [
      {
        q: "Kasko değeri ile araç piyasa değeri aynı mıdır?",
        a: "Hayır, her zaman aynı olmaz. Kasko değeri standart bir referanstır. Piyasa değeri ise kilometre, bakım durumu ve bölgeye göre değişir.",
      },
      {
        q: "Kasko bedelini kendim seçebilir miyim?",
        a: "Genellikle şirketin esas aldığı değer çerçevesinde belirlenir. Bedelin sizin aracınıza uygun olup olmadığını teklif aşamasında kontrol etmeniz önemlidir.",
      },
      {
        q: "Sigorta bedeli düşük olursa ne olur?",
        a: "Hasar ya da pert durumunda alabileceğiniz tutar poliçe bedeliyle sınırlıdır. Bedel gerçek değerin altındaysa eksik ödeme yaşayabilirsiniz.",
      },
      {
        q: "Liste ne sıklıkla güncellenir?",
        a: "Liste düzenli olarak güncellenir. Güncel sürüm için resmi kaynağa bakmalısınız.",
      },
    ],
    related: ["tramer-kaydi-sorgulama", "trafik-sigortasi-basamaklari"],
  },

  {
    slug: "trafik-sigortasi-basamaklari",
    label: "Trafik sigortası basamakları",
    title: "Trafik Sigortası Basamakları Nasıl Çalışır?",
    h1: "Trafik sigortası basamakları",
    description:
      "Trafik sigortasında hasarsızlık basamağı nedir, hasarlı ve hasarsız yıllar primi nasıl etkiler? Basamağınızı nasıl öğrenirsiniz, şirket değişince ne olur?",
    intro:
      "Zorunlu trafik sigortasında primin bir bölümü sürücünün hasar geçmişine göre belirlenir. Bu sisteme basamak (kademe) sistemi denir. Nasıl çalıştığını ve primi nasıl etkilediğini anlatıyoruz.",
    icon: "shieldCheck",
    kind: "guide",
    teaser: "Hasarsızlık basamağınız primi nasıl etkiler, nasıl öğrenirsiniz?",
    sections: [
      {
        id: "nedir",
        title: "Basamak sistemi nedir?",
        blocks: [
          {
            kind: "p",
            text: "Basamak sistemi, zorunlu trafik sigortasında sürücünün hasar geçmişini prime yansıtan bir uygulamadır. Her poliçe döneminin sonunda aracınızın basamağı, o dönemde kusurlu bir hasar olup olmamasına göre güncellenir.",
          },
          {
            kind: "ul",
            items: [
              "Hasarsız geçirdiğiniz dönemlerde basamağınız yükselir ve prim indirimi kazanırsınız.",
              "Kusurlu olduğunuz bir hasar olduğunda basamağınız düşer ve prime ek yük gelebilir.",
              "Basamak sayısı, her basamağa karşılık gelen indirim ve ek prim oranları tarifede belirlenir ve zaman içinde güncellenebilir.",
            ],
          },
        ],
      },
      {
        id: "etki",
        title: "Basamak primi nasıl etkiler?",
        blocks: [
          {
            kind: "p",
            text: "Yüksek basamak, aynı araç için daha düşük prim anlamına gelir. Düşük basamak ise tarifenin izin verdiği ölçüde daha yüksek prim getirir. Basamak, fiyatı etkileyen unsurlardan yalnızca biridir. Araç türü, kullanım şekli ve model yılı da primi değiştirir.",
          },
        ],
      },
      {
        id: "ogrenme",
        title: "Basamağınızı nasıl öğrenirsiniz?",
        blocks: [
          {
            kind: "ul",
            items: [
              "Mevcut poliçenizin üzerinde hasarsızlık ya da basamak bilgisi yer alır.",
              "Sigorta şirketinizden veya acentenizden aracınızın güncel basamağını sorabilirsiniz.",
              "Teklif alırken plaka bilgisiyle sizin için doğru basamak otomatik olarak çekilir. Bilgilerin doğru yansıdığını teklifte kontrol edin.",
            ],
          },
        ],
      },
      {
        id: "sirket-degisikligi",
        title: "Şirket değiştirirseniz ne olur?",
        blocks: [
          {
            kind: "p",
            text: "Basamak bilgisi araçla ilişkilidir ve sektörün ortak sisteminde tutulur. Yani poliçenizi başka bir şirkete geçirdiğinizde hasarsızlık avantajınızın korunması beklenir. Yine de yeni poliçede basamağınızın doğru yansıdığını kontrol etmeniz iyi olur.",
          },
        ],
      },
      {
        id: "ipuclari",
        title: "Basamağınızı korumak için",
        blocks: [
          {
            kind: "ul",
            items: [
              "Poliçenizi bitiş tarihinden önce, boşluk bırakmadan yenileyin.",
              "Kazalarda kusur oranının doğru tespit edilmesi için tutanak ve fotoğrafları eksiksiz tutun.",
              "Kusurlu olmadığınız kazalarda basamağınızın genellikle etkilenmediğini, ancak uygulamanın tarifeye göre değişebileceğini unutmayın. Emin olmadığınız durumları şirketinize ya da danışmanımıza sorun.",
            ],
          },
        ],
      },
    ],
    cta: {
      slug: "trafik-sigortasi",
      title: "Trafik sigortası teklifinizi alın",
      body: "Araç bilgilerinizi paylaşın, basamağınıza göre teklifi birlikte netleştirelim.",
      button: "Trafik sigortası teklifi al",
    },
    faq: [
      {
        q: "Basamak ile hasarsızlık indirimi aynı şey mi?",
        a: "Birbiriyle ilişkilidir. Hasarsızlık indirimi, basamağınıza bağlı olarak primde uygulanan avantajdır. Basamak ise bu avantajın derecesini belirleyen kademedir.",
      },
      {
        q: "Hasar yaparsam basamağım düşer mi?",
        a: "Kusurlu olduğunuz bir hasar durumunda basamağınızın düşmesi beklenir. Kusurlu olmadığınız durumlarda uygulama tarifeye göre değişir.",
      },
      {
        q: "Basamağım yükseldikçe prim ne kadar düşer?",
        a: "Oranlar tarifede belirlenir ve değişebilir. Güncel indirim oranı için teklifinize ya da şirketinize bakın.",
      },
      {
        q: "Aracı satarsam basamak ne olur?",
        a: "Basamak araçla ilişkilidir. Satış sonrası yeni sahibin poliçesinde nasıl uygulanacağı için şirketten bilgi alın.",
      },
    ],
    related: ["zorunlu-trafik-sigortasi-fiyatlari", "tramer-kaydi-sorgulama"],
  },

  {
    slug: "tramer-kaydi-sorgulama",
    label: "Tramer kaydı sorgulama",
    title: "Tramer Kaydı Nedir, Nasıl Sorgulanır?",
    h1: "Tramer kaydı sorgulama",
    description:
      "Tramer kaydı nedir, ikinci el araç alırken neden önemlidir, nasıl sorgulanır? Aracın hasar geçmişini kontrol ederken dikkat edilecekleri öğrenin.",
    intro:
      "İkinci el araç alırken en çok merak edilen sorulardan biri aracın hasar geçmişidir. Tramer kaydının ne gösterdiğini, ne göstermediğini ve nasıl sorgulanacağını anlatıyoruz.",
    icon: "document",
    kind: "guide",
    teaser: "Aracın hasar geçmişini nasıl öğrenirsiniz?",
    sections: [
      {
        id: "nedir",
        title: "Tramer kaydı nedir?",
        blocks: [
          {
            kind: "p",
            text: "Tramer kaydı, bir araç için sigorta şirketlerine bildirilmiş hasarların tutulduğu kayıttır. Kayıtlar, sigorta sektörünün ortak veri merkezi Sigorta Bilgi ve Gözetim Merkezi (SBM) üzerinde tutulur. Kısaca, aracın sigortalı hasar geçmişini gösterir.",
          },
        ],
      },
      {
        id: "neden-onemli",
        title: "Neden önemlidir?",
        blocks: [
          {
            kind: "ul",
            items: [
              "İkinci el araç alırken aracın geçmişte ağır bir hasar görüp görmediğini anlamanıza yardım eder.",
              "Satıcının beyanıyla kayıtlı hasarları karşılaştırarak pazarlık gücünüzü artırır.",
              "Kasko ve trafik sigortası teklifi alırken şirketlerin değerlendirdiği geçmiş bilgilerden biridir.",
            ],
          },
        ],
      },
      {
        id: "sorgulama",
        title: "Nasıl sorgulanır?",
        blocks: [
          {
            kind: "p",
            text: "Sorgulama, SBM'nin resmi hizmeti üzerinden yapılır. Sorgu için genellikle aracın plakası ve ruhsat bilgileri istenir. Hizmetin güncel şartları ve ücretsiz olup olmadığı SBM sayfasında yer alır; en doğru bilgi için resmi sayfayı kontrol edin.",
          },
        ],
      },
      {
        id: "dikkat",
        title: "Kaydı yorumlarken dikkat edin",
        blocks: [
          {
            kind: "ul",
            items: [
              "Kayıt yalnızca sigorta şirketine bildirilmiş hasarları gösterir. Sigortaya bildirilmeden onarılan hasarlar kayıtta görünmez.",
              "Kayıt olmaması, aracın hiç hasar görmediği anlamına gelmez. Ekspertiz raporu ile birlikte değerlendirin.",
              "Kayıttaki tutar ve parça bilgilerini aracı alırken ekspertiz yapan kişiyle birlikte yorumlayın.",
              "Hasarlı bir geçmiş, aracın kasko değerini ve bazı şirketlerin teklif şartlarını etkileyebilir.",
            ],
          },
        ],
      },
    ],
    cta: {
      slug: "kasko",
      title: "Aldığınız aracı güvenceye alın",
      body: "Yeni aldığınız araç için kasko teklifini birlikte netleştirelim, geçmiş bilgisi de teklifte dikkate alınsın.",
      button: "Kasko teklifi al",
    },
    official: {
      label: "SBM resmi sitesi",
      href: "https://www.sbm.org.tr",
      note: "Tramer kaydı sorgulaması için Sigorta Bilgi ve Gözetim Merkezi'nin resmi hizmetini kullanın.",
    },
    faq: [
      {
        q: "Tramer kaydı ne zaman oluşur?",
        a: "Araç bir kazaya karıştığında ve hasar sigorta şirketine bildirildiğinde, hasar kaydı sistemde tutulur.",
      },
      {
        q: "Tramer kaydı olan araç alınmaz mı?",
        a: "Her kayıt aynı anlama gelmez. Küçük bir hasar ile ağır bir hasar farklıdır. Kaydın tutarını ve parça bilgisini ekspertiz ile birlikte değerlendirmeniz gerekir.",
      },
      {
        q: "Kaydı olmayan araç hiç hasar görmemiş midir?",
        a: "Kesin olarak söylenemez. Sigortaya bildirilmeden onarılan hasarlar kayıtta görünmez. Bu yüzden ekspertiz de yaptırmanız önerilir.",
      },
      {
        q: "Sorgu için hangi bilgiler gerekir?",
        a: "Genellikle plaka ve ruhsat bilgileri istenir. Güncel gereklilikler için resmi sorgu sayfasına bakın.",
      },
    ],
    related: ["kasko-deger-listesi", "trafik-sigortasi-basamaklari"],
  },

  {
    slug: "zorunlu-trafik-sigortasi-fiyatlari",
    label: "Zorunlu trafik sigortası fiyatları",
    title: "Zorunlu Trafik Sigortası Fiyatları Nasıl Belirlenir?",
    h1: "Zorunlu trafik sigortası fiyatları",
    description:
      "Zorunlu trafik sigortası fiyatları nasıl belirlenir, şirketler arasında neden fark çıkar, en uygun teklif nasıl alınır? Güncel fiyat için teklif isteyin.",
    intro:
      "Trafik sigortası fiyatı, aracınıza ve hasar geçmişinize göre değişir. Fiyatın nasıl oluştuğunu ve doğru karşılaştırmayı nasıl yapacağınızı anlatıyoruz. Kişiye özel güncel fiyat için teklif almanız gerekir.",
    icon: "scale",
    kind: "guide",
    teaser: "Fiyat nasıl oluşur, neden şirketten şirkete farklı çıkar?",
    sections: [
      {
        id: "tarife",
        title: "Fiyatlar nasıl belirlenir?",
        blocks: [
          {
            kind: "p",
            text: "Zorunlu trafik sigortası, düzenleyici kurumun belirlediği tarife çerçevesinde fiyatlandırılır. Tarifede şirketlerin uygulayabileceği prim sınırları yer alır ve bu sınırlar zaman içinde güncellenir. Bu sayfada belirli bir tutar yazmıyoruz, çünkü rakamlar sık değişir. Güncel ve size özel fiyatı teklifte görürsünüz.",
          },
        ],
      },
      {
        id: "etkenler",
        title: "Fiyatı etkileyen unsurlar",
        blocks: [
          {
            kind: "ul",
            items: [
              "Araç türü ve kullanım şekli: otomobil, ticari araç ya da motosiklet farklı tarifelere tabidir.",
              "Hasarsızlık basamağınız: hasarsız geçirdiğiniz yıllar prime avantaj olarak yansır.",
              "Aracın model yılı ve özellikleri.",
              "Aracın kayıtlı olduğu il.",
              "Ödeme şekli: peşin ya da taksitli ödeme toplam maliyeti değiştirebilir.",
            ],
          },
        ],
      },
      {
        id: "fark",
        title: "Şirketler arasında neden fark çıkar?",
        blocks: [
          {
            kind: "p",
            text: "Tarife sınırları ortak olsa da şirketler sınırın altında farklı fiyatlar, kampanyalar ve ödeme koşulları sunabilir. Ek hizmetler, hasar süreçlerinin hızı ve müşteri hizmetleri de fiyatın yanında değerlendirilmelidir.",
          },
        ],
      },
      {
        id: "karsilastirma",
        title: "Teklifleri nasıl karşılaştırırsınız?",
        blocks: [
          {
            kind: "ul",
            items: [
              "Aynı araç bilgileri ve aynı basamakla teklif alındığından emin olun.",
              "Yalnızca fiyata değil, hasar süreci ve şirketin hizmet kalitesine de bakın.",
              "Taksit ve peşin fiyatı ayrı ayrı sorun.",
              "Poliçenin başlangıç tarihinin mevcut poliçenizin bitişiyle çakıştığını kontrol edin.",
            ],
          },
        ],
      },
    ],
    cta: {
      slug: "trafik-sigortasi",
      title: "Size özel trafik sigortası fiyatını öğrenin",
      body: "Araç bilgilerinizi paylaşın, anlaşmalı şirketlerden gelen teklifleri birlikte değerlendirelim.",
      button: "Trafik sigortası teklifi al",
    },
    faq: [
      {
        q: "Trafik sigortası fiyatı neden herkes için farklı?",
        a: "Fiyat; araç türü, kullanım şekli, hasarsızlık basamağı, model yılı ve il gibi unsurlara göre kişiye özel hesaplanır.",
      },
      {
        q: "Şirketler arasında fiyat farkı olur mu?",
        a: "Evet. Tarife sınırları ortak olsa da şirketler bu sınırın altında farklı fiyat ve kampanya uygulayabilir.",
      },
      {
        q: "Taksitle ödeme daha mı pahalı?",
        a: "Ödeme koşullarına göre değişebilir. Teklifte peşin ve taksitli tutarları ayrı ayrı sormanızı öneririz.",
      },
      {
        q: "Bu sayfada neden fiyat yazmıyor?",
        a: "Fiyatlar sık güncellendiği ve kişiye göre değiştiği için güncel olmayan bir tutar yazmak yanıltıcı olur. Güncel fiyatı teklif sırasında öğrenebilirsiniz.",
      },
    ],
    related: ["trafik-sigortasi-basamaklari", "tramer-kaydi-sorgulama"],
  },
];

export const getGuide = (slug: string) => GUIDES.find((guide) => guide.slug === slug);
