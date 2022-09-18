<?php
require __DIR__.'/../vendor/autoload.php';

use Ozz\Core\AppInit;
use Ozz\Core\Middleware;
use Ozz\Core\DebugBar;

$DEBUG_BAR = new DebugBar();
$APP = new AppInit();

require __DIR__.'/../app/Roles.php';
require __DIR__.'/../app/Route.php';
require __DIR__.'/../app/Error.php';

Middleware::execute();
$APP->run();

?>