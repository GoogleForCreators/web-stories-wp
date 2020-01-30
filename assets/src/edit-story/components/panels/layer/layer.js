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
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { LAYER_HEIGHT } from './constants';
import LayerContent from './layerContent';

const LayerButton = styled.button.attrs( { type: 'button' } )`
	display: flex;
	border: 0;
	padding: 0;
	background: transparent;
	height: ${ LAYER_HEIGHT }px;
	width: 100%;
	align-items: center;

	${ ( { isSelected, theme } ) => isSelected && `
		background: ${ rgba( theme.colors.action, 0.14 ) };
	` }

	&:focus,
	&:active {
		outline: none;
	}
`;

const LayerIcon = styled.div`
	width: 52px;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 8px;

	svg {
		height: 28px;
		width: 28px;
		opacity: .5;
		color: ${ ( { theme } ) => theme.colors.bg.v0 };
	}
`;

const LayerDescription = styled.div`
	flex-grow: 1;
	display: flex;
	align-items: center;
	margin-left: 0;
`;

function Layer( { icon, id, isSelected, element } ) {
	const {
		actions: { setSelectedElementsById, clearSelection },
	} = useStory();

	const handleClick = useCallback( ( evt ) => {
		evt.preventDefault();
		evt.stopPropagation();
		if ( id ) {
			setSelectedElementsById( { elementIds: [ id ] } );
		} else {
			clearSelection();
		}
	}, [ setSelectedElementsById, clearSelection, id ] );

	return (
		<LayerButton
			isSelected={ isSelected }
			onClick={ handleClick }
		>
			<LayerIcon>
				{ icon }
			</LayerIcon>
			<LayerDescription>
				<LayerContent element={ element } />
			</LayerDescription>
		</LayerButton>
	);
}

Layer.propTypes = {
	icon: PropTypes.object.isRequired,
	id: PropTypes.string,
	isSelected: PropTypes.bool.isRequired,
	element: PropTypes.object.isRequired,
};

export default Layer;
