<?php
if (php_sapi_name() === 'cli-server') {
    $file = __DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (is_file($file)) {
        return false;
    }
}

require __DIR__.'/../vendor/autoload.php';
require __DIR__.'/../app/bootstrap.php';
?>