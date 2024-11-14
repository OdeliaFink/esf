import $ from "../var/jquery";
import TypoLab from "../typolab";

/**
 * Edit font page.
 */
TypoLab.on( 'ready', function () {
	let $editFontForm = $( '#edit-font-form' );

	// Edit font form
	if ( $editFontForm.length ) {

		/**
		 * Advanced options toggle.
		 */
		let $advancedOptionsLink = $editFontForm.find( '#typolab-toggle-advanced-options' ),
			$advancedOptionsContainer = $editFontForm.find( '#typolab-advanced-options' );

		// On toggle
		$advancedOptionsLink.on( 'click', ev => {
			ev.preventDefault();
			$advancedOptionsContainer.add( $advancedOptionsLink ).toggleClass( 'visible' );
		} );

		/**
		 * Font status class by its value.
		 */
		let $fontStatus = $editFontForm.find( '#font_status' ),
			setFontStatusClass = () => {
				let $parent = $fontStatus.closest( '.grouped-input' );

				$parent.removeClass( 'red green' );

				if ( 'active' === $fontStatus.val() ) {
					$parent.addClass( 'green' );
				} else {
					$parent.addClass( 'red' );
				}
			};

		// Check state
		setFontStatusClass();

		// Assign event
		$fontStatus.on( 'change', setFontStatusClass );
	}
} );