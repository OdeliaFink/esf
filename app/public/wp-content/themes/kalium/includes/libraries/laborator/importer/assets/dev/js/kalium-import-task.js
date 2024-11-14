import $ from "../../../../../../../assets/dev/js/common/var/jquery";
import Popup from "../../../../../../../assets/dev/js/admin/admin-scripts/popup";
import Kalium_Error from "../../../../../../../assets/dev/js/common/kalium/kalium-error";

/**
 * Content import actions.
 *
 * @type string
 */
const CONTENT_IMPORT_ACTION_DOWNLOAD = 'do_download';
const CONTENT_IMPORT_ACTION_BACKUP = 'do_backup';
const CONTENT_IMPORT_ACTION_IMPORT = 'do_import';
const CONTENT_IMPORT_ACTION_COMPLETE = 'do_complete';
const CONTENT_IMPORT_ACTION_REMOVE = 'do_remove';

/**
 * Parse JSON from response DOM element.
 *
 * @param {string} contents
 * @param {string} selector
 *
 * @return {object|null}
 */
function responseParseJSON( contents, selector ) {

	// Create element to retrieve JSON response from ${selector}
	let testElement = document.createElement( 'div' );
	testElement.innerHTML = contents;

	// TGMPA response
	let contentElement = testElement.querySelector( selector ),
		jsonContent = contentElement ? contentElement.innerHTML : '';

	// Remove created element from memory
	testElement.remove();
	testElement = null;

	try {
		return JSON.parse( jsonContent );
	} catch ( e ) {
	}

	return null;
}

/**
 * Show error popup.
 *
 * @param {Kalium_Error} errors
 * @param {array} buttons
 * @param {object} args
 *
 * @return {Popup}
 */
function showErrorPopup( errors, buttons = [], args = {} ) {

	// Defaults
	args = {
		title: 'Error',
		...args,
	};

	// Popup content
	let $content = $( '<div class="kalium-demos__popup-errors"></div>' );

	// Errors list
	$content.append( errors.wrapErrors( '', {
		className: 'kalium-demos__popup-error',
	} ) );

	// Buttons
	if ( buttons.length > 0 ) {
		let $buttons = $( '<div class="kalium-demos__popup-errors-buttons"></div>' );

		for ( let button of buttons ) {
			button = {
				title: '',
				class: 'button',
				link: '#',
				click: null,
				...button,
			};

			// Button
			let $button = $( '<a></a>' ).attr( {
				href: button.link,
				class: button.class,
			} ).html( button.title );

			// Click event
			if ( 'function' === typeof button.click ) {
				$button.on( 'click', ev => {
					ev.preventDefault();
					button.click.call( $button, popup );
				} );
			}

			// Add button
			$buttons.append( $button );
		}

		// Append buttons to errors container
		$content.append( $buttons );
	}

	// Popup instance
	let popup = new Popup( args.title, $content, {
		dismissable: false,
		dismissOverlay: false,
		minWidth: 600,
		hideOtherActive: false,
	} );

	// Open popup
	popup.open();

	return popup;
}

/**
 * Sanitize HTML.
 *
 * @param {string} str
 *
 * @return {string}
 */
function sanitizeHTML( str ) {
	let temp = document.createElement( 'div' );
	temp.textContent = str;
	return temp.innerHTML;
}

/**
 * Log to console.
 *
 * @return void
 */
function debugLog() {
	console.log( ...arguments );
}

/**
 * Kalium Import Task class.
 *
 * @class Kalium_Import_Task
 */
class Kalium_Import_Task {

	/**
	 * Constructor.
	 *
	 * @param {object} taskObj
	 */
	constructor( taskObj ) {

		// Task type
		this.type = taskObj.type;

		// Task args
		this.args = taskObj.args;

		// Task status
		this.isCompleted = taskObj.completed;

		/**
		 * Errors.
		 *
		 * @type Kalium_Error
		 */
		this.errors = new Kalium_Error();
	}

	/**
	 * Get task type.
	 *
	 * @return {string}
	 */
	getType() {
		return this.type;
	}

	/**
	 * Get task args.
	 *
	 * @return {object}
	 */
	getArgs() {
		return this.args;
	}

	/**
	 * Get single argument.
	 *
	 * @param {string} name
	 *
	 * @return {string|object|null}
	 */
	getArg( name ) {
		if ( this.args.hasOwnProperty( name ) ) {
			return this.args[ name ];
		}

		return null;
	}

	/**
	 * Check if task is completed.
	 *
	 * @param {boolean|null} newStatus
	 *
	 * @return {boolean}
	 */
	completed( newStatus = null ) {

		// Setter
		if ( 'boolean' === typeof newStatus ) {
			this.isCompleted = newStatus;
		}

		return this.isCompleted;
	}

	/**
	 * Get error object.
	 *
	 * @return {Kalium_Error}
	 */
	getErrors() {
		return this.errors;
	}

	/**
	 * Install plugin task.
	 *
	 * @param {Kalium_Import} importInstance
	 * @param {function} parentResolve
	 * @param {function} parentReject
	 *
	 * @return {void}
	 */
	installPlugin( importInstance, parentResolve, parentReject ) {

		// Vars
		let slug = this.getArg( 'slug' ),
			installed = this.getArg( 'installed' ),
			$pluginEntry = importInstance.$requiredPlugins.filter( `[data-plugin-slug="${slug}"]` ),
			$pluginStatus = $pluginEntry.find( '.kalium-demos__content-pack-view-required-plugins-status span' );

		// Set status class
		$pluginStatus.addClass( 'installing' );

		// Activating plugin
		if ( installed ) {
			$pluginStatus.html( 'Activating&hellip;' );
		} else {
			$pluginStatus.html( 'Installing&hellip;' );
		}

		// Clear errors
		this.errors = new Kalium_Error();

		// Make API call
		importInstance.api( this.getType(), this.getArgs() ).then( ( response ) => {

			// Check TGMPA response status
			let tgmpaResponse = responseParseJSON( response.body, '.kalium-tgmpa-ajax-response' ),
				success = tgmpaResponse && tgmpaResponse.hasOwnProperty( 'success' ) ? tgmpaResponse.success : false;

			// Task is completed
			this.completed( true );

			// Remove status class
			$pluginStatus.removeClass( 'install installing activate' );

			// Plugin action succeeded
			if ( success ) {

				// Set new status
				$pluginStatus.addClass( 'active' ).html( 'Active' );

				// Successful request
				parentResolve( tgmpaResponse );
			}
			// Plugin action failed
			else {

				// Set failed status
				$pluginStatus.addClass( 'failed' ).html( 'Failed' );

				// Set task error
				this.errors.add( 'plugin_install_failed', 'Plugin install or activate action failed!' );

				// Unsuccessful request
				parentReject( {
					type: 'plugin-install-fail',
					message: this.errors.getErrorMessage(),
				} );
			}
		} ).catch( ( response ) => {

			// Remove status class
			$pluginStatus.removeClass( 'install installing activate' );

			// Set failed status
			$pluginStatus.addClass( 'failed' ).html( 'Failed' );

			// Task is completed
			this.completed( true );

			// Set task error
			this.errors.add( response );

			// Unsuccessful request
			parentReject( {
				type: 'plugin-install-fail',
				message: this.errors.getErrorMessage(),
			} );
		} );
	}

	/**
	 * Import content task.
	 *
	 * @param {Kalium_Import} importInstance
	 * @param {function} parentResolve
	 * @param {function} parentReject
	 *
	 * @return {void}
	 */
	importContent( importInstance, parentResolve, parentReject ) {

		// Vars
		let importId = this.getArg( 'import_id' ),
			importName = this.getArg( 'import_name' ),
			uninstall = this.getArg( 'uninstall' ),
			importField = importInstance.getContentImportField( importId ),
			label = importField.label,
			apiArgs = {
				importId: importId,
				checked: importField.checked,
				args: JSON.stringify( importField.argsFields ),
			};

		// Set progress status
		if ( uninstall ) {
			importInstance.setProgressStatus( `Removing ${label}...` );
		} else {
			importInstance.setProgressStatus( `Importing ${label}...` );
		}

		// Clear task errors
		this.errors = new Kalium_Error();

		/**
		 * Show HTTP error popup.
		 *
		 * @param {object} response
		 * @param {array} buttons
		 *
		 * @return void
		 */
		let showHttpErrorPopup = ( response, buttons = [] ) => {

			// Errors and response body content
			let responseBody = sanitizeHTML( response.body ),
				error = new Kalium_Error();

			// Include HTTP error message
			if ( Kalium_Error.isHTTPError( response ) ) {
				error.add( `http_error_${response.status}`, `Status code: ${response.status} ${response.statusText}` );
			} else {
				error.add( 'unknown_error', `An unknown error occurred (error code ${response.status})` );
			}

			// Add response body to error instance
			if ( responseBody ) {
				error.add( error.getErrorCode(), `<pre class="kalium-demos__popup-errors-pre">${responseBody}</pre>` );
			}

			// Add error to task
			this.errors.add( error );

			// Show error popup
			showErrorPopup( error, buttons, {
				title: `Error - ${importName}`,
			} );
		};

		/**
		 * Handle successful request.
		 *
		 * @param {object} importAction
		 * @param {object} response
		 *
		 * @return {Promise}
		 */
		let handleSuccessfulRequest = ( importAction, response ) => {
			return new Promise( ( resolve, reject ) => {

				// Vars
				let result = responseParseJSON( response.body, '.kalium-demo-content-import-response' ),
					buttons = {
						registerTheme: {
							title: 'Register theme',
							link: 'admin.php?page=kalium&tab=theme-registration',
							class: 'button button-primary',
						},
						continue: {
							title: 'Continue',
							class: 'button button-primary',
							click: ( popup ) => {
								popup.close();

								// Resolve, continue
								resolve()
							},
						},
						retry: {
							title: 'Retry',
							class: 'button',
							click: ( popup ) => {
								popup.close();

								// Retry by executing the task again
								this.importContent( importInstance, parentResolve, parentReject );
							},
						},
						close: {
							title: 'Close',
							click: ( popup ) => {
								popup.close();

								// Abort process
								parentReject( {
									abort: true,
								} );
							},
						},
						closePopup: {
							title: 'Close',
							click: ( popup ) => {
								popup.close();
								importInstance.close();

								// Abort process
								parentReject( {
									abort: true,
								} );
							},
						},
					};

				// Valid result
				if ( result ) {

					// Successful task execution
					if ( result.success ) {

						// Resolve
						resolve();
					} else {

						// On error
						if ( Kalium_Error.isWPError( result ) ) {

							// Vars
							let error = new Kalium_Error( result ),
								errorTitle = `Error - ${importName}`,
								errorData = error.getErrorData(),
								errorButtons = [
									buttons.continue,
									buttons.retry,
									buttons.close,
								];

							// Add error to task
							this.errors.add( error );

							// Silent error, pass
							if ( errorData && errorData.silent ) {
								resolve( {
									silent: true,
								} );
								return;
							}

							// Custom popup buttons
							if ( errorData && errorData.popupButtons ) {
								errorButtons = [];

								for ( let button of errorData.popupButtons ) {
									if ( buttons.hasOwnProperty( button ) ) {
										errorButtons.push( buttons[ button ] );
									}
								}
							}

							// Show error popup
							showErrorPopup( error, errorButtons, {
								title: errorTitle,
							} );
						} else {

							// Undefined error
							let error = new Kalium_Error( 'unknown_error', 'An unknown error occurred' ),
								rawResponse = sanitizeHTML( JSON.stringify( result ) );

							// Add error to task
							this.errors.add( error );

							// Insert result object
							error.add( error.getErrorCode(), `<pre class="kalium-demos__popup-errors-pre">${rawResponse}</pre>` );

							// Show error on popup
							showErrorPopup( error, [buttons.continue, buttons.close], {
								title: `Error - ${importName}`,
							} );
						}
					}

				} else {

					// Unknown error
					showHttpErrorPopup( response, [
						buttons.continue,
						buttons.retry,
						buttons.close,
					] );
				}
			} );
		};

		/**
		 * Failed request handler.
		 *
		 * @param {object} importAction
		 * @param {object} err
		 *
		 * @return {Promise}
		 */
		let handleFailedRequest = ( importAction, err ) => {
			return new Promise( ( resolve, reject ) => {

				// Response body
				let responseBody = err && err.body ? err.body : '',
					result = responseParseJSON( responseBody, '.kalium-demo-content-import-response' ),
					buttons = {
						continue: {
							title: 'Continue',
							class: 'button button-primary',
							click: ( popup ) => {
								popup.close();

								// Resolve, continue
								resolve()
							},
						},
						close: {
							title: 'Close',
							click: ( popup ) => {
								popup.close();

								// Abort process
								parentReject( {
									abort: true,
								} );
							},
						},
					};


				// If valid result is parsed from the error response
				if ( result ) {

					// Use error handler in handleSuccessfulRequest() function
					handleSuccessfulRequest( importAction, err ).then( resolve ).catch( reject );
					return;
				}

				// Abort process
				if ( err && err.abort ) {
					parentReject( err );
					return;
				}

				// Show error popup
				showHttpErrorPopup( err, [
					buttons.continue,
					buttons.close,
				] );
			} );
		};

		// Uninstall
		if ( uninstall ) {

			/**
			 * Do remove
			 *
			 * CONTENT_IMPORT_ACTION_REMOVE
			 */
			let removePromise = importInstance
				.api( this.getType(), { importAction: CONTENT_IMPORT_ACTION_REMOVE, ...apiArgs } )
				.then( ( response ) => handleSuccessfulRequest( CONTENT_IMPORT_ACTION_REMOVE, response ) )
				.catch( ( err ) => handleFailedRequest( CONTENT_IMPORT_ACTION_REMOVE, err ) );

			/**
			 * Remove finished for this content type
			 */
			removePromise.finally( () => {

				// Mark task as completed
				this.completed( true );

				// Resolve
				parentResolve();
			} );
		} else {

			/**
			 * Do download
			 *
			 * CONTENT_IMPORT_ACTION_DOWNLOAD
			 */
			let downloadPromise = importInstance
				.api( this.getType(), { importAction: CONTENT_IMPORT_ACTION_DOWNLOAD, ...apiArgs } )
				.then( ( response ) => handleSuccessfulRequest( CONTENT_IMPORT_ACTION_DOWNLOAD, response ) )
				.catch( ( err ) => handleFailedRequest( CONTENT_IMPORT_ACTION_DOWNLOAD, err ) );

			/**
			 * Do backup
			 *
			 * CONTENT_IMPORT_ACTION_BACKUP
			 */
			let backupPromise = downloadPromise.then( () => importInstance
				.api( this.getType(), { importAction: CONTENT_IMPORT_ACTION_BACKUP, ...apiArgs } )
				.then( ( response ) => handleSuccessfulRequest( CONTENT_IMPORT_ACTION_BACKUP, response ) )
				.catch( ( err ) => handleFailedRequest( CONTENT_IMPORT_ACTION_BACKUP, err ) )
			);

			/**
			 * Do import
			 *
			 * CONTENT_IMPORT_ACTION_IMPORT
			 */
			let importPromise = backupPromise.then( () => importInstance
				.api( this.getType(), { importAction: CONTENT_IMPORT_ACTION_IMPORT, ...apiArgs } )
				.then( ( response ) => handleSuccessfulRequest( CONTENT_IMPORT_ACTION_IMPORT, response ) )
				.catch( ( err ) => handleFailedRequest( CONTENT_IMPORT_ACTION_IMPORT, err ) )
			);

			/**
			 * Do complete
			 *
			 * CONTENT_IMPORT_ACTION_COMPLETE
			 */
			let completePromise = importPromise.then( () => importInstance
				.api( this.getType(), { importAction: CONTENT_IMPORT_ACTION_COMPLETE, ...apiArgs } )
				.then( ( response ) => handleSuccessfulRequest( CONTENT_IMPORT_ACTION_COMPLETE, response ) )
				.catch( ( err ) => handleFailedRequest( CONTENT_IMPORT_ACTION_COMPLETE, err ) )
			);

			/**
			 * Import finished for this content type
			 */
			completePromise.finally( () => {

				// Mark task as completed
				this.completed( true );

				// Resolve
				parentResolve();
			} );
		}
	}

	/**
	 * Execute task.
	 *
	 * @param {Kalium_Import} importInstance
	 *
	 * @return {Promise}
	 */
	execute( importInstance ) {
		return new Promise( ( resolve, reject ) => {

			// Plugin install task
			if ( 'plugin-install' === this.getType() ) {
				this.installPlugin( importInstance, resolve, reject );
			}
			// Content import task
			else if ( 'content-import' === this.getType() ) {
				this.importContent( importInstance, resolve, reject );
			}
		} );
	}
}

/**
 * Task runner class.
 *
 * @class Kalium_Import_Task_Runner
 */
class Kalium_Import_Task_Runner {

	/**
	 * Constructor.
	 *
	 * @param {Kalium_Import} importInstance
	 */
	constructor( importInstance ) {

		/**
		 * @property {Kalium_Import} tasksList
		 */
		this.importInstance = importInstance;
	}

	/**
	 * Get tasks (optionally filter by type).
	 *
	 * @param {string=} taskType
	 *
	 * @return {Kalium_Import_Task[]}
	 */
	getTasks( taskType ) {
		return this.importInstance.tasksList.filter( ( task ) => !taskType || task.getType() === taskType );
	}

	/**
	 * Run tasks (optionally by type).
	 *
	 * @param {string=} taskType
	 * @param {function=} taskCompleteCallback
	 *
	 * @return {Promise}
	 */
	runTasks( taskType, taskCompleteCallback = null ) {
		return new Promise( ( resolve, reject ) => {

			// Tasks to run (completed only)
			let tasks = this.getTasks( taskType ),
				totalTime = [];

			/**
			 * Task runner recursive.
			 *
			 * @param {Kalium_Import_Task[]} tasks
			 */
			let taskRunner = ( tasks ) => {
				let task = tasks.shift(),
					startTime = performance.now();

				// Update progress bar
				this.updateProgressBar();

				// All tasks completed
				if ( !task ) {

					// Total execution time
					totalTime = totalTime.length > 0 ? totalTime.reduce( ( a, b ) => a + b ) : 0;

					debugLog( '***', 'Total time:', + totalTime.toFixed( 1 ), 's', '***' );

					// Resolve
					resolve();
				}
				// Skip completed task
				else if ( task.completed() ) {
					taskRunner( tasks );
				}
				// Execute task
				else {
					task.execute( this.importInstance )
						// Task complete
						.then( () => {

							// Callback for each completed task
							if ( taskCompleteCallback instanceof Function ) {
								taskCompleteCallback.call( this, task );
							}

							// Calculate execution time (in seconds)
							let executionTime = ( performance.now() - startTime ) / 1000;
							totalTime.push( executionTime );

							// Report task time
							let taskDescription = task.getType();

							if ( 'plugin-install' === taskDescription ) {
								taskDescription += ': ' + task.getArg( 'name' );
							} else if ( 'content-import' === taskDescription ) {
								taskDescription += ': ' + task.getArg( 'import_name' );
							}

							// Execution time debug
							debugLog( taskDescription, + executionTime.toFixed( 1 ), 's' );

							// Run next task
							taskRunner( tasks );
						} )
						// Task failed
						.catch( ( err ) => {

							// Close import instance
							if ( err && err.abort ) {
								reject( {
									errCode: 0,
									reason: 'Aborted by user.',
								} );
							}
							// Continue running tasks
							else {
								taskRunner( tasks );
							}
						} );
				}
			};

			// Start task runner
			taskRunner( tasks );
		} );
	}

	/**
	 * Get number of completed tasks.
	 *
	 * @param {string=} taskType
	 *
	 * @return {number}
	 */
	getCompletedTasksNumber( taskType ) {
		let completed = 0;

		for ( let task of this.getTasks( taskType ) ) {
			if ( task.completed() ) {
				completed ++;
			}
		}

		return completed;
	}

	/**
	 * Update progress bar.
	 *
	 * @return {void}
	 */
	updateProgressBar() {
		let tasksByType = {},
			totalPoints = 0,
			completedPoints = 0,
			taskWeights = {
				'plugin-install': 1,
				'content-import': 3,
			};

		for ( let task of this.importInstance.tasksList ) {
			let type = task.getType();

			if ( !tasksByType[ type ] ) {
				tasksByType[ type ] = {
					weight: 1,
					tasks: [],
				};

				// Set weight
				if ( taskWeights.hasOwnProperty( type ) ) {
					tasksByType[ type ].weight = taskWeights[ type ];
				}
			}

			// Add task to the group
			tasksByType[ type ].tasks.push( task );

			// Register total points
			totalPoints += tasksByType[ type ].weight;
		}

		// Count completed tasks
		for ( let taskType in tasksByType ) {
			for ( let task of tasksByType[ taskType ].tasks ) {
				if ( task.completed() ) {
					completedPoints += tasksByType[ taskType ].weight;
				}
			}
		}

		// Update progress
		this.importInstance.setProgress( completedPoints / totalPoints * 100 );
	}
}

// Export Kalium_Import_Task class
export {
	Kalium_Import_Task,
	Kalium_Import_Task_Runner,
};
