# ✅ Pre-Deployment Checklist

## 🚨 **MUST DO BEFORE DEPLOYING:**

### 1️⃣ **Create `.env.example` in backend folder**
- ✅ Done! File created
- Contains template for production environment variables

### 2️⃣ **Update API_URL in Frontend**
- ⚠️ **ACTION NEEDED!**
- File: `frontend/index.html` (line 1261)
- Change from: `http://localhost:5000/api`
- Change to: `https://your-backend-url.onrender.com/api`
- **⚠️ DO THIS AFTER DEPLOYING BACKEND**

### 3️⃣ **Create Database Tables in Production**
- ⚠️ **ACTION NEEDED!**
- After setting up Railway/PlanetScale
- Run these SQL scripts:
  1. `CREATE TABLE users` (get from phpMyAdmin Export)
  2. `CREATE TABLE books` (get from phpMyAdmin Export)
  3. `CREATE TABLE borrows` (get from phpMyAdmin Export)
  4. Run `backend/all-books.sql` to populate books

### 4️⃣ **Set Environment Variables on Render**
- ⚠️ **ACTION NEEDED!**
- Copy from `backend/.env.example`
- Update with real production values:
  - `DB_HOST` → Railway/PlanetScale host
  - `DB_PASSWORD` → Railway/PlanetScale password
  - `JWT_SECRET` → Generate random string
  - `CLIENT_URL` → Your Vercel frontend URL

### 5️⃣ **Push Code to GitHub**
- ⚠️ **ACTION NEEDED!**
- Initialize git repo
- Push to GitHub
- Needed for Render/Vercel deployment

### 6️⃣ **Update Flowise CORS**
- ⚠️ **ACTION NEEDED!**
- Add your production frontend URL to allowed origins
- `https://your-app.vercel.app`

---

## 📋 **Deployment Order:**

```
1. Push code to GitHub ✅
2. Deploy database (Railway/PlanetScale) ✅
3. Import database schema & data ✅
4. Deploy backend (Render) ✅
5. Get backend URL ✅
6. Update frontend API_URL ✅
7. Deploy frontend (Vercel) ✅
8. Update Flowise CORS ✅
9. Test everything! ✅
```

---

## 🛠️ **Ready to Deploy?**

If you've completed all the items above, you're ready! 🚀

Follow the full guide: `DEPLOYMENT_GUIDE.md`

---

## ⏰ **Estimated Time:**

- Database setup: 10 minutes
- Backend deployment: 15 minutes
- Frontend deployment: 5 minutes
- Testing: 10 minutes

**Total: ~40 minutes** ⏱️

