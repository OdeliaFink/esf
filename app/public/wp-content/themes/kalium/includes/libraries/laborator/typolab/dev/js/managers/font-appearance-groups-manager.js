import models from "../backbone/models";
import views from "../backbone/views";

/**
 * Font appearance groups manager class.
 */
export default class TypoLab_Font_Appearance_Groups_Manager {

	/**
	 * Constructor.
	 *
	 * @param {object} fontAppearance
	 */
	constructor( { fontAppearance } ) {

		/**
		 * Groups.
		 *
		 * @type {object[]}
		 */
		this.fontAppearanceGroups = new models.Font_Appearance_Groups( fontAppearance.groups );

		/**
		 * Responsive breakpoints.
		 *
		 * @type {models.Responsive_Breakpoints}
		 */
		this.responsiveBreakpoints = new models.Responsive_Breakpoints( _.map( fontAppearance.responsive, ( responsiveBreakpoint, id ) => ( {
			id,
			...responsiveBreakpoint,
		} ) ) );

		/**
		 * Element values.
		 *
		 * @type {models.Font_Appearance_Element_Values}
		 */
		this.values = new models.Font_Appearance_Element_Values( _.map( fontAppearance.values, value => ( {
			id: value.id,
			groupId: value.group_id,
			fontSize: value.font_size,
			lineHeight: value.line_height,
			letterSpacing: value.letter_spacing,
			textTransform: value.text_transform,
		} ) ) );

		// Init
		this.init();
	}

	/**
	 * Get new instance of responsive breakpoints.
	 *
	 * @return {models.Responsive_Breakpoints}
	 */
	getResponsiveBreakpoints() {
		return new models.Responsive_Breakpoints( this.responsiveBreakpoints.toJSON() );
	}

	/**
	 * Initialize.
	 */
	init() {

		// Assign element values
		this.assignElementValues();

		// Initialize font appearance groups
		this.fontAppearanceGroups.forEach( fontAppearanceGroup => {
			let responsiveBreakpoints = this.getResponsiveBreakpoints(),
				responsiveButtonGroup = new models.Button_Group( responsiveBreakpoints.map( responsiveBreakpoint => responsiveBreakpoint.prepareForButtonGroup() ) ),
				responsiveBreakpointsButtons = new views.Button_Group( {
					collection: responsiveButtonGroup,
					classes: ['responsive-devices'],
					type: 'radio',
				} ),
				fontAppearanceGroupView = new views.Font_Appearance_Group( {
					responsiveBreakpoints,
					model: fontAppearanceGroup,
				} );

			// On responsive breakpoint change
			responsiveBreakpointsButtons.on( 'change', breakpointId => responsiveBreakpoints.forEach( responsiveBreakpoint => {
				let isSelected = breakpointId === responsiveBreakpoint.id,
					className = `font-appearance-group--${responsiveBreakpoint.id}`;

				fontAppearanceGroupView.$el[ isSelected ? 'addClass' : 'removeClass' ]( className );

				responsiveBreakpoint.set( 'selected', isSelected );
			} ) );

			// Prepend responsive buttons to the container
			fontAppearanceGroupView.$el.find( 'tr.heading th' ).append( responsiveBreakpointsButtons.el );
		} );
	}

	/**
	 * Assign element values.
	 */
	assignElementValues() {

		// Loop through groups
		this.fontAppearanceGroups.forEach( fontAppearanceGroup => {
			let elements = fontAppearanceGroup.getElements();

			// Loop through elements
			elements.forEach( element => this.assignElementValue( element ) );
		} );
	}

	/**
	 * Assign element value.
	 *
	 * @param {models.Font_Appearance_Element} element
	 */
	assignElementValue( element ) {
		let matchedValues = this.values.where( {
			id: element.get( 'id' ),
			groupId: element.get( 'groupId' ),
		} );

		// Only matched exact value
		if ( 1 === matchedValues.length ) {
			element.set( 'value', matchedValues[ 0 ] );
		}
	}
}
