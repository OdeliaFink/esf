import TypoLab_Font from "./font";
import TypoLab_Font_Variant from "../font-components/font-variant";
import {urlEncodeSpaces, buildGoogleFontStylesheetURL} from "../functions";
import {SORT_VARIANTS_ASC} from "../sort";

/**
 * Google font.
 */
export default class TypoLab_Google_Font extends TypoLab_Font {

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

				return TypoLab_Font_Variant.createFromGoogleFormat( variantName, this );
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
			variantName => TypoLab_Font_Variant.createFromGoogleFormat( variantName, this )
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
			fontFamily: this.getFontFamily(),
			style: variant.style,
			weight: variant.weight,
		} ) );
	}

	/**
	 * Generate stylesheet API URL.
	 *
	 * @return {string}
	 */
	getStylesheet() {
		return buildGoogleFontStylesheetURL( {
			family: this.getFontFamily(),
		} );
	}

	/**
	 * Get font version.
	 *
	 * @return {string}
	 */
	getVersion() {
		return this.font_data.version;
	}

	/**
	 * Get last modified date.
	 *
	 * @return {string}
	 */
	getLastModifiedDate() {
		return this.font_data.lastModified;
	}

	/**
	 * Category nice name.
	 *
	 * @return {string}
	 */
	categoryNicename() {
		let category = this.category;

		switch ( category ) {
			case 'display':
				category = 'Display';
				break;

			case 'handwriting':
				category = 'Handwriting';
				break;

			case 'monospace':
				category = 'Monospace';
				break;

			case 'sans-serif':
				category = 'Sans Serif';
				break;

			case 'serif':
				category = 'Serif';
				break;
		}

		return category;
	}
}

/**
 * Font source ID.
 *
 * @type {string} source
 */
TypoLab_Google_Font.prototype.source = 'google';
