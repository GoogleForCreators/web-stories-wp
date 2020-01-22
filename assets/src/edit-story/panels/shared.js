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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const Panel = styled.form`
	display: flex;
	flex-direction: column;
`;

export const Title = styled.h2`
	color: ${ ( { theme } ) => theme.colors.bg.v2 };
	font-size: 13px;
	line-height: 19px;
`;

const Label = styled.span`
	color: ${ ( { theme } ) => theme.colors.mg.v1 };
	font-size: 11px;
	line-height: 16px;
	width: 80px;
`;

const Input = styled.input`
	color: ${ ( { theme } ) => theme.colors.mg.v1 };
	border: 1px solid;
	border-radius: 4px;
	font-size: 11px;
	line-height: 16px;
	width: 100px;
`;

const Group = styled.label`
	color: ${ ( { theme } ) => theme.colors.mg.v1 };
	display: flex;
	align-items: center;
	margin-bottom: 5px;
	opacity: ${ ( { disabled } ) => disabled ? 0.7 : 1 };
`;

const Select = styled.select`
	width: 100px;
`;

export const ActionButton = styled.button`
	color: ${ ( { theme } ) => theme.colors.mg.v1 };
	font-size: 11px;
`;

function InputGroup( { type, label, value, isMultiple, onChange, postfix, disabled, min, max, step } ) {
	const placeholder = isMultiple ? '( multiple )' : '';
	const isCheckbox = type === 'checkbox';
	return (
		<Group disabled={ disabled }>
			<Label>
				{ label }
			</Label>
			<Input
				type={ type || 'number' }
				disabled={ disabled }
				onChange={ ( evt ) => onChange( isCheckbox ? evt.target.checked : evt.target.value, evt ) }
				onBlur={ ( evt ) => evt.target.form.dispatchEvent( new window.Event( 'submit' ) ) }
				placeholder={ placeholder }
				value={ isCheckbox ? '' : value }
				checked={ isCheckbox ? value : null }
				min={ min ? min : null }
				max={ max ? max : null }
				step={ step ? step : '1' }
			/>
			{ postfix }
		</Group>
	);
}

InputGroup.propTypes = {
	type: PropTypes.string,
	label: PropTypes.string.isRequired,
	value: PropTypes.any.isRequired,
	isMultiple: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
	postfix: PropTypes.string,
	disabled: PropTypes.bool,
	min: PropTypes.any,
	max: PropTypes.any,
	step: PropTypes.string,
};

InputGroup.defaultProps = {
	type: 'number',
	postfix: '',
	disabled: false,
	min: null,
	max: null,
};

function SelectMenu( { label, options, value, isMultiple, onChange, postfix, disabled } ) {
	return (
		<Group disabled={ disabled }>
			<Label>
				{ label }
			</Label>
			<Select
				disabled={ disabled }
				value={ value }
				onChange={ ( evt ) => onChange( evt.target.value, evt ) }
				onBlur={ ( evt ) => evt.target.form.dispatchEvent( new window.Event( 'submit' ) ) }
			>
				{ isMultiple ? ( <option dangerouslySetInnerHTML={ { __html: __( '( multiple )', 'web-stories' ) } } /> ) :
					options && options.map( ( { name, slug, thisValue } ) => (
						<option key={ slug } value={ thisValue } dangerouslySetInnerHTML={ { __html: name } } />
					) ) }
			</Select>
			{ postfix }
		</Group>
	);
}

SelectMenu.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.any.isRequired,
	isMultiple: PropTypes.bool,
	options: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
	postfix: PropTypes.string,
	disabled: PropTypes.bool,
};

SelectMenu.defaultProps = {
	postfix: '',
	disabled: false,
	isMultiple: false,
};

function getCommonValue( list, property ) {
	const first = list[ 0 ][ property ];
	const allMatch = list.every( ( el ) => el[ property ] === first );
	return allMatch ? first : '';
}

export {
	InputGroup,
	getCommonValue,
	SelectMenu,
};

