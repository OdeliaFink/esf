<?php
/**
 * Kalium WordPress Theme
 *
 * Slider Revolution compatibility class.
 *
 * @author Laborator
 * @link   https://kaliumtheme.com
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Direct access not allowed.
}

class Kalium_Slider_Revolution {

	/**
	 * Current admin page.
	 *
	 * @var string
	 */
	public $admin_page;

	/**
	 * Required plugin for this class.
	 *
	 * @var array
	 */
	public static $plugins = [
		'revslider/revslider.php',
	];

	/**
	 * Class instructor, define necessary actions.
	 *
	 * @return void
	 */
	public function __construct() {

		// Set as theme
		if ( function_exists( 'set_revslider_as_theme' ) ) {
			set_revslider_as_theme();
		}
	}
}
