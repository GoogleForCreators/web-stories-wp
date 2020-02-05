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
 * WordPress dependencies
 */
import { useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { elementFillContent, getMediaProps } from '../shared';
import { useTransformHandler } from '../../components/canvas';
import StoryPropTypes from '../../types';
import { imageWithScale, getImageWithScaleCss } from './util';

const Element = styled.div`
	${ elementFillContent }
	overflow: hidden;
`;

const Img = styled.img`
	position: absolute;
	${ imageWithScale }
`;

function ImageDisplay( {
	element: { id, src, origRatio, scale, focalX, focalY },
	box: { width, height },
} ) {
	const imageRef = useRef( null );

	const imgProps = getMediaProps( width, height, scale, focalX, focalY, origRatio );

	useTransformHandler( id, ( transform ) => {
		const target = imageRef.current;
		if ( transform === null ) {
			target.style.transform = '';
		} else {
			const { resize } = transform;
			if ( resize[ 0 ] !== 0 && resize[ 1 ] !== 0 ) {
				const newImgProps = getMediaProps( resize[ 0 ], resize[ 1 ], scale, focalX, focalY, origRatio );
				target.style.cssText = getImageWithScaleCss( newImgProps );
			}
		}
	} );

	return (
		<Element>
			<Img ref={ imageRef } draggable={ false } src={ src } { ...imgProps } />
		</Element>
	);
}

ImageDisplay.propTypes = {
	element: StoryPropTypes.elements.image.isRequired,
	box: StoryPropTypes.box.isRequired,
};

export default ImageDisplay;
