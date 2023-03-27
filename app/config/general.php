<?php
// General Configurations

// Charset
define('CHARSET', 'utf-8');

// Session Driver (Available options: file, memory)
define('SESSION_DRIVER', 'file');

// Session name
define('SESSION_COOKIE_NAME', 'ozz_session');

// Refresh session ID after this time (seconds)
define('SESSION_LIFETIME', 600);

// Session prefix
define('SESSION_PREFIX', 'ozz_sess_');

// File based session directory
define('SESSION_DIRECTORY', 'storage/session');

// Secret key for session encryption (only for file based sessions)
define('SESSION_SECRET_KEY', 'mdjCwNkkPKnlpnvseivs10kbbmtRl4d2OBPZLRLFvtdW7USnlyYdrki');

// Secure session cookie
define('SESSION_SECURE_COOKIE', true);

// HTTP only
define('SESSION_HTTP_ONLY', true);

// Session domain (default is origin)
define('SESSION_DOMAIN', '');

// Session path
define('SESSION_PATH', '/');

// Session same site
define('SESSION_SAME_SITE', '');

// CSRF Cookie lifetime (seconds)
define('CSRF_COOKIE_LIFETIME', 600);

// Page cache lifetime (seconds)
define('PAGE_CACHE_LIFETIME', false);

// Minify HTML output
define('MINIFY_HTML', false);

// Ozz Exception handler
define('OZZ_EXCEPTION_HANDLER', true);

// Error log
define('ERROR_LOG', false);

// Default Database Engine
define('DB_DEFAULT_ENGINE', 'InnoDB');

// Default Database Collation
define('DB_DEFAULT_COLLATION', 'utf8mb4_unicode_520_ci');

// Default Database Charset
define('DB_DEFAULT_CHARSET', 'utf8mb4');

?>