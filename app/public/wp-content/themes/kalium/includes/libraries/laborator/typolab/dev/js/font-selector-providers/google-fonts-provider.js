import $ from "../var/jquery";
import TypoLab_Font_Selector_Provider from "./font-selector-provider";
import TypoLab_Google_Font from "../font-types/font-google";
import {urlEncodeSpaces, buildGoogleFontStylesheetURL, updateSelectedVariants, previewText} from "../functions";

/**
 * Google Fonts Provider class.
 */
export default class TypoLab_Google_Fonts_Provider extends TypoLab_Font_Selector_Provider {

	/**
	 * Ready.
	 */
	ready() {

		/**
		 * Set font constructor for this font type.
		 */
		this.fontConstructor = TypoLab_Google_Font;
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
			stylesheet = buildGoogleFontStylesheetURL( {
				family: font.getFontFamily(),
				variants: font.getAvailableVariants(),
				display: 'block',
				text: previewText(),
			} ),
			details = [
				`<a href="https://fonts.google.com/specimen/${urlEncodeSpaces( font.getFontFamily() )}" target="_blank" rel="noopener">Font Details</a>`,
				`Category: ${font.categoryNicename()}`,
				`Last Update: ${font.getLastModifiedDate()}`,
			];

		// Set default variant
		if ( !font.getVariants().length ) {
			font.setVariants( font.getDefaultVariant() );
		}

		// Font variants preview
		templateParts.push( fontVariantsSelectTpl( {
			stylesheet: stylesheet,
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

		// When stylesheet is loaded show font entries
		$container.find( 'link[rel="stylesheet"]' ).on( 'load', ev => {
			$container.find( '.variant-preview-text' ).addClass( 'is-loaded' );
		} );
	}
}

/**
 * Font Provider.
 *
 * @type {string} fontProvider
 */
TypoLab_Google_Fonts_Provider.prototype.fontProvider = 'google-fonts';
