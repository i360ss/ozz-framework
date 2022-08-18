<?php
/**
 * REGISTER MIDDLEWARES
 * 
 * You should register all your middlewares here to load
 * $route_middlewares --> This should be called from route to excecute
 * $auto_middlewares  --> This will excecute automatically on all requests
 * 
 */


use App\middleware\AuthMiddleware;


$route_middlewares = [
  'auth' => AuthMiddleware::class,

];


$auto_middlewares = [
  'test'

];
