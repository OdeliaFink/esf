import $ from "../var/jquery";
import TypoLab from "../typolab";
import TypoLab_Font_Appearance_Groups_Manager from "../managers/font-appearance-groups-manager";

/**
 * Font sizes management page.
 */
TypoLab.on( 'ready', function () {

	// Font appearance data
	let fontAppearance = TypoLab.parseJSON( 'font_appearance' );

	if ( fontAppearance ) {
		let fontAppearanceGroupsManager = new TypoLab_Font_Appearance_Groups_Manager( { fontAppearance } );
	}
} );
