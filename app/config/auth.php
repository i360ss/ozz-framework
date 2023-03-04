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
 * Default forgot password URL
 */
define('AUTH_FORGOT_PASSWORD_PATH', '/forgot-password');


/**
 * Default reset password URL
 */
define('AUTH_RESET_PASSWORD_PATH', '/reset-password');


/**
 * Default email verification URL
 */
define('AUTH_EMAIL_VERIFY_PATH', '/verify-account');


/**
 * Default auth controller
 */
define('AUTH_CONTROLLER', 'AuthController');


/**
 * Auth Middleware Name
 */
define('AUTH_MIDDLEWARE_NAME', 'AuthMiddleware.php');


/**
 * User database table
 */
define('AUTH_USERS_TABLE', 'user');


/**
 * User meta database table
 */
define('AUTH_META_TABLE', 'user_meta');


/**
 * User log table
 */
define('AUTH_LOG_TABLE', 'user_log');


/**
 * Automatically activate account and login once registered successfully
 * This will work only if verification mail disabled
 */
define('AUTH_ACTIVATE_AND_LOGIN_ONCE_SIGNUP', true);


/**
 * Send Email verification on signup
 */
define('AUTH_SEND_VERIFICATION_MAIL', false);


/**
 * Send Email notification if user signed in from a different IP/Device/OS/Browser
 */
define('AUTH_NEW_LOGIN_ALERT', true);


/**
 * Send Email notification if password changed
 */
define('AUTH_PASSWORD_CHANGED_ALERT', true);


/**
 * Logout if password changed
 */
define('AUTH_LOGOUT_ON_PASSWORD_CHANGE', true);


/**
 * Password reset link expire in
 * Should be defined in seconds
 */
define('PASSWORD_RESET_LINK_EXPIRE_IN', 60*30);


/**
 * Password reset and change throttle
 */
define('AUTH_PASSWORD_RESET_THROTTLE', [
  'ENABLE'        => true,
  'MAX_ATTEMPTS'  => 3,
  'PERIOD'        => 60*10,
  'DELAY_TIME'    => 60
]);


/**
 * User Login throttle
 */
define('AUTH_LOGIN_THROTTLE', [
  'ENABLE'        => true,
  'MAX_ATTEMPTS'  => 3,
  'PERIOD'        => 60*2,
  'DELAY_TIME'    => 60
]);


/**
 * User table core fields
 */
define('AUTH_CORE_FIELDS', [
  'ID_FIELD'             => 'user_id',
  'USERNAME_FIELD'       => 'username',
  'EMAIL_FIELD'          => 'email',
  'PASSWORD_FIELD'       => 'password',
  'FIRST_NAME_FIELD'     => 'first_name',
  'LAST_NAME_FIELD'      => 'last_name',
  'STATUS_FIELD'         => 'status',
  'ROLE_FIELD'           => 'role',
  'ACTIVATION_KEY_FIELD' => 'activation_key',
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
  'new-login-alert'        => 'new-login-alert.phtml',
  'register-alert'         => 'register-alert.phtml',
  'password-changed-alert' => 'password-changed-alert.phtml', // Not done yet
]);

?>