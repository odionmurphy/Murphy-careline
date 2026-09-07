# Telehealth Platform - Patient Management + Video Consultation System

A professional, production-ready telehealth application built with **Laravel 11 + React 18 + TypeScript + WebRTC**.

## 🎯 Features

### Core Functionality
- ✅ **User Authentication** - Secure registration and login (Sanctum API tokens)
- ✅ **Role-Based Access** - Patient, Doctor, and Admin roles with specific permissions
- ✅ **Appointment Booking** - Patients book appointments with doctors using available time slots
- ✅ **Doctor Availability Management** - Doctors set recurring weekly schedules
- ✅ **WebRTC Video Consultation** - Real-time peer-to-peer video calls with signaling
- ✅ **Medical Records** - Secure storage and sharing of medical documents
- ✅ **Patient Profiles** - Medical history, allergies, medications, emergency contacts
- ✅ **Doctor Profiles** - Specialization, credentials, experience, verification
- ✅ **Real-time Notifications** - Broadcasting appointment changes and call events

### Technical Features
- Database migrations with proper indexing
- Soft deletes for GDPR compliance
- API rate limiting ready
- CORS configured for security
- Redis for caching, queues, and real-time broadcasting
- Docker setup for instant deployment

---

## 🏗️ Architecture

### Backend (Laravel)
```
laravel/
├── app/
│   ├── Models/              # Eloquent models
│   │   ├── User.php
│   │   ├── Doctor.php
│   │   ├── Patient.php
│   │   ├── Appointment.php
│   │   ├── VideoSession.php
│   │   ├── DoctorAvailability.php
│   │   └── MedicalRecord.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php
│   │   │       ├── AppointmentController.php
│   │   │       ├── VideoController.php
│   │   │       └── ... more controllers
│   │   └── Middleware/
│   ├── Events/              # Broadcasting events
│   └── Jobs/                # Queue jobs
├── database/
│   └── migrations/          # All table structures
├── routes/
│   └── api.php              # API endpoints
└── storage/                 # File storage
```

### Frontend (React)
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Full page components
│   │   ├── LoginPage.tsx
│   │   ├── patient/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Appointments.tsx
│   │   │   └── BookAppointment.tsx
│   │   └── doctor/
│   │       ├── Dashboard.tsx
│   │       ├── Appointments.tsx
│   │       └── Availability.tsx
│   ├── layouts/             # Layout wrappers
│   ├── store/               # Zustand state management
│   ├── services/            # API calls (axios)
│   ├── hooks/               # Custom React hooks
│   └── App.tsx              # Main router
```

### Database Schema
See `DATABASE_SCHEMA.md` for detailed ER diagram and relationships.

Key tables:
- `users` - Base authentication (patients, doctors, admins)
- `doctors` - Doctor-specific data
- `patients` - Patient-specific data
- `appointments` - Scheduling and consultation records
- `video_sessions` - WebRTC call tracking
- `doctor_availability` - Recurring weekly schedules
- `medical_records` - Patient documents

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (if running without Docker)
- PostgreSQL 15+ (if running without Docker)

### Option 1: Docker (Recommended)

1. **Clone and navigate to project:**
```bash
cd telehealth-app
```

2. **Start all services:**
```bash
docker-compose up -d
```

3. **Initialize database (first run only):**
```bash
docker-compose exec laravel php artisan migrate --force
docker-compose exec laravel php artisan db:seed --force
```

4. **Access the application:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api`
- Database: `postgres://localhost:5432` (user: `telehealth_user`, password: `secure_password_change_me`)

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

---

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get authenticated user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - Logout

### Appointments
- `GET /api/appointments` - List appointments (filtered by role)
- `POST /api/appointments` - Book appointment (patient only)
- `GET /api/appointments/{id}` - Get appointment details
- `PUT /api/appointments/{id}` - Update appointment
- `POST /api/appointments/{id}/cancel` - Cancel appointment
- `GET /api/doctors/{id}/available-slots` - Get available time slots

### Video Calls
- `POST /api/video/initiate` - Start video call
- `POST /api/video/{session}/accept` - Accept incoming call
- `POST /api/video/{session}/connect` - Connect call (both users connected)
- `POST /api/video/{session}/decline` - Decline call
- `POST /api/video/{session}/end` - End call
- `POST /api/video/{session}/ice-candidates` - Add WebRTC ICE candidates
- `GET /api/video/sessions/active` - Get active sessions for user

### Doctors
- `GET /api/doctors` - List all verified doctors
- `GET /api/doctors/{id}` - Get doctor profile
- `PUT /api/doctors/profile` - Update own doctor profile
- `POST /api/doctors/availability` - Set availability schedule

### Medical Records
- `GET /api/medical-records` - List patient's medical records
- `POST /api/medical-records` - Upload/create medical record (doctor only)
- `GET /api/medical-records/{id}` - View specific record

---

## 🔒 Security Features

1. **Authentication**
   - Laravel Sanctum API tokens
   - Bcrypt password hashing
   - Token expiration (optional)

2. **Authorization**
   - Role-based access control (RBAC)
   - Resource ownership validation
   - Soft deletes for audit trail

3. **Data Protection**
   - CORS enabled
   - SQL injection prevention (Eloquent ORM)
   - CSRF protection ready
   - GDPR-compliant medical record sharing

4. **WebRTC Security**
   - SDP offer/answer exchange through secure API
   - ICE candidate gathering through API
   - Peer connection validation

---

## 🎥 WebRTC Video Implementation

### Call Flow
1. **Initiator** calls backend: `POST /video/initiate` with `appointment_id`
2. Backend creates `VideoSession` and broadcasts event to receiver
3. **Receiver** sees incoming call notification
4. Receiver calls: `POST /video/{session}/accept`
5. **Both sides** exchange ICE candidates via: `POST /video/{session}/ice-candidates`
6. **Initiator & Receiver** establish peer connection using SimpleJS Peer library
7. When both connected: `POST /video/{session}/connect`
8. Video/audio streams flow through P2P connection
9. End call: `POST /video/{session}/end`

### Technology Stack
- **SimpleJS Peer** - WebRTC wrapper
- **Redis Broadcast** - Real-time signaling events
- **Laravel Echo** - WebSocket support (optional, upgrade for production)

---

## 📊 Database

### Migrations
Run migrations automatically on container start, or manually:
```bash
php artisan migrate
```

### Seeders
Create test data:
```bash
php artisan db:seed
```

### Rollback
```bash
php artisan migrate:rollback
```

---

## 🔧 Configuration

### .env Variables (Backend)
```
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_DATABASE=telehealth
DB_USERNAME=telehealth_user
DB_PASSWORD=secure_password_change_me
REDIS_HOST=redis
BROADCAST_DRIVER=redis
```

### Environment (Frontend)
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000
```

---

## 🧪 Testing

**Laravel:**
```bash
php artisan test
```

**React:**
```bash
npm test
```

---

## 📦 Deployment

### Production Checklist
- [ ] Change all database passwords
- [ ] Set `APP_ENV=production` and `APP_DEBUG=false`
- [ ] Generate new `APP_KEY`
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Configure production database
- [ ] Set up Redis on production server
- [ ] Configure doctor verification workflow
- [ ] Set up payment gateway (for consultation fees)
- [ ] Configure email notifications

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Run with production settings
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🛠️ Common Tasks

### Create a New Controller
```bash
php artisan make:controller Api/YourController
```

### Create a New Model with Migration
```bash
php artisan make:model YourModel -m
```

### Run Artisan Commands
```bash
docker-compose exec laravel php artisan {command}
```

### View Logs
```bash
docker-compose logs laravel
docker-compose logs react
docker-compose logs postgres
```

### Access Database
```bash
docker-compose exec postgres psql -U telehealth_user -d telehealth
```

---

## 🐛 Troubleshooting

**PostgreSQL connection refused:**
```bash
docker-compose ps
docker-compose logs postgres
```

**Redis connection error:**
```bash
docker-compose exec redis redis-cli ping
```

**Frontend can't reach API:**
- Check `REACT_APP_API_URL` in docker-compose.yml
- Verify Laravel container is running
- Check CORS configuration

**WebRTC calls not connecting:**
- Verify ICE candidates are being transmitted
- Check browser console for errors
- Ensure both users have active appointment

---

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [SimpleJS Peer](https://github.com/feross/simple-peer)

---

## 📄 License

MIT License - see LICENSE file for details

---

## 💡 Next Steps

1. ✅ Customize branding and colors
2. ✅ Implement payment gateway integration
3. ✅ Add prescription management UI
4. ✅ Set up email notifications
5. ✅ Configure SMTP server
6. ✅ Add SMS alerts
7. ✅ Implement admin dashboard
8. ✅ Add analytics tracking
9. ✅ Set up automated backups
10. ✅ Deploy to production server

---

Built with ❤️ for healthcare professionals.
