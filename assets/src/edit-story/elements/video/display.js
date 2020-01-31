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
import { ElementFillContent } from '../shared';
import StoryPropTypes from '../../types';
import useUploadVideoFrame from '../../utils/useUploadVideoFrame';
import { getBackgroundStyle, getVideoProps, VideoWithScale } from './util';

const Element = styled.div`
	${ ElementFillContent }
	overflow: hidden;
`;

const Video = styled.video`
	${ VideoWithScale }
	max-height: ${ ( { isBackground } ) => isBackground ? 'initial' : '100%' };
`;

function VideoDisplay( {
	element: {
		autoPlay,
		mimeType,
		src,
		id,
		isBackground,
		width,
		height,
		scale,
		focalX,
		focalY,
		origRatio,
		videoId,
		posterId,
		poster,
		...rest
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

	const videoProps = getVideoProps( width, height, scale, focalX, focalY, origRatio );

	return (
		<Element>
			<Video poster={ poster } style={ { ...style } } { ...videoProps } { ...rest } >
				<source src={ src } type={ mimeType } />
			</Video>
		</Element>
	);
}

VideoDisplay.propTypes = {
	element: StoryPropTypes.elements.video.isRequired,
};

export default VideoDisplay;
