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
import { DEFAULT_EDITOR_PAGE_WIDTH, DEFAULT_EDITOR_PAGE_HEIGHT } from '../../constants';
import { createNewElement, getDefinitionForType } from '../../elements';
import { editorToDataX, editorToDataY } from '../../units';
import { useStory } from '../../app';
import useLibrary from './useLibrary';
import MediaLibrary from './mediaLibrary';
import TextLibrary from './textLibrary';
import ShapeLibrary from './shapeLibrary';
import LinkLibrary from './linkLibrary';

function Library() {
	const {
		state: { tab },
		data: { tabs: { MEDIA, TEXT, SHAPES, LINKS } },
	} = useLibrary();
	const {
		actions: { addElement, setBackgroundElement },
		state: { currentPage },
	} = useStory();
	const ContentLibrary = ( {
		[ MEDIA ]: MediaLibrary,
		[ TEXT ]: TextLibrary,
		[ SHAPES ]: ShapeLibrary,
		[ LINKS ]: LinkLibrary,
	} )[ tab ];
	const isMediaEl = ( type ) => {
		const { isMedia } = getDefinitionForType( type );
		return isMedia;
	};
	const handleInsert = ( type, { width, height, ...props } ) => {
		const element = createNewElement( type, {
			...props,
			x: editorToDataX( 80 * Math.random(), DEFAULT_EDITOR_PAGE_WIDTH ),
			y: editorToDataY( 70 * Math.random(), DEFAULT_EDITOR_PAGE_HEIGHT ),
			width: editorToDataX( width, DEFAULT_EDITOR_PAGE_WIDTH ),
			height: editorToDataY( height, DEFAULT_EDITOR_PAGE_HEIGHT ),
		} );
		addElement( { element } );
		if ( isMediaEl( type ) && ! currentPage.elements.some( ( { type: elType } ) => isMediaEl( elType ) ) ) {
			setBackgroundElement( { elementId: element.id } );
		}
	};
	return <ContentLibrary onInsert={ handleInsert } />;
}

export default Library;
