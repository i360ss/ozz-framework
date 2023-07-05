<?php
use Ozz\Core\AppInit;
use Ozz\Core\Middleware;
use Ozz\Core\DebugBar;
use Ozz\Core\Request;
use Ozz\Core\ExceptionHandler;

$APP = new AppInit();
$EXCEPTION = new ExceptionHandler();
$DEBUG_BAR = new DebugBar();

// Default Routes
require __DIR__.'/../app/Route.php';

// Load CMS routes
if(env('app', 'ENABLE_CMS')) {
  (file_exists(__DIR__.'/../app/cms-route.php'))
    ? require __DIR__.'/../app/cms-route.php'
    : false;
}

Middleware::execute();
$APP->run();