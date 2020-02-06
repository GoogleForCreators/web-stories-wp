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

function VideoPreview( { id, mimeType, src, width, height, x, y, rotationAngle, isBackground, poster } ) {
	const sourceProps = {
		type: mimeType,
		src,
		poster,
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

	const videoStyle = {
		height: '100%',
		width: 'auto',
		maxWidth: 'initial',
	};
	return (
		<div style={ style } { ...wrapperProps } >
			<video style={ { ...videoStyle } } { ...sourceProps } />
		</div>
	);
}

VideoPreview.propTypes = {
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
	poster: PropTypes.string,
};

export default VideoPreview;
