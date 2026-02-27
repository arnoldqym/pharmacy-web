<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Log;

class PatientController extends Controller
{
    /**
     * Fetch All Patients
     */

    public function index(): JsonResponse
    {
        $patients = Patient::paginate(30);
        return response()->json($patients);
    }

    /**
     * Update Patient Information
     */
    public function updatePatientInformation(Request $request, Patient $patient): JsonResponse
    {
        // 1. Validation logic
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            // 2. Ignore the current patient's ID so it doesn't fail on their own email
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('patients')->ignore($patient->id)
            ],
            'date_of_birth' => 'required|date',
        ]);

        // 3. Update and Return
        $patient->update($validatedData);

        return response()->json([
            'message' => 'Patient updated successfully',
            'data' => $patient
        ], 200);
    }


    /**
     * Search for existing patients.
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q') ?? $request->input('query');
        Log::info("ABout to check if : {$query} is in db");
        if (!$query || strlen($query) < 2) {
            return response()->json([]);
        }
        Log::info("Searching for patients with query: {$query}");
        $patients = Patient::query()
            ->where('name', 'like', "%{$query}%")
            ->orWhere('phone', 'like', "%{$query}%")
            ->limit(10)
            ->get();

        return response()->json($patients);
    }
}
