import $ from "../var/jquery";
import TypoLab from "../typolab";

/**
 * Fonts list page.
 */
TypoLab.on( 'ready', function () {
	let $fontListForm = $( '.typolab-fonts-list' ),
		$table = $fontListForm.find( 'table.fonts' );

	// When fonts list table is present
	if ( $fontListForm.length ) {

		// Delete font
		$table.on( 'click', '.delete a', ev => {
			if ( !confirm( 'Are you sure you want to delete this font?' ) ) {
				ev.preventDefault();
			}
		} );

		// Re-install font
		$table.on( 'click', '.flush a', ev => {
			if ( !confirm( `Confirm font reinstall?\nThis will download font files again and create new stylesheet file.` ) ) {
				ev.preventDefault();
			}
		} );

		// Bulk delete
		$fontListForm.on( 'submit', ev => {
			let fontIds = $fontListForm.find( '.check-column input:checked' ).map( ( i, el ) => {
				return el.value;
			} );

			// Confirm delete bulk action
			if ( 0 < fontIds.length && 'delete' === $fontListForm.find( 'select[name="action"]' ).val() && !confirm( 'Are you sure you want to delete selected fonts?' ) ) {
				ev.preventDefault();
			}

			// Confirm flush bulk action
			if ( 0 < fontIds.length && 'flush' === $fontListForm.find( 'select[name="action"]' ).val() && !confirm( `Confirm fonts reinstall?\nThis will download font files again and create new stylesheet file for each font.` ) ) {
				ev.preventDefault();
			}
		} );
	}
} );