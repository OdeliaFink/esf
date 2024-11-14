import $ from "../var/jquery";
import TypoLab_Font_Variant from "../font-components/font-variant";
import TypoLab_Font_Variants from "../font-components/font-variants";

/**
 * Font object.
 *
 * @property {string} font_family
 */
export default class TypoLab_Font {

	/**
	 * Constructor.
	 *
	 * @param {string} source
	 * @param {object} fontObj
	 */
	constructor( fontObj ) {

		/**
		 * Set font object props as class props.
		 */
		_.each( fontObj, ( value, prop ) => {
			this[ prop ] = value;
		} );

		/**
		 * Selected variants.
		 *
		 * @type {TypoLab_Font_Variants<TypoLab_Font_Variant>} variants
		 */
		this.variants = new TypoLab_Font_Variants();

		// Ready
		this.ready();
	}

	/**
	 * Get font source.
	 *
	 * @return {string}
	 */
	getSource() {
		return this.source;
	}

	/**
	 * Get font family.
	 *
	 * @return {string}
	 */
	getFontFamily() {
		return this.font_family;
	}

	/**
	 * Set font family.
	 *
	 * @param {string} name
	 */
	setFontFamily( name ) {
		this.font_family = name;
	}

	/**
	 * Get selected variants.
	 *
	 * @return {TypoLab_Font_Variants<TypoLab_Font_Variant>}
	 */
	getVariants() {
		return this.variants;
	}

	/**
	 * Set selected variants.
	 *
	 * @param {TypoLab_Font_Variant|TypoLab_Font_Variant[]} variants
	 */
	setVariants( variants ) {
		this.variants = new TypoLab_Font_Variants();

		if ( variants instanceof TypoLab_Font_Variant ) {

			// Assign font reference
			variants.setFont( this );

			// Add to variants list
			this.variants.push( variants );
		} else {
			variants.forEach( variant => {
				if ( variant instanceof TypoLab_Font_Variant ) {

					// Assign font reference
					variant.setFont( this );

					// Add to variants list
					this.variants.push( variant );
				}
			} );
		}

		// Trigger event
		this.trigger( 'variants-updated', this.variants );
	}

	/**
	 * Get variant value.
	 *
	 * @param {TypoLab_Font_Variant} variant
	 *
	 * @return {string}
	 */
	getVariantValue( variant ) {
		let variantFormat = [];

		if ( variant.isRegular() ) {
			variantFormat.push( variant.isItalic() ? 'italic' : 'regular' );
		} else {
			variantFormat.push( variant.weight );

			if ( variant.isItalic() ) {
				variantFormat.push( 'italic' );
			}
		}

		return variantFormat.join( '' );
	}

	/**
	 * Get available variants.
	 *
	 * @return {TypoLab_Font_Variants}
	 */
	getAvailableVariants() {
		return this.getVariants();
	}

	/**
	 * Get default variant.
	 *
	 * @return {TypoLab_Font_Variant|null}
	 */
	getDefaultVariant() {
		let variants = this.getAvailableVariants(),
			defaultVariant = null;

		if ( variants.length ) {

			// First available variant
			defaultVariant = variants[ 0 ];

			// Regular as default variant
			variants.some( variant => {
				if ( variant.isRegular() && !variant.isItalic() ) {
					defaultVariant = variant;
					return true;
				}

				return false;
			} );
		}

		return defaultVariant;
	}

	/**
	 * Get selected variants value as string.
	 *
	 * @param {boolean} asArray
	 *
	 * @return {string}
	 */
	getVariantsValue( asArray = false ) {
		let values = this.getVariants().map( variant => variant.toString() );
		return asArray ? values : values.join( ',' );
	}

	/**
	 * Ready.
	 */
	ready() {
	}
}

/**
 * Font source ID.
 *
 * @type {string} source
 */
TypoLab_Font.prototype.source = 'none';

/**
 * Callbacks / events.
 */
_.extend( TypoLab_Font.prototype, Backbone.Events );
