import $ from "../../var/jquery";
import views from "../views-namespace";
import models from "../models";

/**
 * Font appearance group.
 *
 * @constructor
 */
export class Font_Appearance_Group extends Backbone.View {

	/**
	 * Initialize.
	 *
	 * @param {object} options
	 */
	initialize( options ) {

		// Defaults
		options = _.defaults( options, {
			responsiveBreakpoints: null,
		} );

		/**
		 * Responsive breakpoints.
		 *
		 * @type {models.Responsive_Breakpoints}
		 */
		this.responsiveBreakpoints = options.responsiveBreakpoints;

		// Render
		this.render();
	}

	/**
	 * Get group Id.
	 *
	 * @return {string}
	 */
	getGroupId() {
		return this.model.id;
	}

	/**
	 * Render.
	 */
	render() {

		// Select view container
		this.setElement( $( `.font-appearance-group[data-group-id="${this.getGroupId()}"]` ) );

		// Table body
		this.$tbody = this.$el.find( '.typolab-table tbody' );

		// Empty table
		this.$tbody.empty();

		// Add elements to the table
		this.model.getElements().forEach( fontAppearanceElement => {
			let fontAppearanceElementView = new views.Font_Appearance_Element( {
				model: fontAppearanceElement,
				fontAppearanceGroupInstance: this,
			} );

			// Add view to table
			this.$tbody.append( fontAppearanceElementView.el );
		} );
	}
};

_.extend( views, { Font_Appearance_Group } );
