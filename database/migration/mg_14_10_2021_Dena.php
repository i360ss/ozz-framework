<?php
// Run: [ php ozz -h migration ] to more info
use Ozz\Core\system\migration\Schema;

class Dena {
  
  public function up(){
    Schema::createTable('dena', [
      
      'id'          => ['int', 'ai', 'primary'],
      'name'        => ['str:150'],
      'email'       => ['str:150'],
      'password'    => ['txt'],
      'status'      => ['bool'],
      'timestamp'   => ['datetime'],
      
    ]);
  }
  
  public function down(){
    Schema::dropTable('dena');
  }
}