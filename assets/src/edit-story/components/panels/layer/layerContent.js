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
import { __ } from '@wordpress/i18n';

const LayerBackground = styled.span`
	opacity: .5;
`;

const LayerText = styled.span`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;

function LayerContent( { element } ) {
	switch ( element.type ) {
		case 'text':
			return <LayerText dangerouslySetInnerHTML={ { __html: element.content } } />;

		case 'image':
			// Disable reason: Well, it's actually an image element, so it's the best description
			// eslint-disable-next-line jsx-a11y/img-redundant-alt
			return <img src={ element.src } alt="Image element" height="20" />;

		case 'video':
			return <img src={ element.poster } alt="Video element" height="20" />;

		case 'square':
			return 'Square';

		default:
			return (
				<LayerBackground>
					{ __( 'Background (locked)', 'amp' ) }
				</LayerBackground>
			);
	}
}

LayerContent.propTypes = {
	element: PropTypes.object.isRequired,
};

export default LayerContent;
