import $ from "../var/jquery";
import TypoLab_Font_Selector_Provider from "./font-selector-provider";
import TypoLab_Adobe_Font from "../font-types/font-adobe";
import {urlEncodeSpaces, previewText} from "../functions";

/**
 * Adobe Fonts Provider class.
 */
export default class TypoLab_Adobe_Fonts_Provider extends TypoLab_Font_Selector_Provider {

	/**
	 * Ready.
	 */
	ready() {

		/**
		 * Set font constructor for this font type.
		 */
		this.fontConstructor = TypoLab_Adobe_Font;

		/**
		 * Kit ID input.
		 *
		 * @var {jQuery} $kitId
		 */
		this.$kitId = $( '.font-option-field[name="kit_id"]' );
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
				`<a href="#" title="Reload Adobe Fonts" class="font-refresh-link"><span class="kalium-admin-icon-refresh"></span></a>`,
				`Kit ID: ${font.getKitID()}`,
				`Kit Name: ${font.getKitName()}`,
				`Last Modified: ${font.getPublishedDate()}`,
			];

		// Set variants
		font.setVariants( font.getAvailableVariants() );

		// Update input value
		this.$kitId.val( font.getKitID() );

		// Font variants preview
		templateParts.push( fontVariantsSelectTpl( {
			stylesheet: `https://use.typekit.net/${font.getKitID()}.css?cachebust=${font.getFontSlug()}`,
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

		// When stylesheet is loaded show font entries
		$container.find( 'link[rel="stylesheet"]' ).on( 'load', ev => {
			$container.find( '.variant-preview-text' ).addClass( 'is-loaded' );
		} );

		// Reset fonts list
		$container.find( '.font-refresh-link' ).on( 'click', ev => {
			let $this = $( ev.currentTarget );

			ev.preventDefault();

			if ( !$this.hasClass( 'is-loading' ) && confirm( 'Reloading Adobe Fonts will refresh this page. Proceed?' ) ) {
				$this.addClass( 'is-loading' );
				$container.fadeTo( 500, 0.6 );

				// Form data
				let formData = new FormData();
				formData.append( 'action', 'typolab_reload_adobe_fonts' );

				// Send request
				fetch( ajaxurl, {
					method: 'POST',
					body: formData,
				} ).then( response => response.json() ).then( response => {
					if ( response.success ) {
						window.location.reload();
					} else {
						$this.removeClass( 'is-loading' )
						alert( response.data );
					}
				} );
			}
		} );
	}
}

/**
 * Font Provider.
 *
 * @type {string} fontProvider
 */
TypoLab_Adobe_Fonts_Provider.prototype.fontProvider = 'adobe-fonts';
