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
import { useRef } from '@googleforcreators/react';
import { getMediaSizePositionProps } from '@googleforcreators/media';
import type { VideoElement, DisplayProps } from '@googleforcreators/elements';
import type { RefObject } from 'react';

/**
 * Internal dependencies
 */
import MediaDisplay from '../media/display';
import { getBackgroundStyle, Video, VideoImage } from '../media/util';
import Captions from './captions';

function VideoDisplay({
  previewMode,
  box: { width, height },
  element,
  getProxiedUrl,
  renderResourcePlaceholder,
}: DisplayProps<VideoElement>) {
  const {
    id,
    poster,
    resource,
    tracks = [],
    isBackground,
    scale,
    focalX,
    focalY,
    loop,
    volume,
  } = element;
  const ref = useRef<HTMLVideoElement | HTMLImageElement>(null);

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

  const muted = Boolean(resource?.isMuted);

  const url = getProxiedUrl(resource, resource?.src);
  const tracksFormatted = tracks.map((track) => {
    const src = getProxiedUrl(track, track?.track || undefined);
    return {
      ...track,
      track: src,
    };
  });

  return (
    <MediaDisplay<VideoElement>
      element={element}
      mediaRef={ref}
      showPlaceholder
      previewMode={previewMode}
      renderResourcePlaceholder={renderResourcePlaceholder}
    >
      {previewMode ? (
        (poster || resource.poster) && (
          <VideoImage
            src={poster || resource.poster}
            alt={element.alt || resource.alt}
            style={style}
            {...videoProps}
            ref={ref as RefObject<HTMLImageElement>}
          />
        )
      ) : (
        // eslint-disable-next-line jsx-a11y/media-has-caption -- False positive.
        <Video
          id={`video-${id}`}
          // Force React to update the video in the DOM, causing it to properly reload if the URL changes.
          // See https://github.com/GoogleForCreators/web-stories-wp/issues/10678
          key={url}
          poster={poster || resource.poster}
          style={style}
          {...videoProps}
          preload="metadata"
          loop={loop}
          muted={muted}
          // @ts-expect-error TODO: Is this actually legit?
          volume={!muted && volume ? volume : undefined}
          ref={ref as RefObject<HTMLVideoElement>}
          data-testid="videoElement"
          data-leaf-element="true"
        >
          {url && <source src={url} type={resource.mimeType} />}
          {/*Hides the track from the user. Displaying happens in MediaCaptionsLayer instead.*/}
          <Captions tracks={tracksFormatted} kind="metadata" />
        </Video>
      )}
    </MediaDisplay>
  );
}

export default VideoDisplay;
