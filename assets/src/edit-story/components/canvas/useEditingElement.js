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
import { useState, useCallback } from '@wordpress/element';

function useEditingElement() {
	const [ editingElement, setEditingElement ] = useState( null );
	const [ editingElementState, setEditingElementState ] = useState( {} );
	const [ nodesById, setNodesById ] = useState( {} );

	const clearEditing = useCallback(
		() => setEditingElement( null ),
		[],
	);

	const setEditingElementWithoutState = useCallback(
		( id ) => {
			setEditingElement( id );
			setEditingElementState( {} );
		},
		[],
	);

	const setEditingElementWithState = useCallback(
		( id, state ) => {
			setEditingElement( id );
			setEditingElementState( state );
		},
		[],
	);

	const setNodeForElement = useCallback(
		( id, ref ) => setNodesById( ( oldNodes ) => ( { ...oldNodes, [ id ]: ref } ) ),
		[ setNodesById ],
	);

	return {
		nodesById,
		editingElement,
		editingElementState,
		setEditingElementWithState,
		setEditingElementWithoutState,
		clearEditing,
		setNodeForElement,
	};
}

export default useEditingElement;
