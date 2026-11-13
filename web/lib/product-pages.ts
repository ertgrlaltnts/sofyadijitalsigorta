/**
 * Long-form content for product landing pages (the quote form on top, guidance underneath).
 * A product without an entry here uses the short template in app/urunler/[slug]/page.tsx.
 *
 * Wording is general guidance, not a policy text: coverage, limits and excess differ by insurer and package.
 */

import type { LiveQuoteKey } from "./quote-products";
import { ACCIDENT } from "./pages/ferdi-kaza";
import { DASK } from "./pages/dask";
import { HEALTH } from "./pages/tamamlayici-saglik";
import { HOME } from "./pages/konut";
import { IMM } from "./pages/imm";
import { TRAVEL } from "./pages/seyahat";
import { TRAFFIC } from "./pages/trafik";

export type CoverIcon =
  | "car" | "flame" | "lock" | "storm" | "glass" | "lifebuoy" | "swap" | "wrench"
  | "shield" | "shieldCheck" | "heart" | "pulse" | "cross" | "hospital" | "home" | "building" | "key" | "water"
  | "wave" | "plane" | "suitcase" | "globe" | "calendar" | "clock" | "user" | "users" | "coin" | "document"
  | "scale" | "phone" | "alert";

export interface ProductPage {
  /** Page <title> and the service name in structured data. */
  title: string;
  description: string;
  /** Visible page heading and the name used in messages to the agency. */
  h1: string;
  /** Short name used in "<name> teklifi al" and the panel heading. */
  shortName: string;
  /** Which product the quote form quotes (components/live-quote-form.tsx). */
  form: LiveQuoteKey;
  intro: string;
  /** Short reassurance lines in the panel next to the form. */
  assurances: string[];
  /** The three steps in the panel next to the form. */
  quoteSteps: { title: string; body: string }[];
  /** Labels in the page ruler. */
  nav: { cover: string; packages: string; factors: string; tips: string; claim: string };

  coverTitle: string;
  coverIntro: string;
  /** Six or eight cards: the bento grid is laid out for those counts. */
  covers: { icon: CoverIcon; title: string; body: string }[];

  packagesTitle: string;
  packages: { title: string; tag: string; body: string }[];

  factorsTitle: string;
  factorsIntro: string;
  factorsCta: { label: string; question: string };
  factors: { title: string; body: string }[];

  tipsTitle: string;
  tips: { title: string; body: string }[];
  tipsAside: { title: string; body: string; question: string };

  claimTitle: string;
  claimSteps: { title: string; body: string }[];

  /** Other products worth a link from this page (internal linking). */
  related: { title: string; slugs: string[] };
  faq: { q: string; a: string }[];
}

export const PRODUCT_PAGES: Record<string, ProductPage> = {
  kasko: {
    title: "Kasko Sigortası Teklifi",
    h1: "Kasko Sigortası",
    shortName: "Kasko",
    form: "kasko",
    nav: { cover: "Teminatlar", packages: "Paketler", factors: "Fiyat", tips: "Dikkat", claim: "Hasar" },
    factorsIntro: "Aynı araç için bile teklifler farklı çıkabilir. Fiyatı belirleyen unsurları bilmek, doğru karşılaştırma yapmanızı sağlar.",
    factorsCta: { label: "Primi nasıl düşürürüm?", question: "Kasko fiyatı neye göre belirlenir, primi nasıl düşürebilirim?" },
    tipsAside: {
      title: "Poliçenizi birlikte inceleyelim",
      body: "Elinizdeki teklifi ya da poliçeyi Sofya'ya anlatın, muafiyet ve teminatları sade bir dille açıklasın.",
      question: "Elimdeki kasko teklifini birlikte inceleyebilir miyiz?",
    },
    description:
      "Kasko sigortası neleri kapsar, fiyatı neye göre değişir? Birkaç bilgiyle teklif isteyin, teminat ve muafiyet farklarını Sofya sade bir dille anlatsın.",
    intro:
      "Kasko sigortası, kaza, hırsızlık, yangın ya da doğal afet gibi durumlarda aracınızın kendi hasarına karşı güvence sağlar. Araç bilgilerinizi paylaşın, size uygun kasko teklifini birlikte netleştirelim.",
    assurances: [
      "Anlaşmalı şirketlerden teklif alın",
      "Teminat ve muafiyet farkları sade bir dille anlatılır",
    ],
    quoteSteps: [
      { title: "Aracınızı tanıtın", body: "Plaka, ruhsat seri/no ve mesleğiniz yeterli." },
      { title: "Kimliğinizi doğrulayın", body: "T.C. kimlik no, doğum tarihi ve cep telefonunuz teklif için yeterli." },
      { title: "Fiyatları karşılaştırın", body: "Şirketlerin fiyatları kısa sürede, en uygundan başlayarak listelenir." },
    ],

    coverTitle: "Kasko neleri güvence altına alır?",
    coverIntro:
      "Aşağıdakiler kaskonun en sık karşılaşılan teminatlarıdır. Hangilerinin pakete dahil olduğu şirkete ve seçtiğiniz pakete göre değişir.",
    covers: [
      {
        icon: "car",
        title: "Çarpma ve çarpışma",
        body: "Kazada aracınızın uğradığı hasar, kusurun kimde olduğundan bağımsız olarak onarılabilir. Kapsam poliçeye bağlıdır.",
      },
      {
        icon: "flame",
        title: "Yangın",
        body: "Aracınızın yanması ya da yangın sonucu uğradığı zararlar teminat kapsamındadır.",
      },
      {
        icon: "lock",
        title: "Hırsızlık",
        body: "Aracınızın çalınması ya da çalınmaya teşebbüs sırasında verilen zarar karşılanır.",
      },
      {
        icon: "storm",
        title: "Doğal afetler",
        body: "Sel, dolu, fırtına, heyelan gibi doğal olayların neden olduğu hasarlar teminata dahil edilebilir.",
      },
      {
        icon: "glass",
        title: "Cam kırılması",
        body: "Ön cam ve diğer camlardaki hasarlar için ek teminat seçeneği sunulur. Muafiyetsiz uygulama olabilir.",
      },
      {
        icon: "lifebuoy",
        title: "Yol yardımı ve çekici",
        body: "Arıza ya da kaza sonrası aracınızın en yakın servise çekilmesi gibi hizmetler pakete eklenebilir.",
      },
      {
        icon: "swap",
        title: "İkame araç",
        body: "Aracınız onarımdayken size belirli bir süre yedek araç sağlanması ek teminat olarak seçilebilir.",
      },
      {
        icon: "wrench",
        title: "Mini onarım",
        body: "Küçük çizik, ezik ve boya hasarları için ek teminat sunan paketler vardır.",
      },
    ],

    packagesTitle: "Hangi kasko paketi size uygun?",
    packages: [
      {
        title: "Tam kasko",
        tag: "Geniş kapsam",
        body: "Çarpma, çarpışma, çalınma, yangın ve doğal afet gibi riskleri bir arada karşılayan en kapsamlı seçenektir. Aracı sık kullananlar ve yeni araç sahipleri için tercih edilir.",
      },
      {
        title: "Dar kasko",
        tag: "Sınırlı kapsam",
        body: "Yalnızca belirli riskleri güvence altına alır ve genellikle daha düşük primlidir. Hangi hasarların dışarıda kaldığı şirkete göre değiştiği için kapsamı mutlaka okuyun.",
      },
      {
        title: "Ek teminatlar",
        tag: "İhtiyaca göre",
        body: "Cam kırılması, ikame araç, yol yardımı, mini onarım gibi teminatlarla paketinizi kendi kullanımınıza göre şekillendirebilirsiniz.",
      },
    ],

    factorsTitle: "Kasko fiyatını ne belirler?",
    factors: [
      { title: "Araç bilgileri", body: "Marka, model, model yılı ve aracın değeri primi doğrudan etkiler." },
      { title: "Hasarsızlık durumu", body: "Hasarsız geçirdiğiniz yıllar için şirketler prim indirimi uygulayabilir." },
      { title: "Sürücü profili", body: "Sürücünün yaşı ve ehliyet süresi risk hesabında dikkate alınır." },
      { title: "Kullanım şekli", body: "Aracın kişisel mi, ticari mi kullanıldığı ve yıllık kullanım yoğunluğu fiyatı değiştirir." },
      { title: "Bulunduğunuz il", body: "Hırsızlık ve kaza sıklığı iller arasında fark gösterdiği için prim de değişir." },
      { title: "Muafiyet ve teminatlar", body: "Muafiyet tutarını yükseltmek primi düşürebilir, ek teminat eklemek artırabilir." },
    ],

    tipsTitle: "Teklif alırken nelere bakmalısınız?",
    tips: [
      {
        title: "Muafiyet tutarı",
        body: "Hasarın ilk kısmını sizin karşıladığınız tutardır. Düşük prim cazip görünse de yüksek muafiyet hasarda size pahalıya patlayabilir.",
      },
      {
        title: "Anlaşmalı servis türü",
        body: "Onarımın yetkili serviste mi, özel serviste mi yapılacağını ve orijinal parça kullanılıp kullanılmadığını sorun.",
      },
      {
        title: "İkame araç süresi",
        body: "Yedek araç veriliyorsa kaç gün ve hangi sınıfta olduğunu öğrenin.",
      },
      {
        title: "Sigorta bedeli",
        body: "Aracınızın değerine uygun bir bedel seçildiğinden emin olun. Düşük bedel, hasarda eksik ödeme anlamına gelebilir.",
      },
      {
        title: "Hariç tutulan durumlar",
        body: "Alkollü araç kullanma, ehliyetsiz sürüş gibi durumlar çoğu poliçede kapsam dışıdır. Şartları satın almadan önce okuyun.",
      },
    ],

    claimTitle: "Hasar olursa ne yapmalısınız?",
    related: { title: "Araç sahipleri için diğer sigortalar", slugs: ["trafik-sigortasi", "imm", "ferdi-kaza"] },
    claimSteps: [
      {
        title: "Güvenliği sağlayın",
        body: "Önce kendinizin ve yolcuların güvenliğini sağlayın, gerekiyorsa 112'yi arayın. Aracı yolu kapatmayacak şekilde güvenli bir yere çekin.",
      },
      {
        title: "Kaydı oluşturun",
        body: "Karşı tarafla birlikte kaza tespit tutanağı düzenleyin, aracın ve olay yerinin fotoğraflarını çekin. Gerekli durumlarda polis ya da jandarma çağırın.",
      },
      {
        title: "Şirkete bildirin",
        body: "Hasarı en kısa sürede, poliçenizde belirtilen süreyi aşmadan sigorta şirketine bildirin. Sofya ya da danışmanımız bu adımda size yol gösterebilir.",
      },
      {
        title: "Ekspertiz ve onarım",
        body: "Şirketin görevlendirdiği eksper hasarı inceler. Onaydan sonra onarım yapılır ve muafiyet dışındaki tutar şirket tarafından karşılanır.",
      },
    ],

    faq: [
      {
        q: "Kasko zorunlu mu?",
        a: "Hayır. Zorunlu olan trafik sigortasıdır. Kasko isteğe bağlıdır ve aracınızın kendi hasarlarını güvence altına alır.",
      },
      {
        q: "Kasko ile trafik sigortası arasındaki fark nedir?",
        a: "Trafik sigortası, kazada karşı tarafa verdiğiniz zararları karşılar ve zorunludur. Kasko ise kendi aracınızın hasarını, çalınmasını, yangın ve doğal afet zararlarını karşılar.",
      },
      {
        q: "Kasko fiyatı neye göre hesaplanır?",
        a: "Araç marka, model ve yılı, aracın değeri, sürücü yaşı ve ehliyet süresi, hasarsızlık durumunuz, kullanım şekli, bulunduğunuz il ve seçtiğiniz teminatlar ile muafiyet tutarı fiyatı etkiler.",
      },
      {
        q: "Muafiyet nedir?",
        a: "Hasar durumunda poliçede belirtilen ve sizin ödediğiniz tutar ya da orandır. Muafiyet yükseldikçe prim genellikle düşer, ancak hasarda ceplerinizden çıkacak tutar artar.",
      },
      {
        q: "Hasarsızlık indirimi nedir?",
        a: "Poliçe döneminde hasar bildirmediğiniz yıllar için şirketlerin sunduğu prim indirimidir. İndirim oranı ve kademeleri şirkete göre değişir.",
      },
      {
        q: "Kaza olursa ne yapmalıyım?",
        a: "Güvenliği sağlayın, gerekirse 112'yi arayın, kaza tespit tutanağı düzenleyin ve fotoğraf çekin. Ardından hasarı en kısa sürede sigorta şirketine bildirin.",
      },
      {
        q: "Teklif almak için hangi bilgiler gerekir?",
        a: "Aracınızın marka, model ve model yılı, plakası ile iletişim bilgileriniz teklif için yeterlidir. Poliçeyi başlatırken danışmanımız ruhsat ve ehliyet gibi ek bilgileri ayrıca isteyebilir.",
      },
      {
        q: "Kasko teklifini Sofya ile mi alıyorum?",
        a: "Formu doldurduğunuzda anlaşmalı şirketlerin fiyatları kısa sürede listelenir. Sofya ise sorularınızı yanıtlar ve teminatları anlamanıza yardım eder. Poliçe işlemlerini danışmanlarımızla tamamlayabilirsiniz.",
      },
    ],
  },
  "trafik-sigortasi": TRAFFIC,
  imm: IMM,
  "konut-sigortasi": HOME,
  dask: DASK,
  "seyahat-sigortasi": TRAVEL,
  "tamamlayici-saglik": HEALTH,
  "ferdi-kaza": ACCIDENT,
};
