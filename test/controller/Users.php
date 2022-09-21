<?php
namespace App\controller;

use Ozz\Core\Controller;
use Ozz\Core\Request;

use App\model\Users as UserModel;

class Users extends Controller {

  public function index(){

    $data = [];

    /**
     * Accessing Databases from Model and pass to controller (Best Practice)
     */
    // $users = new UserModel;
    // $data = $users->getAll();


    /**
     * Accessing Databases directly from controller (Bad Practice)
     */
    // $test1 = $this->DB(null, 'sqlite')->select('dabian', '*');  // A SqLite DB
    // $test2 = $this->DB()->select('dabian', '*');                // Primary DB
    // $test3 = $this->DB('ozz_v2')->select('user', '*');          // Another DB from same connection

    // $data = [ $test1, $test2, $test3 ];

    return view('users', $data);
  }

}
