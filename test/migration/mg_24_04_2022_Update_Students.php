<?php
use Ozz\Core\system\migration\Schema;

class Update_Students {
  
  public function up(){
    Schema::addColumns('students', [
      'nationality' => ['str:150']
    ]);

    
    Schema::updateColumns('students', [
      // 
    ]);
    
    
    Schema::dropColumns('students', [
      // 
    ]);
  }
}