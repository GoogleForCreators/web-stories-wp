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
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { ElementFillContent } from '../shared';
import useUploadVideoFrame from '../../utils/useUploadVideoFrame';

const Element = styled.video`
	${ ElementFillContent }
`;

function VideoDisplay( props ) {
	const {
		mimeType,
		src,
		videoId,
		featuredMedia,
		id,
	} = props;

	const { uploadVideoFrame } = useUploadVideoFrame( videoId, src, id );
	useEffect( () => {
		if ( videoId && ! featuredMedia ) {
			uploadVideoFrame();
		}
	},
	[ videoId, featuredMedia, uploadVideoFrame ],
	);

	return (
		<Element { ...props } >
			<source src={ src } type={ mimeType } />
		</Element>
	);
}

VideoDisplay.propTypes = {
	controls: PropTypes.bool,
	autoPlay: PropTypes.bool,
	loop: PropTypes.bool,
	mimeType: PropTypes.string.isRequired,
	src: PropTypes.string.isRequired,
	videoId: PropTypes.number.isRequired,
	featuredMedia: PropTypes.number,
	id: PropTypes.string.isRequired,
};

export default VideoDisplay;
