# 🚀 Readers Haven - Deployment Guide

## 📦 **Deployment Stack**

### **Backend:** Render.com (Node.js + Express)
### **Database:** Railway/PlanetScale (MySQL)
### **Frontend:** Vercel/Netlify (Static Hosting)

---

## 🔧 **Step 1: Prepare Backend for Deployment**

### 1.1 Create `.env.example` in backend folder:
```env
# Server
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-url.vercel.app

# Database (MySQL)
DB_HOST=your-database-host.railway.app
DB_PORT=3306
DB_NAME=railway
DB_USER=root
DB_PASSWORD=your-password

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=30d
```

### 1.2 Add to `backend/package.json`:
Make sure you have:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 1.3 Create `.gitignore` in root:
```
node_modules/
.env
*.log
.DS_Store
database.sqlite
```

---

## 🗄️ **Step 2: Deploy Database**

### **Option A: Railway (Recommended)**

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Provision MySQL"**
3. Copy connection details:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
4. Connect to database and run your SQL:
   - Go to **"Data"** tab
   - Or use MySQL Workbench with Railway's connection string
5. **Import your tables:**
   - Run `CREATE TABLE users...` (from your phpMyAdmin structure)
   - Run `CREATE TABLE books...`
   - Run `CREATE TABLE borrows...`
   - Run your `all-books.sql` to populate books

### **Option B: PlanetScale**

1. Go to [planetscale.com](https://planetscale.com)
2. Create free account
3. Create new database
4. Get connection string
5. Import schema

---

## 🌐 **Step 3: Deploy Backend to Render**

1. **Go to [render.com](https://render.com)**
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo (push your code to GitHub first)
4. Or use **"Deploy from Git URL"**

### **Render Configuration:**

```
Name: readers-haven-backend
Environment: Node
Region: Choose closest to you
Branch: main
Build Command: npm install
Start Command: npm start
```

### **Environment Variables (on Render):**

Add these in Render's dashboard:
```
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-url.vercel.app

DB_HOST=your-railway-host.railway.app
DB_PORT=3306
DB_NAME=railway
DB_USER=root
DB_PASSWORD=your-railway-password

JWT_SECRET=generate-a-random-secret-key-here
JWT_EXPIRE=30d
```

5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes)
7. Copy your backend URL: `https://readers-haven-backend.onrender.com`

---

## 🎨 **Step 4: Deploy Frontend**

### **Update API URL in frontend:**

In `frontend/index.html`, change line 1261:

**FROM:**
```javascript
const API_URL = 'http://localhost:5000/api';
```

**TO:**
```javascript
const API_URL = 'https://readers-haven-backend.onrender.com/api';
```

### **Deploy to Vercel:**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. **Import Git Repository** (push to GitHub first)
4. Or drag-and-drop your `frontend` folder
5. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `frontend` (if using monorepo) or `.` (if frontend only)
   - **Output Directory:** `.` (since it's HTML/CSS/JS)
6. Click **"Deploy"**
7. Get your URL: `https://readers-haven.vercel.app`

### **OR Deploy to Netlify:**

1. Go to [netlify.com](https://netlify.com)
2. Drag `frontend` folder to deploy
3. Get your URL

---

## 🔒 **Step 5: Update CORS**

Go back to **Render** → Your backend → **Environment Variables**

Update `CLIENT_URL`:
```
CLIENT_URL=https://readers-haven.vercel.app
```

Redeploy backend if needed.

---

## 🤖 **Step 6: Update Flowise CORS**

1. Go to your Flowise dashboard
2. Find chatflow settings
3. Add allowed origins:
   ```
   https://readers-haven.vercel.app
   ```

---

## ✅ **Step 7: Test Production**

Visit your frontend URL and test:
- ✅ Books load correctly
- ✅ Sign up works
- ✅ Login works
- ✅ Borrow book works
- ✅ Reserve book works
- ✅ My Library shows data
- ✅ Chatbot works (Flowise)

---

## 🐛 **Troubleshooting**

### **Backend fails to start:**
- Check Render logs
- Verify all environment variables are set
- Check database connection

### **Database connection fails:**
- Verify Railway/PlanetScale is running
- Check connection credentials
- Ensure database tables are created

### **Frontend can't reach backend:**
- Check CORS settings in backend
- Verify `CLIENT_URL` in backend env
- Check API_URL in frontend code

### **Books don't load:**
- Check if `all-books.sql` was imported
- Verify database has data: `SELECT * FROM books;`

---

## 📝 **Quick Deployment Commands**

```bash
# 1. Push to GitHub
cd "D:\ELAI PROJECT"
git init
git add .
git commit -m "Initial commit - Readers Haven"
git branch -M main
git remote add origin https://github.com/yourusername/readers-haven.git
git push -u origin main

# 2. Deploy backend to Render (via GitHub)
# 3. Deploy frontend to Vercel (via GitHub or drag-drop)
```

---

## 🎉 **You're Live!**

Once deployed, share your library:
- **Frontend:** `https://readers-haven.vercel.app`
- **Backend API:** `https://readers-haven-backend.onrender.com/api`

---

## 💰 **Cost Estimate**

- **Render Free Tier:** $0/month (backend)
- **Railway Free Tier:** $5 credit/month (database)
- **Vercel Free Tier:** $0/month (frontend)
- **Flowise:** Already on Render

**Total:** ~$0-5/month for development 🎉

---

## 🔄 **Future Updates**

To update your site:
1. Make changes locally
2. Test locally
3. Push to GitHub
4. Vercel/Render auto-deploys!

---

Need help with any step? Let me know! 🚀

