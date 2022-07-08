<?php
namespace App\model;

use Ozz\Core\Auth;
use Ozz\Core\Database;

class HomeModel extends Database {

  protected function getUser($username){
    $email = $this->DB->select('dabian', 'email', ['name' => $username]);
    return $email;
  }

}
