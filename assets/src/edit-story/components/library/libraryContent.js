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
import { PAGE_WIDTH, DEFAULT_EDITOR_PAGE_WIDTH } from '../../constants';
import { createNewElement } from '../../elements';
import { dataPixels } from '../../units';
import { useStory } from '../../app';
import useLibrary from './useLibrary';
import MediaLibrary from './mediaLibrary';
import TextLibrary from './textLibrary';
import ShapeLibrary from './shapeLibrary';
import LinkLibrary from './linkLibrary';

const DATA_SCALE = PAGE_WIDTH / DEFAULT_EDITOR_PAGE_WIDTH;

function Library() {
	const {
		state: { tab },
		data: { tabs: { MEDIA, TEXT, SHAPES, LINKS } },
	} = useLibrary();
	const {
		actions: { addElement },
	} = useStory();
	const ContentLibrary = ( {
		[ MEDIA ]: MediaLibrary,
		[ TEXT ]: TextLibrary,
		[ SHAPES ]: ShapeLibrary,
		[ LINKS ]: LinkLibrary,
	} )[ tab ];
	const handleInsert = ( type, { width, height, ...props } ) => {
		const element = createNewElement( type, {
			...props,
			x: dataPixels( 80 * DATA_SCALE * Math.random() ),
			y: dataPixels( 70 * DATA_SCALE * Math.random() ),
			width: dataPixels( width * DATA_SCALE ),
			height: dataPixels( height * DATA_SCALE ),
		} );
		addElement( { element } );
	};
	return <ContentLibrary onInsert={ handleInsert } />;
}

export default Library;
