import TypoLab_Font from "./font";

/**
 * Hosted font.
 */
export default class TypoLab_Hosted_Font extends TypoLab_Font {

	/**
	 * Check if font is properly formatted.
	 *
	 * @return {boolean}
	 */
	isValid() {
		return 0 < this.getFontFamily().length && 0 < this.getVariants().filter( variant => null !== variant.generateFontFace( this.getFontFamily() ) ).length;
	}
}

/**
 * Font source ID.
 *
 * @type {string} source
 */
TypoLab_Hosted_Font.prototype.source = 'hosted';
