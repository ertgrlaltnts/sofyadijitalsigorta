# Yayına alma (Linux + pm2 + nginx)

Üç uygulama ayrı süreç olarak çalışır: **api** (NestJS, 4000) `apisf.sofyadijitalsigorta.com`, **web** (Next.js, 4001) `www.sofyadijitalsigorta.com` (`sofyadijitalsigorta.com` buraya yönlenir), **admin** (Next.js, 4002) `pnlsf.sofyadijitalsigorta.com` adresinde yayınlanır. Hepsinin önünde nginx ve HTTPS olmalı. MongoDB ayrı kurulur (docker-compose.yml geliştirme içindir; canlıda kimlik doğrulamalı bir Mongo kullanın).

Gereken: Node.js 22+ (24 önerilir), pm2, nginx, MongoDB.

## 1. Ortam dosyaları (depoyla gelir)

Canlı ayarlar depoda hazırdır; sunucuda elle dosya oluşturmanız gerekmez. **Depo mutlaka PRIVATE olmalı**, çünkü `api/.env.production` gizli bilgiler içerir.

| Dosya | İçeriği |
|---|---|
| `api/.env.production` | Mongo adresi, `JWT_SECRET`, admin e-posta/şifresi, IO token'ı, `CORS_ORIGINS`, `TRUST_PROXY=1`. `NODE_ENV=production` iken api bunu okur (pm2 bunu ayarlar). **OpenAI anahtarı burada yoktur.** |
| `api/.env` (yalnızca sunucuda, git'e girmez) | `OPENAI_API_KEY=...`. api önce bunu okur; aynı anahtar iki dosyada varsa buradaki geçerlidir. |
| `web/.env.production` | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL` (build sırasında koda gömülür) |
| `admin/.env.production` | `NEXT_PUBLIC_API_URL` |

Yerel geliştirmede api `api/.env`, web ve admin `.env.local` dosyalarını okur; bunlar git'e **girmez** ve sunucuya taşınmaz. Sunucuda `.env.local` oluşturmayın (build'de `.env.production`'ın üstüne yazar).

**OpenAI anahtarı depoya konmaz.** OpenAI, GitHub'a giden anahtarları otomatik iptal eder (`401 Your API key has been invalidated`). Anahtarı yalnızca sunucuda yazın:
```bash
cd ~/sofya_chat/api
echo 'OPENAI_API_KEY=sk-...' > .env && chmod 600 .env
```
Anahtarı değiştirince `pm2 restart sofya-api` çalıştırın. Seed sırasında anahtar geçersizse bilgi kayıtları `Başarısız` kalır; anahtarı düzeltince admin panelinde **Bilgi Tabanı → Tümünü yeniden indeksle** yeterlidir, seed'i tekrar çalıştırmayın.

Dikkat edilecekler:
- `MONGODB_URI` sunucudaki yerel MongoDB'yi (`mongodb://127.0.0.1:27017/sofya_chat`) gösterir. Kimlik doğrulamalı ya da başka bir Mongo kullanacaksanız bu satırı değiştirin. Mongo dışarıya kapalı olmalı.
- `QUOTE_PURCHASE_ENABLED=true`: kartlı ödeme açık. Kapatmak için `false` yapıp `pm2 restart sofya-api` çalıştırın.
- `IO_API_TOKEN` 2026-11-17'de sona erer; yenilenince `api/.env.production`'ı güncelleyip yeniden başlatın.
- Gizli bilgi değişirse (OpenAI anahtarı, token, şifre) dosyayı düzenleyip commit edin; eski değerler git geçmişinde kalır, o yüzden sızdırılmış bir anahtarı mutlaka yenileyin.
- Alan adı değişirse `web/.env.production`, `admin/.env.production` ve `api/.env.production` içindeki `CORS_ORIGINS` güncellenmeli, web ve admin yeniden build edilmelidir.

## 2. Kurulum, build ve başlatma

Sunucuda Node.js 22+ (24 önerilir), pm2, nginx ve MongoDB kurulu olmalı.

```bash
git clone <depo-adresi> sofya_chat && cd sofya_chat
echo 'OPENAI_API_KEY=sk-...' > api/.env && chmod 600 api/.env   # önce OpenAI anahtarınızı yazın (bkz. yukarısı)
(cd api   && npm ci && npm run build && NODE_ENV=production npm run seed)   # seed yalnızca ilk kurulumda: admin ve örnek bilgi kayıtları
(cd web   && npm ci && npm run build)
(cd admin && npm ci && npm run build)
pm2 start ecosystem.config.cjs && pm2 save && pm2 startup
```

Güncelleme: `git pull`, ilgili klasörde `npm ci && npm run build`, sonra `pm2 reload sofya-api` (ya da `sofya-web`, `sofya-admin`).

## 3. nginx

Hazır ayar dosyası: **deploy/nginx-sofya.conf** (başında kurulum adımları var). DNS'te `sofyadijitalsigorta.com`, `www`, `apisf` ve `pnlsf` kayıtları sunucuyu göstermeli. Sunucuda başka siteler nginx ile çalışıyorsa 80 portu doludur; bu yüzden `certbot --standalone` çalışmaz, dosyanın başındaki **webroot** adımlarını izleyin (nginx durmadan sertifika alınır). Sonra dosyayı `/etc/nginx/conf.d/sofya.conf` olarak kopyalayıp `nginx -t && systemctl reload nginx` çalıştırın.

- `sofyadijitalsigorta.com` kalıcı olarak `www`'ya yönlenir (sitenin canonical adresi www).
- `www` → 4001 (web), `pnlsf` → 4002 (admin), `apisf` → 4000 (api).
- API bloğunda **`proxy_buffering off`** şarttır; Sofya'nın yanıtı SSE ile akar, tamponlanırsa yanıt tek seferde gelir.
- `X-Forwarded-For` başlığı iletilir; API'de `TRUST_PROXY=1` bu yüzden gerekir.

## 4. Güvenlik listesi
- 4000, 4001, 4002 ve 27017 portları dışarıya **kapalı** olsun (yalnızca nginx 80/443). MongoDB'ye dışarıdan erişim olmasın.
- Admin panelini mümkünse IP kısıtlamasıyla ya da ek bir koruma (VPN, nginx basic auth) arkasına alın.
- GitHub deposu PRIVATE olmalı ve erişimi olan kişileri sınırlı tutun (`api/.env.production` gizli bilgi içerir). Sunucuda `chmod 600 api/.env.production` yapın.
- Kart ödemesi için sitenin HTTPS olması zorunludur (ödeme formu HTTPS dışında açılmaz).
- Kartlı ödeme açık: 3D Secure hesabı, yasal metinler (firma bilgileri: web/lib/legal.ts) ve 2C ile uçtan uca test.
- Düzenli MongoDB yedeği alın (`mongodump`).

## 5. Kontrol
```bash
curl https://apisf.sofyadijitalsigorta.com/api/chat/config   # JSON dönmeli
pm2 status && pm2 logs sofya-api --lines 50
```
