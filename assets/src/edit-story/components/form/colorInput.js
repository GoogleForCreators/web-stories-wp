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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { toState } from 'react-color/lib/helpers';

/**
 * WordPress dependencies
 */
import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorPicker from '../colorPicker';
import Group from './group';

const Preview = styled.button`
	width: 18px;
	height: 18px;
	padding: 0;
	background: ${ ( { value } ) => value };
	border: 1px solid #d3d4d4;
`;

const Picker = styled( ColorPicker )`
	position: absolute;
	top: 18px;
`;

const Wrap = styled.div`
	position: relative;
`;

const VisuallyHidden = styled.span`
	border: 0;
	clip: rect(1px, 1px, 1px, 1px);
	clip-path: inset(50%);
	height: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	width: 1px;
	word-wrap: normal !important;

	&:focus {
		background-color: $light-gray-500;
		clip: auto !important;
		clip-path: none;
		color: #444;
		display: block;
		font-size: 1em;
		height: auto;
		left: 5px;
		line-height: normal;
		padding: 15px 23px 14px;
		text-decoration: none;
		top: 5px;
		width: auto;
		z-index: 100000;
	}
`;

function ColorInput( { label, value, disabled, onChange } ) {
	const [ isOpen, setIsOpen ] = useState( false );

	return (
		<Group disabled={ disabled } onClick={ ( e ) => e.preventDefault() }>
			<VisuallyHidden>
				{ label }
			</VisuallyHidden>
			<Wrap>
				<Preview
					value={ toState( value ).hex }
					onClick={ () => setIsOpen( ! isOpen ) }
				/>
				{ toState( value ).hex }
				{ isOpen && (
					<Picker
						color={ value }
						onChange={ onChange }
						onClose={ () => setIsOpen( false ) }
					/>
				) }
			</Wrap>
		</Group>
	);
}

ColorInput.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.any.isRequired,
	onChange: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
};

ColorInput.defaultProps = {
	type: 'number',
	postfix: '',
	disabled: false,
	isMultiple: false,
};

export default ColorInput;
