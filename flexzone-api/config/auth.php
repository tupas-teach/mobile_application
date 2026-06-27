<?php

/**
 * flexzone-api/config/auth.php
 *
 * FIX: Added 'api' guard using JWT driver.
 * Without this, Tymon JWT cannot resolve the authenticated user when
 * the frontend sends Authorization: Bearer <token>.
 *
 * The default guard is kept as 'web' for web routes.
 * JWT is used on the 'api' guard which all protected API routes rely on.
 *
 * Place this file at: flexzone-api/config/auth.php
 * Then run: php artisan config:clear
 */

use App\Models\User;

return [

    'defaults' => [
        'guard'     => env('AUTH_GUARD', 'web'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

    'guards' => [
        'web' => [
            'driver'   => 'session',
            'provider' => 'users',
        ],

        // ✅ FIX: Added JWT guard for API authentication
        'api' => [
            'driver'   => 'jwt',
            'provider' => 'users',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model'  => env('AUTH_MODEL', User::class),
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table'    => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            'expire'   => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),

];
