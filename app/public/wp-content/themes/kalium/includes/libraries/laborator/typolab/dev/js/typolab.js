import $ from "./var/jquery";
import TypoLab_Font_Selector from "./font-selector";
import TypoLab_Font_Variant from "./font-components/font-variant";
import TypoLab_Font_Variants_Manager from "./managers/font-variants-manager";
import TypoLab_External_Font_Variants_Manager from "./managers/external-font-variants-manager";
import TypoLab_Conditional_Statements_Manager from "./managers/conditional-statements-manager";
import TypoLab_Font_Base_Selectors_Manager from "./managers/font-base-selectors-manager";
import TypoLab_Font_Custom_Selectors_Manager from "./managers/font-custom-selectors-manager";

export default class TypoLab {

	/**
	 * Constructor.
	 */
	constructor() {

		/**
		 * Selected font.
		 *
		 * @type {TypoLab_Font} selectedFont
		 */
		this.selectedFont;

		/**
		 * Initialize.
		 */
		this.init();

		/**
		 * Ready event trigger.
		 *
		 * @param {string} event
		 * @param {self} this
		 */
		TypoLab.trigger( 'ready', this );
	}

	/**
	 * Initialize TypoLab components.
	 */
	init() {

		/**
		 * Font selector.
		 */
		let fontListSelectContainer = document.querySelector( '.fonts-list-select' ),
			fontListSelectOptions = this.parseJSON( 'font_selector_fonts_list' );

		if ( fontListSelectContainer ) {

			// Init font selector
			let fontSelector = new TypoLab_Font_Selector( {
				fontListSelectContainer,
				fontListSelectOptions,
			} );

			// Update selected font
			fontSelector.on( 'font-select', font => this.setSelectedFont( font ) );

			// Set selected font
			this.setSelectedFont( fontSelector.getSelectedFont() );
		}

		/**
		 * Defined font variants.
		 */
		let fontVariantsContainer = document.querySelector( '.font-face-variants' ),
			fontVariants = this.parseJSON( 'font_face_variants' );

		/**
		 * Font variants manager.
		 */
		let fontFamilyNameInput = document.querySelector( '#font_family' );

		if ( fontFamilyNameInput && fontVariantsContainer ) {

			// Add blank variant by default
			if ( !fontVariants.length ) {
				fontVariants.push( new TypoLab_Font_Variant() );
			}

			// Init variants manager
			let fontVariantsManager = new TypoLab_Font_Variants_Manager( {
				fontFamilyNameInput,
				fontVariantsContainer,
				fontVariants,
			} );

			// Single variant updated
			fontVariantsManager.on( 'variant-updated', variant => this.variantsUpdated() );

			// Set selected font
			this.setSelectedFont( fontVariantsManager.getFont() );
		}

		/**
		 * External font variants manager.
		 */
		let stylesheetUrlInput = document.querySelector( '#stylesheet_url' );

		if ( stylesheetUrlInput && fontVariantsContainer ) {

			// Init custom variants manager
			let customFontVariantsManager = new TypoLab_External_Font_Variants_Manager( {
				stylesheetUrlInput,
				fontVariantsContainer,
				fontVariants,
			} );

			// Single variant updated
			customFontVariantsManager.on( 'variant-updated', variant => this.variantsUpdated() );

			// Set selected font
			this.setSelectedFont( customFontVariantsManager.getFont() );
		}

		/**
		 * Base selectors manager.
		 */
		let fontBaseSelectorsContainer = document.querySelector( '.font-base-selectors' ),
			fontBaseSelectors = this.parseJSON( 'font_base_selectors' );

		if ( fontBaseSelectorsContainer && fontBaseSelectors ) {

			// Init font base selectors manager
			let fontBaseSelectorsManager = new TypoLab_Font_Base_Selectors_Manager( {
				fontBaseSelectorsContainer,
				fontBaseSelectors,
				font: this.getSelectedFont(),
			} );

			// Updated font variants event on TypoLab
			TypoLab.on( 'font-variants-updated', variants => {
				fontBaseSelectorsManager.setFont( this.getSelectedFont() );
				fontBaseSelectorsManager.resetVariants();
			} );
		}

		/**
		 * Custom selectors manager.
		 */
		let customSelectorsContainer = document.querySelector( '.font-custom-selectors' ),
			customSelectors = this.parseJSON( 'font_custom_selectors' );

		if ( customSelectorsContainer && customSelectors ) {
			let customSelectorsManager = new TypoLab_Font_Custom_Selectors_Manager( {
				customSelectorsContainer,
				customSelectors,
				font: this.getSelectedFont(),
			} );

			// Updated font variants event on TypoLab
			TypoLab.on( 'font-variants-updated', variants => {
				customSelectorsManager.setFont( this.getSelectedFont() );
				customSelectorsManager.resetVariants();
			} );
		}

		/**
		 * Conditional statements manager.
		 */
		let conditionalStatementsContainer = document.querySelector( '.font-conditional-loading' ),
			conditionalStatements = this.parseJSON( 'conditional_statements' );

		if ( conditionalStatementsContainer && conditionalStatements ) {

			// Init conditional statements manager
			let conditionalStatementsManager = new TypoLab_Conditional_Statements_Manager( {
				conditionalStatementsContainer,
				conditionalStatements,
			} );
		}
	}

	/**
	 * Get selected font.
	 *
	 * @return {TypoLab_Font|null}
	 */
	getSelectedFont() {
		return this.selectedFont;
	}

	/**
	 * Set selected font.
	 *
	 * @param {TypoLab_Font} font
	 */
	setSelectedFont( font ) {
		if ( font ) {
			this.selectedFont = font;

			// Remove assigned callbacks
			this.selectedFont.off( 'variants-updated' );

			// Variants updated event
			this.selectedFont.on( 'variants-updated', () => this.variantsUpdated() );
		}
	}

	/**
	 * Variants updated event.
	 */
	variantsUpdated() {
		let font = this.getSelectedFont();

		// Only if font is selected
		if ( font ) {

			// Trigger "font-variants-updated" event on TypoLab instance
			TypoLab.trigger( 'font-variants-updated', font.getVariants() );
		}
	}

	/**
	 * Parse JSON from container ID.
	 *
	 * @param {string} containerId
	 * @param {array|object|null} defaultValue
	 *
	 * @return {array|object|null}
	 */
	parseJSON( containerId, defaultValue = null ) {
		return TypoLab.parseJSON( containerId, defaultValue );
	}
}

/**
 * Callbacks / events.
 */
_.extend( TypoLab, Backbone.Events );

/**
 * Parse JSON.
 *
 * @param {string} containerId
 * @param {array|object|null} defaultValue
 *
 * @return {array|object|null}
 */
TypoLab.parseJSON = function ( containerId, defaultValue = null ) {
	let jsonContainer = document.querySelector( `#${containerId}` );

	if ( jsonContainer ) {
		let parsed = JSON.parse( jsonContainer.innerHTML );

		if ( parsed ) {
			return parsed;
		}
	}
	return defaultValue;
};
