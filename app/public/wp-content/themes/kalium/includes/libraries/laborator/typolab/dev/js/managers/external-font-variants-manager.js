import $ from "../var/jquery";
import "../font-types/font-external";
import TypoLab_Font_Variant from "../font-components/font-variant";
import TypoLab_External_Font from "../font-types/font-external";
import cssParser from "../libraries/css-parse";
import {previewText, fontDisplayOptions, fontStylesOptions, fontWeightOptions} from "../functions";
import {SORT_VARIANTS_ASC} from "../sort";

/**
 * Custom Font Variants manager.
 *
 * @constructor
 * @public
 */
export default class TypoLab_External_Font_Variants_Manager {

	/**
	 * Constructor.
	 *
	 * @param {Element} stylesheetURLInput
	 * @param {Element} fontVariantsContainer
	 * @param {object[]} variants
	 */
	constructor( { stylesheetUrlInput, fontVariantsContainer, fontVariants } ) {

		/**
		 * Font family name input element.
		 *
		 * @type {jQuery} $stylesheetUrlInput
		 */
		this.$stylesheetUrlInput = $( stylesheetUrlInput );

		/**
		 * Font variants container element.
		 *
		 * @type {jQuery} $fontVariantsContainer
		 */
		this.$fontVariantsContainer = $( fontVariantsContainer );

		/**
		 * Font preview container.
		 *
		 * @type {jQuery} $fontPreviewContainer
		 */
		this.$fontPreviewContainer = $( '#font_variants_select_and_preview' );

		/**
		 * Font object.
		 *
		 * @type {TypoLab_Hosted_Font}
		 */
		this.font = new TypoLab_External_Font();

		// Set font variants
		this.setFontVariants( this.createFontVariants( fontVariants ) );

		// Init
		this.init();
	}

	/**
	 * Init.
	 */
	init() {

		// Set stylesheet URL initially
		this.setStylesheetURL( this.getStylesheetURLFromInput() );

		// Update font face name
		this.$stylesheetUrlInput.on( 'input', ev => {
			this.setStylesheetURL( this.getStylesheetURLFromInput() );
		} );

		// Render variants
		this.renderVariants();

		// Preview
		if ( this.getFontVariants().length ) {
			this.preview();
		}

		// Make sortable
		this.$fontVariantsContainer.sortable( {

			// Will sort variants on preview as well
			update: () => {
				const newSort = [];

				// Populate newSort array
				this.$fontVariantsContainer.children().each( ( i, el ) => {
					newSort.push( el.variantReference );
				} );

				// Set variants
				this.setFontVariants( newSort );

				// Re-render preview
				this.preview();
			}
		} );

		// Add font variant
		$( '#add-font-variant' ).on( 'click', ev => {
			ev.preventDefault();

			// Add blank variant
			this.getFontVariants().push( new TypoLab_Font_Variant() );

			// Re-render variants
			this.renderVariants();
		} );

		// Fetch font variants
		$( '#fetch-font-variants' ).on( 'click', ev => {
			ev.preventDefault();

			if ( 0 === this.getFontVariants().length || confirm( 'Fetching font variants will override existing ones?' ) ) {
				this.fetchVariantsFromStylesheet();
			}
		} );
	}

	/**
	 * Get font object.
	 *
	 * @return {TypoLab_External_Font}
	 */
	getFont() {
		return this.font;
	}

	/**
	 * Get defined variants.
	 *
	 * @return {TypoLab_Font_Variants<TypoLab_Font_Variant>}
	 */
	getFontVariants() {
		return this.font.getVariants();
	}

	/**
	 * Set font variants.
	 *
	 * @param {TypoLab_Font_Variant[]} variants
	 */
	setFontVariants( variants ) {

		// Iterate variants
		_.each( variants, variant => {

			// Reset current nicename
			variant.data.niceName = '';

			// Set nicename
			variant.data.niceName = [variant.name, variant.getNicename()].join( ' - ' );
		} );

		this.font.setVariants( variants );
	}

	/**
	 * Get stylesheet URL.
	 *
	 * @return {string}
	 */
	getStylesheetURL() {
		return this.font.getStylesheetURL();
	}

	/**
	 * Set stylesheet URL.
	 *
	 * @param {string} stylesheetURL
	 */
	setStylesheetURL( stylesheetURL ) {
		this.font.setStylesheetURL( stylesheetURL );

		// Fetch font variants automatically
		if ( 0 === this.getFontVariants().length && stylesheetURL.match( /^https?.*?(\.css|\\?)/ ) ) {
			this.fetchVariantsFromStylesheet();
		}
	}

	/**
	 * Get stylesheet URL from input.
	 *
	 * @return {string}
	 */
	getStylesheetURLFromInput() {
		return this.$stylesheetUrlInput.val();
	}

	/**
	 * Create font variants from object array.
	 *
	 * @param {array} variants
	 *
	 * @return {TypoLab_Font_Variant[]}
	 */
	createFontVariants( variants ) {
		let variantsList = [];

		if ( variants instanceof Array ) {
			variants.forEach( variant => {
				if ( variant instanceof TypoLab_Font_Variant ) {
					variantsList.push( variant );
				} else {

					// Create instance from object
					let variantInstance = new TypoLab_Font_Variant( {
						name: variant.name,
						style: variant.style,
						weight: variant.weight,
					} );

					variantsList.push( variantInstance );
				}
			} );
		}

		return variantsList;
	}

	/**
	 * Fetch font variants from stylesheet.
	 */
	fetchVariantsFromStylesheet() {
		let stylesheetURL = this.getStylesheetURL(),
			$button = $( '#fetch-font-variants' ),
			setLoadingState = isLoading => {
				$button[ isLoading ? 'addClass' : 'removeClass' ]( 'is-loading' );
				this.$stylesheetUrlInput[ isLoading ? 'addClass' : 'removeClass' ]( 'is-loading' );
			};

		// Stylesheet is required
		if ( !stylesheetURL ) {
			alert( 'Please enter Stylesheet URL!' );
			this.$stylesheetUrlInput.focus();
			return;
		}

		// Loading
		setLoadingState( true );

		// Fetch content from stylesheet URL
		fetch( stylesheetURL ).then( response => response.text() )
			// Parse stylesheet
			.then( content => {
				let ast = cssParser( content ),
					variants = [];

				// Disable loading
				setLoadingState( false );

				// Valid stylesheet
				if ( 'stylesheet' === ast.type ) {

					// Iterate rules
					_.each( ast.stylesheet.rules, rule => {

						// @font-face
						if ( 'font-face' === rule.type ) {
							let name,
								style,
								weight;

							// Iterate declarations
							_.each( rule.declarations, declaration => {

								// Skip empty values
								if ( !declaration.value ) {
									return;
								}

								// Font family
								if ( 'font-family' === declaration.property ) {
									name = declaration.value.replace( /['"]/g, '' );
								}
								// Style
								else if ( 'font-style' === declaration.property ) {
									style = declaration.value;
								}
								// Weifht
								else if ( 'font-weight' === declaration.property ) {
									weight = declaration.value;
								}
							} );

							// Create variant if valid
							if ( name && style && weight ) {
								let variant = new TypoLab_Font_Variant( { name, style, weight } );

								// Add to variants list
								variants.push( variant );
							}
						}
					} );

					// Unique variants
					if ( 1 < variants.length ) {
						variants = _.reduce( variants, ( memo, currentVariant ) => {
							let uniqueArray = memo instanceof Array ? memo : [memo];

							// Check if it exists
							for ( let variant of uniqueArray ) {
								if ( variant.equals( currentVariant ) ) {
									return uniqueArray;
								}
							}

							// Its unique
							uniqueArray.push( currentVariant );

							return uniqueArray;
						} );
					}

					// Sort variants
					variants = variants.sort( SORT_VARIANTS_ASC );

					// Set variants
					this.setFontVariants( variants );

					// Render variants
					this.renderVariants();

					// Preview
					this.preview();
				}

				// No font faces found
				if ( !variants.length ) {
					alert( 'No font variants found in the given stylesheet URL!' );
				}
			} )
			// Errors
			.catch( error => {

				// Disable loading
				setLoadingState( false );

				// Show error
				alert( 'Error:\n' + error.message );
			} );
	}

	/**
	 * Bind variant model to its DOM input.
	 *
	 * @param {TypoLab_Font_Variant} variant
	 * @param {jQuery} $variantContainer
	 */
	bindVariant( variant, $variantContainer ) {
		let $inputs = {
				name: $variantContainer.find( '.input-font-name' ),
				style: $variantContainer.find( '.select-font-style' ),
				weight: $variantContainer.find( '.select-font-weight' ),
			},
			updateVariant = ev => {
				variant.setName( $inputs.name.val() );
				variant.setStyle( $inputs.style.val() );
				variant.setWeight( $inputs.weight.val() );

				// Reset nicename
				variant.data.niceName = '';

				// Set nicename
				variant.data.niceName = [variant.name, variant.getNicename()].join( ' - ' );

				// Generate preview
				this.preview();

				// Update event
				this.trigger( 'variant-updated', variant );
			};

		// Set variant instance reference
		$variantContainer[ 0 ].variantReference = variant;

		/**
		 * Events.
		 */

		$inputs.name.on( 'input', updateVariant );
		$inputs.style.on( 'change', updateVariant );
		$inputs.weight.on( 'change', updateVariant );

		// Toggle variant table
		$variantContainer.on( 'click', '.typolab-toggle-body', ev => {
			ev.preventDefault();
			let toggledClass = 'typolab-toggle--toggled';

			$variantContainer.toggleClass( toggledClass );

			// Variant isToggled meta property
			variant._isToggled = $variantContainer.hasClass( toggledClass );
		} );

		// Delete variant
		$variantContainer.on( 'click', '.delete', ev => {
			ev.preventDefault();
			this.removeVariant( variant );
		} );
	}

	/**
	 * Remove variant.
	 *
	 * @param {TypoLab_Font_Variant} removeVariant
	 */
	removeVariant( removeVariant ) {

		// Filter array and remove selected variant
		this.setFontVariants( this.font.getVariants().filter( variant => removeVariant !== variant ) );

		// Re-render variants list
		this.renderVariants();

		// Generate preview
		this.preview();
	}

	/**
	 * Render variants.
	 */
	renderVariants() {
		let customFontVariantFormTpl = wp.template( 'custom-font-variant-form' ),
			selectOptionsTpl = wp.template( 'select-options-list' );

		// Clear DOM
		this.$fontVariantsContainer.html( '' );

		// Render variants
		for ( let variant of this.getFontVariants() ) {
			let html = customFontVariantFormTpl( {
					id: variant.getInstanceId(),
					fontFamily: variant.name,
					fontStyleOptions: selectOptionsTpl( {
						optionsList: fontStylesOptions,
						selected: variant.style,
					} ),
					fontWeightOptions: selectOptionsTpl( {
						optionsList: fontWeightOptions,
						selected: variant.weight,
						default: 'normal',
					} ),

					// Meta data
					isToggled: variant._isToggled,
				} ),
				$variantContainer = $( html );

			// Bind variant instance to $variantContainer
			this.bindVariant( variant, $variantContainer );

			// Append to variants container
			this.$fontVariantsContainer.append( $variantContainer );
		}
	}

	/**
	 * Preview.
	 */
	preview() {
		let fontFaces = [],
			fontVariantsList = [];

		// Generate font faces
		this.getFontVariants().forEach( variant => {
			const fontFace = variant.generateFontFace();

			if ( fontFace ) {
				fontFaces.push( fontFace );

				// Preview entry
				fontVariantsList.push( {
					title: variant.getNicename(),
					fontFamily: variant.name,
					style: variant.style,
					weight: variant.weight,
				} );
			}
		} );

		// Clear preview
		this.$fontPreviewContainer.html( '' );

		// Generate preview
		if ( fontFaces.length ) {
			let fontVariantsSelectContainerTpl = wp.template( 'font-variants-select-container' ),
				fontVariantsSelectTpl = wp.template( 'select-font-variants' ),
				templateParts = [];

			// Font variants preview
			templateParts.push( fontVariantsSelectTpl( {
				stylesheet: this.getStylesheetURL(),
				style: `<style>${fontFaces.join( "\n" )}</style>`,
				previewText: previewText(),
				variants: fontVariantsList,
				selected: this.getFont().getVariantsValue( true ),
			} ) );

			/**
			 * Insert/render the preview panel.
			 */

			this.$fontPreviewContainer.html( fontVariantsSelectContainerTpl( {
				content: templateParts.join( "\n" ),
			} ) ).find( '.variant-preview-text' ).addClass( 'is-loaded' );
		}
	}
}

/**
 * Callbacks / events.
 */
_.extend( TypoLab_External_Font_Variants_Manager.prototype, Backbone.Events );
