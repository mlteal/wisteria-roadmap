<?php

namespace Wisteria;

class Cpt {
	const CPT_SLUG = 'wrm_item';
	const TAX_SLUG = 'wrm_project';

	public function __construct() {
		add_action( 'init', array( __CLASS__, 'register_cpt' ) );
		add_action( 'init', array( __CLASS__, 'register_taxonomy' ) );
	}

	public static function register_cpt() {
		$labels = array(
			'name'                  => _x( 'Items', 'Post Type General Name', 'ml-wrm' ),
			'singular_name'         => _x( 'Roadmap Item', 'Post Type Singular Name', 'ml-wrm' ),
			'menu_name'             => __( 'Roadmap Items', 'ml-wrm' ),
			'name_admin_bar'        => __( 'Roadmap items', 'ml-wrm' ),
			'archives'              => __( 'Item Archives', 'ml-wrm' ),
			'attributes'            => __( 'Item Attributes', 'ml-wrm' ),
			'parent_item_colon'     => __( 'Parent Item:', 'ml-wrm' ),
			'all_items'             => __( 'All Items', 'ml-wrm' ),
			'add_new_item'          => __( 'Add New Item', 'ml-wrm' ),
			'add_new'               => __( 'Add New', 'ml-wrm' ),
			'new_item'              => __( 'New Item', 'ml-wrm' ),
			'edit_item'             => __( 'Edit Item', 'ml-wrm' ),
			'update_item'           => __( 'Update Item', 'ml-wrm' ),
			'view_item'             => __( 'View Item', 'ml-wrm' ),
			'view_items'            => __( 'View Items', 'ml-wrm' ),
			'search_items'          => __( 'Search Item', 'ml-wrm' ),
			'not_found'             => __( 'Not found', 'ml-wrm' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'ml-wrm' ),
			'featured_image'        => __( 'Featured Image', 'ml-wrm' ),
			'set_featured_image'    => __( 'Set featured image', 'ml-wrm' ),
			'remove_featured_image' => __( 'Remove featured image', 'ml-wrm' ),
			'use_featured_image'    => __( 'Use as featured image', 'ml-wrm' ),
			'insert_into_item'      => __( 'Insert into item', 'ml-wrm' ),
			'uploaded_to_this_item' => __( 'Uploaded to this item', 'ml-wrm' ),
			'items_list'            => __( 'Items list', 'ml-wrm' ),
			'items_list_navigation' => __( 'Items list navigation', 'ml-wrm' ),
			'filter_items_list'     => __( 'Filter items list', 'ml-wrm' ),
		);
		$args   = array(
			'label'               => __( 'Roadmap Item', 'ml-wrm' ),
			'description'         => __( 'Roadmap items', 'ml-wrm' ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'comments', 'revisions', 'custom-fields' ),
			'taxonomies'          => array( 'project' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_position'       => 5,
			'menu_icon'           => 'dashicons-chart-area',
			'show_in_admin_bar'   => true,
			'show_in_nav_menus'   => true,
			'can_export'          => true,
			'has_archive'         => true,
			'exclude_from_search' => false,
			'publicly_queryable'  => true,
			'capability_type'     => 'post',
		);
		register_post_type( static::CPT_SLUG, $args );
	}

	public static function register_taxonomy() {

		$labels = array(
			'name'                       => _x( 'Projects', 'Taxonomy General Name', 'ml-wrm' ),
			'singular_name'              => _x( 'Project', 'Taxonomy Singular Name', 'ml-wrm' ),
			'menu_name'                  => __( 'Projects', 'ml-wrm' ),
			'all_items'                  => __( 'All Projecta', 'ml-wrm' ),
			'parent_item'                => __( 'Parent Item', 'ml-wrm' ),
			'parent_item_colon'          => __( 'Parent Item:', 'ml-wrm' ),
			'new_item_name'              => __( 'New Project', 'ml-wrm' ),
			'add_new_item'               => __( 'Add New Project', 'ml-wrm' ),
			'edit_item'                  => __( 'Edit Project', 'ml-wrm' ),
			'update_item'                => __( 'Update Project', 'ml-wrm' ),
			'view_item'                  => __( 'View Project', 'ml-wrm' ),
			'separate_items_with_commas' => __( 'Separate items with commas', 'ml-wrm' ),
			'add_or_remove_items'        => __( 'Add or remove items', 'ml-wrm' ),
			'choose_from_most_used'      => __( 'Choose from the most used', 'ml-wrm' ),
			'popular_items'              => __( 'Popular Items', 'ml-wrm' ),
			'search_items'               => __( 'Search Items', 'ml-wrm' ),
			'not_found'                  => __( 'Not Found', 'ml-wrm' ),
			'no_terms'                   => __( 'No projects', 'ml-wrm' ),
			'items_list'                 => __( 'Items list', 'ml-wrm' ),
			'items_list_navigation'      => __( 'Items list navigation', 'ml-wrm' ),
		);
		$args   = array(
			'labels'            => $labels,
			'hierarchical'      => false,
			'public'            => true,
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_nav_menus' => true,
			'show_tagcloud'     => false,
		);
		register_taxonomy( static::TAX_SLUG, array( static::CPT_SLUG ), $args );
	}
}
