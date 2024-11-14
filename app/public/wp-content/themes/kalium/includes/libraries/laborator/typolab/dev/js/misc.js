import $ from "./var/jquery";
import TypoLab from "./typolab";

/**
 * Add Font from Source.
 */
TypoLab.on( 'ready', function () {

	/**
	 * Tooltips.
	 */
	$( '.typolab .tooltip' ).each( ( i, el ) => {
		$( el ).tooltipster( {
			position: 'right',
			theme: 'tooltipster-borderless',
		} );
	} );

	/**
	 * Save changes button.
	 */
	let $submit = $( '.typolab .button-primary[type="submit"]' );

	$submit.each( ( i, el ) => {
		$( el ).closest( 'form' ).on( 'submit', ev => {
			$submit.addClass( 'is-loading' );
		} );
	} );

	/**
	 * Checkbox toggles.
	 */
	$( '.typolab .components-form-toggle' ).each( ( i, el ) => {
		let $el = $( el ),
			$input = $el.find( 'input' );

		$input.on( 'change', ev => {
			$el[ $input.is( ':checked' ) ? 'addClass' : 'removeClass' ]( 'is-checked' );
		} );
	} );

	/**
	 * Font source select.
	 */
	if ( $( '.change-source' ).length ) {
		let $changeSource = $( '.change-source' ),
			$fontSourceSelectDropdown = $( '.typolab-dropdown.font-source-select' ),
			repositionChangeSource = () => {
				let position = $changeSource.position();
				position.top += $changeSource.outerHeight() + 10;
				$fontSourceSelectDropdown.css( position );
			};

		repositionChangeSource();

		// Open dropdown
		$changeSource.on( 'click', ev => {
			ev.preventDefault();
			repositionChangeSource();
			$fontSourceSelectDropdown.add( $changeSource ).toggleClass( 'visible' );
		} );

		$( document ).on( 'mouseup', ev => {
			if ( $fontSourceSelectDropdown.hasClass( 'visible' ) ) {
				if ( ! $changeSource.is( ev.target ) && ! $fontSourceSelectDropdown.is( ev.target ) && ! $fontSourceSelectDropdown.has( ev.target ).length ) {
					$fontSourceSelectDropdown.add( $changeSource ).removeClass( 'visible' );
				}
			}
		} );

		// Change font source
		$fontSourceSelectDropdown.on( 'click', 'a', ev => {
			if ( !confirm( 'Confirm font source change?' ) ) {
				ev.preventDefault();
			} else {
				$fontSourceSelectDropdown.add( $changeSource ).removeClass( 'visible' );
			}
		} );
	}
} );
