<?php
// Run: [ php ozz -h migration ] to more info
use Ozz\Core\system\migration\Schema;

class Students {
  
  public function up(){
    Schema::createTable('students', [
      
      'id'          => ['int', 'ai', 'primary'],
      'email'       => ['str:150', 'unique'],
      'name'        => ['str:150'],
      'password'    => ['txt'],
      'status'      => ['bool'],
      'timestamp'   => ['datetime'],
      
    ]);
  }
  
  public function down(){
    Schema::dropTable('students');
  }
}