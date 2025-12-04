# ⚡ Quick Commands Reference

## 📦 **GitHub Push Commands**

Open PowerShell in `D:\ELAI PROJECT\` and run these:

```powershell
# Step 1: Initialize Git
git init

# Step 2: Add all files
git add .

# Step 3: First commit
git commit -m "Initial commit: Readers Haven Library System"

# Step 4: Create branch
git branch -M main

# Step 5: Add remote (REPLACE YOUR-USERNAME!)
git remote add origin https://github.com/YOUR-USERNAME/readers-haven.git

# Step 6: Push to GitHub
git push -u origin main
```

**⚠️ Replace `YOUR-USERNAME` with your actual GitHub username!**

---

## 🗄️ **Railway Database Setup**

### **Get Railway Connection Details:**

After creating MySQL on Railway, copy these variables:

```
MYSQLHOST=xxxx.railway.app
MYSQLPORT=xxxx
MYSQLDATABASE=railway
MYSQLUSER=root
MYSQLPASSWORD=xxxxxxxxxxxx
```

---

## 📝 **Update .env File**

Open: `backend\.env`

Replace with Railway values:

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-url.vercel.app

DB_HOST=xxxx.railway.app
DB_PORT=xxxx
DB_NAME=railway
DB_USER=root
DB_PASSWORD=xxxxxxxxxxxx

JWT_SECRET=07211786007a9d482be268325a44ae93c4a6126fa02d1807eb17e938688f2b356605aa06cc1fced4ce3670b8a3c1ce7b55c30544df67427d124ad8bbf6a05f41
JWT_EXPIRE=30d
```

---

## 💾 **Import Database to Railway**

### **Option 1: Railway CLI**

```powershell
# Install Railway CLI (run PowerShell as Administrator)
iwr https://cli.railway.app/install.ps1 -useb | iex

# Login
railway login

# Link project
railway link

# Import schema
cd backend
railway run mysql -u root -p railway < database-schema.sql

# Import books
railway run mysql -u root -p railway < all-books.sql
```

### **Option 2: Export from phpMyAdmin**

1. Go to: `http://localhost/phpmyadmin`
2. Select `library_system` database
3. Click **"Export"** tab
4. Choose **"Custom"** method
5. Check:
   - ✅ Structure
   - ✅ Data  
   - ✅ DROP TABLE (add)
6. Click **"Go"**
7. Save as `database-export.sql`
8. Import to Railway using CLI or Workbench

---

## ✅ **Verify Import**

```powershell
railway run mysql -u root -p railway

# In MySQL prompt:
SHOW TABLES;
SELECT COUNT(*) FROM books;     # Should show 18
SELECT COUNT(*) FROM users;     # Should show your users
SELECT * FROM books LIMIT 5;    # Show first 5 books
exit;
```

---

## 🎯 **What to Do Next?**

After successful push & database setup:

1. ✅ Code is on GitHub
2. ✅ Railway database is ready
3. ✅ Data is imported
4. ⏭️ Next: Deploy backend to Render
5. ⏭️ Next: Deploy frontend to Vercel

---

## 📋 **Quick Status Check:**

```
☐ GitHub account created?
☐ Repository created on GitHub?
☐ Code pushed to GitHub?
☐ Railway account created?
☐ MySQL database provisioned?
☐ Connection details copied?
☐ .env file updated?
☐ Database imported?
```

---

Need help with any command? Just ask! 🚀

