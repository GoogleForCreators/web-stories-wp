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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useStory } from '../../app';
import withOverlay from '../overlay/withOverlay';
import Selection from './selection';
import useCanvas from './useCanvas';
import Element from './element';

const Background = withOverlay( styled.div.attrs( { className: 'container' } )`
	background-color: ${ ( { theme } ) => theme.colors.fg.v1 };
	position: relative;
	width: 100%;
	height: 100%;
` );

function Page() {
	const {
		state: { currentPage },
	} = useStory();

	const {
		actions: { setPageContainer },
	} = useCanvas();

	return (
		<Background ref={ setPageContainer }>
			{ currentPage && currentPage.elements.map( ( { id, ...rest } ) => {
				return (
					<Element
						key={ id }
						element={ { id, ...rest } }
					/>
				);
			} ) }

			<Selection />
		</Background>
	);
}

export default Page;
