<?php
namespace Ozz\app;

use Ozz\app\middleware\AuthMiddleware;

class RegisterMiddleware {

    # -------------------------------------------
    // Thise Middlewares will load only when called
    # -------------------------------------------
    public static function routeMiddleware(){
        return $middlewares = [

            'auth' => AuthMiddleware::class,

        ];
    }


    # -------------------------------------------
    // Thise Middlewares will load on all requests
    # -------------------------------------------
    public static function autoMiddleware(){
        return $middlewares = [
            
            

        ];
    }
}