import { CONTACT } from "./content";

/**
 * Legal pages: KVKK notice, privacy and cookie policies, pre-contract information and the cancellation / refund terms.
 *
 * DRAFTS written from how this site really handles data and payments (quote forms sent to the quote API, card payment
 * through the insurer's gateway, the Sofya chat with masking of sensitive numbers, hashed IP, browser storage). They are
 * NOT legal advice: have a lawyer review them, and fill in the company details below before launch. Empty fields are
 * left out of the pages and the footer, so nothing is shown that is not filled in.
 */
export const LEGAL_ENTITY = {
  /** Registered company name (ticaret unvanı). Replace with the exact legal name. */
  name: "Sofya Dijital Sigorta",
  address: "",
  mersis: "",
  verbis: "",
  /** Tax office and number (vergi dairesi / vergi no). */
  taxOffice: "",
  taxNo: "",
  /** Trade registry number (ticaret sicil no). */
  tradeRegistry: "",
  /** Registered e-mail address (KEP). */
  kep: "",
  /** Insurance agency licence / register number (acente ruhsat ve sicil bilgisi). */
  agencyLicense: "",
};

export const LEGAL_UPDATED = "13 Kasım 2026";

export type Block =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "contact" };

export interface LegalSection {
  id: string;
  title: string;
  blocks: Block[];
}

export interface LegalDoc {
  slug: string;
  title: string;
  heroTitle: string;
  description: string;
  intro: string;
  sections: LegalSection[];
}

const contactLines = [
  LEGAL_ENTITY.name,
  LEGAL_ENTITY.address,
  LEGAL_ENTITY.agencyLicense && `Sigorta acentesi: ${LEGAL_ENTITY.agencyLicense}`,
  LEGAL_ENTITY.mersis && `MERSİS: ${LEGAL_ENTITY.mersis}`,
  LEGAL_ENTITY.taxNo && `Vergi dairesi / no: ${[LEGAL_ENTITY.taxOffice, LEGAL_ENTITY.taxNo].filter(Boolean).join(" / ")}`,
  LEGAL_ENTITY.tradeRegistry && `Ticaret sicil no: ${LEGAL_ENTITY.tradeRegistry}`,
  LEGAL_ENTITY.verbis && `VERBİS: ${LEGAL_ENTITY.verbis}`,
  LEGAL_ENTITY.kep && `KEP: ${LEGAL_ENTITY.kep}`,
  `E-posta: ${CONTACT.email}`,
  `Telefon: ${CONTACT.phone}`,
].filter((line): line is string => !!line);

export const KVKK_DOC: LegalDoc = {
  slug: "kvkk",
  title: "KVKK Aydınlatma Metni",
  heroTitle: "KVKK Aydınlatma Metni",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, Sofya Dijital Sigorta'nın hangi kişisel verileri hangi amaçla işlediğini ve haklarınızı öğrenin.",
  intro:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu'nun (KVKK) 10. maddesi uyarınca, kişisel verilerinizin nasıl işlendiği hakkında sizi bilgilendiriyoruz.",
  sections: [
    {
      id: "veri-sorumlusu",
      title: "1. Veri sorumlusu",
      blocks: [
        { kind: "p", text: "Kişisel verileriniz, veri sorumlusu sıfatıyla aşağıdaki kuruluş tarafından işlenmektedir:" },
        { kind: "ul", items: contactLines },
      ],
    },
    {
      id: "islenen-veriler",
      title: "2. İşlenen kişisel veriler",
      blocks: [
        { kind: "p", text: "Sitemizi kullanırken ve hizmetlerimizden yararlanırken aşağıdaki veriler işlenebilir:" },
        {
          kind: "table",
          head: ["Veri kategorisi", "Örnekler", "Ne zaman?"],
          rows: [
            ["Kimlik", "T.C. kimlik numarası, ad, soyad, doğum tarihi", "Hızlı teklif formunu doldurduğunuzda"],
            ["İletişim", "Cep telefonu numarası", "Teklif formunu doldurduğunuzda ya da WhatsApp'tan yazdığınızda"],
            [
              "Teklif için beyan ettiğiniz bilgiler",
              "Araç plakası, ruhsat ve model bilgileri; konutun adresi, metrekaresi ve yapı bilgileri; seyahat ülkesi ve tarihleri; boy, kilo ve sağlık beyanı (sağlık sigortası tekliflerinde); meslek, sosyal güvence durumu",
              "Seçtiğiniz sigorta için formu doldurduğunuzda",
            ],
            [
              "Ödeme",
              "Kart sahibi adı, kart numarası, son kullanma tarihi ve güvenlik kodu; ödeme sonucu, poliçe numarası ve tutar",
              "Teklifi satın aldığınızda",
            ],
            [
              "Sohbet içeriği",
              "Sofya'ya yazdığınız mesajlar ve yanıtlara verdiğiniz geri bildirim (beğen / beğenme)",
              "Sofya ile sohbet ettiğinizde",
            ],
            [
              "İşlem güvenliği",
              "IP adresinizin geri döndürülemeyen özeti (hash), sohbet oturumu kimliği, tarayıcı bilgisi",
              "Siteyi ve Sofya'yı kullandığınızda",
            ],
          ],
        },
        {
          kind: "p",
          text: "Sofya'ya yazdığınız mesajlarda TC kimlik numarası, kart numarası, IBAN ve telefon numarası gibi bilgiler tespit edilirse bu bilgiler kaydedilmeden ve yapay zeka hizmetine gönderilmeden önce maskelenir. Sofya'ya bu tür bilgileri yazmanız gerekmez: kimlik ve diğer teklif bilgilerinizi yalnızca sohbetin içinde açılan teklif formuna yazarsınız. Bu form, bilgilerinizi sohbete ya da yapay zeka hizmetine göndermez; doğrudan teklif sistemine iletir.",
        },
        {
          kind: "p",
          text: "Kart bilgileriniz yalnızca ödemenin yapılması için ilgili sigorta şirketinin ödeme altyapısına iletilir. Sunucularımızda saklanmaz ve kayıt dosyalarına yazılmaz. Sunucularımızda yalnızca ödemenin sonucu (başarılı, reddedildi vb.), poliçe numarası, tutar ve T.C. kimlik numaranızın maskelenmiş hali tutulur.",
        },
      ],
    },
    {
      id: "amaclar",
      title: "3. İşleme amaçları",
      blocks: [
        { kind: "p", text: "Kişisel verileriniz aşağıdaki amaçlarla işlenir:" },
        {
          kind: "ul",
          items: [
            "Talep ettiğiniz sigorta için sigorta şirketlerinden teklif alınması ve size iletilmesi,",
            "Seçtiğiniz teklifin satın alınması, ödemenin alınması ve poliçenin düzenlenmesi,",
            "Danışmanlarımızın sizinle iletişime geçmesi ve poliçe sürecinin yürütülmesi,",
            "Sofya aracılığıyla sorularınızın yanıtlanması ve sizi doğru yönlendirmesi,",
            "Hizmet kalitesinin ve Sofya'nın bilgi tabanının geliştirilmesi (yanıtlanamayan soruların tespiti dahil),",
            "Bilgi güvenliğinin sağlanması, kötüye kullanımın ve hatalı kullanımın önlenmesi,",
            "Hukuki yükümlülüklerin yerine getirilmesi ve olası uyuşmazlıklarda hakların korunması.",
          ],
        },
      ],
    },
    {
      id: "hukuki-sebep",
      title: "4. Toplama yöntemi ve hukuki sebep",
      blocks: [
        {
          kind: "p",
          text: "Verileriniz, web sitemizdeki teklif formları, WhatsApp üzerinden gönderdiğiniz mesajlar ve Sofya sohbeti aracılığıyla otomatik veya kısmen otomatik yollarla elde edilir.",
        },
        { kind: "p", text: "İşleme faaliyetleri KVKK'nın 5. maddesindeki şu hukuki sebeplere dayanır:" },
        {
          kind: "ul",
          items: [
            "Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (teklif ve poliçe sürecinin yürütülmesi),",
            "Hukuki yükümlülüğümüzün yerine getirilmesi,",
            "Bir hakkın tesisi, kullanılması veya korunması,",
            "Temel hak ve özgürlüklerinize zarar vermemek kaydıyla meşru menfaatlerimiz (bilgi güvenliği, hizmet kalitesi),",
            "Gerekli olan hallerde açık rızanız (teklif formundaki onay kutusu).",
          ],
        },
        {
          kind: "p",
          text: "Sağlık sigortası tekliflerinde beyan ettiğiniz boy, kilo ve sağlık bilgileri KVKK'nın 6. maddesi kapsamında özel nitelikli kişisel veridir. Bu veriler yalnızca açık rızanızla, teklif hazırlanması amacıyla ve sigorta şirketlerine iletilmek üzere işlenir. Açık rızanızı vermek zorunda değilsiniz; ancak bu durumda ilgili teklif hazırlanamaz.",
        },
      ],
    },
    {
      id: "aktarim",
      title: "5. Verilerin aktarılması",
      blocks: [
        { kind: "p", text: "Kişisel verileriniz, yukarıdaki amaçlarla sınırlı olmak üzere ve KVKK'nın 8. ve 9. maddelerine uygun şekilde şu taraflara aktarılabilir:" },
        {
          kind: "ul",
          items: [
            "Teklif ve poliçe sürecinde yer alan anlaşmalı sigorta şirketleri ve ödeme hizmeti sunan kuruluşlar,",
            "Tekliflerin alınması ve poliçenin düzenlenmesi için kullandığımız teklif sistemi sağlayıcısı,",
            "Danışmanlarımız ve hizmet aldığımız iş ortakları (barındırma, altyapı ve iletişim hizmeti sağlayıcıları),",
            "Teklif formunuzu ilettiğiniz WhatsApp hizmetinin sağlayıcısı,",
            "Sofya'nın çalışması için kullanılan, yurt dışında yerleşik olabilen yapay zeka hizmeti sağlayıcısı,",
            "Mevzuatın izin verdiği ölçüde yetkili kamu kurum ve kuruluşları.",
          ],
        },
        {
          kind: "p",
          text: "WhatsApp ve yapay zeka hizmeti nedeniyle verileriniz yurt dışına aktarılabilir. Bu aktarım, KVKK'nın 9. maddesinde öngörülen şartlara uygun olarak yapılır. Sofya'ya gönderilen mesajlardaki hassas numaralar, hizmet sağlayıcıya iletilmeden önce maskelenir.",
        },
      ],
    },
    {
      id: "saklama",
      title: "6. Saklama süresi",
      blocks: [
        {
          kind: "p",
          text: "Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen saklama sürelerine uygun olarak saklanır. Sunucularımızda tuttuğumuz teklif kayıtları (maskelenmiş kimlik numarası, ürün, ödeme sonucu ve poliçe numarası) oluşturulmalarından itibaren 90 gün sonra otomatik olarak silinir. Poliçe ve ödeme kayıtlarının sigorta şirketi ve yasal yükümlülükler kapsamındaki saklama süreleri, ilgili kuruluşların kendi politikalarına ve mevzuata tabidir. Süre sonunda verileriniz silinir, yok edilir veya anonim hale getirilir.",
        },
      ],
    },
    {
      id: "haklariniz",
      title: "7. Haklarınız",
      blocks: [
        { kind: "p", text: "KVKK'nın 11. maddesi uyarınca veri sorumlusuna başvurarak şunları talep edebilirsiniz:" },
        {
          kind: "ul",
          items: [
            "Kişisel verilerinizin işlenip işlenmediğini öğrenme,",
            "İşlenmişse buna ilişkin bilgi talep etme,",
            "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,",
            "Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme,",
            "Eksik veya yanlış işlenmişse düzeltilmesini isteme,",
            "KVKK'nın 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini isteme ve bunun aktarılan üçüncü kişilere bildirilmesini isteme,",
            "İşlenen verilerin münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etme,",
            "Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme.",
          ],
        },
      ],
    },
    {
      id: "basvuru",
      title: "8. Başvuru yöntemi",
      blocks: [
        {
          kind: "p",
          text: "Haklarınıza ilişkin taleplerinizi, kimliğinizi tespit edecek bilgilerle birlikte aşağıdaki iletişim bilgileri üzerinden bize iletebilirsiniz. Başvurunuz, niteliğine göre en kısa sürede ve en geç otuz gün içinde sonuçlandırılır.",
        },
        { kind: "contact" },
        {
          kind: "p",
          text: "Başvurunuzun yanıtından memnun kalmamanız halinde Kişisel Verileri Koruma Kurulu'na şikâyette bulunma hakkınız saklıdır.",
        },
      ],
    },
  ],
};

export const PRIVACY_DOC: LegalDoc = {
  slug: "gizlilik-politikasi",
  title: "Gizlilik Politikası",
  heroTitle: "Gizlilik Politikası",
  description:
    "Sofya Dijital Sigorta web sitesini ve Sofya yapay zeka asistanını kullanırken bilgilerinizin nasıl toplandığını, korunduğunu ve kullanıldığını öğrenin.",
  intro:
    "Gizliliğiniz bizim için önemlidir. Bu politika, sitemizi ve Sofya'yı kullanırken bilgilerinizin nasıl ele alındığını sade bir dille anlatır. Kişisel verilere ilişkin ayrıntılı bilgi için KVKK Aydınlatma Metni'ne bakabilirsiniz.",
  sections: [
    {
      id: "kapsam",
      title: "1. Kapsam",
      blocks: [
        {
          kind: "p",
          text: "Bu politika, Sofya Dijital Sigorta web sitesi ve sitedeki Sofya sohbet asistanı için geçerlidir. Sitemizden bağlantı verilen üçüncü taraf sitelerin (ör. teklif sayfamız ya da WhatsApp) kendi gizlilik politikaları vardır.",
        },
      ],
    },
    {
      id: "toplanan-bilgiler",
      title: "2. Hangi bilgileri topluyoruz?",
      blocks: [
        {
          kind: "ul",
          items: [
            "Hızlı teklif formuna yazdığınız bilgiler: T.C. kimlik numarası, doğum tarihi, cep telefonu ve sigortaya ilişkin beyanlarınız (araç, konut adresi, seyahat, sağlık gibi).",
            "Satın alma sırasında girdiğiniz ödeme kartı bilgileri (yalnızca ödemenin yapılması için).",
            "Sofya'ya yazdığınız mesajlar ve yanıtlara verdiğiniz geri bildirim.",
            "Teknik bilgiler: IP adresinizin geri döndürülemeyen özeti, tarayıcı bilgisi ve sohbet oturumu kimliği.",
          ],
        },
        {
          kind: "p",
          text: "Sofya'ya T.C. kimlik numarası, kart numarası ya da IBAN yazmanız gerekmez. Bu bilgileri yalnızca teklif ve ödeme formlarına girersiniz.",
        },
      ],
    },
    {
      id: "sofya",
      title: "3. Sofya ve sohbetleriniz",
      blocks: [
        {
          kind: "ul",
          items: [
            "Sofya yapay zeka destekli bir asistandır. Genel ve anlaşılır bilgi verir, hata yapabilir. Kesin fiyat, teminat ve poliçe bilgisi için danışmanlarımıza ve poliçe şartlarına başvurmalısınız.",
            "Mesajlarınızda TC kimlik numarası, kart numarası, IBAN ve telefon numarası gibi bilgiler tespit edilirse bunlar kaydedilmeden ve yapay zeka hizmetine gönderilmeden önce maskelenir.",
            "IP adresiniz ham olarak saklanmaz. Kötüye kullanımı önlemek için yalnızca geri döndürülemeyen bir özet tutulur.",
            "Yanıtlayamadığı sorular ekibimize iletilir. Bu sorular, Sofya'nın bilgi tabanını geliştirmek için kullanılır.",
            "Sohbetinizin tarayıcıdaki kopyası oturum depolamasında tutulur; sekmeyi kapattığınızda ya da \"Yeni sohbet\" dediğinizde silinir. Sohbet kayıtları (hassas numaralar maskelenmiş olarak) hizmetin işleyişi ve geliştirilmesi için sunucularımızda saklanır.",
          ],
        },
      ],
    },
    {
      id: "formlar",
      title: "4. Teklif, ödeme ve WhatsApp",
      blocks: [
        {
          kind: "p",
          text: "Hızlı teklif formunu (sitedeki ürün sayfalarında ya da Sofya sohbetinin içinde) doldurduğunuzda bilgileriniz, teklif almak için güvenli bağlantı üzerinden sunucumuza ve oradan sigorta şirketlerinin teklif sistemine iletilir. Sunucumuzda T.C. kimlik numaranız yalnızca maskelenmiş olarak, teklifin ürünü ve sonucuyla birlikte 90 gün süreyle tutulur.",
        },
        {
          kind: "p",
          text: "Teklifi satın alırken girdiğiniz kart bilgileri ödemenin yapılması için sigorta şirketinin ödeme altyapısına iletilir; sunucularımızda saklanmaz ve kayıt dosyalarına yazılmaz. Ödeme sonucunu ve poliçe numaranızı sunucularımızda tutarız.",
        },
        {
          kind: "p",
          text: "WhatsApp üzerinden bize yazmayı seçerseniz gönderdiğiniz mesaj WhatsApp hizmetinin ve danışmanlarımızın kullanımına açılır; WhatsApp'ın kendi gizlilik koşulları geçerlidir.",
        },
      ],
    },
    {
      id: "kullanim",
      title: "5. Bilgilerinizi nasıl kullanıyoruz?",
      blocks: [
        {
          kind: "ul",
          items: [
            "Talep ettiğiniz sigorta için teklif almak, satın almanızı ve ödemeyi gerçekleştirmek, poliçenizi düzenlemek ve sizinle iletişime geçmek,",
            "Sorularınızı yanıtlamak ve hizmetlerimizi geliştirmek,",
            "Siteyi güvende tutmak ve kötüye kullanımı önlemek,",
            "Yasal yükümlülüklerimizi yerine getirmek.",
          ],
        },
        {
          kind: "p",
          text: "Bilgilerinizi bu amaçların dışında kullanmayız.",
        },
      ],
    },
    {
      id: "paylasim",
      title: "6. Bilgilerinizi kimlerle paylaşıyoruz?",
      blocks: [
        {
          kind: "p",
          text: "Bilgileriniz yalnızca hizmeti sunmak için gerekli olduğu ölçüde; teklif ve poliçe sürecindeki anlaşmalı sigorta şirketleri, teklif sistemi sağlayıcımız, danışmanlarımız, altyapı ve yapay zeka hizmeti sağlayıcılarımız ve mevzuatın gerektirdiği kamu kurumlarıyla paylaşılır. Bilgilerinizi satmayız ve reklam amacıyla üçüncü taraflarla paylaşmayız. Ayrıntılar KVKK Aydınlatma Metni'nde yer alır.",
        },
      ],
    },
    {
      id: "cerezler",
      title: "7. Çerezler ve benzeri teknolojiler",
      blocks: [
        {
          kind: "p",
          text: "Sitemiz şu anda reklam, pazarlama ya da kullanıcı takibi amacıyla çerez kullanmamaktadır. Sofya sohbetinin çalışması için tarayıcınızın oturum depolaması (sessionStorage) kullanılır; bu veri yalnızca sizin tarayıcınızda kalır ve oturum bitince silinir. Ayrıntılar için Çerez Politikası'na bakabilirsiniz. İleride analiz veya benzeri araçlar eklenirse bu politika güncellenir ve gerektiğinde onayınız istenir.",
        },
      ],
    },
    {
      id: "guvenlik",
      title: "8. Bilgi güvenliği",
      blocks: [
        {
          kind: "p",
          text: "Bilgilerinizi yetkisiz erişime, kayba ve kötüye kullanıma karşı korumak için makul teknik ve idari tedbirler alıyoruz. Ödeme formu yalnızca şifreli (HTTPS) bağlantıda açılır ve kart bilgileriniz saklanmaz. Yine de internet üzerinden hiçbir iletimin tamamen risksiz olmadığını hatırlatırız.",
        },
      ],
    },
    {
      id: "cocuklar",
      title: "9. Çocukların gizliliği",
      blocks: [
        {
          kind: "p",
          text: "Hizmetlerimiz 18 yaşın altındaki kişilere yönelik değildir. Bir çocuğa ait bilgi tarafımıza iletildiğini fark etmeniz halinde bize ulaşın, gerekli işlemi yapalım.",
        },
      ],
    },
    {
      id: "haklar",
      title: "10. Haklarınız ve bize ulaşın",
      blocks: [
        {
          kind: "p",
          text: "Kişisel verilerinize ilişkin hakları ve başvuru yöntemini KVKK Aydınlatma Metni'nde bulabilirsiniz. Gizlilikle ilgili soru ve talepleriniz için bize aşağıdaki kanallardan ulaşabilirsiniz.",
        },
        { kind: "contact" },
      ],
    },
    {
      id: "degisiklikler",
      title: "11. Değişiklikler",
      blocks: [
        {
          kind: "p",
          text: "Bu politikayı zaman zaman güncelleyebiliriz. Güncel sürüm her zaman bu sayfada yayımlanır; sayfanın başındaki \"son güncelleme\" tarihine bakabilirsiniz.",
        },
      ],
    },
  ],
};

export const LEGAL_CONTACT_LINES = contactLines;

export const COOKIE_DOC: LegalDoc = {
  slug: "cerez-politikasi",
  title: "Çerez Politikası",
  heroTitle: "Çerez Politikası",
  description:
    "Sitemizde hangi çerezlerin ve tarayıcı depolamasının kullanıldığını, ne işe yaradığını ve tercihlerinizi nasıl yöneteceğinizi öğrenin.",
  intro:
    "Bu sayfa, sitemizde çerez ve benzeri teknolojilerin nasıl kullanıldığını anlatır. Siteyi ilk açtığınızda bu politikayı kabul etmenizi isteriz.",
  sections: [
    {
      id: "cerez-nedir",
      title: "1. Çerez nedir?",
      blocks: [
        {
          kind: "p",
          text: "Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin dosyalarıdır. Tarayıcıların oturum depolaması (sessionStorage) ve yerel depolama (localStorage) gibi benzer teknolojileri de aynı amaçlarla kullanılabilir. Bu politikada hepsine kısaca \"çerez ve benzeri teknolojiler\" diyoruz.",
        },
      ],
    },
    {
      id: "kullandiklarimiz",
      title: "2. Sitemizde ne kullanıyoruz?",
      blocks: [
        {
          kind: "p",
          text: "Sitemiz yalnızca çalışması için gerekli olan depolamayı kullanır. Reklam, pazarlama ya da kullanıcı takibi amaçlı çerez kullanmayız.",
        },
        {
          kind: "table",
          head: ["Ad", "Türü", "Ne işe yarar?", "Süre"],
          rows: [
            ["sofya.session", "Oturum depolaması (zorunlu)", "Sofya sohbetini aynı oturumda sürdürmeniz için rastgele bir sohbet kimliği tutar.", "Sekme kapanana kadar"],
            ["sofya.messages", "Oturum depolaması (zorunlu)", "Sayfalar arasında gezerken sohbetinizin kaybolmaması için mesajların bir kopyasını tutar.", "Sekme kapanana kadar"],
            ["sofya.cookie-consent", "Yerel depolama (zorunlu)", "Bu politikayı kabul ettiğinizi hatırlar, böylece onay çubuğunu tekrar göstermeyiz.", "Siz silene kadar"],
          ],
        },
      ],
    },
    {
      id: "ucuncu-taraf",
      title: "3. Üçüncü taraf bağlantıları",
      blocks: [
        {
          kind: "p",
          text: "Sitemizdeki WhatsApp bağlantılarına tıkladığınızda ya da kartınız 3D Secure doğrulaması için bankanızın sayfasına yönlendirildiğinde ilgili hizmetin kendi sitesine geçersiniz. Bu siteler kendi çerezlerini kullanabilir; onlar için ilgili hizmetin politikaları geçerlidir. Sitemiz bu hizmetlerin çerezlerini sizin için yüklemez.",
        },
      ],
    },
    {
      id: "yonetim",
      title: "4. Tercihlerinizi nasıl yönetirsiniz?",
      blocks: [
        {
          kind: "ul",
          items: [
            "Sayfanın en altındaki \"Çerez tercihleri\" bağlantısına tıklayarak kabulünüzü geri alabilir ve onay çubuğunu yeniden görebilirsiniz.",
            "Tarayıcınızın ayarlarından çerezleri ve site verilerini silebilir ya da engelleyebilirsiniz. Zorunlu depolamayı engellerseniz Sofya sohbeti gibi bazı özellikler düzgün çalışmayabilir.",
          ],
        },
      ],
    },
    {
      id: "degisiklikler",
      title: "5. Değişiklikler",
      blocks: [
        {
          kind: "p",
          text: "Sitemize analiz ya da benzeri araçlar eklenirse bu politikayı güncelleriz ve gerektiğinde yeniden onayınızı isteriz. Güncel sürüm her zaman bu sayfada yayımlanır.",
        },
      ],
    },
    {
      id: "iletisim",
      title: "6. Bize ulaşın",
      blocks: [
        { kind: "p", text: "Çerezlerle ilgili sorularınız için bize ulaşabilirsiniz. Kişisel verilere ilişkin ayrıntılı bilgi KVKK Aydınlatma Metni'nde yer alır." },
        { kind: "contact" },
      ],
    },
  ],
};
