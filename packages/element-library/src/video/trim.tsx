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
import { useRef, useMemo, useCallback } from '@googleforcreators/react';
import {
  getMediaSizePositionProps,
  type Resource,
  type VideoResource,
} from '@googleforcreators/media';
import { CircularProgress } from '@googleforcreators/design-system';
import {
  getTransformFlip,
  type VideoElement,
} from '@googleforcreators/elements';
import type { ElementBox } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import MediaDisplay from '../media/display';
import { elementWithFlip } from '../shared';
import { getBackgroundStyle, Video } from '../media/util';
import type { DisplayProps } from '../types';
import PlayPauseButton from './playPauseButton';
import Captions from './captions';

const StyledVideo = styled(Video)`
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

interface VideoTrimProps {
  element: VideoElement;
  box: ElementBox;
  isRTL: boolean;
  topOffset: number;
  resource?: VideoResource;
  setVideoNode: (node: HTMLVideoElement) => void;
  getProxiedUrl: (
    resource: Pick<Resource, 'needsProxy'>,
    src?: string
  ) => string | null;
  renderResourcePlaceholder?: DisplayProps['renderResourcePlaceholder'];
}

function VideoTrim({
  box,
  element,
  isRTL,
  resource,
  setVideoNode,
  getProxiedUrl,
  renderResourcePlaceholder,
}: VideoTrimProps) {
  const { width, height } = box;
  const {
    poster,
    tracks = [],
    isBackground,
    scale,
    flip,
    focalX,
    focalY,
    volume,
  } = element;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
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
    (node: HTMLVideoElement) => {
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
    flip?.horizontal ? 100 - (focalX || 0) : focalX,
    flip?.vertical ? 100 - (focalY || 0) : focalY
  );
  const muted = Boolean(resource?.isMuted);
  const tracksFormatted = tracks.map((track) => {
    const src = getProxiedUrl(track, track?.track || undefined);
    return {
      ...track,
      track: src,
    };
  });

  return (
    <>
      <Wrapper ref={wrapperRef}>
        <MediaDisplay<VideoElement>
          element={element}
          mediaRef={videoRef}
          showPlaceholder
          previewMode={false}
          renderResourcePlaceholder={renderResourcePlaceholder}
        >
          {}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- False positive. */}
          <StyledVideo
            poster={poster || resource.poster}
            style={style}
            {...videoProps}
            $transformFlip={getTransformFlip(flip)}
            // @ts-expect-error TODO: Is this actually legit?
            volume={!muted && volume ? volume : undefined}
            preload="metadata"
            autoPlay
            tabIndex={0}
            ref={setRef}
          >
            {resource.src && (
              <source src={resource.src} type={resource.mimeType} />
            )}
            <Captions tracks={tracksFormatted} />
          </StyledVideo>
        </MediaDisplay>
      </Wrapper>
      <PlayPauseButton
        box={boxAtOrigin}
        element={element}
        elementRef={wrapperRef}
        videoRef={videoRef}
        shouldResetOnEnd={false}
        isRTL={isRTL}
      />
    </>
  );
}

export default VideoTrim;
