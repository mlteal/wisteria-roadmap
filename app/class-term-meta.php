<?php

namespace Wisteria;

class Term_Meta {
	const SELECT_ROADMAP_KEY = 'wrm_roadmap';

	public function __construct() {
		// Add New Term fields
		add_action( CPT::PROJECT_TAX_SLUG . '_add_form_fields', array( __CLASS__, 'roadmaps_dropdown' ), 10, 1 );

		// Edit Existing Term fields
		add_action( CPT::PROJECT_TAX_SLUG . '_edit_form_fields', array(
			__CLASS__,
			'roadmaps_dropdown',
		), 10, 1 );

		// Save Term Meta fields
		add_action( 'create_' . CPT::PROJECT_TAX_SLUG, array( __CLASS__, 'save_roadmaps_dropdown' ), 10, 1 );
		add_action( 'edited_' . CPT::PROJECT_TAX_SLUG, array( __CLASS__, 'save_roadmaps_dropdown' ), 10, 1 );
	}

	/**
	 * @param \WP_Term $current_term
	 *
	 * @return string
	 */
	static function roadmaps_dropdown( $current_term = null ) {
		if ( ! empty( $current_term->term_id ) ) {
			$selected_term_id = get_term_meta( $current_term->term_id, self::SELECT_ROADMAP_KEY, true );
		} else {
			$selected_term_id = 0;
		}

		$roadmaps = get_terms( array(
			'taxonomy' => CPT::ROADMAP_TAX_SLUG,
			'hide_empty' => false,
		) );

		if ( empty( $roadmaps ) ) {
			return 'Please set up a roadmap so you can attach projects to it!';
		}

		$term_key = self::SELECT_ROADMAP_KEY;

		// setup output
		$output = <<<HTML
		<div class="form-field $term_key-meta">
<label for="$term_key">Roadmap</label>
 <select id="$term_key" name="$term_key" class="postform">
<option value=""></option>
HTML;

		/** @var \WP_Term $term */
		foreach ( $roadmaps as $term ) {
			$selected = ! empty( $selected_term_id ) ? selected( (int) $selected_term_id, $term->term_id, false ) : '';
			$output   .= '<option value="' . $term->term_id . '" ' . $selected . '>' . $term->name . '</option>';
		}

		$output .= '</select></div>';

		echo $output;
	}

	static function save_roadmaps_dropdown( $term_id ) {
		if ( ! empty( $_POST[ self::SELECT_ROADMAP_KEY ] ) ) {
			update_term_meta( $term_id, self::SELECT_ROADMAP_KEY, (int) $_POST[ self::SELECT_ROADMAP_KEY ] );
		}
	}

}
