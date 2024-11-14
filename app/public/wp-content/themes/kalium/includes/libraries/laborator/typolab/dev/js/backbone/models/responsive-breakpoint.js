import models from "../models-namespace";

/**
 * Responsive breakpoint.
 *
 * @constructor
 */
export class Responsive_Breakpoint extends Backbone.Model {

	/**
	 * Defaults.
	 *
	 * @return {object}
	 */
	defaults() {
		return {
			id: '',
			name: '',
			icon: '',
			min_size: '',
			max_size: '',
			default: '',
			inherit: '',
			selected: false,
		};
	}

	/**
	 * Initialize.
	 *
	 * @param {object} options
	 */
	initialize( options ) {

		// If its default, set selected by default
		if ( options.default ) {
			this.set( 'selected', true );
		}
	}

	/**
	 * Selected state.
	 *
	 * @return {boolean}
	 */
	isSelected() {
		return this.get( 'selected' );
	}

	/**
	 * Export to button group.
	 *
	 * @return {object}
	 */
	prepareForButtonGroup() {
		return {
			id: this.id,
			tooltip: this.get( 'name' ),
			icon: this.get( 'icon' ),
			checked: this.get( 'default' ),
		};
	}
}

_.extend( models, { Responsive_Breakpoint } );

/**
 * Responsive breakpoints collection.
 *
 * @constructor
 */
export class Responsive_Breakpoints extends Backbone.Collection {

	/**
	 * Initialize.
	 */
	initialize() {

		/**
		 * Model type.
		 *
		 * @type {models.Responsive_Breakpoint}
		 */
		this.model = Responsive_Breakpoint;
	}
};

_.extend( models, { Responsive_Breakpoints } );
