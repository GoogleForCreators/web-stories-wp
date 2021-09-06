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
import { useRef } from '@web-stories-wp/react';
import { getMediaSizePositionProps } from '@web-stories-wp/media';
/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import MediaDisplay from '../media/display';
import { getBackgroundStyle, videoWithScale } from './util';

const Video = styled.video`
  position: absolute;
  max-width: initial;
  max-height: initial;
  ${videoWithScale}
`;

function VideoTrim({ box: { width, height }, element }) {
  const { poster, resource, tracks, isBackground, scale, focalX, focalY } =
    element;
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

  videoProps.crossOrigin = 'anonymous';

  return (
    <MediaDisplay
      element={element}
      mediaRef={ref}
      showPlaceholder
      previewMode={false}
    >
      <Video
        poster={poster || resource.poster}
        style={style}
        {...videoProps}
        preload="metadata"
        loop
        muted
        autoPlay
        tabIndex={0}
        ref={ref}
      >
        {resource.src && <source src={resource.src} type={resource.mimeType} />}
        {tracks &&
          tracks.map(({ srclang, label, kind, track: src, id: key }, i) => (
            <track
              srcLang={srclang}
              label={label}
              kind={kind}
              src={src}
              key={key}
              default={i === 0}
            />
          ))}
      </Video>
    </MediaDisplay>
  );
}

VideoTrim.propTypes = {
  previewMode: PropTypes.bool,
  element: StoryPropTypes.elements.video.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default VideoTrim;
