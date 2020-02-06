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
import { useRef, useState, useCallback, useLayoutEffect } from '@wordpress/element';

function useBrightnessChecker( limit ) {
	const ref = useRef();
	const thief = useRef( new ColorThief() );

	const [ isTooBright, setIsTooBright ] = useState( false );

	const checkIfTooBright = useCallback( ( ) => {
		try {
			const averageColor = thief.current.getColor( ref.current );
			const darkestDimension = Math.max.apply( null, averageColor );
			setIsTooBright( darkestDimension <= limit );
		} catch ( e ) {
			// ColorThief fails for all-white images
			// - which is actually what we want to find here
			//
			// It's a "feature":
			// https://github.com/lokesh/color-thief/pull/49
			setIsTooBright( true );
		}
	}, [ limit ] );

	useLayoutEffect( () => {
		const element = ref.current;
		if ( element.complete ) {
			checkIfTooBright();

			return undefined;
		}

		element.addEventListener( 'load', checkIfTooBright );
		return () => element.removeEventListener( 'load', checkIfTooBright );
	}, [ checkIfTooBright ]	);

	return {
		ref,
		isTooBright,
	};
}

export default useBrightnessChecker;
