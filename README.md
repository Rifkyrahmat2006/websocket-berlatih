# CTF WebSocket Server

WebSocket relay server untuk realtime scoreboard CTF.

## Deploy to Hostinger Node.js App

### 1. Upload Files
Upload folder `websocket-server` ke Hostinger via File Manager atau Git:
- `server.js`
- `package.json`
- `.env` (buat dari `.env.example`)

### 2. Konfigurasi di Hostinger
1. Masuk ke hPanel → **Website** → **Node.js**
2. Pilih **Create a new app**
3. Set:
   - **Node.js version**: 18 atau lebih baru
   - **Application root**: path ke folder `websocket-server`
   - **Application startup file**: `server.js`
4. Klik **Create**

### 3. Set Environment Variables
Di Hostinger Node.js panel, set environment variables:

| Variable | Value |
|----------|-------|
| `PORT` | (Hostinger set otomatis) |
| `ALLOWED_ORIGINS` | `https://latihaja.com` |
| `API_SECRET` | Generate random string, misal `abc123xyz789` |

### 4. Install Dependencies
Di terminal Hostinger atau melalui panel:
```bash
npm install
```

### 5. Start App
Klik **Run** atau **Restart** di panel Hostinger.

---

## Konfigurasi Laravel (.env di latihaja.com)

Setelah Node.js app running, update `.env` Laravel:

```env
# Ganti dengan URL Node.js app dari Hostinger
WEBSOCKET_SERVER_URL=https://your-nodejs-app.hostingerapp.com
VITE_WEBSOCKET_URL=https://your-nodejs-app.hostingerapp.com
WEBSOCKET_API_SECRET=same-secret-as-nodejs-app
```

---

## API Endpoints

### GET /
Health check - cek apakah server berjalan

### POST /broadcast/scoreboard
Kirim update scoreboard ke semua client

**Headers:**
```
Authorization: Bearer YOUR_API_SECRET
Content-Type: application/json
```

---

## Troubleshooting

### Server tidak jalan
- Pastikan Node.js version >= 18
- Cek log error di panel Hostinger
- Pastikan `npm install` sudah dijalankan

### WebSocket tidak connect dari browser
- Cek ALLOWED_ORIGINS sudah include `https://latihaja.com`
- Pastikan URL di Laravel .env sudah sesuai dengan URL Hostinger Node.js app
