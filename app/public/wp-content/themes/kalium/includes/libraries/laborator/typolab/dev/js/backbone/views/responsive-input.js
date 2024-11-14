import views from "../views-namespace";
import $ from "../../var/jquery";

/**
 * Responsive input.
 *
 * @constructor
 */
export class Responsive_Input extends Backbone.View {

	/**
	 * Preinitialize.
	 */
	preinitialize() {

		/**
		 * Classname.
		 *
		 * @type {string}
		 */
		this.className = 'responsive-input';
	}

	/**
	 * Initialize.
	 *
	 * @param {object} options
	 */
	initialize( options ) {

		/**
		 * Input value storage.
		 *
		 * @type {Backbone.Model}
		 */
		this.model = new Backbone.Model( {} );

		/**
		 * Responsive breakpoints.
		 *
		 * @type {models.Responsive_Breakpoints}
		 */
		this.responsiveBreakpoints = options.responsiveBreakpoints;

		/**
		 * Assigned value reference.
		 *
		 * @type {object}
		 */
		this.value = options.value;

		/**
		 * Render input function.
		 *
		 * @type {function}
		 */
		this.renderInput = options.renderInput;

		// Set responsive values
		this.responsiveBreakpoints.forEach( responsiveBreakpoint => {
			let value = this.value ? this.value[ responsiveBreakpoint.id ] : null;
			this.model.set( responsiveBreakpoint.id, value );
		} );

		// Render
		this.render();

		/**
		 * Events.
		 */

		// Set current breakpoint entry
		this.showCurrentBreakpointEntry();

		// Set current responsive breakpoint
		this.responsiveBreakpoints.bind( 'change', () => this.showCurrentBreakpointEntry() );

		// Value update
		this.model.on( 'change', () => {
			this.trigger( 'change', this.getValue() );
		} );
	}

	/**
	 * Show current breakpoint entry.
	 */
	showCurrentBreakpointEntry() {
		this.responsiveBreakpointElements.forEach( responsiveBreakpointElement => {
			if ( responsiveBreakpointElement.responsiveBreakpoint.isSelected() ) {
				responsiveBreakpointElement.$el.addClass( 'current' );
			} else {
				responsiveBreakpointElement.$el.removeClass( 'current' );
			}
		} );
	}

	/**
	 * Get value.
	 *
	 * @return {object}
	 */
	getValue() {
		let value = {};

		this.responsiveBreakpoints.forEach( responsiveBreakpoint => {
			let responsiveBreakpointId = responsiveBreakpoint.id,
				currentValue = this.getResponsiveValue( responsiveBreakpointId ),
				inheritValue = this.getInheritValue( responsiveBreakpoint );

			value[ responsiveBreakpointId ] = currentValue || inheritValue;
		} );

		return value;
	}

	/**
	 * Update assigned value reference.
	 */
	updateValue() {
		_.each( this.getValue(), ( value, key ) => {
			this.value[ key ] = value;
		} );
	}

	/**
	 * Get responsive value.
	 *
	 * @return {string|number|object}
	 */
	getResponsiveValue( responsiveBreakpointId ) {
		return this.model.get( responsiveBreakpointId );
	}

	/**
	 * Set responsive value.
	 *
	 * @param {string} responsiveBreakpointId
	 * @param {string|number|object}
	 */
	setResponsiveValue( responsiveBreakpointId, value ) {
		this.model.set( responsiveBreakpointId, value );

		// Trigger events for inherit values
		this.responsiveBreakpointElements.forEach( responsiveBreakpointElement => {
			let responsiveBreakpoint = responsiveBreakpointElement.responsiveBreakpoint;

			if ( !this.getResponsiveValue( responsiveBreakpoint.id ) ) {
				let inheritValue = this.getInheritValue( responsiveBreakpoint );

				// Trigger inherit value
				responsiveBreakpointElement.inputView.trigger( 'inherit-value', inheritValue );
				this.updateValue();
			}
		} );
	}

	/**
	 * Get inherit value.
	 *
	 * @param {models.Responsive_Breakpoint} responsiveBreakpoint
	 *
	 * @return {string|number}
	 */
	getInheritValue( responsiveBreakpoint ) {
		let inheritFrom = responsiveBreakpoint ? responsiveBreakpoint.get( 'inherit' ) : null;

		if ( inheritFrom ) {
			let inheritValue = this.getResponsiveValue( inheritFrom );

			return inheritValue ? inheritValue : this.getInheritValue( this.responsiveBreakpoints.findWhere( {
				id: inheritFrom,
			} ) );
		}

		return null;
	}

	/**
	 * Render.
	 */
	render() {

		// Responsive breakpoint element
		this.responsiveBreakpointElements = [];

		// Add responsive inputs
		this.responsiveBreakpoints.forEach( responsiveBreakpoint => {
			let $container = $( '<div>', {
					class: [
						'responsive-input-entry',
						`responsive-input-entry-${responsiveBreakpoint.id}`
					].join( ' ' ),
				} ),
				responsiveBreakpointId = responsiveBreakpoint.id,
				valueGetter = () => this.getValue()[ responsiveBreakpointId ],
				valueSetter = value => this.setResponsiveValue( responsiveBreakpointId, value ),
				inputView = this.renderInput( responsiveBreakpoint, valueGetter, valueSetter );

			// Append input to container
			$container.append( inputView.el );

			// Insert in responsive breakpoint elements array
			this.responsiveBreakpointElements.push( {
				$el: $container,
				inputView,
				responsiveBreakpoint,
			} );

			// Add responsive input entry to container
			$container.appendTo( this.$el );
		} );
	}
}

_.extend( views, { Responsive_Input } );
