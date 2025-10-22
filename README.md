# Sabai Booking - Hotel Booking System

A full-stack hotel booking application built with Vue.js frontend and Express.js backend, now using PostgreSQL database.

## 🚀 Quick Start

### Prerequisites
- Node.js (v20.19.0 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone and Install
```bash
git clone [repository-url]
cd Sabai-Booking
npm install
```

### 2. Database Setup
```bash
# Install PostgreSQL if not already installed
# Create database
createdb sabai_booking

# Run schema
psql -d sabai_booking -f database/schema.sql

# (Optional) Import sample data
psql -d sabai_booking -f database/migrate_data.sql
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and update with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sabai_booking
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3000
```

### 4. Test Database Connection
```bash
npm run test-db
```

### 5. Run the Application
```bash
# Development mode (frontend + backend)
npm run dev

# Or run backend only
npm run server
```

## 🗄️ Database Migration

This project has been migrated from SQLite to PostgreSQL for better performance and scalability.

### Key Changes:
- **Connection Pool**: Using pg connection pool for better concurrent handling
- **Data Types**: Updated to PostgreSQL-specific types (SERIAL, DECIMAL, TIMESTAMP)
- **Query Parameters**: Converted from `?` to `$1, $2, ...` format
- **RETURNING Clause**: Using PostgreSQL's RETURNING for getting inserted IDs

### Migration Benefits:
- Better concurrent connection handling
- ACID compliance with full transaction support
- Advanced features like JSON support and full-text search
- Production-ready scalability
- Better performance for complex queries

See `POSTGRESQL_MIGRATION.md` for detailed migration information.

## 📊 API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile (requires auth)

### Hotels
- `GET /api/hotels` - Get all hotels
- `POST /api/hotels` - Create new hotel
- `GET /api/hotels/:id` - Get hotel by ID
- `PUT /api/hotels/:id` - Update hotel
- `DELETE /api/hotels/:id` - Delete hotel

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/booking/:id` - Get booking details
- `PUT /api/booking/:id/status` - Update booking status

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/booking/:bookingId` - Get payment for booking

## 🏗️ Project Structure

```
Sabai-Booking/
├── src/
│   ├── views/              # Vue.js frontend
│   ├── server/             # Express.js backend
│   ├── models/             # Database models
│   ├── controllers/        # API controllers
│   └── middleware/         # Express middleware
├── database/
│   ├── schema.sql          # PostgreSQL schema
│   └── migrate_data.sql    # Sample data
├── .env                    # Environment variables
└── package.json
```

## 🔧 Development

### Running Tests
```bash
npm run test-db    # Test database connection
```

### Database Operations
```bash
# Backup database
pg_dump sabai_booking > backup.sql

# Restore database
psql sabai_booking < backup.sql
```

### Monitoring Connection Pool
Check `src/server/db/db.js` for connection pool monitoring utilities.

## 🚀 Deployment

For production deployment:

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build and deploy the application

### Frontend Environment Variables

The Vue frontend (Vite) reads environment variables from root-level `.env.*` files. Ensure the API base URL is set using the Vite prefix:

```
# .env.production
VITE_API_BASE_URL=http://18.212.243.118
```

In development, you can override via `.env.local`:

```
# .env.local (not committed)
VITE_API_BASE_URL=http://localhost:3000
```

All client API calls resolve against this base URL.

## 📝 License

This project is licensed under the MIT License.