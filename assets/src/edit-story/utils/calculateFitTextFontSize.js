/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import { MIN_FONT_SIZE, MAX_FONT_SIZE } from '../constants';

/**
 * Calculates font size that fits to the text element based on the element's size.
 * Replicates amp-fit-text's logic in the editor.
 *
 * @see https://github.com/ampproject/amphtml/blob/e7a1b3ff97645ec0ec482192205134bd0735943c/extensions/amp-fit-text/0.1/amp-fit-text.js
 *
 * @param {Object} measurer       HTML element.
 * @param {number} expectedHeight Maximum height.
 * @param {number} expectedWidth  Maximum width.
 *
 * @return {number|boolean} Calculated font size. False if calculation wasn't possible.
 */
function calculateFitTextFontSize( measurer, expectedHeight, expectedWidth ) {
	let maxFontSize = MAX_FONT_SIZE;
	let minFontSize = MIN_FONT_SIZE;

	// Return false if calculation is not possible due to width and height missing, e.g. in disabled preview.
	if ( ! measurer.offsetHeight || ! measurer.offsetWidth ) {
		return false;
	}

	const setStyle = ( style ) => {
		const rules = Object.entries( style );
		for ( const [ k, value ] of rules ) {
			measurer.style[ k ] = value;
		}
	};

	const { display, height, width, position } = measurer.style;
	const originalStyle = {
		display,
		height,
		width,
		position,
	};

	const measuringStyle = {
		display: 'inline-block',
		height: 'initial',
		width: 'initial',
		position: 'absolute',
	};

	// Add necessary styles for measuring:
	setStyle( measuringStyle );

	// Add 1px extra room for font size for preventing flickering.
	// @todo Is there a better way?
	expectedWidth++;
	maxFontSize++;

	// Binomial search for the best font size.
	while ( maxFontSize - minFontSize > 1 ) {
		const mid = Math.floor( ( minFontSize + maxFontSize ) / 2 );
		measurer.style.fontSize = mid + 'px';
		const currentHeight = measurer.offsetHeight;
		const currentWidth = measurer.offsetWidth;
		if ( currentHeight > expectedHeight || currentWidth > expectedWidth ) {
			maxFontSize = mid;
		} else {
			minFontSize = mid;
		}
	}

	// Let's restore the correct font size, too.
	measurer.style.fontSize = minFontSize + 'px';
	// Restore style values.
	setStyle( originalStyle );

	return minFontSize;
}

export default calculateFitTextFontSize;
