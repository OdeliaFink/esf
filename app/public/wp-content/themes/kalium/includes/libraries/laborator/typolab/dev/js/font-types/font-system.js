import TypoLab_Font from "./font";
import TypoLab_Font_Variant from "../font-components/font-variant";
import {SORT_VARIANTS_ASC} from "../sort";

/**
 * System font.
 */
export default class TypoLab_System_Font extends TypoLab_Font {

	/**
	 * Get font family stack.
	 *
	 * @return {array}
	 */
	getFontFamilyStack() {
		return this.font_data.font_stack;
	}

	/**
	 * Get available variants.
	 *
	 * @return {TypoLab_Font_Variant[]}
	 */
	getAvailableVariants() {
		return this.font_data.variants.map(
			variantName => TypoLab_Font_Variant.createFromSystemFontFormat( variantName, this )
		).sort( SORT_VARIANTS_ASC );
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
			fontFamily: this.getFontFamilyStack(),
			style: variant.style,
			weight: variant.weight,
			disabled: true,
		} ) );
	}
}

/**
 * Font source ID.
 *
 * @type {string} source
 */
TypoLab_System_Font.prototype.source = 'system';
