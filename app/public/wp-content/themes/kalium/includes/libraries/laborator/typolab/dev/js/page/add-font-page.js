import $ from "../var/jquery";
import TypoLab from "../typolab";

/**
 * Add Font from Source.
 */
TypoLab.on( 'ready', function () {
	let $addFontFromSource = $( '.typolab-select-font-source' );

	if ( $addFontFromSource.length ) {
		let $fontSources = $addFontFromSource.find( 'tbody tr' ),
			showFontSourceDescription = function ( source_id ) {
				$( '.font-source-description' ).removeClass( 'selected' ).filter( '.font-source-description-' + source_id ).addClass( 'selected' );
			};

		// Change font source
		$fontSources.on( 'click', function () {
			let $radio = $( this ).find( 'input[type="radio"]' ),
				source_id = $radio.val();

			$fontSources.removeClass( 'hover' );
			$radio.prop( 'checked', true );
			$( this ).addClass( 'hover' );

			// Set selected
			showFontSourceDescription( source_id );
		} );

		// Set selected
		let $selected = $fontSources.find( 'input:checked' );

		$selected.closest( 'tr' ).addClass( 'hover' );
		showFontSourceDescription( $selected.val() );
	}
} );
