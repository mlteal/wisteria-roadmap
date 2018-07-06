<?php

namespace Wisteria;

class Meta {
	static $start_slug = 'wrm_item_start';
	static $end_slug = 'wrm_item_end';

	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'admin_scripts' ) );
		add_action( 'add_meta_boxes', array( __CLASS__, 'add_meta_box' ) );
		add_action( 'save_post', array( __CLASS__, 'save_metaboxes' ) );
	}

	public static function add_meta_box() {
		add_meta_box( 'additional-page-metabox-options', esc_html__( 'Metabox Controls', 'wrm' ), array(
			__CLASS__,
			'metabox_controls',
		), Cpt::CPT_SLUG, 'normal', 'low' );
	}

	public static function metabox_controls( $post ) {
		$meta             = get_post_meta( $post->ID );
		$start_time = ! empty( $meta[ Meta::$start_slug ][0] ) ? new \DateTime( $meta[ Meta::$start_slug ][0] ) : '';
		$start_time = is_object( $start_time ) ? $start_time->format( 'F j, Y' ) : $start_time;
		$end_time   = ! empty( $meta[ Meta::$end_slug ][0] ) ? new \DateTime( $meta[ Meta::$end_slug ][0] ) : '';
		$end_time   = is_object( $end_time ) ? $end_time->format( 'F j, Y' ) : $end_time;

		wp_nonce_field( 'wrm_control_meta_box', 'wrm_control_meta_box_nonce' ); // Always add nonce to your meta boxes!
		?>
		<style type="text/css">
			.post_meta_extras p {
				margin: 20px;
			}

			.post_meta_extras label {
				display: block;
				margin-bottom: 10px;
			}

			.post_meta_extras .left-part {
				display: inline-block;
				width: 45%;
				margin-right: 30px;
				vertical-align: top;
			}

			.post_meta_extras .right-part {
				display: inline-block;
				width: 46%;
				vertical-align: top;
			}
		</style>
		<div class="post_meta_extras">

			<div class="left-part">
				<p>
					<label for="<?php echo static::$start_slug; ?>">
						<?php esc_html_e( 'Start date', 'wrm' ); ?>
					</label>
					<input type="text" id="<?php echo static::$start_slug; ?>" name="<?php echo static::$start_slug; ?>"
						   value="<?php echo esc_attr( $start_time ); ?>"/>
				</p>
			</div>
			<div class="right-part">
				<p>
					<label for="<?php echo static::$end_slug; ?>">
						<?php esc_html_e( 'End date', 'wrm' ); ?>
					</label>
					<input type="text" id="<?php echo static::$end_slug; ?>" name="<?php echo static::$end_slug; ?>"
						   value="<?php echo esc_attr( $end_time ); ?>"/>
				</p>
			</div>
		</div>
		<script type="text/javascript">
			jQuery( document ).ready( function( $ ) {
				jQuery( '#<?php echo static::$start_slug; ?>' ).datepicker();
				jQuery( '#<?php echo static::$end_slug; ?>' ).datepicker();
			} );
		</script>
		<?php
	}

	public static function save_metaboxes( $post_id ) {
		/*
		 * We need to verify this came from the our screen and with proper authorization,
		 * because save_post can be triggered at other times. Add as many nonces, as you
		 * have metaboxes.
		 */
		if (
			! isset( $_POST['wrm_control_meta_box_nonce'] )
			|| ! wp_verify_nonce( sanitize_key( $_POST['wrm_control_meta_box_nonce'] ), 'wrm_control_meta_box' )
		) { // Input var okay.
			return $post_id;
		}

		// Check the user's permissions.
		if ( isset( $_POST['post_type'] ) && Cpt::CPT_SLUG === $_POST['post_type'] ) {
			if ( ! current_user_can( 'edit_page', $post_id ) ) {
				return $post_id;
			}
		} else {
			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				return $post_id;
			}
		}

		/*
		 * If this is an autosave, our form has not been submitted,
		 * so we don't want to do anything.
		 */
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return $post_id;
		}

		/* Ok to save */
		if ( isset( $_POST[ Meta::$start_slug ] ) ) {
			static::update_start_time( $post_id, $_POST[ Meta::$start_slug ] );
		}

		if ( isset( $_POST[ Meta::$end_slug ] ) ) {
			static::update_end_time( $post_id, $_POST[ Meta::$end_slug ] );
		}
	}

	public static function update_start_time( $post_id, $start_time ) {
		if ( ! is_int( $start_time ) ) {
			$start_time = sanitize_text_field( wp_unslash( $start_time ) );
			$start_time = new \DateTime( $start_time );
		} else {
			$start_time = \DateTime::createFromFormat('U', (string) $start_time );
		}

		return update_post_meta( $post_id, Meta::$start_slug, $start_time->format( 'Y-m-d H:i:s' ) );
	}

	public static function update_end_time( $post_id, $end_time ) {
		if ( ! is_int( $end_time ) ) {
			$end_time = sanitize_text_field( wp_unslash( $end_time ) );
			$end_time = new \DateTime( $end_time );
		} else {
			$end_time = \DateTime::createFromFormat('U', (string) $end_time );
		}


		return update_post_meta( $post_id, Meta::$end_slug, $end_time->format( 'Y-m-d H:i:s' ) );
	}

	public static function admin_scripts() {
		wp_enqueue_script( 'jquery-ui-datepicker' );
		wp_register_style( 'jquery-ui', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css' );
		wp_enqueue_style( 'jquery-ui' );
	}
}
