# Business Nexus Backend

## Setup
- Node.js, Express, MongoDB, Mongoose
- Auth APIs: /api/auth/register, /api/auth/login
- JWT authentication and role-based middleware in `middleware/`

## Usage
- Start with `npm install` and `npm start`
- Set environment variables: `MONGO_URI`, `JWT_SECRET`

## API
- POST /api/auth/register
- POST /api/auth/login
- Example protected route (see `routes/authRoutes.js`) 