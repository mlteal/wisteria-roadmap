<?php

namespace Wisteria\Api;

use Wisteria\Cpt;

class Projects extends \WP_REST_Controller {

	public function __construct() {
		$this->namespace = Base::NAMESPACE;
		$this->rest_base = 'projects';
	}

	public function register_routes() {
		register_rest_route( $this->namespace, '(?P<roadmap_id>[\d]+)/' . $this->rest_base, array(
			'methods'  => 'GET',
			'callback' => array( $this, 'get_items' ),
			'permission_callback' => array( $this, 'get_items_permissions_check' ),
		) );
	}

	public function get_items( $request ) {
		$response = [];
		$args     = array(
			'taxonomy'   => Cpt::PROJECT_TAX_SLUG,
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

	/**
	 * Checks if a given request has access to read posts.
	 *
	 * @since 4.7.0
	 *
	 * @param  \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has read access, \WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {

		$post_type = get_post_type_object( Cpt::CPT_SLUG );

		if ( ! current_user_can( $post_type->cap->read ) ) {
			return new \WP_Error( 'rest_forbidden_context', __( 'Sorry, you are not allowed to see posts in this post type.' ), array( 'status' => rest_authorization_required_code() ) );
		}

		return true;
	}
}
