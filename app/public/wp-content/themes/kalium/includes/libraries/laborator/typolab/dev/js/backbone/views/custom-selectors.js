import $ from "../../var/jquery";
import views from "../views-namespace";
import models from "../models";
import {defaultUnit, fontSizeUnits, letterSpacingUnits, lineHeightUnits} from "../../functions";

/**
 * Custom selector.
 *
 * @constructor
 */
export class Custom_Selector extends Backbone.View {

	/**
	 * Preinitialize.
	 */
	preinitialize() {

		/**
		 * Template.
		 *
		 * @type {function}
		 */
		this.template = wp.template( 'custom-selector' );

		/**
		 * Events.
		 *
		 * @type {object}
		 */
		this.events = {
			'click .remove-custom-selector': 'remove',
		};

	}

	/**
	 * Initialize.
	 */
	initialize( options ) {

		// Default options
		options = _.defaults( options, {
			customSelectorsInstance: null,
		} );

		/**
		 * Custom selectors instance.
		 *
		 * @type {views.Custom_Selectors}
		 */
		this.customSelectorsInstance = options.customSelectorsInstance;

		// Render
		this.render();
	}

	/**
	 * Get responsive breakpoints.
	 *
	 * @return {models.Responsive_Breakpoints}
	 */
	getResponsiveBreakpoints() {
		return this.customSelectorsInstance.responsiveBreakpoints;
	}

	/**
	 * Get predefined selectors.
	 *
	 * @return {object}
	 */
	getPredefinedSelectors() {
		return this.customSelectorsInstance.predefinedSelectors;
	}

	/**
	 * Filter other selectors.
	 *
	 * @param {array} selectors
	 *
	 * @return {object[]}
	 */
	filterOtherSelectors( selectors ) {
		let otherSelectors = [],
			predefinedSelectors = _.pluck( this.getPredefinedSelectors(), 'value' );

		_.each( selectors, selector => {
			if ( !_.contains( predefinedSelectors, selector ) ) {
				otherSelectors.push( {
					value: selector,
					name: selector,
				} );
			}
		} );

		return otherSelectors;
	}

	/**
	 * Get current font.
	 *
	 * @return {TypoLab_Font}
	 */
	getCurrentFont() {
		return this.customSelectorsInstance.currentFont;
	}

	/**
	 * Get font variants as options list.
	 *
	 * @return {string|null}
	 */
	getFontVariantsOptions() {
		if ( !this.getCurrentFont() ) {
			return null;
		}

		let font = this.getCurrentFont(),
			inheritValue = {
				value: '',
				title: '- Inherit -',
			},
			fontVariants = font.getVariants().map( variant => ( {
				value: variant.toString(),
				title: variant.getNicename(),
			} ) ),
			selectOptionsListTpl = wp.template( 'select-options-list' ),
			currentVariant = this.model.get( 'fontVariant' );

		return selectOptionsListTpl( {
			optionsList: [inheritValue, ...fontVariants],
			selected: currentVariant,
		} );
	}

	/**
	 * Remove selector.
	 *
	 * @param {Event} ev
	 */
	remove( ev ) {
		ev.preventDefault();
		this.customSelectorsInstance.collection.remove( this.model );
	}

	/**
	 * Render.
	 */
	render() {
		let $el = $( this.template( this.model.toJSON() ) ),
			model = this.model,
			modelId = model.id,
			selectors = model.get( 'selectors' ),
			fontVariant = model.get( 'fontVariant' ),
			textTransform = model.get( 'textTransform' ),
			fontSize = model.get( 'fontSize' ),
			lineHeight = model.get( 'lineHeight' ),
			letterSpacing = model.get( 'letterSpacing' ),
			getInputName = ( name, responsiveBreakpointId ) => {
				return `font_custom_selectors[${modelId}][${name}]` + ( responsiveBreakpointId ? `[${responsiveBreakpointId}]` : '' );
			};

		// Selectors input
		let $selectors = $( wp.template( 'custom-selectors-input' )( {
			inputName: getInputName( 'selectors' ) + '[]',
			predefinedSelectors: [
				...this.getPredefinedSelectors(),
				...this.filterOtherSelectors( selectors ),
			],
		} ) );

		if ( selectors ) {
			$selectors.val( selectors );
		}

		$el.find( '.column-selectors' ).append( $selectors );

		// Font variants
		let $fontVariants = $( '<select>', {
			name: getInputName( 'variant' ),
			class: 'font-variant-select',
		} );

		// Add options
		$fontVariants.html( this.getFontVariantsOptions() );

		$el.find( '.column-font-variant' ).append( $fontVariants );

		// Text transform responsive input
		let responsiveTextTransform = new views.Responsive_Input( {

			// Responsive breakpoints
			responsiveBreakpoints: this.getResponsiveBreakpoints(),

			// Value
			value: textTransform,

			// Render input
			renderInput: ( responsiveBreakpoint, valueGetter, valueSetter ) => {
				let buttonGroup = new views.Button_Group( {
					allowNone: true,
					type: 'radio',
					collection: new models.Button_Group( [
						new models.Button_Group_Button( {
							id: 'uppercase',
							text: 'TT',
							tooltip: 'Uppercase',
						} ),
						new models.Button_Group_Button( {
							id: 'capitalize',
							text: 'Tt',
							tooltip: 'Capitalize',
						} ),
						new models.Button_Group_Button( {
							id: 'lowercase',
							text: 'tt',
							tooltip: 'Lowercase',
						} ),
					] ),
					input: getInputName( 'text_transform', responsiveBreakpoint.id ),
				} );

				// Set current value
				buttonGroup.setValue( valueGetter() );

				// On inherit-value
				buttonGroup.on( 'inherit-value', value => {
					buttonGroup.setValue( value, true );
				} );

				// Value update event
				buttonGroup.on( 'change', value => valueSetter( value ) );

				return buttonGroup;
			},
		} );

		$el.find( '.column-font-case' ).append( responsiveTextTransform.el );

		// Font size responsive input
		let responsiveFontSize = new views.Responsive_Input( {

			// Responsive breakpoints
			responsiveBreakpoints: this.getResponsiveBreakpoints(),

			// Value
			value: fontSize,

			// Render input
			renderInput: ( responsiveBreakpoint, valueGetter, valueSetter ) => {
				let fontSizeInput = new views.Size_Unit_Input( {
					input: getInputName( 'font_size', responsiveBreakpoint.id ),
					units: fontSizeUnits,
					defaultUnit,
					min: 0,
				} );

				// Set value
				const value = valueGetter();

				if ( null !== value ) {
					fontSizeInput.setValue( value );
				}

				// On inherit-value
				fontSizeInput.on( 'inherit-value', value => {
					fontSizeInput.setValue( value, true );
				} );

				// Update value
				fontSizeInput.on( 'change', () => {
					valueSetter( fontSizeInput.getValue( true ) );
				} );

				return fontSizeInput;
			},
		} );

		$el.find( '.column-font-size' ).append( responsiveFontSize.el );

		// Line height responsive input
		let responsiveLineHeight = new views.Responsive_Input( {

			// Responsive breakpoints
			responsiveBreakpoints: this.getResponsiveBreakpoints(),

			// Value
			value: lineHeight,

			// Render input
			renderInput: ( responsiveBreakpoint, valueGetter, valueSetter ) => {
				let lineHeightInput = new views.Size_Unit_Input( {
					input: getInputName( 'line_height', responsiveBreakpoint.id ),
					units: lineHeightUnits,
					defaultUnit,
					min: 0,
				} );

				// Set value
				lineHeightInput.setValue( valueGetter() );

				// On inherit-value
				lineHeightInput.on( 'inherit-value', value => {
					lineHeightInput.setValue( value, true );
				} );

				// Update value
				lineHeightInput.on( 'change', () => {
					valueSetter( lineHeightInput.getValue( true ) );
				} );

				return lineHeightInput;
			},
		} );

		$el.find( '.column-line-height' ).append( responsiveLineHeight.el );

		// Letter spacing input
		let responsiveLetterSpacing = new views.Responsive_Input( {

			// Responsive breakpoints
			responsiveBreakpoints: this.getResponsiveBreakpoints(),

			// Value
			value: letterSpacing,

			// Render input
			renderInput: ( responsiveBreakpoint, valueGetter, valueSetter ) => {
				let letterSpacingInput = new views.Size_Unit_Input( {
					input: getInputName( 'letter_spacing', responsiveBreakpoint.id ),
					units: letterSpacingUnits,
					defaultUnit,
					min: 0,
				} );

				// Set value
				letterSpacingInput.setValue( valueGetter() );

				// On inherit-value
				letterSpacingInput.on( 'inherit-value', value => {
					letterSpacingInput.setValue( value, true );
				} );

				// Update value
				letterSpacingInput.on( 'change', () => {
					valueSetter( letterSpacingInput.getValue( true ) );
				} );

				return letterSpacingInput;
			},
		} );

		$el.find( '.column-letter-spacing' ).append( responsiveLetterSpacing.el );

		// Set element
		this.setElement( $el );

		// Make selectors select2 tags input
		$selectors.select2( {
			tags: true,
			placeholder: 'Choose from predefined or add your own CSS selectors',
		} );

		// Flatten values
		$selectors.on( 'change', ev => {
			$selectors.children().each( ( i, option ) => {
				let values = option.value.split( ',' );

				if ( 1 < values.length ) {
					values.forEach( value => {
						value = value.trim();
						let option = new Option( value, value, true, true );

						$selectors.append( option );
					} );

					option.remove();
				}
			} );
		} );

		/**
		 * Events.
		 */

		this.customSelectorsInstance.on( 'variants-updated', () => {
			$fontVariants.html( this.getFontVariantsOptions( fontVariant ) );
		} );

		$selectors.on( 'change', ev => {
			model.set( 'selectors', $selectors.val() );
		} );

		$fontVariants.on( 'change', ev => {
			model.set( 'fontVariant', $fontVariants.val() );
		} );

		responsiveTextTransform.on( 'change', value => {
			model.set( 'textTransform', value );
		} );

		responsiveFontSize.on( 'change', value => {
			model.set( 'fontSize', value );
		} );

		responsiveLineHeight.on( 'change', value => {
			model.set( 'lineHeight', value );
		} );

		responsiveLetterSpacing.on( 'change', value => {
			model.set( 'letterSpacing', value );
		} );
	}
}

_.extend( views, { Custom_Selector } );

/**
 * Custom selectors.
 *
 * @constructor
 */
export class Custom_Selectors extends Backbone.View {

	/**
	 * Preinitialize.
	 */
	preinitialize() {

		/**
		 * Container element.
		 *
		 * @type {jQuery}
		 */
		this.el = $( '.font-custom-selectors' );

		/**
		 * Events.
		 *
		 * @type {object}
		 */
		this.events = {
			'click #add-new-selector': 'addNewSelector',
		};

		/**
		 * Custom selector views.
		 *
		 * @type {views.Custom_Selector[]}
		 */
		this.customSelectorViews = [];
	}

	/**
	 * Initialize.
	 *
	 * @param {object} options
	 */
	initialize( options ) {

		// Defaults
		options = _.defaults( options, {
			responsiveBreakpoints: null,
			predefinedSelectors: null,
			collection: null,
			currentFont: null,
		} );

		/**
		 * Collection.
		 *
		 * @type {models.Custom_Selectors}
		 */
		this.collection = options.collection;

		/**
		 * Responsive breakpoints.
		 *
		 * @type {models.Responsive_Breakpoints}
		 */
		this.responsiveBreakpoints = options.responsiveBreakpoints;

		/**
		 * Predefined selectors.
		 *
		 * @type {object}
		 */
		this.predefinedSelectors = options.predefinedSelectors;

		/**
		 * Current font.
		 *
		 * @type {TypoLab_Font}
		 */
		this.currentFont = options.currentFont;

		/**
		 * Table tbody.
		 *
		 * @type {jQuery}
		 */
		this.$tbody = this.$el.find( 'tbody' );

		// Render
		this.render();

		// Set comparator for collection
		this.collection.comparator = 'index';

		// Make sortable
		this.$tbody.sortable( {
			axis: 'y',
			handle: '.column-sort a',
			update: ev => {

				// Set new index for each model
				this.$tbody.children().each( ( newIndex, el ) => {
					this.collection.at( el.index ).set( 'index', newIndex );
				} );

				// Sort collection
				this.collection.sort();
			},
		} );

		/**
		 * Events.
		 */

		this.collection.bind( 'add', () => this.render() );
		this.collection.bind( 'remove', () => this.render() );
		this.collection.bind( 'reset', () => this.render() );
	}

	/**
	 * Get current responsive breakpoint.
	 *
	 * @return {models.Responsive_Breakpoint}
	 */
	getCurrentResponsiveBreakpont() {
		for ( let responsiveBreakpoint of this.responsiveBreakpoints ) {
			if ( responsiveBreakpoint.isSelected() ) {
				return responsiveBreakpoint;
			}
		}

		return this.responsiveBreakpoints.at( 0 );
	}

	/**
	 * Add new custom selector.
	 *
	 * @param {Event} ev
	 */
	addNewSelector( ev ) {
		ev.preventDefault();

		this.collection.add( new models.Custom_Selector( {} ) );

		// Reset indexes
		this.resetIndexes();
	}

	/**
	 * Reset custom selector indexes for sorting.
	 */
	resetIndexes() {
		this.collection.forEach( ( customSelector, index ) => {
			// Set sorting index
			customSelector.set( 'index', index );
		} );
	}

	/**
	 * Render.
	 */
	render() {

		// Reset custom selector views
		this.customSelectorViews = [];

		// Empty container
		this.$tbody.empty();

		// Render custom selectors
		this.collection.forEach( ( customSelector, index ) => {

			// Create view
			const view = new views.Custom_Selector( {
				model: customSelector,
				customSelectorsInstance: this,
			} );

			// Assign index for each view
			view.el.index = index;

			// Append view to table
			this.$tbody.append( view.el );

			// Add to views list
			this.customSelectorViews.push( view );
		} );

		// Set sorting indexes
		this.resetIndexes();

		// Empty collection
		if ( 0 === this.collection.length ) {
			const emptySelectorsTpl = wp.template( 'custom-selector-empty' );
			this.$tbody.append( emptySelectorsTpl() );
		}
	}
}

_.extend( views, { Custom_Selectors } );
