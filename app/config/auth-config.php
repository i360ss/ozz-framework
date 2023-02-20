<?php
// Auth Configurations

/**
 * Default login URL
 */
define('AUTH_LOGIN_PATH', '/login');


/**
 * Default logout URL
 */
define('AUTH_LOGOUT_PATH', '/logout');


/**
 * Default signup URL
 */
define('AUTH_SIGNUP_PATH', '/sign-up');


/**
 * Default email verification URL
 */
define('AUTH_EMAIL_VERIFY_PATH', 'verify-account/');


/**
 * Default auth controller
 */
define('AUTH_CONTROLLER', 'AuthController');


/**
 * Auth Middleware Name
 */
define('AUTH_MIDDLEWARE_NAME', 'AuthMiddleware.php');


/**
 * Users database table name
 */
define('AUTH_USERS_TABLE', 'users');


/**
 * Automatically activate account and login once signup successfully
 * This will work only if verification mail disabled
 */
define('AUTH_ACTIVATE_AND_LOGIN_ONCE_SIGNUP', true);


/**
 * Send Email verification on signup
 */
define('AUTH_SEND_VERIFICATION_MAIL', false);


/**
 * Email notification if user signed in from a different IP/Device/OS/Browser
 */
define('AUTH_NEW_LOGIN_ALERT', true);


/**
 * Enable or disable throttle
 */
define('AUTH_THROTTLE', true);


/**
 * Throttle database table name
 */
define('AUTH_THROTTLE_TABLE', 'users_log');


/**
 * Number of maximum wrong auth attempts
 */
define('AUTH_THROTTLE_MAX_ATTEMPTS', 5);


/**
 * Throttling time (Attempts within this amount of time)
 * Should be defined in seconds
 */
define('AUTH_THROTTLE_TIME', 60*20);


/**
 * Throttle delay time (Try again after this amount of time)
 * Should be defined in seconds
 */
define('AUTH_THROTTLE_DELAY_TIME', 60);


/**
 * Core database table fields for auth
 */
define('AUTH_CORE_FIELDS', [
  'id_field'             => 'user_id',
  'username_field'       => 'username',
  'email_field'          => 'email',
  'password_field'       => 'password',
  'first_name_field'     => 'first_name',
  'last_name_field'      => 'last_name',
  'status_field'         => 'status',
  'role_field'           => 'role',
  'activation_key_field' => 'activation_key',
]);


/**
 * Allowed database fields of auth (users) table to access
 */
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


/**
 * User roles and permissions
 */
define('AUTH_USER_ROLES', [
  'admin' => [
    'landing_page'  => '/dashboard',
    'permissions'   => [
      'view_users',
      'edit_users'
    ],
  ],
  'subscriber' => [
    'landing_page'  => '/profile',
    'permissions'   => [
      'view_users'
    ],
  ]
]);


/**
 * Auth view files
 */
define('AUTH_VIEWS', [
  'sign-up'           => 'sign-up.phtml',
  'login'             => 'login.phtml',
  'forgot-password'   => 'forgot-password.phtml',
  'reset-password'    => 'reset-password.phtml',
  'verify-account'    => 'verify-account.phtml',
  'dashboard'         => 'dashboard.phtml',
]);


/**
 * Auth email templates
 */
define('AUTH_EMAIL_TEMPLATES', [
  'account-verification'   => 'account-verification.phtml',
  'password-reset-request' => 'password-reset-request.phtml',
  'throttle-reset-request' => 'throttle-reset.phtml',
  'new-login-alert'        => 'new-login-alert.phtml',
]);
