import $ from "../var/jquery";
import TypoLab_Font_Selector_Provider from "./font-selector-provider";
import TypoLab_Laborator_Font from "../font-types/font-laborator";
import {urlEncodeSpaces, updateSelectedVariants, previewText} from "../functions";

/**
 * Laborator Fonts Provider class.
 */
export default class TypoLab_Laborator_Fonts_Provider extends TypoLab_Font_Selector_Provider {

	/**
	 * Ready.
	 */
	ready() {

		/**
		 * Set font constructor for this font type.
		 */
		this.fontConstructor = TypoLab_Laborator_Font;
	}

	/**
	 * Selected.
	 */
	selected() {
		let data = this.getData();

		if ( data.selected_variants && data.selected_variants.length ) {
			this.getFont().setVariants( data.selected_variants );
		}
	}

	/**
	 * Preview.
	 */
	preview() {
		let font = this.getFont(),
			$container = this.getContainer(),
			fontVariantsSelectContainerTpl = wp.template( 'font-variants-select-container' ),
			fontVariantsSelectTpl = wp.template( 'select-font-variants' ),
			fontDetailsFooterTpl = wp.template( 'font-details-footer' ),
			templateParts = [],
			details = [
				`<a href="${font.getFontAuthorUrl()}" target="_blank" rel="noopener">Font Details</a>`,
				`Category: ${font.categoryNicename()}`,
				`Package Size: ${font.getPackageSize()}`,
			];

		// Set default variant
		if ( !font.getVariants().length ) {
			font.setVariants( font.getDefaultVariant() );
		}

		// Font variants preview
		templateParts.push( fontVariantsSelectTpl( {
			previewText: previewText(),
			variants: font.getVariantsPreviewList(),
			selected: font.getVariantsValue( true ),
			footer: fontDetailsFooterTpl( {
				details: details,
			} ),
		} ) );

		/**
		 * Insert/render the preview panel.
		 */

		$container.html( fontVariantsSelectContainerTpl( {
			content: templateParts.join( "\n" ),
		} ) );

		/**
		 * Events.
		 */

		// Checkbox change
		$container.find( 'input[type="checkbox"]' ).on( 'change', ev => updateSelectedVariants( font, $container.find( '.variant-entry' ) ) );

		// Loaded font preview images
		$container.find( '.variant-preview-image img' ).on( 'load', ev => {
			$( ev.currentTarget ).addClass( 'is-loaded' );
		} );
	}
}

/**
 * Font Provider.
 *
 * @type {string} fontProvider
 */
TypoLab_Laborator_Fonts_Provider.prototype.fontProvider = 'laborator-fonts';
