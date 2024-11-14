/**
 * Preview text.
 *
 * @return {string}
 */
export function previewText() {
	return typolab_settings.previewText || 'Almost before we knew it, we had left the ground.';
}

/**
 * Encode spaces.
 *
 * @param {string} string
 *
 * @return {string}
 */
export function urlEncodeSpaces( string ) {
	return string.replace( /\s+/g, '+' );
}

/**
 * Build stylesheet API URL.
 *
 * @param {object=} args
 *
 * @return {string}
 */
export function buildGoogleFontStylesheetURL( args ) {
	args = _.defaults( args, {
		family: '',
		variants: [],
		display: 'swap',
		text: null,
	} );

	// Vars
	let defaultWeight = 400,
		hasWght = false,
		ital = [],
		wght = [],
		italTupleMapper = tuple => {
			if ( 1 === ital.length && defaultWeight === ital[ 0 ] ) {
				if ( wght.length > 1 || ( 1 === wght.length && defaultWeight !== wght[ 0 ] ) ) {
					return [1, tuple].join( ',' );
				}

				return 1;
			}

			return [1, tuple].join( ',' );
		},
		wghtTupleMapper = tuple => {
			if ( ital.length && wght.length ) {
				if ( 1 === wght.length && defaultWeight === wght[ 0 ] ) {
					return 0;
				}
				return [0, tuple].join( ',' );
			}

			return tuple;
		};

	// URL builder
	const url = [
		'family=',
		urlEncodeSpaces( args.family ),
	];

	// Parse font variants and populate axis
	args.variants.forEach( variant => {
		if ( !variant.isRegular() ) {
			hasWght = true;
		}

		if ( !variant.isRegular() ) {
			if ( variant.isItalic() ) {
				ital.push( variant.weight );
			} else {
				wght.push( variant.weight );
			}
		} else if ( variant.isItalic() ) {
			ital.push( 400 );
		} else {
			wght.push( 400 );
		}
	} );

	// Sorted unique axis entries
	ital = _.uniq( ital ).sort();
	wght = _.uniq( wght ).sort();

	// Axis tag list
	if ( ( wght.length > 1 || ital.length > 0 ) || ( 1 === wght.length && 400 !== wght[ 0 ] ) ) {
		url.push( ':' );

		// Axis tag: ital
		if ( ital.length > 0 ) {
			url.push( 'ital' );
		}

		// Axis tag: wght
		if ( wght.length > 0 && ( wght.length > 1 || 400 !== wght[ 0 ] ) || hasWght ) {
			url.push( ital.length ? ',' : '' );
			url.push( 'wght' );
		}

		// Variants
		url.push( '@' );
		url.push( wght.map( wghtTupleMapper ).join( ';' ) );
		url.push( wght.length && ital.length ? ';' : '' );
		url.push( ital.map( italTupleMapper ).join( ';' ) );
	}

	// Display
	if ( args.display ) {
		url.push( '&' );
		url.push( `display=${args.display}` );
	}

	// Text
	if ( args.text ) {
		url.push( '&' );
		url.push( `text=${urlEncodeSpaces( args.text )}` );
	}

	// API
	url.unshift( 'https://fonts.googleapis.com/css2?' );

	return url.join( '' );
}

/**
 * Update selected variants in the preview list.
 *
 * @param {TypoLab_Font} font
 * @param {jQuery} $variantEntries
 */
export function updateSelectedVariants( font, $variantEntries ) {
	let selectedVariants = [];

	// Loop through variants
	font.getAvailableVariants().forEach( ( variant, i ) => {
		let $variantEntry = $variantEntries.eq( i ),
			$checkbox = $variantEntry.find( 'input[type="checkbox"]' ),
			isChecked = $checkbox.is( ':checked' );

		// Highlight container
		$variantEntry[ isChecked ? 'addClass' : 'removeClass' ]( 'is-checked' );

		// Push to selected variants
		if ( isChecked ) {
			selectedVariants.push( variant );
		}
	} );

	// Update variants
	font.setVariants( selectedVariants );
}

/**
 * Font styles options.
 *
 * @type {object[]} fontStylesOptions
 */
export const fontStylesOptions = [
	{
		value: 'normal',
		title: 'Normal',
	},
	{
		value: 'italic',
		title: 'Italic',
	}
];

/**
 * Font weight options.
 *
 * @type {object[]} fontWeightOptions
 */
export const fontWeightOptions = [
	{
		value: '100',
		title: 'Thin (100)',
	},
	{
		value: '200',
		title: 'Extra Light (200)',
	},
	{
		value: '300',
		title: 'Light (300)',
	},
	{
		value: 'normal',
		title: 'Normal (400)',
	},
	{
		value: '500',
		title: 'Medium (500)',
	},
	{
		value: '600',
		title: 'Semi Bold (600)',
	},
	{
		value: 'bold',
		title: 'Bold (700)',
	},
	{
		value: '800',
		title: 'Extra Bold (800)',
	},
	{
		value: '900',
		title: 'Black (900)',
	},
];

/**
 * Font display options.
 *
 * @type {object[]} fontDisplayOptions
 */
export const fontDisplayOptions = [
	{
		value: 'inherit',
		title: 'Inherit',
	},
	{
		value: 'auto',
		title: 'Auto',
	},
	{
		value: 'swap',
		title: 'Swap',
	},
	{
		value: 'block',
		title: 'Block',
	},
	{
		value: 'fallback',
		title: 'Fallback',
	},
	{
		value: 'optional',
		title: 'Optional',
	}
];

/**
 * Font size units.
 *
 * @type {object}
 */
export const fontSizeUnits = typolab_settings.units;

/**
 * Line height units.
 *
 * @type {object}
 */
export const lineHeightUnits = {
	...fontSizeUnits,
};

/**
 * Letter spacing units.
 *
 * @type {object}
 */
export const letterSpacingUnits = {
	...fontSizeUnits,
};

/**
 * Default unit.
 *
 * @type {string}
 */
export const defaultUnit = typolab_settings.defaultUnit;
