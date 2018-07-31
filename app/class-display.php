<?php

namespace Wisteria;

class Display {

	public function __construct() {
		add_shortcode( 'wrm_roadmap', array( __CLASS__, 'display_roadmap' ) );
	}

	public static function display_roadmap( $atts ) {
		$atts  =shortcode_atts( array(
			'roadmap_id' => 0,
		), $atts );

		if ( ! $atts['roadmap_id'] ) {
			return '';
		}

		$roadmap = get_term( $atts['roadmap_id'], CPT::ROADMAP_TAX_SLUG );

		return <<<HTML
<div id="wisteria-roadmap">
	Wisteria App Loading
</div>
<script type="text/javascript">
	var wrm_roadmap = {
		roadmap_id: {$roadmap->term_id},
		
	}
</script> 
HTML;
	}
}
