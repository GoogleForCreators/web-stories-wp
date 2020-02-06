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

/**
 * Internal dependencies
 */
import { getCommonAttributes } from '../shared';

function VideoSave( { autoPlay, id, mimeType, src, width, height, x, y, rotationAngle, poster, isBackground } ) {
	const sourceProps = {
		type: mimeType,
		src,
	};
	const props = {
		autoPlay,
		poster,
		layout: 'fill',
	};

	const wrapperProps = {
		id: 'el-' + id,
	};

	const style = isBackground ?
		{
			width: '100%',
			height: '100%',
			top: 0,
			left: 0,
			rotationAngle: 0,
		} :
		getCommonAttributes( { width, height, x, y, rotationAngle } );

	if ( isBackground ) {
		props.autoPlay = true;
	}

	return (
		<div className="is-background" style={ style } { ...wrapperProps } >
			<amp-video { ...props }>
				<source { ...sourceProps } />
			</amp-video>
		</div>
	);
}

VideoSave.propTypes = {
	poster: PropTypes.string,
	rotationAngle: PropTypes.number.isRequired,
	controls: PropTypes.bool,
	autoPlay: PropTypes.bool,
	isBackground: PropTypes.bool,
	loop: PropTypes.bool,
	mimeType: PropTypes.string.isRequired,
	src: PropTypes.string.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	id: PropTypes.string.isRequired,
};

export default VideoSave;
