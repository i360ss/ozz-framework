<?php
namespace App\controller;

use Ozz\Core\Help;
use Ozz\Core\Request;
use Ozz\Core\Router;

use App\model\HomeModel;

class HomeController extends HomeModel {

  public function index(Request $request){

    $name = $request->urlParam('name');
    $data = $this->getUser($name);
    
    
    // Errors handle
    global $errors;
    $errors->set('email', 'Invalid Email address');
    $errors->set('username', 'Invalid Username');
    set_error('address', 'Invalid Address');
    dump( $errors->all );

    
    
    return view('home', $data);
  }

}
