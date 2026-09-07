# Telehealth Platform - Database Schema

## Entity Relationship Diagram

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email (UQ)      │
│ password        │
│ role (enum)     │ ──────┐
│ phone           │       │
│ avatar_url      │       │
│ timezone        │       │
│ is_active       │       │
│ created_at      │       │
└─────────────────┘       │
         ▲                 │
         │                 │
    ┌────┴─────────────────┴─────────────┐
    │                                     │
    │                                     │
┌───┴──────────────┐          ┌──────────┴────────┐
│   DOCTORS        │          │    PATIENTS       │
├──────────────────┤          ├───────────────────┤
│ id (PK)          │          │ id (PK)           │
│ user_id (FK)     │          │ user_id (FK)      │
│ specialization   │          │ date_of_birth     │
│ license_number   │          │ gender            │
│ license_expiry   │          │ blood_type        │
│ qualifications   │          │ medical_history   │
│ consultation_fee │          │ allergies         │
│ years_experience │          │ current_meds      │
│ is_verified      │          │ emergency_contact │
└──────────────────┘          │ insurance_provider│
    │                          │ address           │
    │                          │ city              │
    │              ┌──────────┴───────────────┐
    │              │                          │
    └──────────────┼──────────────┐           │
                   │              │           │
            ┌──────┴────┐   ┌─────┴────┐     │
            │            │   │          │     │
    ┌───────┴──────────────┴─┴──────────┴─┐  │
    │     APPOINTMENTS      │             │  │
    ├──────────────────────────────────────┤  │
    │ id (PK)              │              │  │
    │ patient_id (FK)  ───────────────────┼──┘
    │ doctor_id (FK)   ───────────────────┘
    │ scheduled_at         │
    │ duration_minutes     │
    │ status (enum)        │
    │ appointment_type     │
    │ reason               │
    │ diagnosis            │
    │ prescription         │
    │ amount_paid          │
    │ payment_status       │
    │ created_at           │
    └──────────────────────┘
         │
         │
    ┌────┴─────────────────────┐
    │  VIDEO_SESSIONS          │
    ├──────────────────────────┤
    │ id (PK)                  │
    │ appointment_id (FK)      │
    │ initiator_user_id (FK)   │
    │ receiver_user_id (FK)    │
    │ session_token (UQ)       │
    │ webrtc_room_id (UQ)      │
    │ started_at               │
    │ ended_at                 │
    │ duration_seconds         │
    │ status (enum)            │
    │ ice_candidates (JSON)    │
    │ metadata (JSON)          │
    └──────────────────────────┘


┌─────────────────────────────┐
│ DOCTOR_AVAILABILITY         │
├─────────────────────────────┤
│ id (PK)                     │
│ doctor_id (FK) ─────────────┼────→ DOCTORS.id
│ day_of_week (enum)          │
│ start_time                  │
│ end_time                    │
│ is_available                │
│ UQ: (doctor_id, day_of_week)│
└─────────────────────────────┘


┌─────────────────────────────┐
│ MEDICAL_RECORDS             │
├─────────────────────────────┤
│ id (PK)                     │
│ patient_id (FK) ────────────┼────→ PATIENTS.id
│ doctor_id (FK) ─────────────┼────→ DOCTORS.id
│ record_type                 │
│ title                       │
│ file_path                   │
│ record_date                 │
│ is_shared_with_patient      │
│ created_at                  │
└─────────────────────────────┘
```

## Table Descriptions

### USERS
Base authentication table for all system users.
- **role**: patient, doctor, or admin
- **is_active**: Boolean to soft-deactivate accounts

### DOCTORS
Doctor-specific profile data.
- **specialization**: Cardiology, Dermatology, etc.
- **license_number**: Must be unique per jurisdiction
- **consultation_fee**: Charged per appointment
- **is_verified**: Admin approval required before patient access

### PATIENTS
Patient-specific profile data.
- **medical_history**: Conditions, surgeries, etc.
- **current_medications**: Active medications list
- **emergency_contact**: Critical for safety

### APPOINTMENTS
Core scheduling & consultation record.
- **status**: scheduled → confirmed → in_progress → completed (or cancelled/no_show)
- **appointment_type**: video (WebRTC), phone, in-person
- **payment_status**: Separate from appointment status for flexibility

### VIDEO_SESSIONS
WebRTC call metadata and tracking.
- **session_token**: Unique identifier for API calls
- **webrtc_room_id**: Signaling server room identifier
- **status**: Tracks call flow (initiated → ringing → connected → disconnected)
- **metadata**: JSON for storing ICE servers, offer/answer, etc.

### DOCTOR_AVAILABILITY
Recurring weekly schedules for doctors.
- **day_of_week**: monday-sunday
- **start_time** / **end_time**: HH:MM format
- **is_available**: Can temporarily disable a slot

### MEDICAL_RECORDS
Patient medical documents and test results.
- **record_type**: lab_result, prescription, diagnosis, report, etc.
- **file_path**: S3 or local storage path
- **is_shared_with_patient**: GDPR compliance for data access

## Key Relationships

1. **USERS → DOCTORS / PATIENTS** (1-to-1)
   - One user can be either a doctor or patient (role determines behavior)

2. **DOCTORS ← APPOINTMENTS → PATIENTS** (Many-to-Many)
   - Doctors see their appointments with patients
   - Patients see their appointments with doctors

3. **APPOINTMENTS → VIDEO_SESSIONS** (1-to-Many)
   - One appointment can have multiple video sessions (e.g., retry)

4. **DOCTORS → DOCTOR_AVAILABILITY** (1-to-Many)
   - Each doctor has 7 availability records (one per day)

5. **PATIENTS → MEDICAL_RECORDS** (1-to-Many)
   - Patients accumulate medical documents over time

## Indexing Strategy

**High-traffic queries:**
- Appointments by doctor: `doctor_id + status + scheduled_at`
- Appointments by patient: `patient_id + scheduled_at DESC`
- Doctor availability: `doctor_id + day_of_week`
- Video sessions by status: `status + created_at DESC`

**Unique constraints:**
- `users.email`
- `doctors.license_number`
- `doctor_availability(doctor_id, day_of_week)`
- `video_sessions.session_token`
- `video_sessions.webrtc_room_id`

## Soft Deletes

Tables use `soft_delete()`: `users`, `doctors`, `patients`, `appointments`, `medical_records`
- Preserves data for audits and compliance
- Queries automatically exclude deleted rows (unless explicitly included)

## Timestamps

All tables include:
- `created_at`: Record creation time
- `updated_at`: Last modification time
- Some also include `deleted_at` (soft delete)
