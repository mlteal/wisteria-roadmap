<?php

namespace Wisteria\Api;

class Base {
	const NAMESPACE = 'wisteria/v1';

	public function __construct() {
		add_action( 'rest_api_init', array($this, 'init') );

		/**
		 * Only from certain origins
		 */
		add_action( 'rest_api_init', array($this, 'access_control'), 15 );
	}

	public function init() {
		$items = new Items();
		$items->register_routes();
		$projects = new Projects();
		$projects->register_routes();
	}

	public function access_control() {
		remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
		add_filter( 'rest_pre_serve_request', function( $value ) {

			$origin = get_http_origin();
			$allowed = array(
				'http://localhost:3000',
				'http://roadmap.test',
			);

			// TODO: only allow Localhost if the current site url is the test local site
			if ( $origin && in_array( $origin, $allowed ) ) {
				header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
				header( 'Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, PATCH, DELETE' );
				header( 'Access-Control-Allow-Credentials: true' );
			}

			return $value;

		});
	}
}
