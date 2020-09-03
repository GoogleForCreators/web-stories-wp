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
import { useRef } from 'react';

/**
 * Internal dependencies
 */
import { getMediaSizePositionProps } from '../media';
import StoryPropTypes from '../../types';
import MediaDisplay from '../media/display';
import { getBackgroundStyle, videoWithScale } from './util';

const Video = styled.video`
  position: absolute;
  max-width: initial;
  max-height: initial;
  ${videoWithScale}
`;

const Image = styled.img`
  position: absolute;
  max-width: initial;
  max-height: initial;
  ${videoWithScale}
`;

function VideoDisplay({ previewMode, box: { width, height }, element }) {
  const {
    id,
    poster,
    resource,
    isBackground,
    scale,
    focalX,
    focalY,
    loop,
  } = element;
  const ref = useRef();
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
  return (
    <MediaDisplay element={element} mediaRef={ref}>
      {previewMode ? (
        <Image
          src={poster || resource.poster}
          alt={resource.title}
          style={style}
          {...videoProps}
          ref={ref}
        />
      ) : (
        <Video
          id={`video-${id}`}
          poster={poster || resource.poster}
          style={style}
          {...videoProps}
          loop={loop}
          preload="none"
          ref={ref}
        >
          <source src={resource.src} type={resource.mimeType} />
        </Video>
      )}
    </MediaDisplay>
  );
}

VideoDisplay.propTypes = {
  previewMode: PropTypes.bool,
  element: StoryPropTypes.elements.video.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default VideoDisplay;
