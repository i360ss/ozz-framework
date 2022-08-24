<?php
/**
 * REGISTER MIDDLEWARES
 * You should register all your middlewares here to load
 */


use App\middleware\AuthMiddleware;
use App\middleware\Test;


/**
 * This will execute automatically on all requests
 */
$auto_middlewares = [
  'Test' => Test::class,

];


/**
 * This should be called from route to execute
 */
$route_middlewares = [
  'auth' => AuthMiddleware::class,
  
];