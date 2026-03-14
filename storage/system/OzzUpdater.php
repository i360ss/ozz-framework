<?php
class OzzUpdater {
  use \Ozz\Core\system\log\Ozz_log_data;

  protected $package = 'ozz/core';
  protected $composer = __DIR__.'/../../composer.phar';
  protected $logs = [];

  protected function log($message, $type = 'info') {
    $colors = [
      'success' => '#16a34a',
      'error'   => '#dc2626',
      'info'    => '#2563eb'
    ];
    $color = $colors[$type] ?? '#000';
    $this->logs[] = "<div style='color:{$color};font-family:monospace'>{$message}</div>";
  }


  /**
  * Get installed version
  */
  public function getInstalledVersion() {
    $lockFile = __DIR__.'/../../composer.lock';
    if (!file_exists($lockFile)) {
      return null;
    }
    $data = json_decode(file_get_contents($lockFile), true);
    foreach ($data['packages'] as $package) {
      if ($package['name'] === $this->package) {
        return ltrim($package['version'], 'v');
      }
    }

    return null;
  }


  /**
  * Get latest version
  */
  public function getLatestVersion() {
    $url = "https://repo.packagist.org/p2/{$this->package}.json";

    // Temporarily suppress warnings
    set_error_handler(function() { /* ignore */ });
    $json = file_get_contents($url);
    restore_error_handler();

    if (!$json) return null;

    $data = json_decode($json, true);
    if (!isset($data['packages'][$this->package][0]['version'])) {
      return null;
    }

    return $data['packages'][$this->package][0];
  }


  /**
  * Check if update available
  */
  public function isUpdateAvailable() {
    $installed = $this->getInstalledVersion();
    $latest = $this->getLatestVersion() ? ltrim($this->getLatestVersion()['version'], 'v') : false;
    if (!$installed || !$latest) {
      return false;
    }

    return version_compare($latest, $installed, '>');
  }


  /**
  * Run update
  */
  public function runUpdate() {
    try {
      $this->log("Starting framework update...", "info");
      $this->runComposerUpdate();
      $this->publishFiles();
      $this->runMigrations();
      $this->log("Framework update completed successfully ✓ 🥳", "success");

      // Log update on app log SQLite
      ozz_log_save('ozz_logs', [
        'type' => 'success',
        'key' => 'ozz_update',
        'value' => implode("", $this->logs),
        'updated_by' => auth_email(),
        'updated_at' => date('Y-m-d H:i:s')
      ]);

      return json([
        'success' => true,
        'message' => implode("", $this->logs)
      ]);

    } catch (Exception $e) {
      $this->log($e->getMessage(), "error");

      ozz_log_save('ozz_logs', [
        'type' => 'error',
        'key' => 'ozz_update',
        'value' => implode("", $this->logs),
        'updated_by' => auth_email(),
        'updated_at' => date('Y-m-d H:i:s')
      ]);

      return json([
        'success' => false,
        'message' => implode("", $this->logs)
      ]);
    }
  }


  /**
  * Composer update
  */
  protected function runComposerUpdate() {
    $this->log("Running composer update...", "info");
    set_time_limit(0);
    ini_set('memory_limit', '512M');
    ini_set('max_execution_time', 0);
    chdir(realpath(__DIR__.'/../../')); // Move to root

    $cmd = 'php '
      . escapeshellarg($this->composer)
      . ' update '
      . escapeshellarg($this->package)
      . ' --with-dependencies 2>&1';
    exec('php '.escapeshellarg($this->composer).' clear-cache');
    exec($cmd, $output, $result);

    foreach ($output as $line) {
      $this->log($line);
    }

    if ($result !== 0) {
      throw new Exception("Composer update failed");
    }

    $this->log("Composer update finished ✓", "success");
  }


  /**
  * Publish framework files
  */
  protected function publishFiles() {
    $src = __DIR__.'/../../vendor/ozz/core/src/system/content-holder/';
    $root = __DIR__.'/../../';
    if (!is_dir($src)) {
      $this->log("No publish directory found. Skipping...", "info");
      return;
    }

    $this->recursiveCopy($src.'cms/as/', $root.env('app', 'PUBLIC_DIR').'/assets/admin/'); // Admin assets
    $this->recursiveCopy($src.'cms/c/', $root.'cms/controller/'); // CMS Controllers
    $this->recursiveCopy($src.'cms/v/', $root.'cms/view/'); // CMS View files
    $this->recursiveCopy($src.'cms/md/', $root.'app/middleware/'); // CMS Middlewares
    $this->recursiveCopy($src.'cms/mg/', $root.'database/migration/', 'mg_'.date('YmdHis').'_', false, true); // Copy migration files with prefix
    copy( $src.'cms/cms-route.php', $root.'cms/cms-route.php' ); // Copy route file
    $this->log("Framework files published ✓", "success");
  }


  /**
  * Run migrations
  */
  protected function runMigrations() {
    $this->log("Running migrations...", "info");
    chdir(realpath(__DIR__.'/../../')); // Go to root
    $cmd = "php ozz migrate 2>&1";
    exec($cmd, $output, $result);
    foreach ($output as $line) {
      $line = preg_replace('/\e\[[0-9;]*m/', '', $line);
      $this->log($line);
    }
    if ($result !== 0) {
      throw new Exception("Migration failed");
    }
    $this->log("Migrations completed ✓", "success");
  }


  /**
  * Recursive copy
  */
  protected function recursiveCopy($src, $dst, $file_prefix = '', $overwrite=true, $checkOriginalName = false) {
    $dir = opendir($src);
    if (!is_dir($dst)) {
      mkdir($dst, 0755, true);
    }

    while (($file = readdir($dir)) !== false) {
      if ($file === '.' || $file === '..') continue;
      $srcFile = "$src/$file";
      $dstFile = rtrim($dst, '/') . '/' . $file_prefix . $file; // Destination file with prefix

      if (is_dir($srcFile)) {
        $this->recursiveCopy($srcFile, "$dst/$file", $file_prefix, $overwrite, $checkOriginalName);
      } else {
        // Check existence based on original filename, ignoring timestamp prefix
        if ($checkOriginalName) {
          $originalFiles = glob(rtrim($dst, '/') . '/*' . $file);
          if (!$overwrite && count($originalFiles) > 0) {
            $this->log("Skipped existing migration: $file", "info");
            continue;
          }
        }

        copy($srcFile, $dstFile);
        $this->log("Copied: $file_prefix$file", "success");
      }
    }
    closedir($dir);
  }
}