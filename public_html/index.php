<?php
require __DIR__.'/../vendor/autoload.php';

use Ozz\Core\Errors;
use Ozz\Core\Appinit;
use Ozz\Core\Middleware;

$APP = new Appinit();

require __DIR__.'/../app/Error.php';
require __DIR__.'/../app/Roles.php';
require __DIR__.'/../app/Route.php';

$errors = new Errors();
$GLOBAL['errors'] = $errors;

Middleware::execute();
$APP->run();

?>