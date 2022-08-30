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

    console_log('test', 'i');
    console_log('Message log test', 'w');
    console_log('Message log 12', 'e');

    console_log($data);
    
    
    return view('home', $data);
  }

}
