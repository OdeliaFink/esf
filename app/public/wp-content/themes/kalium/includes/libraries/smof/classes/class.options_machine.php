<?php

/**
 * SMOF Options Machine Class
 *
 * @package     WordPress
 * @subpackage  SMOF
 * @since       1.0.0
 * @author      Syamil MJ
 */
class Options_Machine {

	public $Inputs;
	public $Menu;
	public $Defaults;

	/**
	 * PHP5 contructor
	 *
	 * @since 1.0.0
	 */
	function __construct( $options ) {

		$return = $this->optionsframework_machine( $options );

		$this->Inputs   = $return[0];
		$this->Menu     = $return[1];
		$this->Defaults = $return[2];

	}

	/**
	 * Sanitize option
	 *
	 * Sanitize & returns default values if don't exist
	 *
	 * Notes:
	 * - For further uses, you can check for the $value['type'] and performs
	 * more speficic sanitization on the option
	 * - The ultimate objective of this function is to prevent the "undefined index"
	 * errors some authors are having due to malformed options array
	 */
	static function sanitize_option( $value ) {
		$defaults = [
			"name" => "",
			"desc" => "",
			"id"   => "",
			"std"  => "",
			"mod"  => "",
			"type" => ""
		];

		$value = wp_parse_args( $value, $defaults );

		return $value;

	}


	/**
	 * Process options data and build option fields
	 *
	 * @return array
	 * @since  1.0.0
	 *
	 * @uses   get_theme_mod()
	 *
	 * @access public
	 */
	public static function optionsframework_machine( $options ) {
		global $smof_output, $smof_details, $smof_data;
		if ( empty( $options ) ) {
			return;
		}
		if ( empty( $smof_data ) ) {
			$smof_data = of_get_options();
		}
		$data = $smof_data;

		$defaults    = [];
		$counter     = 0;
		$menu        = '';
		$output      = '';
		$update_data = false;

		do_action( 'optionsframework_machine_before', [
			'options'   => $options,
			'smof_data' => $smof_data,
		] );
		if ( $smof_output != "" ) {
			$output      .= $smof_output;
			$smof_output = "";
		}


		foreach ( $options as $value ) {

			// sanitize option
			if ( $value['type'] != "heading" ) {
				$value = self::sanitize_option( $value );
			}

			$counter ++;
			$val = '';

			//create array of defaults
			if ( $value['type'] == 'multicheck' ) {
				if ( is_array( $value['std'] ) ) {
					foreach ( $value['std'] as $i => $key ) {
						$defaults[ $value['id'] ][ $key ] = true;
					}
				} else {
					$defaults[ $value['id'] ][ $value['std'] ] = true;
				}
			} else {
				if ( isset( $value['id'] ) ) {
					$defaults[ $value['id'] ] = $value['std'];
				}
			}

			/* condition start */
			if ( ! empty( $smof_data ) || ! empty( $data ) ) {

				if ( array_key_exists( 'id', $value ) && ! isset( $smof_data[ $value['id'] ] ) ) {
					$smof_data[ $value['id'] ] = $value['std'];
					if ( $value['type'] == "checkbox" && $value['std'] == 0 ) {
						$smof_data[ $value['id'] ] = 0;
					} else {
						if ( 'theme_documentation' !== $value['id'] ) {
							#$update_data = true;
						}
					}
				}
				if ( array_key_exists( 'id', $value ) && ! isset( $smof_details[ $value['id'] ] ) ) {
					$smof_details[ $value['id'] ] = $smof_data[ $value['id'] ];
				}

				//Start Heading
				if ( $value['type'] != "heading" ) {
					$class = '';
					if ( isset( $value['class'] ) ) {
						$class = $value['class'];
					}

					//hide items in checkbox group
					$fold = '';
					if ( array_key_exists( "fold", $value ) ) {
						if ( isset( $smof_data[ $value['fold'] ] ) && $smof_data[ $value['fold'] ] ) {
							$fold = "f_" . $value['fold'] . " ";
						} else {
							$fold = "f_" . $value['fold'] . " temphide ";
						}
					}

					// Advanced Folding
					$afolds = '';

					if ( ! empty( $value['afolds'] ) ) {
						$afolds .= ' data-advanced-folding="' . $value['id'] . '"';
					}

					if ( ! empty( $value['afold'] ) ) {
						$afolds .= ' data-advanced-folding-match="' . $value['afold'] . '"';
					}

					// Tab Id
					if ( isset( $value['tab_id'] ) ) {
						$afolds .= ' data-tab-item-of="' . $value['tab_id'] . '"';
					}

					$output .= '<div id="section-' . $value['id'] . '" class="' . $fold . 'section section-' . $value['type'] . ' ' . $class . '"' . $afolds . '>' . "\n";

					//only show header if 'name' value exists
					if ( $value['name'] ) {
						$output .= '<h3 class="heading">' . $value['name'] . '</h3>' . "\n";
					}


					// Tabs
					if ( $value['type'] == "tabs" ) {
						$output .= '<ul class="smof-tabs">';

						$current_tab = array_keys( $value['tabs'] );
						$current_tab = reset( $current_tab );

						foreach ( $value['tabs'] as $tab_id => $tab_title ) {
							$output .= '<li class="' . ( $current_tab == $tab_id ? 'active' : '' ) . '">';
							$output .= '<a href="#tab:' . $tab_id . '">';
							$output .= $tab_title;
							$output .= '</a>';
							$output .= '</li>';
						}

						$output .= '</ul>';

						$output .= '<div class="tab-panes-container">';

						foreach ( $value['tabs'] as $tab_id => $tab_title ) {
							$output .= '<div class="tab-pane' . ( $current_tab == $tab_id ? ' active' : '' ) . '" data-tab-id="' . $tab_id . '"></div>';
						}

						$output .= '</div>';
					}

					$output .= '<div class="option' . ( strpos( $value['desc'], '<small' ) !== false ? ' has-note' : '' ) . '">' . "\n" . '<div class="controls">' . "\n";

				}
				//End Heading

				//if (!isset($smof_data[$value['id']]) && $value['type'] != "heading")
				//	continue;

				//switch statement to handle various options type
				switch ( $value['type'] ) {

					//text input
					case 'text':
						$t_value = '';
						$t_value = stripslashes( $smof_data[ $value['id'] ] );

						$mini = '';
						if ( ! isset( $value['mod'] ) ) {
							$value['mod'] = '';
						}
						if ( $value['mod'] == 'mini' ) {
							$mini = 'mini';
						}

						if ( ! empty( $value['numeric'] ) ) {
							$value['type'] = 'number';
						}

						if ( ! empty( $value['postfix'] ) ) {
							$output .= '<span class="of-input-postfix">' . $value['postfix'] . '</span>';
						}

						$output .= '<input class="of-input ' . $mini . '" name="' . $value['id'] . '" id="' . $value['id'] . '" type="' . $value['type'] . '" value="' . $t_value . '" ' . ( isset( $value['plc'] ) ? ( ' placeholder="' . esc_attr( $value['plc'] ) . '"' ) : '' ) . ( isset( $value['min'] ) ? sprintf( ' min="%d"', $value['min'] ) : '' ) . ( isset( $value['max'] ) ? sprintf( ' max="%d"', $value['max'] ) : '' ) . ( isset( $value['step'] ) ? sprintf( ' step="%d"', $value['step'] ) : '' ) . ' />';

						break;

					//select option
					case 'select':
						$mini = '';
						if ( ! isset( $value['mod'] ) ) {
							$value['mod'] = '';
						}
						if ( $value['mod'] == 'mini' ) {
							$mini = 'mini';
						}
						$output .= '<div class="select_wrapper ' . $mini . '">';
						$output .= '<select class="select of-input" name="' . $value['id'] . '" id="' . $value['id'] . '">';

						foreach ( $value['options'] as $select_ID => $option ) {
							$theValue = $option;
							if ( ! empty( $value['numindex'] ) || ! is_numeric( $select_ID ) ) {
								$theValue = $select_ID;
							}
							$output .= '<option id="' . $select_ID . '" value="' . $theValue . '" ' . selected( $smof_data[ $value['id'] ], $theValue, false ) . ' />' . $option . '</option>';
						}
						$output .= '</select></div>';
						break;

					//textarea option
					case 'textarea':
						$cols     = '8';
						$ta_value = '';

						if ( isset( $value['options'] ) ) {
							$ta_options = $value['options'];
							if ( isset( $ta_options['cols'] ) ) {
								$cols = $ta_options['cols'];
							}
						}

						$ta_value = stripslashes( $smof_data[ $value['id'] ] );
						$output   .= '<textarea class="of-input" name="' . $value['id'] . '" id="' . $value['id'] . '" cols="' . $cols . '" rows="8"' . ( isset( $value['plc'] ) ? ( ' placeholder="' . esc_attr( $value['plc'] ) . '"' ) : '' ) . '>' . $ta_value . '</textarea>';
						break;

					//radiobox option
					case "radio":
						$checked = ( isset( $smof_data[ $value['id'] ] ) ) ? checked( $smof_data[ $value['id'] ], $option, false ) : '';
						foreach ( $value['options'] as $option => $name ) {
							$output .= '<input class="of-input of-radio" name="' . $value['id'] . '" type="radio" value="' . $option . '" ' . checked( $smof_data[ $value['id'] ], $option, false ) . ' /><label class="radio">' . $name . '</label><br/>';
						}
						break;

					//checkbox option
					case 'checkbox':
						if ( ! isset( $smof_data[ $value['id'] ] ) ) {
							$smof_data[ $value['id'] ] = 0;
						}

						$fold = '';
						if ( array_key_exists( "folds", $value ) ) {
							$fold = "fld ";
						}

						//$output .= '<input type="hidden" class="' . $fold . 'checkbox of-input" name="' . $value['id'] . '" id="' . $value['id'] . '" value="0"/>';
						$output .= '<input type="checkbox" class="' . $fold . 'checkbox of-input" name="' . $value['id'] . '" id="' . $value['id'] . '" value="1" ' . checked( $smof_data[ $value['id'] ], 1, false ) . ' />';
						break;

					//multiple checkbox option
					case 'multicheck':
						( isset( $smof_data[ $value['id'] ] ) ) ? $multi_stored = $smof_data[ $value['id'] ] : $multi_stored = "";

						foreach ( $value['options'] as $key => $option ) {
							if ( ! isset( $multi_stored[ $key ] ) ) {
								$multi_stored[ $key ] = '';
							}
							$of_key_string = $value['id'] . '_' . $key;
							$output        .= '<div class="multicheck-entry"><input type="checkbox" class="checkbox of-input" name="' . $value['id'] . '[' . $key . ']' . '" id="' . $of_key_string . '" value="1" ' . checked( $multi_stored[ $key ], 1, false ) . ' /><label class="multicheck" for="' . $of_key_string . '">' . $option . '</label></div>';
						}
						break;

					// Color picker
					case "color":
						$default_color = '';
						if ( isset( $value['std'] ) ) {
							$default_color = ' data-default-color="' . $value['std'] . '" ';
						}
						$output .= '<input name="' . $value['id'] . '" id="' . $value['id'] . '" class="of-color" data-alpha="true"  type="text" value="' . $smof_data[ $value['id'] ] . '"' . $default_color . ' />';

						break;

					//typography option
					case 'typography':

						$typography_stored = isset( $smof_data[ $value['id'] ] ) ? $smof_data[ $value['id'] ] : $value['std'];

						/* Font Size */

						if ( isset( $typography_stored['size'] ) ) {
							$output .= '<div class="select_wrapper typography-size" original-title="Font size">';
							$output .= '<select class="of-typography of-typography-size select" name="' . $value['id'] . '[size]" id="' . $value['id'] . '_size">';
							for ( $i = 9; $i < 20; $i ++ ) {
								$test   = $i . 'px';
								$output .= '<option value="' . $i . 'px" ' . selected( $typography_stored['size'], $test, false ) . '>' . $i . 'px</option>';
							}

							$output .= '</select></div>';

						}

						/* Line Height */
						if ( isset( $typography_stored['height'] ) ) {

							$output .= '<div class="select_wrapper typography-height" original-title="Line height">';
							$output .= '<select class="of-typography of-typography-height select" name="' . $value['id'] . '[height]" id="' . $value['id'] . '_height">';
							for ( $i = 20; $i < 38; $i ++ ) {
								$test   = $i . 'px';
								$output .= '<option value="' . $i . 'px" ' . selected( $typography_stored['height'], $test, false ) . '>' . $i . 'px</option>';
							}

							$output .= '</select></div>';

						}

						/* Font Face */
						if ( isset( $typography_stored['face'] ) ) {

							$output .= '<div class="select_wrapper typography-face" original-title="Font family">';
							$output .= '<select class="of-typography of-typography-face select" name="' . $value['id'] . '[face]" id="' . $value['id'] . '_face">';

							$faces = [
								'arial'     => 'Arial',
								'verdana'   => 'Verdana, Geneva',
								'trebuchet' => 'Trebuchet',
								'georgia'   => 'Georgia',
								'times'     => 'Times New Roman',
								'tahoma'    => 'Tahoma, Geneva',
								'palatino'  => 'Palatino',
								'helvetica' => 'Helvetica'
							];
							foreach ( $faces as $i => $face ) {
								$output .= '<option value="' . $i . '" ' . selected( $typography_stored['face'], $i, false ) . '>' . $face . '</option>';
							}

							$output .= '</select></div>';

						}

						/* Font Weight */
						if ( isset( $typography_stored['style'] ) ) {

							$output .= '<div class="select_wrapper typography-style" original-title="Font style">';
							$output .= '<select class="of-typography of-typography-style select" name="' . $value['id'] . '[style]" id="' . $value['id'] . '_style">';
							$styles = [
								'normal'      => 'Normal',
								'italic'      => 'Italic',
								'bold'        => 'Bold',
								'bold italic' => 'Bold Italic'
							];

							foreach ( $styles as $i => $style ) {

								$output .= '<option value="' . $i . '" ' . selected( $typography_stored['style'], $i, false ) . '>' . $style . '</option>';
							}
							$output .= '</select></div>';

						}

						/* Font Color */
						if ( isset( $typography_stored['color'] ) ) {

							$output .= '<div id="' . $value['id'] . '_color_picker" class="colorSelector typography-color"><div style="background-color: ' . $typography_stored['color'] . '"></div></div>';
							$output .= '<input class="of-color of-typography of-typography-color" original-title="Font color" name="' . $value['id'] . '[color]" id="' . $value['id'] . '_color" type="text" value="' . $typography_stored['color'] . '" />';

						}

						break;

					//border option
					case 'border':

						/* Border Width */
						$border_stored = $smof_data[ $value['id'] ];

						$output .= '<div class="select_wrapper border-width">';
						$output .= '<select class="of-border of-border-width select" name="' . $value['id'] . '[width]" id="' . $value['id'] . '_width">';
						for ( $i = 0; $i < 21; $i ++ ) {
							$output .= '<option value="' . $i . '" ' . selected( $border_stored['width'], $i, false ) . '>' . $i . '</option>';
						}
						$output .= '</select></div>';

						/* Border Style */
						$output .= '<div class="select_wrapper border-style">';
						$output .= '<select class="of-border of-border-style select" name="' . $value['id'] . '[style]" id="' . $value['id'] . '_style">';

						$styles = [
							'none'   => 'None',
							'solid'  => 'Solid',
							'dashed' => 'Dashed',
							'dotted' => 'Dotted'
						];

						foreach ( $styles as $i => $style ) {
							$output .= '<option value="' . $i . '" ' . selected( $border_stored['style'], $i, false ) . '>' . $style . '</option>';
						}

						$output .= '</select></div>';

						/* Border Color */
						$output .= '<div id="' . $value['id'] . '_color_picker" class="colorSelector"><div style="background-color: ' . $border_stored['color'] . '"></div></div>';
						$output .= '<input class="of-color of-border of-border-color" name="' . $value['id'] . '[color]" id="' . $value['id'] . '_color" type="text" value="' . $border_stored['color'] . '" />';

						break;

					//images checkbox - use image as checkboxes
					case 'images':

						$i = 0;

						$select_value = ( isset( $smof_data[ $value['id'] ] ) ) ? $smof_data[ $value['id'] ] : '';

						foreach ( $value['options'] as $key => $option ) {
							$i ++;

							$msg = '';

							if ( isset( $value['descrs'] ) && is_array( $value['descrs'] ) && isset( $value['descrs'][ $key ] ) ) {
								$msg = $value['descrs'][ $key ];
							}

							$checked  = '';
							$selected = '';
							if ( null != checked( $select_value, $key, false ) ) {
								$checked  = checked( $select_value, $key, false );
								$selected = 'of-radio-img-selected';
							}
							$output .= '<span class="smof-img-radio ' . $selected . '">';
							$output .= '<input type="radio" id="of-radio-img-' . $value['id'] . $i . '" class="checkbox of-radio-img-radio" value="' . $key . '" name="' . $value['id'] . '" ' . $checked . ' />';
							$output .= '<div class="of-radio-img-label">' . $key . '</div>';
							$output .= '<img src="' . $option . '" alt="" class="of-radio-img-img' . ( ! $msg ? ' no-description' : '' ) . '" onClick="document.getElementById(\'of-radio-img-' . $value['id'] . $i . '\').checked = true;" />';

							if ( $msg ) {
								$output .= '<strong>' . $msg . '</strong>';
							}

							$output .= '</span>';
						}

						break;

					//info (for small intro box etc)
					case "info":
						$info_text = $value['std'];
						$output    .= '<div class="of-info">' . $info_text . '</div>';
						break;

					//display a single image
					case "image":
						$src    = $value['std'];
						$output .= '<img src="' . $src . '">';
						break;

					//tab heading
					case 'heading':
						if ( $counter >= 2 ) {
							$output .= '</div>' . "\n";
						}

						//custom icon
						$icon              = '';
						$header_class      = str_replace( ' ', '', strtolower( $value['name'] ) );
						$jquery_click_hook = str_replace( ' ', '', strtolower( $value['name'] ) );
						$jquery_click_hook = "of-option-" . trim( preg_replace( '/ +/', '', preg_replace( '/[^A-Za-z0-9 ]/', '', urldecode( html_entity_decode( strip_tags( $jquery_click_hook ) ) ) ) ) );

						$menu   .= '<li class="' . $header_class . '"><a title="' . $value['name'] . '" href="' . ( isset( $value['redirect'] ) ? $value['redirect'] : ( '#' . $jquery_click_hook ) ) . '"' . $icon . '><i class="header-icon' . ( isset( $value['icon'] ) ? " {$value['icon']}" : '' ) . '"></i><span>' . $value['name'] . '</span></a></li>';
						$output .= '<div class="group" id="' . $jquery_click_hook . '"><h2>' . $value['name'] . '</h2>' . "\n";
						break;

					//drag & drop slide manager
					case 'slider':
						$output .= '<div class="slider"><ul id="' . $value['id'] . '">';
						$slides = $smof_data[ $value['id'] ];
						$count  = count( $slides );
						if ( $count < 2 ) {
							$oldorder = 1;
							$order    = 1;
							$output   .= Options_Machine::optionsframework_slider_function( $value['id'], $value['std'], $oldorder, $order );
						} else {
							$i = 0;
							foreach ( $slides as $slide ) {
								$oldorder = $slide['order'];
								$i ++;
								$order  = $i;
								$output .= Options_Machine::optionsframework_slider_function( $value['id'], $value['std'], $oldorder, $order );
							}
						}
						$output .= '</ul>';
						$output .= '<a href="#" class="button slide_add_button">Add New Slide</a></div>';

						break;

					//drag & drop block manager
					case 'sorter':

						// Make sure to get list of all the default blocks first
						$all_blocks = $value['std'];

						$temp  = array(); // holds default blocks
						$temp2 = array(); // holds saved blocks

						foreach ( $all_blocks as $blocks ) {
							$temp = array_merge( $temp, $blocks );
						}

						$sortlists = isset( $data[ $value['id'] ] ) && ! empty( $data[ $value['id'] ] ) ? $data[ $value['id'] ] : $value['std'];

						foreach ( $sortlists as $sortlist ) {
							$temp2 = array_merge( $temp2, $sortlist );
						}

						// now let's compare if we have anything missing
						foreach ( $temp as $k => $v ) {
							if ( ! array_key_exists( $k, $temp2 ) ) {
								$sortlists['disabled'][ $k ] = $v;
							}
						}

						// now check if saved blocks has blocks not registered under default blocks
						foreach ( $sortlists as $key => $sortlist ) {
							foreach ( $sortlist as $k => $v ) {
								if ( ! array_key_exists( $k, $temp ) ) {
									unset( $sortlist[ $k ] );
								}
							}
							$sortlists[ $key ] = $sortlist;
						}

						// assuming all sync'ed, now get the correct naming for each block
						foreach ( $sortlists as $key => $sortlist ) {
							foreach ( $sortlist as $k => $v ) {
								$sortlist[ $k ] = $temp[ $k ];
							}
							$sortlists[ $key ] = $sortlist;
						}

						$output .= '<div id="' . $value['id'] . '" class="sorter">';


						if ( $sortlists ) {

							# start: modified by Arlind
							if ( count( $sortlists ) == 3 ) {

								if ( isset( $sortlists['hidden'] ) ) {
									$sortlists['hidden'] = array_merge( $sortlists['hidden'], $sortlists['disabled'] );
									unset( $sortlists['disabled'] );
								}
							}
							# end: modified by Arlind

							foreach ( $sortlists as $group => $sortlist ) {

								$output .= '<ul id="' . $value['id'] . '_' . $group . '" class="sortlist_' . $value['id'] . '">';
								$output .= '<h3>' . $group . '</h3>';

								foreach ( $sortlist as $key => $list ) {

									$output .= '<input class="sorter-placebo" type="hidden" name="' . $value['id'] . '[' . $group . '][placebo]" value="placebo">';

									if ( $key != "placebo" ) {

										$output .= '<li id="' . $key . '" class="sortee">';
										$output .= '<input class="position" type="hidden" name="' . $value['id'] . '[' . $group . '][' . $key . ']" value="' . $list . '">';
										$output .= $list;
										$output .= '</li>';

									}

								}

								$output .= '</ul>';
							}
						}

						$output .= '</div>';
						break;

					//background images option
					case 'tiles':

						$i            = 0;
						$select_value = isset( $smof_data[ $value['id'] ] ) && ! empty( $smof_data[ $value['id'] ] ) ? $smof_data[ $value['id'] ] : '';
						if ( is_array( $value['options'] ) ) {
							foreach ( $value['options'] as $key => $option ) {
								$i ++;

								$checked  = '';
								$selected = '';
								if ( null != checked( $select_value, $option, false ) ) {
									$checked  = checked( $select_value, $option, false );
									$selected = 'of-radio-tile-selected';
								}
								$output .= '<span>';
								$output .= '<input type="radio" id="of-radio-tile-' . $value['id'] . $i . '" class="checkbox of-radio-tile-radio" value="' . $option . '" name="' . $value['id'] . '" ' . $checked . ' />';
								$output .= '<div class="of-radio-tile-img ' . $selected . '" style="background: url(' . $option . ')" onClick="document.getElementById(\'of-radio-tile-' . $value['id'] . $i . '\').checked = true;"></div>';
								$output .= '</span>';
							}
						}

						break;

					//backup and restore options data
					case 'backup':

						$instructions = $value['desc'];
						$backup       = of_get_options( BACKUPS );
						$init         = of_get_options( 'smof_init' );


						if ( ! isset( $backup['backup_log'] ) ) {
							$log = 'No backups yet';
						} else {
							$log = $backup['backup_log'];
						}

						$output .= '<div class="backup-box">';
						$output .= '<div class="instructions">' . $instructions . "\n";
						$output .= '<p><strong>Last Backup: <span class="backup-log">' . $log . '</span></strong></p></div>' . "\n";
						$output .= '<a href="#" id="of_backup_button" class="button" title="Backup Options">Backup Options</a>';
						$output .= '<a href="#" id="of_restore_button" class="button" title="Restore Options">Restore Options</a>';
						$output .= '</div>';

						break;

					//export or import data between different installs
					case 'transfer':
						global $of_options;
						$keys_to_export = [];

						if ( isset( $smof_data['backups'] ) ) {
							unset( $smof_data['backups'] );
						}

						foreach ( $of_options as $option ) {
							if ( isset( $option['id'] ) ) {
								$keys_to_export[] = $option['id'];
							}
						}

						// Filter known keys only
						$smof_keys = array_keys( $smof_data );

						foreach ( $smof_keys as $key_id ) {
							if ( ! in_array( $key_id, $keys_to_export ) ) {
								unset( $smof_data[ $key_id ] );
							}
						}

						$output .= '<textarea id="export_data" rows="8">' . base64_encode( maybe_serialize( $smof_data ) ) /* 100% safe - ignore theme check nag */ . '</textarea>' . "\n";
						$output .= '<a href="#" id="of_import_button" class="button" title="Restore Options">Import Options</a>';

						break;

					// google font field
					case 'select_google_font':
						$output .= '<div class="select_wrapper">';
						$output .= '<select class="select of-input google_font_select" name="' . $value['id'] . '" id="' . $value['id'] . '">';
						foreach ( $value['options'] as $select_key => $option ) {
							$output .= '<option value="' . $select_key . '" ' . selected( ( isset( $smof_data[ $value['id'] ] ) ) ? $smof_data[ $value['id'] ] : "", $option, false ) . ' />' . $option . '</option>';
						}
						$output .= '</select></div>';

						if ( isset( $value['preview']['text'] ) ) {
							$g_text = $value['preview']['text'];
						} else {
							$g_text = '0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz';
						}
						if ( isset( $value['preview']['size'] ) ) {
							$g_size = 'style="font-size: ' . $value['preview']['size'] . ';"';
						} else {
							$g_size = '';
						}
						$hide = " hide";
						if ( $smof_data[ $value['id'] ] != "none" && $smof_data[ $value['id'] ] != "" ) {
							$hide = "";
						}

						$output .= '<p class="' . $value['id'] . '_ggf_previewer google_font_preview' . $hide . '" ' . $g_size . '>' . $g_text . '</p>';
						break;

					//JQuery UI Slider
					case 'sliderui':
						$s_val = $s_min = $s_max = $s_step = $s_edit = '';//no errors, please

						$s_val = stripslashes( $smof_data[ $value['id'] ] );

						if ( ! isset( $value['min'] ) ) {
							$s_min = '0';
						} else {
							$s_min = $value['min'];
						}
						if ( ! isset( $value['max'] ) ) {
							$s_max = $s_min + 1;
						} else {
							$s_max = $value['max'];
						}
						if ( ! isset( $value['step'] ) ) {
							$s_step = '1';
						} else {
							$s_step = $value['step'];
						}

						if ( ! isset( $value['edit'] ) ) {
							$s_edit = ' readonly="readonly"';
						} else {
							$s_edit = '';
						}

						if ( $s_val == '' ) {
							$s_val = $s_min;
						}

						//values
						$s_data = 'data-id="' . $value['id'] . '" data-val="' . $s_val . '" data-min="' . $s_min . '" data-max="' . $s_max . '" data-step="' . $s_step . '"';

						//html output
						$output .= '<input type="text" name="' . $value['id'] . '" id="' . $value['id'] . '" value="' . $s_val . '" class="mini" ' . $s_edit . ' />';
						$output .= '<div id="' . $value['id'] . '-slider" class="smof_sliderui" style="margin-left: 7px;" ' . $s_data . '></div>';

						break;


					//Switch option
					case 'switch':
						if ( ! isset( $smof_data[ $value['id'] ] ) ) {
							$smof_data[ $value['id'] ] = 0;
						}

						$fold = '';
						if ( array_key_exists( "folds", $value ) ) {
							$fold = "s_fld ";
						}

						$cb_enabled = $cb_disabled = '';//no errors, please

						//Get selected
						if ( $smof_data[ $value['id'] ] == 1 ) {
							$cb_enabled  = ' selected';
							$cb_disabled = '';
						} else {
							$cb_enabled  = '';
							$cb_disabled = ' selected';
						}

						//Label ON
						if ( ! isset( $value['on'] ) ) {
							$on = "On";
						} else {
							$on = $value['on'];
						}

						//Label OFF
						if ( ! isset( $value['off'] ) ) {
							$off = "Off";
						} else {
							$off = $value['off'];
						}

						$output .= '<p class="switch-options ' . ( isset( $value['reverse'] ) ? ' reverse' : '' ) . '">';
						$output .= '<label class="' . $fold . 'cb-enable' . $cb_enabled . '" data-id="' . $value['id'] . '"><span>' . $on . '</span></label>';
						$output .= '<label class="' . $fold . 'cb-disable' . $cb_disabled . '" data-id="' . $value['id'] . '"><span>' . $off . '</span></label>';

//						$output .= '<input type="hidden" class="' . $fold . 'checkbox of-input" name="' . $value['id'] . '" id="' . $value['id'] . '" value="0"/>';
						$output .= '<input type="checkbox" id="' . $value['id'] . '" class="' . $fold . 'checkbox of-input main_checkbox" name="' . $value['id'] . '"  value="1" ' . checked( $smof_data[ $value['id'] ], 1, false ) . ' />';

						$output .= '</p>';

						break;

					// Uploader 3.5
					case "upload":
					case "media":

						if ( ! isset( $value['mod'] ) ) {
							$value['mod'] = '';
						}

						$u_val = '';
						if ( $smof_data[ $value['id'] ] ) {
							$u_val = stripslashes( $smof_data[ $value['id'] ] );
						}

						$output .= Options_Machine::optionsframework_media_uploader_function( $value['id'], $u_val, $value['mod'] );

						break;


					// Menu content type option
					case 'content_builder':
						$t_value = esc_attr( $smof_data[ $value['id'] ] );
						$options = kalium_get_array_key( $value, 'options' );
						$conf    = wp_parse_args( kalium_get_array_key( $value, 'conf' ), [
							'title'        => 'Menu Content',
							'maxEntries'   => 3,
							'addEntryText' => 'Add content',
							'noItemsText'  => 'Click to add content elements',
							'alignField'   => false,
							'defaultAlign' => '',
							'options'      => [],
							'responsive'   => [],
						] );

						// Sub options
						$sub_options = is_array( $conf['subOptions'] ) ? $conf['subOptions'] : [];

						// Field value container
						$output .= '<input type="hidden" id="' . $value['id'] . '" name="' . $value['id'] . '" value="' . $t_value . '">';

						// Menu content type wrapper
						$output .= '<div class="of-input-menu-content-type-wrapper">';

						// Toolbar wrapper start
						$output .= '<div class="menu-content-toolbar">';

						// Title
						$output .= sprintf( '<div class="menu-content-toolbar-title">%s</div>', $conf['title'] );

						// Buttons wrapper
						$output .= '<div class="menu-content-buttons">';

						// Align field
						if ( $conf['alignField'] ) {
							$output .= '<div class="menu-content-button">';
							$output .= sprintf( '<a href="#" class="button button-secondary set-menu-content-alignment"><i class="kalium-admin-icon-align-left"></i></a>' );
							$output .= '<div class="menu-content-align-popover"><a href="#" data-align="left"><i class="kalium-admin-icon-align-left"></i> <span>Left</span></a><a href="#" data-align="center"><i class="kalium-admin-icon-align-center"></i> <span>Center</span></a><a href="#" data-align="right"><i class="kalium-admin-icon-align-right"></i> <span>Right</span></a></div>';
							$output .= '</div>';
						}

						// Add menu content type
						$output .= '<div class="menu-content-button menu-content-button--add-entry">';
						$output .= sprintf( '<a href="#" class="button add-new-menu-content-entry" title="%1$s"><i class="kalium-admin-icon-plus-circle"></i></a>', $conf['addEntryText'] );
						$output .= '</div>';

						// Buttons wrapper end
						$output .= '</div>'; // .menu-content-buttons

						// Toolbar wrapper end
						$output .= '</div>'; // .menu-content-toolbar

						// Menu content type fields wrapper start
						$output .= '<div class="of-input-menu-content-entries" data-entries="' . esc_attr( wp_json_encode( $options ) ) . '" data-max-entries="' . $conf['maxEntries'] . '" data-options="' . esc_attr( wp_json_encode( $sub_options ) ) . '" data-responsive-options="' . esc_attr( wp_json_encode( $conf['responsive'] ) ) . '" data-default-align="' . esc_attr( $conf['defaultAlign'] ) . '">';

						// Menu content type field wrapper start
						$output .= '<div class="of-input-menu-content-type">';

						// Remove entry
						$output .= '<div class="of-input-menu-content-type--remove"><a href="#"><i class="kalium-admin-icon-remove"></i></a></div>';

						// Content Type Options
						$output .= '<div class="of-input-menu-content-type--column menu-content-column">';
						$output .= '<div class="select_wrapper">';
						$output .= '<select class="select of-input" name="' . $value['id'] . '__content_type" id="' . $value['id'] . '__content_type">';
						$output .= '</select>';
						$output .= '</div>'; // .select_wrapper
						$output .= '</div>'; // .of-input-menu-content-type--column

						// Sub options
						$output .= '<div class="of-input-menu-content-type--column menu-content-options inactive">';
						$output .= '<a href="#" class="menu-content-dropdown-icon options-show-popover" title="Options"><i class="kalium-admin-icon-settings"></i></a>';
						$output .= '<div class="menu-content-options-popover"></div>';
						$output .= '</div>'; // .of-input-menu-content-type--column

						// Menu content type field wrapper end
						$output .= '</div>'; // .of-input-menu-content-type

						// Menu content type fields wrapper end
						$output .= '</div>'; // .of-input-menu-content-entries

						// Menu content type wrapper end
						$output .= '</div>'; // .of-input-menu-content-type-wrapper

						// Add content placeholder text
						if ( ! empty( $conf['title'] ) ) {
							$output .= sprintf( '<style>#section-%1$s .of-input-menu-content-entries:empty:before { content: "%2$s" !important; }</style>', $value['id'], esc_attr( $conf['noItemsText'] ) );
						}
						break;

					// Content Builder Templates
					case 'content_builder_templates':
						$options = kalium_get_array_key( $value, 'options', [] );
						$explain = kalium_get_array_key( $value, 'explain' );

						if ( $explain ) {
							$output .= '<span class="explain above">' . esc_html( $explain ) . '</span>';
						}

						$output .= '<div class="content-builder-templates">';

						foreach ( $options as $template_option ) {
							$image    = kalium_get_array_key( $template_option, 'image' );
							$name     = kalium_get_array_key( $template_option, 'name' );
							$template = kalium_get_array_key( $template_option, 'data' );

							$output .= '<div class="content-builder-template-entry">';
							$output .= sprintf( '<a href="#" data-template="%s"><img src="%s" /><span>%s</span></a>', esc_attr( $template ), $image, $name );
							$output .= '</div>';
						}

						$output .= '</div>';
						break;

					// Logo image display
					case 'logo_image_display':
						$image_url         = kalium()->assets_url( 'images/icons/kalium-logo-black.png' );
						$custom_logo_image = kalium_get_theme_option( 'custom_logo_image' );

						if ( is_numeric( $custom_logo_image ) ) {
							$logo_image = wp_get_attachment_image_src( $custom_logo_image, 'original' );

							if ( is_array( $logo_image ) ) {
								$image_url = $logo_image[0];
							}
						}
						$output .= sprintf( '<img src="%1$s" class="logo-image-display-placeholder of-option-image" alt="logo">', esc_attr( $image_url ) );
						break;
				}

				do_action( 'optionsframework_machine_loop', [
					'options'   => $options,
					'smof_data' => $smof_data,
					'defaults'  => $defaults,
					'counter'   => $counter,
					'menu'      => $menu,
					'output'    => $output,
					'value'     => $value
				] );
				if ( $smof_output != "" ) {
					$output      .= $smof_output;
					$smof_output = "";
				}

				//description of each option
				if ( $value['type'] != 'heading' ) {
					if ( ! isset( $value['desc'] ) ) {
						$explain_value = '';
					} else {
						$explain_value = '<div class="explain">' . $value['desc'] . '</div>' . "\n";
					}
					$output .= '</div>' . $explain_value . "\n";
					$output .= '<div class="clear"> </div></div></div>' . "\n";
				}

			} /* condition empty end */

		}

		if ( $update_data == true ) {
			of_save_options( $smof_data );
		}

		$output .= '</div>';

		do_action( 'optionsframework_machine_after', [
			'options'   => $options,
			'smof_data' => $smof_data,
			'defaults'  => $defaults,
			'counter'   => $counter,
			'menu'      => $menu,
			'output'    => $output,
			'value'     => $value
		] );
		if ( $smof_output != "" ) {
			$output      .= $smof_output;
			$smof_output = "";
		}

		return [ $output, $menu, $defaults ];

	}


	/**
	 * Native media library uploader
	 *
	 * @return string
	 * @since  1.0.0
	 *
	 * @uses   get_theme_mod()
	 *
	 * @access public
	 */
	public static function optionsframework_media_uploader_function( $id, $std, $mod ) {

		$data      = of_get_options();
		$smof_data = of_get_options();

		$uploader = '';
		$upload   = "";
		if ( isset( $smof_data[ $id ] ) ) {
			$upload = $smof_data[ $id ];
		}
		$hide = '';

		if ( $mod == "min" ) {
			$hide = 'hide';
		}

		if ( $upload != "" ) {
			$val = $upload;
		} else {
			$val = $std;
		}

		$uploader .= '<input class="' . $hide . ' upload of-input" name="' . $id . '" id="' . $id . '_upload" value="' . $val . '" />';

		//Upload controls DIV
		$uploader .= '<div class="upload_button_div">';
		//If the user has WP3.5+ show upload/remove button
		if ( function_exists( 'wp_enqueue_media' ) ) {
			$uploader .= '<span class="button media_upload_button" id="' . $id . '">Upload <i class="kalium-admin-icon-import"></i></span>';

			if ( ! empty( $upload ) ) {
				$hide = '';
			} else {
				$hide = 'hide';
			}
			$uploader .= '<span class="button remove-image ' . $hide . '" id="reset_' . $id . '">Remove <i class="kalium-admin-icon-remove"></i></span>';
		} else {
			$output .= '<p class="upload-notice"><i>Upgrade your version of WordPress for full media support.</i></p>';
		}

		$uploader .= '</div>' . "\n";

		//Preview
		$uploader .= '<div class="screenshot">';
		if ( ! empty( $upload ) ) {
			# start: modified by Arlind
			if ( is_numeric( $upload ) ) {
				$image = wp_get_attachment_image_src( $upload, 'original' );

				if ( is_array( $image ) ) {
					$upload = $image[0];
				} else {
					$upload = '';
				}
			}

			add_thickbox();
			# end: modified by Arlind
			$uploader .= '<a class="of-uploaded-image thickbox" href="' . $upload . '">';
			$uploader .= '<img class="of-option-image" id="image_' . $id . '" src="' . $upload . '" alt="" />';
			$uploader .= '</a>';
		}
		$uploader .= '</div>';
		$uploader .= '<div class="clear"></div>' . "\n";

		return $uploader;

	}

	/**
	 * Drag and drop slides manager
	 *
	 * @return string
	 * @since  1.0.0
	 *
	 * @uses   get_theme_mod()
	 *
	 * @access public
	 */
	public static function optionsframework_slider_function( $id, $std, $oldorder, $order ) {

		$data      = of_get_options();
		$smof_data = of_get_options();

		$slider = '';
		$slide  = [];
		if ( isset( $smof_data[ $id ] ) ) {
			$slide = $smof_data[ $id ];
		}

		if ( isset( $slide[ $oldorder ] ) ) {
			$val = $slide[ $oldorder ];
		} else {
			$val = $std;
		}

		//initialize all vars
		$slidevars = [ 'title', 'url', 'link', 'description' ];

		foreach ( $slidevars as $slidevar ) {
			if ( ! isset( $val[ $slidevar ] ) ) {
				$val[ $slidevar ] = '';
			}
		}

		//begin slider interface
		if ( ! empty( $val['title'] ) ) {
			$slider .= '<li><div class="slide_header"><strong>' . stripslashes( $val['title'] ) . '</strong>';
		} else {
			$slider .= '<li><div class="slide_header"><strong>Slide ' . $order . '</strong>';
		}

		$slider .= '<input type="hidden" class="slide of-input order" name="' . $id . '[' . $order . '][order]" id="' . $id . '_' . $order . '_slide_order" value="' . $order . '" />';

		$slider .= '<a class="slide_edit_button" href="#">Edit</a></div>';

		$slider .= '<div class="slide_body">';

		$slider .= '<label>Title</label>';
		$slider .= '<input class="slide of-input of-slider-title" name="' . $id . '[' . $order . '][title]" id="' . $id . '_' . $order . '_slide_title" value="' . stripslashes( $val['title'] ) . '" />';

		$slider .= '<label>Image URL</label>';
		$slider .= '<input class="upload slide of-input" name="' . $id . '[' . $order . '][url]" id="' . $id . '_' . $order . '_slide_url" value="' . $val['url'] . '" />';

		$slider .= '<div class="upload_button_div"><span class="button media_upload_button" id="' . $id . '_' . $order . '">Upload</span>';

		if ( ! empty( $val['url'] ) ) {
			$hide = '';
		} else {
			$hide = 'hide';
		}
		$slider .= '<span class="button remove-image ' . $hide . '" id="reset_' . $id . '_' . $order . '" title="' . $id . '_' . $order . '">Remove</span>';
		$slider .= '</div>' . "\n";
		$slider .= '<div class="screenshot">';
		if ( ! empty( $val['url'] ) ) {

			$slider .= '<a class="of-uploaded-image" href="' . $val['url'] . '">';
			$slider .= '<img class="of-option-image" id="image_' . $id . '_' . $order . '" src="' . $val['url'] . '" alt="" />';
			$slider .= '</a>';

		}
		$slider .= '</div>';
		$slider .= '<label>Link URL (optional)</label>';
		$slider .= '<input class="slide of-input" name="' . $id . '[' . $order . '][link]" id="' . $id . '_' . $order . '_slide_link" value="' . $val['link'] . '" />';

		$slider .= '<label>Description (optional)</label>';
		$slider .= '<textarea class="slide of-input" name="' . $id . '[' . $order . '][description]" id="' . $id . '_' . $order . '_slide_description" cols="8" rows="8">' . stripslashes( $val['description'] ) . '</textarea>';

		$slider .= '<a class="slide_delete_button" href="#">Delete</a>';
		$slider .= '<div class="clear"></div>' . "\n";

		$slider .= '</div>';
		$slider .= '</li>';

		return $slider;

	}


}//end Options Machine class

