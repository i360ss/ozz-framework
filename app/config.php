<?php
/**
 * User Roles
 */
return [
  'auth_config' => [
    'login_path'        => '/login',
    'signup_path'       => '/sign-up',
    'auth_controller'   => 'AuthController',
    'users_table'       => 'user_management',
    'id_field'          => 'user_id',
    'username_field'    => 'username',
    'email_field'       => 'email',
    'password_field'    => 'password',
    'status_field'      => 'status',
    'role_field'        => 'role',
    'email_template'    => 'verification-mail.html',
    'allowed_fields'    => [
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
    ],
    'user_roles' => [
      'admin' => [
        'landing_page'  => 'admin/dashboard',
      ],
      'subscriber' => [
        'landing_page'  => 'dashboard',
      ]
    ],
  ],
];
