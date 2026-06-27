<?php
define("LARAVEL_START", microtime(true));
require __DIR__."/vendor/autoload.php";
$app = require_once __DIR__."/bootstrap/app.php";
echo get_class($app) . PHP_EOL;
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
echo get_class($kernel) . PHP_EOL;
echo "Bootstrap OK" . PHP_EOL;
