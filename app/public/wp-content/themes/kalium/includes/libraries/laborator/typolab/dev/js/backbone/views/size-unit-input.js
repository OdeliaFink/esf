import $ from "../../var/jquery";
import views from "../views-namespace";

/**
 * Size unit input.
 *
 * @constructor
 */
export class Size_Unit_Input extends Backbone.View {

	/**
	 * Preinitialize.
	 */
	preinitialize() {

		/**
		 * Template.
		 *
		 * @type {function}
		 */
		this.template = wp.template( 'size-unit-input' );
	}

	/**
	 * Initialize.
	 *
	 * @param {object} options
	 */
	initialize( options ) {

		// Default options
		options = _.defaults( options, {
			input: null,
			units: {},
			defaultUnit: null,
			value: null,
			min: null,
			max: null,
			step: 'any',
		} );

		/**
		 * Input value storage.
		 *
		 * @type {Backbone.Model}
		 */
		this.model = new Backbone.Model( {
			value: null,
			unit: null,
		} );

		/**
		 * Input name.
		 *
		 * @type {string}
		 */
		this.input = options.input;

		/**
		 * Units.
		 *
		 * @type {object}
		 */
		this.units = options.units;

		/**
		 * Default unit.
		 *
		 * @type {string}
		 */
		this.defaultUnit = options.defaultUnit;

		/**
		 * Value.
		 *
		 * @type {number|null}
		 */
		this.value = options.value;

		/**
		 * Minimum value.
		 *
		 * @type {number|null}
		 */
		this.min = options.min;

		/**
		 * Maximum value.
		 *
		 * @type {number|null}
		 */
		this.max = options.max;

		/**
		 * Step value.
		 *
		 * @type {number|null}
		 */
		this.step = options.step;

		// Set default unit
		this.model.set( 'unit', this.defaultUnit );

		// Render
		this.render();
	}

	/**
	 * Get value.
	 *
	 * @param {boolean} asString
	 *
	 * @return {object|string}
	 */
	getValue( asString ) {
		let size = this.model.toJSON();

		if ( asString ) {
			return [size.value, size.unit].join( '' );
		}

		return size;
	}

	/**
	 * Set value.
	 *
	 * @param {string} newValue
	 * @param {boolean=} suppressEvents
	 */
	setValue( newValue, suppressEvents = false ) {
		let value,
			unit;

		if ( 'string' === typeof newValue ) {
			for ( let _unit in this.units ) {
				let matches = newValue.match( new RegExp( `^(?<value>[0-9\.]*)(?<unit>${_unit})$` ) );

				if ( matches ) {
					value = matches.groups.value;
					unit = matches.groups.unit;
					break;
				}
			}
		} else if ( newValue && 'object' === typeof newValue && ( newValue.hasOwnProperty( 'value' ) && newValue.hasOwnProperty( 'unit' ) ) ) {
			value = newValue.value;
			unit = newValue.unit;
		}

		// Set value in input
		this.$value.val( value );
		this.$unitSelect.val( unit );

		// Update model value and render select text
		this.renderUnitText();
		this.updateModelValue( suppressEvents );
	}

	/**
	 * Render.
	 */
	render() {
		let $el = $( this.template( {
			value: this.value,
			units: this.units,
			min: this.min,
			max: this.max,
			step: this.step,
		} ) );

		// Size
		this.$value = $el.find( '.value-input' );

		// Unit
		this.$unitText = $el.find( '.unit-text' );
		this.$unitSelect = $el.find( '.units-select' );

		// Default unit
		this.$unitSelect.val( this.model.get( 'unit' ) );

		// Add value container input
		if ( this.input ) {
			this.$input = $( '<input>', {
				type: 'hidden',
				name: this.input,
				value: this.getValue( true ),
			} );

			this.$input.prependTo( $el );
		}

		// Render unit text
		this.renderUnitText();

		// Set element
		this.setElement( $el );

		/**
		 * Events.
		 */

		// Update value
		this.$value.on( 'input', () => this.updateModelValue() );
		this.$unitSelect.on( 'change', () => this.updateModelValue() );

		// Render unit text on unit change
		this.$unitSelect.on( 'change', () => this.renderUnitText() );
	}

	/**
	 * Update model value and trigger change event.
	 *
	 * @param {boolean=} suppressEvents
	 */
	updateModelValue( suppressEvents = false ) {
		this.model.set( {
			value: this.$value.val(),
			unit: this.$unitSelect.val() || this.$unitSelect.find( 'option:first-child' ).val(),
		} );

		// Update input
		if ( this.input ) {
			this.$input.val( this.getValue( true ) );
		}

		// Trigger change event
		if ( !suppressEvents ) {
			this.trigger( 'change', this.getValue() );
		}
	}

	/**
	 * Render unit text.
	 */
	renderUnitText() {
		this.$unitText.html( this.$unitSelect.find( 'option:selected' ).html() );
	}
}

_.extend( views, { Size_Unit_Input } );
