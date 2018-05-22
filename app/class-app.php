<?php

namespace Wisteria;

use WPAZ_Plugin_Base\V_2_6\Abstract_Plugin;

/**
 * Class App
 */
class App extends Abstract_Plugin {

	public static $autoload_class_prefix = __NAMESPACE__;
	protected static $current_file = __FILE__;
	public static $autoload_type = 'psr-4';
	// Set to 2 when you use 2 namespaces in the main app file
	public static $autoload_ns_match_depth = 1;

	public function onload( $instance ) {
		new Cpt();
		new Meta();
		new Api\Base();
	} // END public function __construct

	public function init() {
		do_action( get_called_class() . '_before_init' );
		do_action( get_called_class() . '_after_init' );
	}

	public function authenticated_init() {
		if ( is_user_logged_in() ) {
			// Ready for wp-admin - but not required
			//$this->admin = new Admin/App( $this );
		}
	}

	protected function defines_and_globals() {
		// None yet.
	}

} // END class
