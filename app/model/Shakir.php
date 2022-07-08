<?php
namespace App\model;

use Ozz\Core\Auth;
use Ozz\Core\Database;

class Shakir extends Database {
    
  private $DB;

  function __construct(){
    $conn = $this->mysql();
  }

}
