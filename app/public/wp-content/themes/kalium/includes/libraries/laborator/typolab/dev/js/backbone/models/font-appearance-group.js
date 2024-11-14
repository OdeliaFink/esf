import models from "../models-namespace";

/**
 * Font appearance group.
 *
 * @constructor
 */
export class Font_Appearance_Group extends Backbone.Model {

	/**
	 * Defaults.
	 *
	 * @return {object}
	 */
	defaults() {
		return {
			id: '',
			name: '',
			elements: {},
		};
	}

	/**
	 * Preinitialize.
	 *
	 * @param {object} group
	 */
	preinitialize( group ) {

		// Group Id
		let groupId = group.id;

		// Map elements to Font_Appearance_Elements collection
		group.elements = new models.Font_Appearance_Elements( _.map( group.elements, ( element, id ) => ( {
			id,
			groupId,
			...element,
		} ) ) );
	}

	/**
	 * Get elements collection.
	 *
	 * @return {models.Font_Appearance_Elements}
	 */
	getElements() {
		return this.get( 'elements' );
	}
};

_.extend( models, { Font_Appearance_Group } );

/**
 * Font appearance group collection.
 *
 * @constructor
 */
export class Font_Appearance_Groups extends Backbone.Collection {

	/**
	 * Preinitialize.
	 */
	preinitialize() {
		this.model = Font_Appearance_Group;
	}
};

_.extend( models, { Font_Appearance_Groups } );
