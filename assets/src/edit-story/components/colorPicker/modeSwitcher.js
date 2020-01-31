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

const ModesList = styled.ul`
	padding: 0;
	margin: 0;
	display: flex;
	list-style: none;
	float: left;
`;

const ModeListItem = styled.li`
	width: 20px;
	height: 20px;

	& + li {
		margin-left: 22px;
	}
`;

const Circle = styled.button`
	background: none;
	border: none;
	padding: 0;
	border-radius: 100%;
	width: 100%;
	height: 100%;
`;

const SolidColor = styled( Circle )`
	background: ${ ( { color } ) => color ? color : '#808080' };
`;

const LinearGradient = styled( Circle )`
	border: 1px solid #808080;
	background: linear-gradient(180deg, #fff 10.94%, ${ ( { color } ) => color } 100%);
`;

const RadialGradient = styled( Circle )`
	border: 1px solid #808080;
	background: radial-gradient(50% 50% at 50% 50%, #fff 0%, ${ ( { color } ) => color } 100%);
`;

function Mode( { type, value, onClick } ) {
	switch ( type ) {
		case 'solid':
			return <SolidColor color={ value } onClick={ onClick } aria-label={ __( 'Solid color', 'web-stories' ) } />;

		case 'linear':
			return <LinearGradient color={ value || '#808080' } onClick={ onClick } aria-label={ __( 'Linear gradient', 'web-stories' ) } />;

		case 'radial':
			return <RadialGradient color={ value || '#3A3A3A' } onClick={ onClick } aria-label={ __( 'Radial gradient', 'web-stories' ) } />;

		default:
			return null;
	}
}

Mode.propTypes = {
	type: PropTypes.string,
	value: PropTypes.string,
	onClick: PropTypes.func,
};

function ModeSwitcher( { hex, currentMode, onChange } ) {
	const supportedModes = [ 'solid', 'linear', 'radial' ];

	return (
		<ModesList>
			{ supportedModes.map( ( mode ) => {
				return (
					<ModeListItem key={ mode } >
						<Mode
							type={ mode }
							value={ mode === currentMode ? hex : null }
							onClick={ () => onChange( mode ) }
						/>
					</ModeListItem>
				);
			} ) }
		</ModesList>
	);
}

ModeSwitcher.propTypes = {
	hex: PropTypes.string,
	currentMode: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default ModeSwitcher;
