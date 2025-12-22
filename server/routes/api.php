<?php

use App\Http\Controllers\Auth\AuthCOntroller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test', function(){
    return response()->json(['message' => 'API is working fine']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', AuthCOntroller::class.'login')->middleware('auth:sanctum') ->name('login');
Route::post('/signup', AuthCOntroller::class.'signup')->middleware('auth:sanctum') ->name('signup');
Route::post('/logout', AuthCOntroller::class.'logout')->middleware('auth:sanctum')->name('logout');

