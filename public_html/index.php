<?php
defined('BASE_DIR') || define('BASE_DIR', __DIR__.'/../');
defined('ENV_FILE') || define('ENV_FILE', __DIR__.'/../env.ini');
defined('CSP_FILE') || define('CSP_FILE', __DIR__.'/../csp.ini');
defined('CONFIG_FILE') || define('CONFIG_FILE', __DIR__.'/../app/config.php');

require BASE_DIR.'/vendor/autoload.php';
require BASE_DIR.'/app/bootstrap.php';
?>