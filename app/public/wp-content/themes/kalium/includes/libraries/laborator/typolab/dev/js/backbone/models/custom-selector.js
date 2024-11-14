import models from "../models-namespace";

/**
 * Custom selector.
 *
 * @constructor
 */
export class Custom_Selector extends Backbone.Model {

	/**
	 * Defaults.
	 *
	 * @return {object}
	 */
	defaults() {
		return {
			selectors: '',
			fontVariant: '',
			textTransform: {},
			fontSize: {},
			lineHeight: {},
			letterSpacing: {},
		};
	}

	/**
	 * Initialize.
	 */
	initialize( options ) {
		if ( !models.Custom_Selector.hasOwnProperty( 'instanceIterator' ) ) {
			models.Custom_Selector.instanceIterator = 0;
		}

		// Increment instance ID
		models.Custom_Selector.instanceIterator ++;

		// Set as model id
		this.set( 'id', `custom-selector-${models.Custom_Selector.instanceIterator}` );
	}
}

_.extend( models, { Custom_Selector } );

/**
 * Custom selectors collection.
 *
 * @constructor
 */
export class Custom_Selectors extends Backbone.Collection {

	/**
	 * Initialize.
	 *
	 * @param {object} options
	 */
	initialize( options ) {

		// Set model
		this.model = Custom_Selector;
	}
}

_.extend( models, { Custom_Selectors } );
