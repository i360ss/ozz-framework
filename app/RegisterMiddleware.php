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

  /**
   * Uncomment below middleware (AdminAccessMiddleware) if you using Ozz CMS
   */
  // 'admin_access' => App\middleware\AdminAccessMiddleware::class,
];