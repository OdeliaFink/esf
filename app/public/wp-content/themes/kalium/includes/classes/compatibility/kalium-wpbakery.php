<?php
/**
 * Kalium WordPress Theme
 *
 * WPBakery Page Builder compatibility class.
 *
 * @author Laborator
 * @link   https://kaliumtheme.com
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Direct access not allowed.
}

class Kalium_WPBakery {

	/**
	 * Current admin page.
	 *
	 * @var string
	 */
	public $admin_page;

	/**
	 * Registered lightbox items to parse as JavaScript.
	 *
	 * @var array
	 */
	public $lightbox_items = [];

	/**
	 * Class instructor, define necessary actions.
	 *
	 * @return void
	 */
	public function __construct() {
		if ( ! kalium()->is->wpb_page_builder_active() || ! class_exists( 'Vc_Manager' ) ) {
			return;
		}

		// Template redirect
		add_action( 'template_redirect', [ $this, 'template_redirect' ], 100 );

		// Row wrapper
		add_filter( 'vc_shortcode_output', [ $this, 'vc_row' ], 100, 3 );

		// Inner row full-width support
		add_filter( 'vc_after_init', [ $this, 'vc_inner_row_params' ], 100 );
		add_filter( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, [ $this, 'vc_inner_row_class' ], 100, 3 );

		// Lightbox support for single and gallery images elements
		add_action( 'vc_after_init', [ $this, 'vc_lightbox_option_for_image_elements' ] );
		add_filter( 'vc_shortcode_output', [ $this, 'register_lightbox_items' ], 100, 3 );
		add_action( 'wp_footer', [ $this, 'parse_registered_lightbox_items' ] );

		// Lightbox support for grid items
		add_filter( 'vc_gitem_add_link_param', [ $this, 'vc_grid_item_lightbox_option' ] );
		add_filter( 'vc_gitem_zone_image_block_link', [ $this, 'vc_grid_item_lightbox_link' ], 100, 3 );

		// Frontend Edit modify admin bar link title
		add_action( 'admin_bar_menu', [ $this, '_admin_bar_button_frontend_edit' ], 1001 );

		// Add retina param for Single Image element
		add_action( 'vc_after_init', [ $this, '_vc_single_image_retina_param' ] );
		add_filter( 'vc_shortcode_output', [ $this, 'vc_single_image_retina_width' ], 100, 3 );

		// Add lazy load param for Single Image element
		add_action( 'vc_after_init', [ $this, 'vc_image_lazyload_attr' ] );
		add_filter( 'vc_shortcode_output', [ $this, 'vc_image_lazyload' ], 100, 3 );

		// Disable Font Awesome from WPBakery
		add_action( 'vc_base_register_front_css', [ $this, '_deregister_font_awesome' ], 100 );

		// Theme plugin mode
		add_action( 'admin_init', [ $this, '_vc_theme_plugin_mode_option' ], 0 );

		if ( $this->is_theme_plugin_mode() ) {
			add_action( 'vc_before_init', 'vc_set_as_theme' );
			add_action( 'vc_before_init', [ $this, '_disable_updater' ] );
			add_action( 'admin_footer', [ $this, '_hide_promo_popups' ] );
			add_filter( 'vc_single_param_edit_holder_output', [ $this, '_vc_hide_ai_icon' ] );
			add_filter( 'transient_wpb_notice_list', [ $this, '_vc_hide_notices' ] );
		}
	}

	/**
	 * Frontend Edit modify admin bar link title
	 *
	 * @param WP_Admin_Bar $wp_admin_bar
	 */
	public function _admin_bar_button_frontend_edit( $wp_admin_bar ) {
		if ( $node = $wp_admin_bar->get_node( 'vc_inline-admin-bar-link' ) ) {
			$node->title = 'Edit Frontend';
			$wp_admin_bar->add_node( get_object_vars( $node ) );
		}
	}

	/**
	 * Retina param for Single Image element.
	 *
	 * @since 3.1
	 */
	public function _vc_single_image_retina_param() {
		vc_add_param( 'vc_single_image', [
			'type'        => 'checkbox',
			'heading'     => 'Retina image',
			'param_name'  => 'retina_image',
			'description' => 'Enabling this option will reduce the size of image for 50%, example if image is 500x500 it will be 250x250.',
			'value'       => [
				'Yes' => 'yes',
			],
		] );
	}

	/**
	 * Lazy load option for Single Image element.
	 *
	 * @since 3.4
	 */
	public function vc_image_lazyload_attr() {
		foreach ( [ 'vc_gallery', 'vc_single_image' ] as $shortcode ) {
			vc_add_param( $shortcode, [
				'type'        => 'checkbox',
				'heading'     => 'Lazy load',
				'param_name'  => 'lazy_load',
				'description' => 'Enable lazy loading for this image (only if browser supports this natively)',
				'value'       => [
					'Yes' => 'yes',
				],
			] );
		}
	}

	/**
	 * Disable updater, our theme provides updates for this plugin.
	 *
	 * @since 3.4
	 */
	public function _disable_updater() {
		vc_manager()->disableUpdater();
	}

	/**
	 * Deregister Font Awesome from WPBakery, theme already includes it.
	 *
	 * @since 3.4
	 */
	public function _deregister_font_awesome() {
		wp_deregister_style( 'vc_font_awesome_5' );
	}

	/**
	 * Theme-plugin mode option.
	 */
	public function _vc_theme_plugin_mode_option() {
		$theme_plugin_mode_field_name = 'kalium_wpb_theme_plugin_mode';

		$field_callback = function () use ( $theme_plugin_mode_field_name ) {
			$checked = get_option( $theme_plugin_mode_field_name, true );

			if ( vc_license()->isActivated() ) {
				$checked  = false;
				$disabled = true;
			}
			?>
            <label>
                <input type="checkbox"<?php checked( $checked );
				disabled( $disabled ?? false ); ?> value="1"
                       id="<?php echo esc_attr( $theme_plugin_mode_field_name ); ?>"
                       name="<?php echo esc_attr( $theme_plugin_mode_field_name ); ?>">
				<?php esc_html_e( 'Enable', 'js_composer' ); ?>
            </label><br/>
            <p class="description indicator-hint">The theme automatically provides WPBakery plugin updates. If you hold
                a WPBakery license and intend to apply it to this site, please turn off this feature.</p>
			<?php
		};

		register_setting( 'wpb_js_composer_settings_general', $theme_plugin_mode_field_name, [ 'sanitize_callback' => 'kalium_validate_boolean' ] );
		add_settings_field( $theme_plugin_mode_field_name, 'Theme plugin mode', $field_callback, 'vc_settings_general', 'wpb_js_composer_settings_general' );

		// Create option with default value
		add_option( 'kalium_wpb_theme_plugin_mode', true );
	}

	/**
	 * Hide AI icon from param type.
	 *
	 * @param string $output
	 *
	 * @return string
	 */
	public function _vc_hide_ai_icon( $output ) {
		return str_replace( 'class="vc_ui-icon-ai"', 'class="vc_ui-icon-ai hidden" style="display:none"', $output );
	}

	/**
	 * Hide promo popups.
	 */
	public function _hide_promo_popups() {
		global $pagenow;

		if ( 'post.php' === $pagenow ) {
			echo '<style>#vc_ui-helper-promo-popup {display: none !important;}</style>';
		}
	}

	/**
	 * Hide several VC notices.
	 *
	 * @return array
	 */
	public function _vc_hide_notices() {
		return [ 'empty_api_response' => true ];
	}

	/**
	 * Row wrapper.
	 *
	 * @param $output
	 * @param $object
	 * @param $atts
	 *
	 * @return string
	 */
	public function vc_row( $output, $object, $atts ) {

		static $use_container;

		if ( ! isset( $use_container ) ) {
			$use_container = ! is_singular( 'post' );

			// In portfolio it is not allowed as well, only in WPBakery Portfolio item type
			if ( is_singular( 'portfolio' ) ) {
				$use_container = 'type-7' === kalium_get_field( 'item_type' );
			}
		}

		// VC Section and Row
		if ( in_array( $object->settings( 'base' ), [ 'vc_section', 'vc_row' ] ) ) {
			$row_container_classes = [ 'vc-row-container' ];

			// Row width
			if ( empty( $atts['full_width'] ) ) {

				// Applied to valid pages or post types only
				if ( $use_container ) {
					$row_container_classes[] = 'container';
				}
			} // Stretch row
			else if ( 'stretch_row' == $atts['full_width'] ) {

				// Applied to valid pages or post types only
				if ( $use_container ) {
					$row_container_classes[] = 'container';
				}
			} // Stretch row and content
			else if ( 'stretch_row_content' == $atts['full_width'] ) {
				$row_container_classes[] = 'vc-row-container--stretch-content';
			} // Stretch row and content (no spaces)
			else if ( 'stretch_row_content_no_spaces' == $atts['full_width'] ) {
				$row_container_classes[] = 'vc-row-container--stretch-content-no-spaces';
			}

			// Custom classes
			if ( ! empty( $atts['el_class'] ) ) {
				$classes = explode( ' ', $atts['el_class'] );

				foreach ( $classes as $class ) {
					$row_container_classes[] = "parent--{$class}";
				}
			}

			// Wrap the row
			$output = sprintf( '<div class="%2$s">%1$s</div>', $output, kalium()->helpers->list_classes( $row_container_classes ) );
		}

		return $output;
	}

	/**
	 * Inner row params.
	 *
	 * @return void
	 */
	public function vc_inner_row_params() {
		$container_type = [
			'type'        => 'dropdown',
			'heading'     => 'Container type',
			'param_name'  => 'container_type',
			'std'         => 'fixed',
			'value'       => [
				'Fluid container' => 'fluid',
				'Fixed container' => 'fixed',
			],
			'description' => 'Fluid container will expand to 100% of column size, while fixed container will keep defined screen sizes and aligned on center.',
			'weight'      => 1
		];

		vc_add_param( 'vc_row_inner', $container_type );
	}

	/**
	 * Inner row class.
	 *
	 * @param array $classes
	 * @param string $base
	 * @param array $atts
	 *
	 * @return string
	 */
	public function vc_inner_row_class( $classes, $base = '', $atts = [] ) {

		// Row stretch class
		if ( 'vc_row' === $base ) {

			// Stretched row
			if ( ! empty( $atts['full_width'] ) && 'stretch_row' === $atts['full_width'] ) {
				$classes .= ' row-stretch';

			}
		} // Inner row
        elseif ( 'vc_row_inner' === $base ) {

			// Fixed container
			if ( empty( $atts['container_type'] ) || 'fixed' === $atts['container_type'] ) {

				// Applied to pages only
				if ( is_page() ) {
					$classes .= ' container-fixed';
				}
			}
		}

		return $classes;
	}

	/**
	 * Add retina image size in frontend.
	 *
	 * @param $output
	 * @param $object
	 * @param $atts
	 *
	 * @return string
	 *
	 * @since 3.1
	 */
	public function vc_single_image_retina_width( $output, $object, $atts ) {

		// Single Image element with retina image checked option
		if ( 'vc_single_image' === $object->settings( 'base' ) && 'yes' === kalium_get_array_key( $atts, 'retina_image' ) && preg_match( '/<img .*?width="(?<width>[0-9]{2,})"/', $output, $matches ) ) {
			return str_replace( '<img ', '<img style="max-width:' . round( intval( $matches['width'] ) / 2 ) . 'px" ', $output );
		}

		return $output;
	}

	/**
	 * Add lazy load attribute for image.
	 *
	 * @param $output
	 * @param $object
	 * @param $atts
	 *
	 * @return string
	 *
	 * @since 3.4
	 */
	public function vc_image_lazyload( $output, $object, $atts ) {

		// Single Image element with retina image checked option
		if ( in_array( $object->settings( 'base' ), [ 'vc_gallery', 'vc_single_image' ] ) ) {
			$lazy_load = 'yes' === kalium_get_array_key( $atts, 'lazy_load' );

			if ( $lazy_load ) {
				return str_replace( '<img', '<img loading="lazy"', $output );
			}
		}

		return $output;
	}

	/**
	 * Lightbox option for Single Image, Gallery Images and Images carousel elements.
	 *
	 * @return void
	 */
	public function vc_lightbox_option_for_image_elements() {

		// Elements that support this "action" attribute
		foreach (
			[
				'vc_single_image'    => 'onclick',
				'vc_gallery'         => 'onclick',
				'vc_images_carousel' => 'onclick'
			] as $element_id => $attribute_id
		) {
			$param = WPBMap::getParam( $element_id, $attribute_id );

			// Add to select list
			if ( ! empty( $param ) && is_array( $param ) ) {
				$param['value']['Open in theme default lightbox (use Kalium\'s built-in lightbox for videos and images)'] = 'kalium_lightbox';
				vc_update_shortcode_param( $element_id, $param );
			}
		}
	}

	/**
	 * Add lightbox param as link for grid items.
	 *
	 * @param array $param
	 *
	 * @return array
	 */
	public function vc_grid_item_lightbox_option( $param ) {
		$param['value']['Open in theme default lightbox (use Kalium\'s built-in lightbox for videos and images)'] = 'kalium_lightbox';

		return $param;
	}

	/**
	 * Grid item lightbox link.
	 *
	 * @param $image_block
	 * @param $link
	 * @param $css_class
	 *
	 * @return string
	 */
	public function vc_grid_item_lightbox_link( $image_block, $link, $css_class ) {
		if ( 'kalium_lightbox' === $link ) {

			// Lightbox library
			kalium_enqueue_lightbox_library();

			$css_class .= ' kalium-lightbox-entry';

			return '<a {{ post_image_url_href }} class="' . esc_attr( $css_class ) . '" title="{{ post_title }}"></a>';
		}

		return $image_block;
	}

	/**
	 * Register lightbox items to use with theme default lightbox.
	 *
	 * @param $output
	 * @param $object
	 * @param $atts
	 *
	 * @return string
	 */
	public function register_lightbox_items( $output, $object, $atts ) {
		static $container_id = 1;

		$base = $object->settings( 'base' );

		// Single image
		if ( 'vc_single_image' === $base && ! empty( $atts['image'] ) && 'kalium_lightbox' === kalium_get_array_key( $atts, 'onclick' ) ) {
			$this->lightbox_items[] = [
				'container' => $container_id,
				'tag'       => $base,
				'image'     => wp_get_attachment_image_url( $atts['image'], 'original' )
			];

			$output = preg_replace( '#\<div# ', '<div data-lightbox-container="' . $container_id . '" ', $output, 1 );
			$container_id ++;
		} // Gallery images
		else if ( ( 'vc_gallery' === $base || 'vc_images_carousel' === $base ) && ! empty( $atts['images'] ) && 'kalium_lightbox' === kalium_get_array_key( $atts, 'onclick' ) ) {
			$images = [];

			foreach ( explode( ',', $atts['images'] ) as $attachment_id ) {
				$images[] = wp_get_attachment_image_url( $attachment_id, 'original' );
			}

			$this->lightbox_items[] = [
				'container' => $container_id,
				'tag'       => $base,
				'images'    => $images
			];

			$output = preg_replace( '#\<div# ', '<div data-lightbox-container="' . $container_id . '" ', $output, 1 );
			$container_id ++;
		} // VC Basic grid
		else if ( 'vc_basic_grid' === $base ) {
		}

		return $output;
	}

	/**
	 * Parse registered items for.
	 *
	 * @return void
	 */
	public function parse_registered_lightbox_items() {
		if ( ! empty( $this->lightbox_items ) ) {

			// Lightbox library
			kalium_enqueue_lightbox_library();

			// Entries global
			kalium_define_js_variable( 'kalium_wpb_lightbox_items', $this->lightbox_items );
		}
	}

	/**
	 * Dequeue isotope, our theme includes it.
	 *
	 * @return void
	 */
	public function template_redirect() {
		wp_dequeue_style( 'isotope' );
	}

	/**
	 * Checks if WPBakery is used as theme-plugin mode.
	 *
	 * @return bool
	 */
	public function is_theme_plugin_mode() {
		if ( function_exists( 'vc_license' ) && vc_license()->isActivated() ) {
			return false;
		}

		return get_option( 'kalium_wpb_theme_plugin_mode', true );
	}
}
