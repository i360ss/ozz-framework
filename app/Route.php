<?php
use Ozz\Core\Router;
use Ozz\Core\Request;
use App\controller\FileController;
use App\controller\HomeController;
use App\controller\UserTest;
use App\controller\ErrorTest;

// Router::get('/', function(Request $request){
//   dump($request->all());
// });

Router::get('/', function(){
  $data = [
    'greeting' => 'Welcome to <span>ozz</span>',
    'username' => 'Shakir'
  ];
  
  return view('welcome', $data);
}, 'base/layout', ['auth']);


Router::get('/user/{name}', [UserTest::class, 'index'], 'base/base-layout', ['auth']);

Router::get('/home/{name}', [HomeController::class, 'index'], 'base/base-layout', ['auth']);

Router::get('/file', 'file', 'base/layout', ['auth']);

Router::get('/about', 'about', 'base/base-layout', ['auth']);

Router::post('/file', [FileController::class, 'uploadFile'], ['auth'], 'base/layout');

Router::get('/test', 'test', 'base/layout', ['auth']);
Router::get('/shakir', 'shakir', 'base/layout', ['auth']);

Router::get('/form', [ErrorTest::class, 'index'], 'base/base-layout', ['auth']);
Router::post('/form', [ErrorTest::class, 'getForm'], ['auth']);


// Router::postGroup(['auth'], [
//   '/file' => [FileController::class, 'uploadFile'],
//   '/login' => [LoginController::class, 'login_method'],
// ], 'base/layout');