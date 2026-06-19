<?php
use Ozz\Core\AppInit;
use Ozz\Core\Middleware;
use Ozz\Core\DebugBar;
use Ozz\Core\Request;
use Ozz\Core\ExceptionHandler;
use Ozz\Core\Cache;

// Return page cache if available
if(CONFIG['PAGE_CACHE_LIFETIME'] && $page_cache = (new Cache)->get()){
  exit($page_cache);
}

$APP = new AppInit();
$EXCEPTION = new ExceptionHandler();
$DEBUG_BAR = new DebugBar();

$EXCEPTION->checkForCommonExceptions();

// Default Routes
require APP_DIR.'Route.php';

// Load CMS routes
if(env('app', 'ENABLE_CMS')) {
  (file_exists(CMS_DIR.'cms-route.php'))
    ? require CMS_DIR.'cms-route.php'
    : false;
}

Middleware::execute();
$APP->run();