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
import {
	useRef,
	useState,
	useCallback,
	useLayoutEffect,
} from '@wordpress/element';

function useDragHandlers( handle, handleHeightChange ) {
	const lastPosition = useRef();
	const [ isDragging, setIsDragging ] = useState( false );

	// On mouse move, check difference since last record vertical mouse position
	// and invoke callback with this difference.
	// Then record new vertical mouse position for next iteration.
	const handleMouseMove = useCallback( ( evt ) => {
		const delta = lastPosition.current - evt.pageY;
		handleHeightChange( delta );
		lastPosition.current = evt.pageY;
	}, [ handleHeightChange ] );

	// On mouse up, set dragging as false
	// - will cause useLayoutEffect to unregister listeners.
	const handleMouseUp = useCallback( () => setIsDragging( false ), [] );

	// On mouse down, set dragging as true
	// - will cause useLayoutEffect to register listeners.
	// Also record the initial vertical mouse position on the page.
	const handleMouseDown = useCallback( ( evt ) => {
		lastPosition.current = evt.pageY;
		setIsDragging( true );
	}, [] );

	// On initial render *and* every time `isDragging` changes value,
	// register all relevant listeners. Note that all listeners registered
	// will be correctly unregistered due to the cleanup function.
	useLayoutEffect( () => {
		const element = handle.current;
		const doc = element.ownerDocument;
		element.addEventListener( 'mousedown', handleMouseDown );

		if ( isDragging && doc ) {
			doc.addEventListener( 'mousemove', handleMouseMove );
			doc.addEventListener( 'mouseup', handleMouseUp );
		}

		return () => {
			if ( element ) {
				element.removeEventListener( 'mousedown', handleMouseDown );
				if ( isDragging && doc ) {
					doc.removeEventListener( 'mousemove', handleMouseMove );
					doc.removeEventListener( 'mouseup', handleMouseUp );
				}
			}
		};
	}, [ isDragging, handleMouseUp, handleMouseMove, handleMouseDown, handle ] );
}

export default useDragHandlers;
