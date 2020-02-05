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
import StoryPropTypes from '../../types';
import { PAGE_WIDTH, PAGE_HEIGHT } from '../../constants';
import { editorPixels } from '../../units';
import { getImgProps } from '../image/util';

function VideoOutput( {
	element: { mimeType, src, poster, scale, focalX, focalY, origRatio },
	box: { width: vw, height: vh },
} ) {
	// Width and height are taken from the basis of 100% taking into account the
	// aspect ratio.
	const width = vw;
	const height = vh * PAGE_HEIGHT / PAGE_WIDTH;
	const imgProps = getImgProps( width, height, scale, focalX, focalY, origRatio );

	const wrapperStyle = {
		position: 'absolute',
		width: `${ editorPixels( imgProps.width / width * 100 ) }%`,
		height: `${ editorPixels( imgProps.height / height * 100 ) }%`,
		left: `${ -editorPixels( imgProps.offsetX / width * 100 ) }%`,
		top: `${ -editorPixels( imgProps.offsetY / height * 100 ) }%`,
	};

	const sourceProps = {
		type: mimeType,
		src,
	};
	const props = {
		autoPlay: true,  // QQQ: autoPlay or autoplay?
		poster,
		layout: 'fill',
	};

	return (
		<div style={ wrapperStyle } >
			<amp-video { ...props }>
				<source { ...sourceProps } />
			</amp-video>
		</div>
	);
}

VideoOutput.propTypes = {
	element: StoryPropTypes.elements.video.isRequired,
	box: StoryPropTypes.box.isRequired,
};

export default VideoOutput;
