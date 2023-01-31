<?php
/**
 * App Configurations
 */


 // Default login URL
define('AUTH_LOGIN_PATH', '/login');


// Default logout URL
define('AUTH_LOGOUT_PATH', '/logout');


// Default signup URL
define('AUTH_SIGNUP_PATH', '/sign-up');


// Default auth controller
define('AUTH_CONTROLLER', 'AuthController');


// Users database table name
define('AUTH_USERS_TABLE', 'users');


// Email notification if user signed in from a different IP/Device/Browser
define('AUTH_NEW_LOGIN_ALERT', true);


// Enable or disable throttle
define('AUTH_THROTTLE', true);


// Throttle database table name
define('AUTH_THROTTLE_TABLE', 'users_log');


// Throttling time
define('AUTH_THROTTLE_TIME', 60*20);


// Number of maximum wrong auth attempts
define('AUTH_THROTTLE_MAX_ATTEMPTS', 4);


// Action to be taken if throttling found (reset/delay) provide delay time if you choose delay option
define('AUTH_THROTTLE_ACTION', 'reset');


// Core database table fields for auth
define('AUTH_CORE_FIELDS', [
  'id_field'          => 'user_id',
  'username_field'    => 'username',
  'email_field'       => 'email',
  'password_field'    => 'password',
  'status_field'      => 'status',
  'role_field'        => 'role',
]);


// Allowed database fields of auth (users) table to access
define('AUTH_ALLOWED_FIELDS', [
  'user_id',
  'username',
  'first_name',
  'last_name',
  'email',
  'password',
  'role',
  'status',
  'avatar',
  'activation_key'
]);


// User roles
define('AUTH_USER_ROLES', [
  'admin' => [
    'landing_page'    => 'admin/dashboard',
  ],
  'subscriber' => [
    'landing_page'    => 'dashboard',
  ]
]);


// Auth view files
define('AUTH_VIEWS', [
  'sign-up'           => 'sign-up.phtml',
  'login'             => 'login.phtml',
  'forgot-password'   => 'forgot-password.phtml',
  'reset-password'    => 'reset-password.phtml',
  'verify-account'    => 'verify-account.phtml',
]);


// Auth email templates
define('AUTH_EMAIL_TEMPLATES', [
  'account-verification'   => 'account-verification.html',
  'password-reset-request' => 'password-reset-request.html',
  'throttle-reset-request' => 'throttle-reset.html',
  'new-login-alert'        => 'new-login-alert.html',
]);
