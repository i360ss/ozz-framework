<?php
use Ozz\Core\Router;
use Ozz\Core\Request;

Router::get('/', function(){
  $data = [
    'greeting' => 'Welcome to <span>ozz</span>',
    'username' => 'Shakir'
  ];
  
  return view('welcome', $data);
});