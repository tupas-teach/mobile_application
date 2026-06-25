<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CourtController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Support\Facades\Route;

// ── Public routes (no auth needed) ───────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

Route::get('products', [ProductController::class, 'index']);
Route::get('products/{id}', [ProductController::class, 'show']);
Route::get('courts',   [CourtController::class, 'index']);

// ── Protected routes (JWT required) ──────────────────────────────────────────
Route::middleware('jwt.auth')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::get('me',      [AuthController::class, 'me']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh',[AuthController::class, 'refresh']);
    });

    // Bookings
    Route::prefix('bookings')->group(function () {
        Route::get('/',         [BookingController::class, 'index']);
        Route::post('/',        [BookingController::class, 'store']);
        Route::get('/slots',    [BookingController::class, 'slots']);
        Route::put('/{id}/cancel', [BookingController::class, 'cancel']);
    });

    // Transactions
    Route::get('transactions',  [TransactionController::class, 'index']);
    Route::post('transactions', [TransactionController::class, 'store']);
});
