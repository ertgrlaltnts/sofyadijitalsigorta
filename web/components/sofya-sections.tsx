import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { CONTACT } from "@/lib/content";
import type { CoverIcon } from "@/lib/product-pages";
import { AskButton } from "./ask-button";
import { Glyph } from "./glyph";
import { ArrowRightIcon, CheckIcon, WhatsAppIcon } from "./icons";
import { Reveal } from "./reveal";
import { H2, WRAP, toneClass, type Tone } from "./sections";
import { SpotlightCard } from "./spotlight-card";

function Block({ id, tone, children }: { id: string; tone: Tone; children: ReactNode }) {
  return (
    <section id={id} className={`on-light ${toneClass(tone)} scroll-mt-28 py-20 text-ink lg:scroll-mt-16 lg:py-28`}>
      {children}
    </section>
  );
}

// Kept around the edges of the picture, never over her face (face is in the top third, centered).
const BUBBLES = [
  { text: "Merhaba, ben Sofya 👋", className: "top-[2%] left-0 sm:top-[6%] sm:-left-2", fd: "0s", fdur: "7s" },
  { text: "Nasıl yardımcı olabilirim?", className: "top-[44%] -left-1 sm:top-[40%] sm:-left-6", fd: "-2s", fdur: "8s" },
  { text: "Aklınıza takılanı sorun", className: "top-[58%] -right-1 sm:top-[50%] sm:-right-6", fd: "-4s", fdur: "7.5s" },
  { text: "Birlikte netleştirelim", className: "bottom-[8%] left-0 sm:bottom-[14%] sm:-left-2", fd: "-1s", fdur: "6.5s" },
];

/** Sofya waving in the hero, ringed in gold, with chat bubbles around her. */
export function SofyaVisual() {
  const bubble =
    "bubble-float absolute z-10 rounded-xl border border-white/15 bg-white/10 px-2.5 py-1.5 text-[0.6875rem] leading-tight font-medium text-white shadow-[0_14px_30px_-14px_rgba(0,0,0,0.6)] backdrop-blur-md sm:rounded-2xl sm:px-4 sm:py-2.5 sm:text-[0.9375rem]";
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[30rem] lg:max-w-none">
      <div aria-hidden className="absolute inset-[7%] rounded-full bg-gradient-to-b from-gold/25 via-gold/10 to-transparent" />
      <div aria-hidden className="absolute inset-[7%] rounded-full ring-1 ring-gold/50" />
      <div aria-hidden className="absolute inset-[1%] rounded-full border border-dashed border-white/15" />
      <Image
        src="/sofya-hello.png"
        alt="Sofya, yapay zeka sigorta asistanı"
        width={1600}
        height={1600}
        priority
        quality={90}
        sizes="(min-width: 1024px) 520px, 90vw"
        className="absolute inset-0 size-full object-contain [mask-image:linear-gradient(to_bottom,black_86%,transparent)]"
      />
      {BUBBLES.map((item) => (
        <p key={item.text} className={`${bubble} ${item.className}`} style={{ "--fd": item.fd, "--fdur": item.fdur } as CSSProperties}>
          {item.text}
        </p>
      ))}
    </div>
  );
}

const CAPABILITIES: { icon: CoverIcon; title: string; body: string }[] = [
  {
    icon: "document",
    title: "Sigorta sorularınızı yanıtlar",
    body: "Kasko, trafik, DASK, konut, sağlık, seyahat ve daha fazlası. Aklınıza takılanı kendi cümlelerinizle sorun.",
  },
  {
    icon: "key",
    title: "Terimleri sadeleştirir",
    body: "Muafiyet, teminat, limit, prim... Poliçedeki zor kelimeleri herkesin anlayacağı bir dille anlatır.",
  },
  {
    icon: "scale",
    title: "İhtiyacınıza göre yönlendirir",
    body: "Hangi sigortaya ihtiyacınız olduğundan emin değilseniz anlatın, seçenekleri ve farklarını birlikte değerlendirsin.",
  },
  {
    icon: "swap",
    title: "Sizi teklife götürür",
    body: "Hazır olduğunuzda sizi teklif sayfasına ya da doğrudan danışmanımıza yönlendirir.",
  },
  {
    icon: "clock",
    title: "7/24 yanıt verir",
    body: "Gece, hafta sonu ya da tatilde de fark etmez. Sorunuzu aklınıza geldiği an sorabilirsiniz.",
  },
  {
    icon: "users",
    title: "Gerektiğinde danışmana bağlar",
    body: "Kesin fiyat ve poliçe işlemleri için sizi uzman danışmanlarımıza yönlendirir.",
  },
];

export function Capabilities() {
  return (
    <Block id="ne-yapar" tone="white">
      <div className={WRAP}>
        <Reveal>
          <h2 className={`${H2} max-w-3xl`}>Sofya ne işe yarar?</h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Sigortayı anlamak için uzman olmanız gerekmez. Sofya, sizinle sohbet ederek doğru bilgiye ulaşmanızı kolaylaştırır.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((item, i) => (
            <li key={item.title} className="flex">
              <Reveal delay={(i % 3) * 90} className="flex w-full">
                <SpotlightCard className="group relative flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] border border-ink/10 bg-pearl p-7 transition-[translate,scale,rotate,transform,box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-gold hover:bg-white hover:shadow-[0_34px_50px_-34px_rgba(15,26,48,0.45)]">
                  <span aria-hidden className="spot pointer-events-none absolute inset-0" />
                  <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                    <span className="card-shine absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-gold via-gold-hi to-gold transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                  />
                  <span className="tile-icon relative grid size-16 place-items-center rounded-full bg-gold/20 ring-1 ring-gold/50">
                    <span aria-hidden className="ripple" />
                    <span aria-hidden className="ripple ripple-late" />
                    <span className="icon-hop relative grid place-items-center">
                      <Glyph name={item.icon} className="size-8 text-gold-deep" />
                    </span>
                  </span>
                  <h3 className="relative mt-6 text-xl font-semibold tracking-tight">{item.title}</h3>
                  <p className="relative mt-2 leading-relaxed text-ink-soft">{item.body}</p>
                </SpotlightCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Block>
  );
}

const STEPS = [
  {
    title: "Sorunuzu anlar",
    body: "Mesajınızı okur. Takip sorularında önceki mesajınızı da hesaba katar, yani her seferinde baştan anlatmanız gerekmez.",
  },
  {
    title: "Bilgi tabanında arar",
    body: "Sorunuzla ilgili kaydı, şirketimizin hazırladığı sigorta bilgi tabanında bulur.",
  },
  {
    title: "Yanıtı kurar",
    body: "Kayıt varsa yanıtını ona dayandırır. Yoksa genel sigorta bilgisiyle yardımcı olur, ancak fiyat, kampanya ya da anlaşmalı şirket bilgisi uydurmaz.",
  },
  {
    title: "Sizi yönlendirir",
    body: "Gerektiğinde teklif sayfasına ya da danışmanımıza yönlendirir. Yanıtı beğenip beğenmediğinizi işaretleyebilirsiniz.",
  },
];

function Bubble({ from, children, delay }: { from: "user" | "bot"; children: ReactNode; delay: number }) {
  return (
    <Reveal delay={delay} variant={from === "user" ? "right" : "up"} className={`flex ${from === "user" ? "justify-end" : "justify-start"}`}>
      {from === "user" ? (
        <p className="max-w-[85%] rounded-[1.25rem] rounded-br-md bg-pearl px-4 py-2.5 text-[0.9375rem] font-medium text-ink">{children}</p>
      ) : (
        <div className="max-w-[90%]">
          <p className="rounded-[1.25rem] rounded-bl-md bg-white/10 px-4 py-3 text-[0.9375rem] leading-relaxed text-white ring-1 ring-white/10">{children}</p>
          <span className="mt-1.5 ml-1 inline-flex items-center gap-1.5 text-[0.75rem] text-gold/80">
            <CheckIcon className="size-3" strokeWidth={2.6} />
            Sofya bilgi tabanından
          </span>
        </div>
      )}
    </Reveal>
  );
}

export function HowItWorks() {
  return (
    <Block id="nasil" tone="gray">
      <div className={`${WRAP} grid gap-14 lg:grid-cols-[6fr_5fr] lg:items-center lg:gap-20`}>
        <div>
          <Reveal>
            <h2 className={H2}>Bir soruyu nasıl yanıtlar?</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              Sofya tahmin yürütmez. Önce şirketimizin hazırladığı bilgilere bakar, sonra size anlayacağınız bir dille anlatır.
            </p>
          </Reveal>

          <ol className="mt-10 space-y-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative flex gap-5">
                {i < STEPS.length - 1 && <span aria-hidden className="absolute top-12 -bottom-8 left-[1.1875rem] w-px bg-gradient-to-b from-gold to-gold/10" />}
                <Reveal delay={i * 120} className="flex gap-5">
                  <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-ink font-display text-xl text-gold ring-4 ring-pearl">{i + 1}</span>
                  <div className="pt-1">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-1 leading-relaxed text-ink-soft">{step.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal delay={200}>
            <p className="mt-10 rounded-2xl border border-gold/40 bg-gold/10 p-5 leading-relaxed text-ink">
              <strong className="font-semibold">Her gün daha iyi.</strong> Sofya&apos;nın yanıtlayamadığı sorular ekibimize iletilir. Bu sorular bilgi
              tabanına eklendikçe Sofya aynı soruya bir sonraki sefer daha iyi yanıt verir.
            </p>
          </Reveal>
        </div>

        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-night p-6 text-pearl shadow-[0_50px_90px_-50px_rgba(11,19,34,0.9)] sm:p-8">
            <div aria-hidden className="pointer-events-none absolute -top-24 -left-20 size-80 rounded-full bg-gold/20 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -right-24 -bottom-24 size-80 rounded-full bg-[#345496]/40 blur-3xl" />

            <div className="relative flex items-center gap-3 border-b border-white/10 pb-5">
              <span className="relative size-11 overflow-hidden rounded-full bg-white ring-2 ring-gold/60">
                <Image src="/sofya-avatar.png" alt="" fill sizes="44px" quality={90} className="object-cover" />
              </span>
              <div>
                <p className="font-semibold text-white">Sofya</p>
                <p className="mt-0.5 flex items-center gap-2 text-[0.8125rem] text-pearl/60">
                  <span className="size-2 rounded-full bg-online shadow-[0_0_0_4px_rgba(46,229,106,0.14)]" />
                  Çevrimiçi, 7/24 yanıt verir
                </p>
              </div>
            </div>

            <div className="relative mt-6 space-y-4">
              <Bubble from="user" delay={100}>
                DASK eşyalarımı da kapsar mı?
              </Bubble>
              <Bubble from="bot" delay={500}>
                Hayır. DASK yalnızca binayı güvence altına alır. Evin içindeki eşyalar için konut sigortası gerekir.
              </Bubble>
              <Bubble from="user" delay={900}>
                Kiracıyım, bana ne gerekir?
              </Bubble>
              <Bubble from="bot" delay={1300}>
                DASK&apos;ı ev sahibiniz yaptırır. Kendi eşyalarınız için eşya sigortası yaptırabilirsiniz.
              </Bubble>
              <Reveal delay={1700} className="flex justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-3 ring-1 ring-white/10" aria-hidden>
                  <span className="size-1.5 animate-pulse rounded-full bg-gold" />
                  <span className="size-1.5 animate-pulse rounded-full bg-gold [animation-delay:0.2s]" />
                  <span className="size-1.5 animate-pulse rounded-full bg-gold [animation-delay:0.4s]" />
                </span>
              </Reveal>
            </div>

            <AskButton className="group relative mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold px-6 text-[0.9375rem] font-semibold text-night transition-colors hover:bg-gold-hi">
              Siz de deneyin
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
            </AskButton>
          </div>
        </Reveal>
      </div>
    </Block>
  );
}

const PRINCIPLES: { icon: CoverIcon; title: string; body: string }[] = [
  {
    icon: "shieldCheck",
    title: "Uydurmaz",
    body: "Bilmediği konuda fiyat, kampanya ya da anlaşmalı şirket bilgisi icat etmez. Kesin bilgi için sizi danışmanımıza yönlendirir.",
  },
  {
    icon: "lock",
    title: "Hassas bilgileri maskeler",
    body: "TC kimlik no, kart no, IBAN ve telefon yazsanız bile bu bilgiler kaydedilmeden ve yapay zekaya gönderilmeden önce gizlenir.",
  },
  {
    icon: "globe",
    title: "IP adresinizi saklamaz",
    body: "IP adresiniz ham olarak tutulmaz. Kötüye kullanımı önlemek için yalnızca geri döndürülemeyen bir özet saklanır.",
  },
  {
    icon: "alert",
    title: "Sigortada kalır",
    body: "Sigorta ve platform dışındaki konulara girmez. Sohbeti her zaman size yardımcı olabileceği alanda tutar.",
  },
];

export function Guarantees() {
  return (
    <Block id="guvence" tone="white">
      <div className={`${WRAP} grid items-center gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20`}>
        <Reveal variant="scale" className="order-2 lg:order-1">
          <div className="relative mx-auto aspect-square w-full max-w-[28rem]">
            <div aria-hidden className="absolute inset-[6%] rounded-full bg-gradient-to-b from-gold/35 via-gold/15 to-transparent" />
            <div aria-hidden className="absolute inset-[6%] rounded-full ring-1 ring-gold/50" />
            <div aria-hidden className="absolute inset-[-1%] rounded-full border border-dashed border-ink/15" />
            <Image
              src="/sofya-master.png"
              alt="Sofya"
              width={1600}
              height={1600}
              quality={90}
              sizes="(min-width: 1024px) 448px, 90vw"
              className="absolute inset-0 size-full object-contain [mask-image:linear-gradient(to_bottom,black_82%,transparent)]"
            />
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <h2 className={H2}>Güvenle konuşabileceğiniz bir asistan.</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              Sigorta kişisel bilgi demektir. Sofya&apos;yı, ihtiyaç duymadığı hiçbir bilgiyi tutmayacak ve bilmediği konuda sizi yanıltmayacak şekilde kurduk.
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((item, i) => (
              <li key={item.title} className="flex">
                <Reveal delay={i * 110} className="flex w-full">
                  <article className="w-full rounded-[1.5rem] border border-ink/10 bg-pearl p-6 transition-[translate,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-gold hover:shadow-[0_28px_40px_-28px_rgba(15,26,48,0.4)]">
                    <span className="grid size-12 place-items-center rounded-2xl bg-ink text-gold">
                      <Glyph name={item.icon} className="size-6" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-ink-soft">{item.body}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Block>
  );
}

const QUESTION_GROUPS: { icon: CoverIcon; title: string; questions: string[] }[] = [
  {
    icon: "car",
    title: "Aracınız için",
    questions: ["Kasko ile trafik sigortası arasındaki fark nedir?", "Muafiyet ne demek?", "Kaza olursa ne yapmalıyım?"],
  },
  {
    icon: "home",
    title: "Eviniz için",
    questions: ["DASK eşyalarımı da kapsar mı?", "Kiracıyım, konut sigortası yaptırabilir miyim?", "Konut sigortası neleri kapsar?"],
  },
  {
    icon: "heart",
    title: "Sağlığınız ve seyahatiniz için",
    questions: ["Tamamlayıcı sağlık sigortası nedir?", "Vize için seyahat sigortası gerekir mi?", "Ferdi kaza sigortası kimler için uygun?"],
  },
];

export function Examples() {
  return (
    <Block id="sorular" tone="gray">
      <div className={WRAP}>
        <Reveal>
          <h2 className={`${H2} max-w-3xl`}>Sofya&apos;ya neler sorabilirsiniz?</h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Aklınıza gelen her sigorta sorusu olur. İşte başlamak için birkaç fikir. Birine dokunun, Sofya hemen yanıtlasın.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-5 lg:grid-cols-3">
          {QUESTION_GROUPS.map((group, i) => (
            <li key={group.title} className="flex">
              <Reveal delay={i * 120} className="flex w-full">
                <article className="w-full rounded-[1.75rem] border border-ink/10 bg-white p-7">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-full bg-gold/20 text-gold-deep ring-1 ring-gold/50">
                      <Glyph name={group.icon} className="size-6" />
                    </span>
                    <h3 className="text-lg font-semibold">{group.title}</h3>
                  </div>
                  <ul className="mt-6 space-y-2.5">
                    {group.questions.map((question) => (
                      <li key={question}>
                        <AskButton
                          question={question}
                          className="group/q flex w-full items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-pearl px-4 py-3.5 text-left text-[0.9375rem] font-medium transition-colors duration-300 hover:border-gold hover:bg-gold/10"
                        >
                          {question}
                          <ArrowRightIcon className="size-4 shrink-0 text-gold-deep transition-transform group-hover/q:translate-x-1" />
                        </AskButton>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Block>
  );
}

const SOFYA_DOES = ["Sorularınızı anında yanıtlar", "Sigorta terimlerini sadeleştirir", "İhtiyacınıza uygun sigortayı bulmanıza yardım eder", "Sizi teklife ve danışmanımıza yönlendirir"];
const ADVISOR_DOES = ["Kesin fiyat ve teklif karşılaştırması yapar", "Poliçenizi düzenler ve yenilemenizi takip eder", "Hasar sürecinde size yol gösterir", "Size özel durumları değerlendirir"];

export function Handoff() {
  const list = (items: string[], icon: ReactNode) => (
    <ul className="mt-6 space-y-3.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 leading-relaxed">
          {icon}
          {item}
        </li>
      ))}
    </ul>
  );
  const tick = (
    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold/25 text-gold-ink">
      <CheckIcon className="size-3" strokeWidth={2.8} />
    </span>
  );

  return (
    <Block id="danisman" tone="white">
      <div className={WRAP}>
        <Reveal>
          <h2 className={`${H2} max-w-3xl`}>Sofya ve danışmanlarımız birlikte çalışır.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Sofya hızlı ve sade bilgi verir. Fiyat ve poliçe gibi bağlayıcı işlemleri ise uzman danışmanlarımız yürütür.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <article className="relative h-full overflow-hidden rounded-[1.75rem] border border-gold bg-white p-8 shadow-[0_34px_50px_-34px_rgba(15,26,48,0.45)] sm:p-10">
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-gold-hi to-gold" />
              <div className="flex items-center gap-4">
                <span className="relative size-14 overflow-hidden rounded-full bg-pearl ring-2 ring-gold/60">
                  <Image src="/sofya-avatar.png" alt="" fill sizes="56px" quality={90} className="object-cover" />
                </span>
                <h3 className="font-display text-[2rem] leading-none">Sofya</h3>
              </div>
              {list(SOFYA_DOES, tick)}
            </article>
          </Reveal>

          <Reveal delay={120}>
            <article className="relative h-full overflow-hidden rounded-[1.75rem] border border-ink/10 bg-pearl p-8 sm:p-10">
              <div className="flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-full bg-ink text-gold">
                  <Glyph name="users" className="size-7" />
                </span>
                <h3 className="font-display text-[2rem] leading-none">Danışmanlarımız</h3>
              </div>
              {list(ADVISOR_DOES, tick)}
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-ink-soft"
              >
                <WhatsAppIcon className="size-[1.125rem]" />
                Danışmana yazın
              </a>
            </article>
          </Reveal>
        </div>
      </div>
    </Block>
  );
}

export const SOFYA_FAQ = [
  {
    q: "Sofya gerçek bir kişi mi?",
    a: "Hayır. Sofya yapay zeka destekli bir sigorta asistanıdır. Sorularınızı yanıtlar ve sizi yönlendirir. Kesin fiyat ve poliçe işlemleri için uzman danışmanlarımızla da görüşebilirsiniz.",
  },
  {
    q: "Sofya hangi konularda yardımcı olur?",
    a: "Kasko, trafik, İMM, konut, DASK, seyahat, tamamlayıcı sağlık ve ferdi kaza sigortaları başta olmak üzere sigortayla ilgili sorularınızda yardımcı olur.",
  },
  {
    q: "Sofya'nın verdiği bilgi kesin mi?",
    a: "Sofya genel ve anlaşılır bilgi verir. Teminat, limit ve muafiyetler şirkete ve poliçeye göre değiştiği için kesin bilgi ve fiyat için poliçe şartlarına ve danışmanlarımıza başvurmalısınız.",
  },
  {
    q: "Kişisel bilgilerim güvende mi?",
    a: "TC kimlik, kart ya da IBAN gibi bilgileri yazmanız gerekmez. Yazsanız bile bu bilgiler kaydedilmeden ve yapay zekaya gönderilmeden önce maskelenir. IP adresiniz ham olarak saklanmaz.",
  },
  {
    q: "Sofya yanlış ya da eksik yanıt verirse ne olur?",
    a: "Yanıtın altındaki beğen ve beğenme düğmeleriyle bildirebilirsiniz. Yanıtlayamadığı sorular ekibimize iletilir ve bilgi tabanı bu sorular doğrultusunda geliştirilir.",
  },
  {
    q: "Sofya ile nasıl konuşurum?",
    a: "Anasayfadaki sohbet kutusundan ya da diğer sayfalarda sağ alttaki Sofya düğmesinden yazabilirsiniz. Ürün sayfalarındaki formdan doğrudan teklif de isteyebilirsiniz.",
  },
];
