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
      'name' => 'txt|max:3',
      'email_addr' => 'email|max:2|bool'
    ]);

    dump($validate);

    return view('blog', $this->data);
  }
}
