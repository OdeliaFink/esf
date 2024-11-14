import $ from "../var/jquery";
import TypoLab_Font_Selector_Provider from "./font-selector-provider";
import TypoLab_System_Font from "../font-types/font-system";
import {urlEncodeSpaces, updateSelectedVariants, previewText} from "../functions";

/**
 * Laborator Fonts Provider class.
 */
export default class TypoLab_System_Fonts_Provider extends TypoLab_Font_Selector_Provider {

	/**
	 * Ready.
	 */
	ready() {

		/**
		 * Set font constructor for this font type.
		 */
		this.fontConstructor = TypoLab_System_Font;
	}

	/**
	 * Selected.
	 */
	selected() {
	}

	/**
	 * Preview.
	 */
	preview() {
		let font = this.getFont(),
			$container = this.getContainer(),
			fontVariantsSelectContainerTpl = wp.template( 'font-variants-select-container' ),
			fontVariantsSelectTpl = wp.template( 'select-font-variants' ),
			templateParts = [];

		// Set variants
		font.setVariants( font.getAvailableVariants() );

		// Font variants preview
		templateParts.push( fontVariantsSelectTpl( {
			previewText: previewText(),
			variants: font.getVariantsPreviewList(),
			selected: font.getVariantsValue( true ),
		} ) );

		/**
		 * Insert/render the preview panel.
		 */

		$container.html( fontVariantsSelectContainerTpl( {
			content: templateParts.join( "\n" ),
		} ) );


		// Show font
		$container.find( '.variant-preview-text' ).addClass( 'is-loaded' );
	}
}

/**
 * Font Provider.
 *
 * @type {string} fontProvider
 */
TypoLab_System_Fonts_Provider.prototype.fontProvider = 'system-fonts';
