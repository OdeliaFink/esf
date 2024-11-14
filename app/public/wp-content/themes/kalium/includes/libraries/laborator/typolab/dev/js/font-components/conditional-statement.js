/**
 * Conditional statement.
 */
export default class TypoLab_Conditional_Statement {

	/**
	 * Constructor.
	 */
	constructor( { type, operator, value } = {} ) {

		/**
		 * Type.
		 *
		 * @type {string} type
		 */
		this.type = type || null;

		/**
		 * Operator.
		 *
		 * @type {string} operator
		 */
		this.operator = operator || 'equals';

		/**
		 * Value.
		 *
		 * @type {string} value
		 */
		this.value = value || null;
	}

}