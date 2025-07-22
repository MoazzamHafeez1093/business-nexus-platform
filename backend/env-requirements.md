# Required Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/business_nexus

# JWT Secret (use a strong secret in production)
JWT_SECRET=your_jwt_secret_key_here

# Server Port
PORT=5001

# Node Environment
NODE_ENV=development
```

## MongoDB Setup Options:

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGO_URI=mongodb://localhost:27017/business_nexus`

### Option 2: MongoDB Atlas (Cloud)
1. Create account at mongodb.com
2. Create a cluster
3. Get connection string
4. Use: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/business_nexus`

### Option 3: MongoDB Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## JWT Secret:
Generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
``` 