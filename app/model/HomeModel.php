<?php
namespace App\model;

use Ozz\Core\Auth;
use Ozz\Core\Database;

class HomeModel extends Database {

  protected function getUser($username){
    $email = $this->DB->select('dabian', ['email', 'name', 'password'], ['name' => $username]);

    $this->DB->select('dabian', 'email', ['name' => 'test']);

    return $email;
  }

}
