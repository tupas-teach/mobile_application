<?php
require __DIR__."/vendor/autoload.php";
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
echo "APP_KEY: " . $_ENV["APP_KEY"] . PHP_EOL;
echo "DB_DATABASE: " . $_ENV["DB_DATABASE"] . PHP_EOL;
