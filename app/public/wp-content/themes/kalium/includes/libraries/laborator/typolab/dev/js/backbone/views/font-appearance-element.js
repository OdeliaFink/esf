import $ from "../../var/jquery";
import views from "../views-namespace";
import models from "../models";
import {fontSizeUnits, letterSpacingUnits, lineHeightUnits, defaultUnit} from "../../functions";

/**
 * Font appearance element.
 *
 * @constructor
 */
export class Font_Appearance_Element extends Backbone.View {

	/**
	 * Preinitialize.
	 */
	preinitialize() {

		/**
		 * Template.
		 *
		 * @type {function}
		 */
		this.template = wp.template( 'font-appearance-element' );
	}

	/**
	 * Initialize.
	 *
	 * @param {object} options
	 */
	initialize( options ) {

		// Defaults
		options = _.defaults( options, {
			fontAppearanceGroupInstance: null,
		} );

		/**
		 * Font appearance group instance.
		 *
		 * @type {views.Font_Appearance_Group}
		 */
		this.fontAppearanceGroupInstance = options.fontAppearanceGroupInstance;

		// Render
		this.render();
	}

	/**
	 * Get group Id.
	 *
	 * @return {string}
	 */
	getGroupId() {
		return this.fontAppearanceGroupInstance.getGroupId();
	}

	/**
	 * Get responsive breakpoints.
	 *
	 * @return {models.Responsive_Breakpoints}
	 */
	getResponsiveBreakpoints() {
		return this.fontAppearanceGroupInstance.responsiveBreakpoints;
	}

	/**
	 * Render.
	 */
	render() {
		let $el = $( this.template( this.model.toJSON() ) ),
			model = this.model,
			id = model.id,
			fontSize = model.getValue( 'fontSize', {} ),
			lineHeight = model.getValue( 'lineHeight', {} ),
			letterSpacing = model.getValue( 'letterSpacing', {} ),
			textTransform = model.getValue( 'textTransform', {} ),
			getInputName = ( name, responsiveBreakpointId ) => {
				return `font_appearance_groups[${this.getGroupId()}][${id}][${name}]` + ( responsiveBreakpointId ? `[${responsiveBreakpointId}]` : '' );
			};

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

		// Set element
		this.setElement( $el );

		/**
		 * Events.
		 */

		// Label click
		this.$el.on( 'click', '.column-element label', ev => {
			$el.find( '.column-font-size .value-input' ).focus();
		} );
	}
}

_.extend( views, { Font_Appearance_Element } );
