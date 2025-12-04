# 📥 Import Database to Railway - Simple Guide

## ✅ I created the complete SQL file for you!

**File:** `backend/railway-complete-import.sql`

This file contains:
- ✅ All 3 tables (users, books, borrows)
- ✅ All 21 books with data
- ✅ Ready to import!

---

## 🚀 **How to Import (Pick ONE method)**

### **METHOD 1: Using Railway CLI** (Easiest)

#### Step 1: Install Railway CLI

Open PowerShell **as Administrator**:

```powershell
iwr https://railway.app/install.ps1 -useb | iex
```

#### Step 2: Import Database

Open **regular PowerShell** (not as admin):

```powershell
# Go to backend folder
cd "D:\ELAI PROJECT\backend"

# Login to Railway
railway login

# Link to your project (select your project from list)
railway link

# Import the database
railway run mysql -u root -p railway < railway-complete-import.sql
```

When prompted for password, use:
```
xYVLvWMadHhWtmiQymKQAyjjPJKCehEp
```

✅ Done!

---

### **METHOD 2: Using MySQL Command (if you have MySQL installed)**

```powershell
cd "D:\ELAI PROJECT\backend"

mysql -h switchback.proxy.rlwy.net -P 32621 -u root -pxYVLvWMadHhWtmiQymKQAyjjPJKCehEp railway < railway-complete-import.sql
```

**Note:** No space between `-p` and password!

---

### **METHOD 3: Using MySQL Workbench** (GUI Method)

#### Step 1: Open MySQL Workbench

1. Download from: [dev.mysql.com/downloads/workbench](https://dev.mysql.com/downloads/workbench/)
2. Install and open

#### Step 2: Create Connection

1. Click **"+"** next to "MySQL Connections"
2. Fill in:
   - **Connection Name:** Railway Production
   - **Hostname:** `switchback.proxy.rlwy.net`
   - **Port:** `32621`
   - **Username:** `root`
3. Click **"Store in Keychain"** and enter password:
   ```
   xYVLvWMadHhWtmiQymKQAyjjPJKCehEp
   ```
4. Click **"Test Connection"**
5. Click **"OK"**

#### Step 3: Import SQL File

1. Double-click your connection to open it
2. Click **"Server"** → **"Data Import"**
3. Select **"Import from Self-Contained File"**
4. Click **"..."** and browse to:
   ```
   D:\ELAI PROJECT\backend\railway-complete-import.sql
   ```
5. Under **"Default Target Schema"**, select **"railway"**
6. Click **"Start Import"**
7. Wait for completion

✅ Done!

---

### **METHOD 4: Copy-Paste in Railway Web Interface** (Slowest)

1. Go to Railway dashboard
2. Click on your MySQL service
3. Click **"Database"** tab
4. Open `railway-complete-import.sql` in Notepad
5. Copy ALL the content
6. Paste in Railway's query editor
7. Run the query

---

## ✅ **Verify Import Worked**

After importing, check if it worked:

### **Using Railway CLI:**

```powershell
railway run mysql -u root -p railway
```

Then in MySQL prompt:

```sql
SHOW TABLES;
-- Should show: borrows, books, users

SELECT COUNT(*) FROM books;
-- Should show: 21

SELECT title FROM books LIMIT 5;
-- Should show book titles

exit
```

---

## 🎯 **After Import:**

You're ready to test! Run your backend:

```powershell
cd "D:\ELAI PROJECT\backend"
npm run dev
```

Test these URLs:
- http://localhost:5000/api/health
- http://localhost:5000/api/books

You should see data from Railway! 🎉

---

## 🆘 **Troubleshooting:**

**"railway: command not found"**
- Railway CLI not installed. Use METHOD 2 or 3

**"Access denied for user"**
- Check password is correct
- No spaces in password

**"Can't connect to MySQL server"**
- Check Railway service is running
- Verify host and port are correct

**"Table already exists"**
- The SQL file will DROP tables first, so this shouldn't happen
- If it does, manually delete tables in Railway dashboard first

---

**Which method do you want to use?** I recommend METHOD 1 (Railway CLI)! 🚀

