import $ from "../var/jquery";
import TypoLab_Font from "../font-types/font";

/**
 * Font Selector Provider class.
 *
 * @class
 */
export default class TypoLab_Font_Selector_Provider {

	/**
	 * Constructor.
	 *
	 * @param {array} fontsList
	 * @param {jQuery} $fontSelector
	 * @param {object=} data
	 */
	constructor( fontsList, $fontSelector, data ) {

		/**
		 * Font constructor.
		 *
		 * @type {TypoLab_Font}
		 */
		this.fontConstructor = TypoLab_Font;

		/**
		 * Fonts list.
		 *
		 * @type {array}
		 */
		this.fontsList = fontsList;

		/**
		 * Font options and preview container.
		 *
		 * @type {jQuery}
		 */
		this.$container = $( '#font_variants_select_and_preview' );

		/**
		 * Font selector container.
		 *
		 * @type {jQuery}
		 */
		this.$fontSelector = $fontSelector;

		/**
		 * Selected font.
		 *
		 * @type {TypoLab_Font}
		 */
		this.font = null;

		/**
		 * Other data.
		 *
		 * @type {object}
		 */
		this.data = data;

		// Ready
		this.ready();
	}

	/**
	 * Get font provider.
	 *
	 * @return {string}
	 */
	getFontProvider() {
		return this.fontProvider;
	}

	/**
	 * Get fonts list.
	 *
	 * @return {array}
	 */
	getFontsList() {
		return this.fontsList;
	}

	/**
	 * Get selected font.
	 *
	 * @return {TypoLab_Font|TypoLab_Google_Font|TypoLab_Font_Squirrel_Font|TypoLab_Laborator_Font|TypoLab_Adobe_Font|TypoLab_Hosted_Font|TypoLab_External_Font}
	 */
	getFont() {
		return this.font;
	}

	/**
	 * Get preview and options container.
	 *
	 * @return {array}
	 */
	getContainer() {
		return this.$container;
	}

	/**
	 * Get data.
	 *
	 * @return {object}
	 */
	getData() {
		return this.data;
	}

	/**
	 * Event: Provider initialized.
	 */
	ready() {
	}

	/**
	 * Event: Selected value (called once when font is firstly initialized).
	 */
	selected() {
	}

	/**
	 * Event: Select font.
	 *
	 * @param {object} item
	 */
	select( item ) {
		this.font = new this.fontConstructor( item );
	}

	/**
	 * Event: Preview font.
	 */
	preview() {
	}

	/**
	 * Event: Value change.
	 */
	change() {
	}
}

/**
 * Font Provider.
 *
 * @type {string} fontProvider
 */
TypoLab_Font_Selector_Provider.prototype.fontProvider = 'none';
