<?php
use Ozz\Core\system\migration\Schema;

class Update_David_table {
  
  public function up(){
    Schema::addColumns('david_table', [
      // 'shakir' => ['str:100', 'nn']
    ]);

    
    Schema::updateColumns('david_table', [
      'shakir' => ['str:100', 'null'],
      'status' => ['int'],
      'password' => ['blob']
    ]);
    
    
    Schema::dropColumns('david_table', [
      // 
    ]);
  }
}