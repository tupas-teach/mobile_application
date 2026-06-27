<?php

/**
 * flexzone-api/bootstrap/app.php
 *
 * FIXES APPLIED:
 * 1. Added HandleCors middleware to the global stack so CORS headers are
 *    sent on EVERY request (including preflight OPTIONS requests).
 *    Without this, React Native / Expo cannot reach the API.
 * 2. JWT middleware alias is already registered correctly — kept as-is.
 *
 * Place this file at: flexzone-api/bootstrap/app.php
 */

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

        // ✅ FIX 1: Add CORS to the global middleware stack
        // This ensures preflight OPTIONS requests are handled before any route matching.
        $middleware->prepend(\Illuminate\Http\Middleware\HandleCors::class);

        // ✅ FIX 2: JWT middleware alias (was already correct, kept)
        $middleware->alias([
            'jwt.auth' => \Tymon\JWTAuth\Http\Middleware\Authenticate::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
