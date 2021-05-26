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
 * Internal dependencies
 */
import { getMediaSizePositionProps } from '../media';
import StoryPropTypes from '../../types';
import MediaSVG from '../media/svg';
import { getBackgroundStyle } from './util';

const Image = styled.img`
  max-height: initial;
  object-fit: contain;
  width: ${({ width }) => `${width}px`};
  left: ${({ offsetX }) => `${-offsetX}px`};
  top: ${({ offsetY }) => `${-offsetY}px`};
  max-width: ${({ isBackground }) => (isBackground ? 'initial' : null)};
`;

function VideoSVG({ element, box }) {
  const { poster, resource, isBackground, scale, focalX, focalY } = element;
  const { width, height } = box;
  let style = {};
  if (isBackground) {
    const styleProps = getBackgroundStyle();
    style = {
      ...style,
      ...styleProps,
    };
  }

  const videoProps = getMediaSizePositionProps(
    resource,
    width,
    height,
    scale,
    focalX,
    focalY
  );

  videoProps.crossOrigin = 'anonymous';

  return (
    <MediaSVG element={element} box={box}>
      {(poster || resource.poster) && (
        <Image
          src={poster || resource.poster}
          alt={element.alt || resource.alt}
          style={style}
          {...videoProps}
        />
      )}
    </MediaSVG>
  );
}

VideoSVG.propTypes = {
  element: StoryPropTypes.elements.video.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default VideoSVG;
