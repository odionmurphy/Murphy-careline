# Careline

Careline is a telehealth application for connecting patients with clinicians, booking appointments, and managing appointment requests in a focused web experience.

The project contains a React and TypeScript frontend, a Laravel API backend, PostgreSQL persistence, Redis, and Docker Compose development services.

## Features

### Public experience

- Careline home page with service overview and doctor showcase
- Responsive layout for desktop and mobile
- Login and account registration pages
- Patient or doctor account selection during registration
- Shared navigation and footer

### Patient experience

- Patient dashboard personalized with the logged-in user's name
- Browse available specialists
- Select an appointment date and time
- Book a video consultation
- View saved appointments
- Filter appointments by status
- View appointment details

### Doctor experience

- Doctor dashboard with live appointment totals
- View patient appointment requests
- View appointment details
- Confirm pending appointments
- See confirmed appointment status immediately

## Technology

- React 18
- TypeScript
- React Router
- Axios
- Zustand
- Laravel 12
- Laravel Sanctum
- PostgreSQL 15
- Redis 7
- Docker Compose

## Project Structure

```text
careline/
├── backend/                 Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   └── Models/
│   ├── database/migrations/
│   └── routes/api.php
├── frontend/                React application
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── store/
│       └── types/
├── files/                   Project documentation
├── nginx/                   Nginx configuration
└── docker-compose.yml
```

## Requirements

For the Docker workflow, install:

- Docker Engine or Docker Desktop
- Docker Compose

For manual development, also install:

- PHP 8.2 or later
- Composer
- Node.js 18 or later
- PostgreSQL 15 or later
- Redis 7 or later

## Run With Docker

From the repository root:

```bash
docker-compose up -d
```

The Laravel container runs database migrations during startup. To apply migrations manually:

```bash
docker-compose exec laravel php artisan migrate --force
```

Open the application at:

- Frontend: http://localhost:3000
- API: http://localhost:8000/api
- API health check: http://localhost:8000/api/health
- PostgreSQL: localhost:5433
- Redis: localhost:6379

To view service logs:

```bash
docker-compose logs -f laravel
docker-compose logs -f react
```

To stop the services:

```bash
docker-compose down
```

The PostgreSQL and Redis data volumes are preserved by `docker-compose down`. To remove them as well:

```bash
docker-compose down -v
```

## Local Development Without Docker

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

The API will be available at http://localhost:8000.

### Frontend

In another terminal:

```bash
cd frontend
npm install
npm start
```

The frontend will be available at http://localhost:3000.

The frontend API URL defaults to `http://localhost:8000/api`. It can be overridden with:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

## API Endpoints

### Public endpoints

```text
GET  /api/health
POST /api/auth/register
POST /api/auth/login
```

### Authenticated endpoints

Send the token returned by registration or login as:

```text
Authorization: Bearer <token>
```

Available authenticated endpoints:

```text
POST /api/auth/logout
GET  /api/appointments
POST /api/appointments
POST /api/appointments/{appointment}/confirm
```

Patients can create and view their own appointments. Doctors can view appointment requests and confirm them.

## Registration Example

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Example Patient",
    "email": "patient@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "patient"
  }'
```

Valid roles are `patient` and `doctor`. The API rejects duplicate email addresses with a validation response.

## Appointment Example

```bash
curl -X POST http://localhost:8000/api/appointments \
  -H "Authorization: Bearer <patient-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": 1,
    "doctor_name": "Dr. Maya Patel",
    "specialty": "Family medicine",
    "scheduled_at": "2026-09-07 16:30",
    "mode": "Video consultation"
  }'
```

## Frontend Commands

```bash
cd frontend
npm start       # Start development server
npm run build   # Create production build
npm test        # Run React tests
```

## Current Scope

Careline is an active prototype. Appointment persistence, authentication, patient/doctor dashboards, details, and confirmation are implemented.

The following areas are still planned or use prototype data:

- Doctor profiles are currently represented by the frontend specialist catalog.
- Appointment-to-doctor profile matching needs a dedicated doctor profile table.
- Medical records are not yet implemented.
- Video consultation signaling and live calls are not yet connected to the current API.
- Availability settings currently need backend persistence.
- Production secrets, HTTPS, rate limiting, and deployment configuration should be added before production use.

## Security Note

The credentials and `APP_KEY` in `docker-compose.yml` are development values. Replace them with secure environment-managed secrets before deploying Careline publicly.

