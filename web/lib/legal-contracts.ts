import { CONTACT } from "./content";
import type { LegalDoc } from "./legal";

/**
 * Pre-contract information and the cancellation / refund terms for policies bought on the site.
 *
 * Insurance is a financial service, so the rules that apply are those for distance contracts for financial services
 * (6502 sayılı Kanun and the Finansal Hizmetlere İlişkin Mesafeli Sözleşmeler Yönetmeliği), not the general distance sales
 * rules. DRAFT: have a lawyer review it, and check each insurer's own general conditions for the exceptions it lists.
 */
export const INFO_DOC: LegalDoc = {
  slug: "sigorta-bilgilendirme",
  title: "Sigorta Ön Bilgilendirme",
  heroTitle: "Sigorta Ön Bilgilendirme ve Genel Şartlar",
  description:
    "Poliçe satın almadan önce bilmeniz gerekenler: aracı bilgileri, teklif ve prim, ödeme güvenliği, cayma, genel şartlar ve başvuru yolları.",
  intro:
    "Finansal hizmetlere ilişkin mesafeli sözleşmelerde tüketiciye sözleşme kurulmadan önce verilmesi gereken bilgileri bu sayfada bulabilirsiniz. Satın almadan önce okumanızı öneririz.",
  sections: [
    {
      id: "aracinin-bilgileri",
      title: "1. Hizmeti sunan",
      blocks: [
        {
          kind: "p",
          text: "Sigorta aracılık hizmetini aşağıdaki kuruluş sunar. Sigorta sözleşmesinin tarafı, seçtiğiniz teklifte adı yazan sigorta şirketidir; Sofya Dijital Sigorta sigorta şirketi ile sizin aranızda aracılık eder.",
        },
        { kind: "contact" },
      ],
    },
    {
      id: "hizmet",
      title: "2. Hizmetin niteliği",
      blocks: [
        {
          kind: "ul",
          items: [
            "Verdiğiniz bilgilere göre anlaşmalı sigorta şirketlerinden teklifler alınır ve sizin için listelenir. Hangi şirketlerden teklif geleceği, ürüne ve bilgilerinize göre değişir.",
            "Seçtiğiniz teklif için ödeme yaptığınızda poliçe, ilgili sigorta şirketi tarafından düzenlenir. Poliçenin teminatı, kapsamı ve şartları o şirkete aittir.",
            "Sofya yapay zeka destekli bir asistandır. Genel bilgi verir ve hata yapabilir; teklif kartındaki ve poliçedeki bilgiler esastır.",
          ],
        },
      ],
    },
    {
      id: "teklif-prim",
      title: "3. Teklif ve prim",
      blocks: [
        {
          kind: "ul",
          items: [
            "Teklif kartında şirketin adı, prim tutarı ve teminat bilgileri yer alır. Teklifler anlık alınır ve sınırlı bir süre geçerlidir.",
            "Bilgilerinizin eksik ya da hatalı olması hâlinde prim değişebilir veya poliçe düzenlenemeyebilir. Beyan ettiğiniz bilgilerin doğruluğundan siz sorumlusunuz; yanlış ya da eksik beyan, tazminat hakkınızı etkileyebilir.",
            "Ödeme adımında, kartınızdan çekilecek toplam tutar satın almadan önce size gösterilir. Gösterilenden farklı bir tutar çekilmez.",
            "Seyahat gibi bazı tekliflerde tutar Türk lirası dışında bir para biriminde (ör. euro) gösterilebilir; bu durumda kartınızdan çekim, bankanızın uyguladığı kurla yapılır.",
          ],
        },
      ],
    },
    {
      id: "odeme",
      title: "4. Ödeme ve güvenlik",
      blocks: [
        {
          kind: "ul",
          items: [
            "Ödeme kredi veya banka kartıyla yapılır. Ödemeyi, onay kutusunu işaretleyerek siz başlatırsınız; onayınız kayıt altına alınır.",
            "Kart bilgileriniz yalnızca ödemenin yapılması için sigorta şirketinin ödeme altyapısına şifreli bağlantı üzerinden iletilir. Sunucularımızda saklanmaz, kayıt dosyalarına yazılmaz. Ödeme formu şifreli (HTTPS) bağlantı dışında açılmaz.",
            "Bankanız ek doğrulama (3D Secure) isterse bankanızın sayfasına yönlendirilirsiniz; doğrulama bankanız tarafından yapılır.",
            "Ödeme alındığı hâlde sonuç net olarak görülemezse aynı teklif için yeniden çekim yapılmaz ve işlem kilitlenir. Durumu inceleyip sizinle iletişime geçeriz.",
            "Ödeme sonucu ve poliçe belgesi satın alma ekranında gösterilir. Poliçe belgesine buradan ulaşabilirsiniz.",
          ],
        },
      ],
    },
    {
      id: "genel-sartlar",
      title: "5. Poliçe genel şartları",
      blocks: [
        {
          kind: "p",
          text: "Her sigorta branşının genel şartları ilgili mevzuata göre hazırlanır ve sigorta şirketleri tarafından yayımlanır. Genel şartlar; teminatın kapsamını, kapsam dışı hâlleri, muafiyetleri, hasar bildirimi ve tazminat sürecini belirler. Seçtiğiniz şirketin genel şartlarını, özel şartlarını ve teminat tablosunu satın almadan önce bizden isteyebilirsiniz; poliçe belgenizle birlikte de size ulaşır.",
        },
        {
          kind: "p",
          text: "Satın almadan önce özellikle kapsam dışı hâlleri, muafiyetleri ve hasar bildirim sürelerini okumanızı öneririz.",
        },
      ],
    },
    {
      id: "cayma",
      title: "6. Cayma hakkı",
      blocks: [
        {
          kind: "p",
          text: "Finansal hizmetlere ilişkin mesafeli sözleşmelerde tüketici, mevzuatta belirtilen süre içinde gerekçe göstermeden ve cezai şart ödemeden cayma hakkına sahiptir. Süre, başlangıcı, istisnalar ve prim iadesinin nasıl hesaplandığı Cayma, İptal ve İade Koşulları sayfasında açıklanmıştır. Bazı sigorta türlerinde (ör. süresi kısa olanlar ya da zorunlu sigortalar) cayma hakkı sınırlı olabilir; bu durum poliçede ve teklifte belirtilir.",
        },
      ],
    },
    {
      id: "basvuru",
      title: "7. Şikâyet ve başvuru yolları",
      blocks: [
        {
          kind: "ul",
          items: [
            `Önce bize ulaşabilirsiniz: ${CONTACT.email} ya da ${CONTACT.phone}.`,
            "Sigorta şirketiyle yaşadığınız uyuşmazlıklarda Sigorta Tahkim Komisyonu'na başvurabilirsiniz.",
            "Tüketici uyuşmazlıkları için bulunduğunuz yerdeki tüketici hakem heyetlerine ya da tüketici mahkemelerine başvurabilirsiniz.",
            "Sigorta şirketleri ve aracılar hakkındaki şikâyetlerinizi Hazine ve Maliye Bakanlığı'na da iletebilirsiniz.",
          ],
        },
      ],
    },
    {
      id: "veriler",
      title: "8. Kişisel veriler",
      blocks: [
        {
          kind: "p",
          text: "Kimlik, iletişim ve teklif bilgileriniz, teklif almak ve poliçeyi düzenlemek amacıyla sigorta şirketlerine ve teklif sistemi sağlayıcımıza iletilir. Ayrıntılar KVKK Aydınlatma Metni ve Gizlilik Politikası'nda yer alır.",
        },
      ],
    },
    {
      id: "iletisim",
      title: "9. Bize ulaşın",
      blocks: [{ kind: "p", text: "Sorularınız ya da talepleriniz için:" }, { kind: "contact" }],
    },
  ],
};

export const REFUND_DOC: LegalDoc = {
  slug: "cayma-iptal-iade",
  title: "Cayma, İptal ve İade Koşulları",
  heroTitle: "Cayma, İptal ve İade Koşulları",
  description:
    "Aldığınız poliçeden nasıl cayabileceğinizi, poliçenizi nasıl iptal ettirebileceğinizi ve prim iadesinin nasıl yapıldığını öğrenin.",
  intro:
    "Satın aldığınız poliçeden cayma, poliçeyi iptal ettirme ve prim iadesi almayla ilgili bilmeniz gerekenler. Bu sayfa genel çerçeveyi anlatır; poliçenizdeki ve sigorta şirketinin genel şartlarındaki hükümler önceliklidir.",
  sections: [
    {
      id: "cayma",
      title: "1. Cayma hakkı",
      blocks: [
        {
          kind: "ul",
          items: [
            "Finansal hizmetlere ilişkin mesafeli sözleşmelerde tüketici, sözleşmenin kurulduğu tarihten itibaren on dört gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayabilir.",
            "Cayma süresi içinde teminat başlamışsa, teminatın sürdüğü döneme karşılık gelen prim kesilebilir; kalan kısım iade edilir.",
            "Mevzuata ve poliçeye göre bazı sözleşmelerde cayma hakkı kullanılamaz ya da farklı uygulanır. Örneğin süresi kısa olan sigortalarda ve zorunlu sigortalarda koşullar farklı olabilir. Bu istisnalar poliçede ve sigorta şirketinin genel şartlarında yer alır.",
            "Cayma hakkınızı kullanmak istiyorsanız bunu, süre dolmadan, aşağıdaki iletişim kanallarından yazılı olarak (e-posta dahil) bildirmeniz yeterlidir.",
          ],
        },
      ],
    },
    {
      id: "iptal",
      title: "2. Poliçenin iptali",
      blocks: [
        {
          kind: "ul",
          items: [
            "Cayma süresi geçtikten sonra da poliçenizin iptalini isteyebilirsiniz (ör. aracın satılması). İptal koşulları ve iade hesabı, poliçenin türüne ve sigorta şirketinin genel şartlarına göre belirlenir.",
            "Sigorta şirketleri iptalde, teminatın sürdüğü süre için prim kesintisi yapabilir; kalan prim iade edilir.",
            "Zorunlu sigortalarda (trafik, DASK gibi) iptal ve iade koşulları ilgili mevzuata tabidir.",
            "İptal talebiniz sigorta şirketine iletilir ve sonucu size bildirilir.",
          ],
        },
      ],
    },
    {
      id: "iade",
      title: "3. Prim iadesi",
      blocks: [
        {
          kind: "ul",
          items: [
            "Prim iadesi, ödemeyi yaptığınız karta yapılır. İadenin kartınıza yansıma süresi bankanıza bağlıdır.",
            "İade tutarı, iptal tarihine göre hesaplanır ve sigorta şirketinin onayından sonra yapılır.",
            "Ödeme alındığı hâlde poliçe düzenlenememişse tahsil edilen tutarın tamamı iade edilir. Aynı teklif için fazladan çekim yapılmışsa fazla tutar iade edilir.",
          ],
        },
      ],
    },
    {
      id: "basvuru",
      title: "4. Nasıl başvurursunuz?",
      blocks: [
        {
          kind: "p",
          text: "Cayma, iptal ya da iade talebinizi aşağıdaki kanallardan bize iletebilirsiniz. Talebinizde adınızı, poliçe numaranızı ve talebinizin konusunu belirtmeniz süreci hızlandırır. Güvenliğiniz için T.C. kimlik numaranızı ve kart bilgilerinizi e-posta ya da sohbet ile göndermeyiniz; gerekirse bizden telefonla doğrulama isteriz.",
        },
        { kind: "contact" },
      ],
    },
    {
      id: "uyusmazlik",
      title: "5. Uyuşmazlıklar",
      blocks: [
        {
          kind: "p",
          text: "Talebinizin sonucundan memnun kalmazsanız Sigorta Tahkim Komisyonu'na, tüketici hakem heyetlerine ya da tüketici mahkemelerine başvurma hakkınız saklıdır. Ayrıntılar Sigorta Ön Bilgilendirme ve Genel Şartlar sayfasındadır.",
        },
      ],
    },
  ],
};
