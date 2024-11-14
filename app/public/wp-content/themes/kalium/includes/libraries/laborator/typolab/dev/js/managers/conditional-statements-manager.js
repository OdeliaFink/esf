import $ from "../var/jquery";
import TypoLab_Conditional_Statement from "../font-components/conditional-statement";

/**
 * Conditional statements manager.
 */
export default class TypoLab_Conditional_Statements_Manager {

	/**
	 * Constructor.
	 *
	 * @param {Element} conditionalStatementsContainer
	 * @param {array} conditionalStatements
	 */
	constructor( { conditionalStatementsContainer, conditionalStatements } ) {

		/**
		 * Container.
		 *
		 * @type {jQuery} $container
		 */
		this.$container = $( conditionalStatementsContainer );

		/**
		 * Placeholder.
		 *
		 * @type {jQuery} $placeholder
		 */
		this.$placeholder = this.$container.find( '.no-statements' ).clone();

		/**
		 * Options (for select fields).
		 *
		 * @type {object} options
		 */
		this.options = conditionalStatements.options;

		/**
		 * Defined conditional statements.
		 *
		 * @param {object[]}
		 */
		this.statements = [];

		// Add registered statements
		conditionalStatements.statements.forEach( statement => this.addStatementEntry( statement ) );

		// Init
		this.init();
	}

	/**
	 * Init.
	 */
	init() {

		// Add new statement entry
		$( '#add-new-conditional-statement' ).on( 'click', ev => {
			ev.preventDefault();
			this.addStatementEntry();
		} );
	}

	/**
	 * Get statements.
	 *
	 * @return {TypoLab_Conditional_Statement[]}
	 */
	getStatements() {
		return this.statements;
	}

	/**
	 * Remove statement.
	 *
	 * @param {TypoLab_Conditional_Statement} statement
	 */
	removeStatement( statement ) {

		// Remove from statement list
		this.statements = this.statements.filter( statementEntry => statementEntry !== statement );

		// If there are no statements, add placeholder
		if ( 0 === this.statements.length ) {
			this.$placeholder.appendTo( this.$container.find( 'tbody' ) );
		}
	}

	/**
	 * Bind statement entry.
	 *
	 * @param {TypoLab_Conditional_Statement} statement
	 * @param {jQuery} $statementContainer
	 * @param {object=} selected
	 */
	bindStatement( statement, $statementContainer, selected ) {
		let $inputs = {
				type: $statementContainer.find( '.select-statement-type' ),
				operator: $statementContainer.find( '.select-statement-operator' ),
				value: $statementContainer.find( '.select-statement-value' ),
			},
			selectOptionsTpl = wp.template( 'select-options-list' );

		/**
		 * Load type values.
		 *
		 * @param {string} type
		 */
		let loadTypeValues = type => {
			let valuesList = [];

			// Load current type value
			if ( !type ) {
				type = $inputs.type.val();
			}

			// Type options
			_.each( this.options, options => {
				options.forEach( option => {
					if ( type === option.name ) {
						_.each( option.values, ( title, value ) => valuesList.push( { title, value } ) );
					}
				} );
			} );

			// Add values
			$inputs.value.html( selectOptionsTpl( {
				optionsList: valuesList,
			} ) );
		}

		/**
		 * Update statement data.
		 *
		 * @param {boolean} loadValues
		 */
		let updateStatement = loadValues => {
			if ( true === loadValues ) {
				loadTypeValues();
			}

			statement.type = $inputs.type.val();
			statement.operator = $inputs.operator.val();
			statement.value = $inputs.value.val();
		};

		// Type options
		_.each( this.options, ( options, groupName ) => {
			let optionsList = options.map( option => ( {
				value: option.name,
				title: option.title,
			} ) );

			$inputs.type.append( `<optgroup label="${groupName}">${selectOptionsTpl( { optionsList: optionsList } )}</optgroup>` );
		} );

		// Show type options
		updateStatement( true );

		// Set selected
		if ( selected ) {

			// Load type values
			loadTypeValues( selected.type );

			// Select options
			$inputs.type.find( 'option' ).filter( ( i, el ) => el.value === selected.type ).prop( 'selected', true );
			$inputs.operator.find( 'option' ).filter( ( i, el ) => el.value === selected.operator ).prop( 'selected', true );
			$inputs.value.find( 'option' ).filter( ( i, el ) => el.value === selected.value ).prop( 'selected', true );

			// Update statement
			updateStatement();
		}

		/**
		 * Events.
		 */

		// On type change
		$inputs.type.on( 'change', ev => updateStatement( true ) );

		// On operator change
		$inputs.operator.on( 'change', ev => updateStatement() );

		// On value change
		$inputs.value.on( 'change', ev => updateStatement() );

		// Remove statement
		$statementContainer.on( 'click', '.remove-conditional-statement', ev => {
			ev.preventDefault();

			// Remove from statements list
			this.removeStatement( statement );

			// Remove row element
			$statementContainer.remove();
		} );
	}

	/**
	 * Add statement entry.
	 *
	 * @param {object=} selected
	 */
	addStatementEntry( selected = null ) {
		let statement = new TypoLab_Conditional_Statement(),
			statementEntryTpl = wp.template( 'conditional-statement-entry' ),
			selectOptionsTpl = wp.template( 'select-options-list' ),
			$containerBody = this.$container.find( 'tbody' );

		// Statement entry object
		let $statementContainer = $( statementEntryTpl( {
			id: `statement-${TypoLab_Conditional_Statements_Manager.instanceId ++}`,
			operatorOptions: selectOptionsTpl( {
				optionsList: [
					{
						value: 'equals',
						title: 'is',
					},
					{
						value: 'not-equals',
						title: 'is not',
					},
				],
			} ),
		} ) );


		// Bind statement
		this.bindStatement( statement, $statementContainer, selected );

		// Add to statements list
		this.getStatements().push( statement );

		// Remove placeholer
		$containerBody.find( '.no-statements' ).remove();

		// Add to table
		$containerBody.append( $statementContainer );
	}
}

/**
 * Instance ID.
 *
 * @type {number} instanceId
 */
TypoLab_Conditional_Statements_Manager.instanceId = 1;
