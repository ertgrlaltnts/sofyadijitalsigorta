export interface SeedEntry {
  title: string;
  content: string;
  categorySlug: string;
  tags: string[];
}

export const SEED_ENTRIES: SeedEntry[] = [
  {
    title: 'Kasko nedir?',
    categorySlug: 'kasko',
    tags: ['kasko', 'araç'],
    content:
      'Kasko, aracınızın kaza, çarpışma, devrilme, yangın, çalınma ve doğal afetler gibi risklerden doğan hasarlarını karşılayan isteğe bağlı bir araç sigortasıdır. Trafik sigortasından farklı olarak yalnızca karşı tarafın değil, kendi aracınızın zararlarını da teminat altına alır. Kapsam ve teminat limitleri sigorta şirketine ve seçilen pakete göre değişir.',
  },
  {
    title: 'Trafik sigortası zorunlu mu?',
    categorySlug: 'trafik-sigortasi',
    tags: ['trafik', 'zorunlu'],
    content:
      'Evet. Zorunlu Mali Sorumluluk (trafik) sigortası, Türkiye\'de trafiğe çıkan tüm motorlu araçlar için yasal olarak zorunludur. Kazada karşı tarafın araç, can ve sağlık zararlarını karşılar; kendi aracınızın hasarını karşılamaz. Trafik sigortası yaptırmayan araç sahipleri idari para cezasıyla karşılaşabilir.',
  },
  {
    title: 'Kasko ile trafik sigortası arasındaki fark nedir?',
    categorySlug: 'kasko',
    tags: ['kasko', 'trafik', 'fark'],
    content:
      'Trafik sigortası zorunludur ve kazada karşı tarafa verdiğiniz zararları karşılar. Kasko ise isteğe bağlıdır ve kendi aracınızın hasarını, çalınmasını, yangın ve doğal afet zararlarını da kapsar. Kasko yaptırmak trafik sigortası yaptırma zorunluluğunu ortadan kaldırmaz.',
  },
  {
    title: 'DASK nedir, kimler yaptırmak zorunda?',
    categorySlug: 'dask',
    tags: ['dask', 'deprem', 'zorunlu'],
    content:
      'DASK (Doğal Afet Sigortaları Kurumu) Zorunlu Deprem Sigortası, deprem ve deprem sonucu oluşan yangın, patlama, tsunami ve göçük gibi zararları kapsayan zorunlu bir sigortadır. Belediye sınırları içindeki tapulu konutların malikleri için zorunludur. Sigorta yalnızca binanın yapısal zararlarını teminat altına alır; ev eşyaları DASK kapsamında değildir.',
  },
  {
    title: 'Konut sigortası neleri kapsar?',
    categorySlug: 'konut',
    tags: ['konut', 'ev', 'yangın'],
    content:
      'Konut sigortası; yangın, yıldırım, patlama, hırsızlık, su baskını ve doğal afet gibi risklere karşı evinizi ve ev eşyalarınızı güvence altına alır. DASK yalnızca depremden doğan bina zararlarını karşıladığı için, konut sigortası DASK\'ı tamamlayan geniş bir koruma sağlar. Kapsam, seçilen teminatlara göre değişir.',
  },
  {
    title: 'Tamamlayıcı sağlık sigortası (TSS) nedir?',
    categorySlug: 'saglik-tss',
    tags: ['sağlık', 'tss', 'tamamlayıcı'],
    content:
      'Tamamlayıcı Sağlık Sigortası (TSS), SGK kapsamındaki sağlık hizmetlerine ek olarak anlaşmalı özel hastanelerde muayene, tahlil, ameliyat ve yatarak tedavi gibi giderlerde fark ödemelerini azaltmayı veya ortadan kaldırmayı amaçlayan bir sigortadır. Teminat ve anlaşmalı kurumlar sigorta şirketinin sunduğu pakete göre değişir.',
  },
  {
    title: 'Seyahat sağlık sigortası ne işe yarar?',
    categorySlug: 'seyahat',
    tags: ['seyahat', 'vize', 'yurt dışı'],
    content:
      'Seyahat sağlık sigortası, yurt dışı seyahatiniz sırasında ani hastalık, kaza ve acil tıbbi müdahale giderlerini karşılar. Birçok ülkenin vize başvurusunda zorunlu tutulur. Seyahat süresi, gidilecek bölge ve teminat limitine göre poliçe seçilir.',
  },
  {
    title: 'Sofya AI nedir ve nasıl çalışır?',
    categorySlug: 'genel',
    tags: ['sofya', 'platform', 'nasıl çalışır'],
    content:
      'Sofya AI, birçok sigorta şirketinden teklif toplayıp müşterilerine hızlıca ulaştıran bir platformdur. İhtiyacınız olan sigorta türü için bilgilerinizi paylaşırsınız; Sofya AI farklı şirketlerin tekliflerini sizin için bir araya getirir, böylece tek tek şirketlerle uğraşmadan seçenekleri karşılaştırabilirsiniz.',
  },
  {
    title: 'Nasıl teklif alabilirim?',
    categorySlug: 'genel',
    tags: ['teklif', 'başvuru'],
    content:
      'Teklif almak için web sitemizdeki "Teklif Al" sayfasından sigorta türünü seçip istenen bilgileri doldurmanız yeterlidir. Talebiniz sigorta şirketlerine iletilir ve teklifler size ulaştırılır. Sohbet sırasında TC kimlik numarası, kart numarası gibi hassas bilgileri yazmamanızı rica ederiz.',
  },
  {
    title: 'Poliçe yenileme ve iptal süreci nasıl işler?',
    categorySlug: 'genel',
    tags: ['poliçe', 'yenileme', 'iptal'],
    content:
      'Poliçenizin bitiş tarihinden önce sigorta şirketiniz yenileme teklifi sunar; farklı şirketlerin tekliflerini karşılaştırarak yenileme zamanında daha uygun bir seçenek bulabilirsiniz. Poliçe iptali ve prim iadesi koşulları ilgili sigorta şirketinin genel şartlarına göre belirlenir. Kesin bilgi için poliçenizi düzenleyen şirketle iletişime geçmeniz gerekir.',
  },
];
