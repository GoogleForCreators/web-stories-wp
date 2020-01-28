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
import { useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useDragHandlers from './useDragHandlers';
import useKeyboardHandlers from './useKeyboardHandlers';

const Handle = styled.button.attrs( { type: 'button', role: 'separator' } )`
	background: transparent;
	border: 0;
	padding: 0;
	height: 10px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	cursor: row-resize;
`;

const Bar = styled.div`
	margin-top: 4px;
	background-color: ${ ( { theme } ) => theme.colors.bg.v0 };
	width: 32px;
	height: 4px;
	border-radius: 2px;
	text-indent: -10000px; // hide the text from non-screen-readers
`;

function DragHandle( { height, minHeight, maxHeight, handleHeightChange } ) {
	const handle = useRef();
	useDragHandlers( handle, handleHeightChange );
	useKeyboardHandlers( handle, handleHeightChange );

	return (
		<Handle
			ref={ handle }
			role="slider"
			aria-orientation="vertical"
			aria-valuenow={ height }
			aria-valuemin={ minHeight }
			aria-valuemax={ maxHeight }
		>
			<Bar>
				{ __( 'Set panel height', 'web-stories' ) }
			</Bar>
		</Handle>
	);
}

DragHandle.propTypes = {
	handleHeightChange: PropTypes.func.isRequired,
	height: PropTypes.number.isRequired,
	minHeight: PropTypes.number.isRequired,
	maxHeight: PropTypes.number.isRequired,
};

export default DragHandle;
