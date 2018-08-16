<?php
/**
 * Plugin Name: Wisteria Roadmap
 * Author: mlteal
 * Plugin URI: https://github.com/mlteal/wisteria-roadmap
 * Text Domain: ml-wrm
 * Version: 0.1.4
 */

//avoid direct calls to this file, because now WP core and framework has been used
if ( ! function_exists( 'add_filter' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}
// Create plugin instance on plugins_loaded action to maximize flexibility of wp hooks and filters system.
include_once 'vendor/autoload.php';
include_once 'app/class-app.php';
Wisteria\App::run( __FILE__ );
