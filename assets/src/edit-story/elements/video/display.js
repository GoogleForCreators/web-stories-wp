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
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { elementFillContent, getMediaProps } from '../shared';
import StoryPropTypes from '../../types';
import useUploadVideoFrame from '../../utils/useUploadVideoFrame';
import { getBackgroundStyle, videoWithScale } from './util';

const Element = styled.div`
	${ elementFillContent }
	overflow: hidden;
`;

const Video = styled.video`
	position: absolute;
	max-width: initial;
	max-height: initial;
	${ videoWithScale }
`;

function VideoDisplay( {
	box: { width, height },
	element: {
		mimeType,
		src,
		id,
		isBackground,
		scale,
		focalX,
		focalY,
		origRatio,
		videoId,
		posterId,
		poster,
	},
} ) {
	const { uploadVideoFrame } = useUploadVideoFrame( { videoId, src, id } );
	useEffect( () => {
		if ( videoId && ! posterId ) {
			uploadVideoFrame();
		}
	}, [ videoId, posterId, uploadVideoFrame ] );

	let style = {};
	if ( isBackground ) {
		const styleProps = getBackgroundStyle();
		style = {
			...style,
			...styleProps,
		};
	}

	const videoProps = getMediaProps( width, height, scale, focalX, focalY, origRatio );
	return (
		<Element>
			<Video poster={ poster } style={ style } { ...videoProps } >
				<source src={ src } type={ mimeType } />
			</Video>
		</Element>
	);
}

VideoDisplay.propTypes = {
	element: StoryPropTypes.elements.video.isRequired,
	box: StoryPropTypes.box.isRequired,
};

export default VideoDisplay;
