<?php
/**
 * flexzone-api/config/cors.php
 *
 * FIX: Allows your React Native app (any origin) to call the Laravel API.
 * Without this, fetch() from your phone gets blocked with a CORS error.
 */
return [
    'paths'                    => ['api/*'],
    'allowed_methods'          => ['*'],
    'allowed_origins'          => ['*'],
    'allowed_origins_patterns' => [],
    'allowed_headers'          => ['*'],
    'exposed_headers'          => [],
    'max_age'                  => 0,
    'supports_credentials'     => false,
];