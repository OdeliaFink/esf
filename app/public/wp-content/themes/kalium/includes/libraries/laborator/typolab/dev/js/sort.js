/**
 * Sort function for variants (ascending order).
 *
 * @param {TypoLab_Variant} a
 * @param {TypoLab_Variant} b
 */
export function SORT_VARIANTS_ASC( a, b ) {
	let aWeight = 'normal' === a.weight ? 400 : + a.weight,
		bWeight = 'normal' === b.weight ? 400 : + b.weight;

	if ( a.isItalic() ) {
		aWeight += 1;
	}

	if ( b.isItalic() ) {
		bWeight += 1;
	}

	return aWeight - bWeight;
};

/**
 * Sort function for variants (descending order).
 *
 * @param {TypoLab_Variant} a
 * @param {TypoLab_Variant} b
 */
export function SORT_VARIANTS_DESC( a, b ) {
	return SORT_VARIANTS_ASC( b, a );
};
