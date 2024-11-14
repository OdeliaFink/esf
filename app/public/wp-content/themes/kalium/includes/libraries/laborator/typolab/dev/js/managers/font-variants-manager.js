import $ from "../var/jquery";
import TypoLab_Hosted_Font from "../font-types/font-hosted";
import TypoLab_Font_Variant from "../font-components/font-variant";
import {previewText, fontStylesOptions, fontWeightOptions, fontDisplayOptions} from "../functions";

/**
 * Font Variants manager.
 */
export default class TypoLab_Font_Variants_Manager {

	/**
	 * Constructor.
	 *
	 * @param {Element} fontFamilyNameInput
	 * @param {Element} fontVariantsContainer
	 * @param {object[]} variants
	 */
	constructor( { fontFamilyNameInput, fontVariantsContainer, fontVariants } ) {

		/**
		 * Font family name input element.
		 *
		 * @type {jQuery} $fontFamilyNameInput
		 */
		this.$fontFamilyNameInput = $( fontFamilyNameInput );

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
		 * @type {TypoLab_Hosted_Font} font
		 */
		this.font = new TypoLab_Hosted_Font();

		/**
		 * Set font variants.
		 */
		this.font.setVariants( this.createFontVariants( fontVariants ) );

		/**
		 * Init.
		 */
		this.init();
	}

	/**
	 * Init.
	 */
	init() {

		// Set font family initially
		this.setFontFamilyName( this.getFontFamilyNameFromInput() );

		// Render variants
		this.renderVariants();

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
				this.font.setVariants( newSort );

				// Re-render preview
				this.preview();
			}
		} );

		// Update font face name
		this.$fontFamilyNameInput.on( 'input', ev => {
			this.setFontFamilyName( this.getFontFamilyNameFromInput() );
		} );

		// Add font variant
		$( '#add-font-variant' ).on( 'click', ev => {
			ev.preventDefault();

			// Add blank variant
			this.getFontVariants().push( new TypoLab_Font_Variant() );

			// Re-render variants
			this.renderVariants();

			// Preview
			this.preview();
		} );
	}

	/**
	 * Get font object.
	 *
	 * @return {TypoLab_Hosted_Font}
	 */
	getFont() {
		return this.font;
	}

	/**
	 * Get font face name.
	 *
	 * @return {string}
	 */
	getFontFamilyName() {
		return this.font.getFontFamily();
	}

	/**
	 * Set font face name.
	 *
	 * @param {string} name
	 */
	setFontFamilyName( name ) {

		// Set font name in the font object
		this.font.setFontFamily( name );

		// Generate preview
		this.preview();
	}

	/**
	 * Get font variants.
	 *
	 * @return {TypoLab_Font_Variants<TypoLab_Font_Variant>}
	 */
	getFontVariants() {
		return this.font.getVariants();
	}

	/**
	 * Get font face name value from input.
	 *
	 * @return {string}
	 */
	getFontFamilyNameFromInput() {
		return this.$fontFamilyNameInput.val();
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
						style: variant.style,
						weight: variant.weight,
						unicodeRange: variant.unicode_range,
						display: variant.display,
						font: this.getFont(),
					} );

					// Font files
					_.each( variant.src, ( file, type ) => variantInstance.addFontFile( type, file ) );

					variantsList.push( variantInstance );
				}
			} );
		}

		return variantsList;
	}

	/**
	 * Open media frame to select or upload font files.
	 *
	 * @param {string} type
	 * @param {jQuery} $input
	 */
	openMediaFrame( type, $input ) {
		let frame = wp.media( {
				title: `Select or upload ${type.toUpperCase()}  font file`,
				multiple: false,
				library: {
					type: [
						'font',
						'application',
					],
				},
			} ),
			selectedAttachment = $input[ 0 ].selectedAttachment;

		// Set previous selection
		frame.on( 'open', () => {
			if ( $input[ 0 ].selectedAttachment ) {
				frame.state().get( 'selection' ).add( selectedAttachment );
			}
		} );

		// Get media attachment details from the frame state
		frame.on( 'select', () => {
			let selection = frame.state().get( 'selection' ).first(),
				attachment = selection.toJSON();

			// Set input URL
			$input.val( attachment.url ).trigger( 'input' );

			// Set selected attachment
			$input[ 0 ].selectedAttachment = selection;
		} );

		// Open frame
		frame.open();
	}

	/**
	 * Bind variant model to its DOM input.
	 *
	 * @param {TypoLab_Font_Variant} variant
	 * @param {jQuery} $variantContainer
	 */
	bindVariant( variant, $variantContainer ) {
		let $inputs = {
				style: $variantContainer.find( '.select-font-style' ),
				weight: $variantContainer.find( '.select-font-weight' ),
				unicodeRange: $variantContainer.find( '.input-font-unicode-range' ),
				display: $variantContainer.find( '.select-font-display' ),
				src: {
					woff2: $variantContainer.find( '.font-file-woff2 input[type="text"]' ),
					woff: $variantContainer.find( '.font-file-woff input[type="text"]' ),
					ttf: $variantContainer.find( '.font-file-ttf input[type="text"]' ),
					svg: $variantContainer.find( '.font-file-svg input[type="text"]' ),
					eot: $variantContainer.find( '.font-file-eot input[type="text"]' ),
				},
			},
			updateVariant = ev => {
				variant.setStyle( $inputs.style.val() );
				variant.setWeight( $inputs.weight.val() );
				variant.setDisplay( $inputs.display.val() );
				variant.setUnicodeRange( $inputs.unicodeRange.val() );

				// Font files
				_.each( $inputs.src, ( $input, type ) => {
					let value = $input.val();

					variant.removeFontFile( type );

					if ( value ) {
						variant.addFontFile( type, value );
					}
				} );

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

		$inputs.style.on( 'change', updateVariant );
		$inputs.weight.on( 'change', updateVariant );
		$inputs.display.on( 'change', updateVariant );
		$inputs.unicodeRange.on( 'input', updateVariant );

		// Font sources
		_.each( $inputs.src, ( $input, type ) => {

			// Font file input
			$input.on( 'input', updateVariant );

			// Select font file button
			$input.next().on( 'click', ev => this.openMediaFrame( type, $input ) );
		} );

		// Toggle variant table
		$variantContainer.on( 'click', '.typolab-toggle-body', ev => {
			ev.preventDefault();
			let toggledClass = 'typolab-toggle--toggled';

			$variantContainer.toggleClass( toggledClass );

			// Variant isToggled meta property
			variant._isToggled = $variantContainer.hasClass( toggledClass );
		} );

		// Show advanced options
		$variantContainer.on( 'click', '.show-advanced-options', ev => {
			ev.preventDefault();

			let $link = $( ev.currentTarget ),
				$hiddenOptions = $variantContainer.find( '.advanced-option' ),
				visibleClass = 'is-visible';

			if ( !$hiddenOptions.hasClass( visibleClass ) ) {
				$link.text( $link.data( 'hide-text' ) );
			} else {
				$link.text( $link.data( 'show-text' ) );
			}

			// Toggle class
			$hiddenOptions.toggleClass( visibleClass );

			// Variant advancedOptionsVisible meta property
			variant._advancedOptionsVisible = $hiddenOptions.hasClass( visibleClass );
		} );

		// Delete variant
		$variantContainer.on( 'click', '.delete', ev => {
			ev.preventDefault();

			if ( confirm( 'Confirm delete?' ) ) {
				this.removeVariant( variant );
			}
		} );
	}

	/**
	 * Remove variant.
	 *
	 * @param {TypoLab_Font_Variant} removeVariant
	 */
	removeVariant( removeVariant ) {

		// Filter array and remove selected variant
		this.font.setVariants( this.font.getVariants().filter( variant => removeVariant !== variant ) );

		// Re-render variants list
		this.renderVariants();

		// Generate preview
		this.preview();
	}

	/**
	 * Render variants entries.
	 */
	renderVariants() {
		let variantFormTpl = wp.template( 'font-variant-form' ),
			selectOptionsTpl = wp.template( 'select-options-list' );

		// Clear DOM
		this.$fontVariantsContainer.html( '' );

		// Render variants
		for ( let variant of this.getFontVariants() ) {
			let fontFiles = variant.getFontFiles(),
				html = variantFormTpl( {
					id: variant.getInstanceId(),
					fontStyleOptions: selectOptionsTpl( {
						optionsList: fontStylesOptions,
						selected: variant.style,
					} ),
					fontWeightOptions: selectOptionsTpl( {
						optionsList: fontWeightOptions,
						selected: variant.weight,
						default: 'normal',
					} ),
					fontDisplayOptions: selectOptionsTpl( {
						optionsList: fontDisplayOptions,
						selected: variant.display,
						default: 'swap',
					} ),
					files: {
						woff2: fontFiles.woff2,
						woff: fontFiles.woff,
						ttf: fontFiles.ttf,
						svg: fontFiles.svg,
						eot: fontFiles.eot,
					},
					unicodeRange: variant.unicodeRange.replace( /U\+/g, '' ),

					// Meta data
					advancedOptionsVisible: variant._advancedOptionsVisible,
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
	 * Preview font.
	 */
	preview() {
		let fontFaceName = this.getFontFamilyName(),
			fontFaces = [],
			fontVariantsList = [];

		// Generate font faces
		this.getFontVariants().forEach( variant => {
			const fontFace = variant.generateFontFace( fontFaceName );

			if ( fontFace ) {
				fontFaces.push( fontFace );

				// Preview entry
				fontVariantsList.push( {
					title: variant.getNicename(),
					fontFamily: fontFaceName,
					style: variant.style,
					weight: variant.weight,
				} );
			}
		} );

		// Generate preview
		if ( fontFaces.length ) {
			let fontVariantsSelectContainerTpl = wp.template( 'font-variants-select-container' ),
				fontVariantsSelectTpl = wp.template( 'select-font-variants' ),
				templateParts = [];

			// Clear preview
			this.$fontPreviewContainer.html( '' );

			// Font variants preview
			templateParts.push( fontVariantsSelectTpl( {
				style: `<style>${fontFaces.join( "\n" )}</style>`,
				previewText: previewText(),
				variants: fontVariantsList,
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
_.extend( TypoLab_Font_Variants_Manager.prototype, Backbone.Events );
