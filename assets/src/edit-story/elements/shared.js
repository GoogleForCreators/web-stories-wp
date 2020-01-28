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
 * External dependencies
 */
import { css } from 'styled-components';

/**
 * Internal dependencies
 */
import getPercentageFromPixels from '../utils/getPercentageFromPixels';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../constants';

export const ElementFillContent = css`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`;

export const ElementWithPosition = css`
	position: absolute;
	z-index: 1;
	left: ${ ( { x } ) => `${ x }px` };
	top: ${ ( { y } ) => `${ y }px` };
`;

export const ElementWithSize = css`
	width: ${ ( { width } ) => `${ width }px` };
	height: ${ ( { height } ) => `${ height }px` };
`;

export const ElementWithRotation = css`
	transform: ${ ( { rotationAngle } ) => `rotate(${ rotationAngle }deg)` };
`;

export const ElementWithBackgroundColor = css`
	background-color: ${ ( { backgroundColor } ) => backgroundColor };
`;

export const ElementWithFontColor = css`
	color: ${ ( { color } ) => color };
`;

export const ElementWithFont = css`
	white-space: pre-wrap;
	font-family: ${ ( { fontFamily } ) => fontFamily };
	font-style: ${ ( { fontStyle } ) => fontStyle };
	font-size: ${ ( { fontSize } ) => fontSize }px;
	font-weight: ${ ( { fontWeight } ) => fontWeight };
`;

export const ElementWithStyle = css`
	padding: ${ ( { padding } ) => padding ? padding : '0' }%;
	line-height: ${ ( { lineHeight } ) => lineHeight };
	letter-spacing: ${ ( { letterSpacing } ) => letterSpacing ? letterSpacing + 'em' : null };
	text-align: ${ ( { textAlign } ) => textAlign };
`;

/**
 * Returns common attributes used for all elements when saving to DB.
 */
export const getCommonAttributes = ( ( { width, height, x, y, rotationAngle } ) => {
	return {
		position: 'absolute',
		left: getPercentageFromPixels( x, 'x' ) + '%',
		top: getPercentageFromPixels( y, 'y' ) + '%',
		transform: rotationAngle ? `rotate(${ rotationAngle }deg)` : null,
		width: getPercentageFromPixels( width, 'x' ) + '%',
		height: getPercentageFromPixels( height, 'y' ) + '%',
	};
} );

export function getBox( { x, y, width, height, rotationAngle, isFill, isBackground } ) {
	const displayFull = isFill || isBackground;
	return {
		x: displayFull ? 0 : x,
		y: displayFull ? 0 : y,
		width: displayFull ? PAGE_WIDTH : width,
		height: displayFull ? PAGE_HEIGHT : height,
		rotationAngle: displayFull ? 0 : rotationAngle,
	};
}
