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
import { useLayoutEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getDefinitionForType } from '../../elements';
import { useStory } from '../../app';
import { elementWithPosition, elementWithSize, elementWithRotation } from '../../elements/shared';
import { useUnits } from '../../units';
import useCanvas from './useCanvas';

const Wrapper = styled.div`
	${ elementWithPosition }
	${ elementWithSize }
	${ elementWithRotation }
	pointer-events: initial;

	&:focus,
	&:active,
	&:hover {
		outline: 1px solid ${ ( { theme } ) => theme.colors.selection };
	}
`;

function FrameElement( { element } ) {
	const { id, type } = element;
	const { Frame } = getDefinitionForType( type );
	const elementRef = useRef();

	const { actions: { setNodeForElement, handleSelectElement } } = useCanvas();
	const { state: { selectedElements } } = useStory();
	const { actions: { getBox } } = useUnits();

	useLayoutEffect( () => {
		setNodeForElement( id, elementRef.current );
	}, [ id, setNodeForElement ] );

	const isSelected = selectedElements.includes( id );

	const box = getBox( element );

	return (
		<Wrapper
			ref={ elementRef }
			{ ...box }
			onMouseDown={ ( evt ) => {
				if ( ! isSelected ) {
					handleSelectElement( id, evt );
				}
				evt.stopPropagation();
			} }
		>
			{ Frame && (
				<Frame element={ element } box={ box } />
			) }
		</Wrapper>
	);
}

FrameElement.propTypes = {
	element: PropTypes.object.isRequired,
};

export default FrameElement;
