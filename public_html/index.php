<?php
require __DIR__.'/../vendor/autoload.php';
require __DIR__.'/../app/config/config.php';

use Ozz\Core\AppInit;
use Ozz\Core\Middleware;
use Ozz\Core\DebugBar;
use Ozz\Core\Request;

$DEBUG_BAR = new DebugBar();
$APP = new AppInit();

require __DIR__.'/../app/Route.php';

Middleware::execute();
$APP->run();

?>