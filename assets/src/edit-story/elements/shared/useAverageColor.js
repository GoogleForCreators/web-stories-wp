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
import ColorThief from 'colorthief';

/**
 * WordPress dependencies
 */
import { useRef, useCallback, useLayoutEffect } from '@wordpress/element';

function useAverageColor( ref, onAverageColor ) {
	const thief = useRef( new ColorThief() );

	const checkAverageColor = useCallback( ( ) => {
		try {
			onAverageColor( thief.current.getColor( ref.current ) );
		} catch ( e ) {
			// ColorThief fails for all-white images
			//
			// It's a "feature":
			// https://github.com/lokesh/color-thief/pull/49
			onAverageColor( [ 255, 255, 255 ] );
		}
	}, [ ref, onAverageColor ] );

	useLayoutEffect( () => {
		const element = ref.current;
		if ( element.complete ) {
			checkAverageColor();

			return undefined;
		}

		element.addEventListener( 'load', checkAverageColor );
		return () => element.removeEventListener( 'load', checkAverageColor );
	}, [ ref, checkAverageColor ]	);
}

export default useAverageColor;
