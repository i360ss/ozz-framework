<?php
namespace App\controller;

use Ozz\Core\Help;
use Ozz\Core\Request;
use Ozz\Core\Router;

class ErrorTest {

  public $d;

  function __construct() {
    $this->d = [
      Help::isPost(),
      Help::getPath(),
    ];
  }



  public function index(Request $request) {  
    return view('form');
  }


  
  public function getForm(Request $req) {
    if ($req->input('email') == 'Jamedsmith@gmail.com') {
      set_error('email', 'Email error Flash session Success');
      set_error('pass', 'Password error Flash session Success');
    } else {
      set_error('email', 'Email error Flash session Danger');
      set_error('pass', 'Password error Flash session Danger');
    }
    
    return Router::redirect('form');
  }

}
