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
import { useRef, useMemo, useCallback, useState } from '@web-stories-wp/react';
import { getMediaSizePositionProps } from '@web-stories-wp/media';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import MediaDisplay from '../media/display';
import useVideoTrim from '../../components/videoTrim/useVideoTrim';
import { useAPI } from '../../app';
import PlayPauseButton from './playPauseButton';
import { getBackgroundStyle, videoWithScale } from './util';

const Video = styled.video`
  position: absolute;
  max-width: initial;
  max-height: initial;
  ${videoWithScale}
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`;

function VideoTrim({ box, element }) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    setVideoNode,
    originalResource,
    setOriginalResource,
    setOriginalStartOffset,
    setOriginalEndOffset,
  } = useVideoTrim(
    ({
      actions: {
        setVideoNode,
        setOriginalResource,
        setOriginalStartOffset,
        setOriginalEndOffset,
      },
      state: { originalResource },
    }) => ({
      setVideoNode,
      setOriginalResource,
      originalResource,
      setOriginalStartOffset,
      setOriginalEndOffset,
    })
  );
  const {
    actions: { getMediaById },
  } = useAPI();

  const { width, height } = box;
  const { poster, resource, tracks, isBackground, scale, focalX, focalY } =
    element;
  const {
    trimData: { end, start, original },
  } = resource;
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

  const getMsFromHMS = useCallback((time) => {
    const parts = time.split(':');
    return (
      1000 * (parts[2] + parseInt(parts[1]) * 60 + parseInt(parts[0]) * 3600)
    );
  }, []);

  const videoProps = getMediaSizePositionProps(
    resource,
    width,
    height,
    scale,
    focalX,
    focalY
  );

  videoProps.crossOrigin = 'anonymous';

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

  const fetchOriginalResource = useCallback(() => {
    getMediaById(original)
      .then((_originalResource) => {
        setIsLoading(false);
        setOriginalResource(_originalResource);
        setOriginalEndOffset(getMsFromHMS(end));
        setOriginalStartOffset(getMsFromHMS(start));
      })
      .catch(() => {
        setOriginalResource(false);
        setIsLoading(false);
      });
  }, [
    original,
    getMediaById,
    setOriginalResource,
    start,
    end,
    setOriginalEndOffset,
    setOriginalStartOffset,
    getMsFromHMS,
  ]);

  // If there's an original video, we should use that for trimming instead.
  if (original && originalResource === null) {
    // @todo Add spinner or sth for the time of loading.
    if (!isLoading) {
      setIsLoading(true);
      fetchOriginalResource();
    }
    return null;
  }
  const hasOrigin = originalResource && original;
  const trimResource = hasOrigin ? originalResource : resource;
  const trimElement = hasOrigin
    ? { ...element, resource: originalResource }
    : element;
  return (
    <>
      <Wrapper ref={wrapperRef}>
        <MediaDisplay
          element={trimElement}
          mediaRef={videoRef}
          showPlaceholder
          previewMode={false}
        >
          <Video
            poster={poster || trimResource.poster}
            style={style}
            {...videoProps}
            preload="metadata"
            muted
            autoPlay
            tabIndex={0}
            ref={setRef}
          >
            {trimResource.src && (
              <source src={trimResource.src} type={trimResource.mimeType} />
            )}
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
      </Wrapper>
      <PlayPauseButton
        box={boxAtOrigin}
        element={trimElement}
        elementRef={wrapperRef}
        videoRef={videoRef}
        shouldResetOnEnd={false}
      />
    </>
  );
}

VideoTrim.propTypes = {
  previewMode: PropTypes.bool,
  element: StoryPropTypes.elements.video.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default VideoTrim;
