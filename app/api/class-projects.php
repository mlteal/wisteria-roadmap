<?php

namespace Wisteria\Api;

use Wisteria\Cpt;

class Projects extends \WP_REST_Controller {

	public function __construct() {
		$this->namespace = Base::NAMESPACE;
		$this->rest_base = 'projects';
	}

	public function register_routes() {
		register_rest_route( $this->namespace, $this->rest_base, array(
			'methods'  => 'GET',
			'callback' => array( $this, 'get_items' ),
		) );
	}

	public function get_items( $request ) {
		$response = [];
		$args     = array(
			'taxonomy'   => Cpt::TAX_SLUG,
			'hide_empty' => false,
		);

		/** @var \WP_Query $items */
		$terms = get_terms( $args );

		if ( empty( $terms ) ) {
			return $response;
		}

		/** @var \WP_Term $term */
		foreach ( $terms as $term ) {
			$response[] = array(
				'id'         => $term->term_id,
				'title'      => esc_attr( $term->name ),
			);
		}

		return $response;
	}
}
