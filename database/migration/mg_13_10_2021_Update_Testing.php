<?php
use Ozz\Core\system\migration\Schema;

class Update_Testing {
  
  public function up(){
    Schema::addColumns('testing', [
      'member' => ['str:200']
    ]);

    
    Schema::updateColumns('testing', [
      'first_name' => ['rename:name'],
      'email_test' => ['rename:email']
    ]);
    
    
    Schema::dropColumns('testing', [
      // 
    ]);
  }
}