import TypoLab_Font from "./font";

/**
 * Custom font.
 */
export default class TypoLab_External_Font extends TypoLab_Font {

	/**
	 * Get stylesheet URL.
	 *
	 * @return {string}
	 */
	getStylesheetURL() {
		return this.stylesheetURL;
	}

	/**
	 * Set stylesheet URL.
	 *
	 * @param {string} stylesheetURL
	 */
	setStylesheetURL( stylesheetURL ) {
		this.stylesheetURL = stylesheetURL;
	}

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
TypoLab_External_Font.prototype.source = 'external';

/**
 * Stylesheet URL.
 *
 * @type {string} stylesheetURL
 */
TypoLab_External_Font.prototype.stylesheetURL = null;
