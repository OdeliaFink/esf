import $ from "../var/jquery";
import views from "../backbone/views";
import models from "../backbone/models";
import addNewSelector from "../backbone/views";

/**
 * Custom Selectors manager.
 *
 * @constructor
 */
export default class TypoLab_Font_Custom_Selectors_Manager {

	/**
	 * Constructor.
	 *
	 * @param {HTMLElement} customSelectorsContainer
	 * @param {object} customSelectors
	 * @param {TypoLab_Font} font
	 */
	constructor( { customSelectorsContainer, customSelectors, font } ) {

		/**
		 * Container.
		 */
		this.$customSelectorsContainer = $( customSelectorsContainer );

		/**
		 * Responsive breakpoints.
		 *
		 * @type {models.Responsive_Breakpoints}
		 */
		this.responsiveBreakpoints = new models.Responsive_Breakpoints( _.map( customSelectors.responsive, ( responsiveBreakpoint, id ) => ( {
			id,
			...responsiveBreakpoint,
		} ) ) );

		/**
		 * Custom selectors collection.
		 *
		 * @type {models.Custom_Selectors}
		 */
		this.customSelectors = new models.Custom_Selectors( _.map( customSelectors.values, customSelector => ( {
			selectors: customSelector.selectors,
			fontVariant: customSelector.variant,
			textTransform: customSelector.text_transform,
			fontSize: customSelector.font_size,
			lineHeight: customSelector.line_height,
			letterSpacing: customSelector.letter_spacing,
		} ) ) );

		/**
		 * Predefined selectors.
		 */
		this.predefinedSelectors = _.map( customSelectors.predefined_selectors, ( selector, id ) => ( {
			...selector,
			value: `:${id}:`,
		} ) );

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
	 * Initialize.
	 */
	init() {

		// Responsive buttons
		let responsiveButtonGroup = new models.Button_Group( this.responsiveBreakpoints.map( responsiveBreakpoint => responsiveBreakpoint.prepareForButtonGroup() ) );

		// Create responsive buttons
		this.responsiveBreakpointsButtons = new views.Button_Group( {
			collection: responsiveButtonGroup,
			classes: ['responsive-devices'],
			type: 'radio',
		} );

		// On responsive breakpoint change
		this.responsiveBreakpointsButtons.on( 'change', breakpointId => this.responsiveBreakpoints.forEach( responsiveBreakpoint => {
			let isSelected = breakpointId === responsiveBreakpoint.id,
				className = `font-custom-selectors--${responsiveBreakpoint.id}`;

			this.$customSelectorsContainer[ isSelected ? 'addClass' : 'removeClass' ]( className );

			responsiveBreakpoint.set( 'selected', isSelected );
		} ) );

		// Prepend responsive buttons to the container
		this.$customSelectorsContainer.prepend( this.responsiveBreakpointsButtons.el );

		// Custom selectors view
		this.customSelectorsTable = new views.Custom_Selectors( {
			responsiveBreakpoints: this.responsiveBreakpoints,
			predefinedSelectors: this.predefinedSelectors,
			collection: this.customSelectors,
			currentFont: this.font,
		} );
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
	 * Reset variants.
	 */
	resetVariants() {
		this.customSelectorsTable.currentFont = this.getFont();
		this.customSelectorsTable.trigger( 'variants-updated' );
	}
}
