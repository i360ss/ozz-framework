<?php
// Run: [ php ozz -h migration ] to more info
use Ozz\Core\system\migration\Schema;

class User {
  
  public function up(){
    Schema::createTable('user', [
      
      'id'          => ['int', 'ai', 'primary'],
      'name'        => ['str:150'],
      'email'       => ['str:150', 'unique'],
      'password'    => ['txt'],
      'status'      => ['bool'],
      'timestamp'   => ['datetime'],
      
    ]);
  }
  
  public function down(){
    Schema::dropTable('user');
  }
}