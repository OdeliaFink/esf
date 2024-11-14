import $ from "../var/jquery";
import TypoLab_Font_Selector_Provider from "./font-selector-provider";
import TypoLab_Font_Squirrel_Font from "../font-types/font-squirrel";
import {urlEncodeSpaces, updateSelectedVariants} from "../functions";

/**
 * Font Squirrel Provider class.
 */
export default class TypoLab_Font_Squirrel_Provider extends TypoLab_Font_Selector_Provider {

	/**
	 * Ready.
	 */
	ready() {

		/**
		 * Set font constructor for this font type.
		 */
		this.fontConstructor = TypoLab_Font_Squirrel_Font;
	}

	/**
	 * Selected.
	 */
	selected() {
		let data = this.getData();

		if ( data.selected_variants && data.selected_variants.length ) {
			this.selectedVariants = data.selected_variants;
		}
	}

	/**
	 * Preview font.
	 */
	preview() {
		let font = this.getFont(),
			$container = this.getContainer(),
			fontVariantsSelectContainerTpl = wp.template( 'font-variants-select-container' ),
			fontVariantsSelect = wp.template( 'select-font-variants' ),
			fontDetailsFooterTpl = wp.template( 'font-details-footer' ),
			templateParts = [];

		// Font variants preview
		templateParts.push( fontVariantsSelect( {} ) );

		/**
		 * Insert/render the preview panel.
		 */

		$container.html( fontVariantsSelectContainerTpl( {
			content: templateParts.join( "\n" ),
		} ) );

		/**
		 * Load font data from remote origin.
		 */
		font.fetchFontData().then( () => {
			let details = [
				`<a href="https://www.fontsquirrel.com/fonts/${urlEncodeSpaces( font.getFamilyUrlName() )}/" target="_blank" rel="noopener">Font Details</a>`,
				`Category: ${font.getCategory()}`,
				`Author: ${font.getFoundryName()}`,
			];

			// Set selected variants
			if ( this.selectedVariants ) {
				let selectedVariants = font.getAvailableVariants().filter( variant => {
					return _.contains( this.selectedVariants, variant.toString( font ) );
				} );

				// Set selected variants (once)
				font.setVariants( selectedVariants );
				this.selectedVariants = null;
			}

			// Set default variant
			if ( !font.getVariants().length ) {
				font.setVariants( font.getDefaultVariant() );
			}

			// Remove loading preview
			templateParts.pop();

			// Select font variants and preview
			templateParts.push( fontVariantsSelect( {
				variants: font.getVariantsPreviewList(),
				selected: font.getVariantsValue( true ),
				footer: fontDetailsFooterTpl( {
					details: details,
				} ),
			} ) );

			// Render preview panel
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
		} );
	}
}

/**
 * Font Provider.
 *
 * @type {string} fontProvider
 */
TypoLab_Font_Squirrel_Provider.prototype.fontProvider = 'font-squirrel';
