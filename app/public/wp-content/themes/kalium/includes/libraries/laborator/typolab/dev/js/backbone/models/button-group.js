import models from "../models-namespace";

/**
 * Button group model.
 *
 * @constructor
 */
export class Button_Group_Button extends Backbone.Model {

	/**
	 * Defaults.
	 *
	 * @type {object}
	 */
	defaults() {
		return {
			id: null,
			text: '',
			tooltip: '',
			icon: '',
			active: false,
		};
	}

	/**
	 * Check if current button is active.
	 *
	 * @return {boolean}
	 */
	isChecked() {
		return this.has( 'checked' ) && this.get( 'checked' );
	}
}

_.extend( models, { Button_Group_Button } );

/**
 * Button group collection.
 *
 * @constructor
 */
export class Button_Group extends Backbone.Collection {

	/**
	 * Model.
	 *
	 * @param {object[]} attrs
	 * @param {object} options
	 *
	 * @return {Backbone.Model}
	 */
	preinitialize( attrs, options ) {
		this.model = Button_Group_Button;
	}
}

_.extend( models, { Button_Group } );
