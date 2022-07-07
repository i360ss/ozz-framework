<?php
namespace Ozz\app\controller;

use Ozz\Core\Help;
use Ozz\Core\Request;

class Page404 {

  public function content(){
    return [
      'title' => '404',
      'subtitle' => 'Page Not Found',
      'redirect_link' => [
        'title' => 'Go Home',
        'url' => '/home'
      ]
    ];
  }

}
