<?php
# ----------------------------------------------------------------------
/* You can register all the user roles here which can be used to login to the application. */

// The first param is the name of the User Role
// Second param is autherization type (Session/JWToken)
// Third param is User Landing page after Loged in successfully (This will load "home" as landing page if nothing defined)
# ----------------------------------------------------------------------
use Ozz\Core\Auth;

// Auth::registerUserRole([
//   'admin' => [
//     'login_type'    => 'jwt',
//     'landing_page'  => 'admin/dashboard'
//   ],
//   'user' => [
//     'login_type'    => 'session',
//     'landing_page'  => 'user/{username}'
//   ]
// ]);

Auth::registerUserRole( 'admin', ['session'], 'admin/dashboard' );
Auth::registerUserRole( 'editor', ['session'], 'editor/dashboard' );

