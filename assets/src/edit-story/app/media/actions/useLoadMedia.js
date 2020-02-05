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
import { useCallback } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { useAPI } from '../../api';

function useLoadMedia( { setMedia, setIsMediaLoading, setIsMediaLoaded, isMediaLoaded, isMediaLoading, mediaType, searchTerm } ) {
	const { actions: { getMedia } } = useAPI();

	const loadMedia = useCallback( () => {
		if ( ! isMediaLoaded && ! isMediaLoading ) {
			setIsMediaLoading( true );
			getMedia( { mediaType, searchTerm } ).then( ( loadedMedia ) => {
				setIsMediaLoading( false );
				setIsMediaLoaded( true );
				setMedia( loadedMedia );
			} );
		}
	}, [ isMediaLoaded, isMediaLoading, setIsMediaLoading, getMedia, mediaType, searchTerm, setIsMediaLoaded, setMedia ] );

	return loadMedia;
}

export default useLoadMedia;
