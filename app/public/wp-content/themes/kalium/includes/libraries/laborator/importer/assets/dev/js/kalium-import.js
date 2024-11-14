import {Kalium_Import_Task, Kalium_Import_Task_Runner} from "./kalium-import-task";
import anime from "./anime";
import zlFetch from "./zl-fetch/index";
import $ from "../../../../../../../assets/dev/js/common/var/jquery";
import Popup from "../../../../../../../assets/dev/js/admin/admin-scripts/popup";
import Kalium_Error from "../../../../../../../assets/dev/js/common/kalium/kalium-error";

// Button strings
let buttonStrings = {
	start: 'Install',
	loading: 'Loading...',
	preparing: 'Preparing...',
	importing: 'Importing...',
	uninstalling: 'Uninstalling...',
};

/**
 * Render errors or warnings list and display action buttons.
 *
 * @param {string} description
 * @param {array} warnings
 * @param {array} buttons
 *
 * @return {string}
 */
function renderActionMessage( description, warnings, buttons = [] ) {
	let str = `<p class="kalium-demos__content-pack-view-warnings-description">${description}</p>`;

	// List
	str += '<ul class="kalium-demos__content-pack-view-warnings">';

	for ( let warning of warnings ) {
		str += `<li>${warning.message}</li>`;
	}

	str += '</ul>';

	// Buttons
	if ( buttons instanceof Array && buttons.length > 0 ) {
		str += '<div class="kalium-demos__content-pack-view-warnings-buttons">';

		for ( let button of buttons ) {

			if ( button.link ) {
				str += `<a href="${button.link}" class="${button.class}" target="_blank" rel="noreferrer noopener">${button.title}</a>`;
			} else {
				str += `<button type="button" class="${button.class}">${button.title}</button>`;
			}
		}

		str += '</div>';
	}

	return str;
}

/**
 * Kalium Import demo content class.
 *
 * @version 1.0
 */
class Kalium_Import {

	/**
	 * Constructor.
	 *
	 * @param {string} contentPackID
	 * @param {$} container
	 * @param {Popup} popup
	 */
	constructor( contentPackID, container, popup ) {

		/**
		 * Content pack ID.
		 *
		 * @type {string}
		 * @public
		 */
		this.contentPackID = contentPackID;

		/**
		 * Tasks list array.
		 *
		 * @type {Kalium_Import_Task[]}
		 * @public
		 */
		this.tasksList = [];

		/**
		 * Task runner instance.
		 *
		 * @type {Kalium_Import_Task_Runner}
		 * @public
		 */
		this.taskRunner = null;

		/**
		 * Errors during the import process.
		 *
		 * @var {Kalium_Error[]}
		 * @public
		 */
		this.errors = [];

		// Loading state
		this.isLoading = false;

		// Credentials required
		this.credentialsRequired = false;

		// Credentials
		this.credentials = null;

		// The popup container
		this.popup = popup;

		// DOM container
		this.$container = $( container );

		// Required plugins
		this.$requiredPlugins = this.$container.find( '.kalium-demos__content-pack-view-required-plugins [data-plugin-slug]' );

		// Imports
		this.$imports = this.$container.find( '.kalium-demos__content-pack-view-imports .kalium-demos__content-pack-view-import' );

		// Import button
		this.$importButton = this.$container.find( '#start_import' );

		// Uninstall button
		this.$uninstallButton = this.$container.find( '#start_uninstall' );

		// Progress bar
		this.$progressContainer = this.$container.find( '.kalium-demos__content-pack-view-progress' );
		this.$progressText = this.$progressContainer.find( '.kalium-demos__content-pack-view-progress-status-text' );
		this.$progressBarPercentage = this.$progressContainer.find( '.kalium-demos__content-pack-view-progress-status-percentage' );
		this.$progressBar = this.$progressContainer.find( '.kalium-demos__content-pack-view-progress-bar-fill' );

		// Import button event
		this.$importButton.on( 'click', ev => {
			ev.preventDefault();
			this.import();
		} );

		// Uninstall button event
		this.$uninstallButton.on( 'click', ev => {
			ev.preventDefault();
			this.uninstall();
		} );

		// Setup WordPress Importer optional post types import
		this.setupOptionalPostTypesImport();

		// Uninstalling content pack
		if ( this.$uninstallButton.length ) {

			// Setup events to toggle uninstall button state
			this.setupUninstallButtonToggle();
		} else {

			// Setup events to toggle import button state
			this.setupImportButtonToggle();
		}
	}

	/**
	 * Set disabled property for content import fields.
	 *
	 * @param {boolean} disable
	 */
	disableContentImportFields( disable = true ) {
		for ( let field of this.getContentImportFields() ) {
			field.$input.prop( 'disabled', disable );
			field.$argsFields.find( 'input' ).prop( 'disabled', disable );
		}
	}

	/**
	 * Sets event for import field to disable import args fields when checked.
	 *
	 * @return {void}
	 */
	setupOptionalPostTypesImport() {

		for ( let importEntry of this.$imports ) {
			let $import = $( importEntry );

			// Only for WordPress Import
			if ( 'wordpress-import' === $import.data( 'import-type' ) ) {
				let $importField = $import.find( '.kalium-demos__content-pack-view-imports-checkbox input' ),
					$postTypesArgsFields = $import.find( '.kalium-demos__content-pack-view-imports-args-fields [data-field-name="post_types"] input' );

				if ( $postTypesArgsFields.length ) {

					// Update input status
					let updatePostTypesInputState = function () {

						for ( let postTypeField of $postTypesArgsFields ) {
							let $postTypeField = $( postTypeField ),
								fieldValue = $postTypeField.val(),
								checked = $importField.is( ':checked' );

							// Check when import field is set to checked
							if ( checked ) {
								$postTypeField.prop( 'checked', true );
							}

							// Except for attachments (media files)
							if ( 'attachment' === fieldValue ) {
								checked = false;
							}

							$postTypeField.prop( 'disabled', checked );
						}
					};

					// Initial check on load
					updatePostTypesInputState();

					// Assign event to import field input
					$importField.on( 'change', updatePostTypesInputState );
				}
			}
		}
	}

	/**
	 * Sets event for import field to enable uninstall button when one or more checkbox is checked.
	 *
	 * @return {void}
	 */
	setupImportButtonToggle() {

		// Toggle button state
		let fields = this.getContentImportFields(),
			toggleButtonState = ev => {
				let checked = false;

				for ( let field of fields ) {
					let isDisabled = field.$input.is( ':disabled' ) || field.$input.hasClass( 'disabled' );

					if ( !isDisabled && field.$input.is( ':checked' ) ) {
						checked = true;
						break;
					}
				}

				this.$importButton.prop( 'disabled', !checked );
			};

		// Set change event
		for ( let field of fields ) {
			field.$input.on( 'change', toggleButtonState )
		}
	}

	/**
	 * Sets event for import field to enable uninstall button when one or more checkbox is checked.
	 *
	 * @return {void}
	 */
	setupUninstallButtonToggle() {

		// Toggle button state
		let fields = this.getContentImportFields(),
			toggleButtonState = ev => {
				let checked = false;

				for ( let field of fields ) {
					if ( field.$input.is( ':checked' ) ) {
						checked = true;
						break;
					}
				}

				this.$uninstallButton.prop( 'disabled', !checked );
			};

		// Set change event
		for ( let field of fields ) {
			field.$input.on( 'change', toggleButtonState )
		}
	}

	/**
	 * Get content-import fields with args field values as well.
	 *
	 * @return {array}
	 */
	getContentImportFields() {
		let contentImportFields = [];

		// Populate content import fields
		this.$imports.each( ( i, importEl ) => {
			let $importEl = $( importEl ),
				$field = $importEl.find( '.import-field' ),
				fieldLabel = $importEl.find( '.kalium-demos__content-pack-view-imports-label' ).text().trim(),
				$argsFields = $importEl.find( '.kalium-demos__content-pack-view-imports-args-fields [data-field-name]' ),
				argsFields = {};

			// Add field entry to array
			contentImportFields.push( {

				// Props
				type: $importEl.data( 'import-type' ),
				id: $field.val(),
				label: fieldLabel,
				checked: $field.is( ':checked' ),
				argsFields: argsFields,

				// Elements
				$importEl: $importEl,
				$input: $field,
				$argsFields: $argsFields,
			} );

			// Populate args fields
			if ( $argsFields.length ) {
				$argsFields.each( ( j, argField ) => {
					let $fieldContainer = $( argField ),
						$argField = $fieldContainer.find( 'input' ),
						fieldName = $fieldContainer.data( 'field-name' ),
						fieldValue = $argField.val(),
						fieldType = 'checkbox';

					// Checkbox field
					if ( 'checkbox' === fieldType ) {

						// Only when checked
						if ( $argField.is( ':checked' ) ) {

							if ( !argsFields.hasOwnProperty( fieldName ) ) {
								argsFields[ fieldName ] = [];
							}

							// Add args field value
							argsFields[ fieldName ].push( fieldValue );
						}
					}
				} );
			}
		} );

		return contentImportFields;
	}

	/**
	 * Get content import field by import id.
	 *
	 * @param {string} importId
	 *
	 * @return {object|undefined}
	 */
	getContentImportField( importId ) {
		return this.getContentImportFields().filter( ( contentImportField ) => importId === contentImportField.id ).pop();
	}

	/**
	 * Make an Import Content API content call.
	 *
	 * @param {string} endpoint
	 * @param {object} data
	 *
	 * @return Promise
	 */
	api( endpoint, data = {} ) {
		let url = ajaxurl + '?action=kalium_demos_import_actions';

		// Credentials
		if ( this.credentials ) {
			$.extend( data, this.credentials );
		}

		// Endpoint data
		$.extend( data, {
			contentPack: this.contentPackID,
			contentPackAction: endpoint,
		} );

		return zlFetch( url, {
			method: 'post',
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
			},
			body: data,
		} );
	}

	/**
	 * Import process start.
	 *
	 * @return {Promise}
	 */
	importStart() {
		return new Promise( ( resolve, reject ) => {

			// Disable content import fields
			this.disableContentImportFields( true );

			// Resolve
			resolve();
		} );
	}

	/**
	 * Check server limits.
	 *
	 * @return {Promise}
	 */
	checkServerLimits() {
		return new Promise( ( resolve, reject ) => {

			// Set progress status
			this.setProgressStatus( 'Checking server limits...' );

			// Check server limits
			this.api( 'check-server-limits' ).then( response => {

				// Vars
				let wpMemoryLimit = response.body.wp_memory_limit,
					maxExecutionTime = response.body.max_execution_time,
					domdocument = response.body.domdocument,
					remoteGet = response.body.remote_get,
					filesystemMethod = response.body.filesystem_method,
					recommendedMemoryLimit = response.body.recommended_memory_limit,
					recommendedExecutionTime = response.body.recommended_execution_time,
					errors = [],
					warnings = [];

				// Set credentials required var
				this.credentialsRequired = 'direct' !== filesystemMethod;

				// Convert memory limit to KB
				wpMemoryLimit = wpMemoryLimit / 1024 / 1024;

				// Memory limit warning
				if ( wpMemoryLimit < recommendedMemoryLimit ) {
					warnings.push( {
						message: `Minimum recommended memory limit is <strong class="green">${recommendedMemoryLimit} MB</strong>. Your current memory limit is <strong class="red">${wpMemoryLimit} MB</strong>`,
					} );
				}

				// Execution time warning
				if ( maxExecutionTime < recommendedExecutionTime ) {
					warnings.push( {
						message: `Minimum recommended execution time is <strong class="green">${recommendedExecutionTime}</strong> to avoid stopping the import process. Your maximum PHP execution time is <strong class="red">${maxExecutionTime}</strong>`,
					} );
				}

				// If remote get doesn't work, then it cannot continue
				if ( remoteGet.errors || ( remoteGet.response && remoteGet.response.code > 300 ) ) {
					errors.push( {
						message: `Theme API server is not accessible from your site.`,
					} );

					// WP Error
					if ( remoteGet.errors ) {
						for ( let errorCode in remoteGet.errors ) {
							errors.push( {
								message: `${remoteGet.errors[ errorCode ]} (Error code: ${errorCode})`,
							} );
						}
					}

					// HTTP errors
					if ( remoteGet.response && ( remoteGet.response.code > 300 || remoteGet.response.code < 200 ) ) {
						errors.push( {
							message: `${remoteGet.response.code} - ${remoteGet.response.message}`,
						} );
					}
				}

				// DOMDocument module
				if ( !domdocument ) {
					errors.push( {
						message: 'DOMDocument is not installed on your server, but is required to Import Demo Content data.',
					} );
				}

				// Stop the process
				if ( errors.length > 0 ) {

					// Show warning popup
					let errorDescription = 'Critical errors have been identified in your server, therefore the import process cannot continue because of the following reasons:',
						errorButtons = [
							{
								class: 'button button-primary button-learn-more',
								title: 'Learn more',
								link: 'https://documentation.laborator.co/kb/kalium/kalium-server-requirements/',
							},
							{
								class: 'button button-close',
								title: 'Close',
							},
						],
						errorPopup = new Popup( 'Error (import process could not continue)', renderActionMessage( errorDescription, errors, errorButtons ), {
							dismissable: false,
							dismissOverlay: false,
							minWidth: 600,
							hideOtherActive: false,
						} );

					errorPopup.open();

					// Learn more button
					errorPopup.$contentBody.on( 'click', '.button-learn-more', ev => {
						errorPopup.close();

						// Reject code 1
						reject( {
							errCode: 1,
							reason: 'Process could not continue because of reported errors.',
						} );
					} );

					// Close button
					errorPopup.$contentBody.on( 'click', '.button-close', ev => {
						errorPopup.close();

						// Reject code 1
						reject( {
							errCode: 2,
							reason: 'Process could not continue because of reported errors.',
						} );
					} );
				}
				// Continue (or dismiss) after reading the warnings
				else if ( warnings.length > 0 ) {

					// Show warning popup
					let warningDescription = 'Before proceeding with demo content import, please note that the following warnings are reported from sever check:',
						warningButtons = [
							{
								class: 'button button-primary button-increase-limits',
								title: 'Increase limits',
								link: 'https://documentation.laborator.co/kb/general/how-to-upgrade-php-version-and-increase-server-limits/',
							},
							{
								class: 'button button-continue',
								title: 'Continue',
							},
						],
						warningPopup = new Popup( 'Server limits warning', renderActionMessage( warningDescription, warnings, warningButtons ), {
							dismissable: false,
							dismissOverlay: false,
							minWidth: 600,
							hideOtherActive: false,
						} );

					warningPopup.open();

					// Increase limits button
					warningPopup.$contentBody.on( 'click', '.button-increase-limits', ev => {
						warningPopup.close();

						// Reject code 2
						reject( {
							errCode: 3,
							reason: 'Process stopped by the user.',
						} );
					} );

					// Continue button
					warningPopup.$contentBody.on( 'click', '.button-continue', ev => {
						warningPopup.close();
						resolve( response );
					} );
				}
				// No warnings or errors reported
				else {

					// Resolve
					resolve( response );
				}

				// Update status message
				this.setProgressStatus( '' );
			} );
		} );
	}

	/**
	 * Show credentials form if required.
	 *
	 * @return {Promise}
	 */
	credentialsForm() {
		return new Promise( ( resolve, reject ) => {
			if ( this.credentialsRequired ) {

				// Request filesystem credentials form
				this.api( 'request-filesystem-credentials' ).then( response => {
					if ( false === response.body.ok ) {
						let credentialsFormPopup = new Popup( null, response.body.credentials_form, {
							dismissable: true,
							dismissOverlay: false,
							minWidth: 600,
							hideOtherActive: false,
						} );

						// Open popup
						credentialsFormPopup.open();

						// Initalize credentials form, order matters!
						let $credentialsForm = $( credentialsFormPopup.$content.find( '#request-filesystem-credentials-form' ).parent() ),
							$submitButton = $credentialsForm.find( 'input[type="submit"]' );

						$credentialsForm.on( 'submit', () => {
							let formData = {};

							// Form fields
							$.each( $credentialsForm.serializeArray(), ( i, input ) => {
								formData[ input.name ] = input.value;
							} );

							// Disable submit button
							$submitButton.addClass( 'disabled' );

							// Validate credentials
							this.api( 'request-filesystem-credentials', formData ).then( response => {
								if ( response.body.ok ) {
									this.credentials = formData;

									// Close popup
									$( credentialsFormPopup ).unbind();
									credentialsFormPopup.close();

									// Continue to next step
									resolve();
								} else {
									alert( "An error occurred: " + response.body.error_message );
								}

								// Enable submit button
								$submitButton.removeClass( 'disabled' );
							} );

							return false;
						} );

						// Popup hidden
						$( credentialsFormPopup ).on( 'popup.close', () => {

							// Add error
							this.errors.push( new Kalium_Error( 'credentials_not_provided', 'Import process could not continue!' ) );

							// Abort import
							reject( {
								errCode: 4,
								reason: 'Credentials not provided!'
							} );
						} );
					} else {

						// Credentials are required but not provided! Filesystem reported it OK so continue...
						resolve();
					}
				} );

				// Update status message
				this.setProgressStatus( 'Credentials required' );
			} else {
				resolve();
			}
		} );
	}

	/**
	 * Get tasks list.
	 *
	 * @return {Promise}
	 */
	getTasksList() {
		return new Promise( ( resolve, reject ) => {

			// Set progress status
			this.setProgressStatus( 'Retrieving tasks list...' );

			// Get tasks list
			this.api( 'tasks-list' ).then( response => {

				// On success response
				if ( 200 === response.status ) {

					// Resolve when the request is successful
					resolve( response.body );
				} else {

					// Reject when cannot get tasks list
					reject( {
						errCode: 5,
						reason: 'Cannot get tasks list!',
					} );
				}
			} ).catch( () => reject() );
		} );
	}

	/**
	 * Get uninstall task list for installed content types.
	 *
	 * @return {Promise}
	 */
	getUninstallTaskList() {
		return new Promise( ( ( resolve, reject ) => {

			// Get uninstall task list
			this.api( 'uninstall-tasks-list' ).then( response => {

				// On success response
				if ( 200 === response.status ) {

					// Resolve when the request is successful
					resolve( response.body );
				} else {

					// Reject when cannot get tasks list
					reject( {
						errCode: 6,
						reason: 'Cannot get tasks list!',
					} );
				}
			} ).catch( () => reject() );
		} ) );
	}

	/**
	 * Register tasks list.
	 *
	 * @param {array} tasksArr
	 *
	 * @return {Promise}
	 */
	registerTasksList( tasksArr ) {
		return new Promise( ( resolve, reject ) => {

			// Set progress status
			this.setProgressStatus( 'Registering tasks...' );

			// Tasks list
			let incompleteTasks = 0;

			/**
			 * Valid content-import task checker.
			 *
			 * @param {Kalium_Import_Task} task
			 *
			 * @return {boolean}
			 */
			let isValidContentImportTask = task => {

				// Check if content import task is checked (if not, check for args fields)
				let importId = task.getArg( 'import_id' ),
					contentImportField = this.getContentImportField( importId );

				// When task is completed, exclude it
				if ( task.completed() ) {
					return false;
				}

				return contentImportField && ( contentImportField.checked || contentImportField.argsFields.length > 0 );
			};

			// Create tasks list
			for ( let taskOjb of tasksArr ) {

				// Create task instance
				let task = new Kalium_Import_Task( taskOjb );

				// Exclude import-content tasks that are not checked
				if ( 'content-import' === task.getType() && false === isValidContentImportTask( task ) ) {
					continue;
				}

				// Register number of incomplete tasks
				if ( !task.completed() ) {
					incompleteTasks ++;
				}

				// Register tasks list as class variable
				this.tasksList.push( task );
			}

			// Resolve if there are tasks to execute
			if ( incompleteTasks > 0 ) {

				// Initialize task runner
				this.taskRunner = new Kalium_Import_Task_Runner( this );

				// Resolve
				resolve( this.taskRunner );

			} else {
				reject( {
					errCode: 7,
					reason: 'There are no tasks to complete!',
				} );
			}
		} );
	}

	/**
	 * Install required plugins.
	 *
	 * @return {Promise}
	 */
	installRequiredPlugins() {

		// Set progress status
		this.setProgressStatus( 'Installing required plugins...' );

		// Run install plugins task
		return this.taskRunner.runTasks( 'plugin-install' );
	}

	/**
	 * Import content types.
	 *
	 * @return {Promise}
	 */
	importContentTypes() {

		// Set progress status
		this.setProgressStatus( 'Importing demo content...' );

		// Set button status
		this.buttonStatus( 'importing' );

		// Run install plugins task
		return this.taskRunner.runTasks( 'content-import' );
	}

	/**
	 * Uninstall content types.
	 *
	 * @return {Promise}
	 */
	uninstallContentTypes() {

		// Run install plugins task
		return this.taskRunner.runTasks( 'content-import' );
	}

	/**
	 * Set install complete state.
	 *
	 * @return {Promise}
	 */
	setInstallState() {

		// Set progress status
		this.setProgressStatus( 'Finishing install...' );

		return this.api( 'set-install-state' );
	}

	/**
	 * Start import process.
	 *
	 * @return {void}
	 */
	import() {

		// Change button status
		this.buttonStatus( 'preparing' );

		// Show progress bar
		this.toggleProgress( true );

		// Set progress status
		this.setProgressStatus( 'Preparing import...' );

		// Import failed callback
		let importFailed = ( err ) => this.importFailed( err );

		// Import process start
		let importStart = this.importStart();

		// Check server limits
		let serverLimitsRequest = importStart.then( () => this.checkServerLimits() ).catch( importFailed );

		// Show credentials form if required
		let credentialsForm = serverLimitsRequest.then( () => this.credentialsForm() ).catch( importFailed );

		// Load tasks after server limits
		let getTasksList = credentialsForm.then( () => this.getTasksList() ).catch( importFailed );

		// Register tasks list
		let registerTasksList = getTasksList.then( ( tasksArr ) => this.registerTasksList( tasksArr ) ).catch( importFailed );

		// Install required plugins
		let installRequiredPlugins = registerTasksList.then( () => this.installRequiredPlugins() ).catch( importFailed );

		// Import demo content
		let contentImport = installRequiredPlugins.then( () => this.importContentTypes() ).catch( importFailed );

		// Set install state
		let setInstallState = contentImport.then( () => this.setInstallState() ).catch( importFailed );

		// Import finished
		setInstallState.then( () => {
			this.importFinished( 'success' );
		} );
	}

	/**
	 * Uninstall content packs.
	 *
	 * @return {void}
	 */
	uninstall() {

		// Change button status
		this.buttonStatus( 'uninstalling' );

		// Show progress bar
		this.toggleProgress( true );

		// Set progress status
		this.setProgressStatus( 'Starting uninstall process...' );

		// Disable import fields, the process started
		this.disableContentImportFields( true );

		// Import failed callback
		let importFailed = ( err ) => this.importFailed( err );

		// Retrieve uninstall task list
		let getUninstallTasksList = this.getUninstallTaskList();

		// Register task list
		let registerUninstallTasksList = getUninstallTasksList.then( ( tasksArr ) => this.registerTasksList( tasksArr ) ).catch( importFailed );

		// Uninstall content types
		let uninstallContentTypes = registerUninstallTasksList.then( () => this.uninstallContentTypes() ).catch( importFailed );

		// Set install state
		let setInstallState = uninstallContentTypes.then( () => this.setInstallState() ).catch( importFailed );

		// Uninstall finished
		setInstallState.then( () => {
			this.importFinished( 'success' );
		} );
	}

	/**
	 * When import fails.
	 *
	 * @param {Object} error
	 *
	 * @return {Promise}
	 */
	importFailed( error ) {
		this.importFinished( 'failed' );

		return new Promise( () => null );
	}

	/**
	 * Import finished dialog.
	 *
	 * @param {string} type
	 */
	importFinished( type = '' ) {
		type = 'failed' === type ? type : 'success';

		// Hide content pack view
		let $contentPackView = this.$container.find( '.kalium-demos__content-pack-view' ),
			$finishView = $( this.$container.find( `.content-import-${type}-template` ).html().replace( '{{contentPackName}}', $contentPackView.data( 'name' ) ) ),
			$errors = $finishView.find( '.kalium-demos__content-pack-finish-view-errors' );

		// General errors
		if ( 0 < this.errors.length ) {
			$errors.removeClass( 'hidden' );

			for ( let error of this.errors ) {
				$( '<li></li>' )
					.append( $( '<h4></h4>' ).append( error.wrapErrors() ) )
					.append( `ERR_CODE: ${error.getErrorCode()}` )
					.appendTo( $errors );
			}
		}

		// Append task errors
		for ( let task of this.tasksList ) {
			if ( task.getErrors().hasErrors() ) {
				let errors = task.getErrors(),
					importId = task.getArg( 'import_id' ),
					contentImportField = this.getContentImportField( importId );

				if ( contentImportField ) {
					$errors.removeClass( 'hidden' );
					$( '<li></li>' )
						.append( $( '<h4></h4>' ).append( contentImportField.label ) )
						.append( errors.wrapErrors( '', { className: 'kalium-demos__content-pack-finish-view-error-description' } ) )
						.appendTo( $errors );
				}
			}
		}

		// Clicking the link will refresh the page
		$finishView.find( '.kalium-demos__content-pack-finish-view-heading-link' ).on( 'click', () => {
			setTimeout( () => {
				window.location.reload();
			}, 1500 );
		} );

		// Append template to container
		this.$container.append( $finishView );

		// Dialog height
		let dialogHeight = $finishView.outerHeight();

		// Hide dialog initially
		$finishView.hide();

		// Show dialog with animation
		anime( {
			targets: $contentPackView[ 0 ],
			easing: 'easeInOutSine',
			opacity: 0,
			duration: 300,
			complete: () => anime( {
				targets: $contentPackView[ 0 ],
				easing: 'easeInOutSine',
				height: dialogHeight,
				duration: 300,
				complete: () => {

					// Hide content pack view
					$contentPackView.hide();

					// Show dialog
					$finishView.show();

					anime( {
						targets: $finishView[ 0 ],
						easing: 'easeInOutSine',
						opacity: 1,
						duration: 300,
						complete: () => {
						},
					} );
				}
			} )
		} );
	}

	/**
	 * Close popup window.
	 *
	 * @return {void}
	 */
	close() {
		this.popup.close();
	}

	/**
	 * Set button status.
	 *
	 * @param {string} status
	 */
	buttonStatus( status ) {
		let $button = $( [...this.$importButton.get(), ...this.$uninstallButton.get()] ),
			buttonStatusIds = Object.keys( buttonStrings );

		// Status class and text
		if ( - 1 !== $.inArray( status, buttonStatusIds ) ) {
			$button.removeClass( buttonStatusIds.concat( ' ' ) + ' disabled' ).addClass( status ).html( buttonStrings[ status ].replace( '...', '&hellip;' ) );
		}

		// Disabled states for statuses
		if ( - 1 !== $.inArray( status, ['preparing', 'loading', 'importing', 'uninstalling'] ) ) {
			$button.addClass( 'disabled' );
		}
	}

	/**
	 * Show progress and status.
	 *
	 * @param {boolean} status
	 */
	toggleProgress( status ) {
		this.$progressContainer[ status ? 'addClass' : 'removeClass' ]( 'visible' );
	}

	/**
	 * Set progress value (range 0-100).
	 *
	 * @param {number} progress
	 */
	setProgress( progress ) {

		// Progress constraints
		if ( progress > 100 ) {
			progress = 100;
		} else if ( progress < 0 ) {
			progress = 0;
		}

		let currentProgress = 0;

		anime( {
			targets: this.$progressBar[ 0 ],
			width: `${progress}%`,
			easing: 'easeInOutSine',
			duration: 700,
			update: anim => {
				currentProgress = parseInt( anim.animations[ 0 ].currentValue, 10 );
				this.$progressBarPercentage.text( `${currentProgress}%` );
			}
		} );
	}

	/**
	 * Set progress status.
	 *
	 * @param {string} statusText
	 */
	setProgressStatus( statusText ) {
		this.$progressText.html( statusText.replace( '...', '&hellip;' ) );
	}
}

// Export as default
export default Kalium_Import;