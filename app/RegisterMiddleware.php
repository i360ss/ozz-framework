<?php
/**
 * REGISTER MIDDLEWARE
 * This will execute automatically on all requests
 */
$auto_middleware = [
  
];



/**
 * This should be called from route to execute
 */
$route_middleware = [
  'auth' => App\middleware\AuthMiddleware::class,
];