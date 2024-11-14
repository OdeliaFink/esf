import models from "../models-namespace";


/**
 * Font appearance item.
 *
 * @constructor
 */
export class Font_Appearance_Element extends Backbone.Model {

	/**
	 * Defaults.
	 *
	 * @return {object}
	 */
	defaults() {
		return {
			id: '',
			groupId: '',
			title: '',
			value: null,
		};
	}

	/**
	 * Get element's assigned value.
	 *
	 * @param {string} propName
	 * @param {object|string|number|null} defaultValue
	 *
	 * @return {object|string|number|null}
	 */
	getValue( propName = '', defaultValue = null ) {
		let value = this.get( 'value' );

		// Get value or value prop
		if ( value ) {
			value = propName ? value.get( propName ) : value.attributes;
		}

		// Default value
		if ( !value ) {
			value = defaultValue;
		}

		return value;
	}
}

_.extend( models, { Font_Appearance_Element } );

/**
 * Font appearance elements collection.
 */
export class Font_Appearance_Elements extends Backbone.Collection {

	/**
	 * Initialize.
	 *
	 * @param {object} options
	 */
	initialize( options ) {

		// Set model
		this.model = Font_Appearance_Element;
	}

	/**
	 * Model id.
	 *
	 * @param {object} attrs
	 *
	 * @return {string}
	 */
	modelId( attrs ) {
		return attrs.group_id + '_' + attrs.id;
	}
}

_.extend( models, { Font_Appearance_Elements } );
