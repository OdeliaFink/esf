import $ from "../../var/jquery";
import views from "../views-namespace";

/**
 * Button group button.
 *
 * @constructor
 */
export class Button_Group_Button extends Backbone.View {

	/**
	 * Preinitialize.
	 */
	preinitialize() {

		/**
		 * Template.
		 *
		 * @type {function}
		 */
		this.template = wp.template( 'button-group-button' );
	}

	/**
	 * Initialize.
	 *
	 * @param {object} options
	 */
	initialize( options ) {

		// Checked state
		this.model.on( 'change:checked', button => {
			const checkedClass = 'button-primary',
				uncheckedClass = 'button-alt';

			this.$el.removeClass( [checkedClass, uncheckedClass].join( ' ' ) ).addClass( button.isChecked() ? checkedClass : uncheckedClass );
		} );

		// Render
		this.render();
	}

	/**
	 * Render.
	 */
	render() {
		this.setElement( this.template( this.model.attributes ) );
	}
}

_.extend( views, { Button_Group_Button } );

/**
 * Button group.
 *
 * @constructor
 */
export class Button_Group extends Backbone.View {

	/**
	 * Preinitialize.
	 */
	preinitialize() {

		/**
		 * Tagname.
		 *
		 * @type {string}
		 */
		this.tagName = 'div';

		/**
		 * Class.
		 *
		 * @type {string}
		 */
		this.className = 'button-group';
	}

	/**
	 * Initialize.
	 *
	 * @param {object} options
	 */
	initialize( options ) {
		options = _.defaults( options, {
			collection: null,
			classes: [],
			allowNone: false,
			type: 'checkbox',
			input: null,
		} );

		/**
		 * Collection.
		 *
		 * @type {models.Button_Group}
		 */
		this.collection = options.collection;

		/**
		 * Allow none.
		 *
		 * @type {boolean}
		 */
		this.allowNone = options.allowNone;

		/**
		 * Is radio type.
		 *
		 * @type {boolean}
		 */
		this.isRadio = 'radio' === options.type;

		/**
		 * Input name.
		 *
		 * @type {string}
		 */
		this.input = options.input;

		/**
		 * Option views.
		 *
		 * @type {array}
		 */
		this.optionViews = [];

		// Add extra classes
		if ( options.classes.length ) {
			this.$el.addClass( options.classes.join( ' ' ) );
		}

		// Render
		this.render();

		// Setup events
		this.setupEvents();
	}

	/**
	 * Render.
	 *
	 * @return {Backbone.View}
	 */
	render() {
		this.$el.empty();

		// Add buttons
		this.collection.forEach( button => {
			let view = new views.Button_Group_Button( {
				model: button,
			} );

			// Setup tooltipster
			if ( button.get( 'tooltip' ) ) {
				view.$el.tooltipster( {
					theme: 'tooltipster-borderless',
					content: button.get( 'tooltip' ),
				} );
			}

			// Append to Button_Group
			this.$el.append( view.el );

			// Add to options view
			this.optionViews.push( view );
		} );

		// Add value container input
		if ( this.input ) {
			this.$input = $( '<input>', {
				type: 'hidden',
				name: this.input,
				value: this.getValue(),
			} );

			this.$input.prependTo( this.$el );
		}

		return this;
	}

	/**
	 * Setup events.
	 */
	setupEvents() {

		// Toggle state
		this.optionViews.forEach( view => {

			// Click event
			view.$el.on( 'click', ev => {
				ev.preventDefault();
				this.setValue( view.model.id );
			} );
		} );
	}

	/**
	 * Get checked value.
	 *
	 * @return {array|string}
	 */
	getValue() {
		let values = [];

		this.optionViews.forEach( view => {
			if ( view.model.isChecked() ) {
				values.push( view.model.id );
			}
		} );

		return this.isRadio ? ( values[ 0 ] ? values[ 0 ] : null ) : values;
	}

	/**
	 * Set checked value.
	 *
	 * @param {string} value
	 * @param {boolean=} suppressEvents
	 */
	setValue( value, suppressEvents = false ) {
		let currentValue = this.getValue();

		// Toggle state
		this.optionViews.forEach( view => {
			if ( value === view.model.id || _.contains( value, view.model.id ) ) {
				let checkedState = true;

				// Revert state
				if ( this.allowNone ) {
					checkedState = !view.model.isChecked();
				}

				// Radio type
				if ( this.isRadio ) {
					this.optionViews.forEach( _view => {
						if ( _view.model.id !== view.model.id ) {
							_view.model.set( 'checked', false );
						}
					} );
				}

				// Set checked state
				view.model.set( 'checked', checkedState );
			}
		} );

		// New value
		let newValue = this.getValue();

		// Trigger change event
		if ( false === _.isEqual( currentValue, newValue ) ) {

			// Update input
			if ( this.input ) {
				this.$input.val( newValue );
			}

			// Trigger change event
			if ( !suppressEvents ) {
				this.trigger( 'change', newValue );
			}
		}
	}
}

_.extend( views, { Button_Group } );
