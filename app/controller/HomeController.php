<?php
namespace App\controller;

use Ozz\Core\Help;
use Ozz\Core\Request;
use Ozz\Core\Router;

use App\model\HomeModel;

class HomeController extends HomeModel {

  public function index(Request $request){

    $name = $request->urlParam('name');
    $data = new HomeModel;
    
    $data = $data->getUser($name);
    $data['str'] = "<a href='test'>test@gmail.com</a> <a href=`test`>test@gmail.com</a>";
    // $data['str'] = "Test";
    // $data['str'] = "user/test. com?user=456#";
    // $data['str'] = "https;//www.w3schoo��ls.co�m/er";
    // $data['str'] = 'https://stackoverflow.com/questions/4744888?test=how-to-properly-url-encode-a-string-in-php#78';

    // return Router::view('home', $data);
    return view('home', $data);
  }

}
