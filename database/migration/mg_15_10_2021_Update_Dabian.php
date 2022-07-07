<?php
use Ozz\Core\system\migration\Schema;

class Update_Dabian {
  
  public function up(){
    Schema::addColumns('dabian', [
      // 
    ]);

    
    Schema::updateColumns('dabian', [
      'status' => ['str', 'default:0'],
      'first_name' => ['rename:name']
    ]);
    
    
    Schema::dropColumns('dabian', [
      // 
    ]);
  }
}