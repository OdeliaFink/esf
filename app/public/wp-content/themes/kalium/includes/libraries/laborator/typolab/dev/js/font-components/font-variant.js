/**
 * Font variant class.
 */
export default class TypoLab_Font_Variant {

	/**
	 * Constructor.
	 *
	 * @param {object} args
	 * @param {string} args.name
	 * @param {string} args.style
	 * @param {string|number} args.weight
	 * @param {string} args.unicodeRange
	 * @param {string} args.display
	 * @param {object} args.data
	 * @param {TypoLab_Font} args.font
	 * @param {string} args.niceName
	 */
	constructor( {
		             name = '',
		             style = 'normal',
		             weight = 'normal',
		             unicodeRange = '',
		             display = 'inherit',
		             data = {},
		             font = null,
	             } = {} ) {

		/**
		 * Variant name.
		 *
		 * @type {string}
		 */
		this.name;

		/**
		 * Style.
		 *
		 * @type {string}
		 */
		this.style;

		/**
		 * Weight.
		 *
		 * @type {string|number}
		 */
		this.weight;

		/**
		 * Display.
		 *
		 * @type {string}
		 */
		this.display;

		/**
		 * Unicode range.
		 *
		 * @type {string}
		 */
		this.unicodeRange;

		/**
		 * Font files (sources).
		 *
		 * @type {object[]}
		 */
		this.fontFiles = {};

		/**
		 * Instance ID.
		 *
		 * @type {string}
		 */
		this.instanceId = `variant-${TypoLab_Font_Variant.instanceCounter ++}`;

		/**
		 * Variant data.
		 *
		 * @type {object}
		 */
		this.data = data;

		/**
		 * Font reference.
		 *
		 * @type {TypoLab_Font}
		 */
		this.font;

		// Set values
		this.setName( name );
		this.setStyle( style );
		this.setWeight( weight );
		this.setDisplay( display );
		this.setUnicodeRange( unicodeRange );
		this.setFont( font );
	}

	/**
	 * Set variant name.
	 *
	 * @param {string} name
	 */
	setName( name ) {
		this.name = name;
	}

	/**
	 * Set style.
	 *
	 * @param {string} style
	 */
	setStyle( style ) {
		this.style = 'italic' === style ? style : 'normal';
	}

	/**
	 * Set weight.
	 *
	 * @param {string|number} weight
	 */
	setWeight( weight ) {
		this.weight = isNaN( + weight ) ? ( _.contains( ['bold', 'bolder', 'lighter'], weight ) ? weight : 'normal' ) : + weight;

		// Treat 400 as normal
		if ( 400 === this.weight ) {
			this.weight = 'normal';
		}
	}

	/**
	 * Set font display option.
	 *
	 * @param {string} display
	 */
	setDisplay( display ) {
		this.display = _.contains( ['inherit', 'auto', 'block', 'fallback', 'optional'], display ) ? display : 'swap';
	}

	/**
	 * Set unicode range.
	 *
	 * @param {string} unicodeRange
	 */
	setUnicodeRange( unicodeRange ) {
		this.unicodeRange = this.formatUnicodeRange( unicodeRange );
	}

	/**
	 * Set font.
	 *
	 * @param {TypoLab_Font} font
	 */
	setFont( font ) {
		this.font = font;
	}

	/**
	 * Get font files.
	 *
	 * @return {object[]}
	 */
	getFontFiles() {
		return this.fontFiles;
	}

	/**
	 * Add font file (source).
	 *
	 * @param {string} type
	 * @param {string} url
	 */
	addFontFile( type, url ) {
		type = type.toLowerCase();

		if ( _.contains( ['woff2', 'woff', 'ttf', 'svg', 'eot'], type ) ) {
			this.fontFiles[ type ] = url;
		}
	}

	/**
	 * Remove font file.
	 *
	 * @param {string} type
	 */
	removeFontFile( type ) {
		type = type.toLowerCase();

		if ( _.contains( ['woff2', 'woff', 'ttf', 'svg', 'eot'], type ) ) {
			delete this.fontFiles[ type ];
		}
	}

	/**
	 * Get instance ID.
	 *
	 * @return {string}
	 */
	getInstanceId() {
		return this.instanceId;
	}

	/**
	 * Check if font is normal weight.
	 *
	 * @return {boolean}
	 */
	isRegular() {
		return 'normal' === this.weight;
	}

	/**
	 * Check if variant is italic.
	 *
	 * @return {boolean}
	 */
	isItalic() {
		return 'italic' === this.style;
	}

	/**
	 * Compare two variants.
	 *
	 * @param {TypoLab_Font_Variant} variant
	 *
	 * @return {boolean}
	 */
	equals( variant ) {
		const props = [
			'name',
			'style',
			'weight',
			'display',
			'unicodeRange',
			'fontFiles',
		];

		// Make its TypoLab_Font_Variant object
		if ( !variant instanceof TypoLab_Font_Variant ) {
			return false;
		}

		// Check props
		for ( const prop of props ) {
			let thisValue = this[ prop ],
				thatValue = variant[ prop ];

			if ( 'object' === typeof thisValue ) {
				for ( let objProp in thisValue ) {
					if ( thisValue[ objProp ] !== thatValue[ objProp ] ) {
						return false;
					}
				}
			} else if ( thisValue !== thatValue ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Format unicode range.
	 *
	 * @param {string} unicodeRange
	 *
	 * @return {string}
	 */
	formatUnicodeRange( unicodeRange ) {
		if ( !unicodeRange || 0 === unicodeRange.trim().length ) {
			return '';
		}

		return unicodeRange.split( ',' ).map( range => 'U+' + range.replace( 'U+', '' ).replace( /\s/g, '' ) ).join( ',' );
	}

	/**
	 * Generate font face.
	 *
	 * @param {string} fontFamilyName
	 *
	 * @return {string|null}
	 */
	generateFontFace( fontFamilyName = '' ) {
		fontFamilyName = fontFamilyName || this.name;

		if ( !fontFamilyName ) {
			return null;
		}

		// Add slashes
		fontFamilyName = fontFamilyName.replace( /\'/g, '\\\'' );

		// Create font face style
		let fontFace = ['@font-face {'];

		fontFace.push( `\tfont-family: '${this.name || fontFamilyName}';` );
		fontFace.push( `\tfont-style: ${this.style};` );
		fontFace.push( `\tfont-weight: ${this.weight};` );
		fontFace.push( `\tfont-display: ${this.display};` );

		// Source
		let fontFiles = this.getFontFiles(),
			formats = {
				'eot': 'embedded-opentype',
				'ttf': 'truetype',
			},
			sources = [];

		for ( const type in fontFiles ) {
			sources.push( `url('${fontFiles[ type ]}') format('${formats[ type ] || type}')` );
		}

		// Add font source
		if ( sources.length ) {
			fontFace.push( `\tsrc: ${sources.join( ', ' )};` );
		}

		// Unicode range (optional)
		if ( this.unicodeRange ) {
			fontFace.push( `\tunicode-range: ${this.unicodeRange};` );
		}

		fontFace.push( '}' );

		return fontFace.join( "\n" );
	}

	/**
	 * Get nice name of variant.
	 *
	 * @return {string}
	 */
	getNicename() {

		// Custom defined nicename
		if ( this.data.niceName ) {
			return this.data.niceName;
		}

		// Generate nice name
		let nicename = [];

		// Set weight name
		if ( 100 === this.weight ) {
			nicename.push( 'Thin' );
		} else if ( 200 === this.weight ) {
			nicename.push( 'Extra Light' );
		} else if ( 300 === this.weight ) {
			nicename.push( 'Light' );
		} else if ( 400 === this.weight || 'normal' === this.weight ) {
			nicename.push( 'Regular' );
		} else if ( 500 === this.weight ) {
			nicename.push( 'Medium' );
		} else if ( 600 === this.weight ) {
			nicename.push( 'Semi Bold' );
		} else if ( 700 === this.weight || 'bold' === this.weight ) {
			nicename.push( 'Bold' );
		} else if ( 800 === this.weight ) {
			nicename.push( 'Extra Bold' );
		} else if ( 900 === this.weight ) {
			nicename.push( 'Black' );
		}

		// Set weight thickness
		if ( !this.isRegular() && this.weight.toString().match( /^[0-9]+$/ ) ) {
			nicename.push( this.weight );
		}

		// Set font style
		if ( this.isItalic() ) {
			if ( this.isRegular() ) {
				nicename = ['Italic'];
			} else {
				nicename.push( 'italic' );
			}
		}

		return nicename.join( ' ' );
	}

	/**
	 * To string value.
	 *
	 * @param {TypoLab_Font} font
	 *
	 * @return {string}
	 */
	toString( font = null ) {

		// Get variant value for font argument
		if ( font ) {
			return font.getVariantValue( this );
		}

		// Get variant value from assigned font reference
		if ( this.font ) {
			return this.font.getVariantValue( this );
		}

		return [this.weight, this.style].join( '-' );
	}

	/**
	 * Export to object for transport.
	 *
	 * @return {object}
	 */
	export() {
		return {
			style: this.style,
			weight: this.weight,
			unicodeRange: this.unicodeRange,
			display: this.display,
			src: this.fontFiles,
		};
	}
}

/**
 * Instance counter.
 */
TypoLab_Font_Variant.instanceCounter = 1;

/**
 * Create variant from Google formatted variant name.
 *
 * @param {string} variantName
 * @param {TypoLab_Font} font
 *
 * @return {TypoLab_Font_Variant}
 */
TypoLab_Font_Variant.createFromGoogleFormat = function ( variantName, font ) {
	let matches = variantName.match( /(?<weight>[0-9]+)(?<italic>italic)?/ ),
		weight = 'normal',
		style = 'normal';

	if ( 'italic' === variantName ) {
		style = 'italic';
	}

	if ( matches ) {
		weight = parseInt( matches.groups.weight, 10 );

		if ( matches.groups.italic ) {
			style = 'italic';
		}
	}

	// Weight of 400 is normal weight
	if ( 400 === weight ) {
		weight = 'normal';
	}

	return new this( { style, weight, font } );
}

/**
 * Create variant from Laborator Font formatted variant name.
 *
 * @param {string} variantName
 * @param {TypoLab_Font} font
 *
 * @return {TypoLab_Font_Variant}
 */
TypoLab_Font_Variant.createFromLaboratorFontFormat = function ( variantName, font ) {
	return this.createFromGoogleFormat( variantName, font );
}

/**
 * Create variant from System Font formatted variant name.
 *
 * @param {string} variantName
 * @param {TypoLab_Font} font
 *
 * @return {TypoLab_Font_Variant}
 */
TypoLab_Font_Variant.createFromSystemFontFormat = function ( variantName, font ) {
	return this.createFromGoogleFormat( variantName, font );
}

/**
 * Create variant from Font Squirrel formatted variant name.
 *
 * @param {object} variantData
 * @param {TypoLab_Font} font
 *
 * @return {TypoLab_Font_Variant}
 */
TypoLab_Font_Variant.createFromFontSquirrelFontData = function ( variantData, font ) {
	let variantName = variantData.filename.replace( /\.[a-z]+$/i, '' ), // Variant identifier
		variantNicename = variantData.style_name.replace( /([a-z])([A-Z])/, '$1 $2' );

	// Different font family name
	if ( variantData.family_name !== variantData._fontFamily ) {
		variantNicename = `${variantData.family_name} - ${variantNicename}`;
	}

	// Variant data
	let data = _.extend( variantData, {
		niceName: variantNicename,
	} );

	// Variant instance
	return new this( { name: variantName, data, font } );
}

/**
 * Create variant from Adobe formatted variant name.
 *
 * @param {string} variantName
 * @param {TypoLab_Font} font
 *
 * @return {TypoLab_Font_Variant}
 */
TypoLab_Font_Variant.createFromAdobeFormat = function ( variantName, font ) {
	let variantData = variantName.split( '' ),
		style = 'i' === variantData[ 0 ] ? 'italic' : 'normal',
		weight = Number( variantData[ 1 ] );

	// Multiply weight number
	weight *= 100;

	return new this( { style, weight, font } );
}
