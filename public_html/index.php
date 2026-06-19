<?php
defined('ROOT') || define('ROOT', __DIR__);
defined('BASE_DIR') || define('BASE_DIR', __DIR__.'/../');
defined('ENV_FILE') || define('ENV_FILE', __DIR__.'/../env.ini');
defined('CSP_FILE') || define('CSP_FILE', __DIR__.'/../csp.ini');

$devConfig = include BASE_DIR.'/app/config.php';
$defConfig = include BASE_DIR.'/vendor/ozz/core/src/system/default-config.php';
if (!defined('CONFIG')) {
    define('CONFIG', array_replace_recursive($defConfig, $devConfig));
}

require BASE_DIR.'/vendor/autoload.php';
require BASE_DIR.'/app/bootstrap.php';