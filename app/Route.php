<?php
use Ozz\Core\Router;
use Ozz\Core\Request;

Router::get('/', function(){
  $data = [
    'greeting' => 'Welcome to <span>ozz</span>',
    'caption' => 'A Simplest and Light-weight micro framework for PHP',
    'button' => [
      'text' => 'Documentation',
      'link' => '#'
    ]
  ];
  
  return view('welcome', $data);
});