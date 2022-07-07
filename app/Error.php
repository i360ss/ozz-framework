<?php
// Print All Error Messages which is need to be visible to client-side

# Username Error Messages
define('USERNAME_ERR', array(
    "invalid"   => "Invalid Username",
    "required"  => "Email address is required",
    "string"    => "Username must be a string",
    "minLength" => "Username should contain at least 6 characters",
    "maxLength" => "Username's max length is 30 characters",
    "email"     => "Username must be an email address",
    "default"   => "Username error"
));


# Password Error Messages
define('PASSWORD_ERR', array(
    "invalid"   => "Invalid Passwords",
    "required"  => "Password is required",
    "string"    => "Password must be string",
    "minLength" => "Password should contain at least 6 characters",
    "maxLength" => "Password's max length is 30 characters",
    "default"   => "password error"
));


# Media Error Messages
define('MEDIA_ERR', array(
    "noFiles" => "No files selected to upload",
    "commenError" => "Error on uploading your file",
    "maxImageSize" => "The file you are trying to upload is too large",
    "invalidFormat" => "The file format will not support",
    "imageUploadSuccess" => "Image Uploaded successfully",
    "fileUploadSuccess" => "File Uploaded successfully",
    "imageAlreadyExist" => "The file you are tring to upload is already exist",
));