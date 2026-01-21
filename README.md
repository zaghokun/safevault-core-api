# 🏦 SafeVault - Core Banking System

SafeVault adalah sistem backend perbankan modern yang dibangun menggunakan **NestJS**, **Prisma**, dan **PostgreSQL**. Sistem ini dirancang dengan standar keamanan setara perbankan, mendukung transaksi atomik (ACID), serta dilengkapi unit testing untuk memastikan kualitas dan keandalan sistem.

---

## 🚀 Fitur Utama

- **Authentication**  
  Register & Login menggunakan **JWT** dan **Bcrypt**

- **Security**  
  Guard Protection & Role-based Authorization

- **Transactions**  
  Transaksi atomik berbasis **ACID** (Top Up & Transfer saldo)

- **Reliability**  
  **Idempotency Key** untuk mencegah double charge pada request transaksi

- **Documentation**  
  Swagger OpenAPI tersedia di endpoint `/api`

- **Quality Assurance**  
  Target **100% Unit Test Coverage**

---

## 🛠️ Cara Menjalankan Aplikasi

### 1️⃣ Persiapan
Pastikan **Docker Desktop** sudah terpasang dan dalam keadaan berjalan.

---

### 2️⃣ Install Dependency
```bash
npm install
```

### 3️⃣ Setup Database (Docker + Prisma)
```bash
docker-compose up -d
npx prisma migrate dev
```
### 4️⃣ Jalankan Server
```bash
npm run start:dev
```
Akses Swagger API Documentation di:
```bash
Salin kode
http://localhost:3000/api
```
### 5️⃣ Jalankan Testing (Opsional)
```bash
npm test
```
### 6️⃣ Melihat Data Menggunakan Prisma Studio
```bash
npx prisma studio
```
### 📌 Catatan

Pastikan environment variable sudah dikonfigurasi dengan benar (.env)

Gunakan Idempotency-Key pada request transaksi untuk mencegah duplikasi

Dokumentasi API lengkap dapat dilihat melalui Swagger
