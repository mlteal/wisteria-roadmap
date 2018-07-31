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
		register_rest_route( $this->namespace, '(?P<roadmap_id>[\d]+)/' . $this->rest_base, array(
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
			),
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_item' ),
				'permission_callback' => array( $this, 'create_item_permissions_check' ),
				'args'                => array(),
			),
		) );

		register_rest_route( $this->namespace, '/' . $this->rest_base . '/(?P<id>[\d]+)', array(
			'args' => array(
				'id' => array(
					'description' => __( 'Unique identifier for the object.' ),
					'type'        => 'integer',
				),
			),
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_item' ),
				'permission_callback' => array( $this, 'get_item_permissions_check' ),
			),
			array(
				'methods'             => 'PATCH',
				'callback'            => array( $this, 'update_item' ),
				'permission_callback' => array( $this, 'manage_items_permissions_check' ),
			),
			array(
				'methods'             => 'DELETE',
				'callback'            => array( $this, 'delete_item' ),
				'permission_callback' => array( $this, 'manage_items_permissions_check' ),
				'args'                => array(
					'force' => array(
						'type'        => 'boolean',
						'default'     => false,
						'description' => __( 'Whether to bypass trash and force deletion.' ),
					),
				),
			),
		) );
	}

	public function get_items( $request ) {
		$url_params = $request->get_url_params();

		if ( empty( $url_params['roadmap_id'] ) ) {
			return new \WP_Error( 422, 'Missing required parameters' );
		}

		$response = [];
		$args     = array(
			'post_type'      => Cpt::CPT_SLUG,
			'posts_per_page' => 1000,
			'tax_query'      => array(
				array(
					'taxonomy' => CPT::ROADMAP_TAX_SLUG,
					'field'    => 'term_id',
					'terms'    => (int) $url_params['roadmap_id'],
				),
			),
		);

		/** @var \WP_Query $items */
		$items = new \WP_Query( $args );
		$items = $items->get_posts();

		if ( empty( $items ) ) {
			return $response;
		}

		/** @var \WP_Post $item */
		foreach ( $items as $item ) {
			$terms            = wp_get_post_terms( $item->ID, Cpt::PROJECT_TAX_SLUG );
			$group            = ! empty( $terms ) ? $terms[0]->term_id : 0;
			$start_time       = get_post_meta( $item->ID, Meta::$start_slug, true );
			$end_time         = get_post_meta( $item->ID, Meta::$end_slug, true );
			$percent_complete = get_post_meta( $item->ID, Meta::$percent_complete_slug, true );
			$percent_complete = empty( $percent_complete ) ? 0 : $percent_complete;

			// In case we somehow recorded a bad date ¯\_(ツ)_/¯ skip it?
			try {
				$start = new \DateTime( $start_time );
				$end   = new \DateTime( $end_time );
			} catch ( \Exception $e ) {
				error_log( 'bad item start time ' . $item->ID . ': ' . var_export( $start_time, true ) );
				error_log( 'bad item end time ' . $item->ID . ': ' . var_export( $end_time, true ) );

				continue;
			}


			$response[] = array(
				'id'               => $item->ID,
				'group'            => $group,
				'title'            => str_replace( '"', "'", html_entity_decode( esc_html( $item->post_title ), ENT_QUOTES ) ),
				'description'      => str_replace( '"', "'", html_entity_decode( esc_html( $item->post_content ), ENT_QUOTES ) ),
				'percent_complete' => $percent_complete,
				'start_time'       => $start->getTimestamp(),
				'end_time'         => $end->getTimestamp(),
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
	 *
	 * @return true|\WP_Error True if the request has read access, \WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		$post_type = get_post_type_object( $this->post_type );

		if ( ! current_user_can( $post_type->cap->read ) ) {
			return new \WP_Error( 'rest_forbidden_context', __( 'Sorry, you are not allowed to see posts in this post type.' ), array( 'status' => rest_authorization_required_code() ) );
		}

		return true;
	}

	public function manage_items_permissions_check( $request ) {

		$post_type = get_post_type_object( $this->post_type );

		if ( ! current_user_can( $post_type->cap->edit_posts ) ) {
			return new \WP_Error( 'rest_forbidden_context', __( 'Sorry, you are not allowed to see posts in this post type.' ), array( 'status' => rest_authorization_required_code() ) );
		}

		return true;
	}

	public function get_item( $request ) {
		$url_params = $request->get_url_params();

		if ( empty( $url_params['id'] ) ) {
			return new \WP_Error( 422, 'Missing required parameters' );
		}

		/** @var \WP_Post $post */
		$post = get_post( $url_params['id'] );

		if ( empty( $post ) ) {
			return new \WP_Error( 404, 'Item not found' );
		}


		$terms            = wp_get_post_terms( $post->ID, Cpt::PROJECT_TAX_SLUG );
		$group            = ! empty( $terms ) ? $terms[0]->term_id : 0;
		$start            = new \DateTime( get_post_meta( $post->ID, Meta::$start_slug, true ) );
		$end              = new \DateTime( get_post_meta( $post->ID, Meta::$end_slug, true ) );
		$percent_complete = get_post_meta( $post->ID, Meta::$percent_complete_slug, true );
		$percent_complete = empty( $percent_complete ) ? 0 : $percent_complete;

		return array(
			'id'               => $post->ID,
			'group'            => $group,
			'title'            => str_replace( '"', "'", html_entity_decode( esc_html( $post->post_title ), ENT_QUOTES ) ),
			'description'      => $post->post_content_filtered,
			'start_time'       => $start->getTimestamp(),
			'end_time'         => $end->getTimestamp(),
			'percent_complete' => $percent_complete,
		);
	}

	/**
	 * @param \WP_REST_Request $request
	 *
	 * @return \WP_Error|\WP_REST_Request
	 */
	public function create_item( $request ) {
		$url_params = $request->get_url_params();

		if ( empty( $url_params['roadmap_id'] ) ) {
			return new \WP_Error( 422, 'Missing required parameters' );
		}

		$body = json_decode( $request->get_body(), true );

		if (
			empty( $body['title'] )
			|| empty( $body['group'] )
			|| empty( $body['start_time'] )
			|| empty( $body['end_time'] )
		) {
			return new \WP_Error( 422, 'Missing required parameters' );
		}

		// TODO: Verify that start and end times are valid, sensible dates before updating
		$start_time       = $body['start_time'];
		$end_time         = $body['end_time'];
		$percent_complete = isset( $body['percent_complete'] ) ? (int) $body['percent_complete'] : 0;
		$post_args        = array(
			'post_author'           => get_current_user_id(), // TODO: Capture the currently logged in user for author
			'post_content'          => '',
			'post_content_filtered' => '',
			'post_title'            => $body['title'],
			'post_status'           => 'publish',
			'post_type'             => Cpt::CPT_SLUG,
			'meta_input'            => array(
				Meta::$start_slug            => $start_time,
				Meta::$end_slug              => $end_time,
				Meta::$percent_complete_slug => $percent_complete,
			),
		);

		// Create the post
		$post_id = wp_insert_post( $post_args );

		if ( empty( $post_id ) ) {
			return new \WP_Error( 400, 'There was an error creating the item.' );
		}

		$terms = wp_set_post_terms( $post_id, array( $url_params['roadmap_id'] ), Cpt::ROADMAP_TAX_SLUG );

		if ( is_wp_error( $terms ) ) {
			return new \WP_Error( 400, 'There was an error adding the item to a project.' );
		}

		$terms = wp_set_post_terms( $post_id, array( $body['group'] ), Cpt::PROJECT_TAX_SLUG );

		if ( is_wp_error( $terms ) ) {
			return new \WP_Error( 400, 'There was an error adding the item to a project.' );
		}

		return new \WP_REST_Response( $post_id, 201 );
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

		$post_terms   = wp_get_post_terms( $post->ID, Cpt::PROJECT_TAX_SLUG );
		$current_term = ! empty( $post_terms[0]->term_id ) ? $post_terms[0]->term_id : 0;

		if ( isset( $body['group'] ) && ( empty( $current_term ) || $body['group'] !== $current_term ) ) {

			wp_set_post_terms( $post->ID, array( $body['group'] ), Cpt::PROJECT_TAX_SLUG );

			// attempt to unset current term
			if ( ! empty( $current_term ) ) {
				wp_remove_object_terms( $post->ID, $current_term, Cpt::PROJECT_TAX_SLUG );
			}
		}

		// TODO: Verify that start and end times are valid, sensible dates before updating
		Meta::update_start_time( (int) $url_params['id'], $body['start_time'] );
		Meta::update_end_time( (int) $url_params['id'], $body['end_time'] );
		Meta::update_percent_complete( (int) $url_params['id'], $body['percent_complete'] );

		return new \WP_REST_Response( null, 200 );
	}

	/**
	 * @param \WP_REST_Request $request
	 *
	 * @return \WP_Error|\WP_REST_Request
	 */
	public function delete_item( $request ) {
		$url_params = $request->get_url_params();
		$body       = json_decode( $request->get_body(), true );
		$force      = false;

		if ( empty( $url_params['id'] ) ) {
			return new \WP_Error( 422, 'Missing required parameters' );
		}

		if ( isset( $body['force'] ) && $body['force'] === true ) {
			$force = true;
		}

		wp_delete_post( $url_params['id'], $force );

		return new \WP_REST_Response( null, 204 );
	}
}
