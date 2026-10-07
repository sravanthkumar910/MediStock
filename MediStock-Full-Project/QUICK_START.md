# MediStock - Quick Start Guide

## 🚀 Getting Started with MediStock

MediStock is a comprehensive Medical Inventory Management System with a React frontend and Spring Boot backend.

---

## 📋 Prerequisites

- Docker & Docker Compose (version 29+)
- Java 17+ (for local development)
- Node.js 18+ (for local frontend development)
- MySQL 8.0 (optional, included in Docker)

---

## 🐳 Option 1: Run with Docker Compose (Recommended)

### Step 1: Navigate to Project Root
```bash
cd D:\Infosys_springboost-intenship\Final\MediStock\MediStock-Full-Project
```

### Step 2: Start All Services
```bash
docker compose up --build -d
```

### Step 3: Wait for Services to Initialize
```bash
# Check status
docker compose ps

# View logs (wait until backend shows "Started MediStockApplication")
docker compose logs -f
```

### Step 4: Access the Application
- **Frontend:** http://localhost:5174
- **Backend API:** http://localhost:8080/api
- **API Docs:** http://localhost:8080/api/docs/swagger-ui.html
- **Database:** localhost:3306 (MySQL)

### Step 5: Login
```
Email: admin@medistock.com
Password: Admin@123
```

### Step 6: Stop Services
```bash
docker compose down
```

---

## 💻 Option 2: Run Locally for Development

### Backend Setup

#### Step 1: Navigate to Backend
```bash
cd backend
```

#### Step 2: Build
```bash
mvn clean compile
```

#### Step 3: Run with H2 Database (in-memory)
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Backend starts at:** http://localhost:8080/api

### Frontend Setup

#### Step 1: Navigate to Frontend
```bash
cd frontend
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Start Dev Server
```bash
npm run dev
```

**Frontend starts at:** http://localhost:5173

#### Step 4: Build for Production
```bash
npm run build
```

---

## 🔑 Default Credentials

### Admin Account
```
Email: admin@medistock.com
Password: Admin@123
Role: ADMIN (Full access)
```

### Demo Data Included
- ✅ 4 Medicine Categories
- ✅ 3 Suppliers
- ✅ Sample medicines with batch tracking
- ✅ Stock history and notifications

---

## 📊 Main Features

### Dashboard
- Real-time inventory metrics
- Low stock alerts
- Expiring medicines tracking
- Stock movement charts
- Batch health overview

### Medicine Inventory
- Complete medicine catalog
- Batch and expiry tracking
- Stock quantity management
- Supplier association
- Category organization

### Supplier Management
- Supplier directory
- Contact information
- Performance metrics
- On-time delivery tracking
- Order history

### Purchase Orders
- Create and track orders
- Auto-stock replenishment
- Supplier tracking
- Order status workflow

### Reports & Export
- Inventory Summary (Excel/PDF)
- Expiry Report (Excel/PDF)
- Low-Stock Report (Excel/PDF)
- Supplier Performance (Excel/PDF)

### Stock Alerts
- Real-time notifications
- Low stock warnings
- Expiry alerts
- Customizable thresholds

### User Management
- Role-based access control (ADMIN, PHARMACIST, STAFF)
- User profile management
- Permission configuration

---

## 🔧 Configuration

### Backend Configuration
**File:** `backend/src/main/resources/application.yml`

Key settings:
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  profiles:
    active: mysql  # Use 'dev' for H2 in-memory DB

medistock:
  jwt:
    expiration-ms: 86400000    # 24 hours
    refresh-expiration-ms: 604800000  # 7 days
  cors:
    allowed-origins: http://localhost:5173,http://localhost:5174
  bootstrap:
    seed-demo-inventory: true
```

### Frontend Configuration
**File:** `frontend/vite.config.ts`

Proxy configuration:
```javascript
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Build
```bash
cd frontend
npm run build
```

### API Health Check
```bash
curl http://localhost:8080/api/actuator/health
```

---

## 📁 Project Structure

```
MediStock-Full-Project/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Global state (DataContext)
│   │   ├── api/            # Axios HTTP client
│   │   ├── pages/          # Page components
│   │   └── styles/         # CSS files
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/main/java/com/medistock/
│   │   ├── controller/     # REST endpoints
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Data access
│   │   ├── model/          # Entity classes
│   │   ├── config/         # Spring Security, JWT
│   │   └── util/           # Utility classes
│   ├── src/test/           # Unit tests
│   ├── pom.xml
│   └── Dockerfile
│
├── database/
│   └── schema.sql          # Database schema
│
├── docker-compose.yml      # Docker Compose configuration
└── README.md
```

---

## 🔐 Security Features

✅ JWT Authentication with Bearer tokens  
✅ Role-based access control (RBAC)  
✅ Password hashing with bcrypt  
✅ CORS configuration  
✅ Stateless session management  
✅ Token refresh mechanism  
✅ Secure localStorage handling  

---

## 🐛 Troubleshooting

### Docker Services Won't Start
```bash
# Check Docker daemon
docker ps

# Start Docker Desktop if on Windows

# Clean up old containers
docker compose down -v
docker compose up --build -d
```

### Port Already in Use
```bash
# Change ports in docker-compose.yml
# Frontend: 5174 → 3000
# Backend: 8080 → 8081
# MySQL: 3306 → 3307
```

### Frontend Can't Connect to Backend
- Verify backend is running: `curl http://localhost:8080/api/actuator/health`
- Check CORS allowed origins in `application.yml`
- Ensure proxy configuration in `vite.config.ts`

### Database Connection Error
- Verify MySQL is running: `docker compose logs mysql`
- Check credentials in `application-mysql.yml`
- Ensure volume is mounted: `docker volume ls`

---

## 📈 Performance Tips

1. **For Production:**
   - Use `docker-compose.prod.yml`
   - Set up environment variables in `.env.production`
   - Enable Redis caching
   - Configure MySQL connection pooling

2. **For Development:**
   - Use H2 in-memory database (dev profile)
   - Enable SQL query logging
   - Use source maps for debugging
   - Enable React DevTools browser extension

---

## 📞 Support & Documentation

- **API Documentation:** http://localhost:8080/api/docs/swagger-ui.html
- **Project Report:** See `PROJECT_VERIFICATION_REPORT.md`
- **Architecture Details:** See `README.md`

---

## ✅ Verification Checklist

After starting the application:

- [ ] Frontend loads at http://localhost:5174
- [ ] Login page displays
- [ ] Can login with admin@medistock.com / Admin@123
- [ ] Dashboard loads with metrics
- [ ] Can navigate to all menu pages
- [ ] Categories page shows seeded data
- [ ] Suppliers page shows 3 suppliers
- [ ] Reports page renders all export options
- [ ] Backend API responds at /api/actuator/health
- [ ] No console errors in browser DevTools

---

## 🚢 Deployment

### Production Checklist
- [ ] Update CORS_ORIGINS to your domain
- [ ] Configure MAIL_HOST for notifications
- [ ] Set JWT_SECRET to secure random string
- [ ] Update database credentials
- [ ] Enable HTTPS
- [ ] Configure DNS and SSL certificates
- [ ] Set up monitoring and logging
- [ ] Configure backups for MySQL volume

### Deploy Command
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

---

## 📝 Version Information
- **Frontend:** React 18 + Vite 5 + TypeScript
- **Backend:** Spring Boot 3.3.2 + Java 17
- **Database:** MySQL 8.0
- **Docker:** 29.8.1+

---

**Status:** ✅ Production Ready  
**Last Updated:** October 6, 2026
