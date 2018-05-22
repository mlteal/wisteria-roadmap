<?php

namespace Wisteria\Api;

use Wisteria\Cpt;
use Wisteria\Meta;

class Items extends \WP_REST_Posts_Controller {

	protected $post_type;
	/**
	 * Instance of a post meta fields object.
	 *
	 * @since 4.7.0
	 * @var WP_REST_Post_Meta_Fields
	 */
	protected $meta;

	public function __construct() {
		$this->namespace = Base::NAMESPACE;
		$this->rest_base = 'items';
		$this->post_type = Cpt::CPT_SLUG;

		$this->meta = new \WP_REST_Post_Meta_Fields( $this->post_type );
	}

	public function register_routes() {
		register_rest_route( $this->namespace, $this->rest_base, array(
			'methods'  => 'GET',
			'callback' => array( $this, 'get_items' ),
		) );

		register_rest_route( $this->namespace, '/' . $this->rest_base . '/(?P<id>[\d]+)', array(
			'args' => array(
				'id' => array(
					'description' => __( 'Unique identifier for the object.' ),
					'type'        => 'integer',
				),
			),
//			array(
//				'methods'             => WP_REST_Server::READABLE,
//				'callback'            => array( $this, 'get_item' ),
//				'permission_callback' => array( $this, 'get_item_permissions_check' ),
//				'args'                => $get_item_args,
//			),
			array(
				'methods'  => \WP_REST_Server::EDITABLE,
				'callback' => array( $this, 'update_item' ),
//				'permission_callback' => array( $this, 'update_item_permissions_check' ),
			),
//			array(
//				'methods'             => WP_REST_Server::DELETABLE,
//				'callback'            => array( $this, 'delete_item' ),
//				'permission_callback' => array( $this, 'delete_item_permissions_check' ),
//				'args'                => array(
//					'force' => array(
//						'type'        => 'boolean',
//						'default'     => false,
//						'description' => __( 'Whether to bypass trash and force deletion.' ),
//					),
//				),
//			),
		) );
	}

	public function get_items( $request ) {
		$response = [];
		$args     = array(
			'post_type'      => Cpt::CPT_SLUG,
			'posts_per_page' => 1000,
		);

		/** @var \WP_Query $items */
		$items = new \WP_Query( $args );
		$items = $items->get_posts();

		if ( empty( $items ) ) {
			return $response;
		}

		/** @var \WP_Post $item */
		foreach ( $items as $item ) {
			$terms = wp_get_post_terms( $item->ID, Cpt::TAX_SLUG );
			$group = ! empty( $terms ) ? $terms[0]->term_id : 0;
			$start = new \DateTime( get_post_meta( $item->ID, Meta::$start_slug, true ) );
			$end   = new \DateTime( get_post_meta( $item->ID, Meta::$end_slug, true ) );

			$response[] = array(
				'id'         => $item->ID,
				'group'      => $group,
				'title'      => esc_attr( $item->post_title ),
				'start_time' => $start->getTimestamp(),
				'end_time'   => $end->getTimestamp(),
			);
		}

		return $response;
	}

	/**
	 * @param \WP_REST_Request $request
	 *
	 * @return \WP_Error|\WP_REST_Request
	 */
	public function update_item( $request ) {
		$url_params = $request->get_url_params();
		$body       = json_decode( $request->get_body(), true );

		if ( empty( $url_params['id'] ) ) {
			return new \WP_Error( 422, 'Missing required parameters' );
		}

		/** @var \WP_Post $post */
		$post = get_post( $url_params['id'] );

		if ( empty( $post ) ) {
			return new \WP_Error( 404, 'Item not found' );
		}

		if ( empty( $body ) ) {
			return new \WP_Error( 422, 'Missing required parameters' );
		}

		if ( isset( $body['title'] ) && $body['title'] != $post->post_title ) {
			$post->post_title = $body['title'];

			wp_update_post( $post );
		}

		/**
		 * TODO: terms currently don't update properly
		 */
		$post_terms   = wp_get_post_terms( $post->ID, Cpt::TAX_SLUG );
		$current_term = ! empty( $post_terms[0]->term_id ) ? $post_terms[0]->term_id : 0;
		
		error_log( 'current term ' . var_export( $current_term, true ) );

		if ( isset( $body['group'] ) && ( empty( $current_term ) || $body['group'] !== $current_term ) ) {
			$set_term = wp_set_post_terms( $post->ID, $body['group'], Cpt::TAX_SLUG );

			error_log( 'set term ' . var_export( $set_term, true ) );

			// attempt to unset current term
			if ( ! empty( $current_term ) ) {
				$remove = wp_remove_object_terms( $post->ID, $current_term, Cpt::TAX_SLUG );
				error_log( 'remove term ' . var_export( $remove, true ) );
			}
		}

		$start = Meta::update_start_time( (int) $url_params['id'], $body['start_time'] );
		error_log( 'start ' . var_export( $start, true ) );
		
		$end = Meta::update_end_time( (int) $url_params['id'], $body['end_time'] );
		error_log( 'end ' . var_export( $end, true ) );

		return new \WP_REST_Response( null, 200 );
	}
}
