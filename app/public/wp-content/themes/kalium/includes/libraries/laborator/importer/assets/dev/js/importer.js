import $ from "../../../../../../../assets/dev/js/common/var/jquery";
import domReady from "../../../../../../../assets/dev/js/common/lib/dom-ready";
import Popup from "../../../../../../../assets/dev/js/admin/admin-scripts/popup";
import Kalium_Import from "./kalium-import";
import anime from "anime";

/**
 * Importer page.
 */
domReady( function () {

	// Delegate event
	$( '.kalium-demos' ).on( 'click', '.kalium-demos__content-pack-entry-link', function ( ev ) {
		ev.preventDefault();

		// Popup
		let link = $( this ).data( 'link' ),
			contentPackId = $( this ).closest( '[data-content-pack-id]' ).data( 'content-pack-id' ),
			popup = new Popup( link, {
				minWidth: 780,
				minHeight: 350,
				maxHeight: 750,
				dismissOverlay: false,
			} );

		// Popup content loaded
		$( popup ).on( 'popup.load', ( ev, content, container ) => {

			// Initialize Kalium Import class
			let importer = new Kalium_Import( contentPackId, container, popup );
		} );

		// Open popup
		popup.open();
	} );

	// Hover thumbnail
	$( '.kalium-demos .kalium-demos__content-pack-entry-image' ).each( function ( i, el ) {

		// Thumbnail
		let $imageContainer = $( el ),
			$image = $imageContainer.find( 'img' );

		$image.on( 'load', function () {
			let imageHeight = $image.outerHeight(),
				scrollHeight = imageHeight - $imageContainer.outerHeight();

			if ( scrollHeight > 40 ) {
				let duration = scrollHeight / 160;
				$image.css( 'transition-duration', `${duration}s` );

				// Mouse over
				$imageContainer.on( 'mouseover', () => {
					$image.css( 'transform', `translateY(-${scrollHeight}px)` );
				} );

				// Mouse out
				$imageContainer.on( 'mouseout', () => {
					$image.css( 'transform', `translateY(0px)` );
				} );
			}
		} );
	} );
} );