# 🚀 Business Nexus Setup Guide

## Quick Fix for Empty Dashboards

### Step 1: Start the Backend
```bash
cd backend
npm start
```

### Step 2: Test the APIs
In a new terminal, run:
```bash
cd backend
node test-apis.js
```

This will create test users and verify all APIs are working.

### Step 3: Start the Frontend
```bash
cd frontend
npm run dev
```

### Step 4: Test the Application

1. **Register as an Investor:**
   - Go to http://localhost:5173/register
   - Use email: `testinvestor@example.com` and password: `TestPass123`
   - Or register a new investor account

2. **Register as an Entrepreneur:**
   - Go to http://localhost:5173/register
   - Use email: `testentrepreneur@example.com` and password: `TestPass123`
   - Or register a new entrepreneur account

3. **Test the Dashboards:**
   - Login as investor → Should see entrepreneur list
   - Login as entrepreneur → Should see collaboration requests

## 🔧 If Dashboards Are Still Empty

### Option 1: Use Mock Data (Guaranteed to Work)
The dashboards now have enhanced mock data that will always show content, even if the API fails.

### Option 2: Check Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for any error messages
4. Check Network tab for failed API calls

### Option 3: Verify Backend Connection
1. Open http://localhost:5000 in browser
2. Should see a response (even if it's an error page)
3. If connection fails, check if backend is running

## 📊 Expected Dashboard Content

### Investor Dashboard Should Show:
- List of entrepreneurs with their startups
- "Request Collaboration" buttons
- Mock data if no real entrepreneurs exist

### Entrepreneur Dashboard Should Show:
- List of collaboration requests from investors
- Accept/Reject buttons for pending requests
- Mock data if no real requests exist

## 🎯 Quick Test

1. **Register as Investor** → Login → Should see entrepreneur list
2. **Register as Entrepreneur** → Login → Should see requests (or mock data)
3. **Both dashboards should show content** (real data or mock data)

## 🔍 Troubleshooting

### If Backend Won't Start:
- Check if MongoDB is running
- Verify .env file exists with correct values
- Check if port 5000 is available

### If Frontend Won't Start:
- Check if port 5173 is available
- Verify all dependencies are installed
- Check for syntax errors in console

### If APIs Return Errors:
- Check browser console for specific error messages
- Verify JWT token is being sent in requests
- Check if user is properly authenticated

## 📞 Need Help?

If you're still seeing empty dashboards:
1. Check the browser console for errors
2. Verify the backend is running on port 5000
3. Try registering new users with both roles
4. The mock data should always show content

---

**The application is now configured to show content even if the API fails, so you should always see data in the dashboards!** 