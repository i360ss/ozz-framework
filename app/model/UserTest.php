<?php
namespace Ozz\app\model;

use Ozz\Core\Auth;
use Ozz\Core\Database;

class UserTest extends Database {

  protected function index(){
    $content = $this->DB->select();
  }

}
