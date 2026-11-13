import type { CoverIcon } from "./product-pages";

/**
 * Questions of the /sss page, grouped into tabs. Answers are general guidance: coverage, limits and excess depend on
 * the insurer and the package, which the answers say where it matters.
 */
export interface FaqCategory {
  id: string;
  label: string;
  icon: CoverIcon;
  items: { q: string; a: string }[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "arac",
    label: "Araç sigortaları",
    icon: "car",
    items: [
      {
        q: "Kasko ve trafik sigortası arasındaki fark nedir?",
        a: "Trafik sigortası zorunludur ve başkalarına verdiğiniz zararları karşılar. Kasko isteğe bağlıdır ve aracınızın kendi hasarlarını teminat altına alır.",
      },
      {
        q: "Trafik sigortasını yaptırmazsam ne olur?",
        a: "Sigortasız araç tespit edildiğinde trafikten men edilebilir ve para cezası uygulanır. Olası bir kazada tüm masrafları kendiniz karşılamak zorunda kalırsınız.",
      },
      {
        q: "Kasko neleri kapsar?",
        a: "Pakete göre çarpma ve çarpışma, yangın, hırsızlık ve doğal afetlerin yanında cam kırılması, yol yardımı ve ikame araç gibi ek teminatlar kapsama girebilir. Kapsam şirkete ve pakete göre değişir.",
      },
      {
        q: "Muafiyet nedir?",
        a: "Hasar durumunda poliçede belirtilen ve sizin ödediğiniz tutar ya da orandır. Muafiyet yükseldikçe prim genellikle düşer, ancak hasarda cebinizden çıkacak tutar artar.",
      },
      {
        q: "İMM sigortası nedir, ne zaman gerekir?",
        a: "İhtiyari Mali Mesuliyet sigortası, trafik sigortasının limitleri yetersiz kaldığında karşı tarafa ödemeniz gereken ek tutarı karşılar. İsteğe bağlıdır ve birçok kasko poliçesinde de yer alır.",
      },
      {
        q: "Hasarsızlık indirimi nedir?",
        a: "Poliçe döneminde hasar bildirmediğiniz yıllar için şirketlerin sunduğu prim indirimidir. Oranı ve kademeleri şirkete göre değişir.",
      },
      {
        q: "Kaza olursa ne yapmalıyım?",
        a: "Güvenliği sağlayın, gerekirse 112'yi arayın, kaza tespit tutanağı düzenleyin ve fotoğraf çekin. Ardından hasarı en kısa sürede sigorta şirketine bildirin.",
      },
    ],
  },
  {
    id: "konut",
    label: "Konut ve DASK",
    icon: "home",
    items: [
      {
        q: "DASK zorunlu mu?",
        a: "Evet. Zorunlu Deprem Sigortası (DASK), tapu kaydı olan konutlar için yasal bir zorunluluktur. Yalnızca binayı güvence altına alır, evin içindeki eşyaları kapsamaz.",
      },
      {
        q: "Deprem sigortasında eşyalar teminat altında mıdır?",
        a: "Hayır. DASK yalnızca binanızı (duvarlar, çatı, temel gibi) güvence altına alır. Evin içindeki eşyalar için konut sigortası yaptırmanız gerekir.",
      },
      {
        q: "Konut sigortasını kiracılar da yaptırabilir mi?",
        a: "Evet. Eşya sigortası olarak da bilinen bu modelle evin kendisini değil, içindeki eşyalarınızı yangın, su baskını ve hırsızlık gibi zararlara karşı güvence altına alırsınız.",
      },
      {
        q: "Konut sigortası neleri kapsar?",
        a: "Pakete göre yangın, su baskını, hırsızlık, doğal afetler, cam kırılması, üçüncü kişilere karşı sorumluluk ve asistans hizmetleri gibi teminatlar yer alır.",
      },
      {
        q: "DASK primi şirketlere göre değişir mi?",
        a: "Hayır. DASK primleri ortak tarifeye göre hesaplanır. Yapı tarzı, metrekare ve deprem risk bölgesi gibi bilgiler fiyatı belirler.",
      },
      {
        q: "DASK poliçesi ne kadar geçerli?",
        a: "DASK poliçeleri bir yıllıktır. Süresi dolmadan yenilenmesi gerekir.",
      },
    ],
  },
  {
    id: "saglik",
    label: "Sağlık ve kaza",
    icon: "heart",
    items: [
      {
        q: "Tamamlayıcı sağlık sigortası nedir?",
        a: "SGK'lıların anlaşmalı özel hastanelerde, devletin karşıladığı kısmın dışındaki fark ücretini ödemeden muayene, tahlil ve tedavi olmasına yardımcı olan sigorta türüdür.",
      },
      {
        q: "Kimler tamamlayıcı sağlık sigortası yaptırabilir?",
        a: "SGK güvencesi olanlar yaptırabilir. Şirketlerin yaş sınırları ve şartları farklılık gösterebilir.",
      },
      {
        q: "Önceden var olan hastalıklar kapsanır mı?",
        a: "Çoğu poliçede poliçe öncesinde var olan hastalıklar kapsam dışıdır ya da bekleme süresine tabidir. Şartları poliçeden kontrol edin.",
      },
      {
        q: "Ferdi kaza sigortası nedir?",
        a: "Beklenmedik bir kaza sonucu oluşan ölüm, sürekli sakatlık ve tedavi masraflarına karşı maddi güvence sağlayan sigorta türüdür. Hastalıkları kapsamaz.",
      },
      {
        q: "Trafik sigortası ya da kasko ferdi kazanın yerini tutar mı?",
        a: "Hayır. Trafik sigortası ve kasko, sürücünün kendi yaralanmasını kapsamaz. Ferdi kaza sigortası bu açığı kapatabilir.",
      },
    ],
  },
  {
    id: "seyahat",
    label: "Seyahat",
    icon: "plane",
    items: [
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
        q: "Yurt dışında sağlık sorunu yaşarsam ne yapmalıyım?",
        a: "Önce acil yardımı alın, ardından poliçenizdeki 7/24 asistans hattını arayın. Tüm belgeleri saklayıp dönüşte şirkete başvurun.",
      },
    ],
  },
  {
    id: "teklif",
    label: "Teklif ve Sofya",
    icon: "document",
    items: [
      {
        q: "Teklif almak için ne yapmalıyım?",
        a: "Ürün sayfasındaki kısa formu doldurabilir, WhatsApp'tan danışmanımıza yazabilir ya da önce Sofya'ya sorularınızı sorabilirsiniz. Formdaki bilgiler hazır bir WhatsApp mesajı olarak danışmanımıza iletilir.",
      },
      {
        q: "Teklif almak için TC kimlik numaramı vermem gerekir mi?",
        a: "Sitedeki formlar TC kimlik numarası istemez. Poliçeyi başlatırken danışmanımız gerekli ek bilgileri ayrıca isteyebilir.",
      },
      {
        q: "Sofya gerçek bir kişi mi?",
        a: "Hayır, Sofya yapay zeka destekli bir sigorta asistanıdır. Sorularınızı yanıtlar ve sizi yönlendirir. Kesin fiyat ve poliçe işlemleri için uzman danışmanlarımızla da görüşebilirsiniz.",
      },
      {
        q: "Sofya'nın verdiği bilgi kesin mi?",
        a: "Sofya genel ve anlaşılır bilgi verir. Teminat, limit ve muafiyetler şirkete ve poliçeye göre değiştiği için kesin bilgi ve fiyat için poliçe şartlarına ve danışmanlarımıza başvurmalısınız.",
      },
      {
        q: "Kişisel bilgilerim güvende mi?",
        a: "TC kimlik, kart ya da IBAN gibi bilgileri Sofya'ya yazmanız gerekmez. Yazsanız bile bu bilgiler kaydedilmeden ve yapay zekaya gönderilmeden önce maskelenir. IP adresiniz ham olarak saklanmaz.",
      },
    ],
  },
];

export const ALL_FAQ_ITEMS = FAQ_CATEGORIES.flatMap((category) => category.items);
