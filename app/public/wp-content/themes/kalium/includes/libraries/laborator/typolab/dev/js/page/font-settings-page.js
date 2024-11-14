import $ from "../var/jquery";
import TypoLab from "../typolab";

/**
 * Font settings page.
 */
TypoLab.on( 'ready', function () {
	let $settingsForm = $( '.typolab #typolab-settings-form' );

	// Run in font settings page only
	if ( $settingsForm.length ) {

		/**
		 * Settings tooltips.
		 */
		$settingsForm.find( 'i.info[title]' ).on( 'click', ev => ev.preventDefault() ).tooltipster( {
			position: 'right',
			theme: 'tooltipster-borderless',
		} );


		/**
		 * Export settings.
		 */
		let $exportImport = $( '.font-export-import' ),
			$exportContainer = $exportImport.find( '.font-export-import--export' ),
			$importContainer = $exportImport.find( '.font-export-import--import' ),
			getExports = () => {
				let exports = {};

				$exportContainer.find( '[name="font_export"]' ).each( ( i, el ) => {
					exports[ el.value ] = el.checked ? 1 : 0;
				} );

				return exports;
			};

		// Export fonts
		$exportContainer.on( 'click', '.button', ev => {
			ev.preventDefault();

			// Vars
			let $button = $( ev.currentTarget ),
				$tbody = $exportContainer.find( 'tbody' ),
				$exportCheckboxes = $exportContainer.find( '.font-export-checkboxes' ),
				$exportLoading = $exportContainer.find( '.font-export-loading' ),
				$exportData = $exportContainer.find( '.font-export-data' ),
				$exportDataInput = $exportData.find( '#font_export_data' );

			// Set as disabled
			$button.addClass( 'disabled' );
			$tbody.css( 'height', $tbody.height() );
			$exportCheckboxes.hide();
			$exportLoading.fadeTo( 300, 1 );

			// Get data
			$.post( ajaxurl, {
				action: 'typolab_export',
				exports: getExports(),
			} ).done( response => {
				if ( response.success ) {
					$exportDataInput.val( response.data );
					$tbody.css( 'height', '' ); // Reset height
					$exportLoading.hide();
					$exportData.fadeTo( 300, 1, () => $exportDataInput.select() );
				} else {
					alert( 'An error occurred while exporting fonts!' );
				}
			} );
		} );

		// Export fonts
		$importContainer.on( 'click', '.button', ev => {
			ev.preventDefault();

			// Vars
			let $button = $( ev.currentTarget ),
				$tbody = $importContainer.find( 'tbody' ),
				$importData = $importContainer.find( '.font-import-data' ),
				$importDataInput = $importContainer.find( '#font_import' ),
				$importLoading = $importContainer.find( '.font-import-loading' ),
				$progress = $importLoading.find( '.progress' ),
				$importFinished = $importContainer.find( '.font-import-finished' ),
				tasksCount = 0,
				tasksCompleted = 0;

			/**
			 * Animate number.
			 *
			 * @param {object} obj
			 * @param {number} start
			 * @param {number} end
			 * @param {number} duration
			 * @param {string} prefix
			 * @param {string} postfix
			 */
			const animateValue = ( obj, start, end, duration, prefix = '', postfix = '' ) => {
				let startTimestamp = null;
				const step = ( timestamp ) => {
					if ( !startTimestamp ) startTimestamp = timestamp;
					const progress = Math.min( ( timestamp - startTimestamp ) / duration, 1 );
					obj.innerHTML = prefix + Math.floor( progress * ( end - start ) + start ) + postfix;
					if ( progress < 1 ) {
						window.requestAnimationFrame( step );
					}
				};
				window.requestAnimationFrame( step );
			}

			/**
			 * Import request.
			 *
			 * @param {string} type
			 * @param {object} data
			 *
			 * @return {function}
			 */
			const importRequest = ( type, data ) => {
				let selectedTask = data.hasOwnProperty( type );

				// Install fonts task
				if ( 'install_fonts' === type && data.fonts ) {
					selectedTask = true;
				} // Preload fonts task
				else if ( 'preload_fonts' === type && data.fonts ) {
					selectedTask = true;
				}

				if ( selectedTask ) {
					tasksCount ++;
				}

				return function () {
					return new Promise( ( resolve, reject ) => {

						// If data type exists
						if ( selectedTask ) {
							$.post( ajaxurl, {
								action: 'typolab_import',
								type: type,
								data: data[ type ],
							} ).done( resolve ).fail( reject ).always( () => {
								let from = 100 * ( tasksCompleted / tasksCount ),
									to = 100 * ( ++ tasksCompleted / tasksCount );

								animateValue( $progress[ 0 ], from, to, 200, '(', '%)' );
							} );
						} else {

							// Skip
							resolve();
						}
					} );
				}
			};

			/**
			 * Start import process.
			 *
			 * @return {Promise}
			 */
			const startImportProcess = data => {
				return new Promise( ( resolve, reject ) => {
					let importSettingsRequest = importRequest( 'font_settings', data ),
						importFontAppearanceRequest = importRequest( 'font_appearance', data ),
						importFontsRequest = importRequest( 'fonts', data ),
						installFontsRequest = importRequest( 'install_fonts', data ),
						preloadFontsRequest = importRequest( 'preload_fonts', data );

					importSettingsRequest()
						.then( importFontAppearanceRequest )
						.then( importFontsRequest )
						.then( installFontsRequest )
						.then( preloadFontsRequest )
						.then( resolve );
				} );
			};

			try {

				// Import data
				const data = JSON.parse( $importDataInput.val() );

				// Set as disabled
				$button.addClass( 'disabled' );
				$tbody.css( 'height', $tbody.height() );
				$importData.hide();
				$importLoading.fadeTo( 300, 1 );

				// Start import
				startImportProcess( data ).then( () => setTimeout( () => {
					$tbody.css( 'height', '' );
					$importLoading.hide();
					$importFinished.fadeTo( 300, 1 );
				}, 1000 ) );
			} catch ( error ) {
				alert( 'Please enter valid JSON data' );
			}
		} );
	}
} );