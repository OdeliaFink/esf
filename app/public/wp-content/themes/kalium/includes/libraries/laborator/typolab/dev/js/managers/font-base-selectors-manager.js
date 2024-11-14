import $ from "../var/jquery";
import TypoLab_Font_Selector from "../font-components/font-selector";

/**
 * Font base selectors class.
 *
 * @constructor
 */
export default class TypoLab_Font_Base_Selectors_Manager {

	/**
	 * Constructor.
	 *
	 * @param {Element} fontBaseSelectorsContainer
	 * @param {object} fontBaseSelectors
	 * @param {TypoLab_Font} font
	 */
	constructor( { fontBaseSelectorsContainer, fontBaseSelectors, font } ) {

		/**
		 * Container.
		 *
		 * @type {jQuery} $fontBaseSelectorsContainer
		 */
		this.$fontBaseSelectorsContainer = $( fontBaseSelectorsContainer );

		/**
		 * Base selectors.
		 *
		 * @type {object} baseSelectors
		 */
		this.baseSelectors = fontBaseSelectors.selectors;

		/**
		 * Selected values.
		 *
		 * @param {TypoLab_Font_Selector[]} selectedValues
		 */
		this.selectedValues = fontBaseSelectors.values.map( selector => {
			return new TypoLab_Font_Selector( {
				type: selector.type,
				id: selector.id,
				variant: selector.variant,
				include: selector.include,
			} )
		} );

		/**
		 * Current font.
		 *
		 * @type {TypoLab_Font} font
		 */
		this.font = font;

		// Init
		this.init();
	}

	/**
	 * Init.
	 */
	init() {

		// Setup base selectors
		_.each( this.baseSelectors, ( baseSelector, id ) => {
			baseSelector.$baseSelector = $( `.font-base-selector[data-id="${id}"]` );
			baseSelector.$checkbox = baseSelector.$baseSelector.find( 'input[type="checkbox"]' );
			baseSelector.$selectElement = baseSelector.$baseSelector.find( '.select-font-variant' );
		} );

		// Set selected values
		this.selectedValues.forEach( selector => {
			let baseSelector = this.baseSelectors[ selector.getId() ];

			// If base selector matches
			if ( baseSelector ) {

				// Checkbox check
				if ( selector.doInclude() ) {
					baseSelector.$checkbox.prop( 'checked', true );
					baseSelector.$baseSelector.addClass( 'checked' );
				}

				// Select element value
				baseSelector.selectedValue = selector.variant;
			}
		} );

		// Selected font
		let selectedFont = this.getFont();

		// If font is already assigned, populate variants (except for fonts that need fetching variants from remote)
		if ( selectedFont && !selectedFont.hasOwnProperty( 'fetched' ) ) {
			this.resetVariants();
		}

		/**
		 * Events.
		 */

		// Loop through base selectors
		_.each( this.getBaseSelectors(), baseSelector => {

			// Checkbox click
			if ( baseSelector.$baseSelector.on( 'click', ev => {
				if ( ev.target === baseSelector.$baseSelector[ 0 ] ) {
					baseSelector.$checkbox.click();
				}
			} ) ) ;

			// Select on change
			baseSelector.$selectElement.on( 'change', ev => {

				// Store current selected variant value
				this.setCurrentSelectedVariantValue( baseSelector );

				// Automatically check the checkbox
				baseSelector.$checkbox.prop( 'checked', true ).trigger( 'change' );
			} );

			// Checkbox on change
			baseSelector.$checkbox.on( 'change', ev => {
				baseSelector.$baseSelector[ baseSelector.$checkbox.is( ':checked' ) ? 'addClass' : 'removeClass' ]( 'checked' );
			} );
		} );
	}

	/**
	 * Get registered base selectors.
	 *
	 * @return {object[]}
	 */
	getBaseSelectors() {
		return this.baseSelectors;
	}

	/**
	 * Get current font.
	 *
	 * @return {TypoLab_Font}
	 */
	getFont() {
		return this.font;
	}

	/**
	 * Set font.
	 *
	 * @param {TypoLab_Font} font
	 */
	setFont( font ) {
		this.font = font;
	}

	/**
	 * Get current variant value from select element.
	 * Returns selected value only if it exists variantValues array.
	 *
	 * @param {object} baseSelector
	 * @param {string[]} selectedVariantValues
	 *
	 * @return {string|null}
	 */
	getCurrentSelectedVariantValue( baseSelector, selectedVariantValues ) {
		if ( _.contains( selectedVariantValues, baseSelector.selectedValue ) ) {
			return baseSelector.selectedValue;
		}

		return null;
	}

	/**
	 * Set current variant value for select element.
	 *
	 * @param {object} baseSelector
	 */
	setCurrentSelectedVariantValue( baseSelector ) {
		baseSelector.selectedValue = baseSelector.$selectElement.val();
	}

	/**
	 * Reset variants.
	 */
	resetVariants() {
		let font = this.getFont(),
			variants = font.getVariants(),
			variantValues = variants.map( variant => variant.toString( font ) ),
			defaultVariant = font.getDefaultVariant(),
			selectOptionsTpl = wp.template( 'select-options-list' );

		// Populate select fields
		_.each( this.getBaseSelectors(), baseSelector => {
			let selected = this.getCurrentSelectedVariantValue( baseSelector, variantValues ),
				optionsList = variants.map( variant => ( {
					value: variant.toString( font ),
					title: variant.getNicename(),
				} ) );

			// If variant value doesn't exists on select field
			if ( !selected && defaultVariant ) {
				baseSelector.selectedValue = selected = defaultVariant.toString( font );
			}

			// Add variants to select field
			baseSelector.$selectElement.html( selectOptionsTpl( {
				optionsList,
				selected,
			} ) );
		} );
	}
}
