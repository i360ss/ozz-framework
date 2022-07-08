<?php
namespace App\controller;

use Ozz\Core\Help;
use Ozz\Core\Request;

class UserTest {

  public function index(){
    
    return view('userTest', ['username' => 'John']);
  }

}
