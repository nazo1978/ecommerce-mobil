
# 🛍️ E-Ticaret Platformu - PRD.md

## 1. 📌 Proje Özeti
Çok platformlu (web, iOS, Android) destekli bir e-ticaret sistemi geliştirilecektir. Satış, çekiliş, açık artırma, satıcı yönetimi ve MLM özellikleri barındırır. Gelişmiş Admin Paneli üzerinden tüm sistem merkezi olarak yönetilir.

---

## 2. 🚀 Kullanılacak Teknolojiler

### Frontend
- **Next.js 15** (App Router)
- **React 19** (Web & Mobile)
- **Expo SDK** (iOS & Android)
- **TailwindCSS** + **shadcn/ui**
- **Zustand** (State)
- **Clerk.dev** (Auth)

### Backend / CMS
- **Sanity.io** (CMS)
- **Server Actions** (Next.js)
- **Zod** (Validation)
- **Clean Architecture** (Core, Entity, Business, API)

---

## 3. 👥 Kullanıcı Rolleri

| Rol | Yetkiler |
|-----|----------|
| Ziyaretçi | Ürün görüntüleme |
| Müşteri | Sipariş, çekiliş, açık artırma, MLM |
| Satıcı | Ürün, çekiliş, açık artırma oluşturma |
| Admin | Tüm sistemi yönetme, dashboard erişimi kontrolü |

---

## 4. 📦 Modüller

### ✅ Temel
- Ürün Listeleme & Detay
- Sepet ve Sipariş
- Ödeme (Stripe / Iyzico)

### 🎁 Çekiliş
- Ürün çekilişi başlatma / katılma
- Zamanlı, random kazanan seçimi

### 🏷️ Açık Artırma
- Teklif verme
- Zamanlı kapanış
- Canlı teklif sıralaması

### 🛍️ Satıcı Paneli
- Ürün Ekle / Yönet
- Sipariş Görüntüleme
- Açık artırma & çekiliş başlatma

### 🧑‍💼 Admin Panel
- Kullanıcı ve rol yönetimi
- Satıcı onayı, ürün onayı
- Çekiliş / açık artırma kontrolü
- MLM kazanç sınırları

### 🔗 MLM Sistemi
- Referans kodu tanımlama
- Alt kullanıcılar üzerinden kazanç
- 3 seviye referral
- Admin’den seviye bazlı oran tanımı

---

## 5. 🧭 Dashboard Yetki Sınırları

### 🧑 Kullanıcı
- Sipariş, çekiliş, teklif geçmişi
- Referans geçmişi ve kazanç

### 🧑‍💼 Satıcı
- Ürün & sipariş yönetimi
- Açık artırma ve çekiliş yönetimi
- Satış raporları

### 🧑‍⚖️ Admin
- Kullanıcı / rol / dashboard yönetimi
- Ürün / satıcı onayı
- Çekiliş, açık artırma, MLM politikaları

---

## 6. 🗃️ Database Katmanları

### `/core`
- Ortak interface'ler (IService, IRepository)

### `/entities`
- User, Product, Auction, MLM Entity tanımları

### `/business`
- İş kuralları & servisler (auctionService, mlmService)

### `/validation`
- Form ve payload validation (Zod)

### `/api`
- Route handler’ları ve Server Actions

---

## 7. 🗂️ Proje Klasör Yapısı

```bash
/apps
  /web         # Next.js 15 app
  /mobile      # Expo app

/packages
  /ui          # Ortak bileşenler (shadcn + tailwind)
  /store       # Zustand state (client shared)
  /validation  # Zod şemaları
  /entities    # TypeScript modelleri

/backend
  /core
  /entities
  /business
  /validation
  /api

/cms
  /sanity      # Ürün, çekiliş, auction, mlm veri modeli

/auth
  /clerk-config
```

---

## 8. 🔧 Deployment

| Platform | Tool |
|----------|------|
| Web | Vercel |
| Mobil | Expo + EAS |
| CMS | Sanity.io |
| CI/CD | GitHub Actions |

---

## 9. 📅 Geliştirme Aşamaları

| Aşama | Süre |
|-------|------|
| Altyapı & auth | 1 hafta |
| Ürün & ödeme modülü | 1.5 hafta |
| Çekiliş & açık artırma | 1 hafta |
| Satıcı & admin panelleri | 1 hafta |
| MLM sistemi & testler | 1 hafta |

---

## 10. 🧪 Test Planı

- Unit Test (Jest, Vitest)
- UI Test (React Testing Library)
- E2E (Playwright, Detox)
- Role-based access test
- Performance test (Auction concurrency)
