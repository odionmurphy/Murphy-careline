# Telehealth Platform - Complete Setup Guide

## Prerequisites

### System Requirements
- **Docker & Docker Compose** (Recommended)
  - Docker Desktop 4.0+ for Mac/Windows
  - Docker Engine 20.0+ for Linux
  - Docker Compose 2.0+

OR for manual setup:
- **PHP 8.2+**
- **Node.js 18+** with npm
- **PostgreSQL 15+**
- **Redis 7+**
- **Composer** (PHP package manager)

### Minimum Specs
- **RAM:** 4GB (2GB minimum)
- **Disk:** 5GB free space
- **OS:** macOS, Linux, or Windows (with Docker or WSL2)

---

## Installation Method 1: Docker (Recommended)

### Step 1: Clone the Repository
```bash
git clone <repository-url> telehealth-app
cd telehealth-app
```

### Step 2: Configure Environment

**Edit `.env` in docker-compose.yml** (if needed):
```yaml
# Database
DB_PASSWORD: change_this_to_strong_password
POSTGRES_PASSWORD: change_this_to_strong_password

# App
APP_URL: http://localhost:8000
APP_KEY: # Leave blank, will be generated
```

### Step 3: Start All Services
```bash
docker-compose up -d
```

This starts:
- PostgreSQL database
- Redis cache
- Laravel API backend
- React frontend
- Nginx reverse proxy

### Step 4: Wait for Services (First Run)

Services take 30-60 seconds to start. Monitor progress:
```bash
docker-compose logs -f laravel
```

Watch for:
```
Starting Laravel Tinker...
[✓] Application ready. Serving on http://0.0.0.0:8000
```

### Step 5: Access the Application

Open in your browser:
- **Frontend:** http://localhost:3000
- **API:** http://localhost:8000/api
- **Health Check:** http://localhost:8000/api/health

### Step 6: Verify Database

```bash
# Check if migrations ran
docker-compose exec laravel php artisan migrate:status

# If needed, run manually
docker-compose exec laravel php artisan migrate --force
```

---

## Installation Method 2: Manual Setup (Local Development)

### Backend Setup

#### 1. Install Dependencies
```bash
cd backend
composer install
```

#### 2. Configure Environment
```bash
cp .env.example .env
php artisan key:generate
```

Update `.env`:
```env
APP_NAME=TelehealthApp
APP_DEBUG=true
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=telehealth
DB_USERNAME=postgres
DB_PASSWORD=your_password

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

#### 3. Create Database
```bash
# Using PostgreSQL CLI
createdb telehealth
```

Or if already created:
```bash
php artisan migrate
```

#### 4. Generate App Key
```bash
php artisan key:generate
```

#### 5. Start Laravel Server
```bash
php artisan serve
```

Backend runs on: **http://localhost:8000**

---

### Frontend Setup

#### 1. Install Dependencies
```bash
cd frontend
npm install
```

#### 2. Configure Environment
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000
```

#### 3. Start Development Server
```bash
npm start
```

Frontend runs on: **http://localhost:3000**

---

## Database Setup

### Using Docker
Migrations run automatically on container start.

To run manually:
```bash
docker-compose exec laravel php artisan migrate
```

### Manual Setup
```bash
cd backend
php artisan migrate
```

### Create Test Data
```bash
docker-compose exec laravel php artisan db:seed
# OR manually
php artisan db:seed
```

### Database Access
```bash
# Via Docker
docker-compose exec postgres psql -U telehealth_user -d telehealth

# Via local PostgreSQL
psql -h localhost -U postgres -d telehealth
```

---

## Default Test Accounts

After seeding, use these credentials:

### Patient
- **Email:** patient@example.com
- **Password:** password123

### Doctor
- **Email:** doctor@example.com
- **Password:** password123

### Admin
- **Email:** admin@example.com
- **Password:** password123

---

## Verification Checklist

### Backend
- [ ] `http://localhost:8000/api/health` returns `{"status":"ok"}`
- [ ] Database tables created: `php artisan migrate:status`
- [ ] Redis connection working: `docker-compose exec redis redis-cli ping`

### Frontend
- [ ] Loads without errors at `http://localhost:3000`
- [ ] Can see login page
- [ ] Network tab shows API requests to correct URL

### Integration
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can navigate dashboard

---

## Common Issues & Solutions

### PostgreSQL Port Already in Use
```bash
# Change port in docker-compose.yml
ports:
  - "5433:5432"  # Changed from 5432

# Update .env
DB_PORT=5433
```

### Redis Connection Refused
```bash
# Check Redis is running
docker-compose ps redis

# Restart Redis
docker-compose restart redis

# Clear cache
docker-compose exec laravel php artisan cache:clear
```

### Laravel Can't Connect to Database
```bash
# Check database is healthy
docker-compose ps postgres

# View logs
docker-compose logs postgres

# Rebuild containers
docker-compose down
docker-compose up -d --build
```

### React Can't Reach API
1. Check `.env` file has correct `REACT_APP_API_URL`
2. Verify Laravel is running: `curl http://localhost:8000/api/health`
3. Check CORS in `laravel/config/cors.php`

### Node Modules Issues
```bash
# Clear and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### WebRTC Connection Fails
1. Check browser console for errors
2. Verify appointment exists: `GET /api/appointments/{id}`
3. Check ICE candidates being sent
4. Try with STUN servers configured

---

## Stopping & Restarting Services

### Pause Services
```bash
docker-compose pause
```

### Resume Services
```bash
docker-compose unpause
```

### Stop Services (Keep Data)
```bash
docker-compose down
```

### Stop & Remove Everything
```bash
docker-compose down -v
```

---

## Accessing Services

### Laravel Artisan Commands
```bash
# Via Docker
docker-compose exec laravel php artisan <command>

# Examples:
docker-compose exec laravel php artisan tinker
docker-compose exec laravel php artisan queue:work
docker-compose exec laravel php artisan cache:clear
```

### Database Shell
```bash
docker-compose exec postgres psql -U telehealth_user -d telehealth
```

### Redis Shell
```bash
docker-compose exec redis redis-cli
> PING
PONG
> KEYS *
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs laravel
docker-compose logs react
docker-compose logs postgres

# Follow logs
docker-compose logs -f laravel
```

---

## Development Workflow

### Making Database Changes
1. Create migration:
```bash
docker-compose exec laravel php artisan make:migration create_table_name
```

2. Edit migration in `backend/database/migrations/`

3. Run migration:
```bash
docker-compose exec laravel php artisan migrate
```

### Creating New API Endpoint
1. Create controller:
```bash
docker-compose exec laravel php artisan make:controller Api/ControllerName
```

2. Add route in `backend/routes/api.php`

3. Implement logic in controller

4. Test with Postman or curl:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/endpoint
```

### Frontend Development
- React hot-reload enabled automatically
- Edit files and see changes instantly
- Check console for errors and warnings

---

## Security Setup

### Generate New Encryption Key
```bash
docker-compose exec laravel php artisan key:generate
```

### Set CORS Origins
Edit `backend/config/cors.php`:
```php
'allowed_origins' => ['http://localhost:3000'],  // Add your domains
```

### Database Backup
```bash
docker-compose exec postgres pg_dump -U telehealth_user telehealth > backup.sql
```

### Restore Database
```bash
cat backup.sql | docker-compose exec -T postgres psql -U telehealth_user -d telehealth
```

---

## Production Deployment

### Before Going Live
- [ ] Change all passwords in `.env`
- [ ] Set `APP_ENV=production` and `APP_DEBUG=false`
- [ ] Configure SSL/TLS certificates
- [ ] Set up proper database backups
- [ ] Configure email sending
- [ ] Set up error logging/monitoring
- [ ] Configure storage for medical records
- [ ] Test WebRTC with production ICE servers
- [ ] Load test the system

### Deploy with Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

See `docker-compose.prod.yml` for production configuration.

---

## Support & Troubleshooting

### Get Detailed Error Information
```bash
# View last 50 lines of logs
docker-compose logs --tail=50 laravel

# View specific error date/time range
docker-compose logs --since 2024-01-15 --until 2024-01-16 laravel
```

### Check System Resources
```bash
# Docker stats
docker stats

# Container health
docker-compose ps
```

### Database Integrity Check
```bash
# Check for errors
docker-compose exec laravel php artisan tinker
> DB::select('SELECT 1')
```

---

## Next Steps After Setup

1. ✅ Register test accounts
2. ✅ Create doctor profile with availability
3. ✅ Book appointment as patient
4. ✅ Test video call functionality
5. ✅ Review database schema
6. ✅ Customize branding
7. ✅ Implement payment gateway
8. ✅ Set up email notifications
9. ✅ Deploy to staging
10. ✅ Deploy to production

---

## Getting Help

- Check logs: `docker-compose logs`
- Review API documentation: README.md
- Check database schema: DATABASE_SCHEMA.md
- Test API endpoints with Postman collection (coming soon)

---

Happy coding! 🚀
