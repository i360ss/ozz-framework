<?php
// Auto loader
defined('PATHS') || define('PATHS', array('src/core/', 'src/core/system/'));

function autoLoader($class){
    $dir = __DIR__.'/';
    $DS = DIRECTORY_SEPARATOR;
    foreach (PATHS as $path) {
        strpos($class, '\\') ? $cls = str_replace('\\', $DS, $class).'.php' : $cls = $path.ucwords($class).'.php';
        file_exists($dir.$cls) ? require $dir.$cls : false;
    }
}
spl_autoload_register('autoLoader');