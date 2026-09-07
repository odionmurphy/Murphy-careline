# Telehealth Platform - Project Structure & Files Guide

## 📦 Complete File Structure

```
telehealth-app/
├── docker-compose.yml           # 🐳 Docker configuration for all services
├── README.md                    # 📖 Main documentation
├── SETUP_GUIDE.md              # 🚀 Step-by-step installation guide
├── DATABASE_SCHEMA.md          # 🗄️  ER diagram and database design
├── PROJECT_STRUCTURE.md        # 📋 This file
│
├── backend/                    # 🔙 Laravel API Backend
│   ├── Dockerfile              # Docker image for Laravel
│   ├── composer.json           # PHP dependencies
│   ├── app/
│   │   ├── Models/
│   │   │   ├── User.php                  # Base user model (Patient/Doctor/Admin)
│   │   │   ├── Doctor.php                # Doctor profile model
│   │   │   ├── Patient.php               # Patient profile model
│   │   │   ├── Appointment.php           # Appointment scheduling model
│   │   │   ├── VideoSession.php          # WebRTC call tracking model
│   │   │   ├── DoctorAvailability.php    # Doctor schedule model
│   │   │   └── MedicalRecord.php         # Patient medical documents model
│   │   │
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       └── Api/
│   │   │           ├── AuthController.php        # Login/Register/Profile
│   │   │           ├── AppointmentController.php # Booking/Scheduling
│   │   │           ├── VideoController.php       # WebRTC call management
│   │   │           ├── DoctorController.php      # Doctor profile & availability
│   │   │           └── PatientController.php     # Patient profile & records
│   │   │
│   │   ├── Events/                 # Broadcasting events (future)
│   │   └── Jobs/                   # Queue jobs (future)
│   │
│   ├── database/
│   │   └── migrations/
│   │       ├── 2024_01_01_000001_create_users_table.php
│   │       ├── 2024_01_01_000002_create_doctors_table.php
│   │       ├── 2024_01_01_000003_create_patients_table.php
│   │       ├── 2024_01_01_000004_create_appointments_table.php
│   │       ├── 2024_01_01_000005_create_video_sessions_table.php
│   │       ├── 2024_01_01_000006_create_doctor_availability_table.php
│   │       └── 2024_01_01_000007_create_medical_records_table.php
│   │
│   ├── routes/
│   │   └── api.php              # All API endpoints (Protected & Public)
│   │
│   ├── config/
│   │   ├── app.php              # App configuration
│   │   ├── database.php          # Database settings
│   │   ├── auth.php              # Authentication config
│   │   └── cors.php              # CORS settings
│   │
│   ├── storage/                  # File storage (logs, uploads)
│   └── .env.example              # Environment variables template
│
├── frontend/                   # ⚛️  React TypeScript Frontend
│   ├── Dockerfile              # Docker image for React
│   ├── package.json            # NPM dependencies
│   ├── public/
│   │   └── index.html          # HTML entry point
│   │
│   └── src/
│       ├── App.tsx             # Main router and app setup
│       │
│       ├── components/
│       │   ├── VideoCallComponent.tsx    # WebRTC video call UI
│       │   ├── AppointmentCard.tsx       # Appointment display card
│       │   ├── DoctorCard.tsx            # Doctor profile card
│       │   ├── Navigation.tsx            # Header navigation
│       │   ├── Sidebar.tsx               # Side navigation
│       │   └── ... more components
│       │
│       ├── pages/
│       │   ├── LoginPage.tsx             # Login form
│       │   ├── RegisterPage.tsx          # Registration form
│       │   ├── NotFound.tsx              # 404 page
│       │   │
│       │   ├── patient/
│       │   │   ├── Dashboard.tsx         # Patient home dashboard
│       │   │   ├── Appointments.tsx      # Patient's appointments list
│       │   │   ├── BookAppointment.tsx   # Appointment booking form
│       │   │   ├── MedicalRecords.tsx    # View medical documents
│       │   │   └── Profile.tsx           # Edit patient profile
│       │   │
│       │   └── doctor/
│       │       ├── Dashboard.tsx         # Doctor home dashboard
│       │       ├── Appointments.tsx      # Doctor's appointments list
│       │       ├── Availability.tsx      # Set working hours/schedule
│       │       └── Profile.tsx           # Edit doctor profile
│       │
│       ├── layouts/
│       │   ├── AuthLayout.tsx            # Login/Register layout
│       │   └── DashboardLayout.tsx       # Main app layout
│       │
│       ├── store/
│       │   ├── authStore.ts              # Zustand auth state management
│       │   ├── appointmentStore.ts       # Appointment state (optional)
│       │   └── videoStore.ts             # Video call state (optional)
│       │
│       ├── services/
│       │   ├── api.ts                    # Axios HTTP client setup
│       │   ├── authService.ts            # Auth API calls
│       │   ├── appointmentService.ts     # Appointment API calls
│       │   └── videoService.ts           # Video API calls
│       │
│       ├── hooks/
│       │   ├── useAuth.ts                # Auth custom hook
│       │   ├── useAppointments.ts        # Appointments custom hook
│       │   └── useVideo.ts               # Video call custom hook
│       │
│       ├── types/
│       │   └── index.ts                  # TypeScript types/interfaces
│       │
│       ├── styles/
│       │   ├── tailwind.css              # Tailwind CSS config
│       │   └── globals.css               # Global styles
│       │
│       ├── index.tsx            # React DOM entry point
│       └── App.tsx              # App component with routing
│
└── nginx/                      # 🌐 Nginx Configuration (Optional)
    └── conf.d/
        └── default.conf        # Reverse proxy config
```

---

## 🔑 Key Files Explained

### Backend (Laravel)

#### Migrations (Database Setup)
- **users_table** - Base authentication table
  - `id, name, email, password, role, phone, avatar_url, timezone, is_active`
  
- **doctors_table** - Doctor specific data
  - `user_id (FK), specialization, license_number, consultation_fee, is_verified`
  
- **patients_table** - Patient specific data
  - `user_id (FK), date_of_birth, medical_history, allergies, current_medications`
  
- **appointments_table** - Booking & consultation records
  - `patient_id, doctor_id, scheduled_at, status, appointment_type, diagnosis, prescription`
  
- **video_sessions_table** - WebRTC call tracking
  - `appointment_id, initiator_user_id, receiver_user_id, session_token, webrtc_room_id, status`
  
- **doctor_availability_table** - Weekly schedules
  - `doctor_id, day_of_week, start_time, end_time, is_available`
  
- **medical_records_table** - Patient documents
  - `patient_id, doctor_id, record_type, title, file_path, record_date`

#### Controllers (Business Logic)
- **AuthController.php**
  - `POST /register` - New user registration
  - `POST /login` - Login and get token
  - `GET /profile` - Get user profile
  - `PUT /profile` - Update profile
  - `POST /logout` - Logout

- **AppointmentController.php**
  - `GET /appointments` - List user's appointments
  - `POST /appointments` - Book appointment (patient)
  - `GET /appointments/{id}` - Get appointment details
  - `PUT /appointments/{id}` - Update appointment
  - `POST /appointments/{id}/cancel` - Cancel appointment
  - `GET /doctors/{id}/available-slots` - Get available time slots

- **VideoController.php**
  - `POST /video/initiate` - Start video call
  - `POST /video/{session}/accept` - Accept incoming call
  - `POST /video/{session}/connect` - Confirm connection
  - `POST /video/{session}/decline` - Decline call
  - `POST /video/{session}/end` - End call
  - `POST /video/{session}/ice-candidates` - Send WebRTC ICE candidates
  - `GET /video/sessions/active` - Get active calls

#### Routes (API Endpoints)
- **routes/api.php**
  - Public routes: `/auth/register`, `/auth/login`
  - Protected routes (require token): All other endpoints
  - Role-based: Doctor-only, Patient-only, Admin-only routes

---

### Frontend (React)

#### Pages
- **LoginPage.tsx** - User login form with email/password
- **RegisterPage.tsx** - New user registration (select role)
- **patient/Dashboard.tsx** - Patient home screen with upcoming appointments
- **patient/Appointments.tsx** - List all patient appointments with filters
- **patient/BookAppointment.tsx** - Search doctors, select date/time, book
- **doctor/Dashboard.tsx** - Doctor home with today's schedule
- **doctor/Appointments.tsx** - List doctor appointments with patient info
- **doctor/Availability.tsx** - Set working hours for each day of week

#### Components
- **VideoCallComponent.tsx** - Complete WebRTC video call interface
  - Local video (picture-in-picture)
  - Remote video (full screen)
  - Call status indicator
  - Duration timer
  - Accept/Decline/End call buttons

#### Store (State Management with Zustand)
- **authStore.ts** - Global auth state
  - `user` - Current user info
  - `token` - API token
  - `login()` - Login action
  - `register()` - Register action
  - `logout()` - Logout action
  - `updateProfile()` - Update user profile

#### Services
- **api.ts** - Axios instance with interceptors
  - Base URL configured
  - Auth token added to requests
  - 401 error handling (auto-logout)

---

## 🔄 Data Flow

### Registration Flow
```
RegisterPage.tsx
  ↓ (user fills form)
  ↓ calls authStore.register()
  ↓ (POST /auth/register)
Backend AuthController
  ↓ Creates User + Patient/Doctor profile
  ↓ Returns token
  ↓ (saved to localStorage)
authStore updates
  ↓
Redirects to Dashboard
```

### Appointment Booking Flow
```
BookAppointment.tsx
  ↓ (patient selects doctor & time)
  ↓ calls api.post('/appointments')
Backend AppointmentController
  ↓ Validates doctor availability
  ↓ Creates Appointment record
  ↓ Returns appointment details
  ↓
Frontend updates
  ↓
Confirmation message + redirects
```

### Video Call Flow
```
Appointment page
  ↓ (both users click "Start Call")
  ↓ Initiator: api.post('/video/initiate')
Backend VideoController
  ↓ Creates VideoSession
  ↓ Broadcasts call event to receiver
  ↓
Receiver page
  ↓ Shows incoming call notification
  ↓ Receiver clicks "Accept"
  ↓ Receiver: api.post('/video/{session}/accept')
  ↓
Both sides
  ↓ Open VideoCallComponent
  ↓ SimplePeer establishes WebRTC connection
  ↓ Video/audio streams flow
  ↓
Either clicks "End Call"
  ↓ api.post('/video/{session}/end')
  ↓ Appointment marked as completed
```

---

## 🚀 Getting Started

### First Time Setup
1. Read `SETUP_GUIDE.md` for installation
2. Run `docker-compose up -d`
3. Access http://localhost:3000
4. Register test account
5. Create doctor profile & availability
6. Book appointment
7. Test video call

### Making Changes
- **Database change?** → Create migration in `backend/database/migrations/`
- **New API endpoint?** → Add controller method + route in `backend/routes/api.php`
- **Frontend bug?** → Edit component in `frontend/src/`
- **State management?** → Update store in `frontend/src/store/`

### Testing Locally
```bash
# Run tests (not yet implemented)
docker-compose exec laravel php artisan test
npm test

# Check code quality
php artisan tinker
npm run lint
```

---

## 📊 Database Relationships

```
users (1) ←→ (1) doctors
users (1) ←→ (1) patients

doctors (1) ←→ (M) appointments
patients (1) ←→ (M) appointments

doctors (1) ←→ (M) doctor_availability
doctors (1) ←→ (M) medical_records

patients (1) ←→ (M) medical_records

appointments (1) ←→ (M) video_sessions

users (1) ←→ (M) video_sessions (as initiator)
users (1) ←→ (M) video_sessions (as receiver)
```

---

## 🔐 Security Layers

1. **Authentication** - Sanctum API tokens in header
2. **Authorization** - Role-based access control (RBAC)
3. **Validation** - Request validation in controllers
4. **CORS** - Origin whitelist in config
5. **Soft Deletes** - Data preservation for audits
6. **Passwords** - Bcrypt hashing
7. **WebRTC** - P2P encryption with DTLS

---

## 📝 File Naming Conventions

### Laravel
- Models: `User.php`, `Doctor.php` (singular, PascalCase)
- Controllers: `AuthController.php` (PascalCase with Controller suffix)
- Migrations: `2024_01_01_000001_create_users_table.php` (timestamp + snake_case)
- Routes: `api.php` (lowercase)

### React
- Components: `VideoCallComponent.tsx` (PascalCase, .tsx extension)
- Pages: `LoginPage.tsx`, `Dashboard.tsx` (PascalCase)
- Stores: `authStore.ts` (camelCase, .ts extension)
- Services: `api.ts`, `authService.ts` (camelCase)
- Types: `index.ts` (camelCase)

---

## 🎯 Next: What to Build

### Phase 1 (Current)
- ✅ User authentication
- ✅ Appointment booking
- ✅ WebRTC video calls
- ✅ Medical records storage

### Phase 2
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Prescription management
- [ ] Doctor verification workflow

### Phase 3
- [ ] Admin dashboard
- [ ] Analytics & reporting
- [ ] Chat messaging
- [ ] Call recording
- [ ] Integration with EHR systems

---

This structure is production-ready and scalable. Start with the setup guide! 🚀
