<?php
// Default Validation Configurations

/**
 * Default Input validations
 */
define('DEFAULT_INPUT_VALIDATION', [
  'name'            => ['req', 'string'],
  'username'        => ['req', 'string'],
  'email'           => ['req', 'email' ],
  'password'        => ['req', 'max:30', 'min:5', 'string'],
  'confirmPassword' => ['req', 'match:password'],
  'test'            => ['req', 'float']
]);

/**
 * Default File validation
 */
define('DEFAULT_FILE_VALIDATION', [
  'image'           => ['1M', 'jpg|jpeg|png|webp'],
  'document'        => ['500k', 'pdf|docx|txt|csv|ttf|otf'],
  'audio'           => ['6M', 'mp3'],
  'video'           => ['12M', 'mp4'],
  'font'            => ['60K', 'ttf|otf']
]);

?>