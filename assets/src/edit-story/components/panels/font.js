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
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { InputGroup, SelectMenu } from '../form';
import { useFont } from '../../app';
import { MIN_FONT_SIZE, MAX_FONT_SIZE } from '../../constants';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';

function FontPanel( { selectedElements, onSetProperties } ) {
	const fontFamily = getCommonValue( selectedElements, 'fontFamily' );
	const fontSize = getCommonValue( selectedElements, 'fontSize' );
	const fontWeight = getCommonValue( selectedElements, 'fontWeight' );
	const fontWeights = getCommonValue( selectedElements, 'fontWeights' );
	const fontStyle = getCommonValue( selectedElements, 'fontStyle' );
	const fontFallback = getCommonValue( selectedElements, 'fontFallback' );

	const { state: { fonts }, actions: { getFontWeight, getFontFallback } } = useFont();
	const [ state, setState ] = useState( { fontFamily, fontStyle, fontSize, fontWeight, fontFallback, fontWeights } );
	useEffect( () => {
		const currentFontWeights = getFontWeight( fontFamily );
		const currentFontFallback = getFontFallback( fontFamily );
		setState( { fontFamily, fontStyle, fontSize, fontWeight, fontWeights: currentFontWeights, fontFallback: currentFontFallback } );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ fontFamily, fontStyle, fontSize, fontWeight, getFontWeight ] );
	const handleSubmit = ( evt ) => {
		onSetProperties( state );
		evt.preventDefault();
	};

	const fontStyles = [
		{ name: __( 'Normal', 'web-stories' ), slug: 'normal', thisValue: 'normal' },
		{ name: __( 'Italic', 'web-stories' ), slug: 'italic', thisValue: 'italic' },
	];

	return (
		<SimplePanel name="font" title={ __( 'Font', 'web-stories' ) } onSubmit={ handleSubmit }>
			{ fonts && <SelectMenu
				label={ __( 'Font family', 'web-stories' ) }
				options={ fonts }
				value={ state.fontFamily }
				isMultiple={ fontFamily === '' }
				onChange={ ( value ) => {
					const currentFontWeights = getFontWeight( value );
					const currentFontFallback = getFontFallback( value );
					const fontWeightsArr = currentFontWeights.map( ( { thisValue } ) => thisValue );
					const newFontWeight = ( fontWeightsArr && fontWeightsArr.includes( state.fontWeight ) ) ? state.fontWeight : 400;
					setState( { ...state, fontFamily: value, fontWeight: parseInt( newFontWeight ), fontWeights: currentFontWeights, fontFallback: currentFontFallback } );
				} }
			/> }
			<SelectMenu
				label={ __( 'Font style', 'web-stories' ) }
				options={ fontStyles }
				isMultiple={ fontStyle === '' }
				value={ state.fontStyle }
				onChange={ ( value ) => setState( { ...state, fontStyle: value } ) }
			/>
			{ state.fontWeights && <SelectMenu
				label={ __( 'Font weight', 'web-stories' ) }
				options={ state.fontWeights }
				value={ state.fontWeight }
				isMultiple={ fontWeight === '' }
				onChange={ ( value ) => setState( { ...state, fontWeight: parseInt( value ) } ) }
			/> }
			<InputGroup
				type="number"
				label={ __( 'Font size', 'web-stories' ) }
				value={ state.fontSize }
				isMultiple={ fontSize === '' }
				postfix={ 'px' }
				min={ MIN_FONT_SIZE }
				max={ MAX_FONT_SIZE }
				onChange={ ( value ) => setState( { ...state, fontSize: parseInt( value ) } ) }
			/>
		</SimplePanel>
	);
}

FontPanel.propTypes = {
	selectedElements: PropTypes.array.isRequired,
	onSetProperties: PropTypes.func.isRequired,
};

export default FontPanel;
