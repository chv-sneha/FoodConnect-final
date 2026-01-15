# FoodConnect Setup Instructions

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or Neon serverless)

## Setup Steps

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Environment Configuration
Create a `.env` file in the root directory with:
```
DATABASE_URL=your_database_url
SESSION_SECRET=your_secret_key
JWT_SECRET=your_jwt_secret
```

### 3. Database Setup
```bash
npm run db:push
```

### 4. Run the Application
```bash
# Development mode
npm run dev
```

The app will run on `http://localhost:5000`

## Common Issues

- **Module not found errors**: Run `npm install` in both root and client folders
- **Database errors**: Check DATABASE_URL in .env file
- **Port already in use**: Change port in server configuration

## Need Help?
Contact the project owner for:
- Database credentials
- API keys
- Environment variables
