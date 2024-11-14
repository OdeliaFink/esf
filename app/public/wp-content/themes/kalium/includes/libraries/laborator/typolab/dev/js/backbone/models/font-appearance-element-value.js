import models from "../models-namespace";

/**
 * Font appearance element value.
 *
 * @constructor
 */
export class Font_Appearance_Element_Value extends Backbone.Model {

	/**
	 * Defaults.
	 *
	 * @return {object}
	 */
	defaults() {
		return {
			id: '',
			groupId: '',
			fontSize: {},
			lineHeight: {},
			letterSpacing: {},
			textTransform: {},
		};
	}
}

_.extend( models, { Font_Appearance_Element_Value } );

/**
 * Font appearance element values collection.
 *
 * @constructor
 */
export class Font_Appearance_Element_Values extends Backbone.Collection {

	/**
	 * Preinitialize.
	 */
	preinitialize() {
		this.model = Font_Appearance_Element_Value;
	}
}

_.extend( models, { Font_Appearance_Element_Values } );