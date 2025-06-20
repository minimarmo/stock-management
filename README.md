# 📦 Stock Management System

ระบบจัดการสต๊อกสินค้า สำหรับร้านค้าและคลังสินค้า รองรับการสแกน QR/Barcode, การบันทึกยอดขาย, รายงานรายเดือน และสามารถติดตั้งเป็นแอป (PWA-like)

## 🚀 ฟีเจอร์หลัก

- ✅ เพิ่ม / แก้ไข / ลบสินค้า
- ✅ สแกน QR หรือ Barcode เพื่อขายสินค้า
- ✅ บันทึกประวัติการขายและนำเข้าสินค้า
- ✅ แสดงรายงานรายเดือน (IN / OUT / Logs)
- ✅ ค้นหาสินค้าแบบ Real-time
- ✅ รองรับการติดตั้งเป็นแอปมือถือ (PWA-like)
- ✅ แจ้งเตือนผู้ใช้เมื่อมีเวอร์ชันใหม่ (PWA Update Prompt)

## 🔗 Demo

> 🌐 ลองใช้งานจริงที่: [demo](https://minimarmo.github.io/stock-management/)

## 🧱 Tech Stack

- ⚛️ React + TypeScript
- 💅 Chakra UI
- 🔎 Supabase (PostgreSQL)
- 📱 Barcode scanning: [`@zxing/browser`](https://github.com/zxing-js/library)
- ⚡ Vite + [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/)

## 🛠 วิธีใช้งาน

### 1. ติดตั้ง dependency

```bash
npm install
# หรือ
yarn install
```

### 2. กำหนด .env สำหรับ Supabase

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. รันโปรเจกต์

```bash
npm run dev
```

### 4. Build สำหรับ Production

```bash
npm run build
```

## 📲 การติดตั้งแอป (PWA-like)

- สามารถติดตั้งแอปลงบนมือถือ/เดสก์ท็อปผ่าน “Add to Home Screen”
- ทำงานในโหมดแอป (standalone UI) เหมือนแอปมือถือ
- **ไม่ได้รองรับการทำงานแบบออฟไลน์**
- หากมีอัปเดตเวอร์ชันใหม่ ระบบจะแจ้งให้ผู้ใช้รีโหลดเพื่อใช้งานเวอร์ชันล่าสุด

## 🖼 ตัวอย่างหน้าจอ

![Preview](/images/preview.gif)
