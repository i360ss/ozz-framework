<?php
return [

  /**
   * All your application's translatable error messages should be here
   */

  'required' => 'This field is required',
  'boolean' => '(:value) is not a Boolean value',
  'text' => 'Field (:field) should contain only letters',
  'alpha_num' => 'Field :field should contain only letter letters and numbers characters',
  'safe_text' => 'Field (:field) contain invalid characters',
  'email' => 'Invalid Email Address',
  'phone' => 'Invalid Phone Number',
  'number' => '(:value) is not a Number',
  'string' => 'Invalid String',
  'url' => 'Invalid URL',
  'integer' => 'Invalid Integer',
  'float' => 'Field (:field) should be a float value',
  'max' => 'Field (:field) should not exceed :max characters',
  'min' => 'Field (:field) should contain at least :min characters',
  'match' => 'Field (:field) Not matching with field (:key)',
  'invalid_array_key' => 'Invalid array key provided',

  // Password Errors
  'normal_password' => 'Spaces are not allowed in password!',
  'strong_password_special_character' => 'Password should contain at least one special character!',
  'strong_password_numbers' => 'Password should contain at least one number!',
  'strong_password_uppercase' => 'Password should contain at least one uppercase letter!',
  'strong_password_lowercase' => 'Password should contain at least one lowercase letter!',
  'strong_password_character_length' => 'Password should contain at least :min characters!',
  
  // File Errors
  'file_required' => 'No files selected to upload',
  'file_max_count' => 'Too many Files selected to upload',
  'file_error' => 'Error on uploading your file',
  'file_too_large' => 'The file you are trying to upload is too large',
  'file_too_small' => 'The file you are trying to upload is too small',
  'file_invalid_format' => 'The file format will not support',
  'file_already_exist' => 'The file you are trying to upload is already exist',

  // Image
  'image_high_res' => 'Image width and/or height is too large',
  'image_low_res' => 'Image width and/or height is too small',

  // Auth Errors
  'registration_failed' => 'Registration failed!',
  'email_already_exist' => 'Email address is already registered. Please login to your account or try with another email',
  'username_already_exist' => 'Username already exist!',
  'unverified_account' => 'Please verify your email before login',
  'account_locked' => 'Your account is locked! Please contact support team',
  'account_locked_throttle' => 'Account locked! Please try again after :time or <a href="/forgot-password"><strong>reset your password</strong></a>',
  'login_failed' => 'Login failed',
  'invalid_username' => 'Cannot find a user with provided username or email',
  'invalid_password' => 'Invalid Password',
  'invalid_reset_token' => 'Invalid password reset token',

];