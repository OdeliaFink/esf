import TypoLab_Font from "./font";
import TypoLab_Font_Variant from "../font-components/font-variant";

/**
 * Laborator Premium font.
 */
export default class TypoLab_Laborator_Font extends TypoLab_Font {

	/**
	 * Set selected variants.
	 *
	 * @param {string|string[]|TypoLab_Font_Variant} variants
	 */
	setVariants( variants ) {
		if ( 'string' === typeof variants ) {
			variants = variants.split( ',' );
		}

		// Set font variant object
		if ( variants instanceof TypoLab_Font_Variant ) {
			super.setVariants( variants );
		} else {
			// Generate from Google variant format strings
			super.setVariants( variants.map( variantName => {
				if ( variantName instanceof TypoLab_Font_Variant ) {
					return variantName;
				}

				return TypoLab_Font_Variant.createFromLaboratorFontFormat( variantName, this );
			} ) );
		}
	}

	/**
	 * Get available variants.
	 *
	 * @return {TypoLab_Font_Variant[]}
	 */
	getAvailableVariants() {
		return this.font_data.variants.map(
			variantName => TypoLab_Font_Variant.createFromLaboratorFontFormat( variantName, this )
		);
	}

	/**
	 * Get variants.
	 *
	 * @return {object[]}
	 */
	getVariantsPreviewList() {
		return this.getAvailableVariants().map( variant => ( {
			value: variant.toString(),
			title: variant.getNicename(),
			image: this.font_data.images[ variant.toString() ],
		} ) );
	}

	/**
	 * Get font author url.
	 *
	 * @return {string}
	 */
	getFontAuthorUrl() {
		return this.font_data.url;
	}

	/**
	 * Get package size.
	 *
	 * @return {string}
	 */
	getPackageSize() {
		return this.font_data.packageSize;
	}

	/**
	 * Get font category nicename.
	 *
	 * @return {string}
	 */
	categoryNicename() {
		return this.font_data.category;
	}
}

/**
 * Font source ID.
 *
 * @type {string} source
 */
TypoLab_Laborator_Font.prototype.source = 'laborator';
