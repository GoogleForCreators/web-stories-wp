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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { getCommonAttributes } from '../utils/getCommonAttributes';
import { generateFontFamily, getResponsiveFontSize } from './util';

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 */
function TextSave( {
	id,
	content,
	color,
	backgroundColor,
	width,
	height,
	x,
	y,
	fontFamily,
	fontFallback,
	fontSize,
	fontWeight,
	fontStyle,
	letterSpacing,
	lineHeight,
	padding,
	rotationAngle,
	textAlign,
} ) {
	const style = {
		...getCommonAttributes( { width, height, x, y, rotationAngle } ),
		fontSize: getResponsiveFontSize( fontSize ),
		fontStyle: fontStyle ? fontStyle : null,
		fontFamily: generateFontFamily( fontFamily, fontFallback ),
		fontWeight: fontWeight ? fontWeight : null,
		background: backgroundColor,
		margin: 0,
		color,
		lineHeight,
		letterSpacing: letterSpacing ? letterSpacing + 'em' : null,
		padding: padding ? padding + '%' : null,
		textAlign: textAlign ? textAlign : null,
	};

	return (
		<p id={ 'el-' + id } style={ { ...style } } dangerouslySetInnerHTML={ { __html: content } } />
	);
}

TextSave.propTypes = {
	id: PropTypes.string.isRequired,
	content: PropTypes.string,
	color: PropTypes.string,
	backgroundColor: PropTypes.string,
	fontFamily: PropTypes.string,
	fontFallback: PropTypes.array,
	fontSize: PropTypes.number,
	fontWeight: PropTypes.number,
	fontStyle: PropTypes.string,
	letterSpacing: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.number,
	] ),
	lineHeight: PropTypes.number,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	padding: PropTypes.number,
	rotationAngle: PropTypes.number.isRequired,
	textAlign: PropTypes.string,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
};

export default TextSave;
