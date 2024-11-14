import TypoLab_Font from "./font";
import TypoLab_Font_Variant from "../font-components/font-variant";

/**
 * Adobe font.
 */
export default class TypoLab_Adobe_Font extends TypoLab_Font {

	/**
	 * Get variant value.
	 *
	 * @param {TypoLab_Font_Variant} variant
	 *
	 * @return {string}
	 */
	getVariantValue( variant ) {
		let variantFormat = [
			variant.isItalic() ? 'i' : 'n',
			parseInt( + variant.weight / 100, 10 ),
		];

		// Validate weight
		if ( isNaN( variantFormat[ 1 ] ) ) {
			variantFormat[ 1 ] = 4;
		}

		return variantFormat.join( '' );
	}

	/**
	 * Get available variants.
	 *
	 * @return {TypoLab_Font_Variant[]}
	 */
	getAvailableVariants() {
		return this.font_data.variations.map(
			variantName => TypoLab_Font_Variant.createFromAdobeFormat( variantName, this )
		);
	}

	/**
	 * Get preview variants.
	 *
	 * @return {object[]}
	 */
	getVariantsPreviewList() {
		return this.getAvailableVariants().map( variant => ( {
			value: variant.toString(),
			title: variant.getNicename(),
			fontFamily: this.getFontFamily(),
			style: variant.style,
			weight: variant.weight,
			disabled: true,
		} ) );
	}

	/**
	 * Get Kit ID.
	 *
	 * @return {string}
	 */
	getKitID() {
		return this.font_data.kit_id;
	}

	/**
	 * Get Kit Name.
	 *
	 * @return {string}
	 */
	getKitName() {
		return this.font_data.kit_name;
	}

	/**
	 * Get font slug.
	 *
	 * @return {string}
	 */
	getFontSlug() {
		return this.font_data.slug;
	}

	/**
	 * Get published date.
	 *
	 * @return {string}
	 */
	getPublishedDate() {
		return this.font_data.published;
	}
}

/**
 * Font source ID.
 *
 * @type {string} source
 */
TypoLab_Adobe_Font.prototype.source = 'adobe';
