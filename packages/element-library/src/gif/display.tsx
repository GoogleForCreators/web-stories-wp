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
import type { GifElement, DisplayProps } from '@googleforcreators/elements';
import type { RefObject } from 'react';

/**
 * Internal dependencies
 */
import MediaDisplay from '../media/display';
import { getBackgroundStyle, Video, VideoImage } from '../media/util';

function GifDisplay({
  previewMode,
  box: { width, height },
  element,
  renderResourcePlaceholder,
}: DisplayProps<GifElement>) {
  const { id, poster, resource, isBackground, scale, focalX, focalY } = element;
  const ref = useRef<HTMLImageElement | HTMLVideoElement>(null);
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
    <MediaDisplay<GifElement>
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
        <Video
          id={`video-${id}`}
          poster={poster || resource.poster}
          style={style}
          {...videoProps}
          loop
          autoPlay
          muted
          preload="all"
          ref={ref as RefObject<HTMLVideoElement>}
          data-testid="videoElement"
          data-leaf-element="true"
        >
          {resource.output.src && (
            <source src={resource.output.src} type={resource.output.mimeType} />
          )}
        </Video>
      )}
    </MediaDisplay>
  );
}

export default GifDisplay;
