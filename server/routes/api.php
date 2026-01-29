<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. Public Routes (No Middleware)
// Matches your React calls: http://localhost:8000/api/login
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/signup', [AuthController::class, 'signup']);

// 2. Test Route
Route::get('/test', function(){
    return response()->json(['message' => 'API is working fine']);
});

// 3. Protected Routes (Requires Valid JWT Token)
// We use 'auth:api' here because we set the 'api' guard to use the 'jwt' driver
Route::middleware('auth:api')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Use this to get the current user (Alternative to /me)
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
