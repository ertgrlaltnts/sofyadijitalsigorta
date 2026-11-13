# Yayına alma (Linux + pm2 + nginx)

Üç uygulama ayrı süreç olarak çalışır: **api** (NestJS, 4000) `apisf.sofyadijitalsigorta.com`, **web** (Next.js, 4001) `www.sofyadijitalsigorta.com` (`sofyadijitalsigorta.com` buraya yönlenir), **admin** (Next.js, 4002) `pnlsf.sofyadijitalsigorta.com` adresinde yayınlanır. Hepsinin önünde nginx ve HTTPS olmalı. MongoDB ayrı kurulur (docker-compose.yml geliştirme içindir; canlıda kimlik doğrulamalı bir Mongo kullanın).

Gereken: Node.js 22+ (24 önerilir), pm2, nginx, MongoDB.

## 1. Ortam dosyaları

**api/.env** (örnek: api/.env.example)
- `MONGODB_URI`: canlı veritabanı (kullanıcı/şifre ile).
- `JWT_SECRET`: uzun rastgele bir değer (`openssl rand -hex 48`).
- `OPENAI_API_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (güçlü, geliştirme şifresi değil).
- `CORS_ORIGINS=https://www.sofyadijitalsigorta.com,https://sofyadijitalsigorta.com,https://pnlsf.sofyadijitalsigorta.com`: yalnızca bu adresler API'yi tarayıcıdan çağırabilir. localhost kalmasın.
- `TRUST_PROXY=1`: nginx arkasında. Bunsuz tüm ziyaretçiler tek IP gibi görünür (hız sınırı ortak kovaya düşer).
- `IO_API_TOKEN` (2026-11-17'de sona erer, öncesinde yenileyin), `IO_FIRMA_KODU`, `IO_PROGRAM`, `IO_CHANNEL`.
- `QUOTE_PURCHASE_ENABLED=false` kalsın; kartla ödemeyi 2C ile test edip açın.

**web/.env.local** ve **admin/.env.local**
- Canlı değerler `web/.env.production` ve `admin/.env.production` dosyalarında hazır (`NEXT_PUBLIC_API_URL=https://apisf.sofyadijitalsigorta.com/api`, web için `NEXT_PUBLIC_SITE_URL=https://www.sofyadijitalsigorta.com`). `npm run build` bunları otomatik kullanır; yerel geliştirmede `.env.local` geçerlidir. İsteğe bağlı `GOOGLE_SITE_VERIFICATION`.
- `NEXT_PUBLIC_*` değerleri **build sırasında** koda gömülür. Değiştirirseniz yeniden build alın.

## 2. Build ve başlatma

```bash
cd api   && npm ci && npm run build && npm run seed   # seed yalnızca ilk kurulumda (admin ve örnek bilgi kayıtları)
cd ../web   && npm ci && npm run build
cd ../admin && npm ci && npm run build
cd .. && pm2 start ecosystem.config.cjs && pm2 save && pm2 startup
```

Güncelleme: `git pull`, ilgili klasörde `npm ci && npm run build`, sonra `pm2 reload sofya-api` (ya da `sofya-web`, `sofya-admin`).

## 3. nginx

Hazır ayar dosyası: **deploy/nginx-sofya.conf** (başında kurulum adımları var). DNS'te `sofyadijitalsigorta.com`, `www`, `apisf` ve `pnlsf` kayıtları sunucuyu göstermeli. Sertifikayı önce `certbot certonly` ile alın, sonra dosyayı `/etc/nginx/conf.d/sofya.conf` olarak kopyalayıp `nginx -t && systemctl reload nginx` çalıştırın.

- `sofyadijitalsigorta.com` kalıcı olarak `www`'ya yönlenir (sitenin canonical adresi www).
- `www` → 4001 (web), `pnlsf` → 4002 (admin), `apisf` → 4000 (api).
- API bloğunda **`proxy_buffering off`** şarttır; Sofya'nın yanıtı SSE ile akar, tamponlanırsa yanıt tek seferde gelir.
- `X-Forwarded-For` başlığı iletilir; API'de `TRUST_PROXY=1` bu yüzden gerekir.

## 4. Güvenlik listesi
- 4000, 4001, 4002 ve 27017 portları dışarıya **kapalı** olsun (yalnızca nginx 80/443). MongoDB'ye dışarıdan erişim olmasın.
- Admin panelini mümkünse IP kısıtlamasıyla ya da ek bir koruma (VPN, nginx basic auth) arkasına alın.
- `.env` dosyaları depoya girmemeli (.gitignore'da) ve sunucuda `chmod 600` olmalı.
- Kart ödemesi için sitenin HTTPS olması zorunludur (ödeme formu HTTPS dışında açılmaz).
- Kartlı ödemeyi açmadan önce: 3D Secure hesabı, yasal metinler (firma bilgileri: web/lib/legal.ts) ve 2C ile uçtan uca test.
- Düzenli MongoDB yedeği alın (`mongodump`).

## 5. Kontrol
```bash
curl https://apisf.sofyadijitalsigorta.com/api/chat/config   # JSON dönmeli
pm2 status && pm2 logs sofya-api --lines 50
```
