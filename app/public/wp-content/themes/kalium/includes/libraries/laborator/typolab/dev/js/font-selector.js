import $ from "./var/jquery";
import TypoLab_Google_Fonts_Provider from "./font-selector-providers/google-fonts-provider";
import TypoLab_Font_Squirrel_Provider from "./font-selector-providers/font-squirrel-fonts-provider";
import TypoLab_Laborator_Fonts_Provider from "./font-selector-providers/laborator-fonts-provider";
import TypoLab_Adobe_Fonts_Provider from "./font-selector-providers/adobe-fonts-provider";
import TypoLab_System_Fonts_Provider from "./font-selector-providers/system-fonts-provider";
import "./font-selector-providers/system-fonts-provider";
import TypoLab_Font from "./font-types/font";

/**
 * Font selector providers.
 */
const fontSelectorProviders = {
	'google-fonts': TypoLab_Google_Fonts_Provider,
	'font-squirrel': TypoLab_Font_Squirrel_Provider,
	'laborator-fonts': TypoLab_Laborator_Fonts_Provider,
	'adobe-fonts': TypoLab_Adobe_Fonts_Provider,
	'system-fonts': TypoLab_System_Fonts_Provider,
};

/**
 * Font Selector class.
 */
export default class TypoLab_Font_Selector {

	/**
	 * Constructor.
	 *
	 * @param {HTMLElement} fontListSelectContainer
	 * @param {object} fontListSelectOptions
	 */
	constructor( { fontListSelectContainer, fontListSelectOptions } ) {

		/**
		 * Font selector container.
		 *
		 * @type {jQuery} $container
		 */
		this.$container = $( fontListSelectContainer );

		/**
		 * Font provider.
		 *
		 * @type {string} Font provider
		 */
		this.fontProvider = fontListSelectOptions.provider;

		/**
		 * Selected item.
		 *
		 * @type {TypoLab_Font} selected
		 */
		this.selected = null;

		/**
		 * Other options.
		 */

		// Tabs list
		this.$tabsList = this.$container.find( '.alphabet a' );

		// Search input
		this.$search = this.$container.find( 'input[name="search-fonts"]' );

		// Filter categories
		this.$filterCategories = this.$container.find( 'select[name="search-category"]' );

		// Fonts list container
		this.$fontsList = this.$container.find( '.font-list' );

		// Value input
		this.$value = this.$container.find( '.font-list-selector-value' );

		// No results element
		this.$noResults = $( `<div class="no-records">Nothing found!</div>` );

		// Fonts list
		this.fontsList = fontListSelectOptions.items;

		// Value prop
		this.valueProp = fontListSelectOptions.value_prop;

		// Data object
		this.data = fontListSelectOptions.data;

		// Font source provider
		this.fontSourceProvider = null;

		// Last active tab
		this.lastActiveTab = null;

		// Init
		this.init();
	}

	/**
	 * Init font selector component.
	 */
	init() {

		// Render fonts
		this.renderFontsList();

		// Set initial tab
		this.setActiveTab();

		// Initalize font source constructor
		this.fontSourceProvider = new fontSelectorProviders[ this.fontProvider ]( this.fontsList, this.$container, this.data );

		// If font is selected
		if ( this.$value.val() ) {

			// Set selected value
			this.selectValue( this.$value.val() );

			// If font exists
			if ( this.selected instanceof TypoLab_Font ) {

				// Switch to selected font tab
				if ( this.lastActiveTab !== this.firstLetter( this.selected.getFontFamily() ) ) {
					this.setActiveTab( this.firstLetter( this.selected.getFontFamily() ) );
				}

				// Scroll font into view of list
				if ( this.$fontsList.scrollTop() < this.selected.$el.position().top ) {
					this.$fontsList.scrollTop( this.selected.$el.position().top - ( this.$fontsList.height() / 2 ) + ( this.selected.$el.outerHeight() / 2 ) );
				}

				// Trigger selected
				this.fontSourceProvider.selected();

				// Render preview
				this.fontSourceProvider.preview();
			}
		}

		/**
		 * Events.
		 */

		// Set active tab
		this.$tabsList.on( 'click', ev => {
			ev.preventDefault();
			let tab = $( ev.currentTarget ).data( 'tab' );
			this.setActiveTab( tab );
		} );

		// Select font category
		this.$filterCategories.on( 'change', () => {
			let category = this.$filterCategories.val(),
				args = {
					category: category,
				};

			if ( !category ) {
				args.tab = this.lastActiveTab;
			}

			this.filterFontsListDOM( args );
		} );

		// Filter font by name
		this.$search.on( 'keyup', () => {
			let search = this.$search.val(),
				args = {
					search: search,
				};

			if ( !search ) {
				args.tab = this.lastActiveTab;
			}

			this.filterFontsListDOM( args );
		} );

		// Selecting font
		this.$fontsList.on( 'click', '.font-selector-item', ev => {
			let item = $( ev.currentTarget ).data( 'item' );

			ev.preventDefault();
			this.select( item );
			this.fontSourceProvider.preview();
		} );
	}

	/**
	 * Get font source provider.
	 *
	 * @return {Font_Selector_Provider}
	 */
	getFontSourceProvider() {
		return this.fontSourceProvider;
	}

	/**
	 * Get selected font.
	 *
	 * @return {TypoLab_Font}
	 */
	getSelectedFont() {
		return this.selected;
	}

	/**
	 * Escape regex.
	 *
	 * @param {string} string
	 *
	 * @return {string}
	 */
	escapeRegExp( string ) {
		return string.toString().replace( /[.*+?^${}()|[\]\\]/g, '\\$&' ); // $& means the whole matched string
	}

	/**
	 * Get first letter (uppercase) from string.
	 *
	 * @param {string} string
	 *
	 * @return {string}
	 */
	firstLetter( string ) {
		return string.toString().substring( 0, 1 ).toUpperCase();
	}

	/**
	 * Filter fonts list.
	 *
	 * @param {object} args
	 *
	 * @return {array}
	 */
	filterFontsList( args = { search: '', category: '', tab: '', } ) {
		return this.fontsList.filter( item => {
			let include = true;

			// Tab (filtered by first letter of font name)
			if ( args.tab ) {
				include = item.font_family.toUpperCase().match( new RegExp( `^${this.firstLetter( args.tab )}`, 'i' ) );
			}

			// Category
			if ( include && args.category ) {
				include = item.category === args.category;
			}

			// Search
			if ( include && args.search ) {
				let regex = [
					`(^${this.escapeRegExp( args.search )})`,
					`(\\\s${this.escapeRegExp( args.search )})`,
					`(${this.escapeRegExp( args.search )}(\\\s|$))`,
				];
				include = item.font_family.match( new RegExp( `(${regex.join( '|' )})`, 'i' ) );
			}

			return include;
		} );
	}

	/**
	 * Filter fonts list DOM.
	 *
	 * @param {object} args
	 */
	filterFontsListDOM( args = { search: '', category: '', tab: '', } ) {

		// Remove current active fonts
		this.fontsList.map( this.setDeactiveFontIterator );

		// Set active
		var hasResults = this.filterFontsList( args ).map( this.setActiveFontIterator ).length > 0;

		// If no results show noResults container
		this.$noResults[ hasResults ? 'removeClass' : 'addClass' ]( 'active' );

		// Set scroll position of fonts list container
		this.$fontsList.scrollTop( 0 );
	}

	/**
	 * Render fonts list.
	 */
	renderFontsList() {
		let selectorItemTpl = wp.template( 'font-selector-item' );

		// Clear container
		this.$fontsList.html( '' );

		// Add items
		this.fontsList.map( item => {

			// Item template DOM element
			item.$el = $( selectorItemTpl( {
				title: item.title ? item.title : item.font_family,
			} ) );

			// Assign item object
			item.$el.data( 'item', item );

			// Append list item
			this.$fontsList.append( item.$el );
		} );

		// No results element
		this.$noResults.appendTo( this.$fontsList );
	}

	/**
	 * Set deactive font iterator.
	 *
	 * @param {object} item
	 */
	setDeactiveFontIterator( item ) {
		item.$el.removeClass( 'active' );
	}

	/**
	 * Active font iterator.
	 *
	 * @param {object} item
	 */
	setActiveFontIterator( item ) {
		item.$el.addClass( 'active' );
	}

	/**
	 * Get default tab.
	 *
	 * @return {string}
	 */
	getDefaultTab() {
		let activeTab = this.$container.data( 'active-tab' );

		if ( activeTab ) {
			let $activeTab = this.$tabsList.filter( ( i, el ) => activeTab === $( el ).data( 'tab' ) );

			if ( 0 < $activeTab.length ) {
				return $activeTab.data( 'tab' );
			}
		}
		return this.$tabsList.first().data( 'tab' );
	}

	/**
	 * Set active tab.
	 *
	 * @param {string} tabId
	 */
	setActiveTab( tabId = '' ) {

		// Default tab
		if ( !tabId ) {
			tabId = this.getDefaultTab();
		}

		// No tabs
		if ( 0 === this.$tabsList.length ) {
			tabId = '';
		}

		// Select fonts from the tab
		this.filterFontsListDOM( { tab: tabId } );

		// Set active tab
		this.$tabsList
			.removeClass( 'current' )
			.filter( ( i, el ) => tabId === el.dataset.tab )
			.addClass( 'current' );

		// Last active tab
		this.lastActiveTab = tabId;
	}

	/**
	 * Select item from the list.
	 *
	 * @param {object} selectItem
	 */
	select( selectItem ) {
		if ( 'object' !== typeof selectItem ) {
			return;
		}

		this.fontsList.map( item => item.$el[ item === selectItem ? 'addClass' : 'removeClass' ]( 'current' ) );

		// Select item (font)
		this.fontSourceProvider.select( selectItem );

		// Set selected font
		this.selected = this.fontSourceProvider.getFont();

		// Set input value
		this.$value.val( this.selected[ this.valueProp ] );

		// Trigger change
		this.fontSourceProvider.change();

		// Font select event
		this.trigger( 'font-select', this.getSelectedFont() );
	}

	/**
	 * Select item by value.
	 *
	 * @param {string} value
	 */
	selectValue( value ) {
		for ( let item of this.fontsList ) {
			if ( value === item[ this.valueProp ] ) {
				this.select( item );
				return;
			}
		}
	}
}

/**
 * Callbacks / events.
 */
_.extend( TypoLab_Font_Selector.prototype, Backbone.Events );
