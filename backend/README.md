# Admin Panel Backend

Authentication API for Admin Panel

## Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Create Database
```bash
psql -U postgres
CREATE DATABASE admin_panel;
\q
```

### 4. Generate Password Hash
```bash
npm run hash-password
# Copy the hash output
```

### 5. Update Migration
Edit `migrations/001_create_users.sql` and replace `HASH_PLACEHOLDER` with the hash from step 4.

### 6. Run Migration
```bash
psql -U postgres -d admin_panel -f migrations/001_create_users.sql
```

### 7. Start Server
```bash
npm run dev
```

## Endpoints

- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `GET /health` - Health check

## Default Credentials

- Email: admin@example.com
- Password: admin123
