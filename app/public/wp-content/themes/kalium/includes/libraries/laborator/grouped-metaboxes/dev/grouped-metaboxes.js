var kaliumGroupedMetaboxes = {};

/**
 * Grouped Metaboxes
 */
( function ( $, window, groupedMetaboxesInstance ) {
	"use strict";

	$( document ).ready( function () {

		// Early exit if ACF is not present
		if ( 'undefined' === typeof acf ) {
			return;
		}

		/**
		 * Global functions
		 */
		$.extend( groupedMetaboxesInstance, {

			// Set loading state
			setLoading: function ( trueState ) {
				var $metabox = $( '#kalium-acfpro-grouped-metaboxes' );
				$metabox[ trueState ? 'addClass' : 'removeClass' ]( 'is-loading' );
			},

			// Get cache id
			cacheId: function () {
				var cacheId = 'kalium_acfpro_gm_tab_' + acf.data.post_id;
				return cacheId;
			},

			// Set active tab
			setActiveTab: function ( tab ) {
				if ( 'object' == typeof store && store.enabled ) {
					store.set( groupedMetaboxesInstance.cacheId(), { activeTab: tab } );
				}
			},

			// Get active tab
			getActiveTab: function () {
				if ( 'object' == typeof store && store.enabled ) {
					var cacheData = store.get( groupedMetaboxesInstance.cacheId() );

					if ( cacheData && 'activeTab' in cacheData ) {
						return cacheData.activeTab;
					}
				}
				return null;
			}
		} );

		/**
		 * Build tabs and inner API for ACF 5.7.10 or newer
		 */
		var Laborator_Grouped_Tabs = function () {
			if ( 'undefined' !== typeof acf ) {
				this.init();
			}
		};

		Laborator_Grouped_Tabs.prototype = {

			// Constructor
			constructor: Laborator_Grouped_Tabs.prototype.constructor,

			/**
			 * Initialize.
			 */
			init: function () {
				// Self
				var self = this;

				// Class prefix
				var classPrefix = 'kalium-acfpro-grouped-metaboxes';

				// Grouped metaboxes
				this.groupedMetaboxes = _k.groupedMetaboxes;

				// Assinged content tabs
				this.assignedContentTabs = [];

				// Current tab
				this.currentTab = '';

				// Tabs list
				this.$tabs = $( '.' + classPrefix + '-tabs' );

				// Tabs body
				this.$body = $( '.' + classPrefix + '-body' );

				// Container
				this.$container = $( '.' + classPrefix + '-container' );

				// Build tabs list
				this.buildTabsList();

				// Assign content tabs
				this.assignContentTabs();

				// Check visibles
				this.toggleVisibleTabs();

				// Active tab
				this.setActiveTab();

				// Set as loaded
				this.$container.addClass( 'loaded' );

				// Events
				acf.addAction( 'check_screen_complete', function ( response, ajaxData ) {
					self.assignContentTabs();
					self.toggleVisibleTabs();
					self.setActiveTab();
				} );
			},

			/**
			 * Get postboxes filtered by Grouped Metaboxes.
			 */
			getPostboxes: function () {
				var postboxes = [],
					allowedGroupKeys = [];

				for ( var groupKey in this.groupedMetaboxes ) {
					allowedGroupKeys.push( groupKey );
				}

				$.each( acf.getPostboxes(), function ( i, postbox ) {
					var key = postbox.data.key;

					if ( - 1 !== $.inArray( key, allowedGroupKeys ) ) {
						postboxes.push( postbox );
					}
				} );

				return postboxes;
			},

			/**
			 * Build tabs list.
			 */
			buildTabsList: function () {
				var self = this;

				$.each( this.groupedMetaboxes, function ( id, metabox ) {
					var $tab = $( '<li><a href="#"></a></li>' ),
						title = metabox.title,
						icon = metabox.icon;

					// Tab id
					$tab.attr( 'data-group-key', id );

					// Tab link
					var $a = $tab.find( 'a' );

					// Set tab title and href for tab link
					title = title.replace( /\s\(Portfolio Type.*?\)/i, '' );

					$a.html( title );

					// Icon
					if ( icon ) {
						$a.prepend( '<i class="' + icon + '"></i>' );
					}

					self.$tabs.append( $tab );

					// Events
					$a.on( 'click', function ( ev ) {
						ev.preventDefault();
						self.setActiveTab( id, true );
					} );
				} );
			},

			/**
			 * Assign content tabs
			 */
			assignContentTabs: function () {
				var self = this;

				$.each( self.getPostboxes(), function ( i, postbox ) {
					var id = postbox.data.id,
						$postbox = $( '#' + id );

					// Check if current postbox exists in Content Tabs container
					if ( - 1 === $.inArray( self.assignedContentTabs, id ) ) {
						var $tabContent = $( '<div class="tab-entry"></div>' );

						$tabContent.appendTo( self.$body );
						$tabContent.append( postbox.$el );

						self.assignedContentTabs.push( id );
					}
				} );
			},

			/**
			 * Toggle visible tabs
			 */
			toggleVisibleTabs: function () {
				var self = this;

				$.each( self.getPostboxes(), function ( i, postbox ) {
					var isVisible = !postbox.isVisible(),
						tab = self.getTab( postbox );

					if ( tab ) {
						tab.$el[ isVisible ? 'addClass' : 'removeClass' ]( 'visible' );
					}
				} );

				this.maintainHeight();
			},

			/**
			 * Maintain height
			 */
			maintainHeight: function () {
				this.$body.css( 'min-height', this.$tabs.outerHeight() );
			},

			/**
			 * Get tab by postbox object
			 */
			getTab: function ( postbox ) {
				var self = this,
					found = null;

				$.each( this.groupedMetaboxes, function ( id, metabox ) {
					if ( id === postbox.data.key ) {
						found = metabox;

						found.id = id;
						found.$el = self.$tabs.find( '[data-group-key="' + id + '"]' );
						return false;
					}
				} );

				return found;
			},

			/**
			 * Get active tab id
			 */
			getActiveTab: function () {
				var self = this,
					activeTab = null;

				// First visible tab
				$.each( self.getPostboxes(), function ( i, postbox ) {
					if ( !postbox.isVisible() ) {
						activeTab = postbox.data.key;
						return false;
					}
				} );

				// Check from current set of active tab
				$.each( self.getPostboxes(), function ( i, postbox ) {
					if ( groupedMetaboxesInstance.getActiveTab() === postbox.data.key ) {
						activeTab = postbox.data.key;
						return false;
					}
				} );

				return activeTab;
			},

			/**
			 * Set active tab
			 */
			setActiveTab: function ( id, storeInSession ) {
				if ( !id ) {
					id = this.currentTab ? this.currentTab : this.getActiveTab();
				}

				var postbox = acf.getPostbox( 'acf-' + id );

				if ( postbox ) {
					var tab = this.getTab( postbox );

					// Remove active class
					tab.$el.siblings().removeClass( 'active' );

					// Set active class for current tab
					tab.$el.addClass( 'active' );

					// Tab entry
					var $tabEntry = postbox.$el.parent(),
						$tabEntries = $tabEntry.siblings();

					$tabEntries.removeClass( 'active' );
					$tabEntry.addClass( 'active' );

					this.currentTab = id;

					if ( storeInSession ) {
						groupedMetaboxesInstance.setActiveTab( id );
					}

					this.maintainHeight();
				}
			},
		};

		// Init grouped metaboxes
		new Laborator_Grouped_Tabs();

	} );

} )( jQuery, window, kaliumGroupedMetaboxes );

/**
 * Portfolio Item Type Field
 */
( function ( $, window ) {
	"use strict";

	$( document ).ready( function () {
		// Early exit if ACF is not present
		if ( 'undefined' === typeof acf ) {
			return;
		}

		// Setup Portfolio Item Type Field
		var setupPortfolioItemTypeField = function ( $el ) {
			var classPrefix = 'kalium-acfpro-portfolio-item-type',
				choiceImages = {
					'type-1': 'portfolio-item-type-1.png',
					'type-2': 'portfolio-item-type-2.png',
					'type-3': 'portfolio-item-type-3.png',
					'type-4': 'portfolio-item-type-4.png',
					'type-5': 'portfolio-item-type-5.png',
					'type-6': 'portfolio-item-type-6.png',
					'type-7': 'portfolio-item-type-7.png',
				}

			// Set choice images full path
			for ( var i in choiceImages ) {
				choiceImages[ i ] = _k.kaliumAssetsDir + 'admin/images/portfolio/' + choiceImages[ i ];
			}

			// Create select fields
			$el.addClass( classPrefix );

			// Input container and select field
			var $input = $el.find( '.acf-input' ),
				$select = $input.find( 'select' ),
				isEditing = window.location.toString().match( /action=edit/ ),
				currentPortfolioItemType = [$select.val(), $select.find( 'option:selected' ).html()],
				current = $select.val();

			// Images select wrapper
			var $wrapper = $( '<div class="' + classPrefix + '-images"><div class="loader"></div></div>' );

			// Insert images select wrapper before ACF input
			$input.before( $wrapper );

			// Create Options
			$select.find( 'option' ).each( function ( i, option ) {
				var $option = $( option ),
					value = $option.val(),
					title = $option.html(),
					$wrappedOption = $( '<a href="#" class="' + classPrefix + '-option" data-value="' + value + '"><span><img src="' + choiceImages[ value ] + '" /></span><strong>' + title + '</strong></a>' );

				// Make it visible when loaded
				$wrappedOption.find( 'img' ).on( 'load', function () {
					$( this ).addClass( 'loaded' );
				} );

				// Append option
				$wrapper.append( $wrappedOption );

				// Click event for the option
				$wrappedOption.on( 'click', function ( ev ) {
					ev.preventDefault();
					$option.prop( 'selected', true ).attr( 'selected', true );
					$select.trigger( 'change' );
				} );
			} );

			// Create warning container
			var $warning = $( '<div class="' + classPrefix + '-warning"></div>' );

			if ( isEditing ) {
				$warning.append( '<strong>Note:</strong> You are currently using <strong>' + currentPortfolioItemType[ 1 ] + '</strong> type. If you change this portfolio type you may lose/overwrite some of the current settings.' );
				$wrapper.after( $warning );
			}

			// Check function
			var check = function ( force ) {
				var value = $select.val();

				// Current item
				if ( !force && current == value ) {
					return;
				}

				$wrapper.find( '.' + classPrefix + '-option' ).removeClass( 'active' );
				$wrapper.find( '.' + classPrefix + '-option[data-value="' + value + '"]' ).addClass( 'active' );

				// Set current
				current = value;

				// Set screen data
				acf.screen.data.item_type = value;
				acf.screen.check();

				$wrapper.addClass( 'is-loading' );
				kaliumGroupedMetaboxes.setLoading( true );

				// Show warning when item type is changes
				if ( value != currentPortfolioItemType[ 0 ] ) {
					$warning.slideDown( 300 );
				} else {
					$warning.slideUp( 300 );
				}
			}

			// Assign change event
			$select.on( 'change', check );

			// Set current item
			$wrapper.find( '.' + classPrefix + '-option[data-value="' + $select.val() + '"]' ).addClass( 'active' );

			// Monitor requests to remove loading state of select field
			acf.addAction( 'check_screen_complete', function ( response, ajaxData ) {
				if ( 'item_type' in ajaxData ) {
					$wrapper.removeClass( 'is-loading' );
					kaliumGroupedMetaboxes.setLoading( false );
				}
			}, 1 );

			// When adding new post
			if ( 'post-new-php' == adminpage ) {
				check( true );
			}
		}

		// Portfolio Item Type – select field replacement
		var portfolioItemType = acf.getFields( {
			name: 'item_type'
		} );

		if ( portfolioItemType.length ) {
			$.each( portfolioItemType, function ( i, itemType ) {
				var $el = itemType.$el;

				setupPortfolioItemTypeField( $el );
			} );
		}
	} );

} )( jQuery, window );

