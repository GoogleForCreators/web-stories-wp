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
 * Internal dependencies
 */
import { useStory } from '../../../app';

import IconBackground from './layer_bg.svg';
import IconMedia from './layer_media.svg';
import IconVideo from './layer_video.svg';
import IconText from './layer_text.svg';

function getIconForElementType( type ) {
	switch ( type ) {
		case 'video':
			return <IconVideo />;
		case 'text':
			return <IconText />;
		case 'image':
		case 'shape':
		case 'square': // this is only while square is a "shape"
			return <IconMedia />;
		default:
			return <IconBackground />;
	}
}

function useElements() {
	const {
		state: { currentPage, selectedElementIds },
	} = useStory();

	if ( ! currentPage ) {
		return [];
	}

	let backgroundElement, otherElements;
	const hasBackground = Boolean( currentPage.backgroundElementId );

	if ( hasBackground ) {
		[ backgroundElement, otherElements ] = currentPage.elements;
	} else {
		otherElements = currentPage.elements;
		backgroundElement = { id: '' };
	}

	const layers = [
		{
			icon: getIconForElementType(),
			isSelected: hasBackground ? selectedElementIds.includes( backgroundElement.id ) : selectedElementIds.length === 0,
			id: backgroundElement.id,
			element: backgroundElement,
		},
		...otherElements.map( ( element ) => {
			const { type, id } = element;
			return {
				icon: getIconForElementType( type ),
				isSelected: selectedElementIds.includes( id ),
				id,
				element,
			};
		} ),
	];

	// Flip it and...
	layers.reverse();

	return layers;
}

export default useElements;
