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
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Panel, Title, InputGroup, getCommonValue, SelectMenu } from './shared';

function StylePanel( { selectedElements, onSetProperties } ) {
	const textAlign = getCommonValue( selectedElements, 'textAlign' );
	const letterSpacing = getCommonValue( selectedElements, 'letterSpacing' );
	const lineHeight = getCommonValue( selectedElements, 'lineHeight' );
	const padding = getCommonValue( selectedElements, 'padding' );
	const [ state, setState ] = useState( { textAlign, letterSpacing, lineHeight, padding } );
	useEffect( () => {
		setState( { textAlign, letterSpacing, lineHeight, padding } );
	}, [ textAlign, letterSpacing, lineHeight, padding ] );
	const handleSubmit = ( evt ) => {
		onSetProperties( state );
		evt.preventDefault();
	};

	const alignmentOptions = [
		{ name: __( 'Default', 'web-stories' ), slug: '', thisValue: '' },
		{ name: __( 'Left', 'web-stories' ), slug: 'left', thisValue: 'left' },
		{ name: __( 'Right', 'web-stories' ), slug: 'right', thisValue: 'right' },
		{ name: __( 'Center', 'web-stories' ), slug: 'center', thisValue: 'center' },
		{ name: __( 'Justify', 'web-stories' ), slug: 'justify', thisValue: 'justify' },
	];

	return (
		<Panel onSubmit={ handleSubmit }>
			<Title>
				{ __( 'Style', 'web-stories' ) }
			</Title>
			<SelectMenu
				label={ __( 'Alignment', 'web-stories' ) }
				options={ alignmentOptions }
				isMultiple={ '' === textAlign }
				value={ state.textAlign }
				onChange={ ( value ) => setState( { ...state, textAlign: value } ) }
			/>
			<InputGroup
				label={ __( 'Line height', 'web-stories' ) }
				value={ state.lineHeight }
				isMultiple={ '' === lineHeight }
				onChange={ ( value ) => setState( { ...state, lineHeight: isNaN( value ) ? '' : parseFloat( value ) } ) }
				step="0.1"
			/>
			<InputGroup
				label={ __( 'Letter-spacing', 'web-stories' ) }
				value={ state.letterSpacing }
				isMultiple={ '' === letterSpacing }
				onChange={ ( value ) => setState( { ...state, letterSpacing: isNaN( value ) ? '' : value } ) }
				postfix={ _x( 'em', 'em, the measurement of size', 'web-stories' ) }
				step="0.1"
			/>
			<InputGroup
				label={ __( 'Padding', 'web-stories' ) }
				value={ state.padding }
				isMultiple={ '' === padding }
				onChange={ ( value ) => setState( { ...state, padding: isNaN( value ) ? '' : value } ) }
				postfix={ _x( '%', 'Percentage', 'web-stories' ) }
			/>
		</Panel>
	);
}

StylePanel.propTypes = {
	selectedElements: PropTypes.array.isRequired,
	onSetProperties: PropTypes.func.isRequired,
};

export default StylePanel;
