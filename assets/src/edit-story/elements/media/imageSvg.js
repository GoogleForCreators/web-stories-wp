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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { getSmallestUrlForWidth, mediaWithScale } from './util';
import MediaSVG from './svg';
import { getMediaSizePositionProps } from '.';

const Img = styled.img`
  position: absolute;
  ${mediaWithScale}
`;

function ImageSVG({ element }) {
  const { resource, width, height, scale, focalX, focalY } = element;

  const src = getSmallestUrlForWidth(0, resource);

  const imgProps = getMediaSizePositionProps(
    resource,
    width,
    height,
    scale,
    focalX,
    focalY
  );

  imgProps.crossOrigin = 'anonymous';

  return (
    <MediaSVG element={element}>
      <Img
        draggable={false}
        src={src}
        alt={resource.alt}
        data-testid="imageElement"
        data-leaf-element="true"
        {...imgProps}
      />
    </MediaSVG>
  );
}

ImageSVG.propTypes = {
  element: PropTypes.oneOfType([
    StoryPropTypes.elements.image,
    StoryPropTypes.elements.gif,
  ]).isRequired,
};

export default ImageSVG;
