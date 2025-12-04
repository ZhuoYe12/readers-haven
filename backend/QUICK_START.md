# 🚀 Quick Start Guide

## Get your backend running in 5 minutes!

### Step 1: Install Node.js & MongoDB

**Node.js:** Download from [nodejs.org](https://nodejs.org/) (get LTS version)

**MongoDB:** Choose one option:

**Option A (Easiest):** Use MongoDB Atlas (Free Cloud Database)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a free cluster (M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

**Option B:** Install MongoDB locally
- Windows: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Mac: `brew install mongodb-community`
- Linux: `sudo apt-get install mongodb`

### Step 2: Setup Project

```bash
# 1. Open terminal in your project folder
cd "D:\ELAI PROJECT"

# 2. Install dependencies (this will take 1-2 minutes)
npm install

# 3. Create .env file
# Copy .env.template to .env and fill in your details
```

### Step 3: Configure .env File

Create a file named `.env` in your project root with this content:

```env
PORT=5000
NODE_ENV=development

# If using MongoDB Atlas (cloud):
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/readers-haven

# If using local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/readers-haven

JWT_SECRET=my_super_secret_key_12345_change_this
JWT_EXPIRE=30d

CLIENT_URL=http://localhost:3000

FLOWISE_API_URL=https://flowise-c5l3.onrender.com
FLOWISE_CHATFLOW_ID=6eb20e85-fbdf-469e-b138-d2bf76caa1fa
```

### Step 4: Seed Database (Optional)

Add sample books to your database:

```bash
npm run seed
```

### Step 5: Start Server

```bash
# Development mode (auto-restarts on changes)
npm run dev

# You should see:
# ✅ MongoDB Connected Successfully
# 🚀 Server running on port 5000
```

### Step 6: Test It!

Open your browser or Postman and try:

**Health Check:**
```
GET http://localhost:5000/api/health
```

**Get Books:**
```
GET http://localhost:5000/api/books
```

**Register User:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

## ✅ Success!

Your backend is running! You should see:
- Server running message in terminal
- No error messages
- API responding to requests

## 🔗 Next Steps

### Connect Frontend to Backend

Update your `index.html` JavaScript to use the API:

```javascript
// Instead of hardcoded books, fetch from API
async function loadBooks() {
  try {
    const response = await fetch('http://localhost:5000/api/books');
    const data = await response.json();
    const books = data.data.books;
    // Use books data...
  } catch (error) {
    console.error('Error loading books:', error);
  }
}
```

### Enable CORS for your Frontend

Make sure your `.env` has:
```env
CLIENT_URL=http://localhost:3000
```

Or if opening HTML directly, use:
```env
CLIENT_URL=*
```

## 🐛 Common Issues

**"MongoDB connection error"**
- Check if MongoDB is running (local) OR
- Verify Atlas connection string is correct
- Check IP whitelist in Atlas (add 0.0.0.0/0 for testing)

**"Port 5000 already in use"**
- Change PORT in `.env` to 5001 or 5002
- Or kill process: `taskkill /F /IM node.exe` (Windows)

**"Module not found"**
- Run `npm install` again
- Delete `node_modules` folder and `package-lock.json`, then run `npm install`

**"JWT Secret not defined"**
- Make sure `.env` file exists in project root
- Check JWT_SECRET is set in `.env`

## 📚 Learn More

- [Full README](./README.md) - Complete documentation
- [MongoDB Atlas Tutorial](https://www.mongodb.com/docs/atlas/getting-started/)
- [Node.js Guides](https://nodejs.org/en/docs/guides/)

## 💡 Pro Tips

1. **Use nodemon for development** (already configured with `npm run dev`)
2. **Keep .env file secret** - never commit to Git
3. **Test with Postman** - easier than browser for POST requests
4. **Check logs** - terminal shows all requests and errors
5. **MongoDB Compass** - GUI tool to view your database

## 🆘 Need Help?

- Check terminal logs for error messages
- Google the error message
- Check MongoDB Atlas logs (if using cloud)
- Make sure all dependencies installed correctly

Happy coding! 🚀

