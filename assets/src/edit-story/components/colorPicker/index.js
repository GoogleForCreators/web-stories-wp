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
import styled from 'styled-components';
import { CustomPicker } from 'react-color';
import { Saturation, Hue, Alpha } from 'react-color/lib/components/common';

/**
 * WordPress dependencies
 */
import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Close, Eyedropper } from '../button';
import Pointer, { PointerWithoutOffset } from './pointer';
import EditableHexPreview from './editableHexPreview';
import ModeSwitcher from './modeSwitcher';

const Container = styled.div`
	border-radius: 4px;
	background: ${ ( { theme } ) => theme.colors.bg.v7 };
	color: ${ ( { theme } ) => theme.colors.fg.v1 };
	width: 240px;
	font-family: Poppins, sans-serif;
	font-style: normal;
	font-weight: normal;
	font-size: 12px;
`;

const Header = styled.div`
	padding: 16px;
	border-bottom: 1px solid rgba(229, 229, 229, 0.2);
	overflow: hidden;
`;

const CloseButton = styled( Close )`
	opacity: 1;
	float: right;
	line-height: 20px;
`;

const Body = styled.div`
	padding: 16px;
	display: grid;
	grid:
		"saturation saturation hue alpha" 140px
		"eyedropper  current current-alpha current-alpha" 16px
		/ 1fr 1fr 12px 12px;
	grid-gap: 10px;
`;

const SaturationWrapper = styled.div`
	position: relative;
	width: 167px;
	height: 140px;
	grid-area: saturation;
`;

const HueWrapper = styled.div`
	position: relative;
	height: 140px;
	width: 12px;
	grid-area: hue;
`;

const AlphaWrapper = styled.div`
	position: relative;
	height: 140px;
	width: 12px;
	grid-area: alpha;
`;

const EyedropperWrapper = styled.div`
	grid-area: eyedropper;
`;

const EyedropperButton = styled( Eyedropper )`
	/*opacity: 1;*/
	line-height: 15px;
`;

const CurrentWrapper = styled.div`
	grid-area: current;
`;

const CurrentAlphaWrapper = styled.div`
	grid-area: current-alpha;
`;

function ColorPicker( props ) {
	const { rgb, onClose } = props;
	const { a: alpha } = rgb;

	const [ currentMode, setCurrentMode ] = useState( 'solid' );

	const closePicker = useCallback( () => {
		if ( onClose ) {
			onClose();
		}
	}, [ onClose ] );

	return (
		<Container>
			<Header>
				<ModeSwitcher
					{ ...props }
					currentMode={ currentMode }
					onChange={ setCurrentMode }
				/>
				<CloseButton
					width="10"
					height="10"
					aria-label={ __( 'Close', 'web-stories' ) }
					onClick={ closePicker }
				/>
			</Header>
			<Body>
				<SaturationWrapper>
					<Saturation
						radius="6px"
						pointer={ Pointer }
						{ ...props }
					/>
				</SaturationWrapper>
				<HueWrapper>
					<Hue
						direction="vertical"
						width="12"
						height="140"
						radius="6px"
						pointer={ PointerWithoutOffset }
						{ ...props }
					/>
				</HueWrapper>
				<AlphaWrapper>
					<Alpha
						direction="vertical"
						width="12"
						height="140"
						radius="6px"
						pointer={ PointerWithoutOffset }
						{ ...props }
					/>
				</AlphaWrapper>
				<EyedropperWrapper>
					<EyedropperButton
						width="15"
						height="15"
						aria-label={ __( 'Select color', 'web-stories' ) }
						isDisabled
					/>
				</EyedropperWrapper>
				<CurrentWrapper>
					<EditableHexPreview
						{ ...props }
					/>
				</CurrentWrapper>
				<CurrentAlphaWrapper>
					{ ( alpha * 100 ) + '%' }
				</CurrentAlphaWrapper>
			</Body>
		</Container>
	);
}

ColorPicker.propTypes = {
	rgb: PropTypes.object,
	onClose: PropTypes.func,
};

export default CustomPicker( ColorPicker );
