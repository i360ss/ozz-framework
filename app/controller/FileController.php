<?php
namespace App\controller;

use Ozz\Core\Help;
use Ozz\Core\Request;
use Ozz\Core\File;
use Ozz\Core\Router;

class FileController {

  public function uploadFile(Request $request){

    $files = $request->files();

    # Image Upload
    // $upload = File::upload('image', $files, null, [
    //   // 'ignore_source' => true,
    //   'quality' => 60,
    //   'rename' => 'avatar',
    //   'prefix' => 'pro-pic-',
    //   'mkdir' => true,
    //   'copies' => [
    //     [
    //       'dir' => 'thumb/',
    //       'width' => 100,
    //       'height' => 100,
    //       'quality' => 90,
    //       'rename' => 'random'
    //     ],
    //     [
    //       'width' => 400,
    //       'height' => 400,
    //       'quality' => 90,
    //       'rename' => 'shakir',
    //     ]
    //   ]
    // ]);


    # Video Upload
    // $upload = File::upload('video', $files, null, [
    //   'ignore_source' => true,
    //   'bitrate' => 700,
    //   'resolution' => '400x500',
    //   'rename' => 'avatar',
    //   'prefix' => 'pro-pic-',
    //   'mkdir' => true,
    // ]);


    # Document Upload
    // $upload = File::upload('document', $files, 'doc/test/', [
    //   'rename' => 'test',
    //   'prefix' => 'cv_',
    //   'mkdir' => true
    // ]);

    // $upload = File::upload('font', $files, null, [
    //   'rename' => 'zipfile',
    //   'prefix' => 'font_',
    //   // 'mkdir' => true
    // ]);


    # 5th parameter (Optional)
    /**
     * ARRAY => Max size & Allowed formats (should be Array ['max Size', 'jpg|png|jpeg'])
     * STRING => Only allowed extentions ('jpg|png|jpeg')
     */
    $upload = File::upload('image', $files, '/', null, ['5M', 'jpg|png|jpeg']);


    dump($upload);
    // return Router::view('file', $upload);
  }

}
