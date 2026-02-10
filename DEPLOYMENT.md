# Deployment Guide: Tech SEO App

## 1. GitHub Push

Führe diese Befehle im Terminal aus:

```bash
git init
git add .
git commit -m "Initial release v1"
git branch -M main
git remote add origin https://github.com/Saveo1985/Tech_seo_app.git
git push -u origin main
```

## 2. Vercel Setup

1. Gehe zu [Vercel Dashboard](https://vercel.com/new).
2. Importiere das Repo `Tech_seo_app`.
3. Framework Preset: **Vite**.
4. **WICHTIG:** Füge die Environment Variables hinzu (Copy-Paste aus `.env`):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_N8N_WEBHOOK_URL` (Optional/Später)
5. Klicke auf **Deploy**.

## 3. Updates

Um die Live-App zu aktualisieren, einfach:

```bash
git add .
git commit -m "Update description"
git push
```

Vercel übernimmt den Rest automatisch.
