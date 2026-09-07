<?php

namespace App\Http\Controllers\Api;

use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController
{
    public function index(Request $request): JsonResponse
    {
        $query = $request->user()->role === 'doctor'
            ? Appointment::with('patient')
            : Appointment::where('patient_id', $request->user()->id);

        $appointments = $query
            ->orderBy('scheduled_at')
            ->get();

        return response()->json(['data' => $appointments]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'doctor_id' => ['required', 'integer'],
            'doctor_name' => ['required', 'string', 'max:255'],
            'specialty' => ['required', 'string', 'max:255'],
            'scheduled_at' => ['required', 'date'],
            'mode' => ['required', 'in:Video consultation,In clinic'],
        ]);

        $appointment = Appointment::create([
            ...$validated,
            'patient_id' => $request->user()->id,
            'status' => 'Pending',
        ]);

        return response()->json(['data' => $appointment], 201);
    }

    public function confirm(Request $request, Appointment $appointment): JsonResponse
    {
        abort_unless($request->user()->role === 'doctor', 403);

        $appointment->update(['status' => 'Confirmed']);

        return response()->json(['data' => $appointment->fresh()->load('patient')]);
    }
}
