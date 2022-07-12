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
import { useRef, useMemo, useCallback } from '@googleforcreators/react';
import { getMediaSizePositionProps } from '@googleforcreators/media';
import { CircularProgress } from '@googleforcreators/design-system';
import { StoryPropTypes, getTransformFlip } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import MediaDisplay from '../media/display';
import { elementWithFlip } from '../shared';
import PlayPauseButton from './playPauseButton';
import { getBackgroundStyle, videoWithScale } from './util';
import Captions from './captions';

const Video = styled.video`
  position: absolute;
  max-width: initial;
  max-height: initial;
  ${videoWithScale}
  ${elementWithFlip}
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const Spinner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function VideoTrim({
  box,
  element,
  isRTL,
  topOffset,
  resource,
  setVideoNode,
  getProxiedUrl,
  renderResourcePlaceholder,
}) {
  const { width, height } = box;
  const { poster, tracks, isBackground, scale, flip, focalX, focalY } = element;
  const wrapperRef = useRef();
  const videoRef = useRef();
  let style = {};
  if (isBackground) {
    const styleProps = getBackgroundStyle();
    style = {
      ...style,
      ...styleProps,
    };
  }

  const boxAtOrigin = useMemo(
    () => ({
      ...box,
      x: 0,
      y: 0,
    }),
    [box]
  );
  const setRef = useCallback(
    (node) => {
      videoRef.current = node;
      setVideoNode(node);
    },
    [setVideoNode]
  );

  if (!resource) {
    return (
      <Wrapper>
        <Spinner>
          <CircularProgress />
        </Spinner>
      </Wrapper>
    );
  }

  const videoProps = getMediaSizePositionProps(
    resource,
    width,
    height,
    scale,
    flip?.horizontal ? 100 - focalX : focalX,
    flip?.vertical ? 100 - focalY : focalY
  );

  videoProps.transformFlip = getTransformFlip(flip);
  videoProps.crossOrigin = 'anonymous';
  const tracksFormatted = tracks.map((track) => {
    const src = getProxiedUrl(track, track?.track);
    return {
      ...track,
      track: src,
    };
  });

  return (
    <>
      <Wrapper ref={wrapperRef}>
        <MediaDisplay
          element={element}
          mediaRef={videoRef}
          showPlaceholder
          previewMode={false}
          renderResourcePlaceholder={renderResourcePlaceholder}
        >
          {/* eslint-disable-next-line styled-components-a11y/media-has-caption,jsx-a11y/media-has-caption -- False positive. */}
          <Video
            poster={poster || resource.poster}
            style={style}
            {...videoProps}
            preload="metadata"
            autoPlay
            tabIndex={0}
            ref={setRef}
          >
            {resource.src && (
              <source src={resource.src} type={resource.mimeType} />
            )}
            <Captions tracks={tracksFormatted} />
          </Video>
        </MediaDisplay>
      </Wrapper>
      <PlayPauseButton
        box={boxAtOrigin}
        element={element}
        elementRef={wrapperRef}
        videoRef={videoRef}
        shouldResetOnEnd={false}
        isRTL={isRTL}
        topOffset={topOffset}
      />
    </>
  );
}

VideoTrim.propTypes = {
  previewMode: PropTypes.bool,
  element: StoryPropTypes.elements.video.isRequired,
  box: StoryPropTypes.box.isRequired,
  isRTL: PropTypes.bool,
  topOffset: PropTypes.number,
  resource: PropTypes.object,
  setVideoNode: PropTypes.func,
  getProxiedUrl: PropTypes.func,
  renderResourcePlaceholder: PropTypes.func,
};

export default VideoTrim;
