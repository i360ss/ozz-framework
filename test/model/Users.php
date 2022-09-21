<?php
namespace App\model;

use Ozz\Core\Model;

class Users extends Model {

  public $table = 'dabian';

  public function getAll() {
    
    $data = [];
    
    /**
     * Connecting and accessing data from multiple databases
     */

    // $test1 = $this->DB(null, 'sqlite')->select($this->table, '*');   // A SqLite DB
    // $test2 = $this->DB()->select('dabian', '*');                     // Primary DB
    // $test3 = $this->DB('ozz_v2')->select('user', '*');               // Another DB from same connection
    
    // $data = [ $test1, $test2, $test3 ];

    return $data;
  }

}
