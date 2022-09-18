<?php
namespace App\controller;

use Ozz\Core\Help;
use Ozz\Core\Request;
use App\model\User as UserModel;

class User {

  public function index(){
    
    $data = new UserModel;
    
    return view('user', [
      'name' => 'Shakir',
      'age' => 26,
      'data' => $data->all()
    ]);
  }

}
