<?php
require __DIR__.'/../vendor/autoload.php';

use Ozz\Core\AppInit;
use Ozz\Core\Middleware;
use Ozz\Core\DebugBar;

$DEBUG_BAR = new DebugBar();
$APP = new AppInit();

require __DIR__.'/../app/config.php';
require __DIR__.'/../app/Route.php';

Middleware::execute();
$APP->run();

?>