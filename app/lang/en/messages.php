<?php
return [

  /**
   * All your application's translatable strings should be here
   */

  // File & upload related messages
  'image_upload_success' => 'Image Uploaded successfully!',
  'file_upload_success' => 'File Uploaded successfully!',
  
  // Auth related messages
  'signup_success' => 'You have signed up Successfully! <a href="/login">Login</a> to your account',
  'login_success' => 'You are logged in successfully!',
  'password_changed' => 'Your password has been changed successfully',
  'email_verification_mail_sent' => 'Registered successfully! Please check your email to verify your account',
  'password_reset_link_sent' => 'We have sent you a password reset link. Please check your email',

  // Email Notifications
  'email_verification_mail_title' => 'Verify Your Email Address!',
  'email_verification_mail_subject' => 'Email Verification - '.APP_NAME,
  'new_login_alert_mail_title' => 'Login from a new :what',
  'new_login_alert_mail_subject' => 'Login from a new :what',
  'new_login_alert_mail_message' => 'We found a login from new :what. :info Ignore the message if it was you.', // Need to remove this
  'password_reset_mail_title' => 'Password reset request',
  'password_reset_mail_subject' => 'Password reset request - '.APP_NAME,
  'password_changed_mail_title' => 'Your password has changed',
  'password_changed_mail_subject' => 'Your password has changed - '.APP_NAME,

];