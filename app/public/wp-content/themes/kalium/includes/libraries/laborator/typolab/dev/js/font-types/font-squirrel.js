import TypoLab_Font from "./font";
import TypoLab_Font_Variant from "../font-components/font-variant";

/**
 * Font Squirrel font.
 */
export default class TypoLab_Font_Squirrel_Font extends TypoLab_Font {

	/**
	 * Ready.
	 */
	ready() {

		/**
		 * Fetched font data.
		 *
		 * @var {array} fetchedData
		 */
		this.fetchedData = [];


		/**
		 * Fetched font data state.
		 *
		 * @var {boolean} fetched
		 */
		this.fetched = false;
	}

	/**
	 * Get variant value.
	 *
	 * @param {TypoLab_Font_Variant} variant
	 *
	 * @return {string}
	 */
	getVariantValue( variant ) {
		return variant.name;
	}

	/**
	 * Get available variants.
	 *
	 * @return {TypoLab_Font_Variant[]}
	 */
	getAvailableVariants() {
		return this.fetchedData.map( variantData => TypoLab_Font_Variant.createFromFontSquirrelFontData( variantData, this ) );
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
			defaultVariant = variants.shift();

			// Regular as default variant
			variants.some( variant => {
				if ( variant.name.match( /regular/i ) ) {
					defaultVariant = variant;
					return true;
				}

				return false;
			} );
		}

		return defaultVariant;
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
			image: variant.data.listing_image,
		} ) );
	}

	/**
	 * Get font family URL name.
	 *
	 * @return {string}
	 */
	getFamilyUrlName() {
		return this.font_data.family_urlname;
	}

	/**
	 * Get font category.
	 *
	 * @return {string}
	 */
	getCategory() {
		return this.font_data.classification;
	}

	/**
	 * Get foundry name.
	 *
	 * @return {string}
	 */
	getFoundryName() {
		return this.font_data.foundry_name;
	}

	/**
	 * Checks if font data is fetched from remote origin.
	 *
	 * @return {boolean}
	 */
	isFechted() {
		return this.fetched;
	}

	/**
	 * Get font data.
	 *
	 * @return {Promise}
	 */
	fetchFontData() {
		return fetch( `https://www.fontsquirrel.com/api/familyinfo/${this.getFamilyUrlName()}` ).then( response => response.json() ).then( data => {

			// Store fetched data
			this.fetchedData = data;

			// Assign font family name to data
			this.fetchedData._fontFamily = this.getFontFamily();

			// Mark as fetched
			this.fetched = true;

			return new Promise( ( resolve, reject ) => {
				resolve( data );
			} );
		} );
	}
}

/**
 * Font source ID.
 *
 * @type {string} source
 */
TypoLab_Font_Squirrel_Font.prototype.source = 'font-squirrel';
