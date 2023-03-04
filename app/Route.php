<?php
use Ozz\Core\Router;
use Ozz\Core\Request;
use Ozz\Core\Response;
use Ozz\Core\Auth;

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

Router::get('/api', function(){
  $data = [
    'name' => 'John Doe',
    'age' => 26
  ];

  return json($data);
});