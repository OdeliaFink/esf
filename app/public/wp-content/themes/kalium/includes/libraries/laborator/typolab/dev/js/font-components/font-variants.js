/**
 * Font variants collection.
 */
export default class TypoLab_Font_Variants extends Array {

	/**
	 * Constructor.
	 *
	 * @param {TypoLab_Font_Variant[]} variants
	 */
	constructor( variants ) {
		super();

		// Add array of variants
		if ( variants instanceof Array ) {
			variants.forEach( variant => this.push( variant ) );
		}
	}
}
