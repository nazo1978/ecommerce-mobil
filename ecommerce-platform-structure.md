
# 📁 E-Ticaret Platformu - Gerçek Proje Klasör Yapısı

---

## 🧩 Ana Dizin

```
/ecommerce-platform/
├── apps/
│   ├── web/                  # Next.js 15 uygulaması
│   └── mobile/               # Expo (iOS / Android) uygulaması
│
├── packages/
│   ├── ui/                   # Ortak UI bileşenleri (shadcn, tailwind)
│   ├── store/                # Zustand store yapısı
│   ├── validation/           # Zod doğrulama yapıları
│   └── entities/             # Ortak entity tanımları (TypeScript types)
│
├── backend/
│   ├── core/                 # Interface ve soyutlamalar
│   ├── entities/             # Domain modelleri
│   ├── business/             # Servis ve iş kuralları
│   ├── validation/           # Backend odaklı Zod şemaları
│   └── api/                  # Server actions / API handler'lar
│
├── cms/
│   └── sanity/               # Sanity veri şemaları ve config
│
├── auth/
│   └── clerk-config/         # Clerk kimlik doğrulama ayarları
│
├── libs/
│   ├── utils/                # Yardımcı fonksiyonlar
│   └── config/               # Ortak config ayarları
│
├── .github/                  # GitHub Actions CI/CD
├── .env.local                # Ortam değişkenleri (env)
├── README.md
└── package.json
```

---

## 📌 Açıklamalar

### `/apps/web`
Next.js 15 App Router projesi. SSR, server actions, route handlers burada çalışır.

### `/apps/mobile`
Expo tabanlı mobil uygulama. Zustand store ve API istekleri burada entegre edilir.

### `/packages/ui`
Tailwind + Shadcn bileşenleri içerir. Web ve mobil ortak kullanır.

### `/packages/store`
Zustand state tanımları ve hook'lar.

### `/backend`
Clean Architecture uyumlu servis ve mantık katmanları. Sanity ile entegredir.

### `/cms/sanity`
Ürün, açık artırma, çekiliş, mlm gibi doküman tanımları yer alır.

### `/auth/clerk-config`
Clerk tabanlı auth yapılandırması (multi-role RBAC uyumlu)

---

## 🚀 CLI Komutları

```bash
pnpm i                # Monorepo bağımlılıkları yükler
pnpm dev              # Web ve mobil geliştirme ortamını başlatır
pnpm build            # Build işlemi
pnpm lint             # ESLint kontrolü
```

---

## 🧪 Testler

- `apps/web/__tests__/` → RTL + Vitest
- `apps/mobile/__e2e__/` → Detox
- `backend/**/__tests__/` → Jest unit test
