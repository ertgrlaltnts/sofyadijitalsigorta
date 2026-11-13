# Sofya AI — RAG Chat Backend + Admin Paneli

Sigorta teklif platformu Sofya AI için bilgi tabanına dayalı (RAG) bir chat asistanı ve onu yönetmek için bir admin paneli.

- **Bilgi tabanında yeterince benzer kayıt varsa** → yanıt o kayıtlara dayanır (`Bilgi Tabanı` kaynağı).
- **Yoksa** → OpenAI modeli sigorta alanında genel bilgi verir, firmaya özel fiyat/kampanya uydurmaz (`Genel` kaynağı) ve soru **Cevapsız Sorular**'a düşer.

```
sofya_chat/
├── api/                 # NestJS (Mongoose, JWT, SSE)
├── admin/               # Next.js admin paneli (App Router, Tailwind, shadcn/ui)
├── web/                 # Next.js public web sitesi: Sofya görseli + chat (port 4001)
├── docker-compose.yml   # Yerel MongoDB
└── README.md
```

## Gereksinimler

- Node.js 20+ (geliştirme Node 24 ile yapıldı) ve npm
- MongoDB — `docker compose up -d` ile ya da yerel kurulum
- OpenAI API anahtarı. **Embedding modeline erişimi olmalı** (aşağıdaki [OpenAI notları](#openai-notları)'na bakın)

## Kurulum ve çalıştırma

```bash
# 1) MongoDB (Docker kullanıyorsanız; yerel MongoDB varsa atlayın)
docker compose up -d

# 2) API
cd api
cp .env.example .env        # değerleri doldurun (aşağıya bakın)
npm install
npm run seed                # admin, kategoriler, ayarlar ve 10 örnek bilgi kaydı
npm run dev                 # http://localhost:4000/api

# 3) Admin paneli (ayrı terminal)
cd admin
cp .env.example .env.local
npm install
npm run dev                 # http://localhost:4002

# 4) Public web sitesi (ayrı terminal)
cd web
cp .env.example .env.local
npm install
npm run dev                 # http://localhost:4001
```

`web/` tarayıcıdan doğrudan API'nin public uçlarına (`/api/chat`, `/api/chat/config`) bağlanır. Bu yüzden `api/.env` içindeki `CORS_ORIGINS` değerine `http://localhost:4001` ve canlı alan adı eklenmelidir.

Panele `ADMIN_EMAIL` / `ADMIN_PASSWORD` ile giriş yapın. Seed, bilgi kayıtlarını OpenAI ile indeksler; embedding erişimi yoksa kayıtlar `Başarısız` durumunda kalır, erişim açılınca **Bilgi Tabanı → Tümünü yeniden indeksle** yeterlidir. Seed tekrar çalıştırılabilir (mevcut kayıtlara dokunmaz).

### Ortam değişkenleri

`api/.env`

| Değişken | Açıklama |
|---|---|
| `PORT` | API portu (varsayılan `4000`) |
| `MONGODB_URI` | MongoDB bağlantısı |
| `JWT_SECRET` | JWT imza anahtarı (uzun ve rastgele olmalı). IP hash'inde de tuz olarak kullanılır |
| `JWT_EXPIRES_IN` | Token ömrü (varsayılan `7d`) |
| `OPENAI_API_KEY` | OpenAI anahtarı — **yalnızca sunucuda** durur, frontend'e gitmez |
| `OPENAI_CHAT_MODEL` | Sohbet modeli. Boşsa `gpt-4o-mini`. Panelden Ayarlar → Model ile ezilebilir |
| `OPENAI_EMBEDDING_MODEL` | Embedding modeli (varsayılan `text-embedding-3-small`) |
| `CORS_ORIGINS` | Virgülle ayrılmış izinli origin listesi |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Seed ile oluşturulan ilk admin |

`admin/.env.local`

| Değişken | Açıklama |
|---|---|
| `NEXT_PUBLIC_API_URL` | API adresi (varsayılan `http://localhost:4000/api`). Yalnızca Next sunucusu kullanır, tarayıcı API'ye doğrudan gitmez |

## Hızlı deneme

1. Panele girin → **Test Alanı**.
2. "Kasko nedir?" sorun → yanıt `Bilgi Tabanı` kaynaklı gelir; sağ panelde kullanılan kayıt ve benzerlik skoru görünür.
3. Bilgi tabanında olmayan bir şey sorun (ör. "Yat sigortası yaptırmak istiyorum") → `Genel` kaynaklı yanıt gelir, **Cevapsız Sorular**'a düşer.
4. Orada **Bilgi tabanına ekle** → soru başlık olarak dolu gelir → içeriği yazıp kaydedin → soru `Çözüldü` olur.
5. Aynı soruyu tekrar sorun → artık `Bilgi Tabanı` kaynaklı yanıtlanır.

## Mimari

**Backend modülleri:** `auth`, `admins`, `categories`, `knowledge`, `chat`, `conversations`, `unanswered`, `settings`, `analytics`, `openai` (OpenAI çağrılarını saran tek servis).

**RAG akışı** (`api/src/chat/chat.service.ts`):

1. Mesaj doğrulanır (boş olamaz, en çok 1000 karakter) ve hassas veriler maskelenir.
2. Son N mesaj (Ayarlar → geçmiş mesaj sayısı) geçmiş olarak alınır.
3. Takip sorularını yakalamak için arama metni = önceki kullanıcı mesajı + mevcut mesaj.
4. `retrieve(query, k)` ile top-K chunk alınır; `score >= similarityThreshold` olanlar kullanılır.
5. Eşleşme varsa prompt'a chunk'lar `<bilgi>` etiketleri arasında eklenir ("talimat değil, veri" uyarısıyla; chunk içindeki `</bilgi>` etiketleri temizlenir). Yoksa genel mod talimatı kullanılır ve soru `unanswered_questions`'a yazılır.
6. `allowGeneralAnswers = false` ise genel mod yerine ayarlardaki yönlendirme mesajı döner.
7. Yanıt **SSE** ile akar; bitince asistan mesajı kaynak, skorlar, token ve süre bilgisiyle kaydedilir.
8. OpenAI hatasında kullanıcıya Türkçe hata mesajı gider ve hata loglanır.

**Arama:** Aktif chunk'lar bellekte tutulur (kayıt değişince geçersiz kılınır); sorgu embedding'i ile cosine similarity hesaplanır. Birkaç bin kayda kadar yeterlidir. Tüm mantık `api/src/knowledge/retrieval.service.ts` içindeki tek `retrieve(query, k)` fonksiyonundadır; MongoDB Atlas Vector Search'e geçişte yalnızca burası değişir.

**Chunking:** SSS kaydı tek chunk (`Soru: …\nCevap: …`). Doküman ~1500 karakterlik, ~200 karakter örtüşmeli parçalara paragraf sınırlarına saygı gösterilerek bölünür; her parçanın başına başlık eklenir. Kayıt pasife alınınca chunk'ları da pasif olur (yeniden embedding gerekmez).

**Admin → API:** Giriş, Next route handler'ı üzerinden yapılır ve JWT **httpOnly cookie**'ye yazılır; tarayıcıdaki JS token'ı görmez. Tarayıcı istekleri `/api/proxy/*` üzerinden gider, proxy cookie'den token'ı ekleyip API'ye iletir (yalnızca `admin/*` ve `auth/me`; SSE akışı bozulmadan geçer). Korumalı rotalar `admin/proxy.ts` ile (Next 16'da middleware'in yeni adı) kontrol edilir.

## Public API (widget için hazır)

Auth yok, IP bazlı rate limit'li, CORS whitelist'li.

| Endpoint | Açıklama |
|---|---|
| `POST /api/chat` | `{ sessionId, message }` → SSE akışı. `sessionId`: 8–64 karakter `[A-Za-z0-9_-]` |
| `POST /api/chat/feedback` | `{ messageId, feedback: "up" \| "down" \| null }` → 204 |
| `GET /api/chat/config` | Asistan adı, karşılama mesajı, öneri soruları (gizli ayar dönmez) |

`POST /api/chat` olayları: `meta` (`source`, `sources`) → `delta` (`text`) × N → `done` (`messageId`) ya da `error` (`message`). `messageId`, feedback göndermek için kullanılır. Limit: dakikada 20 mesaj/IP.

Admin uçları (`/api/admin/*`, JWT gerekli): `knowledge`, `categories`, `conversations`, `unanswered`, `playground`, `settings`, `analytics/overview`, `admins`; ayrıca `POST /api/auth/login`, `GET /api/auth/me`.

Hatalar tutarlı biçimdedir: `{ statusCode, message, path, timestamp }`; doğrulama hatalarında ek olarak `fieldErrors: { alan: mesaj }`.

## Teklif API'si (sekiz ürün)

Web formu gerçek fiyatları IO teklif API'sinden (`IO_API_URL`) alır. IO token'ı yalnızca `api/.env` içinde durur; tarayıcı yalnızca bu uçlara konuşur. `IO_API_TOKEN` boşsa uçlar 503 döner, API yine açılır.

| Endpoint | Açıklama |
|---|---|
| `POST /api/quotes` | `{ product, tckn, birthDate, phone, consent, ... }` → Mernis doğrulaması, IO teklifi açılır. `product`: `health` (18), `accident` (13), `traffic` (0), `kasko` (1), `imm` (22), `dask` (2), `home` (4), `travel` (6); ürüne göre `health`, `accident`, `vehicle`, `profession`, `imm`, `dask`, `home` ya da `travel` bloğu eklenir. `{ id }` döner; araç plaka/ruhsatla bulunamazsa (IO hata kodu 14/17) `{ needsVehicle: true, vehicle }` döner ve form araç bilgilerini elle ister. Dakikada 5 istek/IP |
| `GET /api/quotes/ref/:kind` | Form listeleri, önbellekli: `provinces`, `countries?scope=A|T`, `brands`, `models?brand=&year=`, `professions`, `usage-types`, `usage-styles?kt=`, `address?step=Ilce|Semt|Mahalle|Cadde|Bina|Daire&value=` (UAVT zinciri; dairenin `extra` alanı 10 haneli adres kodudur). Parametreler doğrulanır, tarayıcı IO'ya hiç bağlanmaz |
| `GET /api/quotes/companies` | Transfer adımındaki "önceki şirket" listesi (`[{ code, name }]`). IO yanıtındaki hassas alanlar süzülür, 1 saat önbelleğe alınır |
| `GET /api/quotes/:id` | `{ status: "running" | "done", offers[], progress }`. Frontend 4 sn'de bir sorar; en düşük fiyat önce gelir. Hata veren/primsiz şirketler listelenmez |

`quotes` koleksiyonu yalnızca IO teklif no'sunu, maskeli TCKN'yi (`502******14`) ve onay zamanını tutar; 90 gün sonra silinir. Telefon ve ad saklanmaz. Hatalar tutarlı gövdeyle döner; iç içe doğrulama hataları `fieldErrors["health.height"]` biçimindedir.

Sitenin kendi formuyla aynı alanlar gönderilir. Sağlık: `cover`, `visits`, `network` (0 dar, 1 standart, 2 kapsamlı), `birthCover`, `payment` (`P`/`3`/`6`/`9`), `height`, `weight`, isteğe bağlı `transfer` (önceki şirket, acente no, poliçe no, bitiş tarihi). Ferdi kaza: `coverage`, `treatment`, `earthquake`, `assistance`, `payment` (`P`/`V`). Her teklifin teminat listesi şirketin kendi `primler` kartından gelir.

Teklifler para birimine göre gruplanır (seyahatte bazı şirketler EUR, bazıları ₺ verir); "en uygun" yalnızca aynı para biriminde işaretlenir. Teminat metni olarak IO'nun `Aciklama` alanı kullanılır, çünkü `Deger` bazı şirketlerde iç koddur ("40", "E"). Ferdi kaza vefat bedeli kodları: `3`=50.000 ₺, `5`=250.000, `7`=500.000, `9`=1.000.000, `11`=2.000.000, `13`=5.000.000.

### Sohbette teklif

Sofya sohbet içinden de teklif aldırır; formdaki aynı adımlar sohbet kartı olarak gelir.

- **Tetikleme sunucudadır** (`api/src/chat/quote-intent.ts`), LLM'e bırakılmaz. Bir ürün hakkındaki soru yanıtlandıktan sonra `suggest` olayı (`kind: "offer"`) gelir ve arayüz "Tekliflere göz atmak ister misiniz?" diye sorar. İki ürünü karşılaştıran sorulara öneri yapılmaz; aynı ürün bir sohbette iki kez önerilmez.
- **Teklif talebi** ("kasko teklifi almak istiyorum", "ne kadar tutar?") modele hiç gitmez: sabit bir yanıt ve `kind: "start"` ile form açılır. Ürün söylenmediyse `kind: "pick"` ile ürün seçtirilir. Teklif API'si (`IO_API_TOKEN`) yapılandırılmamışsa bu davranışların hiçbiri devreye girmez.
- **Kişisel veriler sohbetten geçmez.** TC kimlik, doğum tarihi, telefon ve kart bilgisi sohbet kartındaki formla doğrudan `/api/quotes` uçlarına gider; OpenAI'a ve sohbet geçmişine girmez (sistem istemi de sohbette bu verileri istememeyi söyler).
- Bekleme sırasında kullanıcı üç aşamayı görür: "Bilgileriniz kontrol ediliyor" → "Şirketlerden teklifler bekleniyor (n/m şirket yanıt verdi)" → "Teklifler hazır".
- **Yüzen sohbet her sayfada, ana sayfa dahil:** ana sayfa üstündeki sohbet (`mode="launcher"`) kendi konuşmasını tutmaz; yazılan ya da seçilen mesajı `sofya:ask` olayıyla yüzen sohbete verir, o açılır ve konuşmayı sürdürür. "Sofya'ya sor" düğmeleri de aynı şekilde yüzen sohbeti açar.
- Admin Test Alanı aynı servisi kullanır: orada da teklif talebi içeren mesajlar modele gitmeden sabit yanıtla karşılanır.

### Kartla ödeme

Ödeme **varsayılan olarak kapalıdır** (`QUOTE_PURCHASE_ENABLED=false`); kapalıyken "Bu teklifle devam et" WhatsApp'a gider. Açılınca ödeme sitede alınır. Poliçe kesmek ve karttan çekim yapmak gerçek sonuç doğurur: önce 2C ile test kartı/ortamı konuşulmadan açmayın.

| Endpoint | Açıklama |
|---|---|
| `GET /api/quotes/payment-config` | `{ enabled, threeDSecure }`. `threeDSecure` IO profilindeki `Yetki.Guvenlik3D`'den gelir; true ise tarayıcı banka penceresini tıklamada açar |
| `POST /api/quotes/:id/purchase` | Kart bilgisi + `offerId` → `issued | threeds | declined | unknown`. Dakikada 6 istek/IP |
| `GET /api/quotes/:id/purchase/status` | 3D Secure sırasında banka onayını sorar (`waiting | approved | issued | failed`) |
| `GET /api/quotes/:id/documents/:kind` | `policy` ya da `receipt`: kesilmiş poliçe için PDF adresi |

Güvenlik kuralları: tutar tarayıcıdan alınmaz, sunucu teklifin kendi fiyat kartındaki primi öder; bir teklifte aynı anda tek ödeme çalışır (`processing` kilidi); IO'ya giden istek yanıt vermezse durum `unknown` olur ve teklif yeni denemeye kapanır (kart iki kez çekilmesin diye); kart verisi veritabanına ve loglara yazılmaz, yalnızca bellekte IO'ya iletilir. Bu, API sunucusunu kart verisinin geçtiği sistem yapar (PCI DSS kapsamı); canlıda yalnızca HTTPS kullanın.

## KVKK ve güvenlik

- Kullanıcı mesajındaki **TCKN (algoritma kontrollü), kart no (Luhn kontrollü), IBAN ve telefon** numaraları veritabanına yazılmadan ve OpenAI'a gönderilmeden önce maskelenir (`[TC KİMLİK NO]`, `[KART NO]`, `[IBAN]`, `[TELEFON]`). Asistanın sistem promptu hassas veri istememesini söyler.
- IP ham olarak saklanmaz; `sha256(JWT_SECRET:ip)` ile hash'lenir.
- `helmet`, global `ValidationPipe` (whitelist), CORS whitelist, giriş ucunda ayrı rate limit, bcrypt ile şifre saklama.
- OpenAI anahtarı hiçbir zaman frontend'e gönderilmez.

## Testler

```bash
cd api && npm test       # chunking, PII maskeleme ve RAG akış dalları (stub'larla)
npm run lint             # api
cd ../admin && npm run lint && npx tsc --noEmit
```

## OpenAI notları

- **Embedding erişimi şarttır.** Anahtarınızın projesi embedding modeline (varsayılan `text-embedding-3-small`) erişemiyorsa kayıtlar indekslenemez; panel `Başarısız` + hata mesajı gösterir. Sohbet bu durumda çökmez: arama başarısız olursa genel moda düşer (ve soruyu cevapsız listesine yazmaz).
- Embedding modelini değiştirirseniz **mutlaka "Tümünü yeniden indeksle"** çalıştırın; farklı modellerin vektörleri birbiriyle karşılaştırılamaz.
- Bazı modeller (ör. akıl yürütme modelleri) `temperature` için yalnızca varsayılan değeri kabul eder. Servis bunu ilk reddedilişte algılayıp o model için temperature'sız çağırır; Ayarlar'daki temperature bu modellerde etkisiz kalır.
- **Benzerlik eşiği (varsayılan 0.45):** Kısa bir soru, "Soru + Cevap" chunk'ına düşük benzer çıkar. `text-embedding-3-large` ile ölçülen: doğru eşleşmeler 0.50–0.70 ("tss nedir" 0.50), ilgisiz sorular ≤0.26, kayıt olmayan ama yakın konular ~0.42. 0.75 doğru eşleşmeleri de eler. Model değişirse skor dağılımı değişir; Test Alanı'ndaki skorlara bakarak Ayarlar'dan yeniden ayarlayın.

## Varsayılan kararlar

- **Dashboard**, varsayılan olarak yalnızca `web` kanalı sohbetlerini sayar; sağ üstteki anahtarla Test Alanı sohbetleri dahil edilir. Günlük kırılımlar `Europe/Istanbul` saat dilimindedir.
- **Cevapsız soru:** Soru küçük harfe (tr) çevrilip noktalama temizlenerek tekilleştirilir. Çözülmüş bir soru bilgi tabanı tekrar yanıtlayamazsa yeniden açılır; yoksayılan sorular yoksayılmış kalır.
- **Kategori silme:** Kayıt bağlıysa engellenir (önce kayıtlar taşınmalı). Kategori sıralaması sürükle-bırak yerine yukarı/aşağı oklarıyla yapılır.
- **PDF yükleme:** Metin tabanlı PDF'lerden metin çıkarılır; taranmış (görüntü) PDF'ler desteklenmez. Dosya sınırı 5 MB.
- **Yönetici hesabı:** Tek rol vardır. Kendi hesabınızı pasife alamazsınız.
- **Next.js 16:** `cacheComponents` kapatıldı (giriş arkasındaki dinamik bir panelde gerekmiyor). shadcn/ui bu sürümde Radix yerine Base UI kullanır.

## Üretim notları

- `JWT_SECRET`'ı güçlü bir değerle değiştirin; `.env` dosyalarını sürüm kontrolüne eklemeyin.
- Ters proxy arkasında çalışıyorsanız rate limit'in doğru IP'yi görmesi için NestJS'te `trust proxy` ayarını açın.
- HTTPS üzerinde admin oturum cookie'si otomatik `Secure` olur (isteğin protokolüne göre).
- `CORS_ORIGINS`'e widget'ın yayınlanacağı origin'leri ekleyin.

## Sonraki aşama (mimari buna hazır)

- Web sitesine gömülebilir chat widget'ı (public API hazır)
- Chat içinden teklif talebi toplama (yeni bir `quote-requests` modülü ve admin sayfası)
- MongoDB Atlas Vector Search'e geçiş (yalnızca `retrieve` fonksiyonu değişir)
