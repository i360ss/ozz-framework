<?php
use Ozz\Core\Router;
use Ozz\Core\Request;
use Ozz\Core\Response;
use Ozz\Core\Auth;

/**
 * Uncomment below route if you using Ozz CMS
 */
// Router::get('/{slug}', function(Request $request) {
//   if (get_post($request->urlParam('slug'))) {
//     get_cms_page($request->urlParam('slug'));
//   } else {
//     return render_error_page();
//   }
// });

Router::get('/', function(){
  $data = [
    'greeting' => 'Welcome to <span>ozz</span>',
    'caption' => 'A simplest and light-weight PHP micro framework with built-in CMS',
    'button' => [
      'text' => 'Documentation',
      'link' => '#'
    ]
  ];

  return view('welcome', $data);
});

Router::get('/api', function(){
  return json( [ 'name' => 'John Doe', 'age' => 26 ] );
});