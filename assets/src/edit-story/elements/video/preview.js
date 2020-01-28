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
import { getBackgroundStyle } from './util';

function VideoPreview( { id, mimeType, src, width, height, x, y, rotationAngle } ) {
	const sourceProps = {
		type: mimeType,
		src,
	};

	const wrapperProps = {
		id: 'el-' + id,
	};

	const style = getCommonAttributes( { width, height, x, y, rotationAngle } );
	return (
		<div style={ { ...style } } { ...wrapperProps } >
			<video { ...sourceProps } />
		</div>
	);
}

VideoPreview.propTypes = {
	rotationAngle: PropTypes.number.isRequired,
	controls: PropTypes.bool,
	autoPlay: PropTypes.bool,
	loop: PropTypes.bool,
	mimeType: PropTypes.string.isRequired,
	src: PropTypes.string.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	id: PropTypes.string.isRequired,
};

export default VideoPreview;
