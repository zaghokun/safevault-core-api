# SafeVault - Core Banking System (Backend)

SafeVault adalah simulasi sistem backend perbankan modern (Core Banking) yang dibangun dengan standar industri. Fokus utama project ini adalah keamanan (Security), integritas data (ACID Transactions), dan pengujian otomatis (Testing).

## Tech Stack
- **Framework:** NestJS.
- **Database:** PostgreSQL + Prisma ORM.
- **Security:** JWT Auth, Bcrypt Hashing, Role Guard.
- **Reliability:** Atomic Transactions (Anti-Race Condition) & Idempotency Key.
- **Quality:** 100% Unit Test Coverage.
- **Docs:** Swagger OpenAPI (`/api`).

## How to run Local Development

### Requirement
- Node.js (v16+)
- Docker Desktop (Database)

### 1. Clone & Install
```bash
git clone [https://github.com/USERNAME_KAMU/repo-backend-kamu.git](https://github.com/USERNAME_KAMU/repo-backend-kamu.git)
cd nama-folder
npm install
```

### 2. Setup Environment
Copy file .env.example menjadi .env:

```bash
cp .env.example .env
(Sesuaikan DATABASE_URL jika konfigurasi Docker kamu berbeda)
```

### 3. Run database via Docker
```bash
docker-compose up -d
```

### 4. Migrasi Database
```bash
npx prisma migrate dev
```

### 5. Jalankan Server
```bash
npm run start:dev
```
Server akan berjalan di http://localhost:3000. Buka Swagger UI di: http://localhost:3000/api

## Testing
Project memiliki coverage test yang tinggi untuk module vital (Auth, Transaction, User).

```bash
npm test
```