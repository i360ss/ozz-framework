<?php
require __DIR__.'/../vendor/autoload.php';

use Ozz\Core\AppInit;
use Ozz\Core\Middleware;
use Ozz\Core\DebugBar;
use Ozz\Core\Request;
use Ozz\Core\ExceptionHandler;

$APP = new AppInit();
$EXCEPTION = new ExceptionHandler();
$DEBUG_BAR = new DebugBar();

require __DIR__.'/../app/Route.php';

Middleware::execute();
$APP->run();
?>