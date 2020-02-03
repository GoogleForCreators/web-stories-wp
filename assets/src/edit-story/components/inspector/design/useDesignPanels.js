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
 * WordPress dependencies
 */
import { useCallback, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { getPanels } from '../../panels';

function useDesignPanels() {
	const {
		state: { selectedElements, currentPage },
		actions: { deleteSelectedElements, updateSelectedElements },
	} = useStory();

	const panels = useMemo(
		() => getPanels( selectedElements, currentPage ),
		[ selectedElements, currentPage ],
	);

	const onSetProperties = useCallback( ( newPropertiesOrUpdater ) => {
		updateSelectedElements( { properties: ( currentProperties ) => calcProperties( currentProperties, newPropertiesOrUpdater ) } );
	}, [ updateSelectedElements ] );

	return {
		panels,
		panelProperties: {
			onSetProperties,
			deleteSelectedElements,
			selectedElements,
		},
	};
}

/**
 * @param {Object} currentProperties The existing element properties.
 * @param {Object|function(Object):Object} newPropertiesOrUpdater Either a map
 * of the updated properties or a function that will return a map of the updated
 * properties.
 * @return {Object} The updated properties.
 */
function calcProperties( currentProperties, newPropertiesOrUpdater ) {
	const newProperties =
			typeof newPropertiesOrUpdater === 'function' ?
				newPropertiesOrUpdater( currentProperties ) :
				newPropertiesOrUpdater;

	// Filter out empty properties (empty strings specifically)
	const updatedKeys = Object.keys( newProperties )
		.filter( ( key ) => newProperties[ key ] !== '' );

	if ( updatedKeys.length === 0 ) {
		// Of course abort if no keys have a value
		return {};
	}

	const properties = Object.fromEntries(
		updatedKeys.map( ( key ) => [ key, newProperties[ key ] ] ),
	);
	return properties;
}

export default useDesignPanels;
