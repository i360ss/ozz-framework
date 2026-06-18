<?php
defined('ROOT') || define('ROOT', __DIR__.'/');
defined('BASE_DIR') || define('BASE_DIR', __DIR__.'/../');
defined('ENV_FILE') || define('ENV_FILE', __DIR__.'/../env.ini');
defined('CSP_FILE') || define('CSP_FILE', __DIR__.'/../csp.ini');

$devConfig = include BASE_DIR.'/app/config.php';
$defConfig = include BASE_DIR.'/vendor/ozz/core/src/system/default-config.php';
if (!defined('CONFIG')) {
    define('CONFIG', array_replace_recursive($defConfig, $devConfig));
}

require BASE_DIR.'/vendor/autoload.php';

if (CONFIG['SERVER'] === 'frankenphp' && function_exists('frankenphp_handle_request')) {
    function handle_ozz_request() {
        if (function_exists('header_remove')) {
            header_remove();
        }
        http_response_code(200);
        if (ob_get_level() > 0) {
            ob_end_clean();
        }

        require BASE_DIR.'/app/bootstrap.php';
    }
    while (frankenphp_handle_request('handle_ozz_request')) {}
} else {
    require BASE_DIR.'/app/bootstrap.php';
}