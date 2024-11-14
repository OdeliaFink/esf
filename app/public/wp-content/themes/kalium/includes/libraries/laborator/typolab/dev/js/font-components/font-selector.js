/**
 * Font Selector class.
 *
 * @constructor
 */
export default class TypoLab_Font_Selector {

	/**
	 * Constructor.
	 */
	constructor( { type, id, variant, include } ) {

		/**
		 * Selector type.
		 *
		 * @type {string}
		 */
		this.type = type;

		/**
		 * Selector ID.
		 *
		 * @type {string}
		 */
		this.id = id;

		/**
		 * Variant value.
		 *
		 * @type {string}
		 */
		this.variant = variant;

		/**
		 * Include selector or not.
		 *
		 * @type {boolean}
		 */
		this.include = include;
	}

	/**
	 * Get ID.
	 *
	 * @return {string}
	 */
	getId() {
		return this.id;
	}

	/**
	 * Check if selector is base selector.
	 *
	 * @return {boolean}
	 */
	isBaseSelector() {
		return 'base-selector' === this.type;
	}

	/**
	 * Should selector be included or not.
	 *
	 * @return {boolean}
	 */
	doInclude() {
		return this.include;
	}
}
