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
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { ElementFillContent } from '../shared';
import { useStory } from '../../app';
import { getVideoProps, VideoWithScale } from './util';
import EditPanMovable from './editPanMovable';
import ScalePanel from './scalePanel';

const Element = styled.div`
	${ ElementFillContent }
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

const FadedVideo = styled.video`
	position: absolute;
	opacity: 0.4;
	pointer-events: none;
	max-width: initial;
	${ VideoWithScale }
`;

const CropVideo = styled.video`
	position: absolute;
	max-width: initial;
	${ VideoWithScale }
`;

function VideoEdit( { id, src, origRatio, width, height, x, y, scale, focalX, focalY, rotationAngle, mimeType, isBackground } ) {
	const [ fullVideo, setFullVideo ] = useState( null );
	const [ croppedVideo, setCroppedVideo ] = useState( null );

	const { actions: { updateElementById } } = useStory();
	const setProperties = useCallback(
		( properties ) => updateElementById( { elementId: id, properties } ),
		[ id, updateElementById ] );

	const videoProps = getVideoProps( width, height, scale, focalX, focalY, origRatio );

	return (
		<Element>
			<FadedVideo ref={ setFullVideo } draggable={ false } { ...videoProps }>
				<source src={ src } type={ mimeType } />
			</FadedVideo>
			<CropBox>
				<CropVideo ref={ setCroppedVideo } draggable={ false } src={ src } { ...videoProps } />
			</CropBox>

			{ fullVideo && croppedVideo && (
				<EditPanMovable
					setProperties={ setProperties }
					fullVideo={ fullVideo }
					croppedVideo={ croppedVideo }
					x={ x }
					y={ y }
					width={ width }
					height={ height }
					rotationAngle={ rotationAngle }
					offsetX={ videoProps.offsetX }
					offsetY={ videoProps.offsetY }
					videoWidth={ videoProps.width }
					videoHeight={ videoProps.height }
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

VideoEdit.propTypes = {
	id: PropTypes.string.isRequired,
	src: PropTypes.string.isRequired,
	origRatio: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	rotationAngle: PropTypes.number.isRequired,
	isBackground: PropTypes.bool,
	scale: PropTypes.number,
	focalX: PropTypes.number,
	focalY: PropTypes.number,
};

VideoEdit.defaultProps = {
	scale: null,
	focalX: null,
	focalY: null,
};

export default VideoEdit;
