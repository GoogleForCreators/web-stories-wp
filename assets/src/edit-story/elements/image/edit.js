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
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { elementFillContent } from '../utils/css';
import { useStory } from '../../app';
import StoryPropTypes from '../../types';
import { getImgProps, imageWithScale } from './util';
import EditPanMovable from './editPanMovable';
import EditCropMovable from './editCropMovable';
import ScalePanel from './scalePanel';

const Element = styled.div`
	${ elementFillContent }
`;

const CropBox = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	overflow: hidden;

	&::after {
		content: '';
		display: block;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		border: 1px solid ${ ( { theme } ) => theme.colors.mg.v1 }70;
		pointer-events: none;
	}
`;

const FadedImg = styled.img`
	position: absolute;
	opacity: 0.4;
	pointer-events: none;
	${ imageWithScale }
`;

const CropImg = styled.img`
	position: absolute;
	${ imageWithScale }
`;

function ImageEdit( {
	element: { id, src, origRatio, scale, focalX, focalY, isFill },
	box: { x, y, width, height, rotationAngle },
} ) {
	const [ fullImage, setFullImage ] = useState( null );
	const [ croppedImage, setCroppedImage ] = useState( null );
	const [ cropBox, setCropBox ] = useState( null );

	const { actions: { updateElementById } } = useStory();
	const setProperties = useCallback(
		( properties ) => updateElementById( { elementId: id, properties } ),
		[ id, updateElementById ] );

	const imgProps = getImgProps( width, height, scale, focalX, focalY, origRatio );

	return (
		<Element>
			<FadedImg ref={ setFullImage } draggable={ false } src={ src } { ...imgProps } />
			<CropBox ref={ setCropBox }>
				<CropImg ref={ setCroppedImage } draggable={ false } src={ src } { ...imgProps } />
			</CropBox>

			{ ! isFill && cropBox && croppedImage && (
				<EditCropMovable
					setProperties={ setProperties }
					cropBox={ cropBox }
					croppedImage={ croppedImage }
					x={ x }
					y={ y }
					offsetX={ imgProps.offsetX }
					offsetY={ imgProps.offsetY }
					imgWidth={ imgProps.width }
					imgHeight={ imgProps.height }
				/>
			) }

			{ fullImage && croppedImage && (
				<EditPanMovable
					setProperties={ setProperties }
					fullImage={ fullImage }
					croppedImage={ croppedImage }
					x={ x }
					y={ y }
					width={ width }
					height={ height }
					rotationAngle={ rotationAngle }
					offsetX={ imgProps.offsetX }
					offsetY={ imgProps.offsetY }
					imgWidth={ imgProps.width }
					imgHeight={ imgProps.height }
				/>
			) }

			<ScalePanel
				setProperties={ setProperties }
				x={ x }
				y={ y }
				width={ width }
				height={ height }
				scale={ scale || 100 } />
		</Element>
	);
}

ImageEdit.propTypes = {
	element: StoryPropTypes.elements.image.isRequired,
	box: StoryPropTypes.box.isRequired,
};

export default ImageEdit;
