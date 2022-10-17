<?php
namespace App;

class Validator {
  
  # --------------------------------------------------
  // Define all your inputs and validation values here
  /*
  * required / req
  * string / txt
  * number / int
  * email / mail
  * max:10 (Max length)
  * min:6 (Min Length)
  * match:password (use this for password confirmation)
  */
  # --------------------------------------------------
  public static function FormFields(){
    return [
      'name'            => ['req', 'string'],
      'username'        => ['req', 'string'],
      'email'           => ['req', 'email' ],
      'password'        => ['req', 'max:30', 'min:5', 'string'],
      'confirmPassword' => ['req', 'match:password'],
      'test'            => ['req', 'float']
    ];
  }
  
  
  
  
  
  # --------------------------------------------------
  // Define all allowable file extensions
  /*
  * 1st value is the max size of uploading file (use M for megabyte, K for kilobyte)
  * 2nd value is valid extensions. Separate all valid extensions by "|"
  * Please make sure all file formats are defined in lowercase
  */
  # --------------------------------------------------
  public static function validExtensions(){
    return [
      'image'     => [ '1M', 'jpg|jpeg|png|svg' ],
      'document'  => [ '500k', 'pdf|docx|txt|csv|ttf|otf' ],
      'audio'     => [ '6M', 'mp3' ],
      'video'     => [ '12M', 'mp4' ],
      'font'      => [ '60K', 'ttf|otf' ]
    ];
  }
  
}