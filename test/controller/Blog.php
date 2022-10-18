<?php
namespace App\controller;

use Ozz\Core\Controller;
use Ozz\Core\Request;
use Ozz\Core\Validate;

class Blog extends Controller {

  private $data;

  function __construct() {
    $this->data = [
      'name' => 'shakir',
      'age' => 26
    ];
  }

  public function index(Request $req){
    $this->data['method'] = $req->method();
    
    return view('blog', $this->data);
  }



  /**
   * Test Validation
   */
  public function testValidation(Request $req){

    $validate = Validate::check($req->input(), [
      'name' => 'req|text|max:10|min:3',
      'password' => 'strong_password:8',
      'match_pass' => 'match:{name}',
      'email' => 'req|email'
    ]);

    dump($validate);

    return view('blog', $this->data);
  }
}
