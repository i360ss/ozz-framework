<?php
namespace Ozz\app\middleware;

class AuthMiddleware {

    public function handle(){
        echo "Auth Middleware loaded <br><br>";
        // Router::redirect('employee');
    }

}