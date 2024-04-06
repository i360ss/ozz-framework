<?php
return [
  // General Config
  'CHARSET' => 'utf-8',
  'SESSION_DRIVER' => 'memory',
  'SESSION_LIFETIME' => 20000,
  'AUTH_USER_ROLES' => [
    'admin' => [
      'landing_page' => '/admin'
    ]
  ],
];