# 🔧 Troubleshooting Guide

## 🚨 **Current Issues & Solutions**

### **1. MongoDB Connection Issue**

**Problem:** Server shows "Backend server running" but no MongoDB connection message.

**Solutions:**

#### **Option A: Create .env file**
Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb://localhost:27017/business_nexus
JWT_SECRET=your_super_secret_key_here_12345
PORT=5001
NODE_ENV=development
```

#### **Option B: Use MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://mongodb.com)
2. Create free account
3. Create a cluster
4. Get connection string
5. Replace MONGO_URI in .env file

#### **Option C: Use Docker MongoDB**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### **2. Port Conflict Issue**

**Problem:** Server running on port 5000 instead of 5001.

**Solution:**
1. Kill existing processes: `taskkill /f /im node.exe`
2. Restart server: `npm start`
3. Should now show port 5001

### **3. Registration/Login Issues**

**Problem:** Registration and login not working.

**Causes & Solutions:**

#### **A. MongoDB Not Connected**
- Fix MongoDB connection first
- Check .env file exists
- Verify MONGO_URI is correct

#### **B. Missing Environment Variables**
- Ensure JWT_SECRET is set
- Ensure MONGO_URI is set

#### **C. API Endpoint Issues**
- Backend should be on port 5001
- Frontend should connect to port 5001
- Check browser console for errors

### **4. Frontend Import Issues**

**Problem:** Import errors in Chat.jsx

**Solution:** ✅ **FIXED**
- Changed `import { api }` to `import api`
- Fixed provider structure in App.jsx

## 🧪 **Testing Steps**

### **Step 1: Test Backend**
```bash
cd backend
npm start
```

**Expected Output:**
```
🔧 Environment check passed
📡 Server will run on port: 5001
✅ MongoDB connected successfully
✅ Backend server running at http://localhost:5001
✅ Socket.io server ready for real-time chat
🌐 API endpoints available at http://localhost:5001/api
```

### **Step 2: Test API Endpoints**
Visit: `http://localhost:5001/api/test`

**Expected Response:**
```json
{
  "message": "Backend server is running!",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### **Step 3: Test Frontend**
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
Local:   http://localhost:5173/
```

### **Step 4: Test Registration**
1. Go to `http://localhost:5173/register`
2. Fill out form
3. Submit
4. Check browser console for errors

### **Step 5: Test Login**
1. Go to `http://localhost:5173/login`
2. Use registered credentials
3. Submit
4. Should redirect to dashboard

## 🔍 **Debug Commands**

### **Check MongoDB Status**
```bash
# Windows
netstat -an | findstr :27017

# Linux/Mac
netstat -an | grep :27017
```

### **Check Backend Status**
```bash
# Windows
netstat -an | findstr :5001

# Linux/Mac
netstat -an | grep :5001
```

### **Test API with curl**
```bash
curl http://localhost:5001/api/test
```

## 📋 **Environment Variables Checklist**

### **Backend .env file should contain:**
```env
MONGO_URI=mongodb://localhost:27017/business_nexus
JWT_SECRET=your_super_secret_key_here_12345
PORT=5001
NODE_ENV=development
```

### **Frontend should connect to:**
- API: `http://localhost:5001/api`
- Socket.io: `http://localhost:5001`

## 🚀 **Quick Fix Commands**

### **If MongoDB not running:**
```bash
# Start MongoDB (Windows)
net start MongoDB

# Start MongoDB (Linux/Mac)
sudo systemctl start mongod

# Start MongoDB (Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### **If port conflicts:**
```bash
# Kill all Node processes
taskkill /f /im node.exe

# Restart backend
cd backend && npm start

# Restart frontend
cd frontend && npm run dev
```

### **If import errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📞 **Common Error Messages & Solutions**

| Error | Solution |
|-------|----------|
| `MONGO_URI environment variable is not set!` | Create .env file with MONGO_URI |
| `JWT_SECRET environment variable is not set!` | Add JWT_SECRET to .env file |
| `MongoDB connection error` | Check MongoDB is running |
| `address already in use :::5001` | Kill existing processes |
| `No matching export in "src/services/api.js"` | ✅ Fixed - import issue resolved |

## ✅ **Success Indicators**

When everything is working correctly, you should see:

1. **Backend Console:**
   - ✅ MongoDB connected successfully
   - ✅ Backend server running at http://localhost:5001
   - ✅ Socket.io server ready for real-time chat

2. **Frontend:**
   - ✅ Website loads without errors
   - ✅ Registration works
   - ✅ Login works
   - ✅ Chat functionality works
   - ✅ Dark mode toggle works

3. **Browser Console:**
   - ✅ No import errors
   - ✅ API calls successful
   - ✅ Socket.io connection established 